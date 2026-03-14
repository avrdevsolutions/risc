import { eq } from 'drizzle-orm'

import { checkOwnership } from '@/lib/api-utils'
import { auth } from '@/lib/auth'
import { generateEvaluareDocx } from '@/lib/docx-generator'

import { db } from '../../../../../../db'
import { evaluari, riscuri } from '../../../../../../db/schema'

type Params = { params: Promise<{ id: string }> }

export const GET = async (_req: Request, { params }: Params) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { id } = await params

    const [evaluare] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!evaluare) {
      return new Response(JSON.stringify({ error: 'Evaluarea nu a fost găsită' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const ownershipError = checkOwnership(evaluare.userId, session.user.id)
    if (ownershipError) return ownershipError

    const riscuriList = await db.select().from(riscuri).where(eq(riscuri.evaluareId, id))

    const buffer = await generateEvaluareDocx(evaluare, riscuriList)

    const filename = `Raport_Securitate_${(evaluare.denumireProiect || 'Evaluare').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('Error generating DOCX export for securitate-fizica:', err)
    return new Response(JSON.stringify({ error: 'Eroare la generarea documentului' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
