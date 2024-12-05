import type { Config } from "drizzle-kit";
import * as dotenv from 'dotenv';

dotenv.config();

if(!process.env.DATABASE_URL || !process.env.DATABASE_AUTH_TOKEN) {
console.log("Database config missing details");

}

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
