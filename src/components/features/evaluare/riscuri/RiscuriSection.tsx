'use client'

import { useState } from 'react'

import { PlusCircle, AlertTriangle } from 'lucide-react'

import { Typography, Stack, Button } from '@/components/ui'
import { useAddRisc, useUpdateRisc, useDeleteRisc } from '@/hooks/use-riscuri'
import { getRiskLevel } from '@/lib/constants'
import type { RiscFormValues } from '@/lib/schemas'
import type { Risc, EvaluareWithRiscuri } from '@/lib/types'

import { RiscCard } from './RiscCard'
import { RiscFormModal } from './RiscFormModal'

type Props = { evaluare: EvaluareWithRiscuri }

const SumarRiscuri = ({ riscuri }: { riscuri: Risc[] }) => {
  const counts = { critic: 0, ridicat: 0, mediu: 0, scazut: 0 }
  riscuri.forEach((r) => {
    if (r.probabilitateInitiala && r.severitateInitiala) {
      const level = getRiskLevel(r.probabilitateInitiala, r.severitateInitiala)
      counts[level as keyof typeof counts]++
    }
  })

  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
      <div className='rounded-lg bg-error-50 p-3 text-center'>
        <Typography variant='h3' className='text-error-600'>
          {counts.critic}
        </Typography>
        <Typography variant='caption' className='text-error-700'>
          Critice
        </Typography>
      </div>
      <div className='rounded-lg bg-warning-50 p-3 text-center'>
        <Typography variant='h3' className='text-warning-600'>
          {counts.ridicat}
        </Typography>
        <Typography variant='caption' className='text-warning-700'>
          Ridicate
        </Typography>
      </div>
      <div className='rounded-lg bg-primary-50 p-3 text-center'>
        <Typography variant='h3' className='text-primary-600'>
          {counts.mediu}
        </Typography>
        <Typography variant='caption' className='text-primary-700'>
          Medii
        </Typography>
      </div>
      <div className='rounded-lg bg-success-50 p-3 text-center'>
        <Typography variant='h3' className='text-success-600'>
          {counts.scazut}
        </Typography>
        <Typography variant='caption' className='text-success-700'>
          Scăzute
        </Typography>
      </div>
    </div>
  )
}

const AddModalWrapper = ({ evaluareId, onClose }: { evaluareId: string; onClose: () => void }) => {
  const mutation = useAddRisc(evaluareId)
  const handleSubmit = async (data: RiscFormValues) => {
    await mutation.mutateAsync(data)
    onClose()
  }
  return <RiscFormModal onClose={onClose} onSubmit={handleSubmit} isPending={mutation.isPending} />
}

const EditModalWrapper = ({
  evaluareId,
  risc,
  onClose,
}: {
  evaluareId: string
  risc: Risc
  onClose: () => void
}) => {
  const mutation = useUpdateRisc(evaluareId, risc.id)
  const handleSubmit = async (data: RiscFormValues) => {
    await mutation.mutateAsync(data)
    onClose()
  }
  return (
    <RiscFormModal
      onClose={onClose}
      onSubmit={handleSubmit}
      initialData={risc}
      isPending={mutation.isPending}
    />
  )
}

export const RiscuriSection = ({ evaluare }: Props) => {
  const [addOpen, setAddOpen] = useState(false)
  const [editingRisc, setEditingRisc] = useState<Risc | null>(null)
  const deleteRiscMutation = useDeleteRisc(evaluare.id)

  const handleDelete = (riscId: string) => {
    if (confirm('Sigur doriți să ștergeți acest risc?')) {
      deleteRiscMutation.mutate(riscId)
    }
  }

  return (
    <section id='riscuri-section' className='scroll-mt-20'>
      <div className='rounded-xl border border-primary-100 bg-surface p-6 shadow-card'>
        <Stack direction='row' justify='between' align='center' gap='4' className='mb-6'>
          <Typography variant='h3' className='text-navy-700'>
            ⚠️ Identificare Riscuri
          </Typography>
          <Button onClick={() => setAddOpen(true)}>
            <PlusCircle className='size-4' />
            Adaugă risc
          </Button>
        </Stack>

        {evaluare.riscuri.length > 0 && (
          <div className='mb-6'>
            <SumarRiscuri riscuri={evaluare.riscuri} />
          </div>
        )}

        {evaluare.riscuri.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary-200 py-12 text-center'>
            <AlertTriangle className='mb-3 size-10 text-warning-500' />
            <Typography variant='h4' className='text-navy-600'>
              Niciun risc identificat
            </Typography>
            <Typography variant='body-sm' className='mt-1 text-navy-400'>
              Adăugați riscurile identificate pe șantier
            </Typography>
            <Button className='mt-4' onClick={() => setAddOpen(true)}>
              <PlusCircle className='size-4' />
              Adaugă primul risc
            </Button>
          </div>
        ) : (
          <Stack gap='3'>
            {evaluare.riscuri.map((risc, i) => (
              <RiscCard
                key={risc.id}
                risc={risc}
                index={i + 1}
                onEdit={() => setEditingRisc(risc)}
                onDelete={() => handleDelete(risc.id)}
              />
            ))}
          </Stack>
        )}
      </div>

      {addOpen && <AddModalWrapper evaluareId={evaluare.id} onClose={() => setAddOpen(false)} />}

      {editingRisc && (
        <EditModalWrapper
          evaluareId={evaluare.id}
          risc={editingRisc}
          onClose={() => setEditingRisc(null)}
        />
      )}
    </section>
  )
}
