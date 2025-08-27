import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/api_aulas'

// Configure for Neon with SSL
const client = postgres(connectionString, { 
  prepare: false,
  ssl: 'require'
})
export const db = drizzle(client, { schema })
