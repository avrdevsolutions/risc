'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ArrowLeft, CheckCircle, Circle, FileDown } from 'lucide-react'

import { Typography, Stack, Button, Badge } from '@/components/ui'
import { useEvaluare, useUpdateEvaluare } from '@/hooks/use-evaluari'
import type { EvaluareWithRiscuri } from '@/lib/types'

import { AprobareSection } from '../aprobare'
import { DocumenteSection } from '../documente'
import { EvaluatorSection } from '../evaluator'
import { SectiuniNav } from '../nav'
import { ObiectivSection } from '../obiectiv'
import { ProiectSection } from '../proiect'
import { RiscuriSection } from '../riscuri'

type Props = { id: string }

const StatusBar = ({
  evaluare,
  onMarkComplete,
  isPending,
}: {
  evaluare: EvaluareWithRiscuri
  onMarkComplete: () => void
  isPending: boolean
}) => (
  <div className='mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-100 bg-surface p-4 shadow-card'>
    <Stack direction='row' align='center' gap='3'>
      <Link
        href='/evaluari'
        className='flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-700'
      >
        <ArrowLeft className='size-4' />
        Înapoi
      </Link>
      <span className='text-navy-300'>|</span>
      <div>
        <Typography variant='h4' className='text-navy-700'>
          {evaluare.denumireProiect ?? 'Evaluare nouă'}
        </Typography>
        {evaluare.adresaLocatie && (
          <Typography variant='caption' className='text-navy-500'>
            {evaluare.adresaLocatie}
          </Typography>
        )}
      </div>
    </Stack>

    <Stack direction='row' align='center' gap='3'>
      <Badge variant={evaluare.status === 'completed' ? 'success' : 'warning'}>
        {evaluare.status === 'completed' ? 'Finalizat' : 'Ciornă'}
      </Badge>
      <Typography variant='caption' className='text-navy-400'>
        {evaluare.riscuri.length} riscuri identificate
      </Typography>
      {evaluare.status === 'draft' && (
        <Button
          variant='outline'
          size='sm'
          onClick={onMarkComplete}
          loading={isPending}
          className='border-success-500 text-success-600 hover:bg-success-50'
        >
          <CheckCircle className='size-4' />
          Marchează finalizat
        </Button>
      )}
      {evaluare.status === 'completed' && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onMarkComplete}
          loading={isPending}
          className='text-navy-500'
        >
          <Circle className='size-4' />
          Redeschide
        </Button>
      )}
    </Stack>
  </div>
)

const ExportSection = ({ id }: { id: string }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setExportError(null)
    try {
      const response = await fetch(`/api/evaluari/${id}/export`)
      if (!response.ok) {
        throw new Error('Eroare la generarea documentului')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const disposition = response.headers.get('Content-Disposition') ?? ''
      const filenameMatch = disposition.match(/filename="([^"]+)"/)
      const filename = filenameMatch ? filenameMatch[1] : `evaluare-risc-${id}.docx`
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setExportError('Exportul a eșuat. Vă rugăm să încercați din nou.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section id='export-section' className='scroll-mt-20'>
      <div className='rounded-xl border border-primary-100 bg-surface p-6 shadow-card'>
        <Typography variant='h3' className='mb-4 text-navy-700'>
          📄 Export
        </Typography>
        <Typography variant='body-sm' className='mb-4 text-navy-500'>
          Exportați evaluarea de risc în format Microsoft Word (.docx).
        </Typography>
        {exportError && (
          <Typography variant='body-sm' className='mb-4 text-error-600'>
            {exportError}
          </Typography>
        )}
        <Button variant='outline' onClick={handleExport} loading={isExporting}>
          <FileDown className='size-4' />
          Export Word (.docx)
        </Button>
      </div>
    </section>
  )
}

export const EvaluarePage = ({ id }: Props) => {
  const { data: evaluare, isLoading, isError } = useEvaluare(id)
  const update = useUpdateEvaluare(id)

  const handleToggleStatus = () => {
    if (!evaluare) return
    update.mutate({
      status: evaluare.status === 'draft' ? 'completed' : 'draft',
      ...(evaluare.status === 'draft'
        ? { completedAt: new Date().toISOString() }
        : { completedAt: null }),
    })
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-48 animate-pulse rounded-xl bg-primary-50' />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !evaluare) {
    return (
      <div className='mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='rounded-xl bg-error-50 p-6 text-center'>
          <Typography variant='h4' className='text-error-700'>
            Evaluarea nu a putut fi încărcată
          </Typography>
          <Typography variant='body-sm' className='mt-2 text-error-600'>
            Verificați conexiunea la baza de date sau reveniți mai târziu.
          </Typography>
          <Link href='/evaluari'>
            <Button variant='outline' className='mt-4'>
              <ArrowLeft className='size-4' />
              Înapoi la liste
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8'>
      <StatusBar
        evaluare={evaluare}
        onMarkComplete={handleToggleStatus}
        isPending={update.isPending}
      />

      <div className='flex gap-6'>
        <SectiuniNav />

        <div className='min-w-0 flex-1 space-y-6'>
          <ProiectSection evaluare={evaluare} />
          <EvaluatorSection evaluare={evaluare} />
          <ObiectivSection evaluare={evaluare} />
          <RiscuriSection evaluare={evaluare} />
          <AprobareSection evaluare={evaluare} />
          <DocumenteSection evaluare={evaluare} />
          <ExportSection id={id} />
        </div>
      </div>
    </div>
  )
}
