'use client'

import { useEffect, useRef, useState } from 'react'

const AUTO_SYNC_DELAY_MS = 3 * 60 * 1000 // 3 minutes

type UseAutoSyncOptions = {
  evaluareId: string
  isDirty: boolean
  isSyncing: boolean
  onSync: () => void | Promise<void>
  delayMs?: number
}

type UseAutoSyncResult = {
  /** Seconds remaining until auto-sync fires. null when timer is not active. */
  secondsUntilAutoSync: number | null
}

/**
 * Starts a timer when the form has unsaved changes (isDirty = true).
 * After `delayMs` of inactivity the `onSync` callback is invoked.
 *
 * Also registers a `beforeunload` handler that shows the browser's native
 * "Are you sure?" dialog when the user tries to leave with unsaved changes.
 */
export const useAutoSync = ({
  evaluareId,
  isDirty,
  isSyncing,
  onSync,
  delayMs = AUTO_SYNC_DELAY_MS,
}: UseAutoSyncOptions): UseAutoSyncResult => {
  const [secondsUntilAutoSync, setSecondsUntilAutoSync] = useState<number | null>(null)
  const onSyncRef = useRef(onSync)
  onSyncRef.current = onSync

  // Auto-sync timer: starts when isDirty becomes true, resets on state change
  useEffect(() => {
    if (!isDirty || isSyncing) {
      setSecondsUntilAutoSync(null)
      return
    }

    const totalSeconds = Math.ceil(delayMs / 1000)
    setSecondsUntilAutoSync(totalSeconds)

    const syncTimer = setTimeout(() => {
      void onSyncRef.current()
    }, delayMs)

    const countdownInterval = setInterval(() => {
      setSecondsUntilAutoSync((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
    }, 1000)

    return () => {
      clearTimeout(syncTimer)
      clearInterval(countdownInterval)
      setSecondsUntilAutoSync(null)
    }
  }, [isDirty, isSyncing, delayMs])

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
      // Modern browsers ignore the custom string but require returnValue to be set
      e.returnValue = 'Aveți modificări nesalvate. Sigur doriți să părăsiți pagina?'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, evaluareId])

  return { secondsUntilAutoSync }
}
