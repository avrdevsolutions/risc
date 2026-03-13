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
  TableRow,
  TextRun,
  WidthType,
} from 'docx'

import {
  ACTIVITATI,
  ANEXE_EVALUARE,
  DOCUMENTE_SSM,
  MASURI_COLECTIVE,
  MASURI_EIP,
  MASURI_ORGANIZATORICE,
  NIVEL_RISC,
  PERICOLE,
  getNivelRisc,
} from './constants'

// ─── types ───────────────────────────────────────────────────────────────────

type DbEvaluare = {
  id: string
  codProiect?: string | null
  nrDocument?: string | null
  denumireProiect?: string | null
  beneficiar?: string | null
  antreprenor?: string | null
  subantreprenor?: string | null
  adresaLocatie?: string | null
  localitate?: string | null
  judet?: string | null
  fazaLucrarii?: string | null
  fazaLucrariiCustom?: string | null
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
  vecinNord?: string | null
  vecinEst?: string | null
  vecinSud?: string | null
  vecinVest?: string | null
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

const ALL_MASURI = [...MASURI_EIP, ...MASURI_COLECTIVE, ...MASURI_ORGANIZATORICE]
const MASURI_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ALL_MASURI.map((m) => [m.value, m.label]),
)
const ACTIVITATI_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ACTIVITATI.map((a) => [a.value, a.label]),
)
const PERICOLE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  PERICOLE.map((p) => [p.value, p.label]),
)
const DOCUMENTE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  DOCUMENTE_SSM.map((d) => [d.value, d.label]),
)
const ANEXE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ANEXE_EVALUARE.map((a) => [a.value, a.label]),
)

const STATUS_LABEL: Record<string, string> = {
  deschis: 'Deschis',
  in_lucru: 'În lucru',
  inchis: 'Închis',
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const parseJsonArray = (val: string | null | undefined): string[] => {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Resolve a measure value key to its human-readable label. Falls back to the raw value. */
const resolveMasuraLabel = (value: string): string => MASURI_LABEL_MAP[value] ?? value

/** Resolve an ACTIVITATI value key to its label. Falls back to the raw value. */
const resolveActivitateLabel = (value: string): string => ACTIVITATI_LABEL_MAP[value] ?? value

/** Resolve a PERICOLE value key to its label. Falls back to the raw value. */
const resolvePericolLabel = (value: string): string => PERICOLE_LABEL_MAP[value] ?? value

// Strip hex # prefix for docx shading fill
const hexColor = (hex: string) => hex.replace('#', '')

// ─── builder helpers ──────────────────────────────────────────────────────────

const BORDER_LIGHT = {
  top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
}

const sectionTitle = (text: string) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
  })

const infoRow = (label: string, value: string | null | undefined) =>
  new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, font: 'Arial', size: 22 }),
      new TextRun({ text: value || '—', font: 'Arial', size: 22 }),
    ],
    spacing: { after: 60 },
  })

const bodyParagraph = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text: text || '—', font: 'Arial', size: 22 })],
    spacing: { after: 80 },
  })

const cellText = (text: string, opts?: { bold?: boolean; color?: string }) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        font: 'Arial',
        size: 20,
        bold: opts?.bold ?? false,
        color: opts?.color,
      }),
    ],
  })

const tableCell = (
  content: Paragraph | Paragraph[],
  opts?: { widthDxa?: number; shading?: string; columnSpan?: number },
) => {
  const children = Array.isArray(content) ? content : [content]
  return new TableCell({
    children,
    width: opts?.widthDxa ? { size: opts.widthDxa, type: WidthType.DXA } : undefined,
    columnSpan: opts?.columnSpan,
    shading: opts?.shading
      ? { type: ShadingType.CLEAR, fill: hexColor(opts.shading), color: 'auto' }
      : undefined,
    borders: BORDER_LIGHT,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
  })
}

// ─── document sections ────────────────────────────────────────────────────────

