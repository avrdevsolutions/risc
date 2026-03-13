# ADR-0019: Accessibility (a11y)

**Status**: Accepted
**Date**: 2026-02-27
**Supersedes**: N/A

---

## Context

Accessibility is not optional — it's a legal requirement in many jurisdictions (EU European Accessibility Act 2025, US ADA/Section 508, Canada AODA) and an ethical obligation. Approximately 15% of the global population lives with some form of disability. Beyond compliance, accessible websites serve more users, have better SEO (semantic HTML helps crawlers), and generally have better UX for everyone (keyboard navigation, clear focus states, readable text).

ADR-0004 (Components) covers component-level accessibility requirements (ARIA attributes, keyboard navigation, focus management). This ADR defines the **project-wide accessibility strategy** — standards, testing approach, audit process, and the tools that enforce it.

## Decision

**WCAG 2.1 Level AA compliance as the minimum standard. Semantic HTML as the foundation. Automated testing with axe-core. Manual keyboard testing for all interactive features. Accessibility audits before every major launch.**

---

## WCAG 2.1 Level AA — What It Means

WCAG (Web Content Accessibility Guidelines) defines three conformance levels:

| Level | What It Requires | Our Target |
|-------|-----------------|------------|
| **A** | Bare minimum — alt text, keyboard access, no seizure triggers | ✅ Included |
| **AA** | Good accessibility — color contrast, resize text, focus visible, error identification | ✅ **Our standard** |
| **AAA** | Enhanced — sign language, extended audio description, stricter contrast | Not required (nice-to-have) |

### The Four Principles (POUR)

Every page must be:

1. **Perceivable** — Users can perceive the content (see it, hear it, feel it)
   - Images have alt text
   - Videos have captions
   - Color is not the only way to convey information
   - Text has sufficient contrast

2. **Operable** — Users can interact with the interface
   - Everything is keyboard accessible
   - Users have enough time
   - Content doesn't cause seizures
   - Navigation is clear

3. **Understandable** — Users can understand the content and interface
   - Text is readable
   - Pages behave predictably
   - Errors are identified and described

4. **Robust** — Content works across technologies
   - Valid HTML
   - ARIA used correctly
   - Works with assistive technologies

---

## Rules

### Semantic HTML (Foundation)

| Rule | Level |
|------|-------|
| Use `<main>` for primary content (one per page) | **MUST** |
| Use `<nav>` for navigation regions (with `aria-label` if multiple) | **MUST** |
| Use `<header>` and `<footer>` for page/section headers and footers | **MUST** |
| Use `<article>` for independent content (blog posts, cards) | **SHOULD** |
| Use `<section>` with a heading for thematic grouping | **SHOULD** |
| Use `<button>` for actions, `<a>` for navigation — never `<div>` for interactive elements | **MUST** |
| Headings follow hierarchy (h1 → h2 → h3, no skips) | **MUST** |
| One `<h1>` per page matching the page topic | **MUST** |
| Use `<ul>`/`<ol>` for lists, `<table>` for tabular data | **SHOULD** |
| Don't use `<div>` or `<span>` when a semantic element exists | **SHOULD** |

### Keyboard Navigation

| Rule | Level |
|------|-------|
| All interactive elements reachable via Tab key | **MUST** |
| Navigation MUST be accessible on all screen sizes — hiding nav links on mobile (`hidden lg:flex`) without an alternative (hamburger menu, drawer) is forbidden | **MUST** |
| Focus order follows visual order (no `tabIndex` > 0 hacks) | **MUST** |
| Focus is visible — `focus-visible:ring-2 focus-visible:ring-primary-500` on all interactive elements | **MUST** |
| Modals/dialogs trap focus (Tab cycles within, Escape closes) | **MUST** |
| Dropdown menus navigable with Arrow keys | **MUST** |
| Custom interactive components respond to Enter and Space | **MUST** |
| Skip to main content link as first focusable element | **SHOULD** |
| Don't remove focus outline (`outline: none`) without a visible alternative | **MUST NOT** |

### Color & Contrast

