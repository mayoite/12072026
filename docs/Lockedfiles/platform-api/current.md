# Platform & API — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** R2 thumbs and unified compile API are **1B** targets — **not accepted**. Evidence hub policy applies to all gates.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Platform | Supabase + Drizzle adapters | `site/platform/` |
| API routes | `site/app/api/**/route.ts` | `site/app/api/` |
| Rate limit | Per-IP on API via `withAuth` | `site/lib/rateLimit.ts` |
| Assets / CDN | SDKs in `public/cdn/`; catalog images on R2 `oando-asset-cdn` | `Readme.md` |
| Block thumbs | R2 bucket `site-block-thumbs/` | `generate-svg.mjs`, svg-editor API |
| AI | Site assistant + planner AI advisor | `features/ai/`, `site-assistant/`, `open3d/ai/` |
| Config | `route-contract.json` | `site/config/` |
| Results | `results/` tree at repo root | `results/` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `drizzle-orm`, `postgres` | `^0.45.2` / `^3.4.9` | DB adapters (`platform/drizzle/`) |
| `@supabase/ssr`, `@supabase/supabase-js` | `^0.12.0` / `^2.108.2` | Auth + legacy HTTP |
| `@aws-sdk/client-s3` | `^3.1071.0` | R2 / asset uploads |
| `openai` | `^6.44.0` | AI advisor routes |
| `@google/generative-ai` | `^0.24.1` | Generative routes |
| `zod` | `^4.4.3` | API validation |
| `server-only` | `^0.0.1` | Server module marker |
| `@xyflow/react` | `^12.11.0` | Installed — usage scope unclear |

---

## Summary

Platform and API glue hold the monorepo together: Drizzle and Supabase adapters, a large `app/api` tree, rate limiting, R2 asset policy, AI feature modules, and route contract metadata. This layer is where cross-cutting policies (auth, CDN, thumbs bucket) actually get enforced.

## Strengths

`platform/` centralizes DB and SDK access. `withAuth` standardizes API envelopes. ROUTE-INDEX gives discoverability. R2 thumb bucket name locked across phases. AI and site-assistant are feature-isolated. Results hub supports evidence culture.

## Weaknesses

API surface is large — easy to add routes without updating ROUTE-INDEX or tests. Duplicate Supabase client paths bleed from platform into `lib/`. AI routes add operational dependencies harder to gate in CI. Block thumb URLs depend on env (R2 account id) with fallback CDN string.
