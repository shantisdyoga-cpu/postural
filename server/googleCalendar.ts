import crypto from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import { GOOGLE_CALENDAR_ACCOUNT_EMAIL, GOOGLE_CALENDAR_REDIRECT_URI, GOOGLE_CALENDAR_SCOPE, ENV } from "./_core/env";
import * as db from "./db";
import type { BookingRequest } from "../drizzle/schema";
import { sdk } from "./_core/sdk";

const CONNECTION_COOKIE = "sdyoga_google_calendar_oauth_state";
const CONNECTION_COOKIE_MAX_AGE = 10 * 60 * 1000;
const LOCATION = "Espace Maitai, 22 bis René Dumont, 13410 Lambesc";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const GOOGLE_CALENDAR_API_URL = "https://www.googleapis.com/calendar/v3";

type StoredToken = {
  iv: string;
  tag: string;
  value: string;
};

type GoogleEvent = {
  id?: string;
  status?: string;
};

type GoogleCalendar = {
  accessRole?: string;
};

function requireGoogleCredentials() {
  if (!ENV.googleCalendarClientId || !ENV.googleCalendarClientSecret) {
    throw new Error("Google Calendar OAuth n'est pas configuré.");
  }
}

function encryptionKey() {
  if (!ENV.cookieSecret) throw new Error("La clé de chiffrement du serveur n'est pas configurée.");
  return crypto.createHash("sha256").update(ENV.cookieSecret).digest();
}

function encryptRefreshToken(refreshToken: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(Buffer.from(GOOGLE_CALENDAR_ACCOUNT_EMAIL));
  const value = Buffer.concat([cipher.update(refreshToken, "utf8"), cipher.final()]);
  const stored: StoredToken = {
    iv: iv.toString("base64url"),
    tag: cipher.getAuthTag().toString("base64url"),
    value: value.toString("base64url"),
  };
  return JSON.stringify(stored);
}

function decryptRefreshToken(encrypted: string) {
  const stored = JSON.parse(encrypted) as StoredToken;
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(stored.iv, "base64url"));
  decipher.setAAD(Buffer.from(GOOGLE_CALENDAR_ACCOUNT_EMAIL));
  decipher.setAuthTag(Buffer.from(stored.tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(stored.value, "base64url")), decipher.final()]).toString("utf8");
}

async function parseJsonResponse<T>(response: globalThis.Response) {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return { raw: text } as T;
  }
}

async function exchangeAuthorizationCode(code: string) {
  requireGoogleCredentials();
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: ENV.googleCalendarClientId,
      client_secret: ENV.googleCalendarClientSecret,
      redirect_uri: GOOGLE_CALENDAR_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const payload = await parseJsonResponse<{ access_token?: string; refresh_token?: string; error?: string }>(response);
  if (!response.ok || !payload.access_token) {
    throw new Error(`Échange OAuth Google impossible${payload.error ? ` (${payload.error})` : ""}.`);
  }
  return payload;
}

async function refreshAccessToken(refreshToken: string) {
  requireGoogleCredentials();
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: ENV.googleCalendarClientId,
      client_secret: ENV.googleCalendarClientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const payload = await parseJsonResponse<{ access_token?: string; error?: string }>(response);
  if (!response.ok || !payload.access_token) {
    throw new Error(`Renouvellement de l'accès Google impossible${payload.error ? ` (${payload.error})` : ""}.`);
  }
  return payload.access_token;
}

