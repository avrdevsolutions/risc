# Phase 3: Quality Gates & Manifest

> Quality gates run at checkpoints during Phase 2 execution (marked with **→**). This file defines every gate, the failure protocol, and the manifest schema.

## Gate Failure Protocol

When any gate fails:

1. **Stop execution** immediately.
2. **Report** to the user: which gate failed (G1–G8), what was expected vs actual, which files are affected.
3. Use `askQuestions` with exactly these options:
   - **Fix automatically** — apply the fix, re-run the gate to verify, continue
   - **Skip this gate** — log the skip in the manifest as a known gap, continue to next gate
   - **Abort execution** — stop entirely, write a partial manifest noting where execution stopped
4. If fix: apply the fix, re-run the gate. If it passes, continue. If it fails again, report and re-ask.
5. If skip: record in `skipped_gates` array in the manifest. Continue to next gate.
6. If abort: set `status: "aborted"` in the manifest and record the gate that caused the abort. Stop.

## Gate Definitions

| Gate | Name                           | Runs After             | Checks                                                                                                                                                                                                                                                        |
| ---- | ------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G0   | **Manifest sync**              | Phase 2 Step 1         | `design-tokens.json` matches the actual state of `tailwind.config.ts` + `globals.css` + `layout.tsx`. Every primitive's `manifest.json` matches its `.tsx` source. `catalog.json` entries match all primitive folders. If any are out of sync → gate failure. |
| G1   | **Token completeness**         | Phase 2 Step 1         | All colors from brief exist in `tailwind.config.ts`. No `⚠️ PLACEHOLDER TOKENS` comment remains. `background`/`foreground` CSS custom props exist in `globals.css`.                                                                                           |
| G2   | **Font registration**          | Phase 2 Step 1         | `next/font/google` imports in `layout.tsx` match the brief. CSS variables applied to `<html>`. `fontFamily` in `tailwind.config.ts` references the CSS variables.                                                                                             |
| G3   | **Primitive completeness**     | Phase 2 Step 2         | All 7 required primitive folders exist in `src/components/ui/`. Each has `<Name>.tsx` + `index.ts` + `manifest.json`. No primitive references default Tailwind palette colors.                                                                                |
| G4   | **Variant coverage**           | Phase 2 Step 2         | Typography has all variants listed in brief. Button has at minimum: primary, outline, ghost, danger. Badge has semantic variants (success, warning, error). Section has spacing + background maps matching brief.                                             |
| G5   | **Story coverage**             | Phase 2 Step 3         | Every primitive in `src/components/ui/` has a co-located `*.stories.tsx`. Each story file has: one story per variant, an `AllVariants` render story, `tags: ['autodocs']`.                                                                                    |
| G6   | **Barrel export completeness** | Phase 2 Step 4         | `src/components/ui/index.ts` exports all primitives. Each primitive's `index.ts` exports the component + any variant helpers (e.g., `buttonVariants`). No missing re-exports. Cross-check against each primitive's `manifest.json` `exports` field.           |
| G7   | **No forbidden patterns**      | After all source edits | No `motion` / Framer Motion imports anywhere in `src/components/ui/`. No default Tailwind palette classes (`gray-*`, `slate-*`, `zinc-*`, `red-*`, `blue-*`). No dynamic class interpolation (`gap-${}`). No color classes in Typography's `variantStyles`.   |
| G8   | **Build verification**         | Last gate              | `pnpm build` succeeds with zero errors.                                                                                                                                                                                                                       |

## Design Tokens Verification

> **`design-tokens.json` was already updated in Phase 2 Step 1** (atomic edit rule). This section VERIFIES — it does not create.

Verify that `src/components/ui/design-tokens.json` accurately reflects the current state of `tailwind.config.ts`, `globals.css`, and `layout.tsx`:

- `colors.scaled` — every scaled color in `tailwind.config.ts` has a matching entry with correct shade steps
- `colors.flat` — every flat/surface color token has a matching entry with correct value
- `colors.semantic` — every semantic color has a matching entry with correct shade steps
- `colors.dynamic` — matches the CSS custom property colors used with `hsl(var(--...))`
- `fonts` — matches the `next/font/google` imports in `layout.tsx` and `fontFamily` in `tailwind.config.ts`
- `customTokens` — matches any extended theme sections (spacing, borderRadius, boxShadow)
- `lastUpdatedBy` — is set to the current scenario identifier

If any field is out of sync → this is a **G0 gate failure**. Fix the manifest to match the source files.

Example `design-tokens.json` (for reference only — the schema):

```json
{
  "version": 1,
  "lastUpdatedBy": "ui-foundation-A",
  "colors": {
    "scaled": {
      "primary": ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]
    },
    "flat": { "surface-cream": "#faf7f2" },
    "semantic": { "success": ["50", "100", "500", "600", "700"] },
    "dynamic": ["background", "foreground"]
  },
  "fonts": {
    "display": { "family": "DM Serif Display", "variable": "--font-display", "fallback": ["serif"] }
  },
  "customTokens": { "spacing": {}, "borderRadius": { "4xl": "2rem" }, "boxShadow": {} }
}
```

## Primitives Catalog Verification

