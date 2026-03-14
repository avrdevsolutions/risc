'use client'

import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { ArrowLeft, CheckCircle, Circle, FileDown, List, X } from 'lucide-react'

import { Typography, Stack, Button, Badge } from '@/components/ui'
import { EvaluareSyncProvider } from '@/context/EvaluareSyncContext'
import { useEvaluare, useUpdateEvaluare } from '@/hooks/use-evaluari'
import { SECTIUNI_NAVIGARE } from '@/lib/constants'
import { computeProgress } from '@/lib/evaluare-utils'
import type { EvaluareWithRiscuri } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useEvaluareFormStore } from '@/stores/evaluare-form-store'
import { useEvaluareSyncStore } from '@/stores/evaluare-sync-store'

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
import { SyncControls } from '../sync'

type Props = { id: string }

const StatusBar = ({
  evaluare,
  displayProjectName,
  onMarkComplete,
  isPending,
}: {
  evaluare: EvaluareWithRiscuri
  displayProjectName: string
  onMarkComplete: () => void
  isPending: boolean
}) => (
  <div
    className='sticky z-40 w-full border-b border-navy-200 bg-white/95 backdrop-blur-sm'
    style={{ top: '56px' }}
  >
    <div className='mx-auto flex max-w-screen-xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3 lg:px-8'>
      {/* Left: Back + Title */}
      <Stack direction='row' align='center' gap='2' className='min-w-0 flex-1'>
        <Link
          href='/evaluari'
          className='flex shrink-0 items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-navy-800'
        >
          <ArrowLeft className='size-4' />
          <span>Înapoi</span>
        </Link>
        <span className='shrink-0 text-navy-200'>|</span>
        <div className='min-w-0 flex-1'>
          <Typography variant='h4' className='truncate text-sm text-navy-900 sm:text-base'>
            {displayProjectName}
          </Typography>
          {evaluare.adresaLocatie && (
            <Typography variant='caption' className='hidden truncate text-navy-500 sm:block'>
              {evaluare.adresaLocatie}
            </Typography>
          )}
        </div>
      </Stack>

      {/* Right: Badge + Risk count (hidden on mobile) + Status button */}
      <Stack direction='row' align='center' gap='2' className='shrink-0'>
        <Badge variant={evaluare.status === 'completed' ? 'success' : 'warning'}>
          {evaluare.status === 'completed' ? 'Finalizat' : 'Ciornă'}
        </Badge>
        {/* Risk count hidden on mobile — visible in sidebar progress */}
        <Typography variant='caption' className='hidden text-navy-400 md:block'>
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
            {/* Shorter label on mobile */}
            <span className='hidden sm:inline'>Marchează finalizat</span>
            <span className='sm:hidden'>Finalizează</span>
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
            <span className='hidden sm:inline'>Redeschide</span>
          </Button>
        )}
      </Stack>
    </div>
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
    <section id='export-section' className='scroll-mt-32'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-sm'>
        <div className='mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-50'>
          <FileDown className='size-7 text-primary-500' />
        </div>
        <Typography variant='h3' className='mb-2 text-navy-900'>
          11. Export
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
        <Button size='lg' onClick={() => void handleExport()} loading={isExporting}>
          <FileDown className='size-5' />
          Descarcă Word (.docx)
        </Button>
      </div>
    </section>
  )
}

/** Mobile: bottom sheet navigation */
const MobileBottomSheet = ({
  isOpen,
  onClose,
  progress,
}: {
  isOpen: boolean
  onClose: () => void
  progress: number
}) => {
  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-sm md:hidden'
        onClick={onClose}
        aria-hidden='true'
      />
      {/* Sheet */}
      <div className='fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:hidden'>
        <div className='flex items-center justify-between border-b border-navy-100 px-4 py-3'>
          <Typography variant='h4' className='text-navy-900'>
            Navighează
          </Typography>
          <button
            onClick={onClose}
            className='rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700'
            aria-label='Închide'
          >
            <X className='size-5' />
          </button>
        </div>
        {/* Compact progress */}
        <div className='px-4 py-3'>
          <div className='mb-1.5 flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-navy-400'>
              Progres
            </span>
            <span className='text-sm font-bold text-primary-600'>{progress}%</span>
          </div>
          <div
            className='h-1.5 overflow-hidden rounded-full bg-navy-100'
            role='progressbar'
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className='h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {/* Section list */}
        <ul className='px-3 pb-6 pt-1'>
          {SECTIUNI_NAVIGARE.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className='flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900'
              >
                <span className='w-5 text-right font-mono text-xs text-navy-400'>{s.number}.</span>
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Read the project name from the local form store so the header updates
  // in real-time as the user types — before the data is synced to the DB.
  const localProjectName = useEvaluareFormStore(
    (s) => s.evaluareDataMap[id]?.denumireProiect as string | undefined,
  )

  // Reset the sync store whenever the evaluare ID changes so that isDirty
  // from a previous evaluation does not bleed into the new one.
  // Use a ref to skip the reset on the very first mount (no "previous" ID).
  const previousEvaluareIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (previousEvaluareIdRef.current !== null && previousEvaluareIdRef.current !== id) {
      useEvaluareSyncStore.getState().reset()
    }
    previousEvaluareIdRef.current = id
  }, [id])

  // Disable browser scroll restoration and force scroll to top on mount so the
  // page always starts at section 1 — not at the position the browser remembered
  // from a previous visit (which could cause the IntersectionObserver to
  // highlight a section deep in the page, e.g. "8. Concluzii").
  // The previous scrollRestoration value is restored on unmount so other routes
  // are not affected by this page-level override.
  useEffect(() => {
    const previousScrollRestoration =
      'scrollRestoration' in history ? history.scrollRestoration : null
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    return () => {
      if (previousScrollRestoration !== null) {
        history.scrollRestoration = previousScrollRestoration
      }
    }
  }, [])

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

  const progress = computeProgress(evaluare)

  // Derive the display project name: local store (real-time) takes precedence
  // over query-cache data so the header updates as the user types.
  const displayProjectName = (localProjectName ?? evaluare.denumireProiect) || 'Evaluare nouă'

  return (
    <EvaluareSyncProvider evaluareId={id}>
      {/* Full-width status bar — sits outside the constrained content area */}
      <StatusBar
        evaluare={evaluare}
        displayProjectName={displayProjectName}
        onMarkComplete={handleToggleStatus}
        isPending={update.isPending}
      />

      {/* Constrained content area — pb-20 ensures the floating SyncButton never overlaps content */}
      <div className='mx-auto max-w-screen-xl px-4 pb-20 pt-6 sm:px-6 lg:px-8'>
        <div className='flex gap-6'>
          <SectiuniNav evaluare={evaluare} />

          <div className='min-w-0 flex-1 space-y-6'>
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

      <SyncControls />

      {/* Mobile FAB */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className={cn(
          'fixed bottom-20 right-4 z-40 flex size-11 items-center justify-center rounded-full bg-navy-900 text-white shadow-lg md:hidden',
          'transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2',
        )}
        aria-label='Deschide navigare secțiuni'
      >
        <List className='size-5' />
      </button>

      <MobileBottomSheet
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        progress={progress}
      />
    </EvaluareSyncProvider>
  )
}
