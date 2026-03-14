'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type UseAutosaveOptions<T extends Record<string, unknown>> = {
  values: T
  onSave: (data: Partial<T>) => Promise<void>
  debounceMs?: number
  maxRetries?: number
}

/**
 * Watches form values and automatically PATCHes only changed fields after
 * a debounce delay. Retries on failure with exponential backoff.
 *
 * Status lifecycle: idle → saving → saved | error
 */
export const useAutosave = <T extends Record<string, unknown>>({
  values,
  onSave,
  debounceMs = 800,
  maxRetries = 3,
}: UseAutosaveOptions<T>): AutosaveStatus => {
  const [status, setStatus] = useState<AutosaveStatus>('idle')
  const lastSavedRef = useRef<T>(values)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const saveWithRetry = useCallback(
    async (diff: Partial<T>, attempt = 1): Promise<void> => {
      if (!isMountedRef.current) return
      setStatus('saving')
      try {
        await onSave(diff)
        if (isMountedRef.current) {
          setStatus('saved')
          setTimeout(() => {
            if (isMountedRef.current) setStatus('idle')
          }, 2000)
        }
      } catch {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 500
          setTimeout(() => {
            if (isMountedRef.current) {
              void saveWithRetry(diff, attempt + 1)
            }
          }, delay)
        } else {
          if (isMountedRef.current) setStatus('error')
        }
      }
    },
    [onSave, maxRetries],
  )

  useEffect(() => {
    const diff = computeDiff(lastSavedRef.current, values)
    if (Object.keys(diff).length === 0) return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      lastSavedRef.current = { ...values }
      void saveWithRetry(diff)
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [values, debounceMs, saveWithRetry])

  return status
}

const computeDiff = <T extends Record<string, unknown>>(prev: T, next: T): Partial<T> => {
  const diff: Partial<T> = {}
  for (const key in next) {
    const a = prev[key]
    const b = next[key]
    const aStr = JSON.stringify(a)
    const bStr = JSON.stringify(b)
    if (aStr !== bStr) {
      diff[key as keyof T] = b as T[keyof T]
    }
  }
  return diff
}
