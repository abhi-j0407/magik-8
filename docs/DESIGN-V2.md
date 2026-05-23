---
id: design-v2
version: 2.0.0
status: design-spec
supersedes: docs/DESIGN.md
---

# DESIGN V2 — Magik 8 Visual System

> Faithful digital homage to the black-and-white fortune toy.
> Mobile-first PWA. Cobalt ink, not pastel sky. Early-2000s personality in the details — never in the background.
>
> See `index.html` (the visual design system) for the canonical artifact. This file is the text companion.

---

## 1. Creative brief

**Mission.** Convert the physical eight-ball ritual to digital **without making it feel artificial.** The ball + triangle window must read as the actual fortune toy at thumbnail size; the chrome must be quiet enough not to compete with the sphere.

**Tone.** Mystical toy shelf + late-night Flash-era playfulness. Not a dashboard, not a tarot deck, not an "AI oracle."

**Non-negotiables.**

1. The toy is the brand. Theme packs may tint the chip + share card, never the ball.
2. Early-2000s personality in details: VT323 wordmark, ASCII corner brackets, embossed shadows, HUD numerals.
3. Cobalt ink — deep, saturated, two-tone from depth to surface. No pastels, neons, or "AI purples."
4. Motion ritual is **phase-locked**: idle → shaking → revealing → answered. Reduced-motion shortens, never invents.

**Legal.** Product name "Magik 8" only. Never "Magic 8 Ball™", never Mattel marks. Reference the *category* (billiard 8-ball fortune toy) for visual fidelity, not brand IP.

---

## 2. Reference board

See `index.html` § 02 *reference board* for the canonical cards with swatches.

| Reference | Steal | Avoid |
|---|---|---|
| **Billiard 8-ball** (pool ball) | Off-center white field (~42% diameter, ~18–22% from top); soft upper-left specular hotspot (a blob, NOT a ring); cool tint in the shadows. | A perfectly smooth ball. Add subtle grain. |
| **Fortune-telling toy** (category) | Triangle window proportions (~38% ball width, point upward, slightly inset); cobalt-on-near-black contrast; cramped printed-on-die typography. | Mattel branding, the exact toy logo, "Magic 8 Ball™" name. |
| **Cobalt fountain pen ink** | Two-tone vertical gradient — near-black at depth, brilliant cobalt near the surface; slight purple shift in deep volumes; bright meniscus line. | Sky-blue, cyan, navy, "tropical" gradients. |
| **Y2K UI artifacts** (Tahoma chrome, Winamp bitmap, Flash menus) | Tahoma 11–13px chrome; VT323 wordmarks with 2–3-stop text-shadow stacks; monospace HUD numerals; ASCII corner brackets `┌ ┐ └ ┘` on CTAs. | Aqua glassmorphism, Vista purple gradients, post-Y2K vaporwave neon. |
| **Oracle/fortune card typography** | Condensed all-caps that reads "stamped" inside a small window; tight letter-spacing; subtle ink glow. | Tarot mysticism, hand-drawn moons, third-eye iconography. |

---

## 3. Color tokens

> Source of truth: `tokens.css`. Copy into `src/index.css` under the existing `@import 'tailwindcss';`.

```css
:root {
  /* stage / surface */
  --m8-bg:              oklch(13% 0.008 270);
  --m8-bg-elev:         oklch(17% 0.008 270);
  --m8-rule:            oklch(24% 0.008 270);
  --m8-rule-hi:         oklch(34% 0.012 268);

  /* sphere */
  --m8-sphere-rim:      oklch(4%  0     0);
  --m8-sphere-core:     oklch(9%  0.004 270);
  --m8-sphere-mid:      oklch(15% 0.006 270);
  --m8-sphere-hi:       oklch(34% 0.010 268);
  --m8-sphere-spec:     oklch(96% 0.010 90);
  --m8-sphere-warm:     oklch(22% 0.020 60);

  /* stripe & numeral */
  --m8-stripe:          oklch(95% 0.014 92);
  --m8-stripe-shadow:   oklch(78% 0.020 90);
  --m8-eight:           oklch(9%  0.004 270);

  /* triangle window + cobalt ink */
  --m8-cavity-rim:      oklch(3%  0     0);
  --m8-cavity-dark:     oklch(8%  0.040 265);
  --m8-fluid-deep:      oklch(18% 0.150 262);
  --m8-fluid-mid:       oklch(30% 0.170 258);
  --m8-fluid-hi:        oklch(46% 0.180 252);
  --m8-fluid-meniscus:  oklch(72% 0.110 240);
  --m8-answer-ink:      oklch(95% 0.014 92);
  --m8-answer-glow:     oklch(65% 0.080 240);

  /* accents */
  --m8-amber:           oklch(78% 0.135 78);
  --m8-amber-dim:       oklch(58% 0.100 78);

  /* chrome / text */
  --m8-chrome:          oklch(72% 0.005 270);
  --m8-chrome-dim:      oklch(54% 0.005 270);
  --m8-chrome-mute:     oklch(40% 0.005 270);
  --m8-danger:          oklch(60% 0.180 28);
}
```

