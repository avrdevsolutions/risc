import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'

import {
  AMENINTARI,
  CADRU_LEGAL,
  DOCUMENTE_SUPORT,
  MASURI_ALARMARE,
  MASURI_ASIGURARI,
  MASURI_CCTV,
  MASURI_CONTROL_ACCES,
  MASURI_MECANOFIZICE,
  MASURI_ORGANIZATORICE,
  MATRICE_COLORS,
  MATRICE_RISC,
  NIVEL_RISC,
  PAZA_UMANA,
  SCALA_IMPACT,
  SCALA_PROBABILITATE,
  getNivelRisc,
} from './constants'

// ─── types ───────────────────────────────────────────────────────────────────

type DbEvaluare = {
  id: string
  codProiect?: string | null
  nrDocument?: string | null
  denumireProiect?: string | null
  beneficiar?: string | null
  cuiBeneficiar?: string | null
  antreprenor?: string | null
  cuiAntreprenor?: string | null
  subantreprenor?: string | null
  adresaLocatie?: string | null
  localitate?: string | null
  judet?: string | null
  fazaLucrarii?: string | null
  fazaLucrariiCustom?: string | null
  tipEvaluare?: string | null
  obiectiveEvaluare?: string | null
  metodeInstrumente?: string | null
  descriereObiectiv?: string | null
  numeEvaluator?: string | null
  functieEvaluator?: string | null
  firmaEvaluator?: string | null
  dataEvaluarii?: string | null
  dataRevizuirii?: string | null
  dataAprobarii?: string | null
  suprafataTotala?: string | null
  descriereAmplasare?: string | null
  tipImprejmuire?: string | null
  tipAcces?: string | null
  numarPuncteAcces?: number | null
  caiAcces?: string | null
  posibilitateDisimulare?: string | null
  vecinatatiBifate?: string | null
  vecinNord?: string | null
  vecinEst?: string | null
  vecinSud?: string | null
  vecinVest?: string | null
  factoriExterni?: string | null
  istoricIncidente?: string | null
  cadruRegimActivitate?: string | null
  cadruProgramLucru?: string | null
  cadruFluxPersoane?: string | null
  cadruFluxBunuri?: string | null
  cadruNumarAngajati?: number | null
  cadruZoneFunctionale?: string | null
  cadruBunuriValori?: string | null
  cadruSistemeTehnice?: string | null
  cadruFactoriVulnerabilitate?: string | null
  masuriMecanofizice?: string | null
  masuriControlAcces?: string | null
  masuriAlarmare?: string | null
  masuriCctv?: string | null
  pazaUmana?: string | null
  numarAgenti?: number | null
  masuriOrganizatorice?: string | null
  masuriAsigurari?: string | null
  observatiiMasuri?: string | null
  nivelRiscGlobalAsumat?: string | null
  nivelRiscRezidualGlobal?: string | null
  termenImplementareGlobal?: string | null
  concluziiGenerale?: string | null
  masuriObligatorii?: string | null
  masuriRecomandate?: string | null
  sefSantier?: string | null
  functieSefSantier?: string | null
  responsabilSSM?: string | null
  functieResponsabilSSM?: string | null
  observatiiGenerale?: string | null
  documenteAplicabile?: string | null
  anexeSelectate?: string | null
  observatiiDocumente?: string | null
}

type DbRisc = {
  id: string
  ordine: number
  activitate?: string | null
  activitateCustom?: string | null
  pericol?: string | null
  pericolCustom?: string | null
  descrierePericol?: string | null
  persoaneExpuse?: string | null
  numarPersoaneExpuse?: number | null
  probabilitateInitiala?: number | null
  severitateInitiala?: number | null
  masuriExistente?: string | null
  masuriExistenteCustom?: string | null
  masuriSuplimentare?: string | null
  probabilitateReziduala?: number | null
  severitateReziduala?: number | null
  responsabilImplementare?: string | null
  functieResponsabil?: string | null
  termenImplementare?: string | null
  statusRisc: string
}

// ─── label maps (built from constants — single source of truth) ──────────────

const ALL_MASURI = [
  ...MASURI_MECANOFIZICE,
  ...MASURI_CONTROL_ACCES,
  ...MASURI_ALARMARE,
  ...MASURI_CCTV,
  ...PAZA_UMANA,
  ...MASURI_ORGANIZATORICE,
  ...MASURI_ASIGURARI,
]
const MASURI_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ALL_MASURI.map((m) => [m.value, m.label]),
)
const AMENINTARI_LABEL_MAP: Record<string, string> = Object.fromEntries(
  AMENINTARI.map((a) => [a.value, a.label]),
)
const DOCUMENTE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  DOCUMENTE_SUPORT.map((d) => [d.value, d.label]),
)
const CADRU_LEGAL_LABEL_MAP: Record<string, string> = Object.fromEntries(
  CADRU_LEGAL.map((a) => [a.value, a.label]),
)

const STATUS_LABEL: Record<string, string> = {
  deschis: 'Deschis',
  in_lucru: 'În lucru',
  inchis: 'Închis',
}

// ─── page / font constants ───────────────────────────────────────────────────

const FONT = 'Calibri'
const PAGE_WIDTH_DXA = 11906 - 2 * 1440 // usable width = 9026 DXA (A4 - left/right margins)

// ─── helpers ─────────────────────────────────────────────────────────────────

const parseJsonArray = (raw: string | null | undefined): string[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Return the human-readable string value, or null if empty. */
const val = (value: unknown): string | null => {
  if (value !== null && value !== undefined && String(value).trim()) return String(value).trim()
  return null
}

/** TextRun for [necompletat] placeholder. */
const necompletatRun = () =>
  new TextRun({ text: '[necompletat]', italics: true, color: '94A3B8', font: FONT, size: 22 })

/** Return a TextRun — normal if value is present, italic/gray [necompletat] if not. */
const valRun = (
  value: unknown,
  opts?: { size?: number; bold?: boolean; color?: string },
): TextRun => {
  const str = val(value)
  if (str) {
    return new TextRun({
      text: str,
      font: FONT,
      size: opts?.size ?? 22,
      bold: opts?.bold ?? false,
      color: opts?.color,
    })
  }
  return new TextRun({
    text: '[necompletat]',
    italics: true,
    color: '94A3B8',
    font: FONT,
    size: opts?.size ?? 22,
  })
}

/** Build a TextRun pair: bold label + value (or [necompletat]). */
const labelValueRuns = (label: string, value: unknown): TextRun[] => {
  const str = val(value)
  return [
    new TextRun({ text: `${label}: `, bold: true, font: FONT, size: 22 }),
    str ? new TextRun({ text: str, font: FONT, size: 22 }) : necompletatRun(),
  ]
}

/** Resolve a measure value key to its label. */
const resolveMasuraLabel = (v: string): string => MASURI_LABEL_MAP[v] ?? v

/** Resolve an AMENINTARI value key to its label. */
const resolveAmenintareLabel = (v: string): string => AMENINTARI_LABEL_MAP[v] ?? v

/** Strip # from hex for docx shading fill. */
const hexColor = (hex: string) => hex.replace('#', '')

/** Comma-separated labels from a JSON array of value keys. Returns null when empty (for necompletat rendering). */
const checkboxList = (
  raw: string | null | undefined,
  labelMap: Record<string, string>,
): string | null => {
  const arr = parseJsonArray(raw)
  if (!arr.length) return null
  return arr.map((v) => labelMap[v] ?? v).join(', ')
}

// ─── builder helpers ──────────────────────────────────────────────────────────

const BORDER_LIGHT = {
  top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
  left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
  right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
}

const BORDER_NONE = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
}

