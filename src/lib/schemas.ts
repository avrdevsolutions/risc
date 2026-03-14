import { z } from 'zod'

export const ProiectSchema = z
  .object({
    denumireProiect: z
      .string()
      .min(3, 'Denumirea obiectivului este obligatorie (min. 3 caractere)'),
    codProiect: z.string().optional(),
    adresaLocatie: z.string().min(5, 'Adresa locației este obligatorie'),
    localitate: z.string().optional(),
    judet: z.string().optional(),
    beneficiar: z.string().min(2, 'Beneficiarul este obligatoriu'),
    cuiBeneficiar: z.string().optional(),
    antreprenor: z.string().min(2, 'Firma evaluatoare este obligatorie'),
    cuiAntreprenor: z.string().optional(),
    subantreprenor: z.string().optional(),
    fazaLucrarii: z.string().min(1, 'Selectați tipul unității'),
    fazaLucrariiCustom: z.string().optional(),
    descriereObiectiv: z.string().optional(),
  })
  .refine(
    (data) =>
      data.fazaLucrarii !== 'Alt tip de obiectiv' ||
      (data.fazaLucrariiCustom && data.fazaLucrariiCustom.length >= 3),
    { message: 'Specificați tipul obiectivului', path: ['fazaLucrariiCustom'] },
  )

export const EvaluatorSchema = z
  .object({
    numeEvaluator: z.string().min(3, 'Numele evaluatorului este obligatoriu'),
    functieEvaluator: z.string().min(2, 'Funcția evaluatorului este obligatorie'),
    firmaEvaluator: z.string().optional(),
    nrDocument: z.string().optional(),
    dataEvaluarii: z.string().min(1, 'Data evaluării este obligatorie'),
    dataRevizuirii: z.string().min(1, 'Data revizuirii este obligatorie'),
  })
  .refine(
    (data) =>
      !data.dataEvaluarii ||
      !data.dataRevizuirii ||
      new Date(data.dataRevizuirii) > new Date(data.dataEvaluarii),
    { message: 'Data revizuirii trebuie să fie după data evaluării', path: ['dataRevizuirii'] },
  )

export const RiscSchema = z
  .object({
    activitate: z.string().min(1, 'Selectați amenințarea'),
    activitateCustom: z.string().optional(),
    pericol: z.string().optional(),
    pericolCustom: z.string().optional(),
    descrierePericol: z.string().optional(),
    persoaneExpuse: z.array(z.string()).min(1, 'Selectați cel puțin o consecință'),
    numarPersoaneExpuse: z.number().int().min(1).optional(),
    probabilitateInitiala: z.number().int().min(1).max(5),
    severitateInitiala: z.number().int().min(1).max(5),
    masuriExistente: z.array(z.string()).min(1, 'Selectați cel puțin o măsură de protecție'),
    masuriExistenteCustom: z.string().optional(),
    masuriSuplimentare: z.string().optional(),
    probabilitateReziduala: z.number().int().min(1).max(5),
    severitateReziduala: z.number().int().min(1).max(5),
    responsabilImplementare: z.string().min(2, 'Responsabilul este obligatoriu'),
    functieResponsabil: z.string().optional(),
    termenImplementare: z.string().min(1, 'Termenul este obligatoriu'),
    statusRisc: z.enum(['deschis', 'in_lucru', 'inchis']),
  })
  .refine(
    (data) =>
      data.probabilitateReziduala * data.severitateReziduala <=
      data.probabilitateInitiala * data.severitateInitiala,
    {
      message: 'Riscul rezidual nu poate fi mai mare decât riscul inițial',
      path: ['probabilitateReziduala'],
    },
  )
  .refine(
    (data) =>
      data.activitate !== 'custom' ||
      (data.activitateCustom !== undefined &&
        data.activitateCustom.trim().length >= 3),
    {
      message: 'Specificați amenințarea (min. 3 caractere)',
      path: ['activitateCustom'],
    },
  )

export const AprobareSchema = z.object({
  sefSantier: z.string().min(3, 'Numele conducătorului unității este obligatoriu'),
  functieSefSantier: z.string().optional(),
  responsabilSSM: z
    .string()
    .min(3, 'Numele responsabilului cu securitatea fizică este obligatoriu'),
  functieResponsabilSSM: z.string().optional(),
  dataAprobarii: z.string().min(1, 'Data aprobării este obligatorie'),
  observatiiGenerale: z.string().optional(),
})

export type ProiectFormValues = z.infer<typeof ProiectSchema>
export type EvaluatorFormValues = z.infer<typeof EvaluatorSchema>
export type RiscFormValues = z.infer<typeof RiscSchema>
export type AprobareFormValues = z.infer<typeof AprobareSchema>
