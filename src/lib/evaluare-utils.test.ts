import { describe, expect, it } from 'vitest'

import { computeProgress } from './evaluare-utils'

import type { EvaluareWithRiscuri } from './types'

// Minimal blank evaluare — mirrors what POST /api/evaluari returns for a new evaluation.
// Auto-populated dates (dataEvaluarii, dataRevizuirii, dataAprobarii) are present
// but must NOT count toward progress.
const blankEvaluare: EvaluareWithRiscuri = {
  id: 'test-id',
  status: 'draft',
  createdAt: '2026-03-14T00:00:00.000Z',
  updatedAt: '2026-03-14T00:00:00.000Z',
  completedAt: null,
  denumireProiect: null,
  codProiect: null,
  adresaLocatie: null,
  localitate: null,
  judet: null,
  beneficiar: null,
  cuiBeneficiar: null,
  antreprenor: null,
  cuiAntreprenor: null,
  subantreprenor: null,
  fazaLucrarii: null,
  fazaLucrariiCustom: null,
  descriereObiectiv: null,
  numeEvaluator: null,
  functieEvaluator: null,
  firmaEvaluator: null,
  nrDocument: null,
  // Auto-populated by POST /api/evaluari — must NOT count toward progress
  dataEvaluarii: '2026-03-14',
  dataRevizuirii: '2026-09-14',
  dataAprobarii: '2026-03-14',
  tipEvaluare: null,
  obiectiveEvaluare: null,
  metodeInstrumente: null,
  suprafataTotala: null,
  descriereAmplasare: null,
  tipImprejmuire: null,
  tipAcces: null,
  vecinNord: null,
  vecinEst: null,
  vecinSud: null,
  vecinVest: null,
  sefSantier: null,
  functieSefSantier: null,
  responsabilSSM: null,
  functieResponsabilSSM: null,
  observatiiGenerale: null,
  documenteAplicabile: null,
  anexeSelectate: null,
  observatiiDocumente: null,
  cadruRegimActivitate: null,
  cadruProgramLucru: null,
  cadruFluxPersoane: null,
  cadruFluxBunuri: null,
  cadruNumarAngajati: null,
  cadruZoneFunctionale: null,
  cadruBunuriValori: null,
  cadruSistemeTehnice: null,
  cadruFactoriVulnerabilitate: null,
  numarPuncteAcces: null,
  caiAcces: null,
  posibilitateDisimulare: null,
  vecinatatiBifate: null,
  factoriExterni: null,
  istoricIncidente: null,
  masuriMecanofizice: null,
  masuriControlAcces: null,
  masuriAlarmare: null,
  masuriCctv: null,
  pazaUmana: null,
  numarAgenti: null,
  masuriOrganizatorice: null,
  masuriAsigurari: null,
  observatiiMasuri: null,
  nivelRiscGlobalAsumat: null,
  nivelRiscRezidualGlobal: null,
  termenImplementareGlobal: null,
  concluziiGenerale: null,
  masuriObligatorii: null,
  masuriRecomandate: null,
  riscuri: [],
}

/** Produce a copy of blankEvaluare with the given overrides */
const withFields = (overrides: Partial<EvaluareWithRiscuri>): EvaluareWithRiscuri => ({
  ...blankEvaluare,
  ...overrides,
})

