# ADR Catalog

> **CTO: update this catalog after every ADR addition or change.**
>
> Agents: read this catalog first. Only open a specific ADR when your task requires its detail.

| ADR  | Title                            | Covers                                                                                                                               |
| ---- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 0001 | Architecture & Framework         | Next.js 15 App Router, TypeScript strict, pnpm, Zod, server-first, ESLint/Prettier                                                   |
| 0002 | Styling                          | Tailwind CSS only, design tokens, no default palette, token contract                                                                 |
| 0003 | Animation (opt-in)               | Framer Motion v12, scroll-driven sections, viewport reveals, transitions                                                             |
| 0004 | Component Structure & Tiers      | Tier system (ui/features/layout), import boundaries, primitives-first rule, multi-component feature folders, props/composition, a11y |
| 0005 | Data Fetching & API              | Server-first fetching, explicit cache control, TanStack Query for client state                                                       |
| 0006 | Environment Configuration        | Layered env config, Zod validation, `@/lib/env` only, never raw `process.env`                                                        |
| 0007 | Error Handling                   | AppError class, const error codes, status mapping, error boundaries, Result\<T\>                                                     |
| 0008 | Middleware                       | Edge Runtime middleware, security headers, auth guards, CORS, rate limiting                                                          |
| 0009 | Testing                          | TDD-first, Vitest + RTL, Playwright E2E, MSW v2 for API mocking                                                                      |
| 0010 | Authentication (opt-in)          | OAuth, RBAC, session management, middleware guards, hidden-admin pattern                                                             |
| 0011 | Database (opt-in)                | PostgreSQL, Prisma ORM, Prisma Accelerate, migrations in git                                                                         |
| 0012 | Forms                            | Tiered: HTML + Server Actions (zero deps) → React Hook Form; Zod validation                                                          |
| 0013 | SEO & Metadata                   | Next.js Metadata API, JSON-LD, sitemaps, robots.txt, Open Graph                                                                      |
| 0014 | Logging & Observability (opt-in) | Structured logging, error tracking, tracing for production                                                                           |
| 0015 | Email & Notifications (opt-in)   | Transactional/marketing email, HTML templates, delivery, in-app notifications                                                        |
| 0016 | File Upload & Storage (opt-in)   | Validation, CDN/image optimization, presigned URLs, large upload handling                                                            |
| 0017 | Caching                          | Next.js caches (fetch, Data, Full Route), React `cache()`, Redis (opt-in)                                                            |
| 0018 | Performance — Platform           | Images, fonts, code splitting, streaming, CLS, Lighthouse CI, Core Web Vitals                                                        |
| 0019 | Accessibility                    | Project-wide a11y strategy, tooling, legal/ethical requirements                                                                      |
| 0020 | State Management                 | React built-ins first (useState, useReducer, useContext), Zustand when needed                                                        |
| 0021 | Performance — React              | useMemo, useCallback, React.memo, useTransition, useDeferredValue (client only)                                                      |
| 0022 | TypeScript & JS Patterns         | Type narrowing, closures, promise handling, runtime patterns                                                                         |
| 0023 | UI Foundation Primitives         | Minimum UI primitives (typography, containers, layout) before feature dev                                                            |
