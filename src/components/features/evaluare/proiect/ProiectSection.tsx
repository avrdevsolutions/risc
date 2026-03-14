'use client'

import { useCallback, useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Typography, Stack, Select } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useFormLocalPersist } from '@/hooks/useFormLocalPersist'
import { useSectionSync } from '@/hooks/useSectionSync'
import { TIP_UNITATE } from '@/lib/constants'
import { ProiectSchema } from '@/lib/schemas'
import type { ProiectFormValues } from '@/lib/schemas'
import type { Evaluare } from '@/lib/types'
import { useEvaluareFormStore } from '@/stores/evaluare-form-store'

type Props = { evaluare: Evaluare }

const toFormValues = (
  evaluare: Evaluare,
  localData: Record<string, unknown>,
): ProiectFormValues => ({
  denumireProiect:
    (localData.denumireProiect as string | undefined) ?? evaluare.denumireProiect ?? '',
  codProiect: (localData.codProiect as string | undefined) ?? evaluare.codProiect ?? '',
  adresaLocatie: (localData.adresaLocatie as string | undefined) ?? evaluare.adresaLocatie ?? '',
  localitate: (localData.localitate as string | undefined) ?? evaluare.localitate ?? '',
  judet: (localData.judet as string | undefined) ?? evaluare.judet ?? '',
  beneficiar: (localData.beneficiar as string | undefined) ?? evaluare.beneficiar ?? '',
  cuiBeneficiar: (localData.cuiBeneficiar as string | undefined) ?? evaluare.cuiBeneficiar ?? '',
  antreprenor: (localData.antreprenor as string | undefined) ?? evaluare.antreprenor ?? '',
  cuiAntreprenor: (localData.cuiAntreprenor as string | undefined) ?? evaluare.cuiAntreprenor ?? '',
  subantreprenor: (localData.subantreprenor as string | undefined) ?? evaluare.subantreprenor ?? '',
  fazaLucrarii: (localData.fazaLucrarii as string | undefined) ?? evaluare.fazaLucrarii ?? '',
  fazaLucrariiCustom:
    (localData.fazaLucrariiCustom as string | undefined) ?? evaluare.fazaLucrariiCustom ?? '',
  descriereObiectiv:
    (localData.descriereObiectiv as string | undefined) ?? evaluare.descriereObiectiv ?? '',
})

export const ProiectSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare
  const localInit = useEvaluareFormStore.getState().getFormData(evaluare.id)

  const {
    register,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ProiectFormValues>({
    resolver: zodResolver(ProiectSchema),
    defaultValues: toFormValues(evaluare, localInit),
  })

  const fazaLucrarii = watch('fazaLucrarii')

  useEffect(() => {
    const localData = useEvaluareFormStore.getState().getFormData(evaluare.id)
    reset(toFormValues(evaluareRef.current, localData))
  }, [evaluare.id, reset])

  const handleSave = useCallback(async () => {
    await update.mutateAsync(getValues() as Partial<Evaluare>)
  }, [update, getValues])

  const { markDirty } = useSectionSync('proiect', handleSave)
  useFormLocalPersist(watch)

  return (
    <section id='proiect-section' className='scroll-mt-32'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          1. Date de identificare
        </Typography>

        <form noValidate onChange={markDirty}>
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
                <Select
                  id='fazaLucrarii'
                  value={fazaLucrarii}
                  onChange={(v) => {
                    setValue('fazaLucrarii', v)
                    markDirty()
                  }}
                  options={TIP_UNITATE}
                  placeholder='Selectați tipul...'
                  aria-label='Tip unitate'
                />
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
          </Stack>
        </form>
      </div>
    </section>
  )
}
