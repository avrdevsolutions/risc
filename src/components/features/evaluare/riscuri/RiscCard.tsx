'use client'

import { useState } from 'react'

import { ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react'

import { Typography, Stack, Button, Badge } from '@/components/ui'
import {
  getRiskLevel,
  getRiskColor,
  PROBABILITATE_LABELS,
  SEVERITATE_LABELS,
} from '@/lib/constants'
import type { Risc } from '@/lib/types'
import { parseJsonArray } from '@/lib/utils'

type Props = {
  risc: Risc
  index: number
  onEdit: () => void
  onDelete: () => void
}

const RiskBadge = ({
  probabilitate,
  severitate,
}: {
  probabilitate: number
  severitate: number
}) => {
  const level = getRiskLevel(probabilitate, severitate)
  const colors = getRiskColor(level)
  const score = probabilitate * severitate
  const labels: Record<string, string> = {
    critic: 'Critic',
    ridicat: 'Ridicat',
    mediu: 'Mediu',
    scazut: 'Scăzut',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      {labels[level]} ({score})
    </span>
  )
}

export const RiscCard = ({ risc, index, onEdit, onDelete }: Props) => {
  const [expanded, setExpanded] = useState(false)

  const activitate = risc.activitateCustom || risc.activitate || '—'
  const pericol = risc.pericolCustom || risc.pericol || '—'
  const persoaneExpuse = parseJsonArray(risc.persoaneExpuse)
  const masuriExistente = parseJsonArray(risc.masuriExistente)

  const hasScoreInitial = risc.probabilitateInitiala && risc.severitateInitiala
  const hasScoreRezidual = risc.probabilitateReziduala && risc.severitateReziduala

  const statusLabel: Record<string, string> = {
    deschis: 'Deschis',
    in_lucru: 'În lucru',
    inchis: 'Închis',
  }
  const statusVariant: Record<string, 'error' | 'warning' | 'success'> = {
    deschis: 'error',
    in_lucru: 'warning',
    inchis: 'success',
  }

  return (
    <div className='rounded-lg border border-primary-100 bg-surface shadow-card'>
      <div className='flex items-start gap-3 p-4'>
        <span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white'>
          {index}
        </span>

        <div className='min-w-0 flex-1'>
          <Stack direction='row' justify='between' align='start' gap='2'>
            <div className='min-w-0'>
              <Typography variant='body-sm' className='font-semibold text-navy-700'>
                {pericol}
              </Typography>
              <Typography variant='caption' className='text-navy-500'>
                {activitate}
              </Typography>
            </div>
            <Stack direction='row' gap='1' className='shrink-0'>
              {hasScoreInitial && (
                <RiskBadge
                  probabilitate={risc.probabilitateInitiala!}
                  severitate={risc.severitateInitiala!}
                />
              )}
              <Badge variant={statusVariant[risc.statusRisc]}>{statusLabel[risc.statusRisc]}</Badge>
            </Stack>
          </Stack>
        </div>

        <Stack direction='row' gap='1' className='shrink-0'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? 'Restrânge' : 'Extinde'}
          >
            {expanded ? <ChevronUp className='size-4' /> : <ChevronDown className='size-4' />}
          </Button>
          <Button variant='ghost' size='icon' onClick={onEdit} aria-label='Editează riscul'>
            <Edit2 className='size-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={onDelete}
            aria-label='Șterge riscul'
            className='text-error-600 hover:bg-error-50'
          >
            <Trash2 className='size-4' />
          </Button>
        </Stack>
      </div>

      {expanded && (
        <div className='border-t border-primary-100 p-4'>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
            {risc.descrierePericol && (
              <div className='md:col-span-2'>
                <span className='font-medium text-navy-600'>Descriere pericol: </span>
                <span className='text-navy-700'>{risc.descrierePericol}</span>
              </div>
            )}

            {persoaneExpuse.length > 0 && (
              <div>
                <span className='font-medium text-navy-600'>Persoane expuse: </span>
                <span className='text-navy-700'>{persoaneExpuse.join(', ')}</span>
                {risc.numarPersoaneExpuse && (
                  <span className='text-navy-500'> ({risc.numarPersoaneExpuse} pers.)</span>
                )}
              </div>
            )}

            {hasScoreInitial && (
              <div>
                <span className='font-medium text-navy-600'>Risc inițial: </span>
                <span className='text-navy-700'>
                  P={risc.probabilitateInitiala} (
                  {PROBABILITATE_LABELS[risc.probabilitateInitiala! - 1]}) × S=
                  {risc.severitateInitiala} ({SEVERITATE_LABELS[risc.severitateInitiala! - 1]}) ={' '}
                  <strong>{risc.probabilitateInitiala! * risc.severitateInitiala!}</strong>
                </span>
              </div>
            )}

            {masuriExistente.length > 0 && (
              <div className='md:col-span-2'>
                <span className='font-medium text-navy-600'>Măsuri existente: </span>
                <span className='text-navy-700'>{masuriExistente.join(', ')}</span>
              </div>
            )}

            {risc.masuriSuplimentare && (
              <div className='md:col-span-2'>
                <span className='font-medium text-navy-600'>Măsuri suplimentare: </span>
                <span className='text-navy-700'>{risc.masuriSuplimentare}</span>
              </div>
            )}

            {hasScoreRezidual && (
              <div>
                <span className='font-medium text-navy-600'>Risc rezidual: </span>
                <span className='text-navy-700'>
                  P={risc.probabilitateReziduala} × S={risc.severitateReziduala}={' '}
                  <strong>{risc.probabilitateReziduala! * risc.severitateReziduala!}</strong>
                </span>
                {hasScoreRezidual && (
                  <span className='ml-2'>
                    <RiskBadge
                      probabilitate={risc.probabilitateReziduala!}
                      severitate={risc.severitateReziduala!}
                    />
                  </span>
                )}
              </div>
            )}

            {risc.responsabilImplementare && (
              <div>
                <span className='font-medium text-navy-600'>Responsabil: </span>
                <span className='text-navy-700'>
                  {risc.responsabilImplementare}
                  {risc.functieResponsabil && ` (${risc.functieResponsabil})`}
                </span>
              </div>
            )}

            {risc.termenImplementare && (
              <div>
                <span className='font-medium text-navy-600'>Termen: </span>
                <span className='text-navy-700'>{risc.termenImplementare}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