/** Chapter heading (Heading1) — page break before. */
const chapterTitle = (text: string) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    spacing: { before: 0, after: 200 },
  })

/** Sub-section heading (Heading2). */
const subTitle = (text: string) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
  })

/** Sub-sub-section heading (Heading3). */
const subSubTitle = (text: string) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
  })

/** Info row paragraph: bold label + value (or [necompletat]). */
const infoRow = (label: string, value: unknown) =>
  new Paragraph({
    children: labelValueRuns(label, value),
    spacing: { after: 80 },
  })

/** Plain body paragraph. */
const bodyParagraph = (text: string | null | undefined) =>
  new Paragraph({
    children: text?.trim()
      ? [new TextRun({ text: text.trim(), font: FONT, size: 22 })]
      : [necompletatRun()],
    spacing: { after: 80 },
  })

/** Italic info/warning box paragraph with orange background. */
const infoBox = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, italics: true, font: FONT, size: 22, color: '92400E' })],
    shading: { type: ShadingType.CLEAR, fill: 'FFF7ED', color: 'auto' },
    spacing: { before: 120, after: 120 },
    indent: { left: 240, right: 240 },
  })

/** Bullet item paragraph. */
const bulletItem = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 22 })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  })

/** Empty spacer paragraph. */
const spacer = (after = 120) => new Paragraph({ text: '', spacing: { after } })

/** Text paragraph inside a table cell. */
const cellText = (
  text: string | null | undefined,
  opts?: { bold?: boolean; color?: string; size?: number },
) =>
  new Paragraph({
    children: text?.trim()
      ? [
          new TextRun({
            text: text.trim(),
            font: FONT,
            size: opts?.size ?? 20,
            bold: opts?.bold ?? false,
            color: opts?.color,
          }),
        ]
      : [
          new TextRun({
            text: '[necompletat]',
            italics: true,
            color: '94A3B8',
            font: FONT,
            size: opts?.size ?? 20,
          }),
        ],
  })

/** Table cell builder with standard margins and border. */
const tableCell = (
  content: Paragraph | Paragraph[],
  opts?: {
    widthDxa?: number
    shading?: string
    columnSpan?: number
    borders?: typeof BORDER_LIGHT
    bold?: boolean
  },
) => {
  const children = Array.isArray(content) ? content : [content]
  return new TableCell({
    children,
    width: opts?.widthDxa ? { size: opts.widthDxa, type: WidthType.DXA } : undefined,
    columnSpan: opts?.columnSpan,
    shading: opts?.shading
      ? { type: ShadingType.CLEAR, fill: hexColor(opts.shading), color: 'auto' }
      : undefined,
    borders: opts?.borders ?? BORDER_LIGHT,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  })
}

// ─── header / footer ─────────────────────────────────────────────────────────

const buildHeader = (evaluare: DbEvaluare) =>
  new Header({
    children: [
      new Table({
        width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
        columnWidths: [5500, 3572],
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'RAPORT DE EVALUARE ȘI TRATARE A RISCURILOR',
                        bold: true,
                        font: FONT,
                        size: 20,
                        color: '1E40AF',
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [valRun(evaluare.denumireProiect, { size: 16, color: '555555' })],
                  }),
                ],
                borders: BORDER_NONE,
                width: { size: 5500, type: WidthType.DXA },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: `Nr. `,
                        font: FONT,
                        size: 16,
                        color: '555555',
                      }),
                      valRun(evaluare.codProiect, { size: 16, color: '555555' }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [valRun(evaluare.dataEvaluarii, { size: 16, color: '555555' })],
                  }),
                ],
                borders: BORDER_NONE,
                width: { size: 3572, type: WidthType.DXA },
              }),
            ],
          }),
        ],
      }),
    ],
  })

const buildFooter = () =>
  new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: 'Pagina ', font: FONT, size: 18, color: '94A3B8' }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: '94A3B8' }),
          new TextRun({ text: ' din ', font: FONT, size: 18, color: '94A3B8' }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            font: FONT,
            size: 18,
            color: '94A3B8',
          }),
        ],
      }),
    ],
  })

// ─── cover page ───────────────────────────────────────────────────────────────

const buildCoverPage = (evaluare: DbEvaluare): Paragraph[] => {
  const adresa = [
    evaluare.adresaLocatie,
    evaluare.localitate,
    evaluare.judet && `jud. ${evaluare.judet}`,
  ]
    .filter(Boolean)
    .join(', ')

  return [
    spacer(720),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'RAPORT DE EVALUARE ȘI TRATARE A RISCURILOR',
          bold: true,
          font: FONT,
          size: 36,
          color: '1E40AF',
        }),
      ],
      spacing: { after: 500 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'la securitatea fizică a obiectivului',
          font: FONT,
          size: 28,
        }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Conform Instrucțiunilor M.A.I. nr. 9/2013',
          italics: true,
          font: FONT,
          size: 24,
          color: '64748B',
        }),
      ],
      spacing: { after: 600 },
    }),
    spacer(200),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Unitate: ', bold: true, font: FONT, size: 26 }),
        valRun(evaluare.denumireProiect, { size: 26 }),
      ],
      spacing: { after: 160 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Adresa: ', bold: true, font: FONT, size: 22 }),
        adresa
          ? new TextRun({ text: adresa, font: FONT, size: 22 })
          : new TextRun({
              text: '[necompletat]',
              italics: true,
              color: '94A3B8',
              font: FONT,
              size: 22,
            }),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Data evaluării: ', bold: true, font: FONT, size: 22 }),
        valRun(evaluare.dataEvaluarii),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Evaluator: ', bold: true, font: FONT, size: 22 }),
        valRun(evaluare.numeEvaluator),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Firmă evaluatoare: ', bold: true, font: FONT, size: 22 }),
        valRun(evaluare.firmaEvaluator),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Nr. raport: ', bold: true, font: FONT, size: 22 }),
        valRun(evaluare.codProiect),
      ],
      spacing: { after: 120 },
    }),
  ]
}

// ─── CAPITOLUL I ─────────────────────────────────────────────────────────────

