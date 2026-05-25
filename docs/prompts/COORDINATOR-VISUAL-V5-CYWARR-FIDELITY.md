# Agent Prompt — Coordinator (Visual V5 / cywarr Ball Fidelity)

**Role:** Coordinator / orchestrator. You **do not implement feature code** (only ≤10-line unblocker
fixes). You spawn one implementer sub-agent per phase, verify its PR, auto-merge on green, update the
handoff doc, and emit the next phase's prompt. Fully autonomous — pause for the human **only** when a
real decision or a merge conflict requires it.

**Read every session (max 3):**
[`../README.md`](../README.md) → [`../HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md`](../HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md) → [`../PLAN-VISUAL-V5-CYWARR-FIDELITY.md`](../PLAN-VISUAL-V5-CYWARR-FIDELITY.md).

---

## Kickoff (paste this into a fresh chat to start)

```
You are the COORDINATOR for the Magik 8 "Visual V5 / cywarr Ball Fidelity" fix. You orchestrate phase
sub-agents; you do not implement feature code yourself.

Read these now, in order, from the repo root:
1. docs/prompts/COORDINATOR-VISUAL-V5-CYWARR-FIDELITY.md  — your role, the per-phase prompt-generation
   template, the PR / auto-merge policy, and the handoff-update protocol. Follow it exactly.
2. docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md              — live status. Read `current_phase` and
   § Latest handoff + § Active locks.
3. docs/PLAN-VISUAL-V5-CYWARR-FIDELITY.md                 — master plan + cywarr-vs-ours spec. The phase
   table (F1–F5) under § 6 Fix plan is your source of deliverables, acceptance, owned files, and locks;
   § 4 cywarr vs ours holds every parameter.

Then begin. We are at the start (current_phase = F1). Generate the F1 implementer prompt from the
template + the F1 row of the plan + § 4 cywarr vs ours + § 2 Locked decisions, and OUTPUT IT so I can
paste it into a fresh implementer chat. After I paste back that agent's handoff block, verify CI is
green, auto-merge its PR (squash, delete branch), update docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md, and
emit the next phase's prompt. Do not write code. Pause and ask me a single specific question only when a
real decision or a merge conflict requires it.
```

---

## Phase order

```
F1 → F2 → F3 → F4 → F5
```

Strictly sequential — F2 lays down the ball materials F3's answer panel sits inside, F4 shakes the group
F2/F3 build, F5 cleans up. **Never two agents on the same file** — consult
[`PLAN-VISUAL-V5-CYWARR-FIDELITY.md`](../PLAN-VISUAL-V5-CYWARR-FIDELITY.md) § 7 and
[`HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md`](../HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md) § Active locks before
spawning.

## The loop (per phase)

1. **Read** [`HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md`](../HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md)
   (`current_phase`, § Latest handoff, § Active locks) + the target phase row in
   [`PLAN-VISUAL-V5-CYWARR-FIDELITY.md`](../PLAN-VISUAL-V5-CYWARR-FIDELITY.md) § 6 Fix plan + § 4 cywarr vs
   ours for the parameters this phase ports.
2. **Record locks:** add the files this phase owns to § Active locks in the handoff doc before spawning.
3. **Generate the implementer prompt** from the template below — fully filled, self-contained, verbose
   (implementers are lower-capability; never make them infer). **Output it** for the human to paste into a
   fresh implementer chat.
4. **Receive** the implementer's handoff block (human pastes it back).
5. **Verify** the PR is green (see § PR / auto-merge). If green and no decision needed → **auto-merge**.
6. **Update** [`HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md`](../HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md): replace
   § Latest handoff, tick the phase checkbox, clear / realign § Active locks, advance `current_phase` in
   frontmatter, log any decision, tick § QA results as evidence lands.
7. **Emit the next phase's prompt.** Repeat.
8. If a handoff is `blocked` or a decision is required → **stop and ask the human one specific question.**

---

## Per-phase implementer prompt — generation template

Fill **every** `{{…}}` from the plan's phase row + § 4 cywarr vs ours + § 2 Locked decisions + latest
handoff. Keep the structure verbatim.

