'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Typography, Stack, Button } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { TIP_IMPREJMUIRE, TIP_ACCES } from '@/lib/constants'
import type { Evaluare } from '@/lib/types'

const ObiectivSchema = z.object({
  suprafataTotala: z.string().optional(),
  descriereAmplasare: z.string().optional(),
  tipImprejmuire: z.string().optional(),
  tipAcces: z.string().optional(),
  vecinNord: z.string().optional(),
  vecinEst: z.string().optional(),
  vecinSud: z.string().optional(),
  vecinVest: z.string().optional(),
})

type ObiectivFormValues = z.infer<typeof ObiectivSchema>

type Props = { evaluare: Evaluare }

const toFormValues = (evaluare: Evaluare): ObiectivFormValues => ({
  suprafataTotala: evaluare.suprafataTotala ?? '',
  descriereAmplasare: evaluare.descriereAmplasare ?? '',
  tipImprejmuire: evaluare.tipImprejmuire ?? '',
  tipAcces: evaluare.tipAcces ?? '',
  vecinNord: evaluare.vecinNord ?? '',
  vecinEst: evaluare.vecinEst ?? '',
  vecinSud: evaluare.vecinSud ?? '',
  vecinVest: evaluare.vecinVest ?? '',
})

export const ObiectivSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ObiectivFormValues>({
    resolver: zodResolver(ObiectivSchema),
    defaultValues: toFormValues(evaluare),
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reset(toFormValues(evaluare))
  }, [evaluare.id, reset])

  const onSubmit = (data: ObiectivFormValues) => {
    update.mutate(data)
  }

  return (
    <section id='obiectiv-section' className='scroll-mt-20'>
      <div className='rounded-xl border border-primary-100 bg-surface p-6 shadow-card'>
        <Typography variant='h3' className='mb-6 text-navy-700'>
          🏗️ Descriere Amplasament
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap='6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Suprafață totală (mp)
                </label>
                <input
                  {...register('suprafataTotala')}
                  type='text'
                  placeholder='Ex: 2500'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Tip împrejmuire
                </label>
                <select
                  {...register('tipImprejmuire')}
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                >
                  <option value=''>Selectați...</option>
                  {TIP_IMPREJMUIRE.map((tip) => (
                    <option key={tip} value={tip}>
                      {tip}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>Tip acces</label>
                <select
                  {...register('tipAcces')}
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                >
                  <option value=''>Selectați...</option>
                  {TIP_ACCES.map((tip) => (
                    <option key={tip} value={tip}>
                      {tip}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Descriere amplasare
              </label>
              <textarea
                {...register('descriereAmplasare')}
                rows={3}
                placeholder='Descrieți amplasamentul șantierului...'
                className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
              />
            </div>

            <div>
              <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
                Vecinătăți
              </Typography>
              <div className='grid grid-cols-2 gap-4'>
                {(
                  [
                    { field: 'vecinNord', label: 'Nord' },
                    { field: 'vecinEst', label: 'Est' },
                    { field: 'vecinSud', label: 'Sud' },
                    { field: 'vecinVest', label: 'Vest' },
                  ] as const
                ).map(({ field, label }) => (
                  <div key={field}>
                    <label className='mb-1.5 block text-xs font-medium text-navy-600'>
                      {label}
                    </label>
                    <input
                      {...register(field)}
                      type='text'
                      placeholder={`Vecinătate ${label.toLowerCase()}`}
                      className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='flex justify-end'>
              <Button type='submit' loading={update.isPending} disabled={!isDirty}>
                Salvează amplasament
              </Button>
            </div>
          </Stack>
        </form>
      </div>
    </section>
  )
}
