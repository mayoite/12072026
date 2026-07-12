# SEO.md — one plan

**HEAD:** `7807198d` · **Engines:** `app/(site)/sitemap.ts`, `app/(site)/robots.ts`, page `metadata` exports, `productStaticParams`.
**Replaces:** SEO BOARD (SEO1–5).

## Honest state
Queue exists; nothing closed. `STATIC_PATHS` diverge from live routes — that's the root bug.

### Stream SEO-1 — Sitemap ↔ live routes (do first)
**Engine:** `app/(site)/sitemap.ts` vs actual public routes.
**Checklist:** diff indexable public routes against sitemap output → classify each gap **index | noindex | bug** → allowlist noindex → capture the diff.
**Blocks on:** nothing. Gates SEO-2.

### Stream SEO-2 — Per-page metadata
**Engine:** `metadata`/`generateMetadata` on marketing + product templates.
**Checklist:** table of title/description/OG per template; no missing/duplicate titles.
**Blocks on:** SEO-1 (know the real route set first).

### Stream SEO-3 — Canonicals
**Engine:** canonical rules vs `productStaticParams` / slug policy.
**Checklist:** one canonical per product/category; params match slug policy.
**Blocks on:** SEO-1.

### Stream SEO-4 — robots / noindex
**Engine:** `app/(site)/robots.ts` + per-route headers.
**Checklist:** policy doc + live headers verify app/auth routes are noindex.
**Blocks on:** nothing (parallel to SEO-1).

### Stream SEO-5 — JSON-LD
**Engine:** structured-data emitters (not landed).
**Checklist:** valid Product/Organization JSON-LD passes a validator.
**Blocks on:** SEO-2/3.

## Status
| Stream | State | Blocks on |
|--------|-------|-----------|
| SEO-1 sitemap↔routes | OPEN | — |
| SEO-2 metadata | OPEN | SEO-1 |
| SEO-3 canonicals | OPEN | SEO-1 |
| SEO-4 robots/noindex | OPEN | — |
| SEO-5 JSON-LD | OPEN | SEO-2/3 |

**Depends on:** site pages existing (Site track). **Kill:** claiming SEO done because a sitemap file exists.
