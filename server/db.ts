import { and, asc, desc, eq, gte, isNull, lt, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { AvailabilityBlock, BookingRequest, FinancialTransaction, InsertBookingRequest, InsertFinancialTransaction, InsertStudentPlan, InsertStudentPlanPayment, InsertUser, StudentPlan, StudentPlanCourseAdjustment, StudentPlanPayment, StudentPortalAccess, InsertStudentPortalAccess, WorkshopWaitlist, InsertWorkshopWaitlist, availabilityBlocks, bookingRequests, financialTransactions, googleCalendarConnections, studentPlanPayments, studentPlans, studentPlanCourseAdjustments, studentPortalAccess, workshopWaitlist, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBookingRequest(
  request: InsertBookingRequest,
): Promise<BookingRequest> {
  const db = await getDb();
  if (!db) {
    throw new Error("La base de données n'est pas disponible");
  }

  const result = await db.insert(bookingRequests).values(request);
  const insertedId = Number(result[0].insertId);
  const created = await db.select().from(bookingRequests).where(eq(bookingRequests.id, insertedId)).limit(1);

  if (!created[0]) {
    throw new Error("La demande de réservation n'a pas pu être relue après son enregistrement");
  }

  return created[0];
}

export async function listBookingRequests(): Promise<BookingRequest[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("La base de données n'est pas disponible");
  }

  return db.select().from(bookingRequests).orderBy(desc(bookingRequests.createdAt));
}

export async function updateBookingRequestStatus(
  id: number,
  status: BookingRequest["status"],
): Promise<BookingRequest | undefined> {
  const db = await getDb();
  if (!db) {
    throw new Error("La base de données n'est pas disponible");
  }

  await db.update(bookingRequests).set({ status }).where(eq(bookingRequests.id, id));
  const updated = await db.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
  return updated[0];
}

export async function updateBookingAttendanceStatus(
  id: number,
  attendanceStatus: BookingRequest["attendanceStatus"],
): Promise<BookingRequest | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  await db.update(bookingRequests).set({ attendanceStatus }).where(eq(bookingRequests.id, id));
  const updated = await db.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
  return updated[0];
}


function normalizePersonValue(value: string | null | undefined) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

export async function recordBookingAttendancePresent(id: number): Promise<{ booking: BookingRequest; deducted: boolean; studentPlanId: number | null }> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.transaction(async (tx) => {
    const rows = await tx.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
    const booking = rows[0];
    if (!booking) throw new Error("Réservation introuvable.");
    if (booking.attendanceStatus !== "pending") return { booking, deducted: Boolean(booking.attendanceCourseDeducted), studentPlanId: booking.attendanceStudentPlanId ?? null };
    const plans = await tx.select().from(studentPlans);
    const name = normalizePersonValue(booking.name);
    const email = normalizePersonValue(booking.email);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const candidates = plans.filter((plan) => {
      if (plan.planType === "annual" || plan.totalCourses <= 0 || plan.usedCourses >= plan.totalCourses) return false;
      if (plan.expiresDate && new Date(plan.expiresDate).getTime() < today.getTime()) return false;
      const sameEmail = Boolean(email && normalizePersonValue(plan.email) === email);
      const sameName = normalizePersonValue(plan.studentName) === name || normalizePersonValue(plan.secondaryStudentName) === name;
      return sameEmail || sameName;
    }).sort((a, b) => Number(normalizePersonValue(b.email) === email) - Number(normalizePersonValue(a.email) === email));
    const plan = candidates[0];
    if (plan) {
      const nextUsed = Math.min(plan.totalCourses, plan.usedCourses + 1);
      await tx.update(studentPlans).set({ usedCourses: nextUsed }).where(eq(studentPlans.id, plan.id));
      await tx.insert(studentPlanCourseAdjustments).values({ studentPlanId: plan.id, action: "reduce", previousUsedCourses: plan.usedCourses, nextUsedCourses: nextUsed });
    }
    await tx.update(bookingRequests).set({ attendanceStatus: "present", attendanceStudentPlanId: plan?.id ?? null, attendanceCourseDeducted: plan ? 1 : 0 }).where(eq(bookingRequests.id, id));
    const updated = await tx.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
    return { booking: updated[0]!, deducted: Boolean(plan), studentPlanId: plan?.id ?? null };
  });
}

