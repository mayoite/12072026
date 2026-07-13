# Product vision and architecture

## Vision

Oando should connect inventory, layout, and commercial handoff without re-keying.

The primary loop is simple:

1. Admin publishes trusted inventory.
2. Any external customer enters Planner.
3. The customer designs with available products.
4. Planner creates a branded BOQ.
5. The customer sends the BOQ to Oando.

The canvas is not the whole product.

Catalog truth and BOQ handoff are equally important.

## Current tracks

- Admin owns catalog authoring, lifecycle, publication, and audit.
- Planner owns the public entry, layout, 2D/3D continuity, BOQ, and submission.

Site, UI, SEO, accessibility, performance, and security apply inside these tracks.

## Product boundaries

- Public static catalog files are the first authority.
- Cloud catalog storage is deferred until the local contract is stable.
- Published SVG is the primary 2D symbol.
- `Block2D` is a loading or missing-asset fallback.
- BOQ is branded and product-backed.
- Commercial pricing requires an approved price authority.
- Demo prices must not reach customers as truth.
- Archives, research, and screenshots are reference only.

## External benchmark

Professional planning tools join 2D, 3D, product data, and output lists.

Oando should meet that workflow bar without copying their assets or visual identity.

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