**Migration from V1.** All tokens renamed `--magik-*` → `--m8-*`. Mapping in `prompts/01-tokens.md`.

**Contrast check.** Answer text `oklch(95% 0.014 92)` (warm ivory) on `oklch(30% 0.170 258)` (cobalt mid) measures ~8.9:1 → exceeds WCAG AA (4.5:1) by a wide margin.

---

## 4. Typography

Four roles, each with a distinct family. **No Inter, no Roboto, no Bebas Neue for body**.

| Role | Family | Where | Stack |
|---|---|---|---|
| **wordmark** | VT323 | "magik 8" — header, share card, hero | `"VT323", "Courier New", ui-monospace` |
| **answer** | Oswald 600 | Inside the triangle, share card answer | `"Oswald", "Bebas Neue", "Archivo Narrow"` |
| **ball numeral** | Helvetica/Arial Black | The "8" on the ball | `"Helvetica Neue", "Helvetica", "Arial Black"` |
| **UI chrome** | Tahoma/Verdana | Body chrome, instructions, chips, CTA labels | `"Tahoma", "Verdana", "Geneva", system-ui` |
| **HUD** | VT323 | Session counter, status badges, micro-labels | `"VT323", "Courier New", ui-monospace` |

### Type scale (mobile-first)

| Token | Size | Role |
|---|---|---|
| `--m8-text-hud` | 11px | HUD numerals, micro-labels |
| `--m8-text-ui-sm` | 11px | Chip labels, captions |
| `--m8-text-ui` | 13px | Body chrome, instructions |
| `--m8-text-ui-lg` | 15px | Primary CTA label |
| `--m8-text-wordmark` | 22px | App header brand |
| `--m8-text-answer` | `clamp(14px, 4.4vw, 22px)` | Answer inside triangle |
| `--m8-text-eight` | `clamp(64px, 22vw, 124px)` | Numeral on ball |
| `--m8-text-wordmark-l` | 56px | Share card hero |
| `--m8-text-answer-l` | 88px | Share card answer |

### Loading strategy

Add to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&family=Oswald:wght@500;600;700&display=swap" />
```

Remove any prior `Bebas Neue` and `DM Sans` imports.

### Wordmark recipe

```jsx
<div className="m8-wordmark">
  <span>magik</span>
  <span className="m8-wm-eight">8</span>
