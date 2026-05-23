---
id: coordinator-design-v2
version: 1.0.0
status: complete
design_source: magik-8_CLAUDE_DESIGN/
target_phase: Ship
---

# Coordinator Plan — Claude Design V2 → Magik 8 Codebase

> **Audience:** A new **Coordinator** agent orchestrating multiple **Implementer** sub-agents in Cursor (Composer 2.5 recommended for implementation passes).
>
> **Design package:** `magik-8_CLAUDE_DESIGN/` at repo root (exported from Claude Design).
>
> **Goal:** Fully integrate the V2 visual system into `src/` without changing oracle logic, sensors, audio, answer copy, or ritual timing.

---

## 1. Executive summary

The Claude Design export is a **complete implementation pack**, not a loose moodboard:

| Asset | Role |
|-------|------|
| `docs/DESIGN-V2.md` | Canonical text spec (tokens, anatomy, motion, file touch list) |
| `prompts/00-overview.md` … `06-motion.md` | Ordered implementer prompts (copy-paste into sub-agent chats) |
| `tokens.css`, `components.css` | CSS source of truth |
| `magik8-ball.jsx`, `magik8-chrome.jsx` | Reference React (port to TSX; wire to existing hooks/context) |
| `index.html`, `prototype.html` | Visual showroom + interactive state toggles |
| `exports-builder.html` | Regenerate missing `exports/*.png` screenshots |
| `exports/*.png` | Visual acceptance targets (**folder may be empty mid-refactor — see Phase 0**) |

**Integration strategy:** Run **six sequential implementer phases** (D1–D6) matching `prompts/01`–`06`, then a **QA / test-alignment phase** (D7), then **doc + ship prep** (D8). Coordinator never implements UI; it assigns locks, pastes prompts, merges handoffs, updates `docs/HANDOFF.md`.

**Hard constraints (repeat in every sub-agent brief):**

- Do **not** edit: `useOracleMachine.ts`, `pickAnswer.ts`, `easterEgg.ts`, `rng.ts`, `useShake.ts`, `useHaptics.ts`, `useAudio.ts`, `data/answers.ts`, `src/context/*`, `*.test.ts` logic (tests may get **selector/copy** updates only in D7).
- Do **not** change: `REVEAL_MS=600`, `SHARE_CARD_WIDTH=1080`, `SHARE_CARD_HEIGHT=1920`, `SHAKE_DURATION_MS=400`, ritual phases (`idle | shaking | revealing | answered`).
- **Visual-only** changes + two **new** components: `Wordmark.tsx`, `HUDStrip.tsx`.
- Preserve all `aria-*`, focus, keyboard (Space) behavior.

---

## 2. Current repo delta (baseline)

Coordinator should skim once:

| Area | V1 (current `src/`) | V2 (design pack) |
|------|---------------------|------------------|
| Tokens | `--magik-*`, hex colors | `--m8-*`, oklch palette in `tokens.css` |
| Fonts | Bebas Neue + DM Sans | VT323 + Oswald (+ system stacks) |
| Header | `<h1>Magik 8</h1>` centered | `<Wordmark />` left + `<MuteToggle />` right |
| HUD | none | `<HUDStrip />` — `sesh NNN / pack [STATUS]` |
| Ball | single radial gradient | 5-layer sphere stack + contact shadow |
| Triangle | simple fill + motion div | SVG bezel + ink clip + meniscus |
| CTA | rounded pill | rectangular + ASCII corners `┌ ┐ └ ┘` |
| Mute | emoji | inline SVG |
| Stage | flat bg | grain + vignette utilities on `<main>` |
| Share card | gradient hero layout | wordmark + large ball + Oswald answer + HUD footer |

**Files using `--magik-*` today:** `App.tsx`, all listed components, `index.css`. Phase D1 must rename project-wide.

---

## 3. Pre-flight — Phase 0 (Coordinator only)

**Objective:** Unblock visual QA and align repo docs before any implementer runs.

### 0.1 Audit design package

```bash
ls -la magik-8_CLAUDE_DESIGN/
ls -la magik-8_CLAUDE_DESIGN/exports/ 2>/dev/null || echo "exports missing"
```

| Check | Pass criteria |
|-------|----------------|
| `docs/DESIGN-V2.md` present | yes |
| `prompts/01`–`06` present | yes |
| `tokens.css`, `magik8-*.jsx` present | yes |
| `exports/*.png` | **Optional but strongly recommended** — if missing, run 0.2 |

