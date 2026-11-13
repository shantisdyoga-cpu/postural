import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("galerie des cours Sdyoga", () => {
  it("affiche la nouvelle photo avec un texte alternatif et une description", () => {
    expect(homeSource).toContain("/manus-storage/7577_a5eca8cb.jpg");
    expect(homeSource).toContain("David accompagne un élève dans une posture avec des supports");
    expect(homeSource).toContain("Un accompagnement précis");
  });

  it("utilise la deuxième photo fournie dans sa version floutée", () => {
    expect(homeSource).toContain("/manus-storage/7573-visage-floute_b13092e4.jpg");
    expect(homeSource).toContain("Élèves en pratique dans la salle Sdyoga avec des supports");
    expect(homeSource).toContain("Les accessoires accompagnent les élèves");
  });
});


describe("cadrage de la quatrième photo", () => {
  it("préserve la partie haute pour afficher les deux visages", () => {
    expect(homeSource).toContain("objectPosition: 'center 18%'");
    expect(homeSource).toContain("style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined}");
  });
});


describe("cadrage de la photo de la salle", () => {
  it("privilégie la partie haute pour éviter une zone de sol trop vide", () => {
    expect(homeSource).toContain('className="w-full object-cover object-top aspect-[16/9]"');
  });
});
