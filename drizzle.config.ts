import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_CONNECTION_STRING!;

export default {
  out: './drizzle',
  schema: './src/db/schema.ts',
  breakpoints: true, // must be true for mysql and sqlite databases
  driver: 'mysql2',
  dbCredentials: {
    connectionString
  }
} satisfies Config;
