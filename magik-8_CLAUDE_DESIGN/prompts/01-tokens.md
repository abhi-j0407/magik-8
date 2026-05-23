# 01 — Design tokens, fonts, grain & vignette utilities

## Files touched
- `index.html`
- `src/index.css`
- *(project-wide rename)* `src/**/*.tsx`

## Instructions

### A. `index.html` — fonts

Replace any existing Bebas Neue / DM Sans `<link>` tags with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&family=Oswald:wght@500;600;700&display=swap" />
```

### B. `src/index.css` — full body replacement

Keep `@import 'tailwindcss';` at the top. Replace the entire `:root { ... }` block and the body styles with this:

```css
@import 'tailwindcss';

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

  /* type families */
  --m8-font-wordmark:   "VT323", "Courier New", ui-monospace, monospace;
  --m8-font-answer:     "Oswald", "Bebas Neue", "Archivo Narrow", "Arial Narrow", sans-serif;
  --m8-font-numeral:    "Helvetica Neue", "Helvetica", "Arial Black", sans-serif;
  --m8-font-ui:         "Tahoma", "Verdana", "Geneva", system-ui, sans-serif;
  --m8-font-hud:        "VT323", "Courier New", ui-monospace, monospace;

  /* motion */
  --m8-dur-idle:        4000ms;
  --m8-dur-shake:       400ms;
  --m8-dur-reveal:      600ms;
  --m8-dur-text-fade:   200ms;
  --m8-ease-toy:        cubic-bezier(.22, 1, .36, 1);
  --m8-ease-ink:        cubic-bezier(.16, .8, .3, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --m8-dur-idle:   0ms;
    --m8-dur-shake:  0ms;
    --m8-dur-reveal: 0ms;
  }
}

body {
  margin: 0;
  min-height: 100dvh;
  background-color: var(--m8-bg);
  color: var(--m8-chrome);
  font-family: var(--m8-font-ui);
  -webkit-font-smoothing: antialiased;
}

#root { min-height: 100dvh; }

/* film grain — apply via class .m8-grain on any positioned ancestor */
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

/* radial vignette */
.m8-vignette::after {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 30%,
    oklch(8% 0.005 270 / 0.45) 75%,
    oklch(4% 0.005 270 / 0.75) 100%);
  z-index: 40;
}
```

### C. Project-wide rename

Run a careful find-and-replace across `src/**/*.tsx` and `src/**/*.ts`:

```
--magik-bg               → --m8-bg
--magik-sphere           → --m8-sphere-core
--magik-sphere-highlight → --m8-sphere-hi
--magik-stripe           → --m8-stripe
--magik-eight            → --m8-eight
--magik-fluid            → --m8-fluid-mid
--magik-fluid-light      → --m8-fluid-hi
--magik-answer-text      → --m8-answer-ink
--magik-accent           → --m8-amber
--magik-muted            → --m8-chrome-dim
--font-ui                → --m8-font-ui
--font-answer            → --m8-font-answer
```

⚠️ Order matters: rename the longer prefixes first (`--magik-sphere-highlight` BEFORE `--magik-sphere`), otherwise the shorter rename will corrupt the longer ones.

### D. Verification

After applying:

```bash
npm run dev
# Open the app — it should look approximately like the V1 version but with:
# - slightly cooler stage background (subtle, intentional)
# - cobalt ink looks deeper / more saturated than before
# - existing Bebas type still renders (we'll swap it in step 02)

npm test   # nothing should regress
```

You should see compiler errors if any class string still references the old `--magik-*` names — fix them.
