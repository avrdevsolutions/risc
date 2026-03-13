---
applyTo: 'src/components/layout/**'
---

# Layout Component Rules

> Source: ADR-0004 (component tiers). Layout tier: may import from `ui/` and `features/`.

## Import Boundaries

- MAY import from `@/components/ui` and `@/components/features`.
- MUST NOT import from other layout components (no circular deps).

## Primitives-First

Same rules as features — use `Section`, `Container`, `Stack`, `Typography`, `Separator`, `Badge` from `@/components/ui` before raw HTML.

## Server Components

- MUST be Server Components by default — no `'use client'`.
- Interactive parts (mobile nav toggle, dropdowns) are added by the UX Integrator agent, not the UI Builder.

## Exports

- Named exports only. No `export default`.
- Each folder MUST have an `index.ts` barrel exporting only the main component.

## Styling

- Project tokens only — never default Tailwind palette.
- No arbitrary Tailwind values.
