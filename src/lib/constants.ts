// ============================================
// TIP UNITATE (replaces FAZE_LUCRARI)
// ============================================
export const TIP_UNITATE = [
  'Unitate comercială (magazin, showroom)',
  'Supermarket / Hipermarket',
  'Bancă / Instituție financiară',
  'Birou / Clădire de birouri',
  'Depozit / Logistică',
  'Fabrică / Unitate de producție',
  'Hotel / Pensiune',
  'Restaurant / Bar / Club',
  'Spital / Clinică',
  'Școală / Universitate',
  'Instituție publică',
  'Biserică / Lăcaș de cult',
  'Stație de carburanți',
  'Parcare / Garaj',
  'Complex rezidențial',
  'Centru comercial (mall)',
  'Farmaceutică / Laborator',
  'Alt tip de obiectiv',
] as const

// ============================================
// TIP EVALUARE
// ============================================
export const TIP_EVALUARE = [
  'Evaluare inițială',
  'Reevaluare periodică (la 3 ani)',
  'Reevaluare post-incident',
  'Reevaluare la modificări ale obiectivului',
  'Reevaluare la schimbarea destinației',
] as const

// ============================================
// OBIECTIVE EVALUARE (multi-select checkboxes)
// ============================================
export const OBIECTIVE_EVALUARE = [
  'Protecția personalului propriu',
  'Protecția clienților și vizitatorilor',
  'Protecția bunurilor și valorilor',
  'Protecția informațiilor confidențiale',
  'Asigurarea continuității activității',
  'Conformarea cu cerințele legale',
  'Protecția împotriva actelor de vandalism',
  'Protecția împotriva terorismului',
] as const

// ============================================
// METODE ȘI INSTRUMENTE DE LUCRU (multi-select)
// ============================================
export const METODE_INSTRUMENTE = [
  'Inspecție la fața locului',
  'Chestionar conducător unitate',
  'Declarații reprezentant beneficiar',
  'Verificare documente',
  'Observații privind vecinătăți și căi de acces',
  'Analiza SWOT',
  'Consultare personal de securitate',
  'Verificare contracte servicii pază/monitorizare',
  'Verificare contracte mentenanță',
  'Verificare certificate echipamente',
  'Verificări funcționale sisteme existente',
  'Fotografii/schițe de teren',
  'Analiza istoricului de incidente',
] as const

// ============================================
// ZONA AMPLASARE
// ============================================
export const ZONA_AMPLASARE = [
  'Zona urbană centrală',
  'Zona urbană periferică',
  'Zona industrială',
  'Zona comercială',
  'Zona rurală',
  'Zona mixtă (comercial + rezidențial)',
  'Zona izolată',
] as const

// ============================================
// ACCESIBILITATE
// ============================================
export const ACCESIBILITATE = [
  'Ridicată (pe arteră principală, vizibilitate bună)',
  'Medie (pe stradă secundară)',
  'Scăzută (acces limitat, zonă retrasă)',
] as const

// ============================================
// CĂI DE ACCES (multi-select)
// ============================================
export const CAI_ACCES = ['Auto', 'Pietonal', 'Feroviar', 'Fluvial / Maritim'] as const

// ============================================
// POSIBILITATE DISIMULARE / FUGĂ
// ============================================
export const POSIBILITATE_DISIMULARE = ['Scăzută', 'Medie', 'Ridicată'] as const

// ============================================
// NIVEL AMENINȚĂRI
// ============================================
export const NIVEL_AMENINTARI = ['Scăzut', 'Mediu', 'Ridicat', 'Foarte ridicat'] as const

// ============================================
// VECINĂTĂȚI (multi-select)
// ============================================
export const VECINATATI = [
  'Locuințe / Blocuri',
  'Spații comerciale',
  'Birouri',
  'Spații industriale',
  'Teren viran',
  'Zonă verde / Parc',
  'Drum național / Autostradă',
  'Cale ferată',
  'Apă (râu, lac)',
  'Instituții publice',
  'Unități militare / Poliție',
  'Stație de carburanți',
  'Bar / Club / Cazino',
  'Școli / Grădinițe',
  'Piață / Centru comercial',
] as const