> **Per-primitive `manifest.json` files and `catalog.json` were already updated in Phase 2 Step 2** (atomic edit rule). This section VERIFIES — it does not create.

Verify that every primitive's `manifest.json` is accurate and `catalog.json` is complete:

1. For each primitive in `src/components/ui/`, confirm its co-located `manifest.json` matches the actual `.tsx` source:
   - `name` — component name
   - `pattern` — `"cva"`, `"record-map"`, or `"simple"`
   - `forwardRef` — boolean
   - `polymorphic` — boolean (has `as` prop with generic type parameter)
   - `variantAxes` — object keyed by axis name, each an array of values (must match the actual variants in source)
   - `props` — non-variant custom props (e.g., `loading`, `fullBleed`, `decorative`)
   - `defaults` — default value for each variant axis and boolean prop
   - `exports` — named exports from the primitive's `index.ts`

2. Confirm `src/components/ui/catalog.json`:
   - Every primitive folder has an entry with `name`, `path`, `pattern`, and `axes` (axis names only, not values)
   - `lastUpdatedBy` is set to the current scenario identifier
   - No entries for primitives that no longer exist
   - No missing entries for primitives that do exist

If any manifest or catalog entry is out of sync → this is a **G0 gate failure**. Fix the manifest to match the source file.

Example per-primitive `manifest.json` (for reference only — the schema):

```json
{
  "name": "Button",
  "pattern": "cva",
  "forwardRef": true,
  "polymorphic": false,
  "variantAxes": {
    "variant": ["primary", "secondary", "outline", "ghost", "danger", "link"],
    "size": ["sm", "md", "lg", "icon", "inline"]
  },
  "props": ["loading"],
  "defaults": { "variant": "primary", "size": "md" },
  "exports": ["Button", "buttonVariants", "ButtonProps"]
}
```

Example `catalog.json` entry:

```json
{
  "name": "Button",
  "path": "src/components/ui/button",
  "pattern": "cva",
  "axes": ["variant", "size"]
}
```

## Foundation Manifest

After verifying the design tokens and catalog are in sync, update the manifest as the **last action** of the agent:

**File**: `.github/flow-generator/FE/specs/foundation-manifest.json`

```json
{
  "version": 1,
  "status": "completed",
  "scenario": "A",
  "strategy": "fresh-mockup",
  "source_mockup": "mockup-r2-v2.html",
  "completed_at": "2026-03-11T14:30:00Z",
  "last_completed_step": "completed",
  "design_tokens": "src/components/ui/design-tokens.json",
  "primitives_catalog": "src/components/ui/catalog.json",
  "barrel_export": "src/components/ui/index.ts",
  "files_modified": ["tailwind.config.ts", "src/app/globals.css", "src/app/layout.tsx"],
  "quality_gates": {
    "G0_manifest_sync": "pass",
    "G1_token_completeness": "pass",
    "G2_font_registration": "pass",
    "G3_primitive_completeness": "pass",
    "G4_variant_coverage": "pass",
    "G5_story_coverage": "pass",
    "G6_barrel_exports": "pass",
    "G7_forbidden_patterns": "pass",
    "G8_build_verification": "pass"
  },
  "skipped_gates": []
}
```

**Manifest rules:**

- `status` is one of `"pending"`, `"in-progress"`, `"completed"`, `"aborted"`. Set to `"in-progress"` in execution Step 0 (see `execution.patterns.md`). Set to `"completed"` here. Set to `"aborted"` if execution is aborted.
- `last_completed_step` tracks incremental progress during execution. Values: `null` (pending), `"started"` (Step 0 done), `"tokens"` (Step 1 done), `"primitives"` (Step 2 done), `"stories"` (Step 3 done), `"barrel"` (Step 4 done), `"completed"` (all gates passed). Updated at each checkpoint in `execution.patterns.md`. This field enables granular session resume — if the agent is interrupted, downstream logic knows exactly where to pick up.
- `scenario` is one of `"A"`, `"B"`, `"C"`, or `null` (when status is `"pending"`).
- `strategy` is one of `"fresh-mockup"`, `"update-from-mockup"`, `"standalone-interview"`, or `null`.
- `design_tokens` points to `src/components/ui/design-tokens.json`. The token inventory lives there — NOT inline in this manifest.
- `primitives_catalog` points to `src/components/ui/catalog.json`. The detailed per-primitive manifests live in each primitive's folder as `manifest.json`. The manifest does NOT duplicate primitive or token data inline.
- `files_modified` lists every file the agent created or edited during this run.
- `quality_gates` records the actual result of each gate (G0–G8): `"pass"`, `"fail"`, `"skipped"`, or `"not_run"`.
- `skipped_gates` lists gate names that the user explicitly chose to skip, with a reason string.
- When aborting, set `status: "aborted"` and leave gates after the abort point as `"not_run"`.

## Completion Report

**CRITICAL: The manifest MUST be written before the completion report.** If context is running low, prioritize the manifest write over the user-facing report. The manifest is the handoff contract — without it, downstream agents and the session resume protocol cannot proceed correctly.

After writing the manifest, report to the user: **"Foundation complete. Manifest updated in `.github/flow-generator/FE/specs/foundation-manifest.json`. Design tokens and primitives catalog verified. [N/9] quality gates passed, [M] skipped."**
