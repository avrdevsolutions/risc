---
name: frontend-design
description: 'Aesthetic guidelines and design system conventions for generating distinctive HTML+CSS mockups. Used by mock-designer to produce visually striking, structurally disciplined design references that avoid generic AI aesthetics.'
---

# Frontend Design Skill

This skill guides creation of distinctive, production-grade HTML + CSS mockups that avoid generic "AI slop" aesthetics. Output is a **design reference** — static visual mockups, not framework-specific code.

## Pattern Files

| File                                      | Use When                                                                                                              |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `design-system-conventions.patterns.md`   | Before generating any mockup — CSS-level design system conventions for internal consistency (tokens, typography, CTAs, spacing) |

## Design Thinking — CRITICAL

Before creating any mockup, understand the context and commit to a **BOLD aesthetic direction**:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick a clear extreme — brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian. There are so many flavors to choose from. Use these for inspiration but design one that is **true to the chosen aesthetic**.
- **Constraints**: Technical requirements, performance, accessibility.
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is **intentionality, not intensity**.

Every mockup must be:

- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail
- Production-grade in quality and craft

## Frontend Aesthetics Guidelines

Focus on these dimensions for every mockup:

### Typography

Choose fonts that are **beautiful, unique, and interesting**. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the mockup's aesthetics — unexpected, characterful font choices. **Pair a distinctive display font with a refined body font.**

### Color & Theme

Commit to a cohesive aesthetic. Use CSS custom properties for consistency. **Dominant colors with sharp accents outperform timid, evenly-distributed palettes.** Every mockup defines its palette via CSS custom properties at the top of the file.

### Spatial Composition

Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. **Generous negative space OR controlled density** — never a bland middle-ground.

### Backgrounds & Visual Details

Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like **gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, and grain overlays**.

### Anti-Slop Rules — NEVER Do These

NEVER use generic AI-generated aesthetics:

- **Overused font families**: Inter, Roboto, Arial, system fonts, Space Grotesk
- **Cliché color schemes**: purple gradients on white backgrounds, generic blue CTAs
- **Predictable layouts**: cookie-cutter hero + 3-column features + testimonials grid
- **Cookie-cutter design** that lacks context-specific character
- **Placeholder images**: grey boxes, solid color blocks, "image placeholder" text

**Interpret creatively and make unexpected choices** that feel genuinely designed for the context. No two mockups should look the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive visual detail. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. **Elegance comes from executing the vision well.**

