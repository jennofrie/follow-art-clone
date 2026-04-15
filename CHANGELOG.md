# Changelog

## 2026-04-15 — parity fix (93.76% avg)

- Fixed `/cookies-policy`, `/privacy-policy`, `/terms-and-conditions` rendering as blank pages
- Root cause: Nuxt 3 `_payload.json` uses **devalue** format, not plain JSON. My stub returned `{data:{},state:{}}` which threw `Invalid input` in the parser, which cascaded into `Nm: Page Not Found` in the policy page `setup()` hook
- Fix: captured real devalue payloads per-route (cookies/privacy/terms got full content inline) + generated empty devalue stubs for routes where the origin 404'd the payload
- Added `/assets/api-cache/payloads/` with 12 per-route payload JSONs
- Added `/assets/api-cache/content-*.json` for `/api2-mock/content?page=*` stubs (extracted from SSR HTML with JSDOM)
- Updated harden.js `fetch`/`XHR` interceptors to route `_payload.json` by slug and `api2-mock/content` by `?page=` query
- Visual parity: policy pages went from **4–7%** to **99.67%**; average now **93.76%**

## 2026-04-15 — initial release

- Cloned follow.art public marketing surface (12 routes) via mirror-first workflow
- Preserved Nuxt runtime (97 JS chunks + 52 CSS + full `_ipx` image variants)
- Added `assets/harden.js` runtime interceptor for `_payload.json`, `/api2/*`, `/api/_nuxt_icon/*`, `/api2-mock/*`, tracker beacons, and Nuxt config defaults
- Cached 3 discovered `/api2/*` responses into `assets/api-cache/`
- Restored `&`-separated `/_ipx/*` directory names and `=`-separated `/cdn-cgi/image/*` directory names after mirror-script query-char mangling
- Emitted Netlify `_redirects` SPA fallback and `netlify.toml` cache headers
- Stripped GTM, GA4, FB Pixel, Adsense, Trustpilot loader, Cloudflare Insights, DataDog RUM, reCAPTCHA client-side calls
- Validated: 12/12 routes HTTP 200, 0 page errors, 4 explainable 404s (all origin-side)
