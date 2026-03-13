// ============================================
// FAZE LUCRĂRI (select dropdown)
// ============================================
export const FAZE_LUCRARI = [
  'Organizare șantier',
  'Fundații',
  'Structură beton armat',
  'Structură metalică',
  'Zidărie',
  'Instalații electrice',
  'Instalații sanitare',
  'Instalații HVAC',
  'Finisaje interioare',
  'Finisaje exterioare',
  'Acoperiș / Învelitoare',
  'Amenajări exterioare',
  'Demolări',
  'Altă fază',
] as const

/** @deprecated Use FAZE_LUCRARI */
export const FAZE_LUCRARII = FAZE_LUCRARI

// ============================================
// TIP ÎMPREJMUIRE (select dropdown)
// ============================================
export const TIP_IMPREJMUIRE = [
  'Gard metalic',
  'Gard beton',
  'Gard plasă',
  'Panou sandwich',
  'Împrejmuire provizorie',
  'Fără împrejmuire',
] as const

// ============================================
// TIP ACCES ȘANTIER (checkbox group — section 3b)
// ============================================
export const TIP_ACCES = [
  'Acces controlat cu legitimare obligatorie',
  'Acces doar personal autorizat',
  'Acces pe bază de permis de lucru',
  'Acces restricționat în zone periculoase',
  'Acces auto controlat',
  'Acces pietonal separat de cel auto',
  'Barieră / Poartă cu agent de securitate',
  'Înregistrare în registru de acces',
  'Zonă delimitată pentru livrări',
  'Verificare identitate la intrare',
] as const

// ============================================
// ACTIVITĂȚI FRECVENTE SSM (searchable select)
// ============================================
export const ACTIVITATI = [
  { value: 'lucru_inaltime', label: 'Lucrări la înălțime', icon: '🏗️' },
  { value: 'excavatii', label: 'Excavații / Săpături', icon: '⛏️' },
  { value: 'ridicare_macara', label: 'Ridicare sarcini cu macara', icon: '🏗️' },
  { value: 'lucrari_electrice', label: 'Lucrări electrice', icon: '⚡' },
  { value: 'sudura_taiere', label: 'Sudură / Tăiere', icon: '🔥' },
  { value: 'demolari', label: 'Demolări', icon: '🔨' },
  { value: 'spatii_inchise', label: 'Lucrări în spații închise', icon: '🚪' },
  { value: 'substante_chimice', label: 'Manipulare substanțe chimice', icon: '⚗️' },
  { value: 'circulatie_utilaje', label: 'Circulație utilaje pe șantier', icon: '🚛' },
  { value: 'lucru_friguros', label: 'Lucrări pe timp friguros', icon: '❄️' },
  { value: 'lucru_canicular', label: 'Lucrări pe timp canicular', icon: '☀️' },
  { value: 'manipulare_sarcini', label: 'Manipulare manuală sarcini', icon: '📦' },
  { value: 'cofrare_decofrare', label: 'Cofrare / Decofrare', icon: '🪵' },
  { value: 'lucrari_acoperis', label: 'Lucrări pe acoperiș', icon: '🏠' },
  { value: 'turnare_beton', label: 'Turnare beton', icon: '🧱' },
  { value: 'montaj_schele', label: 'Montaj / Demontaj schele', icon: '🪜' },
  { value: 'montaj_structuri', label: 'Montaj structuri prefabricate', icon: '🔩' },
  { value: 'izolare_termica', label: 'Izolare termică / Hidroizolații', icon: '🧤' },
  { value: 'transport_materiale', label: 'Transport materiale pe șantier', icon: '🚚' },
  { value: 'custom', label: 'Altă activitate...', icon: '✏️' },
] as const

