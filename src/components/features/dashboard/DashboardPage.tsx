'use client'

import { useRouter } from 'next/navigation'

import { PlusCircle, Copy, Trash2, FileText, AlertCircle } from 'lucide-react'

import { Typography, Button, Badge, Stack } from '@/components/ui'
import {
  useEvaluari,
  useCreateEvaluare,
  useDeleteEvaluare,
  useDuplicateEvaluare,
} from '@/hooks/use-evaluari'
import type { Evaluare } from '@/lib/types'

const statusLabel: Record<Evaluare['status'], string> = {
  draft: 'Ciornă',
  completed: 'Finalizat',
}

const statusVariant: Record<Evaluare['status'], 'warning' | 'success'> = {
  draft: 'warning',
  completed: 'success',
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
  <div className='rounded-lg border border-primary-100 bg-surface p-5 shadow-card transition-shadow hover:shadow-md'>
    <Stack direction='row' justify='between' align='start' gap='3'>
      <div className='min-w-0 flex-1'>
        <Stack direction='row' align='center' gap='2' className='mb-1'>
          <Badge variant={statusVariant[evaluare.status]}>{statusLabel[evaluare.status]}</Badge>
          {evaluare.fazaLucrarii && (
            <Typography variant='caption' className='text-navy-500'>
              {evaluare.fazaLucrarii}
            </Typography>
          )}
        </Stack>
        <Typography variant='h4' className='truncate text-navy-700'>
          {evaluare.denumireProiect ?? 'Evaluare nouă'}
        </Typography>
        {evaluare.adresaLocatie && (
          <Typography variant='body-sm' className='mt-0.5 truncate text-navy-500'>
            {evaluare.adresaLocatie}
          </Typography>
        )}
        <Typography variant='caption' className='mt-2 text-navy-400'>
          Modificat: {formatDate(evaluare.updatedAt)}
        </Typography>
      </div>
      <Stack direction='row' gap='1' className='shrink-0'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDuplicate}
          aria-label='Duplică evaluarea'
          title='Duplică'
        >
          <Copy className='size-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDelete}
          aria-label='Șterge evaluarea'
          title='Șterge'
          className='text-error-600 hover:bg-error-50'
        >
          <Trash2 className='size-4' />
        </Button>
        <Button size='sm' onClick={onOpen}>
          Deschide
        </Button>
      </Stack>
    </Stack>
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
          <Typography variant='h2' className='text-navy-700'>
            Evaluări de risc
          </Typography>
          <Typography variant='body-sm' className='mt-1 text-navy-500'>
            Gestionați evaluările de securitate și sănătate în muncă
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
            <div key={i} className='h-28 animate-pulse rounded-lg bg-primary-50' />
          ))}
        </Stack>
      )}

      {isError && (
        <div className='flex items-center gap-3 rounded-lg bg-error-50 p-4 text-error-700'>
          <AlertCircle className='size-5 shrink-0' />
          <Typography variant='body-sm'>
            Eroare la încărcarea evaluărilor. Verificați conexiunea la baza de date.
          </Typography>
        </div>
      )}

      {!isLoading && !isError && evaluari?.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary-200 py-16 text-center'>
          <FileText className='mb-4 size-12 text-primary-300' />
          <Typography variant='h4' className='text-navy-600'>
            Nicio evaluare creată încă
          </Typography>
          <Typography variant='body-sm' className='mt-1 text-navy-400'>
            Creați prima evaluare de risc pentru șantierul dumneavoastră
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
