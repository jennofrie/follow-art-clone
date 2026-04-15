# Deployment

## Target: Netlify (static, no build)

1. Create a new Netlify site, pointed at the `jennofrie/follow-art-clone` GitHub repo.
2. Set:
   - **Build command:** *(empty)*
   - **Publish directory:** `.`
3. Deploy.

The included `netlify.toml` handles cache headers; `_redirects` provides the SPA fallback.

## Local preview

```bash
python3 -m http.server 8123 --bind 127.0.0.1
open http://127.0.0.1:8123/
```

For Netlify-identical behavior (including `_redirects`):

```bash
npx netlify dev
```

## Cache headers applied

| Path | `Cache-Control` |
|------|----------------|
| `/_nuxt/*` | `public, max-age=31536000, immutable` |
| `/_ipx/*`  | `public, max-age=31536000, immutable` |
| `/cdn-cgi/image/*` | `public, max-age=31536000, immutable` |
| `/*` | default + `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` |

## SSL

Netlify issues a free Let's Encrypt cert automatically. HTTPS is mandatory — harden.js uses `credentials: 'include'` for same-origin fetches and `fetch()` API is always HTTPS in modern browsers.

## Post-deploy verification

```bash
# Replace with your Netlify URL
BASE=https://follow-art-clone.netlify.app

for route in / /about /community-board /nexus-card /pricing /faq /gift-card /cookies-policy /privacy-policy /terms-and-conditions /signin /signup; do
  curl -s -o /dev/null -w "%{http_code}  %-30s\n" "$BASE$route" "$route"
done

# Expected: all routes 200
```

Then open the site in a browser and confirm:
- No `net::` errors in the console (except intentional tracker swallows that log 204)
- `[follow.art-clone] harden.js active` appears in console
- `window.__FOLLOW_ART_HARDENED__` is `true`

## Rollback

Netlify keeps every deploy as an immutable artifact. Use the Netlify UI **Deploys → Select a working deploy → Publish deploy** to roll back.
