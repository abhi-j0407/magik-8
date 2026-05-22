# Agent Prompt — PHASE-5 Ship

**Role:** Implementer (PWA + Share)  
**Read:** `docs/HANDOFF.md`, `docs/PRD.md` (REQ-050, REQ-060), `docs/DESIGN.md` (§ Share card)

## Task

- PWA manifest + icons 192/512
- `ShareSheet` + html-to-image 1080×1920
- Web Share + download fallback
- Optional static host config only (e.g. `vercel.json` for SPA rewrites) — **no deploy**

## Do NOT

- Run `vercel login`, `vercel deploy`, `wrangler deploy`, or any production deploy CLI
- Set `deploy_url` in `HANDOFF.md` (human overseer does this **after** GitHub → Vercel connect, post–PHASE-6)
- Treat missing CLI credentials as a blocker

## Verify locally only

```bash
npm run build && npm test
npm run preview   # optional: smoke PWA shell + share in browser
```

## Handoff

Report REQ-050/060 acceptance and file list. Note: **deploy_url remains null** until overseer ships.
