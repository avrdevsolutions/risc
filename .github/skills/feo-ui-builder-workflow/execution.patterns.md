# Phase 2 — Execution

> Loaded by `@feo-ui-builder` during Phase 2. Builds content contracts, feature components, layout components, and assembles the page.

## Prerequisites

- `page-builder-brief.md` exists with `approved: true`
- `foundation-manifest.json` has `status: "completed"`

## Manifest Initialization

Before Step 0, create `.github/flow-generator/FE/specs/page-builder-manifest.json` with `status: "in-progress"` and `last_completed_step: null`. Populate `sections` and `layout_components` arrays from the approved brief.

## Code Style — Mandatory

These rules apply to **every file** written during execution. They are enforced by ESLint and must be followed exactly. Full reference: `instructions/typescript-conventions.instructions.md`.

- **Arrow function expressions only** — never use `function` declarations. Components: `export const MyComponent = ({ title }: Props) => (…)`. Helpers: `const handleClick = () => { … }`.
- **Inline `type` keyword** — write `import { type FC, useState } from 'react'`, never `import type { FC } from 'react'`.
- **Import order** (blank line between each group): `react` → `next/*` → external packages → `@/*` internal aliases → parent `../` → sibling `./` → type-only.
- **`const` only** — use `let` only when reassignment is required. Never `var`.
- **No `console.log`** — only `console.warn` and `console.error`.
- **JSX** — no unnecessary curly braces (`prop="value"` not `prop={"value"}`). Self-close empty elements (`<Component />` not `<Component></Component>`).
- **Tailwind** — never combine contradicting utilities. Use `cn()` for conditional merges.
- **Named exports only** — `export default` is reserved for Next.js special files (`page.tsx`, `layout.tsx`, `error.tsx`, etc.).

## Step 0 — Content Contracts

Create `contracts/<page-name>.ts` (page name from the brief frontmatter).

### Rules

- Define one interface per discovered section: `<SectionName>Content` — fields match what the brief specifies (heading, body, images, CTAs, etc.)
- Define a top-level `<PageName>Content` interface composing all section interfaces.
- Export a `const <pageName>Content: <PageName>Content` with all text and image URLs extracted from the mockup — exact copy, original language.
- Import from `contracts/common.ts` only if shared types apply (unlikely for content, but available).
- Types-only imports at the top; the content const at the bottom.
- Images: store the external URL as-is. Use `{ src: string; alt: string; width: number; height: number }` shape.

### After Step 0

Update manifest: `last_completed_step: "contracts"`, append file to `files_modified`.

## Step 1–N — Feature Sections

Build each discovered section **in page order** (top to bottom as they appear in the mockup). For each section:

### Folder Structure

Feature sections are grouped under a **page-level folder** (name from the brief frontmatter, kebab-case — e.g., `landing-page`):

```
src/components/features/<page-name>/<section-name>/
├── <SectionName>.tsx
└── index.ts
```

All sections for a given page live under `features/<page-name>/`. A section folder must **never** be placed directly under `features/`.

### Component Rules

- **Server Component** — no `'use client'`, no hooks, no event handlers.
- **Props-driven** — receive a typed `<SectionName>Content` prop. Import the interface from the content contracts file.
- **Primitives-first** — use `Section`, `Container`, `Stack`, `Typography`, `Button`, `Badge`, `Separator` from `@/components/ui`. Refer to the brief for which primitives and variants to use.
- **Layout from mockup** — reproduce the mockup's grid/flex layout, responsive breakpoints, and spacing. Use Tailwind classes that map to project tokens.
- **Images** — use `next/image` from `next/image`. Set `width`/`height` from the content contract, or use `fill` with a sized parent. Always include `alt`.
- **Heading hierarchy** — follow the hierarchy plan from the brief. Use Typography's `variant` for visual style and `as` for semantic level when they differ.
- **Arrow functions + named exports** — per TypeScript conventions.
- **Barrel export** — `index.ts` re-exports only the main component.

### Sub-Component Extraction

If a section's JSX exceeds ~120 lines or has a repeated item pattern (e.g., a grid of cards), extract sub-components as siblings in the same folder. Only export the main component from `index.ts`.

### After Each Section

Update manifest: `last_completed_step: "section:<name>"`, append files to `files_modified`.

## Step N+1 — Layout Components

Build layout components discovered from the mockup (typically `header` and `footer`).

### Folder Structure

```
src/components/layout/<name>/
├── <Name>.tsx
└── index.ts
```

### Rules

- Same rules as feature sections: server-only, primitives-first, props-driven.
- Layout components MAY import from `@/components/ui` and `@/components/features`.
- **Header/Nav**: render all nav links statically. Do not add hamburger toggle or mobile menu behavior — that's for the UX Integrator. Render the full navigation visible.
- **Footer**: render all content visible. Use Stack, Typography, Separator.

### After Layout

Update manifest: `last_completed_step: "layout"`, append files to `files_modified`.

## Step N+2 — Page Assembly

Update `src/app/page.tsx`:

1. Import all feature sections and layout components from their barrels.
2. Import the content object from the contracts file.
3. Compose the page: layout (header) → sections in page order → layout (footer).
4. Pass the relevant content slice to each section as props.
5. Use `export default` (Next.js page convention).

### After Assembly

Update manifest: `last_completed_step: "page"`, append `src/app/page.tsx` to `files_modified`.

## Proceed to Phase 3

After page assembly, load `.github/skills/feo-ui-builder-workflow/quality-gates.patterns.md` and run gates.
