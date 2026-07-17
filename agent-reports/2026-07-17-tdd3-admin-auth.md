# TDD-3 — Admin auth / route tests

**Date:** 2026-07-17  
**Agent:** TDD-3  
**Scope:** Admin security acceptance (unit only; bypass OFF paths)

## RED → GREEN

| Slice | RED | GREEN | Exit |
|-------|-----|-------|------|
| `requireAuthUser` unauth admin fall-through | FAIL: null `user.role` when mock `redirect` does not throw | Already fixed in `session.ts` (throw after redirect) + test expects reject | **0** |
| Nested `/admin/*` proxy redirect (bypass off) | Added coverage for svg-editor/crm/catalog/plans | Existing proxy gate | **0** |
| Production ignores `DEV_AUTH_BYPASS=1` (proxy + session + requireAdminSession) | Added | Existing `isDevAuthBypassEnabled` | **0** |
| Layout fail-closed on auth reject | Added | Layout awaits `requireAuthUser` | **0** |
| CRM hub (not redirect-to-projects) | Drift check | Passes as hub | **0** |
| AdminLayoutShell health | Optional | 5/5 pass | **0** |

## Commands (focused)

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/proxy.test.ts `
  tests/unit/lib/auth/session.test.ts `
  tests/unit/app/api/admin/_lib/server.test.ts `
  tests/unit/app/admin/layout.test.tsx `
  tests/unit/app/admin/crm/page.test.tsx `
  tests/unit/features/admin/ui/AdminLayoutShell.test.tsx
```

**Result:** 6 files, all green (67 after cleanup of duplicate nested proxy case).

## Touched

- `site/tests/unit/proxy.test.ts` — nested admin paths; production bypass off; `/api/admin` not edge-protected
- `site/tests/unit/lib/auth/session.test.ts` — production ignores bypass
- `site/tests/unit/app/api/admin/_lib/server.test.ts` — production 401 with bypass=1
- `site/tests/unit/app/admin/layout.test.tsx` — fail-closed on reject
- Product fix for fall-through was already in `site/lib/auth/session.ts` (throw after redirect)

## OPEN (honest)

- **Browser:** unauth admin journey with bypass off on controlled server — not run
- **Deploy/preview auth:** NOT PROVEN (bypass-on probes ≠ production auth)
- Do not claim production auth from unit green or DEV_AUTH_BYPASS=1

## Bar

Bypass-on is local only. Unit gates mock bypass OFF / production.