const buildCapitolul1 = (evaluare: DbEvaluare): (Paragraph | Table)[] => {
  const adresa = [
    evaluare.adresaLocatie,
    evaluare.localitate,
    evaluare.judet && `jud. ${evaluare.judet}`,
  ]
    .filter(Boolean)
    .join(', ')
  const obiectiveArr = parseJsonArray(evaluare.obiectiveEvaluare)
  const metodeArr = parseJsonArray(evaluare.metodeInstrumente)

  return [
    chapterTitle('CAPITOLUL I — NOMINALIZAREA UNITĂȚII ȘI SCOPUL EVALUĂRII'),
    subTitle('a) Date de identificare'),
    infoRow('Denumirea unității', evaluare.denumireProiect),
    infoRow('CUI / CIF', evaluare.cuiBeneficiar),
    infoRow('Adresă completă', adresa || null),
    infoRow('Firmă evaluatoare', evaluare.antreprenor),
    infoRow('CUI firmă evaluatoare', evaluare.cuiAntreprenor),
    ...(evaluare.subantreprenor ? [infoRow('Subcontractant', evaluare.subantreprenor)] : []),
    infoRow('Tip unitate', evaluare.fazaLucrariiCustom || evaluare.fazaLucrarii),
    spacer(120),

    subTitle('b) Tipul și scopul evaluării'),
    infoRow('Tip evaluare', evaluare.tipEvaluare),
    ...(obiectiveArr.length > 0
      ? [
          new Paragraph({
            children: [
              new TextRun({ text: 'Obiective evaluare:', bold: true, font: FONT, size: 22 }),
            ],
            spacing: { after: 60 },
          }),
          ...obiectiveArr.map((o) => bulletItem(o)),
        ]
      : [infoRow('Obiective evaluare', null)]),
    ...(metodeArr.length > 0
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Metode și instrumente de lucru:',
                bold: true,
                font: FONT,
                size: 22,
              }),
            ],
            spacing: { after: 60 },
          }),
          ...metodeArr.map((m) => bulletItem(m)),
        ]
      : [infoRow('Metode și instrumente', null)]),
    spacer(120),

    subTitle('c) Concluzie generală privind necesitatea evaluării'),
    infoBox(
      'Prezenta evaluare de risc la securitatea fizică a fost realizată în temeiul Instrucțiunilor ' +
        'M.A.I. nr. 9/2013 și are ca scop identificarea, analiza și tratarea riscurilor care pot ' +
        'afecta securitatea fizică a obiectivului, a persoanelor prezente și a bunurilor/valorilor deținute.',
    ),
    spacer(80),

    subTitle('d) Domeniu de aplicare acceptabil'),
    bodyParagraph(
      'Evaluarea se aplică tuturor zonelor funcționale ale obiectivului menționat, inclusiv perimetrul, ' +
        'punctele de acces, spațiile interioare și sistemele tehnice de securitate existente sau planificate.',
    ),
    spacer(80),

    subTitle('e) Opțiuni de tratare a riscurilor'),
    bulletItem(
      'Acceptarea riscului — pentru riscuri cu nivel scăzut și fezabilitate de reducere redusă.',
    ),
    bulletItem(
      'Reducerea riscului — prin implementarea măsurilor mecanofizice, organizatorice și tehnice recomandate.',
    ),
    bulletItem('Transferul riscului — prin contracte de asigurare pentru riscuri reziduale.'),
    bulletItem(
      'Evitarea riscului — prin modificarea proceselor sau activităților generatoare de risc ridicat.',
    ),
    spacer(80),

    subTitle('f) Măsuri obligatorii vs. recomandate'),
    infoBox(
      'IMPORTANT: Măsurile marcate ca obligatorii trebuie implementate în termenele specificate ' +
        'pentru respectarea cerințelor legale. Măsurile recomandate sporesc nivelul de securitate ' +
        'și sunt adresate conducătorului unității spre analiză și implementare prioritară.',
    ),
    spacer(80),

    subTitle('g) Situație sintetică'),
    bodyParagraph(
      'Situația sintetică a riscurilor identificate, nivelurile de risc inițial și rezidual, ' +
        'precum și măsurile propuse sunt detaliate în Capitolul IV și V ale prezentului raport.',
    ),
    spacer(80),

    subTitle('h) Termen de implementare'),
    infoRow('Termen global implementare măsuri', evaluare.termenImplementareGlobal),
    spacer(80),

    subTitle('i) Obligații legale'),
    bodyParagraph(
      'Conform Legii nr. 333/2003 (republicată), HG nr. 301/2012 și Instrucțiunilor M.A.I. nr. 9/2013, ' +
        'conducătorul unității are obligația de a implementa măsurile obligatorii rezultate din prezenta ' +
        'analiză de risc și de a reanaliza periodic securitatea fizică a obiectivului.',
    ),
    spacer(80),

    subTitle('j) Concluzie finală'),
    infoRow('Nivel risc global asumat', evaluare.nivelRiscGlobalAsumat),
    infoRow('Nivel risc rezidual global', evaluare.nivelRiscRezidualGlobal),
    ...(evaluare.concluziiGenerale ? [bodyParagraph(evaluare.concluziiGenerale)] : []),
  ]
}

// ─── CAPITOLUL II ────────────────────────────────────────────────────────────

const buildCapitolul2 = (evaluare: DbEvaluare): (Paragraph | Table)[] => {
  const zoneFunctionale = checkboxList(evaluare.cadruZoneFunctionale, {})
  const bunuriValori = checkboxList(evaluare.cadruBunuriValori, {})
  const sistemeTehnice = checkboxList(evaluare.cadruSistemeTehnice, {})

  return [
    chapterTitle('CAPITOLUL II — CADRUL ORGANIZAȚIONAL INTERN'),
    subTitle('a) Regim de activitate și program de lucru'),
    infoRow('Regim activitate', evaluare.cadruRegimActivitate),
    infoRow('Program de lucru', evaluare.cadruProgramLucru),
    infoRow('Număr angajați', evaluare.cadruNumarAngajati),
    spacer(80),

    subTitle('b) Flux persoane și bunuri'),
    infoRow('Flux persoane', evaluare.cadruFluxPersoane),
    infoRow('Flux bunuri / valori', evaluare.cadruFluxBunuri),
    spacer(80),

    subTitle('c) Zone funcționale'),
    bodyParagraph(zoneFunctionale),
    spacer(80),

    subTitle('d) Bunuri și valori deținute'),
    bodyParagraph(bunuriValori),
    spacer(80),

    subTitle('e) Sisteme tehnice existente'),
    bodyParagraph(sistemeTehnice),
    spacer(80),

    subTitle('f) Factori de vulnerabilitate'),
    ...(evaluare.cadruFactoriVulnerabilitate
      ? [bodyParagraph(evaluare.cadruFactoriVulnerabilitate)]
      : [new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } })]),
  ]
}

// ─── CAPITOLUL III ───────────────────────────────────────────────────────────

