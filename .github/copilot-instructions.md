# Copilot Instructions

Facts agents cannot discover from the codebase:

## Next.js 15 Breaking Changes

- `cookies()`, `headers()`, `params`, `searchParams` are **async** — must `await` them
- `fetch()` is **not cached by default** — pass `{ cache: 'force-cache' }` or `{ next: { revalidate: N } }` explicitly
- Using Next.js 14 patterns silently breaks in v15

## Package Manager

- **pnpm only** — never use npm or yarn. No other lockfiles should exist.

## Tailwind Tokens

- **Never use Tailwind default palette** (`gray`, `slate`, `zinc`, `red`, `blue`, etc.)
- Only use colors defined in `tailwind.config.ts` — project tokens only
- This applies to ALL files including error boundaries and loading states

## Opt-In Philosophy

- Do not pre-install auth, database, animation, or any optional dependency
- Add only when explicitly requested by the user

## ADR Reading Protocol

- **Never bulk-read ADR files.** Always read `docs/adrs/catalog.md` first.
- Only open an individual ADR when (a) the task requires ADR-level detail **and** (b) the catalog identifies that ADR as relevant.
- When referencing ADR decisions in code or plans, cite the ADR number (e.g., "per ADR-0007").
- This applies to **all** agents and modes (planning, coding, reviewing).
