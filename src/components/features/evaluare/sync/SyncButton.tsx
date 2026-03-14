'use client'

import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { useEvaluareSyncContext } from '@/context/EvaluareSyncContext'
import { cn } from '@/lib/utils'
import { useEvaluareSyncStore } from '@/stores/evaluare-sync-store'

const formatLastSync = (isoString: string | null): string => {
  if (!isoString) return ''
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (diff < 60) return 'acum câteva secunde'
  if (diff < 3600) return `acum ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `acum ${Math.floor(diff / 3600)} ore`
  return `acum ${Math.floor(diff / 86400)} zile`
}

export const SyncButton = () => {
  const { isDirty, isSyncing, syncError, lastSyncedAt, startSync, finishSync, setSyncError } =
    useEvaluareSyncStore(
      useShallow((s) => ({
        isDirty: s.isDirty,
        isSyncing: s.isSyncing,
        syncError: s.syncError,
        lastSyncedAt: s.lastSyncedAt,
        startSync: s.startSync,
        finishSync: s.finishSync,
        setSyncError: s.setSyncError,
      })),
    )

  const { syncAll } = useEvaluareSyncContext()

  const handleSync = async () => {
    if (isSyncing) return
    startSync()
    try {
      await syncAll()
      finishSync(new Date().toISOString())
    } catch {
      setSyncError('Eroare la sincronizare. Verificați conexiunea.')
    }
  }

  if (syncError) {
    return (
      <div className='fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-error-100 bg-error-50 px-4 py-2.5 shadow-lg'>
        <AlertCircle className='size-4 shrink-0 text-error-600' />
        <span className='text-sm font-medium text-error-700'>Eroare</span>
        <button
          onClick={handleSync}
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
        <span className='text-sm font-medium text-navy-600'>Se sincronizează...</span>
      </div>
    )
  }

  if (isDirty) {
    return (
      <button
        onClick={handleSync}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 shadow-lg',
          'border border-primary-400 bg-primary-500 text-white',
          'hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'animate-pulse-subtle transition-all duration-200',
        )}
        aria-label='Sincronizează modificările cu baza de date'
      >
        <RefreshCw className='size-4 shrink-0' />
        <span className='text-sm font-semibold'>Sincronizează</span>
        <span className='ml-1 rounded-full bg-primary-400 px-1.5 py-0.5 text-xs'>
          Modificări nesalvate
        </span>
      </button>
    )
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-success-100 bg-success-50 px-4 py-2.5 shadow-sm'>
      <CheckCircle className='size-4 shrink-0 text-success-600' />
      <div className='flex flex-col items-start'>
        <span className='text-xs font-semibold text-success-700'>Sincronizat</span>
        {lastSyncedAt && (
          <span className='text-xs text-success-600'>{formatLastSync(lastSyncedAt)}</span>
        )}
      </div>
    </div>
  )
}
