# Agent Prompt — PHASE-7 Design Implementation

> **Note:** Design V2 was implemented via the Claude Design pack and sub-phases **D1–D8**. Use [`docs/COORDINATOR-DESIGN-V2-INTEGRATION.md`](../COORDINATOR-DESIGN-V2-INTEGRATION.md) and `magik-8_CLAUDE_DESIGN/prompts/` as the canonical runbook (this file is the original single-pass prompt).

**Role:** Implementer (visual only)  
**Prerequisite:** Overseer approved **`docs/DESIGN-V2.md`** from Design Agent chat  
**Read:** `docs/DESIGN-V2.md`, `docs/HANDOFF.md`, `docs/DESIGN.md` (diff only)

## Task

Apply DESIGN-V2 to the live app:

- `src/index.css` — tokens, fonts, global grain/vignette
- `src/components/MagikBall.tsx`, `AnswerTriangle.tsx`, `ThemeChips.tsx`, `ShakeCTA.tsx`, `PermissionSheet.tsx`, `ShareCard.tsx`, `MuteToggle.tsx`, `ShareSheet.tsx`, `App.tsx`
- `index.html` — font preloads
- `public/` — any raster assets listed in DESIGN-V2 inventory

## Do NOT

- Change `useOracleMachine`, `useShake`, or ritual timing unless DESIGN-V2 explicitly requests a motion tweak **and** overseer approved
- Run deploy CLI
- Edit `docs/DESIGN-V2.md` (design lead owns spec)

## Verify

```bash
npm run build && npm test && npm run test:e2e
```

Manual: quick iPhone pass — ritual lock still works.

## Handoff

```markdown
## Handoff — PHASE-7
**Status:** complete
**Changed:** [files]
**Verified:** build ✓ · test ✓ · e2e ✓
**Screenshots:** [optional paths]
**Next:** Ship (overseer) or BACKLOG P2 perf items
```
