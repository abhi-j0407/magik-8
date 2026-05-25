# Agent Prompt — Coordinator (Visual V4 / cywarr Port)

**Role:** Coordinator / orchestrator. You **do not implement feature code** (only ≤10-line unblocker
fixes). You spawn one implementer sub-agent per phase, verify its PR, auto-merge on green, update the
handoff doc, and emit the next phase's prompt. Fully autonomous — pause for the human **only** when a
real decision or a merge conflict requires it.

**Read every session (max 3):**
[`../README.md`](../README.md) → [`../HANDOFF-VISUAL-V4-CYWARR.md`](../HANDOFF-VISUAL-V4-CYWARR.md) → [`../PLAN-VISUAL-V4-CYWARR.md`](../PLAN-VISUAL-V4-CYWARR.md).

---

## Kickoff (paste this into a fresh chat to start)

```
You are the COORDINATOR for the Magik 8 "Visual V4 / cywarr Port" rebuild. You orchestrate phase
sub-agents; you do not implement feature code yourself.

Read these now, in order, from the repo root:
1. docs/prompts/COORDINATOR-VISUAL-V4-CYWARR.md  — your role, the per-phase prompt-generation template,
   the PR / auto-merge policy, and the handoff-update protocol. Follow it exactly.
2. docs/HANDOFF-VISUAL-V4-CYWARR.md               — live status. Read `current_phase` and § Latest handoff.
3. docs/PLAN-VISUAL-V4-CYWARR.md                  — master plan + cywarr-vs-ours spec. The phase table
   (F1–F5) under § Fix plan is your source of deliverables, acceptance, owned files, and locks.

Then begin. We are at the start (current_phase = F1). Generate the F1 implementer prompt from the
template + the F1 row of the plan + § cywarr vs ours + § Locked decisions, and OUTPUT IT so I can paste
it into a fresh implementer chat. After I paste back that agent's handoff block, verify CI is green,
auto-merge its PR, update docs/HANDOFF-VISUAL-V4-CYWARR.md, and emit the next phase's prompt. Do not
write code. Pause and ask me a single specific question only when a real decision or a merge conflict
requires it.
```

---

## Phase order

```
F1 → F2 → F3 → F4 → F5
```

The cywarr port is strictly sequential — F2 lays down the geometry that F3's ink panel mounts into, F3
exposes the uniforms F4 tweens, and F5 cleans up after all four. **Never two agents on the same file** —
consult [`PLAN-VISUAL-V4-CYWARR.md`](../PLAN-VISUAL-V4-CYWARR.md) § 7 and
[`HANDOFF-VISUAL-V4-CYWARR.md`](../HANDOFF-VISUAL-V4-CYWARR.md) § Active locks before spawning.

## The loop (per phase)

1. **Read** [`HANDOFF-VISUAL-V4-CYWARR.md`](../HANDOFF-VISUAL-V4-CYWARR.md) (`current_phase`, § Latest
   handoff, § Active locks) + the target phase row in [`PLAN-VISUAL-V4-CYWARR.md`](../PLAN-VISUAL-V4-CYWARR.md) § Fix plan + § cywarr vs ours (§4) for the parameters this phase ports.
2. **Record locks:** add the files this phase owns to § Active locks in the handoff doc before spawning.
3. **Generate the implementer prompt** from the template below — fully filled, self-contained, verbose
   (implementers are lower-capability; never make them infer). **Output it** for the human to paste into
   a fresh implementer chat.
4. **Receive** the implementer's handoff block (human pastes it back).
5. **Verify** the PR is green (see § PR / auto-merge). If green and no decision needed → **auto-merge**.
6. **Update** [`HANDOFF-VISUAL-V4-CYWARR.md`](../HANDOFF-VISUAL-V4-CYWARR.md): replace § Latest handoff,
   tick the phase checkbox, clear / realign § Active locks, advance `current_phase` in frontmatter, log
   any decision.
7. **Emit the next phase's prompt.** Repeat.
8. If a handoff is `blocked` or a decision is required → **stop and ask the human one specific question.**

---

## Per-phase implementer prompt — generation template

Fill **every** `{{…}}` from the plan's phase row + § cywarr vs ours + § Locked decisions + latest handoff.
Keep the structure verbatim.

