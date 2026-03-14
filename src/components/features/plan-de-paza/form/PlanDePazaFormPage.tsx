'use client'

import Link from 'next/link'

import { ArrowLeft, Construction } from 'lucide-react'

import { Typography, Stack, Button } from '@/components/ui'

type Props = { id: string }

export const PlanDePazaFormPage = ({ id: _id }: Props) => (
  <>
    {/* Status bar */}
    <div
      className='sticky z-40 w-full border-b border-navy-200 bg-white/95 backdrop-blur-sm'
      style={{ top: '56px' }}
    >
      <div className='mx-auto flex max-w-screen-xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3 lg:px-8'>
        <Stack direction='row' align='center' gap='2' className='min-w-0 flex-1'>
          <Link
            href='/plan-de-paza'
            className='flex shrink-0 items-center gap-1.5 text-sm font-medium text-navy-500 transition-colors hover:text-navy-800'
          >
            <ArrowLeft className='size-4' />
            <span>Înapoi</span>
          </Link>
          <span className='shrink-0 text-navy-200'>|</span>
          <Typography variant='h4' className='truncate text-sm text-navy-900 sm:text-base'>
            Plan de Pază
          </Typography>
        </Stack>
      </div>
    </div>

    {/* Content */}
    <div className='mx-auto max-w-screen-xl px-4 pb-20 pt-6 sm:px-6 lg:px-8'>
      <div className='flex gap-6'>
        {/* Sidebar */}
        <div className='hidden w-56 shrink-0 lg:block'>
          <div className='rounded-2xl border border-navy-100 bg-white p-4 shadow-sm'>
            <Typography variant='body-sm' className='mb-3 font-semibold text-navy-700'>
              Secțiuni
            </Typography>
            <ul className='space-y-1 text-sm text-navy-400'>
              <li className='rounded-lg px-2 py-1.5'>1. Beneficiar</li>
              <li className='rounded-lg px-2 py-1.5'>2. Prestator</li>
              <li className='rounded-lg px-2 py-1.5'>3. Date generale</li>
              <li className='rounded-lg px-2 py-1.5 text-xs italic'>... (în dezvoltare)</li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className='min-w-0 flex-1'>
          <div className='flex flex-col items-center justify-center rounded-2xl border border-navy-100 bg-white p-12 text-center shadow-sm'>
            <div className='mb-4 flex size-16 items-center justify-center rounded-2xl bg-warning-50'>
              <Construction className='size-8 text-warning-600' />
            </div>
            <Typography variant='h3' className='mb-2 text-navy-900'>
              În curs de dezvoltare
            </Typography>
            <Typography variant='body-sm' className='mb-6 max-w-sm text-navy-500'>
              Acest tip de evaluare este în curs de dezvoltare. Secțiunile vor fi adăugate în
              curând.
            </Typography>
            <Link href='/plan-de-paza'>
              <Button variant='outline'>
                <ArrowLeft className='size-4' />
                Înapoi la planuri
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
)
