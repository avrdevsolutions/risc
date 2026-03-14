'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Select, Stack, Typography } from '@/components/ui'
import { useEvaluareSyncContext } from '@/context/EvaluareSyncContext'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useSectionSync } from '@/hooks/useSectionSync'
import {
  REGIM_ACTIVITATE,
  FLUX_PERSOANE,
  FLUX_BUNURI,
  ZONE_FUNCTIONALE,
  BUNURI_VALORI,
  SISTEME_TEHNICE,
} from '@/lib/constants'
import type { Evaluare } from '@/lib/types'
import { parseJsonArray } from '@/lib/utils'
import { useEvaluareFormStore } from '@/stores/evaluare-form-store'

type Props = { evaluare: Evaluare }

export const CadruOrganizationalSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare
  const { setField } = useEvaluareSyncContext()
  const localInit = useEvaluareFormStore.getState().getFormData(evaluare.id)

  const [regimActivitate, setRegimActivitate] = useState(
    (localInit.cadruRegimActivitate as string | undefined) ?? evaluare.cadruRegimActivitate ?? '',
  )
  const [programLucru, setProgramLucru] = useState(
    (localInit.cadruProgramLucru as string | undefined) ?? evaluare.cadruProgramLucru ?? '',
  )
  const [fluxPersoane, setFluxPersoane] = useState(
    (localInit.cadruFluxPersoane as string | undefined) ?? evaluare.cadruFluxPersoane ?? '',
  )
  const [fluxBunuri, setFluxBunuri] = useState(
    (localInit.cadruFluxBunuri as string | undefined) ?? evaluare.cadruFluxBunuri ?? '',
  )
  const [numarAngajati, setNumarAngajati] = useState(
    (localInit.cadruNumarAngajati as string | undefined) ??
      (evaluare.cadruNumarAngajati != null ? String(evaluare.cadruNumarAngajati) : ''),
  )
  const [zoneFunctionale, setZoneFunctionale] = useState<string[]>(
    parseJsonArray(
      (localInit.cadruZoneFunctionale as string | undefined) ?? evaluare.cadruZoneFunctionale,
    ),
  )
  const [bunuriValori, setBunuriValori] = useState<string[]>(
    parseJsonArray(
      (localInit.cadruBunuriValori as string | undefined) ?? evaluare.cadruBunuriValori,
    ),
  )
  const [sistemeTehnice, setSistemeTehnice] = useState<string[]>(
    parseJsonArray(
      (localInit.cadruSistemeTehnice as string | undefined) ?? evaluare.cadruSistemeTehnice,
    ),
  )
  const [factoriVulnerabilitate, setFactoriVulnerabilitate] = useState(
    (localInit.cadruFactoriVulnerabilitate as string | undefined) ??
      evaluare.cadruFactoriVulnerabilitate ??
      '',
  )

  useEffect(() => {
    const ev = evaluareRef.current
    setRegimActivitate(ev.cadruRegimActivitate ?? '')
    setProgramLucru(ev.cadruProgramLucru ?? '')
    setFluxPersoane(ev.cadruFluxPersoane ?? '')
    setFluxBunuri(ev.cadruFluxBunuri ?? '')
    setNumarAngajati(ev.cadruNumarAngajati != null ? String(ev.cadruNumarAngajati) : '')
    setZoneFunctionale(parseJsonArray(ev.cadruZoneFunctionale))
    setBunuriValori(parseJsonArray(ev.cadruBunuriValori))
    setSistemeTehnice(parseJsonArray(ev.cadruSistemeTehnice))
    setFactoriVulnerabilitate(ev.cadruFactoriVulnerabilitate ?? '')
  }, [evaluare.id])

  const handleSave = useCallback(async () => {
    await update.mutateAsync({
      cadruRegimActivitate: regimActivitate || null,
      cadruProgramLucru: programLucru || null,
      cadruFluxPersoane: fluxPersoane || null,
      cadruFluxBunuri: fluxBunuri || null,
      cadruNumarAngajati: numarAngajati !== '' ? parseInt(numarAngajati, 10) || null : null,
      cadruZoneFunctionale: JSON.stringify(zoneFunctionale),
      cadruBunuriValori: JSON.stringify(bunuriValori),
      cadruSistemeTehnice: JSON.stringify(sistemeTehnice),
      cadruFactoriVulnerabilitate: factoriVulnerabilitate || null,
    } as Partial<Evaluare>)
  }, [
    update,
    regimActivitate,
    programLucru,
    fluxPersoane,
    fluxBunuri,
    numarAngajati,
    zoneFunctionale,
    bunuriValori,
    sistemeTehnice,
    factoriVulnerabilitate,
  ])

  const { markDirty } = useSectionSync('cadru-organizational', handleSave)

  const handleSelectChange = (setter: (v: string) => void, key: string, value: string) => {
    setter(value)
    setField(key, value)
    markDirty()
  }

  const handleCheckboxChange = (
    list: string[],
    setList: (v: string[]) => void,
    item: string,
    key: string,
  ) => {
    const updated = list.includes(item) ? list.filter((v) => v !== item) : [...list, item]
    setList(updated)
    setField(key, JSON.stringify(updated))
    markDirty()
  }

  return (
    <section id='cadru-organizational-section' className='scroll-mt-32'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          4. Cadru Organizațional
        </Typography>

        <Stack gap='6'>
          {/* Regim activitate, Program lucru */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Regim activitate <span className='text-error-500'>*</span>
              </label>
              <Select
                value={regimActivitate}
                onChange={(v) => handleSelectChange(setRegimActivitate, 'cadruRegimActivitate', v)}
                options={REGIM_ACTIVITATE}
                placeholder='Selectați...'
                aria-label='Regim activitate'
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Program de lucru
              </label>
              <input
                type='text'
                value={programLucru}
                onChange={(e) => {
                  setProgramLucru(e.target.value)
                  setField('cadruProgramLucru', e.target.value)
                  markDirty()
                }}
                placeholder='Ex: Luni-Vineri 08:00-20:00'
                className='form-input'
              />
            </div>
          </div>

          {/* Flux persoane, Flux bunuri, Număr angajați */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Flux persoane
              </label>
              <Select
                value={fluxPersoane}
                onChange={(v) => handleSelectChange(setFluxPersoane, 'cadruFluxPersoane', v)}
                options={FLUX_PERSOANE}
                placeholder='Selectați...'
                aria-label='Flux persoane'
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Flux bunuri/valori
              </label>
              <Select
                value={fluxBunuri}
                onChange={(v) => handleSelectChange(setFluxBunuri, 'cadruFluxBunuri', v)}
                options={FLUX_BUNURI}
                placeholder='Selectați...'
                aria-label='Flux bunuri/valori'
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Număr angajați
              </label>
              <input
                type='number'
                min={0}
                value={numarAngajati}
                onChange={(e) => {
                  setNumarAngajati(e.target.value)
                  setField('cadruNumarAngajati', e.target.value)
                  markDirty()
                }}
                placeholder='Ex: 25'
                className='form-input'
              />
            </div>
          </div>

          {/* Zone funcționale */}
          <div>
            <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
              Zone funcționale delimitate
            </Typography>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              {ZONE_FUNCTIONALE.map((zona) => (
                <label
                  key={zona}
                  className='flex cursor-pointer items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
                >
                  <input
                    type='checkbox'
                    checked={zoneFunctionale.includes(zona)}
                    onChange={() =>
                      handleCheckboxChange(
                        zoneFunctionale,
                        setZoneFunctionale,
                        zona,
                        'cadruZoneFunctionale',
                      )
                    }
                    className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                  />
                  <Typography variant='body-sm' className='text-navy-700'>
                    {zona}
                  </Typography>
                </label>
              ))}
            </div>
          </div>

          {/* Bunuri și valori */}
          <div>
            <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
              Bunuri și valori în obiectiv
            </Typography>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              {BUNURI_VALORI.map((bun) => (
                <label
                  key={bun}
                  className='flex cursor-pointer items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
                >
                  <input
                    type='checkbox'
                    checked={bunuriValori.includes(bun)}
                    onChange={() =>
                      handleCheckboxChange(bunuriValori, setBunuriValori, bun, 'cadruBunuriValori')
                    }
                    className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                  />
                  <Typography variant='body-sm' className='text-navy-700'>
                    {bun}
                  </Typography>
                </label>
              ))}
            </div>
          </div>

          {/* Sisteme tehnice existente */}
          <div>
            <Typography variant='body-sm' className='mb-3 font-medium text-navy-700'>
              Sisteme tehnice existente
            </Typography>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              {SISTEME_TEHNICE.map((sistem) => (
                <label
                  key={sistem}
                  className='flex cursor-pointer items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50'
                >
                  <input
                    type='checkbox'
                    checked={sistemeTehnice.includes(sistem)}
                    onChange={() =>
                      handleCheckboxChange(
                        sistemeTehnice,
                        setSistemeTehnice,
                        sistem,
                        'cadruSistemeTehnice',
                      )
                    }
                    className='rounded border-primary-300 text-primary-600 focus:ring-primary-500'
                  />
                  <Typography variant='body-sm' className='text-navy-700'>
                    {sistem}
                  </Typography>
                </label>
              ))}
            </div>
          </div>

          {/* Factori interni de vulnerabilitate */}
          <div>
            <label className='mb-1.5 block text-sm font-medium text-navy-700'>
              Factori interni de vulnerabilitate
            </label>
            <textarea
              value={factoriVulnerabilitate}
              onChange={(e) => {
                setFactoriVulnerabilitate(e.target.value)
                setField('cadruFactoriVulnerabilitate', e.target.value)
                markDirty()
              }}
              rows={3}
              placeholder='Descrieți factorii interni care pot genera sau amplifica vulnerabilități (ex: rotație frecventă personal, lipsă proceduri, acces necontrolat)...'
              className='form-input'
            />
          </div>
        </Stack>
      </div>
    </section>
  )
}
