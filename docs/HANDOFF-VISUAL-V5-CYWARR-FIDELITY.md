---
id: handoff-visual-v5-cywarr-fidelity
version: 1.0.0
status: active
current_phase: F5
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
## Handoff — F4
**Status:** complete
**Agent:** F4 implementer
**Branch / PR:** fix/v5-f4-shake — merged to main as 8f55402 (squash; gh PR skipped — no `gh auth` on coordinator host)
**Changed:**
- src/three/useOracleChoreography.ts — multi-axis transform shake + settle; reduced-motion skips transform
- src/three/oracleChoreography.test.ts — shake amplitude + reduced-motion tests
**Verified:** tsc ✓ · build ✓ · test ✓ (71) · e2e ✓ (5) · /code-review ✓ · flag-off ✓ · visual ✓
**Acceptance:**
- Multi-axis translate (±0.09) + tilt (x/z ±0.12 rad) on jitterRef during shaking, yoyo cycles, settle to zero before reveal
- oracleSceneTimeScale ramp 1→3 unchanged; SHAKE_DURATION_MS stays 400
- Reveal contract unchanged (REVEAL_MS 600, two opacity tweens, onAnimationDone() at timeline end)
- Reduced motion: no transform shake; instant timeScale=3; FSM still reaches answered
**Integration:** Exported SHAKE_POS_AMPLITUDE (0.09), SHAKE_TILT_RAD (0.12), SHAKE_DURATION_MS (400); runTransformShake timeline ~0.34s oscillation + 0.06s settle; reduced-motion skips position/rotation tweens only
**Next:** F5 — QA, lighthouse, supersede V4 docs, finalize handoff
**Blockers:** none
**Notes for next agent:**
- inkTextTint only written for easter-egg amber now
- Do not edit useOracleMachine.ts — shaking duration frozen at 400ms
- F5 owns docs/Lighthouse/e2e snapshots; no further src/three/* rendering edits per plan
- Manual: side-by-side cywarr shake feel, prefers-reduced-motion in browser
```

## Phase checklist

- [x] **F1** — Background, transparency, camera, free rotation
- [x] **F2** — Faithful cywarr ball materials + env map
- [x] **F3** — Answer window fidelity + readability
- [x] **F4** — Real felt shake
- [ ] **F5** — QA, perf, verification, docs

## Active locks

**F5 owns (in flight):**
- `package.json` / `vite.config.ts` (only if needed for QA)
- `e2e/webgl.spec.ts`, `e2e/__snapshots__/*` (if snapshots added)
- `docs/PLAN-VISUAL-V4-CYWARR.md`, `docs/HANDOFF-VISUAL-V4-CYWARR.md` (mark superseded)
- `docs/PLAN-VISUAL-V5-CYWARR-FIDELITY.md`, `docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md` (finalize)
- `scripts/lighthouse.mjs` (thresholds only if measured scores require it)

**F1–F4 merged — frozen:** all `src/three/*` rendering files. **Do not edit** Ball, AnswerPanel, OracleScene, choreography, etc.

## Stack (pinned — confirm from package-lock at F5)

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
| Env map | `public/env/cywarr-env.jpg` (~748 KB) |
| Shake | SHAKE_POS_AMPLITUDE 0.09, SHAKE_TILT_RAD 0.12, duration 400ms (machine) |
| WebGL gating | `VITE_WEBGL` unset in prod until overseer flips after F5 QA |
| Deploy | Overseer-only |

## QA results

| Check | Pass | Notes |
|-------|------|-------|
| No white box — ball on dark page + glow | ✓ | F1 |
| Free unconstrained rotation (touch + mouse) | ✓ | F1 |
| Drag-vs-tap guard (drag ≠ shake) | ✓ | F1 |
| Ball matches cywarr deep glossy purple (not chrome) | ✓ | F2 |
| Answer readable: cyan triangle + orange Courier | ✓ | F3 |
| Real felt shake before reveal | ✓ | F4 merged 8f55402 |
| Reduced-motion: shake skipped, FSM progresses | ✓ | F4 |
| Flag-off = today's CSS behaviour | ✓ | F1–F4 |
| Lighthouse flag-off ≥85 / flag-on ≥50 | — | F5 |

## Flag-on QA checklist (manual, before prod flip — overseer)

- [ ] `VITE_WEBGL=true npm run dev` — purple ball on dark bg + glow
- [ ] Drag rotates freely; tap shakes, drag does not
- [ ] Answer: cyan triangle + orange Courier
- [ ] One real phone — DPR capped, rotation + shake smooth
- [ ] `prefers-reduced-motion: reduce` — no shake; FSM still reveals
- [ ] Side-by-side with `https://cywarr.github.io/Magic8Ball/`

## V4 supersession

Pending F5: mark [`PLAN-VISUAL-V4-CYWARR.md`](./PLAN-VISUAL-V4-CYWARR.md) and
[`HANDOFF-VISUAL-V4-CYWARR.md`](./HANDOFF-VISUAL-V4-CYWARR.md) **superseded** by V5.
