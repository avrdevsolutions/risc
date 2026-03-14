'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { AlertTriangle } from 'lucide-react'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useSectionSync } from '@/hooks/useSectionSync'
import { getRiskLevel, AMENINTARI } from '@/lib/constants'
import type { EvaluareWithRiscuri, Risc } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = { evaluare: EvaluareWithRiscuri }

const getRiskLabel = (risc: Risc): string => {
  if (risc.activitate === 'custom') return risc.activitateCustom ?? '—'
  if (!risc.activitate) return '—'
  return AMENINTARI.find((a) => a.value === risc.activitate)?.label ?? risc.activitate
}

const getRiskCounts = (riscuri: Risc[]) => {
  const counts = { ridicat: 0, mediu: 0, scazut: 0, total: 0, ridicatNames: [] as string[] }
  riscuri.forEach((r) => {
    if (r.probabilitateInitiala && r.severitateInitiala) {
      const level = getRiskLevel(r.probabilitateInitiala, r.severitateInitiala)
      counts[level as 'ridicat' | 'mediu' | 'scazut']++
      counts.total++
      if (level === 'ridicat') counts.ridicatNames.push(getRiskLabel(r))
    }
  })
  return counts
}

export const ConcluziiSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare

  const [nivelRiscGlobal, setNivelRiscGlobal] = useState(evaluare.nivelRiscGlobalAsumat ?? '')
  const [nivelRiscRezidual, setNivelRiscRezidual] = useState(
    evaluare.nivelRiscRezidualGlobal ?? '',
  )
  const [termenImplementare, setTermenImplementare] = useState(
    evaluare.termenImplementareGlobal ?? '',
  )
  const [concluziiGenerale, setConcluziiGenerale] = useState(evaluare.concluziiGenerale ?? '')
  const [masuriObligatorii, setMasuriObligatorii] = useState(evaluare.masuriObligatorii ?? '')
  const [masuriRecomandate, setMasuriRecomandate] = useState(evaluare.masuriRecomandate ?? '')

  useEffect(() => {
    const ev = evaluareRef.current
    setNivelRiscGlobal(ev.nivelRiscGlobalAsumat ?? '')
    setNivelRiscRezidual(ev.nivelRiscRezidualGlobal ?? '')
    setTermenImplementare(ev.termenImplementareGlobal ?? '')
    setConcluziiGenerale(ev.concluziiGenerale ?? '')
    setMasuriObligatorii(ev.masuriObligatorii ?? '')
    setMasuriRecomandate(ev.masuriRecomandate ?? '')
  }, [evaluare.id])

  const handleSave = useCallback(async () => {
    await update.mutateAsync({
      nivelRiscGlobalAsumat: nivelRiscGlobal || null,
      nivelRiscRezidualGlobal: nivelRiscRezidual || null,
      termenImplementareGlobal: termenImplementare || null,
      concluziiGenerale: concluziiGenerale || null,
      masuriObligatorii: masuriObligatorii || null,
      masuriRecomandate: masuriRecomandate || null,
    })
  }, [
    update,
    nivelRiscGlobal,
    nivelRiscRezidual,
    termenImplementare,
    concluziiGenerale,
    masuriObligatorii,
    masuriRecomandate,
  ])

  const { markDirty } = useSectionSync('concluzii', handleSave)

  const counts = getRiskCounts(evaluare.riscuri)

  const summaryText =
    counts.total > 0
      ? `Au fost evaluate ${counts.total} amenințări, din care ${counts.ridicat} la nivel ridicat, ${counts.mediu} la nivel mediu și ${counts.scazut} la nivel scăzut.`
      : 'Nu au fost evaluate amenințări. Completați secțiunea Surse de Risc pentru a genera sumarul.'

  return (
    <section id='concluzii-section' className='scroll-mt-20'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          Concluzii
        </Typography>

        <Stack gap='6'>
          {/* Auto-generated risk summary */}
          <div className='rounded-xl border border-primary-200 bg-primary-50 p-4'>
            <Typography variant='body-sm' className='font-semibold text-primary-800'>
              Sumar automat
            </Typography>
            <Typography variant='body-sm' className='mt-1 text-primary-700'>
              {summaryText}
            </Typography>
          </div>

          {/* Warning for high-risk threats */}
          {counts.ridicat > 0 && (
            <div className='rounded-xl border border-error-100 bg-error-50 p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <AlertTriangle className='size-4 shrink-0 text-error-600' />
                <Typography variant='body-sm' className='font-semibold text-error-700'>
                  Au fost identificate {counts.ridicat} amenințări la nivel RIDICAT care necesită
                  măsuri imediate de reducere.
                </Typography>
              </div>
              <Typography variant='body-sm' className='text-error-600'>
                Amenințări ridicate: {counts.ridicatNames.join(', ')}
              </Typography>
            </div>
          )}

          {/* Fields */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Nivel de risc global asumat <span className='text-error-500'>*</span>
              </label>
              <select
                value={nivelRiscGlobal}
                onChange={(e) => { setNivelRiscGlobal(e.target.value); markDirty() }}
                className={cn('form-input', !nivelRiscGlobal && 'text-navy-400')}
              >
                <option value=''>Selectați...</option>
                <option value='Scăzut'>Scăzut</option>
                <option value='Mediu'>Mediu</option>
                <option value='Ridicat'>Ridicat</option>
              </select>
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Risc rezidual estimat (după implementarea măsurilor)
              </label>
              <select
                value={nivelRiscRezidual}
                onChange={(e) => { setNivelRiscRezidual(e.target.value); markDirty() }}
                className={cn('form-input', !nivelRiscRezidual && 'text-navy-400')}
              >
                <option value=''>Selectați...</option>
                <option value='Scăzut'>Scăzut</option>
                <option value='Mediu'>Mediu</option>
              </select>
            </div>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-medium text-navy-700'>
              Termen limită implementare măsuri
            </label>
            <input
              type='date'
              value={termenImplementare}
              onChange={(e) => { setTermenImplementare(e.target.value); markDirty() }}
              className='form-input'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-medium text-navy-700'>
              Concluzie generală
            </label>
            <textarea
              value={concluziiGenerale}
              onChange={(e) => { setConcluziiGenerale(e.target.value); markDirty() }}
              rows={4}
              placeholder='Descrieți starea generală de securitate a obiectivului evaluat...'
              className='form-input'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-medium text-navy-700'>
              Măsuri obligatorii (implementare imediată)
            </label>
            <textarea
              value={masuriObligatorii}
              onChange={(e) => { setMasuriObligatorii(e.target.value); markDirty() }}
              rows={4}
              placeholder='Listați măsurile cu caracter obligatoriu și urgență ridicată...'
              className='form-input'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-medium text-navy-700'>
              Măsuri recomandate (implementare în funcție de resurse)
            </label>
            <textarea
              value={masuriRecomandate}
              onChange={(e) => { setMasuriRecomandate(e.target.value); markDirty() }}
              rows={4}
              placeholder='Listați măsurile recomandate suplimentar...'
              className='form-input'
            />
          </div>
        </Stack>
      </div>
    </section>
  )
}
