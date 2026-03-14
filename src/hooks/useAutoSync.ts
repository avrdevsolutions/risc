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
 * Starts a countdown timer when `isDirty = true && !isSyncing`.
 * After `delayMs` since the last state change that restarted the timer,
 * the `onSync` callback is invoked automatically.
 *
 * Note: the timer resets whenever `isDirty` or `isSyncing` change —
 * not on individual field edits. To get a true inactivity reset, the
 * caller should update these values on each edit.
 *
 * Data is always safe in localStorage (via Zustand persist), so no
 * `beforeunload` warning is shown — refreshing does not lose data.
 */
export const useAutoSync = ({
  evaluareId: _evaluareId,
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

  return { secondsUntilAutoSync }
}
