import type { EvaluareWithRiscuri } from '@/lib/types'

/**
 * Computes a 0–100 percentage indicating how complete the evaluare form is,
 * based on required fields and the presence of at least one risc.
 */
export const computeProgress = (evaluare: EvaluareWithRiscuri): number => {
  // Exclude auto-populated date fields (dataEvaluarii, dataRevizuirii, dataAprobarii)
  // so that a blank new evaluation correctly shows 0% progress.
  const requiredFields: (string | null | undefined)[] = [
    evaluare.denumireProiect,
    evaluare.adresaLocatie,
    evaluare.beneficiar,
    evaluare.antreprenor,
    evaluare.fazaLucrarii,
    evaluare.numeEvaluator,
    evaluare.functieEvaluator,
    evaluare.sefSantier,
    evaluare.responsabilSSM,
  ]
  const filledFields = requiredFields.filter(
    (v) => v !== null && v !== undefined && v !== '',
  ).length

  // Count riscuri as a single required item (1 or more risks needed)
  const hasRiscuri = evaluare.riscuri.length > 0
  const totalItems = requiredFields.length + 1
  const filledItems = filledFields + (hasRiscuri ? 1 : 0)

  return Math.round((filledItems / totalItems) * 100)
}
