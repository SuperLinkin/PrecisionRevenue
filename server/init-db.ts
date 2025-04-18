import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, migrationClient } from './db';
import * as schema from '@shared/schema';

// Initialize the database tables
export async function initDB() {
  try {
    console.log('Initializing database...');
    
    // We've already pushed the schema using drizzle-kit, so no need for migration
    // Just check if tables exist and seed if needed
    
    // Check if we have any users, if not, seed some demo data
    let users: any[] = [];
    try {
      users = await db.select().from(schema.users);
      console.log('Database tables exist');
    } catch (err) {
      console.log('Tables not found, schema may need to be created');
      // Tables don't exist yet - schema push needed
      try {
        // We'll use db.push in the future
        console.log('Please run "npm run db:push" to create the database schema');
      } catch (pushErr) {
        console.error('Error pushing schema:', pushErr);
      }
      return;
    }
    
    if (users.length === 0) {
      console.log('No users found, seeding demo data...');
      await seedDemoData();
      console.log('Demo data seeded successfully');
    } else {
      console.log(`Found ${users.length} users, no need to seed data`);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Seed demo data
async function seedDemoData() {
  // Create a company
  const [company] = await db.insert(schema.companies)
    .values({
      name: 'PRA Demo Company',
      industry: 'Technology',
      size: '101-500',
      address: '123 Main St, San Francisco, CA',
      phone: '555-555-5555',
      website: 'https://pra-demo.com'
    })
    .returning();
  
  // Create a demo user
  const [user] = await db.insert(schema.users)
    .values({
      username: 'admin',
      password: 'admin123', // In production, this would be hashed
      email: 'admin@pra.com',
      fullName: 'Admin User',
      role: 'admin',
      companyId: company.id
    })
    .returning();
  
  // Create demo contracts
  const [contract1] = await db.insert(schema.contracts)
    .values({
      name: 'SaaS Platform License',
      contractNumber: 'CT-2023-8742',
      clientName: 'Acme Corporation',
      startDate: new Date('2023-01-15'),
      endDate: new Date('2024-01-14'),
      value: 125000,
      status: 'active',
      companyId: company.id,
      createdBy: user.id,
      fileUrl: ''
    })
    .returning();
  
  await db.insert(schema.contracts)
    .values({
      name: 'Consulting Services',
      contractNumber: 'CT-2023-8736',
      clientName: 'TechGlobal Inc.',
      startDate: new Date('2023-01-10'),
      endDate: new Date('2023-07-10'),
      value: 85000,
      status: 'pending',
      companyId: company.id,
      createdBy: user.id,
      fileUrl: ''
    })
    .returning();
  
  await db.insert(schema.contracts)
    .values({
      name: 'Support Extension',
      contractNumber: 'CT-2023-8729',
      clientName: 'NexGen Solutions',
      startDate: new Date('2023-01-05'),
      endDate: new Date('2023-12-31'),
      value: 45000,
      status: 'draft',
      companyId: company.id,
      createdBy: user.id,
      fileUrl: ''
    })
    .returning();
  
  // Create demo tasks
  await db.insert(schema.tasks)
    .values({
      title: 'Review Q1 Revenue Schedule',
      description: 'Complete review of Q1 revenue recognition schedule and prepare for CFO approval',
      dueDate: new Date('2023-01-31'),
      priority: 'high',
      status: 'pending',
      assignedTo: user.id,
      companyId: company.id
    })
    .returning();
  
  await db.insert(schema.tasks)
    .values({
      title: 'Approve Contract Amendments',
      description: 'Review and approve amendments for TechGlobal contract',
      dueDate: new Date('2023-02-05'),
      priority: 'medium',
      status: 'pending',
      assignedTo: user.id,
      companyId: company.id
    })
    .returning();
  
  await db.insert(schema.tasks)
    .values({
      title: 'Validate Performance Obligations',
      description: 'Ensure all performance obligations are properly documented for new contracts',
      dueDate: new Date('2023-02-08'),
      priority: 'low',
      status: 'pending',
      assignedTo: user.id,
      companyId: company.id
    })
    .returning();
    
  // Add a few revenue records to the first contract
  const now = new Date();
  
  await db.insert(schema.revenueRecords)
    .values({
      contractId: contract1.id,
      amount: '10000',
      recognitionDate: new Date('2023-01-31'),
      status: 'recognized',
      description: 'January revenue recognition',
      recognitionMethod: 'over_time',
      recognitionReason: 'Monthly subscription fee',
      revenueType: 'subscription',
      recognitionPercentage: null,
      performanceObligationId: null,
      adjustmentType: 'initial',
      createdAt: now,
      updatedAt: now
    })
    .returning();
    
  await db.insert(schema.revenueRecords)
    .values({
      contractId: contract1.id,
      amount: '10000',
      recognitionDate: new Date('2023-02-28'),
      status: 'recognized',
      description: 'February revenue recognition',
      recognitionMethod: 'over_time',
      recognitionReason: 'Monthly subscription fee',
      revenueType: 'subscription',
      recognitionPercentage: null,
      performanceObligationId: null,
      adjustmentType: 'initial',
      createdAt: now,
      updatedAt: now
    })
    .returning();
    
  await db.insert(schema.revenueRecords)
    .values({
      contractId: contract1.id,
      amount: '10000',
      recognitionDate: new Date('2023-03-31'),
      status: 'recognized',
      description: 'March revenue recognition',
      recognitionMethod: 'over_time',
      recognitionReason: 'Monthly subscription fee',
      revenueType: 'subscription',
      recognitionPercentage: null,
      performanceObligationId: null,
      adjustmentType: 'initial',
      createdAt: now,
      updatedAt: now
    })
    .returning();
}