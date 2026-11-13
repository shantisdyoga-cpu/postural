import { beforeEach, describe, expect, it, vi } from "vitest";

const smtpMocks = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: smtpMocks.createTransport,
  },
}));

import { buildBookingEmail, sendBookingRequestEmail } from "./email";

describe("booking email", () => {
  beforeEach(() => {
    process.env.GMAIL_APP_PASSWORD = "test-application-password";
    smtpMocks.sendMail.mockResolvedValue({ messageId: "test-message" });
    smtpMocks.createTransport.mockReturnValue({ sendMail: smtpMocks.sendMail });
  });

  it("builds a professional notification with the requested date and reply-to", () => {
    const email = buildBookingEmail({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "first_course",
      preferredSlot: "wednesday",
      preferredDate: new Date("2026-08-19T12:00:00.000Z"),
      preferredTime: null,
      durationMinutes: 60,
      message: "Je souhaite découvrir un cours.",
    });

    expect(email).toMatchObject({
      from: { name: "Sdyoga", address: "contact@sdyoga-postural.fr" },
      to: "contact@sdyoga-postural.fr, shanti.sdyoga@gmail.com",
      replyTo: "camille@example.com",
      subject: "Demande de premier cours d'essai — Camille",
    });
    expect(email.text).toContain("mercredi de 19h à 20h");
    expect(email.text).toContain("mercredi 19 août 2026");
    expect(email.text).toContain("Cette demande reste soumise à la confirmation manuelle de David.");
  });

  it("includes the individual duration and selected time", () => {
    const email = buildBookingEmail({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "individual_course",
      preferredSlot: "saturday",
      preferredDate: new Date("2026-08-29T12:00:00.000Z"),
      preferredTime: "11:00",
      durationMinutes: 90,
      message: null,
    });

    expect(email.subject).toContain("cours individuel");
    expect(email.text).toContain("samedi à 11:00 (1 h 30 — 70 €)");
  });

  it("sends the notification through Gmail SMTP without exposing credentials", async () => {
    const sent = await sendBookingRequestEmail({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "first_course",
      preferredSlot: "friday",
      preferredDate: new Date("2026-08-21T12:00:00.000Z"),
      preferredTime: null,
      durationMinutes: 60,
      message: null,
    });

    expect(sent).toBe(true);
    expect(smtpMocks.createTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: "shanti.sdyoga@gmail.com", pass: "test-application-password" },
    });
    expect(smtpMocks.sendMail).toHaveBeenCalledOnce();
    expect(smtpMocks.sendMail.mock.calls[0]?.[0]).toMatchObject({
      to: "contact@sdyoga-postural.fr, shanti.sdyoga@gmail.com",
      replyTo: "camille@example.com",
    });
  });
});
