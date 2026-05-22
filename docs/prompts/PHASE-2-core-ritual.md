# Agent Prompt — PHASE-2 Core Ritual

**Role:** Implementer (UI Core)  
**Parallel with:** PHASE-3 only after PHASE-1 merged  
**Read:** `docs/HANDOFF.md`, `docs/DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/ANSWERS.md` (schema + implement data file)

## Task

Build oracle ritual without real shake yet — wire **tap/Space** to state machine.

## Deliverables

- `src/data/answers.ts` from ANSWERS.md (all 3 packs)
- `src/lib/pickAnswer.ts`, `src/lib/rng.ts`
- `src/hooks/useOracleMachine.ts`
- Components: `MagikBall`, `AnswerTriangle`, `ThemeChips`, `ShakeCTA` (dispatches tap only)
- REQ-001, REQ-010, REQ-015, REQ-020, REQ-032 (tap/space), REQ-070 (aria-live)
- Vitest: state transitions + pickAnswer uniform index

## Interface for PHASE-3

Export `onShakeDetected()` callback prop or context — Sensors agent will call it later.

## Do not edit

`useShake.ts` (PHASE-3 owns)

## Handoff

List files for PHASE-3 integration point.
