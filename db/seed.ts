import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/libsql'
import { nanoid } from 'nanoid'

import * as schema from './schema'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const db = drizzle(client, { schema })

const seed = async () => {
  const now = new Date().toISOString()

  const passwordHash = await bcrypt.hash('admin123', 12)

  await db
    .insert(schema.users)
    .values({
      id: nanoid(),
      email: 'admin@secureeval.ro',
      name: 'Administrator',
      passwordHash,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()

  console.warn('✅ Seed completed: admin@secureeval.ro / admin123')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
