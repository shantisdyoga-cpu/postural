import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createCalendarEvent, getNextClassDate } from "./src/lib/calendar";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const stylesSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("booking confirmation feedback", () => {
  it("provides an accessible success region with a visible confirmation panel", () => {
    expect(homeSource).toContain("booking-confirmation");
    expect(homeSource).toContain('role="status"');
    expect(homeSource).toContain('aria-live="polite"');
    expect(homeSource).toContain("tabIndex={-1}");
    expect(homeSource).toContain("Votre demande a bien été envoyée");
    expect(homeSource).toContain('id="booking-date"');
    expect(homeSource).toContain("Seuls les mercredis et vendredis sont disponibles");
    expect(homeSource).toContain('disabled={(date) => !isCollectiveClassDate(date)}');
    expect(homeSource).toContain("19h00 à 20h00");
    expect(homeSource).toContain('value="individual_course"');
    expect(homeSource).toContain("1 h 30 — 70 €");
    expect(homeSource).toContain('id="individual-date"');
    expect(homeSource).toContain('id="individual-time"');
    expect(homeSource).toContain("mardi et le jeudi de 17h30 à 19h00");
    expect(homeSource).toContain("samedi de 9h30 à 19h00");
    expect(homeSource).toContain("Carte 5 cours");
    expect(homeSource).toContain("valable 2 mois");
  });

  it("limits non-essential confirmation motion to users who allow motion", () => {
    expect(stylesSource).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(stylesSource).toContain(".booking-confirmation");
    expect(stylesSource).toContain("sdyoga-confirmation-enter");
  });

  it("creates a tentative iCalendar event for an individual course duration and time", () => {
    const event = createCalendarEvent("saturday", "2026-08-29", new Date("2026-08-20T12:00:00.000Z"), "11:00", 90);

    expect(event).toContain("DTSTART;TZID=Europe/Paris:20260829T110000");
    expect(event).toContain("DTEND;TZID=Europe/Paris:20260829T123000");
    expect(event).toContain("Durée : 1 h 30.");
  });

  it("creates a tentative iCalendar event for the selected class date", () => {
    const event = createCalendarEvent("wednesday", "2026-08-26", new Date("2026-08-20T12:00:00.000Z"));

    expect(event).toContain("DTSTART;TZID=Europe/Paris:20260826T190000");
    expect(event).toContain("DTEND;TZID=Europe/Paris:20260826T200000");
    expect(event).toContain("STATUS:TENTATIVE");
  });

  it("keeps the legacy next-slot calendar behavior when no exact date is supplied", () => {
    const referenceDate = new Date(2026, 7, 16, 12, 0, 0);
    const event = createCalendarEvent("wednesday", referenceDate);
    const nextWednesday = getNextClassDate("wednesday", referenceDate);

    expect(nextWednesday.getDay()).toBe(3);
    expect(nextWednesday.getHours()).toBe(19);
    expect(event).toContain("DTSTART;TZID=Europe/Paris:20260819T190000");
    expect(event).toContain("DTEND;TZID=Europe/Paris:20260819T200000");
    expect(event).toContain("STATUS:TENTATIVE");
    expect(event).toContain("Sdyoga — créneau souhaité (à confirmer)");
    expect(event).toContain("Espace Maitai\\, 22 bis René Dumont\\, 13410 Lambesc");
  });
});


describe("coordonnées publiques du calendrier", () => {
  it("n’embarque pas l’adresse Gmail interne dans le fichier téléchargé", () => {
    const event = createCalendarEvent("wednesday", "2026-08-26", new Date("2026-08-20T12:00:00.000Z"));
    expect(event).toContain("contact@sdyoga-postural.fr");
    expect(event).not.toContain("shanti.sdyoga@gmail.com");
  });
});


describe("ateliers de yoga", () => {
  it("présente des ateliers de 2 heures avec supports sans les confondre avec des stages", () => {
    expect(homeSource).toContain("Ateliers de yoga · 2 h");
    expect(homeSource).toContain("Des temps de pratique avec supports");
    expect(homeSource).toContain("approfondir la compréhension du corps");
    expect(homeSource).not.toContain("Ateliers et stages");
  });
});


describe("date du premier atelier", () => {
  it("affiche le premier atelier prévu et laisse les tarifs à préciser", () => {
    expect(homeSource).toContain("Premier atelier prévu : samedi 6 mars 2027 · 10 h – 12 h");
    expect(homeSource).toContain("Tarifs à venir prochainement");
  });
});


describe("liste d’attente des ateliers", () => {
  it("propose une inscription e-mail avec confirmation et information de confidentialité", () => {
    expect(homeSource).toContain("workshopWaitlist.join.useMutation");
    expect(homeSource).toContain('id="workshop-waitlist-email"');
    expect(homeSource).toContain("Être informé(e) des prochains ateliers");
    expect(homeSource).toContain("Votre adresse sera utilisée uniquement pour vous informer des futurs ateliers.");
    expect(homeSource).toContain("M’inscrire");
    expect(homeSource).toContain('role="status" aria-live="polite"');
  });
});


describe("thèmes potentiels des ateliers", () => {
  it("suscite l’intérêt sans présenter un programme définitif", () => {
    expect(homeSource).toContain("Découvrir les détails de l’atelier");
    expect(homeSource).toContain("Survolez ou cliquez pour ouvrir");
    expect(homeSource).toContain("group-hover:max-h-96");
    expect(homeSource).toContain("Quelques thèmes possibles");
    expect(homeSource).toContain("Comprendre et affiner ses appuis");
    expect(homeSource).toContain("Mobilité du bassin et de la colonne");
    expect(homeSource).toContain("Respirer pour mieux habiter son corps");
    expect(homeSource).toContain("Ces thèmes sont indicatifs");
  });
});
