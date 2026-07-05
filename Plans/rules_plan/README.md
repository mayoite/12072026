# Governance plans — read in order

**Baseline:** 2026-07-05  
**Product execution** lives in [`fn_plan/README.md`](../fn_plan/README.md) — open that for day-to-day 1A/1B work.  
**This folder** holds binding governance: benchmarks, implementation decisions, quality gates.

## Packs (top → bottom)

| # | Folder | Role |
|---|--------|------|
| 00 | [`00-global-standard-revision/`](00-global-standard-revision/) | Phase 0 — Global Standard benchmark + critique (2026-07-04) |
| 01 | [`01-phase1-execution/`](01-phase1-execution/) | Phase 1 — pins, gates, plan slices, review workflow |

**Archive (immutable):** [`archive/00-global-standard-revision/`](archive/00-global-standard-revision/)  
**Historical phase specs:** `archive/plans/2026-07-05_phase1-execution/phases/` (repo `archive/` — not renamed)

---

## 00 — Global standard revision

| # | File | Role |
|---|------|------|
| 00 | [`00-benchmark-summary.md`](00-global-standard-revision/00-benchmark-summary.md) | BP / REC / REJ summary |
| 01 | [`01-critique-summary.md`](00-global-standard-revision/01-critique-summary.md) | Critique summary |
| 02 | [`02-handover-summary.md`](00-global-standard-revision/02-handover-summary.md) | Phase 0 handover |
| 03 | [`03-critique-expanded.md`](00-global-standard-revision/03-critique-expanded.md) | Full critique copy |

---

## 01 — Phase 1 execution

**Start:** [`00-handover-routing.md`](01-phase1-execution/00-handover-routing.md)

| # | File | Role |
|---|------|------|
| 00 | `00-handover-routing.md` | Route map for all plan paths |
| 01 | `01-implementation-decisions.md` | **Binding** pins, routes, GS framework |
| 02 | `02-plan-foundation.md` | Plan phases 00–03 |
| 03 | `03-plan-delivery.md` | Plan phases 04–07 |
| 04 | `04-plan-closeout.md` | Plan phases 08–10 |
| 05 | `05-benchmark-foundation.md` | Benchmarks 00–03 |
| 06 | `06-benchmark-delivery.md` | Benchmarks 04–07 |
| 07 | `07-benchmark-governance.md` | Benchmarks 08–10 |
| 08 | `08-quality-gates.md` | Coverage + release gates |
| 09 | `09-design-benchmark-protocol.md` | Benchmark protocol |
| 10 | `10-review-workflow.md` | Review workflow |

---

## Authority stack

```text
PACKAGES.md
  → rules_plan/01-phase1-execution/01-implementation-decisions.md
  → rules_plan/00-global-standard-revision/00-benchmark-summary.md
  → fn_plan/00-REVISION.md (product sequencing — overrides conflicting execution text)
  → fn_plan/01-START.md … 04-HANDOVER.md
```

When `fn_plan/` and `PACKAGES.md` conflict on SVG tooling, **PACKAGES.md wins**.
