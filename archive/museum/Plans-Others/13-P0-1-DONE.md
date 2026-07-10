# P0.1 complete — Admin SVG publish E2E

## Dev auth bypass (resolved blocker)

| Layer | Change |
|-------|--------|
| `lib/auth/devAuthBypass.ts` | `DEV_AUTH_BYPASS=1` only if not production (or + `DEV_AUTH_BYPASS_ALLOW_PRODUCTION=1` for local Playwright/`next start`) |
| `proxy.ts` | Cookie gate skips protected redirect when bypass on |
| `lib/auth/session.ts` | `requireAuthUser` / `getOptionalUser` synthetic owner |
| `withAuth` | Synthetic admin + **CSRF skip** when bypass |
| `site/.env.development.local` | `DEV_AUTH_BYPASS=1` for `next dev` |
| Repo `.env.local` | Flags also added (server may use root env via tooling) |

**Never enable on public production hosts.**

## Playwright proof

```text
pnpm exec playwright test tests/e2e/admin-svg-publish-p01.spec.ts
# with PLAYWRIGHT_BASE_URL=http://localhost:3000 and next dev + bypass
→ 2 passed
```

| Artifact | Meaning |
|----------|---------|
| `results/planner/p0-1-admin-svg-publish/01-list.png` | List page (no /access) |
| `02-editor-before-publish.png` | Editor |
| `03-api-publish.json` | HTTP 200 success |
| `04-svg-bytes.json` | SVG wrote (481 bytes) |
| `05-editor-after-publish.png` | After |
| `run.json` | Summary |

## Commands for you

```powershell
cd D:\OandO07072026\site
# .env.development.local already has DEV_AUTH_BYPASS=1
pnpm run dev
# other terminal:
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
$env:DEV_AUTH_BYPASS='1'
pnpm run test:e2e:p0-admin-svg
```

Or open browser: `http://localhost:3000/admin/svg-editor`

## Known non-blockers for P0.1

- `next build` fails on `/contact` (createContext) — separate fix before prod Playwright webServer
- admin-smoke unauth tests **skip** when `DEV_AUTH_BYPASS=1` (expected)
