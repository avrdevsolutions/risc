'use client'

import { useEffect, useRef } from 'react'

import { useEvaluareSyncContext } from '@/context/EvaluareSyncContext'
import { useEvaluareSyncStore } from '@/stores/evaluare-sync-store'

type SaveHandler = () => Promise<void>

/**
 * Convenience hook for section components:
 * 1. Registers a stable save handler with EvaluareSyncContext (called by SyncButton)
 * 2. Returns `markDirty` to call whenever a field value changes
 *
 * ADR-0020 compliant: form state stays in React Hook Form,
 * Zustand only tracks sync UI state (isDirty, isSyncing, …).
 *
 * The handler ref pattern prevents frequent re-registrations when
 * the closure dependencies of `saveHandler` change — the context
 * always holds a stable callback that delegates to the latest handler.
 */
export const useSectionSync = (sectionId: string, saveHandler: SaveHandler) => {
  const { registerHandler, unregisterHandler } = useEvaluareSyncContext()
  const markDirty = useEvaluareSyncStore((s) => s.markDirty)

  // Keep a ref to the latest saveHandler so the registered callback
  // never needs to be replaced even when closure deps change.
  const handlerRef = useRef<SaveHandler>(saveHandler)
  handlerRef.current = saveHandler

  useEffect(() => {
    const stableHandler = () => handlerRef.current()
    registerHandler(sectionId, stableHandler)
    return () => unregisterHandler(sectionId)
    // sectionId is stable; registerHandler/unregisterHandler are stable useCallback refs
  }, [sectionId, registerHandler, unregisterHandler])

  return { markDirty }
}