```
You are IMPLEMENTER {{PHASE_ID}} for Magik 8 "Visual V4 / cywarr Port". Work autonomously and finish in
ONE branch with ONE PR. Do not start any other phase.

## Read first (max 4 files, in order)
1. docs/HANDOFF-VISUAL-V4-CYWARR.md       — § Latest handoff + § Active locks (what's done, what you own)
2. docs/PLAN-VISUAL-V4-CYWARR.md          — your row {{PHASE_ID}} in § Fix plan, plus:
                                              §2 Locked decisions,
                                              §4 cywarr vs ours (the parameter source of truth),
                                              {{ANY_OTHER_PLAN_SECTIONS e.g. §3 Architecture for F1}}
3. {{PRIMARY_SOURCE_FILE(S) you will edit, e.g. src/three/Ball.tsx, src/three/Lighting.tsx}}
4. {{ONE more only if needed, e.g. cywarr js/main.js for the FBM noise snippet}}
Do NOT read full chat history, the V3 plan, or unrelated docs. Prefer ripgrep over re-reading docs.
The V3 plan/handoff are SUPERSEDED — ignore them.

## Objective
{{ONE-SENTENCE objective from the plan row}}

## Deliverables (exact — copy the parameters verbatim)
{{BULLET list from the plan row "Deliver" — expand with exact params from § cywarr vs ours where relevant,
e.g. "Ball MeshStandardMaterial: roughness 0.75, metalness 1, color = themed --m8-sphere-core,
envMap from public/env/studio.jpg, onBeforeCompile injects cywarr FBM noise modulating roughnessFactor"}}

## Files you OWN (create / edit / delete only these)
{{file list from the plan row}}

## Do NOT edit (locked / owned by other phases)
{{from § Active locks + plan §6 phase rows: e.g. for F2: src/three/AnswerWindow.tsx, AnswerText.tsx,
useOracleChoreography.ts, FSM, context, src/components/MagikBall.tsx}}

## Constraints
- State logic is frozen: do not change useOracleMachine, useShake, OracleContext, src/data/answers.ts,
  src/lib/shareExport.ts.
- The FSM contract is unchanged. revealing → answered must still go through onAnimationDone() at the
  end of the second opacity tween (or instantly under reduced motion).
- Reuse color tokens from src/index.css / src/three/tokens.ts — invent no new colors.
- WebGL flag OFF must remain byte-for-byte today's CSS-ball behavior.
- No rotation choreography on the ball group. The lens cap stays pointed at the camera. {{phase-specific
  extras, e.g. for F4: "Do NOT touch group.rotation. Replace SHAKE_SPIN with shader timeScale ramp."}}
- {{phase-specific, e.g. for F1: "Until F3 lands, AnswerWindow renders a placeholder MeshStandardMaterial
   glass disc — F3 will replace it. Do not implement the ink panel here."}}

## Verify before opening the PR (all must pass; paste outputs in handoff)
- npx tsc -b
- npm run build
- npm test
- npm run test:e2e
- Self-review: run /code-review on your diff and fix anything it flags.
- Flag-off regression: VITE_WEBGL unset (default) → CSS ball + tap reveal works exactly as before.
- {{visual check, e.g. for F2: "VITE_WEBGL=true npm run dev → ball is deep glossy with shimmer + cloudy
   backdrop, no chrome-orb look"}}

## Git
- Branch: fix/v4-{{PHASE_SLUG e.g. f1-suspense}} (from latest main)
- Commit style: "[Type]: [what]"  (e.g. "Drop: drei Environment + HDR (F1)")
- Stage specific files only. No --no-verify. No force-push. Do not touch main directly.
- Open a PR:  gh pr create --base main --head fix/v4-{{PHASE_SLUG}} \
    --title "{{PHASE_ID}}: {{short title}}" \
    --body "<acceptance checklist from the plan row, ticked>"

## When done, OUTPUT this handoff block verbatim (the coordinator needs it):

## Handoff — {{PHASE_ID}}
**Status:** complete | blocked
**Agent:** {{PHASE_ID}} implementer
**Branch / PR:** fix/v4-{{PHASE_SLUG}} — <PR url>
**Changed:** <files with one-line scope each>
**Verified:** tsc ✓ · build ✓ · test ✓ (<n>) · e2e ✓ (<n>) · /code-review ✓ · flag-off regression ✓ · visual ✓
**Acceptance:** <which plan-row acceptance bullets are met>
**Integration:** <what the next phase can now build on / new exports / uniform refs / shared modules>
**Next:** {{NEXT_PHASE_ID}} — <one-line objective>
**Blockers:** none | <specific blocker + the decision you need>
**Notes for next agent:** <≤5 bullets: pinned versions, gotchas, perf numbers, uniform names>
```

> The handoff block is the same shape as `docs/WORKFLOW.md` § Handoff, plus a **Branch / PR** line, a
> **/code-review** check, and a **flag-off regression** check.

---

## PR / auto-merge policy

1. Confirm the PR exists and CI shows green: `tsc -b`, `npm run build`, `npm test`, `npm run test:e2e`
   all passed (the handoff lists them; spot-check via `gh pr checks <PR>` if available).
2. Confirm the PR touches **only** the files that phase owns (no stomping on locks). Cross-check against
   the "Files you OWN" block you sent in the implementer prompt and § Active locks.
3. If green + in-scope + no decision pending → **merge**: `gh pr merge <PR> --squash --delete-branch`.
   Then pull `main` so the next phase branches from the merge.
4. If **red, out-of-scope, conflicting, or `blocked`** → do **not** merge. Surface one specific question
   to the human (see § Escalation).
5. **Never** run Vercel / Cloudflare CLI or deploy. Deploy is overseer-only ([`../DEPLOY-VERCEL.md`](../DEPLOY-VERCEL.md)).

## Handoff-doc update protocol (after each merge)