// ============================================
// REGIM ACTIVITATE
// ============================================
export const REGIM_ACTIVITATE = [
  'Doar zi (08:00-18:00)',
  'Extins (06:00-22:00)',
  'Non-stop (24/24)',
  'Mixt (zi și noapte)',
  'Sezonier',
  'Doar în zilele lucrătoare',
  'Inclusiv weekend',
] as const

// ============================================
// FLUX PERSOANE
// ============================================
export const FLUX_PERSOANE = [
  'Scăzut (sub 10 pers/zi)',
  'Mediu (10-50 pers/zi)',
  'Ridicat (50-200 pers/zi)',
  'Foarte ridicat (peste 200 pers/zi)',
] as const

// ============================================
// FLUX BUNURI / VALORI
// ============================================
export const FLUX_BUNURI = [
  'Absent (fără transport valori)',
  'Scăzut (ocazional, bunuri de mică valoare)',
  'Mediu (transport periodic, valori moderate)',
  'Ridicat (transport frecvent, valori semnificative)',
  'Foarte ridicat (transport zilnic, numerar/valori mari)',
] as const

// ============================================
// ZONE FUNCȚIONALE (multi-select)
// ============================================
export const ZONE_FUNCTIONALE = [
  'Zonă de acces și zonă perimetrală',
  'Zonă publică / recepție',
  'Zonă de tranzacționare',
  'Zonă de depozitare',
  'Zonă casierie / valori',
  'Zonă administrativă / birouri',
  'Zonă tehnică (cameră servere, HVAC)',
  'Zonă de producție',
  'Zonă de încărcare / descărcare',
  'Zonă de parcare',
  'Zonă restricționată',
] as const

// ============================================
// BUNURI ȘI VALORI (multi-select)
// ============================================
export const BUNURI_VALORI = [
  'Numerar în casierie',
  'Documente sensibile/confidențiale',
  'Bunuri de valoare mare',
  'Echipamente IT / Servere',
  'Baze de date cu informații personale',
  'Mărfuri cu valoare ridicată',
  'Metale prețioase / Bijuterii',
  'Medicamente / Substanțe controlate',
  'Arme / Muniție',
  'Opere de artă',
] as const

// ============================================
// SISTEME TEHNICE EXISTENTE (multi-select)
// ============================================
export const SISTEME_TEHNICE = [
  'Sistem control acces electronic',
  'Sistem alarmare antiefracție',
  'Sistem supraveghere video (CCTV)',
  'Sistem detecție incendiu',
  'Sistem de iluminat de securitate',
  'Sistem interfon / videointerfon',
  'Seif / Cameră tezaur',
  'Grilaje / Rulouri metalice',
  'Uși antiefracție',
  'Geamuri securizate',
  'Barieră auto',
  'Stâlpi anti-ram',
  'Nu sunt identificate sisteme tehnice',
] as const

// ============================================
// SURSE DE RISC / AMENINȚĂRI (replaces ACTIVITATI + PERICOLE)
// ============================================
export const AMENINTARI = [
  { value: 'furt_intern', label: 'Furt intern (personal)', categorie: 'persoane', icon: '👤' },
  { value: 'furt_extern', label: 'Furt extern (terți)', categorie: 'bunuri', icon: '🏴' },
  { value: 'talhar_jaf', label: 'Tâlhărie / Jaf', categorie: 'persoane', icon: '⚠️' },
  {
    value: 'acces_neautorizat',
    label: 'Acces neautorizat în spații restricționate',
    categorie: 'structura',
    icon: '🚪',
  },
  {
    value: 'vandalism',
    label: 'Vandalism / Distrugeri intenționate',
    categorie: 'bunuri',
    icon: '💥',
  },
  { value: 'incendiu', label: 'Incendiu', categorie: 'structura', icon: '🔥' },
  {
    value: 'agresiuni',
    label: 'Agresiuni asupra personalului/clienților',
    categorie: 'persoane',
    icon: '🤕',
  },
  {
    value: 'spionaj',
    label: 'Spionaj industrial / Sustragere informații',
    categorie: 'informatii',
    icon: '🕵️',
  },
  { value: 'terorism', label: 'Amenințări teroriste / Atacuri', categorie: 'persoane', icon: '🚨' },
  {
    value: 'gestiune',
    label: 'Riscuri interne de gestiune / Complicitate',
    categorie: 'organizatoric',
    icon: '🤝',
  },
  {
    value: 'informatii',
    label: 'Riscuri legate de informații / Documente',
    categorie: 'informatii',
    icon: '📄',
  },
  {
    value: 'obligatii_paza',
    label: 'Riscuri de neîndeplinire a obligațiilor de pază',
    categorie: 'organizatoric',
    icon: '👮',
  },
  {
    value: 'program_noapte',
    label: 'Riscuri operaționale de program de noapte / Personal redus',
    categorie: 'organizatoric',
    icon: '🌙',
  },
  {
    value: 'frauda_electronica',
    label: 'Fraudă electronică / Skimming',
    categorie: 'bunuri',
    icon: '💳',
  },
  {
    value: 'dezastre',
    label: 'Dezastre naturale (inundație, cutremur)',
    categorie: 'structura',
    icon: '🌊',
  },
  {
    value: 'sabotaj',
    label: 'Sabotaj / Distrugere intenționată utilități',
    categorie: 'structura',
    icon: '⚡',
  },
  { value: 'amenintare_bomba', label: 'Amenințare cu bombă', categorie: 'persoane', icon: '💣' },
  { value: 'protest', label: 'Protest / Tulburări civile', categorie: 'persoane', icon: '📢' },
  { value: 'custom', label: 'Altă amenințare...', categorie: 'custom', icon: '✏️' },
] as const

