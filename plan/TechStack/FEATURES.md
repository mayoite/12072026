# Tech stack features

Repo-sourced index: **stack surface → code path → honest gap**. Live code, lockfile, and fresh command exits are authoritative.

| Doc | Role |
|---|---|
| This file | Current stack map and known gaps |
| `FINISH-PLAN.md` | Phase checklist T0–T8 + TF registry |
| `COMPLETION-CONTRACT.md` | How to prove done (wins on evidence) |
| `docs/Lockedfiles/03-dependencies-engines-current.md` | Architectural limits (not PASS proof) |
| `docs/architecture/11-RUNTIME-ARCHITECTURE.md` | Runtime shape |
| `docs/architecture/08-DATABASE-SVG-CONTRACT.md` | DB/R2 SVG **target** (disk is live) |

**Code roots:** root `package.json` · `pnpm-workspace.yaml` · `scripts/` · `site/package.json` · `site/lib/env.server.ts` · `site/app/api/health/` · `tech-docs-generator/` · `.github/workflows/`

**Stack status (2026-07-17):** **OPEN / PARTIAL**. Plan trio present. Full `release:gate` not claimed. DB-SVG authority remains disk.

---

## T0 — Inventory and honesty

| Feature | Code | Gap |
|---|---|---|
| Root engines | root `package.json` `engines.node` `>=24`, `packageManager` `pnpm@11.13.0` | CI `pnpm/action-setup` **11.13.0** (TF-02 / TF-21 **PASS**, T-W1) |
| Workspace packages | `pnpm-workspace.yaml` → `site`, `tech-docs-generator` | — |
| Nested install guard | `scripts/guard-workspace-install.mjs`, site `preinstall` | Guard present; CI root-only install OPEN until grepped as claim |
| Layout gate | `scripts/check-repo-layout.mjs` → `pnpm run check:layout` | Run fresh each claim |
| Failures registry | `Failures.md` + `scripts/check-failures.mjs` | DB-SVG disk authority line must stay honest |
| Lockedfiles vs code | `docs/Lockedfiles/03-dependencies-engines-current.md` | Sync when engines change; do not claim PASS from MD alone |

---

## T1 — Install and workspace

| Feature | Code | Gap |
|---|---|---|
| Root-only install | root `preinstall`, `postinstall` cleanup | Nested install still possible if someone bypasses; TF-01 OPEN |
| Hoisted linker | root pnpm config / `nodeLinker: hoisted` | Phantom dep risk TF-22 OPEN |
| No nested lockfiles | layout + cleanup scripts | — |
| Clean install repro | `pnpm install --frozen-lockfile` | Not re-proved every session |

---

## T2 — Engine monoculture

| Feature | Code | Gap |
|---|---|---|
| Fabric 2D | `site` dep `fabric@7.4.0`; planner canvas imports | Grep proof for second engine not automated in CI |
| Three / R3F / Drei | `three`, `@react-three/fiber`, `@react-three/drei` | — |
| Admin SVG embed | `@excalidraw/excalidraw` | Host owns publish; not client authority |
| No react-router in site product | Site uses Next app router | tech-docs may use SPA tooling — out of product |

---

## T3 — Dependency hygiene

| Feature | Code | Gap |
|---|---|---|
| Direct deps | `site/package.json` + `scripts/audit-site-deps.mjs` | **T-W3 inventory done** (2026-07-17). 48/49 deps USED; `@google/model-viewer` JUSTIFY (CDN, no npm import). Idle candidates not removed: `fast-check`, `whatwg-fetch`, `lighthouse`, `wrangler`, `prettier*`, `@types/istanbul-*`. TF-05 **OPEN** until owner cut or keep |
| Licenses | Lockedfiles policy | No automated license gate in root scripts |
| No competitor packages | Policy in Lockedfiles | Manual name scan **PASS** (T-W3); re-check on adds |

---

## T4 — Type, lint, unit stability

| Feature | Code | Gap |
|---|---|---|
| Lint | `pnpm run lint` → site eslint max-warnings 0 | Fresh exit required for PASS |
| Typecheck | `pnpm run typecheck` | TF-07 `.next/dev/types` race historically FAIL risk |
| Unit | `pnpm run test` (vitest forks pool) | Full suite not claimed PASS here |
| Health probe unit | `site/tests/unit/app/api/health/route.test.ts` | Exists; run focused for stack claims |

---

## T5 — Security and secrets

| Feature | Code | Gap |
|---|---|---|
| Secrets lint | `pnpm run lint:secrets` | Fresh exit OPEN |
| Env names (no values) | root `.env.example`, `site/lib/env.server.ts` | See env table below |
| DEV bypass | `DEV_AUTH_BYPASS` | Must stay production-disabled (product auth tracks) |

