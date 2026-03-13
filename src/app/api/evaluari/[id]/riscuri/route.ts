import { NextResponse } from 'next/server'

import { eq, asc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { serializeArrayField } from '@/lib/utils'

import { db } from '../../../../../../db'
import { evaluari, riscuri } from '../../../../../../db/schema'

type Params = { params: Promise<{ id: string }> }

export const GET = async (_req: Request, { params }: Params) => {
  try {
    const { id } = await params
    const [evaluare] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!evaluare) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }
    const list = await db
      .select()
      .from(riscuri)
      .where(eq(riscuri.evaluareId, id))
      .orderBy(asc(riscuri.ordine))
    return NextResponse.json({ data: list })
  } catch (err) {
    console.error('Error fetching riscuri:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export const POST = async (req: Request, { params }: Params) => {
  try {
    const { id } = await params
    const [evaluare] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!evaluare) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }

    const body = await req.json()
    const now = new Date().toISOString()
    const riscId = nanoid()

    // Calculate next ordine
    const existingRiscuri = await db.select().from(riscuri).where(eq(riscuri.evaluareId, id))
    const maxOrdine = existingRiscuri.reduce((max, r) => Math.max(max, r.ordine), 0)

    await db.insert(riscuri).values({
      id: riscId,
      evaluareId: id,
      ordine: maxOrdine + 1,
      activitate: body.activitate ?? null,
      activitateCustom: body.activitateCustom ?? null,
      pericol: body.pericol ?? null,
      pericolCustom: body.pericolCustom ?? null,
      descrierePericol: body.descrierePericol ?? null,
      persoaneExpuse: (serializeArrayField(body.persoaneExpuse) as string) ?? null,
      numarPersoaneExpuse: body.numarPersoaneExpuse ?? null,
      probabilitateInitiala: body.probabilitateInitiala ?? null,
      severitateInitiala: body.severitateInitiala ?? null,
      masuriExistente: (serializeArrayField(body.masuriExistente) as string) ?? null,
      masuriExistenteCustom: body.masuriExistenteCustom ?? null,
      masuriSuplimentare: body.masuriSuplimentare ?? null,
      probabilitateReziduala: body.probabilitateReziduala ?? null,
      severitateReziduala: body.severitateReziduala ?? null,
      responsabilImplementare: body.responsabilImplementare ?? null,
      functieResponsabil: body.functieResponsabil ?? null,
      termenImplementare: body.termenImplementare ?? null,
      statusRisc: body.statusRisc ?? 'deschis',
      createdAt: now,
      updatedAt: now,
    })

    const [created] = await db.select().from(riscuri).where(eq(riscuri.id, riscId))

    // Update evaluare updatedAt
    await db.update(evaluari).set({ updatedAt: now }).where(eq(evaluari.id, id))

    return NextResponse.json({ data: created }, { status: 201 })
  } catch (err) {
    console.error('Error creating risc:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
