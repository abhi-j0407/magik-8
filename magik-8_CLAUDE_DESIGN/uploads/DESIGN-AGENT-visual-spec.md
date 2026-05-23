# Agent Prompt — Design Spec (Magik 8 Visual System)

**Role:** Design lead — **documentation and visual direction only** in this chat. Do **not** implement React/CSS unless the user explicitly asks for a follow-up implementation pass.

**Product:** Magik 8 — digital Magic-8-Ball-style ritual (ask mentally → shake/tap → reveal → share). Mobile-first PWA. Codebase already has working ritual, sensors, audio, share; **UI currently functional but visually underbaked**.

---

## Creative north star (non-negotiable)

Convert the **physical eight-ball experience** to digital **without making it feel artificial**.

The interface should feel:

- **Fun, exciting, nostalgic, mischievous**
- **Early-2000s web energy** — typography, layout hints, attitude (not kitsch parody)
- **Modern web craft** — motion design, accessibility, performance, `prefers-reduced-motion`
- **Character over minimalism** — avoid pastel SaaS palettes, generic “AI oracle” UI, purple gradients, Inter/Roboto defaults

**Tone:** Mystical toy shelf + late-night Flash-era playfulness, not a dashboard.

**Legal:** Product name **Magik 8** only. Never use “Magic 8 Ball™”, Mattel marks, or trademarked logos in copy or assets. Reference the *category* of toy (billiard 8-ball fortune toy) for visual fidelity, not brand IP.

---

## What to read first (context budget)

| Priority | File | Why |
|----------|------|-----|
| 1 | `docs/PRODUCT.md` | Ritual, brand, anti-goals |
| 2 | `docs/DESIGN.md` | Current tokens, UX-IDs, motion table (baseline to evolve) |
| 3 | `docs/HANDOFF.md` | What’s built; QA backlog |
| 4 | `src/components/MagikBall.tsx`, `AnswerTriangle.tsx`, `ThemeChips.tsx`, `ShareCard.tsx` | **Inspect only** — understand structure you are reskinning, not replacing ritual logic |

Do **not** read full `ANSWERS.md` or `PRD.md` unless you need a specific REQ-ID.

---

## Reference research (required in your output)

Find and cite **real-world visual references** for fidelity (photos, diagrams, museum/archive shots, billiard ball macro photography, vintage packaging scans where license-safe):

| Element | What to document |
|---------|------------------|
| Sphere | Gloss black billiard ball, highlight placement, white “8” field proportions |
| Triangle window | Inverted triangle geometry, bezel/rim, depth into cavity |
| Answer “fluid” | Classic **cobalt / inky blue** (not neon, not pastel sky-blue) |
| Typography on toy | How answer text sits **inside** the window — centered, cramped, authoritative |
| Material | Plastic gloss, subtle scratches, shelf lighting |

For each reference, provide: **description**, **what to steal for digital**, **what to avoid** (e.g. literal Mattel packaging). Prefer Creative Commons, Wikimedia, or your own words + sketch descriptions if linking is risky.

**Asset strategy:** Specify which elements are **CSS/SVG** vs **raster** (PNG/WebP noise, ball photo under license, SVG mask). Include an **asset inventory table** with suggested dimensions and export names (e.g. `public/textures/grain-tile.png`).

---

## Aesthetic systems to define

### 1. Color

- Replace or refine current tokens in `DESIGN.md` (`--magik-*`).
- Palette must have **flavour**: deep blacks, ink blue, warm off-white, **one** mischievous accent (gold, amber, or Y2K chrome — not candy pastel).
- Document **semantic roles**: stage, sphere, stripe, fluid, fluid highlight, answer text, chrome, danger/muted, easter-egg accent.
- Include **contrast notes** for WCAG on blue answer field (≥ 4.5:1).

### 2. Typography (early-2000s + readable)

- **Answer in triangle:** condensed, label-like, **integrated** — letter-spacing and line-height so text feels **printed in the window**, not pasted on.
- **UI chrome:** distinct but subordinate; consider era-appropriate choices (e.g. Tahoma/Verdana energy via modern equivalents, bitmap/display accents for **wordmark only**).
- **Wordmark “Magik 8”:** custom feel — ASCII-adjacent or faux-emboss, not a startup logo.
- Provide **type scale** (mobile): sizes, weights, `letter-spacing`, `line-height`, max lines for longest answer string.
- Font loading strategy: Google Fonts subset vs self-host (perf-aware).

### 3. Layout & composition

- Mobile-first single screen; safe areas; thumb zones.
- Ball dominant (~`min(70vh, 360px)` or your refined spec).
- Triangle window: **bottom third**, proportional to ball — exact % and padding.
- Theme chips, Shake CTA, mute/share: **secondary** — must not compete with ball; fit **in place** with tight spacing, not “floating UI cards”.
- Text placement rules: when answer is long, how it wraps/truncates inside triangle.

