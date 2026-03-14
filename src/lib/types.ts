export type EvaluareStatus = 'draft' | 'completed'
export type RiscStatus = 'deschis' | 'in_lucru' | 'inchis'

export type Evaluare = {
  id: string
  status: EvaluareStatus
  createdAt: string
  updatedAt: string
  completedAt: string | null
  denumireProiect: string | null
  codProiect: string | null
  adresaLocatie: string | null
  localitate: string | null
  judet: string | null
  beneficiar: string | null
  cuiBeneficiar: string | null
  antreprenor: string | null
  cuiAntreprenor: string | null
  subantreprenor: string | null
  fazaLucrarii: string | null
  fazaLucrariiCustom: string | null
  descriereObiectiv: string | null
  numeEvaluator: string | null
  functieEvaluator: string | null
  firmaEvaluator: string | null
  nrDocument: string | null
  dataEvaluarii: string | null
  dataRevizuirii: string | null
  suprafataTotala: string | null
  descriereAmplasare: string | null
  tipImprejmuire: string | null
  tipAcces: string | null
  vecinNord: string | null
  vecinEst: string | null
  vecinSud: string | null
  vecinVest: string | null
  sefSantier: string | null
  functieSefSantier: string | null
  responsabilSSM: string | null
  functieResponsabilSSM: string | null
  dataAprobarii: string | null
  observatiiGenerale: string | null
  documenteAplicabile: string | null
  anexeSelectate: string | null
  observatiiDocumente: string | null
  // Cadru Organizațional Intern (Cap. III)
  cadruRegimActivitate: string | null
  cadruProgramLucru: string | null
  cadruFluxPersoane: string | null
  cadruFluxBunuri: string | null
  cadruNumarAngajati: number | null
  cadruZoneFunctionale: string | null
  cadruBunuriValori: string | null
  cadruSistemeTehnice: string | null
  cadruFactoriVulnerabilitate: string | null
  // Amplasare & Factori Externi (additional fields)
  numarPuncteAcces: number | null
  caiAcces: string | null
  posibilitateDisimulare: string | null
  vecinatatiBifate: string | null
  factoriExterni: string | null
  istoricIncidente: string | null
  // Măsuri & Mecanisme de Securitate (Cap. V)
  masuriMecanofizice: string | null
  masuriControlAcces: string | null
  masuriAlarmare: string | null
  masuriCctv: string | null
  pazaUmana: string | null
  numarAgenti: number | null
  masuriOrganizatorice: string | null
  masuriAsigurari: string | null
  observatiiMasuri: string | null
  // Concluzii (Cap. VI)
  nivelRiscGlobalAsumat: string | null
  nivelRiscRezidualGlobal: string | null
  termenImplementareGlobal: string | null
  concluziiGenerale: string | null
  masuriObligatorii: string | null
  masuriRecomandate: string | null
}

export type Risc = {
  id: string
  evaluareId: string
  ordine: number
  activitate: string | null
  activitateCustom: string | null
  pericol: string | null
  pericolCustom: string | null
  descrierePericol: string | null
  persoaneExpuse: string | null
  numarPersoaneExpuse: number | null
  probabilitateInitiala: number | null
  severitateInitiala: number | null
  masuriExistente: string | null
  masuriExistenteCustom: string | null
  masuriSuplimentare: string | null
  probabilitateReziduala: number | null
  severitateReziduala: number | null
  responsabilImplementare: string | null
  functieResponsabil: string | null
  termenImplementare: string | null
  statusRisc: RiscStatus
  createdAt: string
  updatedAt: string
}

export type Template = {
  id: string
  nume: string
  descriere: string | null
  continut: string
  createdAt: string
}

export type EvaluareWithRiscuri = Evaluare & { riscuri: Risc[] }

export type ApiResponse<T> = { data: T }
export type ApiError = { error: string }
