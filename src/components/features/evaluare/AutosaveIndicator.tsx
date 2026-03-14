'use client'

import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'

import type { AutosaveStatus } from '@/hooks/useAutosave'
import { cn } from '@/lib/utils'

type Props = {
  status: AutosaveStatus
}

const STATUS_CONFIG = {
  idle: null,
  saving: {
    icon: <Loader2 className='size-3.5 animate-spin' />,
    text: 'Salvare...',
    className: 'text-navy-400',
  },
  saved: {
    icon: <CheckCircle className='size-3.5' />,
    text: 'Salvat',
    className: 'text-success-600',
  },
  error: {
    icon: <AlertCircle className='size-3.5' />,
    text: 'Eroare la salvare',
    className: 'text-error-600',
  },
} as const

export const AutosaveIndicator = ({ status }: Props) => {
  const config = STATUS_CONFIG[status]
  if (!config) return null

  return (
    <div className={cn('flex items-center gap-1.5 text-xs', config.className)}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  )
}
