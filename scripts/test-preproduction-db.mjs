#!/usr/bin/env node

/**
 * Read-only preproduction database smoke test.
 * Requires PREPROD_DATABASE_URL and an explicit confirmation string.
 * No INSERT, UPDATE, DELETE, DDL, or transaction writes are executed.
 */
import mysql from "mysql2/promise";

const databaseUrl = (process.env.PREPROD_DATABASE_URL || "").trim();
const confirmation = process.env.PREPROD_DATABASE_CONFIRM || "";
const requiredConfirmation = "I_UNDERSTAND_READ_ONLY_PREPROD";

if (!databaseUrl) {
  console.error("ERREUR: PREPROD_DATABASE_URL n'est pas définie.");
  process.exit(2);
}
if (confirmation !== requiredConfirmation) {
  console.error(`ERREUR: définissez PREPROD_DATABASE_CONFIRM=${requiredConfirmation} pour autoriser le contrôle en lecture seule.`);
  process.exit(2);
}

const normalizedUrl = databaseUrl.replace(/^mysql\+(pymysql|mysqlconnector):\/\//, "mysql://");
let parsed;
try {
  parsed = new URL(normalizedUrl);
  if (parsed.protocol !== "mysql:") throw new Error("protocole");
} catch {
  console.error("ERREUR: PREPROD_DATABASE_URL doit être une URL mysql valide.");
  process.exit(2);
}

const targetLabel = `${parsed.hostname}/${parsed.pathname.replace(/^\//, "")}`;
if (!/(preprod|staging|stage|test|sandbox|dev)/i.test(targetLabel)) {
  console.error("ERREUR: la cible ne ressemble pas à une base de préproduction.");
  console.error("Le nom de l'hôte ou de la base doit contenir preprod, staging, test, sandbox ou dev.");
  process.exit(2);
}

const checks = [];
function record(name, ok, details) {
  checks.push({ name, ok });
  console.log(`${ok ? "OK" : "ECHEC"}  ${name}${details ? ` — ${details}` : ""}`);
}
function asCount(rows) {
  return Number(rows[0]?.count ?? 0);
}

let connection;
try {
  connection = await mysql.createConnection({
    uri: normalizedUrl,
    connectTimeout: 10_000,
    ssl: parsed.searchParams.get("ssl") === "true" ? {} : undefined,
  });

  const [pingRows] = await connection.query("SELECT 1 AS ok");
  record("Connexion MySQL/TiDB", pingRows[0]?.ok === 1);

  const [tables] = await connection.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.tables
     WHERE table_schema = DATABASE()
       AND table_name IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "users",
      "booking_requests",
      "workshop_waitlist",
      "availability_blocks",
      "financial_transactions",
      "student_plans",
      "student_plan_payments",
      "student_plan_course_adjustments",
      "student_portal_access",
      "google_calendar_connections",
      "sessions",
    ]
  );
  const tableCount = asCount(tables);
  record("Tables Sdyoga attendues", tableCount >= 10, `${tableCount} table(s) détectée(s)`);

  const tableQueries = {
    demandes: "SELECT COUNT(*) AS count FROM booking_requests",
    formules: "SELECT COUNT(*) AS count FROM student_plans",
    paiements: "SELECT COUNT(*) AS count FROM student_plan_payments",
    finances: "SELECT COUNT(*) AS count FROM financial_transactions",
    attenteAteliers: "SELECT COUNT(*) AS count FROM workshop_waitlist",
    blocages: "SELECT COUNT(*) AS count FROM availability_blocks",
  };
  const counts = {};
  for (const [label, sql] of Object.entries(tableQueries)) {
    const [rows] = await connection.query(sql);
    counts[label] = asCount(rows);
  }
  record("Lecture des tables administratives", true, Object.entries(counts).map(([key, value]) => `${key}=${value}`).join(", "));

  const [invalidPlans] = await connection.query(
    `SELECT COUNT(*) AS count
     FROM student_plans
     WHERE total_courses < 0 OR used_courses < 0
        OR (plan_type <> 'annual' AND used_courses > total_courses)`
  );
  record("Cohérence des soldes de cours", asCount(invalidPlans) === 0);

  const [invalidPayments] = await connection.query(
    "SELECT COUNT(*) AS count FROM student_plan_payments WHERE amount_cents <= 0"
  );
  record("Cohérence des paiements", asCount(invalidPayments) === 0);

  const [orphanPayments] = await connection.query(
    `SELECT COUNT(*) AS count
     FROM student_plan_payments p
     LEFT JOIN student_plans s ON s.id = p.student_plan_id
     WHERE s.id IS NULL`
  );
  record("Absence de paiements orphelins", asCount(orphanPayments) === 0);

  const [invalidBookings] = await connection.query(
    `SELECT COUNT(*) AS count
     FROM booking_requests
     WHERE attendance_course_deducted NOT IN (0, 1)`
  );
  record("Cohérence du suivi des présences", asCount(invalidBookings) === 0);
} catch (error) {
  record("Requêtes de préproduction", false, error instanceof Error ? error.message : String(error));
} finally {
  await connection?.end().catch(() => undefined);
}

const failed = checks.filter((check) => !check.ok);
console.log(`\nRésultat: ${checks.length - failed.length}/${checks.length} contrôles réussis.`);
if (failed.length > 0) {
  console.error("La base de préproduction ne doit pas être utilisée pour un déploiement final avant correction.");
  process.exit(1);
}
console.log("Base de préproduction accessible et cohérente selon les contrôles en lecture seule.");
