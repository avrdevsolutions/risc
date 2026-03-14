'use client'

import { createContext, useCallback, useContext, useRef } from 'react'

/**
 * ADR-0020 Level 3: React Context for a narrow subtree.
 *
 * Allows EvaluarePage sections to register their save handlers.
 * When the user clicks "Sincronizează", the SyncButton calls `syncAll()`
 * which invokes every registered handler in parallel.
 *
 * This keeps form state in React Hook Form (ADR-0012) while enabling
 * a single sync action that spans all sections.
 */

type SaveHandler = () => Promise<void>

type EvaluareSyncContextValue = {
  registerHandler: (sectionId: string, handler: SaveHandler) => void
  unregisterHandler: (sectionId: string) => void
  syncAll: () => Promise<void>
}

const EvaluareSyncContext = createContext<EvaluareSyncContextValue | null>(null)

export const useEvaluareSyncContext = () => {
  const ctx = useContext(EvaluareSyncContext)
  if (!ctx) throw new Error('useEvaluareSyncContext must be used inside EvaluareSyncProvider')
  return ctx
}

type Props = { children: React.ReactNode }

export const EvaluareSyncProvider = ({ children }: Props) => {
  const handlersRef = useRef<Map<string, SaveHandler>>(new Map())

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
    <EvaluareSyncContext.Provider value={{ registerHandler, unregisterHandler, syncAll }}>
      {children}
    </EvaluareSyncContext.Provider>
  )
}
