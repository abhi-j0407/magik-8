# Agent Prompt — PHASE-3 Sensors

**Role:** Implementer (Sensors)  
**Parallel with:** PHASE-2 after PHASE-1 (merge both before PHASE-4)  
**Read:** `docs/HANDOFF.md`, `docs/SENSORS.md`, `docs/ARCHITECTURE.md` (hooks § only)

## Task

Implement shake detection + iOS permission + haptics. Integrate with existing oracle via `SHAKE_OR_TAP`.

## Deliverables

- `src/hooks/useShake.ts` per SENSORS.md
- `src/hooks/useHaptics.ts`
- `PermissionSheet` component (UX-005)
- Wire shake → same dispatch as ShakeCTA
- REQ-030, REQ-031, REQ-041
- Vitest: shake detection pure function tests

## Do not refactor

MagikBall animation timings — only connect callback.

## Handoff

Note threshold value used on real device if tuned from default 15.
