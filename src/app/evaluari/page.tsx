import { DashboardPage } from '@/components/features/dashboard'
import { Header } from '@/components/layout/header'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evaluări de risc',
}

const EvaluariPage = () => (
  <>
    <Header />
    <DashboardPage />
  </>
)

export default EvaluariPage