| Rule | Level |
|------|-------|
| Normal text: contrast ratio ≥ 4.5:1 against background | **MUST** (AA) |
| Large text (≥18px bold or ≥24px regular): contrast ratio ≥ 3:1 | **MUST** (AA) |
| UI components and graphical objects: contrast ratio ≥ 3:1 | **MUST** (AA) |
| Don't use color alone to convey information (add icons, text, patterns) | **MUST** |
| Error states use red border + text label + icon (not just red color) | **MUST** |
| Links are distinguishable from surrounding text (underline or other visual cue + color) | **SHOULD** |

### Images & Media

| Rule | Level |
|------|-------|
| All `<img>` / `<Image>` have descriptive `alt` text | **MUST** |
| Decorative images have `alt=""` (empty alt, not missing alt) | **MUST** |
| Icons inside buttons: `aria-hidden="true"` on icon, `aria-label` on button | **MUST** |
| Complex images (charts, infographics): provide text alternative nearby | **SHOULD** |
| Videos have captions or transcripts | **SHOULD** |
| Audio-only content has a transcript | **SHOULD** |

### Forms (Cross-Reference ADR-0012)

| Rule | Level |
|------|-------|
| Every input has a visible `<label>` connected via `htmlFor` | **MUST** |
| Error messages connected via `aria-describedby` | **MUST** |
| Invalid fields have `aria-invalid="true"` | **MUST** |
| Required fields have `aria-required="true"` or HTML `required` | **MUST** |
| Form-level error summaries use `role="alert"` | **MUST** |
| Group related fields with `<fieldset>` and `<legend>` | **SHOULD** |

### ARIA (Use Sparingly)

| Rule | Level |
|------|-------|
| First rule of ARIA: don't use ARIA if a native HTML element works | **MUST** |
| If ARIA is needed, use established patterns from WAI-ARIA Authoring Practices | **MUST** |
| Don't use `role="button"` on a `<div>` — use `<button>` | **MUST NOT** |
| Custom widgets must have correct `role`, `aria-expanded`, `aria-selected`, etc. | **MUST** |
| Live regions (`aria-live`) for dynamic content updates (toasts, loading states) | **SHOULD** |
| `aria-label` for elements with no visible text (icon buttons, close buttons) | **MUST** |
| `aria-hidden="true"` for decorative elements that shouldn't be announced | **SHOULD** |

### Motion & Animation (Cross-Reference ADR-0003)

| Rule | Level |
|------|-------|
| Respect `prefers-reduced-motion` — check `useReducedMotion()` in every animated component | **MUST** |
| Provide static alternative when motion is disabled | **MUST** |
| No flashing content (more than 3 flashes per second) | **MUST** |
| Animations should not be the only way to convey information | **MUST** |

---

## Implementation

### Skip to Main Content Link

```tsx
// src/components/layout/skip-nav/SkipNav.tsx
export const SkipNav = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
  >
    Skip to main content
  </a>
)

// src/app/layout.tsx
import { SkipNav } from '@/components/layout/skip-nav'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SkipNav />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### Responsive Navigation

Navigation links that are `hidden` on mobile with no alternative make the site completely unusable for mobile visitors — who are often **the majority of traffic**. This is a critical accessibility failure.

```tsx
// ❌ Forbidden — mobile users have no navigation
const Navbar = () => (
  <header>
    <nav>
      <Logo />
      <div className="hidden lg:flex lg:gap-8">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href}>{label}</a>
        ))}
      </div>
      <Button>CTA</Button>
    </nav>
  </header>
)

// ✅ Correct — mobile toggle + desktop nav
'use client'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header>
      <nav aria-label="Main navigation">
        <Logo />

        {/* Desktop nav — hidden on mobile */}
        <div className="hidden lg:flex lg:gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </div>

        {/* Mobile toggle — hidden on desktop */}
        <button
          className="lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label="Menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
        </button>

        <Button>CTA</Button>
      </nav>

      {/* Mobile nav panel */}
      {isOpen && (
        <nav id="mobile-nav" className="lg:hidden" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setIsOpen(false)}>{label}</a>
          ))}
        </nav>
      )}
    </header>
  )
}
```

**Key requirements for mobile navigation:**
- Toggle button has `aria-expanded`, `aria-controls`, and `aria-label`
- Mobile nav links close the menu on click (`onClick={() => setIsOpen(false)}`)
- Desktop nav and mobile nav share the same link data (single source of truth)
- Focus management: when menu opens, first link should receive focus (SHOULD)

### Focus Trap for Modals

If using shadcn/ui Dialog (built on Radix), focus trapping is automatic. For custom modals:

```tsx
// Focus trap pattern — Tab cycles within the modal
'use client'

