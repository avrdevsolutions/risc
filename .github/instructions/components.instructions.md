---
applyTo: 'src/components/**'
---

# Component Structure Constraints

> Source: ADR-0004. Patterns, examples, and decision trees → `skills/components/`.

## Tier System & Import Boundaries

- `ui/` MUST NOT import from `features/` or `layout/`.
- `features/` MAY import from `ui/`. MUST NOT import from `layout/`.
- `layout/` MAY import from `ui/` and `features/`.
- `app/*/_components/` MAY import from all tiers.

## Feature Folder Organization

- Feature sections are **grouped by page**: `features/<page-name>/<section-name>/`. A section folder MUST NOT sit directly under `features/`.
- `<page-name>` is kebab-case matching the page (e.g., `landing-page`, `about-page`).

## Multi-Component Feature Folders

- A composition (multiple sub-components forming one unit) MUST live in its own kebab-case folder under the feature domain.
- Only the main component MUST be exported from `index.ts`.
- Sub-components MUST NOT be exported from the barrel — consumers never import them directly.
- Sub-components SHOULD be siblings of the main component for small compositions.
- Use a `components/` sub-folder only when the composition has hooks, utils, types, or >5 sub-components.

## Primitives-First

- MUST use `Section` instead of `<section>` with manual padding/spacing.
- MUST use `Container` instead of `<div className="mx-auto max-w-…">`.
- MUST use `Stack` instead of `<div className="flex flex-col gap-…">`.
- MUST use `Typography` instead of `<h1>`, `<h2>`, `<p>` with ad-hoc text classes.
- SHOULD use `Separator` instead of `<hr>` or `<div className="border-b">`.
- SHOULD use `Badge` instead of `<span>` with ad-hoc tag/status styles.
- Raw HTML is allowed only when no primitive covers the use case.

## Exports

- All reusable components MUST use named exports.
- `export default function` MUST be used only for Next.js special files.
- Each component folder MUST have an `index.ts` barrel exporting the public API only.
- MUST import from barrels, not from internal file paths.

## Server vs Client

- MUST default to Server Component — add `'use client'` only when required.
- `'use client'` is required only for: event handlers, browser APIs, `useState`/`useEffect`, context providers, animations.
- SHOULD extract only the interactive part to minimize the client boundary size.

## Component Splitting (MUST extract a sub-component when any is true)

- File ~140 lines; JSX block has its own local state/hooks; list items need hooks; visual region serves a different purpose; JSX is duplicated; isolated imperative logic; >3 responsibilities.

## Accessibility

- UI tier (`ui/`): MUST be keyboard navigable, have ARIA attributes, focus-visible styles, ≥4.5:1 contrast, and forward `ref`.
- Features tier: SHOULD use semantic HTML; MUST not skip heading levels; MUST connect form labels to inputs.