### 0.2 Regenerate export PNGs (if `exports/` empty or stale)

Assign a **Design QA** sub-agent (read-only + browser) OR human:

1. Open `magik-8_CLAUDE_DESIGN/index.html` in browser — confirm showroom matches intent.
2. Open `magik-8_CLAUDE_DESIGN/prototype.html` — walk idle → shaking → revealing → answered via Tweaks panel.
3. Open `magik-8_CLAUDE_DESIGN/exports-builder.html` — capture routes documented in that file (`#share`, `#phone`, `#ball`, etc.).
4. Save PNGs into `magik-8_CLAUDE_DESIGN/exports/` using names referenced in `README.md` and `prompts/00-overview.md`.

**Minimum export set for implementers** (if time-boxed):

- `phone-states.png` (or `07-state-*.png`) — **primary screen target**
- `share-card-full.png`
- `04-ball-anatomy.png` / `05-triangle-anatomy.png` (names vary; match prompt files)
- `08-components.png`

> **Note:** Prompt filenames in `00-overview.md` vs `README.md` differ slightly (`03-ball` vs `04-ball`). Coordinator should **publish a canonical map** in `HANDOFF.md` § Design V2 once exports exist.

### 0.3 Promote spec into repo docs (optional but recommended)

```bash
# Coordinator runs after overseer approves V2 text:
cp magik-8_CLAUDE_DESIGN/docs/DESIGN-V2.md docs/DESIGN-V2.md
```

Keep `docs/DESIGN.md` as V1 audit trail; do not delete.

### 0.4 Update `docs/HANDOFF.md`

- Set **Latest handoff** to Phase 0 complete.
- Add **Active locks** table (below).
- Checklist: mark **Design V2** in progress.

### 0.5 Active locks template (Coordinator maintains)

| Phase | Locked paths | Owner |
|-------|--------------|-------|
| D1 | `index.html`, `src/index.css`, token renames in `src/**/*.tsx` | Agent D1 |
| D2 | `src/components/MagikBall.tsx` | Agent D2 |
| D3 | `src/components/AnswerTriangle.tsx` | Agent D3 |
| D4 | `src/App.tsx`, `src/components/{Wordmark,HUDStrip,ThemeChips,ShakeCTA,MuteToggle,PermissionSheet,ShareSheet}.tsx`, `src/index.css` (append) | Agent D4 |
| D5 | `src/components/ShareCard.tsx` | Agent D5 |
| D6 | motion pass on D2–D4 files + `src/index.css` | Agent D6 |
| D7 | `e2e/smoke.spec.ts`, visual spot-check | Agent D7 |

**Rule:** Never run two agents on the same file concurrently.

---

## 4. Sub-agent roster

| ID | Role | Model suggestion | Input files |
|----|------|------------------|-------------|
| **COORD** | Orchestration, locks, HANDOFF | any | This doc + `HANDOFF.md` |
| **D0** | Export regeneration | Composer or human | `exports-builder.html`, `prototype.html` |
| **D1** | Tokens & fonts | Composer 2.5 | `prompts/01-tokens.md`, `tokens.css` |
| **D2** | MagikBall | Composer 2.5 | `prompts/02-ball.md`, `magik8-ball.jsx`, export ball PNGs |
| **D3** | AnswerTriangle | Composer 2.5 | `prompts/03-triangle.md`, `magik8-ball.jsx` |
| **D4** | Chrome + App shell | Composer 2.5 | `prompts/04-chrome.md`, `magik8-chrome.jsx`, `components.css` |
| **D5** | ShareCard | Composer 2.5 | `prompts/05-share-card.md`, `exports/share-card-full.png` |
| **D6** | Motion QA | Composer 2.5 | `prompts/06-motion.md`, `docs/DESIGN-V2.md` §8 |
| **D7** | Tests + automated QA | Composer 2.5 | `e2e/smoke.spec.ts`, `docs/BACKLOG.md` |
| **REV** | Read-only review vs DESIGN-V2 | fast model | diff + `phone-states.png` |

---

## 5. Implementer prompt template (Coordinator pastes per phase)

