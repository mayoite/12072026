# Site — full acceptance run

**Date:** 2026-07-17  
**Status:** **RUNNING** — 10 agents testing every Site aspect; fix on FAIL  
**Goal:** Nothing left open that unit/browser can close this session

| # | Scope | Status |
|---|--------|--------|
| S1 | SEO robots/sitemap/classification + host probe | **PARTIAL** |
| S2 | Public route matrix (status, redirects, 404) | **PASS** (unit; live OPEN) |
| S3 | Viewport overflow 6-level marketing | **RUNNING** |
| S4 | A11y Playwright smoke | **PASS** (public) |
| S5 | Contact form + customer-query API | **PASS** (unit; SF-09 live OPEN) |
| S6 | Site→Planner entry continuity | **RUNNING** |
| S7 | Product catalog discovery | **RUNNING** |
| S8 | i18n parity | **PASS** |
| S9 | Analytics + consent | **PASS** (unit) |
| S10 | Full site unit suite + layout gates | **RUNNING** |

**Report rule:** update **this file only** under your `## S#` section. No new dated pile. Commands + exits required. Fix FAIL in OWN paths.

Parent will not cancel without owner ask.

## S1 — SEO robots / sitemap / classification + host probe

**Verdict:** **PARTIAL**  
**OWN:** `site/app/robots.ts`, `site/app/sitemap.ts`, `site/lib/siteUrl.ts`, site SEO helpers, related unit tests.  
**Why not PASS:** code + unit contracts green; production hosts are reachable and return valid robots/sitemap bodies, but **live content is stale vs current code** (incomplete `Disallow`, sitemap lists noindex/redirect paths, missing planner/solution paths, no trailing slashes). No invent of production SEO PASS.

### Commands

| Command | Exit | Result |
|---------|------|--------|
| `pnpm --filter oando-site exec vitest run` (8 SEO unit files) | **0** | **93/93** PASS (final re-run after helper fix) |
| Production probe `https://oando.co.in/robots.txt` | HTTP **200** | valid `text/plain`; body present |
| Production probe `https://oando.co.in/sitemap.xml` | HTTP **200** | valid `application/xml` urlset, 31 `<loc>` |
| Production probe `https://www.oando.co.in/robots.txt` | HTTP **200** | same body pattern; Host/Sitemap point to apex |
| Production probe `https://www.oando.co.in/sitemap.xml` | HTTP **200** | same 31 URLs, apex host in `<loc>` |
| `pnpm run check:layout` | **0** | `check-repo-layout OK — no forbidden site/ paths` |

Unit files:

- `tests/unit/app/robots.test.ts`
- `tests/unit/app/sitemap.test.ts`
- `tests/unit/lib/siteUrl.test.ts`
- `tests/unit/features/site/data/routeClassification.test.ts`
- `tests/unit/features/site/data/siteSeoAcceptance.test.ts`
- `tests/unit/features/site/data/seo.test.ts`
- `tests/unit/lib/helpers/seo.test.ts`
- `tests/unit/lib/analytics/seo.test.ts`

### Code honesty (SITE_URL)

| Rule | Status |
|------|--------|
| Default when env empty | `https://oando.co.in` (`site/lib/siteUrl.ts`) |
| Env override | `NEXT_PUBLIC_SITE_URL` preferred over `SITE_URL`; trailing slashes stripped |
| Vercel preview `*.vercel.app` | forced back to production origin (no preview host in robots/sitemap/canonicals) |
| robots / sitemap / classification / routeMetadata | all read `SITE_URL` — no localhost invent for production claims |
| `lib/helpers/seo.ts` legacy `buildProductJsonLd` fallback | now uses `SITE_URL` (was hardcoded string; same default, single source) |

### Production probe detail (2026-07-17 this session)

**robots.txt (apex + www → 200)**

```
User-Agent: *
Allow: /

User-Agent: *
Disallow: /api/

Host: https://oando.co.in
Sitemap: https://oando.co.in/sitemap.xml
```

- Valid robots format; Host + Sitemap use **apex** (honest default).
- **Gap vs code:** live only disallows `/api/`. Code `ROBOTS_DISALLOW_PREFIXES` also expects `/admin/`, `/crm/`, `/ops/`, `/portal/`, `/dashboard/`, `/login/`, `/access/`, `/repo-store/`, `/quote-cart/`, `/tracking/`, `/choose-product/`, `/support-ivr/`, `/planner/canvas/`, `/planner/guest/` — **none present on production**.

**sitemap.xml (apex + www → 200)**

