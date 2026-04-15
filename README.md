# follow-art-clone

High-fidelity static mirror of [follow.art](https://follow.art/) — a professional network for curators and artists — produced via a mirror-first, runtime-preservation workflow.

- **Target:** https://follow.art/
- **Framework detected:** Nuxt (Vue), Lenis smooth scroll, WebGL + canvas
- **Approach:** Mirror the SSR HTML + all `/_nuxt/` chunks, preserve the runtime bundle as-is, intercept dynamic API calls with cached JSON stubs.
- **Deploy:** Static — Netlify-ready (repo root is the publish root).

## Live behavior preserved

- Nuxt SSR hydration via inline `__NUXT__` config + `data-nuxt-data` payload
- All `/_nuxt/` JS chunks and CSS (97 JS + 52 CSS) served as-is
- 6 `<canvas>` elements on the homepage (WebGL-driven)
- Lenis smooth scroll
- All `/_ipx/` (Nuxt Image) variants preserved with correct `&`-separated parameter directory names
- Cloudflare image resizer paths (`/cdn-cgi/image/width=...,format=webp,...`) preserved

## What was removed

- Google Tag Manager, Google Analytics 4, Google Adsense
- Facebook Pixel
- Trustpilot widget loader
- Cloudflare Insights beacon
- reCAPTCHA iframes are visible on `/signin` and `/signup` but intercepted at the fetch layer so no data leaves the page

## Runtime interceptor

`/assets/harden.js` is injected as the first `<script>` in every HTML `<head>`. It:

1. Serves cached JSON from `/assets/api-cache/*` for the discovered follow.art API endpoints:
   - `/api2/community/thread/list` → community feed snapshot
   - `/api2/form/data` → country list
   - `/api2/location` → geoip location
2. Returns a valid Nuxt payload stub for any `/_payload.json` request
3. Returns empty `{data:[],items:[],meta:{total:0}}` for any other `/api2/*` call
4. Swallows tracker beacons (GTM, GA, FB, Adsense, Trustpilot, Cloudflare Insights, reCAPTCHA)
5. Neutralizes `<form>` submissions on `/signin` and `/signup` (shows an alert instead of a POST)
6. Sets `window.__NUXT__.config.app.baseURL` defaults so the main chunk hydrates without errors

## Running locally

```bash
python3 -m http.server 8123 --bind 127.0.0.1
open http://127.0.0.1:8123/
```

Any static HTTP server that serves `index.html` for directory requests works. For full Netlify redirect semantics:

```bash
npx serve .
# or
netlify dev
```

## Deploying to Netlify

Connect the GitHub repo to Netlify. The included `netlify.toml` sets `publish = "."` and configures cache headers for `/_nuxt/*`, `/_ipx/*`, and `/cdn-cgi/image/*` paths. The `_redirects` file provides a SPA fallback to `/index.html` for any unknown client-side route.

No build step is required — this is a pre-built static mirror.

## Routes

| Route | Public | Parity notes |
|-------|--------|--------------|
| `/` | Yes | Homepage. 6 canvases, 1 Vimeo iframe. Hero video `fa_homepage_comp.mp4` 404s on origin — accepted. |
| `/about` | Yes | Team grid, timeline. Full fidelity. |
| `/community-board` | Yes | Thread feed is a **static snapshot** from the moment of cloning — content does not refresh. |
| `/nexus-card` | Yes | Card preview. Canvas-driven animation preserved. |
| `/pricing` | Yes | Full fidelity. Trustpilot widget loads from origin domain. |
| `/faq` | Yes | Full fidelity. |
| `/gift-card` | Yes | Full fidelity. |
| `/cookies-policy` | Yes | Full fidelity. |
| `/privacy-policy` | Yes | Full fidelity. |
| `/terms-and-conditions` | Yes | Full fidelity. |
| `/signin` | Shell only | Form submit disabled. reCAPTCHA iframes visible but non-functional. |
| `/signup` | Shell only | Same as `/signin`. |

## Structure

```
.
├── index.html                  — /
├── about/index.html            — /about
├── …                           — each route as a directory
├── _nuxt/                      — Nuxt bundle chunks (JS + CSS)
├── _ipx/                       — Nuxt Image variants (original + resized)
├── cdn-cgi/image/              — Cloudflare image resizer copies
├── assets/
│   ├── harden.js               — runtime interceptor
│   └── api-cache/              — cached API responses
├── fonts/                      — self-hosted fonts
├── images/                     — raw static images
├── netlify.toml                — publish + cache headers
└── _redirects                  — SPA fallback
```

## Known limitations

See `QUALITY_CHECKLIST.md` for the full parity report and a list of accepted gaps.

## License

Content mirrored for archival / educational reference. Original design, copy, and imagery remain © FOLLOW.ART.
