'use client'

import { useRouter } from 'next/navigation'

import { PlusCircle, FileText, AlertCircle, Trash2 } from 'lucide-react'

import { Typography, Button, Stack } from '@/components/ui'
import { usePlanuri, useCreatePlan, useDeletePlan } from '@/hooks/use-plan-de-paza'
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

const PlanCard = ({
  plan,
  onOpen,
  onDelete,
}: {
  plan: Evaluare
  onOpen: () => void
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
    aria-label={`Deschide planul: ${plan.denumireProiect ?? 'Plan nou'}`}
  >
    <div className='flex items-start gap-3'>
      <div className='min-w-0 flex-1'>
        <div className='mb-2 flex items-center gap-2'>
          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              plan.status === 'completed' ? 'bg-success-500' : 'bg-accent-500',
            )}
          />
          <span className='text-xs font-medium text-navy-500'>{statusLabel[plan.status]}</span>
        </div>
        <Typography variant='h4' className='truncate text-navy-900'>
          {plan.denumireProiect ?? 'Plan nou'}
        </Typography>
        <div className='mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1'>
          {plan.adresaLocatie && (
            <span className='text-xs text-navy-500'>📍 {plan.adresaLocatie}</span>
          )}
          <span className='text-xs text-navy-400'>Modificat: {formatDate(plan.updatedAt)}</span>
        </div>
      </div>
      <div className='flex shrink-0 items-center gap-1' onClick={(e) => e.stopPropagation()}>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDelete}
          aria-label='Șterge planul'
          title='Șterge'
          className='size-8 text-error-600 opacity-0 transition-opacity hover:bg-error-50 group-hover:opacity-100'
        >
          <Trash2 className='size-3.5' />
        </Button>
      </div>
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

export const PlanDePazaDashboardPage = () => {
  const router = useRouter()
  const { data: planuri, isLoading, isError } = usePlanuri()
  const createMutation = useCreatePlan()
  const deleteMutation = useDeletePlan()

  const handleCreate = async () => {
    const created = await createMutation.mutateAsync()
    router.push(`/plan-de-paza/${created.id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Sigur doriți să ștergeți acest plan?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className='mx-auto max-w-screen-lg px-4 py-8 sm:px-6 lg:px-8'>
      <Stack direction='row' justify='between' align='center' gap='4' className='mb-8'>
        <div>
          <Typography variant='h2' className='text-navy-900'>
            Planuri de Pază
          </Typography>
          <Typography variant='body-sm' className='mt-1 text-navy-500'>
            Planuri de pază conform Legii 333/2003
          </Typography>
        </div>
        <Button onClick={handleCreate} loading={createMutation.isPending} className='shrink-0'>
          <PlusCircle className='size-4' />
          Plan nou
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
            Eroare la încărcarea planurilor. Verificați conexiunea la baza de date.
          </Typography>
        </div>
      )}

      {!isLoading && !isError && planuri?.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-200 py-20 text-center'>
          <div className='mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-50'>
            <FileText className='size-8 text-primary-500' />
          </div>
          <Typography variant='h4' className='text-navy-700'>
            Niciun plan de pază creat încă
          </Typography>
          <Typography variant='body-sm' className='mt-1 max-w-xs text-navy-400'>
            Creați primul plan de pază conform Legii 333/2003
          </Typography>
          <Button className='mt-6' onClick={handleCreate} loading={createMutation.isPending}>
            <PlusCircle className='size-4' />
            Creează plan
          </Button>
        </div>
      )}

      {!isLoading && !isError && planuri && planuri.length > 0 && (
        <Stack gap='3'>
          {planuri.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onOpen={() => router.push(`/plan-de-paza/${plan.id}`)}
              onDelete={() => handleDelete(plan.id)}
            />
          ))}
        </Stack>
      )}
    </div>
  )
}
