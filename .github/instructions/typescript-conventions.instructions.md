---
description: 'Use when writing or editing TypeScript/TSX files. Covers function style, import ordering, type imports, console usage, variable declarations, JSX rules, and Tailwind class constraints enforced by ESLint.'
applyTo: '**/*.ts, **/*.tsx'
---

# TypeScript Conventions

## Function Style

Always use **arrow function expressions** — never function declarations.

```ts
// ✅ Correct
const handleClick = () => { ... }
export const MyComponent = ({ title }: Props) => ( ... )

// ❌ Wrong — function declaration
function handleClick() { ... }
export default function MyComponent({ title }: Props) { ... }
```

**Generic components in `.tsx`**: bare `<T>` parses as JSX. Use `extends` constraint:

```tsx
export const Stack = <T extends React.ElementType = 'div'>({
  as,
  ...props
}: StackProps<T>) => { ... }
```

## Import Order

Groups must appear in this order with a **blank line between each group**. Alphabetize within each group.

```tsx
import React, { useState } from 'react'

import Link from 'next/link'

import { clsx } from 'clsx'

import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

import { helperFn } from '../utils'

import { SiblingComponent } from './Sibling'

import { type MyProps } from './types'
```

Order: react → next/\* → external packages → `@/*` internal → parent → sibling → index → type-only.

## Type Imports

Use **inline** `type` keyword — not top-level `import type`.

```ts
// ✅ Correct
import { type FC, useState } from 'react'
import { type VariantProps } from 'class-variance-authority'

// ❌ Wrong
import type { FC } from 'react'
```

## Console

Only `console.warn` and `console.error` are allowed. Never use `console.log`.

## Variables

Always `const`. Use `let` only when reassignment is required. Never `var`.

## Unused Imports & Variables

Never import something unused. Prefix intentionally unused variables with `_` (e.g., `_event`).

## React JSX

- No unnecessary curly braces: `prop="value"` not `prop={"value"}`, `>text<` not `>{"text"}<`.
- Self-close empty elements: `<Component />` not `<Component></Component>`, `<img />` not `<img></img>`.

## Tailwind Classes

- Never combine contradicting utilities (e.g., `flex block`, `hidden visible`).
- Use `cn()` for conditional class merging.
