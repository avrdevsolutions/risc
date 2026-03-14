import Link from 'next/link'

import { Header } from '@/components/layout/header'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Șabloane',
}

const TemplatesPage = () => (
  <>
    <Header />
    <main className='mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold text-navy-700'>Șabloane</h1>
        <p className='mt-1 text-sm text-navy-500'>
          Gestionați șabloanele pentru evaluările de risc
        </p>
      </div>

      <div className='rounded-xl border border-primary-100 bg-surface p-8 text-center shadow-card'>
        <p className='text-2xl'>📋</p>
        <h2 className='mt-3 text-lg font-medium text-navy-700'>Niciun șablon salvat</h2>
        <p className='mt-1 text-sm text-navy-500'>
          Salvați o evaluare ca șablon pentru a o reutiliza.
        </p>
        <Link
          href='/securitate-fizica'
          className='mt-4 inline-flex items-center gap-2 rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50'
        >
          ← Înapoi la evaluări
        </Link>
      </div>
    </main>
  </>
)

export default TemplatesPage
