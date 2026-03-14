'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { Check, ChevronDown, Search } from 'lucide-react'

import { cn } from '@/lib/utils'

type Option = {
  value: string
  label: string
}

type Props = {
  options: readonly (string | Option)[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
  disabled?: boolean
  'aria-label'?: string
  /** Show search input for long lists. Defaults to auto (> 5 items). */
  searchable?: boolean
}

/** Normalize a raw string-or-object option to {value, label} */
const toOption = (raw: string | Option): Option =>
  typeof raw === 'string' ? { value: raw, label: raw } : raw

/**
 * Custom accessible select/dropdown matching app design.
 * - Trigger identical to text inputs (rounded-xl, px-4, py-3)
 * - Chevron rotates on open
 * - Search input for > 5 items (configurable)
 * - Keyboard: ArrowUp/Down to navigate, Enter/Space to select, Escape to close
 */
export const Select = ({
  options: rawOptions,
  value,
  onChange,
  placeholder = 'Selectați...',
  className,
  id,
  disabled,
  'aria-label': ariaLabel,
  searchable,
}: Props) => {
  const options = useMemo(() => rawOptions.map(toOption), [rawOptions])
  const showSearch = searchable ?? options.length > 5

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  const filtered = useMemo(
    () =>
      search
        ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
        : options,
    [options, search],
  )

  // Reset active index when filtered list changes
  useEffect(() => {
    setActiveIndex(0)
  }, [search])

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

  // Focus search input when opened
  useEffect(() => {
    if (open && showSearch) {
      setTimeout(() => searchRef.current?.focus(), 10)
    }
  }, [open, showSearch])

  const handleOpen = () => {
    if (disabled) return
    setOpen((o) => !o)
    setSearch('')
    // Preselect active index at current selection
    const idx = filtered.findIndex((o) => o.value === value)
    setActiveIndex(idx >= 0 ? idx : 0)
  }

  const handleSelect = (optValue: string) => {
    onChange?.(optValue)
    setOpen(false)
    setSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleOpen()
      }
      return
    }
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[activeIndex]) handleSelect(filtered[activeIndex].value)
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (!open || !listRef.current) return
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type='button'
        id={id}
        disabled={disabled}
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-label={ariaLabel ?? placeholder}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        className={cn(
          'form-input flex w-full items-center justify-between text-left',
          !selectedOption && 'text-navy-400',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <span className={cn(!selectedOption && 'italic')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-navy-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden='true'
        />
      </button>

      {open && (
        <div
          className='absolute z-50 mt-1.5 w-full rounded-xl border border-navy-100 bg-white shadow-lg'
          style={{
            maxHeight: '280px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {showSearch && (
            <div className='border-b border-navy-100 p-2'>
              <div className='flex items-center gap-2 rounded-lg border border-navy-200 px-3 py-1.5'>
                <Search className='size-3.5 shrink-0 text-navy-400' />
                <input
                  ref={searchRef}
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Caută...'
                  className='w-full bg-transparent text-sm outline-none placeholder:text-navy-400'
                />
              </div>
            </div>
          )}
          <ul
            ref={listRef}
            role='listbox'
            aria-label={ariaLabel ?? placeholder}
            className='overflow-y-auto p-1'
            style={{ maxHeight: showSearch ? '230px' : '280px' }}
          >
            {filtered.length === 0 ? (
              <li className='px-3 py-2 text-sm text-navy-400'>Niciun rezultat</li>
            ) : (
              filtered.map((opt, idx) => {
                const isSelected = opt.value === value
                const isActive = idx === activeIndex
                return (
                  <li
                    key={opt.value}
                    role='option'
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isSelected
                        ? 'bg-primary-50 font-medium text-primary-700'
                        : isActive
                          ? 'bg-navy-50 text-navy-800'
                          : 'text-navy-700 hover:bg-navy-50',
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className='size-4 text-primary-600' />}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