export async function restoreBookingAttendanceDeduction(id: number): Promise<BookingRequest | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.transaction(async (tx) => {
    const rows = await tx.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
    const booking = rows[0];
    if (!booking || booking.attendanceStatus !== "present" || !booking.attendanceCourseDeducted || !booking.attendanceStudentPlanId) return booking;
    const planRows = await tx.select().from(studentPlans).where(eq(studentPlans.id, booking.attendanceStudentPlanId)).limit(1);
    const plan = planRows[0];
    if (plan && plan.usedCourses > 0) {
      const nextUsed = plan.usedCourses - 1;
      await tx.update(studentPlans).set({ usedCourses: nextUsed }).where(eq(studentPlans.id, plan.id));
      await tx.insert(studentPlanCourseAdjustments).values({ studentPlanId: plan.id, action: "restore", previousUsedCourses: plan.usedCourses, nextUsedCourses: nextUsed });
    }
    await tx.update(bookingRequests).set({ attendanceCourseDeducted: 0 }).where(eq(bookingRequests.id, id));
    const updated = await tx.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
    return updated[0];
  });
}

export async function updateBookingContactDetails(id: number, input: { name: string; email: string | null; phone: string }): Promise<BookingRequest | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  await db.update(bookingRequests).set(input).where(eq(bookingRequests.id, id));
  const updated = await db.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
  return updated[0];
}

export async function updateBookingInternalNote(id: number, internalNote: string | null): Promise<BookingRequest | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  await db.update(bookingRequests).set({ internalNote }).where(eq(bookingRequests.id, id));
  const updated = await db.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
  return updated[0];
}

export async function deleteBookingRequest(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("La base de données n'est pas disponible");
  }

  const result = await db.delete(bookingRequests).where(eq(bookingRequests.id, id));
  return Number(result[0].affectedRows ?? 0) > 0;
}

export async function getBookingRequest(id: number): Promise<BookingRequest | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
  return result[0];
}

export async function getBookingsForCollectiveSlot(
  preferredDate: Date,
  preferredSlot: "wednesday" | "friday",
): Promise<BookingRequest[]> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.select().from(bookingRequests).where(
    and(
      eq(bookingRequests.preferredDate, preferredDate),
      eq(bookingRequests.preferredSlot, preferredSlot),
      eq(bookingRequests.requestType, "first_course"),
      eq(bookingRequests.status, "confirmed"),
    ),
  );
}

export async function listConfirmedCollectiveBookingsBetween(startDate: Date, endDate: Date): Promise<BookingRequest[]> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.select().from(bookingRequests).where(and(
    eq(bookingRequests.requestType, "first_course"),
    eq(bookingRequests.status, "confirmed"),
    gte(bookingRequests.preferredDate, startDate),
    lt(bookingRequests.preferredDate, endDate),
  ));
}

export async function findDuplicateCollectiveBooking(input: {
  preferredDate: Date;
  preferredSlot: "wednesday" | "friday";
  phone: string;
  email?: string;
}): Promise<BookingRequest | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const candidates = await db.select().from(bookingRequests).where(
    and(
      eq(bookingRequests.preferredDate, input.preferredDate),
      eq(bookingRequests.preferredSlot, input.preferredSlot),
      eq(bookingRequests.requestType, "first_course"),
    ),
  );
  const normalizedPhone = input.phone.replace(/\D/g, "");
  const normalizedEmail = input.email?.trim().toLowerCase();
  return candidates.find((candidate) => {
    if (candidate.status === "declined") return false;
    const samePhone = candidate.phone.replace(/\D/g, "") === normalizedPhone;
    const sameEmail = Boolean(normalizedEmail && candidate.email?.trim().toLowerCase() === normalizedEmail);
    return samePhone || sameEmail;
  });
}

export async function updateBookingCalendarMetadata(
  id: number,
  metadata: Pick<BookingRequest, "googleEventId" | "googleCalendarSyncedAt" | "googleCalendarSyncError">,
): Promise<BookingRequest | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  await db.update(bookingRequests).set(metadata).where(eq(bookingRequests.id, id));
  const updated = await db.select().from(bookingRequests).where(eq(bookingRequests.id, id)).limit(1);
  return updated[0];
}

export async function getGoogleCalendarConnection(accountEmail: string) {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.select().from(googleCalendarConnections).where(eq(googleCalendarConnections.accountEmail, accountEmail)).limit(1);
  return result[0];
}

