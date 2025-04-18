import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid, date, numeric, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll define the performance obligations after the contracts table to avoid circular references

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("user").notNull(),
  companyId: integer("company_id"),
  tenantId: integer("tenant_id").references(() => tenants.id),
  status: text("status").default("active"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  companyId: true,
  tenantId: true,
  status: true,
});

// Tenants table
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  plan: text("plan").default("basic").notNull(),
  status: text("status").default("active").notNull(),
  maxUsers: integer("max_users").default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  settings: jsonb("settings").default({}).notNull(),
});

export const insertTenantSchema = createInsertSchema(tenants).pick({
  name: true,
  subdomain: true,
  plan: true,
  status: true,
  maxUsers: true,
  settings: true,
});

// Companies table - now connected to tenants
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  industry: text("industry"),
  size: text("size"),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  name: true,
  tenantId: true,
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
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  createdBy: integer("created_by").notNull(),
  fileUrl: text("file_url"),
  // IFRS 15/ASC 606 specific fields
  ifrsCompliant: boolean("ifrs_compliant").default(true),
  revenueRecognitionMethod: text("revenue_recognition_method", { 
    enum: ["point_in_time", "over_time", "milestone", "percentage_of_completion", "manual"] 
  }),
  contractType: text("contract_type", { 
    enum: ["fixed_price", "time_material", "subscription", "license", "hybrid", "other"] 
  }),
  completionPercentage: numeric("completion_percentage", { precision: 5, scale: 2 }),
  totalTransactionPrice: numeric("total_transaction_price", { precision: 10, scale: 2 }),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }),
  containsVariableConsideration: boolean("contains_variable_consideration").default(false),
  containsSignificantFinancingComponent: boolean("contains_significant_financing_component").default(false),
  hasMultiplePerformanceObligations: boolean("has_multiple_performance_obligations").default(false),
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
    tenantId: true,
    createdBy: true,
    fileUrl: true,
    // IFRS 15/ASC 606 fields
    ifrsCompliant: true,
    revenueRecognitionMethod: true,
    contractType: true,
    completionPercentage: true,
    totalTransactionPrice: true,
    discountAmount: true,
    containsVariableConsideration: true,
    containsSignificantFinancingComponent: true,
    hasMultiplePerformanceObligations: true,
  })
  .transform((data) => {
    // Ensure dates are properly formatted
    if (data.startDate && typeof data.startDate === 'string') {
      data.startDate = new Date(data.startDate);
    }
    if (data.endDate && typeof data.endDate === 'string') {
      data.endDate = new Date(data.endDate);
    }
    
    // Convert numeric string values to numbers if needed
    if (data.completionPercentage && typeof data.completionPercentage === 'string') {
      data.completionPercentage = parseFloat(data.completionPercentage);
    }
    if (data.totalTransactionPrice && typeof data.totalTransactionPrice === 'string') {
      data.totalTransactionPrice = parseFloat(data.totalTransactionPrice);
    }
    if (data.discountAmount && typeof data.discountAmount === 'string') {
      data.discountAmount = parseFloat(data.discountAmount);
    }
    
    // Ensure all required fields have default values
    data.ifrsCompliant = data.ifrsCompliant ?? true;
    
    return data;
  });

