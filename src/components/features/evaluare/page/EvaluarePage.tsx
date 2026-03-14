'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ArrowLeft, CheckCircle, Circle, FileDown } from 'lucide-react'

import { Typography, Stack, Button, Badge } from '@/components/ui'
import { useEvaluare, useUpdateEvaluare } from '@/hooks/use-evaluari'
import type { EvaluareWithRiscuri } from '@/lib/types'
import { cn } from '@/lib/utils'

import { AprobareSection } from '../aprobare'
import { CadruOrganizationalSection } from '../cadruOrganizational'
import { ConcluziiSection } from '../concluzii'
import { DocumenteSection } from '../documente'
import { EvaluatorSection } from '../evaluator'
import { MasuriSection } from '../masuri'
import { SectiuniNav } from '../nav'
import { ObiectivSection } from '../obiectiv'
import { ProiectSection } from '../proiect'
import { RiscuriSection } from '../riscuri'
import { SumarSection } from '../sumar'

type Props = { id: string }

const computeProgress = (evaluare: EvaluareWithRiscuri): number => {
  const requiredFields: (string | null | undefined)[] = [
    evaluare.denumireProiect,
    evaluare.adresaLocatie,
    evaluare.beneficiar,
    evaluare.antreprenor,
    evaluare.fazaLucrarii,
    evaluare.numeEvaluator,
    evaluare.functieEvaluator,
    evaluare.dataEvaluarii,
    evaluare.dataRevizuirii,
    evaluare.sefSantier,
    evaluare.responsabilSSM,
    evaluare.dataAprobarii,
  ]
  const filledFields = requiredFields.filter(
    (v) => v !== null && v !== undefined && v !== '',
  ).length

  // Count riscuri as a single required item (1 or more risks needed)
  const hasRiscuri = evaluare.riscuri.length > 0
  const totalItems = requiredFields.length + 1
  const filledItems = filledFields + (hasRiscuri ? 1 : 0)

  return Math.round((filledItems / totalItems) * 100)
}

const ProgressBar = ({ evaluare }: { evaluare: EvaluareWithRiscuri }) => {
  const progress = computeProgress(evaluare)
  const colorClass =
    progress >= 80 ? 'text-success-500' : progress >= 40 ? 'text-accent-500' : 'text-error-500'
  const barColor =
    progress >= 80
      ? 'from-success-500 to-success-600'
      : progress >= 40
        ? 'from-accent-500 to-accent-600'
        : 'from-primary-500 to-primary-600'

  return (
    <div className='mb-6 rounded-2xl bg-navy-900 px-5 py-4 shadow-sm'>
      <div className='mb-2.5 flex items-center justify-between'>
        <Typography variant='body-sm' className='font-medium text-white' id='progress-label'>
          Progres completare documentație
        </Typography>
        <span className={cn('text-sm font-bold', colorClass)}>{progress}% completat</span>
      </div>
      <div
        className='h-2 overflow-hidden rounded-full bg-navy-700'
        role='progressbar'
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby='progress-label'
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-300',
            barColor,
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

const StatusBar = ({
  evaluare,
  onMarkComplete,
  isPending,
}: {
  evaluare: EvaluareWithRiscuri
  onMarkComplete: () => void
  isPending: boolean
}) => (
  <div className='mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-200 bg-white p-4 shadow-sm'>
    <Stack direction='row' align='center' gap='3'>
      <Link
        href='/evaluari'
        className='flex items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-navy-800'
      >
        <ArrowLeft className='size-4' />
        Înapoi
      </Link>
      <span className='text-navy-200'>|</span>
      <div>
        <Typography variant='h4' className='text-navy-900'>
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
        {evaluare.riscuri.length} amenințări identificate
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
      <div className='rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-sm'>
        <div className='mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-50'>
          <FileDown className='size-7 text-primary-500' />
        </div>
        <Typography variant='h3' className='mb-2 text-navy-900'>
          Documentul este gata de export
        </Typography>
        <Typography variant='body-sm' className='mb-6 text-navy-500'>
          Exportați raportul de evaluare în format Microsoft Word (.docx) — Conform Instrucțiunilor
          M.A.I. nr. 9/2013.
        </Typography>
        {exportError && (
          <Typography variant='body-sm' className='mb-4 text-error-600'>
            {exportError}
          </Typography>
        )}
        <Button size='lg' onClick={handleExport} loading={isExporting}>
          <FileDown className='size-5' />
          Descarcă Word (.docx)
        </Button>
      </div>
    </section>
  )
}

const LoadingSkeleton = () => (
  <div className='mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8'>
    <div className='mb-6 h-16 animate-pulse rounded-2xl bg-navy-100' />
    <div className='flex gap-6'>
      <div className='hidden w-56 shrink-0 lg:block'>
        <div className='h-96 animate-pulse rounded-2xl bg-navy-100' />
      </div>
      <div className='min-w-0 flex-1 space-y-4'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='h-48 animate-pulse rounded-2xl bg-navy-100' />
        ))}
      </div>
    </div>
  </div>
)

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
    return <LoadingSkeleton />
  }

  if (isError || !evaluare) {
    return (
      <div className='mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='rounded-2xl border border-error-100 bg-error-50 p-6 text-center'>
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
          <ProgressBar evaluare={evaluare} />
          <ProiectSection evaluare={evaluare} />
          <EvaluatorSection evaluare={evaluare} />
          <ObiectivSection evaluare={evaluare} />
          <CadruOrganizationalSection evaluare={evaluare} />
          <RiscuriSection evaluare={evaluare} />
          <SumarSection evaluare={evaluare} />
          <MasuriSection evaluare={evaluare} />
          <ConcluziiSection evaluare={evaluare} />
          <AprobareSection evaluare={evaluare} />
          <DocumenteSection evaluare={evaluare} />
          <ExportSection id={id} />
        </div>
      </div>
    </div>
  )
}
