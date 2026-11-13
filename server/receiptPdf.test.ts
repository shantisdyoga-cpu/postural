import { describe, expect, it } from "vitest";
import { createPaymentReceiptPdf } from "./receiptPdf";

describe("payment receipt PDF", () => {
  it("generates a readable PDF receipt without internal notes", async () => {
    const pdf = await createPaymentReceiptPdf({
      receiptId: 12,
      studentName: "Camille Martin",
      email: "camille@example.com",
      planType: "annual_solo",
      amountCents: 14000,
      paymentDate: new Date("2026-09-06T12:00:00Z"),
      paymentMethod: "bank_transfer",
    });
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    const content = pdf.toString("latin1");
    expect(content).toContain("Sdyoga");
    expect(content).not.toContain("internalNote");
  });
});
