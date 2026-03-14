'use client'

import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

/**
 * ADR-0020: Zustand store for sync UI state only.
 * Does NOT store form values — those live in React Hook Form (ADR-0012).
 * Does NOT store server data — that lives in TanStack Query (ADR-0005).
 *
 * Persists isDirty to localStorage so the user knows whether they have
 * unsynced changes after a page refresh.
 */

type SyncState = {
  isDirty: boolean
  isSyncing: boolean
  syncError: string | null
}

type SyncActions = {
  markDirty: () => void
  startSync: () => void
  finishSync: () => void
  setSyncError: (error: string) => void
  reset: () => void
}

const initialState: SyncState = {
  isDirty: false,
  isSyncing: false,
  syncError: null,
}

export const useEvaluareSyncStore = create<SyncState & SyncActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        markDirty: () =>
          set(
            (state) => {
              if (state.isDirty && state.syncError === null) return state
              return { isDirty: true, syncError: null }
            },
            false,
            'markDirty',
          ),

        startSync: () => set({ isSyncing: true, syncError: null }, false, 'startSync'),

        finishSync: () =>
          set({ isSyncing: false, isDirty: false, syncError: null }, false, 'finishSync'),

        setSyncError: (error) => set({ isSyncing: false, syncError: error }, false, 'setSyncError'),

        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'evaluare-sync-store',
        storage: createJSONStorage(() => ({
          getItem: (name) => {
            try {
              return localStorage.getItem(name)
            } catch {
              return null
            }
          },
          setItem: (name, value) => {
            try {
              localStorage.setItem(name, value)
            } catch {
              // Ignore persistence failures for sync UI state
            }
          },
          removeItem: (name) => {
            try {
              localStorage.removeItem(name)
            } catch {
              // Ignore removal errors
            }
          },
        })),
        // Only persist the dirty flag — not runtime sync state
        partialize: (state) => ({
          isDirty: state.isDirty,
        }),
      },
    ),
    { name: 'EvaluareSyncStore' },
  ),
)
