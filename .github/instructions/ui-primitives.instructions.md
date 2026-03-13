---
applyTo: 'src/components/ui/**'
---

# UI Foundation Primitives — Authoring

> Source: ADR-0023. For component tiers and general structure see `components.instructions.md` (ADR-0004).
> For **consumption rules** (how to use primitives in pages/features) see `ui-usage.instructions.md`.

## Primitive Inventory

All 7 Required primitives are **pre-built** in `src/components/ui/`. See `src/components/ui/catalog.json` for a quick overview. Each primitive has a co-located `manifest.json` with full API surface (variant axes, props, defaults, exports). Customize from mockup — see `skills/ui-primitives/customization.patterns.md`.

1. Typography — polymorphic, semantic heading mapping + body/caption/overline variants
2. Button — `cva` variants, `forwardRef`, loading state
3. Container — max-width constraint + responsive horizontal padding
4. Section — composes Container, spacing + background presets for page sections
5. Stack — flex layout with static `gapMap`, `wrap`, `align`, `justify`
6. Badge — `cva` semantic color variants
7. Separator — horizontal/vertical, decorative vs semantic `role`

Recommended (Card, Input, Skeleton, Avatar, Icon wrapper) — build when first needed.
Optional (Dialog, Dropdown, Tooltip, Tabs, Sheet, Toast, Accordion) — build only when explicitly needed.

## Architecture Rules

- Server Component by default — `'use client'` only when interactivity requires it.
- **Native HTML props pass-through** — every primitive MUST extend the native HTML props of its root element (via `React.ComponentPropsWithoutRef<T>` or `React.ComponentProps<T>`) and spread `...props` onto the root element. This lets consumers pass `id`, `aria-*`, `data-*`, and any other standard HTML attributes without the primitive needing to declare them explicitly.
- `cn()` for class merging + `className` escape hatch on every primitive.
- `cva` for variant-driven APIs (Button, Badge).
- Barrel `index.ts` per primitive folder + root `ui/index.ts` barrel.
- Project tokens only — no default Tailwind palette.

## Ref Forwarding Scope

- **Interactive primitives** (Button, Input, Select, Textarea, Checkbox) — MUST `forwardRef`.
- **Layout primitives** (Typography, Container, Section, Stack, Separator) — exempt. Add `forwardRef` only if a specific need arises.

## Variant Authoring Rules

- Any text pattern recurring 3+ times across mockup sections MUST become a Typography variant.
- Variant values MUST come from the chosen mockup's CSS — not from ADR template defaults.
- Max 12 Typography variants — if exceeded, split into separate components.
- Standard variant coverage: build variants the project will predictably need, not just what the mockup shows.

## Extending an Existing Primitive

When adding a new prop or variant to an existing primitive:

1. **Add to the type** — extend the props type (or `cva` variants object for variant-driven components).
2. **Implement** — wire the prop into the component JSX/logic. Keep the `className` escape hatch working.
3. **Update the story** — add stories covering the new prop/variant. New variant → individual story + update `AllVariants`.
4. **Update the barrel** — if you added a new named export (e.g., a variants function), re-export from `index.ts`.
5. **Update the manifest** — update `manifest.json` in the primitive's folder with any new variant values, props, or exports. If a new variant axis was added, also update `src/components/ui/catalog.json`.
6. **Sync design tokens** — if you added new tokens to `tailwind.config.ts` (e.g., a new color, spacing value, or font), update `src/components/ui/design-tokens.json` to reflect the addition.
7. **Never remove** an existing prop without checking all consumers first.

## Creating a New Primitive

**Promotion trigger**: if the same Tailwind pattern (3+ classes) appears in 3+ files, extract it into a primitive.

Check the tier first:

- **Recommended** (Card, Input, Skeleton, Avatar, Icon wrapper) — build when first needed.
- **Optional** (Dialog, Dropdown, Tooltip, Tabs, Sheet, Toast, Accordion) — prefer shadcn/ui (Radix-based).

Checklist:

1. Create `src/components/ui/<name>/<Name>.tsx` — follow Architecture Rules above.
2. Create `src/components/ui/<name>/index.ts` — barrel export.
3. Re-export from `src/components/ui/index.ts`.
4. Create `src/components/ui/<name>/<Name>.stories.tsx` — see `storybook.instructions.md`.
5. If interactive (buttons, inputs, selects) — `forwardRef` + focus ring.
6. Accept `className` prop — merge with `cn()`.
7. Use project tokens only — no default Tailwind palette.
8. **Create the manifest** — create `manifest.json` in the new primitive's folder following the schema in existing `manifest.json` files.
9. **Update the catalog** — add the new primitive to `src/components/ui/catalog.json`.
10. **Sync design tokens** — if you added new tokens to `tailwind.config.ts`, update `src/components/ui/design-tokens.json`.

## Storybook

- Every primitive MUST have a co-located `*.stories.tsx` — see `storybook.instructions.md`.
- Cover all variants + all interactive states (hover, focus, disabled, loading).
- When extending a primitive (new prop/variant) — update its story file in the same PR.

## Mockup-Driven Customization

See `skills/ui-primitives/customization.patterns.md` for the full process.
The mockup drives **visual values** — not what gets built. All 7 primitives stay unconditionally.
