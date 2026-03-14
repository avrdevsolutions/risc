import type { ReactNode } from 'react'

import { QueryProvider } from '@/components/providers/QueryProvider'

import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Evaluări Securitate Fizică',
    template: '%s | Evaluări Securitate Fizică',
  },
  description:
    'Rapoarte de evaluare și tratare a riscurilor la securitatea fizică — Conform Instrucțiunilor M.A.I. nr. 9/2013',
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang='ro'>
    <body className='font-sans'>
      <QueryProvider>{children}</QueryProvider>
    </body>
  </html>
)

export default RootLayout
