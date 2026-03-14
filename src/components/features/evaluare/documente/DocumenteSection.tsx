'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { FileCheck } from 'lucide-react'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useAutosave } from '@/hooks/useAutosave'
import { DOCUMENTE_SUPORT, CADRU_LEGAL } from '@/lib/constants'
import type { Evaluare } from '@/lib/types'

import { AutosaveIndicator } from '../AutosaveIndicator'

type Props = { evaluare: Evaluare }

const parseStringArray = (val: string | null): string[] => {
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

  const [selectedDoc, setSelectedDoc] = useState<string[]>(
    parseStringArray(evaluare.documenteAplicabile),
  )
  const [selectedAnexe, setSelectedAnexe] = useState<string[]>(() => {
    const saved = parseStringArray(evaluare.anexeSelectate)
    if (saved.length > 0) return saved
    // Pre-select default cadru legal items for new evaluations
    return CADRU_LEGAL.filter((item) => item.checked).map((item) => item.value)
  })
  const [observatii, setObservatii] = useState(evaluare.observatiiDocumente ?? '')

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

  const toggleDoc = (id: string) => {
    setSelectedDoc((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
  }

  const toggleAnexa = (anexa: string) => {
    setSelectedAnexe((prev) =>
      prev.includes(anexa) ? prev.filter((a) => a !== anexa) : [...prev, anexa],
    )
  }

  const autosaveValues = {
    documenteAplicabile: JSON.stringify(selectedDoc),
    anexeSelectate: JSON.stringify(selectedAnexe),
    observatiiDocumente: observatii,
  }

  const handleSave = useCallback(
    async (data: Partial<typeof autosaveValues>) => {
      await update.mutateAsync(data as Partial<Evaluare>)
    },
    [update],
  )

  const status = useAutosave({ values: autosaveValues, onSave: handleSave })

  return (
    <section id='documente-section' className='scroll-mt-20'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          Documente suport
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
              onChange={(e) => setObservatii(e.target.value)}
              rows={3}
              placeholder='Observații sau cerințe suplimentare privind documentele și cadrul legal...'
              className='form-input'
            />
          </div>

          <AutosaveIndicator status={status} />
        </Stack>
      </div>
    </section>
  )
}
