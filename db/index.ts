import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

import * as schema from './schema'

type DbInstance = ReturnType<typeof drizzle<typeof schema>>

// Singleton pattern to prevent connection exhaustion in development
const globalForDb = global as unknown as { db: DbInstance | undefined }

const createDb = (): DbInstance => {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is required')
  }

  const client = createClient({ url, authToken })
  return drizzle(client, { schema })
}

export const getDb = (): DbInstance => {
  if (!globalForDb.db) {
    globalForDb.db = createDb()
  }
  return globalForDb.db
}

// Convenience export — lazily initialised on first access via Proxy.
// Using a Proxy means callers import `db` directly (not `getDb()`) while still
// deferring the actual DB connection until the first query is executed.
// This avoids throwing at build time when TURSO_DATABASE_URL is not set.
export const db = new Proxy({} as DbInstance, {
  get(_target, prop) {
    return getDb()[prop as keyof DbInstance]
  },
})
