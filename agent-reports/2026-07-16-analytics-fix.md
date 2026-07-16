# Analytics unit suite fix — 2026-07-16

## Result

`pnpm --filter oando-site exec vitest run tests/unit/lib/analytics` → **exit 0**

- 7 files, 24 tests, all pass
- Related green: `tests/unit/lib/helpers/seo.test.ts`, `tests/unit/components/ui/TrackedLink.test.tsx`
- `pnpm run check:layout` → OK

No production `window.va` receipt claimed. No commit/push.

## Failures fixed

| Failure | Root cause | Fix |
|---|---|---|
| `siteAttribution` absent cookies → empty `source` | Cleared cookies leave `""`; `??` only handles null | `cookieOrDefault` treats null/blank as absent → `direct` / `none` |
| `seo` / `buildProductJsonLd` mock miss | Full mock of `@/features/site/data/seo` omitted core export | Mock includes `buildProductJsonLd`; helpers test uses `importOriginal` for real product builder |
| `conversionContract` PAGE_VIEW never emitted | Consent gate blocked track without accept cookie | Tests set `oando_cookie_consent=accepted`; source also gates consent **before** dedupe so pre-accept views do not burn TTL |
| `kpiEvents` unguarded | KPI path called `window.va` without consent | `hasAnalyticsConsent()` in `emitEvent`; tests set consent |

## Consent gate (verified)

| Emitter | Gate |
|---|---|
| `siteEvents.emitSiteEvent` | `hasAnalyticsConsent()` |
| `conversionContract.trackConversionEvent` | `hasAnalyticsConsent()` before dedupe + via `emitSiteEvent` |
| `kpiEvents.emitEvent` | `hasAnalyticsConsent()` |

No emit path claims a production VA receipt.

## SSR-safe planner entry (preserved)

- `buildPlannerEntryHref` default: no cookie `utm_*`
- `includeAttribution: true` only on click tracking path
- `PlannerLaunchLink` and `TrackedLink` both follow that split

## Primary planner CTAs

Already on tracked components (not raw `/planner` Link for public entry):

- Homepage tools band → `PlannerToolsShowcase` → `PlannerLaunchLink`
- Planning page CTA → `TrackedLink`
- PDP guest launch → `PlannerLaunchLink`
- Mobile drawer nav / CTAs → `PlannerLaunchLink` / `TrackedLink`

Left untracked on purpose (non-marketing / internal / already-in-planner shells): admin header, CRM, portal workspace links, repo-store docs view, authenticated `GlobalNavHeader`.

## OPEN (not claimed done)

- Planner funnel steps (`PROJECT_START`, `FIRST_PLACEMENT`, BOQ/HANDOFF_*) are defined in `conversionContract` but Planner does not call `trackConversionEvent` yet. Comment in source documents this.

## Key files

- `site/lib/analytics/siteAttribution.ts`
- `site/lib/analytics/kpiEvents.ts`
- `site/lib/analytics/conversionContract.ts`
- `site/lib/analytics/siteEvents.ts`
- `site/lib/helpers/seo.ts` (+ unit mock)
- `site/components/ui/TrackedLink.tsx`
- `site/components/ui/PlannerLaunchLink.tsx`
- `site/tests/helpers/mockNextLink.tsx` (undefined `data-testid` no longer wipes mock id)