// ============================================
// CONSECINȚE (per risk — multi-select)
// ============================================
export const CONSECINTE_PERSOANE = [
  'Deces',
  'Vătămare corporală gravă',
  'Vătămare corporală ușoară',
  'Stres psihologic / Traumă',
  'Lipsire de libertate',
  'Nu sunt consecințe directe asupra persoanelor',
] as const

export const CONSECINTE_BUNURI = [
  'Pierdere totală bunuri/valori',
  'Deteriorare parțială bunuri',
  'Pierdere numerar',
  'Pierdere stocuri/marfă',
  'Nu sunt consecințe directe asupra bunurilor',
] as const

export const CONSECINTE_ACTIVITATE = [
  'Întrerupere completă activitate',
  'Întrerupere parțială activitate',
  'Pierdere clienți / Reputație',
  'Sancțiuni legale / Amenzi',
  'Nu sunt consecințe directe asupra activității',
] as const

// ============================================
// MĂSURI DE PROTECȚIE MECANOFIZICĂ
// ============================================
export const MASURI_MECANOFIZICE = [
  { value: 'pereti_rezistenti', label: 'Pereți exteriori rezistenți la efracție' },
  { value: 'compartimentari', label: 'Compartimentări interioare rezistente la efracție' },
  { value: 'pereti_intariti', label: 'Pereți întăriți cameră de valori/tehnică' },
  { value: 'usa_antiefractie', label: 'Ușă principală antiefracție' },
  { value: 'usa_secundara', label: 'Ușă secundară/serviciu antiefracție' },
  { value: 'usa_metalica', label: 'Ușă metalică certificată spații valori' },
  { value: 'broaste_multipunct', label: 'Broaște multipunct / Cilindri siguranță' },
  { value: 'zavoare', label: 'Zăvoare și sisteme suplimentare blocare' },
  { value: 'geam_securizat', label: 'Geam securizat rezistent la efracție' },
  { value: 'geam_laminat', label: 'Geam laminat antiefracție' },
  { value: 'folie_antiefractie', label: 'Folie antiefracție certificată' },
  { value: 'grilaje_fixe', label: 'Grilaje metalice fixe' },
  { value: 'grilaje_mobile', label: 'Grilaje metalice mobile' },
  { value: 'rulouri_metalice', label: 'Rulouri metalice exterioare' },
  { value: 'obloane', label: 'Obloane metalice de protecție' },
  { value: 'poarta_metalica', label: 'Poartă metalică securizată' },
  { value: 'stalpi_anti_ram', label: 'Stâlpi anti-ram' },
  { value: 'separatoare', label: 'Separatoare fizice protejare intrare' },
] as const

