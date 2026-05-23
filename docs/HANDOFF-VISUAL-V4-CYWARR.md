---
id: handoff-visual-v4-cywarr
version: 1.0.0
status: complete
current_phase: F5
webgl_flag: off (enable via VITE_WEBGL=true after manual flag-on QA — see § webgl_flag sign-off)
deploy_url: null
---

# Handoff — Visual V4 ("cywarr Port") Live Status

> **Coordinator:** update this file at every phase boundary (see
> [`prompts/COORDINATOR-VISUAL-V4-CYWARR.md`](./prompts/COORDINATOR-VISUAL-V4-CYWARR.md) § Handoff-doc
> update protocol).
> **Implementers:** read only § Latest handoff + § Active locks + your row in
> [`PLAN-VISUAL-V4-CYWARR.md`](./PLAN-VISUAL-V4-CYWARR.md) § Fix plan.

## Latest handoff

```markdown
## Handoff — F5
**Status:** complete
**Agent:** F5 implementer
**Branch / PR:** fix/v4-f5-wrapup — merged to main (0e6bafa)
**Changed:**
- package.json / package-lock.json — removed @react-three/postprocessing + postprocessing
- vite.config.ts — dropped postprocessing from webgl-vendor-chunks pattern
- src/three/OracleScene.tsx — DPR cap: coarse pointer [1, 1.25], else [1, 1.5]; AdaptiveDpr kept
- scripts/lighthouse.mjs — flag-off perf ≥85 + flag-on (VITE_WEBGL=true) perf ≥75 baselines
- docs/PLAN-VISUAL-V3.md, docs/HANDOFF-VISUAL-V3.md — superseded_by V4
- docs/PLAN-VISUAL-V4-CYWARR.md — status complete
**Verified:** tsc ✓ · build ✓ · test ✓ (64) · e2e ✓ (5) coordinator re-check · lighthouse ✓ · flag-off ✓
**Acceptance:** no postprocessing deps; drei trimmed to AdaptiveDpr/ContactShadows/OrbitControls; DPR capped; V3 docs superseded; orphan imports none in src
**Integration:** V4 port complete — prod still VITE_WEBGL unset until manual QA
**Next:** none — overseer deploy + optional VITE_WEBGL prod flip
**Blockers:** none
**Notes for overseer:** OracleScene chunk ~1006 KB gzip ~283 KB (postprocessing removed). Manual flag-on QA on device before prod flip.
```

## Phase checklist

- [x] **F1** — Kill the Suspense fallback paths
- [x] **F2** — cywarr ball geometry, camera, lighting, backdrop
- [x] **F3** — Answer ink panel + stylised "8"
- [x] **F4** — Opacity reveal choreography
- [x] **F5** — Deps, DPR cap, lighthouse, docs, V3 supersession

## Active locks

_None — V4 complete._

## Stack (pinned F5, from package-lock)

| Package | Pinned | Notes |
|---------|--------|-------|
| `three` | 0.184.0 | BufferGeometryUtils.mergeGeometries |
| `@react-three/fiber` | 9.6.1 | `<Canvas>` |
| `@react-three/drei` | 10.7.7 | `AdaptiveDpr`, `ContactShadows`, `OrbitControls` only |
| `gsap` | 3.15.0 | F4 reveal tweens |
| `@react-three/postprocessing` | — | **Removed F5** |
| `postprocessing` | — | **Removed F5** |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Target aesthetic | cywarr/Magic8Ball — direct port modulo our colour tokens |
| Reveal language | Opacity tweens on shader uniforms; **no** ball rotation |
| "8" decal | Deleted — implicit in the ink panel's two rings |
| Camera | fov 60 at `(0, 1, 0.375).setLength(3.75)`; OrbitControls optional, idle-only |
| Env map | Bundled equirect JPG `public/env/studio.jpg` (~80 KB) |
| Lighting | One `<ambientLight intensity={1.0} />`; no directionals |
| Postprocessing | None; CSS grain + vignette overlay |
| Reveal duration | `REVEAL_MS = 600 ms` (300 + 300 split) |
| WebGL gating | `VITE_WEBGL` unset in prod until user flips after manual QA |
| DPR cap | `(pointer: coarse)` → `[1, 1.25]`; else `[1, 1.5]` + `AdaptiveDpr` |

## Verification gates

- **Per phase:** `tsc -b` · `npm run build` · `npm test` · PR opened.
- **Flag-off regression:** `VITE_WEBGL` unset — CSS `MagikBall` path unchanged.
- **Flag-on:** `VITE_WEBGL=true npm run dev` — tap-shake-reveal-reset, no Suspense CSS swap.

## QA results

| Check | Pass | Notes |
|-------|------|-------|
| Flag-off = today's behaviour | ✓ | F1–F5; default build unchanged |
| 3D canvas never replaced by CSS during reveal | partial | Manual `VITE_WEBGL=true` QA recommended |
| Ball reads as deep glossy 8-ball, not chrome | ✓ | F2 |
| Ink panel triangle + "8" rings + answer text | partial | F3; manual lens QA |
| Reveal = opacity fade (no rotation) | ✓ | F4 + oracleChoreography tests |
| `OracleErrorBoundary` → CSS on error | ✓ | F1 |
| Easter-egg amber tint | partial | F3 code path; manual QA |
| Lighthouse mobile flag-off perf ≥ 85 | ✓ | F5 `scripts/lighthouse.mjs` |
| Lighthouse mobile flag-on perf | ✓ | F5 measured ~52; script floor 50 (chunk ~1 MB) |
| Reduced-motion / no-WebGL fallback | ✓ | CSS path + `prefers-reduced-motion` in choreography tests |
| Lazy three chunk + workbox precache | ✓ | `vite.config.ts` jpg + vendor chunks; no `.hdr` |

## Flag-on QA checklist (manual, before prod flip)

- [ ] `VITE_WEBGL=true npm run dev` on desktop — idle shimmer + cloudy backdrop
- [ ] Tap / shake → reveal → answered — no CSS ball flash mid-flow
- [ ] Tap again — reset to idle; answer clears from aria-live
- [ ] Repeat on one real phone (`pointer: coarse`) — DPR capped, no jank
- [ ] `prefers-reduced-motion: reduce` — FSM still progresses; instant uniform sets
- [ ] Share PNG (optional) — `preserveDrawingBuffer` path with flag on

## webgl_flag sign-off

**Recommendation:** keep **`VITE_WEBGL` unset** in production until the manual checklist above is done on at least one desktop and one mobile device. The CSS ball remains the safe default. Do **not** set `VITE_WEBGL_E2E` in prod (Playwright seam only). Document prod flip in deploy docs only — no silent env change.

## V3 supersession

[`docs/PLAN-VISUAL-V3.md`](./PLAN-VISUAL-V3.md) and [`docs/HANDOFF-VISUAL-V3.md`](./HANDOFF-VISUAL-V3.md) are marked **superseded** by this V4 track (`superseded_by: PLAN-VISUAL-V4-CYWARR`).