export async function saveGoogleCalendarConnection(input: {
  accountEmail: string;
  calendarId: string;
  encryptedRefreshToken: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  await db.insert(googleCalendarConnections).values(input).onDuplicateKeyUpdate({
    set: {
      calendarId: input.calendarId,
      encryptedRefreshToken: input.encryptedRefreshToken,
      updatedAt: new Date(),
    },
  });
  return getGoogleCalendarConnection(input.accountEmail);
}

export async function listAvailabilityBlocks(): Promise<AvailabilityBlock[]> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.select().from(availabilityBlocks).orderBy(asc(availabilityBlocks.blockDate), asc(availabilityBlocks.startTime));
}

export async function createAvailabilityBlock(input: { blockDate: Date; bookingType?: "phone_call" | "individual_course"; startTime?: string | null; reason?: string | null }): Promise<AvailabilityBlock> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.insert(availabilityBlocks).values({
    blockDate: input.blockDate,
    bookingType: input.bookingType || "phone_call",
    startTime: input.startTime || null,
    reason: input.reason || null,
  });
  const insertedId = Number(result[0].insertId);
  const created = await db.select().from(availabilityBlocks).where(eq(availabilityBlocks.id, insertedId)).limit(1);
  if (!created[0]) throw new Error("Le créneau bloqué n'a pas pu être relu après son enregistrement");
  return created[0];
}

export async function deleteAvailabilityBlock(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.delete(availabilityBlocks).where(eq(availabilityBlocks.id, id));
  return Number(result[0].affectedRows ?? 0) > 0;
}

export async function isAvailabilityBlocked(blockDate: Date, startTime: string, bookingType: "phone_call" | "individual_course" = "phone_call"): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.select({ id: availabilityBlocks.id }).from(availabilityBlocks).where(
    and(
      eq(availabilityBlocks.blockDate, blockDate),
      eq(availabilityBlocks.bookingType, bookingType),
      or(eq(availabilityBlocks.startTime, startTime), isNull(availabilityBlocks.startTime)),
    ),
  ).limit(1);
  return result.length > 0;
}

export async function listFinancialTransactions(): Promise<FinancialTransaction[]> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.select().from(financialTransactions).orderBy(desc(financialTransactions.transactionDate), desc(financialTransactions.id));
}

export async function createFinancialTransaction(
  input: Omit<InsertFinancialTransaction, "id" | "createdAt" | "updatedAt">,
): Promise<FinancialTransaction> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.insert(financialTransactions).values(input);
  const insertedId = Number(result[0].insertId);
  const created = await db.select().from(financialTransactions).where(eq(financialTransactions.id, insertedId)).limit(1);
  if (!created[0]) throw new Error("L'opération financière n'a pas pu être relue après son enregistrement");
  return created[0];
}

export async function updateFinancialTransaction(
  id: number,
  input: Omit<InsertFinancialTransaction, "id" | "createdAt" | "updatedAt">,
): Promise<FinancialTransaction | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  await db.update(financialTransactions).set(input).where(eq(financialTransactions.id, id));
  const updated = await db.select().from(financialTransactions).where(eq(financialTransactions.id, id)).limit(1);
  return updated[0];
}

export async function deleteFinancialTransaction(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.delete(financialTransactions).where(eq(financialTransactions.id, id));
  return Number(result[0].affectedRows ?? 0) > 0;
}

export async function getStudentPlanById(id: number): Promise<StudentPlan | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(studentPlans).where(eq(studentPlans.id, id)).limit(1);
  return rows[0];
}

export async function createStudentPortalAccess(input: Omit<InsertStudentPortalAccess, "id" | "createdAt">): Promise<StudentPortalAccess> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(studentPortalAccess).where(eq(studentPortalAccess.studentPlanId, input.studentPlanId));
  const result = await db.insert(studentPortalAccess).values(input);
  const rows = await db.select().from(studentPortalAccess).where(eq(studentPortalAccess.id, Number(result[0].insertId))).limit(1);
  if (!rows[0]) throw new Error("Student portal access was not created");
  return rows[0];
}

export async function getStudentPortalAccessByTokenHash(tokenHash: string): Promise<StudentPortalAccess | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(studentPortalAccess).where(eq(studentPortalAccess.tokenHash, tokenHash)).limit(1);
  return rows[0];
}

export async function getStudentPortalAccessById(id: number): Promise<StudentPortalAccess | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(studentPortalAccess).where(eq(studentPortalAccess.id, id)).limit(1);
  return rows[0];
}

export async function touchStudentPortalAccess(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(studentPortalAccess).set({ lastAccessAt: new Date() }).where(eq(studentPortalAccess.id, id));
}