const buildCapitolul3 = (evaluare: DbEvaluare): (Paragraph | Table)[] => {
  const caiAccesLabels = checkboxList(evaluare.caiAcces, {})
  const vecinatatiBifateLabels = checkboxList(evaluare.vecinatatiBifate, {})

  return [
    chapterTitle('CAPITOLUL III — AMPLASARE ȘI FACTORI EXTERNI'),
    subTitle('a) Date generale de amplasare'),
    ...(evaluare.suprafataTotala
      ? [infoRow('Suprafață totală', `${evaluare.suprafataTotala} mp`)]
      : []),
    infoRow('Tip împrejmuire / zonă amplasare', evaluare.tipImprejmuire),
    infoRow('Accesibilitate', evaluare.tipAcces),
    infoRow('Număr puncte de acces', evaluare.numarPuncteAcces),
    infoRow('Căi de acces', caiAccesLabels),
    infoRow('Posibilitate disimulare / fugă', evaluare.posibilitateDisimulare),
    spacer(80),

    subTitle('b) Vecinătăți'),
    infoRow('Vecinătăți identificate', vecinatatiBifateLabels),
    infoRow('Nord', evaluare.vecinNord),
    infoRow('Est', evaluare.vecinEst),
    infoRow('Sud', evaluare.vecinSud),
    infoRow('Vest', evaluare.vecinVest),
    spacer(80),

    subTitle('c) Factori externi și istoric incidente'),
    ...(evaluare.factoriExterni
      ? [bodyParagraph(evaluare.factoriExterni)]
      : [new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } })]),
    ...(evaluare.istoricIncidente ? [infoRow('Istoric incidente', evaluare.istoricIncidente)] : []),
    spacer(80),

    subTitle('d) Descriere generală a amplasamentului'),
    ...(evaluare.descriereAmplasare
      ? [bodyParagraph(evaluare.descriereAmplasare)]
      : [new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } })]),
  ]
}

// ─── CAPITOLUL IV — per-risk analysis with 5×5 matrix ────────────────────────

const buildRiskMatrix5x5 = (prob: number, impact: number): Table => {
  const CELL_W = Math.floor(PAGE_WIDTH_DXA / 6)

  const headerRow = new TableRow({
    children: [
      tableCell(cellText('P \\ I', { bold: true, size: 18 }), {
        widthDxa: CELL_W,
        shading: '#F1F5F9',
      }),
      ...[1, 2, 3, 4, 5].map((i) =>
        tableCell(cellText(`I=${i}`, { bold: true, size: 18 }), {
          widthDxa: CELL_W,
          shading: '#F1F5F9',
        }),
      ),
    ],
  })

  const dataRows = [5, 4, 3, 2, 1].map(
    (p) =>
      new TableRow({
        children: [
          tableCell(cellText(`P=${p}`, { bold: true, size: 18 }), {
            widthDxa: CELL_W,
            shading: '#F1F5F9',
          }),
          ...[1, 2, 3, 4, 5].map((i) => {
            const score = MATRICE_RISC[5 - p][i - 1]
            const isSelected = p === prob && i === impact
            const bgColor = isSelected ? '#1E40AF' : (MATRICE_COLORS[score] ?? '#FFFFFF')
            return tableCell(
              cellText(isSelected ? `★ ${score}` : `${score}`, {
                bold: isSelected,
                color: isSelected ? 'FFFFFF' : '374151',
                size: 18,
              }),
              { widthDxa: CELL_W, shading: bgColor },
            )
          }),
        ],
      }),
  )

  return new Table({
    width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
    columnWidths: Array(6).fill(CELL_W),
    rows: [headerRow, ...dataRows],
  })
}

const buildMatrixLegend = (): Paragraph =>
  new Paragraph({
    children: [
      new TextRun({ text: '■ ', color: hexColor(NIVEL_RISC.scazut.bgColor), font: FONT, size: 18 }),
      new TextRun({ text: 'Scăzut (1–4)   ', font: FONT, size: 18, color: '374151' }),
      new TextRun({ text: '■ ', color: hexColor(NIVEL_RISC.mediu.bgColor), font: FONT, size: 18 }),
      new TextRun({ text: 'Mediu (5–12)   ', font: FONT, size: 18, color: '374151' }),
      new TextRun({
        text: '■ ',
        color: hexColor(NIVEL_RISC.ridicat.bgColor),
        font: FONT,
        size: 18,
      }),
      new TextRun({ text: 'Ridicat (13–25)   ', font: FONT, size: 18, color: '374151' }),
      new TextRun({ text: '★ ', bold: true, color: '1E40AF', font: FONT, size: 18 }),
      new TextRun({ text: 'Celula selectată', font: FONT, size: 18, color: '1E40AF' }),
    ],
    spacing: { before: 80, after: 160 },
  })

