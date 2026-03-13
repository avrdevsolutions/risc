# ADR-0003: Animation (Framer Motion — Opt-In)

**Status**: Accepted
**Date**: 2026-02-27
**Supersedes**: Previous ADR-0003 (2026-02-26)

---

## Context

Animations enhance UX but add bundle size and complexity. In a Next.js App Router context, animated components must be Client Components, which increases JS shipped to the browser. This project has battle-tested Framer Motion patterns from the [definee](../../../definee/) production codebase — a React + Vite SPA that uses Framer Motion v12 extensively for scroll-driven sections, viewport reveals, micro-interactions, and presence transitions.

This ADR captures both the opt-in decision and the proven architecture to adopt when Framer Motion is activated.

## Decision

**Framer Motion is the approved animation library, but it is NOT installed by default.** Projects must explicitly opt in. When opted in, follow the architecture below — which is adapted from production-tested patterns.

### Opt-In Process

1. Confirm animation is needed (issue acceptance criteria must mention it)
2. Install: `pnpm add framer-motion`
3. Update `approved-libraries.md`
4. Create the full `src/lib/motion/` module (see Setup below)
5. Create `src/hooks/useMotionEnabled.ts`
6. Follow the patterns and recipes in this ADR

---

## Rules

| Rule | Level |
|------|-------|
| Import from `@/lib/motion`, never `framer-motion` directly | **MUST** |
| Use `'use client'` on all animated components | **MUST** |
| Check `useReducedMotion()` or `useMotionEnabled()` in ALL animated components — no exceptions | **MUST** |
| Animate only `transform` and `opacity` (GPU-composited properties) | **MUST** |
| Use `LazyMotion` with `domAnimation` and `strict` mode | **MUST** |
| Use `m` namespace (not `motion`) — `strict` mode enforces this at runtime | **MUST** |
| Declare `variants` objects at module scope (not inside component body) | **MUST** |
| Keep MotionValues in the Framer Motion graph — never set `useState` from scroll position | **MUST** |
| Apply MotionValues via `style={}` prop (not `className`) | **MUST** |
| Don't animate `width`, `height`, `margin`, `padding` (triggers layout/paint) | **MUST NOT** |
| Don't add animations not requested in the issue | **MUST NOT** |
| Don't use `motion.*` components — use `m.*` (LazyMotion requires it) | **MUST NOT** |
| Extract per-item components when using hooks in `.map()` — hooks can't be called inside callbacks | **MUST NOT** violate |
| Wrap `LazyMotion` provider at the layout level that needs animation | **SHOULD** |
| Use `next/dynamic` with `ssr: false` for heavy animated sections | **SHOULD** |
| Disable complex scroll animations on mobile (<768px) | **SHOULD** |
| Use `viewport={{ once: true }}` on fire-and-forget reveals | **SHOULD** |
| Use `useSpring` to smooth scroll-linked values | **SHOULD** |
| Use `memo()` on scroll-animated list items | **SHOULD** |
| Set `willChange: 'transform, opacity'` on heavy parallax elements (only when motion enabled) | **SHOULD** |

---

## Setup (When Opted In)

### File Structure

```
src/
  lib/motion/
    index.ts                  # Central re-export (single import point)
    MotionProvider.tsx         # LazyMotion wrapper ('use client')
    types.ts                  # RangeConfig, MotionComponentProps
    helpers.ts                # createMotionRange utility
    useMotionAnimation.ts     # Bulk useTransform hook with reduced-motion fallback
  hooks/
    useMotionEnabled.ts       # Positive-logic wrapper: !useReducedMotion()
  components/motion/          # Reusable animation components
    MotionInView.tsx           # Viewport reveal wrapper
    MotionSection.tsx          # Scroll container (provides context)
    MotionSectionBox.tsx       # Context consumer (driven by parent scroll)
    MotionBox.tsx              # Self-contained scroll-animated box
```

### Central Re-export (`src/lib/motion/index.ts`)

This is the **only file** in the project that imports from `'framer-motion'` directly. Everything else imports from `'@/lib/motion'`.

```tsx
export { createMotionRange } from './helpers'
export { MotionProvider } from './MotionProvider'
export { useMotionAnimation } from './useMotionAnimation'
export type { RangeConfig, MotionComponentProps } from './types'
export {
  AnimatePresence,
  m,
  type MotionProps,
  type MotionValue,
  type Transition,
  type Variants,
  useAnimate,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
```

