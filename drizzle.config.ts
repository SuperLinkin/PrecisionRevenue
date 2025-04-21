import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

if (!process.env.SUPABASE_DB_PASSWORD) {
  throw new Error("SUPABASE_DB_PASSWORD must be set in environment variables");
}

const connectionString = `postgresql://postgres.zxwaobyahgwaqyzgleli:${process.env.SUPABASE_DB_PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`;

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
    ssl: true
  },
});
