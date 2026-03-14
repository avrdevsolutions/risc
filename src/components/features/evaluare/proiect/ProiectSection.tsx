'use client'

import { useCallback, useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useAutosave } from '@/hooks/useAutosave'
import { TIP_UNITATE } from '@/lib/constants'
import { ProiectSchema } from '@/lib/schemas'
import type { ProiectFormValues } from '@/lib/schemas'
import type { Evaluare } from '@/lib/types'

import { AutosaveIndicator } from '../AutosaveIndicator'

type Props = { evaluare: Evaluare }

const toFormValues = (evaluare: Evaluare): ProiectFormValues => ({
  denumireProiect: evaluare.denumireProiect ?? '',
  codProiect: evaluare.codProiect ?? '',
  adresaLocatie: evaluare.adresaLocatie ?? '',
  localitate: evaluare.localitate ?? '',
  judet: evaluare.judet ?? '',
  beneficiar: evaluare.beneficiar ?? '',
  cuiBeneficiar: evaluare.cuiBeneficiar ?? '',
  antreprenor: evaluare.antreprenor ?? '',
  cuiAntreprenor: evaluare.cuiAntreprenor ?? '',
  subantreprenor: evaluare.subantreprenor ?? '',
  fazaLucrarii: evaluare.fazaLucrarii ?? '',
  fazaLucrariiCustom: evaluare.fazaLucrariiCustom ?? '',
  descriereObiectiv: evaluare.descriereObiectiv ?? '',
})

export const ProiectSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProiectFormValues>({
    resolver: zodResolver(ProiectSchema),
    defaultValues: toFormValues(evaluare),
  })

  const fazaLucrarii = watch('fazaLucrarii')
  const values = watch()

  useEffect(() => {
    reset(toFormValues(evaluareRef.current))
  }, [evaluare.id, reset])

  const handleSave = useCallback(
    async (data: Partial<ProiectFormValues>) => {
      await update.mutateAsync(data as Partial<Evaluare>)
    },
    [update],
  )

  const status = useAutosave({ values, onSave: handleSave })

  return (
    <section id='proiect-section' className='scroll-mt-20'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          Date de identificare
        </Typography>

        <form noValidate>
          <Stack gap='6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='md:col-span-2'>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Denumire obiectiv <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('denumireProiect')}
                  type='text'
                  placeholder='Ex: Magazin XYZ, Depozit ABC'
                  className='form-input'
                />
                {errors.denumireProiect && (
                  <p className='mt-1 text-xs text-error-600'>{errors.denumireProiect.message}</p>
                )}
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>Nr. raport</label>
                <input
                  {...register('codProiect')}
                  type='text'
                  placeholder='Ex: RSEC-2026-001'
                  className='form-input'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Adresă locație <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('adresaLocatie')}
                  type='text'
                  placeholder='Strada, număr'
                  className='form-input'
                />
                {errors.adresaLocatie && (
                  <p className='mt-1 text-xs text-error-600'>{errors.adresaLocatie.message}</p>
                )}
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>Localitate</label>
                <input
                  {...register('localitate')}
                  type='text'
                  placeholder='Ex: București'
                  className='form-input'
                />
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>Județ</label>
                <input
                  {...register('judet')}
                  type='text'
                  placeholder='Ex: Ilfov'
                  className='form-input'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Beneficiar <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('beneficiar')}
                  type='text'
                  placeholder='Denumire beneficiar'
                  className='form-input'
                />
                {errors.beneficiar && (
                  <p className='mt-1 text-xs text-error-600'>{errors.beneficiar.message}</p>
                )}
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  CUI beneficiar
                </label>
                <input
                  {...register('cuiBeneficiar')}
                  type='text'
                  placeholder='Ex: RO12345678'
                  className='form-input'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Firmă evaluatoare <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('antreprenor')}
                  type='text'
                  placeholder='Firmă de securitate / Evaluator autorizat'
                  className='form-input'
                />
                {errors.antreprenor && (
                  <p className='mt-1 text-xs text-error-600'>{errors.antreprenor.message}</p>
                )}
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  CUI firmă evaluatoare
                </label>
                <input
                  {...register('cuiAntreprenor')}
                  type='text'
                  placeholder='Ex: RO87654321'
                  className='form-input'
                />
              </div>
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Subcontractant (opțional)
              </label>
              <input
                {...register('subantreprenor')}
                type='text'
                placeholder='Denumire subcontractant'
                className='form-input'
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Tip unitate <span className='text-error-500'>*</span>
                </label>
                <select {...register('fazaLucrarii')} className='form-input'>
                  <option value=''>Selectați tipul...</option>
                  {TIP_UNITATE.map((tip) => (
                    <option key={tip} value={tip}>
                      {tip}
                    </option>
                  ))}
                </select>
                {errors.fazaLucrarii && (
                  <p className='mt-1 text-xs text-error-600'>{errors.fazaLucrarii.message}</p>
                )}
              </div>
              {fazaLucrarii === 'Alt tip de obiectiv' && (
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                    Specificați tipul <span className='text-error-500'>*</span>
                  </label>
                  <input
                    {...register('fazaLucrariiCustom')}
                    type='text'
                    placeholder='Descrieți tipul obiectivului'
                    className='form-input'
                  />
                  {errors.fazaLucrariiCustom && (
                    <p className='mt-1 text-xs text-error-600'>
                      {errors.fazaLucrariiCustom.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Scurtă descriere obiectiv (opțional)
              </label>
              <textarea
                {...register('descriereObiectiv')}
                rows={3}
                placeholder='Descrieți pe scurt obiectivul evaluat...'
                className='form-input'
              />
            </div>

            <AutosaveIndicator status={status} />
          </Stack>
        </form>
      </div>
    </section>
  )
}