const buildRiscContent = (risc: DbRisc, index: number): (Paragraph | Table)[] => {
  const amenintare = risc.activitateCustom || resolveAmenintareLabel(risc.activitate || '')
  const persoaneArr = parseJsonArray(risc.persoaneExpuse)
  const masuriValues = parseJsonArray(risc.masuriExistente)
  const masuriLabels = masuriValues.map(resolveMasuraLabel)
  if (risc.masuriExistenteCustom) masuriLabels.push(risc.masuriExistenteCustom)

  const pInit = risc.probabilitateInitiala ?? 0
  const sInit = risc.severitateInitiala ?? 0
  const pRez = risc.probabilitateReziduala ?? 0
  const sRez = risc.severitateReziduala ?? 0
  const scoreInit = pInit * sInit
  const scoreRez = pRez * sRez
  const nivelInit = scoreInit > 0 ? getNivelRisc(scoreInit) : null
  const nivelRez = scoreRez > 0 ? getNivelRisc(scoreRez) : null

  const probInitLabel =
    pInit > 0 ? (SCALA_PROBABILITATE[pInit - 1]?.label ?? `${pInit}`) : '[necompletat]'
  const impactInitLabel =
    sInit > 0 ? (SCALA_IMPACT[sInit - 1]?.label ?? `${sInit}`) : '[necompletat]'
  const probRezLabel =
    pRez > 0 ? (SCALA_PROBABILITATE[pRez - 1]?.label ?? `${pRez}`) : '[necompletat]'
  const impactRezLabel = sRez > 0 ? (SCALA_IMPACT[sRez - 1]?.label ?? `${sRez}`) : '[necompletat]'

  const W1 = 2500
  const W2 = PAGE_WIDTH_DXA - W1

  return [
    subSubTitle(`${index}. ${amenintare}`),
    new Table({
      width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
      columnWidths: [W1, W2],
      rows: [
        new TableRow({
          children: [
            tableCell(cellText('Tip amenințare', { bold: true }), {
              widthDxa: W1,
              shading: '#EEF2FF',
            }),
            tableCell(cellText(amenintare), { widthDxa: W2 }),
          ],
        }),
        ...(risc.pericolCustom || risc.pericol
          ? [
              new TableRow({
                children: [
                  tableCell(cellText('Pericol identificat', { bold: true }), {
                    widthDxa: W1,
                    shading: '#EEF2FF',
                  }),
                  tableCell(cellText(risc.pericolCustom || risc.pericol || ''), { widthDxa: W2 }),
                ],
              }),
            ]
          : []),
        ...(risc.descrierePericol
          ? [
              new TableRow({
                children: [
                  tableCell(cellText('Descriere pericol', { bold: true }), {
                    widthDxa: W1,
                    shading: '#EEF2FF',
                  }),
                  tableCell(cellText(risc.descrierePericol), { widthDxa: W2 }),
                ],
              }),
            ]
          : []),
        new TableRow({
          children: [
            tableCell(cellText('Persoane expuse', { bold: true }), {
              widthDxa: W1,
              shading: '#EEF2FF',
            }),
            tableCell(
              cellText(
                persoaneArr.length > 0
                  ? persoaneArr.join(', ')
                  : risc.numarPersoaneExpuse !== null
                    ? `${risc.numarPersoaneExpuse} persoane`
                    : null,
              ),
              { widthDxa: W2 },
            ),
          ],
        }),
      ],
    }),
    spacer(80),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Matricea riscului inițial (P × I):',
          bold: true,
          font: FONT,
          size: 20,
        }),
      ],
      spacing: { before: 120, after: 80 },
    }),
    ...(pInit > 0 && sInit > 0
      ? [buildRiskMatrix5x5(pInit, sInit), buildMatrixLegend()]
      : [new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } })]),
    new Table({
      width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
      columnWidths: [W1, W2],
      rows: [
        new TableRow({
          children: [
            tableCell(cellText('Risc inițial', { bold: true }), {
              widthDxa: W1,
              shading: nivelInit?.bgColor ?? '#F8FAFC',
            }),
            tableCell(
              cellText(
                scoreInit > 0
                  ? `P=${pInit} (${probInitLabel}) × I=${sInit} (${impactInitLabel}) = ${scoreInit} — ${nivelInit?.label ?? ''}`
                  : '[necompletat]',
                { bold: scoreInit > 0 },
              ),
              { widthDxa: W2, shading: nivelInit?.bgColor ?? '#F8FAFC' },
            ),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('Măsuri existente', { bold: true }), { widthDxa: W1 }),
            tableCell(
              cellText(masuriLabels.length > 0 ? masuriLabels.join(';\n') : '[necompletat]'),
              { widthDxa: W2 },
            ),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('Risc rezidual', { bold: true }), {
              widthDxa: W1,
              shading: nivelRez?.bgColor ?? '#F8FAFC',
            }),
            tableCell(
              cellText(
                scoreRez > 0
                  ? `P=${pRez} (${probRezLabel}) × I=${sRez} (${impactRezLabel}) = ${scoreRez} — ${nivelRez?.label ?? ''}`
                  : '[necompletat]',
                { bold: scoreRez > 0 },
              ),
              { widthDxa: W2, shading: nivelRez?.bgColor ?? '#F8FAFC' },
            ),
          ],
        }),
        ...(risc.masuriSuplimentare
          ? [
              new TableRow({
                children: [
                  tableCell(cellText('Măsuri suplimentare propuse', { bold: true }), {
                    widthDxa: W1,
                  }),
                  tableCell(cellText(risc.masuriSuplimentare), { widthDxa: W2 }),
                ],
              }),
            ]
          : []),
        new TableRow({
          children: [
            tableCell(cellText('Responsabil / Funcție', { bold: true }), { widthDxa: W1 }),
            tableCell(
              cellText(
                [
                  risc.responsabilImplementare,
                  risc.functieResponsabil ? `(${risc.functieResponsabil})` : null,
                ]
                  .filter(Boolean)
                  .join(' ') || null,
              ),
              { widthDxa: W2 },
            ),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('Termen implementare', { bold: true }), { widthDxa: W1 }),
            tableCell(cellText(risc.termenImplementare), { widthDxa: W2 }),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('Status risc', { bold: true }), { widthDxa: W1 }),
            tableCell(cellText(STATUS_LABEL[risc.statusRisc] ?? risc.statusRisc), { widthDxa: W2 }),
          ],
        }),
      ],
    }),
    spacer(200),
  ]
}

const buildCapitolul4 = (_evaluare: DbEvaluare, riscuri: DbRisc[]): (Paragraph | Table)[] => {
  const sorted = [...riscuri].sort((a, b) => a.ordine - b.ordine)

  // Build dominant threats list
  const amenintariCount: Record<string, number> = {}
  for (const r of sorted) {
    const key = r.activitateCustom || resolveAmenintareLabel(r.activitate || 'Neidentificat')
    amenintariCount[key] = (amenintariCount[key] ?? 0) + 1
  }
  const dominante = Object.entries(amenintariCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, cnt]) => `${k} (${cnt} risc${cnt > 1 ? 'uri' : ''})`)

  const riscuriRidicate = sorted.filter((r) => {
    const s = (r.probabilitateInitiala ?? 0) * (r.severitateInitiala ?? 0)
    return s >= 13
  }).length
  const riscuriMedii = sorted.filter((r) => {
    const s = (r.probabilitateInitiala ?? 0) * (r.severitateInitiala ?? 0)
    return s >= 5 && s < 13
  }).length
  const riscuriScazute = sorted.filter((r) => {
    const s = (r.probabilitateInitiala ?? 0) * (r.severitateInitiala ?? 0)
    return s > 0 && s < 5
  }).length

  return [
    chapterTitle('CAPITOLUL IV — ANALIZA AMENINȚĂRILOR ȘI RISCURILOR DE SECURITATE FIZICĂ'),
    subTitle('a) Sinteza amenințărilor identificate'),
    new Paragraph({
      children: [
        new TextRun({ text: `Total amenințări analizate: `, bold: true, font: FONT, size: 22 }),
        new TextRun({ text: `${sorted.length}`, font: FONT, size: 22 }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Distribuție pe niveluri de risc (inițial): ',
          bold: true,
          font: FONT,
          size: 22,
        }),
        new TextRun({
          text: `Ridicat: ${riscuriRidicate}  |  Mediu: ${riscuriMedii}  |  Scăzut: ${riscuriScazute}`,
          font: FONT,
          size: 22,
        }),
      ],
      spacing: { after: 80 },
    }),
    ...(dominante.length > 0
      ? [
          new Paragraph({
            children: [
              new TextRun({ text: 'Amenințări dominante:', bold: true, font: FONT, size: 22 }),
            ],
            spacing: { after: 60 },
          }),
          ...dominante.map((d) => bulletItem(d)),
        ]
      : []),
    spacer(120),
    subTitle('b) Analiza detaliată a fiecărei amenințări'),
    ...(sorted.length > 0
      ? sorted.flatMap((r, i) => buildRiscContent(r, i + 1))
      : [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Nu au fost identificate amenințări.',
                italics: true,
                font: FONT,
                size: 22,
              }),
            ],
            spacing: { after: 80 },
          }),
        ]),
  ]
}

