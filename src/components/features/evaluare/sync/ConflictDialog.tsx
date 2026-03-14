'use client'

import { useEffect, useRef, useState } from 'react'

import { AlertTriangle, CloudDownload, Loader2, SmartphoneNfc } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Button, Typography } from '@/components/ui'
import { useEvaluareSyncContext } from '@/context/EvaluareSyncContext'
import { useEvaluareFormStore } from '@/stores/evaluare-form-store'
import { useEvaluareSyncStore } from '@/stores/evaluare-sync-store'

const formatConflictTimestamp = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat('ro-RO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

const DIALOG_DESC_ID = 'conflict-dialog-description'

/**
 * Modal dialog shown when a multi-device conflict is detected during sync.
 * Visible when `showConflictDialog` is true in the evaluare-sync-store.
 *
 * Accessibility:
 * - Focus is moved to the first action button on open, restored on close.
 * - Escape key dismisses the dialog.
 * - Tab focus is trapped within the dialog while it is open.
 */
export const ConflictDialog = () => {
  const [isResolving, setIsResolving] = useState(false)

  const { syncAll, evaluareId } = useEvaluareSyncContext()

  const {
    showConflictDialog,
    conflictDbUpdatedAt,
    clearConflict,
    startSync,
    finishSync,
    setSyncError,
    reset,
  } = useEvaluareSyncStore(
    useShallow((s) => ({
      showConflictDialog: s.showConflictDialog,
      conflictDbUpdatedAt: s.conflictDbUpdatedAt,
      clearConflict: s.clearConflict,
      startSync: s.startSync,
      finishSync: s.finishSync,
      setSyncError: s.setSyncError,
      reset: s.reset,
    })),
  )

  const clearEvaluare = useEvaluareFormStore((s) => s.clearEvaluare)

  // Refs for focus management and focus trap
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Capture focus when dialog opens; restore it when dialog closes
  useEffect(() => {
    if (showConflictDialog) {
      // Capture the element that had focus before the dialog opened
      previousFocusRef.current = document.activeElement as HTMLElement | null
      const raf = requestAnimationFrame(() => {
        firstFocusableRef.current?.focus()
      })
      return () => cancelAnimationFrame(raf)
    } else {
      // Dialog closed — restore focus to the previously focused element
      previousFocusRef.current?.focus()
    }
  }, [showConflictDialog])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      clearConflict()
      return
    }
    if (e.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }

  if (!showConflictDialog) return null

  /** Force-push local version to DB (skips conflict check) */
  const handleKeepLocal = async () => {
    setIsResolving(true)
    clearConflict()
    startSync()
    try {
      await syncAll()
      finishSync(new Date().toISOString())
    } catch {
      setSyncError('Eroare la salvare. Verificați conexiunea.')
    } finally {
      setIsResolving(false)
    }
  }

  /** Discard local changes and reload page to get latest DB data */
  const handleLoadFromDb = () => {
    clearConflict()
    reset()
    clearEvaluare(evaluareId)
    window.location.reload()
  }

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-sm' aria-hidden='true' />

      {/* Dialog */}
      <div
        className='fixed inset-0 z-50 flex items-center justify-center p-4'
        onKeyDown={handleKeyDown}
      >
        <div
          ref={dialogRef}
          role='dialog'
          aria-modal='true'
          aria-labelledby='conflict-dialog-title'
          aria-describedby={DIALOG_DESC_ID}
          className='w-full max-w-md rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl'
        >
          {/* Header */}
          <div className='mb-4 flex items-start gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-500/10'>
              <AlertTriangle className='size-5 text-accent-600' />
            </div>
            <div>
              <Typography variant='h4' id='conflict-dialog-title' className='text-navy-900'>
                Modificări detectate pe alt dispozitiv
              </Typography>
              {conflictDbUpdatedAt && (
                <Typography variant='body-sm' className='mt-1 text-navy-500'>
                  Datele din baza de date au fost actualizate la{' '}
                  <span className='font-medium text-navy-700'>
                    {formatConflictTimestamp(conflictDbUpdatedAt)}
                  </span>
                  .
                </Typography>
              )}
            </div>
          </div>

          <Typography id={DIALOG_DESC_ID} variant='body-sm' className='mb-5 text-navy-600'>
            Ce doriți să faceți cu modificările locale de pe acest dispozitiv?
          </Typography>

          {/* Options */}
          <div className='space-y-3'>
            {/* Keep local — first focusable element */}
            <button
              ref={firstFocusableRef}
              onClick={() => void handleKeepLocal()}
              disabled={isResolving}
              className='flex w-full items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left transition-colors hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60'
            >
              {isResolving ? (
                <Loader2 className='mt-0.5 size-5 shrink-0 animate-spin text-primary-500' />
              ) : (
                <SmartphoneNfc className='mt-0.5 size-5 shrink-0 text-primary-500' />
              )}
              <div>
                <Typography variant='body-sm' className='font-semibold text-primary-700'>
                  Păstrează versiunea mea (locală)
                </Typography>
                <Typography variant='caption' className='text-primary-600'>
                  Suprascrie datele din baza de date cu cele completate pe acest dispozitiv.
                </Typography>
              </div>
            </button>

            {/* Load from DB */}
            <button
              onClick={handleLoadFromDb}
              disabled={isResolving}
              className='flex w-full items-start gap-3 rounded-xl border border-navy-200 bg-navy-50 px-4 py-3 text-left transition-colors hover:bg-navy-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 disabled:opacity-60'
            >
              <CloudDownload className='mt-0.5 size-5 shrink-0 text-navy-500' />
              <div>
                <Typography variant='body-sm' className='font-semibold text-navy-700'>
                  Încarcă versiunea din baza de date
                </Typography>
                <Typography variant='caption' className='text-navy-500'>
                  Renunță la modificările locale și încarcă ultima versiune salvată.
                </Typography>
              </div>
            </button>
          </div>

          {/* Cancel — last focusable element */}
          <div className='mt-4 flex justify-end'>
            <Button
              ref={lastFocusableRef}
              variant='ghost'
              size='sm'
              onClick={clearConflict}
              disabled={isResolving}
              className='text-navy-500'
            >
              Anulează
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
