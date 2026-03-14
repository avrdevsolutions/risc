import { NextResponse } from 'next/server'

import { desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { db } from '../../../../db'
import { evaluari } from '../../../../db/schema'

export const GET = async () => {
  try {
    const all = await db.select().from(evaluari).orderBy(desc(evaluari.updatedAt))
    return NextResponse.json({ data: all })
  } catch (err) {
    console.error('Error fetching evaluari:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export const POST = async () => {
  try {
    const now = new Date().toISOString()
    const id = nanoid()
    const today = new Date().toISOString().split('T')[0]
    const sixMonths = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    await db.insert(evaluari).values({
      id,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      dataEvaluarii: today,
      dataRevizuirii: sixMonths,
      dataAprobarii: today,
      anexeSelectate: JSON.stringify(['legea_333', 'hg_301', 'instr_9']),
    })

    const [created] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    return NextResponse.json({ data: created }, { status: 201 })
  } catch (err) {
    console.error('Error creating evaluare:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
