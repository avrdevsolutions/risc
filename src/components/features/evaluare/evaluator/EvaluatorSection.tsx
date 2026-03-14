'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useSectionSync } from '@/hooks/useSectionSync'
import { TIP_EVALUARE, OBIECTIVE_EVALUARE, METODE_INSTRUMENTE } from '@/lib/constants'
import { EvaluatorSchema } from '@/lib/schemas'
import type { EvaluatorFormValues } from '@/lib/schemas'
import type { Evaluare } from '@/lib/types'
import { parseJsonArray } from '@/lib/utils'

type Props = { evaluare: Evaluare }

const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
  setList(list.includes(item) ? list.filter((v) => v !== item) : [...list, item])
}

const toFormValues = (evaluare: Evaluare): EvaluatorFormValues => ({
  numeEvaluator: evaluare.numeEvaluator ?? '',
  functieEvaluator: evaluare.functieEvaluator ?? '',
  firmaEvaluator: evaluare.firmaEvaluator ?? '',
  nrDocument: evaluare.nrDocument ?? '',
  dataEvaluarii: evaluare.dataEvaluarii ?? '',
  dataRevizuirii: evaluare.dataRevizuirii ?? '',
  tipEvaluare: evaluare.tipEvaluare ?? '',
  obiectiveEvaluare: parseJsonArray(evaluare.obiectiveEvaluare),
  metodeInstrumente: parseJsonArray(evaluare.metodeInstrumente),
})

export const EvaluatorSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare

  const {
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm<EvaluatorFormValues>({
    resolver: zodResolver(EvaluatorSchema),
    defaultValues: toFormValues(evaluare),
  })

  const [obiective, setObiective] = useState<string[]>(parseJsonArray(evaluare.obiectiveEvaluare))
  const [metode, setMetode] = useState<string[]>(parseJsonArray(evaluare.metodeInstrumente))

  useEffect(() => {
    const ev = evaluareRef.current
    reset(toFormValues(ev))
    setObiective(parseJsonArray(ev.obiectiveEvaluare))
    setMetode(parseJsonArray(ev.metodeInstrumente))
  }, [evaluare.id, reset])

  const handleSave = useCallback(async () => {
    const values = getValues()
    await update.mutateAsync({
      ...(values as Partial<Evaluare>),
      obiectiveEvaluare: JSON.stringify(obiective),
      metodeInstrumente: JSON.stringify(metode),
    })
  }, [update, getValues, obiective, metode])

  const { markDirty } = useSectionSync('evaluator', handleSave)

  const handleCheckboxChange = (
    list: string[],
    setList: (v: string[]) => void,
    item: string,
  ) => {
    toggleItem(list, setList, item)
  }

  return (
    <section id='evaluator-section' className='scroll-mt-20'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          Evaluator &amp; Date Document
        </Typography>

        <form noValidate onChange={markDirty}>
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

            <div className='border-t border-navy-100 pt-5'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Tip evaluare
                </label>
                <select {...register('tipEvaluare')} className='form-input'>
                  <option value=''>Selectați...</option>
                  {TIP_EVALUARE.map((tip) => (
                    <option key={tip} value={tip}>
                      {tip}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
                Obiectivele evaluării
              </Typography>
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                {OBIECTIVE_EVALUARE.map((obiectiv) => (
                  <label
                    key={obiectiv}
                    className='flex cursor-pointer items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
                  >
                    <input
                      type='checkbox'
                      checked={obiective.includes(obiectiv)}
                      onChange={() => handleCheckboxChange(obiective, setObiective, obiectiv)}
                      className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                    />
                    <Typography variant='body-sm' className='text-navy-700'>
                      {obiectiv}
                    </Typography>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
                Metode și instrumente utilizate
              </Typography>
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                {METODE_INSTRUMENTE.map((metoda) => (
                  <label
                    key={metoda}
                    className='flex cursor-pointer items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
                  >
                    <input
                      type='checkbox'
                      checked={metode.includes(metoda)}
                      onChange={() => handleCheckboxChange(metode, setMetode, metoda)}
                      className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                    />
                    <Typography variant='body-sm' className='text-navy-700'>
                      {metoda}
                    </Typography>
                  </label>
                ))}
              </div>
            </div>
          </Stack>
        </form>
      </div>
    </section>
  )
}