// ============================================
// MĂSURI CONTROL ACCES
// ============================================
export const MASURI_CONTROL_ACCES = [
  { value: 'control_usa_principala', label: 'Control acces ușă principală' },
  { value: 'control_camera_tehnica', label: 'Control acces cameră tehnică' },
  { value: 'drepturi_diferentiate', label: 'Drepturi diferențiate pe utilizatori/intervale orare' },
  { value: 'antipassback', label: 'Antipassback' },
  { value: 'video_interfon', label: 'Video-interfon' },
  { value: 'cititor_card', label: 'Cititoare de card/proximitate' },
  { value: 'tastatura_cod', label: 'Tastatură cod acces' },
  { value: 'biometric', label: 'Sistem biometric (amprentă, facial)' },
] as const

// ============================================
// MĂSURI ALARMARE
// ============================================
export const MASURI_ALARMARE = [
  { value: 'detector_pir', label: 'Detector PIR interior' },
  { value: 'detector_volumetric', label: 'Detector volumetric tavan 360°' },
  { value: 'detector_vibratii', label: 'Detector vibrații' },
  { value: 'detector_geam', label: 'Detector geam spart inerțial' },
  { value: 'contact_magnetic', label: 'Contact magnetic ușă/fereastră/rulou' },
  { value: 'detector_smulgere', label: 'Detector smulgere/tamper' },
  { value: 'buton_panica', label: 'Buton panică' },
  { value: 'sirena_interior', label: 'Sirenă interior' },
  { value: 'sirena_exterior', label: 'Sirenă exterior cu flash' },
  { value: 'dispecerat', label: 'Conexiune dispecerat monitorizare' },
] as const

// ============================================
// MĂSURI CCTV
// ============================================
export const MASURI_CCTV = [
  { value: 'camere_fixe', label: 'Camere fixe interior' },
  { value: 'camere_varifocale', label: 'Camere varifocale' },
  { value: 'camere_exterior', label: 'Camere exterior (IP66/IR)' },
  { value: 'camere_vandal', label: 'Camere cu protecție vandal' },
  { value: 'camere_accesuri', label: 'Camere dedicate accesurilor' },
  { value: 'nvr_dedicat', label: 'NVR/DVR dedicat supraveghere' },
  { value: 'stocare_30_zile', label: 'Stocare minim 30 zile' },
  { value: 'vizualizare_remote', label: 'Vizualizare remotă (app/web)' },
  { value: 'afis_gdpr', label: 'Afiș informare supraveghere video (GDPR)' },
  { value: 'procedura_export', label: 'Procedură export imagini incidente' },
] as const

// ============================================
// PAZĂ UMANĂ
// ============================================
export const PAZA_UMANA = [
  { value: 'paza_24', label: 'Pază permanentă 24/24' },
  { value: 'paza_noapte', label: 'Pază doar pe timp de noapte' },
  { value: 'paza_zi', label: 'Pază doar pe timp de zi' },
  { value: 'paza_weekend', label: 'Pază suplimentară weekend' },
  { value: 'ronduire', label: 'Ronduire / Patrulare' },
  { value: 'interventie_rapida', label: 'Echipaj intervenție rapidă' },
  { value: 'dispecerat_non_stop', label: 'Dispecerat monitorizare non-stop' },
] as const

// ============================================
// MĂSURI ORGANIZATORICE (securitate fizică)
// ============================================
export const MASURI_ORGANIZATORICE = [
  { value: 'procedura_deschidere', label: 'Procedură deschidere/închidere obiectiv' },
  { value: 'procedura_vizitatori', label: 'Procedură acces vizitatori' },
  { value: 'procedura_numerar', label: 'Procedură manipulare numerar' },
  { value: 'procedura_panica', label: 'Procedură panică/jaf/amenințare' },
  { value: 'procedura_politie', label: 'Procedură apelare forțe de ordine' },
  { value: 'procedura_evacuare', label: 'Procedură evacuare' },
  { value: 'procedura_video', label: 'Procedură acces la imagini video' },
  { value: 'procedura_testare', label: 'Procedură testare periodică sisteme' },
  { value: 'procedura_mentenanta', label: 'Procedură service/mentenanță' },
  { value: 'registru_vizitatori', label: 'Registru vizitatori' },
  { value: 'registru_chei', label: 'Registru chei' },
  { value: 'instructaj_personal', label: 'Instructaj periodic personal' },
  { value: 'verificare_personal', label: 'Verificare personal nou' },
  { value: 'audit_intern', label: 'Audit intern securitate' },
  { value: 'audit_extern', label: 'Audit extern securitate' },
] as const

