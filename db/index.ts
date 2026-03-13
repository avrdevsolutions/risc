import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

import * as schema from './schema'

const getClient = () => {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is required')
  }

  return createClient({ url, authToken })
}

// Singleton pattern to prevent connection exhaustion in development
const globalForDb = global as unknown as { db: ReturnType<typeof drizzle> }

export const db = globalForDb.db || drizzle(getClient(), { schema })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}
