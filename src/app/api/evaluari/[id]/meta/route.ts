import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import { auth } from '@/lib/auth'

import { db } from '../../../../../../db'
import { evaluari } from '../../../../../../db/schema'

type Params = { params: Promise<{ id: string }> }

/**
 * Lightweight endpoint used for conflict detection before a sync.
 * Returns only {id, updatedAt} to avoid transferring the full evaluare payload.
 */
export const GET = async (_req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const [row] = await db
      .select({ id: evaluari.id, updatedAt: evaluari.updatedAt, userId: evaluari.userId })
      .from(evaluari)
      .where(eq(evaluari.id, id))
    if (!row) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }
    if (row.userId && row.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
    }
    return NextResponse.json({ id: row.id, updatedAt: row.updatedAt })
  } catch (err) {
    console.error('Error fetching evaluare meta:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
