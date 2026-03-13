import { createQueryKeyStore } from '@lukemorales/query-key-factory'

export const queryKeys = createQueryKeyStore({
  evaluari: {
    all: null,
    detail: (id: string) => [id],
    riscuri: (id: string) => [id, 'riscuri'],
  },
  templates: {
    all: null,
    detail: (id: string) => [id],
  },
})
