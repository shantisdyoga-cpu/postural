import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { getSessionCookieOptions } from "./_core/cookies";

const COOKIE_NAME = "sdyoga_student_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function secret() {
  return process.env.JWT_SECRET || "development-student-portal-secret";
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function createStudentAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function hashStudentAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function signSession(accessId: number, expiresAt: number) {
  const payload = `${accessId}.${expiresAt}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${encode(payload)}.${signature}`;
}

function verifySignature(encodedPayload: string, signature: string) {
  const expected = createHmac("sha256", secret()).update(decode(encodedPayload)).digest();
  const received = Buffer.from(signature, "base64url");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function setStudentSession(res: Response, req: Request, accessId: number) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  res.cookie(COOKIE_NAME, signSession(accessId, expiresAt), {
    ...getSessionCookieOptions(req),
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS * 1000,
  });
}

export function clearStudentSession(res: Response, req: Request) {
  res.clearCookie(COOKIE_NAME, getSessionCookieOptions(req));
}

export function readStudentSession(req: Request) {
  const raw = req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!raw) return null;
  const [encodedPayload, signature] = raw.split(".");
  if (!encodedPayload || !signature || !verifySignature(encodedPayload, signature)) return null;
  const payload = decode(encodedPayload);
  const [accessIdRaw, expiresAtRaw] = payload.split(".");
  const accessId = Number(accessIdRaw);
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isInteger(accessId) || accessId <= 0 || !Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return null;
  return { accessId, expiresAt };
}

export { COOKIE_NAME };
