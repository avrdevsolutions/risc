import { describe, expect, it } from 'vitest'

import { cn, getLabel, parseJsonArray, serializeArrayField } from './utils'

describe('parseJsonArray', () => {
  // ─── Happy path ────────────────────────────────────────────────────────────

  it('parses a valid JSON array of strings', () => {
    expect(parseJsonArray('["a","b","c"]')).toEqual(['a', 'b', 'c'])
  })

  it('parses an empty JSON array', () => {
    expect(parseJsonArray('[]')).toEqual([])
  })

  it('parses an array of numbers', () => {
    expect(parseJsonArray('[1,2,3]')).toEqual([1, 2, 3])
  })

  it('parses an array with a single element', () => {
    expect(parseJsonArray('["only"]')).toEqual(['only'])
  })

  // ─── Null / undefined / empty ─────────────────────────────────────────────

  it('returns empty array for null', () => {
    expect(parseJsonArray(null)).toEqual([])
  })

  it('returns empty array for undefined', () => {
    expect(parseJsonArray(undefined)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(parseJsonArray('')).toEqual([])
  })

  // ─── Invalid JSON ─────────────────────────────────────────────────────────

  it('returns [val] for an invalid JSON non-empty string (graceful fallback)', () => {
    // The function falls back to [val] when JSON.parse throws a SyntaxError
    expect(parseJsonArray('not-json')).toEqual(['not-json'])
  })

  it('returns [val] for complex malformed JSON (unbalanced braces)', () => {
    expect(parseJsonArray('{unclosed')).toEqual(['{unclosed'])
  })

  it('returns [val] for a plain comma-separated string (not JSON)', () => {
    expect(parseJsonArray('alpha,beta')).toEqual(['alpha,beta'])
  })

  // ─── JSON non-array types ─────────────────────────────────────────────────

  it('returns empty array for a JSON object', () => {
    expect(parseJsonArray('{"key":"value"}')).toEqual([])
  })

  it('returns empty array for a JSON string literal', () => {
    expect(parseJsonArray('"hello"')).toEqual([])
  })

  it('returns empty array for a JSON number', () => {
    expect(parseJsonArray('42')).toEqual([])
  })

  it('returns empty array for JSON boolean true', () => {
    expect(parseJsonArray('true')).toEqual([])
  })

  it('returns empty array for JSON null literal', () => {
    expect(parseJsonArray('null')).toEqual([])
  })
})

describe('serializeArrayField', () => {
  // ─── Arrays ───────────────────────────────────────────────────────────────

  it('serializes an array to a JSON string', () => {
    expect(serializeArrayField(['a', 'b', 'c'])).toBe('["a","b","c"]')
  })

  it('serializes an empty array to an empty JSON array string', () => {
    expect(serializeArrayField([])).toBe('[]')
  })

  it('serializes a nested array to JSON', () => {
    expect(serializeArrayField([1, 2, 3])).toBe('[1,2,3]')
  })

  // ─── Non-array values pass through unchanged ──────────────────────────────

  it('returns a string value as-is', () => {
    expect(serializeArrayField('hello')).toBe('hello')
  })

  it('returns an empty string as-is', () => {
    expect(serializeArrayField('')).toBe('')
  })

  it('returns null as-is', () => {
    expect(serializeArrayField(null)).toBeNull()
  })

  it('returns undefined as-is', () => {
    expect(serializeArrayField(undefined)).toBeUndefined()
  })

  it('returns a number as-is', () => {
    expect(serializeArrayField(42)).toBe(42)
  })

  it('returns boolean false as-is', () => {
    expect(serializeArrayField(false)).toBe(false)
  })

  it('returns boolean true as-is', () => {
    expect(serializeArrayField(true)).toBe(true)
  })

  it('returns a plain object as-is (not serialized)', () => {
    const obj = { key: 'value' }
    expect(serializeArrayField(obj)).toBe(obj)
  })
})

describe('getLabel', () => {
  const ITEMS = [
    { value: 'draft', label: 'Ciornă' },
    { value: 'final', label: 'Final' },
    { value: 'archived', label: 'Arhivat' },
  ]

  // ─── Happy path ────────────────────────────────────────────────────────────

  it('returns the label for a matching value', () => {
    expect(getLabel('draft', ITEMS)).toBe('Ciornă')
  })

  it('returns the label for the second item', () => {
    expect(getLabel('final', ITEMS)).toBe('Final')
  })

  it('returns the label for the last item in the list', () => {
    expect(getLabel('archived', ITEMS)).toBe('Arhivat')
  })

  // ─── No match ─────────────────────────────────────────────────────────────

  it('returns the raw value when no match is found', () => {
    expect(getLabel('unknown', ITEMS)).toBe('unknown')
  })

  it('returns a raw value that looks like a real value but has different case', () => {
    // case-sensitive: 'Draft' !== 'draft'
    expect(getLabel('Draft', ITEMS)).toBe('Draft')
  })

  // ─── Null / empty / undefined ─────────────────────────────────────────────

  it('returns "—" for null', () => {
    expect(getLabel(null, ITEMS)).toBe('—')
  })

  it('returns "—" for undefined', () => {
    expect(getLabel(undefined, ITEMS)).toBe('—')
  })

  it('returns "—" for empty string', () => {
    expect(getLabel('', ITEMS)).toBe('—')
  })

  // ─── Empty list ───────────────────────────────────────────────────────────

  it('returns the raw value when given a non-null input and an empty list', () => {
    expect(getLabel('draft', [])).toBe('draft')
  })

  // ─── Items with icon field ────────────────────────────────────────────────

  it('finds a match in a list that includes items with an optional icon field', () => {
    const withIcons = [
      { value: 'low', label: 'Scăzut', icon: '🟢' },
      { value: 'high', label: 'Ridicat', icon: '🔴' },
    ]
    expect(getLabel('high', withIcons)).toBe('Ridicat')
  })
})

describe('cn', () => {
  // ─── Basic concatenation ──────────────────────────────────────────────────

  it('concatenates two distinct class names', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center')
  })

  it('returns a single class name unchanged', () => {
    expect(cn('flex')).toBe('flex')
  })

  // ─── Tailwind conflict resolution ─────────────────────────────────────────

  it('resolves a Tailwind conflict: last padding wins', () => {
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('resolves a Tailwind conflict: last font-size wins', () => {
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  // ─── Falsy conditionals ───────────────────────────────────────────────────

  it('drops a false conditional class', () => {
    expect(cn('flex', false && 'hidden', 'items-center')).toBe('flex items-center')
  })

  it('drops undefined inputs gracefully', () => {
    expect(cn('flex', undefined, 'items-center')).toBe('flex items-center')
  })

  it('drops null inputs gracefully', () => {
    expect(cn('flex', null, 'items-center')).toBe('flex items-center')
  })

  // ─── Edge cases ───────────────────────────────────────────────────────────

  it('handles an empty call with no arguments', () => {
    expect(cn()).toBe('')
  })

  it('deduplicates identical class names', () => {
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    expect(cn('flex', 'flex')).toBe('flex')
  })

  it('handles an empty string argument', () => {
    expect(cn('flex', '', 'items-center')).toBe('flex items-center')
  })
})
