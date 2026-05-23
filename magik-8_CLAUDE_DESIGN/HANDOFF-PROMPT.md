# Context handoff — Magik 8 design system v2

> Paste this entire file (or attach it) into the new chat to bring the next agent up to speed.

---

## What this project is

I'm building a **mobile-first PWA called "Magik 8"** — a faithful digital homage to the physical fortune-ball toy. The user shakes (or taps) the ball, ink rises in the triangle window, an answer surfaces.

The codebase is **already implemented** (React + Vite + TypeScript + Tailwind v4 + motion/react). My local working copy is mounted in this conversation as the folder **`magik-8/`** — explore it with `local_ls("magik-8")` and read files with `local_read("magik-8/...")`. Key files:

- `magik-8/src/components/{MagikBall,AnswerTriangle,ThemeChips,ShakeCTA,MuteToggle,PermissionSheet,ShareSheet,ShareCard}.tsx`
- `magik-8/src/hooks/useOracleMachine.ts` — phase machine (idle → shaking → revealing → answered)
- `magik-8/src/context/{OracleContext,AudioContext}.tsx`
- `magik-8/src/data/answers.ts` — theme packs (classic / career / party)
- `magik-8/src/types/oracle.ts`
- `magik-8/src/index.css` — current `--magik-*` tokens
- `magik-8/docs/{PRODUCT,DESIGN}.md` — original spec

## What's already in this design project

A previous chat produced a **complete design system v2** in this current project. Files:

| Path | Purpose |
|---|---|
| `index.html` | Visual design system showroom — scroll top-to-bottom; every token, component, anatomy, motion spec, handoff prompt lives here |
| `prototype.html` | Interactive iPhone prototype — Tweaks toolbar lets me walk every ritual state |
| `exports-builder.html` | Pixel-perfect render page for the screenshot exports (`#share`, `#phone`, `#ball` routes) |
| `tokens.css` | The canonical `--m8-*` CSS variable set (replaces `--magik-*`) |
| `components.css` | Reference component styles |
| `magik8-ball.jsx` | Reference React component (plain JSX) for MagikBall + AnswerTriangle |
| `magik8-chrome.jsx` | Reference React components for Wordmark, MuteToggle, ShakeCTA, ThemeChips, PermissionSheet, ShareSheet, ShareCard |
| `design-system.jsx` | The showroom React app rendered into `index.html` |
| `design-system.css` | Layout styles for the showroom |
| `ios-frame.jsx` | Starter component — iOS device frame used in `prototype.html` |
| `tweaks-panel.jsx` | Starter component — Tweaks panel infrastructure |
| `docs/DESIGN-V2.md` | Canonical text spec — read this first |
| `prompts/00-overview.md` … `06-motion.md` | Implementation prompts for the AI coding assistant who'll apply this to `magik-8/src/` |
| `exports/*.png` | Rendered images of every section + the 1080×1920 share card + a 4-up phone-states image |
| `README.md` | Top-level guide |

**Read these first** to get up to speed:
1. `README.md`
2. `docs/DESIGN-V2.md`
3. `index.html` (look at it rendered — open it in the preview)
4. `prompts/00-overview.md`

## Design direction (committed — do not re-litigate)

- **Stage:** warm-cool deep black `oklch(13% 0.008 270)` + 8% film grain + radial vignette. **No background gradients.**
- **Sphere:** five-layer CSS gradient stack (base radial + warm bottom bounce + rim darkening + diffuse highlight + hard specular). Reads as plastic, not chrome.
- **Triangle:** inline SVG — bezel gradient + cavity-dark fill + clipped ink rect (`y` + `height` animate the rise) + meniscus highlight + recess overlay + glass dome ellipse.
- **Cobalt ink:** two-tone vertical gradient (deep `oklch(18% 0.150 262)` → mid `oklch(30% 0.170 258)` → hi `oklch(46% 0.180 252)`). **Not pastel, not sky-blue, not navy.**
- **Wordmark:** "magik 8" in **VT323** (Y2K terminal). The "8" is amber `oklch(78% 0.135 78)` with an embossed text-shadow stack.
- **Answer text:** Oswald 600 condensed, uppercase, +0.015em tracking, soft cobalt glow. Inside the triangle.
- **Ball numeral "8":** Helvetica/Arial Black 900 (NOT condensed — same as the real billiard ball).
- **UI chrome:** Tahoma/Verdana, 11–15px, lowercase, never bold-over-700.
- **HUD:** VT323 monospaced, micro-labels like `sesh 007 / classic [READY]`.
- **CTAs:** rectangular buttons with ASCII corner brackets `┌ ┐ └ ┘` (NOT pills).
- **One accent:** warm amber. No purple, pastel, or "AI oracle" gradients.

## Hard constraints (from the original spec — do not change)

- The oracle state machine `useOracleMachine.ts` — phases, transitions, timing
- `pickAnswer.ts`, `easterEgg.ts`, `rng.ts`, `useShake.ts`, `useHaptics.ts`, `useAudio.ts`
- `data/answers.ts` (answer copy stays)
- All `aria-*`, focus management, keyboard handlers
- `useReducedMotion` branches
- `SHARE_CARD_WIDTH=1080`, `SHARE_CARD_HEIGHT=1920`
- `REVEAL_MS=600`
- All tests (`*.test.ts`)

## My workflow

The plan is:
1. **Iterate on visuals in *this* project** (`index.html`, `prototype.html`, the `.jsx` source files, `tokens.css`).
2. Once happy, regenerate the screenshots in `exports/` so they match the latest design.
3. Update `prompts/*.md` to reflect any changes.
4. Hand the whole folder (this project) to an AI coding assistant who'll apply it to `magik-8/src/`.

So when I ask you to change something, the typical loop is:

- Edit `magik8-ball.jsx` / `magik8-chrome.jsx` / `tokens.css` / `components.css`
- Refresh `prototype.html` or `index.html` and verify
- Re-capture relevant `exports/*.png` if the change is visual
- Update the matching `prompts/0X-*.md`
- Update `docs/DESIGN-V2.md` if a token, scale, or anatomy changed

## What I'm likely to ask next

Things still on the table:
- Refining the wordmark spacing (VT323 has tight glyph metrics — gap currently `0.5em`, may need `0.6em`)
- Tuning the cobalt ink saturation
- Iterating on the share card layout
- Adding/refining theme accent treatments (career, party)
- Polishing the HUD strip
- Reduced-motion behaviour
- Adding additional easter-egg variants

## Things to NOT do

- Don't rebuild the design system from scratch — extend what's there
- Don't change the file structure
- Don't add new fonts (VT323 / Oswald / Helvetica Black / Tahoma stack is locked)
- Don't introduce emoji into the UI
- Don't add the trademarked "Magic 8 Ball™" name anywhere
- Don't invent new ritual phases — `idle | shaking | revealing | answered` is final

## Style: how I work

- Vocalize the design system / decisions you'll commit to before building, like a junior designer pitching to a manager
- Show me early and often (call `show_to_user` for previews; use `done` at end of turn)
- Use Tweaks in `prototype.html` to expose new variations so we can compare side-by-side
- Keep file paths and naming conventions consistent with what's already there

---

**Start by:**
1. Running `list_files` on this project to see the current state
2. Running `local_ls("magik-8")` to see the actual codebase
3. Reading `README.md` and `docs/DESIGN-V2.md`
4. Confirming you understand the direction, then asking what I want to change today
