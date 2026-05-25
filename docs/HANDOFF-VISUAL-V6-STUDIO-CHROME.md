---
id: handoff-visual-v6-studio-chrome
version: 1.0.0
status: active
current_phase: F1
integration_branch: visual/v6-studio-chrome
webgl_flag: off (prod flip overseer-only; V6 work tested flag-on)
deploy_url: null
---

# Handoff — Visual V6 ("Studio Chrome") Live Status

> **Coordinator:** update this file at every phase boundary (see
> [`prompts/COORDINATOR-VISUAL-V6-STUDIO-CHROME.md`](./prompts/COORDINATOR-VISUAL-V6-STUDIO-CHROME.md)
> § Handoff-doc update protocol).
> **Implementers:** read only § Latest handoff + § Active locks + your row in
> [`PLAN-VISUAL-V6-STUDIO-CHROME.md`](./PLAN-VISUAL-V6-STUDIO-CHROME.md) § 6 Fix plan.

## Latest handoff

```markdown
## Handoff — F0 (kickoff)
**Status:** ready
**Agent:** coordinator
**Branch / PR:** integration branch visual/v6-studio-chrome created off main; no phase merged yet
**Changed:** docs only (PLAN + HANDOFF + COORDINATOR for V6)
**Verified:** n/a (no code yet)
**Acceptance:** n/a
**Integration:** V6 docs in place; F1 may begin. All phase PRs target visual/v6-studio-chrome, NOT main.
**Next:** F1 — studio environment + chrome (procedural Lightformer env, Neutral tone map, pale-violet shell)
**Blockers:** none
**Notes for next agent:** Root cause = metalness:1 shell mirrors a dark brown HDRI. F1 replaces the env
with drei <Environment>+<Lightformer> and drops per-material envMap so materials use scene.environment.
Do NOT delete public/env/cywarr-env.jpg until F3. Keep the FBM shell shader + AnswerPanel untouched.
```

## Phase checklist

- [ ] **F1** — Studio environment + chrome
- [ ] **F2** — Hole surfaces: molten gasket + liquid floor
- [ ] **F3** — QA, cleanup, docs

## Active locks

- **F1 (next to spawn)** owns: `src/three/Lighting.tsx`, `src/three/OracleScene.tsx`, `src/three/Ball.tsx`.

> Record file ownership here before spawning each phase; clear on merge. `Ball.tsx` is locked by F1, then
> re-locked by F2 — never both at once.

## Stack (pinned from package-lock.json)

| Package | Pinned | Notes |
|---------|--------|-------|
| `three` | 0.184.0 | ships `NeutralToneMapping` + `AgXToneMapping` |
| `@react-three/fiber` | 9.6.1 | |
| `@react-three/drei` | 10.7.7 | `<Environment>` + `<Lightformer>` (F1) |
| `gsap` | 3.15.0 | shake tweens (untouched) |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Look & mood | Dark mystic studio (designed reflections, keep black backdrop) |
| Reflection palette | Amber/gold + violet |
| Gasket rim | Molten amber/copper (recolor; keep wavy-stripe shader) |
| Hole floor | Subtle liquid depth (radial gradient + shimmer) |
| Env technique | Procedural drei `<Environment>` + `<Lightformer>` (no photo HDRI) |
| Tone mapping | `NeutralToneMapping` @ exposure 1.1 (A/B fallback `AgXToneMapping`) — confirm in F1 |
| Branch policy | Integration branch `visual/v6-studio-chrome`; merge → `main` only at the end (human) |
| Deploy | Overseer-only |

## QA results

| Check | Pass | Notes |
|-------|------|-------|
| Shell reads bright violet chrome (amber+violet highlights), not coppery | ☐ | F1 |
| Lower hemisphere not pure black (floor fill works) | ☐ | F1 |
| Reflections sweep on drag-rotate | ☐ | F1 |
| Tone mapping chosen (Neutral vs AgX) | ☐ | F1 — log in Decisions |
| Molten amber/copper gasket with wavy lines clearly visible | ☐ | F2 |
| Hole floor radial gradient + shimmer (text still crisp) | ☐ | F2 |
| AnswerPanel triangle/8/Courier text unchanged | ☐ | F1+F2 |
| Felt shake before reveal still works | ☐ | F1 (regression) |
| Reduced-motion: shake skipped, FSM progresses | ☐ | F1 (regression) |
| Flag-off = today's CSS behaviour | ☐ | each phase |
| `public/env/cywarr-env.jpg` deleted, no dangling refs | ☐ | F3 |
| Lighthouse flag-off ≥85 / flag-on ≥45 | ☐ | F3 |
| V5 docs superseded; V6 handoff finalized | ☐ | F3 |

## Flag-on QA checklist (manual, before merge → main — human)

- [ ] `VITE_WEBGL=true VITE_WEBGL_E2E=true npm run build && npm run preview` — bright violet chrome on dark bg
- [ ] Drag rotates freely; reflections sweep; tap shakes; drag ≠ shake
- [ ] Molten amber/copper gasket + liquid-depth floor read clearly
- [ ] Answer: cyan triangle + orange Courier, readable
- [ ] One real phone — DPR capped, rotation + shake smooth
- [ ] `prefers-reduced-motion: reduce` — no shake; FSM still reveals

## V5 supersession

[`PLAN-VISUAL-V5-CYWARR-FIDELITY.md`](./PLAN-VISUAL-V5-CYWARR-FIDELITY.md) and
[`HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md`](./HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md) are superseded by this V6
track at **F3** (set `superseded_by: PLAN-VISUAL-V6-STUDIO-CHROME` then).
