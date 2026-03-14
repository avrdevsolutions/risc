import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export const GET = async (_req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    return NextResponse.json({
      data: { id, message: 'Plan de Pază — în curs de dezvoltare' },
    })
  } catch (err) {
    console.error('Error fetching plan-de-paza evaluare:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
