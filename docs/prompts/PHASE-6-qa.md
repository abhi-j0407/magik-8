# Agent Prompt — PHASE-6 QA

**Role:** Reviewer + Implementer (P0 fixes only)  
**Read:** `docs/HANDOFF.md`, `docs/SENSORS.md` (§ QA matrix), `docs/PRD.md` (acceptance)

## Task

1. Run manual QA matrix on real iPhone + Android if available (use `npm run dev:https` on LAN).
2. Lighthouse mobile — run against `npm run preview` or local HTTPS dev URL; document scores in HANDOFF § QA results.
3. Playwright smoke (if not present, add minimal): load app, tap reveal, theme switch.
4. Fix only **P0** bugs; defer P2 to `docs/BACKLOG.md` (create if needed).

## Do NOT

- Run production deploy or `vercel login` / `vercel deploy`
- Block PHASE-6 on `deploy_url` being null — production URL is **overseer-only** after repo is connected to Vercel

## Output

- QA table filled in `docs/SENSORS.md` or HANDOFF appendix
- Lighthouse scores noted in handoff block
- `docs/BACKLOG.md` optional for non-blockers (UI polish, etc.)

## Handoff

Mark PHASE-6 complete when QA matrix + Lighthouse + tests pass. **deploy_url** is not required for phase completion.