</div>
```

```css
.m8-wordmark {
  font-family: var(--m8-font-wordmark);
  display: inline-flex;
  align-items: baseline;
  gap: 0.5em;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 0 rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.06), 0 2px 6px rgba(0,0,0,0.5);
}
.m8-wordmark .m8-wm-eight {
  color: var(--m8-amber);
  font-size: 1.25em;
  text-shadow: 0 1px 0 rgba(0,0,0,0.9), 0 0 14px oklch(78% 0.135 78 / 0.55);
}
```

---

## 5. Layout & spacing (mobile)

```
┌─────────────────────────────┐
│  status bar (safe-area-top) │
├─────────────────────────────┤
│  wordmark              mute │  ← header row (40px)
│  sesh 007 / classic | ready │  ← HUD strip (24px)
│                             │
│         ┌─────────┐         │
│         │   ◐ 8   │         │  ← BALL · min(70vh, 360px)
│         │  ◀───▶  │         │     idle floats ±6px
│         └─────────┘         │
│                             │
│   hold question · shake     │  ← instruction (13px muted)
│                             │
│  [classic][career][party]   │  ← theme chips (32px min)
│  ┌──────────────────────┐   │
│  └─[ tap to shake ]─────┘   │  ← shake CTA (44px min)
│                             │
│  ↑ share answer  (only when │  ← share button (cobalt)
│    phase === 'answered')    │
├─────────────────────────────┤
│ home indicator (safe-bottom)│
└─────────────────────────────┘
```

### Safe areas

- `padding-top: env(safe-area-inset-top)` — below dynamic island/notch
- `padding-bottom: env(safe-area-inset-bottom)` — above home indicator
- Horizontal page padding: 16–20px

### Spacing scale

| px | Use |
|---|---|
| 4 | micro (icon gap, HUD inner) |
| 8 | tight (chip gap, sheet inner) |
| 14 | default (footer stack between chips/CTA/share) |
| 20 | loose (page horizontal padding) |
| 28 | big (between hero region + chrome) |

### Thumb zones

- Primary CTA: bottom third (44px min height, full-row tap target)
- Theme chips: just above CTA, horizontal scroll, 32px min height
- Mute: top-right corner (secondary hand — low priority)

---

## 6. Textures, filters, ASCII effects

### Film grain (CSS-only, no asset)

```css
.m8-grain::before {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
  background-size: 160px 160px;
  mix-blend-mode: overlay;
  opacity: 0.08;
  z-index: 50;
}
```

### Vignette

```css
.m8-vignette::after {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 30%,
    oklch(8% 0.005 270 / 0.45) 75%,
    oklch(4% 0.005 270 / 0.75) 100%);
}
```

### ASCII corner brackets on CTAs

Use Unicode glyphs `┌ ┐ └ ┘` (U+250C/2510/2514/2518) as absolutely-positioned spans inside the button. Font: `var(--m8-font-hud)`, color `var(--m8-chrome-mute)` (→ amber on hover). See `magik8-chrome.jsx` → `ShakeCTA`.

### Text-shadow stacks (faux-emboss)

- **Wordmark base:** `0 1px 0 rgba(0,0,0,.9), 0 -1px 0 rgba(255,255,255,.06)`
- **Wordmark "8" (amber):** add `0 0 14px oklch(78% 0.135 78 / 0.55)`
- **Answer text:** `0 0 8px var(--m8-answer-glow)` (subtle ink glow)
- **CTA emboss:** `inset 0 1px 0 rgba(255,255,255,.05), inset 0 -1px 0 rgba(0,0,0,.5), 0 1px 0 rgba(0,0,0,.6)` (on the button itself, box-shadow)

**Performance.** All filters above are static. Animated layers (idle float, shake wobble) use `transform`-only (`translateY` / `rotate`). Grain layer is `pointer-events: none` and does not animate.

---

## 7. Components

### UX-001 · MagikBall (`src/components/MagikBall.tsx`)

**Purpose.** The sphere. Touch target. Phase-driven idle float / shake wobble. Hides the "8" field on reveal.

**Anatomy.**
1. Sphere body — radial gradient stack (5 layers)
2. Upper-left diffuse highlight
3. Hard specular dot
4. Secondary tiny specular
5. Warm bottom bounce (`mix-blend-mode: screen`)
6. White "8" field (Helvetica Black 900)
7. Triangle window slot (renders `<AnswerTriangle>`)
8. Contact shadow (separate `<div>`, NOT a box-shadow)

**States.** `idle | shaking | revealing | answered`. Idle floats (`translateY 0 → -6 → 0` over 4s). Shaking rotates ±8° over 400ms. Revealing/answered hide the "8" field with a 300ms fade.

**Anti-patterns.**
- ❌ Solid color sphere with single radial — reads as a button, not a ball.
- ❌ Specular as a *ring* — should be a soft blob.
- ❌ Bright outline / focus ring inside the sphere — focus goes on the outer button via `outline-offset: 6px`.

### UX-002 · AnswerTriangle (`src/components/AnswerTriangle.tsx`)

**Purpose.** The window. Renders bezel + cavity + ink + answer text.

**Anatomy.** Inline SVG (`viewBox="0 0 100 87"`) with:
1. Outer bezel triangle (linear gradient, dark)
2. Inner cavity triangle (`--m8-cavity-dark` — visible during idle)
3. Ink rect inside `<clipPath>` triangle — animates `y` and `height` for the rise
4. Meniscus highlight line (gaussian-blurred, faint)
5. Recess radial gradient overlay (darkens edges, sells depth)
6. Faint vertical streaks for ink texture
7. Glass dome ellipse at top (6% white)
8. HTML overlay `<div>` for crisp answer text on top of SVG

**Animation.** Ink: `y: 83 → 4`, `height: 0 → 79` over 600ms with `--m8-ease-ink`. Text: opacity 0 → 1 over 200ms, delayed 400ms.

**Anti-patterns.**
- ❌ Flat cobalt fill — needs the vertical gradient + recess.
- ❌ Text positioned with `transform: translate(-50%)` over a separate triangle — wrap the text inside the same flexbox so it stays centered as the ink rises.

### UX-003 · ThemeChips (`src/components/ThemeChips.tsx`)

**Purpose.** Pack picker — `classic`, `career coach`, `party mode`.

**States.** default · hover · selected · disabled (during ritual).

**Anatomy.** Each chip = small dot (6px circle) + lowercase label. Selected chip gets:
- Amber dot with glow (`box-shadow: 0 0 6px var(--m8-amber)`)
- Border switches to `var(--m8-amber-dim)`
- Background gets a 6% amber tint

Min height 32px, padding `6px 12px 6px 10px`, border-radius `999px`.

### UX-004 · ShakeCTA (`src/components/ShakeCTA.tsx`)

**Purpose.** Primary action. The thumb-zone button.

**Anatomy.** Rectangular button (NOT pill), 44px min height, with **ASCII corner brackets** as four absolutely-positioned `<span>`s at the corners. Background is a vertical `linear-gradient(180deg, oklch(20% .005 270) 0%, oklch(14% .005 270) 100%)`. Border 1px `var(--m8-rule)`. Embossed inner shadow stack.

**Labels** (always lowercase):
- `tap to shake` — idle
- `consulting…` — busy (with animated dots)
- `ask again` — answered
- `enable shake` — needs motion permission (iOS)

**Hover/focus.** Border → `var(--m8-amber-dim)`. Corner brackets → `var(--m8-amber)`. Label → `var(--m8-stripe)`.

### UX-005 · PermissionSheet (`src/components/PermissionSheet.tsx`)

**Purpose.** iOS motion-permission explainer. One-time.

**Anatomy.** Full-screen scrim (rgba(0,0,0,.6) + 6px backdrop-blur) + bottom-sheet (max-width 420px, padding 20px, border-radius 16px, bg `--m8-bg-elev`, 1px rule). Drag handle at top (36×4 rounded). Title in Oswald 600 22px uppercase. Body in Tahoma 13px. Actions: primary CTA + ghost "not now" link button.

**Animation.** Scrim fades in 200ms. Sheet rises with `translateY 24 → 0`, opacity 0 → 1, over 280ms `--m8-ease-toy`.

### UX-006 · ShareSheet (`src/components/ShareSheet.tsx`)

**Purpose.** Appears only when `phase === 'answered'`. Triggers PNG capture + Web Share / download fallback.

**Anatomy.** Single button with cobalt gradient (`linear-gradient(180deg, var(--m8-fluid-mid) 0%, var(--m8-fluid-deep) 100%)`), 1px `var(--m8-fluid-hi)` border, ASCII upload SVG icon, "share answer" label. Below it: status line in VT323 11px (`shared — check your share sheet` / `image saved to downloads` / error).

### UX-007 · MuteToggle (`src/components/MuteToggle.tsx`)

**Purpose.** Mute SFX. Persists to localStorage.

**Anatomy.** 36×36 transparent icon button with 1px `var(--m8-rule)` border. Inline SVG speaker icon (muted variant has slash through the waves). NO EMOJI. NO TEXT.

### App shell · header + HUD

**Header row.** `<Wordmark/>` on the left, `<MuteToggle/>` on the right. Justify space-between.

**HUD strip** (new component — `src/components/HUDStrip.tsx`). Under the header. VT323 14px, 0.12em letter-spacing, lowercase. Format:
```
sesh 007 / classic    [READY]
```
The status badge on the right is a small inset rectangle with thin border, colored by phase (chrome-dim / amber / fluid-hi / fluid-meniscus).

---

## 8. Motion

> Ritual-locked. Do not invent new phases. Reduced-motion shortens or stills the existing ones.

| Phase | Duration | Easing | Animates | `prefers-reduced-motion` |
|---|---|---|---|---|
| `idle` | 4000ms loop | ease-in-out | `translateY 0 → −6 → 0` | none (static) |
| `shaking` | 400ms | ease-in-out | `rotate −8° → 7° → −6° → 5° → 0°` | opacity 1 → 0.85 → 1 single pulse |
| `revealing` | 600ms | `cubic-bezier(.16, .8, .3, 1)` | ink rect: `y: 83 → 4`, `height: 0 → 79` | 0ms (instant) |
| answer text fade | 200ms (delay 400ms) | ease-out | opacity 0 → 1 | 0ms (instant) |
| sheet rise | 280ms | `cubic-bezier(.22, 1, .36, 1)` | `translateY 24 → 0`, opacity 0 → 1 | 0ms (instant fade) |
| scrim fade | 200ms | ease-out | opacity 0 → 1 | 0ms (instant) |

Tokens:

```css
--m8-dur-idle:        4000ms;
--m8-dur-shake:       400ms;
--m8-dur-reveal:      600ms;
--m8-dur-text-fade:   200ms;
--m8-ease-toy:        cubic-bezier(.22, 1, .36, 1);
--m8-ease-ink:        cubic-bezier(.16, .8, .3, 1);
```

---

## 9. Share card (1080 × 1920)

**Composition (top → bottom).**
1. Header — wordmark `magik 8` (VT323 56px) + pack label (VT323 22px, chrome-mute)
2. Center — ball cropped large (`size={620}`) with answered triangle visible
3. Answer — Oswald 600 88px uppercase, ivory + soft cobalt glow
4. Footer HUD line — `m8://oracle ● shake.respond.share` (VT323 22px, chrome-mute, amber dot)

