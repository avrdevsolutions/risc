import Link from 'next/link'
import { redirect } from 'next/navigation'

import { and, count, desc, eq } from 'drizzle-orm'
import { ArrowRight, ChevronRight, Construction, FileText, ShieldCheck } from 'lucide-react'

import { Header } from '@/components/layout/header'
import { Badge, Typography } from '@/components/ui'
import { auth } from '@/lib/auth'

import { db } from '../../db'
import { evaluari } from '../../db/schema'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const HomePage = async () => {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const userId = session.user.id

  // SF counts
  const [sfCountResult] = await db
    .select({ value: count() })
    .from(evaluari)
    .where(and(eq(evaluari.userId, userId), eq(evaluari.evalType, 'securitate_fizica')))

  const [sfDraftsResult] = await db
    .select({ value: count() })
    .from(evaluari)
    .where(
      and(
        eq(evaluari.userId, userId),
        eq(evaluari.evalType, 'securitate_fizica'),
        eq(evaluari.status, 'draft'),
      ),
    )

  const sfCount = sfCountResult?.value ?? 0
  const sfDrafts = sfDraftsResult?.value ?? 0

  // Recent activity (all types)
  const recent = await db
    .select()
    .from(evaluari)
    .where(eq(evaluari.userId, userId))
    .orderBy(desc(evaluari.updatedAt))
    .limit(5)

  const userName = session.user.name ?? session.user.email ?? 'utilizator'

  return (
    <>
      <Header />
      <main className='mx-auto max-w-screen-lg px-4 py-10 sm:px-6 lg:px-8'>
        {/* Welcome */}
        <div className='mb-10'>
          <Typography variant='h2' className='text-navy-900'>
            Bine ai revenit, {userName}
          </Typography>
          <Typography variant='body-sm' className='mt-1 text-navy-500'>
            Alegeți tipul de evaluare pe care doriți să îl gestionați
          </Typography>
        </div>

        {/* Evaluation type cards */}
        <div className='mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {/* Securitate Fizică card */}
          <Link
            href='/securitate-fizica'
            className='group rounded-2xl border border-navy-200 bg-white p-8 shadow-sm transition-all hover:border-primary-300 hover:shadow-md'
          >
            <div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-primary-50 transition-colors group-hover:bg-primary-100'>
              <ShieldCheck className='size-6 text-primary-600' />
            </div>
            <Typography variant='h3' className='mb-2 text-navy-900'>
              Evaluări de Securitate Fizică
            </Typography>
            <Typography variant='body-sm' className='mb-4 text-navy-500'>
              Rapoarte de evaluare conform Instrucțiunilor M.A.I. nr. 9/2013
            </Typography>
            <Typography variant='body-sm' className='mb-6 text-navy-400'>
              {sfCount} {sfCount === 1 ? 'evaluare' : 'evaluări'} · {sfDrafts}{' '}
              {sfDrafts === 1 ? 'ciornă' : 'ciorne'}
            </Typography>
            <div className='flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors group-hover:text-primary-700'>
              Deschide
              <ArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
            </div>
          </Link>

          {/* Plan de Pază card */}
          <Link
            href='/plan-de-paza'
            className='group rounded-2xl border border-navy-200 bg-white p-8 shadow-sm transition-all hover:border-navy-300 hover:shadow-md'
          >
            <div className='mb-4 flex size-12 items-center justify-center rounded-xl bg-warning-50 transition-colors group-hover:bg-warning-100'>
              <FileText className='size-6 text-warning-700' />
            </div>
            <div className='mb-2 flex items-center gap-2'>
              <Typography variant='h3' className='text-navy-900'>
                Plan de Pază
              </Typography>
              <Badge variant='warning'>În curând</Badge>
            </div>
            <Typography variant='body-sm' className='mb-4 text-navy-500'>
              Planuri de pază conform Legii 333/2003
            </Typography>
            <div className='mb-6 flex items-center gap-2'>
              <Construction className='size-4 text-navy-400' />
              <Typography variant='body-sm' className='text-navy-400'>
                Funcționalitate în dezvoltare
              </Typography>
            </div>
            <div className='flex items-center gap-1 text-sm font-medium text-navy-500 transition-colors group-hover:text-navy-700'>
              Deschide
              <ArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
            </div>
          </Link>
        </div>

        {/* Recent activity */}
        {recent.length > 0 && (
          <section>
            <Typography variant='h3' className='mb-4 text-navy-800'>
              Activitate recentă
            </Typography>
            <div className='overflow-hidden rounded-2xl border border-navy-200 bg-white shadow-sm'>
              <ul className='divide-y divide-navy-100'>
                {recent.map((ev) => (
                  <li key={ev.id}>
                    <Link
                      href={
                        ev.evalType === 'plan_de_paza'
                          ? `/plan-de-paza/${ev.id}`
                          : `/securitate-fizica/${ev.id}`
                      }
                      className='flex items-center gap-4 px-5 py-4 transition-colors hover:bg-navy-50'
                    >
                      <div className='min-w-0 flex-1'>
                        <Typography
                          variant='body-sm'
                          className='truncate font-medium text-navy-800'
                        >
                          {ev.denumireProiect ?? 'Evaluare nouă'}
                        </Typography>
                      </div>
                      <div className='flex shrink-0 items-center gap-2'>
                        <Badge
                          variant={ev.evalType === 'plan_de_paza' ? 'warning' : 'default'}
                          className='hidden sm:inline-flex'
                        >
                          {ev.evalType === 'plan_de_paza' ? 'Plan de Pază' : 'Securitate'}
                        </Badge>
                        <Badge variant={ev.status === 'completed' ? 'success' : 'warning'}>
                          {ev.status === 'completed' ? 'Final' : 'Ciornă'}
                        </Badge>
                        <span className='hidden text-xs text-navy-400 md:block'>
                          {formatDate(ev.updatedAt)}
                        </span>
                        <ChevronRight className='size-4 text-navy-300' />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export default HomePage
