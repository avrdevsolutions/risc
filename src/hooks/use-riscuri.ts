'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import type { RiscFormValues } from '@/lib/schemas'
import type { Risc, EvaluareWithRiscuri, ApiResponse } from '@/lib/types'

const riscuriUrl = (evaluareId: string) => `/api/securitate-fizica/${evaluareId}/riscuri`
const riscUrl = (evaluareId: string, riscId: string) =>
  `/api/securitate-fizica/${evaluareId}/riscuri/${riscId}`

export const useRiscuri = (evaluareId: string) =>
  useQuery({
    queryKey: queryKeys.evaluari.riscuri(evaluareId).queryKey,
    queryFn: async (): Promise<Risc[]> => {
      const res = await fetch(riscuriUrl(evaluareId))
      if (!res.ok) throw new Error('Eroare la încărcarea riscurilor')
      const json: ApiResponse<Risc[]> = await res.json()
      return json.data
    },
    enabled: !!evaluareId,
  })

export const useAddRisc = (evaluareId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: RiscFormValues): Promise<Risc> => {
      const res = await fetch(riscuriUrl(evaluareId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Eroare la adăugarea riscului')
      const json: ApiResponse<Risc> = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.riscuri(evaluareId).queryKey })
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.detail(evaluareId).queryKey })
    },
  })
}

export const useUpdateRisc = (evaluareId: string, riscId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<RiscFormValues>): Promise<Risc> => {
      const res = await fetch(riscUrl(evaluareId, riscId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Eroare la actualizarea riscului')
      const json: ApiResponse<Risc> = await res.json()
      return json.data
    },
    onSuccess: (updated) => {
      qc.setQueryData(
        queryKeys.evaluari.detail(evaluareId).queryKey,
        (old: EvaluareWithRiscuri | undefined) => {
          if (!old) return old
          return {
            ...old,
            riscuri: old.riscuri.map((r) => (r.id === riscId ? { ...r, ...updated } : r)),
          }
        },
      )
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.riscuri(evaluareId).queryKey })
    },
  })
}

export const useDeleteRisc = (evaluareId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (riscId: string) => {
      const res = await fetch(riscUrl(evaluareId, riscId), { method: 'DELETE' })
      if (!res.ok) throw new Error('Eroare la ștergerea riscului')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.riscuri(evaluareId).queryKey })
      qc.invalidateQueries({ queryKey: queryKeys.evaluari.detail(evaluareId).queryKey })
    },
  })
}
