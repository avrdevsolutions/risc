import { NextResponse } from 'next/server'

import { eq, asc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { checkOwnership } from '@/lib/api-utils'
import { auth } from '@/lib/auth'

import { db } from '../../../../../../db'
import { evaluari, riscuri } from '../../../../../../db/schema'

type Params = { params: Promise<{ id: string }> }

export const POST = async (_req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const [original] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!original) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }
    const ownershipError = checkOwnership(original.userId, session.user.id)
    if (ownershipError) return ownershipError

    const originalRiscuri = await db
      .select()
      .from(riscuri)
      .where(eq(riscuri.evaluareId, id))
      .orderBy(asc(riscuri.ordine))

    const now = new Date().toISOString()
    const newId = nanoid()

    const { id: _id, createdAt: _c, updatedAt: _u, completedAt: _comp, ...rest } = original

    await db.insert(evaluari).values({
      ...rest,
      id: newId,
      userId: session.user.id,
      evalType: 'securitate_fizica',
      status: 'draft',
      completedAt: null,
      denumireProiect: original.denumireProiect
        ? `${original.denumireProiect} (copie)`
        : 'Evaluare nouă (copie)',
      createdAt: now,
      updatedAt: now,
    })

    if (originalRiscuri.length > 0) {
      await db.insert(riscuri).values(
        originalRiscuri.map((r) => {
          const { id: _rid, createdAt: _rc, updatedAt: _ru, ...rRest } = r
          return {
            ...rRest,
            id: nanoid(),
            evaluareId: newId,
            createdAt: now,
            updatedAt: now,
          }
        }),
      )
    }

    const [created] = await db.select().from(evaluari).where(eq(evaluari.id, newId))
    return NextResponse.json({ data: created }, { status: 201 })
  } catch (err) {
    console.error('Error duplicating securitate-fizica evaluare:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