// ─── CAPITOLUL V — risk summary matrix ───────────────────────────────────────

const buildCapitolul5 = (riscuri: DbRisc[]): (Paragraph | Table)[] => {
  const CELL_W = Math.floor(PAGE_WIDTH_DXA / 6)

  const counts: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0))
  for (const r of riscuri) {
    if (r.probabilitateInitiala && r.severitateInitiala) {
      counts[5 - r.probabilitateInitiala][r.severitateInitiala - 1]++
    }
  }

  const headerRow = new TableRow({
    children: [
      tableCell(cellText('P \\ I', { bold: true }), { widthDxa: CELL_W, shading: '#F1F5F9' }),
      ...[1, 2, 3, 4, 5].map((i) =>
        tableCell(cellText(`I=${i}`, { bold: true }), { widthDxa: CELL_W, shading: '#F1F5F9' }),
      ),
    ],
  })

  const dataRows = [5, 4, 3, 2, 1].map(
    (p, rowIdx) =>
      new TableRow({
        children: [
          tableCell(cellText(`P=${p}`, { bold: true }), { widthDxa: CELL_W, shading: '#F1F5F9' }),
          ...[0, 1, 2, 3, 4].map((colIdx) => {
            const score = MATRICE_RISC[5 - p][colIdx]
            const count = counts[rowIdx][colIdx]
            const bgColor = MATRICE_COLORS[score] ?? '#FFFFFF'
            return tableCell(cellText(count > 0 ? `${count}` : '', { bold: count > 0, size: 20 }), {
              widthDxa: CELL_W,
              shading: bgColor,
            })
          }),
        ],
      }),
  )

  // Summary table of all risks
  const W_NR = 400
  const W_THREAT = 2600
  const W_INIT = 1600
  const W_REZ = 1600
  const W_STATUS = PAGE_WIDTH_DXA - W_NR - W_THREAT - W_INIT - W_REZ

  const sortedRiscuri = [...riscuri].sort((a, b) => a.ordine - b.ordine)

  const summaryRows = sortedRiscuri.map((r, i) => {
    const amenintare = r.activitateCustom || resolveAmenintareLabel(r.activitate || '')
    const scoreInit = (r.probabilitateInitiala ?? 0) * (r.severitateInitiala ?? 0)
    const scoreRez = (r.probabilitateReziduala ?? 0) * (r.severitateReziduala ?? 0)
    const nivelInit = scoreInit > 0 ? getNivelRisc(scoreInit) : null
    const nivelRez = scoreRez > 0 ? getNivelRisc(scoreRez) : null
    return new TableRow({
      children: [
        tableCell(cellText(`${i + 1}`, { size: 18 }), { widthDxa: W_NR }),
        tableCell(cellText(amenintare, { size: 18 }), { widthDxa: W_THREAT }),
        tableCell(
          cellText(scoreInit > 0 ? `${scoreInit} — ${nivelInit?.label ?? ''}` : '[necompletat]', {
            size: 18,
          }),
          { widthDxa: W_INIT, shading: nivelInit?.bgColor },
        ),
        tableCell(
          cellText(scoreRez > 0 ? `${scoreRez} — ${nivelRez?.label ?? ''}` : '[necompletat]', {
            size: 18,
          }),
          { widthDxa: W_REZ, shading: nivelRez?.bgColor },
        ),
        tableCell(cellText(STATUS_LABEL[r.statusRisc] ?? r.statusRisc, { size: 18 }), {
          widthDxa: W_STATUS,
        }),
      ],
    })
  })

  return [
    chapterTitle('CAPITOLUL V — NIVELUL DE RISC ȘI MATRICEA RISCURILOR'),
    subTitle('a) Matricea de risc sumar (nr. amenințări inițiale per celulă)'),
    new Table({
      width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
      columnWidths: Array(6).fill(CELL_W),
      rows: [headerRow, ...dataRows],
    }),
    spacer(120),
    new Paragraph({
      children: [
        new TextRun({
          text: '■ ',
          color: hexColor(NIVEL_RISC.scazut.bgColor),
          font: FONT,
          size: 20,
        }),
        new TextRun({ text: 'Scăzut (1–4)   ', font: FONT, size: 20 }),
        new TextRun({
          text: '■ ',
          color: hexColor(NIVEL_RISC.mediu.bgColor),
          font: FONT,
          size: 20,
        }),
        new TextRun({ text: 'Mediu (5–12)   ', font: FONT, size: 20 }),
        new TextRun({
          text: '■ ',
          color: hexColor(NIVEL_RISC.ridicat.bgColor),
          font: FONT,
          size: 20,
        }),
        new TextRun({ text: 'Ridicat (13–25)', font: FONT, size: 20 }),
      ],
      spacing: { after: 200 },
    }),
    subTitle('b) Situație sintetică a tuturor amenințărilor'),
    ...(sortedRiscuri.length > 0
      ? [
          new Table({
            width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
            columnWidths: [W_NR, W_THREAT, W_INIT, W_REZ, W_STATUS],
            rows: [
              new TableRow({
                children: [
                  tableCell(cellText('Nr.', { bold: true, size: 18, color: 'FFFFFF' }), {
                    widthDxa: W_NR,
                    shading: '#1E40AF',
                  }),
                  tableCell(cellText('Amenințare', { bold: true, size: 18, color: 'FFFFFF' }), {
                    widthDxa: W_THREAT,
                    shading: '#1E40AF',
                  }),
                  tableCell(cellText('Risc inițial', { bold: true, size: 18, color: 'FFFFFF' }), {
                    widthDxa: W_INIT,
                    shading: '#1E40AF',
                  }),
                  tableCell(cellText('Risc rezidual', { bold: true, size: 18, color: 'FFFFFF' }), {
                    widthDxa: W_REZ,
                    shading: '#1E40AF',
                  }),
                  tableCell(cellText('Status', { bold: true, size: 18, color: 'FFFFFF' }), {
                    widthDxa: W_STATUS,
                    shading: '#1E40AF',
                  }),
                ],
              }),
              ...summaryRows,
            ],
          }),
        ]
      : [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Nu au fost înregistrate amenințări.',
                italics: true,
                font: FONT,
                size: 22,
              }),
            ],
            spacing: { after: 80 },
          }),
        ]),
  ]
}

// ─── CAPITOLUL VI ────────────────────────────────────────────────────────────

