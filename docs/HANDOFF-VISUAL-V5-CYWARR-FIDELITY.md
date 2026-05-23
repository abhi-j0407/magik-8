---
id: handoff-visual-v5-cywarr-fidelity
version: 1.0.0
status: active
current_phase: F2
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
## Handoff — F1
**Status:** complete
**Agent:** F1 implementer
**Branch / PR:** fix/v5-f1-bg-orbit — merged to main as 1d475e1 (squash; gh PR skipped — no `gh auth` on coordinator host)
**Changed:**
- src/three/OracleScene.tsx — transparent canvas, free orbit all phases, 8px drag-vs-tap guard, drop Background/ContactShadows/invalid background color
- src/three/Background.tsx — deleted (clipped noise sphere)
- src/index.css — .m8-oracle-glow CSS radial separation behind ball
**Verified:** tsc ✓ · build ✓ · test ✓ (64) · e2e ✓ (5) · /code-review ✓ · flag-off regression ✓ (no MagikBall.tsx diff) · visual ✓ (logic/build; manual flag-on QA: VITE_WEBGL=true npm run dev)
**Acceptance:**
- No white box — invalid THREE.Color('transparent') removed; gl.alpha: true only
- Noise backdrop removed; CSS dark radial glow added
- ContactShadows removed
- Free unconstrained orbit in all phases (enablePan={false}, enableZoom={false}, minPolarAngle=0, maxPolarAngle=π)
- Drag >8px Euclidean does not call shakeOrTap() / reset(); tap still does
- Keyboard Enter/Space on button still fires click path (no pointerdown → no suppress)
- Camera unchanged (fov 60, near 0.05, far 50, pos (0,1,0.375).setLength(3.75))
- Flag-off CSS ball byte-for-byte unchanged
**Integration:** Transparent WebGL canvas confirmed; Background.tsx gone; orbit always enabled via SceneControls; glow class .m8-oracle-glow on stage wrapper; drag threshold constant ORBIT_DRAG_THRESHOLD_PX = 8 (Euclidean via Math.hypot).
**Next:** F2 — bundle cywarr env map + verbatim ball materials (indigo×5 shell, 0x000088 cavity, 0xaa0000 sides)
**Blockers:** none
**Notes for next agent:**
- Glow: .m8-oracle-glow on the OracleScene outer relative container (opacity: 0.75; tune if needed)
- Orbit: `<OrbitControls enabled enableDamping enablePan={false} enableZoom={false} minPolarAngle={0} maxPolarAngle={Math.PI} />` in SceneControls — no phase gate
- Drag guard: ORBIT_DRAG_THRESHOLD_PX = 8, Euclidean on pointerup; suppressClickRef blocks following click
- Do not reintroduce Background or scene `<color attach="background" />`
- E2E: 5/5 pass; Playwright webServer in CI should build+preview — locally may need preview on 4173 if webServer does not start in your agent shell
```

## Phase checklist

- [x] **F1** — Background, transparency, camera, free rotation
- [ ] **F2** — Faithful cywarr ball materials + env map
- [ ] **F3** — Answer window fidelity + readability
- [ ] **F4** — Real felt shake
- [ ] **F5** — QA, perf, verification, docs

## Active locks

**F2 owns (in flight):**
- `src/three/Ball.tsx` — cywarr materials, geometry segment counts, drop themed color helpers
- `src/three/Lighting.tsx` — `ENV_MAP_PATH` → bundled cywarr equirect
- `public/env/cywarr-env.jpg` — add (download from threejs.org examples URL)
- `public/env/studio.jpg` — delete
- `vite.config.ts` — only if it pins the env filename (workbox glob is `/env/.*\.jpg` — likely no change)

**F1 merged — do not revert:** `OracleScene.tsx` scene shell, `.m8-oracle-glow`, no Background/ContactShadows.

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
| No white box — ball on dark page + glow | ✓ | F1 merged 1d475e1 |
| Free unconstrained rotation (touch + mouse) | ✓ | F1 |
| Drag-vs-tap guard (drag ≠ shake) | ✓ | F1 |
| Ball matches cywarr deep glossy purple (not chrome) | — | F2 |
| Answer readable: cyan triangle + orange Courier | — | F3 |
| Real felt shake before reveal | — | F4 |
| Reduced-motion: shake skipped, FSM progresses | — | F4 |
| Flag-off = today's CSS behaviour | ✓ | F1 — no MagikBall diff |
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
