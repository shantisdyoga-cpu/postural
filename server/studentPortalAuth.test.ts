import { describe, expect, it, vi } from "vitest";
import { createStudentAccessToken, hashStudentAccessToken, readStudentSession, setStudentSession } from "./studentPortalAuth";

describe("student portal session", () => {
  it("stores only a signed HTTP-only session cookie and can read it back", () => {
    const req = { protocol: "https", headers: {} } as never;
    const cookie = vi.fn();
    const res = { cookie } as never;
    setStudentSession(res, req, 42);
    const [, value, options] = cookie.mock.calls[0];
    expect(value).toBeTruthy();
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    (req as { headers: { cookie?: string } }).headers.cookie = `sdyoga_student_session=${value}`;
    expect(readStudentSession(req)).toMatchObject({ accessId: 42 });
  });

  it("rejects a modified session cookie", () => {
    const req = { protocol: "https", headers: { cookie: "sdyoga_student_session=ZmFrZS5wYXlsb2Fk.invalid" } } as never;
    expect(readStudentSession(req)).toBeNull();
  });

  it("creates non-empty access tokens with one-way hashes", () => {
    const token = createStudentAccessToken();
    expect(token.length).toBeGreaterThan(32);
    expect(hashStudentAccessToken(token)).toHaveLength(64);
    expect(hashStudentAccessToken(token)).not.toBe(token);
  });
});