- Well-formed urlset (`<?xml…>`, `<urlset>`, `</urlset>`), 31 URLs, all host `https://oando.co.in`.
- `lastmod` ~ `2026-04-09` (old deploy signature).
- **Includes non-indexable / redirect paths vs current contracts:** `/gallery`, `/imprint`, `/quote-cart`, `/tracking`, `/news`, `/social`, `/faq`.
- **Missing vs current code static set:** planner marketing deep paths (`/planner/help`, `/planner/features`, feature slugs), solution categories (`/solutions/*`), several public indexable statics (e.g. `/planning`, `/templates`, …).
- **Trailing slash:** production `<loc>` omit trailing `/` (except home); code `sitemap.ts` emits trailing `/` with `trailingSlash: true`.

**www vs apex**

- Both hosts return **200** for `/`, `/robots.txt`, `/sitemap.xml` (no forced www→apex or apex→www on those probes).
- Robots on www still advertises Host/Sitemap on **apex** — good intent; dual live hosts remain a residual.

### Fixes applied (OWN)

1. `site/lib/helpers/seo.ts` — legacy single-arg `buildProductJsonLd` origin fallback → `SITE_URL` import (no second hardcoded host source).

No FAIL in robots/sitemap/siteUrl/classification/SEO acceptance unit suites; no further OWN code FAIL to fix this session.

### Residual OPEN

1. **Production deploy lag** — ship current `robots.ts` / `sitemap.ts` / classification so live disallow list and sitemap paths match unit contracts. Owner deploy only.
2. **www dual-host** — both apex and www serve 200; canonical host policy at edge/DNS not closed in OWN code alone.
3. **Browser SEO acceptance** (titles/canonicals/JSON-LD in real HTML) — unit contracts cover builders; live HTML crawl not in this unit probe.
4. **`.env.example`** — no `NEXT_PUBLIC_SITE_URL` / `SITE_URL` documented (docs honesty; not a unit FAIL).

### Files touched

- `E:\12072026\site\lib\helpers\seo.ts`
- `E:\12072026\agent-reports\SITE.md` (this section)

## S2 — Public route matrix

**Status:** **PASS** on unit matrix (OWN). Live HTTP matrix **OPEN** (localhost:3000 down).  
**OWN:** `site/app/(site)/**` redirects/404, `route-contract.json` (read/assert), `features/site/data` navigation + classification, related tests.

### Commands

| Command | Exit | Result |
|---------|------|--------|
| `Invoke-WebRequest http://localhost:3000/ -Method Head` | timeout | Dev server **DOWN** — no live 308/404 probe |
| `pnpm --filter oando-site exec vitest run` (18 S2-related files) | **0** | **104/104** passed |
| `pnpm run check:layout` | **0** | `check-repo-layout OK — no forbidden site/ paths` |

### Unit matrix covered

| Concern | Proof |
|---------|--------|
| Hard redirects (permanent / 308 intent) | `next.config.js` `permanent: true` for catalog, brochure, download-brochure, news, gallery, social, imprint, support-ivr, tracking, products/category/:slug; page modules use `permanentRedirect` (catalog/brochure fixed) |
| Real 404 unknown solutions | `solutions/[category]` `dynamicParams=false` + `notFound()` in page + metadata |
| Real 404 / redirect legacy products/category | page `permanentRedirect` or `notFound()`; config permanent rewrite to `/products/:slug/` |
| No soft-404 commercial metadata | category + product `generateMetadata` now call `notFound()` when missing (empty `{}` removed) |
| No public Admin in nav | `navigation-coverage` + `publicRouteMatrix` assert header/more/CTA/featured/footer/search |
| Route contract | expanded legacy redirect + protectedPrefixes asserts |
| Classification | `/products/category/[slug]` is `redirect` + non-indexable; matcher prefers static segments |

### Fixes applied (FAIL → green)

1. **`catalog` / `brochure` pages** — `redirect()` (soft) → `permanentRedirect()`; removed dead HTML shells.
2. **`routeClassification`** — legacy `/products/category/[slug]` was wrongly `public`+indexable → `redirect`+noindex.
3. **`getRouteClassification` specificity** — `/products/category/seating` was matched as `/products/[category]/[product]`; sort now prefers more static segments.
4. **Category + product `generateMetadata`** — hard-404 unknown; empty catalog → noindex robots (not soft empty public meta).
5. **Tests** — expanded matrix, nav Admin ban, contract, classification; catalog/brochure tests updated.

### Residual OPEN

