'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import type { Evaluare, EvaluareWithRiscuri, ApiResponse } from '@/lib/types'

const BASE = '/api/securitate-fizica'

const fetchEvaluari = async (): Promise<Evaluare[]> => {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Eroare la încărcarea evaluărilor')
  const json: ApiResponse<Evaluare[]> = await res.json()
  return json.data
}

const fetchEvaluare = async (id: string): Promise<EvaluareWithRiscuri> => {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Eroare la încărcarea evaluării')
  const json: ApiResponse<EvaluareWithRiscuri> = await res.json()
  return json.data
}

export const useEvaluari = () =>
  useQuery({
    queryKey: queryKeys.evaluari.all.queryKey,
    queryFn: fetchEvaluari,
  })

export const useEvaluare = (id: string) =>
  useQuery({
    queryKey: queryKeys.evaluari.detail(id).queryKey,
    queryFn: () => fetchEvaluare(id),
    enabled: !!id,
  })

export const useCreateEvaluare = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<Evaluare> => {
      const res = await fetch(BASE, { method: 'POST' })
      if (!res.ok) throw new Error('Eroare la crearea evaluării')
      const json: ApiResponse<Evaluare> = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.all.queryKey })
    },
  })
}

export const useUpdateEvaluare = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Evaluare>): Promise<Evaluare> => {
      const res = await fetch(`${BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Eroare la salvarea evaluării')
      const json: ApiResponse<Evaluare> = await res.json()
      return json.data
    },
    onSuccess: (updated) => {
      qc.setQueryData(
        queryKeys.evaluari.detail(id).queryKey,
        (old: EvaluareWithRiscuri | undefined) => (old ? { ...old, ...updated } : undefined),
      )
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.all.queryKey })
    },
  })
}

export const useDeleteEvaluare = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Eroare la ștergerea evaluării')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.all.queryKey })
    },
  })
}

export const useDuplicateEvaluare = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<Evaluare> => {
      const res = await fetch(`${BASE}/${id}/duplicate`, { method: 'POST' })
      if (!res.ok) throw new Error('Eroare la duplicarea evaluării')
      const json: ApiResponse<Evaluare> = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.all.queryKey })
    },
  })
}
