import { COOKIE_NAME } from "../shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adjustStudentPlanCourses, createAvailabilityBlock, createBookingRequest, createFinancialTransaction, createStudentPlan, createStudentPlanPayment, createStudentPortalAccess, deleteAvailabilityBlock, deleteBookingRequest, deleteFinancialTransaction, deleteStudentPlan, deleteStudentPlanPayment, findDuplicateCollectiveBooking, findWorkshopWaitlistByEmail, createWorkshopWaitlistEntry, listWorkshopWaitlist, getBookingRequest, getStudentPlanById, getStudentPortalAccessById, getStudentPortalAccessByTokenHash, isAvailabilityBlocked, listAvailabilityBlocks, listBookingRequests, listConfirmedCollectiveBookingsBetween, listFinancialTransactions, listStudentPlanCourseAdjustments, listStudentPlanPayments, listStudentPlans, revokeStudentPortalAccess, touchStudentPortalAccess, recordBookingAttendancePresent, restoreBookingAttendanceDeduction, updateBookingAttendanceStatus, updateBookingCalendarMetadata, updateBookingContactDetails, updateBookingInternalNote, updateBookingRequestStatus, updateFinancialTransaction, updateStudentPlan } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { clearStudentSession, createStudentAccessToken, hashStudentAccessToken, readStudentSession, setStudentSession } from "./studentPortalAuth";
import { notifyOwner } from "./_core/notification";
import { sendBookingRequestEmail } from "./email";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { getGoogleCalendarStatus, syncBookingStatusChange } from "./googleCalendar";
import { createPaymentReceiptPdf } from "./receiptPdf";

const contactInput = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(120),
  email: z.string().trim().email("Email invalide").max(320),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
});

const bookingInput = z
  .object({
    name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(120),
    email: z.string().trim().email("Email invalide").max(320),
    phone: z.string().trim().regex(/^[0-9+().\s-]{7,30}$/, "Numéro de téléphone invalide"),
    requestType: z.enum(["first_course", "individual_course", "phone_call", "question"]),
    preferredSlot: z.enum(["wednesday", "friday", "either", "tuesday", "thursday", "saturday"]),
    preferredDate: z.preprocess((value) => value === "" ? undefined : value, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide").optional()),
    preferredTime: z.preprocess((value) => value === "" ? undefined : value, z.string().regex(/^\d{2}:\d{2}$/, "Heure invalide").optional()),
    durationMinutes: z.union([z.literal(20), z.literal(60), z.literal(90)]).default(60),
    message: z.string().trim().max(1000, "Le message est trop long").optional(),
  })
  .superRefine((input, context) => {
    if (input.requestType === "question") return;
    if (input.requestType === "phone_call") {
      if (!input.preferredDate || !input.preferredTime) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Choisissez une date et une heure pour votre appel." });
        return;
      }
      const parsedCallDate = new Date(`${input.preferredDate}T12:00:00Z`);
      const isRealCallDate = !Number.isNaN(parsedCallDate.getTime()) && parsedCallDate.toISOString().slice(0, 10) === input.preferredDate;
      const weekday = parsedCallDate.getUTCDay();
      if (!isRealCallDate || ![2, 4, 6].includes(weekday)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Les appels sont proposés le mardi, le jeudi ou le samedi." });
      }
      if (!["18:30", "19:00", "19:30"].includes(input.preferredTime)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredTime"], message: "Choisissez un créneau d’appel disponible." });
      }
      return;
    }
    if (input.requestType === "individual_course") {
      if (input.durationMinutes === 20) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["durationMinutes"], message: "Un cours individuel dure 1 h ou 1 h 30." });
        return;
      }
      if (!input.preferredDate || !input.preferredTime) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Choisissez une date et une heure pour votre cours individuel." });
        return;
      }
      const parsedIndividualDate = new Date(`${input.preferredDate}T12:00:00Z`);
      const isRealIndividualDate = !Number.isNaN(parsedIndividualDate.getTime()) && parsedIndividualDate.toISOString().slice(0, 10) === input.preferredDate;
      if (!isRealIndividualDate) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Choisissez une date valide." });
        return;
      }
      const weekday = parsedIndividualDate.getUTCDay();
      const expectedSlot = weekday === 2 ? "tuesday" : weekday === 4 ? "thursday" : weekday === 6 ? "saturday" : null;
      const saturdayTimes = input.durationMinutes === 90 ? ["09:30", "11:00", "12:30", "14:00", "15:30", "17:00"] : ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:00"];
      const allowedTimes = expectedSlot === "saturday" ? saturdayTimes : expectedSlot ? ["17:30"] : [];
      if (!expectedSlot || input.preferredSlot !== expectedSlot || !allowedTimes.includes(input.preferredTime)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredTime"], message: "Choisissez un créneau individuel disponible." });
      }
      return;
    }
    if (!input.preferredDate) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Choisissez une date pour votre cours d'essai." });
      return;
    }

    const parsed = new Date(`${input.preferredDate}T12:00:00Z`);
    const isRealDate = !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === input.preferredDate;
    if (!isRealDate) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Choisissez une date valide." });
      return;
    }

    const weekday = parsed.getUTCDay();
    if (!["wednesday", "friday", "either"].includes(input.preferredSlot)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredSlot"], message: "Le créneau choisi ne correspond pas à un cours d'essai." });
    }
    if (weekday !== 3 && weekday !== 5) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Les cours d'essai sont proposés le mercredi ou le vendredi." });
    }
    if ((input.preferredSlot === "wednesday" && weekday !== 3) || (input.preferredSlot === "friday" && weekday !== 5)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "La date ne correspond pas au créneau choisi." });
    }
  });

