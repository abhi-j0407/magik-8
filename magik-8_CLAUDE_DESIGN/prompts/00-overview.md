# Magik 8 — Design V2 Implementation Pack

You are the AI coding assistant for the Magik 8 PWA. The user is the design lead — they've prepared a new design system (DESIGN-V2) and want you to apply it to the existing `src/` without changing any product logic.

## What you have

- **`docs/DESIGN-V2.md`** — canonical text spec
- **`exports/*.png`** — rendered screenshots of every section, every state, and component close-ups
- **`tokens.css`** — design tokens (CSS variables) to copy into `src/index.css`
- **`components.css`** — reference component styles (will be inlined into the React components as Tailwind classes or kept as a regular CSS file)
- **`magik8-ball.jsx`, `magik8-chrome.jsx`** — reference React components in plain JSX (you must port these to TSX, preserving the existing motion/react and oracle context wiring)
- **`prompts/01-tokens.md` … `prompts/06-motion.md`** — step-by-step prompts

## Order of operations

Apply these prompts **in order**. Each is independent enough that you can stop and verify after each step.

1. `01-tokens.md` — design tokens + font loading + grain/vignette utilities
2. `02-ball.md` — `MagikBall.tsx` (sphere layer stack)
3. `03-triangle.md` — `AnswerTriangle.tsx` (SVG bezel + ink + meniscus)
4. `04-chrome.md` — Wordmark, HUDStrip, ThemeChips, ShakeCTA, MuteToggle, PermissionSheet, ShareSheet, App header
5. `05-share-card.md` — `ShareCard.tsx` (1080×1920)
6. `06-motion.md` — motion easing tweaks

## Hard constraints — DO NOT CHANGE

- The oracle state machine (`src/hooks/useOracleMachine.ts`) — phases, transitions, timing
- `src/lib/pickAnswer.ts`, `src/lib/easterEgg.ts`, `src/lib/rng.ts`
- `src/data/answers.ts` (answer copy stays)
- `src/hooks/useShake.ts`, `useHaptics.ts`, `useAudio.ts`
- `src/context/*` (audio/oracle providers)
- All `aria-*`, `role`, focus management, keyboard handlers
- `useReducedMotion` branches — keep them; only update what the branches animate
- `SHARE_CARD_WIDTH=1080`, `SHARE_CARD_HEIGHT=1920` constants
- The `REVEAL_MS=600` constant
- All test files in `src/**/*.test.ts`

## Soft conventions

- Keep Tailwind classes where you can (the project uses Tailwind v4 with the `bg-(--var)` arbitrary-value syntax)
- For complex multi-layer effects (sphere gradients, triangle SVG), inline `style={{ ... }}` is fine
- New CSS rules go in `src/index.css` under the existing `:root` block, namespaced `.m8-*`
- Lowercase UI copy throughout (`tap to shake`, not `Tap to shake`)
- No emoji in production UI (replace the existing `🔇 🔊` in `MuteToggle.tsx` with inline SVGs)

## Verification after each step

Run `npm run dev` and visually compare against the matching PNG in `exports/`:

| Step | Compare against |
|---|---|
| 01 | `exports/05-color-tokens.png`, `exports/06-typography.png` |
| 02 | `exports/03-ball-anatomy.png`, `exports/07-state-*.png` |
| 03 | `exports/04-triangle-anatomy.png` |
| 04 | `exports/08-components.png` |
| 05 | `exports/share-card-full.png` |
| 06 | `exports/09-motion.png` (motion table) |

Then run the existing tests: `npm test`. None should regress.
