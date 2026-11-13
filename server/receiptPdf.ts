import PDFDocument from "pdfkit";

const planLabels: Record<string, string> = {
  single: "Cours à l’unité",
  five: "Carte 5 cours",
  ten: "Carnet 10 cours",
  annual: "Abonnement annuel",
  annual_solo: "Annuel Solo",
  annual_duo: "Annuel Duo / Couple",
  monthly_solo: "Mensuel Solo",
  monthly_duo: "Mensuel Duo / Couple",
  ten_solo: "Carnet 10 cours Solo",
  ten_duo: "Carnet 10 cours Duo",
  twenty_duo: "Carnet 20 cours Duo",
};
const paymentMethodLabels: Record<string, string> = {
  cash: "Espèces",
  bank_transfer: "Virement bancaire",
  card: "Carte bancaire",
  cheque: "Chèque",
  direct_debit: "Prélèvement",
  other: "Autre",
};

function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amountCents / 100);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(value);
}

export function createPaymentReceiptPdf(input: { receiptId: number; studentName: string; email: string; planType: string; amountCents: number; paymentDate: Date; paymentMethod: string }) {
  return new Promise<Buffer>((resolve, reject) => {
    const document = new PDFDocument({ size: "A4", margin: 64, info: { Title: `Reçu de paiement Sdyoga n°${input.receiptId}`, Author: "Sdyoga" } });
    const chunks: Buffer[] = [];
    document.on("data", (chunk: Buffer) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document.fillColor("#2f7d32").fontSize(24).font("Helvetica-Bold").text("Sdyoga");
    document.fillColor("#243424").fontSize(11).font("Helvetica").text("Yoga postural, structuré et bienveillant");
    document.moveDown(2);
    document.fillColor("#243424").fontSize(21).font("Helvetica-Bold").text("Reçu de paiement");
    document.fillColor("#647064").fontSize(10).font("Helvetica").text(`N° ${input.receiptId} · Émis le ${formatDate(new Date())}`);
    document.moveDown(2);
    document.strokeColor("#d7e2d5").moveTo(64, document.y).lineTo(531, document.y).stroke();
    document.moveDown(1.5);

    document.fillColor("#243424").fontSize(11).font("Helvetica-Bold").text("Élève");
    document.font("Helvetica").fontSize(12).text(input.studentName);
    document.fontSize(10).fillColor("#647064").text(input.email);
    document.moveDown(1.5);

    document.fillColor("#243424").fontSize(11).font("Helvetica-Bold").text("Détail du règlement");
    document.font("Helvetica").fontSize(11).fillColor("#243424").text(`Formule : ${planLabels[input.planType] ?? "Formule Sdyoga"}`);
    document.text(`Date du versement : ${formatDate(input.paymentDate)}`);
    document.text(`Mode de règlement : ${paymentMethodLabels[input.paymentMethod] ?? "Autre"}`);
    document.moveDown(1.5);
    document.fillColor("#eff7ee").roundedRect(64, document.y, 467, 58, 8).fill();
    document.fillColor("#243424").font("Helvetica-Bold").fontSize(11).text("Montant reçu", 84, document.y + 15);
    document.fillColor("#2f7d32").fontSize(20).text(formatCurrency(input.amountCents), 360, document.y - 3, { width: 145, align: "right" });
    document.moveDown(5);
    document.fillColor("#647064").font("Helvetica").fontSize(10).text("Ce document confirme l’enregistrement du versement indiqué ci-dessus. Pour toute question, contactez David Sarre via le site Sdyoga.");
    document.moveDown(2);
    document.fillColor("#243424").fontSize(10).text("Sdyoga · Lambesc");
    document.text("https://sdyoga-postural.fr");
    document.end();
  });
}

export { planLabels };
