# Components — Tier Structure & Folder Patterns

**Source**: ADR-0004 §Tier System, §Component Splitting Triggers, §Folder Structure, §Anti-Patterns
**Last synced**: 2026-03-13

---

## Tier System

| Tier            | Location               | Purpose                                                             | May Import From               |
| --------------- | ---------------------- | ------------------------------------------------------------------- | ----------------------------- |
| **1: UI**       | `components/ui/`       | Reusable primitives (Button, Typography, Container, Stack, Section) | Nothing from `components/`    |
| **2: Features** | `components/features/` | Feature-specific components (Hero, PricingCard, UserProfile)        | `ui/`, other `features/`      |
| **3: Layout**   | `components/layout/`   | App-wide chrome (Header, Footer, Sidebar, Nav)                      | `ui/`, `features/`            |
| **Page**        | `app/*/_components/`   | Page-private (not reusable outside that page)                       | `ui/`, `features/`, `layout/` |

**Import direction** — higher tiers import lower tiers, never upward:

```
app/* → layout/ → features/ → ui/
                               ↑ Never import upward
```

---

## Layout Tier vs Next.js `layout.tsx` — They Are Different

| `src/app/layout.tsx`                                | `src/components/layout/Header.tsx`        |
| --------------------------------------------------- | ----------------------------------------- |
| Next.js special file (routing, metadata, providers) | Reusable layout component (visual chrome) |
| `export default function` declaration               | Arrow function export                     |
| Orchestrates `components/layout/`                   | Consumed by `app/layout.tsx`              |

`layout.tsx` **imports from** `components/layout/`. They collaborate — not competing:

```tsx
// src/app/layout.tsx — Next.js special file
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

---

## Layout vs Page Chrome — Decision Tree

```
Is this chrome (header, footer, nav, sidebar) shared across multiple routes?
  → YES: Put it in layout.tsx (root or route group layout)
  → NO: Is it specific to only ONE page?
    → YES: Put it in page.tsx or _components/
    → NO: It's shared — put it in layout.tsx
```

**Why**: `error.tsx` and `not-found.tsx` render within the layout — if Navbar/Footer live in `layout.tsx`, they appear on error and 404 pages without duplication.

```tsx
// ✅ Correct — shared chrome in layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <SkipNav />
        <Navbar />
        <main id='main-content'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

// src/app/page.tsx — only page-specific content
export default function HomePage() {
  return (
    <>
      <Hero />
      <Collections />
      <Services />
    </>
  )
}

// ❌ Wrong — chrome duplicated in page.tsx
export default function HomePage() {
  return (
    <>
      <Navbar /> {/* Should be in layout.tsx */}
      <main>
        <Hero />
      </main>
      <Footer /> {/* Should be in layout.tsx */}
    </>
  )
}
```

---

## Component Splitting Triggers

MUST extract a sub-component when **any** of these are true:

1. File is approaching **~140 lines**
2. JSX block has its **own hooks or local state**
3. List items need hooks (hooks can't be in `.map()`)
4. Visual region serves a **different purpose**
5. JSX structure is **duplicated**
6. Imperative logic is **isolated** to a sub-region
7. Component has **>3 responsibilities**

---

## Folder Structure — Simple Component

```
ui/button/
  Button.tsx
  Button.stories.tsx       # When Storybook opted in
  index.ts
```

---

## Folder Structure — Complex Component

For components with hooks, utils, types, or many private sub-parts:

```
features/user-profile/
  UserProfile.tsx          # Main component
  components/              # Private sub-components
    ProfileHeader.tsx
    ProfileBio.tsx
  hooks/                   # Client hooks ('use client')
    useProfileEdit.ts
  utils/                   # Server utilities
    formatUserData.ts
  types.ts                 # TypeScript types
  UserProfile.test.tsx     # Co-located test
  index.ts                 # Barrel: public API only
```

---

## Folder Structure — Multi-Component Feature (Contained Composition)

When a feature is composed of multiple sub-components that together form a single unit, all parts MUST live in their own folder under the feature domain. The barrel exports only the main component.

```
features/landing/
  hero/
    Hero.tsx
    index.ts
  pricing-card/               # Multi-component composition
    PricingCard.tsx            # Main card (composes sub-components)
    PricingCardHeader.tsx      # Card header with icon + title
    PricingCardFeatures.tsx    # Feature list sub-component
    PricingCardAction.tsx      # CTA sub-component
    index.ts                   # Barrel: exports PricingCard only
  testimonial-card/
    TestimonialCard.tsx
    TestimonialCardQuote.tsx
    TestimonialCardAuthor.tsx
    index.ts
```

**Rules:**

| Rule                                                                                               | Level      |
| -------------------------------------------------------------------------------------------------- | ---------- |
| Each composition in its own kebab-case folder under the feature domain                             | **MUST**   |
| Sub-components are siblings of the main component (no nested `components/` for small compositions) | **SHOULD** |
| Only the main component exported from `index.ts`                                                   | **MUST**   |
| Sub-components are private — consumers MUST NOT import them directly                               | **MUST**   |
| Use `components/` sub-folder only when composition has hooks, utils, types, or >5 sub-components   | **SHOULD** |

```tsx
// ✅ features/landing/pricing-card/index.ts — barrel: main component only
export { PricingCard } from './PricingCard'

// ✅ Consumer imports the whole composition as one unit
import { PricingCard } from '@/components/features/landing/pricing-card'

// ❌ Never import sub-components directly
import { PricingCardHeader } from '@/components/features/landing/pricing-card/PricingCardHeader'
```

---

## Documentation Requirements

| Tier                   | Requirement                                                                | Level      |
| ---------------------- | -------------------------------------------------------------------------- | ---------- |
| `ui/`                  | JSDoc on non-obvious props                                                 | **MUST**   |
| `ui/`                  | Storybook story (when Storybook opted in) covering all variants and states | **MUST**   |
| `features/`, `layout/` | JSDoc on the main exported component explaining its purpose                | **SHOULD** |
| `features/`, `layout/` | Co-located test file (`*.test.tsx`) for complex logic                      | **SHOULD** |

```tsx
type TooltipProps = {
  /** Content shown inside the tooltip */
  content: string
  /** Which side of the trigger to position the tooltip */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Delay before showing (ms) */
  delayMs?: number
  children: React.ReactNode
}
```

---

## Anti-Patterns

| ❌ Anti-Pattern                                                       | ✅ Correct                                                    |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `ui/` imports from `features/`                                        | Import flows downward: `features/` → `ui/` only               |
| Raw `<section className="py-24">` in feature component                | `<Section spacing="lg">` (see `primitives-first.patterns.md`) |
| Sub-components for the same composition scattered across folders      | All parts go in one kebab-case composition folder             |
| `export { PricingCardHeader }` from composition barrel                | Only `PricingCard` is exported; sub-components stay private   |
| `import { ProfileBio } from '.../user-profile/components/ProfileBio'` | Import from barrel: `@/components/features/user-profile`      |
| Hooks inside `.map()`                                                 | Extract list item to its own component                        |
| One file with data-fetching + layout + interactivity                  | Split by responsibility                                       |
| Heavy mobile/desktop branching in one file                            | Separate `MobileView.tsx` / `DesktopView.tsx`                 |
| Skeletons in a separate distant folder                                | Co-locate skeleton with its data component                    |
