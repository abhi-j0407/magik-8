# Deploy on Vercel (personal account)

**Target:** [abhij0407’s projects](https://vercel.com/abhij0407s-projects) on Vercel (personal account / team dashboard).

**Repo:** `abhi-j0407/magik-8` — production branch **`main`**.

[`vercel.json`](../vercel.json) already sets root build: `npm run build`, output `dist`, framework **Vite**. No env vars for v1.

---

## Steps (dashboard only)

1. Sign in at [vercel.com](https://vercel.com) as the owner of **`abhij0407s-projects`**.
2. Open your team dashboard: **[vercel.com/abhij0407s-projects](https://vercel.com/abhij0407s-projects)** (or **Overview** → pick that team).
3. Click **Add New… → Project**.
4. Under **Import Git Repository**, choose **GitHub**. If prompted, authorize the Vercel GitHub App and grant access to **`abhi-j0407/magik-8`** (or “All repositories” if you prefer).
5. Find **magik-8**, click **Import**.
6. **Confirm scope:** the page should say the project belongs to **`abhij0407s-projects`** (not a work/org team). Adjust the team picker at the top if needed.
7. **Configure project** (often auto-filled):
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** default (`npm install`)
8. Open **Deploy** advanced / Git → set **Production Branch** to **`main`** if it is not already.
9. **Environment Variables:** leave empty (none required).
10. Click **Deploy**. Wait for the build to finish.
11. Copy the **Production** domain (e.g. `magik-8-xxxx.vercel.app` or assigned name). Open it over **HTTPS**.
12. In this repo, update **`docs/HANDOFF.md`** frontmatter: set `deploy_url` to `https://<your-production-domain>`, and paste the URL in § Deploy → URL.

---

## After deploy (verification)

See ship checklist in [`HANDOFF.md`](./HANDOFF.md) § QA / [`BACKLOG.md`](./BACKLOG.md) — production HTTPS: ritual (tap/shake), PWA/manifest + service worker, share PNG, mute/SFX after gesture.

**Lighthouse / PWA on production:** Chrome DevTools → Lighthouse on your **HTTPS prod URL**, or use [Google PageSpeed Insights](https://pagespeed.web.dev/) with that URL. The repo [`scripts/lighthouse.mjs`](../scripts/lighthouse.mjs) targets a **local** `vite preview` only (does not accept a prod URL unless you extend it).


---

## GitHub: default branch

If **`main`** is not the default branch on GitHub yet:

- **GitHub:** repo **Settings → General → Default branch** → select **`main`**, Save.

---

## Troubleshooting

- **403 cloning / push locally:** Prefer SSH — `git remote set-url origin git@github.com:abhi-j0407/magik-8.git`
- **Build fails:** Check build logs on the failed deployment; ensure Node resolves (Vercel default is usually fine for Vite 6).
