'use client'

import { useCallback, useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useAutosave } from '@/hooks/useAutosave'
import { EvaluatorSchema } from '@/lib/schemas'
import type { EvaluatorFormValues } from '@/lib/schemas'
import type { Evaluare } from '@/lib/types'

import { AutosaveIndicator } from '../AutosaveIndicator'

type Props = { evaluare: Evaluare }

const toFormValues = (evaluare: Evaluare): EvaluatorFormValues => ({
  numeEvaluator: evaluare.numeEvaluator ?? '',
  functieEvaluator: evaluare.functieEvaluator ?? '',
  firmaEvaluator: evaluare.firmaEvaluator ?? '',
  nrDocument: evaluare.nrDocument ?? '',
  dataEvaluarii: evaluare.dataEvaluarii ?? '',
  dataRevizuirii: evaluare.dataRevizuirii ?? '',
})

export const EvaluatorSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<EvaluatorFormValues>({
    resolver: zodResolver(EvaluatorSchema),
    defaultValues: toFormValues(evaluare),
  })

  const values = watch()

  useEffect(() => {
    reset(toFormValues(evaluareRef.current))
  }, [evaluare.id, reset])

  const handleSave = useCallback(
    async (data: Partial<EvaluatorFormValues>) => {
      await update.mutateAsync(data as Partial<Evaluare>)
    },
    [update],
  )

  const status = useAutosave({ values, onSave: handleSave })

  return (
    <section id='evaluator-section' className='scroll-mt-20'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          Evaluator &amp; Date Document
        </Typography>

        <form noValidate>
          <Stack gap='6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Nume evaluator <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('numeEvaluator')}
                  type='text'
                  placeholder='Nume și prenume'
                  className='form-input'
                />
                {errors.numeEvaluator && (
                  <p className='mt-1 text-xs text-error-600'>{errors.numeEvaluator.message}</p>
                )}
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Funcție <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('functieEvaluator')}
                  type='text'
                  placeholder='Ex: Consultant securitate, Expert evaluator'
                  className='form-input'
                />
                {errors.functieEvaluator && (
                  <p className='mt-1 text-xs text-error-600'>{errors.functieEvaluator.message}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Firma evaluatorului
                </label>
                <input
                  {...register('firmaEvaluator')}
                  type='text'
                  placeholder='Denumire firmă'
                  className='form-input'
                />
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Nr. document
                </label>
                <input
                  {...register('nrDocument')}
                  type='text'
                  placeholder='Ex: ER-2024-001'
                  className='form-input'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Data evaluării <span className='text-error-500'>*</span>
                </label>
                <input {...register('dataEvaluarii')} type='date' className='form-input' />
                {errors.dataEvaluarii && (
                  <p className='mt-1 text-xs text-error-600'>{errors.dataEvaluarii.message}</p>
                )}
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Data revizuirii <span className='text-error-500'>*</span>
                </label>
                <input {...register('dataRevizuirii')} type='date' className='form-input' />
                {errors.dataRevizuirii && (
                  <p className='mt-1 text-xs text-error-600'>{errors.dataRevizuirii.message}</p>
                )}
              </div>
            </div>

            <AutosaveIndicator status={status} />
          </Stack>
        </form>
      </div>
    </section>
  )
}
