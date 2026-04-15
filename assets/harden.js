/**
 * follow.art clone — runtime harden / offline interceptor.
 * Inline-loaded before any Nuxt chunk. Wraps fetch + XHR + sendBeacon.
 *
 * Responsibilities:
 *   1. Serve /api2/community/thread/list, /api2/form/data, /api2/location from /assets/api-cache/*
 *   2. Stub /_payload.json responses so client-side SPA nav does not throw
 *   3. Swallow tracker beacons (GTM, GA, Facebook, Trustpilot, Adsense, CF RUM/insights, reCAPTCHA)
 *   4. Neutralize form submissions on /signin and /signup (show an alert instead of a POST)
 */
(function () {
  'use strict';
  if (window.__FOLLOW_ART_HARDENED__) return;
  window.__FOLLOW_ART_HARDENED__ = true;

  // Ensure window.__NUXT__.config exists with safe defaults.
  // The original site inlines this via a <script>; if HTML stripping removed it,
  // this fallback prevents `undefined.baseURL` errors in the main chunk.
  window.__NUXT__ = window.__NUXT__ || {};
  if (!window.__NUXT__.config) {
    window.__NUXT__.config = {
      public: {
        frontendApiBaseUrl: '/',
        cdn: '/',
        host: location.origin,
        passwordMinLength: '',
        passwordMaxLength: '',
        passwordComplexityLevel: '',
        dataDogApplicationId: '',
        dataDogClientToken: '',
        dataDogService: '',
        dataDogEnv: '',
        recaptcha3PublicKey: '',
        googlePlacesApiKey: '',
        facebookAppId: '',
        metapixel: { default: { id: '' } },
        device: { defaultUserAgent: '', enabled: false, refreshOnResize: false },
        gtag: { enabled: false, id: '', config: {}, tags: [], loadingStrategy: 'defer', url: '' }
      },
      app: {
        baseURL: '/',
        buildId: 'c52c3de3-aced-484c-a797-2fd0f99a6ab6',
        buildAssetsDir: '/_nuxt/',
        cdnURL: ''
      }
    };
  }

  var API_CACHE = {
    '/api2/community/thread/list': '/assets/api-cache/community-threads.json',
    '/api2/form/data':             '/assets/api-cache/form-data-countries.json',
    '/api2/location':              '/assets/api-cache/location.json'
  };

  // /api2-mock/content?page=<slug>  →  /assets/api-cache/content-<slug>.json
  // Used by policy pages (cookies-policy, privacy-policy, terms-and-conditions).
  // Nuxt throws "Page Not Found" if this fetch fails or returns a shape it can't destructure,
  // so we must return the full {title, content, lastUpdated, metaTitle, metaDescription, metaKeywords} object.
  function mockContentCache(urlStr) {
    var u;
    try { u = new URL(urlStr, location.href); } catch (e) { return null; }
    if (u.pathname !== '/api2-mock/content') return null;
    var page = u.searchParams.get('page');
    if (!page) return null;
    return '/assets/api-cache/content-' + page + '.json';
  }

  // Endpoints that should return a stable empty response (not loaded from disk).
  // Pattern → JSON body returned with 200.
  var EMPTY_STUBS = [
    { re: /\/api\/_nuxt_icon\/[^?]+(\?|$)/i,        body: '{"prefix":"","lastModified":0,"icons":{},"width":24,"height":24}' },
    { re: /\/api2\/[^?]+(\?|$)/i,                   body: '{"data":[],"items":[],"meta":{"total":0}}' }
  ];

  // Nuxt 3 payloads use DEVALUE format (not plain JSON) — `{data:{},state:{}}` throws "Invalid input".
  // Baseline empty devalue payload:
  var PAYLOAD_STUB = '[{"data":1,"prerenderedAt":3},["ShallowReactive",2],{},' + Date.now() + ']';

  // Map request URL → on-disk payload file. e.g. /cookies-policy/_payload.json → /assets/api-cache/payloads/cookies-policy-payload.json
  function payloadFileFor(urlStr) {
    try {
      var u = new URL(urlStr, location.href);
      var m = u.pathname.match(/^\/(?:([^/]+)\/)?_payload\.json$/);
      if (!m) return null;
      var slug = m[1] || 'index';
      return '/assets/api-cache/payloads/' + slug + '-payload.json';
    } catch (e) { return null; }
  }

  var TRACKER_RE = /(googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net|connect\.facebook\.net|facebook\.com\/tr|widget\.trustpilot\.com|pagead2\.googlesyndication\.com|gstatic\.com\/recaptcha|google\.com\/recaptcha|google\.com\/ccm|cloudflareinsights\.com|cdn-cgi\/rum|cdn-cgi\/challenge-platform\/h\/g\/(jsd|cv|sn|world))/i;

  function pathOf(urlStr) {
    try { return new URL(urlStr, location.href).pathname; } catch (e) { return urlStr; }
  }
  function matchApiCache(urlStr) {
    var p = pathOf(urlStr);
    for (var pat in API_CACHE) {
      if (p === pat || p.indexOf(pat) === 0) return API_CACHE[pat];
    }
    return null;
  }
  function matchEmptyStub(urlStr) {
    for (var i = 0; i < EMPTY_STUBS.length; i++) {
      if (EMPTY_STUBS[i].re.test(urlStr)) return EMPTY_STUBS[i].body;
    }
    return null;
  }
  function isPayload(urlStr) {
    return /_payload\.json(\?|$)/.test(urlStr);
  }

  // ---- fetch interceptor ----
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    if (TRACKER_RE.test(url)) {
      return Promise.resolve(new Response('', { status: 204 }));
    }
    var cache = matchApiCache(url);
    if (cache) {
      return origFetch(cache).catch(function () {
        return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
      });
    }
    var mockContent = mockContentCache(url);
    if (mockContent) {
      return origFetch(mockContent).catch(function () {
        return new Response('{"title":"","content":"","lastUpdated":"","metaTitle":"","metaDescription":"","metaKeywords":""}', { status: 200, headers: { 'content-type': 'application/json' } });
      });
    }
    if (isPayload(url)) {
      var pf = payloadFileFor(url);
      if (pf) {
        return origFetch(pf).then(function (r) {
          if (!r.ok) return new Response(PAYLOAD_STUB, { status: 200, headers: { 'content-type': 'application/json' } });
          return r;
        }).catch(function () {
          return new Response(PAYLOAD_STUB, { status: 200, headers: { 'content-type': 'application/json' } });
        });
      }
      return Promise.resolve(new Response(PAYLOAD_STUB, { status: 200, headers: { 'content-type': 'application/json' } }));
    }
    var empty = matchEmptyStub(url);
    if (empty) {
      return Promise.resolve(new Response(empty, { status: 200, headers: { 'content-type': 'application/json' } }));
    }
    return origFetch.apply(this, arguments);
  };

  // ---- XHR interceptor ----
  var origOpen = XMLHttpRequest.prototype.open;
  var origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__harden_url = url;
    this.__harden_method = method;
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    var self = this;
    var url = this.__harden_url || '';
    if (TRACKER_RE.test(url) || isPayload(url) || matchApiCache(url) || matchEmptyStub(url) || mockContentCache(url)) {
      var cache = matchApiCache(url);
      var empty = matchEmptyStub(url);
      var mc = mockContentCache(url);
      var respond = function (text) {
        try {
          Object.defineProperty(self, 'readyState', { value: 4, configurable: true });
          Object.defineProperty(self, 'status', { value: 200, configurable: true });
          Object.defineProperty(self, 'responseText', { value: text, configurable: true });
          Object.defineProperty(self, 'response', { value: text, configurable: true });
          Object.defineProperty(self, 'responseURL', { value: url, configurable: true });
        } catch (e) {}
        if (self.onreadystatechange) self.onreadystatechange();
        if (self.onload) self.onload();
      };
      if (cache) {
        fetch(cache).then(function (r) { return r.text(); }).then(respond).catch(function () { respond('{}'); });
      } else if (mc) {
        fetch(mc).then(function (r) { return r.text(); }).then(respond).catch(function () {
          respond('{"title":"","content":"","lastUpdated":"","metaTitle":"","metaDescription":"","metaKeywords":""}');
        });
      } else if (isPayload(url)) {
        var pf2 = payloadFileFor(url);
        if (pf2) {
          fetch(pf2).then(function (r) { return r.text(); }).then(respond).catch(function () { respond(PAYLOAD_STUB); });
        } else {
          respond(PAYLOAD_STUB);
        }
      } else if (empty) {
        respond(empty);
      } else {
        respond('');
      }
      return;
    }
    return origSend.apply(this, arguments);
  };

  // ---- sendBeacon neutralize ----
  if (navigator.sendBeacon) {
    var origBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url) {
      if (TRACKER_RE.test(url)) return true;
      return origBeacon.apply(navigator, arguments);
    };
  }

  // ---- Neutralize form submissions on auth routes ----
  document.addEventListener('submit', function (e) {
    if (!/^\/sign(in|up)(\/|$)/.test(location.pathname)) return;
    e.preventDefault();
    e.stopPropagation();
    try { alert('This is an offline clone of follow.art. Sign-in and sign-up are non-functional.'); } catch (err) {}
  }, true);

  // ---- Stub common tracker globals ----
  window.dataLayer = window.dataLayer || [];
  var origPush = window.dataLayer.push;
  window.dataLayer.push = function () { return Array.prototype.push.apply(this, arguments); };
  window.gtag = window.gtag || function () {};
  window.fbq   = window.fbq   || function () {};
  window._fbq  = window._fbq  || window.fbq;

  try { console.info('[follow.art-clone] harden.js active'); } catch (e) {}
})();
