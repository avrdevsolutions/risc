'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * Per-evaluare form data store. Persists all form field values to localStorage
 * so data survives a page refresh before the user has explicitly saved to DB.
 *
 * Data is indexed by evaluareId so multiple evaluare are independent.
 * Each evaluare gets its own localStorage key: `evaluare-<id>`.
 *
 * ADR-0020: Zustand for client-side state. This store supplements (not replaces)
 * React Hook Form — RHF still owns validation; this store owns persistence.
 */

type FormData = Record<string, unknown>

type EvaluareFormState = {
  /** Form field values indexed by evaluareId */
  evaluareDataMap: Record<string, FormData>
  /** Riscuri indexed by evaluareId (populated for reference) */
  evaluareRiscuriMap: Record<string, unknown[]>
}

type EvaluareFormActions = {
  setField: (evaluareId: string, name: string, value: unknown) => void
  setFields: (evaluareId: string, fields: FormData) => void
  setRiscuri: (evaluareId: string, riscuri: unknown[]) => void
  getFormData: (evaluareId: string) => FormData
  clearEvaluare: (evaluareId: string) => void
}

const initialState: EvaluareFormState = {
  evaluareDataMap: {},
  evaluareRiscuriMap: {},
}

export const useEvaluareFormStore = create<EvaluareFormState & EvaluareFormActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setField: (evaluareId, name, value) =>
          set(
            (state) => ({
              evaluareDataMap: {
                ...state.evaluareDataMap,
                [evaluareId]: {
                  ...(state.evaluareDataMap[evaluareId] ?? {}),
                  [name]: value,
                },
              },
            }),
            false,
            'setField',
          ),

        setFields: (evaluareId, fields) =>
          set(
            (state) => ({
              evaluareDataMap: {
                ...state.evaluareDataMap,
                [evaluareId]: {
                  ...(state.evaluareDataMap[evaluareId] ?? {}),
                  ...fields,
                },
              },
            }),
            false,
            'setFields',
          ),

        setRiscuri: (evaluareId, riscuri) =>
          set(
            (state) => ({
              evaluareRiscuriMap: {
                ...state.evaluareRiscuriMap,
                [evaluareId]: riscuri,
              },
            }),
            false,
            'setRiscuri',
          ),

        getFormData: (evaluareId) => get().evaluareDataMap[evaluareId] ?? {},

        clearEvaluare: (evaluareId) =>
          set(
            (state) => {
              const { [evaluareId]: _d, ...restData } = state.evaluareDataMap
              const { [evaluareId]: _r, ...restRiscuri } = state.evaluareRiscuriMap
              return { evaluareDataMap: restData, evaluareRiscuriMap: restRiscuri }
            },
            false,
            'clearEvaluare',
          ),
      }),
      {
        name: 'evaluare-form-store',
        partialize: (state) => ({
          evaluareDataMap: state.evaluareDataMap,
          evaluareRiscuriMap: state.evaluareRiscuriMap,
        }),
      },
    ),
    { name: 'EvaluareFormStore' },
  ),
)
