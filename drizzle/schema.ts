import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Pacientes - Armazena informações de pacientes
 */
export const patients = mysqlTable("patients", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  birthDate: date("birthDate"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  height: int("height"),
  waist: int("waist"),
  bmi: decimal("bmi", { precision: 4, scale: 1 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

/**
 * Exames - Catálogo de tipos de exames
 */
export const exams = mysqlTable("exams", {
  name: varchar("name", { length: 100 }).primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  referenceMin: decimal("referenceMin", { precision: 10, scale: 2 }),
  referenceMax: decimal("referenceMax", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Exam = typeof exams.$inferSelect;
export type InsertExam = typeof exams.$inferInsert;

/**
 * Histórico de Exames - Resultados de exames ao longo do tempo
 */
export const examHistory = mysqlTable("exam_history", {
  id: int("id").autoincrement().primaryKey(),
  patientId: varchar("patientId", { length: 64 }).notNull(),
  examName: varchar("examName", { length: 100 }).notNull(),
  date: date("date").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["normal", "low", "high", "unknown"]).notNull(),
  sourceFile: text("sourceFile"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExamHistory = typeof examHistory.$inferSelect;
export type InsertExamHistory = typeof examHistory.$inferInsert;
