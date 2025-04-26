import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from "./shared/schema";
import { supabase } from './supabase';
import path from 'path';

// Using Supabase connection pooler
const connectionString = `postgresql://postgres.zxwaobyahgwaqyzgleli:${process.env.SUPABASE_DB_PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require`;

if (!process.env.SUPABASE_DB_PASSWORD) {
  throw new Error(
    "SUPABASE_DB_PASSWORD must be set in environment variables",
  );
}

const sslConfig = {
  rejectUnauthorized: false
};

// For migrations and queries
export const migrationClient = postgres(connectionString, { 
  max: 1,
  ssl: sslConfig,
});

export const queryClient = postgres(connectionString, {
  ssl: sslConfig,
});

// Initialize drizzle with the pg client
export const db = drizzle(queryClient, { schema });

// Export Supabase client for auth and storage
export { supabase };

interface DatabaseConnectionResult {
  success: boolean;
  message?: string;
  version?: string;
}

/**
 * Checks if the PostgreSQL database connection is working
 * @returns {Promise<DatabaseConnectionResult>} Connection status
 */
export async function checkDatabaseConnection(): Promise<DatabaseConnectionResult> {
  try {
    // Execute a simple query to check the connection
    const result = await queryClient`SELECT version()`;
    
    return {
      success: true,
      message: 'Database connection successful',
      version: result?.[0]?.version || 'unknown'
    };
  } catch (error) {
    const err = error as Error;
    console.error("Database connection error:", err);
    return {
      success: false,
      message: `Database connection failed: ${err.message}`
    };
  }
}