export async function revokeStudentPortalAccess(studentPlanId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(studentPortalAccess).set({ revokedAt: new Date() }).where(eq(studentPortalAccess.studentPlanId, studentPlanId));
}

export async function listStudentPlans(): Promise<StudentPlan[]> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.select().from(studentPlans).orderBy(asc(studentPlans.studentName));
}

export async function createStudentPlan(input: Omit<InsertStudentPlan, "id" | "createdAt" | "updatedAt">): Promise<StudentPlan> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.insert(studentPlans).values(input);
  const created = await db.select().from(studentPlans).where(eq(studentPlans.id, Number(result[0].insertId))).limit(1);
  if (!created[0]) throw new Error("La formule élève n'a pas pu être relue après son enregistrement");
  return created[0];
}

export async function updateStudentPlan(id: number, input: Omit<InsertStudentPlan, "id" | "createdAt" | "updatedAt">): Promise<StudentPlan | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  await db.update(studentPlans).set(input).where(eq(studentPlans.id, id));
  const updated = await db.select().from(studentPlans).where(eq(studentPlans.id, id)).limit(1);
  return updated[0];
}

export async function adjustStudentPlanCourses(id: number, delta: number): Promise<StudentPlan | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const existing = await db.select().from(studentPlans).where(eq(studentPlans.id, id)).limit(1);
  const plan = existing[0];
  if (!plan || plan.planType === "annual") return plan;
  const nextUsed = Math.max(0, Math.min(plan.totalCourses, plan.usedCourses + delta));
  if (nextUsed !== plan.usedCourses) {
    await db.update(studentPlans).set({ usedCourses: nextUsed }).where(eq(studentPlans.id, id));
    await db.insert(studentPlanCourseAdjustments).values({
      studentPlanId: id,
      action: delta > 0 ? "reduce" : "restore",
      previousUsedCourses: plan.usedCourses,
      nextUsedCourses: nextUsed,
    });
  }
  const updated = await db.select().from(studentPlans).where(eq(studentPlans.id, id)).limit(1);
  return updated[0];
}

export async function listStudentPlanCourseAdjustments(): Promise<StudentPlanCourseAdjustment[]> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.select().from(studentPlanCourseAdjustments).orderBy(desc(studentPlanCourseAdjustments.createdAt), desc(studentPlanCourseAdjustments.id));
}

export async function listStudentPlanPayments(): Promise<StudentPlanPayment[]> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.select().from(studentPlanPayments).orderBy(desc(studentPlanPayments.paymentDate), desc(studentPlanPayments.id));
}

export async function createStudentPlanPayment(input: Omit<InsertStudentPlanPayment, "id" | "createdAt">): Promise<StudentPlanPayment> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.insert(studentPlanPayments).values(input);
  const created = await db.select().from(studentPlanPayments).where(eq(studentPlanPayments.id, Number(result[0].insertId))).limit(1);
  if (!created[0]) throw new Error("Le versement n'a pas pu être relu après son enregistrement");
  return created[0];
}

export async function deleteStudentPlanPayment(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.delete(studentPlanPayments).where(eq(studentPlanPayments.id, id));
  return Number(result[0].affectedRows ?? 0) > 0;
}

export async function deleteStudentPlan(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.delete(studentPlans).where(eq(studentPlans.id, id));
  return Number(result[0].affectedRows ?? 0) > 0;
}

// Feature queries belong here as the application grows.

export async function findWorkshopWaitlistByEmail(email: string): Promise<WorkshopWaitlist | undefined> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const rows = await db.select().from(workshopWaitlist).where(eq(workshopWaitlist.email, email)).limit(1);
  return rows[0];
}
export async function createWorkshopWaitlistEntry(input: Omit<InsertWorkshopWaitlist, "id" | "createdAt">): Promise<WorkshopWaitlist> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  const result = await db.insert(workshopWaitlist).values(input);
  const rows = await db.select().from(workshopWaitlist).where(eq(workshopWaitlist.id, Number(result[0].insertId))).limit(1);
  if (!rows[0]) throw new Error("L'inscription à la liste d'attente n'a pas pu être relue après son enregistrement");
  return rows[0];
}

export async function listWorkshopWaitlist(): Promise<WorkshopWaitlist[]> {
  const db = await getDb();
  if (!db) throw new Error("La base de données n'est pas disponible");
  return db.select().from(workshopWaitlist).orderBy(desc(workshopWaitlist.createdAt), desc(workshopWaitlist.id));
}