**Background.** Radial cobalt-fade (`radial-gradient(ellipse at 50% 30%, oklch(20% .04 268) 0%, oklch(11% .012 270) 70%)`) + grain overlay 8% + ASCII corner brackets at 28px chrome-mute.

**Export.** PNG via `html-to-image` at device-pixel-ratio 2. `SHARE_CARD_WIDTH=1080`, `SHARE_CARD_HEIGHT=1920` constants unchanged.

**Easter-egg variant.** Replace answer color with `var(--m8-amber)`, increase font-size by ~10%, add a soft amber glow.

---

## 10. Theme accents

| Pack | Accent | Tints |
|---|---|---|
| **classic** | `oklch(78% 0.135 78)` — amber | selected chip dot, HUD pack indicator, share card pack label |
| **career coach** | `oklch(70% 0.110 175)` — eucalyptus | same as above |
| **party mode** | `oklch(72% 0.180 340)` — fuchsia | same as above |

**Rule.** Theme accents only tint:
- The selected chip dot
- The share card pack label
- The HUD pack indicator (`<span class="m8-hud-num">classic</span>`)

The ball, triangle, ink, and answer text remain canonical across all packs. **The ball is the brand** — never reskin it.

---

## 11. Asset inventory

| Asset | Format | Size | Path | Source |
|---|---|---|---|---|
| Sphere body | CSS gradients | — | component css | create (this kit) |
| Triangle window | inline SVG | — | component jsx | create (this kit) |
| Film grain tile | SVG data-URI | 160×160 | inline in `tokens.css` | create (this kit) |
| ASCII corner brackets | Unicode glyphs `┌ ┐ └ ┘` | text | component jsx | — |
| Mute/unmute icon | inline SVG | 16×16 | component jsx | create (this kit) |
| Share icon | inline SVG | 14×14 | component jsx | create (this kit) |
| Favicon | PNG | 32×32 | `/public/favicon.png` | generate from wordmark "8" |
| PWA icon | PNG maskable | 192, 512 | `/public/icons/` | generate — ball silhouette |
| SFX-01 shake_start | WAV/OGG | ~300ms | `/public/sfx/` | source (royalty-free slosh) |
| SFX-02 reveal | WAV/OGG | ~400ms | `/public/sfx/` | source (soft triangle ping) |
| SFX-03 easter_egg | WAV/OGG | ~600ms | `/public/sfx/` | source (sparkle layer) |
| Font: VT323 | Google Fonts | subset latin | preconnect + link | fonts.google.com/specimen/VT323 |
| Font: Oswald | Google Fonts | weights 500/600/700 | preconnect + link | fonts.google.com/specimen/Oswald |