```markdown
You are Implementer **D{N}** for Magik 8 Design V2 integration.

## Read first (max 5 files)
1. `docs/COORDINATOR-DESIGN-V2-INTEGRATION.md` — § Hard constraints
2. `magik-8_CLAUDE_DESIGN/prompts/0{N}-*.md` — your step (FULL file)
3. `magik-8_CLAUDE_DESIGN/docs/DESIGN-V2.md` — skim relevant sections only
4. Reference JSX: `magik-8_CLAUDE_DESIGN/magik8-*.jsx` as indicated in prompt
5. `docs/HANDOFF.md` — § Latest + locks

## Visual targets
Attach or open: `magik-8_CLAUDE_DESIGN/exports/<files listed in prompt>`
Fallback if PNGs missing: open `magik-8_CLAUDE_DESIGN/prototype.html` and `index.html` locally.

## Task
Execute **only** phase D{N}. Do not start D{N+1}.

## Do NOT change
Oracle machine, sensors, audio, answers data, test logic (except D7).

## Verify
Run commands listed in phase section below.

## Handoff
Post the Handoff block from §7 at end of your work.
```

---

## 6. Phase-by-phase execution

### Phase D1 — Tokens, fonts, grain, global rename

**Prompt source:** `magik-8_CLAUDE_DESIGN/prompts/01-tokens.md`

**Touches:**

- `index.html` — VT323 + Oswald links; remove Bebas/DM Sans
- `src/index.css` — import `tokens.css` content; `.m8-grain`, `.m8-vignette`, reduced-motion block
- **Project-wide:** `--magik-*` → `--m8-*`, `--font-ui` → `--m8-font-ui`, Tailwind arbitrary values `bg-(--magik-*)` → `bg-(--m8-*)`

**Acceptance:**

- [ ] `npm run build` passes
- [ ] `npm test` passes (45 tests) — no logic changes expected
- [ ] Dev server: stage shows grain + vignette; fonts load (swap, no long FOIT)
- [ ] Visual: compare to `exports/05-color-tokens.png` or `index.html` § colors (if export missing)

**Do not yet:** Restyle components beyond token renames (D2–D5 own anatomy).

**Handoff file list:** `index.html`, `src/index.css`, any `src/**/*.tsx` with token renames only.

---

### Phase D2 — MagikBall sphere stack

**Prompt source:** `magik-8_CLAUDE_DESIGN/prompts/02-ball.md`

**Prerequisite:** D1 complete.

**Touches:** `src/components/MagikBall.tsx` only.

**Wire preservation:**

- Keep `useOracle()` phase-driven animations
- Keep button semantics, `shakeOrTap`, focus ring **outside** sphere (`outline-offset`)
- Keep `AnswerTriangle` child slot position
- Idle float / shake wobble per DESIGN-V2 §8

**Reference:** Port structure from `magik8-ball.jsx` → TSX; do not copy prototype-only state toggles.

**Acceptance:**

- [ ] `npm run build && npm test`
- [ ] Manual: idle float, shake rotation (or reduced-motion pulse), "8" field fades on reveal
- [ ] Visual: `exports/03-ball-anatomy.png`, `exports/07-state-*.png` or `phone-states.png`

---

### Phase D3 — AnswerTriangle SVG + ink rise

**Prompt source:** `magik-8_CLAUDE_DESIGN/prompts/03-triangle.md`

**Prerequisite:** D2 complete.

**Touches:** `src/components/AnswerTriangle.tsx` only.

**Wire preservation:**

- `REVEAL_MS = 600` unchanged
- `useReducedMotion` → instant ink + text
- `aria-live="polite"` on answer text
- Easter egg styling branch intact

**Acceptance:**

- [ ] Ritual e2e still passes after D3 (may fail on heading — fixed in D7)
- [ ] Ink rise uses `--m8-ease-ink`; text fade delay ~400ms
- [ ] Visual: `exports/04-triangle-anatomy.png` or `05-triangle-anatomy.png` (per your export map)

---

### Phase D4 — Chrome, header, HUD, sheets (largest phase)

**Prompt source:** `magik-8_CLAUDE_DESIGN/prompts/04-chrome.md`

**Prerequisite:** D3 complete.

**New files:**

- `src/components/Wordmark.tsx`
- `src/components/HUDStrip.tsx`

**Modified:**

- `src/App.tsx` — layout per DESIGN-V2 §5 wireframe; grain/vignette on `<main className="m8-grain m8-vignette">`
- `ThemeChips.tsx`, `ShakeCTA.tsx`, `MuteToggle.tsx`, `PermissionSheet.tsx`, `ShareSheet.tsx`
- Append `.m8-*` component classes to `src/index.css` from `components.css` / prompt

