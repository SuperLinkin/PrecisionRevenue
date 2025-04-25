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