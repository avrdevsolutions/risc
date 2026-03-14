'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Typography, Stack } from '@/components/ui'
import { useEvaluareSyncContext } from '@/context/EvaluareSyncContext'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useSectionSync } from '@/hooks/useSectionSync'
import {
  MASURI_MECANOFIZICE,
  MASURI_CONTROL_ACCES,
  MASURI_ALARMARE,
  MASURI_CCTV,
  PAZA_UMANA,
  MASURI_ORGANIZATORICE,
  MASURI_ASIGURARI,
} from '@/lib/constants'
import type { Evaluare } from '@/lib/types'
import { parseJsonArray } from '@/lib/utils'
import { useEvaluareFormStore } from '@/stores/evaluare-form-store'

type Props = { evaluare: Evaluare }

type CheckboxGridProps = {
  items: readonly { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
}

const CheckboxGrid = ({ items, selected, onToggle }: CheckboxGridProps) => (
  <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
    {items.map((item) => (
      <label
        key={item.value}
        className='flex cursor-pointer items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
      >
        <input
          type='checkbox'
          checked={selected.includes(item.value)}
          onChange={() => onToggle(item.value)}
          className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
        />
        <Typography variant='body-sm' className='text-navy-700'>
          {item.label}
        </Typography>
      </label>
    ))}
  </div>
)

type SubSectionProps = { title: string; children: React.ReactNode }

const SubSection = ({ title, children }: SubSectionProps) => (
  <div className='border-t border-navy-100 pt-5'>
    <Typography variant='body-sm' className='mb-3 font-semibold text-navy-800'>
      {title}
    </Typography>
    {children}
  </div>
)

export const MasuriSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare
  const { setField } = useEvaluareSyncContext()
  const localInit = useEvaluareFormStore.getState().getFormData(evaluare.id)

  const [mecanofizice, setMecanofizice] = useState<string[]>(
    parseJsonArray(
      (localInit.masuriMecanofizice as string | undefined) ?? evaluare.masuriMecanofizice,
    ),
  )
  const [controlAcces, setControlAcces] = useState<string[]>(
    parseJsonArray(
      (localInit.masuriControlAcces as string | undefined) ?? evaluare.masuriControlAcces,
    ),
  )
  const [alarmare, setAlarmare] = useState<string[]>(
    parseJsonArray((localInit.masuriAlarmare as string | undefined) ?? evaluare.masuriAlarmare),
  )
  const [cctv, setCctv] = useState<string[]>(
    parseJsonArray((localInit.masuriCctv as string | undefined) ?? evaluare.masuriCctv),
  )
  const [pazaUmana, setPazaUmana] = useState<string[]>(
    parseJsonArray((localInit.pazaUmana as string | undefined) ?? evaluare.pazaUmana),
  )
  const [numarAgenti, setNumarAgenti] = useState(
    (localInit.numarAgenti as string | undefined) ??
      (evaluare.numarAgenti != null ? String(evaluare.numarAgenti) : ''),
  )
  const [organizatorice, setOrganizatorice] = useState<string[]>(
    parseJsonArray(
      (localInit.masuriOrganizatorice as string | undefined) ?? evaluare.masuriOrganizatorice,
    ),
  )
  const [asigurari, setAsigurari] = useState<string[]>(
    parseJsonArray((localInit.masuriAsigurari as string | undefined) ?? evaluare.masuriAsigurari),
  )
  const [observatii, setObservatii] = useState(
    (localInit.observatiiMasuri as string | undefined) ?? evaluare.observatiiMasuri ?? '',
  )

  useEffect(() => {
    const ev = evaluareRef.current
    setMecanofizice(parseJsonArray(ev.masuriMecanofizice))
    setControlAcces(parseJsonArray(ev.masuriControlAcces))
    setAlarmare(parseJsonArray(ev.masuriAlarmare))
    setCctv(parseJsonArray(ev.masuriCctv))
    setPazaUmana(parseJsonArray(ev.pazaUmana))
    setNumarAgenti(ev.numarAgenti != null ? String(ev.numarAgenti) : '')
    setOrganizatorice(parseJsonArray(ev.masuriOrganizatorice))
    setAsigurari(parseJsonArray(ev.masuriAsigurari))
    setObservatii(ev.observatiiMasuri ?? '')
  }, [evaluare.id])

  const handleSave = useCallback(async () => {
    await update.mutateAsync({
      masuriMecanofizice: JSON.stringify(mecanofizice),
      masuriControlAcces: JSON.stringify(controlAcces),
      masuriAlarmare: JSON.stringify(alarmare),
      masuriCctv: JSON.stringify(cctv),
      pazaUmana: JSON.stringify(pazaUmana),
      numarAgenti: (() => {
        if (numarAgenti === '') return null
        const parsed = parseInt(numarAgenti, 10)
        return isNaN(parsed) ? null : parsed
      })(),
      masuriOrganizatorice: JSON.stringify(organizatorice),
      masuriAsigurari: JSON.stringify(asigurari),
      observatiiMasuri: observatii || null,
    } as Partial<Evaluare>)
  }, [
    update,
    mecanofizice,
    controlAcces,
    alarmare,
    cctv,
    pazaUmana,
    numarAgenti,
    organizatorice,
    asigurari,
    observatii,
  ])

  const { markDirty } = useSectionSync('masuri', handleSave)

  const handleToggle = (
    list: string[],
    setList: (v: string[]) => void,
    value: string,
    key: string,
  ) => {
    const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    setList(updated)
    setField(key, JSON.stringify(updated))
    markDirty()
  }

  return (
    <section id='masuri-section' className='scroll-mt-32'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          7. Măsuri &amp; Mecanisme
        </Typography>

        <Stack gap='2'>
          {/* a) Mecanofizică */}
          <SubSection title='a) Protecție mecanofizică (antiefracție)'>
            <CheckboxGrid
              items={MASURI_MECANOFIZICE}
              selected={mecanofizice}
              onToggle={(v) => handleToggle(mecanofizice, setMecanofizice, v, 'masuriMecanofizice')}
            />
          </SubSection>

          {/* b) Control acces */}
          <SubSection title='b) Protecție electronică — Control acces'>
            <CheckboxGrid
              items={MASURI_CONTROL_ACCES}
              selected={controlAcces}
              onToggle={(v) => handleToggle(controlAcces, setControlAcces, v, 'masuriControlAcces')}
            />
          </SubSection>

          {/* c) Alarmare */}
          <SubSection title='c) Protecție electronică — Alarmare antiefracție și panică'>
            <CheckboxGrid
              items={MASURI_ALARMARE}
              selected={alarmare}
              onToggle={(v) => handleToggle(alarmare, setAlarmare, v, 'masuriAlarmare')}
            />
          </SubSection>

          {/* d) CCTV */}
          <SubSection title='d) Protecție electronică — Supraveghere video (CCTV)'>
            <CheckboxGrid
              items={MASURI_CCTV}
              selected={cctv}
              onToggle={(v) => handleToggle(cctv, setCctv, v, 'masuriCctv')}
            />
          </SubSection>

          {/* e) Pază umană */}
          <SubSection title='e) Pază umană și intervenție'>
            <CheckboxGrid
              items={PAZA_UMANA}
              selected={pazaUmana}
              onToggle={(v) => handleToggle(pazaUmana, setPazaUmana, v, 'pazaUmana')}
            />
            <div className='mt-4'>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Număr agenți de securitate
              </label>
              <input
                type='number'
                min={0}
                value={numarAgenti}
                onChange={(e) => {
                  setNumarAgenti(e.target.value)
                  setField('numarAgenti', e.target.value)
                  markDirty()
                }}
                placeholder='Ex: 2'
                className='form-input w-48'
              />
            </div>
          </SubSection>

          {/* f) Organizatorice */}
          <SubSection title='f) Măsuri organizatorice și operaționale'>
            <CheckboxGrid
              items={MASURI_ORGANIZATORICE}
              selected={organizatorice}
              onToggle={(v) =>
                handleToggle(organizatorice, setOrganizatorice, v, 'masuriOrganizatorice')
              }
            />
          </SubSection>

          {/* g) Asigurări */}
          <SubSection title='g) Măsuri de partajare a riscului (asigurări)'>
            <CheckboxGrid
              items={MASURI_ASIGURARI}
              selected={asigurari}
              onToggle={(v) => handleToggle(asigurari, setAsigurari, v, 'masuriAsigurari')}
            />
          </SubSection>

          {/* Observații suplimentare */}
          <div className='border-t border-navy-100 pt-5'>
            <label className='mb-1.5 block text-sm font-medium text-navy-700'>
              Observații măsuri suplimentare
            </label>
            <textarea
              value={observatii}
              onChange={(e) => {
                setObservatii(e.target.value)
                setField('observatiiMasuri', e.target.value)
                markDirty()
              }}
              rows={3}
              placeholder='Descrieți orice măsuri suplimentare care nu se regăsesc în listele de mai sus...'
              className='form-input'
            />
          </div>
        </Stack>
      </div>
    </section>
  )
}
