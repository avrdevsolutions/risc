# Phase 3 — Quality Gates

> Loaded by `@feo-ui-builder` during Phase 3. Run all gates, update manifest to `completed`.

## Gate Execution

Run each gate in order. Record result as `"pass"` or `"fail"` in `page-builder-manifest.json` → `quality_gates`.

If a gate fails: fix the issue, re-run that gate. Do not skip gates.

## Gates

### G0 — Section Completeness

Every section listed in `page-builder-manifest.json` → `sections` has a corresponding folder in `src/components/features/<page-name>/` with a `.tsx` file and `index.ts` barrel.

Every layout component listed in `layout_components` has a corresponding folder in `src/components/layout/`.

### G1 — Primitives-First

Scan all feature and layout component `.tsx` files for raw HTML that should use primitives:

- No `<section` without using the `Section` primitive
- No `<div className="mx-auto max-w-` — use `Container`
- No `<div className="flex` — use `Stack`
- No `<h1`, `<h2`, `<h3`, `<h4`, `<p` with ad-hoc text classes — use `Typography`
- No `<hr` — use `Separator`

Raw HTML is allowed only when no primitive covers the use case (e.g., `<img>` wrapper divs, grid containers, semantic elements like `<nav>`, `<address>`).

### G2 — Token Compliance

Scan all `.tsx` files in `features/` and `layout/` for forbidden Tailwind default palette usage:

- No `text-gray-`, `bg-slate-`, `border-zinc-`, `text-red-`, `bg-blue-`, etc.
- Only project tokens from `tailwind.config.ts` are allowed.

### G3 — Heading Hierarchy

Parse the assembled page (follow imports from `page.tsx`) and verify:

- Exactly one `h1` element across the full page (via Typography `as="h1"` or variant that defaults to h1)
- No skipped heading levels (h1 → h2 → h3, never h1 → h3)

### G4 — Image Handling

Every `<img` or image element must use `next/image` (`Image` from `next/image`):

- Has explicit `width`/`height` OR `fill` prop
- Has non-empty `alt` text

### G5 — Server-Only

Zero `'use client'` directives in any file under `src/components/features/` or `src/components/layout/`.

Zero React hook imports (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`).

Zero event handler props (`onClick`, `onChange`, `onSubmit`, `onKeyDown`, etc.).

### G6 — Content Contracts

- The contracts file exists at the path specified in the manifest.
- Every feature section receives its content via typed props — no hardcoded strings in JSX.
- All content interfaces are exported from the contracts file.

### G7 — Barrel Exports

- Every component folder (`features/<name>/`, `layout/<name>/`) has an `index.ts`.
- `page.tsx` imports from barrels, not from internal file paths.

### G8 — Code Style

Scan all files written during execution for TypeScript convention violations:

- No `function` declarations — all components and helpers must use arrow function expressions.
- No `import type { … }` — must use inline `import { type … }` syntax.
- Import groups must be separated by blank lines in the correct order (react → next → external → @/\* → parent → sibling → type-only).
- No `console.log` statements.
- No unnecessary JSX curly braces (`prop="value"` not `prop={"value"}`).
- All empty elements must be self-closed.
- No `export default` except in Next.js special files.

If any violation is found: fix it, then re-run this gate.

### G9 — Build Verification

Run `pnpm build`. Must exit with code 0 and no TypeScript errors.

## Finalize Manifest

After all gates pass:

1. Set `status: "completed"` in `page-builder-manifest.json`.
2. Set `completed_at` to current ISO timestamp.
3. Set `last_completed_step: "completed"`.
4. Verify all `quality_gates` entries are `"pass"`.

Report to user: **"Page build complete. [N] sections and [M] layout components built. All [G] quality gates passed."**
