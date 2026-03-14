import { EvaluarePage } from '@/components/features/evaluare/page'
import { Header } from '@/components/layout/header'

import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = {
  title: 'Evaluare de Securitate Fizică',
}

const SecuritateFizicaEvaluarePageRoute = async ({ params }: Props) => {
  const { id } = await params
  return (
    <>
      <Header />
      <EvaluarePage id={id} />
    </>
  )
}

export default SecuritateFizicaEvaluarePageRoute
