'use client'

import { useEffect, useRef } from 'react'

import { useEvaluareSyncContext } from '@/context/EvaluareSyncContext'

import type { FieldValues, UseFormWatch } from 'react-hook-form'

/**
 * Subscribes to React Hook Form `watch` changes and persists every field
 * value to the evaluare local store (localStorage via Zustand) so data
 * survives a page refresh.
 *
 * Usage — call inside any RHF-based section component:
 *
 *   const { watch } = useForm(...)
 *   useFormLocalPersist(watch)
 *
 * The hook is a no-op during SSR (localStorage is unavailable).
 */
export const useFormLocalPersist = <T extends FieldValues>(watch: UseFormWatch<T>) => {
  const { setFields } = useEvaluareSyncContext()

  // Keep stable refs so the subscription is created only once
  const watchRef = useRef(watch)
  watchRef.current = watch as UseFormWatch<T>
  const setFieldsRef = useRef(setFields)
  setFieldsRef.current = setFields

  useEffect(() => {
    const { unsubscribe } = watchRef.current((values) => {
      const fields: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(values as Record<string, unknown>)) {
        if (value !== undefined) {
          fields[key] = value
        }
      }
      if (Object.keys(fields).length > 0) {
        setFieldsRef.current(fields)
      }
    })
    return unsubscribe
  }, []) // Empty deps: subscribe once, use refs for latest values
}
