'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useAutosave } from '@/hooks/useAutosave'
import { ZONA_AMPLASARE, ACCESIBILITATE, NIVEL_AMENINTARI, VECINATATI, CAI_ACCES } from '@/lib/constants'
import type { Evaluare } from '@/lib/types'
import { parseJsonArray } from '@/lib/utils'

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
  numarPuncteAcces: z.string().optional(),
  posibilitateDisimulare: z.string().optional(),
  factoriExterni: z.string().optional(),
  istoricIncidente: z.string().optional(),
})

type ObiectivFormValues = z.infer<typeof ObiectivSchema>

type Props = { evaluare: Evaluare }

const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
  setList(list.includes(item) ? list.filter((v) => v !== item) : [...list, item])
}

const toFormValues = (evaluare: Evaluare): ObiectivFormValues => ({
  suprafataTotala: evaluare.suprafataTotala ?? '',
  descriereAmplasare: evaluare.descriereAmplasare ?? '',
  tipImprejmuire: evaluare.tipImprejmuire ?? '',
  tipAcces: evaluare.tipAcces ?? '',
  vecinNord: evaluare.vecinNord ?? '',
  vecinEst: evaluare.vecinEst ?? '',
  vecinSud: evaluare.vecinSud ?? '',
  vecinVest: evaluare.vecinVest ?? '',
  numarPuncteAcces:
    evaluare.numarPuncteAcces != null ? String(evaluare.numarPuncteAcces) : '',
  posibilitateDisimulare: evaluare.posibilitateDisimulare ?? '',
  factoriExterni: evaluare.factoriExterni ?? '',
  istoricIncidente: evaluare.istoricIncidente ?? '',
})

export const ObiectivSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare

  const { register, watch, reset } = useForm<ObiectivFormValues>({
    resolver: zodResolver(ObiectivSchema),
    defaultValues: toFormValues(evaluare),
  })

  const [caiAcces, setCaiAcces] = useState<string[]>(parseJsonArray(evaluare.caiAcces))
  const [vecinatatiBifate, setVecinatatiBifate] = useState<string[]>(
    parseJsonArray(evaluare.vecinatatiBifate),
  )

  const formValues = watch()

  useEffect(() => {
    reset(toFormValues(evaluareRef.current))
    setCaiAcces(parseJsonArray(evaluareRef.current.caiAcces))
    setVecinatatiBifate(parseJsonArray(evaluareRef.current.vecinatatiBifate))
  }, [evaluare.id, reset])

  const autosaveValues = {
    ...formValues,
    numarPuncteAcces: (() => {
      if (formValues.numarPuncteAcces === '' || formValues.numarPuncteAcces === undefined)
        return null
      const parsed = parseInt(formValues.numarPuncteAcces, 10)
      return isNaN(parsed) ? null : parsed
    })(),
    caiAcces: JSON.stringify(caiAcces),
    vecinatatiBifate: JSON.stringify(vecinatatiBifate),
  }

  const handleSave = useCallback(
    async (data: Partial<typeof autosaveValues>) => {
      await update.mutateAsync(data as Partial<Evaluare>)
    },
    [update],
  )

  const status = useAutosave({ values: autosaveValues, onSave: handleSave })

  return (
    <section id='obiectiv-section' className='scroll-mt-20'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          Amplasare &amp; Factori Externi
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
                  className='form-input'
                />
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                  Zonă amplasare
                </label>
                <select {...register('tipImprejmuire')} className='form-input'>
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
                <select {...register('tipAcces')} className='form-input'>
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
                <select {...register('posibilitateDisimulare')} className='form-input'>
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
                  Număr puncte de acces
                </label>
                <input
                  {...register('numarPuncteAcces')}
                  type='number'
                  min={0}
                  placeholder='Ex: 3'
                  className='form-input'
                />
              </div>
            </div>

            {/* Căi de acces */}
            <div>
              <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
                Căi de acces
              </Typography>
              <div className='flex flex-wrap gap-3'>
                {CAI_ACCES.map((cale) => (
                  <label
                    key={cale}
                    className='flex cursor-pointer items-center gap-2 rounded-lg border border-primary-100 px-3 py-2 hover:bg-primary-50'
                  >
                    <input
                      type='checkbox'
                      checked={caiAcces.includes(cale)}
                      onChange={() => toggleItem(caiAcces, setCaiAcces, cale)}
                      className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                    />
                    <Typography variant='body-sm' className='text-navy-700'>
                      {cale}
                    </Typography>
                  </label>
                ))}
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
                className='form-input'
              />
            </div>

            {/* Vecinătăți (text) */}
            <div>
              <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
                Vecinătăți (descriere)
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
                      className='form-input'
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vecinătăți bifate (multi-select) */}
            <div>
              <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
                Tip vecinătăți identificate
              </Typography>
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                {VECINATATI.map((vecin) => (
                  <label
                    key={vecin}
                    className='flex cursor-pointer items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
                  >
                    <input
                      type='checkbox'
                      checked={vecinatatiBifate.includes(vecin)}
                      onChange={() => toggleItem(vecinatatiBifate, setVecinatatiBifate, vecin)}
                      className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                    />
                    <Typography variant='body-sm' className='text-navy-700'>
                      {vecin}
                    </Typography>
                  </label>
                ))}
              </div>
            </div>

            {/* Factori externi */}
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Factori externi de risc
              </label>
              <textarea
                {...register('factoriExterni')}
                rows={3}
                placeholder='Descrieți factorii externi care pot influența securitatea obiectivului...'
                className='form-input'
              />
            </div>

            {/* Istoric incidente */}
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Istoric incidente de securitate
              </label>
              <textarea
                {...register('istoricIncidente')}
                rows={3}
                placeholder='Descrieți incidentele de securitate anterioare cunoscute în zonă sau la obiectiv...'
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
