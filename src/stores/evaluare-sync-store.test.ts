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

  it('starts with lastSyncedAt=null', () => {
    expect(useEvaluareSyncStore.getState().lastSyncedAt).toBeNull()
  })

  it('starts with conflictDbUpdatedAt=null', () => {
    expect(useEvaluareSyncStore.getState().conflictDbUpdatedAt).toBeNull()
  })

  it('starts with showConflictDialog=false', () => {
    expect(useEvaluareSyncStore.getState().showConflictDialog).toBe(false)
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
    useEvaluareSyncStore.getState().finishSync('2026-03-14T12:00:00.000Z')
    expect(useEvaluareSyncStore.getState().isDirty).toBe(false)
  })

  it('finishSync sets isSyncing=false', () => {
    useEvaluareSyncStore.getState().startSync()
    useEvaluareSyncStore.getState().finishSync('2026-03-14T12:00:00.000Z')
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
  })

  it('finishSync stores the timestamp in lastSyncedAt', () => {
    const ts = '2026-03-14T12:34:56.000Z'
    useEvaluareSyncStore.getState().finishSync(ts)
    expect(useEvaluareSyncStore.getState().lastSyncedAt).toBe(ts)
  })

  it('finishSync clears syncError', () => {
    useEvaluareSyncStore.getState().setSyncError('Error')
    useEvaluareSyncStore.getState().finishSync('2026-03-14T12:00:00.000Z')
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
    useEvaluareSyncStore.getState().finishSync('2026-03-14T12:00:00.000Z')
    useEvaluareSyncStore.getState().setConflictDetected('2026-03-14T13:00:00.000Z')

    useEvaluareSyncStore.getState().reset()

    const s = useEvaluareSyncStore.getState()
    expect(s.isDirty).toBe(false)
    expect(s.isSyncing).toBe(false)
    expect(s.syncError).toBeNull()
    expect(s.lastSyncedAt).toBeNull()
    expect(s.conflictDbUpdatedAt).toBeNull()
    expect(s.showConflictDialog).toBe(false)
  })

  it('reset called on a clean store keeps everything at initial values', () => {
    useEvaluareSyncStore.getState().reset()
    const s = useEvaluareSyncStore.getState()
    expect(s.isDirty).toBe(false)
    expect(s.isSyncing).toBe(false)
    expect(s.syncError).toBeNull()
    expect(s.lastSyncedAt).toBeNull()
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

  it('reset removes lastSyncedAt from a previous evaluation so conflict detection is fresh', () => {
    useEvaluareSyncStore.getState().finishSync('2026-03-14T10:00:00.000Z')
    expect(useEvaluareSyncStore.getState().lastSyncedAt).toBe('2026-03-14T10:00:00.000Z')

    useEvaluareSyncStore.getState().reset()

    // Conflict detection on new evaluation compares against null, not the old timestamp
    expect(useEvaluareSyncStore.getState().lastSyncedAt).toBeNull()
  })

  // ─── setConflictDetected ───────────────────────────────────────────────────

  it('setConflictDetected stores the DB timestamp', () => {
    const dbTs = '2026-03-14T15:00:00.000Z'
    useEvaluareSyncStore.getState().setConflictDetected(dbTs)
    expect(useEvaluareSyncStore.getState().conflictDbUpdatedAt).toBe(dbTs)
  })

  it('setConflictDetected opens the conflict dialog', () => {
    useEvaluareSyncStore.getState().setConflictDetected('2026-03-14T15:00:00.000Z')
    expect(useEvaluareSyncStore.getState().showConflictDialog).toBe(true)
  })

  it('setConflictDetected sets isSyncing=false', () => {
    useEvaluareSyncStore.getState().startSync()
    useEvaluareSyncStore.getState().setConflictDetected('2026-03-14T15:00:00.000Z')
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
  })

  // ─── clearConflict ─────────────────────────────────────────────────────────

  it('clearConflict closes the conflict dialog', () => {
    useEvaluareSyncStore.getState().setConflictDetected('2026-03-14T15:00:00.000Z')
    useEvaluareSyncStore.getState().clearConflict()
    expect(useEvaluareSyncStore.getState().showConflictDialog).toBe(false)
  })

  it('clearConflict clears conflictDbUpdatedAt', () => {
    useEvaluareSyncStore.getState().setConflictDetected('2026-03-14T15:00:00.000Z')
    useEvaluareSyncStore.getState().clearConflict()
    expect(useEvaluareSyncStore.getState().conflictDbUpdatedAt).toBeNull()
  })

  // ─── Typical full sync lifecycle ──────────────────────────────────────────

  it('progresses correctly through markDirty → startSync → finishSync lifecycle', () => {
    const s = useEvaluareSyncStore.getState()

    s.markDirty()
    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)

    s.startSync()
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(true)

    s.finishSync('2026-03-14T12:00:00.000Z')
    expect(useEvaluareSyncStore.getState().isDirty).toBe(false)
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
    expect(useEvaluareSyncStore.getState().lastSyncedAt).toBe('2026-03-14T12:00:00.000Z')
  })

  it('progresses correctly through markDirty → startSync → setSyncError lifecycle', () => {
    const s = useEvaluareSyncStore.getState()

    s.markDirty()
    s.startSync()
    s.setSyncError('Network error')

    expect(useEvaluareSyncStore.getState().isDirty).toBe(true)
    expect(useEvaluareSyncStore.getState().isSyncing).toBe(false)
    expect(useEvaluareSyncStore.getState().syncError).toBe('Network error')
    // lastSyncedAt should not have been updated on error
    expect(useEvaluareSyncStore.getState().lastSyncedAt).toBeNull()
  })
})