### LazyMotion Provider (`src/lib/motion/MotionProvider.tsx`)

```tsx
'use client'

import { domAnimation, LazyMotion } from 'framer-motion'

type MotionProviderProps = { children: React.ReactNode }

export const MotionProvider = ({ children }: MotionProviderProps) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
)
```

> **Note**: Place `<MotionProvider>` in the layout that needs animation (e.g., root layout or a route group layout). The `strict` flag throws a runtime warning if any `motion.*` component (instead of `m.*`) sneaks in — this guarantees the lazy bundle is always used.
>
> **`domAnimation` vs `domMax`**: Use `domAnimation` (default) for most cases — it includes animate, exit, layout, viewport, and scroll. Switch to `domMax` only if you need drag/pan gesture features, which adds ~8kB.

### Types (`src/lib/motion/types.ts`)

```tsx
import type { MotionValue } from 'framer-motion'

/**
 * Describes a scroll-progress-to-value mapping.
 * `inputRange` is always `number[]` (0..1 progress values).
 * `outputRange` is `number[]` or `string[]` (the animated CSS values).
 *
 * ⚠️ `unknown[]` is intentional — Framer Motion's `useTransform` accepts
 * both `number[]` and `string[]` (e.g., `['0%', '100%']`), and TypeScript
 * can't express that union cleanly without losing inference. Validate
 * that inputRange and outputRange have equal lengths at the call site.
 */
export type RangeConfig = {
  inputRange: number[]
  outputRange: (number | string)[]
}

export type MotionComponentProps = {
  scrollYProgress: MotionValue<number>
  opacityConfig?: RangeConfig
  xConfig?: RangeConfig
  yConfig?: RangeConfig
  scaleConfig?: RangeConfig
  radiusConfig?: RangeConfig
  heightConfig?: RangeConfig
  topConfig?: RangeConfig
}
```

### Range Helper (`src/lib/motion/helpers.ts`)

```tsx
import type { RangeConfig } from './types'

export const createMotionRange = (
  inputRange: number[],
  outputRange: (number | string)[],
): RangeConfig => ({
  inputRange,
  outputRange,
})
```

### Bulk Transform Hook (`src/lib/motion/useMotionAnimation.ts`)

```tsx
'use client'

import { useTransform } from '@/lib/motion'

import { useMotionEnabled } from '@/hooks/useMotionEnabled'

import type { MotionComponentProps } from './types'

const fallback = {
  opacity: { inputRange: [0, 1], outputRange: [1, 1] },
  scale: { inputRange: [0, 1], outputRange: [1, 1] },
  radius: { inputRange: [0, 1], outputRange: [0, 0] },
  x: { inputRange: [0, 1], outputRange: [0, 0] },
  y: { inputRange: [0, 1], outputRange: [0, 0] },
  height: { inputRange: [0, 1], outputRange: ['100%', '100%'] },
  top: { inputRange: [0, 1], outputRange: ['unset', 'unset'] },
}

type UseMotionAnimationParams = Pick<
  MotionComponentProps,
  'scrollYProgress' | 'opacityConfig' | 'scaleConfig' | 'radiusConfig' | 'xConfig' | 'yConfig' | 'heightConfig' | 'topConfig'
>

export const useMotionAnimation = (params: UseMotionAnimationParams) => {
  const motionEnabled = useMotionEnabled()
  const { scrollYProgress, opacityConfig, scaleConfig, radiusConfig, xConfig, yConfig, heightConfig, topConfig } = params

  // Resolve config: use provided config when motion enabled, else use identity fallback
  const pick = <T extends { inputRange: number[]; outputRange: (number | string)[] }>(cfg: T | undefined, fb: T): T =>
    motionEnabled ? (cfg ?? fb) : fb

  // Store resolved configs in intermediate variables (avoid double pick() calls)
  const oc = pick(opacityConfig, fallback.opacity)
  const sc = pick(scaleConfig, fallback.scale)
  const rc = pick(radiusConfig, fallback.radius)
  const xc = pick(xConfig, fallback.x)
  const yc = pick(yConfig, fallback.y)
  const hc = pick(heightConfig, fallback.height)
  const tc = pick(topConfig, fallback.top)

  const opacity = useTransform(scrollYProgress, oc.inputRange, oc.outputRange)
  const scale = useTransform(scrollYProgress, sc.inputRange, sc.outputRange)
  const borderRadius = useTransform(scrollYProgress, rc.inputRange, rc.outputRange)
  const x = useTransform(scrollYProgress, xc.inputRange, xc.outputRange)
  const y = useTransform(scrollYProgress, yc.inputRange, yc.outputRange)
  const height = useTransform(scrollYProgress, hc.inputRange, hc.outputRange)
  const top = useTransform(scrollYProgress, tc.inputRange, tc.outputRange)

  return { opacity, scale, borderRadius, x, y, height, top }
}
```

