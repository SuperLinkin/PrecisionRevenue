import 'dotenv/config';

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'SUPABASE_DB_PASSWORD',
  'SESSION_SECRET',
  'OPENAI_API_KEY'
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} must be set in environment variables`);
  }
}

// Database Configuration
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:Hesoyamblacky1997!@db.gsuuvhlusfjolmmszhkb.supabase.co:5432/postgres';

// Supabase Configuration
export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gsuuvhlusfjolmmszhkb.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXV2aGx1c2Zqb2xtbXN6aGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjE0MjksImV4cCI6MjA1ODc5NzQyOX0.8eWalaXvlkkXATKa8k2zvM7R6U-LgIRz5DkVk0QwjRA';
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdXV2aGx1c2Zqb2xtbXN6aGtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMTQyOSwiZXhwIjoyMDU4Nzk3NDI5fQ.rn44F58uuuxVQkm8IfZUrfLFEpXwKx-Bc7jAwjhxYsw';

// Other Configuration
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    dbPassword: process.env.SUPABASE_DB_PASSWORD
  },
  session: {
    secret: process.env.SESSION_SECRET
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  port: (() => {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
    if (isNaN(port)) {
      throw new Error('PORT must be a valid number');
    }
    if (port < 0 || port > 65535) {
      throw new Error('PORT must be between 0 and 65535');
    }
    return port;
  })()
} as const; 