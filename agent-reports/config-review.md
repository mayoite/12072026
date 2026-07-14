# site/config review

Date: 2026-07-14  
Scope: `site/config/` only (read-only at write time). Package scripts cross-checked.

## Verification stamp (2026-07-14 recheck)

| Claim in original issues | Live status |
|--------------------------|-------------|
| ESLint `**/project/**` ignores planner project | **FIXED** — ignore removed; `features/planner/project` lints |
| `test:a11y` path wrong | **FIXED** — `tests/e2e/accessibility.spec.ts` |
| gate-specs incomplete vs release:gate | **FIXED** — includes a11y + planner-catalog set |
| `dangerouslyAllowSVG: true` | **FIXED** — now `false` |
| route-contract fabric/open3d as live | **FIXED** — legacy redirects only |
| `_archive` dir missing note | **FIXED** — co-located versioned JSON note |
| wrangler live hostnames | **FIXED** — placeholders |
| DO `npm run build` | **FIXED** — `pnpm run build` |
| `environment/` empty | **PARTIAL** — has `.gitignore`, `.npmrc`, `README.md` |

**Verdict:** This review is historical + stamped. Do not treat open Important rows below as still open without re-reading the stamp table.

## Inventory (every file under `site/config/`)

| Path | Role |
|------|------|
| `site/config/route-contract.json` | Route/auth product contract + phase notes |
| `site/config/planner-canvas.json` | Canvas scale/bounds/viewport numbers |
| `site/config/build/eslint.config.mjs` | ESLint flat config |
| `site/config/build/next.config.js` | Next base config (redirects, images, headers) |
| `site/config/build/playwright.config.ts` | Playwright e2e config |
| `site/config/build/playwrightBaseURL.cjs` | Force `localhost` origin helper |
| `site/config/build/playwright-gate-specs.json` | Specs audited for `.skip` by release gate |
| `site/config/build/playwright-open3d-world-specs.json` | Open3D world e2e pack manifest |
| `site/config/build/postcss.config.mjs` | Tailwind PostCSS |
| `site/config/build/tsconfig.json` | Base TS compiler options |
| `site/config/build/vitest-console-reporter.ts` | Vitest console capture reporter |
| `site/config/build/wrangler.toml` | Cloudflare Workers / OpenNext vars |
| `site/config/database/types/database.types.ts` | Generated public Supabase types |
| `site/config/database/types/database.admin.types.ts` | Generated admin DB types (custom script) |
| `site/config/deployment/digitalocean/app.yaml` | DO App Platform env key list |
| `site/config/environment/` | **Empty directory** |

Thin root stubs (outside config, for tool discovery):

- `site/next.config.js` → requires `config/build/next.config.js`
- `site/postcss.config.mjs` → re-exports `config/build/postcss.config.mjs`
- `site/tsconfig.json` → extends `config/build/tsconfig.json`

Vitest entry configs stay at `site/vitest*.ts` (not under `config/`). They correctly reference `config/build/vitest-console-reporter.ts`.

## Script cross-check

### Root `package.json`

No direct `config/` paths. Site work is `pnpm --filter oando-site …`.

### `site/package.json` → `config/`

| Script | Target | Exists? |
|--------|--------|---------|
| `lint` | `config/build/eslint.config.mjs` | Yes |
| All Playwright scripts using `-c config/build/playwright.config.ts` | Yes (config file exists) |
| `test:a11y` | `-c config/build/playwright.config.ts` + `tests/accessibility.spec.ts` | Config OK; **spec path wrong** (file is `tests/e2e/accessibility.spec.ts`) |
| `db:types` | writes `config/database/types/database.types.ts` | Yes |
| `db:types:admin` | script → `config/database/types/database.admin.types.ts` | Yes |
| `test:e2e:open3d-world` / `run-open3d-world-e2e.mjs` | `config/build/playwright-open3d-world-specs.json` | Yes |
| `test:audit:gate-skips` | `config/build/playwright-gate-specs.json` | Yes |

