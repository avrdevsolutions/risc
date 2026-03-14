import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { db } from '../../../../../../../db'
import { evaluari, riscuri } from '../../../../../../../db/schema'

type Params = { params: Promise<{ id: string }> }

const toNullableString = (val: unknown): string | null => {
  if (val == null) return null
  if (typeof val === 'string') return val
  if (Array.isArray(val)) return JSON.stringify(val)
  return null
}

/**
 * PUT /api/evaluari/[id]/riscuri/sync
 *
 * Full-replace sync: deletes all existing risks for the evaluation
 * and inserts the provided array. Simpler than diffing individual risks.
 */
export const PUT = async (req: Request, { params }: Params) => {
  try {
    const { id } = await params

    const [evaluare] = await db.select().from(evaluari).where(eq(evaluari.id, id))
    if (!evaluare) {
      return NextResponse.json({ error: 'Evaluarea nu a fost găsită' }, { status: 404 })
    }

    const body = await req.json()
    const riscuriInput: Record<string, unknown>[] = Array.isArray(body.riscuri) ? body.riscuri : []
    const now = new Date().toISOString()

    // Delete all existing risks for this evaluation
    await db.delete(riscuri).where(eq(riscuri.evaluareId, id))

    // Insert the full replacement array
    if (riscuriInput.length > 0) {
      const rows = riscuriInput.map((r, index) => ({
        id: typeof r.id === 'string' && r.id ? r.id : nanoid(),
        evaluareId: id,
        ordine: typeof r.ordine === 'number' ? r.ordine : index,
        activitate: typeof r.activitate === 'string' ? r.activitate : null,
        activitateCustom: typeof r.activitateCustom === 'string' ? r.activitateCustom : null,
        pericol: typeof r.pericol === 'string' ? r.pericol : null,
        pericolCustom: typeof r.pericolCustom === 'string' ? r.pericolCustom : null,
        descrierePericol: typeof r.descrierePericol === 'string' ? r.descrierePericol : null,
        persoaneExpuse: toNullableString(r.persoaneExpuse),
        numarPersoaneExpuse:
          typeof r.numarPersoaneExpuse === 'number' ? r.numarPersoaneExpuse : null,
        probabilitateInitiala:
          typeof r.probabilitateInitiala === 'number' ? r.probabilitateInitiala : null,
        severitateInitiala:
          typeof r.severitateInitiala === 'number' ? r.severitateInitiala : null,
        masuriExistente: toNullableString(r.masuriExistente),
        masuriExistenteCustom:
          typeof r.masuriExistenteCustom === 'string' ? r.masuriExistenteCustom : null,
        masuriSuplimentare:
          typeof r.masuriSuplimentare === 'string' ? r.masuriSuplimentare : null,
        probabilitateReziduala:
          typeof r.probabilitateReziduala === 'number' ? r.probabilitateReziduala : null,
        severitateReziduala:
          typeof r.severitateReziduala === 'number' ? r.severitateReziduala : null,
        responsabilImplementare:
          typeof r.responsabilImplementare === 'string' ? r.responsabilImplementare : null,
        functieResponsabil:
          typeof r.functieResponsabil === 'string' ? r.functieResponsabil : null,
        termenImplementare:
          typeof r.termenImplementare === 'string' ? r.termenImplementare : null,
        statusRisc:
          r.statusRisc === 'deschis' || r.statusRisc === 'in_lucru' || r.statusRisc === 'inchis'
            ? (r.statusRisc as 'deschis' | 'in_lucru' | 'inchis')
            : 'deschis',
        createdAt:
          typeof r.createdAt === 'string' && r.createdAt ? r.createdAt : now,
        updatedAt: now,
      }))

      await db.insert(riscuri).values(rows)
    }

    // Update evaluare updatedAt
    await db.update(evaluari).set({ updatedAt: now }).where(eq(evaluari.id, id))

    const synced = await db.select().from(riscuri).where(eq(riscuri.evaluareId, id))
    return NextResponse.json({ data: synced })
  } catch (err) {
    console.error('Error syncing riscuri:', err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
