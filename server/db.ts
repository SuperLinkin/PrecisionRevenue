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
