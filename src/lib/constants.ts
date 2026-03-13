export const FAZE_LUCRARII = [
  'Proiectare',
  'Demolare',
  'Terasamente',
  'Fundații',
  'Structură',
  'Zidărie',
  'Acoperiș',
  'Instalații',
  'Finisaje',
  'Amenajări exterioare',
  'Recepție',
  'Altă fază',
] as const

export const TIP_IMPREJMUIRE = [
  'Gard metalic',
  'Gard beton',
  'Gard plasă',
  'Panou sandwich',
  'Împrejmuire provizorie',
  'Fără împrejmuire',
] as const

export const TIP_ACCES = [
  'Poartă principală auto',
  'Intrare pietonală',
  'Ieșire de urgență',
  'Acces materiale',
  'Acces utilaje grele',
  'Acces temporar',
] as const

export const ACTIVITATI = [
  'Săpătură manuală',
  'Săpătură mecanizată',
  'Lucrări de cofrare',
  'Betonare',
  'Armare',
  'Lucrări de zidărie',
  'Lucrări la înălțime',
  'Lucrări de sudură',
  'Montaj prefabricate',
  'Lucrări de instalații',
  'Lucrări de finisaje',
  'Transport intern',
  'Operare macara',
  'Operare excavator',
  'Lucrări de demolări',
  'Altă activitate',
] as const

export const PERICOLE = [
  'Cădere de la înălțime',
  'Cădere la același nivel',
  'Lovire de obiecte în cădere',
  'Strivire',
  'Tăiere / înțepare',
  'Electrocutare',
  'Incendiu / explozie',
  'Expunere la substanțe periculoase',
  'Zgomot / vibrații',
  'Efort fizic excesiv',
  'Condiții meteorologice nefavorabile',
  'Prăbușire structuri',
  'Accident de trafic intern',
  'Alt pericol',
] as const

export const PERSOANE_EXPUSE = [
  'Muncitori calificați',
  'Muncitori necalificați',
  'Operatori utilaje',
  'Șef de șantier',
  'Responsabil SSM',
  'Subantreprenori',
  'Vizitatori',
  'Riverani',
] as const

export const EIP_OPTIONS = [
  'Cască de protecție',
  'Ochelari de protecție',
  'Protecție auditivă',
  'Mănuși de protecție',
  'Încălțăminte de protecție',
  'Vestă reflectorizantă',
  'Hamuri / centuri de siguranță',
  'Mască respiratorie',
  'Salopetă de protecție',
  'Genunchiere',
] as const

export const MASURI_COLECTIVE = [
  'Balustrade / parapete',
  'Plase de siguranță',
  'Copertine de protecție',
  'Semnalizare și marcare perimetru',
  'Iluminat de securitate',
  'Instalații de ventilație',
  'Stingătoare de incendiu',
  'Truse de prim ajutor',
  'Sistem de ancorare colectiv',
  'Capace de protecție deschideri',
] as const

export const MASURI_ORGANIZATORICE = [
  'Instruire periodică SSM',
  'Permis de lucru la înălțime',
  'Supraveghere activitate',
  'Program de lucru adaptat',
  'Rotație personal',
  'Pauze obligatorii',
  'Control stare echipamente zilnic',
  'Comunicare risc zilnică',
  'Evacuare plan periodic',
] as const

export const DOCUMENTE_APLICABILE = [
  {
    id: 'a',
    label: 'Plan propriu de securitate și sănătate în muncă',
    descriere: 'Plan SSM specific șantierului',
  },
  { id: 'b', label: 'Instrucțiuni proprii SSM', descriere: 'Instrucțiuni adaptate activităților' },
  {
    id: 'c',
    label: 'Fișe de expunere la riscuri',
    descriere: 'Fișe pentru fiecare factor de risc',
  },
  {
    id: 'd',
    label: 'Registrul unic de evidență a accidentelor de muncă',
    descriere: 'Conform HG 1425/2006',
  },
  {
    id: 'e',
    label: 'Registrul unic de evidență a incidentelor periculoase',
    descriere: 'Conform HG 1425/2006',
  },
  {
    id: 'f',
    label: 'Registrul unic de evidență a accidentărilor în muncă',
    descriere: 'Conform HG 1425/2006',
  },
  {
    id: 'g',
    label: 'Fișe de instruire individuală',
    descriere: 'Fișe pentru fiecare angajat instruit',
  },
  { id: 'h', label: 'Proces-verbal de instruire', descriere: 'PV de instruire periodică SSM' },
] as const

export const ANEXE_STANDARD = [
  'Anexa 1 — Schiță amplasament șantier',
  'Anexa 2 — Tabel cu echipamente de protecție necesare',
  'Anexa 3 — Lista personalului instruit',
  'Anexa 4 — Fișe tehnice de securitate substanțe',
  'Anexa 5 — Certificări și autorizații echipamente',
  'Anexa 6 — Plan de evacuare',
] as const

export const PROBABILITATE_LABELS = [
  'Improbabil',
  'Puțin probabil',
  'Posibil',
  'Probabil',
  'Cert',
] as const
export const SEVERITATE_LABELS = [
  'Neglijabilă',
  'Minoră',
  'Moderată',
  'Majoră',
  'Catastrofală',
] as const

export const getRiskLevel = (probabilitate: number, severitate: number) => {
  const score = probabilitate * severitate
  if (score >= 15) return 'critic'
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
