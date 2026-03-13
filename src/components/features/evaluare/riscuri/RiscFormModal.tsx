'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'

import { Typography, Stack, Button } from '@/components/ui'
import {
  ACTIVITATI,
  PERICOLE,
  PERSOANE_EXPUSE,
  MASURI_COLECTIVE,
  MASURI_ORGANIZATORICE,
  EIP_OPTIONS,
  PROBABILITATE_LABELS,
  SEVERITATE_LABELS,
  getRiskLevel,
  getRiskColor,
} from '@/lib/constants'
import type { RiscFormValues } from '@/lib/schemas'
import { RiscSchema } from '@/lib/schemas'
import type { Risc } from '@/lib/types'

type Props = {
  onClose: () => void
  onSubmit: (data: RiscFormValues) => void
  initialData?: Partial<Risc>
  isPending?: boolean
}

const ALL_MASURI = [...MASURI_COLECTIVE, ...MASURI_ORGANIZATORICE, ...EIP_OPTIONS]

const ScoreDisplay = ({ p, s }: { p: number; s: number }) => {
  if (!p || !s) return null
  const level = getRiskLevel(p, s)
  const colors = getRiskColor(level)
  const score = p * s
  const labels: Record<string, string> = {
    critic: 'Critic',
    ridicat: 'Ridicat',
    mediu: 'Mediu',
    scazut: 'Scăzut',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      Scor: {score} — {labels[level]}
    </span>
  )
}

const parseJson = (val: string | null | undefined): string[] => {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return val ? [val] : []
  }
}

