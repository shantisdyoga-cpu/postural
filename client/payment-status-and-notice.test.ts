import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getPaymentStatus } from "./src/lib/paymentStatus";
import { siteNotice } from "./src/lib/siteNotice";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

 describe("statut global des paiements", () => {
  it("indique À régler sans versement", () => {
    expect(getPaymentStatus({ paymentStatus: "pending", amountCents: 28000, receivedCents: 0 }).label).toBe("À régler");
  });

  it("indique Partiellement payé entre zéro et le total", () => {
    expect(getPaymentStatus({ paymentStatus: "pending", amountCents: 28000, receivedCents: 14000 }).label).toBe("Partiellement payé");
  });

  it("indique Soldé quand le total est atteint ou marqué réglé", () => {
    expect(getPaymentStatus({ paymentStatus: "pending", amountCents: 28000, receivedCents: 28000 }).label).toBe("Soldé");
    expect(getPaymentStatus({ paymentStatus: "paid", amountCents: 28000, receivedCents: 0 }).label).toBe("Soldé");
  });
});

describe("notification personnalisée publique", () => {
  it("conserve le texte Sdyoga et propose une fermeture accessible", () => {
    expect(siteNotice.title).toBe("Bienvenue chez Sdyoga.");
    expect(siteNotice.message).toContain("le travail s’adapte à vous");
    expect(homeSource).toContain("aria-label=\"Information Sdyoga\"");
    expect(homeSource).toContain("aria-label=\"Fermer la notification\"");
  });
});