describe('computeProgress', () => {
  // ─── Bug fix regression: auto-populated dates must NOT inflate progress ───

  it('returns 0% for a brand-new blank evaluation (with auto-populated dates)', () => {
    expect(computeProgress(blankEvaluare)).toBe(0)
  })

  it('returns 0% when only auto-populated dates are present and no user input', () => {
    // Explicitly set all three auto-populated dates — none should count
    const evaluare = withFields({
      dataEvaluarii: '2026-03-14',
      dataRevizuirii: '2026-09-14',
      dataAprobarii: '2026-03-14',
    })
    expect(computeProgress(evaluare)).toBe(0)
  })

  // ─── Completeness progression ───────────────────────────────────────────────

  it('returns 100% when all 9 required fields are filled and at least one risc exists', () => {
    const fullyFilled = withFields({
      denumireProiect: 'Proiect Test',
      adresaLocatie: 'Str. Exemplu 1',
      beneficiar: 'Beneficiar SA',
      antreprenor: 'Constructor SRL',
      fazaLucrarii: 'Fundații',
      numeEvaluator: 'Ion Ionescu',
      functieEvaluator: 'Evaluator',
      sefSantier: 'Gheorghe Popescu',
      responsabilSSM: 'Maria Marinescu',
      riscuri: [
        {
          id: 'r1',
          evaluareId: 'test-id',
          ordine: 1,
          activitate: 'Lucru la înălțime',
          activitateCustom: null,
          pericol: 'Cădere',
          pericolCustom: null,
          descrierePericol: null,
          persoaneExpuse: null,
          numarPersoaneExpuse: null,
          probabilitateInitiala: 3,
          severitateInitiala: 4,
          masuriExistente: null,
          masuriExistenteCustom: null,
          masuriSuplimentare: null,
          probabilitateReziduala: null,
          severitateReziduala: null,
          responsabilImplementare: null,
          functieResponsabil: null,
          termenImplementare: null,
          statusRisc: 'activ',
          createdAt: '2026-03-14T00:00:00.000Z',
          updatedAt: '2026-03-14T00:00:00.000Z',
        },
      ],
    })
    expect(computeProgress(fullyFilled)).toBe(100)
  })

  it('returns ~10% (1/10) when only one required field is filled and no riscuri', () => {
    const evaluare = withFields({ denumireProiect: 'Test' })
    expect(computeProgress(evaluare)).toBe(10)
  })

  it('returns ~10% (1/10) when only riscuri exist and no required fields are filled', () => {
    const evaluare = withFields({
      riscuri: [
        {
          id: 'r1',
          evaluareId: 'test-id',
          ordine: 1,
          activitate: 'Activitate',
          activitateCustom: null,
          pericol: 'Pericol',
          pericolCustom: null,
          descrierePericol: null,
          persoaneExpuse: null,
          numarPersoaneExpuse: null,
          probabilitateInitiala: null,
          severitateInitiala: null,
          masuriExistente: null,
          masuriExistenteCustom: null,
          masuriSuplimentare: null,
          probabilitateReziduala: null,
          severitateReziduala: null,
          responsabilImplementare: null,
          functieResponsabil: null,
          termenImplementare: null,
          statusRisc: 'activ',
          createdAt: '2026-03-14T00:00:00.000Z',
          updatedAt: '2026-03-14T00:00:00.000Z',
        },
      ],
    })
    expect(computeProgress(evaluare)).toBe(10)
  })

  it('counts multiple riscuri as a single filled item (same as one risc)', () => {
    const singleRisc: EvaluareWithRiscuri['riscuri'][0] = {
      id: 'r2',
      evaluareId: 'test-id',
      ordine: 1,
      activitate: 'Test',
      activitateCustom: null,
      pericol: 'Test',
      pericolCustom: null,
      descrierePericol: null,
      persoaneExpuse: null,
      numarPersoaneExpuse: null,
      probabilitateInitiala: null,
      severitateInitiala: null,
      masuriExistente: null,
      masuriExistenteCustom: null,
      masuriSuplimentare: null,
      probabilitateReziduala: null,
      severitateReziduala: null,
      responsabilImplementare: null,
      functieResponsabil: null,
      termenImplementare: null,
      statusRisc: 'activ',
      createdAt: '2026-03-14T00:00:00.000Z',
      updatedAt: '2026-03-14T00:00:00.000Z',
    }
    const withOne = withFields({ riscuri: [singleRisc] })
    const withMany = withFields({ riscuri: [singleRisc, { ...singleRisc, id: 'r3', ordine: 2 }] })
    expect(computeProgress(withOne)).toBe(computeProgress(withMany))
  })

  // ─── Empty / whitespace field handling ────────────────────────────────────

  it('treats an empty string field as unfilled', () => {
    const evaluare = withFields({ denumireProiect: '' })
    expect(computeProgress(evaluare)).toBe(0)
  })

  it('treats a null field as unfilled', () => {
    const evaluare = withFields({ denumireProiect: null })
    expect(computeProgress(evaluare)).toBe(0)
  })

  it('treats undefined field as unfilled', () => {
    // undefined should behave same as null/empty
    const evaluare = withFields({ denumireProiect: undefined as unknown as null })
    expect(computeProgress(evaluare)).toBe(0)
  })

  it('counts a whitespace-only string as filled (non-empty)', () => {
    // The filter checks v !== '' — "   " passes, so it is counted as filled
    const evaluare = withFields({ denumireProiect: '   ' })
    expect(computeProgress(evaluare)).toBe(10)
  })

  // ─── Partial completeness ─────────────────────────────────────────────────

  it('returns 50% when 5 of 9 required fields are filled and no riscuri', () => {
    const evaluare = withFields({
      denumireProiect: 'Test',
      adresaLocatie: 'Str. Test',
      beneficiar: 'Ben SRL',
      antreprenor: 'Con SRL',
      fazaLucrarii: 'Structură',
    })
    // 5 filled / 10 total = 50%
    expect(computeProgress(evaluare)).toBe(50)
  })

  it('returns 90% when all 9 required fields are filled but no riscuri', () => {
    const evaluare = withFields({
      denumireProiect: 'Proiect',
      adresaLocatie: 'Adresă',
      beneficiar: 'Beneficiar',
      antreprenor: 'Antreprenor',
      fazaLucrarii: 'Faza',
      numeEvaluator: 'Evaluator',
      functieEvaluator: 'Functie',
      sefSantier: 'Sef',
      responsabilSSM: 'SSM',
    })
    // 9 filled / 10 total = 90%
    expect(computeProgress(evaluare)).toBe(90)
  })

  // ─── Return value is always a round integer ───────────────────────────────

  it('always returns an integer (Math.round applied)', () => {
    // 1/10 = 10 — already round, but verify type
    const result = computeProgress(withFields({ denumireProiect: 'Test' }))
    expect(Number.isInteger(result)).toBe(true)
  })

  it('never returns a value below 0', () => {
    expect(computeProgress(blankEvaluare)).toBeGreaterThanOrEqual(0)
  })

  it('never returns a value above 100', () => {
    const full = withFields({
      denumireProiect: 'A',
      adresaLocatie: 'B',
      beneficiar: 'C',
      antreprenor: 'D',
      fazaLucrarii: 'E',
      numeEvaluator: 'F',
      functieEvaluator: 'G',
      sefSantier: 'H',
      responsabilSSM: 'I',
      riscuri: [
        {
          id: 'r1',
          evaluareId: 'test-id',
          ordine: 1,
          activitate: 'A',
          activitateCustom: null,
          pericol: 'P',
          pericolCustom: null,
          descrierePericol: null,
          persoaneExpuse: null,
          numarPersoaneExpuse: null,
          probabilitateInitiala: null,
          severitateInitiala: null,
          masuriExistente: null,
          masuriExistenteCustom: null,
          masuriSuplimentare: null,
          probabilitateReziduala: null,
          severitateReziduala: null,
          responsabilImplementare: null,
          functieResponsabil: null,
          termenImplementare: null,
          statusRisc: 'activ',
          createdAt: '',
          updatedAt: '',
        },
      ],
    })
    expect(computeProgress(full)).toBeLessThanOrEqual(100)
  })

  // ─── Individual required field contribution ───────────────────────────────
  //
  // Each of the 9 required fields should contribute exactly 10% in isolation.
  // This verifies that no field is double-counted or silently excluded.

  it('denumireProiect alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ denumireProiect: 'Test' }))).toBe(10)
  })

  it('adresaLocatie alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ adresaLocatie: 'Str. Test 1' }))).toBe(10)
  })

  it('beneficiar alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ beneficiar: 'Beneficiar SA' }))).toBe(10)
  })

  it('antreprenor alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ antreprenor: 'Constructor SRL' }))).toBe(10)
  })

  it('fazaLucrarii alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ fazaLucrarii: 'Fundații' }))).toBe(10)
  })

  it('numeEvaluator alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ numeEvaluator: 'Ion Ionescu' }))).toBe(10)
  })

  it('functieEvaluator alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ functieEvaluator: 'Inspector SSM' }))).toBe(10)
  })

  it('sefSantier alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ sefSantier: 'Gheorghe Popescu' }))).toBe(10)
  })

  it('responsabilSSM alone contributes exactly 10%', () => {
    expect(computeProgress(withFields({ responsabilSSM: 'Maria Marinescu' }))).toBe(10)
  })

  // ─── Fields excluded from required list ───────────────────────────────────

  it('fazaLucrariiCustom alone does NOT contribute to progress', () => {
    // fazaLucrariiCustom is not in the required fields list
    expect(computeProgress(withFields({ fazaLucrariiCustom: 'Custom obiectiv' }))).toBe(0)
  })

  it('codProiect alone does NOT contribute to progress', () => {
    expect(computeProgress(withFields({ codProiect: 'PRJ-001' }))).toBe(0)
  })

  it('beneficiar + antreprenor + fazaLucrarii + numeEvaluator contribute 4 × 10% = 40%', () => {
    const evaluare = withFields({
      beneficiar: 'Ben SA',
      antreprenor: 'Con SRL',
      fazaLucrarii: 'Structură',
      numeEvaluator: 'Evaluator',
    })
    expect(computeProgress(evaluare)).toBe(40)
  })

  // ─── Monotonicity ─────────────────────────────────────────────────────────

  it('progress increases monotonically as required fields are added one by one', () => {
    const fields = [
      'denumireProiect',
      'adresaLocatie',
      'beneficiar',
      'antreprenor',
      'fazaLucrarii',
    ] as const

    let prev = 0
    let overrides: Partial<EvaluareWithRiscuri> = {}
    for (const field of fields) {
      overrides = { ...overrides, [field]: 'filled' }
      const current = computeProgress(withFields(overrides))
      expect(current).toBeGreaterThan(prev)
      prev = current
    }
  })
})