import { useEffect, useRef } from 'react'

export const useFocusTrap = (isOpen: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element when modal opens
    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
      if (e.key === 'Escape') {
        // Close modal — parent should handle this
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return containerRef
}
```

### Accessible Error States

```tsx
// ✅ Error state that works for everyone
<div>
  <label htmlFor="email" className="text-sm font-medium">
    Email
    <span className="ml-0.5 text-error-500" aria-hidden="true">*</span>
  </label>
  <input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
    aria-required="true"
    className={cn(
      'border rounded-md px-3 py-2',
      error ? 'border-error-500' : 'border-primary-200',
    )}
  />
  {error && (
    <p id="email-error" className="text-sm text-error-600 flex items-center gap-1" role="alert">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      {error}
    </p>
  )}
</div>
```

Note: Error uses **red color + text message + icon** — three signals, not just color.

### Accessible Loading States

```tsx
// ✅ Loading state announced to screen readers
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? (
    <>
      <Spinner className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>Saving...</span>
    </>
  ) : (
    'Save'
  )}
</button>

// ✅ Loading content area with live region
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? <Skeleton /> : <Content />}
</div>
```

---

## Testing Strategy

### Layer 1: Automated (Every Build)

**axe-core** catches ~30-40% of accessibility issues automatically:

```typescript
// In component tests (Vitest + RTL) — add axe checking
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

```bash
# Install
pnpm add -D jest-axe @types/jest-axe
```

**ESLint plugin** catches HTML/JSX issues at development time:

```bash
pnpm add -D eslint-plugin-jsx-a11y
```

```javascript
// .eslintrc — add a11y plugin
{
  extends: ['plugin:jsx-a11y/recommended'],
}
```

### Layer 2: Manual Keyboard Testing (Every Feature)

Before merging any interactive feature, manually test:

| Test | How | Pass Criteria |
|------|-----|--------------|
| Tab through entire page | Press Tab repeatedly | Focus visits all interactive elements in visual order |
| Reverse tab | Shift+Tab | Focus moves backward logically |
| Activate buttons | Enter and Space | Button action triggers |
| Navigate dropdowns | Arrow keys | Options are reachable |
| Open/close modals | Enter to open, Escape to close | Focus traps inside modal, returns to trigger on close |
| Form submission | Tab to submit, Enter to submit | Form submits without mouse |
| Focus visibility | Tab through page | Every focused element has visible focus ring |

### Layer 3: Screen Reader Testing (Before Launch)

Test with at least one screen reader before production launch:

| Screen Reader | OS | Browser | Free? |
|--------------|-----|---------|-------|
| VoiceOver | macOS/iOS | Safari | ✅ Built-in |
| NVDA | Windows | Firefox/Chrome | ✅ Free download |
| TalkBack | Android | Chrome | ✅ Built-in |

**Basic screen reader test checklist:**
- [ ] Page title is announced on navigation
- [ ] Headings are navigable (screen reader heading navigation)
- [ ] Images have meaningful alt text (or are hidden from announcement)
- [ ] Form fields announce their label, required state, and errors
- [ ] Buttons announce their purpose
- [ ] Live regions announce dynamic content changes (toasts, loading)
- [ ] Modal focus management works correctly

### Layer 4: Lighthouse Audit (Before Launch)

```bash
# Chrome DevTools → Lighthouse → Accessibility
# Target: ≥ 90
```

---

## Common Patterns

### Icon-Only Buttons

```tsx
// ❌ No accessible name — screen reader says "button"
<button onClick={onClose}>
  <XIcon className="h-5 w-5" />
</button>

// ✅ Screen reader says "Close dialog"
<button onClick={onClose} aria-label="Close dialog">
  <XIcon className="h-5 w-5" aria-hidden="true" />
</button>
```

