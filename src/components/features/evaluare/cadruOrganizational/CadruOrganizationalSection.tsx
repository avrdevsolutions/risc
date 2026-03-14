'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Typography, Stack } from '@/components/ui'
import { useUpdateEvaluare } from '@/hooks/use-evaluari'
import { useAutosave } from '@/hooks/useAutosave'
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

import { AutosaveIndicator } from '../AutosaveIndicator'

type Props = { evaluare: Evaluare }

export const CadruOrganizationalSection = ({ evaluare }: Props) => {
  const update = useUpdateEvaluare(evaluare.id)
  const evaluareRef = useRef(evaluare)
  evaluareRef.current = evaluare

  const [regimActivitate, setRegimActivitate] = useState(evaluare.cadruRegimActivitate ?? '')
  const [programLucru, setProgramLucru] = useState(evaluare.cadruProgramLucru ?? '')
  const [fluxPersoane, setFluxPersoane] = useState(evaluare.cadruFluxPersoane ?? '')
  const [fluxBunuri, setFluxBunuri] = useState(evaluare.cadruFluxBunuri ?? '')
  const [numarAngajati, setNumarAngajati] = useState(
    evaluare.cadruNumarAngajati != null ? String(evaluare.cadruNumarAngajati) : '',
  )
  const [zoneFunctionale, setZoneFunctionale] = useState<string[]>(
    parseJsonArray(evaluare.cadruZoneFunctionale),
  )
  const [bunuriValori, setBunuriValori] = useState<string[]>(
    parseJsonArray(evaluare.cadruBunuriValori),
  )
  const [sistemeTehnice, setSistemeTehnice] = useState<string[]>(
    parseJsonArray(evaluare.cadruSistemeTehnice),
  )
  const [factoriVulnerabilitate, setFactoriVulnerabilitate] = useState(
    evaluare.cadruFactoriVulnerabilitate ?? '',
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

  const toggleItem = (
    list: string[],
    setList: (val: string[]) => void,
    item: string,
  ) => {
    setList(list.includes(item) ? list.filter((v) => v !== item) : [...list, item])
  }

  const autosaveValues = {
    cadruRegimActivitate: regimActivitate,
    cadruProgramLucru: programLucru,
    cadruFluxPersoane: fluxPersoane,
    cadruFluxBunuri: fluxBunuri,
    cadruNumarAngajati: numarAngajati !== '' ? Number(numarAngajati) : null,
    cadruZoneFunctionale: JSON.stringify(zoneFunctionale),
    cadruBunuriValori: JSON.stringify(bunuriValori),
    cadruSistemeTehnice: JSON.stringify(sistemeTehnice),
    cadruFactoriVulnerabilitate: factoriVulnerabilitate,
  }

  const handleSave = useCallback(
    async (data: Partial<typeof autosaveValues>) => {
      await update.mutateAsync(data as Partial<Evaluare>)
    },
    [update],
  )

  const status = useAutosave({ values: autosaveValues, onSave: handleSave })

  return (
    <section id='cadru-organizational-section' className='scroll-mt-20'>
      <div className='rounded-2xl border border-navy-100 bg-white p-6 shadow-sm'>
        <Typography variant='h3' className='mb-6 text-navy-900'>
          Cadru Organizațional Intern
        </Typography>

        <Stack gap='6'>
          {/* Regim activitate, Program lucru */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Regim activitate <span className='text-error-500'>*</span>
              </label>
              <select
                value={regimActivitate}
                onChange={(e) => setRegimActivitate(e.target.value)}
                className='form-input'
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
                Program de lucru
              </label>
              <input
                type='text'
                value={programLucru}
                onChange={(e) => setProgramLucru(e.target.value)}
                placeholder='Ex: Luni-Vineri 08:00-20:00'
                className='form-input'
              />
            </div>
          </div>

          {/* Flux persoane, Flux bunuri, Număr angajați */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>Flux persoane</label>
              <select
                value={fluxPersoane}
                onChange={(e) => setFluxPersoane(e.target.value)}
                className='form-input'
              >
                <option value=''>Selectați...</option>
                {FLUX_PERSOANE.map((flux) => (
                  <option key={flux} value={flux}>
                    {flux}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Flux bunuri/valori
              </label>
              <select
                value={fluxBunuri}
                onChange={(e) => setFluxBunuri(e.target.value)}
                className='form-input'
              >
                <option value=''>Selectați...</option>
                {FLUX_BUNURI.map((flux) => (
                  <option key={flux} value={flux}>
                    {flux}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-navy-700'>
                Număr angajați
              </label>
              <input
                type='number'
                min={0}
                value={numarAngajati}
                onChange={(e) => setNumarAngajati(e.target.value)}
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
                    onChange={() => toggleItem(zoneFunctionale, setZoneFunctionale, zona)}
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
                    onChange={() => toggleItem(bunuriValori, setBunuriValori, bun)}
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
                    onChange={() => toggleItem(sistemeTehnice, setSistemeTehnice, sistem)}
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
              onChange={(e) => setFactoriVulnerabilitate(e.target.value)}
              rows={3}
              placeholder='Descrieți factorii interni care pot genera sau amplifica vulnerabilități (ex: rotație frecventă personal, lipsă proceduri, acces necontrolat)...'
              className='form-input'
            />
          </div>

          <AutosaveIndicator status={status} />
        </Stack>
      </div>
    </section>
  )
}
