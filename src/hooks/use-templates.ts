'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import type { Template, Evaluare, ApiResponse } from '@/lib/types'

const BASE = '/api/templates'

export const useTemplates = () =>
  useQuery({
    queryKey: queryKeys.templates.all.queryKey,
    queryFn: async (): Promise<Template[]> => {
      const res = await fetch(BASE)
      if (!res.ok) throw new Error('Eroare la încărcarea template-urilor')
      const json: ApiResponse<Template[]> = await res.json()
      return json.data
    },
  })

export const useSaveTemplate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      nume: string
      descriere?: string
      continut: string
    }): Promise<Template> => {
      const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Eroare la salvarea template-ului')
      const json: ApiResponse<Template> = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.templates.all.queryKey })
    },
  })
}

export const useDeleteTemplate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Eroare la ștergerea template-ului')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.templates.all.queryKey })
    },
  })
}

export const useCreateFromTemplate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (templateId: string): Promise<Evaluare> => {
      const res = await fetch(`${BASE}/${templateId}`, { method: 'POST' })
      if (!res.ok) throw new Error('Eroare la crearea evaluării din template')
      const json: ApiResponse<Evaluare> = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.all.queryKey })
    },
  })
}
