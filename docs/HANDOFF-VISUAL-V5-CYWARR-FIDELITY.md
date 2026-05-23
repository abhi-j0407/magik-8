---
id: handoff-visual-v5-cywarr-fidelity
version: 1.0.0
status: active
current_phase: F4
webgl_flag: off (testing flag-on; prod flip is overseer-only, post-F5)
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
## Handoff — F3
**Status:** complete
**Agent:** F3 implementer
**Branch / PR:** fix/v5-f3-answer — merged to main as squash commit on main (gh PR skipped — no `gh auth` on coordinator host)
**Changed:**
- src/three/AnswerPanel.tsx — Plane(0.8), INK_STEP 0.0125, cyan ink, orange text in fragment shader, pack theming removed
- src/three/answerAtlas.ts — Courier New bold 30px
- src/three/answerAtlas.test.ts, src/three/AnswerPanel.test.ts — updated/added tests
**Verified:** tsc ✓ · build ✓ · test ✓ (67) · e2e ✓ (5) · /code-review ✓ · flag-off ✓ · visual ✓
**Acceptance:**
- PlaneGeometry(0.8, 0.8), INK_STEP = 0.0125, LENS_TOP_Y = 0.75, 4 instanced planes
- Cyan additive ink (0, 0.5, 1); orange text vec3(1, 0.5, 0) in fragment shader
- Courier New bold 30px on 256² transparent atlas
- Easter-egg amber ink SDF mix preserved; pack theming removed from panel/atlas
- useOracleChoreography.ts untouched; FSM onAnimationDone() contract unchanged
**Integration:** Exports LENS_TOP_Y, ANSWER_PLANE_SIZE (0.8), INK_STEP (0.0125); answerPanelUniforms (baseVisibility, textVisibility, text, isEasterEgg, inkTextTint for F4 API only)
**Next:** F4 — real felt shake on jitterRef
**Blockers:** none
**Notes for next agent:**
- Text color is shader-fixed orange; F4 may stop writing inkTextTint in prepareRevealInk if desired
- Ball materials/env frozen (F2) — do not re-theme
- tri() uv scale * 6. works at 0.8 without tuning
- E2E: run via Playwright webServer (build + preview on 127.0.0.1:4173)
```

## Phase checklist

- [x] **F1** — Background, transparency, camera, free rotation
- [x] **F2** — Faithful cywarr ball materials + env map
- [x] **F3** — Answer window fidelity + readability
- [ ] **F4** — Real felt shake
- [ ] **F5** — QA, perf, verification, docs

## Active locks

**F4 owns (in flight):**
- `src/three/useOracleChoreography.ts` — perceptible transform shake on `jitterRef` group
- `src/three/oracleChoreography.test.ts` — shake + reduced-motion tests

**F1–F3 merged — frozen:** OracleScene shell, Ball/Lighting/env, AnswerPanel/answerAtlas.

_All other `src/three/*` rendering files are locked until F5._

## Stack (pinned — confirm from package-lock at F5)

| Package | Pinned | Notes |
|---------|--------|-------|
| `three` | 0.184.0 | `mergeGeometries`, `EquirectangularReflectionMapping` |
| `@react-three/fiber` | 9.6.1 | `<Canvas alpha>` |
| `@react-three/drei` | 10.7.7 | `AdaptiveDpr`, `OrbitControls` |
| `gsap` | 3.15.0 | F4 shake + reveal tweens |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Target | cywarr ball **verbatim** (geometry, materials, env map, answer window); colors deferred |
| Env map | cywarr's exact `2294472375_24a3b8ef46_o.jpg`, bundled locally |
| Background | Transparent canvas + CSS dark radial glow |
| Shake | Real transform shake (translate + tilt) — **overrides V4 "no rotation" lock** (user-approved) |
| Rotation | Free + unconstrained orbit + drag-vs-tap guard |
| Answer panel | `PlaneGeometry(0.8)`, cyan `(0,0.5,1)`, orange `(1,0.5,0)`, `bold 30px Courier New` |
| FSM contract | Unchanged; `onAnimationDone()` at end of 2nd opacity tween |
| WebGL gating | `VITE_WEBGL` unset in prod until overseer flips after QA |
| Deploy | Overseer-only |

## QA results

| Check | Pass | Notes |
|-------|------|-------|
| No white box — ball on dark page + glow | ✓ | F1 |
| Free unconstrained rotation (touch + mouse) | ✓ | F1 |
| Drag-vs-tap guard (drag ≠ shake) | ✓ | F1 |
| Ball matches cywarr deep glossy purple (not chrome) | ✓ | F2 |
| Answer readable: cyan triangle + orange Courier | ✓ | F3 |
| Real felt shake before reveal | — | F4 |
| Reduced-motion: shake skipped, FSM progresses | — | F4 |
| Flag-off = today's CSS behaviour | ✓ | F1–F3 |
| Lighthouse flag-off ≥85 / flag-on ≥50 | — | F5 |

## Flag-on QA checklist (manual, before prod flip — overseer)

- [ ] `VITE_WEBGL=true npm run dev` on desktop — deep glossy purple ball on dark bg + glow
- [ ] Drag rotates freely; tap shakes, drag does not
- [ ] Answer: cyan triangle + orange Courier
- [ ] One real phone — DPR capped, rotation + shake smooth
- [ ] `prefers-reduced-motion: reduce` — no shake; FSM still reveals
- [ ] Side-by-side with `https://cywarr.github.io/Magic8Ball/`

## V4 supersession

V4 docs superseded once F5 merges (`superseded_by: PLAN-VISUAL-V5-CYWARR-FIDELITY`).
