'use client'

import { useCallback, useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useAutosave } from '@/hooks/useAutosave'
import { AprobareSchema } from '@/lib/schemas'
import type { AprobareFormValues } from '@/lib/schemas'
import type { Evaluare } from '@/lib/types'

import { AutosaveIndicator } from '../AutosaveIndicator'

type Props = { evaluare: Evaluare }

const toFormValues = (evaluare: Evaluare): AprobareFormValues => ({
  sefSantier: evaluare.sefSantier ?? '',
  functieSefSantier: evaluare.functieSefSantier ?? '',
  responsabilSSM: evaluare.responsabilSSM ?? '',
  functieResponsabilSSM: evaluare.functieResponsabilSSM ?? '',
  dataAprobarii: evaluare.dataAprobarii ?? '',
  observatiiGenerale: evaluare.observatiiGenerale ?? '',
})

export const AprobareSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<AprobareFormValues>({
    resolver: zodResolver(AprobareSchema),
    defaultValues: toFormValues(evaluare),
  })

  const values = watch()

  useEffect(() => {
    reset(toFormValues(evaluareRef.current))
  }, [evaluare.id, reset])

  const handleSave = useCallback(
    async (data: Partial<AprobareFormValues>) => {
      await update.mutateAsync(data as Partial<Evaluare>)
    },
    [update],
  )

  const status = useAutosave({ values, onSave: handleSave })

  const inputCls =
    'w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'

  return (
    <section id='aprobare-section' className='scroll-mt-20'>
      <div className='rounded-xl border border-primary-100 bg-surface p-6 shadow-card'>
        <Typography variant='h3' className='mb-6 text-navy-700'>
          ✅ Semnături &amp; Asumare
        </Typography>

        <form noValidate>
          <Stack gap='6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='rounded-lg border border-primary-100 p-4'>
                <Typography variant='body-sm' className='mb-3 font-semibold text-navy-700'>
                  Conducător unitate
                </Typography>
                <Stack gap='3'>
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                      Nume <span className='text-error-500'>*</span>
                    </label>
                    <input
                      {...register('sefSantier')}
                      type='text'
                      placeholder='Nume și prenume'
                      className={inputCls}
                    />
                    {errors.sefSantier && (
                      <p className='mt-1 text-xs text-error-600'>{errors.sefSantier.message}</p>
                    )}
                  </div>
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                      Funcție
                    </label>
                    <input
                      {...register('functieSefSantier')}
                      type='text'
                      placeholder='Ex: Administrator, Director'
                      className={inputCls}
                    />
                  </div>
                  <div className='mt-8 border-t border-navy-200 pt-2'>
                    <Typography variant='caption' className='text-navy-400'>
                      Semnătură
                    </Typography>
                  </div>
                </Stack>
              </div>

              <div className='rounded-lg border border-primary-100 p-4'>
                <Typography variant='body-sm' className='mb-3 font-semibold text-navy-700'>
                  Responsabil securitate fizică
                </Typography>
                <Stack gap='3'>
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                      Nume <span className='text-error-500'>*</span>
                    </label>
                    <input
                      {...register('responsabilSSM')}
                      type='text'
                      placeholder='Nume și prenume'
                      className={inputCls}
                    />
                    {errors.responsabilSSM && (
                      <p className='mt-1 text-xs text-error-600'>{errors.responsabilSSM.message}</p>
                    )}
                  </div>
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                      Funcție
                    </label>
                    <input
                      {...register('functieResponsabilSSM')}
                      type='text'
                      placeholder='Ex: Responsabil securitate fizică'
                      className={inputCls}
                    />
                  </div>
                  <div className='mt-8 border-t border-navy-200 pt-2'>
                    <Typography variant='caption' className='text-navy-400'>
                      Semnătură
                    </Typography>
                  </div>
                </Stack>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Data aprobării <span className='text-error-500'>*</span>
                </label>
                <input {...register('dataAprobarii')} type='date' className={inputCls} />
                {errors.dataAprobarii && (
                  <p className='mt-1 text-xs text-error-600'>{errors.dataAprobarii.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Observații generale
              </label>
              <textarea
                {...register('observatiiGenerale')}
                rows={3}
                placeholder='Observații sau note suplimentare...'
                className={inputCls}
              />
            </div>

            <AutosaveIndicator status={status} />
          </Stack>
        </form>
      </div>
    </section>
  )
}