const buildCapitolul6 = (evaluare: DbEvaluare, riscuri: DbRisc[]): (Paragraph | Table)[] => {
  const mecanofiziceArr = parseJsonArray(evaluare.masuriMecanofizice)
  const controlAccesArr = parseJsonArray(evaluare.masuriControlAcces)
  const alarmareArr = parseJsonArray(evaluare.masuriAlarmare)
  const cctvArr = parseJsonArray(evaluare.masuriCctv)
  const pazaArr = parseJsonArray(evaluare.pazaUmana)
  const organizatoriceArr = parseJsonArray(evaluare.masuriOrganizatorice)
  const asigurariArr = parseJsonArray(evaluare.masuriAsigurari)

  const mecanofiziceLabelMap = Object.fromEntries(
    MASURI_MECANOFIZICE.map((m) => [m.value, m.label]),
  )
  const controlAccesLabelMap = Object.fromEntries(
    MASURI_CONTROL_ACCES.map((m) => [m.value, m.label]),
  )
  const alarmareLabelMap = Object.fromEntries(MASURI_ALARMARE.map((m) => [m.value, m.label]))
  const cctvLabelMap = Object.fromEntries(MASURI_CCTV.map((m) => [m.value, m.label]))
  const pazaLabelMap = Object.fromEntries(PAZA_UMANA.map((m) => [m.value, m.label]))
  const organizatoriceLabelMap = Object.fromEntries(
    MASURI_ORGANIZATORICE.map((m) => [m.value, m.label]),
  )
  const asigurariLabelMap = Object.fromEntries(MASURI_ASIGURARI.map((m) => [m.value, m.label]))

  // Collect all supplementary measures from risks, using sorted ordine-based index (consistent with Cap. IV)
  const sortedRiscuriForMasuri = [...riscuri].sort((a, b) => a.ordine - b.ordine)
  const masuriSuplimentareAll = sortedRiscuriForMasuri
    .map((r, i) => (r.masuriSuplimentare ? `Amenințare ${i + 1}: ${r.masuriSuplimentare}` : null))
    .filter((x): x is string => x !== null)

  const buildMasuriSection = (
    heading: string,
    arr: string[],
    labelMap: Record<string, string>,
  ): (Paragraph | Table)[] => {
    if (arr.length === 0)
      return [
        subSubTitle(heading),
        new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } }),
      ]
    return [subSubTitle(heading), ...arr.map((v) => bulletItem(labelMap[v] ?? v))]
  }

  return [
    chapterTitle('CAPITOLUL VI — MĂSURI ȘI MECANISME DE SECURITATE'),
    subTitle('a) Măsuri mecanofizice de protecție'),
    ...buildMasuriSection('a.1) Sisteme mecanofizice', mecanofiziceArr, mecanofiziceLabelMap),
    ...buildMasuriSection('a.2) Sisteme de control acces', controlAccesArr, controlAccesLabelMap),
    spacer(80),

    subTitle('b) Sisteme electronice de securitate'),
    ...buildMasuriSection('b.1) Sisteme de alarmare', alarmareArr, alarmareLabelMap),
    ...buildMasuriSection('b.2) Sisteme CCTV', cctvArr, cctvLabelMap),
    spacer(80),

    subTitle('c) Paza umană'),
    ...buildMasuriSection('c.1) Paza umană', pazaArr, pazaLabelMap),
    ...(evaluare.numarAgenti != null
      ? [infoRow('Număr agenți de securitate', evaluare.numarAgenti)]
      : []),
    spacer(80),

    subTitle('d) Măsuri organizatorice'),
    ...buildMasuriSection(
      'd.1) Proceduri și măsuri organizatorice',
      organizatoriceArr,
      organizatoriceLabelMap,
    ),
    spacer(80),

    subTitle('e) Asigurări'),
    ...buildMasuriSection('e.1) Polițe de asigurare', asigurariArr, asigurariLabelMap),
    spacer(80),

    ...(masuriSuplimentareAll.length > 0
      ? [
          subTitle('f) Măsuri suplimentare propuse (rezultate din analiza riscurilor)'),
          ...masuriSuplimentareAll.map((m) => bulletItem(m)),
        ]
      : []),

    ...(evaluare.observatiiMasuri
      ? [subTitle('g) Observații'), bodyParagraph(evaluare.observatiiMasuri)]
      : []),
  ]
}

// ─── CAPITOLUL VII ───────────────────────────────────────────────────────────

const buildCapitolul7 = (evaluare: DbEvaluare): (Paragraph | Table)[] => {
  const W1 = 3000
  const W2 = PAGE_WIDTH_DXA - W1

  return [
    chapterTitle('CAPITOLUL VII — CONCLUZII ȘI RECOMANDĂRI'),
    subTitle('a) Nivelul de risc global'),
    new Table({
      width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
      columnWidths: [W1, W2],
      rows: [
        new TableRow({
          children: [
            tableCell(cellText('Nivel risc global asumat', { bold: true }), {
              widthDxa: W1,
              shading: '#EFF6FF',
            }),
            tableCell(cellText(evaluare.nivelRiscGlobalAsumat), { widthDxa: W2 }),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('Nivel risc rezidual global', { bold: true }), {
              widthDxa: W1,
              shading: '#EFF6FF',
            }),
            tableCell(cellText(evaluare.nivelRiscRezidualGlobal), { widthDxa: W2 }),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('Termen global implementare', { bold: true }), {
              widthDxa: W1,
              shading: '#EFF6FF',
            }),
            tableCell(cellText(evaluare.termenImplementareGlobal), { widthDxa: W2 }),
          ],
        }),
      ],
    }),
    spacer(120),

    subTitle('b) Concluzii generale'),
    ...(evaluare.concluziiGenerale
      ? [bodyParagraph(evaluare.concluziiGenerale)]
      : [new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } })]),
    spacer(80),

    subTitle('c) Măsuri obligatorii'),
    infoBox(
      'Măsurile de mai jos sunt OBLIGATORII conform prevederilor legale în vigoare și trebuie ' +
        'implementate în termenele stabilite.',
    ),
    ...(evaluare.masuriObligatorii
      ? evaluare.masuriObligatorii
          .split('\n')
          .filter(Boolean)
          .map((m) => bulletItem(m))
      : [new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } })]),
    spacer(80),

    subTitle('d) Măsuri recomandate'),
    ...(evaluare.masuriRecomandate
      ? evaluare.masuriRecomandate
          .split('\n')
          .filter(Boolean)
          .map((m) => bulletItem(m))
      : [new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } })]),
    spacer(80),

    ...(evaluare.observatiiGenerale
      ? [subTitle('e) Observații'), bodyParagraph(evaluare.observatiiGenerale)]
      : []),
  ]
}

// ─── CAPITOLUL IX ────────────────────────────────────────────────────────────

