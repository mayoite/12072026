# Platform & API — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md) — AI Tier-3 deferred to Phase 09; **1B** owns svg-editor API unify

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Platform | Features import from `platform/`; no scattered SDKs in features | `site/platform/` | `platform/CONTENTS.md` |
| API | Contract inventory in ROUTE-INDEX; handlers use `withAuth` + standard envelope | `site/app/api/` | `docs/api/README.md` |
| Rate limit | Enforced before handler work on API routes | `withAuth.ts`, `rateLimit.ts` | — |
| Assets | App SDKs in git (`public/cdn/`); catalog + 3D on R2 only | `Readme.md` | `OPERATIONS_RUNBOOK.md` |
| Block thumbs | PNG thumbs R2 only — not `public/svg-catalog/` for thumbs | R2 `site-block-thumbs/` | `benchmark-delivery.md` |
| AI | Tier-3 reserved packages inactive until Phase 09 brief | `features/ai/` | REC-05 |
| Config | Phase 07 owns `route-contract.json` schema | `site/config/` | `implementation-decisions.md` |
| Results | Never write test output to repo root or `E:` | `results/` | `testing-handbook.md` |

## Packages (proposed per plan)

| Package | Phase | Policy |
|---------|-------|--------|
| `drizzle-orm`, `postgres` | ongoing | Sole SQL access for catalog/planner |
| `@supabase/*` | ongoing | Auth only — consolidate client paths |
| `@aws-sdk/client-s3` | ongoing | R2 uploads; thumbs `site-block-thumbs/` |
| `openai`, `@google/generative-ai` | Phase 09 | AI routes gated by brief |
| `zod` | ongoing | All new API handlers |
| `@xyflow/react` | — | **Audit or remove** if not in approved tier |
| `server-only` | ongoing | Mark all compiler/sanitizer imports |

Next.js API routes — no new framework (Express, Hono, etc.).
