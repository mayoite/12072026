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
| Tech stack | Toolchain, engines, gates, env honesty (not product UX) |

UI, accessibility, and performance apply inside product tracks.

## Current vs target

When docs and code differ, **code wins** until cutover is proven.

| Area | Target | Live (2026-07-18) |
|---|---|---|
| Released SVG | Products DB + immutable R2 artifact bytes | **Disk** — `inventory/descriptors/`, `public/svg-catalog/` |
| Admin publish | One DB transaction + product pointer | Disk first; dual-write **only** when Products DB + R2 probe + pointer column (`resolveSvgPublishDualWriteDeps`) |
| Dual-write payload | Full revision + artifact bytes | When enabled: artifacts may write; **still not** sole release authority — enabled ≠ cutover |
| Planner SVG read | DB revision bytes via API | `svg-blocks` DB-aware + disk fallback; published SVG gate still disk |
| Parametric pen | Maker only | **Live:** `drawLinearDesk` / form+CLI+publish. Freehand Excalidraw = draft stage only |
| Admin studio chrome | Existing `AdminSvgDockHost` + Aria + Phosphor for freehand and factory modes | **Live:** freehand uses `AdminSvgDockHost`; parametric still uses a CSS grid + `CanvasToolRail` |
| Marketing catalog | Products DB | Products DB — `catalog_products` |
| Planner managed catalog | Products DB | Products DB — `planner_managed_products` |
| Lifecycle + audit | Durable store | `results/admin/catalog-ops/` (filesystem) |
| BOQ handoff | Traceable CRM + staff notify | `POST /api/planner/handoff` → `customer_queries` + optional Resend |
| Order factory (Part C) | C3 publish + C4 place/BOQ browser | Code paths exist; **ship bar = browser evidence** (see `plan/Admin/`, `docs/approach.md`) |

Active cutover / blockers: `../../Failures.md`. Contract: `08-DATABASE-SVG-CONTRACT.md`. Operate: `../approach.md`.

## Boundaries (target)

- Products DB: target catalog + SVG authority; **live SVG is disk** until cutover.
- Admin: server-only publish transaction (target); disk write first (live).
- Planner: server API import (target); disk descriptors (live) with DB-aware fallback.
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
| Dependencies / engines | `12-DEPENDENCIES-ENGINES.md` |
| Parametric product factory | `13-PARAMETRIC-PRODUCT-FACTORY.md` |

**Benchmarks are acceptance targets.** They are not PASS certificates. Execution lives under `plan/` as **duos** (CHECKLIST + FEATURES) per track; **Admin** also keeps `IMPLEMENTATION-PLAN.md` + `REALITY-AND-STACK.md` (exactly four files). One blockers file per track: `agent-reports/{PLANNER,ADMIN,SITE,TECH-STACK}.md`.

References: [Configura CET](https://www.configura.com/products/cet/commercial-interiors) · [pCon.planner](https://docs.pcon-solutions.com/pCon/planner/8.14/pCon.planner_8.14_Features_EN.pdf) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) · [Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds) · [Google Search](https://developers.google.com/search/docs)

## Quality targets

WCAG 2.2 AA · OWASP ASVS L2 (risk-based) · LCP ≤2.5s · INP ≤200ms · CLS ≤0.1 (75th pctl) · versioned internal contracts. Targets raise quality; they do not replace owner intent or live gates.

## Package map

Live `site/` decision tree: **`docs/site/ARCHITECTURE.md`**.  
Features: **`docs/site/features.md`**. Tests: **`docs/site/tests.md`**.  
Stack engines/deps: **`docs/architecture/12-DEPENDENCIES-ENGINES.md`**.  
Stack proof bar: **`plan/TechStack/CHECKLIST.md`** (evidence + phases) + **`plan/TechStack/FEATURES.md`**.
