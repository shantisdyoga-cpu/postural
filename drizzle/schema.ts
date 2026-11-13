import { date, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Public requests for a first class, an individual course, or a general question.
 * Requests remain private and are reviewed manually by David before confirmation.
 */
export const bookingRequests = mysqlTable("booking_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 30 }).notNull(),
  requestType: mysqlEnum("requestType", ["first_course", "individual_course", "phone_call", "question"]).default("first_course").notNull(),
  preferredSlot: mysqlEnum("preferredSlot", ["wednesday", "friday", "either", "tuesday", "thursday", "saturday"]).default("either").notNull(),
  preferredDate: date("preferred_date"),
  preferredTime: varchar("preferred_time", { length: 5 }),
  durationMinutes: int("duration_minutes").default(60).notNull(),
  message: text("message"),
  internalNote: text("internal_note"),
  status: mysqlEnum("status", ["pending", "confirmed", "declined"]).default("pending").notNull(),
  attendanceStatus: mysqlEnum("attendance_status", ["pending", "present", "absent_excused", "absent_unexcused"]).default("pending").notNull(),
  attendanceStudentPlanId: int("attendance_student_plan_id"),
  attendanceCourseDeducted: int("attendance_course_deducted").default(0).notNull(),
  googleEventId: varchar("google_event_id", { length: 255 }),
  googleCalendarSyncedAt: timestamp("google_calendar_synced_at"),
  googleCalendarSyncError: text("google_calendar_sync_error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const workshopWaitlist = mysqlTable("workshop_waitlist", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type WorkshopWaitlist = typeof workshopWaitlist.$inferSelect;
export type InsertWorkshopWaitlist = typeof workshopWaitlist.$inferInsert;
/**
 * One encrypted Google OAuth refresh token for David's target calendar.
 * The refresh token is encrypted before persistence and never exposed to the client.
 */
export const availabilityBlocks = mysqlTable("availability_blocks", {
  id: int("id").autoincrement().primaryKey(),
  blockDate: date("block_date").notNull(),
  bookingType: mysqlEnum("booking_type", ["phone_call", "individual_course"]).default("phone_call").notNull(),
  startTime: varchar("start_time", { length: 5 }),
  reason: varchar("reason", { length: 240 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  dateTimeUnique: uniqueIndex("availability_blocks_date_type_time_unique").on(table.blockDate, table.bookingType, table.startTime),
}));

export const financialTransactions = mysqlTable("financial_transactions", {
  id: int("id").autoincrement().primaryKey(),
  transactionDate: date("transaction_date").notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  amountCents: int("amount_cents").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  paymentMethod: mysqlEnum("payment_method", ["cash", "bank_transfer", "card", "cheque", "direct_debit", "other"]).default("bank_transfer").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const studentPlans = mysqlTable("student_plans", {
  id: int("id").autoincrement().primaryKey(),
  studentName: varchar("student_name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 30 }),
  planType: mysqlEnum("plan_type", ["single", "five", "ten", "annual", "annual_solo", "annual_duo", "monthly_solo", "monthly_duo", "ten_solo", "ten_duo", "twenty_duo"]).notNull(),
  secondaryStudentName: varchar("secondary_student_name", { length: 120 }),
  payerName: varchar("payer_name", { length: 120 }),
  amountCents: int("amount_cents").notNull(),
  paymentStatus: mysqlEnum("payment_status", ["pending", "paid"]).default("pending").notNull(),
  paymentPlan: mysqlEnum("payment_plan", ["one", "two", "three"]).default("one").notNull(),
  paymentMethod: mysqlEnum("payment_method", ["cash", "bank_transfer", "card", "cheque", "direct_debit", "other"]).default("bank_transfer").notNull(),
  paidDate: date("paid_date"),
  expiresDate: date("expires_date"),
  totalCourses: int("total_courses").default(0).notNull(),
  usedCourses: int("used_courses").default(0).notNull(),
  internalNote: text("internal_note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentPlan = typeof studentPlans.$inferSelect;
export type InsertStudentPlan = typeof studentPlans.$inferInsert;

export const studentPlanPayments = mysqlTable("student_plan_payments", {
  id: int("id").autoincrement().primaryKey(),
  studentPlanId: int("student_plan_id").notNull(),
  amountCents: int("amount_cents").notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentMethod: mysqlEnum("payment_method", ["cash", "bank_transfer", "card", "cheque", "direct_debit", "other"]).default("bank_transfer").notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type StudentPlanPayment = typeof studentPlanPayments.$inferSelect;
export type InsertStudentPlanPayment = typeof studentPlanPayments.$inferInsert;

export const studentPlanCourseAdjustments = mysqlTable("student_plan_course_adjustments", {
  id: int("id").autoincrement().primaryKey(),
  studentPlanId: int("student_plan_id").notNull(),
  action: mysqlEnum("action", ["reduce", "restore"]).notNull(),
  previousUsedCourses: int("previous_used_courses").notNull(),
  nextUsedCourses: int("next_used_courses").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type StudentPlanCourseAdjustment = typeof studentPlanCourseAdjustments.$inferSelect;
export type InsertStudentPlanCourseAdjustment = typeof studentPlanCourseAdjustments.$inferInsert;

/**
 * Revocable, expiring access links for the student portal.
 * Only the SHA-256 token hash is persisted; raw access tokens are never stored.
 */
export const studentPortalAccess = mysqlTable("student_portal_access", {
  id: int("id").autoincrement().primaryKey(),
  studentPlanId: int("student_plan_id").notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  lastAccessAt: timestamp("last_access_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type StudentPortalAccess = typeof studentPortalAccess.$inferSelect;
export type InsertStudentPortalAccess = typeof studentPortalAccess.$inferInsert;

export const googleCalendarConnections = mysqlTable("google_calendar_connections", {
  id: int("id").autoincrement().primaryKey(),
  accountEmail: varchar("account_email", { length: 320 }).notNull().unique(),
  calendarId: varchar("calendar_id", { length: 255 }).default("primary").notNull(),
  encryptedRefreshToken: text("encrypted_refresh_token").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type BookingRequest = typeof bookingRequests.$inferSelect;
export type InsertBookingRequest = typeof bookingRequests.$inferInsert;
export type AvailabilityBlock = typeof availabilityBlocks.$inferSelect;
export type InsertAvailabilityBlock = typeof availabilityBlocks.$inferInsert;
export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertFinancialTransaction = typeof financialTransactions.$inferInsert;
