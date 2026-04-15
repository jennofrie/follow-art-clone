# Changelog

## 2026-04-15 — initial release

- Cloned follow.art public marketing surface (12 routes) via mirror-first workflow
- Preserved Nuxt runtime (97 JS chunks + 52 CSS + full `_ipx` image variants)
- Added `assets/harden.js` runtime interceptor for `_payload.json`, `/api2/*`, `/api/_nuxt_icon/*`, `/api2-mock/*`, tracker beacons, and Nuxt config defaults
- Cached 3 discovered `/api2/*` responses into `assets/api-cache/`
- Restored `&`-separated `/_ipx/*` directory names and `=`-separated `/cdn-cgi/image/*` directory names after mirror-script query-char mangling
- Emitted Netlify `_redirects` SPA fallback and `netlify.toml` cache headers
- Stripped GTM, GA4, FB Pixel, Adsense, Trustpilot loader, Cloudflare Insights, DataDog RUM, reCAPTCHA client-side calls
- Validated: 12/12 routes HTTP 200, 0 page errors, 4 explainable 404s (all origin-side)
