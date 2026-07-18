# Site features

Repo-sourced index: **feature → code path → honest gap**. Live code and fresh checks are authoritative.

| Doc | Role |
|---|---|
| This file | Current code map and known gaps |
| `CHECKLIST.md` | Open / partial work only |
| `docs/architecture/09-SITE-UI-BENCHMARK.md` | UI / journey benchmark (not PASS proof) |

**Only two plan docs per track:** `CHECKLIST.md` + `FEATURES.md`.

**Code roots:** `site/app/(site)/`  /  `site/app/sitemap.ts`  /  `site/app/robots.ts`  /  `site/components/`  /  `site/features/site/`  /  `site/lib/analytics/`  /  `site/lib/catalog/site/`  /  `site/i18n/`

Table paths are relative to `site/` unless noted. `app/...` means `site/app/...`.

**Execution status (2026-07-18):** CTA/PDP entry DONE; siteProduct join + PDP plan thumb PARTIAL (unit); browser OPEN. See `CHECKLIST.md`.

---

## S0 / S1  -  measurement, routes, SEO

| Feature | Code | Gap |
|---|---|---|
| Route classification | `features/site/data/routeClassification.ts`, `tests/unit/features/site/data/routeClassification.test.ts` | Table covers marketing, legal, redirects, portal, dashboard, login, not-found. Browser + every page-file audit still required for SF-05 PASS |
| Sitemap | `app/sitemap.ts` via `SITE_URL` | Static indexable + solutions + products. Unit: no localhost. **Production host re-probe OPEN** |
| Robots | `app/robots.ts` via `SITE_URL` | Disallow from `ROBOTS_DISALLOW_PREFIXES`. Unit host = `SITE_URL`. **Production re-probe OPEN** |
| SEO helpers | `features/site/data/seo.ts`, `lib/analytics/seo.ts` (re-export), `lib/helpers/seo.ts` bridge | `resolveDocumentTitle` + absolute page titles; unit SEO acceptance present; **browser title recheck OPEN** (SF-02) |
| Route metadata / copy | `features/site/data/routeMetadata.ts`, `routeCopy.ts`, `routeChromeRules.ts` | Not systematically browser-measured |
| Site SEO contract | `features/site/data/siteSeoContract.ts`, `siteSeoAcceptance.test.ts` | Unit contracts; rendered HTML OPEN |
| Legacy `/catalog` | `app/(site)/catalog/page.tsx` → `redirect("/downloads")` | Destination hero is `dmrc-hero.webp` on downloads (not `hero-3.webp`). Destination HTTP 200 **browser OPEN** (SF-04) |
| Other redirects | brochure, download-brochure, news→about, gallery→portfolio, imprint→terms, social→portfolio, tracking→service, support-ivr→service, `products/category/[slug]` permanentRedirect | agent-reports/SITE.md notes local 308; production re-probe OPEN |
| Canonical host | `routeClassification` uses `SITE_URL` (same as robots/sitemap) | Default `https://oando.co.in`; env overrides. Production re-probe still OPEN |

---

## S2  -  commercial landing

| Feature | Code | Gap |
|---|---|---|
| Homepage | `app/(site)/page.tsx`, `features/site/data/homepage.ts` | Trust provenance fields exist; commercial hierarchy + CWV **browser OPEN** (SF-07, SF-10) |
| Homepage hero | `components/home/HomepageHero.tsx` | Accessible name via `sr-only` `title.join(" ")`; animated lines `aria-hidden`. Image `onError` → `DEFAULT_HERO_FALLBACK`. **Browser proof OPEN** (SF-01, SF-14) |
| Generic hero | `components/home/Hero.tsx` | Used on secondary pages (downloads, quote-cart, etc.); has fallback patterns |
| Home modules | `components/home/*` (CategoryGrid, Collections, InteractiveTools, HomeClosingCta, TrustStrip, …) | Multiple CTAs; one primary intent unproved |
| Brand / paper | locked CSS under `app/css/core/locked/site/` | Ecru / surface tokens not measured as PASS (SF-20) |

---

## S3  -  chrome, nav, forms, consent