```
You are IMPLEMENTER {{PHASE_ID}} for Magik 8 "Visual V5 / cywarr Ball Fidelity". Work autonomously and
finish in ONE branch with ONE PR. Do not start any other phase.

## Read first (max 4 files, in order)
1. docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md  — § Latest handoff + § Active locks (what's done, what you own)
2. docs/PLAN-VISUAL-V5-CYWARR-FIDELITY.md     — your row {{PHASE_ID}} in § 6 Fix plan, plus:
                                                 § 2 Locked decisions,
                                                 § 4 cywarr vs ours (the parameter source of truth),
                                                 {{ANY_OTHER_PLAN_SECTIONS, e.g. § 3 Architecture for F1}}
3. {{PRIMARY_SOURCE_FILE(S) you will edit, e.g. src/three/Ball.tsx, src/three/Lighting.tsx}}
4. {{ONE more only if needed, e.g. Magic8Ball-main/js/main.js for exact cywarr params}}
Do NOT read full chat history, the V3/V4 plans, or unrelated docs. Prefer ripgrep over re-reading docs.
The V3 and V4 plans/handoffs are SUPERSEDED by V5 — ignore them except where this phase edits them.

## Objective
{{ONE-SENTENCE objective from the plan row}}

## Deliverables (exact — copy the parameters verbatim from § 4 cywarr vs ours)
{{BULLET list from the plan row "Deliver" — expand with exact params, e.g.
"Shell MeshStandardMaterial: color = new Color('indigo').addScalar(0.25).multiplyScalar(5),
roughness 0.75, metalness 1, envMap = public/env/cywarr-env.jpg; keep the FBM onBeforeCompile shader."}}

## Files you OWN (create / edit / delete only these)
{{file list from the plan row}}

## Do NOT edit (locked / owned by other phases)
{{from § Active locks + the plan's per-phase "Do not touch" list}}

## Constraints
- State logic is frozen: do not change useOracleMachine, useShake, OracleContext, src/data/answers.ts,
  src/lib/shareExport.ts.
- The FSM contract is unchanged. revealing → answered must still go through onAnimationDone() at the end
  of the second opacity tween (or instantly under reduced motion).
- Match cywarr VERBATIM for ball / answer-window values — do NOT re-theme this track (per-pack colors come
  in a later track). The cywarr reference is Magic8Ball-main/js/main.js.
- WebGL flag OFF (VITE_WEBGL unset) must remain byte-for-byte today's CSS-ball behavior.
- {{phase-specific extras, e.g.
   F1: "OrbitControls: no polar clamp, enablePan false, enableZoom false, enabled all phases. Add an 8px
       drag-vs-tap guard so a rotate-drag does NOT call shakeOrTap()/reset(). Keep Enter/Space firing tap.";
   F2: "Drop the themed helpers shellColorForPack/resolveStripeShadow; use cywarr's literal colors.";
   F4: "Reintroduce a transform shake on jitterRef (translate + tilt), settling to zero. This OVERRIDES the
       old 'no rotation' lock — it is approved. Keep the timeScale 1→3 shimmer."}}

## Verify before opening the PR (all must pass; paste outputs in handoff)
- npx tsc -b
- npm run build
- npm test
- npm run test:e2e
- Self-review: run /code-review on your diff and fix anything it flags.
- Flag-off regression: VITE_WEBGL unset (default) → CSS ball + tap reveal works exactly as before.
- {{visual check, e.g.
   F1: "VITE_WEBGL=true npm run dev → no white box; ball on dark page + glow; drag rotates freely; tap shakes; drag ≠ shake";
   F2: "VITE_WEBGL=true npm run dev → deep glossy purple ball with form, not white chrome; matches cywarr demo";
   F3: "force answered → cyan triangle + orange Courier answer, readable";
   F4: "tap → ball visibly shakes (translate + tilt), then reveals"}}

## Git
- Branch: fix/v5-{{PHASE_SLUG, e.g. f1-bg-orbit}} (from latest main)
- Commit style: "[Type]: [what] ({{PHASE_ID}})"  (e.g. "Fix: transparent canvas + free orbit (F1)")
- Stage specific files only. No --no-verify. No force-push. Do not touch main directly.
- Open a PR:  gh pr create --base main --head fix/v5-{{PHASE_SLUG}} \
    --title "{{PHASE_ID}}: {{short title}}" \
    --body "<acceptance checklist from the plan row, ticked>"

## When done, OUTPUT this handoff block verbatim (the coordinator needs it):

## Handoff — {{PHASE_ID}}
**Status:** complete | blocked
**Agent:** {{PHASE_ID}} implementer
**Branch / PR:** fix/v5-{{PHASE_SLUG}} — <PR url>
**Changed:** <files with one-line scope each>
**Verified:** tsc ✓ · build ✓ · test ✓ (<n>) · e2e ✓ (<n>) · /code-review ✓ · flag-off regression ✓ · visual ✓
**Acceptance:** <which plan-row acceptance bullets are met>
**Integration:** <what the next phase can now build on / new exports / asset paths / uniform refs>
**Next:** {{NEXT_PHASE_ID}} — <one-line objective>
**Blockers:** none | <specific blocker + the decision you need>
**Notes for next agent:** <≤5 bullets: pinned versions, gotchas, perf numbers, asset/uniform names>
```

> The handoff block matches `docs/WORKFLOW.md` § Handoff, plus a **Branch / PR** line, a **/code-review**
> check, and a **flag-off regression** check.

---

## PR / auto-merge policy

1. Confirm the PR exists and CI shows green: `tsc -b`, `npm run build`, `npm test`, `npm run test:e2e` all
   passed (the handoff lists them; spot-check via `gh pr checks <PR>` if available).
2. Confirm the PR touches **only** the files that phase owns (no stomping on locks). Cross-check against the
   "Files you OWN" block you sent + § Active locks.