// ============================================
// MĂSURI ASIGURĂRI
// ============================================
export const MASURI_ASIGURARI = [
  { value: 'asigurare_bunuri', label: 'Asigurare bunuri și valori (furt, jaf, distrugere)' },
  { value: 'asigurare_rc_pro', label: 'Asigurare răspundere civilă profesională' },
  { value: 'asigurare_cladire', label: 'Asigurare clădire și conținut (incendiu, dezastre)' },
  { value: 'asigurare_rc_terti', label: 'Asigurare răspundere civilă față de terți' },
  { value: 'asigurare_viata', label: 'Asigurare de viață și accidente personal' },
] as const

// ============================================
// SCALE EVALUARE
// ============================================
export const SCALA_PROBABILITATE = [
  {
    value: 1,
    label: 'Foarte scăzută',
    descriere: 'Extrem de improbabil (o dată la >10 ani)',
    color: '#22c55e',
  },
  { value: 2, label: 'Scăzută', descriere: 'Improbabil (o dată la 5-10 ani)', color: '#84cc16' },
  { value: 3, label: 'Medie', descriere: 'Posibil (o dată la 1-5 ani)', color: '#eab308' },
  {
    value: 4,
    label: 'Ridicată',
    descriere: 'Probabil (o dată pe an sau mai des)',
    color: '#f97316',
  },
  {
    value: 5,
    label: 'Foarte ridicată',
    descriere: 'Aproape sigur (de mai multe ori pe an)',
    color: '#ef4444',
  },
] as const

export const SCALA_IMPACT = [
  {
    value: 1,
    label: 'Foarte scăzut',
    descriere: 'Pierderi minore, fără impact asupra persoanelor',
    color: '#22c55e',
  },
  {
    value: 2,
    label: 'Scăzut',
    descriere: 'Pierderi limitate, impact minor asupra activității',
    color: '#84cc16',
  },
  {
    value: 3,
    label: 'Mediu',
    descriere: 'Pierderi moderate, perturbarea temporară a activității',
    color: '#eab308',
  },
  {
    value: 4,
    label: 'Ridicat',
    descriere: 'Pierderi semnificative, afectare gravă a persoanelor/activității',
    color: '#f97316',
  },
  {
    value: 5,
    label: 'Foarte ridicat',
    descriere: 'Pierderi totale, pericol de viață, oprire activitate',
    color: '#ef4444',
  },
] as const

export const PROBABILITATE_LABELS: readonly string[] = SCALA_PROBABILITATE.map((s) => s.label)
export const IMPACT_LABELS: readonly string[] = SCALA_IMPACT.map((s) => s.label)
/** @deprecated Use IMPACT_LABELS */
export const SEVERITATE_LABELS = IMPACT_LABELS

// ============================================
// NIVEL RISC — 3 levels (per Instrucțiunile M.A.I. nr. 9/2013)
// ============================================
export const NIVEL_RISC = {
  scazut: { min: 1, max: 4, label: 'Scăzut', color: '#22c55e', bgColor: '#D1FAE5' },
  mediu: { min: 5, max: 12, label: 'Mediu', color: '#eab308', bgColor: '#FEF3C7' },
  ridicat: { min: 13, max: 25, label: 'Ridicat', color: '#ef4444', bgColor: '#FEE2E2' },
} as const

export const getNivelRisc = (scor: number) => {
  if (scor <= 4) return NIVEL_RISC.scazut
  if (scor <= 12) return NIVEL_RISC.mediu
  return NIVEL_RISC.ridicat
}

// ============================================
// MATRICE RISC 5×5 (for visual grid)
// ============================================
// Row = Probabilitate (5 at top, 1 at bottom)
// Col = Impact (1 at left, 5 at right)
export const MATRICE_RISC = [
  [5, 10, 15, 20, 25], // P=5
  [4, 8, 12, 16, 20], // P=4
  [3, 6, 9, 12, 15], // P=3
  [2, 4, 6, 8, 10], // P=2
  [1, 2, 3, 4, 5], // P=1
]