| Feature | Code | Gap |
|---|---|---|
| Global header | `components/site/Header.tsx` | Primary nav + search + language + mobile hamburger; many `aria-label`s present. **No quote-cart icon in header today** (SF-06 if restored) |
| Nav data | `features/site/data/navigation.ts` | Products, Solutions, Projects, Planner, Portfolio, About, Contact + More (Trusted, Sustainability, Portal, Sign in→`/access`) |
| Mobile drawer | `components/site/MobileNavDrawer.tsx` | PlannerLaunchLink + TrackedLink CTAs |
| Footer | `components/site/Footer.tsx`, footer nav builders in `navigation.ts` | Deduped columns; **no public Admin link** (unit) |
| Language switcher | `components/site/LanguageSwitcher.tsx`, `i18n/*` | Locales en/hi/fr/de/es; `localePrefix: 'never'`. Browser locale journey OPEN |
| Cookie consent | `components/site/CookieConsentBar.tsx`, `lib/consent.ts`, `components/site/SiteAnalytics.tsx` | Accept/reject/timed accept set cookie; custom events queue until accept; VA/SI `beforeSend` null without consent (unit S-W3). Timed accept **browser OPEN** (SF-18). Legacy `components/ui/CookieConsent.tsx` is localStorage-only, not chrome-mounted. |
| Contact form | `components/contact/CustomerQueryForm.tsx`, `ContactTeaser.tsx`, `features/shared/api/readApiErrorMessage.ts` | Labels, consent, success status, posts to customer-queries; nested API error envelopes unit-parsed (S-W3). **Delivery browser OPEN** (SF-09) |
| Customer queries API | `app/api/customer-queries/route.ts` | Server intake; rate limit + honeypot; returns `queryId` + `followUp`  -  re-verify with form e2e |
| Route chrome | `components/site/RouteChrome.tsx`, `RouteChromeSuspense.tsx`, `SiteConversionTracker.tsx` | Wires analytics tracker into layout |

---

## S4  -  product discovery and Planner entry

| Feature | Code | Gap |
|---|---|---|
| Catalog source | `lib/catalog/site/getProducts.ts` → `lib/catalog/sources.ts` | Drizzle/live when configured; fixture/fallback when not. Empty category is **data** issue + Site empty UX (SF-03) |
| Categories / filters | `lib/catalog/site/categories.ts`, `filters.ts`, `traits.ts`, `slugResolver.ts` |  -  |
| Products landing | `app/(site)/products/page.tsx` | Category entry |
| Category grid | `app/(site)/products/[category]/FilterGrid*.tsx`, `CategoryPageView.tsx` | Loading/error/empty states in code; stale/recovery thin (SF-16) |
| Product detail | `app/(site)/products/[category]/[product]/page.tsx`, `ProductViewer.tsx` | JSON-LD via `buildProductJsonLd`; Design in Planner via `PlannerLaunchLink` with `productSlug` + `categoryId` |
| Choose product | `app/(site)/choose-product/`, `features/shared/entry/ChooseProductPage.tsx` | noindex utility; PlannerLaunchLink on workspace entry |
| Compare | `app/(site)/compare/page.tsx`, `components/products/CompareDock.tsx`, `CompareColumnActions.tsx`, `CompareShortlistHydrator.tsx` | Buyer path browser OPEN (SF-15) |
| Quote cart | `app/(site)/quote-cart/page.tsx`, `lib/store/quoteCart` | Client cart UI; empty/list states; compare bridge when ≥2 items. Header entry not wired |
| Planner entry helpers | `lib/analytics/plannerEntry.ts`, `components/ui/PlannerLaunchLink.tsx`, `components/ui/TrackedLink.tsx` | Query params `siteProduct` / `siteCategory` + attribution. **Planner import confirmation is Planner track**; Site continuity browser OPEN (SF-08) |
| Nav search API | `app/api/nav-search/route.ts` | Header search |

---

## S5  -  content and i18n

