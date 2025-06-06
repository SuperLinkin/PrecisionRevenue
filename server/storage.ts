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
import { DatabaseStorage } from './db-storage';

// Interface for all storage operations
export interface IStorage {
  // Tenants
  getTenant(id: number): Promise<Tenant | undefined>;
  getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined>;
  getTenants(): Promise<Tenant[]>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, tenant: Partial<InsertTenant>): Promise<Tenant | undefined>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByTenant(tenantId: number): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Companies
  getCompany(id: number): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  getCompaniesByTenant(tenantId: number): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;
  
  // Contracts
  getContract(id: number): Promise<Contract | undefined>;
  getContractsByCompany(companyId: number): Promise<Contract[]>;
  getContractsByTenant(tenantId: number): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined>;
  
  // Revenue Records
  getRevenueRecord(id: number): Promise<RevenueRecord | undefined>;
  getRevenueRecordsByContract(contractId: number): Promise<RevenueRecord[]>;
  createRevenueRecord(record: InsertRevenueRecord): Promise<RevenueRecord>;
  updateRevenueRecord(id: number, record: Partial<InsertRevenueRecord>): Promise<RevenueRecord | undefined>;
  
  // Tasks
  getTask(id: number): Promise<Task | undefined>;
  getTasksByCompany(companyId: number): Promise<Task[]>;
  getTasksByAssignee(assignedTo: number): Promise<Task[]>;
  getTasksByTenant(tenantId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
}

export class MemStorage implements IStorage {
  private tenants: Map<number, Tenant>;
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private contracts: Map<number, Contract>;
  private revenueRecords: Map<number, RevenueRecord>;
  private tasks: Map<number, Task>;
  
  private tenantCurrentId: number;
  private userCurrentId: number;
  private companyCurrentId: number;
  private contractCurrentId: number;
  private revenueRecordCurrentId: number;
  private taskCurrentId: number;

