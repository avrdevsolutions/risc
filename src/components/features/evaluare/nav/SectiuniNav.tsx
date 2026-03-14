'use client'

import { useMemo } from 'react'

import { useActiveSection } from '@/hooks/useActiveSection'
import { SECTIUNI_NAVIGARE } from '@/lib/constants'
import { computeProgress } from '@/lib/evaluare-utils'
import type { EvaluareWithRiscuri } from '@/lib/types'
import { cn } from '@/lib/utils'

const SECTION_IDS = SECTIUNI_NAVIGARE.map((s) => s.id)

type Props = { evaluare: EvaluareWithRiscuri }

export const SectiuniNav = ({ evaluare }: Props) => {
  const sectionIds = useMemo(() => SECTION_IDS, [])
  const activeId = useActiveSection(sectionIds)
  const progress = computeProgress(evaluare)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      className='sticky hidden w-56 shrink-0 self-start lg:block'
      style={{ top: '130px', maxHeight: 'calc(100vh - 150px)' }}
      aria-label='Navigare secțiuni'
    >
      <div className='flex flex-col overflow-y-auto rounded-2xl border border-navy-200 bg-white shadow-sm'>
        {/* Compact progress indicator */}
        <div className='p-3'>
          <div className='mb-1.5 flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-navy-400'>
              Progres
            </span>
            <span className='text-sm font-bold text-primary-600'>{progress}%</span>
          </div>
          <div
            className='h-1.5 overflow-hidden rounded-full bg-navy-100'
            role='progressbar'
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label='Progres completare documentație'
          >
            <div
              className='h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className='border-t border-navy-100' />

        {/* Section list */}
        <ul className='space-y-0.5 p-2'>
          {SECTIUNI_NAVIGARE.map((s) => {
            const isActive = activeId === s.id
            return (
              <li key={s.id}>
                <button
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150',
                    isActive
                      ? 'border-l-2 border-primary-500 bg-primary-50 pl-2.5 font-semibold text-primary-600'
                      : 'text-navy-500 hover:bg-navy-50 hover:text-navy-800',
                  )}
                >
                  <span className='w-5 shrink-0 text-right font-mono text-xs text-navy-400'>
                    {s.number}.
                  </span>
                  <span>{s.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
