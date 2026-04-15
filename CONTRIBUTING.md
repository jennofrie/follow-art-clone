# Contributing

This repo is a static clone produced by a mirror-first workflow. Most improvements fall into one of three categories:

## 1. Adding a new route

1. In the recon workspace (outside this repo), run the Playwright route enumerator against the new URL.
2. Copy the produced `index.html` into this repo at the matching route path.
3. Make sure `assets/harden.js` is referenced as the first `<script>` in `<head>`.
4. Run `scripts/validate-01-local.mjs` in the recon workspace against `http://127.0.0.1:8123/`.

## 2. Updating an api-cache snapshot

The 3 cached API responses live in `assets/api-cache/`. To refresh:

```bash
# In the recon workspace
node scripts/recon-04-payloads-and-apis.mjs
cp playwright/api2-snapshots/*thread_list*.json   ../follow-art-clone/assets/api-cache/community-threads.json
cp playwright/api2-snapshots/*form_data*.json     ../follow-art-clone/assets/api-cache/form-data-countries.json
cp playwright/api2-snapshots/*location*.json      ../follow-art-clone/assets/api-cache/location.json
```

Commit and push — Netlify will redeploy automatically.

## 3. Adjusting the runtime interceptor

Edit `assets/harden.js`. Guidelines:

- Never break early-init for `window.__NUXT__.config.app.baseURL` — the main chunk will throw.
- Add new API stubs to `API_CACHE` (for files on disk) or `EMPTY_STUBS` (for inline JSON returns).
- Keep `TRACKER_RE` permissive — false positives on trackers are fine, false negatives leak analytics.
- After edits, run:

```bash
node --check assets/harden.js
# then restart the local server and re-validate
```

## Commit messages

Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.

## What NOT to contribute

- Raw photo/video uploads from the original follow.art — these belong to FOLLOW.ART
- Any backend code — this repo is static-only by design
- Analytics, trackers, or fingerprinting scripts
