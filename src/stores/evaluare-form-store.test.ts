import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useEvaluareFormStore } from './evaluare-form-store'

// Reset store to clean slate between tests using setState directly for test isolation.
const resetStore = () => {
  useEvaluareFormStore.setState({ evaluareDataMap: {}, evaluareRiscuriMap: {} })
}

beforeEach(resetStore)
afterEach(resetStore)

describe('useEvaluareFormStore', () => {
  // ─── Initial state ─────────────────────────────────────────────────────────

  it('starts with an empty evaluareDataMap', () => {
    expect(useEvaluareFormStore.getState().evaluareDataMap).toEqual({})
  })

  it('starts with an empty evaluareRiscuriMap', () => {
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap).toEqual({})
  })

  // ─── setField ──────────────────────────────────────────────────────────────

  it('setField stores a string value for a new evaluare', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Test Project')
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.denumireProiect).toBe(
      'Test Project',
    )
  })

  it('setField merges new key with existing data (does not wipe other keys)', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Project A')
    useEvaluareFormStore.getState().setField('eval-1', 'adresaLocatie', 'Str. Test 1')
    const data = useEvaluareFormStore.getState().evaluareDataMap['eval-1']
    expect(data?.denumireProiect).toBe('Project A')
    expect(data?.adresaLocatie).toBe('Str. Test 1')
  })

  it('setField overwrites the same key when called again', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Old Name')
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'New Name')
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.denumireProiect).toBe(
      'New Name',
    )
  })

  it('setField stores null values (clears a field)', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Some Value')
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', null)
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.denumireProiect).toBeNull()
  })

  it('setField stores empty string values', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', '')
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.denumireProiect).toBe('')
  })

  it('setField stores boolean false', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'checked', false)
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.checked).toBe(false)
  })

  it('setField stores numeric zero', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'count', 0)
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.count).toBe(0)
  })

  it('setField keeps independent data per evaluare ID', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Project One')
    useEvaluareFormStore.getState().setField('eval-2', 'denumireProiect', 'Project Two')
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.denumireProiect).toBe(
      'Project One',
    )
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-2']?.denumireProiect).toBe(
      'Project Two',
    )
  })

  it('setField for one evaluare ID does not affect another', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Project One')
    useEvaluareFormStore.getState().setField('eval-2', 'beneficiar', 'Company X')
    // eval-1 should not have 'beneficiar'
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.beneficiar).toBeUndefined()
    // eval-2 should not have 'denumireProiect'
    expect(
      useEvaluareFormStore.getState().evaluareDataMap['eval-2']?.denumireProiect,
    ).toBeUndefined()
  })

  // ─── setFields ─────────────────────────────────────────────────────────────

  it('setFields stores multiple keys at once', () => {
    useEvaluareFormStore.getState().setFields('eval-1', {
      denumireProiect: 'Test',
      adresaLocatie: 'Str. 1',
      beneficiar: 'Ben SRL',
    })
    const data = useEvaluareFormStore.getState().evaluareDataMap['eval-1']
    expect(data?.denumireProiect).toBe('Test')
    expect(data?.adresaLocatie).toBe('Str. 1')
    expect(data?.beneficiar).toBe('Ben SRL')
  })

  it('setFields merges with existing data without wiping prior keys', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'beneficiar', 'Existing Beneficiar')
    useEvaluareFormStore.getState().setFields('eval-1', { denumireProiect: 'New Project' })
    const data = useEvaluareFormStore.getState().evaluareDataMap['eval-1']
    expect(data?.denumireProiect).toBe('New Project')
    expect(data?.beneficiar).toBe('Existing Beneficiar')
  })

  it('setFields overwrites keys that already exist', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Old')
    useEvaluareFormStore.getState().setFields('eval-1', { denumireProiect: 'New' })
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.denumireProiect).toBe('New')
  })

  it('setFields with empty object is a no-op for existing data', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Project')
    useEvaluareFormStore.getState().setFields('eval-1', {})
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.denumireProiect).toBe(
      'Project',
    )
  })

  // ─── getFormData ───────────────────────────────────────────────────────────

  it('getFormData returns stored data for a known evaluare ID', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Test')
    expect(useEvaluareFormStore.getState().getFormData('eval-1').denumireProiect).toBe('Test')
  })

  it('getFormData returns empty object for an unknown evaluare ID', () => {
    expect(useEvaluareFormStore.getState().getFormData('non-existent')).toEqual({})
  })

  it('getFormData reflects subsequent setField calls', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'First')
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Updated')
    expect(useEvaluareFormStore.getState().getFormData('eval-1').denumireProiect).toBe('Updated')
  })

  // ─── setRiscuri ────────────────────────────────────────────────────────────

  it('setRiscuri stores riscuri for an evaluare', () => {
    const riscuri = [{ id: 'r1', activitate: 'Test' }]
    useEvaluareFormStore.getState().setRiscuri('eval-1', riscuri)
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap['eval-1']).toEqual(riscuri)
  })

  it('setRiscuri overwrites existing riscuri (replace semantics, not merge)', () => {
    useEvaluareFormStore.getState().setRiscuri('eval-1', [{ id: 'r1' }])
    const newRiscuri = [{ id: 'r2', activitate: 'New' }]
    useEvaluareFormStore.getState().setRiscuri('eval-1', newRiscuri)
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap['eval-1']).toEqual(newRiscuri)
  })

  it('setRiscuri with empty array clears riscuri', () => {
    useEvaluareFormStore.getState().setRiscuri('eval-1', [{ id: 'r1' }])
    useEvaluareFormStore.getState().setRiscuri('eval-1', [])
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap['eval-1']).toEqual([])
  })

  it('setRiscuri does not affect the evaluareDataMap', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Test')
    useEvaluareFormStore.getState().setRiscuri('eval-1', [{ id: 'r1' }])
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']?.denumireProiect).toBe('Test')
  })

  it('setRiscuri keeps independent riscuri per evaluare ID', () => {
    const riscuri1 = [{ id: 'r1' }]
    const riscuri2 = [{ id: 'r2' }, { id: 'r3' }]
    useEvaluareFormStore.getState().setRiscuri('eval-1', riscuri1)
    useEvaluareFormStore.getState().setRiscuri('eval-2', riscuri2)
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap['eval-1']).toEqual(riscuri1)
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap['eval-2']).toEqual(riscuri2)
  })

  // ─── clearEvaluare ─────────────────────────────────────────────────────────

  it('clearEvaluare removes form data for the specified ID', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Test')
    useEvaluareFormStore.getState().clearEvaluare('eval-1')
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-1']).toBeUndefined()
  })

  it('clearEvaluare removes riscuri for the specified ID', () => {
    useEvaluareFormStore.getState().setRiscuri('eval-1', [{ id: 'r1' }])
    useEvaluareFormStore.getState().clearEvaluare('eval-1')
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap['eval-1']).toBeUndefined()
  })

  it('clearEvaluare does not affect form data of other evaluare IDs', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Project 1')
    useEvaluareFormStore.getState().setField('eval-2', 'denumireProiect', 'Project 2')
    useEvaluareFormStore.getState().clearEvaluare('eval-1')
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-2']?.denumireProiect).toBe(
      'Project 2',
    )
  })

  it('clearEvaluare does not affect riscuri of other evaluare IDs', () => {
    useEvaluareFormStore.getState().setRiscuri('eval-1', [{ id: 'r1' }])
    useEvaluareFormStore.getState().setRiscuri('eval-2', [{ id: 'r2' }])
    useEvaluareFormStore.getState().clearEvaluare('eval-1')
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap['eval-2']).toEqual([{ id: 'r2' }])
  })

  it('clearEvaluare is safe to call on a non-existent ID (no throw)', () => {
    expect(() => useEvaluareFormStore.getState().clearEvaluare('non-existent')).not.toThrow()
  })

  it('getFormData returns empty object after clearEvaluare', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Test')
    useEvaluareFormStore.getState().clearEvaluare('eval-1')
    expect(useEvaluareFormStore.getState().getFormData('eval-1')).toEqual({})
  })

  // ─── Multi-evaluare independence ───────────────────────────────────────────

  it('three concurrent evaluare IDs all have independent data', () => {
    for (const id of ['eval-a', 'eval-b', 'eval-c']) {
      useEvaluareFormStore.getState().setField(id, 'denumireProiect', `Project ${id}`)
    }
    for (const id of ['eval-a', 'eval-b', 'eval-c']) {
      expect(useEvaluareFormStore.getState().evaluareDataMap[id]?.denumireProiect).toBe(
        `Project ${id}`,
      )
    }
  })

  it('clearing the middle evaluare of three does not affect the other two', () => {
    for (const id of ['eval-a', 'eval-b', 'eval-c']) {
      useEvaluareFormStore.getState().setField(id, 'field', id)
    }
    useEvaluareFormStore.getState().clearEvaluare('eval-b')
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-a']?.field).toBe('eval-a')
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-b']).toBeUndefined()
    expect(useEvaluareFormStore.getState().evaluareDataMap['eval-c']?.field).toBe('eval-c')
  })

  it('setField and setRiscuri updates are independent and do not interfere', () => {
    useEvaluareFormStore.getState().setField('eval-1', 'denumireProiect', 'Test')
    useEvaluareFormStore.getState().setRiscuri('eval-1', [{ id: 'r1' }])
    useEvaluareFormStore.getState().setField('eval-1', 'adresaLocatie', 'Str. 1')
    // Data map has both text fields
    const data = useEvaluareFormStore.getState().evaluareDataMap['eval-1']
    expect(data?.denumireProiect).toBe('Test')
    expect(data?.adresaLocatie).toBe('Str. 1')
    // Riscuri map is unaffected by setField calls
    expect(useEvaluareFormStore.getState().evaluareRiscuriMap['eval-1']).toEqual([{ id: 'r1' }])
  })
})
