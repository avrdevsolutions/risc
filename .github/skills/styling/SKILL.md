---
description: 'Styling patterns — Tailwind token customization, mockup-to-config workflow, shadcn/ui restyling checklist, library compatibility, responsive strategies. Use when updating tailwind.config.ts, customizing globals.css, adding or restyling component library components, or resolving styling inconsistencies.'
---

# Styling Skill

> Compiled from ADR-0002 (Styling). Last synced: 2026-03-11.
> Always-on rules (forbidden palette, cn(), no CSS-in-JS) live in `instructions/components.instructions.md` and `copilot-instructions.md`. This skill covers **task-specific workflows** agents need when customizing tokens or restyling library components.

## Pattern Files

| File                              | Use When                                                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `token-customization.patterns.md` | Updating `tailwind.config.ts` or `globals.css` from a mockup — color scales, fonts, spacing, CSS custom props    |
| `restyling.patterns.md`           | Adding a shadcn/ui component, restyling library output, choosing compatible libraries, className override depth   |

## Key Constraints (Quick Reference)

1. Tailwind CSS v3 only — no v4 without a dedicated ADR.
2. `tailwind.config.ts` is the single source of truth for design tokens.
3. Placeholder tokens (blue primary, purple secondary) MUST be replaced per project.
4. Default Tailwind palette is **forbidden** — only project tokens from `tailwind.config.ts`.
5. Only unstyled/headless or Tailwind-native libraries allowed — no CSS-in-JS runtimes.
6. Every library component MUST be restyled to project tokens before use.
7. Mobile-first: default styles = mobile, add `sm:` / `md:` / `lg:` for wider.
8. Prefer variant props over deep `className` overrides (`[&>span]` selectors).

## Cross-References

- `instructions/components.instructions.md` — always-on styling rules (auto-attached to `src/components/**`)
- `instructions/storybook.instructions.md` — story file conventions (auto-attached to `**/*.stories.tsx`)
- `instructions/ui-primitives.instructions.md` — primitive authoring rules (auto-attached to `src/components/ui/**`)
- `instructions/ui-usage.instructions.md` — primitive consumption rules (auto-attached to app/features/layout)
- `skills/ui-primitives/` — customization + composition patterns for the 6 foundation primitives