1. **Live HTTP matrix** — localhost:3000 not up this session. Re-probe 308/404/200 on production or local dev required before browser PASS claim.
2. **Production re-probe** — same as FEATURES S0/S1 (host honesty, redirect status codes).
3. **Content soft-404 quality (SF-19)** — marketing copy depth for hollow historical pages is content review, not route transport; redirects already applied for hollow shells.

### Files touched

- `site/app/(site)/catalog/page.tsx`
- `site/app/(site)/brochure/page.tsx`
- `site/app/(site)/products/[category]/page.tsx`
- `site/app/(site)/products/[category]/[product]/page.tsx`
- `site/features/site/data/routeClassification.ts`
- `site/tests/unit/app/(site)/catalog/page.test.tsx`
- `site/tests/unit/app/(site)/brochure/page.test.tsx`
- `site/tests/unit/app/(site)/products/[category]/page.test.tsx`
- `site/tests/unit/app/(site)/products/[category]/[product]/page.test.tsx`
- `site/tests/unit/features/site/data/routeClassification.test.ts`
- `site/tests/unit/features/site/data/navigation-coverage.test.ts`
- `site/tests/unit/features/site/data/publicRouteMatrix.test.ts` (new)
- `site/tests/unit/config/route-contract.test.ts`

## S4 — A11y Playwright smoke

**Status:** **PASS** on public site routes (OWN).  
**Serious/critical count (public routes):** **0**  
**OWN:** `site/components/**` marketing, `site/features/site`, site a11y e2e only. Planner/admin not fixed.

### Commands

| Command | Exit | Result |
|---------|------|--------|
| `pnpm --filter oando-site run test:a11y` | **1** | 1 passed, 1 failed — failure is **planner** export modal (out of OWN) |
| `pnpm --filter oando-site exec playwright test -c config/build/playwright.config.ts tests/e2e/site-a11y-smoke.spec.ts` | **0** | **10/10** public routes: no critical or serious axe violations |
| `pnpm run check:layout` | **0** | `check-repo-layout OK — no forbidden site/ paths` |

### Public route matrix (`site-a11y-smoke.spec.ts`)

Axe tags: `wcag2a`, `wcag2aa`. Gate: `impact === critical || serious` must be empty.

| Route | Result |
|-------|--------|
| `/` | PASS |
| `/products` | PASS |
| `/products/workstations` | PASS |
| `/products/seating` | PASS |
| `/solutions` | PASS |
| `/contact` | PASS |
| `/about` | PASS |
| `/planning` | PASS |
| `/planner` | PASS |
| `/downloads/` | PASS |

**Blocking violations:** 0 serious, 0 critical.

### `test:a11y` detail (not OWN)

Script runs `tests/e2e/accessibility.spec.ts` (guest planner + export modal), not public site routes.

| Test | Result |
|------|--------|
| guest planner — no auto-detectable a11y issues | PASS (23.2s) |
| export modal — no a11y issues | **FAIL** — `TimeoutError: locator.click` waiting for `getByRole('button', { name: /^Export$/ })` (15s). Never reached axe scan. |

Residual is planner chrome/export control discovery, not a measured a11y violation count. **Out of OWN** — no planner edits by S4.

### Code changes

**None.** Public site a11y gate green; no site component fixes required.

### Files referenced

- `E:\12072026\site\tests\e2e\site-a11y-smoke.spec.ts`
- `E:\12072026\site\tests\e2e\accessibility.spec.ts`
- `E:\12072026\site\package.json` (`test:a11y`)

## S8 — i18n parity

**Status:** **PASS**  
**OWN:** `site/i18n/**` marketing messages only. Planner/Admin English-only UI not touched.

### Commands

| Command | Exit | Result |
|---------|------|--------|
| `pnpm --filter oando-site run check:i18n:parity` | **0** | `check-i18n-key-parity: ok (locales hi, de, es, fr)` |
| `pnpm run check:layout` | **0** | `check-repo-layout OK — no forbidden site/ paths` |

### What the gate checks

Script: `site/scripts/check-i18n-key-parity.mjs`  
Manifest: `site/i18n/marketing-parity-manifest.json`

| Locale | Scope |
|--------|--------|
| `hi` | Wave1 namespaces only: `home`, `about`, `contact`, `products`, `solutions` |
| `de`, `es`, `fr` | All marketing namespaces in manifest (`about` … `home`, 20 namespaces) |

Deep key set equality vs `en` for each required namespace (missing + extra both fail).

### Deep verification (manual, not the gate)

- **hi wave1:** 0 missing / 0 extra vs en  
- **de/es/fr full marketing:** 0 namespace fails vs en  
- **Top-level marketing trees:** present for de/es/fr; hi has wave1 + `common`/`legal`/`news`/`planner`/`workspace` (extra vs wave1 gate, no parity fail)

