'use client'

import { createContext, useCallback, useContext, useRef } from 'react'

import { useShallow } from 'zustand/react/shallow'

import { useEvaluareFormStore } from '@/stores/evaluare-form-store'

/**
 * ADR-0020 Level 3: React Context for a narrow subtree.
 *
 * Allows EvaluarePage sections to register their save handlers.
 * When the user clicks "Salvează progresul", the SyncButton calls `syncAll()`
 * which invokes every registered handler in parallel.
 *
 * Also exposes per-evaluare form data (from localStorage via Zustand) so
 * sections can restore local state on refresh without waiting for the DB.
 */

type SaveHandler = () => Promise<void>
type FormData = Record<string, unknown>

type EvaluareSyncContextValue = {
  evaluareId: string
  registerHandler: (sectionId: string, handler: SaveHandler) => void
  unregisterHandler: (sectionId: string) => void
  syncAll: () => Promise<void>
  /** Local form data for this evaluare (from localStorage) */
  formData: FormData
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

  const {
    evaluareDataMap,
    setField: storeSetField,
    setFields: storeSetFields,
  } = useEvaluareFormStore(
    useShallow((s) => ({
      evaluareDataMap: s.evaluareDataMap,
      setField: s.setField,
      setFields: s.setFields,
    })),
  )

  const formData: FormData = evaluareDataMap[evaluareId] ?? {}

  const setField = useCallback(
    (name: string, value: unknown) => {
      storeSetField(evaluareId, name, value)
    },
    [evaluareId, storeSetField],
  )

  const setFields = useCallback(
    (fields: FormData) => {
      storeSetFields(evaluareId, fields)
    },
    [evaluareId, storeSetFields],
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
        formData,
        setField,
        setFields,
      }}
    >
      {children}
    </EvaluareSyncContext.Provider>
  )
}
