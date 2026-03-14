'use client'

import { createContext, useCallback, useContext, useRef } from 'react'

import { useEvaluareFormStore } from '@/stores/evaluare-form-store'

/**
 * ADR-0020 Level 3: React Context for a narrow subtree.
 *
 * Allows EvaluarePage sections to register their save handlers.
 * When the user clicks "Salvează progresul", the SyncButton calls `syncAll()`
 * which invokes every registered handler in parallel.
 *
 * Write helpers (`setField`, `setFields`) are exposed for convenience so
 * sections don't need to import the store directly — they delegate to
 * `getState()` (non-reactive) to avoid triggering provider re-renders.
 *
 * Sections read initial local data directly from
 * `useEvaluareFormStore.getState().getFormData(evaluareId)` — not through
 * context — so that Zustand state changes never propagate through the tree.
 */

type SaveHandler = () => Promise<void>
type FormData = Record<string, unknown>

type EvaluareSyncContextValue = {
  evaluareId: string
  registerHandler: (sectionId: string, handler: SaveHandler) => void
  unregisterHandler: (sectionId: string) => void
  syncAll: () => Promise<void>
  /** Persist a single field value to localStorage */
  setField: (name: string, value: unknown) => void
  /** Persist multiple field values at once */
  setFields: (fields: FormData) => void
}

const EvaluareSyncContext = createContext<EvaluareSyncContextValue | null>(null)

export const useEvaluareSyncContext = () => {
  const ctx = useContext(EvaluareSyncContext)
  if (!ctx) throw new Error('useEvaluareSyncContext must be used inside EvaluareSyncProvider')
  return ctx
}

type Props = { children: React.ReactNode; evaluareId: string }

export const EvaluareSyncProvider = ({ children, evaluareId }: Props) => {
  const handlersRef = useRef<Map<string, SaveHandler>>(new Map())

  // Use getState() (non-reactive) so that writing to the store never causes
  // the provider — or any of its consumers — to re-render.
  const setField = useCallback(
    (name: string, value: unknown) => {
      useEvaluareFormStore.getState().setField(evaluareId, name, value)
    },
    [evaluareId],
  )

  const setFields = useCallback(
    (fields: FormData) => {
      useEvaluareFormStore.getState().setFields(evaluareId, fields)
    },
    [evaluareId],
  )

  const registerHandler = useCallback((sectionId: string, handler: SaveHandler) => {
    handlersRef.current.set(sectionId, handler)
  }, [])

  const unregisterHandler = useCallback((sectionId: string) => {
    handlersRef.current.delete(sectionId)
  }, [])

  const syncAll = useCallback(async () => {
    const handlers = Array.from(handlersRef.current.values())
    await Promise.all(handlers.map((h) => h()))
  }, [])

  return (
    <EvaluareSyncContext.Provider
      value={{
        evaluareId,
        registerHandler,
        unregisterHandler,
        syncAll,
        setField,
        setFields,
      }}
    >
      {children}
    </EvaluareSyncContext.Provider>
  )
}
