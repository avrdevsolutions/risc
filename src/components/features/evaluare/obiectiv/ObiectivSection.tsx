'use client'

import { useCallback, useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useAutosave } from '@/hooks/useAutosave'
import {
  ZONA_AMPLASARE,
  ACCESIBILITATE,
  NIVEL_AMENINTARI,
  REGIM_ACTIVITATE,
  FLUX_PERSOANE,
} from '@/lib/constants'
import type { Evaluare } from '@/lib/types'

import { AutosaveIndicator } from '../AutosaveIndicator'

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
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare

  const { register, watch, reset } = useForm<ObiectivFormValues>({
    resolver: zodResolver(ObiectivSchema),
    defaultValues: toFormValues(evaluare),
  })

  const values = watch()

  useEffect(() => {
    reset(toFormValues(evaluareRef.current))
  }, [evaluare.id, reset])

  const handleSave = useCallback(
    async (data: Partial<ObiectivFormValues>) => {
      await update.mutateAsync(data as Partial<Evaluare>)
    },
    [update],
  )

  const status = useAutosave({ values, onSave: handleSave })

  return (
    <section id='obiectiv-section' className='scroll-mt-20'>
      <div className='rounded-xl border border-primary-100 bg-surface p-6 shadow-card'>
        <Typography variant='h3' className='mb-6 text-navy-700'>
          📍 Amplasare &amp; Factori Externi
        </Typography>

        <form noValidate>
          <Stack gap='6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Suprafață totală (mp)
                </label>
                <input
                  {...register('suprafataTotala')}
                  type='text'
                  placeholder='Ex: 1200'
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Zonă amplasare
                </label>
                <select
                  {...register('tipImprejmuire')}
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                >
                  <option value=''>Selectați...</option>
                  {ZONA_AMPLASARE.map((zona) => (
                    <option key={zona} value={zona}>
                      {zona}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Accesibilitate
                </label>
                <select
                  {...register('tipAcces')}
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                >
                  <option value=''>Selectați...</option>
                  {ACCESIBILITATE.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Nivel amenințări zonă
                </label>
                <select
                  {...register('vecinNord')}
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                >
                  <option value=''>Selectați...</option>
                  {NIVEL_AMENINTARI.map((nivel) => (
                    <option key={nivel} value={nivel}>
                      {nivel}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Regim activitate
                </label>
                <select
                  {...register('vecinEst')}
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                >
                  <option value=''>Selectați...</option>
                  {REGIM_ACTIVITATE.map((regim) => (
                    <option key={regim} value={regim}>
                      {regim}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Flux persoane
                </label>
                <select
                  {...register('vecinSud')}
                  className='w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                >
                  <option value=''>Selectați...</option>
                  {FLUX_PERSOANE.map((flux) => (
                    <option key={flux} value={flux}>
                      {flux}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Descriere amplasare și factori externi
              </label>
              <textarea
                {...register('descriereAmplasare')}
                rows={3}
                placeholder='Descrieți amplasamentul obiectivului, vecinătățile și factorii externi de risc...'
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
                    { field: 'vecinVest', label: 'Nord' },
                    { field: 'vecinNord', label: 'Est' },
                    { field: 'vecinEst', label: 'Sud' },
                    { field: 'vecinSud', label: 'Vest' },
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

            <AutosaveIndicator status={status} />
          </Stack>
        </form>
      </div>
    </section>
  )
}