**HUD session counter (display-only):**

- Implement per `04-chrome.md`: `localStorage` key `m8_sesh`, increment when `phase === 'answered'` (in `App.tsx` or `HUDStrip` wrapper)
- **Do not** add fields to `oracleReducer`

**Copy / a11y:**

- Visible labels lowercase: `tap to shake`, `consulting…`, `ask again`
- **Keep** existing `aria-label` strings where e2e/tests depend on them until D7 (e.g. `Ask the oracle again`)

**Acceptance:**

- [ ] Header: Wordmark left, mute right; HUD under header
- [ ] Theme chips: dot + label; amber selected state
- [ ] CTA: ASCII corners, not pill-shaped
- [ ] Mute: SVG only, no emoji
- [ ] Share button visible only when `phase === 'answered'`
- [ ] Visual: `exports/08-components.png`, full screen vs `phone-states.png`

---

### Phase D5 — ShareCard 1080×1920

**Prompt source:** `magik-8_CLAUDE_DESIGN/prompts/05-share-card.md`

**Prerequisite:** D4 complete (Wordmark exists).

**Touches:** `src/components/ShareCard.tsx` primarily.

**Wire preservation:**

- `SHARE_CARD_WIDTH` / `HEIGHT` constants
- `html-to-image` export path in `shareExport.ts` unchanged
- Theme accent on pack label only; ball stays canonical

**Acceptance:**

- [ ] `npm test` — `shareExport.test.ts` still passes
- [ ] Manual: trigger share, inspect PNG composition vs `exports/share-card-full.png`
- [ ] Easter egg variant: amber answer + glow

---

### Phase D6 — Motion verification + reduced-motion

**Prompt source:** `magik-8_CLAUDE_DESIGN/prompts/06-motion.md`

**Prerequisite:** D2–D5 complete.

**Touches:** Light edits only — confirm easing tokens used; fix any drift.

**Checklist (from prompt):**

- [ ] Idle: no float when `prefers-reduced-motion`
- [ ] Shake: opacity pulse only (no rotation)
- [ ] Reveal: instant ink; instant text
- [ ] Permission sheet: instant or fade-only

**Acceptance:**

- [ ] `npm run build && npm test && npm run test:e2e`

---

### Phase D7 — Test alignment + automated QA

**Objective:** Restore green CI after visual breaking changes.

**Known e2e drift:**

| Test | Current expectation | After V2 |
|------|---------------------|----------|
| `loads Magik 8 oracle app` | `getByRole('heading', { name: 'Magik 8' })` | Wordmark may be `<span>` — add `role="img" aria-label="Magik 8"` on Wordmark **or** keep visually hidden `<h1 class="sr-only">` |
| CTA answered | `/ask the oracle again/i` | Keep `aria-label` even if visible text is `ask again` |
| Theme tabs | `Career Coach` | Unchanged (data labels, not chrome copy) |

**Touches:** `e2e/smoke.spec.ts` only (unless unit tests assert CSS variables — grep first).

**Full verify:**

```bash
npm run build
npm test
npm run test:e2e
npm run test:lighthouse   # optional; note perf may shift with grain layers
```

**Manual device matrix** (overseer): iPhone Safari shake ritual lock (FIX-3), audio mute — per `docs/HANDOFF.md`.

---

### Phase D8 — Documentation + ship prep (Coordinator)

1. Update `docs/HANDOFF.md`:
   - Design V2 checklist complete
   - Latest handoff → PHASE-7 / Design V2 complete
   - Lighthouse scores if re-run
2. Update `docs/DESIGN.md` frontmatter: `superseded-by: DESIGN-V2.md`
3. Optional: add `docs/prompts/PHASE-7-design-implement.md` note pointing to this coordinator doc
4. **Do not** delete `magik-8_CLAUDE_DESIGN/` — keep as design archive
5. Queue **Ship** for overseer (Vercel) per existing HANDOFF

---

## 7. Handoff block template (every sub-agent)

```markdown
## Handoff — D{N} Design V2
**Status:** complete | blocked
**Agent:** D{N}
**Changed:** [file list]
**Verified:** build ✓ · test ✓ · e2e ✓ (note partial)
**Visual:** compared to [export PNG or prototype.html state]
**Token migration:** [any stragglers grep `--magik-`]
**Next:** D{N+1} — [one line]
**Blockers:** none | [description]
**Notes for Coordinator:**
- [≤5 bullets]
```

