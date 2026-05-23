---
id: design
version: 1.0.0
status: superseded
superseded-by: DESIGN-V2.md
---

# DESIGN — Magik 8 (V1)

> **Superseded** by [`DESIGN-V2.md`](./DESIGN-V2.md) (Design V2 integration complete). Kept for historical token names and PRD cross-references.

Faithful homage to the black-and-white billiard ball + cobalt answer window. Technical polish via motion and sound, not via redesigning the icon.

## Aesthetic direction

- **Cornerstone:** Recognizable 8-ball silhouette, triangle window, blue "ink" reveal.
- **Enhancement:** Idle float, shake wobble, ink bloom, subtle grain, tactile controls.
- **Avoid:** Purple SaaS gradients, Inter/Roboto/Space Grotesk, generic "AI oracle" UI.

## Color tokens (CSS variables)

```css
:root {
  --magik-bg: #0a0a0c;           /* deep stage */
  --magik-sphere: #141414;       /* ball body */
  --magik-sphere-highlight: #2a2a2a;
  --magik-stripe: #f5f5f0;       /* white circle field */
  --magik-eight: #0a0a0c;        /* numeral 8 */
  --magik-fluid: #0d3b66;        /* answer liquid */
  --magik-fluid-light: #1a5a8a;  /* shimmer */
  --magik-answer-text: #f5f5f0;
  --magik-accent: #c9a227;       /* rare easter-egg accent only */
  --magik-muted: #8a8a90;        /* hints */
}
```

## Typography

| Role | Font direction | Notes |
|------|----------------|-------|
| Answer in triangle | **Bebas Neue** or **Archivo Black** | Condensed, toy-label feel |
| UI chrome | **DM Sans** | Readable at 14–16px |
| Wordmark | **Custom lettering** or Bebas | "Magik 8" — load via Google Fonts or self-host subset |

*Implementer: add font links in `index.html`; no Inter/system-only stack.*

## Layout (mobile-first)

- Safe-area padding: `env(safe-area-inset-*)`
- Ball: ~min(70vh, 360px) diameter, centered
- Triangle window: bottom third of ball, equilateral ~38% ball width
- Theme chips: horizontal scroll, 44px min height
- Action row: Share | Mute — icon + `aria-label`

## Components (UX-IDs)

| ID | Component | Behavior |
|----|-----------|----------|
| UX-001 | `MagikBall` | Idle float; shake wobble; hides "8" on reveal |
| UX-002 | `AnswerTriangle` | Blue fill rises; text fades in |
| UX-003 | `ThemeChips` | Select pack before shake; persists `localStorage` |
| UX-004 | `ShakeCTA` | Fallback tap; shows "Enable shake" on iOS |
| UX-005 | `PermissionSheet` | One-time motion permission explainer |
| UX-006 | `ShareSheet` | Export + Web Share |
| UX-007 | `MuteToggle` | Persists preference |

## Motion (REQ-020)

| State | Motion | Reduced motion |
|-------|--------|----------------|
| Idle | Slow Y float 4s loop | Static |
| Shaking | Rotational wobble ±8° 400ms | Single opacity pulse |
| Revealing | Fluid height 0→100% 600ms ease-out | Instant text |
| Answer shown | Text stagger 200ms | Instant |

Use **Motion** (`motion/react`). No Three.js in v1.

## Sound bible (REQ-040)

| ID | Event | Description | Duration |
|----|-------|-------------|----------|
| SFX-01 | `shake_start` | Muffled slosh | ~300ms |
| SFX-02 | `reveal` | Soft triangle "ping" | ~400ms |
| SFX-03 | `easter_egg` | Sparkle layer | ~600ms |

- Default **unmuted** until user toggles; store `magik_mute` in localStorage.
- Unlock AudioContext on first user gesture (iOS).

## Haptics (REQ-041)

| Event | Pattern (ms) |
|-------|----------------|
| Shake detected | `[30, 50, 30]` |
| Reveal complete | `[80]` |

Guard: `'vibrate' in navigator`.

## Share card (REQ-050)

- Size: **1080×1920** (story), optional **1200×630** (OG — if meta tags added later)
- Content: ball crop, answer text, "Magik 8" wordmark, theme label small
- Background: `--magik-fluid` gradient

## Accessibility (REQ-070)

- `aria-live="polite"` on answer region
- Focus visible on all controls
- Contrast: answer text on blue ≥ 4.5:1
- `prefers-reduced-motion`: disable float/wobble; keep readable answer

## Assets to create (PHASE-5)

- PWA icons: 192, 512 maskable
- `favicon.ico`
- Optional: subtle noise PNG tile for sphere
