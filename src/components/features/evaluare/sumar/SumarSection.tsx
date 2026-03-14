import { Typography, Stack, Badge } from '@/components/ui'
import { getRiskLevel, getRiskColor, AMENINTARI } from '@/lib/constants'
import type { EvaluareWithRiscuri, Risc } from '@/lib/types'
import { getLabel } from '@/lib/utils'

type Props = { evaluare: EvaluareWithRiscuri }

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const getActivitateLabel = (risc: Risc) => {
  if (risc.activitate === 'custom') {
    return risc.activitateCustom || '—'
  }

  return risc.activitate ? getLabel(risc.activitate, AMENINTARI) : '—'
}

const RiskLevelBadge = ({ level }: { level: string }) => {
  const colors = getRiskColor(level)
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${colors.light}`}>
      {capitalize(level)}
    </span>
  )
}

const getRiskCounts = (riscuri: Risc[]) => {
  const counts = { ridicat: 0, mediu: 0, scazut: 0, total: 0 }
  riscuri.forEach((r) => {
    if (r.probabilitateInitiala && r.severitateInitiala) {
      const level = getRiskLevel(r.probabilitateInitiala, r.severitateInitiala)
      counts[level as keyof Omit<typeof counts, 'total'>]++
      counts.total++
    }
  })
  return counts
}

const getRiskCountsResidual = (riscuri: Risc[]) => {
  const counts = { ridicat: 0, mediu: 0, scazut: 0, total: 0 }
  riscuri.forEach((r) => {
    if (r.probabilitateReziduala && r.severitateReziduala) {
      const level = getRiskLevel(r.probabilitateReziduala, r.severitateReziduala)
      counts[level as keyof Omit<typeof counts, 'total'>]++
      counts.total++
    }
  })
  return counts
}

const getStatusLabel = (status: Risc['statusRisc']) => {
  switch (status) {
    case 'inchis':
      return 'Închis'
    case 'in_lucru':
      return 'În lucru'
    default:
      return 'Deschis'
  }
}

const getStatusVariant = (status: Risc['statusRisc']): 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'inchis':
      return 'success'
    case 'in_lucru':
      return 'warning'
    default:
      return 'error'
  }
}

export const SumarSection = ({ evaluare }: Props) => {
  const initial = getRiskCounts(evaluare.riscuri)
  const residual = getRiskCountsResidual(evaluare.riscuri)
  const riscuriWithMasuri = evaluare.riscuri.filter(
    (r) => r.masuriSuplimentare && r.masuriSuplimentare.trim() !== '',
  )

  return (
    <section id='sumar-section' className='scroll-mt-20'>
      <div className='rounded-xl border border-primary-100 bg-surface p-6 shadow-card'>
        <Typography variant='h3' className='mb-6 text-navy-700'>
          📊 Sumar &amp; Revizuire
        </Typography>

        <Stack gap='6'>
          {/* Risk counts summary */}
          <div>
            <Typography variant='body-sm' className='mb-3 font-semibold text-navy-700'>
              Distribuție riscuri inițiale
            </Typography>
            <div className='grid grid-cols-3 gap-3'>
              <div className='rounded-lg bg-error-50 p-3 text-center'>
                <Typography variant='h3' className='text-error-600'>
                  {initial.ridicat}
                </Typography>
                <Typography variant='caption' className='text-error-700'>
                  Ridicate
                </Typography>
              </div>
              <div className='rounded-lg bg-warning-50 p-3 text-center'>
                <Typography variant='h3' className='text-warning-600'>
                  {initial.mediu}
                </Typography>
                <Typography variant='caption' className='text-warning-700'>
                  Medii
                </Typography>
              </div>
              <div className='rounded-lg bg-success-50 p-3 text-center'>
                <Typography variant='h3' className='text-success-600'>
                  {initial.scazut}
                </Typography>
                <Typography variant='caption' className='text-success-700'>
                  Scăzute
                </Typography>
              </div>
            </div>
          </div>

          {/* Residual risk counts */}
          {residual.total > 0 && (
            <div>
              <Typography variant='body-sm' className='mb-3 font-semibold text-navy-700'>
                Distribuție riscuri reziduale (după măsuri)
              </Typography>
              <div className='grid grid-cols-3 gap-3'>
                <div className='rounded-lg bg-error-50 p-3 text-center'>
                  <Typography variant='h3' className='text-error-600'>
                    {residual.ridicat}
                  </Typography>
                  <Typography variant='caption' className='text-error-700'>
                    Ridicate
                  </Typography>
                </div>
                <div className='rounded-lg bg-warning-50 p-3 text-center'>
                  <Typography variant='h3' className='text-warning-600'>
                    {residual.mediu}
                  </Typography>
                  <Typography variant='caption' className='text-warning-700'>
                    Medii
                  </Typography>
                </div>
                <div className='rounded-lg bg-success-50 p-3 text-center'>
                  <Typography variant='h3' className='text-success-600'>
                    {residual.scazut}
                  </Typography>
                  <Typography variant='caption' className='text-success-700'>
                    Scăzute
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Risk list with status */}
          {evaluare.riscuri.length > 0 && (
            <div>
              <Typography variant='body-sm' className='mb-3 font-semibold text-navy-700'>
                Status riscuri identificate ({evaluare.riscuri.length})
              </Typography>
              <div className='overflow-x-auto rounded-lg border border-primary-100'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-primary-100 bg-primary-50'>
                      <th className='px-3 py-2 text-left font-semibold text-navy-700'>#</th>
                      <th className='px-3 py-2 text-left font-semibold text-navy-700'>
                        Amenințare
                      </th>
                      <th className='px-3 py-2 text-left font-semibold text-navy-700'>
                        Nivel inițial
                      </th>
                      <th className='px-3 py-2 text-left font-semibold text-navy-700'>
                        Nivel rezidual
                      </th>
                      <th className='px-3 py-2 text-left font-semibold text-navy-700'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluare.riscuri.map((risc, i) => {
                      const initialLevel =
                        risc.probabilitateInitiala && risc.severitateInitiala
                          ? getRiskLevel(risc.probabilitateInitiala, risc.severitateInitiala)
                          : null
                      const residualLevel =
                        risc.probabilitateReziduala && risc.severitateReziduala
                          ? getRiskLevel(risc.probabilitateReziduala, risc.severitateReziduala)
                          : null

                      return (
                        <tr key={risc.id} className='border-b border-primary-50 last:border-0'>
                          <td className='px-3 py-2 text-navy-500'>{i + 1}</td>
                          <td className='px-3 py-2 text-navy-700'>{getActivitateLabel(risc)}</td>
                          <td className='px-3 py-2'>
                            {initialLevel ? (
                              <RiskLevelBadge level={initialLevel} />
                            ) : (
                              <span className='text-navy-400'>—</span>
                            )}
                          </td>
                          <td className='px-3 py-2'>
                            {residualLevel ? (
                              <RiskLevelBadge level={residualLevel} />
                            ) : (
                              <span className='text-navy-400'>—</span>
                            )}
                          </td>
                          <td className='px-3 py-2'>
                            <Badge variant={getStatusVariant(risc.statusRisc)}>
                              {getStatusLabel(risc.statusRisc)}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Measures requiring follow-up */}
          {riscuriWithMasuri.length > 0 && (
            <div>
              <Typography variant='body-sm' className='mb-3 font-semibold text-navy-700'>
                Măsuri suplimentare de implementat ({riscuriWithMasuri.length})
              </Typography>
              <Stack gap='2'>
                {riscuriWithMasuri.map((risc, i) => (
                  <div
                    key={risc.id}
                    className='rounded-lg border border-primary-100 bg-primary-50 px-4 py-3'
                  >
                    <Typography variant='body-sm' className='font-medium text-navy-700'>
                      {i + 1}. {getActivitateLabel(risc)}
                    </Typography>
                    <Typography variant='caption' className='mt-1 text-navy-600'>
                      {risc.masuriSuplimentare}
                    </Typography>
                    {risc.responsabilImplementare && (
                      <Typography variant='caption' className='mt-1 text-navy-500'>
                        Responsabil: {risc.responsabilImplementare}
                        {risc.termenImplementare ? ` — Termen: ${risc.termenImplementare}` : ''}
                      </Typography>
                    )}
                  </div>
                ))}
              </Stack>
            </div>
          )}

          {/* Revision info */}
          <div className='rounded-lg border border-primary-100 bg-primary-50 p-4'>
            <Typography variant='body-sm' className='mb-2 font-semibold text-navy-700'>
              Informații revizuire
            </Typography>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <Typography variant='caption' className='text-navy-600'>
                Data evaluării:{' '}
                <span className='font-medium text-navy-800'>{evaluare.dataEvaluarii ?? '—'}</span>
              </Typography>
              <Typography variant='caption' className='text-navy-600'>
                Data revizuirii:{' '}
                <span className='font-medium text-navy-800'>{evaluare.dataRevizuirii ?? '—'}</span>
              </Typography>
              <Typography variant='caption' className='text-navy-600'>
                Evaluator:{' '}
                <span className='font-medium text-navy-800'>{evaluare.numeEvaluator ?? '—'}</span>
              </Typography>
              <Typography variant='caption' className='text-navy-600'>
                Total riscuri identificate:{' '}
                <span className='font-medium text-navy-800'>{evaluare.riscuri.length}</span>
              </Typography>
            </div>
          </div>

          {evaluare.riscuri.length === 0 && (
            <div className='rounded-lg border-2 border-dashed border-primary-200 py-8 text-center'>
              <Typography variant='body-sm' className='text-navy-400'>
                Nu există riscuri identificate pentru a genera sumarul.
              </Typography>
            </div>
          )}
        </Stack>
      </div>
    </section>
  )
}
