import { PlanDePazaFormPage } from '@/components/features/plan-de-paza/form'
import { Header } from '@/components/layout/header'

import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = {
  title: 'Plan de Pază',
}

const PlanDePazaFormPageRoute = async ({ params }: Props) => {
  const { id } = await params
  return (
    <>
      <Header />
      <PlanDePazaFormPage id={id} />
    </>
  )
}

export default PlanDePazaFormPageRoute
