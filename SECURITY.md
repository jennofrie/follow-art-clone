# Security

## Reporting

This is a mirror-style archival clone — there is no backend, no user accounts, no data collected.

If you find a security issue in **this clone's** static output (e.g. leaked credentials in files, an XSS vector introduced by the hardening rewrite), please open a GitHub issue on `jennofrie/follow-art-clone`.

For security issues with the **original** follow.art platform, please contact FOLLOW.ART directly.

## Secrets

This repository **MUST NOT** contain any API keys, tokens, or credentials. The runtime interceptor (`assets/harden.js`) stubs out every call that would require one. If you find a secret committed here, file an issue and it will be rotated and force-removed from history.

## External requests a visitor's browser still makes

After deployment, a visitor's browser will still contact:

- `player.vimeo.com` — for the homepage hero video iframe (unavoidable short of self-hosting the video)
- `widget.trustpilot.com` — the pricing page shows a Trustpilot embed. The loader script was stripped; the iframe itself is served from Trustpilot.
- `www.google.com` + `www.gstatic.com` + `csp.withgoogle.com` — reCAPTCHA frames on `/signin` and `/signup`. The iframes load but our interceptor blocks any token submission.

No tracker JS from Google Tag Manager, Google Analytics, Facebook Pixel, or Cloudflare Insights is loaded or executed.

## Content Security Policy

Not enforced. If stricter isolation is required, add a `Content-Security-Policy` header via `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-src 'self' https://player.vimeo.com https://widget.trustpilot.com https://www.google.com; style-src 'self' 'unsafe-inline';"
```
