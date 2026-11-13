import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createBookingRequest: vi.fn(),
  findDuplicateCollectiveBooking: vi.fn(),
  listBookingRequests: vi.fn(),
  listConfirmedCollectiveBookingsBetween: vi.fn(),
  getBookingRequest: vi.fn(),
  updateBookingRequestStatus: vi.fn(),
  recordBookingAttendancePresent: vi.fn(),
  restoreBookingAttendanceDeduction: vi.fn(),
  updateBookingContactDetails: vi.fn(),
  updateBookingInternalNote: vi.fn(),
  updateBookingCalendarMetadata: vi.fn(),
  getBookingsForCollectiveSlot: vi.fn(),
  getGoogleCalendarConnection: vi.fn(),
  saveGoogleCalendarConnection: vi.fn(),
  deleteBookingRequest: vi.fn(),
  listAvailabilityBlocks: vi.fn(),
  createAvailabilityBlock: vi.fn(),
  deleteAvailabilityBlock: vi.fn(),
  isAvailabilityBlocked: vi.fn(),
  listFinancialTransactions: vi.fn(),
  createFinancialTransaction: vi.fn(),
  updateFinancialTransaction: vi.fn(),
  deleteFinancialTransaction: vi.fn(),
}));

vi.mock("./_core/notification", () => ({ notifyOwner: vi.fn() }));
vi.mock("./email", () => ({ sendBookingRequestEmail: vi.fn() }));
vi.mock("./googleCalendar", () => ({
  getGoogleCalendarStatus: vi.fn().mockResolvedValue({ connected: true, accountEmail: "shanti.sdyoga@gmail.com", calendarId: "primary" }),
  syncBookingStatusChange: vi.fn(async (booking: unknown) => booking),
}));

