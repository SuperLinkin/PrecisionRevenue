import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("user").notNull(),
  companyId: integer("company_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  companyId: true,
});

// Companies table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  size: text("size"),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  name: true,
  industry: true,
  size: true, 
  address: true,
  phone: true,
  website: true,
});

// Contracts table
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contractNumber: text("contract_number").notNull(),
  clientName: text("client_name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  value: integer("value").notNull(),
  status: text("status").default("draft").notNull(),
  companyId: integer("company_id").notNull(),
  createdBy: integer("created_by").notNull(),
  fileUrl: text("file_url"),
});

export const insertContractSchema = createInsertSchema(contracts)
  .pick({
    name: true,
    contractNumber: true,
    clientName: true,
    startDate: true,
    endDate: true,
    value: true,
    status: true,
    companyId: true,
    createdBy: true,
    fileUrl: true,
  })
  .transform((data) => {
    // Ensure dates are properly formatted
    if (data.startDate && typeof data.startDate === 'string') {
      data.startDate = new Date(data.startDate);
    }
    if (data.endDate && typeof data.endDate === 'string') {
      data.endDate = new Date(data.endDate);
    }
    return data;
  });

// Revenue records
export const revenueRecords = pgTable("revenue_records", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull(),
  amount: integer("amount").notNull(),
  recognitionDate: timestamp("recognition_date").notNull(),
  description: text("description"),
  status: text("status").default("pending").notNull(),
});

export const insertRevenueRecordSchema = createInsertSchema(revenueRecords).pick({
  contractId: true,
  amount: true,
  recognitionDate: true,
  description: true,
  status: true,
});

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  priority: text("priority").default("medium"),
  status: text("status").default("pending"),
  assignedTo: integer("assigned_to"),
  companyId: integer("company_id").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate: true,
  priority: true,
  status: true,
  assignedTo: true,
  companyId: true,
});

// Export types for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type RevenueRecord = typeof revenueRecords.$inferSelect;
export type InsertRevenueRecord = z.infer<typeof insertRevenueRecordSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