| Feature | Code | Gap |
|---|---|---|
| Marketing pages | `app/(site)/about`, `planning`, `solutions`, `portfolio`, `projects`, `service`, `showrooms`, `trusted-by`, `career`, `sustainability`, `templates`, `downloads`, legal (`privacy`, `terms`, `refund-and-return-policy`) | Content quality / soft-404 discipline OPEN (SF-19); several hollow historical routes **redirect** |
| Solutions detail | `app/(site)/solutions/[category]/page.tsx` + sitemap solution paths | `dynamicParams=false` + `notFound()` for unknown slugs (unit) |
| Assistant / advisor | `features/site/assistant/*`, `features/site/advisor/aiAdvisor.ts` | Optional shell; not core commercial PASS path |
| i18n | `i18n/config.ts`, `routing.ts`, `messages/{en,hi,fr,de,es}.json`, `check:i18n:parity` | Parity gate + non-en browser OPEN (SF-12) |
| Access / login / dashboard / portal | `app/(site)/access`, `login`, `dashboard`, `portal/**` | Protected / utility; not marketing index targets |

---

## S6  -  analytics and measurement

| Feature | Code | Gap |
|---|---|---|
| Conversion contract | `lib/analytics/conversionContract.ts` | Funnel IDs; Planner-owned events listed but not Site-emitted (SF-11) |
| Site emitters | `lib/analytics/siteEvents.ts`, `emitTransport.ts`, `eventQueue.ts` | PAGE_VIEW, PLANNER_ENTRY, CTA; production `window.va` receipt OPEN |
| Attribution | `lib/analytics/siteAttribution.ts` | Cookies + query params |
| Site analytics UI | `components/site/SiteAnalytics.tsx`, `SiteConversionTracker.tsx` | Consent-gated path browser OPEN |
| KPI helpers | `lib/analytics/kpiEvents.ts`, `kpiIntegrity.ts`, `components/analytics/KpiIntegrityMonitor.tsx` | Ops integrity; not visitor journey |

---

## S7  -  a11y, performance, release surfaces

| Feature | Code | Gap |
|---|---|---|
| A11y smoke | `tests/e2e/site-a11y-smoke.spec.ts` | 10 routes; critical/serious only  -  not WCAG 2.2 AA (SF-13) |
| Other Site e2e | `site-navigation-smoke`, `site-locale-switch`, `site-chrome-parity`, `site-assistant-shell`, visual regression | Not claimed as matrix PASS |
| Site layout | `app/(site)/layout.tsx` | metadata via `buildSiteMetadata`; RouteChrome; main landmark |
| Error / loading / not-found | `app/(site)/error.tsx`, `loading.tsx`, `not-found.tsx` |  -  |
| PWA SW register | `components/pwa/ServiceWorkerRegister.tsx` | Keep SW from masking marketing chunk truth (S0) |

---

## APIs (Site-relevant)

| Route | Code |
|---|---|
| `POST /api/customer-queries` | `app/api/customer-queries/route.ts` |
| `GET/… /api/customer-queries/manage` | admin/ops manage (out of Site marketing PASS) |
| `GET /api/nav-search` | `app/api/nav-search/route.ts` |
| `GET /api/nav-categories` | `app/api/nav-categories/route.ts` |
| `GET /api/products`, filter | catalog read for site UI |
| `GET /api/csrf` | form/session CSRF bootstrap |

Planner handoff API is **Planner track** (`/api/planner/handoff`).

---

## Tests (representative)

Unit: `tests/unit/features/site/data/*`  /  `tests/unit/lib/analytics/*`  /  `tests/unit/lib/siteUrl.test.ts`  /  `tests/unit/app/(site)/sitemap.test.ts`  /  `robots.test.ts`  /  `solutions/[category]/page.test.tsx`  /  `readApiErrorMessage.test.ts`  /  contact form/teaser  /  broad `tests/unit/app/(site)/**` page tests

E2E: `tests/e2e/site-a11y-smoke.spec.ts`  /  `site-navigation-smoke.spec.ts`  /  `site-locale-switch.spec.ts`  /  `site-chrome-parity.spec.ts`

---

## Reference (not truth)

`CHECKLIST.md`  /  `docs/architecture/09-SITE-UI-BENCHMARK.md`  /  `agent-reports/SITE.md` (status hints only)
