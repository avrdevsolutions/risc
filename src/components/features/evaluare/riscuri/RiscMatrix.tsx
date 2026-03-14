'use client'

import { MATRICE_RISC, getRiskLevel, getRiskColor } from '@/lib/constants'
import { cn } from '@/lib/utils'

type Props = {
  probabilitate: number
  severitate: number
  onChange: (p: number, s: number) => void
  label?: string
}

const CELL_COLORS: Record<string, string> = {
  scazut: 'bg-success-100 hover:bg-success-100 text-success-800',
  mediu: 'bg-warning-100 hover:bg-warning-100 text-warning-800',
  ridicat: 'bg-error-100 hover:bg-error-100 text-error-800',
}

const SELECTED_RING: Record<string, string> = {
  scazut: 'ring-2 ring-success-600 ring-offset-1',
  mediu: 'ring-2 ring-warning-600 ring-offset-1',
  ridicat: 'ring-2 ring-error-600 ring-offset-1',
}

const SCORE_BG: Record<string, string> = {
  scazut: 'bg-success-100 text-success-800',
  mediu: 'bg-warning-100 text-warning-800',
  ridicat: 'bg-error-100 text-error-800',
}

const RISK_LABELS: Record<string, string> = {
  scazut: 'Scăzut',
  mediu: 'Mediu',
  ridicat: 'Ridicat',
}

/**
 * 5×5 visual risk matrix grid.
 * Rows: P=5 (top) to P=1 (bottom)
 * Columns: S=1 (left) to S=5 (right)
 * Clicking a cell selects both P and S simultaneously.
 */
export const RiscMatrix = ({ probabilitate, severitate, onChange, label }: Props) => {
  const currentScore = probabilitate * severitate
  const currentLevel = getRiskLevel(probabilitate, severitate)
  const colors = getRiskColor(currentLevel)

  return (
    <div>
      {label && <p className='mb-2 text-sm font-medium text-navy-700'>{label}</p>}

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-xs'>
          <tbody>
            {MATRICE_RISC.map((row, rowIdx) => {
              const p = 5 - rowIdx
              return (
                <tr key={p}>
                  {/* Row label */}
                  <td className='w-8 pr-1.5 text-right text-xs font-semibold text-navy-500'>
                    P={p}
                  </td>
                  {row.map((score, colIdx) => {
                    const s = colIdx + 1
                    const level = getRiskLevel(p, s)
                    const isSelected = probabilitate === p && severitate === s
                    return (
                      <td key={s} className='p-0.5'>
                        <button
                          type='button'
                          onClick={() => onChange(p, s)}
                          className={cn(
                            'flex h-9 w-full cursor-pointer items-center justify-center rounded font-bold transition-all',
                            CELL_COLORS[level],
                            isSelected && SELECTED_RING[level],
                          )}
                          aria-label={`P=${p}, I=${s}, Scor=${score}`}
                          aria-pressed={isSelected}
                        >
                          {score}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {/* Column labels */}
            <tr>
              <td />
              {[1, 2, 3, 4, 5].map((s) => (
                <td key={s} className='pt-1 text-center text-xs font-semibold text-navy-500'>
                  I={s}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Score summary */}
      <div className='mt-3 flex items-center gap-2'>
        <span className='text-sm text-navy-600'>Scor:</span>
        <span className='text-sm font-semibold text-navy-800'>
          {probabilitate} × {severitate} = {currentScore}
        </span>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-bold uppercase',
            SCORE_BG[currentLevel],
          )}
        >
          {RISK_LABELS[currentLevel]}
        </span>
        <span className={cn('inline-block size-3 rounded-full', colors.bg)} />
      </div>
    </div>
  )
}
