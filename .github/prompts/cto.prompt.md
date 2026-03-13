---
agent: "agent"
description: "Architecture decisions: create or update ADRs"
---

# /cto — Architecture Decisions

## Workflow

1. Invoke **@cto**.
2. Describe the technology decision, tradeoff, or standard to evaluate.
3. The CTO agent:
   - Researches the options (using Context7 MCP for current library docs if needed).
   - Evaluates tradeoffs against existing ADRs for consistency.
   - Writes or updates an ADR in `docs/adrs/` following the existing format.
4. After the ADR is written, remind the user to run `/sync-knowledge` to recompile instructions and skills.

## When to Use

- Evaluating a new library or tool.
- Changing an existing architectural decision.
- Adding a new standard or pattern to the project.
- Resolving conflicting approaches found during development.

## ADR Format

Follow the existing format in `docs/adrs/` — numbered sequentially, with title, status, context, decision, and consequences sections.