  constructor() {
    this.tenants = new Map();
    this.users = new Map();
    this.companies = new Map();
    this.contracts = new Map();
    this.revenueRecords = new Map();
    this.tasks = new Map();
    
    this.tenantCurrentId = 1;
    this.userCurrentId = 1;
    this.companyCurrentId = 1;
    this.contractCurrentId = 1;
    this.revenueRecordCurrentId = 1;
    this.taskCurrentId = 1;
    
    // Create a default tenant
    this.createTenant({
      name: "PRA Demo Organization",
      subdomain: "demo",
      plan: "enterprise",
      status: "active",
      maxUsers: 25
    });
    
    // Add a default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@pra.com",
      fullName: "Admin User",
      role: "admin",
      companyId: 1
    });
    
    // Add a default company
    this.createCompany({
      name: "PRA Demo Company",
      industry: "Technology",
      size: "101-500",
      address: "123 Main St, San Francisco, CA",
      phone: "555-555-5555",
      website: "https://pra-demo.com"
    });
    
    // Add some demo contracts
    this.createContract({
      name: "SaaS Platform License",
      contractNumber: "CT-2023-8742",
      clientName: "Acme Corporation",
      startDate: new Date("2023-01-15"),
      endDate: new Date("2024-01-14"),
      value: 125000,
      status: "active",
      companyId: 1,
      createdBy: 1,
      fileUrl: ""
    });
    
    this.createContract({
      name: "Consulting Services",
      contractNumber: "CT-2023-8736",
      clientName: "TechGlobal Inc.",
      startDate: new Date("2023-01-10"),
      endDate: new Date("2023-07-10"),
      value: 85000,
      status: "pending",
      companyId: 1,
      createdBy: 1,
      fileUrl: ""
    });
    
    this.createContract({
      name: "Support Extension",
      contractNumber: "CT-2023-8729",
      clientName: "NexGen Solutions",
      startDate: new Date("2023-01-05"),
      endDate: new Date("2023-12-31"),
      value: 45000,
      status: "draft",
      companyId: 1,
      createdBy: 1,
      fileUrl: ""
    });
    
    // Add some demo tasks
    this.createTask({
      title: "Review Q1 Revenue Schedule",
      description: "Complete review of Q1 revenue recognition schedule and prepare for CFO approval",
      dueDate: new Date("2023-01-31"),
      priority: "high",
      status: "pending",
      assignedTo: 1,
      companyId: 1
    });
    
    this.createTask({
      title: "Approve Contract Amendments",
      description: "Review and approve amendments for TechGlobal contract",
      dueDate: new Date("2023-02-05"),
      priority: "medium",
      status: "pending",
      assignedTo: 1,
      companyId: 1
    });
    
    this.createTask({
      title: "Validate Performance Obligations",
      description: "Ensure all performance obligations are properly documented for new contracts",
      dueDate: new Date("2023-02-08"),
      priority: "low",
      status: "pending",
      assignedTo: 1,
      companyId: 1
    });
  }

  // Tenant methods
  async getTenant(id: number): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined> {
    return Array.from(this.tenants.values()).find(
      (tenant) => tenant.subdomain === subdomain,
    );
  }

  async getTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const id = this.tenantCurrentId++;
    const now = new Date();
    const tenant: Tenant = { 
      ...insertTenant, 
      id, 
      createdAt: now,
      updatedAt: now,
      settings: insertTenant.settings || {}
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async updateTenant(id: number, tenantUpdate: Partial<InsertTenant>): Promise<Tenant | undefined> {
    const existingTenant = this.tenants.get(id);
    if (!existingTenant) return undefined;
    
    const updatedTenant = { 
      ...existingTenant, 
      ...tenantUpdate,
      updatedAt: new Date()
    };
    this.tenants.set(id, updatedTenant);
    return updatedTenant;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getUsersByTenant(tenantId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.tenantId === tenantId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }
  
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }
  
  async getCompaniesByTenant(tenantId: number): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(
      company => company.tenantId === tenantId
    );
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.companyCurrentId++;
    const company: Company = { ...insertCompany, id };
    this.companies.set(id, company);
    return company;
  }
  
  async updateCompany(id: number, companyUpdate: Partial<InsertCompany>): Promise<Company | undefined> {
    const existingCompany = this.companies.get(id);
    if (!existingCompany) return undefined;
    
    const updatedCompany = { ...existingCompany, ...companyUpdate };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }
  
  // Contract methods
  async getContract(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }
  
  async getContractsByCompany(companyId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(
      contract => contract.companyId === companyId
    );
  }
  
  async getContractsByTenant(tenantId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(
      contract => contract.tenantId === tenantId
    );
  }
  
  async createContract(insertContract: InsertContract): Promise<Contract> {
    const id = this.contractCurrentId++;
    const contract: Contract = { ...insertContract, id };
    this.contracts.set(id, contract);
    return contract;
  }
  
  async updateContract(id: number, contractUpdate: Partial<InsertContract>): Promise<Contract | undefined> {
    const existingContract = this.contracts.get(id);
    if (!existingContract) return undefined;
    
    const updatedContract = { ...existingContract, ...contractUpdate };
    this.contracts.set(id, updatedContract);
    return updatedContract;
  }
  
  // Revenue record methods
  async getRevenueRecord(id: number): Promise<RevenueRecord | undefined> {
    return this.revenueRecords.get(id);
  }
  
  async getRevenueRecordsByContract(contractId: number): Promise<RevenueRecord[]> {
    return Array.from(this.revenueRecords.values()).filter(
      record => record.contractId === contractId
    );
  }
  
  async createRevenueRecord(insertRecord: InsertRevenueRecord): Promise<RevenueRecord> {
    const id = this.revenueRecordCurrentId++;
    const record: RevenueRecord = { ...insertRecord, id };
    this.revenueRecords.set(id, record);
    return record;
  }
  
  async updateRevenueRecord(id: number, recordUpdate: Partial<InsertRevenueRecord>): Promise<RevenueRecord | undefined> {
    const existingRecord = this.revenueRecords.get(id);
    if (!existingRecord) return undefined;
    
    const updatedRecord = { ...existingRecord, ...recordUpdate };
    this.revenueRecords.set(id, updatedRecord);
    return updatedRecord;
  }
  
  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getTasksByCompany(companyId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.companyId === companyId
    );
  }
  
  async getTasksByAssignee(assignedTo: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.assignedTo === assignedTo
    );
  }
  
  async getTasksByTenant(tenantId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.tenantId === tenantId
    );
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;
    
    const updatedTask = { ...existingTask, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
}

// Use DatabaseStorage for Supabase persistence instead of MemStorage
export const storage = new DatabaseStorage();
