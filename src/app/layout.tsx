import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import './globals.css'

/**
 * Root layout — EXAMPLE. Customize for your project.
 *
 * TODO: Replace metadata with your project's brand name and description.
 * TODO: Add fonts from next/font/google or next/font/local.
 * TODO: Add Header/Footer layout components once created.
 *
 * See docs/adrs/0013-seo-metadata.md for SEO setup.
 */

// EXAMPLE: Replace with your project's brand name and description
export const metadata: Metadata = {
  title: {
    default: 'My App', // TODO: Replace with brand name
    template: '%s | My App', // TODO: Replace with brand name
  },
  description: 'TODO: Add application description',
  // TODO: Add Open Graph metadata and favicon once brand is defined.
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      {/* EXAMPLE: Add font variables to body className once fonts are configured */}
      <body>{children}</body>
    </html>
  )
}
