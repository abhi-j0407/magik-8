# Agent Prompt — FIX-3 iPhone Sensor & Ritual Lock

**Role:** Implementer (hotfix)  
**Runs before:** PHASE-4  
**Read only:** `docs/HANDOFF.md` (§ Latest + checklist), `docs/SENSORS.md`, `src/hooks/useShake.ts`, `src/components/ShakeSensors.tsx`, `src/hooks/useOracleMachine.ts`

**Do not read** full `ANSWERS.md` or `PRD.md` unless a REQ-ID below is unclear.

---

## Context (device QA — iPhone Safari)

Real-device test reported:

1. **Too sensitive** — motion fires repeatedly; user cannot finish shake animation or read the answer.
2. **No ritual lock** — sensor must **not** accept input while a response is in progress (`shaking` → `revealing` → `answered` until user explicitly resets).
3. **UI polish** — **out of scope** for this chat. Do not redesign MagikBall, layout, or tokens.

Coordinator verified PHASE-3 code merge; this fix is a **gate before PHASE-4**.

---

## Root cause hints (investigate, do not assume)

| Symptom | Likely cause in current code |
|---------|------------------------------|
| Rapid re-triggers | `ShakeSensors` sets `enabled` when `phase === 'answered'` (`ritualReady`), so a new ritual can start while the answer is still visible |
| Instant threshold | During `isShaking`, **any** sample with `magnitude > 15` calls `onThresholdMet` immediately; resting phone + gravity can hover near threshold |
| Weak cooldown | `detectShake` cooldown only applies to **starting** a ritual, not to the full `idle → … → answered` cycle |

Default threshold **15** on L1 `accelerationIncludingGravity` was not validated on iPhone — tune on device.

---

## Task

### 1. Ritual lock (required)

Motion listener and tap/space paths must respect **one ritual at a time**:

| Phase | Accept new shake/tap to start ritual? | Accept threshold to complete shake? |
|-------|--------------------------------------|-------------------------------------|
| `idle` | Yes | No |
| `shaking` | No | Yes (once per ritual) |
| `revealing` | No | No |
| `answered` | No (until `RESET`) | No |

**Implement:**

- Change `ShakeSensors` `enabled` so `devicemotion` is **off** unless `phase === 'shaking'` OR (`phase === 'idle'` **only** for starting a ritual — never while `revealing` or `answered`).
- Ensure `onShakeDetected` / `shakeOrTap` cannot dispatch `SHAKE_OR_TAP` from `answered` without an explicit user **reset** (if reset UX does not exist yet, add minimal reset: tap answer area, “Ask again” control, or reuse existing pattern — keep UI change tiny).
- Harden `useOracleMachine`: `onShakeDetected` should no-op unless `phase === 'idle'` (defense in depth).

### 2. Sensitivity & debouncing (required)

- Tune `SHAKE_THRESHOLD` and/or detection so a **deliberate shake** completes the ritual, not pocket jitter or gravity noise.
- Consider (pick one, document choice in handoff):
  - **Delta / jerk:** compare magnitude to a short rolling baseline or previous sample spike.
  - **Option B:** `Math.hypot(x,y,z)` with a higher threshold (see SENSORS.md).
  - **Stricter cooldown** after a ritual completes (`answered` → next start), e.g. 1500–2500 ms minimum.
- During `isShaking`, do **not** fire `onThresholdMet` on the first frame above threshold; require sustained spike, debounce, or second peak after ritual start (document threshold used on iPhone).

**Do not** change `SHAKE_DURATION_MS` or MagikBall / motion animation timings without Coordinator approval.

### 3. Tests (required)

- Extend `useShake.test.ts` (or add `ritualLock.test.ts`) for:
  - Cooldown / debounce edges
  - Pure helper for “busy” phases if extracted
- Add oracle machine test: `SHAKE_OR_TAP` ignored when `phase` is `revealing` or `answered` (unless your reset flow intentionally allows answered → idle first).

### 4. Docs touch (minimal)

- If default constants change, update defaults table in `docs/SENSORS.md` **only** the numeric defaults row.
- Do **not** edit `HANDOFF.md` (Coordinator owns it).

---

## Files you may edit

- `src/hooks/useShake.ts` (+ tests)
- `src/components/ShakeSensors.tsx`
- `src/hooks/useOracleMachine.ts` (+ `oracleMachine.test.ts`)
- `src/context/OracleContext.tsx` (only if API surface changes)
- `src/components/ShakeCTA.tsx` (only to respect ritual lock)
- `docs/SENSORS.md` (threshold/cooldown defaults only)

**Do not edit:** theme/audio/easter egg files, `MagikBall.tsx` animation curves, `docs/prompts/PHASE-4-polish.md`.

---

## Acceptance (must pass)

- [ ] `npm run build` ✓
- [ ] `npm test` ✓ (count ≥ prior 23)
- [ ] iPhone Safari: one shake → one full ritual → answer stays readable until user resets
- [ ] No motion-triggered ritual during `revealing` or `answered`
- [ ] REQ-030, REQ-031, REQ-032 still satisfied (permission + tap fallback)
- [ ] Note in handoff: final `threshold`, `cooldownMs`, and detection strategy used on iPhone

---

## Verification on device (implementer or human)

```bash
npm run dev:https
```

Open LAN URL on iPhone → grant motion → perform **one** deliberate shake → confirm animation completes → answer visible → **no** auto-retrigger until reset.

---

## Handoff block (required)

```markdown
## Handoff — FIX-3
**Status:** complete | blocked
**Agent:** implementer (FIX-3 sensors)
**Changed:** [file list]
**Verified:** npm run build ✓ · npm test ✓ (N) · iPhone manual: pass | fail [notes]
**Tuning:** threshold=… · cooldownMs=… · strategy=…
**Acceptance:** ritual lock + REQ-030/031/032
**Next:** PHASE-4 — useAudio, easter eggs, polish (UI still deferred)
**Blockers:** none | [description]
```

Return this block to the **Coordinator** chat; do not start PHASE-4 in the same chat.
