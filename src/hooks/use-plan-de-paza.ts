'use client'

import { createQueryKeyStore } from '@lukemorales/query-key-factory'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiResponse, Evaluare } from '@/lib/types'

const BASE = '/api/plan-de-paza'

const planDePazaKeys = createQueryKeyStore({
  planuri: {
    all: null,
    detail: (id: string) => [id],
  },
})

const fetchPlanuri = async (): Promise<Evaluare[]> => {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Eroare la încărcarea planurilor')
  const json: ApiResponse<Evaluare[]> = await res.json()
  return json.data
}

export const usePlanuri = () =>
  useQuery({
    queryKey: planDePazaKeys.planuri.all.queryKey,
    queryFn: fetchPlanuri,
  })

export const useCreatePlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<Evaluare> => {
      const res = await fetch(BASE, { method: 'POST' })
      if (!res.ok) throw new Error('Eroare la crearea planului')
      const json: ApiResponse<Evaluare> = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: planDePazaKeys.planuri.all.queryKey })
    },
  })
}

export const useDeletePlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Eroare la ștergerea planului')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: planDePazaKeys.planuri.all.queryKey })
    },
  })
}
