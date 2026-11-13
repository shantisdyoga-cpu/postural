#!/usr/bin/env node

import mysql from "mysql2/promise";

const databaseUrl = (process.env.PREPROD_DATABASE_URL || "").trim();
const confirmation = process.env.PREPROD_DATABASE_CONFIRM || "";
const requiredConfirmation = "I_UNDERSTAND_READ_ONLY_PREPROD";
if (!databaseUrl) { console.error("ERREUR: PREPROD_DATABASE_URL n'est pas définie."); process.exit(2); }
if (confirmation !== requiredConfirmation) { console.error(`ERREUR: définissez PREPROD_DATABASE_CONFIRM=${requiredConfirmation}.`); process.exit(2); }
const normalizedUrl = databaseUrl.replace(/^mysql\+(pymysql|mysqlconnector):\/\//, "mysql://");
let parsed;
try { parsed = new URL(normalizedUrl); if (parsed.protocol !== "mysql:") throw new Error(); } catch { console.error("ERREUR: PREPROD_DATABASE_URL doit être une URL mysql valide."); process.exit(2); }
const targetLabel = `${parsed.hostname}/${parsed.pathname.replace(/^\//, "")}`;
if (!/(preprod|staging|stage|test|sandbox|dev)/i.test(targetLabel)) { console.error("ERREUR: la cible ne ressemble pas à une base de préproduction."); process.exit(2); }
const checks = [];
function record(name, ok, details) { checks.push({ ok }); console.log(`${ok ? "OK" : "ECHEC"}  ${name}${details ? ` — ${details}` : ""}`); }
function count(rows) { return Number(rows[0]?.count ?? 0); }
let connection;
try {
  connection = await mysql.createConnection({ uri: normalizedUrl, connectTimeout: 10_000, ssl: parsed.searchParams.get("ssl") === "true" ? {} : undefined });
  const [ping] = await connection.query("SELECT 1 AS ok"); record("Connexion MySQL/TiDB", ping[0]?.ok === 1);
  const [tables] = await connection.query("SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ["users", "booking_requests", "workshop_waitlist", "availability_blocks", "financial_transactions", "student_plans", "student_plan_payments", "student_plan_course_adjustments", "student_portal_access", "google_calendar_connections", "sessions"]);
  record("Tables Sdyoga attendues", count(tables) >= 10, `${count(tables)} table(s) détectée(s)`);
  const queries = { demandes: "SELECT COUNT(*) AS count FROM booking_requests", formules: "SELECT COUNT(*) AS count FROM student_plans", paiements: "SELECT COUNT(*) AS count FROM student_plan_payments", finances: "SELECT COUNT(*) AS count FROM financial_transactions", attenteAteliers: "SELECT COUNT(*) AS count FROM workshop_waitlist", blocages: "SELECT COUNT(*) AS count FROM availability_blocks" };
  const totals = {};
  for (const [label, sql] of Object.entries(queries)) { const [rows] = await connection.query(sql); totals[label] = count(rows); }
  record("Lecture des tables administratives", true, Object.entries(totals).map(([key, value]) => `${key}=${value}`).join(", "));
  const [invalidPlans] = await connection.query("SELECT COUNT(*) AS count FROM student_plans WHERE total_courses < 0 OR used_courses < 0 OR (plan_type <> 'annual' AND used_courses > total_courses)"); record("Cohérence des soldes de cours", count(invalidPlans) === 0);
  const [invalidPayments] = await connection.query("SELECT COUNT(*) AS count FROM student_plan_payments WHERE amount_cents <= 0"); record("Cohérence des paiements", count(invalidPayments) === 0);
  const [orphans] = await connection.query("SELECT COUNT(*) AS count FROM student_plan_payments p LEFT JOIN student_plans s ON s.id = p.student_plan_id WHERE s.id IS NULL"); record("Absence de paiements orphelins", count(orphans) === 0);
  const [invalidBookings] = await connection.query("SELECT COUNT(*) AS count FROM booking_requests WHERE attendance_course_deducted NOT IN (0, 1)"); record("Cohérence du suivi des présences", count(invalidBookings) === 0);
} catch (error) { record("Requêtes de préproduction", false, error instanceof Error ? error.message : String(error)); } finally { await connection?.end().catch(() => undefined); }
const failed = checks.filter((check) => !check.ok);
console.log(`\nRésultat: ${checks.length - failed.length}/${checks.length} contrôles réussis.`);
if (failed.length) { console.error("La base de préproduction ne doit pas être utilisée avant correction."); process.exit(1); }
console.log("Base de préproduction accessible et cohérente selon les contrôles en lecture seule.");