### Residual (not FAIL)

1. **hi beyond wave1** — missing non-wave1 marketing namespaces (`career`, `downloads`, `gallery`, `planning`, `portfolio`, `projects`, `service`, `showrooms`, `social`, `sustainability`, `tracking`, `trustedBy`, `supportIvr`, etc.). Intentional: manifest `wave1Locales` / `wave1Namespaces` only. Full hi marketing is OPEN product scope, not this gate.
2. **`planner.export.*`** — present only in `en.json` (11 keys). Missing from hi/de/es/fr. **Out of OWN:** Planner is English-only; not in `allMarketingNamespaces`.
3. **Non-marketing namespaces** in message files: `common`, `planner`, `workspace` — not asserted by parity gate.
4. **`site/i18n/pending-translations/`** — still has `*.pending.json` / `*.translated.json` artifacts (de/es/fr). Gate does not read them; committed `messages/{de,es,fr}.json` already satisfy marketing parity.

### Code changes

**None.** No missing-key FAILs; no edits under `site/i18n/`.

### Files referenced

- `E:\12072026\site\i18n\messages\{en,hi,fr,de,es}.json`
- `E:\12072026\site\i18n\marketing-parity-manifest.json`
- `E:\12072026\site\scripts\check-i18n-key-parity.mjs`

## S9 — Analytics + consent

**Status:** **PASS** (unit). Browser production receipt and timed-accept browser remain OPEN (out of unit scope).  
**OWN:** `site/lib/analytics/**`, `site/lib/consent.ts`, consent/analytics components + related tests.

### Commands

| Command | Exit | Result |
|---------|------|--------|
| `pnpm --filter oando-site exec vitest run tests/unit/lib/analytics tests/unit/lib/consent.test.ts tests/unit/components/site/SiteAnalytics.test.tsx tests/unit/components/site/CookieConsentBar.test.tsx tests/unit/components/ui/CookieConsent.test.tsx` | **0** | **13 files / 60 tests** PASS |
| `pnpm --filter oando-site exec vitest run tests/unit/components/ui/TrackedLink.test.tsx tests/unit/components/ui/WhatsAppCTA.test.tsx tests/unit/components/site/RouteChrome.test.tsx` | **0** | **3 files / 15 tests** PASS |
| `pnpm run check:layout` | **1** | Pre-existing: `results/playwright-report/data/*.md` forbidden MD under results/ — **not OWN**, not created by S9 |

### Behavior verified (unit)

| Rule | Proof |
|------|--------|
| No emit before consent | `emitSiteEvent`, `trackConversionEvent`, KPI emitters, VA/SI `beforeSend` all no-op transport without `accepted` |
| Queue while undecided | CTA / PAGE_VIEW / PLANNER_ENTRY enqueue; flush after accept |
| Reject drops | After `rejected`, no emit and no queue |
| Flush never without accept | `eventQueue.flushSiteEventQueue` returns 0 without consent / on reject |
| CookieConsentBar | Accept + timed auto-accept call `flushAnalyticsAfterConsent`; reject does not |

### FAIL fixed (OWN)

**Bug:** `trackConversionEvent` returned early without consent and **did not queue**.  
`SiteConversionTracker` fires once per path → first `page_view` / `planner_entry` were lost if Accept came after load.  
Bar was designed to flush queued events after Accept.

**Fix:**

1. `conversionContract.ts` — undecided consent → queue via `emitSiteEvent` (no dedupe burn); reject → drop.
2. `siteEvents.ts` / `kpiEvents.ts` — queue only when `!hasConsentChoice()`; reject does not fill the queue.
3. New `eventQueue.test.ts`; strengthened PAGE_VIEW / CTA / PLANNER_ENTRY + reject paths in siteEvents + conversionContract tests.

### Code changes

| File | Change |
|------|--------|
| `site/lib/analytics/conversionContract.ts` | Queue PAGE_VIEW/PLANNER_ENTRY pre-choice; drop on reject |
| `site/lib/analytics/siteEvents.ts` | Queue only while consent undecided |
| `site/lib/analytics/kpiEvents.ts` | Same reject-vs-undecided rule |
| `site/tests/unit/lib/analytics/eventQueue.test.ts` | **New** — flush gates, cap, transport-not-ready |
| `site/tests/unit/lib/analytics/siteEvents.test.ts` | PAGE_VIEW / CTA / PLANNER_ENTRY queue+flush; reject drop |
| `site/tests/unit/lib/analytics/conversionContract.test.ts` | Queue+flush + reject + no dedupe burn |
| `site/tests/unit/lib/analytics/kpiEvents.test.ts` | Reject path |

