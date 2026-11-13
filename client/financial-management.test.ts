import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const financialSource = readFileSync(resolve(process.cwd(), "client/src/pages/FinancialManagement.tsx"), "utf8");
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const layoutSource = readFileSync(resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"), "utf8");

describe("outil financier privé", () => {
  it("présente une saisie complète et une synthèse des recettes, dépenses et solde", () => {
    expect(financialSource).toContain("Recettes et dépenses");
    expect(financialSource).toContain("Ajouter une opération");
    expect(financialSource).toContain("transactionDate");
    expect(financialSource).toContain("amountCents");
    expect(financialSource).toContain("Catégorie");
    expect(financialSource).toContain("Moyen de paiement");
    expect(financialSource).toContain("Solde");
    expect(financialSource).toContain("Cet outil sert au suivi interne de Sdyoga");
  });

  it("propose la consultation, la modification, la suppression et les filtres", () => {
    expect(financialSource).toContain("listFinancialTransactions");
    expect(financialSource).toContain("updateFinancialTransaction");
    expect(financialSource).toContain("deleteFinancialTransaction");
    expect(financialSource).toContain("Modifier");
    expect(financialSource).toContain("Supprimer définitivement");
    expect(financialSource).toContain("periodFilter");
    expect(financialSource).toContain("typeFilter");
    expect(financialSource).toContain("categoryFilter");
  });

  it("permet un export CSV de la vue courante", () => {
    expect(financialSource).toContain("function buildTransactionsCsv");
    expect(financialSource).toContain("\\uFEFF");
    expect(financialSource).toContain("Exporter la vue (CSV)");
    expect(financialSource).toContain("sdyoga-finances-");
    expect(financialSource).toContain("Moyen de paiement");
  });

  it("enregistre la page financière dans le parcours admin", () => {
    expect(appSource).toContain("/admin/finances");
    expect(appSource).toContain("FinancialManagement");
    expect(layoutSource).toContain('label: "Finances"');
    expect(layoutSource).toContain('path: "/admin/finances"');
  });
});

