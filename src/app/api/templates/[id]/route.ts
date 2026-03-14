import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { auth } from '@/lib/auth'

import { db } from '../../../../../db'
import { templates, evaluari } from '../../../../../db/schema'

type Params = { params: Promise<{ id: string }> }

export const GET = async (_req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const [template] = await db.select().from(templates).where(eq(templates.id, id))
    if (!template) {
      return NextResponse.json({ error: 'Template-ul nu a fost găsit' }, { status: 404 })
    }
    if (template.userId && template.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
    }
    return NextResponse.json({ data: template })
  } catch (err) {
    console.error('Error fetching template:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export const DELETE = async (_req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const [existing] = await db.select().from(templates).where(eq(templates.id, id))
    if (!existing) {
      return NextResponse.json({ error: 'Template-ul nu a fost găsit' }, { status: 404 })
    }
    if (existing.userId && existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
    }
    await db.delete(templates).where(eq(templates.id, id))
    return NextResponse.json({ data: { id } })
  } catch (err) {
    console.error('Error deleting template:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

// POST: create a new evaluation from this template
export const POST = async (_req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const [template] = await db.select().from(templates).where(eq(templates.id, id))
    if (!template) {
      return NextResponse.json({ error: 'Template-ul nu a fost găsit' }, { status: 404 })
    }
    if (template.userId && template.userId !== session.user.id) {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
    }

    let continutParsed: Record<string, unknown> = {}
    try {
      continutParsed = JSON.parse(template.continut)
    } catch {
      // If continut isn't valid JSON, start with empty data
    }

    const now = new Date().toISOString()
    const newId = nanoid()
    const today = new Date().toISOString().split('T')[0]
    const sixMonths = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { id: _id, createdAt: _c, ...templateData } = continutParsed as Record<string, unknown>

    await db.insert(evaluari).values({
      id: newId,
      userId: session.user.id,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      dataEvaluarii: today,
      dataRevizuirii: sixMonths,
      dataAprobarii: today,
      ...(templateData as Partial<typeof evaluari.$inferInsert>),
    })

    const [created] = await db.select().from(evaluari).where(eq(evaluari.id, newId))
    return NextResponse.json({ data: created }, { status: 201 })
  } catch (err) {
    console.error('Error creating evaluare from template:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