// ============================================
// PERICOLE COMUNE (searchable select)
// ============================================
export const PERICOLE = [
  { value: 'cadere_inaltime', label: 'Cădere de la înălțime', categorie: 'mecanic' },
  {
    value: 'cadere_acelasi_nivel',
    label: 'Cădere la același nivel (alunecare/împiedicare)',
    categorie: 'mecanic',
  },
  { value: 'cadere_obiecte', label: 'Cădere obiecte de la înălțime', categorie: 'mecanic' },
  { value: 'prabusire_teren', label: 'Prăbușire teren / maluri săpături', categorie: 'mecanic' },
  {
    value: 'prabusire_structura',
    label: 'Prăbușire structură / cofraj / schelă',
    categorie: 'mecanic',
  },
  { value: 'lovire_utilaj', label: 'Lovire de / cu utilaj în mișcare', categorie: 'mecanic' },
  { value: 'strivire', label: 'Strivire / Prindere între echipamente', categorie: 'mecanic' },
  { value: 'taiere_intepare', label: 'Tăiere / Înțepare de materiale', categorie: 'mecanic' },
  { value: 'electrocutare', label: 'Electrocutare', categorie: 'electric' },
  { value: 'arsuri_termice', label: 'Arsuri termice (sudură, flacără)', categorie: 'termic' },
  { value: 'arsuri_chimice', label: 'Arsuri chimice', categorie: 'chimic' },
  { value: 'inhalare_noxe', label: 'Inhalare noxe / praf / gaze', categorie: 'chimic' },
  {
    value: 'contact_substante',
    label: 'Contact cu substanțe periculoase',
    categorie: 'chimic',
  },
  { value: 'explozie_incendiu', label: 'Explozie / Incendiu', categorie: 'chimic' },
  { value: 'zgomot', label: 'Zgomot excesiv', categorie: 'fizic' },
  { value: 'vibratii', label: 'Vibrații', categorie: 'fizic' },
  { value: 'stres_termic_cald', label: 'Stres termic — căldură', categorie: 'fizic' },
  { value: 'stres_termic_frig', label: 'Stres termic — frig', categorie: 'fizic' },
  { value: 'expunere_intemperii', label: 'Expunere la intemperii', categorie: 'fizic' },
  {
    value: 'efort_fizic',
    label: 'Efort fizic excesiv / Suprasolicitare',
    categorie: 'ergonomic',
  },
  { value: 'pozitie_lucru', label: 'Poziție de lucru forțată', categorie: 'ergonomic' },
  {
    value: 'proiectare_particule',
    label: 'Proiectare particule / fragmente',
    categorie: 'mecanic',
  },
  { value: 'custom', label: 'Alt pericol...', categorie: 'custom' },
] as const

// ============================================
// PERSOANE EXPUSE (multi-select checkbox group)
// ============================================
export const PERSOANE_EXPUSE = [
  'Muncitori necalificați',
  'Muncitori calificați',
  'Maiștri / Șefi de echipă',
  'Ingineri / Tehnicieni',
  'Subcontractori',
  'Conducători auto / Operatori utilaje',
  'Vizitatori',
  'Trecători / Public',
  'Personal administrativ',
] as const

// ============================================
// MĂSURI DE CONTROL EIP (grouped checkboxes)
// ============================================
export const MASURI_EIP = [
  { value: 'casca_protectie', label: 'Cască de protecție' },
  { value: 'bocanci_protectie', label: 'Bocanci de protecție cu bombeu' },
  { value: 'ham_siguranta', label: 'Ham de siguranță + linie de viață' },
  { value: 'ochelari_protectie', label: 'Ochelari de protecție' },
  { value: 'viziera', label: 'Vizieră de protecție' },
  { value: 'manusi_protectie', label: 'Mănuși de protecție' },
  { value: 'manusi_dielectrice', label: 'Mănuși dielectrice' },
  { value: 'protectie_auditiva', label: 'Protecție auditivă (antifoane/dopuri)' },
  { value: 'masca_praf', label: 'Mască antipraf / semimasca cu filtru' },
  { value: 'masca_gaze', label: 'Mască cu filtru pentru gaze' },
  { value: 'vesta_vizibilitate', label: 'Vestă reflectorizantă' },
  { value: 'echipament_antiploaie', label: 'Echipament de protecție împotriva ploii' },
  { value: 'centura_siguranta', label: 'Centură de siguranță (poziționare)' },
  { value: 'protectie_genunchi', label: 'Protecție genunchi' },
] as const

