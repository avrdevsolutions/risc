'use client'

import { useRouter } from 'next/navigation'

import { PlusCircle, Copy, Trash2, ClipboardList, AlertCircle, ArrowRight } from 'lucide-react'

import { Typography, Button, Stack } from '@/components/ui'
import {
  useEvaluari,
  useCreateEvaluare,
  useDeleteEvaluare,
  useDuplicateEvaluare,
} from '@/hooks/use-evaluari'
import type { Evaluare } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusLabel: Record<Evaluare['status'], string> = {
  draft: 'Ciornă',
  completed: 'Finalizat',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const EvaluareCard = ({
  evaluare,
  onOpen,
  onDuplicate,
  onDelete,
}: {
  evaluare: Evaluare
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
}) => (
  <div
    className='group cursor-pointer rounded-2xl border border-navy-200 bg-white p-5 shadow-sm transition-all hover:border-navy-300 hover:shadow-md'
    onClick={onOpen}
    role='button'
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onOpen()
      }
    }}
    aria-label={`Deschide evaluarea: ${evaluare.denumireProiect ?? 'Evaluare nouă'}`}
  >
    <div className='flex items-start gap-3'>
      <div className='min-w-0 flex-1'>
        {/* Status dot + status text */}
        <div className='mb-2 flex items-center gap-2'>
          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              evaluare.status === 'completed' ? 'bg-success-500' : 'bg-accent-500',
            )}
          />
          <span className='text-xs font-medium text-navy-500'>{statusLabel[evaluare.status]}</span>
          {evaluare.fazaLucrarii && (
            <span className='text-xs text-navy-400'>· {evaluare.fazaLucrarii}</span>
          )}
        </div>

        {/* Title */}
        <Typography variant='h4' className='truncate text-navy-900'>
          {evaluare.denumireProiect ?? 'Evaluare nouă'}
        </Typography>

        {/* Meta info */}
        <div className='mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1'>
          {evaluare.adresaLocatie && (
            <span className='text-xs text-navy-500'>📍 {evaluare.adresaLocatie}</span>
          )}
          <span className='text-xs text-navy-400'>Modificat: {formatDate(evaluare.updatedAt)}</span>
        </div>
      </div>

      {/* Action buttons — stop card click propagation */}
      <div className='flex shrink-0 items-center gap-1' onClick={(e) => e.stopPropagation()}>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDuplicate}
          aria-label='Duplică evaluarea'
          title='Duplică'
          className='size-8 opacity-0 transition-opacity group-hover:opacity-100'
        >
          <Copy className='size-3.5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDelete}
          aria-label='Șterge evaluarea'
          title='Șterge'
          className='size-8 text-error-600 opacity-0 transition-opacity hover:bg-error-50 group-hover:opacity-100'
        >
          <Trash2 className='size-3.5' />
        </Button>
      </div>

      <ArrowRight className='size-5 shrink-0 self-center text-navy-300 transition-transform group-hover:translate-x-0.5' />
    </div>
  </div>
)

const SkeletonCard = () => (
  <div className='rounded-2xl border border-navy-200 bg-white p-5'>
    <div className='mb-2 flex items-center gap-2'>
      <div className='size-2 animate-pulse rounded-full bg-navy-200' />
      <div className='h-3 w-16 animate-pulse rounded bg-navy-200' />
    </div>
    <div className='mb-2 h-5 w-2/3 animate-pulse rounded-lg bg-navy-200' />
    <div className='h-3 w-1/2 animate-pulse rounded bg-navy-100' />
  </div>
)

export const DashboardPage = () => {
  const router = useRouter()
  const { data: evaluari, isLoading, isError } = useEvaluari()
  const createMutation = useCreateEvaluare()
  const deleteMutation = useDeleteEvaluare()
  const duplicateMutation = useDuplicateEvaluare()

  const handleCreate = async () => {
    const created = await createMutation.mutateAsync()
    router.push(`/evaluari/${created.id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Sigur doriți să ștergeți această evaluare?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleDuplicate = async (id: string) => {
    const copy = await duplicateMutation.mutateAsync(id)
    router.push(`/evaluari/${copy.id}`)
  }

  return (
    <div className='mx-auto max-w-screen-lg px-4 py-8 sm:px-6 lg:px-8'>
      <Stack direction='row' justify='between' align='center' gap='4' className='mb-8'>
        <div>
          <Typography variant='h2' className='text-navy-900'>
            Evaluările mele
          </Typography>
          <Typography variant='body-sm' className='mt-1 text-navy-500'>
            Gestionează evaluările de securitate și sănătate
          </Typography>
        </div>
        <Button onClick={handleCreate} loading={createMutation.isPending} className='shrink-0'>
          <PlusCircle className='size-4' />
          Evaluare nouă
        </Button>
      </Stack>

      {isLoading && (
        <Stack gap='3'>
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </Stack>
      )}

      {isError && (
        <div className='flex items-center gap-3 rounded-xl border border-error-100 bg-error-50 p-4 text-error-700'>
          <AlertCircle className='size-5 shrink-0' />
          <Typography variant='body-sm'>
            Eroare la încărcarea evaluărilor. Verificați conexiunea la baza de date.
          </Typography>
        </div>
      )}

      {!isLoading && !isError && evaluari?.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-200 py-20 text-center'>
          <div className='mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-50'>
            <ClipboardList className='size-8 text-primary-500' />
          </div>
          <Typography variant='h4' className='text-navy-700'>
            Nicio evaluare creată încă
          </Typography>
          <Typography variant='body-sm' className='mt-1 max-w-xs text-navy-400'>
            Creați primul raport de evaluare a securității fizice pentru a începe
          </Typography>
          <Button className='mt-6' onClick={handleCreate} loading={createMutation.isPending}>
            <PlusCircle className='size-4' />
            Creează evaluare
          </Button>
        </div>
      )}

      {!isLoading && !isError && evaluari && evaluari.length > 0 && (
        <Stack gap='3'>
          {evaluari.map((ev) => (
            <EvaluareCard
              key={ev.id}
              evaluare={ev}
              onOpen={() => router.push(`/evaluari/${ev.id}`)}
              onDuplicate={() => handleDuplicate(ev.id)}
              onDelete={() => handleDelete(ev.id)}
            />
          ))}
        </Stack>
      )}
    </div>
  )
}