No broken `config/build/...` **config file** targets. One gate **spec path** in `package.json` is stale (see Issues).

Open3D pack specs listed in `playwright-open3d-world-specs.json` are on disk under `site/tests/e2e/`.

## Strengths

1. **No hard-coded secrets** in config. DO `app.yaml` declares SECRET keys with empty values. No JWT/service-role/API key material found under `site/config/`.
2. **Config layout is mostly pure.** Tool configs live under `config/build/`; product numbers in `planner-canvas.json`; types under `config/database/types/`.
3. **Thin root stubs** keep Next/PostCSS/tsconfig discoverable without duplicating real config.
4. **Type safety at build:** `typescript.ignoreBuildErrors: false`. ESLint bans `any` on production TS.
5. **Playwright artifacts** go to repo-root `results/` (correct tool-output location).
6. **Playwright base URL** forces `localhost` (avoids 127.0.0.1 origin mismatch).
7. **DB types** look generated (Supabase-shaped / script-mirrored). No handwritten `any` in those files.
8. **`planner-canvas.json`** is small, numeric, and consumed via typed loaders (`canvasBounds.ts`). Clean config.

## Issues

| Severity | File | Fact | Recommendation |
|----------|------|------|----------------|
| **Important** | `config/build/eslint.config.mjs` | Global ignore `"**/project/**"` matches live source under `features/planner/project/**` (large planner tree: catalog, persistence, model, AI). That tree is excluded from lint when `pnpm lint` runs over `features`. | Narrow ignore to a real dead path, or remove. Re-run lint on `features/planner/project` after. |
| **Important** | `config/route-contract.json` | Marked “live route/auth product truth” and required by unit tests, but drifts from reality: `planner.fabricGuest` / `fabricCanvas` / `open3dPilot` are first-class paths; `next.config.js` **301s** `/planner/fabric/**` and `/planner/open3d/**` to canvas; `app/planner/` has no fabric/open3d routes. Notes still claim fabric mirror + open3d pilot live surfaces. Guest cookie still lists `/oando-planner/**`; `proxy.ts` only allows `/planner`, `/planner/guest`, `/planner/canvas`. | Rewrite contract to canonical live routes + explicit `_legacyRedirects` only. Align notes and guest paths with `proxy.ts` / redirects. Update `route-contract.test.ts` keys in the same change. |
| **Important** | `config/build/playwright-gate-specs.json` + `site/package.json` | Gate-specs (skip audit) lists correct `tests/e2e/accessibility.spec.ts`, but `test:a11y` still points at missing `tests/accessibility.spec.ts`. Set also mismatches `release:gate` e2e: gate runs `test:planner-catalog` extras (`admin-smoke`, `sketch-to-plan-pipeline`, `planner-offline-sync` — **not** in gate-specs). Gate-specs includes `site-navigation-smoke` which is **not** in `release:gate`. | Fix `test:a11y` path to `tests/e2e/accessibility.spec.ts`. Make gate-specs the single source for gate e2e, or expand it to every e2e file `release:gate` runs. |
| **Important** | `config/build/next.config.js` | `images.dangerouslyAllowSVG: true` with CSP sandbox for optimized images. Broad SVG allow increases XSS surface if untrusted SVG URLs reach `next/image`. | Prefer raster-only remote patterns; keep SVG off unless a named allowlist host/path is required. Document residual risk if kept. |
| **Important** | `config/route-contract.json` | `_phase08_persistence._archive` claims `site/inventory/descriptors/_archive/` rolling archive. That directory **does not exist**. Descriptors live as flat JSON under `inventory/descriptors/` only. | Fix contract note to match on-disk layout, or restore archive path if product still expects it. |
| **Minor** | `config/build/wrangler.toml` | Commits live public deploy URLs: Supabase project host `erpweaiypimorcunaimz.supabase.co`, asset worker, site worker hostname. Not secret, but environment-coupled and clone-hostile. Anon key correctly not inlined. | Prefer env/secret injection for all deploy-specific values; keep file as template with placeholders. |
| **Minor** | `config/build/eslint.config.mjs` | Stale/dead ignores: `**/features/ops-portal/dist/**` (`features/ops-portal` missing); `**/config/environment/next-env.d.ts` while `environment/` is empty and `next-env.d.ts` lives at `site/`. | Drop or update ignores to match tree. |
| **Minor** | `config/environment/` | Empty directory. Docs/scripts still refer to it. | Populate with real env samples (no secrets) or remove and update references. |
| **Minor** | `config/deployment/digitalocean/app.yaml` | `build_command: npm run build` while repo standard is `pnpm` from root. Comment notes weak `ADMIN_TOKEN` without a value (values empty — OK). | Align DO build with monorepo `pnpm` / filter, or document intentional DO-only npm path. |
| **Minor** | `config/build/next.config.js` | API-only CSP header is `default-src 'self'` only. Real page CSP lives in `proxy.ts` (out of this folder). Split is easy to misread as “site has strict CSP from next config.” | Comment that page CSP is middleware/proxy-owned; keep API headers intentional. |
| **Minor** | `config/build/eslint.config.mjs` | Tests/mocks turn off `@typescript-eslint/no-explicit-any` and related rules. Reasonable, but broad under `tests/**`. | Keep; optional tighten to unit fixtures only if abuse grows. |
| **Minor** | `config/database/types/database.admin.types.ts` | No “generated — do not edit” banner. Shape differs slightly from public `database.types.ts` (no `__InternalSupabase`). Generated via `db_gen_admin_types.ts` — hand-edit risk. | Add generation header + regenerate-only policy. |
| **Minor** | `config/route-contract.json` | Large `_phase*` narrative blocks are process history inside product contract. Config purity: borderline docs-in-config. | Move phase notes to docs; keep machine-readable routes/auth only. |
| **Minor** | Duplicates | Single Playwright config under `config/build/`. Vitest configs at site root only. No second next/eslint/playwright source of truth. Acceptable. | No change required. |