/** @deprecated Use MASURI_EIP */
export const EIP_OPTIONS: readonly string[] = MASURI_EIP.map((m) => m.label)

export const MASURI_COLECTIVE = [
  { value: 'balustrade', label: 'Balustrade / Parapete de protecție' },
  { value: 'plase_protectie', label: 'Plase de protecție la cădere' },
  { value: 'platforme_lucru', label: 'Platforme de lucru cu protecție laterală' },
  { value: 'semnalizare', label: 'Semnalizare de securitate (panouri, benzi)' },
  { value: 'iluminat', label: 'Iluminat corespunzător al zonei' },
  { value: 'ventilatie', label: 'Ventilație / Aspirație locală' },
  { value: 'sprijiniri_maluri', label: 'Sprijiniri maluri săpături' },
  { value: 'imprejmuire_zona', label: 'Împrejmuire zonă periculoasă' },
  { value: 'capace_goluri', label: 'Capace goluri în planșee / capace puțuri' },
  { value: 'pasarele_acces', label: 'Pasarele de acces peste săpături' },
  { value: 'stingere_incendiu', label: 'Mijloace de stingere incendiu' },
  { value: 'detector_gaze', label: 'Detector de gaze în spații închise' },
] as const

export const MASURI_ORGANIZATORICE = [
  { value: 'instruire_specifica', label: 'Instruire specifică la locul de muncă' },
  { value: 'instruire_periodica', label: 'Instruire periodică SSM' },
  { value: 'permis_lucru', label: 'Permis de lucru (lucrări periculoase)' },
  { value: 'permis_foc', label: 'Permis de lucru cu foc deschis' },
  { value: 'supraveghere', label: 'Supraveghere permanentă' },
  { value: 'verificare_echipamente', label: 'Verificare periodică echipamente de muncă' },
  { value: 'verificare_ISCIR', label: 'Verificare ISCIR utilaje de ridicat' },
  { value: 'proceduri_lucru', label: 'Proceduri de lucru aprobate / ITI' },
  { value: 'prim_ajutor', label: 'Truse prim ajutor disponibile pe șantier' },
  { value: 'plan_urgenta', label: 'Plan de urgență comunicat personalului' },
  { value: 'semnalist', label: 'Semnalist desemnat pentru macara' },
  { value: 'rotatie_personal', label: 'Rotație personal la efort prelungit' },
  { value: 'pauze_obligatorii', label: 'Pauze obligatorii pe timp canicular/friguros' },
  { value: 'coordonator_ssm', label: 'Coordonator SSM desemnat pe șantier' },
] as const

// ============================================
// SCALE EVALUARE
// ============================================
export const SCALA_PROBABILITATE = [
  {
    value: 1,
    label: 'Foarte puțin probabil',
    descriere: 'Eveniment extrem de rar, aproape imposibil',
    color: '#22c55e',
  },
  {
    value: 2,
    label: 'Puțin probabil',
    descriere: 'Posibil dar improbabil în condiții normale',
    color: '#84cc16',
  },
  {
    value: 3,
    label: 'Probabil',
    descriere: 'Poate apărea în anumite condiții',
    color: '#eab308',
  },
  { value: 4, label: 'Foarte probabil', descriere: 'Este de așteptat să apară', color: '#f97316' },
  {
    value: 5,
    label: 'Aproape sigur',
    descriere: 'Va apărea cu siguranță fără măsuri',
    color: '#ef4444',
  },
] as const

