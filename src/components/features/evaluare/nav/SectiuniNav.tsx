'use client'

import { Typography } from '@/components/ui'
import { SECTIUNI_NAVIGARE } from '@/lib/constants'

export const SectiuniNav = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className='sticky top-20 hidden w-56 shrink-0 lg:block'>
      <div className='rounded-xl border border-primary-100 bg-surface p-4 shadow-card'>
        <Typography variant='overline' className='mb-3 text-navy-500'>
          Secțiuni
        </Typography>
        <ul className='space-y-1'>
          {SECTIUNI_NAVIGARE.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-navy-600 hover:bg-primary-50 hover:text-navy-800'
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
