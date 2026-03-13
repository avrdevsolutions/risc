import type { ReactNode } from 'react'

import { QueryProvider } from '@/components/providers/QueryProvider'

import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Evaluare de Risc SSM',
    template: '%s | Evaluare de Risc SSM',
  },
  description:
    'Aplicație pentru evaluarea riscurilor de securitate și sănătate în muncă pe șantiere de construcții',
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang='ro'>
    <body className='font-sans'>
      <QueryProvider>{children}</QueryProvider>
    </body>
  </html>
)

export default RootLayout