export const SCALA_SEVERITATE = [
  {
    value: 1,
    label: 'Neglijabilă',
    descriere: 'Vătămare minoră, fără concediu medical',
    color: '#22c55e',
  },
  {
    value: 2,
    label: 'Minoră',
    descriere: 'Vătămare ușoară, concediu medical < 3 zile',
    color: '#84cc16',
  },
  {
    value: 3,
    label: 'Moderată',
    descriere: 'Vătămare medie, concediu 3-45 zile',
    color: '#eab308',
  },
  {
    value: 4,
    label: 'Majoră',
    descriere: 'Vătămare gravă, invaliditate temporară/permanentă',
    color: '#f97316',
  },
  {
    value: 5,
    label: 'Critică',
    descriere: 'Deces sau invaliditate permanentă gravă',
    color: '#ef4444',
  },
] as const

export const PROBABILITATE_LABELS: readonly string[] = SCALA_PROBABILITATE.map((s) => s.label)
export const SEVERITATE_LABELS: readonly string[] = SCALA_SEVERITATE.map((s) => s.label)

// ============================================
// NIVEL RISC (color mapping)
// ============================================
export const NIVEL_RISC = {
  scazut: {
    min: 1,
    max: 4,
    label: 'Scăzut',
    color: '#22c55e',
    bgColor: '#f0fdf4',
    textColor: '#166534',
  },
  mediu: {
    min: 5,
    max: 9,
    label: 'Mediu',
    color: '#eab308',
    bgColor: '#fefce8',
    textColor: '#854d0e',
  },
  ridicat: {
    min: 10,
    max: 15,
    label: 'Ridicat',
    color: '#f97316',
    bgColor: '#fff7ed',
    textColor: '#9a3412',
  },
  critic: {
    min: 16,
    max: 25,
    label: 'Critic',
    color: '#ef4444',
    bgColor: '#fef2f2',
    textColor: '#991b1b',
  },
} as const

export const getNivelRisc = (scor: number) => {
  if (scor <= 4) return NIVEL_RISC.scazut
  if (scor <= 9) return NIVEL_RISC.mediu
  if (scor <= 15) return NIVEL_RISC.ridicat
  return NIVEL_RISC.critic
}

// ============================================
// MATRICE RISC 5×5 (for visual grid)
// ============================================
// Row = Probabilitate (5 at top, 1 at bottom)
// Col = Severitate (1 at left, 5 at right)
export const MATRICE_RISC = [
  [5, 10, 15, 20, 25], // P=5
  [4, 8, 12, 16, 20], // P=4
  [3, 6, 9, 12, 15], // P=3
  [2, 4, 6, 8, 10], // P=2
  [1, 2, 3, 4, 5], // P=1
]

export const getRiskLevel = (probabilitate: number, severitate: number) => {
  const score = probabilitate * severitate
  if (score >= 16) return 'critic'
  if (score >= 10) return 'ridicat'
  if (score >= 5) return 'mediu'
  return 'scazut'
}

export const getRiskColor = (level: string) => {
  switch (level) {
    case 'critic':
      return {
        bg: 'bg-error-600',
        text: 'text-white',
        border: 'border-error-600',
        light: 'bg-error-50 text-error-700',
      }
    case 'ridicat':
      return {
        bg: 'bg-warning-500',
        text: 'text-white',
        border: 'border-warning-500',
        light: 'bg-warning-50 text-warning-700',
      }
    case 'mediu':
      return {
        bg: 'bg-primary-500',
        text: 'text-white',
        border: 'border-primary-500',
        light: 'bg-primary-50 text-primary-700',
      }
    case 'scazut':
      return {
        bg: 'bg-success-500',
        text: 'text-white',
        border: 'border-success-500',
        light: 'bg-success-50 text-success-700',
      }
    default:
      return {
        bg: 'bg-primary-500',
        text: 'text-white',
        border: 'border-primary-500',
        light: 'bg-primary-50 text-primary-700',
      }
  }
}