### Residual OPEN (not unit FAIL)

1. **Production analytics receipt** (`window.va` / Vercel dashboard) — needs staging/prod sink; owner accept.
2. **Timed accept browser** (SF-18) — unit covers 5s timer + flush mock; real browser journey OPEN.
3. **`check:layout`** fail from `results/playwright-report/**/*.md` — other track artifact; S10/tooling.

### Not claimed

- Live network proof of events in Vercel Analytics.
- Browser consent journey (only unit + component).

## S5 — Contact form + customer-query API

**Status:** **PASS** (unit + route integration mocks). **SF-09 live delivery OPEN** (no safe live POST this session).  
**OWN:** `components/contact/*`, `components/shared/ContactTeaser.tsx`, `app/api/customer-queries/route.ts` (public POST), `features/shared/api/readApiErrorMessage.ts`, related tests. Manage/admin inbox out of Site marketing PASS.

### Commands

| Command | Exit | Result |
|---------|------|--------|
| `pnpm --filter oando-site exec vitest run` (7 OWN files below) | **0** | **53/53** PASS |
| `pnpm run check:layout` | **0** | `check-repo-layout OK — no forbidden site/ paths` |
| Live `POST /api/customer-queries` | **skipped** | Env has Supabase service keys; inserting real `customer_queries` rows against shared project is **not safe** without owner staging flag. SF-09 stays OPEN. |

Unit files run:

- `tests/unit/components/contact/CustomerQueryForm.test.tsx` (14)
- `tests/unit/components/contact/ContactPageView.test.tsx` (1)
- `tests/unit/components/shared/ContactTeaser.test.tsx` (8)
- `tests/unit/app/api/customer-queries/route.test.ts` (8)
- `tests/unit/app/api/customer-queries/manage/route.test.ts` (5; read-only for S5 boundary)
- `tests/unit/features/shared/api/readApiErrorMessage.test.ts` (3)
- `tests/unit/app/api/mutation-route-safety.matrix.test.ts` (14; asserts public form rate-limit + honeypot + no CSRF)

### Behavior verified

| Rule | Proof |
|------|--------|
| Labels + consent | Name/message/email/phone/preferred labeled; privacy link `/privacy`; consent required to enable submit (form + teaser) |
| Error envelopes | Nested `{ success:false, error:{ code, message } }` and legacy `{ error: string }` via `readApiErrorMessage` |
| Rate limit | Route returns 429 + `RATE_LIMIT_EXCEEDED` + human message + `X-RateLimit-Reset`; forms surface message |
| Honeypot honesty | Filled `website` → 201 with **same envelope** as real insert (`queryId`, `createdAt`, `followUp: {email:null,whatsapp:null}`); **no DB insert**; forms include hidden honeypot and treat success envelope as success |
| Success path | Live-shaped `{ success:true, queryId, followUp }` shows status + follow-up links; form resets |
| Source attribution | Default `website-contact`; quote-cart/compare seed + `website-contact-*` sources |

### Fixes applied (OWN)

1. **`app/api/customer-queries/route.ts`** — honeypot fake success now includes `followUp` so clients cannot distinguish bot vs human success shape (honesty).
2. **`CustomerQueryForm.tsx`** — honeypot `website` field (`sr-only`, `tabIndex=-1`, `autoComplete=off`); posts `website` in body; clears on success.
3. **`ContactTeaser.tsx`** — same honeypot field + payload + reset.
4. **Tests** — expanded API (honeypot shape, empty honeypot persists, rate-limit message, DATABASE_ERROR envelope); form/teaser honeypot + rate-limit + live success envelope; removed `any` from ContactTeaser framer-motion mock.

### Residual OPEN

1. **SF-09 form delivery** — browser e2e success + analytics receipt against a real intake DB not proved. Needs owner-approved staging or disposable env, then live POST + inbox check.
2. **Production form smoke** — not run (no safe live write).
3. **Manage/admin inbox** — out of Site marketing OWN; not claimed.

### Files touched

- `site/app/api/customer-queries/route.ts`
- `site/components/contact/CustomerQueryForm.tsx`
- `site/components/shared/ContactTeaser.tsx`
- `site/tests/unit/app/api/customer-queries/route.test.ts`
- `site/tests/unit/components/contact/CustomerQueryForm.test.tsx`
- `site/tests/unit/components/shared/ContactTeaser.test.tsx`
- `agent-reports/SITE.md` (this section)

