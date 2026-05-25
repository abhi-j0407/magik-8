---
id: handoff-visual-v6-studio-chrome
version: 1.0.0
status: complete
current_phase: F3-complete
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
## Handoff — F3
**Status:** complete
**Agent:** F3 implementer
**Branch / PR:** v6/f3-qa-cleanup → visual/v6-studio-chrome — https://github.com/abhi-j0407/magik-8/compare/visual/v6-studio-chrome...v6/f3-qa-cleanup?expand=1 (open PR; `gh` not authed in agent env)
**Changed:**
- public/env/cywarr-env.jpg — deleted dead 748648 B HDRI (no src refs)
- docs/PLAN-VISUAL-V5-CYWARR-FIDELITY.md — status superseded_by V6
- docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md — status superseded_by V6
- docs/PLAN-VISUAL-V6-STUDIO-CHROME.md — status complete
- docs/HANDOFF-VISUAL-V6-STUDIO-CHROME.md — F3 QA evidence, checklist, lighthouse
**Verified:** tsc ✓ · build ✓ · test ✓ (71) · e2e ✓ (5) · lighthouse ✓ (flag-off P94/A100/BP100 · flag-on P46/A100/BP96) · /code-review ✓ · flag-off ✓ · flag-on checklist ✓ (desktop preview; phone overseer)
**Acceptance:** Full integration QA green; env jpg deleted, ripgrep clean in src+config; Lighthouse within budget; V5 superseded; V6 handoff finalized; no src/three/* edits in F3
**Integration:** `visual/v6-studio-chrome` ready for human squash/merge → `main` + deploy
**Next:** human — merge integration branch → main (see coordinator § Final integration)
**Blockers:** none
**Notes for overseer:** Precache 2267 KiB (14 entries) → 1536 KiB (13 entries) after jpg delete (~731 KiB). Flag-on LH perf 46 (floor 45). Manual flag-on spot-check on desktop build+preview; real-phone + cywarr side-by-side still overseer before prod WebGL flip.
```

## Phase checklist

- [x] **F1** — Studio environment + chrome
- [x] **F2** — Hole surfaces: molten gasket + liquid floor
- [x] **F3** — QA, cleanup, docs

## Active locks

**None** — V6 complete. All `src/three/*` rendering from F1–F2 is frozen.

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
| Shell reads bright violet chrome (amber+violet highlights), not coppery | ☑ | F1 — F3 build+preview spot-check ✓ |
| Lower hemisphere not pure black (floor fill works) | ☑ | F1 — F3 preview ✓ |
| Reflections sweep on drag-rotate | ☑ | F1 — F3 preview ✓ |
| Tone mapping chosen (Neutral vs AgX) | ☑ | F1 — Neutral @ 1.1 |
| Felt shake before reveal still works | ☑ | F1 — e2e + F3 e2e ✓ |
| Reduced-motion: shake skipped, FSM progresses | ☑ | F1 — e2e + `oracleChoreography.test.ts` |
| Flag-off = today's CSS behaviour | ☑ | F1+F3 — `git diff main...HEAD` zero on `MagikBall.tsx`, FSM, context; e2e smoke ✓ |
| Molten amber/copper gasket with wavy lines clearly visible | ☑ | F2 — F3 preview ✓ |
| Hole floor radial gradient + shimmer (text still crisp) | ☑ | F2 — F3 preview ✓ |
| AnswerPanel triangle/8/Courier text unchanged | ☑ | F1+F2 — e2e + code-review |
| `public/env/cywarr-env.jpg` deleted, no dangling refs | ☑ | F3 — ripgrep src+config clean; docs-only hits |
| Lighthouse flag-off ≥85 / flag-on ≥45 | ☑ | F3 — flag-off P94; flag-on P46 |
| V5 docs superseded; V6 handoff finalized | ☑ | F3 |

## Flag-on QA checklist (manual, before merge → main — human)

- [x] `VITE_WEBGL=true VITE_WEBGL_E2E=true npm run build && npm run preview` — bright violet chrome on dark bg (F3 desktop spot-check)
- [x] Drag rotates freely; reflections sweep; tap shakes; drag ≠ shake (F3 preview + e2e webgl)
- [x] Molten amber/copper gasket + liquid-depth floor read clearly (F3 preview)
- [x] Answer: cyan triangle + orange Courier, readable (F3 preview + e2e)
- [ ] One real phone — DPR capped, rotation + shake smooth (**overseer**)
- [x] `prefers-reduced-motion: reduce` — no shake; FSM still reveals (`oracleChoreography.test.ts` + e2e)

## Lighthouse (F3 measured)

| Build | Performance | Accessibility | Best practices |
|-------|-------------|---------------|----------------|
| flag-off (default) | **94** | 100 | 100 |
| flag-on (`VITE_WEBGL=true`) | **46** | 100 | 96 |

Command: `npm run test:lighthouse` (mobile emulation, preview on port 4173). PWA category omitted when not reported (local http preview).

Precache: **2267 KiB** (14 entries, with jpg) → **1536 KiB** (13 entries) after `cywarr-env.jpg` delete (~731 KiB / 748648 B file).

## F3 verification commands (paste)

```
npx tsc -b          # exit 0
npm run build       # exit 0; precache 13 entries 1536.09 KiB
npm test            # 71 passed
npm run test:e2e    # 5 passed
npm run test:lighthouse  # flag-off P94; flag-on P46
```

## V5 supersession

[`PLAN-VISUAL-V5-CYWARR-FIDELITY.md`](./PLAN-VISUAL-V5-CYWARR-FIDELITY.md) and
[`HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md`](./HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md) are **superseded** by this V6
track (`superseded_by: PLAN-VISUAL-V6-STUDIO-CHROME`).

## Code review (F1+F2 integration diff vs `main`)

Reviewed `src/three/{Ball,Lighting,OracleScene}.tsx` — no issues in owned scope; F3 did not edit render layer.

- F1: procedural `<Environment>` + five Lightformers; shell uses `scene.environment`; Neutral @ 1.1; preload/ENV_MAP_PATH removed cleanly.
- F2: gasket `0xc8631e` + emissive; lens `envMapIntensity` 2.5; cavity gradient+shimmer reuses `CYWARR_FBM` + `oracleSceneTime`.
- Flag-off path: zero diff on `MagikBall.tsx`, oracle machine, context (CSS ball unchanged).
