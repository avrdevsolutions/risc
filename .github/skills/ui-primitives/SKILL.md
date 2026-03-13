---
description: 'UI foundation primitive patterns — Typography, Button, Container, Section, Stack, Badge, Separator. Use when customizing, extending, or composing primitives in src/components/ui/.'
---

# UI Primitives Skill

> Compiled from ADR-0023 (UI Foundation Primitives). Last synced: 2026-03-11.
> Primitives are pre-built in `src/components/ui/`. Read source code for current API/styles. These patterns cover customization and composition only.

## Pattern Files

| File                        | Use When                                                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `customization.patterns.md` | Updating primitives from a mockup — variant discovery, extending types, adding/changing variants, mockup-driven rules, shadcn/ui relationship |
| `composition.patterns.md`   | Building pages/features using primitives — Container+Stack sections, page rhythm, Link composition with `buttonVariants()`, anti-patterns     |

## Invocation Modes

The `@feo-ui-foundation` agent supports 2 scenarios — see `agents/feo-ui-foundation.agent.md` §Mode Detection:

| Scenario                    | When                               | Reads                                                                   |
| --------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| A: Fresh mockup             | Chosen mockup + placeholder tokens | `customization.patterns.md` + `styling/token-customization.patterns.md` |
| B: Mockup + existing tokens | Chosen mockup + customized tokens  | Same as A, plus current token/primitive state for diff                  |

## Key Constraints (Quick Reference)

1. All 7 Required primitives are **pre-built** — customize from mockup, don't rebuild.
2. Mockup drives **visual values** (colors, sizes, spacing), not **what gets built**.
3. `forwardRef` required for **interactive** primitives only (Button, Input, Select). Layout primitives are exempt.
4. All headings MUST use `<Typography>` — never raw `<h1 className="...">`.
5. Every page section MUST use `<Section>` (which composes `<Container>` internally) — no ad-hoc `<section>` + `<Container>` nesting.
6. Stack's `gapMap` MUST be a static object — never dynamic `gap-${gap}` interpolation.
7. Button heights MUST match Input heights per size tier (ADR-0012).
8. Standard variant coverage: build variants the project will predictably need, not just what the mockup shows.
9. **Primitives catalog**: `src/components/ui/catalog.json` is the thin index (names, paths, axes). Each primitive has a co-located `manifest.json` with full API surface (variant values, props, defaults, exports). Read the catalog for overview, individual manifests for detail — avoid reading `.tsx` source unless editing.
10. **Design tokens manifest**: `src/components/ui/design-tokens.json` is the structured, agent-readable source of truth for available colors, fonts, and custom tokens. Any agent that adds tokens to `tailwind.config.ts` must also update this file.