### Toggle Buttons

```tsx
// ✅ Announces "Menu, expanded" or "Menu, collapsed"
<button
  aria-expanded={isOpen}
  aria-controls="nav-menu"
  aria-label="Menu"
  onClick={() => setIsOpen(!isOpen)}
>
  <MenuIcon className="h-5 w-5" aria-hidden="true" />
</button>

<nav id="nav-menu" hidden={!isOpen}>
  {/* Navigation links */}
</nav>
```

### Status Messages

```tsx
// ✅ Toast/status announced to screen readers without stealing focus
<div role="status" aria-live="polite">
  {successMessage && <p>{successMessage}</p>}
</div>

// ✅ Urgent error announced immediately
<div role="alert" aria-live="assertive">
  {errorMessage && <p>{errorMessage}</p>}
</div>
```

### Data Tables

```tsx
// ✅ Accessible table with caption and headers
<table>
  <caption className="sr-only">Monthly sales data for 2026</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">January</th>
      <td>$12,000</td>
      <td>+5%</td>
    </tr>
  </tbody>
</table>
```

### Visually Hidden Text (For Screen Readers Only)

```tsx
// Tailwind's sr-only class — visible to screen readers, invisible visually
<span className="sr-only">Total items in cart:</span>
<span className="text-lg font-bold">{cartCount}</span>

// The screen reader hears: "Total items in cart: 3"
// The visual user sees: "3"
```

---

## Accessibility Checklist (Per Project)

### Every Page

- [ ] `<html lang="...">` set correctly
- [ ] One `<h1>` per page
- [ ] Heading hierarchy (h1 → h2 → h3, no skips)
- [ ] `<main>` wraps primary content
- [ ] Skip to main content link exists
- [ ] All images have `alt` text (or `alt=""` for decorative)
- [ ] Color contrast meets AA (4.5:1 text, 3:1 UI components)
- [ ] Focus visible on all interactive elements

### Every Interactive Feature

- [ ] Keyboard accessible (Tab, Enter, Space, Escape, Arrow keys where applicable)
- [ ] Focus management correct (modals trap focus, return focus on close)
- [ ] ARIA attributes correct (`aria-expanded`, `aria-label`, `aria-describedby`)
- [ ] Error states use text + icon + color (not color alone)
- [ ] Loading states announced to screen readers (`aria-busy`)

### Before Launch

- [ ] Lighthouse Accessibility ≥ 90
- [ ] axe-core automated tests pass (no violations)
- [ ] Manual keyboard navigation test completed
- [ ] Screen reader test completed (VoiceOver or NVDA)
- [ ] eslint-plugin-jsx-a11y enabled with no warnings

---

## Anti-Patterns

```tsx
// ❌ div as button — no keyboard access, no role, no focus
<div onClick={handleClick} className="cursor-pointer">Click me</div>

// ✅ Use a button
<button onClick={handleClick}>Click me</button>

// ❌ Removing focus outline (makes keyboard navigation invisible)
<button className="outline-none focus:outline-none">Submit</button>

// ✅ Replace with visible focus indicator
<button className="focus-visible:ring-2 focus-visible:ring-primary-500">Submit</button>

// ❌ Missing alt text (screen reader says "image" or reads filename)
<Image src="/hero.jpg" alt="" />  // Empty alt = decorative (only correct if truly decorative)

// ✅ Descriptive alt text
<Image src="/hero.jpg" alt="Art gallery exhibition room with contemporary paintings" />

// ❌ Color-only error indication
<input className={error ? 'border-red-500' : 'border-gray-300'} />

// ✅ Color + text + icon
<input className={error ? 'border-error-500' : 'border-primary-200'} aria-invalid={!!error} />
{error && <p role="alert" className="text-error-600"><AlertIcon /> {error}</p>}

// ❌ aria-label that duplicates visible text (redundant)
<button aria-label="Submit form">Submit form</button>

// ✅ aria-label only when there's no visible text
<button>Submit form</button>  // Visible text IS the accessible name
<button aria-label="Close"><XIcon aria-hidden="true" /></button>  // No visible text — needs aria-label

// ❌ Using tabIndex > 0 (breaks natural tab order)
<div tabIndex={5}>...</div>

// ✅ Use tabIndex="0" (adds to natural order) or tabIndex="-1" (programmatic focus only)
<div tabIndex={0}>...</div>
```