async function googleRequest<T>(accessToken: string, path: string, init: RequestInit = {}) {
  const response = await fetch(`${GOOGLE_CALENDAR_API_URL}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });
  const payload = await parseJsonResponse<T & { error?: { message?: string } }>(response);
  if (!response.ok) {
    const message = payload.error?.message ? ` : ${payload.error.message}` : "";
    throw new Error(`Google Agenda a répondu ${response.status}${message}.`);
  }
  return payload;
}

async function getAuthorizedCalendar() {
  const connection = await db.getGoogleCalendarConnection(GOOGLE_CALENDAR_ACCOUNT_EMAIL);
  if (!connection) throw new Error("Google Agenda n'est pas encore connecté.");
  const accessToken = await refreshAccessToken(decryptRefreshToken(connection.encryptedRefreshToken));
  return { accessToken, calendarId: connection.calendarId };
}

async function requireAdmin(req: Request) {
  const user = await sdk.authenticateRequest(req);
  if (user.role !== "admin") throw new Error("Accès administrateur requis.");
  return user;
}

function getQueryParam(req: Request, key: string) {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerGoogleCalendarRoutes(app: Express) {
  app.get("/api/google-calendar/connect", async (req: Request, res: Response) => {
    try {
      await requireAdmin(req);
      requireGoogleCredentials();
      const state = crypto.randomBytes(32).toString("base64url");
      res.cookie(CONNECTION_COOKIE, state, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: CONNECTION_COOKIE_MAX_AGE,
        path: "/",
      });
      const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authorizationUrl.search = new URLSearchParams({
        client_id: ENV.googleCalendarClientId,
        redirect_uri: GOOGLE_CALENDAR_REDIRECT_URI,
        response_type: "code",
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
        scope: `openid email ${GOOGLE_CALENDAR_SCOPE}`,
        state,
      }).toString();
      res.redirect(302, authorizationUrl.toString());
    } catch (error) {
      console.error("[Google Calendar] Connect route failed:", error);
      res.status(403).json({ error: "Impossible de démarrer la connexion Google Agenda." });
    }
  });

  app.get("/api/google-calendar/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const expectedState = parseCookieHeader(req.headers.cookie ?? "")[CONNECTION_COOKIE];
    res.clearCookie(CONNECTION_COOKIE, { httpOnly: true, secure: true, sameSite: "none", path: "/" });

    if (!code || !state || !expectedState || state !== expectedState) {
      res.status(400).send("Autorisation Google invalide ou expirée.");
      return;
    }

    try {
      const tokens = await exchangeAuthorizationCode(code);
      if (!tokens.refresh_token) throw new Error("Google n'a pas fourni de jeton de renouvellement.");
      const userResponse = await fetch(GOOGLE_USERINFO_URL, { headers: { authorization: `Bearer ${tokens.access_token}` } });
      const userInfo = await parseJsonResponse<{ email?: string; verified_email?: boolean }>(userResponse);
      const authorizedEmail = userInfo.email?.toLowerCase();
      if (!userResponse.ok || authorizedEmail !== GOOGLE_CALENDAR_ACCOUNT_EMAIL || userInfo.verified_email === false) {
        throw new Error(`Le compte Google autorisé doit être ${GOOGLE_CALENDAR_ACCOUNT_EMAIL}.`);
      }

      const accessToken = tokens.access_token;
      if (!accessToken) throw new Error("Google n'a pas fourni de jeton d'accès.");
      const calendar = await googleRequest<GoogleCalendar>(accessToken, "/calendars/primary");
      if (calendar.accessRole && !["owner", "writer"].includes(calendar.accessRole)) {
        throw new Error("Le compte Google n'a pas les droits d'écriture sur son agenda principal.");
      }

      await db.saveGoogleCalendarConnection({
        accountEmail: GOOGLE_CALENDAR_ACCOUNT_EMAIL,
        calendarId: "primary",
        encryptedRefreshToken: encryptRefreshToken(tokens.refresh_token),
      });
      res.redirect(302, "/admin?googleCalendar=connected");
    } catch (error) {
      console.error("[Google Calendar] OAuth callback failed:", error);
      res.redirect(302, "/admin?googleCalendar=error");
    }
  });
}

export async function getGoogleCalendarStatus() {
  const connection = await db.getGoogleCalendarConnection(GOOGLE_CALENDAR_ACCOUNT_EMAIL);
  return {
    connected: Boolean(connection),
    accountEmail: GOOGLE_CALENDAR_ACCOUNT_EMAIL,
    calendarId: connection?.calendarId ?? "primary",
  };
}

function calendarDate(date: Date | string) {
  const value = date instanceof Date ? date : new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(value.getTime())) throw new Error("Date de réservation invalide.");
  return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}-${String(value.getUTCDate()).padStart(2, "0")}`;
}

function parisOffset(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    timeZoneName: "shortOffset",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(probe);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+1";
  const match = offset.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return "+01:00";
  return `${match[1] === "+" ? "+" : "-"}${match[2].padStart(2, "0")}:${match[3] ?? "00"}`;
}

function addMinutesToLocalTime(date: string, time: string, durationMinutes: number) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const end = new Date(Date.UTC(year, month - 1, day, hour, minute + durationMinutes));
  return {
    date: `${end.getUTCFullYear()}-${String(end.getUTCMonth() + 1).padStart(2, "0")}-${String(end.getUTCDate()).padStart(2, "0")}`,
    time: `${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}`,
  };
}

function parisDateTime(date: string, time: string) {
  return `${date}T${time}:00${parisOffset(date, time)}`;
}

function bookingTiming(booking: BookingRequest) {
  if (!booking.preferredDate) return null;
  const date = calendarDate(booking.preferredDate);
  const startTime = booking.requestType === "first_course" ? "19:00" : booking.preferredTime;
  if (!startTime) return null;
  const duration = booking.requestType === "phone_call" ? 20 : booking.requestType === "individual_course" && booking.durationMinutes === 90 ? 90 : 60;
  const end = addMinutesToLocalTime(date, startTime, duration);
  return { startDateTime: parisDateTime(date, startTime), endDateTime: parisDateTime(end.date, end.time) };
}

function eventDescription(booking: BookingRequest, confirmedCount: number) {
  if (booking.requestType === "first_course") {
    return `Cours collectif Sdyoga confirmé manuellement.\nÉlèves confirmés : ${confirmedCount}.\nAucune invitation automatique n'est envoyée.`;
  }
  if (booking.requestType === "phone_call") {
    return `Appel téléphonique Sdyoga confirmé manuellement avec ${booking.name}.\nDurée : 20 minutes.\nAucune invitation automatique n'est envoyée.`;
  }
  return `Cours individuel Sdyoga confirmé manuellement pour ${booking.name}.\nDurée : ${booking.durationMinutes === 90 ? "1 h 30" : "1 h"}.\nAucune invitation automatique n'est envoyée.`;
}

