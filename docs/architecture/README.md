# Product vision and architecture

## Vision

Connect inventory, layout, and commercial handoff without re-keying.

1. Admin publishes trusted inventory.
2. Site helps visitors discover Oando.
3. Visitor enters Planner.
4. Customer designs with available products.
5. Planner creates a branded BOQ.
6. Customer sends the BOQ to Oando.

Canvas, catalog truth, and BOQ handoff are equally important.

## Tracks

| Track | Owns |
|---|---|
| Admin | Catalog authoring, lifecycle, publication, audit |
| Site | Acquisition, content, discovery, SEO, measurement |
| Planner | Layout, 2D/3D, BOQ, submission |
| Security | Auth, permissions, integration security, release provenance |

UI, accessibility, and performance apply inside product tracks.

## Current vs target

When docs and code differ, code wins until cutover is proven.

| Area | Target | Live (2026-07) |
|---|---|---|
| Released SVG | Products DB + R2 artifact bytes | **Disk** — `inventory/descriptors/`, `public/svg-catalog/` |
| Planner SVG read | DB revision bytes via API | `svg-blocks` reads usable `block_descriptors` rows when configured, with disk fallback; not revision artifact bytes |
| Marketing catalog | Products DB | Products DB — `catalog_products` |
| Planner managed catalog | Products DB | Products DB — `planner_managed_products` |
| Publish dual-write | One DB transaction + pointer | Best-effort stub on both Admin publish entrypoints; disk remains authority |
| Lifecycle + audit | Durable store | `results/admin/catalog-ops/` |

Remove split authority via `08-DATABASE-SVG-CONTRACT.md`; active blockers live in `../../Failures.md`.

## Boundaries (target)

- Products DB: target catalog + SVG authority; **live SVG is disk** until cutover.
- Admin: server-only publish transaction (target); disk write first (live).
- Planner: server API import (target); disk descriptors (live).
- Static files: fixtures, migration input, or **current live SVG** — never silent DB override after cutover.
- Published SVG primary; `Block2D` only for load/missing.
- BOQ branded and product-backed; no demo prices as commercial truth.
- Pricing needs approved authority. Archives/research are reference only.

## Benchmarks

| Contract | Doc |
|---|---|
| Planner UI | `06-UI-BENCHMARK.md` |
| Admin SVG UI | `07-ADMIN-UI-BENCHMARK.md` |
| DB SVG publication | `08-DATABASE-SVG-CONTRACT.md` |
| Site UI | `09-SITE-UI-BENCHMARK.md` |
| Security | `10-SECURITY-BENCHMARK.md` |
| Live runtime | `11-RUNTIME-ARCHITECTURE.md` |

References: [Configura CET](https://www.configura.com/products/cet/commercial-interiors) · [pCon.planner](https://docs.pcon-solutions.com/pCon/planner/8.14/pCon.planner_8.14_Features_EN.pdf) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) · [Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds) · [Google Search](https://developers.google.com/search/docs) · [OpenAPI](https://spec.openapis.org/oas/) · [IFC](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/)

## Quality targets

WCAG 2.2 AA · OWASP ASVS L2 (risk-based) · LCP ≤2.5s · INP ≤200ms · CLS ≤0.1 (75th pctl) · versioned internal contracts. OpenAPI/IFC only after core workflow is trustworthy. Targets raise quality; they do not replace owner intent.

## Package map

Live `site/` decision tree: **`docs/site/ARCHITECTURE.md`**.  
Features: **`docs/site/features.md`**. Tests: **`docs/site/tests.md`**.