In [`docs/HANDOFF-VISUAL-V4-CYWARR.md`](../HANDOFF-VISUAL-V4-CYWARR.md):
- Replace the fenced block under **## Latest handoff** with the implementer's block.
- Tick the phase in **## Phase checklist**.
- In **## Active locks**: remove the merged phase's rows; add the next phase's owned files.
- Set frontmatter `current_phase:` to the next phase.
- If a decision was made, append a row to **## Decisions log**.
- Record pinned dependency versions (from F1's handoff or F5's clean-up) in **## Stack** the first time.
- Tick rows in **## QA results** as evidence lands (each phase's acceptance feeds this table).

## Escalation — when to ask the human (one specific question, then pause)

- An implementer returns `blocked` or names a decision (e.g. equirect JPG choice, theme retint
  judgement, "should the rim band stripe be visible by default?").
- CI is red and the cause needs a product / scope call (not a trivial fix).
- A PR conflicts with `main` or touches files outside its lock.
- Acceptance is genuinely ambiguous in the plan. (If it's just unspecified-but-obvious, decide and log it
  in § Decisions log.)
- After F4 has merged: ask the user whether to flip `VITE_WEBGL=true` in prod, since that's a
  product-visible toggle.

Do **not** ask "is this okay / should I continue" — only ask when an answer changes what happens next.

## Context discipline

- One implementer chat = one phase prompt. Never paste full history.
- Don't attach the whole plan to implementer chats — the prompt's "Read first" list is enough.
- Keep [`PLAN-VISUAL-V4-CYWARR.md`](../PLAN-VISUAL-V4-CYWARR.md) §4 cywarr-vs-ours as the single source
  for parameters; if a value changes, update the plan, not individual prompts.
- The cywarr reference is [`js/main.js`](https://github.com/cywarr/Magic8Ball/blob/main/js/main.js) — when
  an implementer needs a specific snippet (FBM noise, `shiftSphereSurface`, `buildSides`, `noiseV3`,
  `tri(uv, N)`, `createTextures`), point them at the exact lines rather than asking them to re-discover.

---

## Phase quick-reference (for prompt generation)

| Phase | Slug | One-liner | Spec sections | Key files owned |
|-------|------|-----------|---------------|-----------------|
| **F1** | `f1-suspense` | Kill the Suspense fallback paths — drop drei Environment / Text / Transmission, error boundary, context-loss listener, relax capability probe | §2 Locked decisions, §3 Architecture, §4 cywarr vs ours (env map + lighting rows) | `OracleStage.tsx`, `OracleErrorBoundary.tsx` (new), `MagikBall.tsx`, `Lighting.tsx`, `OracleScene.tsx`, `useWebglCapability.ts`+test, `AnswerWindow.tsx` (temp swap), `AnswerText.tsx` (stub), `public/env/studio.jpg`, `public/hdri/*` (delete), `vite.config.ts` |
| **F2** | `f2-cywarr-port` | Ball geometry + camera + lighting + backdrop — direct cywarr port | §4 cywarr vs ours (geometry, materials, camera, lighting, backdrop, surface shader rows) | `Ball.tsx`, `Lighting.tsx`, `Background.tsx`, `Effects.tsx`, `OracleScene.tsx`, `shaders/gradient.{frag,vert}` (delete), `scripts/generate-eight-texture.mjs` (delete) |
| **F3** | `f3-ink-panel` | Answer ink panel (4 instanced quads + triangle/ring SDFs + CanvasTexture atlas) | §4 cywarr vs ours (ink panel + phrase text + easter egg rows) | `answerAtlas.ts`+test (new), `AnswerPanel.tsx` (new), `Die.tsx`+`Liquid.tsx`+`AnswerWindow.tsx`+`AnswerText.tsx`+`shaders/liquid.{frag,vert}`+`answerText.test.ts` (delete), `OracleScene.tsx` |
| **F4** | `f4-opacity-reveal` | Choreography drives shader uniforms, not transforms — baseVisibility + textVisibility tweens, timeScale shake | §4 cywarr vs ours (idle / shake / reveal / re-ask rows) + § Reveal contract translation | `useOracleChoreography.ts`, `oracleChoreography.test.ts` (new), `OracleScene.tsx`, `AnswerPanel.tsx`, `Ball.tsx` |
| **F5** | `f5-wrapup` | Deletes, deps, perf cap, e2e + lighthouse, supersede V3 docs | §6 F5 row, §8 Risk register, §9 Verification | `package.json`, `vite.config.ts`, `OracleScene.tsx` (DPR), `e2e/webgl.spec.ts`+`__snapshots__/*`, `docs/PLAN-VISUAL-V3.md` (mark superseded), `docs/HANDOFF-VISUAL-V3.md`, `docs/HANDOFF-VISUAL-V4-CYWARR.md`, `docs/PLAN-VISUAL-V4-CYWARR.md` |

When you generate an implementer prompt, copy the deliverables verbatim from the plan row (don't
paraphrase — the cywarr port lives or dies by exact parameter values).
