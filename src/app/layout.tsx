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
    <head>
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
      <link
        href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        rel='stylesheet'
      />
    </head>
    <body className='font-sans'>
      <QueryProvider>{children}</QueryProvider>
    </body>
  </html>
)

export default RootLayout
