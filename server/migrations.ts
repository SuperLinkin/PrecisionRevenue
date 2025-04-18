import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Run database migrations or schema updates
 */
export async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    // Fix adjustment_type column to be nullable
    await db.execute(sql`
      ALTER TABLE revenue_records 
      ALTER COLUMN adjustment_type DROP NOT NULL;
    `);
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}