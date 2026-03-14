import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useEvaluareSyncStore } from './evaluare-sync-store'

// Reset store to initial state before every test
beforeEach(() => {
  useEvaluareSyncStore.getState().reset()
})

// Clean up persisted state after every test so tests don't leak
afterEach(() => {
  useEvaluareSyncStore.getState().reset()
})

describe('useEvaluareSyncStore', () => {
  // ─── Initial state ─────────────────────────────────────────────────────────

  it('starts with isDirty=false', () => {
    expect(useEvaluareSyncStore.getState().isDirty).toBe(false)
  })

  it('starts with isSyncing=false', () => {
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
  })

  it('starts with syncError=null', () => {
    expect(useEvaluareSyncStore.getState().syncError).toBeNull()
  })

  // ─── markDirty ─────────────────────────────────────────────────────────────

  it('markDirty sets isDirty=true', () => {
    useEvaluareSyncStore.getState().markDirty()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
  })

  it('markDirty clears syncError', () => {
    useEvaluareSyncStore.getState().setSyncError('Eroare rețea')
    useEvaluareSyncStore.getState().markDirty()
    expect(useEvaluareSyncStore.getState().syncError).toBeNull()
  })

  it('markDirty is idempotent when already dirty with no error (no redundant re-render)', () => {
    useEvaluareSyncStore.getState().markDirty()
    const stateAfterFirst = useEvaluareSyncStore.getState()
    // markDirty returns the same state object when already dirty + no error
    useEvaluareSyncStore.getState().markDirty()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
    expect(useEvaluareSyncStore.getState().syncError).toBeNull()
    // The state reference should not have changed (optimization guard)
    expect(useEvaluareSyncStore.getState()).toBe(stateAfterFirst)
  })

  it('markDirty is NOT idempotent when already dirty but syncError is set', () => {
    useEvaluareSyncStore.getState().markDirty()
    useEvaluareSyncStore.getState().setSyncError('Server unavailable')
    // markDirty should clear the error even if already dirty
    useEvaluareSyncStore.getState().markDirty()
    expect(useEvaluareSyncStore.getState().syncError).toBeNull()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
  })

  // ─── startSync ─────────────────────────────────────────────────────────────

  it('startSync sets isSyncing=true', () => {
    useEvaluareSyncStore.getState().startSync()
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(true)
  })

  it('startSync clears syncError', () => {
    useEvaluareSyncStore.getState().setSyncError('Previous error')
    useEvaluareSyncStore.getState().startSync()
    expect(useEvaluareSyncStore.getState().syncError).toBeNull()
  })

  it('startSync does not change isDirty', () => {
    useEvaluareSyncStore.getState().markDirty()
    useEvaluareSyncStore.getState().startSync()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
  })

  // ─── finishSync ────────────────────────────────────────────────────────────

  it('finishSync sets isDirty=false', () => {
    useEvaluareSyncStore.getState().markDirty()
    useEvaluareSyncStore.getState().startSync()
    useEvaluareSyncStore.getState().finishSync()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(false)
  })

  it('finishSync sets isSyncing=false', () => {
    useEvaluareSyncStore.getState().startSync()
    useEvaluareSyncStore.getState().finishSync()
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
  })

  it('finishSync clears syncError', () => {
    useEvaluareSyncStore.getState().setSyncError('Error')
    useEvaluareSyncStore.getState().finishSync()
    expect(useEvaluareSyncStore.getState().syncError).toBeNull()
  })

  // ─── setSyncError ──────────────────────────────────────────────────────────

  it('setSyncError stores the error message', () => {
    useEvaluareSyncStore.getState().setSyncError('Connection refused')
    expect(useEvaluareSyncStore.getState().syncError).toBe('Connection refused')
  })

  it('setSyncError sets isSyncing=false', () => {
    useEvaluareSyncStore.getState().startSync()
    useEvaluareSyncStore.getState().setSyncError('Timeout')
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
  })

  it('setSyncError does not change isDirty', () => {
    useEvaluareSyncStore.getState().markDirty()
    useEvaluareSyncStore.getState().setSyncError('Error')
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
  })

  // ─── reset ─────────────────────────────────────────────────────────────────

  it('reset returns all fields to initial state', () => {
    useEvaluareSyncStore.getState().markDirty()
    useEvaluareSyncStore.getState().startSync()
    useEvaluareSyncStore.getState().finishSync()

    useEvaluareSyncStore.getState().reset()

    const s = useEvaluareSyncStore.getState()
    expect(s.isDirty).toBe(false)
    expect(s.isSyncing).toBe(false)
    expect(s.syncError).toBeNull()
  })

  it('reset called on a clean store keeps everything at initial values', () => {
    useEvaluareSyncStore.getState().reset()
    const s = useEvaluareSyncStore.getState()
    expect(s.isDirty).toBe(false)
    expect(s.isSyncing).toBe(false)
    expect(s.syncError).toBeNull()
  })

  // ─── Sync store state bleed (regression for navigation between evaluations) ─

  it('reset removes isDirty from a previous evaluation before loading the next one', () => {
    // Simulate: user edits evaluare A, navigating away resets the store
    useEvaluareSyncStore.getState().markDirty()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)

    // Navigation to evaluare B triggers reset
    useEvaluareSyncStore.getState().reset()

    // B's store starts clean — no false "unsaved changes" badge
    expect(useEvaluareSyncStore.getState().isDirty).toBe(false)
  })

  // ─── Typical full sync lifecycle ──────────────────────────────────────────

  it('progresses correctly through markDirty → startSync → finishSync lifecycle', () => {
    const s = useEvaluareSyncStore.getState()

    s.markDirty()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)

    s.startSync()
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(true)

    s.finishSync()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(false)
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
  })

  it('progresses correctly through markDirty → startSync → setSyncError lifecycle', () => {
    const s = useEvaluareSyncStore.getState()

    s.markDirty()
    s.startSync()
    s.setSyncError('Network error')

    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
    expect(useEvaluareSyncStore.getState().syncError).toBe('Network error')
  })

  // ─── Edge cases and non-happy paths ───────────────────────────────────────

  it('startSync when already syncing keeps isSyncing=true and clears any prior error', () => {
    useEvaluareSyncStore.getState().startSync()
    useEvaluareSyncStore.getState().setSyncError('Stale error')
    useEvaluareSyncStore.getState().startSync() // called again while syncing
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(true)
    expect(useEvaluareSyncStore.getState().syncError).toBeNull()
  })

  it('finishSync without prior startSync still updates state correctly', () => {
    // No startSync called — finishSync should still work
    useEvaluareSyncStore.getState().markDirty()
    useEvaluareSyncStore.getState().finishSync()
    const s = useEvaluareSyncStore.getState()
    expect(s.isDirty).toBe(false)
    expect(s.isSyncing).toBe(false)
  })

  it('markDirty after finishSync re-marks the store as dirty', () => {
    useEvaluareSyncStore.getState().markDirty()
    useEvaluareSyncStore.getState().finishSync()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(false)

    useEvaluareSyncStore.getState().markDirty()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
  })

  it('setSyncError with empty string stores empty string (not null)', () => {
    useEvaluareSyncStore.getState().setSyncError('')
    expect(useEvaluareSyncStore.getState().syncError).toBe('')
  })

  it('setSyncError when not syncing sets isSyncing to false (already false — no-op)', () => {
    // isSyncing is already false; setSyncError should keep it false
    useEvaluareSyncStore.getState().setSyncError('Unexpected error')
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
  })

  it('reset during active sync returns isSyncing to false', () => {
    useEvaluareSyncStore.getState().startSync()
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(true)
    useEvaluareSyncStore.getState().reset()
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
  })

  it('full error-recovery cycle: error → markDirty → startSync → finishSync', () => {
    const s = useEvaluareSyncStore.getState()

    // First sync cycle fails
    s.markDirty()
    s.startSync()
    s.setSyncError('Network timeout')
    expect(useEvaluareSyncStore.getState().syncError).toBe('Network timeout')
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true) // still dirty after error

    // User re-triggers sync after fixing connectivity
    s.markDirty() // clears error
    expect(useEvaluareSyncStore.getState().syncError).toBeNull()

    s.startSync()
    s.finishSync()

    const final = useEvaluareSyncStore.getState()
    expect(final.isDirty).toBe(false)
    expect(final.isSyncing).toBe(false)
    expect(final.syncError).toBeNull()
  })
})
