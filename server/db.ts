import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import { supabase } from './supabase';

// Using connection string from Supabase
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// For migrations and queries
export const migrationClient = postgres(connectionString, { max: 1 });
export const queryClient = postgres(connectionString);

// Initialize drizzle with the pg client
export const db = drizzle(queryClient, { schema });

// Export Supabase client for auth and storage
export { supabase };

/**
 * Checks if the PostgreSQL database connection is working
 * @returns {Promise<{ success: boolean, message?: string }>} Connection status
 */
export async function checkDatabaseConnection(): Promise<{ success: boolean; message?: string; version?: string }> {
  try {
    // Execute a simple query to check the connection
    const result = await queryClient`SELECT version()`;
    
    return {
      success: true,
      message: 'Database connection successful',
      version: result?.[0]?.version || 'unknown'
    };
  } catch (error) {
    console.error("Database connection error:", error);
    return {
      success: false,
      message: `Database connection failed: ${error.message}`
    };
  }
}
