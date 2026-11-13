#!/usr/bin/env node

/**
 * Non-destructive smoke tests for the Sdyoga Express API on Vercel.
 *
 * Usage:
 *   VERCEL_BASE_URL=https://preview.example.vercel.app pnpm test:vercel-api
 *   VERCEL_BASE_URL=http://127.0.0.1:3000 pnpm test:vercel-api
 *
 * The script only performs GET requests. It never creates bookings, sends
 * messages, changes attendance, touches Google Calendar, or writes to the DB.
 */

const baseUrl = (process.env.VERCEL_BASE_URL || "").trim().replace(/\/+$/, "");
const timeoutMs = Number(process.env.VERCEL_TEST_TIMEOUT_MS || 15_000);
const adminCookie = (process.env.VERCEL_ADMIN_COOKIE || "").trim();

if (!baseUrl) {
  console.error("ERREUR: définissez VERCEL_BASE_URL avant de lancer le test.");
  console.error("Exemple: VERCEL_BASE_URL=https://preview.example.vercel.app pnpm test:vercel-api");
  process.exit(2);
}

let parsedBaseUrl;
try {
  parsedBaseUrl = new URL(baseUrl);
  if (!/^https?:$/.test(parsedBaseUrl.protocol)) throw new Error("protocole");
} catch {
  console.error(`ERREUR: VERCEL_BASE_URL n'est pas une URL HTTP(S): ${baseUrl}`);
  process.exit(2);
}

const checks = [];

function record(name, ok, details) {
  checks.push({ name, ok, details });
  console.log(`${ok ? "OK" : "ECHEC"}  ${name}${details ? ` — ${details}` : ""}`);
}

async function request(path, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      redirect: "manual",
      ...init,
      signal: controller.signal,
      headers: {
        accept: "application/json, text/html;q=0.9, */*;q=0.8",
        ...(adminCookie ? { cookie: adminCookie } : {}),
        ...(init.headers || {}),
      },
    });
    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // Non-JSON responses are valid for the homepage and callback guard.
    }
    return { response, text, json };
  } finally {
    clearTimeout(timer);
  }
}

function trpcQuery(path, input) {
  const encoded = encodeURIComponent(JSON.stringify({ json: input }));
  return `/api/trpc/${path}?input=${encoded}`;
}

async function checkHomepage() {
  try {
    const { response, text } = await request("/");
    const contentType = response.headers.get("content-type") || "";
    const ok = response.status === 200 && contentType.includes("text/html") && text.includes("Sdyoga");
    record("Accueil frontend", ok, `HTTP ${response.status}, ${contentType || "type inconnu"}`);
  } catch (error) {
    record("Accueil frontend", false, error instanceof Error ? error.message : String(error));
  }
}

async function checkHealth() {
  try {
    const { response, json } = await request(trpcQuery("system.health", { timestamp: Date.now() }));
    const ok = response.status === 200 && json?.result?.data?.json?.ok === true;
    record("tRPC system.health", ok, `HTTP ${response.status}`);
  } catch (error) {
    record("tRPC system.health", false, error instanceof Error ? error.message : String(error));
  }
}

async function checkUnauthenticatedAuth() {
  try {
    const { response, json } = await request("/api/trpc/auth.me");
    const ok = response.status === 200 && Object.prototype.hasOwnProperty.call(json?.result?.data || {}, "json");
    record("tRPC auth.me sans session", ok, `HTTP ${response.status}`);
  } catch (error) {
    record("tRPC auth.me sans session", false, error instanceof Error ? error.message : String(error));
  }
}

async function checkReadOnlyAvailability(path, label) {
  try {
    const { response, json } = await request(`/api/trpc/${path}`);
    const value = json?.result?.data?.json;
    const ok = response.status === 200 && Array.isArray(value);
    record(label, ok, `HTTP ${response.status}${Array.isArray(value) ? `, ${value.length} élément(s)` : ""}`);
  } catch (error) {
    record(label, false, error instanceof Error ? error.message : String(error));
  }
}

async function checkOAuthGuard() {
  try {
    const { response } = await request("/api/google-calendar/oauth/callback");
    const ok = response.status === 400;
    record("Protection callback Google Agenda", ok, `HTTP ${response.status} attendu: 400`);
  } catch (error) {
    record("Protection callback Google Agenda", false, error instanceof Error ? error.message : String(error));
  }
}

async function checkAdminReadOnly(path, label) {
  if (!adminCookie) {
    console.log(`SKIP  ${label} — définissez VERCEL_ADMIN_COOKIE pour l'activer`);
    return;
  }

  try {
    const { response, json } = await request(`/api/trpc/${path}`);
    const value = json?.result?.data?.json;
    const ok = response.status === 200 && Array.isArray(value);
    record(label, ok, `HTTP ${response.status}${Array.isArray(value) ? `, ${value.length} élément(s)` : ""}`);
  } catch (error) {
    record(label, false, error instanceof Error ? error.message : String(error));
  }
}

await checkHomepage();
await checkHealth();
await checkUnauthenticatedAuth();
await checkReadOnlyAvailability("booking.phoneCallBlockedSlots", "tRPC créneaux d'appels en lecture seule");
await checkReadOnlyAvailability("booking.individualBlockedSlots", "tRPC créneaux individuels en lecture seule");
await checkOAuthGuard();
await checkAdminReadOnly("admin.listBookings", "Admin demandes en lecture seule");
await checkAdminReadOnly("admin.listStudentPlans", "Admin formules en lecture seule");
await checkAdminReadOnly("admin.listStudentPlanPayments", "Admin paiements en lecture seule");
await checkAdminReadOnly("admin.listFinancialTransactions", "Admin finances en lecture seule");
await checkAdminReadOnly("admin.listWorkshopWaitlist", "Admin liste d'attente en lecture seule");

const failed = checks.filter((check) => !check.ok);
console.log(`\nRésultat: ${checks.length - failed.length}/${checks.length} contrôles réussis.`);
if (failed.length > 0) {
  console.error("Des contrôles ont échoué. Ne pas passer en production avant analyse.");
  process.exit(1);
}
console.log("Tous les contrôles non destructifs sont réussis.");