### 4. Texture & filters (nostalgic craft)

Specify CSS/recipes for:

- **Film grain** overlay (tile + `mix-blend-mode` or SVG noise)
- **Subtle vignette** on stage
- **Sphere gloss** (gradients + optional highlight raster)
- **Triangle glass/ink** (blur, inner shadow, blue gradient stops)
- **ASCII / text shadows** for wordmark or hints (e.g. `text-shadow` stacks mimicking terminal/era depth — use sparingly)

Avoid over-filtering that hurts Lighthouse performance; note static vs animated layers.

### 5. Motion design (align with existing machine)

Existing phases: idle float, shake wobble, fluid rise ~600ms, reduced-motion fallbacks. **Do not invent new ritual states.**

Your doc should specify:

- Easing curves, durations, amplitudes (refine, don’t break FIX-3 ritual lock)
- How motion sells **suspense** and **mischief** (micro overshoot, ink bloom, 8 numeral fade)
- `prefers-reduced-motion` table per state

### 6. Components (map to UX-IDs)

For each: **UX-001 MagikBall**, **UX-002 AnswerTriangle**, **UX-003 ThemeChips**, **UX-004 ShakeCTA**, **UX-005 PermissionSheet**, **UX-006 ShareSheet / ShareCard**, **UX-007 MuteToggle**, plus **App shell / stage**:

| Section per component |
|---------------------|
| Purpose |
| Anatomy (layers) |
| Default / hover / active / disabled |
| Spacing diagram (ASCII or mermaid) |
| Copy tone (1–2 example strings) |
| Do-not (anti-patterns) |

### 7. Share card (1080×1920)

Visual spec for story export: ball crop, fluid gradient, wordmark, theme label, answer typography — must feel like **a photo of the toy moment**, not a generic social template.

### 8. Theme packs (classic / career / party)

How each theme **tints** chips and share card **without** breaking the iconic ball (accent only, not full reskin).

---

## Deliverables (write these files)

Produce **`docs/DESIGN-V2.md`** as the primary output (new file so V1 stays auditable). Structure:

```markdown
# DESIGN V2 — Magik 8 Visual System
## 1. Creative brief (summary)
## 2. Reference board (descriptions + links)
## 3. Color system (tokens table + CSS :root block)
## 4. Typography
## 5. Layout & spacing (mobile)
## 6. Textures, filters, ASCII effects
## 7. Components (UX-001 … UX-007)
## 8. Motion (per state)
## 9. Share card
## 10. Theme accents
## 11. Asset inventory & sourcing notes
## 12. Implementation handoff for engineering
    - File touch list (src/index.css, components…)
    - Token migration from DESIGN v1
    - Risks (perf, a11y, iOS safe area)
## 13. Anti-patterns checklist
```

Optional if useful:

- `docs/DESIGN-V2-MOODBOARD.md` — link list only
- Figma-free: ASCII wireframes in markdown are encouraged

At the end, add **`## Handoff — Design Spec`** block:

```markdown
**Status:** complete
**Outputs:** docs/DESIGN-V2.md [+ optional moodboard]
**Next:** Implementation chat — paste `docs/prompts/PHASE-7-design-implement.md` (create if missing) or instruct implementer to apply DESIGN-V2 to src/
**Blockers:** none | [asset license needs user approval]
```

---

## Do NOT

- Redesign information architecture (single screen, no new routes)
- Add 3D WebGL liquid simulation
- Change oracle state machine phases or sensor thresholds
- Use Mattel branding or “Magic 8 Ball” trademark in UI strings
- Propose pastel / glassmorphism SaaS aesthetic
- Implement production code in this pass unless user asks

---

## Quality bar (self-check before finishing)

- [ ] A developer could implement from DESIGN-V2 **without guessing** hex, spacing, or font sizes
- [ ] Ball + triangle read as **the toy** at thumbnail size
- [ ] Answer text feels **embedded** in the window, not overlaid
- [ ] Palette has **character** (document why each color exists)
- [ ] Early-2000s cues are **specific** (fonts, shadows, chrome), not vague “retro”
- [ ] Motion section respects existing ritual timing constraints
- [ ] Asset list distinguishes create vs source vs CSS-only

---

## User creative keywords (embed in V2)

> nostalgic · mischievous · early 2000s · ASCII shadows · grain · blur · real ball reference · cobalt ink · not artificial · not pastel · flavour · letter-spacing fits in place · modern web

---

*Coordinator: after DESIGN-V2 is approved by overseer, run implementation phase in a **separate** implementer chat.*