---

## Rationale

### Why WCAG 2.1 AA (Not AAA)

AAA is extremely strict (7:1 contrast ratio, sign language for all video) and impractical for most projects. AA is the widely accepted standard, required by most accessibility laws, and achievable without sacrificing design quality. Our component library defaults (ADR-0004) are built to AA compliance — all focus rings, contrast ratios, and ARIA patterns meet AA.

### Why Automated + Manual Testing

Automated tools (axe-core, ESLint) catch ~30-40% of issues — missing alt text, low contrast, missing labels. They cannot catch: illogical tab order, poor screen reader experience, inadequate keyboard navigation, confusing focus management. Manual testing fills the gap. Both layers are required.

### Why Semantic HTML First

ARIA should be the last resort, not the first tool. A `<button>` is inherently accessible — it has keyboard support, focus management, and screen reader semantics built in. A `<div role="button" tabIndex={0} onKeyDown={...}>` requires reimplementing all of that. Use native HTML elements first; add ARIA only when no native element exists for the pattern.

### Key Factors
1. **Legal compliance** — EU EAA 2025, ADA, Section 508 require WCAG 2.1 AA.
2. **Market reach** — 15% of the global population has a disability; accessible sites serve more users.
3. **SEO benefit** — semantic HTML and good structure improve search engine understanding (ADR-0013).
4. **DX alignment** — our component library (ADR-0004) and form primitives (ADR-0012) are already built for accessibility.
5. **Testability** — axe-core, eslint-plugin-jsx-a11y, and Lighthouse provide measurable, automatable checks.

## Options Considered

| Option | Description | Why Chosen / Why Not |
|--------|------------|---------------------|
| WCAG 2.1 Level AA | Industry standard accessibility | ✅ Chosen: legally required, achievable, well-documented |
| WCAG 2.1 Level AAA | Enhanced accessibility | ❌ Impractical for most projects (7:1 contrast, sign language) |
| No formal standard | Ad-hoc accessibility | ❌ Legal risk, inconsistent, unreliable |
| axe-core | Automated a11y testing | ✅ Chosen: best automated detection, integrates with Vitest |
| eslint-plugin-jsx-a11y | Static analysis for JSX | ✅ Chosen: catches issues at development time |
| Lighthouse | Browser-based audit | ✅ Chosen: comprehensive, standardized score |

---

## Consequences

**Positive:**
- Legal compliance (EU EAA 2025, ADA) — reduces liability risk.
- Reaches 15%+ more users — people with disabilities can use the application.
- Better SEO — semantic HTML and proper heading structure improve crawlability.
- Better UX for everyone — keyboard navigation, clear focus states, readable text.
- Automated testing catches regressions early — axe-core in CI prevents shipping violations.
- Component library is accessible by default — features built on top inherit accessibility.

**Negative:**
- Accessibility testing takes time — mitigated by automated tools catching most issues.
- Some design choices are constrained (minimum contrast, visible focus rings) — mitigated by these being good design practices anyway.
- Screen reader testing requires learning new tools — mitigated by providing a simple checklist.
- ARIA is complex and easy to misuse — mitigated by "use native HTML first" rule and ESLint plugin.

## Related ADRs

- [ADR-0002](./0002-styling.md) — Styling (focus ring tokens, color contrast requirements)
- [ADR-0003](./0003-animation.md) — Animation (prefers-reduced-motion, useReducedMotion)
- [ADR-0004](./0004-components.md) — Components (UI tier accessibility requirements, ARIA on primitives)
- [ADR-0009](./0009-testing.md) — Testing (axe-core integration in component tests)
- [ADR-0012](./0012-forms.md) — Forms (label-input association, error messages, aria-invalid)
- [ADR-0018](./0018-performance-platform.md) — Performance — Platform, Infrastructure & Core Web Vitals (Lighthouse Accessibility ≥ 90 target)