function formatRequestedDate(date: Date | string | null | undefined) {
  if (!date) return null;
  const parsed = date instanceof Date ? date : new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeZone: "Europe/Paris" }).format(parsed);
}

const slotLabels = {
  wednesday: "mercredi de 19h à 20h",
  friday: "vendredi de 19h à 20h",
  either: "mercredi ou vendredi de 19h à 20h",
  tuesday: "mardi",
  thursday: "jeudi",
  saturday: "samedi",
} as const;

const COLLECTIVE_CLASS_CAPACITY = 10;

function getUpcomingCollectiveSlots(count = 8) {
  const slots: Array<{ date: string; slot: "wednesday" | "friday" }> = [];
  const cursor = new Date();
  cursor.setUTCHours(12, 0, 0, 0);
  for (let offset = 0; slots.length < count && offset < 60; offset += 1) {
    const date = new Date(cursor);
    date.setUTCDate(cursor.getUTCDate() + offset);
    const weekday = date.getUTCDay();
    if (weekday === 3 || weekday === 5) {
      slots.push({ date: date.toISOString().slice(0, 10), slot: weekday === 3 ? "wednesday" : "friday" });
    }
  }
  return slots;
}

const requestTypeLabels = {
  first_course: "demande de premier cours d'essai",
  individual_course: "demande de cours individuel",
  phone_call: "demande d’appel téléphonique de 20 minutes",
  question: "question générale",
} as const;

const adminStatusInput = z.object({
  id: z.number().int().positive(),
  status: z.enum(["pending", "confirmed", "declined"]),
});

const manualBookingInput = bookingInput.omit({ email: true }).extend({
  email: z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().trim().email("Email invalide").max(320).optional()),
  status: z.enum(["pending", "confirmed", "declined"]).default("pending"),
});

const updateBookingContactInput = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(120),
  email: z.string().trim().email("Email invalide").max(320).optional(),
  phone: z.string().trim().regex(/^[0-9+().\s-]{7,30}$/, "Numéro de téléphone invalide"),
});

const updateBookingInternalNoteInput = z.object({
  id: z.number().int().positive(),
  internalNote: z.string().trim().max(2000, "La note interne est trop longue").optional(),
});

const studentPlanInput = z.object({
  studentName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(120),
  secondaryStudentName: z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().trim().min(2).max(120).optional()),
  payerName: z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().trim().min(2).max(120).optional()),
  email: z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().trim().email("Email invalide").max(320).optional()),
  phone: z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, z.string().trim().regex(/^[0-9+().\s-]{7,30}$/, "Numéro de téléphone invalide").optional()),
  planType: z.enum(["single", "five", "ten", "annual", "annual_solo", "annual_duo", "monthly_solo", "monthly_duo", "ten_solo", "ten_duo", "twenty_duo"]),
  amountCents: z.number().int().positive("Le montant doit être supérieur à 0").max(100_000_000),
  paymentStatus: z.enum(["pending", "paid"]),
  paymentPlan: z.enum(["one", "two", "three"]),
  paymentMethod: z.enum(["cash", "bank_transfer", "card", "cheque", "direct_debit", "other"]),
  paidDate: z.preprocess((value) => value === "" ? undefined : value, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide").optional()),
  expiresDate: z.preprocess((value) => value === "" ? undefined : value, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide").optional()),
  totalCourses: z.number().int().min(0).max(10000),
  usedCourses: z.number().int().min(0).max(10000),
  internalNote: z.string().trim().max(2000).optional(),
}).superRefine((input, context) => {
  if (input.usedCourses > input.totalCourses && input.planType !== "annual") {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["usedCourses"], message: "Les cours utilisés ne peuvent pas dépasser le total." });
  }
});
const studentPlanPaymentInput = z.object({
  studentPlanId: z.number().int().positive(),
  amountCents: z.number().int().positive("Le montant doit être supérieur à 0").max(100_000_000),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  paymentMethod: z.enum(["cash", "bank_transfer", "card", "cheque", "direct_debit", "other"]),
  note: z.string().trim().max(500, "La note est trop longue").optional(),
});
const studentPortalInviteInput = z.object({
  studentPlanId: z.number().int().positive(),
  email: z.string().trim().email("Email invalide").max(320).optional(),
});
const studentPortalTokenInput = z.object({
  token: z.string().trim().min(32).max(200),
});
const financialTransactionInput = z.object({
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  type: z.enum(["income", "expense"]),
  amountCents: z.number().int().positive("Le montant doit être supérieur à 0").max(100_000_000, "Le montant est trop élevé"),
  category: z.string().trim().min(2, "La catégorie est obligatoire").max(120),
  paymentMethod: z.enum(["cash", "bank_transfer", "card", "cheque", "direct_debit", "other"]),
  note: z.string().trim().max(1000, "La note est trop longue").optional(),
});