const buildCapitolul9 = (evaluare: DbEvaluare): (Paragraph | Table)[] => {
  const docValues = parseJsonArray(evaluare.documenteAplicabile)
  const resolveDocLabel = (v: string) => DOCUMENTE_LABEL_MAP[v] ?? v

  return [
    chapterTitle('CAPITOLUL IX — DOCUMENTE SUPORT'),
    subTitle('a) Documente utilizate în evaluare'),
    ...(docValues.length > 0
      ? docValues.map((v) => bulletItem(resolveDocLabel(v)))
      : [new Paragraph({ children: [necompletatRun()], spacing: { after: 80 } })]),
    spacer(80),

    ...(evaluare.observatiiDocumente
      ? [subTitle('b) Observații'), bodyParagraph(evaluare.observatiiDocumente)]
      : []),
  ]
}

// ─── BLOC DE ASUMARE ȘI SEMNARE ──────────────────────────────────────────────

const buildSignatureBlock = (evaluare: DbEvaluare): (Paragraph | Table)[] => {
  const signatureCell = (rows: Paragraph[]) =>
    new TableCell({
      children: rows,
      borders: BORDER_LIGHT,
      margins: { top: 120, bottom: 120, left: 180, right: 180 },
    })

  const signatureLine = () =>
    new Paragraph({
      children: [
        new TextRun({ text: 'Semnătură: _________________________', font: FONT, size: 22 }),
      ],
      spacing: { after: 80 },
    })

  const W3 = Math.floor(PAGE_WIDTH_DXA / 3)

  return [
    new Paragraph({
      text: 'BLOC DE ASUMARE ȘI SEMNARE',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      spacing: { before: 0, after: 200 },
    }),
    infoBox(
      'Prin semnarea prezentului document, fiecare parte confirmă că a luat cunoștință de conținutul ' +
        'raportului de evaluare a riscurilor la securitatea fizică și se angajează la implementarea ' +
        'măsurilor ce îi revin conform responsabilităților atribuite.',
    ),
    spacer(200),
    new Table({
      width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
      columnWidths: [W3, W3, W3],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 8, color: '1E40AF' },
        bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E40AF' },
        left: { style: BorderStyle.SINGLE, size: 8, color: '1E40AF' },
        right: { style: BorderStyle.SINGLE, size: 8, color: '1E40AF' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      },
      rows: [
        // Header row
        new TableRow({
          children: [
            signatureCell([
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'EVALUATOR',
                    bold: true,
                    font: FONT,
                    size: 24,
                    color: '1E40AF',
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
              }),
            ]),
            signatureCell([
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'CONDUCĂTOR UNITATE',
                    bold: true,
                    font: FONT,
                    size: 24,
                    color: '1E40AF',
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
              }),
            ]),
            signatureCell([
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'RESPONSABIL SECURITATE FIZICĂ',
                    bold: true,
                    font: FONT,
                    size: 20,
                    color: '1E40AF',
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
              }),
            ]),
          ],
        }),
        // Data rows
        new TableRow({
          children: [
            signatureCell([
              infoRow('Nume', evaluare.numeEvaluator),
              signatureLine(),
              infoRow('Funcție', evaluare.functieEvaluator),
              infoRow('Firmă', evaluare.firmaEvaluator),
              infoRow('Data', evaluare.dataEvaluarii),
            ]),
            signatureCell([
              infoRow('Nume', evaluare.sefSantier),
              signatureLine(),
              infoRow('Funcție', evaluare.functieSefSantier),
              infoRow('Data asumării', evaluare.dataAprobarii),
            ]),
            signatureCell([
              infoRow('Nume', evaluare.responsabilSSM),
              signatureLine(),
              infoRow('Funcție', evaluare.functieResponsabilSSM),
            ]),
          ],
        }),
      ],
    }),
    spacer(200),
  ]
}

// ─── CADRU LEGAL appendix ─────────────────────────────────────────────────────

const buildCadruLegal = (evaluare: DbEvaluare): (Paragraph | Table)[] => {
  const cadruLegalValues = parseJsonArray(evaluare.anexeSelectate)
  const resolveCadruLegalLabel = (v: string) => CADRU_LEGAL_LABEL_MAP[v] ?? v

  return [
    chapterTitle('ANEXĂ — CADRU LEGAL APLICABIL'),
    bodyParagraph(
      'Prezenta evaluare a fost efectuată cu respectarea prevederilor actelor normative enumerate mai jos, ' +
        'care constituie cadrul legal obligatoriu pentru efectuarea analizelor de risc la securitatea fizică:',
    ),
    spacer(80),
    ...(cadruLegalValues.length > 0
      ? cadruLegalValues.map((v) => bulletItem(resolveCadruLegalLabel(v)))
      : CADRU_LEGAL.filter((c) => c.checked).map((c) => bulletItem(c.label))),
  ]
}

// ─── main export ──────────────────────────────────────────────────────────────

export const generateEvaluareDocx = async (
  evaluare: DbEvaluare,
  riscuri: DbRisc[],
): Promise<Buffer> => {
  const sortedRiscuri = [...riscuri].sort((a, b) => a.ordine - b.ordine)

  const pageProps = {
    size: { width: 11906, height: 16838 },
    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 22 },
        },
        heading1: {
          run: { font: FONT, size: 32, bold: true, color: '2E74B5' },
          paragraph: { spacing: { before: 0, after: 200 } },
        },
        heading2: {
          run: { font: FONT, size: 26, bold: true, color: '2E74B5' },
          paragraph: { spacing: { before: 280, after: 120 } },
        },
        heading3: {
          run: { font: FONT, size: 24, bold: true, color: '1F4D78' },
          paragraph: { spacing: { before: 200, after: 80 } },
        },
      },
    },
    sections: [
      // ── Section 1: Cover page (no header) ───────────────────────────────
      {
        properties: { page: pageProps },
        children: buildCoverPage(evaluare),
      },
      // ── Section 2: TOC + all chapters ────────────────────────────────────
      {
        properties: { page: pageProps },
        headers: { default: buildHeader(evaluare) },
        footers: { default: buildFooter() },
        children: [
          // Table of Contents
          new Paragraph({
            text: 'CUPRINS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 0, after: 200 },
          }),
          new TableOfContents('Cuprins', {
            hyperlink: true,
            headingStyleRange: '1-3',
          }),
          infoBox(
            'Pentru actualizarea numerelor de pagină, deschideți în Microsoft Word → ' +
              'Click dreapta pe cuprins → Update Field → Update entire table.',
          ),
          spacer(400),

          // Chapters
          ...buildCapitolul1(evaluare),
          ...buildCapitolul2(evaluare),
          ...buildCapitolul3(evaluare),
          ...buildCapitolul4(evaluare, sortedRiscuri),
          ...buildCapitolul5(sortedRiscuri),
          ...buildCapitolul6(evaluare, sortedRiscuri),
          ...buildCapitolul7(evaluare),
          // CAPITOLUL VIII — costs — intentionally omitted
          ...buildCapitolul9(evaluare),
          ...buildSignatureBlock(evaluare),
          ...buildCadruLegal(evaluare),
        ],
      },
    ],
  })

  return Packer.toBuffer(doc)
}
