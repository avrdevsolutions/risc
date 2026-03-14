'use client'

import { useMemo } from 'react'

import { useActiveSection } from '@/hooks/useActiveSection'
import { SECTIUNI_NAVIGARE } from '@/lib/constants'
import { cn } from '@/lib/utils'

const SECTION_IDS = SECTIUNI_NAVIGARE.map((s) => s.id)

export const SectiuniNav = () => {
  const sectionIds = useMemo(() => SECTION_IDS, [])
  const activeId = useActiveSection(sectionIds)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className='sticky top-20 hidden w-56 shrink-0 lg:block' aria-label='Navigare secțiuni'>
      <div className='rounded-2xl border border-navy-200 bg-white p-3 shadow-sm'>
        <ul className='space-y-0.5'>
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
                  <span aria-hidden='true'>{s.emoji}</span>
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