### Motion Enabled Hook (`src/hooks/useMotionEnabled.ts`)

```tsx
'use client'

import { useReducedMotion } from '@/lib/motion'

export const useMotionEnabled = () => !useReducedMotion()
```

---

## Three-Tier Scroll Architecture

Proven pattern for scroll-driven animations:

```
Tier 1: Container (useScroll → scrollYProgress: MotionValue<number> [0..1])
  ↓
Tier 2: Transform (useMotionAnimation / useTransform → opacity, scale, y, x: MotionValue)
  ↓
Tier 3: Render (m.div style={{ opacity, y, scale }} — no React re-renders)
```

### Key Principles

1. **One `useScroll` per section** — children receive `scrollYProgress` via context or props, not their own observer.
2. **Values stay in the MotionValue graph** — `useScroll` → `useTransform` → `style={}`. No `useState` in between.
3. **`useSpring` for smoothing** — wrap scroll-linked values with `{ stiffness: 120, damping: 20, mass: 0.35 }` to prevent choppy motion.

### Pattern: Context-Based Scroll (MotionSection → MotionSectionBox)

```tsx
// Parent owns the scroll observer and provides progress via context
<MotionSection height="300vh" containerHeight="100vh" offset={['start start', 'end end']}>
  <MotionSectionBox
    opacityConfig={createMotionRange([0, 0.75, 0.95], [1, 1, 0])}
    yConfig={createMotionRange([0, 1], [0, -50])}
  >
    <YourContent />
  </MotionSectionBox>
</MotionSection>
```

### Pattern: Prop-Drilled Scroll Progress

```tsx
// One useScroll, multiple children receive progress as prop
const SplitSection = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section ref={ref}>
      <TextPanel scrollYProgress={scrollYProgress} />
      <ImagePanel scrollYProgress={scrollYProgress} />
    </section>
  )
}
```

---

## Variant Naming Convention

Consistent vocabulary across all animated components:

| State | Key | When |
|-------|-----|------|
| Before animation | `hidden` or `initial` | Element is not visible |
| After animation | `visible` or `show` | Element is visible |
| Exit animation | `exit` | Element is being removed |
| Animate target | `animate` | Target state (inline) |

```tsx
// ✅ Module-level (not inside component body)
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.05, ease: 'easeOut' } },
}

// ❌ Never define variants inside the component body
const MyComponent = () => {
  const variants = { hidden: { ... } } // Creates new object every render
}
```

---

## Standard Transition Defaults

| Use Case | Duration | Type | Config |
|----------|----------|------|--------|
| Viewport reveal | 0.6s | tween | `ease: 'easeOut'` |
| Nav item stagger | 0.05–0.1s | tween | `ease: 'easeOut'` |
| Button micro-interaction | 0.1s | tween | `ease: 'easeOut'` |
| Modal/drawer | 0.3s | tween | `ease: 'easeOut'` |
| Smooth scroll spring | — | spring | `{ stiffness: 120, damping: 20, mass: 0.35 }` |
| Snappy spring | — | spring | `{ stiffness: 500, damping: 28, mass: 0.4 }` |
| Card flip spring | — | spring | `{ stiffness: 140, damping: 18 }` |
| Looping ambient | 2s | tween | `ease: 'easeInOut', repeat: Infinity` |

---

## When to Use Which Pattern

