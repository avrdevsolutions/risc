import { NextResponse } from 'next/server'

import { and, desc, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { auth } from '@/lib/auth'

import { db } from '../../../../db'
import { evaluari } from '../../../../db/schema'

export const GET = async () => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const all = await db
      .select()
      .from(evaluari)
      .where(and(eq(evaluari.userId, userId), eq(evaluari.evalType, 'plan_de_paza')))
      .orderBy(desc(evaluari.updatedAt))
    return NextResponse.json({ data: all })
  } catch (err) {
    console.error('Error fetching plan-de-paza evaluari:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export const POST = async () => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const now = new Date().toISOString()
    const id = nanoid()
    const today = new Date().toISOString().split('T')[0]
    const sixMonths = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    await db.insert(evaluari).values({
      id,
      userId,
      evalType: 'plan_de_paza',
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      dataEvaluarii: today,
      dataRevizuirii: sixMonths,
      dataAprobarii: today,
    })

    const [created] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    return NextResponse.json({ data: created }, { status: 201 })
  } catch (err) {
    console.error('Error creating plan-de-paza evaluare:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
