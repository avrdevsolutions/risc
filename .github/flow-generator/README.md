# Flow Generator

Agent pipeline working directory. Each branch (FE, BE, FullStack) has its own folder.

## Structure

```
flow-generator/
└── FE/                          # Frontend branch
    ├── specs/                   # Agent output files (flat naming)
    │   ├── design-brief.md          # Orchestrator design brief
    │   ├── design-planner-plan.md   # Design Planner creative plan
    │   ├── foundation-brief.md      # UI Foundation analysis brief
    │   └── foundation-manifest.json # UI Foundation run receipt (status + gates)
    └── inspiration/             # Drop design inspiration images here
```

## How It Works

1. User invokes `@feo-orchestrator`.
2. Orchestrator auto-scans `FE/inspiration/` for reference images.
3. After the interview, orchestrator writes `FE/specs/design-brief.md`.
4. User reviews and approves the brief (Gate Protocol).
5. Orchestrator invokes `@feo-design-planner`, which reads the brief and writes `FE/specs/design-planner-plan.md`.
6. User reviews and approves the plan (Gate Protocol).
7. Orchestrator invokes `@feo-mock-designer`, which reads the plan and generates HTML+CSS mockups in `public/_mockups/`. User iterates until satisfied.
8. Orchestrator runs the Variant Selection Gate — user picks one mockup. Choice recorded in `public/_mockups/mockup-descriptions.json`.
9. Orchestrator invokes `@feo-ui-foundation`, which customizes tokens/primitives, runs quality gates, updates design-tokens.json and the primitives catalog, and sets `foundation-manifest.json` status to `"completed"`.

> **Note**: Mockup output (`public/_mockups/`) lives outside `flow-generator/`. The `mockup-descriptions.json` file in that directory serves as session state and records the final chosen variant.

## File Naming

Flat naming per agent: `<agent-name>-<output-type>.md` (or `.json` for structured data). No nested subfolders per agent.

## Foundation Manifest — Downstream Consumer Protocol

After `@feo-ui-foundation` completes, it updates `foundation-manifest.json` to `status: "completed"`. The design system metadata is split across three files:

| File                                                       | Content                                             | Lifecycle                                             |
| ---------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------- |
| `src/components/ui/design-tokens.json`                     | Colors, fonts, spacing — structured token inventory | Living — updated by any agent that changes tokens     |
| `src/components/ui/catalog.json`                           | Primitive index (names, paths, axes)                | Living — updated by any agent that changes primitives |
| `.github/flow-generator/FE/specs/foundation-manifest.json` | Run metadata (scenario, gates, files modified)      | Snapshot — written by foundation agent only           |

### How Downstream Agents Should Use the Design System Metadata

1. **Read `src/components/ui/design-tokens.json`** — get the full token inventory (available colors, fonts, spacing tokens). Only use tokens listed here. Do not invent token names.
2. **Read `src/components/ui/catalog.json`** — get the full inventory of available primitives, their patterns, and variant axis names. For detailed API surface of specific primitives (variant values, props, defaults), read their co-located `manifest.json` (e.g., `src/components/ui/button/manifest.json`).
3. **Do NOT re-read primitive source files** unless you need implementation detail beyond what the catalog and manifests provide (e.g., exact class strings for a complex composition).
4. **Import from barrel** — use `import { Typography, Button, ... } from '@/components/ui'`. The foundation manifest's `barrel_export` field confirms the path.
5. **Check `foundation-manifest.json`** for run metadata:
   - `status` — if `"pending"`, no foundation has run yet (template defaults only). If `"aborted"`, the foundation is incomplete.
   - `quality_gates` — if any gate has status `"skipped"` or `"fail"`, be aware of that gap.
6. **Sync rule**: if you add tokens to `tailwind.config.ts`, update `design-tokens.json`. If you add/modify a primitive, update its `manifest.json` and `catalog.json`.

### Schema References

See `skills/feo-ui-foundation-workflow/quality-gates.patterns.md` for:

- §Design Tokens Update — `design-tokens.json` schema
- §Primitives Catalog Update — `catalog.json` + per-primitive `manifest.json` schema
- §Foundation Manifest — `foundation-manifest.json` schema
