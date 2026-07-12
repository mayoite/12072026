# Product context

Why O&O builds this — for anyone not in the business.

**Law:** `AGENTS.md` · **Plan:** `Plans/Planner-track/BOARD.md` · **Research ideas:** external `websites` folder (patterns only — never paste into `site/`)

## Business

Premium custom office / workstation furniture — **not** IKEA-style fixed catalog. Projects take **days** of recon; can scale to **thousands of seats**. Customers wait hours to days for design turnaround today.

## Money

| Rent vendor stack | ~$40k + ~$10k/yr | Lock-in |
| Own stack | ~$1–1.5k/mo | We control roadmap |

## 6-month prototype bar

Buyer-usable planner + **one** workstation family (size grid, linear/L, modules) at meaningful scale. Browser-proven path toward quote.

**Not in scope yet:** full factory ERP, photoreal, enterprise parity.

## Engines (intent — pins in `Plans/Planner-track/CONSTRAINTS.md`)

| Layer | Live target |
|-------|-------------|
| Live workspace | `features/planner/project/` + Fabric plan stage (owner accepted) |
| 2D plan-draw | Fabric.js sole interactive plan canvas (`PlannerCanvasStage`) |
| 3D | Three + orbit ON for planner |
| Inventory symbols | Admin A4 studio: full drawing tools for catalog items → publish `svg-catalog/` only |
| SVG catalog | **Inventory publish only** — never the room plan-draw surface |
| Plan symbols on stage | Block2D multiprim on Fabric (P05) — not raw catalog SVG as draw engine |
| Licenses | `docs/Lockedfiles/03-dependencies-engines-current.md` |