| Technique | When | Example |
|-----------|------|---------|
| `whileInView` + `MotionInView` | Fire-and-forget reveal | Content appearing on scroll |
| `useScroll` + `useTransform` | Continuous scroll-linked | Parallax, sticky sections |
| `variants` + `staggerChildren` | Coordinated list reveals | Nav menus, card grids |
| `AnimatePresence` | Enter/exit transitions | Modals, drawers, toasts |
| `whileHover` / `whileTap` | Micro-interactions | Buttons, cards |
| `useAnimate` (imperative) | Multi-step sequences | Nav expand → content → navigate |
| Inline `animate={}` | Simple state-driven | Toggle visibility |

---

## Performance Rules (from Production)

These rules are proven in the definee production codebase:

1. **`LazyMotion` + `domAnimation`** — loads only needed features (~20kB vs ~60kB full bundle)
2. **`m` + `strict` mode** — runtime guard ensures lazy bundle is always used
3. **`style={}` for MotionValues** — updates happen on animation frame, not React render cycle
4. **No `useState` from scroll** — values flow `useScroll` → `useTransform` → `style`, zero re-renders
5. **`useSpring` for smoothing** — prevents choppy scroll-linked motion
6. **`memo()` on scroll-animated list items** — prevents parent re-renders cascading
7. **Hooks at component top level in lists** — extract per-item components for `useTransform` calls
8. **Frame throttling for video scrubbing** — `lastFrameRef` guard prevents redundant seeks

---

## Rationale

Framer Motion was chosen as the **approved** (not default) animation library because it provides the best combination of declarative API, React integration, and accessibility support. However, it is opt-in because:

1. **Bundle cost** — Framer Motion adds ~20kB with `LazyMotion`/`domAnimation` (not ~60kB as with full import). For a starter template, this should only be paid when animation is explicitly needed.
2. **Client Component requirement** — Every animated component must be a Client Component, which undermines the server-first architecture.
3. **Accessibility obligation** — Any animation library creates a `prefers-reduced-motion` compliance requirement. Making it opt-in ensures teams consciously accept this obligation.

### Key Factors
1. **Declarative API** — `initial`/`animate`/`exit` model is simpler than imperative GSAP or raw WAAPI.
2. **React-native integration** — `AnimatePresence`, layout animations, and gesture handlers work with React's component model.
3. **Reduced motion hooks** — `useReducedMotion()` is built in, making accessibility compliance straightforward.
4. **Production-proven** — the definee project used these exact patterns in a shipping product, validating the architecture.

## Options Considered

| Option | Description | Why Chosen / Why Not |
|--------|------------|---------------------|
| Framer Motion (opt-in) | Declarative React animation | ✅ Chosen: best DX, accessibility hooks, React-native, production-proven |
| CSS transitions/animations | Native browser animations | ❌ Limited to simple states, no scroll orchestration |
| GSAP | Imperative animation engine | ❌ Not React-idiomatic, larger bundle, commercial license for some features |
| React Spring | Physics-based animations | ❌ Smaller community, less documentation |
| Web Animations API (WAAPI) | Browser-native imperative API | ❌ No declarative React integration, no reduced-motion hook |

---

## Consequences

**Positive:**
- Opt-in model keeps base bundle lean (zero animation JS by default).
- When adopted, `LazyMotion` + `domAnimation` keeps bundle to ~20kB (not 60kB).
- `strict` mode catches accidental `motion.*` imports at runtime.
- `useMotionAnimation` hook provides bulk scroll transforms with automatic reduced-motion fallback.
- Three-tier scroll architecture is reusable across any scroll-driven section.
- `createMotionRange` eliminates magic number arrays.

**Negative:**
- Framer Motion adds ~20kB per animated route (with `LazyMotion`) — mitigated by `next/dynamic`.
- Every animated component becomes a Client Component — mitigated by isolating animation to leaf components.
- Teams must check `useReducedMotion()`/`useMotionEnabled()` in every animated component — mitigated by making it a MUST rule with code review.
- `variants` at module scope requires discipline — mitigated by ESLint (no-inner-declarations potential).

## Related ADRs

- [ADR-0001](./0001-architecture.md) — Architecture (opt-in libraries philosophy)
- [ADR-0002](./0002-styling.md) — Styling (Tailwind handles simple transitions via `transition-*`)
- [ADR-0004](./0004-components.md) — Components (animated = Client Component)




