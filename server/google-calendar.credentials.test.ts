import { describe, expect, it } from "vitest";

const redirectUri = "https://sdyoga-qk2yqlem.manus.space/api/google-calendar/oauth/callback";

describe("Google Calendar OAuth credentials", () => {
  it("is configured with a client accepted by Google's token endpoint", async () => {
    const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim();

    expect(clientId, "GOOGLE_CALENDAR_CLIENT_ID doit être configuré").toBeTruthy();
    expect(clientSecret, "GOOGLE_CALENDAR_CLIENT_SECRET doit être configuré").toBeTruthy();

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code: "sdyoga-credentials-validation-only",
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    expect(response.status).toBe(400);
    expect(payload.error).not.toBe("invalid_client");
  }, 15_000);
});