import { createAvailabilityBlock, createBookingRequest, createFinancialTransaction, deleteAvailabilityBlock, deleteBookingRequest, deleteFinancialTransaction, findDuplicateCollectiveBooking, getBookingRequest, listAvailabilityBlocks, listBookingRequests, listConfirmedCollectiveBookingsBetween, listFinancialTransactions, updateBookingContactDetails, updateBookingInternalNote, recordBookingAttendancePresent, restoreBookingAttendanceDeduction, updateBookingRequestStatus, updateFinancialTransaction } from "./db";
import { syncBookingStatusChange } from "./googleCalendar";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "user" | undefined): TrpcContext {
  return {
    user: role ? {
      id: 1,
      openId: `${role}-user`,
      email: `${role}@example.com`,
      name: role === "admin" ? "David" : "Élève",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } : undefined,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin booking procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(findDuplicateCollectiveBooking).mockResolvedValue(undefined);
  });
  it("rejects unauthenticated and non-admin access", async () => {
    await expect(appRouter.createCaller(context(undefined)).admin.listBookings()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context("user")).admin.listBookings()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context("user")).admin.deleteBooking({ id: 7 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context("user")).admin.updateBookingContact({ id: 7, name: "Camille", phone: "06 12 34 56 78" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context("user")).admin.createManualBooking({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "first_course",
      preferredSlot: "wednesday",
      preferredDate: "2026-08-26",
      durationMinutes: 60,
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("lists requests and updates their status for an administrator", async () => {
    const booking = {
      id: 7,
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "first_course" as const,
      preferredSlot: "wednesday" as const,
      preferredDate: new Date("2026-08-26T00:00:00.000Z"),
      message: "Je souhaite essayer.",
      status: "pending" as const,
      googleEventId: null,
      googleCalendarSyncedAt: null,
      googleCalendarSyncError: null,
      createdAt: new Date("2026-08-20T00:00:00.000Z"),
    };
    vi.mocked(listBookingRequests).mockResolvedValue([booking]);
    vi.mocked(getBookingRequest)
      .mockResolvedValueOnce({ ...booking, status: "confirmed", message: "Demande reçue par téléphone." })
      .mockResolvedValueOnce({ ...booking, status: "pending" })
      .mockResolvedValueOnce({ ...booking, status: "confirmed" });
    vi.mocked(updateBookingRequestStatus).mockResolvedValue({ ...booking, status: "confirmed" });
    const caller = appRouter.createCaller(context("admin"));
    vi.mocked(createBookingRequest).mockResolvedValue({ ...booking, status: "confirmed", message: "Demande reçue par téléphone." });

    await expect(caller.admin.createManualBooking({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "first_course",
      preferredSlot: "wednesday",
      preferredDate: "2026-08-26",
      durationMinutes: 60,
      status: "confirmed",
    })).resolves.toMatchObject({ id: 7, message: "Demande reçue par téléphone." });
    expect(createBookingRequest).toHaveBeenCalledWith(expect.objectContaining({
      name: "Camille",
      requestType: "first_course",
      preferredDate: new Date("2026-08-26T12:00:00.000Z"),
      status: "confirmed",
      message: "Demande reçue par téléphone.",
    }));

    await expect(caller.admin.listBookings()).resolves.toEqual([booking]);
    await expect(caller.admin.updateBookingStatus({ id: 7, status: "confirmed" })).resolves.toMatchObject({ id: 7, status: "confirmed" });
    expect(updateBookingRequestStatus).toHaveBeenCalledWith(7, "confirmed");
    expect(syncBookingStatusChange).toHaveBeenCalledWith(expect.objectContaining({ id: 7, status: "confirmed" }), false);
    vi.mocked(deleteBookingRequest).mockResolvedValue(true);
    await expect(caller.admin.deleteBooking({ id: 7 })).resolves.toEqual({ success: true, id: 7 });
    expect(deleteBookingRequest).toHaveBeenCalledWith(7);
  });

  it("accepte une demande manuelle sans e-mail et permet de compléter les coordonnées", async () => {
    const booking = { id: 21, name: "Nora", email: null, phone: "06 12 34 56 78", requestType: "first_course" as const, preferredSlot: "wednesday" as const, preferredDate: new Date("2026-08-26T12:00:00.000Z"), preferredTime: null, durationMinutes: 60, message: "Demande reçue par téléphone.", status: "pending" as const, googleEventId: null, googleCalendarSyncedAt: null, googleCalendarSyncError: null, createdAt: new Date(), updatedAt: new Date() };
    vi.mocked(createBookingRequest).mockResolvedValue(booking);
    vi.mocked(getBookingRequest).mockResolvedValue(booking);
    const updated = { ...booking, email: "nora@example.com" };
    vi.mocked(updateBookingContactDetails).mockResolvedValue(updated);
    const caller = appRouter.createCaller(context("admin"));

    await expect(caller.admin.createManualBooking({ name: "Nora", phone: "06 12 34 56 78", requestType: "first_course", preferredSlot: "wednesday", preferredDate: "2026-08-26", durationMinutes: 60 })).resolves.toMatchObject({ email: null });
    expect(createBookingRequest).toHaveBeenCalledWith(expect.objectContaining({ email: null }));
    await expect(caller.admin.updateBookingContact({ id: 21, name: "Nora", email: "nora@example.com", phone: "06 12 34 56 78" })).resolves.toMatchObject({ email: "nora@example.com" });
    expect(updateBookingContactDetails).toHaveBeenCalledWith(21, { name: "Nora", email: "nora@example.com", phone: "06 12 34 56 78" });
  });

  it("accepte les champs vides du formulaire manuel pour un cours collectif", async () => {
    const booking = { id: 33, name: "Nouvel élève", email: null, phone: "06 00 00 00 03", requestType: "first_course" as const, preferredSlot: "friday" as const, preferredDate: new Date("2026-09-04T12:00:00.000Z"), preferredTime: null, durationMinutes: 60, message: "Demande reçue par téléphone.", status: "pending" as const, googleEventId: null, googleCalendarSyncedAt: null, googleCalendarSyncError: null, createdAt: new Date() };
    vi.mocked(createBookingRequest).mockResolvedValue(booking);
    vi.mocked(getBookingRequest).mockResolvedValue(booking);
    const caller = appRouter.createCaller(context("admin"));

    await expect(caller.admin.createManualBooking({ name: "Nouvel élève", email: "", phone: "06 00 00 00 03", requestType: "first_course", preferredSlot: "friday", preferredDate: "2026-09-04", preferredTime: "", durationMinutes: 60 })).resolves.toMatchObject({ id: 33, email: null });
    expect(createBookingRequest).toHaveBeenCalledWith(expect.objectContaining({ email: null, preferredTime: null }));
  });

  it("autorise plusieurs élèves distincts sur le même cours collectif", async () => {
    const first = { id: 31, name: "Élève déjà inscrit", email: "premier@example.com", phone: "06 00 00 00 01", requestType: "first_course" as const, preferredSlot: "friday" as const, preferredDate: new Date("2026-09-04T12:00:00.000Z"), preferredTime: null, durationMinutes: 60, message: "Demande reçue par téléphone.", status: "confirmed" as const, googleEventId: null, googleCalendarSyncedAt: null, googleCalendarSyncError: null, createdAt: new Date() };
    const second = { ...first, id: 32, name: "Nouvel élève", email: "second@example.com", phone: "06 00 00 00 02", status: "pending" as const };
    vi.mocked(createBookingRequest).mockResolvedValue(second);
    vi.mocked(getBookingRequest).mockResolvedValue(second);
    const caller = appRouter.createCaller(context("admin"));

    await expect(caller.admin.createManualBooking({ name: "Nouvel élève", email: "second@example.com", phone: "06 00 00 00 02", requestType: "first_course", preferredSlot: "friday", preferredDate: "2026-09-04", durationMinutes: 60 })).resolves.toMatchObject({ id: 32 });
    expect(findDuplicateCollectiveBooking).toHaveBeenCalledWith(expect.objectContaining({ preferredSlot: "friday", phone: "06 00 00 00 02" }));
    expect(createBookingRequest).toHaveBeenCalledOnce();
  });

  it("refuse le doublon d’une même personne sur un cours collectif", async () => {
    vi.mocked(findDuplicateCollectiveBooking).mockResolvedValue({ id: 31 } as never);
    const caller = appRouter.createCaller(context("admin"));

    await expect(caller.admin.createManualBooking({ name: "Élève déjà inscrit", email: "premier@example.com", phone: "06 00 00 00 01", requestType: "first_course", preferredSlot: "friday", preferredDate: "2026-09-04", durationMinutes: 60 })).rejects.toMatchObject({ code: "CONFLICT" });
    expect(createBookingRequest).not.toHaveBeenCalled();
  });

  it("enregistre la note interne uniquement pour un administrateur", async () => {
    const booking = { id: 22, name: "Nora", email: null, phone: "06 12 34 56 78", requestType: "first_course" as const, preferredSlot: "wednesday" as const, preferredDate: new Date("2026-08-26T12:00:00.000Z"), preferredTime: null, durationMinutes: 60, message: null, internalNote: "Prévoir un rappel avant le cours.", status: "pending" as const, googleEventId: null, googleCalendarSyncedAt: null, googleCalendarSyncError: null, createdAt: new Date(), updatedAt: new Date() };
    vi.mocked(updateBookingInternalNote).mockResolvedValue(booking);
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.updateBookingInternalNote({ id: 22, internalNote: "Prévoir un rappel avant le cours." })).resolves.toMatchObject({ internalNote: "Prévoir un rappel avant le cours." });
    expect(updateBookingInternalNote).toHaveBeenCalledWith(22, "Prévoir un rappel avant le cours.");
    await expect(appRouter.createCaller(context("user")).admin.updateBookingInternalNote({ id: 22, internalNote: "Note privée" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("gère les blocages d’appels pour un administrateur", async () => {
    const block = { id: 3, blockDate: new Date("2026-09-01T12:00:00.000Z"), bookingType: "phone_call" as const, startTime: "18:30" as const, reason: "Indisponible", createdAt: new Date() };
    vi.mocked(createAvailabilityBlock).mockResolvedValue(block);
    vi.mocked(listAvailabilityBlocks).mockResolvedValue([block]);
    vi.mocked(deleteAvailabilityBlock).mockResolvedValue(true);
    const caller = appRouter.createCaller(context("admin"));

    await expect(caller.admin.createAvailabilityBlock({ blockDate: "2026-09-01", startTime: "18:30", reason: "Indisponible" })).resolves.toEqual(block);
    await expect(caller.admin.listAvailabilityBlocks()).resolves.toEqual([block]);
    await expect(caller.admin.deleteAvailabilityBlock({ id: 3 })).resolves.toEqual({ success: true, id: 3 });

    const individualDateBlock = { id: 4, blockDate: new Date("2026-09-05T12:00:00.000Z"), bookingType: "individual_course" as const, startTime: null, reason: "Congé", createdAt: new Date() };
    vi.mocked(createAvailabilityBlock).mockResolvedValueOnce(individualDateBlock);
    await expect(caller.admin.createAvailabilityBlock({ blockDate: "2026-09-05", bookingType: "individual_course", startTime: null, reason: "Congé" })).resolves.toEqual(individualDateBlock);
    expect(createAvailabilityBlock).toHaveBeenCalledWith(expect.objectContaining({ bookingType: "individual_course", startTime: null }));
  });

  it("gère les opérations financières exclusivement pour un administrateur", async () => {
    const transaction = {
      id: 12,
      transactionDate: new Date("2026-08-25T12:00:00.000Z"),
      type: "income" as const,
      amountCents: 5000,
      category: "Cours individuels",
      paymentMethod: "bank_transfer" as const,
      note: "Cours du mois",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(listFinancialTransactions).mockResolvedValue([transaction]);
    vi.mocked(createFinancialTransaction).mockResolvedValue(transaction);
    vi.mocked(updateFinancialTransaction).mockResolvedValue({ ...transaction, type: "expense", amountCents: 1200, category: "Matériel" });
    vi.mocked(deleteFinancialTransaction).mockResolvedValue(true);

    const adminCaller = appRouter.createCaller(context("admin"));
    await expect(adminCaller.admin.listFinancialTransactions()).resolves.toEqual([transaction]);
    await expect(adminCaller.admin.createFinancialTransaction({
      transactionDate: "2026-08-25",
      type: "income",
      amountCents: 5000,
      category: "Cours individuels",
      paymentMethod: "bank_transfer",
      note: "Cours du mois",
    })).resolves.toEqual(transaction);
    expect(createFinancialTransaction).toHaveBeenCalledWith(expect.objectContaining({
      transactionDate: new Date("2026-08-25T12:00:00.000Z"),
      amountCents: 5000,
    }));

    await expect(adminCaller.admin.updateFinancialTransaction({
      id: 12,
      transactionDate: "2026-08-25",
      type: "expense",
      amountCents: 1200,
      category: "Matériel",
      paymentMethod: "card",
    })).resolves.toMatchObject({ id: 12, type: "expense", amountCents: 1200 });
    await expect(adminCaller.admin.deleteFinancialTransaction({ id: 12 })).resolves.toEqual({ success: true, id: 12 });

    await expect(appRouter.createCaller(context("user")).admin.listFinancialTransactions()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(adminCaller.admin.createFinancialTransaction({
      transactionDate: "2026-08-25",
      type: "income",
      amountCents: 0,
      category: "Cours",
      paymentMethod: "cash",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("retire l’événement Google avant de supprimer une demande confirmée", async () => {
    const booking = {
      id: 18,
      name: "Élève confirmée",
      email: "eleve@example.com",
      phone: "06 00 00 00 00",
      requestType: "first_course" as const,
      preferredSlot: "friday" as const,
      preferredDate: new Date("2026-08-28T00:00:00.000Z"),
      preferredTime: null,
      durationMinutes: 60,
      message: null,
      status: "confirmed" as const,
      googleEventId: "event-test-18",
      googleCalendarSyncedAt: new Date(),
      googleCalendarSyncError: null,
      createdAt: new Date(),
    };
    vi.mocked(getBookingRequest).mockResolvedValue(booking);
    vi.mocked(updateBookingRequestStatus).mockResolvedValue({ ...booking, status: "declined" });
    vi.mocked(deleteBookingRequest).mockResolvedValue(true);

    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.deleteBooking({ id: 18 })).resolves.toEqual({ success: true, id: 18 });
    expect(updateBookingRequestStatus).toHaveBeenCalledWith(18, "declined");
    expect(syncBookingStatusChange).toHaveBeenCalledWith(expect.objectContaining({ id: 18, status: "declined" }), true);
    expect(deleteBookingRequest).toHaveBeenCalledWith(18);
  });
});


  it("regroupe les élèves confirmés par cours collectif dans une route privée", async () => {
    vi.mocked(listConfirmedCollectiveBookingsBetween).mockResolvedValue([
      {
        id: 41,
        name: "Élève confirmé",
        email: "eleve@example.com",
        phone: "06 00 00 00 41",
        requestType: "first_course",
        preferredSlot: "wednesday",
        preferredDate: new Date(),
        preferredTime: null,
        durationMinutes: 60,
        message: null,
        status: "confirmed",
        googleEventId: null,
        googleCalendarSyncedAt: null,
        googleCalendarSyncError: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as never);
    const adminCaller = appRouter.createCaller(context("admin"));
    const rosters = await adminCaller.admin.collectiveClassRosters();
    expect(listConfirmedCollectiveBookingsBetween).toHaveBeenCalledOnce();
    expect(rosters).toHaveLength(8);
    expect(rosters[0]).toEqual(expect.objectContaining({ confirmedCount: expect.any(Number), remainingPlaces: expect.any(Number), isFull: expect.any(Boolean), students: expect.any(Array) }));
    await expect(appRouter.createCaller(context("user")).admin.collectiveClassRosters()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });


describe("déduction automatique des carnets après présence", () => {
  it("déduit un cours et permet de restaurer l’opération pour un administrateur", async () => {
    const booking = { id: 91, attendanceStatus: "present" as const, attendanceCourseDeducted: 1, attendanceStudentPlanId: 12 };
    vi.mocked(recordBookingAttendancePresent).mockResolvedValue({ booking: booking as never, deducted: true, studentPlanId: 12 });
    vi.mocked(restoreBookingAttendanceDeduction).mockResolvedValue({ ...booking, attendanceCourseDeducted: 0 } as never);
    const caller = appRouter.createCaller(context("admin"));

    await expect(caller.admin.recordBookingAttendancePresent({ id: 91 })).resolves.toMatchObject({ deducted: true, studentPlanId: 12 });
    await expect(caller.admin.restoreBookingAttendanceDeduction({ id: 91 })).resolves.toMatchObject({ attendanceCourseDeducted: 0 });
    expect(recordBookingAttendancePresent).toHaveBeenCalledWith(91);
    expect(restoreBookingAttendanceDeduction).toHaveBeenCalledWith(91);
    await expect(appRouter.createCaller(context("user")).admin.recordBookingAttendancePresent({ id: 91 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
