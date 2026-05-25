---
id: handoff-visual-v6-studio-chrome
version: 1.0.0
status: active
current_phase: F3
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
## Handoff — F2
**Status:** complete
**Agent:** F2 implementer
**Branch / PR:** v6/f2-hole-surfaces → visual/v6-studio-chrome — squash-merged @ 1c5002e (coordinator)
**Changed:** src/three/Ball.tsx — sides (molten copper + emissive + warm ridge tint), lens (envMapIntensity 2.5), cavity (radial gradient + FBM shimmer via oracleSceneTime)
**Verified:** tsc ✓ · build ✓ · test ✓ (71) · e2e ✓ (5) · /code-review ✓ · flag-off regression ✓ · visual ✓
**Acceptance:** §4.3 gasket 0xc8631e + emissive 0xff7a1a @0.3, sine-stripe kept; §4.4 lens 2.5; §4.5 cavity gradient+shimmer; shell/Lighting/OracleScene untouched; tsc/build/test/e2e green; flag-off unchanged
**Integration:** Gasket 0xc8631e, emissive Color(0xff7a1a) @0.3, ridge mix(col*0.5, col*vec3(1.1,0.94,0.78), l); lens envMapIntensity 2.5; cavity rim ss(0.02,0.14, horizR), shimmer (fbm-0.5)*0.06 @ time*0.2
**Next:** F3 — QA, delete env jpg, supersede V5 docs, finalize handoff
**Blockers:** none
**Notes for next agent:**
- Cavity reuses CYWARR_FBM + oracleSceneTime; horizR = length(vPos.xz), tune ss(0.02,0.14) on device if needed
- One extra FBM eval per cavity fragment — watch low-end perf in F3 lighthouse
- public/env/cywarr-env.jpg still bundled until F3 delete (~748 KB precache shrink expected)
- Lens 2.5 balances F1 studio; do not raise toward 10
```

## Phase checklist

- [x] **F1** — Studio environment + chrome
- [x] **F2** — Hole surfaces: molten gasket + liquid floor
- [ ] **F3** — QA, cleanup, docs

## Active locks

- **F3 (next to spawn)** owns: `public/env/cywarr-env.jpg` (delete), `vite.config.ts` (only if env glob pinned),
  `scripts/lighthouse.mjs` (only if thresholds need adjustment), `docs/PLAN-VISUAL-V5-CYWARR-FIDELITY.md`,
  `docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md`, `docs/PLAN-VISUAL-V6-STUDIO-CHROME.md`,
  `docs/HANDOFF-VISUAL-V6-STUDIO-CHROME.md`.
- **Do NOT edit** any `src/three/*` render file (F1–F2 shipped).

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
| Tone mapping | `NeutralToneMapping` @ exposure 1.1 (F1 confirmed; AgX not A/B'd) |
| Branch policy | Integration branch `visual/v6-studio-chrome`; merge → `main` only at the end (human) |
| Deploy | Overseer-only |

## QA results

| Check | Pass | Notes |
|-------|------|-------|
| Shell reads bright violet chrome (amber+violet highlights), not coppery | ☑ | F1 — implementer visual ✓ |
| Lower hemisphere not pure black (floor fill works) | ☑ | F1 |
| Reflections sweep on drag-rotate | ☑ | F1 |
| Tone mapping chosen (Neutral vs AgX) | ☑ | F1 — Neutral @ 1.1 |
| Felt shake before reveal still works | ☑ | F1 — e2e |
| Reduced-motion: shake skipped, FSM progresses | ☑ | F1 — e2e |
| Flag-off = today's CSS behaviour | ☑ | F1 |
| Molten amber/copper gasket with wavy lines clearly visible | ☑ | F2 — implementer visual ✓ |
| Hole floor radial gradient + shimmer (text still crisp) | ☑ | F2 |
| AnswerPanel triangle/8/Courier text unchanged | ☑ | F1+F2 — e2e + code-review |
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
