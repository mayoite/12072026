# Planner — status

**Date:** 2026-07-17  
**Deploy:** **NOT READY**  
**Plans:** `plan/Planner/COMPLETION-CONTRACT.md` · `FINISH-PLAN.md` · `FEATURES.md`

## Agents

| # | Scope | Status |
|---|--------|--------|
| 1 | Draw: wall grips, opening drag (P4 / PF-05–06) | **DONE** → `2026-07-17-planner-agent1-draw.md` |
| 2 | Catalog family / compare (PF-22) | **DONE** → `2026-07-17-planner-agent2-catalog.md` |
| 3 | Handoff + validation + BOQ (P8–P10) | **DONE** → `2026-07-17-planner-agent3-handoff-boq.md` |
| P-W1 | Underlay calibrate + import residual (P5) | **DONE** (unit) → `2026-07-17-pw1-underlay.md` |
| P-W2 | Mobile shell / a11y nudge (P3/P14) | **DONE** (unit) → `2026-07-17-pw2-shell-a11y.md` |
| P-W3 | Sync conflict UI (P13 keep-local/cloud) | **DONE** (unit) → `2026-07-17-pw3-conflict.md` |
| TDD-1 | Catalog TDD | **RUNNING** |
| TDD-2 | Draw geometry TDD | **DONE** — 228+8 tests · `2026-07-17-tdd2-planner-draw.md` |

Parent will not cancel without owner ask.

## Loop
Draw/import → place furniture → Review BOQ → Send to Oando

## Gates
| Gate | Result |
|------|--------|
| Agent1 focused unit (51 + 5) | **PASS** |
| Agent2 focused unit (17) | **PASS** |
| Agent3 focused unit (74) | **PASS** |
| P-W1 underlay unit (34) | **PASS** |
| P-W2 shell/nudge unit (20) | **PASS** |
| P-W3 conflict unit (14 + 7) | **PASS** |
| TDD-2 geometry+canvas (228) + openings (8) | **PASS** |
| layout | PASS (agents) |
| Full `pnpm run test` | OPEN |
| Browser acceptance | **OPEN** |
| build / release:gate | OPEN |

## Agent1 draw (unit)
- Wall grips + opening drag + dim drafts unit-green  
- Browser reshape: **OPEN**

## Agent2 catalog PF-22 (unit)
- Family group/filter/compare helpers + InventoryPanel  
- Facets: family, material, availability, seats, width  
- Cards: name, SKU, family, variant, dims, availability  
- Compare table max 4  
- Browser UI-CAT: **OPEN**

## Agent3 commercial (unit + config)
| Phase | Truth |
|-------|--------|
| P8 validation | Overlap, wall-collision, room-boundary, aisle, opening-obstruction |
| P9 BOQ | bridges → cart / branded PDF / handoff |
| P10 handoff | CRM + Resend config; CSRF + idempotency |

## Env (names only)
| Key | Status |
|-----|--------|
| `NEXT_ADMIN_SUPABASE_URL` + `SUPABASE_ADMIN_SERVICE_ROLE_KEY` | SET |
| `RESEND_API_KEY` + `STAFF_NOTIFY_EMAIL` | SET |

## TDD-2
- Pure: `wallEndpointsAfterGripMove`; exact clamp/gap/exclude; room chain; dim chain
- Suites: geometry + canvas **228 PASS**; openings actions **8 PASS**; layout OK
- Browser grips/opening drag still **OPEN**

## TDD-1
- Strengthened PF-22 pure helpers: list metadata, compare/list name-SKU align, panel facet mapper.
- Vitest `tests/unit/features/planner/catalog` **693 pass**; `catalogFamilyBrowse` **14**.
- Wired `InventoryPanel` to `buildCatalogListMetadata` + `catalogFacetsFromPanelFields`.
- Slice: `2026-07-17-tdd1-planner-catalog.md`. Browser family/compare still OPEN.

## P-W3
- contentHash pure helpers: divergent hash → conflict; same hash → newest; explicit `resolveConflict` / `applyConflictResolution`
- `PlannerSyncConflictDialog`: keep-local / keep-cloud, busy guard, hash+time meta, a11y basics
- Focused vitest **21 PASS**; layout OK · slice `2026-07-17-pw3-conflict.md`
- Host still does not open dialog / apply winner document → product path **OPEN**

## P-W2
- Phone top bar: deliberate **2-row** (not 3-stack wrap); slim `chromeMode` on mobile Modular
- Bottom tool chrome host + horizontal dockManaged rail markers
- Mutually exclusive Inventory/Properties sheets unit; canvas stage `min(60dvh)` + landscape CSS
- Paper surface honesty: `data-planner-surface="paper"` (PF-32 measure still OPEN)
- Arrow nudge a11y unit: 100 mm / Shift 10 mm; editable+button skip
- Focused vitest **20 PASS**; layout OK · slice `2026-07-17-pw2-shell-a11y.md`
- Browser phone canvas-share / landscape / axe / full keyboard journey **OPEN**

## P-W1
- Underlay 5 m / 10 m width + 2-point pure apply; scale normalize + JSON reload revive
- `buildLockedUnderlayFromFloorPlan` default 10 m; import MIME/size gate
- Properties empty chrome: 5 m / 10 m + 2-point known distance
- Focused vitest **34 PASS**; layout OK · slice `2026-07-17-pw1-underlay.md`
- Browser sketch→calibrate→reload **OPEN**; host builder wire optional residual

## X-W1

**Slice:** CSRF/rate matrix sample — handoff lock + planner mutators static proof.  
**Report:** `agent-reports/2026-07-17-xw1-csrf.md`

| Item | Status | Evidence |
|------|--------|----------|
| `planner/handoff` CSRF + rate | **PASS** (static) | `requireCsrf: true`, `rateLimit: 10` locked in matrix unit |
| sketch-to-plan / export cloud / plans | **PASS** (static) | withAuth + requireCsrf |
| Audit script live tree | **PASS** | 0 errors; mutators include planner/* |
| Browser CSRF on Send BOQ | **OPEN** | not run |

## Open next
1. TDD-1 residual if any  
2. **Browser:** grips, openings, inventory compare, Review → Send, underlay calibrate reload, **phone shell canvas ≥60%**  
3. P13 host: wire hydrate conflict → dialog → apply plan document  
4. Full suite / release:gate  

## Bar
Unit ≠ browser for **release**. Owner ordered FINISH-PLAN ticks: unit-proven items marked **[PASS]** with browser OPEN notes. **All 3 Planner product agents DONE (unit).** TDD-2 unit DONE. P-W1/P-W2/P-W3 unit DONE; browser and P13 host apply OPEN.