## Secrets scan (config only)

- Patterns for keys/tokens/passwords: only **key names**, empty DO values, schema field names (`token`, `share_token`), and comments.
- No `eyJ…` JWTs, no `sk-…`, no service role material.
- **PASS** on hard-coded secrets.

## Security flags

| Flag | Status |
|------|--------|
| `ignoreBuildErrors` | `false` — good |
| ESLint max-warnings | `0` in package script — good |
| Overly broad ESLint ignore | **`**/project/**`** — bad (see Issues) |
| `dangerouslyAllowSVG` | **true** — residual risk |
| Playwright `DEV_AUTH_BYPASS` | Not hardcoded in config; open3d runner can set it (script, not this file) |
| Secrets in wrangler/DO | Values empty or public URLs only |

## Layout purity

- Build/tool config belongs in `config/build/` — OK.
- Deployment env key template in `config/deployment/` — OK.
- `planner-canvas.json` is pure numbers — OK.
- `route-contract.json` mixes live contract with phase essays and dead paths — impure.
- No product React/runtime logic in config files except Next redirect map (expected for Next config).

## Database types

| File | Assessment |
|------|------------|
| `database.types.ts` | Standard Supabase `gen types` shape (`__InternalSupabase`, Tables/Views/Functions). Treat as generated via `db:types`. |
| `database.admin.types.ts` | Script-generated mirror (`db:types:admin`). No `any`. Hand-edit risk without banner. |

## Assessment

**No Critical ship-blockers** (no committed secrets; typecheck not ignored; Playwright/lint paths exist).

**Not clean.** Ship with eyes open on **Important** items:

1. ESLint ignore swallowing `features/planner/project/**`
2. `route-contract.json` vs live redirects/proxy/app routes
3. Gate-specs vs `test:a11y` path and actual `release:gate` e2e set
4. `dangerouslyAllowSVG: true`
5. Documented descriptors `_archive` path missing on disk

TDD agent owns tests/fixes. Review only.
