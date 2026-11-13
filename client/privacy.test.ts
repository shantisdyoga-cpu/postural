import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const privacySource = readFileSync(resolve(process.cwd(), "client/src/pages/Privacy.tsx"), "utf8");
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("page publique de confidentialité", () => {
  it("est accessible par une route dédiée et depuis le pied de page", () => {
    expect(appSource).toContain("path={\"/confidentialite\"}");
    expect(homeSource).toContain('href="/confidentialite"');
  });

  it("décrit le traitement des réservations et l’usage limité de Google Agenda", () => {
    expect(privacySource).toContain("Politique de confidentialité");
    expect(privacySource).toContain("contact@sdyoga-postural.fr");
    expect(privacySource).not.toContain("shanti.sdyoga@gmail.com");
    expect(privacySource).toContain("agenda Google professionnel associé à Sdyoga");
    expect(privacySource).toContain("uniquement après la confirmation manuelle");
    expect(privacySource).toContain("ne sont pas ajoutés comme invités");
  });

  it("explique l’usage limité de l’e-mail de la liste d’attente", () => {
    expect(privacySource).toContain("liste d’attente des ateliers");
    expect(privacySource).toContain("seule votre adresse e-mail est enregistrée");
    expect(privacySource).toContain("Cette adresse n’est pas affichée publiquement");
  });

});
