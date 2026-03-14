'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

import { cn } from '@/lib/utils'

const MONTHS_RO = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie',
]

const MONTHS_RO_LOWER = [
  'ianuarie',
  'februarie',
  'martie',
  'aprilie',
  'mai',
  'iunie',
  'iulie',
  'august',
  'septembrie',
  'octombrie',
  'noiembrie',
  'decembrie',
]

const DAYS_RO = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du']

/** Parse an ISO date string (YYYY-MM-DD) into a Date */
const parseIso = (iso: string): Date | null => {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

/** Format a Date as "14 martie 2026" */
const formatDisplay = (date: Date): string =>
  `${date.getDate()} ${MONTHS_RO_LOWER[date.getMonth()]} ${date.getFullYear()}`

/** Format a Date as "YYYY-MM-DD" */
const formatIso = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Get days to display for a given month grid (Mon-start) */
const getCalendarDays = (year: number, month: number): (Date | null)[] => {
  const firstDay = new Date(year, month, 1)
  // Monday = 0, ..., Sunday = 6
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (Date | null)[] = []

  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
  return days
}

const getToday = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

type Props = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
  disabled?: boolean
  'aria-label'?: string
}

/**
 * Romanian date picker. Displays calendar dropdown with Romanian months/days.
 * Week starts on Monday (European standard).
 * Value is ISO 8601 (YYYY-MM-DD). Display format: "14 martie 2026".
 */
export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Selectați data...',
  className,
  id,
  disabled,
  'aria-label': ariaLabel,
}: Props) => {
  const today = useMemo(() => getToday(), [])
  const selectedDate = value ? parseIso(value) : null

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth())
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Track whether the dialog has ever been opened so we don't steal focus
  // from other elements when the component first mounts (open === false).
  const hasOpenedRef = useRef(false)

  // Auto-focus first focusable element in dialog when opened;
  // return focus to trigger only when transitioning from open → closed
  // (not on initial mount when open is already false).
  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true
      // Focus the selected or today button, falling back to the first day cell
      const firstDay = dialogRef.current?.querySelector<HTMLElement>(
        'button[aria-pressed="true"], button[aria-label]',
      )
      firstDay?.focus()
    } else if (hasOpenedRef.current) {
      triggerRef.current?.focus()
    }
  }, [open])

  const handleClose = () => setOpen(false)

  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
    }
  }

  const handleDayClick = (date: Date) => {
    onChange?.(formatIso(date))
    setOpen(false)
  }

  const handleToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    onChange?.(formatIso(today))
    setOpen(false)
  }

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const calendarDays = getCalendarDays(viewYear, viewMonth)

  return (
    <div ref={containerRef} className='relative'>
      <button
        ref={triggerRef}
        type='button'
        id={id}
        disabled={disabled}
        aria-label={ariaLabel ?? 'Selectați data'}
        aria-haspopup='dialog'
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'form-input flex w-full items-center justify-between text-left',
          !selectedDate && 'text-navy-400',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
      >
        <span>{selectedDate ? formatDisplay(selectedDate) : placeholder}</span>
        <Calendar className='size-4 shrink-0 text-navy-400' aria-hidden='true' />
      </button>

      {open && (
        <div
          ref={dialogRef}
          role='dialog'
          aria-label='Calendar'
          aria-modal='true'
          onKeyDown={handleDialogKeyDown}
          className='absolute z-50 mt-1.5 w-72 rounded-2xl border border-navy-100 bg-white p-4 shadow-xl'
        >
          {/* Month/Year navigation */}
          <div className='mb-3 flex items-center justify-between'>
            <button
              type='button'
              onClick={prevMonth}
              className='rounded-lg p-1.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900'
              aria-label='Luna anterioară'
            >
              <ChevronLeft className='size-4' />
            </button>
            <span className='text-sm font-semibold text-navy-800'>
              {MONTHS_RO[viewMonth]} {viewYear}
            </span>
            <button
              type='button'
              onClick={nextMonth}
              className='rounded-lg p-1.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900'
              aria-label='Luna următoare'
            >
              <ChevronRight className='size-4' />
            </button>
          </div>

          {/* Day headers */}
          <div className='mb-1 grid grid-cols-7 gap-0.5'>
            {DAYS_RO.map((d) => (
              <div
                key={d}
                className='py-1 text-center text-xs font-semibold uppercase tracking-wider text-navy-400'
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className='grid grid-cols-7 gap-0.5'>
            {calendarDays.map((date, i) => {
              if (!date) {
                return <div key={`empty-${i}`} className='h-10' />
              }
              const isoDate = formatIso(date)
              const isSelected = isoDate === value
              const isToday = formatIso(today) === isoDate

              return (
                <button
                  key={isoDate}
                  type='button'
                  onClick={() => handleDayClick(date)}
                  aria-label={formatDisplay(date)}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors',
                    isSelected
                      ? 'bg-primary-600 font-semibold text-white'
                      : isToday
                        ? 'font-medium text-primary-700 ring-1 ring-primary-300'
                        : 'text-navy-700 hover:bg-navy-50',
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Footer actions */}
          <div className='mt-3 flex items-center justify-between border-t border-navy-100 pt-3'>
            <button
              type='button'
              onClick={handleToday}
              className='text-sm font-medium text-primary-600 hover:text-primary-700'
            >
              Azi
            </button>
            <button
              type='button'
              onClick={handleClose}
              className='flex items-center gap-1 text-sm text-navy-400 hover:text-navy-700'
            >
              <X className='size-3.5' />
              Închide
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