const buildHeader = (evaluare: DbEvaluare) =>
  new Header({
    children: [
      new Table({
        width: { size: 9072, type: WidthType.DXA },
        columnWidths: [5500, 3572],
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CCCCCC' },
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
                        text: 'EVALUARE DE RISC SSM',
                        bold: true,
                        font: 'Arial',
                        size: 22,
                        color: '1e3a5f',
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: evaluare.denumireProiect || 'Fără denumire',
                        font: 'Arial',
                        size: 18,
                        color: '555555',
                      }),
                    ],
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
                width: { size: 5500, type: WidthType.DXA },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: `Nr. doc: ${evaluare.nrDocument || evaluare.id.slice(0, 8)}`,
                        font: 'Arial',
                        size: 18,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: `Data: ${evaluare.dataEvaluarii || '—'}`,
                        font: 'Arial',
                        size: 18,
                      }),
                    ],
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
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
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'Pagina ', font: 'Arial', size: 18, color: '888888' }),
          new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: '888888' }),
          new TextRun({ text: ' din ', font: 'Arial', size: 18, color: '888888' }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: '888888' }),
        ],
      }),
    ],
  })

const buildInfoGenerale = (evaluare: DbEvaluare): Paragraph[] => {
  const adresa = [evaluare.adresaLocatie, evaluare.localitate, evaluare.judet]
    .filter(Boolean)
    .join(', ')
  return [
    sectionTitle('1. INFORMAȚII GENERALE'),
    infoRow('Denumire proiect', evaluare.denumireProiect),
    infoRow('Cod proiect', evaluare.codProiect),
    infoRow('Beneficiar', evaluare.beneficiar),
    infoRow('Antreprenor', evaluare.antreprenor),
    ...(evaluare.subantreprenor ? [infoRow('Subantreprenor', evaluare.subantreprenor)] : []),
    infoRow('Adresă locație', adresa || null),
    infoRow(
      'Faza lucrării',
      evaluare.fazaLucrariiCustom || evaluare.fazaLucrarii,
    ),
  ]
}

const buildDateEvaluare = (evaluare: DbEvaluare): Paragraph[] => [
  sectionTitle('2. DATE EVALUARE'),
  infoRow('Evaluator', evaluare.numeEvaluator),
  infoRow('Funcție evaluator', evaluare.functieEvaluator),
  infoRow('Firmă evaluator', evaluare.firmaEvaluator),
  infoRow('Data evaluării', evaluare.dataEvaluarii),
  infoRow('Data revizuirii', evaluare.dataRevizuirii),
]

const buildDescriere = (evaluare: DbEvaluare): Paragraph[] => {
  const rows: Paragraph[] = [sectionTitle('3. DESCRIERE OBIECTIV ȘI AMPLASAMENT')]
  if (evaluare.suprafataTotala) rows.push(infoRow('Suprafață totală', `${evaluare.suprafataTotala} mp`))
  if (evaluare.tipImprejmuire) rows.push(infoRow('Tip împrejmuire', evaluare.tipImprejmuire))
  if (evaluare.tipAcces) rows.push(infoRow('Tip acces', evaluare.tipAcces))
  if (evaluare.descriereAmplasare) {
    rows.push(
      new Paragraph({
        children: [new TextRun({ text: 'Descriere amplasare:', bold: true, font: 'Arial', size: 22 })],
        spacing: { after: 60 },
      }),
      bodyParagraph(evaluare.descriereAmplasare),
    )
  }
  const vecini = [
    evaluare.vecinNord && `N: ${evaluare.vecinNord}`,
    evaluare.vecinEst && `E: ${evaluare.vecinEst}`,
    evaluare.vecinSud && `S: ${evaluare.vecinSud}`,
    evaluare.vecinVest && `V: ${evaluare.vecinVest}`,
  ].filter(Boolean)
  if (vecini.length > 0) rows.push(infoRow('Vecinătăți', vecini.join(' | ')))
  return rows
}

