export type PaymentStatusInput = {
  paymentStatus: string;
  amountCents: number;
  receivedCents: number;
};

export function getPaymentStatus({ paymentStatus, amountCents, receivedCents }: PaymentStatusInput) {
  if (paymentStatus === "paid" || receivedCents >= amountCents) {
    return { label: "Soldé", className: "border-emerald-200 bg-emerald-100 text-emerald-800" };
  }
  if (receivedCents > 0) {
    return { label: "Partiellement payé", className: "border-sky-200 bg-sky-100 text-sky-800" };
  }
  return { label: "À régler", className: "border-amber-200 bg-amber-100 text-amber-800" };
}
