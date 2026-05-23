# Magik 8 — Design System v2

> Single source of truth for the Magik 8 visual refresh.
> Hand this folder to your AI coding assistant alongside the existing repo.

---

## Open these first

| File | What it is |
|---|---|
| **`index.html`** | The design system showroom — open in a browser, scroll top-to-bottom. Every token, component, state, motion spec, and handoff prompt lives here. |
| **`prototype.html`** | An interactive iPhone prototype. Toggle the `Tweaks` panel to walk every ritual state (idle / shaking / revealing / answered / easter-egg), permission sheet, share button, grain on/off. Great for screen-recording. |

## Read these to hand off

| File | What's in it |
|---|---|
| **`docs/DESIGN-V2.md`** | The canonical text spec — color tokens, type scale, component anatomy, motion table, share card, theme accents, asset inventory. |
| **`prompts/00-overview.md`** | Meta-instructions for your AI coder. Read first. |
| **`prompts/01-tokens.md`** | Step 1 — migrate `src/index.css`, add fonts, rename `--magik-*` → `--m8-*`. |
| **`prompts/02-ball.md`** | Step 2 — rebuild `src/components/MagikBall.tsx`. |
| **`prompts/03-triangle.md`** | Step 3 — rebuild `src/components/AnswerTriangle.tsx`. |
| **`prompts/04-chrome.md`** | Step 4 — Wordmark + HUDStrip (new), ThemeChips, ShakeCTA, MuteToggle, PermissionSheet, ShareSheet, App header. |
| **`prompts/05-share-card.md`** | Step 5 — rebuild `src/components/ShareCard.tsx`. |
| **`prompts/06-motion.md`** | Step 6 — motion verification + reduced-motion QA. |

## Feed these as images

Reference renders for the AI to match against:

### Phone states (the most important one)
- **`exports/phone-states.png`** — 4 phone screens side by side: idle · shaking · revealing · answered. The final visual target.

### Share card
- **`exports/share-card-full.png`** — 1080 × 1920 story export (scaled to fit). The target for `ShareCard.tsx`.

### Anatomy callouts
- `exports/04-ball-anatomy.png` — sphere layer stack, labels A–G
- `exports/05-triangle-anatomy.png` — cavity + ink + meniscus, labels A–G
- `exports/ball-isolated.png` — the ball at large size, no chrome

### Design system pages (every section)
| File | Section |
|---|---|
| 01-hero.png | hero (wordmark + statement) |
| 02-principles.png | the four non-negotiables |
| 03a/b-references-*.png | reference board with swatches |
| 04-ball-anatomy.png | UX-001 anatomy |
| 05-triangle-anatomy.png | UX-002 anatomy |
| 06-states.png | ritual states (4 phases) |
| 07a/b-colors-*.png | every color token with role |
| 08a/b-typography-*.png | 5 type roles + scale table |
| 09a/b-components-*.png | chips, CTA, mute, sheet, share, HUD |
| 10-motion.png | motion table + ritual timeline bar |
| 11-themes.png | classic / career / party accents |
| 12-share-card.png | share card spec card |
| 13-layout.png | mobile wireframe + safe areas |
| 14-assets.png | asset inventory table |
| 15-anti-patterns.png | do / don't checklist |
| 16a/b/c-handoff-*.png | implementation handoff steps |

## Use these as source files

These get copied (and adapted) into `src/`:

| File | Purpose |
|---|---|
| **`tokens.css`** | The canonical CSS variable block. Copy into `src/index.css` under `@import 'tailwindcss';`. |
| **`components.css`** | Reference component styles. Some get translated to Tailwind classes; some get appended to `src/index.css` namespaced `.m8-*`. |
| `magik8-ball.jsx` | Reference React components (plain JSX) — port to TSX, preserving existing motion/react and oracle wiring. |
| `magik8-chrome.jsx` | Wordmark, HUDStrip, ShakeCTA, ThemeChips, MuteToggle, PermissionSheet, ShareSheet, ShareCard — reference implementations. |

---

## Workflow for handoff

1. Open `index.html` locally — confirm the visual direction with your team.
2. Open `prototype.html` — record a screen-grab walking each state.
3. Hand the AI coder this folder. Tell them:

   > "Apply `prompts/01-tokens.md` → `prompts/06-motion.md` in order to the existing repo at `<path-to-magik-8>`. Match `exports/phone-states.png` for the final screen. Do not touch oracle state machine, sensors, audio, or `data/answers.ts`."

4. Verify each step by comparing the running app against the matching PNG in `exports/`.

---

## What this does NOT change

- The oracle state machine and ritual timing
- Sensor / shake / haptics / audio hooks
- Answer copy (`src/data/answers.ts`)
- Tests (`*.test.ts`)
- The `SHARE_CARD_WIDTH=1080 / HEIGHT=1920` constants
- The `REVEAL_MS=600` constant
- aria-* attributes, focus management, keyboard handlers

Only visuals, tokens, and the new `Wordmark` / `HUDStrip` components are added.

---

## Quick visual summary

**Stage:** warm-cool deep black (oklch 13% / chroma 0.008 / hue 270) + 8% film grain + radial vignette.
**Sphere:** five-layer gradient stack — base radial, warm bottom bounce (screen blend), rim darkening, diffuse upper-left, hard specular.
**Triangle:** SVG with bezel gradient + cavity-dark fill + clipped ink rect + meniscus highlight + recess overlay + glass dome ellipse.
**Wordmark:** "magik 8" in VT323. The "8" is amber (oklch 78% / 0.135 / 78) with an embossed text-shadow stack.
**Answer:** Oswald 600 condensed, all-caps, +0.015em tracking, soft cobalt glow.
**CTA:** rectangular button with ASCII corner brackets ┌ ┐ └ ┘ (NOT pills).
**Chrome:** Tahoma/Verdana stack, 11–15px, lowercase. Never bold-over-700.
**Accent:** one amber. No purple, no pastel, no gradients-as-decoration.

— end —
