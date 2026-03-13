# UI Primitives — Customization Patterns

**Source**: ADR-0023 §Mockup-Driven Customization, §Typography, §Button, §Badge
**Last synced**: 2026-03-11

---

> The primitives already exist in `src/components/ui/`. Read the `manifest.json` in each primitive's folder for current types, variants, and styles. Read `.tsx` source files only when you are about to edit them. This file covers **how to customize them from a mockup** — not what they look like today.

## Mockup-Driven Customization

### What the Mockup Drives

1. **Visual values** — font sizes, weights, colors, spacing, border-radius from the mockup's CSS.
2. **Variant discovery** — recurring patterns (3+ occurrences) become primitive variants.
3. **Additional variants** — button styles, badge colors, typography patterns beyond current defaults.
4. **Additional primitives** — if mockup uses forms, cards, or dialogs, build those from Recommended/Optional tier.
5. **CSS custom property mapping** — `:root { --color-*, --font-* }` → `tailwind.config.ts` tokens + `globals.css`.

### What the Mockup Does NOT Drive

- All 7 Required primitives stay **unconditionally** — even if the mockup shows only a subset.
- Include **standard variant coverage** beyond what the mockup shows. One button style in the mockup → still keep primary, outline, ghost, danger.
- A mockup is a snapshot of 1–2 pages. The project will grow.

---

## Typography — Variant Discovery Process

1. **Scan** the mockup for every distinct text style (unique combo of font-family, size, weight, letter-spacing, text-transform, line-height).
2. **Group** identical/near-identical styles across sections — 3+ occurrences = a variant.
3. **Map** each group to a variant name: `h1`–`h4` for headings, `body`/`body-sm` for paragraphs, `caption` for metadata, `overline` for uppercase labels. Add custom names (e.g., `display`, `lead`, `eyebrow`) when patterns don't fit defaults.
4. **Translate** each variant's mockup CSS → Tailwind utilities, including responsive breakpoints.
5. **Color is separate** — do NOT put color classes into `variantStyles`. Typography variants define structure only (size, weight, tracking, line-height, text-transform). Color comes from section context via CSS `color` inheritance, or from `className` for muted/accent text (e.g., `className="text-foreground/60"`).

### Adding Custom Variants

Extend `TypographyVariant` union + add entries to **both** `variantStyles` and `defaultElementMap`:

```tsx
// In Typography.tsx — extend existing type and both maps
type TypographyVariant = 'h1' | 'h2' | /* existing */ | 'display' | 'lead' | 'eyebrow'

const variantStyles = { /* existing + */ display: '...', lead: '...', eyebrow: '...' }
const defaultElementMap = { /* existing + */ display: 'h1', lead: 'p', eyebrow: 'span' }
```

Max 12 variants. If exceeded, split into separate components.

### Variant Ambiguity Rule

A new Typography variant must differ from existing variants in **at least 2** CSS properties:

- font-family, font-size, font-weight, letter-spacing, text-transform, line-height

If a text style differs from an existing variant in only 1 property (e.g., same as `body` but lighter weight), use `className` instead of a new variant. This keeps the variant inventory meaningful and prevents near-duplicate proliferation.

---

## Button / Badge — Updating Variants

Both use `cva`. To customize:

1. Read the primitive's `manifest.json` to understand current variant axes and values. Read `.tsx` source only when applying edits.
2. Update Tailwind classes in existing variants to match mockup CSS.
3. Add new variant entries to the `variants.variant` object when the mockup reveals new patterns.
4. Keep standard variants the project will predictably need (e.g., `danger` even without a delete screen yet).
5. **Update `manifest.json`** immediately after editing — add any new variant values, props, or exports.

---

## shadcn/ui Relationship

| Primitive                             | Custom or shadcn/ui?    | Note                                   |
| ------------------------------------- | ----------------------- | -------------------------------------- |
| Typography, Container, Section, Stack | **Custom only**         | shadcn/ui doesn't provide these        |
| Button, Badge, Separator              | **Either**              | Restyle to project tokens per ADR-0002 |
| Card, Dialog, Dropdown, etc.          | **shadcn/ui preferred** | Radix-based, accessible out of the box |

When using shadcn/ui: run through the restyling checklist in `skills/styling/restyling.patterns.md` — replace default colors with project tokens, verify focus rings, test all states.

---

## React 19 Migration Note

Current Button uses `forwardRef` (React 18). React 19 deprecates `forwardRef` — `ref` becomes a regular prop. When the project upgrades React, refactor Button (and future form primitives from ADR-0012) to accept `ref` directly in props.

---

## Font Registration

Font registration is a foundation agent responsibility. When a mockup introduces new fonts:

1. **`src/app/layout.tsx`** — Import fonts via `next/font/google`, define CSS variables:

   ```tsx
   import { Playfair_Display, Source_Sans_3 } from 'next/font/google'

   const display = Playfair_Display({
     subsets: ['latin'],
     variable: '--font-display',
   })
   const body = Source_Sans_3({
     subsets: ['latin'],
     variable: '--font-body',
   })
   ```

   Apply CSS variable classes to `<html>` or `<body>`: `className={`${display.variable} ${body.variable}`}`

2. **`tailwind.config.ts`** — Update `fontFamily` to reference the CSS variables:

   ```ts
   fontFamily: {
     display: ['var(--font-display)', 'serif'],
     body: ['var(--font-body)', 'sans-serif'],
   }
   ```

3. **Typography variants** — Reference the new font tokens: `font-display` for headings, `font-body` for paragraphs.