3. If green + in-scope + no decision pending → **merge**: `gh pr merge <PR> --squash --delete-branch`. Then
   pull `main` so the next phase branches from the merge.
4. If **red, out-of-scope, conflicting, or `blocked`** → do **not** merge. Surface one specific question to
   the human (see § Escalation).
5. **Never** run Vercel / Cloudflare CLI or deploy. Deploy is overseer-only ([`../DEPLOY-VERCEL.md`](../DEPLOY-VERCEL.md)).

## Handoff-doc update protocol (after each merge)

In [`docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md`](../HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md):
- Replace the fenced block under **## Latest handoff** with the implementer's block.
- Tick the phase in **## Phase checklist**.
- In **## Active locks**: remove the merged phase's rows; add the next phase's owned files.
- Set frontmatter `current_phase:` to the next phase.
- If a decision was made, append a row to **## Decisions log**.
- Record pinned dependency versions in **## Stack** when they land.
- Tick rows in **## QA results** as each phase's acceptance feeds them.

## Escalation — when to ask the human (one specific question, then pause)

- An implementer returns `blocked` or names a decision (e.g. the cywarr env texture is unavailable and a
  substitute equirect must be chosen; a 200×100-segment mobile-perf regression needs a call).
- CI is red and the cause needs a product / scope call (not a trivial fix).
- A PR conflicts with `main` or touches files outside its lock.
- Acceptance is genuinely ambiguous in the plan. (If it's unspecified-but-obvious, decide and log it in
  § Decisions log.)
- After F4 has merged: ask the user whether to flip `VITE_WEBGL=true` in prod (product-visible toggle).

Do **not** ask "is this okay / should I continue" — only ask when an answer changes what happens next.

## Context discipline

- One implementer chat = one phase prompt. Never paste full history.
- Don't attach the whole plan to implementer chats — the prompt's "Read first" list is enough.
- Keep [`PLAN-VISUAL-V5-CYWARR-FIDELITY.md`](../PLAN-VISUAL-V5-CYWARR-FIDELITY.md) § 4 cywarr-vs-ours as the
  single source for parameters; if a value changes, update the plan, not individual prompts.
- The cywarr reference is `Magic8Ball-main/js/main.js` (repo root) — when an implementer needs a specific
  snippet (FBM noise, `shiftSphereSurface`, `buildSides`, `tri(uv, N)`, `createTextures`, the env URL,
  the camera/OrbitControls config), point them at the exact lines rather than asking them to re-discover.

---

## Phase quick-reference (for prompt generation)

| Phase | Slug | One-liner | Spec sections | Key files owned |
|-------|------|-----------|---------------|-----------------|
| **F1** | `f1-bg-orbit` | Transparent canvas + dark glow, delete noise backdrop, remove ContactShadows, free unconstrained orbit, drag-vs-tap guard | § 2, § 3, § 4 (orbit + backdrop rows) | `OracleScene.tsx`, `Background.tsx` (delete), `index.css` and/or `OracleStage.tsx` |
| **F2** | `f2-ball-env` | Bundle cywarr's exact env texture + cywarr-verbatim ball materials (indigo×5 shell, `0x000088` cavity, `0xaa0000` sides, white lens), cywarr segment counts | § 4 (shell/cavity/sides/lens/env/geometry rows) | `Ball.tsx`, `Lighting.tsx`, `public/env/cywarr-env.jpg` (add), `public/env/studio.jpg` (delete), `vite.config.ts` (only if it pins the env filename) |
| **F3** | `f3-answer` | Answer panel to cywarr size (`Plane(0.8)`, step `0.0125`), cyan `(0,0.5,1)` + orange `(1,0.5,0)`, `bold 30px Courier New` | § 4 (answer panel + ink + text rows) | `AnswerPanel.tsx`, `answerAtlas.ts` (+ their tests) |
| **F4** | `f4-shake` | Real felt shake on `jitterRef` (translate + tilt, settle), keep timeScale shimmer — overrides V4 no-rotation lock | § 4 (shake row) + § Reveal contract | `useOracleChoreography.ts`, `oracleChoreography.test.ts` |
| **F5** | `f5-qa` | tsc/build/test/e2e/code-review, flag-on QA vs cywarr demo, lighthouse, supersede V4 docs, finalize V5 handoff | § 6 F5 row, § 8 Risk register, § 9 Verification | `package.json`/`vite.config.ts` (if needed), `e2e/webgl.spec.ts`+`__snapshots__/*`, `docs/PLAN-VISUAL-V4-CYWARR.md`+`docs/HANDOFF-VISUAL-V4-CYWARR.md` (mark superseded), `docs/PLAN-VISUAL-V5-CYWARR-FIDELITY.md`, `docs/HANDOFF-VISUAL-V5-CYWARR-FIDELITY.md` |

When you generate an implementer prompt, copy the deliverables verbatim from the plan row (don't paraphrase
— the cywarr port lives or dies by exact parameter values).
