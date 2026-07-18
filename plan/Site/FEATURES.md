# Site features

**Code map.** Status: `CHECKLIST.md`.

**Roots:** `site/app/(site)/` · `site/components/` · `site/features/site/` · `site/i18n/` · `site/lib/analytics/`

| Area | Path |
|------|------|
| Routes / classification | `features/site/data/routeClassification.ts` |
| Sitemap / robots | `app/sitemap.ts` · `app/robots.ts` · `lib/siteUrl.ts` |
| SEO | `features/site/data/seo.ts` · `siteSeoContract.ts` |
| Products / PDP | `app/(site)/products/**` · `lib/catalog/site/` |
| Contact | `components/contact/*` · `app/api/customer-queries/` |
| Planner entry | `lib/analytics/plannerEntry.ts` · `PlannerLaunchLink` |
| i18n | `i18n/messages/` · `check:i18n:parity` |
| Analytics / consent | `lib/analytics/` · `lib/consent.ts` |