Coordinator merges into `docs/HANDOFF.md` § Latest + clears locks.

---

## 8. Parallelization rules

| Can parallelize | Cannot parallelize |
|-----------------|-------------------|
| D0 exports while D1 starts **only if** D1 does not depend on PNGs | D2 ∥ D3 (both touch ball/triangle parent-child — sequence D2→D3) |
| REV review after each phase | D4 ∥ D5 (ShareCard needs Wordmark from D4) |
| Human device QA during D6–D7 | Any two agents on `App.tsx` |

**Recommended critical path:** `D0 (optional) → D1 → D2 → D3 → D4 → D5 → D6 → D7 → D8`

---

## 9. Verification matrix

| Gate | Command / action | Owner |
|------|------------------|-------|
| Build | `npm run build` | every Dn |
| Unit | `npm test` | every Dn |
| E2E | `npm run test:e2e` | D3+, required D7 |
| Lighthouse | `npm run test:lighthouse` | D7 optional |
| Visual | Side-by-side with `exports/phone-states.png` | D4, D7 |
| A11y spot | Answer contrast on cobalt (spec: ~8.9:1) | D3, REV |
| Ritual lock | Shake only starts from idle | manual D7 |
| Reduced motion | OS setting + walk ritual | D6 |

---

## 10. Risk register

| Risk | Mitigation |
|------|------------|
| **Missing `exports/`** | Phase 0.2; use `prototype.html` as fallback target |
| **Incomplete design refactor** | Coordinator records "design revision" in HANDOFF; re-run D0.2 after design lead updates JSX |
| **GPU cost (5 sphere layers + grain)** | Profile on mid Android; drop secondary specular per DESIGN-V2 §12 |
| **e2e breaks on heading** | D7 explicit Wordmark a11y strategy |
| **Token rename missed** | After D1: `rg '--magik-' src/` must return empty |
| **Scope creep into oracle** | REV agent rejects any diff under `hooks/useOracleMachine.ts` |
| **Prompt vs README export names** | Coordinator publishes canonical PNG map in HANDOFF after D0 |

---

## 11. Quick reference — design pack file map

```
magik-8_CLAUDE_DESIGN/
├── README.md                 ← start here
├── HANDOFF-PROMPT.md         ← Claude Design chat context (not for implementers)
├── docs/DESIGN-V2.md         ← canonical spec
├── prompts/
│   ├── 00-overview.md
│   ├── 01-tokens.md          → D1
│   ├── 02-ball.md            → D2
│   ├── 03-triangle.md        → D3
│   ├── 04-chrome.md          → D4
│   ├── 05-share-card.md      → D5
│   └── 06-motion.md          → D6
├── tokens.css                → D1
├── components.css            → D1/D4
├── magik8-ball.jsx           → D2/D3
├── magik8-chrome.jsx         → D4/D5
├── index.html                ← showroom QA
├── prototype.html            ← state QA
├── exports-builder.html      ← PNG regeneration
└── exports/                  ← visual acceptance (may be empty)
```

---

## 12. Coordinator kickoff checklist

- [x] Read `magik-8_CLAUDE_DESIGN/README.md` + `docs/DESIGN-V2.md` (skim)
- [x] Run Phase 0 audit; schedule D0 if exports missing
- [x] Copy `DESIGN-V2.md` to `docs/`
- [x] Update `HANDOFF.md` locks + Design V2 complete
- [x] Spawn **D1** with implementer template (§5)
- [x] After each Dn handoff: `rg '--magik-' src/` until clean
- [x] After D4: optional **REV** pass vs `phone-states.png`
- [x] Run D7 before marking complete
- [x] Phase D8 doc updates → notify overseer for Ship

---

## 13. One-line mission for Coordinator chat

> Integrate `magik-8_CLAUDE_DESIGN/` into the Magik 8 repo by running sub-agents **D1→D7** in order using the matching `prompts/0N-*.md` files, enforcing visual-only scope, regenerating `exports/` if missing, and updating `docs/HANDOFF.md` at every boundary — full playbook in `docs/COORDINATOR-DESIGN-V2-INTEGRATION.md`.

---

*End of coordinator plan.*
