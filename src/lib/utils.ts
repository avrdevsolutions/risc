import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS classes intelligently.
 * Handles conditional classes and resolves conflicts.
 *
 * @example
 * cn('px-4 py-2', 'px-6') // => 'py-2 px-6' (px-6 overrides px-4)
 * cn('text-red-500', condition && 'text-blue-500') // => conditional class
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}

/**
 * Safely parses a JSON-encoded string array stored in the database.
 * Returns an empty array if the value is null/undefined or invalid JSON.
 */
export const parseJsonArray = (val: string | null | undefined): string[] => {
  if (!val) return []
  try {
    const parsed: unknown = JSON.parse(val)
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return val ? [val] : []
  }
}

/**
 * Stringifies a value only if it is an array; otherwise returns the value as-is.
 * Used when persisting JSON array fields to the SQLite database.
 */
export const serializeArrayField = (val: unknown): unknown =>
  Array.isArray(val) ? JSON.stringify(val) : val

/**
 * Resolves a raw enum value to its human-readable label from a constants list.
 * Falls back to the raw value if no match is found.
 *
 * @example
 * getLabel('cadere_acelasi_nivel', PERICOLE)
 * // => 'Cădere la același nivel (alunecare/împiedicare)'
 */
export const getLabel = (
  value: string | null | undefined,
  list: ReadonlyArray<{ value: string; label: string } | { value: string; label: string; icon?: string }>,
): string => {
  if (!value) return '—'
  const match = list.find((item) => item.value === value)
  return match ? match.label : value
}