export const MATRICE_COLORS: Record<number, string> = {
  1: '#D1FAE5',
  2: '#D1FAE5',
  3: '#D1FAE5',
  4: '#D1FAE5',
  5: '#FEF3C7',
  6: '#FEF3C7',
  8: '#FED7AA',
  9: '#FED7AA',
  10: '#FED7AA',
  12: '#FED7AA',
  15: '#FEE2E2',
  16: '#FEE2E2',
  20: '#FEE2E2',
  25: '#FEE2E2',
}

export const getRiskLevel = (probabilitate: number, impact: number) => {
  const score = probabilitate * impact
  if (score >= 13) return 'ridicat'
  if (score >= 5) return 'mediu'
  return 'scazut'
}

export const getRiskColor = (level: string) => {
  switch (level) {
    case 'ridicat':
      return {
        bg: 'bg-error-600',
        text: 'text-white',
        border: 'border-error-600',
        light: 'bg-error-50 text-error-700',
      }
    case 'mediu':
      return {
        bg: 'bg-warning-500',
        text: 'text-white',
        border: 'border-warning-500',
        light: 'bg-warning-50 text-warning-700',
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
// DOCUMENTE SUPORT (replaces DOCUMENTE_SSM)
// ============================================
export const DOCUMENTE_SUPORT = [
  { value: 'chestionar', label: 'Chestionar conducător unitate', descriere: '' },
  { value: 'declaratii', label: 'Declarații reprezentant beneficiar', descriere: '' },
  { value: 'contracte_paza', label: 'Contracte servicii pază/monitorizare', descriere: '' },
  { value: 'contracte_mentenanta', label: 'Contracte mentenanță', descriere: '' },
  { value: 'certificate', label: 'Certificate echipamente', descriere: '' },
  { value: 'documente_punere', label: 'Documente procurare/punere în funcțiune', descriere: '' },
  { value: 'verificari', label: 'Verificări funcționale', descriere: '' },
  { value: 'fotografii', label: 'Fotografii/schițe de teren', descriere: '' },
  { value: 'alte_date', label: 'Alte date culese în procedura de evaluare', descriere: '' },
] as const

// ============================================
// CADRU LEGAL (checkboxes — pre-selected items)
// ============================================
export const CADRU_LEGAL = [
  {
    value: 'legea_333',
    label:
      'Legea 333/2003 (republicată) — Paza obiectivelor, bunurilor, valorilor și protecția persoanelor',
    checked: true,
  },
  { value: 'hg_301', label: 'HG 301/2012 — Norme de aplicare a Legii 333/2003', checked: true },
  {
    value: 'instr_9',
    label: 'Instrucțiunile M.A.I. nr. 9/2013 — Efectuarea analizelor de risc la securitatea fizică',
    checked: true,
  },
  { value: 'legea_307', label: 'Legea 307/2006 — Apărarea împotriva incendiilor', checked: false },
  {
    value: 'gdpr',
    label: 'Regulamentul (UE) 2016/679 (GDPR) — Protecția datelor personale',
    checked: false,
  },
  {
    value: 'legea_190',
    label: 'Legea 190/2018 — Măsuri de punere în aplicare a GDPR',
    checked: false,
  },
  {
    value: 'legea_319',
    label: 'Legea 319/2006 — Securitatea și sănătatea în muncă',
    checked: false,
  },
] as const

export const SECTIUNI_NAVIGARE = [
  { id: 'proiect-section', number: 1, label: 'Date Identificare' },
  { id: 'evaluator-section', number: 2, label: 'Evaluator & Metodă' },
  { id: 'obiectiv-section', number: 3, label: 'Amplasare & Factori Externi' },
  { id: 'cadru-organizational-section', number: 4, label: 'Cadru Organizațional' },
  { id: 'riscuri-section', number: 5, label: 'Surse de Risc' },
  { id: 'sumar-section', number: 6, label: 'Sumar Riscuri' },
  { id: 'masuri-section', number: 7, label: 'Măsuri & Mecanisme' },
  { id: 'concluzii-section', number: 8, label: 'Concluzii' },
  { id: 'aprobare-section', number: 9, label: 'Semnături & Asumare' },
  { id: 'documente-section', number: 10, label: 'Documente Suport' },
  { id: 'export-section', number: 11, label: 'Export' },
] as const