// IFRS 15/ASC 606 Step 2: Performance Obligations table
export const performanceObligations = pgTable("performance_obligations", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull().references(() => contracts.id),
  name: text("name").notNull(),
  description: text("description"),
  standaloneSellingPrice: numeric("standalone_selling_price", { precision: 10, scale: 2 }),
  allocationPercentage: numeric("allocation_percentage", { precision: 5, scale: 2 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: text("status", { enum: ["active", "completed", "cancelled"] }).default("active").notNull(),
  recognitionMethod: text("recognition_method", { 
    enum: ["point_in_time", "over_time", "output_method", "input_method"] 
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPerformanceObligationSchema = createInsertSchema(performanceObligations).pick({
  contractId: true,
  name: true,
  description: true,
  standaloneSellingPrice: true,
  allocationPercentage: true,
  startDate: true,
  endDate: true,
  status: true,
  recognitionMethod: true,
})
.transform((data) => {
  // Ensure dates are properly formatted
  if (data.startDate && typeof data.startDate === 'string') {
    data.startDate = new Date(data.startDate);
  }
  if (data.endDate && typeof data.endDate === 'string') {
    data.endDate = new Date(data.endDate);
  }
  
  // Convert numeric string values to numbers
  if (data.standaloneSellingPrice && typeof data.standaloneSellingPrice === 'string') {
    data.standaloneSellingPrice = parseFloat(data.standaloneSellingPrice);
  }
  if (data.allocationPercentage && typeof data.allocationPercentage === 'string') {
    data.allocationPercentage = parseFloat(data.allocationPercentage);
  }
  
  return data;
});

// IFRS 15/ASC 606 Step 3: Transaction Price Adjustments table
export const transactionPriceAdjustments = pgTable("transaction_price_adjustments", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull().references(() => contracts.id),
  adjustmentType: text("adjustment_type", { 
    enum: ["variable_consideration", "significant_financing", "non_cash", "payable_to_customer", "other"] 
  }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  adjustmentDate: timestamp("adjustment_date").notNull(),
  probability: numeric("probability", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionPriceAdjustmentSchema = createInsertSchema(transactionPriceAdjustments).pick({
  contractId: true,
  adjustmentType: true,
  amount: true,
  description: true,
  adjustmentDate: true,
  probability: true,
})
.transform((data) => {
  // Ensure dates are properly formatted
  if (data.adjustmentDate && typeof data.adjustmentDate === 'string') {
    data.adjustmentDate = new Date(data.adjustmentDate);
  }
  
  // Convert numeric string values to numbers
  if (data.amount && typeof data.amount === 'string') {
    data.amount = parseFloat(data.amount);
  }
  if (data.probability && typeof data.probability === 'string') {
    data.probability = parseFloat(data.probability);
  }
  
  return data;
});

// Revenue records - Enhanced for IFRS 15/ASC 606 compliance
export const revenueRecords = pgTable("revenue_records", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull().references(() => contracts.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  recognitionDate: timestamp("recognition_date").notNull(),
  description: text("description"),
  status: text("status", { enum: ["pending", "recognized", "adjusted", "reversed"] }).default("pending").notNull(),
  // IFRS 15/ASC 606 specific fields
  performanceObligationId: integer("performance_obligation_id").references(() => performanceObligations.id),
  recognitionMethod: text("recognition_method", { 
    enum: ["point_in_time", "over_time", "output_method", "input_method", "manual"] 
  }),
  recognitionReason: text("recognition_reason"),
  allocationAmount: numeric("allocation_amount", { precision: 10, scale: 2 }),
  recognitionPercentage: numeric("recognition_percentage", { precision: 5, scale: 2 }),
  revenueType: text("revenue_type", {
    enum: ["service", "product", "license", "subscription", "maintenance", "usage_based", "other"]
  }),
  adjustmentType: text("adjustment_type", {
    enum: ["initial", "correction", "constraint", "variable_consideration", "refund", "other", "none"]
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRevenueRecordSchema = createInsertSchema(revenueRecords).pick({
  contractId: true,
  amount: true,
  recognitionDate: true,
  description: true,
  status: true,
  performanceObligationId: true,
  recognitionMethod: true,
  recognitionReason: true,
  allocationAmount: true,
  recognitionPercentage: true,
  revenueType: true,
  adjustmentType: true,
})
.transform((data) => {
  // Ensure dates are properly formatted
  if (data.recognitionDate && typeof data.recognitionDate === 'string') {
    data.recognitionDate = new Date(data.recognitionDate);
  }
  
  // Convert numeric string values to numbers if needed
  if (data.amount && typeof data.amount === 'string') {
    data.amount = parseFloat(data.amount);
  }
  if (data.allocationAmount && typeof data.allocationAmount === 'string') {
    data.allocationAmount = parseFloat(data.allocationAmount);
  }
  if (data.recognitionPercentage && typeof data.recognitionPercentage === 'string') {
    data.recognitionPercentage = parseFloat(data.recognitionPercentage);
  }
  
  return data;
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
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate: true,
  priority: true,
  status: true,
  assignedTo: true,
  companyId: true,
  tenantId: true,
});

// Export types for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type RevenueRecord = typeof revenueRecords.$inferSelect;
export type InsertRevenueRecord = z.infer<typeof insertRevenueRecordSchema>;

export type PerformanceObligation = typeof performanceObligations.$inferSelect;
export type InsertPerformanceObligation = z.infer<typeof insertPerformanceObligationSchema>;

export type TransactionPriceAdjustment = typeof transactionPriceAdjustments.$inferSelect;
export type InsertTransactionPriceAdjustment = z.infer<typeof insertTransactionPriceAdjustmentSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
