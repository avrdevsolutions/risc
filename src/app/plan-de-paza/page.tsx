import { PlanDePazaDashboardPage } from '@/components/features/plan-de-paza/dashboard'
import { Header } from '@/components/layout/header'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plan de Pază',
}

const PlanDePazaPage = () => (
  <>
    <Header />
    <PlanDePazaDashboardPage />
  </>
)

export default PlanDePazaPage