---

## 12. Implementation handoff

> Use the prompts in `prompts/01-tokens.md` … `prompts/06-motion.md`. Each file is a copy-paste prompt for your AI coding assistant alongside the rendered PNGs in `exports/`.

### File touch list

| File | Change | Prompt |
|---|---|---|
| `index.html` | Font links (VT323, Oswald), remove Bebas/DM Sans | `01-tokens.md` |
| `src/index.css` | Token migration, grain/vignette utilities | `01-tokens.md` |
| `src/App.tsx` | Add `<Wordmark/>` + `<HUDStrip/>` to header; tweak instruction copy | `04-chrome.md` |
| `src/components/MagikBall.tsx` | Replace inner JSX with new sphere layer stack | `02-ball.md` |
| `src/components/AnswerTriangle.tsx` | Replace with bezel + ink gradient + meniscus SVG | `03-triangle.md` |
| `src/components/ThemeChips.tsx` | Dot + label structure; amber tint when selected | `04-chrome.md` |
| `src/components/ShakeCTA.tsx` | ASCII corner brackets + emboss; lowercase labels | `04-chrome.md` |
| `src/components/MuteToggle.tsx` | Inline SVG icons (drop the emoji) | `04-chrome.md` |
| `src/components/PermissionSheet.tsx` | Bottom-sheet animation + new typography | `04-chrome.md` |
| `src/components/ShareSheet.tsx` | Cobalt button + status row | `04-chrome.md` |
| `src/components/ShareCard.tsx` | New 1080×1920 layout (header/ball/answer/footer) | `05-share-card.md` |
| **new:** `src/components/Wordmark.tsx` | "magik 8" + amber "8" + text-shadow stack | `04-chrome.md` |
| **new:** `src/components/HUDStrip.tsx` | sesh / pack / status badge | `04-chrome.md` |

