import { NextResponse } from 'next/server'

import { desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { db } from '../../../../db'
import { templates } from '../../../../db/schema'

export const GET = async () => {
  try {
    const all = await db.select().from(templates).orderBy(desc(templates.createdAt))
    return NextResponse.json({ data: all })
  } catch (err) {
    console.error('Error fetching templates:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export const POST = async (req: Request) => {
  try {
    const body = await req.json()
    const { nume, descriere, continut } = body

    if (!nume || typeof nume !== 'string' || nume.trim().length < 2) {
      return NextResponse.json({ error: 'Numele template-ului este obligatoriu' }, { status: 400 })
    }
    if (!continut || typeof continut !== 'string') {
      return NextResponse.json(
        { error: 'Conținutul template-ului este obligatoriu' },
        { status: 400 },
      )
    }

    const id = nanoid()
    const now = new Date().toISOString()

    await db.insert(templates).values({
      id,
      nume: nume.trim(),
      descriere: descriere ?? null,
      continut,
      createdAt: now,
    })

    const [created] = await db.select().from(templates).where(eq(templates.id, id))
    return NextResponse.json({ data: created }, { status: 201 })
  } catch (err) {
    console.error('Error creating template:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
