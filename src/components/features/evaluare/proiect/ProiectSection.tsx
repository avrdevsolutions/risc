'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Typography, Stack, Button } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { FAZE_LUCRARII } from '@/lib/constants'
import { ProiectSchema, type ProiectFormValues } from '@/lib/schemas'
import type { Evaluare } from '@/lib/types'

type Props = { evaluare: Evaluare }

export const ProiectSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProiectFormValues>({
    resolver: zodResolver(ProiectSchema),
    defaultValues: {
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
    },
  })

  const fazaLucrarii = watch('fazaLucrarii')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reset({
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
  }, [evaluare.id, reset])

  const onSubmit = (data: ProiectFormValues) => {
    update.mutate(data)
  }

  return (
    <section id='proiect-section' className='scroll-mt-20'>
      <div className='rounded-xl border border-primary-100 bg-surface p-6 shadow-card'>
        <Typography variant='h3' className='mb-6 text-navy-700'>
          🏢 Informații Proiect
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap='6'>
            {/* Row 1: Denumire + Cod */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='md:col-span-2'>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Denumire proiect <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('denumireProiect')}
                  type='text'
                  placeholder='Ex: Construire imobil P+4E, str. Exemplu nr. 1'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
                {errors.denumireProiect && (
                  <p className='mt-1 text-xs text-error-600'>{errors.denumireProiect.message}</p>
                )}
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Cod proiect
                </label>
                <input
                  {...register('codProiect')}
                  type='text'
                  placeholder='Ex: PRJ-2024-001'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
            </div>

            {/* Row 2: Adresă + Localitate + Județ */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='md:col-span-1'>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Adresă locație <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('adresaLocatie')}
                  type='text'
                  placeholder='Strada, număr'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
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
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>Județ</label>
                <input
                  {...register('judet')}
                  type='text'
                  placeholder='Ex: Ilfov'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
            </div>

            {/* Row 3: Beneficiar */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Beneficiar <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('beneficiar')}
                  type='text'
                  placeholder='Denumire beneficiar'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
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
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
            </div>

            {/* Row 4: Antreprenor */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Antreprenor general <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('antreprenor')}
                  type='text'
                  placeholder='Denumire antreprenor'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
                {errors.antreprenor && (
                  <p className='mt-1 text-xs text-error-600'>{errors.antreprenor.message}</p>
                )}
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  CUI antreprenor
                </label>
                <input
                  {...register('cuiAntreprenor')}
                  type='text'
                  placeholder='Ex: RO87654321'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
            </div>

            {/* Row 5: Subantreprenor */}
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Subantreprenor (opțional)
              </label>
              <input
                {...register('subantreprenor')}
                type='text'
                placeholder='Denumire subantreprenor'
                className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
              />
            </div>

            {/* Row 6: Faza lucrării */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Faza lucrării <span className='text-error-500'>*</span>
                </label>
                <select
                  {...register('fazaLucrarii')}
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                >
                  <option value=''>Selectați faza...</option>
                  {FAZE_LUCRARII.map((faza) => (
                    <option key={faza} value={faza}>
                      {faza}
                    </option>
                  ))}
                </select>
                {errors.fazaLucrarii && (
                  <p className='mt-1 text-xs text-error-600'>{errors.fazaLucrarii.message}</p>
                )}
              </div>
              {fazaLucrarii === 'Altă fază' && (
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                    Specificați faza <span className='text-error-500'>*</span>
                  </label>
                  <input
                    {...register('fazaLucrariiCustom')}
                    type='text'
                    placeholder='Descrieți faza lucrării'
                    className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                  />
                  {errors.fazaLucrariiCustom && (
                    <p className='mt-1 text-xs text-error-600'>
                      {errors.fazaLucrariiCustom.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Row 7: Descriere obiectiv */}
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Descriere obiectiv (opțional)
              </label>
              <textarea
                {...register('descriereObiectiv')}
                rows={3}
                placeholder='Descrieți pe scurt obiectivul de construcție...'
                className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
              />
            </div>

            <div className='flex justify-end'>
              <Button type='submit' loading={update.isPending} disabled={!isDirty}>
                Salvează informații proiect
              </Button>
            </div>
          </Stack>
        </form>
      </div>
    </section>
  )
}
