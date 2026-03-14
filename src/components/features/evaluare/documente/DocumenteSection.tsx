'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { FileCheck } from 'lucide-react'

import { Typography, Stack } from '@/components/ui'
import { useEvaluareSyncContext } from '@/context/EvaluareSyncContext'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useSectionSync } from '@/hooks/useSectionSync'
import { DOCUMENTE_SUPORT, CADRU_LEGAL } from '@/lib/constants'
import type { Evaluare } from '@/lib/types'
import { useEvaluareFormStore } from '@/stores/evaluare-form-store'

type Props = { evaluare: Evaluare }

const parseStringArray = (val: string | null | undefined): string[] => {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const DocumenteSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare
  const { setField } = useEvaluareSyncContext()
  const localInit = useEvaluareFormStore.getState().getFormData(evaluare.id)

  const [selectedDoc, setSelectedDoc] = useState<string[]>(
    parseStringArray(
      (localInit.documenteAplicabile as string | undefined) ?? evaluare.documenteAplicabile,
    ),
  )
  const [selectedAnexe, setSelectedAnexe] = useState<string[]>(() => {
    const saved = parseStringArray(
      (localInit.anexeSelectate as string | undefined) ?? evaluare.anexeSelectate,
    )
    if (saved.length > 0) return saved
    return CADRU_LEGAL.filter((item) => item.checked).map((item) => item.value)
  })
  const [observatii, setObservatii] = useState(
    (localInit.observatiiDocumente as string | undefined) ?? evaluare.observatiiDocumente ?? '',
  )

  useEffect(() => {
    setSelectedDoc(parseStringArray(evaluareRef.current.documenteAplicabile))
    const savedAnexe = parseStringArray(evaluareRef.current.anexeSelectate)
    setSelectedAnexe(
      savedAnexe.length > 0
        ? savedAnexe
        : CADRU_LEGAL.filter((item) => item.checked).map((item) => item.value),
    )
    setObservatii(evaluareRef.current.observatiiDocumente ?? '')
  }, [evaluare.id])

  const handleSave = useCallback(async () => {
    await update.mutateAsync({
      documenteAplicabile: JSON.stringify(selectedDoc),
      anexeSelectate: JSON.stringify(selectedAnexe),
      observatiiDocumente: observatii || null,
    } as Partial<Evaluare>)
  }, [update, selectedDoc, selectedAnexe, observatii])

  const { markDirty } = useSectionSync('documente', handleSave)

  const toggleDoc = (id: string) => {
    const updated = selectedDoc.includes(id)
      ? selectedDoc.filter((d) => d !== id)
      : [...selectedDoc, id]
    setSelectedDoc(updated)
    setField('documenteAplicabile', JSON.stringify(updated))
    markDirty()
  }

  const toggleAnexa = (anexa: string) => {
    const updated = selectedAnexe.includes(anexa)
      ? selectedAnexe.filter((a) => a !== anexa)
      : [...selectedAnexe, anexa]
    setSelectedAnexe(updated)
    setField('anexeSelectate', JSON.stringify(updated))
    markDirty()
  }

  return (
    <section id='documente-section' className='scroll-mt-32'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          10. Documente Suport
        </Typography>

        <Stack gap='6'>
          {/* Documente aplicabile */}
          <div>
            <Stack gap='3'>
              {DOCUMENTE_SUPORT.map((doc) => (
                <label
                  key={doc.value}
                  className='flex cursor-pointer items-start gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
                >
                  <input
                    type='checkbox'
                    checked={selectedDoc.includes(doc.value)}
                    onChange={() => toggleDoc(doc.value)}
                    className='mt-0.5 rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                  />
                  <div>
                    <Typography variant='body-sm' className='font-medium text-navy-700'>
                      {doc.label}
                    </Typography>
                  </div>
                </label>
              ))}
            </Stack>
          </div>

          {/* Cadru legal */}
          <div>
            <Typography variant='h4' className='mb-4 text-navy-700'>
              Cadru legal aplicabil
            </Typography>
            <div className='grid grid-cols-1 gap-2'>
              {CADRU_LEGAL.map((item) => (
                <label
                  key={item.value}
                  className='flex cursor-pointer items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
                >
                  <input
                    type='checkbox'
                    checked={selectedAnexe.includes(item.value)}
                    onChange={() => toggleAnexa(item.value)}
                    className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                  />
                  <Stack direction='row' align='center' gap='2'>
                    <FileCheck className='size-4 shrink-0 text-primary-500' />
                    <Typography variant='body-sm' className='text-navy-700'>
                      {item.label}
                    </Typography>
                  </Stack>
                </label>
              ))}
            </div>
          </div>

          {/* Observații */}
          <div>
            <label className='mb-1.5 block text-sm font-medium text-navy-700'>
              Observații documente
            </label>
            <textarea
              value={observatii}
              onChange={(e) => {
                setObservatii(e.target.value)
                setField('observatiiDocumente', e.target.value)
                markDirty()
              }}
              rows={3}
              placeholder='Observații sau cerințe suplimentare privind documentele și cadrul legal...'
              className='form-input'
            />
          </div>
        </Stack>
      </div>
    </section>
  )
}
