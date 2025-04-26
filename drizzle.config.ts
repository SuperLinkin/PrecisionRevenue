import type { Config } from 'drizzle-kit';
import { DATABASE_URL } from './server/config';

export default {
  schema: './server/shared/schema.ts',
  out: './server/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
} as Config;
