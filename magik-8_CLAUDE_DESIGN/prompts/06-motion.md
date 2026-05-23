# 06 — Motion polish

## Files touched
- `src/components/MagikBall.tsx` (easing already updated in step 02)
- `src/components/AnswerTriangle.tsx` (easing already updated in step 03)
- `src/components/PermissionSheet.tsx` (rise animation in step 04)
- `src/index.css` (tokens already added in step 01)

## What this step is for

Most motion is already locked in by steps 02-04. This step is **verification + reduced-motion QA**.

## Easing reference

| Use | Curve | Why |
|---|---|---|
| Sheet rise / soft entries | `cubic-bezier(.22, 1, .36, 1)` (`--m8-ease-toy`) | Gentle overshoot — feels mechanical, like a plastic part settling. |
| Ink rise | `cubic-bezier(.16, .8, .3, 1)` (`--m8-ease-ink`) | Front-loaded — ink "wants" to surface fast, then slows as it nears the meniscus. |
| Idle float | `easeInOut` | Symmetric breathing. |
| Shake wobble | `easeInOut` | Symmetric — wobble decays to 0. |

## Reduced-motion checklist

Open `chrome://flags` (or your OS settings) and enable *prefers-reduced-motion*. Then walk the ritual:

- [ ] Ball does NOT float in idle (no translateY animation)
- [ ] Shake produces a single opacity pulse (1 → 0.85 → 1), not rotation
- [ ] Ink rise is **instant** (no rise animation), but answer still appears
- [ ] Answer text appears with no delay (no fade-in)
- [ ] Permission sheet appears instantly (no rise, just fade in or hard-show)
- [ ] Scrim still uses the same `bg-black/60 backdrop-blur` — no animation needed

The `@media (prefers-reduced-motion: reduce)` block in `src/index.css` sets:

```css
--m8-dur-idle:   0ms;
--m8-dur-shake:  0ms;
--m8-dur-reveal: 0ms;
```

…which any inline CSS transitions referencing these tokens will pick up. The motion/react animations are handled inline via the `useReducedMotion()` branches you preserved in steps 02–03.

## Verification

Open DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Walk the ritual. Compare with the standard mode.

```bash
# Motion smoothness sanity check
npm run dev -- --host
# On a real phone, perform multiple shakes back-to-back.
# The motion should NEVER feel janky. If it does, drop the secondary
# specular div from the sphere stack — it's the most expensive layer.
```

## Performance budget

Lighthouse mobile performance target ≥ 90 (from `docs/PRODUCT.md`).

Things that can blow this budget:
- More than 5 gradient layers on the sphere (we have exactly 5)
- Backdrop-blur stacking (we use it only on the scrim and the (optional) navbar — fine)
- Grain SVG at >200×200 (we use 160×160, tiled — fine)

If you see paint cost on mid-tier Android, the safe knob is the diffuse upper-left highlight — drop `filter: blur(6px)` to `blur(4px)` or remove the `mix-blend-mode: screen`.
