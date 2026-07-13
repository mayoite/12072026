# Product vision and architecture

## Vision

Oando should connect inventory, layout, and commercial handoff without re-keying.

The primary loop is simple:

1. Admin publishes trusted inventory.
2. Site helps a public visitor discover Oando.
3. The visitor enters Planner.
4. The customer designs with available products.
5. Planner creates a branded BOQ.
6. The customer sends the BOQ to Oando.

The canvas is not the whole product.

Catalog truth and BOQ handoff are equally important.

## Current tracks

- Admin owns catalog authoring, lifecycle, publication, and audit.
- Site owns public acquisition, content, discovery, SEO, and measurement.
- Planner owns layout, 2D/3D continuity, BOQ, and submission.
- Security owns cross-track authorization, permissions, integration security, and release provenance verification.

UI, accessibility, and performance apply inside the product tracks.

## Product boundaries

- The Products database is the released catalog and SVG authority.
- Admin writes released SVG revisions through a server-only transaction.
- Planner imports released SVGs through a server API.
- Static catalog files are migration inputs or isolated fixtures only.
- Published SVG is the primary 2D symbol.
- `Block2D` is a loading or missing-asset fallback.
- BOQ is branded and product-backed.
- Commercial pricing requires an approved price authority.
- Demo prices must not reach customers as truth.
- Archives, research, and screenshots are reference only.

## External benchmark

Professional planning tools join 2D, 3D, product data, and output lists.

Oando should meet that workflow bar without copying their assets or visual identity.

The detailed Planner interface benchmark is `06-UI-BENCHMARK.md`.

The detailed SVG-first Admin benchmark is `07-ADMIN-UI-BENCHMARK.md`.

The database SVG contract is `08-DATABASE-SVG-CONTRACT.md`.

The public Site benchmark is `09-SITE-UI-BENCHMARK.md`.

Useful references:

- [Configura CET](https://www.configura.com/products/cet/commercial-interiors)
- [pCon.planner](https://docs.pcon-solutions.com/pCon/planner/8.14/pCon.planner_8.14_Features_EN.pdf)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [Google Search guidance](https://developers.google.com/search/docs)
- [OpenAPI](https://spec.openapis.org/oas/)
- [buildingSMART IFC](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/)

## Quality targets

- WCAG 2.2 AA for customer and Admin workflows.
- Risk-based OWASP ASVS Level 2 target.
- LCP at most 2.5 seconds at the 75th percentile.
- INP at most 200 milliseconds at the 75th percentile.
- CLS at most 0.1 at the 75th percentile.
- Stable versioned internal document and catalog contracts.
- OpenAPI and IFC evaluation only after the core workflow is trustworthy.

These targets raise quality.

They do not replace owner intent.
