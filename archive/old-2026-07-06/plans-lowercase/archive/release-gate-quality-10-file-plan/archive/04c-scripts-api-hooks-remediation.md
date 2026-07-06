# Phase 4c - Scripts, API & Hooks Remediation

## Objective

Turn the static findings in `docs/audit/scripts/{code-review,security,seo}.md` into a sequenced fix plan that removes the highest-risk exposures first and adds proof gates so the same class of issue cannot re-enter.

## Status

Static-only planning pass. No live API calls, script execution, Playwright, or Lighthouse were run for this document.

## Failure List

| Priority | Area | Location | Failure | Remedy |
|----------|------|----------|---------|--------|
| P0 | Secrets | `site/scripts/seed_direct.ts`, `site/scripts/fix_and_reseed.ts` | Hardcoded DB host, user, and password in source. | Remove literals, switch to env-only config, archive the legacy script if it is not still needed, and rotate any secret that may have escaped the repo. |
| P0 | Public catalog API | `site/app/api/planner/catalog/route.ts`, `site/app/api/planner/catalog/configurator/route.ts` | Public GETs use service-role access, with no auth and no rate limit. | Move reads to anon + RLS or a read-only view, trim returned fields, add public rate limiting, and add tests that assert the public-client path. |
| P0 | Error logging | `site/app/api/log-error/route.ts` | Unauthenticated client payloads can flood logs; there is no schema or payload cap. | Add Zod validation, byte and field caps, rate limiting, and structured logging with trimming or sampling. |
| P1 | Secret push scripts | `site/scripts/push_vercel_env_from_local.mjs`, `site/scripts/sync-github-backup-secrets.ps1` | Local secrets can be pushed to external targets with too little operator friction. | Default to dry-run, require explicit target selection and confirmation, and allowlist keys. |
| P1 | Destructive scripts | `site/scripts/deleteR2Bucket.ts`, `site/scripts/db_apply_migrations.ts`, `site/scripts/fix_and_reseed.ts` | Destructive actions lack confirm or dry-run defaults. | Add `--dry-run` and `--confirm`, validate targets, and prefer archive-first behavior where deletion is not required. |
| P1 | Auth model drift | `site/app/api/**`, `site/app/api/admin/_lib/server.ts` | Mixed auth patterns and a `user_metadata.role` fallback widen the attack surface. | Standardize on `withAuth` or `requireAdminSession`, remove user-writable role trust, and centralize route wrappers. |
| P1 | Audit route | `site/app/api/audit/route.ts` | Any authenticated user can write arbitrary metadata for guessed teams. | Enforce verified team membership, cap metadata size and shape, and add negative tests. |
| P1 | Token issuance | `site/app/api/csrf/route.ts` | CSRF token issuance has no rate limit. | Add low-cost rate limiting or session-bound caching plus abuse tests. |
| P1 | Public AI routes | `site/app/api/generate-alt/route.ts`, `site/app/api/filter/route.ts` | Public AI endpoints can be cost-abused or sent oversized payloads. | Tighten body validation, cap payload size, and add route-specific rate tests. |
| P2 | Tracking and recommendations | `site/app/api/tracking/route.ts`, `site/app/api/recommendations/route.ts`, `site/lib/hooks/useRecommendations.ts` | Client-supplied `userId` is trusted from localStorage. | Replace it with a server-issued anonymous session ID or a signed identifier; keep localStorage out of trust decisions. |
| P2 | SEO pipeline | `site/scripts/sync-missing-alt-text.ts`, `site/scripts/backfill_canonical_catalog_metadata.ts`, `site/scripts/generate-route-index.mjs`, `site/app/sitemap.ts` | No CI gate for missing `alt_text` or sitemap drift. | Add missing-alt checks, sitemap drift comparison, and metadata regression tests. |
| P2 | Hook cleanup | `site/features/planner/hooks/usePlannerSession.ts`, `site/features/planner/hooks/useScrollAnimation.ts` | Async work and animation instances can survive unmount or remount. | Abort pending async work, kill animation instances on cleanup, and add regression tests. |
| P3 | Route consolidation | `site/app/api/ai/advisor/route.ts`, `site/app/api/ai-advisor/route.ts`, `site/app/api/planner/ai-advisor/route.ts` | Duplicate advisor surfaces split auth and rate-limit policy. | Keep one canonical route, deprecate aliases, and redirect or remove duplicates after consumers move. |
| P3 | Operator clarity | `site/scripts/compare-meta.ps1` | The name suggests SEO metadata but the script compares directory trees. | Rename or archive under a clearer name to avoid operator mistakes. |

## Remedy Plan

### Phase 1: Stop the highest-risk exposures
1. Remove hardcoded credentials from `site/scripts/seed_direct.ts` and `site/scripts/fix_and_reseed.ts`.
2. Replace the public planner catalog routes with anon + RLS or a read-only view.
3. Add public rate limiting and response-field trimming to the planner catalog endpoints.
4. Harden `site/app/api/log-error/route.ts` with schema validation, payload caps, and rate limiting.
5. If any credential was previously shared outside the repo, rotate it before any further use.

### Phase 2: Standardize API protection
1. Move new route handlers onto a single shared auth wrapper and schema pattern.
2. Remove `user_metadata.role` from admin authorization checks.
3. Add membership checks and size limits to `site/app/api/audit/route.ts`.
4. Add abuse controls to `site/app/api/csrf/route.ts`, `site/app/api/generate-alt/route.ts`, and `site/app/api/filter/route.ts`.
5. Add targeted route-handler tests for auth-negative, rate-limit, and payload-validation cases.

### Phase 3: Make operator-dangerous scripts safe by default
1. Add `--dry-run` and `--confirm` to env push and destructive scripts.
2. Require explicit target selection for `push_vercel_env_from_local.mjs` and `sync-github-backup-secrets.ps1`.
3. Keep destructive scripts on an archive-first path where deletion is not strictly required.
4. Wire the existing env validation script into deploy and release flows if it is not already enforced there.

### Phase 4: Close SEO and data-quality drift
1. Add a CI gate for missing product `alt_text`.
2. Add a sitemap drift check that compares route inventory output to the runtime sitemap.
3. Add a regression check for metadata backfill scripts against `buildPageMetadata`.
4. Decide whether product OG image generation is needed; defer if it adds cost without clear search benefit.

### Phase 5: Clean up hooks and route duplication
1. Abort stale async work in `usePlannerSession`.
2. Kill lingering `ScrollTrigger` instances in `useScrollAnimation`.
3. Replace the localStorage-trusted recommendation identifier with a signed or server-issued identifier.
4. Consolidate the three AI advisor surfaces onto one route and deprecate aliases after consumers move.

### Phase 6: Prove the fixes
1. Add or update unit tests beside each changed route or script.
2. Run the repo's existing static checks and targeted tests for the changed areas.
3. Refresh `Failures.md` with any remaining skips or blockers after the implementation pass.
4. Only then claim the audit class is remediated.

## Verification Targets

- No committed secrets remain in the targeted scripts.
- Public planner catalog no longer depends on a service-role client.
- Public error logging, CSRF, audit, and AI endpoints all have explicit abuse controls.
- Dangerous scripts require explicit operator confirmation or dry-run support.
- SEO and backfill scripts are covered by regression checks.
- Hook cleanup prevents stale async updates and lingering animations.
