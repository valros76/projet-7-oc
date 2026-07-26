/// <reference types="node" />
import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost') {
  dotenv.config()
}

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    ...(process.env.DB_PASSWORD ? { password: process.env.DB_PASSWORD } : {}),
    database: process.env.DB_NAME || 'webdevoo_lead',
    port: Number(process.env.DB_PORT) || 3306,
  },
})