function parseOptionalDate(value: string | undefined) {
  if (!value) return null;
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "La date de la formule est invalide." });
  }
  return parsed;
}
function parseFinancialDate(value: string) {
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "La date de l'opération est invalide." });
  }
  return parsed;
}

export const appRouter = router({
  system: systemRouter,

  admin: router({
    listWorkshopWaitlist: adminProcedure.query(() => listWorkshopWaitlist()),
    listBookings: adminProcedure.query(() => listBookingRequests()),
    updateBookingAttendanceStatus: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      attendanceStatus: z.enum(["pending", "present", "absent_excused", "absent_unexcused"]),
    })).mutation(async ({ input }) => {
      const updated = await updateBookingAttendanceStatus(input.id, input.attendanceStatus);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Réservation introuvable." });
      return updated;
    }),
    collectiveAvailability: adminProcedure.query(async () => {
      const slots = getUpcomingCollectiveSlots();
      const firstDate = slots[0]?.date;
      const lastDate = slots.at(-1)?.date;
      if (!firstDate || !lastDate) return [];
      const endDate = new Date(`${lastDate}T12:00:00Z`);
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      const confirmedBookings = await listConfirmedCollectiveBookingsBetween(new Date(`${firstDate}T00:00:00Z`), endDate);
      const confirmedBySlot = new Map<string, number>();
      for (const booking of confirmedBookings) {
        if (!booking.preferredDate || (booking.preferredSlot !== "wednesday" && booking.preferredSlot !== "friday")) continue;
        const date = booking.preferredDate.toISOString().slice(0, 10);
        const key = `${date}|${booking.preferredSlot}`;
        confirmedBySlot.set(key, (confirmedBySlot.get(key) ?? 0) + 1);
      }
      return slots.map((slot) => {
        const confirmedCount = confirmedBySlot.get(`${slot.date}|${slot.slot}`) ?? 0;
        const remainingPlaces = Math.max(0, COLLECTIVE_CLASS_CAPACITY - confirmedCount);
        return { ...slot, confirmedCount, remainingPlaces, isFull: remainingPlaces === 0 };
      });
    }),
    collectiveClassRosters: adminProcedure.query(async () => {
      const slots = getUpcomingCollectiveSlots();
      const firstDate = slots[0]?.date;
      const lastDate = slots.at(-1)?.date;
      if (!firstDate || !lastDate) return [];
      const endDate = new Date(`${lastDate}T12:00:00Z`);
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      const confirmedBookings = await listConfirmedCollectiveBookingsBetween(new Date(`${firstDate}T00:00:00Z`), endDate);
      const studentsBySlot = new Map<string, Array<{ id: number; name: string; email: string | null; phone: string }>>();
      for (const booking of confirmedBookings) {
        if (!booking.preferredDate || (booking.preferredSlot !== "wednesday" && booking.preferredSlot !== "friday")) continue;
        const date = booking.preferredDate.toISOString().slice(0, 10);
        const key = `${date}|${booking.preferredSlot}`;
        const students = studentsBySlot.get(key) ?? [];
        students.push({ id: booking.id, name: booking.name, email: booking.email, phone: booking.phone });
        studentsBySlot.set(key, students);
      }
      return slots.map((slot) => {
        const students = studentsBySlot.get(`${slot.date}|${slot.slot}`) ?? [];
        const remainingPlaces = Math.max(0, COLLECTIVE_CLASS_CAPACITY - students.length);
        return { ...slot, confirmedCount: students.length, remainingPlaces, isFull: remainingPlaces === 0, students };
      });
    }),
    listFinancialTransactions: adminProcedure.query(() => listFinancialTransactions()),
    listStudentPlans: adminProcedure.query(() => listStudentPlans()),
    listStudentPlanPayments: adminProcedure.query(() => listStudentPlanPayments()),
    listStudentPlanCourseAdjustments: adminProcedure.query(() => listStudentPlanCourseAdjustments()),
    createStudentPortalInvite: adminProcedure.input(studentPortalInviteInput).mutation(async ({ ctx, input }) => {
      const plan = await getStudentPlanById(input.studentPlanId);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND", message: "Formule élève introuvable." });
      const email = (input.email || plan.email || "").trim().toLowerCase();
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "Ajoutez une adresse e-mail avant de créer un accès élève." });
      const rawToken = createStudentAccessToken();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await createStudentPortalAccess({ studentPlanId: plan.id, email, tokenHash: hashStudentAccessToken(rawToken), expiresAt, revokedAt: null, lastAccessAt: null });
      const protocol = String(ctx.req.headers["x-forwarded-proto"] || ctx.req.protocol).split(",")[0];
      const host = ctx.req.get("host");
      if (!host) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Adresse du site indisponible." });
      return { email, expiresAt, inviteToken: rawToken, inviteUrl: `${protocol}://${host}/espace-eleve?token=${encodeURIComponent(rawToken)}` };
    }),
    revokeStudentPortalInvite: adminProcedure.input(z.object({ studentPlanId: z.number().int().positive() })).mutation(async ({ input }) => {
      await revokeStudentPortalAccess(input.studentPlanId);
      return { success: true as const };
    }),
    createStudentPlanPayment: adminProcedure.input(studentPlanPaymentInput).mutation(async ({ input }) => {
      const plans = await listStudentPlans();
      const plan = plans.find((item) => item.id === input.studentPlanId);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND", message: "Formule élève introuvable." });
      const payments = await listStudentPlanPayments();
      const received = payments.filter((payment) => payment.studentPlanId === plan.id).reduce((sum, payment) => sum + payment.amountCents, 0);
      if (received + input.amountCents > plan.amountCents) throw new TRPCError({ code: "BAD_REQUEST", message: "Le total des versements ne peut pas dépasser le montant de la formule." });
      const payment = await createStudentPlanPayment({ studentPlanId: input.studentPlanId, amountCents: input.amountCents, paymentDate: parseFinancialDate(input.paymentDate), paymentMethod: input.paymentMethod, note: input.note || null });
      const nextReceived = received + input.amountCents;
      await updateStudentPlan(plan.id, { studentName: plan.studentName, secondaryStudentName: plan.secondaryStudentName, payerName: plan.payerName, email: plan.email, phone: plan.phone, planType: plan.planType, amountCents: plan.amountCents, paymentStatus: nextReceived >= plan.amountCents ? "paid" : "pending", paymentPlan: plan.paymentPlan, paymentMethod: plan.paymentMethod, paidDate: nextReceived >= plan.amountCents ? new Date(`${input.paymentDate}T12:00:00Z`) : plan.paidDate, expiresDate: plan.expiresDate, totalCourses: plan.totalCourses, usedCourses: plan.usedCourses, internalNote: plan.internalNote });
      return payment;
    }),
    deleteStudentPlanPayment: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const paymentsBefore = await listStudentPlanPayments();
      const paymentToDelete = paymentsBefore.find((payment) => payment.id === input.id);
      const deleted = await deleteStudentPlanPayment(input.id);
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "Versement introuvable." });
      if (paymentToDelete) {
        const plan = (await listStudentPlans()).find((item) => item.id === paymentToDelete.studentPlanId);
        if (plan) {
          const received = paymentsBefore.filter((payment) => payment.studentPlanId === plan.id && payment.id !== input.id).reduce((sum, payment) => sum + payment.amountCents, 0);
          await updateStudentPlan(plan.id, { studentName: plan.studentName, secondaryStudentName: plan.secondaryStudentName, payerName: plan.payerName, email: plan.email, phone: plan.phone, planType: plan.planType, amountCents: plan.amountCents, paymentStatus: received >= plan.amountCents ? "paid" : "pending", paymentPlan: plan.paymentPlan, paymentMethod: plan.paymentMethod, paidDate: received >= plan.amountCents ? plan.paidDate : null, expiresDate: plan.expiresDate, totalCourses: plan.totalCourses, usedCourses: plan.usedCourses, internalNote: plan.internalNote });
        }
      }
      return { success: true as const, id: input.id };
    }),
    createStudentPlan: adminProcedure.input(studentPlanInput).mutation(async ({ input }) => {
      const created = await createStudentPlan({
        studentName: input.studentName,
        secondaryStudentName: input.secondaryStudentName || null,
        payerName: input.payerName || null,
        email: input.email || null,
        phone: input.phone || null,
        planType: input.planType,
        amountCents: input.amountCents,
        paymentStatus: input.paymentStatus,
        paymentPlan: input.paymentPlan,
        paymentMethod: input.paymentMethod,
        paidDate: parseOptionalDate(input.paidDate),
        expiresDate: parseOptionalDate(input.expiresDate),
        totalCourses: input.totalCourses,
        usedCourses: input.usedCourses,
        internalNote: input.internalNote || null,
      });
      if (created.paymentStatus === "paid") {
        await createStudentPlanPayment({ studentPlanId: created.id, amountCents: created.amountCents, paymentDate: parseOptionalDate(input.paidDate) || new Date(), paymentMethod: created.paymentMethod, note: "Règlement initial enregistré avec la formule" });
      }
      return created;
    }),
    updateStudentPlan: adminProcedure.input(studentPlanInput.safeExtend({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const updated = await updateStudentPlan(input.id, {
        studentName: input.studentName,
        secondaryStudentName: input.secondaryStudentName || null,
        payerName: input.payerName || null,
        email: input.email || null,
        phone: input.phone || null,
        planType: input.planType,
        amountCents: input.amountCents,
        paymentStatus: input.paymentStatus,
        paymentPlan: input.paymentPlan,
        paymentMethod: input.paymentMethod,
        paidDate: parseOptionalDate(input.paidDate),
        expiresDate: parseOptionalDate(input.expiresDate),
        totalCourses: input.totalCourses,
        usedCourses: input.usedCourses,
        internalNote: input.internalNote || null,
      });
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Formule élève introuvable." });
      return updated;
    }),
    adjustStudentPlanCourses: adminProcedure.input(z.object({ id: z.number().int().positive(), delta: z.union([z.literal(-1), z.literal(1)]) })).mutation(async ({ input }) => {
      const updated = await adjustStudentPlanCourses(input.id, input.delta);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Formule élève introuvable." });
      return updated;
    }),
    deleteStudentPlan: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const deleted = await deleteStudentPlan(input.id);
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "Formule élève introuvable." });
      return { success: true as const, id: input.id };
    }),
    createFinancialTransaction: adminProcedure.input(financialTransactionInput).mutation(({ input }) => createFinancialTransaction({
      transactionDate: parseFinancialDate(input.transactionDate),
      type: input.type,
      amountCents: input.amountCents,
      category: input.category,
      paymentMethod: input.paymentMethod,
      note: input.note || null,
    })),
    updateFinancialTransaction: adminProcedure.input(financialTransactionInput.extend({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const updated = await updateFinancialTransaction(input.id, {
        transactionDate: parseFinancialDate(input.transactionDate),
        type: input.type,
        amountCents: input.amountCents,
        category: input.category,
        paymentMethod: input.paymentMethod,
        note: input.note || null,
      });
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Opération financière introuvable." });
      return updated;
    }),
    deleteFinancialTransaction: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const deleted = await deleteFinancialTransaction(input.id);
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "Opération financière introuvable." });
      return { success: true as const, id: input.id };
    }),
    googleCalendarStatus: adminProcedure.query(() => getGoogleCalendarStatus()),
    listAvailabilityBlocks: adminProcedure.query(() => listAvailabilityBlocks()),
    createAvailabilityBlock: adminProcedure.input(z.object({
      blockDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
      bookingType: z.enum(["phone_call", "individual_course"]).default("phone_call"),
      startTime: z.string().regex(/^\d{2}:\d{2}$/, "Horaire invalide").nullable().optional(),
      reason: z.string().trim().max(240).optional(),
    })).mutation(async ({ input }) => {
      const parsedDate = new Date(`${input.blockDate}T12:00:00Z`);
      const weekday = parsedDate.getUTCDay();
      if (Number.isNaN(parsedDate.getTime()) || ![2, 4, 6].includes(weekday)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Les blocages sont limités au mardi, jeudi ou samedi." });
      }
      const phoneTimes = ["18:30", "19:00", "19:30"];
      const individualTimes = weekday === 6 ? ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:00"] : ["17:30"];
      const allowedTimes = input.bookingType === "phone_call" ? phoneTimes : individualTimes;
      if (input.startTime && !allowedTimes.includes(input.startTime)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Ce créneau ne correspond pas aux disponibilités de ce type de réservation." });
      }
      if (await isAvailabilityBlocked(parsedDate, input.startTime || "00:00", input.bookingType)) {
        throw new TRPCError({ code: "CONFLICT", message: "Cette date ou ce créneau est déjà bloqué." });
      }
      try {
        return await createAvailabilityBlock({ blockDate: parsedDate, bookingType: input.bookingType, startTime: input.startTime || null, reason: input.reason });
      } catch (error) {
        if (error instanceof Error && /duplicate|unique/i.test(error.message)) {
          throw new TRPCError({ code: "CONFLICT", message: "Ce créneau est déjà bloqué." });
        }
        throw error;
      }
    }),
    deleteAvailabilityBlock: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const deleted = await deleteAvailabilityBlock(input.id);
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "Blocage introuvable." });
      return { success: true as const, id: input.id };
    }),
    createManualBooking: adminProcedure.input(manualBookingInput).mutation(async ({ input }) => {
      if (input.requestType === "first_course" && input.preferredDate && (input.preferredSlot === "wednesday" || input.preferredSlot === "friday")) {
        const duplicate = await findDuplicateCollectiveBooking({
          preferredDate: new Date(`${input.preferredDate}T12:00:00Z`),
          preferredSlot: input.preferredSlot,
          phone: input.phone,
          email: input.email,
        });
        if (duplicate) throw new TRPCError({ code: "CONFLICT", message: "Cette personne est déjà inscrite à ce cours collectif." });
      }
      const created = await createBookingRequest({
        name: input.name,
        email: input.email || null,
        phone: input.phone,
        requestType: input.requestType,
        preferredSlot: input.preferredSlot,
        preferredDate: input.preferredDate ? new Date(`${input.preferredDate}T12:00:00Z`) : null,
        preferredTime: input.preferredTime || null,
        durationMinutes: input.requestType === "phone_call" ? 20 : input.durationMinutes,
        message: input.message ? `Demande reçue par téléphone. ${input.message}` : "Demande reçue par téléphone.",
        status: input.status,
      });
      if (created.status === "confirmed") {
        try {
          await syncBookingStatusChange(created, true);
        } catch (error) {
          console.error("[Google Calendar] Manual booking sync failed:", error);
          await updateBookingCalendarMetadata(created.id, {
            googleEventId: null,
            googleCalendarSyncedAt: null,
            googleCalendarSyncError: error instanceof Error ? error.message : "Synchronisation Google Agenda impossible.",
          });
        }
      }
      return (await getBookingRequest(created.id)) ?? created;
    }),
    recordBookingAttendancePresent: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      try {
        return await recordBookingAttendancePresent(input.id);
      } catch (error) {
        if (error instanceof Error && /introuvable/i.test(error.message)) throw new TRPCError({ code: "NOT_FOUND", message: error.message });
        throw error;
      }
    }),
    restoreBookingAttendanceDeduction: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const updated = await restoreBookingAttendanceDeduction(input.id);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Réservation introuvable." });
      return updated;
    }),

    updateBookingContact: adminProcedure.input(updateBookingContactInput).mutation(async ({ input }) => {
      const updated = await updateBookingContactDetails(input.id, {
        name: input.name,
        email: input.email || null,
        phone: input.phone,
      });
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Demande introuvable." });
      return updated;
    }),
    updateBookingInternalNote: adminProcedure.input(updateBookingInternalNoteInput).mutation(async ({ input }) => {
      const updated = await updateBookingInternalNote(input.id, input.internalNote || null);
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Demande introuvable." });
      return updated;
    }),
    updateBookingStatus: adminProcedure.input(adminStatusInput).mutation(async ({ input }) => {
      const current = await getBookingRequest(input.id);
      if (!current) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Demande introuvable." });
      }
      if (current.status === input.status) return current;

      const updated = await updateBookingRequestStatus(input.id, input.status);
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Demande introuvable." });
      }

      const calendarRelevant = (input.status === "confirmed" || current.status === "confirmed") && updated.requestType !== "question";
      if (calendarRelevant) {
        try {
          await syncBookingStatusChange(updated, current.status === "confirmed");
        } catch (error) {
          console.error("[Google Calendar] Booking status sync failed:", error);
          await updateBookingCalendarMetadata(updated.id, {
            googleEventId: updated.googleEventId ?? null,
            googleCalendarSyncedAt: null,
            googleCalendarSyncError: error instanceof Error ? error.message : "Synchronisation Google Agenda impossible.",
          });
        }
      }
      return (await getBookingRequest(updated.id)) ?? updated;
    }),
    deleteBooking: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const current = await getBookingRequest(input.id);
      if (current?.status === "confirmed" && current.requestType !== "question") {
        const transitioned = await updateBookingRequestStatus(input.id, "declined");
        if (transitioned) {
          try {
            await syncBookingStatusChange(transitioned, true);
          } catch (error) {
            console.error("[Google Calendar] Booking deletion sync failed:", error);
            throw new TRPCError({ code: "PRECONDITION_FAILED", message: "La demande est toujours conservée car son événement Google Agenda n’a pas pu être retiré." });
          }
        }
      }
      const deleted = await deleteBookingRequest(input.id);
      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Demande introuvable." });
      }
      return { success: true as const, id: input.id };
    }),
  }),
  studentPortal: router({
    exchangeToken: publicProcedure.input(studentPortalTokenInput).mutation(async ({ ctx, input }) => {
      const access = await getStudentPortalAccessByTokenHash(hashStudentAccessToken(input.token));
      if (!access || access.revokedAt || access.expiresAt.getTime() <= Date.now()) throw new TRPCError({ code: "UNAUTHORIZED", message: "Ce lien d’accès est invalide ou expiré." });
      setStudentSession(ctx.res, ctx.req, access.id);
      await touchStudentPortalAccess(access.id);
      return { success: true as const };
    }),
    me: publicProcedure.query(async ({ ctx }) => {
      const session = readStudentSession(ctx.req);
      if (!session) throw new TRPCError({ code: "UNAUTHORIZED", message: "Connexion élève requise." });
      const access = await getStudentPortalAccessById(session.accessId);
      if (!access || access.revokedAt || access.expiresAt.getTime() <= Date.now()) {
        clearStudentSession(ctx.res, ctx.req);
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Votre accès élève est expiré ou révoqué." });
      }
      const plan = await getStudentPlanById(access.studentPlanId);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND", message: "Formule élève introuvable." });
      const payments = (await listStudentPlanPayments()).filter((payment) => payment.studentPlanId === plan.id);
      const receivedCents = payments.reduce((sum, payment) => sum + payment.amountCents, 0);
      await touchStudentPortalAccess(access.id);
      return {
        student: { name: plan.studentName, email: access.email },
        plan: { id: plan.id, planType: plan.planType, amountCents: plan.amountCents, paymentStatus: plan.paymentStatus, paymentPlan: plan.paymentPlan, expiresDate: plan.expiresDate, totalCourses: plan.totalCourses, usedCourses: plan.usedCourses, receivedCents, remainingPaymentCents: Math.max(0, plan.amountCents - receivedCents) },
        payments: payments.map((payment) => ({ id: payment.id, amountCents: payment.amountCents, paymentDate: payment.paymentDate, paymentMethod: payment.paymentMethod })),
      };
    }),
    receipt: publicProcedure.input(z.object({ paymentId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const session = readStudentSession(ctx.req);
      if (!session) throw new TRPCError({ code: "UNAUTHORIZED", message: "Connexion élève requise." });
      const access = await getStudentPortalAccessById(session.accessId);
      if (!access || access.revokedAt || access.expiresAt.getTime() <= Date.now()) throw new TRPCError({ code: "UNAUTHORIZED", message: "Votre accès élève est expiré ou révoqué." });
      const plan = await getStudentPlanById(access.studentPlanId);
      if (!plan) throw new TRPCError({ code: "NOT_FOUND", message: "Formule élève introuvable." });
      const payment = (await listStudentPlanPayments()).find((item) => item.id === input.paymentId && item.studentPlanId === plan.id);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Reçu introuvable." });
      const pdf = await createPaymentReceiptPdf({ receiptId: payment.id, studentName: plan.studentName, email: access.email, planType: plan.planType, amountCents: payment.amountCents, paymentDate: payment.paymentDate, paymentMethod: payment.paymentMethod });
      return { filename: `recu-sdyoga-${payment.id}.pdf`, contentType: "application/pdf" as const, contentBase64: pdf.toString("base64") };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearStudentSession(ctx.res, ctx.req);
      return { success: true as const };
    }),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    sendMessage: publicProcedure.input(contactInput).mutation(async ({ input }) => {
      const notified = await notifyOwner({
        title: `Nouveau message Sdyoga de ${input.name}`,
        content: `Email : ${input.email}\n\nMessage :\n${input.message}`,
      });

      return {
        success: true,
        notified,
        message: notified
          ? "Merci ! Votre message a bien été transmis à David."
          : "Votre message a été enregistré, mais la notification est momentanément indisponible. Vous pouvez aussi appeler David directement.",
      };
    }),
  }),

  workshopWaitlist: router({
    join: publicProcedure.input(z.object({ email: z.string().trim().email("Email invalide").max(320) })).mutation(async ({ input }) => {
      const email = input.email.trim().toLowerCase();
      try {
        const existing = await findWorkshopWaitlistByEmail(email);
        if (existing) return { success: true as const, alreadyRegistered: true as const, message: "Cette adresse est déjà inscrite à la liste d’attente." };
        await createWorkshopWaitlistEntry({ email });
        return { success: true as const, alreadyRegistered: false as const, message: "Votre adresse est bien inscrite. Vous serez informé(e) lorsque les ateliers seront ouverts." };
      } catch (error) {
        console.error("[Workshop waitlist] Failed to save email:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Impossible d’enregistrer votre inscription pour le moment." });
      }
    }),
  }),
  booking: router({
    phoneCallBlockedSlots: publicProcedure.query(async () => {
      const blocks = await listAvailabilityBlocks();
      return blocks.filter((block) => block.bookingType === "phone_call").map((block) => ({ blockDate: block.blockDate, startTime: block.startTime }));
    }),
    individualBlockedSlots: publicProcedure.query(async () => {
      const blocks = await listAvailabilityBlocks();
      return blocks.filter((block) => block.bookingType === "individual_course").map((block) => ({ blockDate: block.blockDate, startTime: block.startTime }));
    }),
    request: publicProcedure.input(bookingInput).mutation(async ({ input }) => {
      try {
        if (input.requestType === "individual_course" && input.preferredDate && input.preferredTime) {
        const blocked = await isAvailabilityBlocked(new Date(`${input.preferredDate}T12:00:00Z`), input.preferredTime, "individual_course");
        if (blocked) throw new TRPCError({ code: "CONFLICT", message: "Ce créneau de cours individuel vient d’être bloqué. Choisissez-en un autre." });
      }
        if (input.requestType === "phone_call" && input.preferredDate && input.preferredTime) {
          const blocked = await isAvailabilityBlocked(new Date(`${input.preferredDate}T12:00:00Z`), input.preferredTime, "phone_call");
          if (blocked) throw new TRPCError({ code: "CONFLICT", message: "Ce créneau d’appel vient d’être bloqué. Choisissez-en un autre." });
        }
        if (input.requestType === "first_course" && input.preferredDate && (input.preferredSlot === "wednesday" || input.preferredSlot === "friday")) {
          const duplicate = await findDuplicateCollectiveBooking({
            preferredDate: new Date(`${input.preferredDate}T12:00:00Z`),
            preferredSlot: input.preferredSlot,
            phone: input.phone,
            email: input.email,
          });
          if (duplicate) throw new TRPCError({ code: "CONFLICT", message: "Cette personne a déjà une demande pour ce cours collectif." });
        }
        const created = await createBookingRequest({
          name: input.name,
          email: input.email,
          phone: input.phone,
          requestType: input.requestType,
          preferredSlot: input.preferredSlot,
          preferredDate: input.preferredDate ? new Date(`${input.preferredDate}T12:00:00Z`) : null,
          preferredTime: input.preferredTime || null,
          durationMinutes: input.durationMinutes,
          message: input.message || null,
        });

        const notificationSlot = created.requestType === "individual_course" || created.requestType === "phone_call"
          ? `${slotLabels[created.preferredSlot]} à ${created.preferredTime ?? "heure à préciser"}${created.requestType === "individual_course" ? ` (${created.durationMinutes === 90 ? "1 h 30 — 70 €" : "1 h — 50 €"})` : " (20 minutes)"}`
          : slotLabels[created.preferredSlot];
        const notificationContent = [
          `${requestTypeLabels[created.requestType]} pour ${notificationSlot}${formatRequestedDate(created.preferredDate) ? `, le ${formatRequestedDate(created.preferredDate)}` : ""}.`,
          `Nom : ${created.name}`,
          `Email : ${created.email || "Non renseigné"}`,
          `Téléphone : ${created.phone}`,
          created.message ? `Message : ${created.message}` : "Aucun message complémentaire.",
          "Réponse manuelle nécessaire : aucune place n'est confirmée automatiquement.",
        ].join("\\n");

        let ownerNotificationSent = false;
        try {
          ownerNotificationSent = await notifyOwner({
            title: `Nouvelle demande Sdyoga de ${created.name}`,
            content: notificationContent,
          });
        } catch (notificationError) {
          console.error("[Booking] Owner notification failed:", notificationError);
        }

        let emailSent = false;
        const recipientEmail = created.email;
        if (recipientEmail) {
          try {
            emailSent = await sendBookingRequestEmail({ ...created, email: recipientEmail });
          } catch (emailError) {
            console.error("[Booking] Email notification failed:", emailError);
          }
        }

        const notified = ownerNotificationSent || emailSent;

        return {
          success: true,
          notified,
          message: notified
            ? "Votre demande est bien enregistrée. David vous recontactera pour confirmer la disponibilité."
            : "Votre demande est enregistrée. La notification est momentanément indisponible ; vous pouvez appeler David au 06 51 59 21 08 pour accélérer la confirmation.",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Booking] Failed to process reservation request:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Impossible d'enregistrer votre demande pour le moment.",
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
