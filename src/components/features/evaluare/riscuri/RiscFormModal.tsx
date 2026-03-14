'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ChevronDown, ChevronRight, X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'

import { Typography, Stack, Button } from '@/components/ui'
import {
  ACTIVITATI,
  PERICOLE,
  PERSOANE_EXPUSE,
  MASURI_COLECTIVE,
  MASURI_ORGANIZATORICE,
  MASURI_EIP,
  getRiskLevel,
  getRiskColor,
} from '@/lib/constants'
import type { RiscFormValues } from '@/lib/schemas'
import { RiscSchema } from '@/lib/schemas'
import type { Risc } from '@/lib/types'
import { cn, parseJsonArray } from '@/lib/utils'

import { RiscMatrix } from './RiscMatrix'

type Props = {
  onClose: () => void
  onSubmit: (data: RiscFormValues) => void
  initialData?: Partial<Risc>
  isPending?: boolean
}

const RISK_LABELS: Record<string, string> = {
  critic: 'Critic',
  ridicat: 'Ridicat',
  mediu: 'Mediu',
  scazut: 'Scăzut',
}

const ScoreDisplay = ({ p, s }: { p: number; s: number }) => {
  if (!p || !s) return null
  const level = getRiskLevel(p, s)
  const colors = getRiskColor(level)
  const score = p * s
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      Scor: {score} — {RISK_LABELS[level]}
    </span>
  )
}

type MasurGroupProps = {
  title: string
  items: ReadonlyArray<{ value: string; label: string }>
  selected: string[]
  onChange: (value: string, checked: boolean) => void
}

const MasurGroup = ({ title, items, selected, onChange }: MasurGroupProps) => {
  const [open, setOpen] = useState(true)
  const selectedCount = items.filter((i) => selected.includes(i.value)).length

  return (
    <div className='rounded-lg border border-primary-100'>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className='flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-navy-700 hover:bg-primary-50'
      >
        <span>
          {title}
          {selectedCount > 0 && (
            <span className='ml-2 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs text-primary-700'>
              {selectedCount}
            </span>
          )}
        </span>
        {open ? (
          <ChevronDown className='size-4 text-navy-400' />
        ) : (
          <ChevronRight className='size-4 text-navy-400' />
        )}
      </button>
      {open && (
        <div className='grid grid-cols-2 gap-1.5 border-t border-primary-100 px-3 py-2'>
          {items.map((m) => (
            <label
              key={m.value}
              className='flex cursor-pointer items-center gap-2 text-sm text-navy-700'
            >
              <input
                type='checkbox'
                value={m.value}
                checked={selected.includes(m.value)}
                onChange={(e) => onChange(m.value, e.target.checked)}
                className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
              />
              {m.label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

const RiskComparisonWidget = ({
  pInit,
  sInit,
  pRez,
  sRez,
}: {
  pInit: number
  sInit: number
  pRez: number
  sRez: number
}) => {
  const initScore = pInit * sInit
  const rezScore = pRez * sRez
  const initLevel = getRiskLevel(pInit, sInit)
  const rezLevel = getRiskLevel(pRez, sRez)
  const initColors = getRiskColor(initLevel)
  const rezColors = getRiskColor(rezLevel)
  const reduction = initScore > 0 ? Math.round(((initScore - rezScore) / initScore) * 100) : 0
  const isValid = rezScore <= initScore

  return (
    <div className='rounded-lg border border-primary-100 bg-primary-50 p-3'>
      <div className='flex items-center justify-center gap-3'>
        <span
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-bold',
            initColors.bg,
            initColors.text,
          )}
        >
          {initScore} {RISK_LABELS[initLevel].toUpperCase()}
        </span>
        <ArrowRight className='size-5 text-navy-400' />
        <span
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-bold',
            rezColors.bg,
            rezColors.text,
          )}
        >
          {rezScore} {RISK_LABELS[rezLevel].toUpperCase()}
        </span>
      </div>
      <div className='mt-2 text-center text-xs'>
        {isValid ? (
          <span className='font-semibold text-success-600'>
            ↓ {reduction}% reducere risc
          </span>
        ) : (
          <span className='font-semibold text-error-600'>
            ⚠️ Riscul rezidual nu poate depăși riscul inițial
          </span>
        )}
      </div>
    </div>
  )
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
      persoaneExpuse: parseJsonArray(initialData?.persoaneExpuse),
      numarPersoaneExpuse: initialData?.numarPersoaneExpuse ?? undefined,
      probabilitateInitiala: initialData?.probabilitateInitiala ?? 1,
      severitateInitiala: initialData?.severitateInitiala ?? 1,
      masuriExistente: parseJsonArray(initialData?.masuriExistente),
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
                    <option key={a.value} value={a.value}>
                      {a.icon} {a.label}
                    </option>
                  ))}
                </select>
                {errors.activitate && <p className={errorCls}>{errors.activitate.message}</p>}
              </div>
              {activitate === 'custom' && (
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
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {errors.pericol && <p className={errorCls}>{errors.pericol.message}</p>}
              </div>
              {pericol === 'custom' && (
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
              <Controller
                name='probabilitateInitiala'
                control={control}
                render={({ field: pField }) => (
                  <Controller
                    name='severitateInitiala'
                    control={control}
                    render={({ field: sField }) => (
                      <RiscMatrix
                        probabilitate={pField.value}
                        severitate={sField.value}
                        onChange={(p, s) => {
                          pField.onChange(p)
                          sField.onChange(s)
                        }}
                      />
                    )}
                  />
                )}
              />
            </div>

            {/* Măsuri existente — grouped */}
            <div>
              <label className={labelCls}>
                Măsuri de protecție existente <span className='text-error-500'>*</span>
              </label>
              <Controller
                name='masuriExistente'
                control={control}
                render={({ field }) => {
                  const handleChange = (value: string, checked: boolean) => {
                    const next = checked
                      ? [...(field.value ?? []), value]
                      : (field.value ?? []).filter((v) => v !== value)
                    field.onChange(next)
                  }
                  return (
                    <Stack gap='2'>
                      <MasurGroup
                        title='1. EIP (Echipament Individual de Protecție)'
                        items={MASURI_EIP}
                        selected={field.value ?? []}
                        onChange={handleChange}
                      />
                      <MasurGroup
                        title='2. Măsuri Colective'
                        items={MASURI_COLECTIVE}
                        selected={field.value ?? []}
                        onChange={handleChange}
                      />
                      <MasurGroup
                        title='3. Măsuri Organizatorice'
                        items={MASURI_ORGANIZATORICE}
                        selected={field.value ?? []}
                        onChange={handleChange}
                      />
                    </Stack>
                  )
                }}
              />
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
              <Controller
                name='probabilitateReziduala'
                control={control}
                render={({ field: pField }) => (
                  <Controller
                    name='severitateReziduala'
                    control={control}
                    render={({ field: sField }) => (
                      <RiscMatrix
                        probabilitate={pField.value}
                        severitate={sField.value}
                        onChange={(p, s) => {
                          pField.onChange(p)
                          sField.onChange(s)
                        }}
                      />
                    )}
                  />
                )}
              />
              {errors.probabilitateReziduala && (
                <p className={errorCls}>{errors.probabilitateReziduala.message}</p>
              )}
            </div>

            {/* Before → After comparison */}
            <RiskComparisonWidget pInit={pInit} sInit={sInit} pRez={pRez} sRez={sRez} />

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
