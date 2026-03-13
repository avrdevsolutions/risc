import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import { db } from '../../../../../db'
import { evaluari, riscuri } from '../../../../../db/schema'

type Params = { params: Promise<{ id: string }> }

export const GET = async (_req: Request, { params }: Params) => {
  try {
    const { id } = await params
    const [evaluare] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!evaluare) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }
    const riscuriList = await db.select().from(riscuri).where(eq(riscuri.evaluareId, id))
    return NextResponse.json({ data: { ...evaluare, riscuri: riscuriList } })
  } catch (err) {
    console.error('Error fetching evaluare:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const { id } = await params
    const body = await req.json()
    const now = new Date().toISOString()

    const [existing] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!existing) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }

    // Strip non-column keys to prevent invalid updates
    const { riscuri: _r, ...updateData } = body

    await db
      .update(evaluari)
      .set({ ...updateData, updatedAt: now })
      .where(eq(evaluari.id, id))

    const [updated] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    return NextResponse.json({ data: updated })
  } catch (err) {
    console.error('Error updating evaluare:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export const DELETE = async (_req: Request, { params }: Params) => {
  try {
    const { id } = await params
    const [existing] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!existing) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }
    await db.delete(evaluari).where(eq(evaluari.id, id))
    return NextResponse.json({ data: { id } })
  } catch (err) {
    console.error('Error deleting evaluare:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