// ============================================
// DOCUMENTE SSM (checkbox list — section 7a)
// ============================================
export const DOCUMENTE_SSM = [
  {
    value: 'plan_propriu_ssm',
    label: 'Plan propriu de securitate și sănătate în muncă',
    descriere: 'Conform HG 300/2006',
  },
  {
    value: 'instructiuni_proprii',
    label: 'Instrucțiuni proprii SSM',
    descriere: 'Elaborate pentru activitățile desfășurate',
  },
  {
    value: 'fise_expunere',
    label: 'Fișe de expunere la riscuri profesionale',
    descriere: 'Pentru fiecare lucrător',
  },
  {
    value: 'registru_accidente',
    label: 'Registrul unic de evidență a accidentelor de muncă',
    descriere: '',
  },
  {
    value: 'registru_incidente',
    label: 'Registrul unic de evidență a incidentelor periculoase',
    descriere: '',
  },
  {
    value: 'registru_accidentari',
    label: 'Registrul unic de evidență a accidentărilor în muncă',
    descriere: '',
  },
  {
    value: 'fise_instruire',
    label: 'Fișe de instruire individuală',
    descriere: 'Instruire introductiv-generală, la locul de muncă, periodică',
  },
  { value: 'pv_instruire', label: 'Proces-verbal de instruire colectivă', descriere: '' },
  { value: 'evaluare_risc', label: 'Evaluare de risc la locul de muncă', descriere: 'Prezentul document' },
  { value: 'plan_evacuare', label: 'Plan de evacuare în caz de urgență', descriere: '' },
  {
    value: 'tematica_instruire',
    label: 'Tematica de instruire periodică',
    descriere: 'Aprobată de angajator',
  },
] as const

/** @deprecated Use DOCUMENTE_SSM */
export const DOCUMENTE_APLICABILE: readonly { id: string; label: string; descriere: string }[] =
  DOCUMENTE_SSM.map((d) => ({
    id: d.value,
    label: d.label,
    descriere: d.descriere,
  }))

// ============================================
// ANEXE EVALUARE (checkbox list — section 7b)
// ============================================
export const ANEXE_EVALUARE = [
  { value: 'schita_santier', label: 'Anexa 1 — Schiță amplasament șantier' },
  { value: 'tabel_eip', label: 'Anexa 2 — Tabel cu echipamentele de protecție necesare' },
  { value: 'lista_personal', label: 'Anexa 3 — Lista personalului instruit SSM' },
  { value: 'fise_tehnice', label: 'Anexa 4 — Fișe tehnice de securitate substanțe periculoase' },
  { value: 'certificari', label: 'Anexa 5 — Certificări și autorizații echipamente de muncă' },
  { value: 'plan_evacuare_schita', label: 'Anexa 6 — Plan de evacuare (schiță)' },
] as const

/** @deprecated Use ANEXE_EVALUARE */
export const ANEXE_STANDARD: readonly string[] = ANEXE_EVALUARE.map((a) => a.label)

export const SECTIUNI_NAVIGARE = [
  { id: 'proiect-section', emoji: '🏢', label: 'Informații Proiect' },
  { id: 'evaluator-section', emoji: '👤', label: 'Evaluator & Date' },
  { id: 'obiectiv-section', emoji: '🏗️', label: 'Descriere Obiectiv' },
  { id: 'riscuri-section', emoji: '⚠️', label: 'Identificare Riscuri' },
  { id: 'sumar-section', emoji: '📊', label: 'Sumar & Revizuire' },
  { id: 'aprobare-section', emoji: '✅', label: 'Semnături & Aprobare' },
  { id: 'documente-section', emoji: '📋', label: 'Documente & Anexe' },
  { id: 'export-section', emoji: '📄', label: 'Export' },
] as const