function eventPayload(booking: BookingRequest, confirmedCount: number, propertyName: string, propertyValue: string) {
  const timing = bookingTiming(booking);
  if (!timing) throw new Error("Cette demande ne contient pas de créneau exploitable.");
  const isCollective = booking.requestType === "first_course";
  return {
    summary: isCollective
      ? `Sdyoga — Cours collectif — ${confirmedCount} élève${confirmedCount > 1 ? "s" : ""} confirmé${confirmedCount > 1 ? "s" : ""}`
      : booking.requestType === "phone_call"
        ? `Sdyoga — Appel téléphonique — ${booking.name}`
        : `Sdyoga — Cours individuel — ${booking.name}`,
    description: eventDescription(booking, confirmedCount),
    location: LOCATION,
    start: { dateTime: timing.startDateTime, timeZone: "Europe/Paris" },
    end: { dateTime: timing.endDateTime, timeZone: "Europe/Paris" },
    attendees: [],
    reminders: { useDefault: true },
    extendedProperties: { private: { [propertyName]: propertyValue } },
  };
}

async function findEvent(accessToken: string, calendarId: string, propertyName: string, propertyValue: string) {
  const query = new URLSearchParams({
    privateExtendedProperty: `${propertyName}=${propertyValue}`,
    maxResults: "10",
    showDeleted: "false",
  });
  const response = await googleRequest<{ items?: GoogleEvent[] }>(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events?${query.toString()}`);
  return response.items?.find((event) => event.status !== "cancelled");
}

async function upsertEvent(
  accessToken: string,
  calendarId: string,
  booking: BookingRequest,
  confirmedCount: number,
  propertyName: string,
  propertyValue: string,
  existingEventId?: string | null,
) {
  const payload = eventPayload(booking, confirmedCount, propertyName, propertyValue);
  const eventId = existingEventId ?? (await findEvent(accessToken, calendarId, propertyName, propertyValue))?.id;
  if (eventId) {
    return googleRequest<GoogleEvent>(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  return googleRequest<GoogleEvent>(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=none`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function deleteEventIfPresent(accessToken: string, calendarId: string, propertyName: string, propertyValue: string, eventId?: string | null) {
  const event = eventId ? { id: eventId } : await findEvent(accessToken, calendarId, propertyName, propertyValue);
  if (!event?.id) return;
  try {
    await googleRequest(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(event.id)}`, { method: "DELETE" });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("Google Agenda a répondu 404")) throw error;
  }
}

export async function syncBookingStatusChange(booking: BookingRequest, wasConfirmed: boolean) {
  const { accessToken, calendarId } = await getAuthorizedCalendar();
  const now = new Date();
  if (booking.requestType === "question" || !booking.preferredDate) return booking;

  if (booking.requestType === "first_course") {
    const groupKey = `collective:${calendarDate(booking.preferredDate)}`;
    const confirmed = await db.getBookingsForCollectiveSlot(booking.preferredDate, booking.preferredSlot as "wednesday" | "friday");
    const existingEventId = booking.googleEventId ?? confirmed.find((row) => row.googleEventId)?.googleEventId;

    if (!wasConfirmed && confirmed.length === 0) {
      await deleteEventIfPresent(accessToken, calendarId, "sdyogaGroup", groupKey, existingEventId);
      await db.updateBookingCalendarMetadata(booking.id, { googleEventId: null, googleCalendarSyncedAt: now, googleCalendarSyncError: null });
      return booking;
    }

    const source = confirmed[0] ?? booking;
    const event = await upsertEvent(accessToken, calendarId, source, confirmed.length || 1, "sdyogaGroup", groupKey, existingEventId);
    for (const row of confirmed) {
      await db.updateBookingCalendarMetadata(row.id, { googleEventId: event.id ?? null, googleCalendarSyncedAt: now, googleCalendarSyncError: null });
    }
    if (!confirmed.some((row) => row.id === booking.id)) {
      await db.updateBookingCalendarMetadata(booking.id, { googleEventId: event.id ?? null, googleCalendarSyncedAt: now, googleCalendarSyncError: null });
    }
    return booking;
  }

  const propertyName = "sdyogaBooking";
  const propertyValue = String(booking.id);
  if (!wasConfirmed) {
    await deleteEventIfPresent(accessToken, calendarId, propertyName, propertyValue, booking.googleEventId);
    await db.updateBookingCalendarMetadata(booking.id, { googleEventId: null, googleCalendarSyncedAt: now, googleCalendarSyncError: null });
    return booking;
  }

  const event = await upsertEvent(accessToken, calendarId, booking, 1, propertyName, propertyValue, booking.googleEventId);
  await db.updateBookingCalendarMetadata(booking.id, { googleEventId: event.id ?? null, googleCalendarSyncedAt: now, googleCalendarSyncError: null });
  return booking;
}