export const RiscFormModal = ({ onClose, onSubmit, initialData, isPending }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<RiscFormValues>({
    resolver: zodResolver(RiscSchema),
    defaultValues: {
      activitate: initialData?.activitate ?? '',
      activitateCustom: initialData?.activitateCustom ?? '',
      pericol: initialData?.pericol ?? '',
      pericolCustom: initialData?.pericolCustom ?? '',
      descrierePericol: initialData?.descrierePericol ?? '',
      persoaneExpuse: parseJson(initialData?.persoaneExpuse),
      numarPersoaneExpuse: initialData?.numarPersoaneExpuse ?? undefined,
      probabilitateInitiala: initialData?.probabilitateInitiala ?? 1,
      severitateInitiala: initialData?.severitateInitiala ?? 1,
      masuriExistente: parseJson(initialData?.masuriExistente),
      masuriExistenteCustom: initialData?.masuriExistenteCustom ?? '',
      masuriSuplimentare: initialData?.masuriSuplimentare ?? '',
      probabilitateReziduala: initialData?.probabilitateReziduala ?? 1,
      severitateReziduala: initialData?.severitateReziduala ?? 1,
      responsabilImplementare: initialData?.responsabilImplementare ?? '',
      functieResponsabil: initialData?.functieResponsabil ?? '',
      termenImplementare: initialData?.termenImplementare ?? '',
      statusRisc: initialData?.statusRisc ?? 'deschis',
    },
  })

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const activitate = watch('activitate')
  const pericol = watch('pericol')
  const pInit = watch('probabilitateInitiala')
  const sInit = watch('severitateInitiala')
  const pRez = watch('probabilitateReziduala')
  const sRez = watch('severitateReziduala')

  const inputCls =
    'w-full rounded-md border border-primary-200 px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
  const labelCls = 'mb-1.5 block text-sm font-medium text-navy-700'
  const errorCls = 'mt-1 text-xs text-error-600'

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-900/50 p-4 pt-8 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='w-full max-w-2xl rounded-xl bg-surface shadow-xl'>
        <div className='flex items-center justify-between border-b border-primary-100 px-6 py-4'>
          <Typography variant='h4' className='text-navy-700'>
            {initialData?.id ? 'Editare risc' : 'Adăugare risc nou'}
          </Typography>
          <Button variant='ghost' size='icon' onClick={onClose} aria-label='Închide'>
            <X className='size-5' />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className='max-h-[80vh] overflow-y-auto px-6 py-5'
        >
          <Stack gap='6'>
            {/* Activitate */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className={labelCls}>
                  Activitate <span className='text-error-500'>*</span>
                </label>
                <select {...register('activitate')} className={inputCls}>
                  <option value=''>Selectați activitatea...</option>
                  {ACTIVITATI.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                {errors.activitate && <p className={errorCls}>{errors.activitate.message}</p>}
              </div>
              {activitate === 'Altă activitate' && (
                <div>
                  <label className={labelCls}>
                    Specificați activitatea <span className='text-error-500'>*</span>
                  </label>
                  <input {...register('activitateCustom')} type='text' className={inputCls} />
                </div>
              )}
            </div>

            {/* Pericol */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className={labelCls}>
                  Pericol <span className='text-error-500'>*</span>
                </label>
                <select {...register('pericol')} className={inputCls}>
                  <option value=''>Selectați pericolul...</option>
                  {PERICOLE.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.pericol && <p className={errorCls}>{errors.pericol.message}</p>}
              </div>
              {pericol === 'Alt pericol' && (
                <div>
                  <label className={labelCls}>
                    Specificați pericolul <span className='text-error-500'>*</span>
                  </label>
                  <input {...register('pericolCustom')} type='text' className={inputCls} />
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>Descriere pericol (opțional)</label>
              <textarea
                {...register('descrierePericol')}
                rows={2}
                className={inputCls}
                placeholder='Descrieți pericolul...'
              />
            </div>

            {/* Persoane expuse */}
            <div>
              <label className={labelCls}>
                Persoane expuse <span className='text-error-500'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2'>
                <Controller
                  name='persoaneExpuse'
                  control={control}
                  render={({ field }) => (
                    <>
                      {PERSOANE_EXPUSE.map((p) => (
                        <label
                          key={p}
                          className='flex cursor-pointer items-center gap-2 text-sm text-navy-700'
                        >
                          <input
                            type='checkbox'
                            value={p}
                            checked={field.value?.includes(p)}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...(field.value ?? []), p]
                                : (field.value ?? []).filter((v) => v !== p)
                              field.onChange(next)
                            }}
                            className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                          />
                          {p}
                        </label>
                      ))}
                    </>
                  )}
                />
              </div>
              {errors.persoaneExpuse && <p className={errorCls}>{errors.persoaneExpuse.message}</p>}
              <div className='mt-2'>
                <label className='mb-1 block text-xs font-medium text-navy-600'>
                  Număr persoane expuse
                </label>
                <input
                  {...register('numarPersoaneExpuse', { valueAsNumber: true })}
                  type='number'
                  min={1}
                  placeholder='Ex: 5'
                  className='w-32 rounded-md border border-primary-200 px-3 py-1.5 text-sm text-navy-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
                />
              </div>
            </div>

            {/* Scoruri inițiale */}
            <div className='rounded-lg bg-primary-50 p-4'>
              <Stack direction='row' justify='between' align='center' gap='2' className='mb-3'>
                <Typography variant='body-sm' className='font-semibold text-navy-700'>
                  Evaluare risc inițial
                </Typography>
                <ScoreDisplay p={pInit} s={sInit} />
              </Stack>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className={labelCls}>
                    Probabilitate (1-5) <span className='text-error-500'>*</span>
                  </label>
                  <select
                    {...register('probabilitateInitiala', { valueAsNumber: true })}
                    className={inputCls}
                  >
                    {PROBABILITATE_LABELS.map((label, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} — {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>
                    Severitate (1-5) <span className='text-error-500'>*</span>
                  </label>
                  <select
                    {...register('severitateInitiala', { valueAsNumber: true })}
                    className={inputCls}
                  >
                    {SEVERITATE_LABELS.map((label, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} — {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Măsuri existente */}
            <div>
              <label className={labelCls}>
                Măsuri de protecție existente <span className='text-error-500'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2'>
                <Controller
                  name='masuriExistente'
                  control={control}
                  render={({ field }) => (
                    <>
                      {ALL_MASURI.map((m) => (
                        <label
                          key={m}
                          className='flex cursor-pointer items-center gap-2 text-sm text-navy-700'
                        >
                          <input
                            type='checkbox'
                            value={m}
                            checked={field.value?.includes(m)}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...(field.value ?? []), m]
                                : (field.value ?? []).filter((v) => v !== m)
                              field.onChange(next)
                            }}
                            className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                          />
                          {m}
                        </label>
                      ))}
                    </>
                  )}
                />
              </div>
              {errors.masuriExistente && (
                <p className={errorCls}>{errors.masuriExistente.message}</p>
              )}
              <div className='mt-2'>
                <label className='mb-1 block text-xs font-medium text-navy-600'>
                  Alte măsuri existente
                </label>
                <input
                  {...register('masuriExistenteCustom')}
                  type='text'
                  placeholder='Alte măsuri...'
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Măsuri suplimentare propuse</label>
              <textarea
                {...register('masuriSuplimentare')}
                rows={2}
                className={inputCls}
                placeholder='Descrieți măsurile suplimentare...'
              />
            </div>

            {/* Scoruri reziduale */}
            <div className='rounded-lg bg-success-50 p-4'>
              <Stack direction='row' justify='between' align='center' gap='2' className='mb-3'>
                <Typography variant='body-sm' className='font-semibold text-navy-700'>
                  Evaluare risc rezidual (după măsuri)
                </Typography>
                <ScoreDisplay p={pRez} s={sRez} />
              </Stack>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className={labelCls}>
                    Probabilitate reziduală <span className='text-error-500'>*</span>
                  </label>
                  <select
                    {...register('probabilitateReziduala', { valueAsNumber: true })}
                    className={inputCls}
                  >
                    {PROBABILITATE_LABELS.map((label, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} — {label}
                      </option>
                    ))}
                  </select>
                  {errors.probabilitateReziduala && (
                    <p className={errorCls}>{errors.probabilitateReziduala.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>
                    Severitate reziduală <span className='text-error-500'>*</span>
                  </label>
                  <select
                    {...register('severitateReziduala', { valueAsNumber: true })}
                    className={inputCls}
                  >
                    {SEVERITATE_LABELS.map((label, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} — {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Responsabil */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className={labelCls}>
                  Responsabil implementare <span className='text-error-500'>*</span>
                </label>
                <input
                  {...register('responsabilImplementare')}
                  type='text'
                  placeholder='Nume responsabil'
                  className={inputCls}
                />
                {errors.responsabilImplementare && (
                  <p className={errorCls}>{errors.responsabilImplementare.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Funcție responsabil</label>
                <input
                  {...register('functieResponsabil')}
                  type='text'
                  placeholder='Ex: Șef șantier'
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Termen implementare <span className='text-error-500'>*</span>
                </label>
                <input {...register('termenImplementare')} type='date' className={inputCls} />
                {errors.termenImplementare && (
                  <p className={errorCls}>{errors.termenImplementare.message}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className='w-48'>
              <label className={labelCls}>Status risc</label>
              <select {...register('statusRisc')} className={inputCls}>
                <option value='deschis'>Deschis</option>
                <option value='in_lucru'>În lucru</option>
                <option value='inchis'>Închis</option>
              </select>
            </div>
          </Stack>

          <div className='mt-6 flex justify-end gap-3 border-t border-primary-100 pt-5'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                reset()
                onClose()
              }}
            >
              Anulează
            </Button>
            <Button type='submit' loading={isPending}>
              {initialData?.id ? 'Salvează modificările' : 'Adaugă risc'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
