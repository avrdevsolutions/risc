'use client'

import { useEffect, useRef, useState } from 'react'

import { AlertCircle, CheckCircle, Loader2, Save } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { useEvaluareSyncContext } from '@/context/EvaluareSyncContext'
import { useAutoSync } from '@/hooks/useAutoSync'
import { cn } from '@/lib/utils'
import { useEvaluareSyncStore } from '@/stores/evaluare-sync-store'

const formatCountdown = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export const SyncButton = () => {
  const [recentlySaved, setRecentlySaved] = useState(false)
  const recentlySavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up recentlySaved timer on unmount
  useEffect(
    () => () => {
      if (recentlySavedTimerRef.current) clearTimeout(recentlySavedTimerRef.current)
    },
    [],
  )

  const { isDirty, isSyncing, syncError, startSync, finishSync, setSyncError } =
    useEvaluareSyncStore(
      useShallow((s) => ({
        isDirty: s.isDirty,
        isSyncing: s.isSyncing,
        syncError: s.syncError,
        startSync: s.startSync,
        finishSync: s.finishSync,
        setSyncError: s.setSyncError,
      })),
    )

  const { syncAll, evaluareId } = useEvaluareSyncContext()

  /**
   * Saves all local changes to the DB — last write wins, no conflict check.
   */
  const handleSync = async () => {
    if (isSyncing) return

    startSync()
    try {
      await syncAll()
      finishSync()

      // Show transient "Salvat!" state, cancelling any pending timer first
      if (recentlySavedTimerRef.current) clearTimeout(recentlySavedTimerRef.current)
      setRecentlySaved(true)
      recentlySavedTimerRef.current = setTimeout(() => setRecentlySaved(false), 2000)
    } catch {
      setSyncError('Eroare la salvare. Verificați conexiunea.')
    }
  }

  const { secondsUntilAutoSync } = useAutoSync({
    evaluareId,
    isDirty,
    isSyncing,
    onSync: handleSync,
  })

  const tooltip = 'Salvează datele în baza de date pentru a le accesa de pe alt dispozitiv'

  if (syncError) {
    return (
      <div className='fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-error-100 bg-error-50 px-4 py-2.5 shadow-lg'>
        <AlertCircle className='size-4 shrink-0 text-error-600' />
        <span className='text-sm font-medium text-error-700'>Eroare</span>
        <button
          onClick={() => void handleSync()}
          className='ml-1 rounded-full bg-error-600 px-3 py-1 text-xs font-semibold text-white hover:bg-error-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500 focus-visible:ring-offset-2'
        >
          Reîncearcă
        </button>
      </div>
    )
  }

  if (isSyncing) {
    return (
      <div className='fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-navy-200 bg-white px-4 py-2.5 shadow-lg'>
        <Loader2 className='size-4 shrink-0 animate-spin text-primary-500' />
        <span className='text-sm font-medium text-navy-600'>Se salvează...</span>
      </div>
    )
  }

  if (isDirty) {
    return (
      <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-1'>
        <button
          onClick={() => void handleSync()}
          title={tooltip}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2.5 shadow-lg',
            'border border-primary-400 bg-primary-500 text-white',
            'hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'transition-all duration-200',
            'animate-pulse-save',
          )}
          aria-label='Salvează progresul în baza de date'
        >
          <Save className='size-4 shrink-0' />
          <span className='text-sm font-semibold'>Salvează progresul</span>
          <span className='ml-1 rounded-full bg-primary-400 px-1.5 py-0.5 text-xs'>
            Modificări locale
          </span>
        </button>
        {secondsUntilAutoSync !== null && (
          <span className='pr-1 text-xs text-navy-400'>
            Salvare automată în {formatCountdown(secondsUntilAutoSync)}
          </span>
        )}
      </div>
    )
  }

  if (recentlySaved) {
    return (
      <div className='fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-success-100 bg-success-50 px-4 py-2.5 shadow-sm'>
        <CheckCircle className='size-4 shrink-0 text-success-600' />
        <span className='text-sm font-semibold text-success-700'>Salvat!</span>
      </div>
    )
  }

  return (
    <div
      className='fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-success-100 bg-success-50 px-4 py-2.5 shadow-sm'
      title={tooltip}
    >
      <CheckCircle className='size-4 shrink-0 text-success-600' />
      <span className='text-xs font-semibold text-success-700'>Progres salvat</span>
    </div>
  )
}
