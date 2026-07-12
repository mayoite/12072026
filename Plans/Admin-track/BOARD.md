# Admin-track

> [Plans/INDEX.md](../INDEX.md) · **Bar:** [00-QUALITY-BAR](../00-QUALITY-BAR.md)

**A1–A3 are SVG foundations. A4–A8 define the actual admin product.**

| Card | Status | Owns |
|------|--------|------|
| [A1](./A1-admin-svg-publish.md) | **DONE** | Real UI journey: list → editor → Publish → HTTP 200 → visible feedback → bytes |
| [A2](./A2-svg-pipeline.md) | **DONE** | 5/5 live descriptors published; 16 revisions + 1 pointer excluded; 0 orphans |
| [A3](./A3-production-auth.md) | **DONE** | Production rejects anonymous page/API access and ignores the bypass flag |
| [A4](./A4-no-code-svg-studio.md) | **OPEN** | Visual SVG engine — A4.0 foundation + authority bridge + canvas shell in code; browser disk proof next |
| [A5](./A5-catalog-operations.md) | **OPEN** | Unified catalog lifecycle, bulk import/export, quality queue |
| [A6](./A6-workstation-system-authoring.md) | **OPEN** | No-code linear/L workstation family, rules, 2D/3D/BOM |
| [A7](./A7-pricing-boq-governance.md) | **OPEN** | Versioned price books and BOM pricing |
| [A8](./A8-release-audit-rollback.md) | **OPEN** | Review, release, audit, impact, rollback |

**Honesty:** SVG catalog ≠ Fabric plan canvas. Do not “prove” planner symbols via admin publish alone.

```
A1–A3 foundation → A4 visual engine → A5 catalog ops → A6 systems → A7 pricing → A8 release governance
```

## Execution changes

- Admin is not “an SVG page”. It owns the sellable product system.
- Every mutation needs lifecycle state, permissions, audit, failure handling, and rollback.
- No-code means visual tools and plain-language rules, not a friendlier JSON form.
- Every card needs buyer-visible browser proof before status changes.

**Evidence:** `results/planner/p0-1-admin-svg-publish/` · `results/planner/admin-svg-pipeline/` · `results/admin/production-auth/`
