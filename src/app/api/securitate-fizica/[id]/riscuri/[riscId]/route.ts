import { NextResponse } from 'next/server'

import { eq, and } from 'drizzle-orm'

import { checkOwnership } from '@/lib/api-utils'
import { auth } from '@/lib/auth'
import { serializeArrayField } from '@/lib/utils'

import { db } from '../../../../../../../db'
import { evaluari, riscuri } from '../../../../../../../db/schema'

type Params = { params: Promise<{ id: string; riscId: string }> }

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id, riscId } = await params
    const body = await req.json()
    const now = new Date().toISOString()

    const [evaluare] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!evaluare) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }
    const ownershipError = checkOwnership(evaluare.userId, session.user.id)
    if (ownershipError) return ownershipError

    const [existing] = await db
      .select()
      .from(riscuri)
      .where(and(eq(riscuri.id, riscId), eq(riscuri.evaluareId, id)))
    if (!existing) {
      return NextResponse.json({ error: 'Riscul nu a fost găsit' }, { status: 404 })
    }

    const persoaneExpuse = serializeArrayField(body.persoaneExpuse)
    const masuriExistente = serializeArrayField(body.masuriExistente)

    const updatePayload = {
      ...body,
      ...(persoaneExpuse !== undefined && { persoaneExpuse }),
      ...(masuriExistente !== undefined && { masuriExistente }),
      updatedAt: now,
    }

    await db.update(riscuri).set(updatePayload).where(eq(riscuri.id, riscId))

    // Update evaluare updatedAt
    await db.update(evaluari).set({ updatedAt: now }).where(eq(evaluari.id, id))

    const [updated] = await db.select().from(riscuri).where(eq(riscuri.id, riscId))
    return NextResponse.json({ data: updated })
  } catch (err) {
    console.error('Error updating risc for securitate-fizica:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export const DELETE = async (_req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id, riscId } = await params

    const [evaluare] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!evaluare) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }
    const ownershipError = checkOwnership(evaluare.userId, session.user.id)
    if (ownershipError) return ownershipError

    const [existing] = await db
      .select()
      .from(riscuri)
      .where(and(eq(riscuri.id, riscId), eq(riscuri.evaluareId, id)))
    if (!existing) {
      return NextResponse.json({ error: 'Riscul nu a fost găsit' }, { status: 404 })
    }
    await db.delete(riscuri).where(eq(riscuri.id, riscId))

    const now = new Date().toISOString()
    await db.update(evaluari).set({ updatedAt: now }).where(eq(evaluari.id, id))

    return NextResponse.json({ data: { id: riscId } })
  } catch (err) {
    console.error('Error deleting risc for securitate-fizica:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
