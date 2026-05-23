---
id: handoff-visual-v5-cywarr-fidelity
version: 1.0.0
status: active
current_phase: F3
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
## Handoff — F2
**Status:** complete
**Agent:** F2 implementer
**Branch / PR:** fix/v5-f2-ball-env — merged to main as 094aa7e (squash; gh PR skipped — no `gh auth` on coordinator host)
**Changed:**
- src/three/Ball.tsx — cywarr verbatim materials; geometry 200×100 shell, 200×25 lens; removed pack-themed color helpers
- src/three/Lighting.tsx — ENV_MAP_PATH → /env/cywarr-env.jpg
- public/env/cywarr-env.jpg — bundled three.js outdoor equirect (~748 KB)
- public/env/studio.jpg — deleted
**Verified:** tsc ✓ · build ✓ · test ✓ (64) · e2e ✓ (5) · /code-review ✓ · flag-off regression ✓ · visual ✓
**Acceptance:**
- Bundled cywarr env; studio.jpg removed; ENV_MAP_PATH updated; sRGB + EquirectangularReflectionMapping unchanged
- Shell: indigo ×5 + FBM roughness; cavity 0x000088 BackSide; sides 0xaa0000 + sine-stripe; lens unchanged
- Geometry 200×100 shell, lens 0.9975 at 200×25 (no perf fallback documented)
- Flag-off: zero diff on MagikBall.tsx
- Flag-on: outdoor equirect replaces white studio → deep glossy purple/indigo (not chrome)
**Integration:** ENV_MAP_PATH='/env/cywarr-env.jpg'; cywarr-env.jpg 748648 bytes; shell 200×100 + lens 200×25; materials useMemo deps [envTex] only (no packId)
**Next:** F3 — answer panel Plane(0.8), cyan ink, orange Courier
**Blockers:** none
**Notes for next agent:**
- Ball colors are frozen cywarr literals — do not re-theme in F3
- AnswerPanel / answerAtlas still themed until F3
- Workbox precaches any /env/*.jpg — no vite change needed
- E2E: run with Playwright webServer (needs build+preview on 127.0.0.1:4173)
- Do not change OracleScene orbit/glow/preload beyond existing ENV_MAP_PATH import
```

## Phase checklist

- [x] **F1** — Background, transparency, camera, free rotation
- [x] **F2** — Faithful cywarr ball materials + env map
- [ ] **F3** — Answer window fidelity + readability
- [ ] **F4** — Real felt shake
- [ ] **F5** — QA, perf, verification, docs

## Active locks

**F3 owns (in flight):**
- `src/three/AnswerPanel.tsx` — Plane(0.8), cyan ink, orange text tint, INK_STEP 0.0125
- `src/three/answerAtlas.ts` — Courier New font
- `src/three/answerAtlas.test.ts` (and any AnswerPanel tests if added)

**F2 merged — frozen:** `Ball.tsx`, `Lighting.tsx`, `public/env/cywarr-env.jpg`.

_All other `src/three/*` rendering files are locked until their phase._

## Stack (pinned — confirm from package-lock at F2/F5)

| Package | Pinned | Notes |
|---------|--------|-------|
| `three` | 0.184.0 | `mergeGeometries`, `EquirectangularReflectionMapping` |
| `@react-three/fiber` | 9.6.1 | `<Canvas alpha>` |
| `@react-three/drei` | 10.7.7 | `AdaptiveDpr`, `OrbitControls` (ContactShadows removed in F1) |
| `gsap` | 3.15.0 | F4 shake + reveal tweens |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Target | cywarr ball **verbatim** (geometry, materials, env map, answer window); colors deferred |
| Env map | cywarr's exact `2294472375_24a3b8ef46_o.jpg`, bundled locally; replaces `studio.jpg` |
| Background | Transparent canvas + CSS dark radial glow; noise sphere removed |
| Shake | Real transform shake (translate + tilt) — **overrides V4 "no rotation" lock** (user-approved) |
| Rotation | Free + unconstrained orbit (no polar clamp), all phases + drag-vs-tap guard |
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
| Ball matches cywarr deep glossy purple (not chrome) | ✓ | F2 merged 094aa7e |
| Answer readable: cyan triangle + orange Courier | — | F3 |
| Real felt shake before reveal | — | F4 |
| Reduced-motion: shake skipped, FSM progresses | — | F4 |
| Flag-off = today's CSS behaviour | ✓ | F1–F2 — no MagikBall diff |
| Lighthouse flag-off ≥85 / flag-on ≥50 | — | F5 |

## Flag-on QA checklist (manual, before prod flip — overseer)

- [ ] `VITE_WEBGL=true npm run dev` on desktop — deep glossy purple ball on dark bg + glow (no white box)
- [ ] Drag rotates the ball freely in any direction; release leaves it where dragged
- [ ] Quick tap → visible shake → reveal; a drag does **not** trigger a shake
- [ ] Answer reads clearly: cyan triangle + orange Courier text
- [ ] One real phone (`pointer: coarse`) — DPR capped, rotation + shake smooth
- [ ] `prefers-reduced-motion: reduce` — no shake; FSM still reveals
- [ ] Side-by-side with `https://cywarr.github.io/Magic8Ball/` — ball matches

## V4 supersession

[`docs/PLAN-VISUAL-V4-CYWARR.md`](./PLAN-VISUAL-V4-CYWARR.md) and
[`docs/HANDOFF-VISUAL-V4-CYWARR.md`](./HANDOFF-VISUAL-V4-CYWARR.md) are superseded by this V5 track once F5
merges (`superseded_by: PLAN-VISUAL-V5-CYWARR-FIDELITY`).