---

## T6 — Build and release

| Feature | Code | Gap |
|---|---|---|
| Sharp | `pnpm run check-sharp` | Windows native OPEN until proved |
| Build | `pnpm run build` | Not claimed this session |
| Release | `pnpm run release:gate` / turbo | **OPEN** — do not invent PASS |
| Vercel root | `site` | Owner-only deploy |
| Fast monorepo gate | `pnpm run gate` | Layout + purity + site fast gate |

---

## T7 — Data plane clients (boundary)

| Feature | Code | Gap |
|---|---|---|
| Drizzle / postgres | `site/platform/drizzle/` | Products DB when `PRODUCTS_DATABASE_URL` set |
| R2 via S3 | `site/lib/storage/r2Catalog.ts`, env aliases in `env.server.ts` | Live SVG authority is still **disk** |
| DB-SVG dual-write | Admin publish pipeline | Dual-write optional; not release authority — see `Failures.md` |
| Health API | `GET /api/health` → `site/app/api/health/route.ts` | Liveness only: `{ ok: true }`, no secrets |

---

## T8 — Docs and ops closure

| Feature | Code | Gap |
|---|---|---|
| Plan trio | `plan/TechStack/{COMPLETION-CONTRACT,FEATURES,FINISH-PLAN}.md` | Present; checkboxes OPEN |
| Plans purity allows TechStack | `scripts/check-plans-purity.mjs` | Required trio enforced |
| Docs budget / purity | `check:docs-purity`, `check:active-docs` | Continuous |
| Agent reports | `agent-reports/TECH-STACK.md` | Track status only; not PASS proof |

---

## Env contract (names only)

Never commit values. Load from repo-root `.env.local` (see `.env.example`).

| Area | Env names | Notes |
|---|---|---|
| Supabase public | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Launch validate set |
| Admin Supabase | `NEXT_ADMIN_SUPABASE_URL`, `NEXT_ADMIN_PUBLISHABLE_KEY`, `NEXT_ADMIN_SUPABASE_ANON_KEY`, `SUPABASE_ADMIN_SERVICE_ROLE_KEY` | Admin/API |
| DB | `PRODUCTS_DATABASE_URL`, `SUPABASE_AUTH_DATABASE_URL` | Drizzle / auth DB |
| AI primary chain | `OPENROUTER_API_KEY_PRIMARY`, `OPENROUTER_API_KEY_BACKUP`, `OPENROUTER_BASE_URL`, `OPENROUTER_MODEL`, `GEMINI_API_KEY`, `GEMINI_MODEL` | **Required chain: Gemini + OpenRouter.** `OPENAI_API_KEY` optional legacy on some routes — **not** required for stack health |
| Email | `RESEND_API_KEY`, `STAFF_NOTIFY_EMAIL`, `EMAIL_FROM` | Handoff notify |
| R2 / S3 pair | Preferred: `CLOUDFLARE_R2_ACCESS_KEY_ID` + `CLOUDFLARE_R2_SECRET_ACCESS_KEY`; alias: `CLOUDFLARE_ACCESS_KEY_ID` + `CLOUDFLARE_SECRET_ACCESS_KEY`; endpoint `CLOUDFLARE_S3_URL`; bucket `CLOUDFLARE_R2_CATALOG_BUCKET` | Intact pair required; API tokens are not S3 secrets |
| Cloudflare account API | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | Management, not S3 |
| Dev | `DEV_AUTH_BYPASS` | Never production-true |

**Existence check (names only, local `.env.local`, 2026-07-17 FIX-TECHSTACK):** Supabase + DB + OpenRouter + Gemini + Resend + staff email = **SET**. Preferred R2 pair + `CLOUDFLARE_S3_URL` + catalog bucket = **SET**. Generic R2 alias pair = **MISSING** (preferred pair used). `OPENAI_API_KEY` = **MISSING** (not required). Prior report said R2 MISSING — **superseded** by preferred-pair SET.

---

## Gates (stack)

| Gate | Command |
|---|---|
| Layout | `pnpm run check:layout` |
| Plans purity | `pnpm run check:plans-purity` |
| Failures | `pnpm run check:failures` |
| Fast monorepo | `pnpm run gate` |
| Lint / type / unit | `pnpm run lint` · `typecheck` · `test` |
| Health unit | `pnpm --filter oando-site exec vitest run tests/unit/app/api/health/route.test.ts` |
| Full release | `pnpm run release:gate` |

---

## Reference (not truth alone)

`COMPLETION-CONTRACT.md` · `FINISH-PLAN.md` · `docs/Lockedfiles/03-dependencies-engines-current.md` · `Failures.md` · lockfiles
