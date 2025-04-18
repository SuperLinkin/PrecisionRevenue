import { 
  users, type User, type InsertUser,
  companies, type Company, type InsertCompany,
  contracts, type Contract, type InsertContract,
  revenueRecords, type RevenueRecord, type InsertRevenueRecord,
  tasks, type Task, type InsertTask,
  performanceObligations, type PerformanceObligation, type InsertPerformanceObligation,
  transactionPriceAdjustments, type TransactionPriceAdjustment, type InsertTransactionPriceAdjustment
} from "@shared/schema";
import { db } from './db';
import { eq } from 'drizzle-orm';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: insertUser.role || 'user',
        fullName: insertUser.fullName || null,
        companyId: insertUser.companyId || null,
      })
      .returning();
    return user;
  }
  
  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }
  
  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values({
        ...insertCompany,
        industry: insertCompany.industry || null,
        size: insertCompany.size || null,
        address: insertCompany.address || null,
        phone: insertCompany.phone || null,
        website: insertCompany.website || null,
      })
      .returning();
    return company;
  }
  
  async updateCompany(id: number, companyUpdate: Partial<InsertCompany>): Promise<Company | undefined> {
    const [updatedCompany] = await db
      .update(companies)
      .set(companyUpdate)
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }
  
  // Contract methods
  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract;
  }
  
  async getContractsByCompany(companyId: number): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.companyId, companyId));
  }
  
  async createContract(insertContract: InsertContract): Promise<Contract> {
    const [contract] = await db
      .insert(contracts)
      .values({
        ...insertContract,
        status: insertContract.status || 'draft',
        endDate: insertContract.endDate || null,
        fileUrl: insertContract.fileUrl || '',
        contractType: insertContract.contractType || null,
        discounts: insertContract.discounts || 0,
        currency: insertContract.currency || 'USD',
        termsAccepted: insertContract.termsAccepted || false,
        hasMultiplePerformanceObligations: insertContract.hasMultiplePerformanceObligations || null,
      })
      .returning();
    return contract;
  }
  
  async updateContract(id: number, contractUpdate: Partial<InsertContract>): Promise<Contract | undefined> {
    const [updatedContract] = await db
      .update(contracts)
      .set(contractUpdate)
      .where(eq(contracts.id, id))
      .returning();
    return updatedContract;
  }
  
  // Revenue Record methods
  async getRevenueRecord(id: number): Promise<RevenueRecord | undefined> {
    const [record] = await db.select().from(revenueRecords).where(eq(revenueRecords.id, id));
    return record;
  }
  
  async getRevenueRecordsByContract(contractId: number): Promise<RevenueRecord[]> {
    return await db
      .select()
      .from(revenueRecords)
      .where(eq(revenueRecords.contractId, contractId));
  }
  
  async createRevenueRecord(insertRecord: InsertRevenueRecord): Promise<RevenueRecord> {
    const now = new Date();
    const [record] = await db
      .insert(revenueRecords)
      .values({
        ...insertRecord,
        description: insertRecord.description || null,
        status: insertRecord.status || 'pending',
        performanceObligationId: insertRecord.performanceObligationId || null,
        recognitionMethod: insertRecord.recognitionMethod || null,
        recognitionReason: insertRecord.recognitionReason || null,
        revenueType: insertRecord.revenueType || null,
        recognitionPercentage: insertRecord.recognitionPercentage || null,
        adjustmentType: insertRecord.adjustmentType || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return record;
  }
  
  async updateRevenueRecord(id: number, recordUpdate: Partial<InsertRevenueRecord>): Promise<RevenueRecord | undefined> {
    const [updatedRecord] = await db
      .update(revenueRecords)
      .set({
        ...recordUpdate,
        updatedAt: new Date(),
      })
      .where(eq(revenueRecords.id, id))
      .returning();
    return updatedRecord;
  }
  
  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }
  
  async getTasksByCompany(companyId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.companyId, companyId));
  }
  
  async getTasksByAssignee(assignedTo: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.assignedTo, assignedTo));
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...insertTask,
        status: insertTask.status || null,
        description: insertTask.description || null,
        dueDate: insertTask.dueDate || null,
        priority: insertTask.priority || null,
        assignedTo: insertTask.assignedTo || null,
      })
      .returning();
    return task;
  }
  
  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }
}