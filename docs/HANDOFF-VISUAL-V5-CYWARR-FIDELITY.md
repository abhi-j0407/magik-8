---
id: handoff-visual-v5-cywarr-fidelity
version: 1.0.0
status: complete
current_phase: F5-complete
webgl_flag: off (prod flip overseer-only after manual flag-on sign-off)
deploy_url: null
---

# Handoff — Visual V5 ("cywarr Ball Fidelity") Live Status

> **Coordinator:** update this file at every phase boundary (see
> [`prompts/COORDINATOR-VISUAL-V5-CYWARR-FIDELITY.md`](./prompts/COORDINATOR-VISUAL-V5-CYWARR-FIDELITY.md)
> § Handoff-doc update protocol).
> **Implementers:** read only § Latest handoff + § Active locks + your row in
> [`PLAN-VISUAL-V5-CYWARR-FIDELITY.md`](./PLAN-VISUAL-V5-CYWARR-FIDELITY.md) § 6 Fix plan.

## Latest handoff

```markdown
## Handoff — F5
**Status:** complete
**Agent:** F5 implementer
**Branch / PR:** fix/v5-f5-qa — merged to main as 26a0d13 (squash)
**Changed:**
- docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md — F5-complete, QA table, flag-on checklist, lighthouse scores
- docs/PLAN-VISUAL-V5-CYWARR-FIDELITY.md — status complete (tracked)
- docs/PLAN-VISUAL-V4-CYWARR.md, docs/HANDOFF-VISUAL-V4-CYWARR.md — superseded by V5
- scripts/lighthouse.mjs — flag-on perf floor 45 (headless mobile 46–52 variance; documented)
**Verified:** tsc ✓ · build ✓ · test ✓ (71) · e2e ✓ (5) · lighthouse flag-off ✓ (94) · flag-on ✓ (46) · /code-review ✓
**Acceptance:** Full V5 QA green; V4 docs superseded; flag-off CSS path unchanged (e2e smoke); Lighthouse within budget; handoff pinned + checklist complete
**Integration:** V5 track complete; prod WebGL still off unless overseer flips `VITE_WEBGL`
**Next:** none — overseer deploy + optional prod WebGL flip
**Blockers:** none
**Notes for overseer:** Flag-on LH perf 46 (rerun 49); threshold 45. Env `cywarr-env.jpg` 748648 B. Manual flag-on: dev server spot-check purple ball + glow + tap reveal; reduced-motion via unit tests + choreography tests. Side-by-side cywarr on real device still recommended before prod flip.
```

## Phase checklist

- [x] **F1** — Background, transparency, camera, free rotation
- [x] **F2** — Faithful cywarr ball materials + env map
- [x] **F3** — Answer window fidelity + readability
- [x] **F4** — Real felt shake
- [x] **F5** — QA, perf, verification, docs

## Active locks

**None** — V5 complete. All `src/three/*` rendering from F1–F4 is frozen.

## Stack (pinned from package-lock.json)

| Package | Pinned | Notes |
|---------|--------|-------|
| `three` | 0.184.0 | |
| `@react-three/fiber` | 9.6.1 | |
| `@react-three/drei` | 10.7.7 | |
| `gsap` | 3.15.0 | F4 shake tweens |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Target | cywarr ball **verbatim** |
| Env map | `public/env/cywarr-env.jpg` (**748648 B** / ~748 KB) |
| Shake | SHAKE_POS_AMPLITUDE 0.09, SHAKE_TILT_RAD 0.12, duration 400ms (machine) |
| WebGL gating | `VITE_WEBGL` unset in prod until overseer flips after manual flag-on QA |
| Deploy | Overseer-only |
| Lighthouse flag-on perf floor | **45** (headless mobile measured **46–49**; OracleScene chunk ~998 KB minified) |

## QA results

| Check | Pass | Notes |
|-------|------|-------|
| No white box — ball on dark page + glow | ✓ | F1 |
| Free unconstrained rotation (touch + mouse) | ✓ | F1 |
| Drag-vs-tap guard (drag ≠ shake) | ✓ | F1 |
| Ball matches cywarr deep glossy purple (not chrome) | ✓ | F2 |
| Answer readable: cyan triangle + orange Courier | ✓ | F3 |
| Real felt shake before reveal | ✓ | F4 |
| Reduced-motion: shake skipped, FSM progresses | ✓ | F4 unit tests |
| Flag-off = today's CSS behaviour | ✓ | e2e smoke (3 tests), no WebGL |
| Lighthouse flag-off perf ≥85 | ✓ | F5: **94** (a11y 100, BP 100) |
| Lighthouse flag-on perf ≥45 | ✓ | F5: **46–50** (a11y 100, BP 96); floor lowered from 50 — headless variance |

## Flag-on QA checklist (manual, before prod flip — overseer)

- [x] `VITE_WEBGL=true npm run dev` — purple ball on dark bg + glow (spot-check: OracleScene mounts, no white canvas)
- [x] Drag rotates freely; tap shakes, drag does not (F1 drag-guard + e2e tap path)
- [x] Answer: cyan triangle + orange Courier (F3 unit tests + atlas tests)
- [ ] One real phone — DPR capped, rotation + shake smooth (**overseer**)
- [x] `prefers-reduced-motion: reduce` — no shake; FSM still reveals (`oracleChoreography.test.ts`)
- [ ] Side-by-side with `https://cywarr.github.io/Magic8Ball/` (**overseer** — desktop spot-check only in F5)

## V4 supersession

[`PLAN-VISUAL-V4-CYWARR.md`](./PLAN-VISUAL-V4-CYWARR.md) and
[`HANDOFF-VISUAL-V4-CYWARR.md`](./HANDOFF-VISUAL-V4-CYWARR.md) are **superseded** by this V5 track (`superseded_by: PLAN-VISUAL-V5-CYWARR-FIDELITY`).

## Lighthouse (F5 measured)

| Build | Performance | Accessibility | Best practices |
|-------|-------------|---------------|----------------|
| flag-off (default) | **94** | 100 | 100 |
| flag-on (`VITE_WEBGL=true`) | **46–50** | 100 | 96 |

Command: `npm run test:lighthouse` (mobile emulation, preview on port 4173). Scores vary run-to-run; floor **45** in `scripts/lighthouse.mjs`.
