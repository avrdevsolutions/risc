---
description: 'Component structure, tiers, folder conventions, props, composition, primitives-first usage, and server/client boundaries. Use when creating, placing, or refactoring React components.'
---

# Components Skill

> Compiled from ADR-0004 (Component Structure & Tiers).

## Pattern Files

| File                            | Use When                                                                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tier-structure.patterns.md`    | Deciding where to place a component, setting up a feature folder, structuring a multi-component composition, verifying tier import direction             |
| `props-composition.patterns.md` | Writing component props types, choosing a composition pattern (children / compound / slot), setting up barrel exports                                    |
| `primitives-first.patterns.md`  | Building a feature or layout component — choosing primitives over raw HTML+Tailwind                                                                      |
| `boundaries.patterns.md`        | Choosing server vs client directive, minimizing the client boundary, styling error/loading/not-found files, Suspense + skeleton patterns, responsive nav |

## Key Constraints

- `ui/` MUST NOT import from `features/` or `layout/` — import flows downward only.
- Multi-component compositions MUST live in their own kebab-case folder; only the main component is exported.
- Sub-components MUST NOT be re-exported from the barrel — they are private.
- Feature/layout components MUST use `Section`, `Container`, `Stack`, `Typography` instead of raw HTML.
- All reusable components MUST use named exports (never `export default`).
- MUST default to Server Component — `'use client'` only when interactivity is required.