const buildRiscTable = (risc: DbRisc, index: number): (Paragraph | Table)[] => {
  const activitate = risc.activitateCustom || resolveActivitateLabel(risc.activitate || '')
  const pericol = risc.pericolCustom || resolvePericolLabel(risc.pericol || '')
  const persoaneExpuse = parseJsonArray(risc.persoaneExpuse)
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

  const COL = 9072
  const W1 = 1500
  const W2 = COL - W1

  return [
    new Table({
      width: { size: COL, type: WidthType.DXA },
      columnWidths: [COL],
      rows: [
        // Risk header row
        new TableRow({
          children: [
            tableCell(
              cellText(`RISC #${index}  — ${pericol}`, { bold: true, color: '1e3a5f' }),
              { widthDxa: COL, shading: '#EEF2FF' },
            ),
          ],
        }),
        // Activitate & pericol
        new TableRow({
          children: [
            tableCell(
              [
                cellText(`Activitate: ${activitate}`),
                cellText(`Persoane expuse: ${persoaneExpuse.join(', ') || '—'}${risc.numarPersoaneExpuse ? ` (${risc.numarPersoaneExpuse} pers.)` : ''}`),
                ...(risc.descrierePericol ? [cellText(`Descriere pericol: ${risc.descrierePericol}`)] : []),
              ],
              { widthDxa: COL },
            ),
          ],
        }),
      ],
    }),
    // Scores table
    new Table({
      width: { size: COL, type: WidthType.DXA },
      columnWidths: [W1, W2],
      rows: [
        new TableRow({
          children: [
            tableCell(cellText('RISC INIȚIAL', { bold: true }), { widthDxa: W1, shading: nivelInit?.bgColor }),
            tableCell(
              cellText(
                scoreInit > 0
                  ? `P=${pInit} × S=${sInit} = ${scoreInit} — ${nivelInit?.label ?? ''}`
                  : 'Necompletat',
                { bold: scoreInit > 0 },
              ),
              { widthDxa: W2, shading: nivelInit?.bgColor },
            ),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('RISC REZIDUAL', { bold: true }), { widthDxa: W1, shading: nivelRez?.bgColor }),
            tableCell(
              cellText(
                scoreRez > 0
                  ? `P=${pRez} × S=${sRez} = ${scoreRez} — ${nivelRez?.label ?? ''}`
                  : 'Necompletat',
                { bold: scoreRez > 0 },
              ),
              { widthDxa: W2, shading: nivelRez?.bgColor },
            ),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('Măsuri de protecție', { bold: true }), { widthDxa: W1 }),
            tableCell(
              cellText(masuriLabels.length > 0 ? masuriLabels.join('; ') : '—'),
              { widthDxa: W2 },
            ),
          ],
        }),
        ...(risc.masuriSuplimentare
          ? [
              new TableRow({
                children: [
                  tableCell(cellText('Măsuri suplimentare', { bold: true }), { widthDxa: W1 }),
                  tableCell(cellText(risc.masuriSuplimentare), { widthDxa: W2 }),
                ],
              }),
            ]
          : []),
        new TableRow({
          children: [
            tableCell(cellText('Responsabil / Termen', { bold: true }), { widthDxa: W1 }),
            tableCell(
              cellText(
                [
                  risc.responsabilImplementare,
                  risc.functieResponsabil ? `(${risc.functieResponsabil})` : null,
                  risc.termenImplementare ? `— ${risc.termenImplementare}` : null,
                ]
                  .filter(Boolean)
                  .join(' ') || '—',
              ),
              { widthDxa: W2 },
            ),
          ],
        }),
        new TableRow({
          children: [
            tableCell(cellText('Status', { bold: true }), { widthDxa: W1 }),
            tableCell(cellText(STATUS_LABEL[risc.statusRisc] ?? risc.statusRisc), { widthDxa: W2 }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '', spacing: { after: 120 } }),
  ]
}

const buildMatriceRisc = (riscuri: DbRisc[]): (Paragraph | Table)[] => {
  const COL = 9072
  const CELL_W = Math.floor(COL / 6)

  // Build a 5×5 count matrix
  const counts: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0))
  for (const risc of riscuri) {
    if (risc.probabilitateInitiala && risc.severitateInitiala) {
      const r = 5 - risc.probabilitateInitiala
      const c = risc.severitateInitiala - 1
      counts[r][c]++
    }
  }

  const getCellShading = (p: number, s: number) => {
    const score = p * s
    const nivel = getNivelRisc(score)
    return nivel.bgColor
  }

  const headerRow = new TableRow({
    children: [
      tableCell(cellText('P \\ S', { bold: true }), { widthDxa: CELL_W }),
      ...[1, 2, 3, 4, 5].map((s) =>
        tableCell(cellText(`S=${s}`, { bold: true }), { widthDxa: CELL_W, shading: '#F0F0F0' }),
      ),
    ],
  })

  const dataRows = [5, 4, 3, 2, 1].map((p, rowIdx) =>
    new TableRow({
      children: [
        tableCell(cellText(`P=${p}`, { bold: true }), { widthDxa: CELL_W, shading: '#F0F0F0' }),
        ...[0, 1, 2, 3, 4].map((colIdx) => {
          const s = colIdx + 1
          const count = counts[rowIdx][colIdx]
          const shading = getCellShading(p, s)
          return tableCell(
            cellText(count > 0 ? `${count}` : '', { bold: count > 0 }),
            { widthDxa: CELL_W, shading },
          )
        }),
      ],
    }),
  )

  return [
    sectionTitle('5. MATRICE RISC SUMAR'),
    new Paragraph({
      children: [new TextRun({ text: 'Numărul de riscuri identificate per celulă (risc inițial):', font: 'Arial', size: 20 })],
      spacing: { after: 120 },
    }),
    new Table({
      width: { size: COL, type: WidthType.DXA },
      columnWidths: Array(6).fill(CELL_W),
      rows: [headerRow, ...dataRows],
    }),
    new Paragraph({ text: '', spacing: { after: 240 } }),
    new Paragraph({
      children: [
        new TextRun({ text: '■ ', color: hexColor(NIVEL_RISC.scazut.color), font: 'Arial', size: 20 }),
        new TextRun({ text: 'Scăzut (1–4)   ', font: 'Arial', size: 20 }),
        new TextRun({ text: '■ ', color: hexColor(NIVEL_RISC.mediu.color), font: 'Arial', size: 20 }),
        new TextRun({ text: 'Mediu (5–9)   ', font: 'Arial', size: 20 }),
        new TextRun({ text: '■ ', color: hexColor(NIVEL_RISC.ridicat.color), font: 'Arial', size: 20 }),
        new TextRun({ text: 'Ridicat (10–15)   ', font: 'Arial', size: 20 }),
        new TextRun({ text: '■ ', color: hexColor(NIVEL_RISC.critic.color), font: 'Arial', size: 20 }),
        new TextRun({ text: 'Critic (16–25)', font: 'Arial', size: 20 }),
      ],
      spacing: { after: 120 },
    }),
  ]
}

const buildSemnaturi = (evaluare: DbEvaluare): (Paragraph | Table)[] => {
  const COL = 9072
  const W = Math.floor(COL / 3)

  return [
    sectionTitle('6. SEMNĂTURI ȘI APROBARE'),
    infoRow('Data aprobării', evaluare.dataAprobarii),
    new Paragraph({ text: '', spacing: { after: 240 } }),
    new Table({
      width: { size: COL, type: WidthType.DXA },
      columnWidths: [W, W, W],
      rows: [
        new TableRow({
          children: [
            tableCell(cellText('Evaluator', { bold: true }), { widthDxa: W }),
            tableCell(cellText('Șef Șantier', { bold: true }), { widthDxa: W }),
            tableCell(cellText('Responsabil SSM', { bold: true }), { widthDxa: W }),
          ],
        }),
        new TableRow({
          children: [
            tableCell(
              [
                cellText('_______________'),
                cellText(evaluare.numeEvaluator || ''),
                cellText(evaluare.functieEvaluator || ''),
                cellText(evaluare.firmaEvaluator || ''),
              ],
              { widthDxa: W },
            ),
            tableCell(
              [
                cellText('_______________'),
                cellText(evaluare.sefSantier || ''),
                cellText(evaluare.functieSefSantier || ''),
              ],
              { widthDxa: W },
            ),
            tableCell(
              [
                cellText('_______________'),
                cellText(evaluare.responsabilSSM || ''),
                cellText(evaluare.functieResponsabilSSM || ''),
              ],
              { widthDxa: W },
            ),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '', spacing: { after: 120 } }),
  ]
}

const buildDocumente = (evaluare: DbEvaluare): Paragraph[] => {
  const docValues = parseJsonArray(evaluare.documenteAplicabile)
  const anexaValues = parseJsonArray(evaluare.anexeSelectate)

  // Legacy keys from old format (single-letter IDs) mapped to their labels
  const legacyDocLabels: Record<string, string> = {
    a: 'Plan propriu de securitate și sănătate în muncă',
    b: 'Instrucțiuni proprii SSM',
    c: 'Fișe de expunere la riscuri',
    d: 'Registrul unic de evidență a accidentelor de muncă',
    e: 'Registrul unic de evidență a incidentelor periculoase',
    f: 'Registrul unic de evidență a accidentărilor în muncă',
    g: 'Fișe de instruire individuală',
    h: 'Proces-verbal de instruire',
  }

  const resolveDocLabel = (v: string) =>
    DOCUMENTE_LABEL_MAP[v] ?? legacyDocLabels[v] ?? v

  const rows: Paragraph[] = [sectionTitle('7. DOCUMENTE APLICABILE')]

  if (docValues.length > 0) {
    rows.push(
      new Paragraph({
        children: [new TextRun({ text: 'Documente SSM:', bold: true, font: 'Arial', size: 22 })],
        spacing: { after: 80 },
      }),
    )
    for (const v of docValues) {
      rows.push(
        new Paragraph({
          children: [
            new TextRun({ text: '☑ ', font: 'Arial', size: 22 }),
            new TextRun({ text: resolveDocLabel(v), font: 'Arial', size: 22 }),
          ],
          spacing: { after: 60 },
          indent: { left: 360 },
        }),
      )
    }
  }

  if (anexaValues.length > 0) {
    rows.push(
      new Paragraph({
        children: [new TextRun({ text: 'Anexe:', bold: true, font: 'Arial', size: 22 })],
        spacing: { before: 200, after: 80 },
      }),
    )
    for (const v of anexaValues) {
      rows.push(
        new Paragraph({
          children: [
            new TextRun({ text: '— ', font: 'Arial', size: 22 }),
            new TextRun({ text: ANEXE_LABEL_MAP[v] ?? v, font: 'Arial', size: 22 }),
          ],
          spacing: { after: 60 },
          indent: { left: 360 },
        }),
      )
    }
  }

  if (evaluare.observatiiDocumente) {
    rows.push(infoRow('Observații', evaluare.observatiiDocumente))
  }

  return rows
}

// ─── main export ──────────────────────────────────────────────────────────────

export const generateEvaluareDocx = async (
  evaluare: DbEvaluare,
  riscuri: DbRisc[],
): Promise<Buffer> => {
  const sortedRiscuri = [...riscuri].sort((a, b) => a.ordine - b.ordine)

  const riscuriContent: (Paragraph | Table)[] = [sectionTitle('4. EVALUARE RISCURI')]
  for (let i = 0; i < sortedRiscuri.length; i++) {
    riscuriContent.push(...buildRiscTable(sortedRiscuri[i], i + 1))
  }
  if (sortedRiscuri.length === 0) {
    riscuriContent.push(bodyParagraph('Nu au fost identificate riscuri.'))
  }

  const doc = new Document({
    styles: {
      default: {
        heading1: {
          run: { font: 'Arial', size: 28, bold: true, color: '1e3a5f' },
          paragraph: { spacing: { before: 360, after: 120 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        headers: { default: buildHeader(evaluare) },
        footers: { default: buildFooter() },
        children: [
          ...buildInfoGenerale(evaluare),
          ...buildDateEvaluare(evaluare),
          ...buildDescriere(evaluare),
          ...riscuriContent,
          ...buildMatriceRisc(sortedRiscuri),
          ...buildSemnaturi(evaluare),
          ...buildDocumente(evaluare),
        ],
      },
    ],
  })

  return Packer.toBuffer(doc)
}
