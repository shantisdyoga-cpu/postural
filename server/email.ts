import nodemailer from "nodemailer";

const RECIPIENT = "contact@sdyoga-postural.fr";
const SMTP_USER = "shanti.sdyoga@gmail.com";
const DIRECT_RECIPIENTS = `${RECIPIENT}, ${SMTP_USER}`;
const SENDER = "contact@sdyoga-postural.fr";

type BookingEmailData = {
  name: string;
  email: string;
  phone: string;
  requestType: "first_course" | "individual_course" | "phone_call" | "question";
  preferredSlot: "wednesday" | "friday" | "either" | "tuesday" | "thursday" | "saturday";
  preferredDate: Date | null;
  preferredTime: string | null;
  durationMinutes: number;
  message: string | null;
};

const slotLabels = {
  wednesday: "mercredi de 19h à 20h",
  friday: "vendredi de 19h à 20h",
  either: "mercredi ou vendredi de 19h à 20h",
  tuesday: "mardi",
  thursday: "jeudi",
  saturday: "samedi",
} as const;

const requestTypeLabels = {
  first_course: "Demande de premier cours d'essai",
  individual_course: "Demande de cours individuel",
  phone_call: "Demande d’appel téléphonique de 20 minutes",
  question: "Question générale",
} as const;

function formatDate(date: Date | null) {
  if (!date) return "Non précisée";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeZone: "Europe/Paris",
  }).format(date);
}

export function buildBookingEmail(data: BookingEmailData) {
  const requestedDate = formatDate(data.preferredDate);
  const requestedSlot = data.requestType === "individual_course" || data.requestType === "phone_call"
    ? `${slotLabels[data.preferredSlot]} à ${data.preferredTime ?? "heure à préciser"}${data.requestType === "individual_course" ? ` (${data.durationMinutes === 90 ? "1 h 30 — 70 €" : "1 h — 50 €"})` : " (20 minutes)"}`
    : slotLabels[data.preferredSlot];
  const courseLabel = data.requestType === "individual_course" ? "cours individuel" : data.requestType === "phone_call" ? "appel téléphonique" : "cours d'essai";

  return {
    from: { name: "Sdyoga", address: SENDER },
    to: DIRECT_RECIPIENTS,
    replyTo: data.email,
    subject: `${requestTypeLabels[data.requestType]} — ${data.name}`,
    text: [
      "Nouvelle demande reçue depuis le site Sdyoga",
      "",
      `Type : ${requestTypeLabels[data.requestType]}`,
      `Nom : ${data.name}`,
      `E-mail : ${data.email}`,
      `Téléphone : ${data.phone}`,
      `Date souhaitée pour le ${courseLabel} : ${requestedDate}`,
      `Créneau : ${requestedSlot}`,
      "",
      data.message ? `Message :\n${data.message}` : "Aucun message complémentaire.",
      "",
      "Cette demande reste soumise à la confirmation manuelle de David.",
    ].join("\n"),
  };
}

export async function sendBookingRequestEmail(data: BookingEmailData) {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!password) {
    console.warn("[Email] GMAIL_APP_PASSWORD is not configured; email notification skipped.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: SMTP_USER,
      pass: password,
    },
  });

  await transporter.sendMail(buildBookingEmail(data));
  return true;
}
