# Admin checklist

**Status:** OPEN  
**Code map:** `FEATURES.md`  
**Blockers:** `../../Failures.md`  
**Notes (not proof):** `../../agent-reports/ADMIN.md`

## Outcome

Trusted inventory admin: author SVG → **publish to disk** → lifecycle / families / prices → Planner + Site consume.

## Rules

- Live code wins. Unit ≠ browser. `results/` ≠ PASS.
- Status: **OPEN** · **PARTIAL** · **PASS** · **FAIL**.
- Disk is live SVG authority until cutover is browser-proved (`Failures.md`).
- Unit green + browser still needed → **PARTIAL**, not PASS.
- Tests never write canonical catalog.

## Open now (important)

| Item | Status |
|------|--------|
| Browser publish / unauth / deploy auth | OPEN / PARTIAL |
| DB-SVG cutover (`SVG_RELEASE_AUTHORITY=db`) | OPEN — disk live |
| Dual-write 22 batch | Owner-env report only — re-run; not cutover |
| Parametric desk form (PL-3) | OPEN |
| Parametric draw (PL-2) | PARTIAL (unit/CLI) |
| Planner place parametric / brand SVG | OPEN |

## Phases (A0–A14)

| Id | Work | Status |
|----|------|--------|
| A0 | Test isolation | PARTIAL (unit) |
| A1 | Shell / auth / nav | PARTIAL (unit; browser OPEN) |
| A2 | SVG authoring: **studio draft** + **parametric fields→draw** | OPEN / PARTIAL |
| A3 | Publish pipeline (disk) | PARTIAL (unit; browser OPEN) |
| A4 | Lifecycle / bulk | PARTIAL |
| A5 | Families | PARTIAL |
| A6 | Price books | PARTIAL |
| A7 | DB-SVG cutover | OPEN |
| A8 | Planner handoff | OPEN |
| A9 | Ops surfaces | PARTIAL |
| A10 | CRM demo honesty | PARTIAL |
| A11 | Security matrix | PARTIAL |
| A12–14 | Release / a11y | OPEN when claiming release |

## A2 — two authoring paths

| Path | Geometry truth |
|------|----------------|
| Inventory + Excalidraw studio | Draft only; publish freezes via pipeline |
| Parametric (PL-\*) | `draw*(fields)` only — client fills sizes, no code |

AI freeform SVG generate: **not** product (AF-11). Optional field-draft later (PL-AI) ≠ geometry.

## Parametric brand library

**Flow:** type → fields (mm/cm UI) → same `draw*` preview → publish disk → Planner place + BOQ name/SKU.

| Slice | Meaning | Status |
|-------|---------|--------|
| PL-2 | Schema + template draw + tests + CLI | PARTIAL |
| PL-3 | Admin form + preview + publish | OPEN |
| PL-4 | Planner place + BOQ browser | OPEN |
| PL-5 | Finesse / series presets | PARTIAL / OPEN |
| PL-6 | More types (after desk usable) | OPEN |
| PL-AI | Suggest fields only | OPEN — after PL-2 |

**Code:** `site/features/planner/asset-engine/svg/parametric/` · CLI `scripts:render-linear-desk`  
**Bar:** match/beat `public/svg-catalog/sample-desk-1.svg` (frame + top + pedestals).  
**Store mm.** Display mm/cm via `features/planner/model/units.ts`.

**Done enough (desk):** client sets cm/mm without code · preview = publish · guest places · BOQ name/SKU · tests green · AI cannot publish geometry.

## AF (open / partial only)

| Id | Issue | Status |
|----|--------|--------|
| AF-01/03 | Unauth admin page/API | PARTIAL (unit; browser OPEN) |
| AF-04/10 | Deploy / production auth | OPEN |
| AF-02 | Disk publish regressions | OPEN |
| AF-05 | Bulk UX dominance | OPEN |
| AF-06–08 | Phone / price / CRM browser | PARTIAL |
| AF-11 | AI freeform SVG | OPEN (not built) |
| AF-12 | CI catalog hash gate | OPEN |
| AF-18 | Full cutover | OPEN |

## Not this track

Planner canvas redesign · Site marketing · fake cutover · production CRM backend.
