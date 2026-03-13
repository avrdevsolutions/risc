---
applyTo: 'src/components/features/**'
---

# Feature Component Rules

> Source: ADR-0004 (component tiers). Features tier: uses `ui/`, never imports from `layout/`.

## Folder Structure

Feature sections are **grouped by page** under a page-level folder:

```
src/components/features/<page-name>/<section-name>/
├── <SectionName>.tsx
└── index.ts
```

- `<page-name>` is kebab-case and matches the page (e.g., `landing-page`, `about-page`).
- A section folder MUST NOT live directly under `features/` — it must be nested under its page folder.
- All sections for a given page live under the same page folder.

## Import Boundaries

- MUST import primitives from `@/components/ui` barrel only.
- MUST NOT import from `@/components/layout`.
- MAY import from sibling files within the same feature folder.

## Primitives-First

- MUST use `Section` instead of `<section>` with manual padding/spacing.
- MUST use `Container` instead of `<div className="mx-auto max-w-…">`.
- MUST use `Stack` instead of `<div className="flex flex-col gap-…">`.
- MUST use `Typography` instead of raw `<h1>`, `<h2>`, `<p>` with ad-hoc text classes.
- SHOULD use `Separator` instead of `<hr>` or `<div className="border-b">`.
- SHOULD use `Badge` instead of `<span>` with ad-hoc tag/status styles.

## Server Components

- MUST be Server Components by default — no `'use client'`.
- NO React hooks (`useState`, `useEffect`, `useRef`, etc.).
- NO event handlers (`onClick`, `onChange`, etc.).
- When the UX Integrator adds interactivity later, only the interactive part should be extracted to a client component.

## Props & Content

- MUST receive content through typed props — no hardcoded strings in JSX.
- Content interfaces live in `contracts/<page>.ts`.
- Images use `next/image` with explicit `width`/`height` or `fill`. Always include `alt`.

## Exports

- Named exports only. No `export default`.
- Each folder MUST have an `index.ts` barrel exporting only the main component.
- Sub-components are siblings in the same folder, not exported from the barrel.

## Styling

- Project tokens only — never default Tailwind palette (`gray`, `slate`, `zinc`, `red`, `blue`, etc.).
- No arbitrary Tailwind values — use named tokens from `tailwind.config.ts`.
- No dynamic class interpolation (`gap-${gap}`) — static classes only.

## Splitting

Extract a sub-component when: JSX exceeds ~120 lines, a list item pattern repeats, or a region has a distinct purpose.