### Token migration (V1 → V2)

| V1 | V2 |
|---|---|
| `--magik-bg` | `--m8-bg` |
| `--magik-sphere` | `--m8-sphere-core` |
| `--magik-sphere-highlight` | `--m8-sphere-hi` |
| `--magik-stripe` | `--m8-stripe` |
| `--magik-eight` | `--m8-eight` |
| `--magik-fluid` | `--m8-fluid-mid` |
| `--magik-fluid-light` | `--m8-fluid-hi` |
| `--magik-answer-text` | `--m8-answer-ink` |
| `--magik-accent` | `--m8-amber` |
| `--magik-muted` | `--m8-chrome-dim` |
| `--font-ui` | `--m8-font-ui` |
| `--font-answer` | `--m8-font-answer` |
| *(new)* | `--m8-font-wordmark`, `--m8-font-numeral`, `--m8-font-hud`, all `--m8-sphere-*`, `--m8-fluid-{deep,meniscus}`, `--m8-chrome-{,dim,mute}`, `--m8-rule{,-hi}`, `--m8-cavity-{rim,dark}`, `--m8-stripe-shadow`, `--m8-answer-glow`, `--m8-bg-elev`, `--m8-amber-dim`, `--m8-danger` |

### Risks

- **Perf.** Five sphere gradient layers + grain. Profile on a mid-tier Android. Drop the secondary specular if you see GPU strain.
- **a11y.** Answer text on cobalt is 8.9:1 — well above AA. Don't drop the warm ivory in favor of pure white (loses warmth, gains zero contrast).
- **iOS safe area.** Header must respect `env(safe-area-inset-top)`. CTA row must respect `env(safe-area-inset-bottom)`.
- **Font loading.** VT323 + Oswald via Google Fonts adds ~30KB total. Use `display=swap` to avoid FOIT.

---

## 13. Anti-patterns checklist

| ✅ Do | ❌ Don't |
|---|---|
| oklch deep cobalt for the ink | Sky-blue, cyan, navy, neon |
| VT323 / Oswald / Tahoma stack | Inter, Roboto, Space Grotesk, system-only |
| One warm amber accent, sparingly | Purple gradients, candy pastels, rainbow chips |
| Film grain + radial vignette | Big gradient backdrops, glassmorphism |
| ASCII corner brackets on CTAs | Pill SaaS buttons with chevron arrows |
| Theme accents tint chip + share card only | Reskinning the ball per theme |
| Answer text condensed, uppercase, glow | Lowercase body sans, soft-wrap paragraphs |
| idle / shake / reveal — that is all | Inventing new phases (loading, thinking, etc.) |

---

## Handoff — Design Spec

**Status:** complete
**Outputs:**
- `index.html` — visual design system (single source of truth)
- `prototype.html` — interactive phone prototype with state toggles
- `docs/DESIGN-V2.md` — this file
- `prompts/01-tokens.md` … `prompts/06-motion.md` — implementation prompts
- `exports/*.png` — rendered images of every section and state
- `tokens.css`, `components.css`, `magik8-ball.jsx`, `magik8-chrome.jsx` — reference assets

**Next:** Hand `prompts/00-overview.md` and the relevant exports to your AI coding assistant. Apply in order: tokens → ball → triangle → chrome → share card → motion.

**Blockers:** none.
