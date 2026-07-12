# SEO track

**HEAD:** `7807198d` · **Engines:** `app/(site)/sitemap.ts`, `app/(site)/robots.ts`, page `metadata`, `productStaticParams`.
Phases are independent files. Checklist: [CHECKLIST.md](./CHECKLIST.md). Failures: [../FAILURES.md](../FAILURES.md). Proof = live run; `results/` = dump.

## Honest state
Queue exists; nothing closed. `STATIC_PATHS` diverge from live routes — that's the root bug.

## Phases
| File | Owns | Parallel? | Blocks on |
|------|------|-----------|-----------|
| [PHASE-01-sitemap-routes.md](./PHASE-01-sitemap-routes.md) | Sitemap ↔ live routes | yes | — |
| [PHASE-02-metadata.md](./PHASE-02-metadata.md) | Per-page title/description/OG | yes | 01 |
| [PHASE-03-canonicals.md](./PHASE-03-canonicals.md) | Product/category canonicals | yes | 01 |
| [PHASE-04-robots-noindex.md](./PHASE-04-robots-noindex.md) | robots / noindex policy | yes | — |
| [PHASE-05-jsonld.md](./PHASE-05-jsonld.md) | JSON-LD structured data | yes | 02,03 |

## Depends on
Site pages existing (Site track). Do not assume marketing is done.

## Guardrail
Claiming SEO done because a sitemap file exists = false green. Each phase needs a real diff/audit.
