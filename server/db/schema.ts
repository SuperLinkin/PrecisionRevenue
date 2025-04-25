import { pgTable, serial, text, timestamp, boolean, integer, json, real, pgEnum } from 'drizzle-orm/pg-core';

// Define contract status enum
export const contractStatusEnum = pgEnum('contract_status', [
  'draft',
  'pending_review',
  'approved',
  'rejected',
  'active',
  'completed',
  'terminated'
]);

// Define contract type enum
export const contractTypeEnum = pgEnum('contract_type', [
  'fixed_price',
  'time_material',
  'subscription',
  'license',
  'hybrid',
  'other'
]);

// Define revenue recognition method enum
export const revenueRecognitionMethodEnum = pgEnum('revenue_recognition_method', [
  'point_in_time',
  'over_time',
  'milestone',
  'percentage_of_completion',
  'manual'
]);

// Define contracts table
export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  contractNumber: text('contract_number').notNull(),
  clientName: text('client_name').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  value: real('value').notNull(),
  status: contractStatusEnum('status').notNull().default('draft'),
  companyId: integer('company_id').notNull(),
  tenantId: integer('tenant_id'),
  createdBy: integer('created_by').notNull(),
  fileUrl: text('file_url'),
  ifrsCompliant: boolean('ifrs_compliant').notNull().default(true),
  revenueRecognitionMethod: revenueRecognitionMethodEnum('revenue_recognition_method').default('over_time'),
  contractType: contractTypeEnum('contract_type').default('fixed_price'),
  completionPercentage: real('completion_percentage'),
  totalTransactionPrice: real('total_transaction_price'),
  discountAmount: real('discount_amount'),
  containsVariableConsideration: boolean('contains_variable_consideration').notNull().default(false),
  containsSignificantFinancingComponent: boolean('contains_significant_financing_component').notNull().default(false),
  hasMultiplePerformanceObligations: boolean('has_multiple_performance_obligations').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Define contract embeddings table
export const contractEmbeddings = pgTable('contract_embeddings', {
  id: serial('id').primaryKey(),
  contractId: integer('contract_id').references(() => contracts.id).notNull(),
  sectionTitle: text('section_title').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull(),
  embedding: real('embedding').array().notNull(),
  metadata: json('metadata').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}); 