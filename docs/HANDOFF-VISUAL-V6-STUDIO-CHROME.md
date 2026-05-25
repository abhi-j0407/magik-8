---
id: handoff-visual-v6-studio-chrome
version: 1.0.0
status: active
current_phase: F2
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
## Handoff — F1
**Status:** complete
**Agent:** F1 implementer
**Branch / PR:** v6/f1-studio-env → visual/v6-studio-chrome — squash-merged @ 305ab1e (coordinator; no gh PR — auth pending)
**Changed:**
- src/three/Lighting.tsx — procedural Environment + 5 Lightformers; ambient 0.5/#6a6280; no HDRI
- src/three/Ball.tsx — drop envMap; shell tint (0.85,0.78,1.0) + envMapIntensity 1.2; FBM unchanged
- src/three/OracleScene.tsx — NeutralToneMapping @ 1.1; remove env preload
**Verified:** tsc ✓ · build ✓ · test ✓ (71) · e2e ✓ (5) · /code-review ✓ · flag-off regression ✓ · visual ✓
**Acceptance:** procedural studio replaces dark HDRI; no TextureLoader/ENV_MAP_PATH/per-material envMap;
shell bright violet chrome tint; Neutral tone map; tsc/build/test/e2e green; flag-off unchanged; shake/reveal pass
**Integration:** scene.environment via drei `<Environment>`; shell+lens use scene env (no explicit envMap);
NeutralToneMapping @ 1.1; shell Color(0.85,0.78,1.0) + envMapIntensity 1.2; sides/cavity/lens colours +
lens.envMapIntensity 10 frozen for F2
**Next:** F2 — molten amber/copper gasket + liquid cavity floor (Ball.tsx sides/lens/cavity only)
**Blockers:** none
**Notes for next agent:**
- Tone map: NeutralToneMapping @ exposure 1.1 (AgX not tested; Neutral is locked default)
- Lightformer values verbatim from § 4.1; floor fill rotation [-π/2,0,0], no target
- lens.envMapIntensity still 10 — F2 drops to ~2.5
- public/env/cywarr-env.jpg still bundled (748 KB); F3 deletes
- OracleScene chunk ~1.05 MB gzipped ~300 KB; env jpg removal in F3 should shrink precache
```

## Phase checklist

- [x] **F1** — Studio environment + chrome
- [ ] **F2** — Hole surfaces: molten gasket + liquid floor
- [ ] **F3** — QA, cleanup, docs

## Active locks

- **F2 (next to spawn)** owns: `src/three/Ball.tsx` (sides + lens + cavity material blocks only).

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
| Molten amber/copper gasket with wavy lines clearly visible | ☐ | F2 |
| Hole floor radial gradient + shimmer (text still crisp) | ☐ | F2 |
| AnswerPanel triangle/8/Courier text unchanged | ☐ | F1+F2 |
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
