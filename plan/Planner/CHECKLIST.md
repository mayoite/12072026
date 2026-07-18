# Planner checklist

**Status:** OPEN  
**Pair:** `FEATURES.md` = live code map (feature → path → gap).  
**This file:** all-encompassing execution document for the track  -  evidence rules **and** full phase checklist (what is required, what exists, what is open).  
**Active blockers:** `../../Failures.md`  
**Doc set:** only `CHECKLIST.md` + `FEATURES.md` per track.

---

## Part A  -  Evidence and completion rules

_Evidence and completion rules. Wins on how to prove done._

**Status:** OPEN  
**Authority:** This file is the **execution contract** for finishing Planner.  

**Code maps:** `FEATURES.md` (live paths).  
**UI bar:** `docs/architecture/06-UI-BENCHMARK.md`.  
**Security bar:** `docs/architecture/10-SECURITY-BENCHMARK.md`.  
**Active blockers:** `../../Failures.md` (real unresolved only).  
**Agent reports:** `../../agent-reports/`  -  short files + INDEX, never one mega dump.

---

## 1. Outcome

Deliver a professional **office-planning** workflow:

1. Draw or import the room (measured, closed, openings).  
2. Place and configure furniture (catalog identity preserved).  
3. Review, generate BOQ, send to Oando (traceable reference).

**Benchmark:** AutoCAD-class precision + SmartDraw-class usability.  
**Not:** a general CAD clone, not Admin/Site redesign.

---

## 2. Truth rules (non-negotiable)

| Rule | Meaning |
|------|---------|
| Live code wins | Not plan ticks, not agent prose |
| Fresh browser wins | UI claims require current Chromium on current source |
| Unit ≠ browser | Unit-green is never UI or handoff acceptance |
| `results/` is not proof | Raw tool output only; never PASS evidence alone |
| Old reports die | Dated baselines do not clear checkboxes |
| OPEN / FAIL / PASS only | OPEN = unverified. FAIL = fresh fail. PASS = evidence below |
| No hidden deferral | A Planner failure is not “later phase” without an explicit PF id |
| No silent skip | No `test.skip`, no forced clicks, no raised timeouts to mask blocks |
| No handwritten `any` | Handwritten product/test code |
| Secrets | `.env.local` only |

### What counts as PASS

A checklist item is **PASS** only when **all** that apply are true:

1. **Code** exists on the claimed path (FEATURES or this file).  
2. **Automated proof** for pure logic: focused vitest exit 0 with named files.  
3. **Browser proof** for customer-visible behaviour: Playwright or documented Chromium session  -  route, viewport, steps, console errors = 0, failed requests = 0.  
4. **Security-sensitive** behaviour: unit or integration that proves owner scoping / CSRF / role; browser if customer path.  
5. **Command + exit** recorded in the same session that claims PASS.  
6. Checkbox flipped **in the same change** as the proof, or left OPEN.

**Partial code with unit only** → mark **PARTIAL** in status tables, leave checklist **unchecked**.

---

## 3. Evidence protocol (exceeds CHECKLIST Part B (phases))

### 3.1 Gates (release acceptance)

Run from repo root. All must exit **0** for release claim:

| Gate | Command |
|------|---------|
| Layout | `pnpm run check:layout` |
| Lint | `pnpm run lint` |
| Typecheck | `pnpm run typecheck` (stable: no missing `.next/dev/types` race) |
| Planner unit | `pnpm --filter oando-site run test:planner` (or full `pnpm run test`) |
| Planner world e2e | `pnpm --filter oando-site run test:e2e:planner-world` |
| A11y sample | `pnpm --filter oando-site run test:a11y` |
| Build | `pnpm run build` (or site production build) |

Any gate FAIL → product phase may still progress; **release PASS is forbidden**.

### 3.2 Report shape (every slice)

Write under `agent-reports/YYYY-MM-DD-planner-<slice>.md` (≤50 lines):

```text
# Title
Verdict: PASS | PARTIAL | FAIL | OPEN
Evidence: commands + exits + routes
Done (bullet + path)
Not done (bullet + why)
```

Plus `agent-reports/YYYY-MM-DD-INDEX.md` linking slices.  
**Forbidden:** single multi-thousand-line “everything” report as sole deliverable.

### 3.3 Agents

When the owner authorizes agents:

| Role | Must |
|------|------|
| Implementer | Change code + tests; no PASS claim without commands |
| Parent | Re-run lint/typecheck/focused tests; write INDEX |
| Never | Mark FINISH checkboxes PASS without parent evidence |

---

## 4. Scope boundary

### In

Planner routes, identity, guest/member persistence, shells, draw/measure/snap/edit, JSON import, underlays, Sketch-to-Plan, inventory placement, 2D/3D parity, validation, BOQ, handoff, exports, optional AI, a11y/security/perf/recovery, Planner tests and browser acceptance.

### Out

Admin redesign, Site redesign, SVG Editor redesign, tech-docs product work, general SEO, unrelated DB.  
Inbound links (Dashboard, Choose Product, Portal, Admin) tested as **entry contracts** only.

### Brand and surface (added standard)

- Light Planner surfaces use **ecru paper stack** (`--color-ecru-*` via `--surface-*`), not cool pure-white-only UI.  
- Demo prices always labelled; never commercial authority.  
- Production never writes under `site/` or `site/public/`.

---

## 5. Product non-negotiables

Carry forward from CHECKLIST Part B (phases), enforced here:

- Sketch-to-Plan stays; AI optional overlay, never required, never docked permanent.  
- Layers not permanent customer panel; no customer `Panels` menu.  
- Dockview ≠ document state.  
- Primary tools visible; no second-level primary tool dropdown.  
- Canvas dominant (≥65% desktop viewport by default when shell work claims PASS).  
- `Import plan` = Planner JSON only; Sketch-to-Plan separate.  
- Bare guest URL = new draft; ID URL resumes only that draft.  
- Generated GLB: blob or approved object storage only.  
- Every drag has non-drag alternative.  
- **Authz:** plan load/save/delete owner-scoped in persistence SQL predicates.  
- **Guest GLB:** no overwrite of shared product keys (namespaced paths).  
- **Handoff:** member + CSRF + rate limit + user-scoped idempotency; fail-closed on lookup errors.

---

## 6. External benchmark (capability only)

Same spirit as CHECKLIST Part B (phases). **No** copying assets, code, layout, or trade dress.

| Source | Expectation |
|--------|-------------|
| AutoCAD | Snaps, units vs display, exact dims, grips, recovery, underlays, internal layers |
| SmartDraw | Scratch/template/import, closed rooms, typed dims, wall openings, calibrate import, distance guides, BOQ/export |

Official refs remain listed in `Part B (phase checklist in this file)` § External benchmark.

---

## 7. Failure registry (PF)  -  status vocabulary

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**.  
Update only with fresh evidence.

| ID | Failure | Bar to clear | Status seed |
|----|---------|--------------|-------------|
| PF-01–04 | Guest ID / draft isolation / tests | Browser two-UUID + unit | PASS (see CHECKLIST Part B (phases)) |
| PF-05 | Room outline incomplete | Exact rectangle room + closed geometry + unit + browser | OPEN (impl unit) |
| PF-06 | Persistent dimensions incomplete | Durable wall/room dims + zoom readable + browser | OPEN (impl unit) |
| PF-07–08 | Sketch UI / guest auth | TopBar + guest CSRF | PASS (code); browser OPEN |
| PF-09 | Scene GLB export honesty | Real download **or** remove menu item / honest unsupported | PASS (honesty)  -  no menu claim; preflight unsupported; scene export still P11 OPEN |
| PF-10 | Quote to Oando | Live CRM + browser reference | PARTIAL (API/code PASS; browser OPEN) |
| PF-11 | Overlap / clearance validation | Outside room + clearance + unit | PASS (unit); browser OPEN |
| PF-12 | Step completion awareness | Step state honest | PASS |
| PF-13 | Review & quote tests | Dedicated suite + behaviour | PASS (unit); browser OPEN |
| PF-16–17 | Full browser / mobile | P16 matrix rows | OPEN |
| PF-18–19 | Legacy layers / god workspace | Dead path gone; split host | OPEN |
| PF-20 | Contradictory save state | One authoritative machine | PASS (code); conflict/offline browser OPEN |
| PF-21 | Empty properties waste space | Collapse when no selection | PASS (code) |
| PF-22 | Catalog compare weak | Family/filter/compare usable | FAIL |
| PF-23 | Generic furniture quote path | All BOQ-eligible lines | PASS (unit); browser cart UI OPEN |
| PF-24–25 | Handoff call / CSRF / idempotency | Code + live CRM | PARTIAL (code PASS; CRM browser OPEN); PF-25 revision pin open |
| PF-26 | Branded BOQ PDF | Live Review download | PASS (code); Chromium download OPEN |
| PF-27 | 2D/3D parity browser | Switch + reload parity | OPEN |
| PF-28 | No site/public GLB write | 501 / storage path | PASS |
| PF-30 | **NEW** Plan write IDOR | Owner-scoped update/delete + tests | Must stay PASS |
| PF-31 | **NEW** Guest shared GLB overwrite | Namespaced keys + upsert policy | Must stay PASS |
| PF-32 | **NEW** Cool monochrome shell (no ecru) | Surfaces use ecru stack | OPEN until measured |
| PF-33 | **NEW** Project setup field collapse | Number inputs usable width ≥ 96px | OPEN until measured |
| PF-34 | **NEW** Modal a11y (Sync/Sketch) | Escape + focus trap + 44px targets | PARTIAL if unit only |

Add new PF ids rather than burying issues.

---

## 8. Execution phases

Same phase ids as CHECKLIST Part B (phases) (P0–P17) so work maps 1:1.  
**Difference:** each phase has **Exit gate** + **Proof required** + **Stop condition**.

### P0  -  Test isolation

**Proof:** no canonical catalog mutation; SW/dev chunk proof; deterministic browser bootstrap.  
**Exit:** Planner tests isolated; browser serves current source; baseline FAIL list reproducible.  
**Stop:** if tests write `site/public` or inventory  -  fix isolation before features.

### P1  -  Entry, UUID, identity

**Exit:** two guest UUIDs = two drafts; reload restores only that draft; no ID in source.  
**Proof:** unit entry matrix + `tests/e2e/planner-entry-states.spec.ts` (or equivalent) green.

### P2  -  Document, units, precision

**Exit:** measured size stable across save/load/unit/export.  
**Proof:** round-trip unit suite; unsupported schema fails visibly.

### P3  -  Workflow shell

**Exit:** customer knows step and next action without menus.  
**Proof:** desktop canvas ≥65% default; one save state; empty properties collapsed; mobile shell deliberate (portrait + landscape).

### P4  -  Draw room

**Exit:** measured closed room + doors/windows without guessing scale.  
**Proof:** unit geometry + browser “exact room” row in P16.  
**Must clear:** PF-05, PF-06, orthogonal lock, grips or documented alternative.

### P5  -  Import, underlay, Sketch-to-Plan

**Exit:** guest upload → calibrate → preview → accept → undo.  
**Proof:** CSRF/rate-limit unit; browser sketch journey; underlay scale survives reload.

### P6  -  Place furniture

**Exit:** workstation layout with exact spacing without endless drag.  
**Proof:** align/distribute/array unit + browser place/configure row.

### P7  -  2D/3D parity

**Exit:** same project equivalent in 2D and 3D after reload.  
**Proof:** `sceneParity` unit + browser switch row; no site/public writes.

### P8  -  Validation and review

**Exit:** Review never Ready with known blocking errors.  
**Proof:** outside-room + clearance + overlap unit; ReviewQuote tests; browser validation row.

### P9  -  BOQ truth

**Exit:** same revision → same BOQ in every format.  
**Proof:** one canonical builder; demo vs approved price separation; branded PDF wired + content test.

### P10  -  Send to Oando

**Exit:** one send → verifiable Oando reference.  
**Proof:** unit handoff + **live CRM browser** (API 200 alone insufficient for full PASS).

### P11  -  Export

**Exit:** every menu export downloads valid file or is removed.  
**Proof:** Chromium download tests; GLB implemented or removed; no empty corrupt files.

### P12  -  AI

**Exit:** AI total failure does not block draw/place/BOQ/handoff.  
**Proof:** optional overlay; keyboard usable; no invented SKUs/prices.

### P13  -  Persistence

**Exit:** no silent loss on reload/crash/retry.  
**Proof:** one save state machine; conflict UI; owner-scoped cloud save (PF-30).

### P14  -  A11y

**Exit:** axe no serious/critical on full journey; keyboard commercial outcome.  
**Proof:** axe + keyboard matrix; dialogs trap focus; 44×44 frequent targets.

### P15  -  Performance / structure

**Exit:** large-plan fixture usable; mobile entry not main-thread locked.  
**Proof:** budgets measured; `OOPlannerWorkspace` split by workflow; dead paths removed.

### P16  -  Browser matrix

Every cell needs a **fresh** pass. Viewports:

| Viewport | Size |
|----------|------|
| Desktop | 1440×900 |
| Compact | 1024×768 |
| Mobile portrait | 390×844 |
| Mobile landscape | 844×390 |

Copy journey rows from CHECKLIST Part B (phases) § P16. **No screenshots-only PASS.**

### P17  -  Final gates and docs

**Exit:** all gates in §3.1 green; FEATURES.md matches code; Failures.md only real blockers; stale plans removed after acceptance.

---

## 9. Required test coverage (minimum)

| Layer | Must cover |
|-------|------------|
| Unit | UUID keys, document invariants, walls/openings, snaps, dimensions, import sanitize, validation, BOQ determinism, handoff parse/idempotency, owner-scoped save/delete, GLB path policy, export MIME allowlist |
| Integration | Autosave, cloud conflict, route entry |
| Browser | P16 matrix; handoff only when CRM env real or explicit staging |
| A11y | Guest shell + Review + dialogs (Sync, Sketch) |

Name-mirror: `site/X/Y.ts` → `site/tests/unit/X/Y.test.ts`.

---

## 10. Dependency order

```text
P0 isolation
  → P1 identity
    → P2 document
      → P3 shell ──┬→ P4 draw ──→ P5 import/sketch
                   ├→ P6 place ──→ P7 3D
                   └→ P8 validate → P9 BOQ → P10 handoff
                                    P11 export
P12 AI (parallel, non-blocking)
P13 persistence (from P1; harden with P10)
P14 a11y (continuous; gate before release)
P15 perf/structure (continuous; block release if budgets fail)
P16 browser matrix (gates release)
P17 docs/gates
```

A blocker stops **only** direct dependants. Unrelated phases continue.

---

## 11. How this exceeds `Part B (phase checklist in this file)`

| Area | CHECKLIST Part B (phases) | This contract |
|------|-------------|----------------|
| Evidence | Strong intent | Explicit PASS recipe + gate table |
| Reports | Implicit | Short multi-file + INDEX mandatory |
| Security | Scattered | PF-30/31 + persistence predicates required |
| Brand UI | Silent | Ecru + setup field metrics (PF-32/33) |
| A11y dialogs | Late phase | PF-34 + continuous P14 |
| Agent work | “No subagents” in plan header | Owner-authorized agents + parent re-verify |
| False completion | Forbidden | Operationalized (PARTIAL vs PASS) |
| Typecheck hygiene | Not stated | No PASS under `.next` type race |

`Part B (phase checklist in this file)` remains the historical detailed checklist.  
**Use this contract for new claims of done.**

---

## 12. Immediate priority (execution queue)

Do not reorder without owner alignment.

1. **Stabilize gates**  -  layout, lint, typecheck (clean), focused planner tests.  
2. **Hold security**  -  PF-30/31 stay green.  
3. **P4 drawing**  -  PF-05 room, PF-06 dimensions, orthogonal.  
4. **P8–P9 commercial**  -  validation outside-room, branded BOQ, Review tests.  
5. **P3 shell**  -  one save state, empty properties, canvas share.  
6. **P16 browser**  -  entry, draw, place, review, handoff (staging).  
7. **P17 release**  -  full gates + build + Failures.md clean.

---

## 13. Owner acceptance

Planner is **complete** only when:

1. §3.1 all green.  
2. P16 matrix complete for desktop + mobile portrait at minimum; landscape and keyboard for commercial path.  
3. No Critical PF open.  
4. FEATURES.md and this contract agree with live code.  
5. Owner sign-off after production-like server check (not only `next dev`).

Until then: **Status remains OPEN.**

---

## Part B  -  Phase checklist (full)

_Full phase checklist: what is required, what exists, what is open._

Status: OPEN.

**Proof bar:** Evidence section above + FEATURES.md code paths. PASS needs same-session proof.

Owner instruction: Planner only. Agents only when the owner asks; parent re-verifies gates.

## Outcome

Deliver a professional office-planning workflow.

The benchmark is AutoCAD precision with SmartDraw usability.

The product is not a general CAD clone.

The customer journey is:

1. Draw or import the room.
2. Place and configure furniture.
3. Review, generate the BOQ, and send it to Oando.

## Truth rules

- Live code wins.
- Fresh browser behaviour wins.
- Every checklist item starts unchecked.
- Unit tests do not prove UI acceptance.
- Old reports do not prove completion.
- `results/` contains raw output only.
- Active blockers belong in `Failures.md`.
- No Planner failure may be hidden behind a later phase.
- No completed item may remain marked `OPEN`.
- No unverified item may be marked complete.

## Scope boundary

Included:

- Planner routes and entry contracts.
- Planner UUID and document identity.
- Guest and member persistence.
- Desktop and mobile Planner shells.
- Drawing, measurement, snapping, and editing.
- JSON import.
- Image, SVG, and PDF underlays.
- Sketch-to-Plan.
- Inventory and furniture placement.
- 2D and 3D parity.
- Validation.
- BOQ generation.
- Quote submission to Oando.
- Planner exports.
- Planner AI.
- Planner accessibility, security, performance, and recovery.
- Planner tests and browser acceptance.

Excluded:

- Admin redesign.
- Site redesign.
- SVG Editor redesign.
- Tech Docs work.
- General SEO work.
- Unrelated database work.

Inbound links from Dashboard, Choose Product, Portal, and Admin are tested as Planner entry contracts. Their pages are not redesigned here. A defect outside Planner becomes an explicit cross-track blocker.

## Non-negotiable product decisions

- Sketch-to-Plan stays.
- AI stays as an optional assistant.
- AI is never a required workflow gate.
- AI is not a docked panel.
- Layers are not a permanent customer panel.
- Internal drawing layers may exist for geometry, visibility, export, and performance.
- Dockview may manage desktop regions.
- Dockview must not define product workflow or document state.
- No customer `Panels` menu.
- No second-level toolbar dropdown for primary workflow tools.
- Primary actions remain directly visible.
- The canvas is the dominant surface.
- `Import plan` means Planner JSON only.
- `Sketch to plan` is a separate image or PDF action.
- A bare guest URL always starts a fresh draft.
- A guest URL with a valid ID resumes only that draft.
- Production runtime never writes into source code.
- Production runtime never writes under `site/` or `site/public/`.
- Runtime documents belong in memory, IndexedDB, database storage, or approved object storage.
- Generated GLB files use ephemeral blobs or approved object storage.
- Demo prices are never presented as approved commercial prices.
- Every drag action has a non-drag alternative.

## External benchmark

These sources define capability expectations. They do not authorize copying assets, code, layout, or trade dress.

### AutoCAD lessons

- Object snaps provide precise endpoint, midpoint, intersection, and object-relative placement.
- Drawing units separate calculation precision from displayed precision.
- Dynamic dimensions allow exact values while drawing and editing.
- Wall dimensions cover overall length, wall length, width, and intersections.
- Grips support direct reshaping and moving.
- Dimensional constraints preserve distances and angles.
- Autosave, backups, and recovery protect work.
- PDF import and underlays support traced source material.
- Internal layers organize, lock, hide, and export drawing classes.

Official references:

- https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-Core/files/GUID-76B81C1A-373E-4BCD-975A-789FB36C89FE.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Architecture/files/GUID-652DA67D-C364-43C6-A71D-FD1E676A0374.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Architecture/files/GUID-304D9844-4B1C-4ACA-A2BF-9C50FBA015B5.htm
- https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Architecture/files/GUID-3BA51ED7-3077-4E64-8788-A16682723B30.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-01DE459C-21A7-4E92-A1D6-E2C36CD89F0C.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-F7ED2587-8F25-4770-BD13-C7C95456E707.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-5692ECA7-091D-446B-B946-BC8FF893E296.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-3F8671B7-B5E7-4092-96C7-C7C330E6C06C.htm
- https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-02D97F82-47EC-4EE8-9429-E9CF6198EF34.htm

### SmartDraw lessons

- A customer can start from scratch, a template, or an imported plan.
- Rooms and walls close cleanly.
- Exact dimensions can be typed directly.
- Doors and windows snap and rotate with walls.
- Imported images and PDFs can be calibrated to scale.
- Furniture placement shows distance guides.
- Symbols retain structured product data.
- A manifest supports estimates and proposals.
- PDF, PNG, and SVG exports are expected.
- Precision must not require CAD training.

Official references:

- https://www.smartdraw.com/floor-plan/draw-floor-plans.htm
- https://www.smartdraw.com/floor-plan/import-and-scale.htm
- https://www.smartdraw.com/floor-plan/floor-plan-creator.htm
- https://www.smartdraw.com/visual-quoting/
- https://www.smartdraw.com/construction/

## Current verified failures

Execution update: 2026-07-17.

Current position: P1 PASS. P4 grips/openings unit PASS (2026-07-17 Agent1). PF-22 unit PASS (Agent2). P8–P10 unit PASS (Agent3). Browser exit gates still open.

| Phase | Execution status | Truth |
|---|---|---|
| P0 | PARTIAL | Selector, route-test, current-source, and browser-hang work passes. Isolation and service-worker proof remain. |
| P1 | PASS | Guest identity, reload recovery, member-owner scoping, and entry-state matrix (unit + browser new/resume/malformed/two-UUID isolation) pass. |
| P2 | PARTIAL | Wall centreline/thickness/start/end/joins contract defined (`wallContract.ts`). Remaining: fail-visibly on unsupported versions; preserve unknown safe data when schema permits. |
| P3 | PARTIAL | Ordered shell: canvas-first Dockview + gutters, pinned left rail, Layers in TopBar, slim More menu. Phone 2-row top + bottom tool chrome unit PASS (P-W2); browser canvas-share OPEN. |
| P4 | PARTIAL | Wall grips + opening drag reposition unit PASS (Agent1 51+5). Room/ortho/dims unit landed. Browser reshape OPEN. |
| P5 | PARTIAL | TopBar Sketch-to-Plan + preview/accept/reject wired; sketch-to-plan is guest+CSRF; legacy `project-sketch` returns 410. Underlay calibrate and dual-path cleanup remain. |
| P6 | PARTIAL | Family group/filter/compare unit PASS (Agent2 17). Placement/config live; exact spacing/row-array remain thin. Browser inventory OPEN. |
| P7 | PARTIAL | One document drives 2D/3D. `POST /api/planner/generated-glb` returns 501 `not_configured` (no `site/public` write). Blob/object-storage path still needed. |
| P8 | PARTIAL | Overlap + wall-collision + outside-room + aisle + opening-obstruction unit PASS (Agent3). Browser Review OPEN. |
| P9 | PARTIAL | Live BOQ bridges + branded PDF unit PASS (Agent3). Dual specialty `workstationBoqV0` remains. Browser PDF OPEN. |
| P10 | PARTIAL | Handoff CRM+Resend config unit PASS (Agent3 74). Live CRM browser row OPEN. |
| P11 | PARTIAL | Export success toasts are honest; empty floors blocked; **no GLB menu claim** (preflight unsupported). Member **Save plan JSON / BOQ CSV to cloud** via `POST /api/planner/export/cloud` (Supabase Storage). Scene GLB implementation and Chromium download proof remain. |
| P12 | PARTIAL | AI optional overlay; CSRF/rate-limit/degraded paths live; dead apply path no longer called from drawer. Browser failure journey open. |
| P13 | PARTIAL | Autosave live; divergent contentHash now returns conflict (no silent overwrite); explicit keep-local/cloud choice API. Conflict UI and immutable revisions remain. |
| P14 | PARTIAL | Arrow-key furniture nudge unit PASS (100 mm / Shift 10 mm; editable+button skip) P-W2. Full keyboard commercial journey and axe proof remain. |
| P15 | PARTIAL | Lazy 3D + honest 501 APIs. Layers panel unused by live host. OOPlannerWorkspace split and perf budgets remain. |

Fresh evidence:

- Commercial loop (2026-07-17 Agent B): ReviewQuotePanel send/export gating unit tests; `runFloorValidation` room-boundary + aisle-clearance; branded PDF + furniture quote-cart bridges unit-covered; properties dock collapses when empty. Commands to re-run: see agent-reports/2026-07-17-planner-finish-commercial.md.
- `useOpen3dWorkspaceAutosave.test.tsx` and `PlannerWorkspaceRoute.test.tsx`: 14 tests passed.
- A bare guest route minted two different UUID v7 URLs.
- Draft A saved a four-wall room.
- Draft B opened with zero objects.
- Reloading Draft A restored four objects and four walls.
- The browser exposed a Strict Mode overwrite defect before the fix. It did not recur after the hydration gate and route remount fix.
- `rg -i "start placing furniture" site/tests site/scripts` returned no matches.
- P1 owner, route, migration, and autosave suite: 54 tests passed.
- Dashboard, Choose Product, landing, product, Admin-link, and Portal entry suites: 64 tests passed.
- P2 units, schema, import, bridge, bounds, and round-trip suite: 105 tests passed.

| ID | Failure | Status |
|---|---|---|
| PF-01 | Guest UUIDs still map to one fixed IndexedDB project key. | PASS |
| PF-02 | A new guest URL can load an old guest draft. | PASS |
| PF-03 | The guest route unit test fails after the redirect change. | PASS |
| PF-04 | Onboarding tests still expect `Start placing furniture`. | PASS |
| PF-05 | Room outline incomplete for full acceptance. | PASS (unit) | Room outline + grips unit 2026-07-17 Agent1. Browser exact-room OPEN. |
| PF-06 | Persistent dimensions incomplete for full acceptance. | PASS (unit) | Dim drafts + opening-along-wall dims unit 2026-07-17. Browser OPEN. |
| PF-07 | Sketch-to-Plan has no customer UI entry. | PASS |
| PF-08 | Sketch-to-Plan requires member auth and blocks guests. | PASS |
| PF-09 | Planner scene GLB export. | PASS (honesty) | No export menu item claims downloadable GLB; `preflightPlannerExport("glb")` returns unsupported; no fake binary. Full scene GLB remains P11 OPEN. |
| PF-10 | Planner does not send a quote to Oando. | PASS (unit) | Handoff API + CRM env probe 2026-07-17 Agent3. Live browser Send OPEN. |
| PF-11 | Live overlap validation is incomplete. | PASS (unit) | Overlap + wall-collision + room-boundary + aisle + opening-obstruction. Browser Review OPEN. |
| PF-12 | Step navigation is labelled but not completion-aware. | PASS |
| PF-13 | Review and quote UI has no dedicated tests. | PASS (unit) | `ReviewQuotePanel.test.tsx`: send gating, guest block, demo confirm, BOQ/export disable on errors/empty, quote-cart wiring. Browser open. |
| PF-14 | Many browser scripts use the removed onboarding label. | PASS |
| PF-15 | The original localhost origin served stale Planner chunks. | PASS |
| PF-16 | Import, export, BOQ, quote, 3D, and AI lack one complete fresh browser pass. | OPEN |
| PF-17 | Mobile has only partial smoke proof. | OPEN |
| PF-18 | Legacy Layers and docking code remain in active Planner paths. | OPEN |
| PF-19 | `OOPlannerWorkspace.tsx` owns too many unrelated concerns. | OPEN |
| PF-20 | Save state is duplicated and contradictory. | PASS (code) | Live host: TopBar + `plannerSaveStatusLabel` only. Orphan `PlannerSaveIndicator` unused. Conflict/offline edge browser open. |
| PF-21 | Empty properties consume customer workspace. | PASS (code) | Dock closes properties when no selection (not review); `PropertiesPanel` returns null when empty without underlay actions. |
| PF-22 | Catalog comparison and family grouping are weak. | PASS (unit) | Family group/filter/compare + InventoryPanel unit 2026-07-17 Agent2. Browser OPEN. |
| PF-23 | Generic furniture cannot complete the quote-cart path. | PASS (unit) | `furnitureBoqBridge` + `buildPlannerFurnitureBoq` include non-workstation lines into quote cart / PDF / handoff. Browser cart UI open. |
| PF-24 | The handoff route is not called and does not deliver to Oando. | PASS (code) | Workspace Review **Send to Oando** calls `POST /api/planner/handoff`. Delivery: `customer_queries` insert (source `planner-handoff`) + optional Resend. 501 only if CRM admin client env missing. Live browser/CRM proof still open. |
| PF-25 | The handoff route lacks CSRF and idempotency. | PASS (unit) | CSRF + rate limit + user-scoped idempotency unit 2026-07-17. Immutable revision pin still OPEN. |
| PF-26 | Branded customer-ready BOQ is not wired to the live workspace. | PASS (code) | Review “Download branded BOQ PDF” → `exportBoqOnly` + `furnitureBoqToPdfRows`; demo-list labeled. Chromium download proof open. |
| PF-27 | 2D and 3D object parity lacks full browser proof. | OPEN |
| PF-28 | Runtime GLB generation can write under `site/public`. | PASS |
| PF-29 | Selection does not open properties. | PASS |

## Execution order

Dependencies are strict. A blocked item stops only its direct dependants.

### P0. Test isolation and clean authority

- [ ] Create a Planner-only test run identifier.
- [ ] Confirm tests use temporary drafts and temporary catalog fixtures.
- [ ] Confirm no test writes canonical inventory files.
- [ ] Confirm no runtime test writes under `site/` or `site/public/`.
- [PASS] Replace stale onboarding selectors in Planner tests and scripts.
- [PASS] Repair the guest route test for redirect and resume cases.
- [ ] Add a deterministic browser bootstrap.
- [PASS] Diagnose any browser hang before changing timeouts.
- [PASS] Prove the served chunks match current source.
- [ ] Prove localhost service-worker behaviour does not cache development chunks.
- [ ] Record every fresh failing test as `FAIL`.

Exit gate:

- Planner tests are isolated.
- The browser runs current source.
- The baseline failure list is reproducible.

### P1. Entry points, UUIDs, and document identity

- [PASS] Define one route contract for `/planner/`.
- [PASS] Define one route contract for `/planner/guest/`.
- [PASS] Define one route contract for `/planner/guest/?id=<uuid>`.
- [PASS] Define one route contract for `/planner/canvas/`.
- [PASS] Define one route contract for `/planner/canvas/?id=<uuid>`.
- [PASS] Define resume contracts for Portal plan links.
- [PASS] Verify inbound links from Dashboard and Choose Product.
- [PASS] Verify inbound links from Admin and public product pages.
- [PASS] Generate new IDs at runtime with a cryptographic UUID API.
- [PASS] Validate every URL ID before it reaches persistence or database code.
- [PASS] Reject malformed, empty, overlong, and ambiguous IDs.
- [PASS] Scope every guest IndexedDB key by guest plan ID.
- [PASS] Keep the legacy guest key only for explicit migration.
- [PASS] Make bare `/planner/guest/` create a new blank plan.
- [PASS] Make an ID URL resume only its matching plan.
- [PASS] Prevent one guest ID from overwriting another.
- [PASS] Scope member persistence by authenticated owner and plan ID.
- [PASS] Prevent plan-ID enumeration from exposing another customer plan.
- [PASS] Preserve guest-to-member claim without overwriting member work.
- [PASS] Test new, resume, migrate, missing, malformed, expired, and unauthorized states.

Exit gate:

- Two guest UUIDs produce two independent drafts.
- Reloading either URL restores only that draft.
- No ID is written into source code.

### P2. Document, units, scale, and precision

- [PASS] Keep millimetres as canonical calculation units.
- [PASS] Separate canonical units from displayed units.
- [PASS] Support mm, cm, m, inches, and feet-inches display.
- [PASS] Define linear, angular, area, and quantity precision.
- [PASS] Preserve full calculation precision during display rounding.
- [PASS] Define insertion scaling for imported objects.
- [PASS] Define a stable world origin and canvas transform.
- [PASS] Define object coordinates, rotation, dimensions, elevation, and floor ownership.
- [PASS] Define wall centreline, thickness, start, end, and joins.
- [PASS] Define opening host-wall and offset contracts.
- [PASS] Define furniture catalog identity, variant, configuration, and transform.
- [PASS] Version the Planner document schema.
- [PASS] Validate imports before replacing current state.
- [PASS] Migrate supported older versions.
- [ ] Fail visibly on unsupported versions.
- [ ] Preserve unknown safe data only when the schema permits it.
- [PASS] Add round-trip invariants for save, load, import, export, 2D, and 3D.

Exit gate:

- A measured object retains the same real size across save, load, unit changes, and exports.

### P3. Workflow and shell

- [PASS] Keep exactly three visible customer steps.
- [PASS] Make `Draw room` the first active task.
- [PASS] Make `Place furniture` the second task.
- [PASS] Make `Review & quote` the third task.
- [PASS] Allow backward navigation without losing work.
- [PASS] Permit forward navigation with clear incomplete-state warnings.
- [PASS] Do not fake completion by disabling exploration.
- [PASS] Show completion state for each step.
- [PASS] Show one authoritative save state (TopBar + `plannerSaveStatusLabel`; unit: `TopBar.saveStatus.test.tsx`).
- [PASS] Show offline, saving, saved, unsaved, and failed states distinctly (label table; cloud/offline strings).
- [ ] Keep desktop command bar to one row.
- [PASS] Keep direct Import, Sketch-to-Plan, Save, and Export actions.
- [PASS] Keep AI as an optional action.
- [PASS] Remove the customer `Panels` menu.
- [PASS] Remove permanent docked Layers and AI.
- [PASS] Collapse empty properties (`closePlannerDockPanel` on deselect; panel null when empty).
- [PASS] Open properties from selection context.
- [PASS] Use Dockview only for useful desktop regions.
- [ ] Make the desktop canvas at least 65 percent of viewport area by default.
- [PASS] Build a deliberate mobile top bar (2-row brand+actions / center; slim chromeMode; unit P-W2). Browser height share OPEN.
- [PASS] Build a deliberate mobile bottom tool bar (`mobileBottomChrome` + horizontal dockManaged rail; unit P-W2). Browser OPEN.
- [PASS] Use mutually exclusive mobile sheets for Inventory and Properties (unit: `data-panel-active` one-of; browser OPEN).
- [PASS] Keep the mobile canvas at least 60 percent of initial viewport height (CSS `min-height: min(60dvh, 100%)` on stage; browser measure OPEN).
- [PASS] Support portrait and landscape (CSS landscape compress chrome; browser matrix OPEN).
- [PASS] Reset only layout state when requested.
- [PASS] Never reset project content through a layout reset.

Exit gate:

- A new customer can identify the current task and next action without opening a menu.

### P4. Draw room

- [PASS] Implement room outline creation (unit: `roomOutline.ts` + `addRectangularRoom` + ExactRoomPanel; browser OPEN).
- [PASS] Support rectangle rooms by exact width and depth (unit: ExactRoomPanel → `addRectangularRoom`; browser OPEN).
- [PASS] Support connected wall chains.
- [PASS] Support automatic corner joining.
- [PASS] Support clean room closure.
- [PASS] Prevent duplicate and zero-length walls.
- [PASS] Support direct wall length input while drawing.
- [PASS] Support direct wall angle input while drawing.
- [PASS] Support wall thickness input.
- [PASS] Support orthogonal lock (unit: sticky OR Shift via `orthogonal.ts` + Fabric `orthogonalLock`; browser OPEN).
- [PASS] Support grid snap.
- [PASS] Support endpoint, midpoint, intersection, perpendicular, and nearest snaps.
- [PASS] Show snap markers and snap names.
- [PASS] Show live length and angle next to the pointer.
- [PASS] Allow Tab or an equivalent action to move between numeric fields.
- [PASS] Support Escape to cancel the active operation.
- [PASS] Support Enter to commit exact values.
- [PASS] Add doors and windows only to valid host walls (unit: `openingPlacement.ts` + Fabric host pick tolerance; browser OPEN).
- [PASS] Snap and rotate openings with host walls (unit: clamped along-wall + drag reposition Agent1; browser OPEN).
- [PASS] Support exact opening width and wall offset (unit: `PropertiesPanel` → `updatePlannerOpening`; no numeric entry during placement tool).
- [PASS] Prevent invalid or overlapping openings (unit: resolver + `assertOpening` same-wall overlap/end margin; browser OPEN).
- [PASS] Support wall selection grips (unit: `wallEndpointGrips` + Fabric wire Agent1; browser OPEN).
- [PASS] Support endpoint editing without corrupting connected geometry (unit: `movePlannerWallEndpointConnected` + grips; browser OPEN).
- [PASS] Implement persistent linear dimensions (unit: `dimensions.ts` + dimension tool + Fabric paint; browser OPEN).
- [PASS] Implement overall room dimensions (unit: `overallRoomDimensionDrafts` on exact room; browser OPEN).
- [PASS] Implement wall and opening dimensions (unit: wall drafts + `openingAlongWallDimensionDrafts` Agent1; browser OPEN).
- [ ] Implement distance and area measurement tools.
- [PASS] Keep dimensions readable across zoom (unit: fixed screen stroke/font; browser OPEN).
- [PASS] Export dimensions consistently (unit: `exportAsSVG` annotation paint; browser OPEN).
- [ ] Add columns and keep-out zones needed for office layout validation.
- [ ] Make undo and redo atomic for drawing operations.

Exit gate:

- A customer can create a measured closed room with walls, doors, and windows without guessing scale.

### P5. Import, underlay, and Sketch-to-Plan

- [PASS] Keep Planner JSON import separate.
- [ ] Accept only documented Planner JSON versions in `Import plan`.
- [PASS] Add a separate `Sketch to plan` action.
- [PASS] Support PNG and JPEG sketches.
- [ ] Support SVG floor-plan input safely.
- [ ] Support PDF floor-plan input or record a precise technical blocker.
- [ ] Sanitize SVG before preview or conversion.
- [ ] Limit file size, pixel count, page count, and processing time.
- [ ] Reject deceptive MIME types and malformed files.
- [ ] Add imported images and PDFs as locked underlays.
- [ ] Support underlay opacity, visibility, crop, rotation, and deletion.
- [ ] Calibrate underlay scale using a known reference distance.
- [ ] Preserve underlay scale across reload.
- [ ] Allow manual tracing over the underlay.
- [PASS] Wire the existing Sketch-to-Plan client to the customer UI.
- [PASS] Reconcile the two existing sketch endpoints into one contract.
- [PASS] Permit the intended external customer role.
- [PASS] Require CSRF protection for conversion requests.
- [PASS] Apply guest-safe rate limits.
- [PASS] Keep provider keys server-side.
- [PASS] Show upload, processing, preview, success, fallback, and failure states.
- [ ] Return converted walls, openings, scale confidence, and warnings.
- [PASS] Preview conversion before changing the project.
- [PASS] Require explicit customer acceptance.
- [PASS] Apply accepted geometry as one undoable transaction.
- [ ] Preserve the source underlay for comparison.
- [PASS] Never claim AI geometry is construction-authoritative.
- [ ] Test provider absence, timeout, invalid output, CSRF failure, and retry.

Exit gate:

- A guest can upload a sketch, calibrate it, preview editable geometry, accept it, and undo it.

### P6. Place and configure furniture

- [ ] Show recognizable product imagery or 2D geometry.
- [PASS] Show full name, SKU, family, variant, dimensions, and availability (unit InventoryPanel Agent2; browser OPEN).
- [PASS] Group variants by family (unit `catalogFamilyBrowse` + panel Agent2; browser OPEN).
- [PASS] Filter by family, seats, dimensions, material, and availability (unit facets Agent2; browser OPEN).
- [ ] Keep search keyboard accessible.
- [ ] Support click-to-place.
- [ ] Support drag-to-place.
- [ ] Provide a non-drag placement alternative.
- [ ] Show a placement ghost with true dimensions.
- [ ] Snap furniture to grid, walls, and nearby objects.
- [ ] Show distance guides to walls and nearby furniture.
- [ ] Support exact X, Y, width, depth, and rotation input.
- [ ] Preserve catalog identity during resize and rotation.
- [ ] Support duplicate, copy, paste, and delete.
- [ ] Support multi-select.
- [ ] Support align and distribute.
- [ ] Support exact spacing.
- [ ] Support rows and rectangular arrays for workstations.
- [ ] Support group and ungroup where product semantics allow it.
- [ ] Support front/back ordering where it affects 2D editing.
- [PASS] Prevent silent placement outside the room (unit room-boundary validation Agent3; browser OPEN).
- [PASS] Warn about clearance and overlap during placement (unit runFloorValidation Agent3; browser OPEN).
- [ ] Keep placed 2D geometry recognizable from the catalog preview.
- [ ] Keep configuration options attached to the placed instance.
- [ ] Recalculate BOQ data after every relevant edit.
- [ ] Make bulk actions one undoable transaction.

Exit gate:

- A customer can place and arrange a workstation layout using exact spacing without repeated manual dragging.

### P7. 2D and 3D parity

- [PASS] Define one source document for 2D and 3D.
- [ ] Remove divergent 2D-only and 3D-only state.
- [ ] Keep wall, opening, furniture, rotation, material, and floor parity.
- [ ] Rebuild 3D deterministically from the Planner document.
- [ ] Load approved generated GLB assets only.
- [ ] Use procedural fallback geometry visibly when GLB is unavailable.
- [ ] Never label a fallback as GLB-ready.
- [PASS] Remove production writes to `site/public`.
- [ ] Use browser blob URLs for ephemeral previews.
- [ ] Use approved object storage for persistent generated GLB files.
- [ ] Revoke stale blob URLs.
- [ ] Handle missing, slow, invalid, and unauthorized assets.
- [ ] Keep 3D lazy-loaded.
- [ ] Preserve camera usability on mouse, touch, and keyboard alternatives.
- [ ] Test repeated 2D and 3D switching without document drift.

Exit gate:

- The same saved project produces equivalent 2D and 3D contents after reload.

### P8. Validation and review

- [PASS] Replace overlap stubs with rotation-aware geometry.
- [PASS] Detect furniture outside closed rooms (`furnitureRoomBoundary` centre error + overhang warning).
- [ ] Detect wall and furniture intersections.
- [ ] Detect opening clearance conflicts.
- [PASS] Detect furniture-to-furniture overlap.
- [PASS] Detect aisle clearance between furniture (`furnitureClearance`, 900 mm warning).
- [ ] Detect unconfigured products.
- [ ] Detect missing catalog identity.
- [ ] Detect unavailable products.
- [ ] Detect missing approved prices.
- [ ] Detect unsupported geometry in exports.
- [PASS] Distinguish errors, warnings, and information.
- [PASS] Link every issue to the affected canvas object.
- [PASS] Focus or select the object from the issue list.
- [PASS] Revalidate after every relevant change (`useValidation` memo on active floor).
- [PASS] Do not claim regulatory compliance without an approved rule authority.
- [PASS] Show furniture count, seats, validation state, and BOQ readiness.
- [PASS] Add dedicated tests for Review and Quote (`ReviewQuotePanel.test.tsx`).

Exit gate:

- Review never says `Ready` while a known blocking error exists.

### P9. BOQ and commercial truth

- [PASS] Select one canonical BOQ builder (`projectFurnitureBoq` for live Review/export/handoff).
- [PASS] Reconcile generic furniture and workstation BOQ paths (bridge; specialty workstation export remains).
- [PASS] Include project identity and revision (`projectId`, `calculationHash`).
- [PASS] Include floor, product, SKU, configuration, quantity, and units.
- [ ] Include catalog revision and validation revision.
- [PASS] Separate priced and unpriced lines.
- [PASS] Separate demo prices from approved commercial prices (`priceSource`, pricing note).
- [ ] Block customer-ready price totals when price authority is absent.
- [PASS] Allow a clearly labelled unpriced draft BOQ.
- [PASS] Wire branded PDF BOQ to the live workspace (`exportBoqOnly` from Review).
- [PASS] Use approved Oando branding (`One&Only` brand header path).
- [ ] Remove placeholder branding.
- [PASS] Show warnings and unsupported items in every BOQ format (CSV unsupported section; PDF unpriced spec).
- [PASS] Make BOQ generation deterministic (`calculationHash` excludes clock).
- [PASS] Give every BOQ a traceable document version (`kind` + hash).
- [PASS] Test JSON, CSV, and branded PDF contents (unit; browser PDF open).

Exit gate:

- The same project revision produces the same complete BOQ in every supported format.

### P10. Send quote to Oando

- [PASS] Replace the workstation-only local cart bridge (furniture BOQ → quote cart).
- [PASS] Support all quote-eligible Planner products (generic + workstation lines).
- [PASS] Define the Planner handoff payload (`handoffTypes` + furniture BOQ bridge).
- [PASS] Include project revision and BOQ checksum (`calculationHash`).
- [PASS] Require explicit customer confirmation (demo pricing checkbox).
- [PASS] Collect only required contact and project data.
- [PASS] Require CSRF protection.
- [PASS] Apply rate limiting.
- [PASS] Apply idempotency (`idempotencyKey` → `requirement` lookup).
- [PASS] Prevent duplicate submissions after retry or reload (same key replays reference).
- [PASS] Validate authorization for member-only data (`withAuth` member).
- [PASS] Deliver to the approved Oando destination (customer_queries intake + optional STAFF_NOTIFY email).
- [PASS] Return a traceable submission reference.
- [PASS] Show sending, sent, failed, and retry states (workspace toast + reference).
- [PASS] Preserve the draft after failure.
- [PASS] Emit handoff analytics without sensitive payload data (HANDOFF_*).
- [ ] Verify the receiving system, not only the API response (browser + live CRM).

Exit gate:

- A customer can send a validated BOQ once and receive a verifiable Oando reference.

### P11. Export and interoperability

- [PASS] Keep JSON import and export round-trip safe.
- [ ] Verify SVG export dimensions and scale.
- [ ] Verify PNG export dimensions and background.
- [ ] Verify PDF vector quality, pages, branding, and scale notes.
- [ ] Verify DXF units, layers, walls, openings, furniture, and dimensions.
- [ ] Implement Planner GLB export for the supported 3D scene.
- [ ] Validate GLB structure before download.
- [ ] Include only policy-approved generated assets.
- [PASS] Report unsupported objects before export.
- [PASS] Use accurate filenames and MIME types.
- [PASS] Surface asynchronous export failures.
- [PASS] Prevent empty or corrupt downloads.
- [ ] Test downloads in Chromium from the real Planner UI.
- [ ] Separate draft plan exports from customer-ready BOQ exports.

Exit gate:

- Every visible export option downloads a valid file or is removed from the menu.

### P12. AI assistant

- [PASS] Keep AI optional.
- [PASS] Keep AI outside the core dock layout.
- [ ] Send only necessary plan context.
- [PASS] Keep provider keys server-side.
- [PASS] Verify live CSRF bootstrap.
- [PASS] Verify rate-limit behaviour.
- [ ] Verify provider failover.
- [PASS] Verify no-provider fallback.
- [PASS] Label degraded responses.
- [ ] Validate every structured suggestion.
- [PASS] Preview geometry-changing suggestions.
- [PASS] Require explicit acceptance.
- [PASS] Apply accepted suggestions as one undoable transaction.
- [ ] Prevent AI from inventing catalog SKUs or prices.
- [ ] Prevent AI from claiming compliance approval.
- [ ] Keep chat usable with keyboard and assistive technology.

Exit gate:

- AI can fail completely without blocking drawing, placement, BOQ, or handoff.

### P13. Persistence, recovery, and versions

- [ ] Use one authoritative autosave state machine.
- [PASS] Debounce saves without losing the final edit.
- [PASS] Flush safely on page lifecycle events where supported.
- [ ] Recover after tab crash or browser restart.
- [ ] Detect and explain storage quota failures.
- [ ] Handle IndexedDB denial or unavailability.
- [ ] Handle offline member saves.
- [ ] Resolve sync conflicts explicitly.
- [PASS] Never overwrite a newer remote revision silently.
- [ ] Add immutable named revisions for member plans.
- [ ] Pin catalog, validation, and price versions in commercial revisions.
- [ ] Keep local guest revisions clearly labelled as local.
- [ ] Support Save, Save as copy, restore, and delete with confirmation.
- [ ] Provide migration for the legacy shared guest key.
- [ ] Test recovery with real reloads and browser restarts.

Exit gate:

- No supported navigation, reload, crash, or retry path silently loses accepted work.

### P14. Accessibility and interaction quality

- [ ] Meet WCAG 2.2 AA for the primary journey.
- [ ] Complete the full journey with keyboard only.
- [ ] Keep focus visible and unobscured.
- [ ] Restore focus after menus, sheets, and dialogs close.
- [ ] Give every icon control an accessible name.
- [ ] Use correct button, menu, tab, dialog, and status semantics.
- [PASS] Announce save, import, conversion, validation, export, and handoff states.
- [PASS] Give every drag action a pointer and keyboard alternative (furniture arrow nudge unit: 100 mm / Shift 10 mm; editable+button skip). Full drag matrix residual OPEN.
- [ ] Keep frequent mobile targets at 44 by 44 pixels where practical.
- [ ] Support zoom without clipping critical controls.
- [ ] Respect reduced motion.
- [ ] Preserve contrast in focus, selection, grid, dimensions, and validation.
- [ ] Avoid colour-only state communication.
- [ ] Test screen-reader names and focus order.

Exit gate:

- Axe has no serious or critical issue in the full Planner journey.
- Keyboard users can complete the same commercial outcome.

### P15. Performance and reliability

- [ ] Split `OOPlannerWorkspace` by workflow responsibility.
- [PASS] Keep one source of document truth.
- [ ] Remove dead Layers, docking, BOQ, catalog, and AI paths after migration.
- [ ] Prevent unnecessary full-canvas rerenders.
- [ ] Virtualize large inventories when measurement proves it necessary.
- [PASS] Lazy-load 3D, PDF, GLB, and AI code.
- [ ] Measure initial Planner JavaScript.
- [ ] Measure interaction latency for draw, select, drag, and undo.
- [ ] Measure a representative large office plan.
- [ ] Keep zoom and pan responsive under the accepted object budget.
- [ ] Cancel stale network and AI requests.
- [ ] Revoke object URLs and dispose 3D resources.
- [ ] Keep service worker and HMR behaviour distinct.
- [ ] Capture console errors and failed requests in browser tests.
- [ ] Define and enforce performance budgets before release.

Exit gate:

- The accepted large-plan fixture remains usable on the supported desktop baseline.
- The initial mobile shell does not lock the main thread during entry.

### P16. Browser acceptance matrix

Every row needs a fresh pass. No row may rely on screenshots alone.

| Journey | Desktop | Mobile portrait | Mobile landscape | Keyboard | Failure state |
|---|---|---|---|---|---|
| `/planner/` landing to Planner | [ ] | [ ] | [ ] | [ ] | [ ] |
| Dashboard link to Planner | [ ] | [ ] | [ ] | [ ] | [ ] |
| Choose Product link to Planner | [ ] | [ ] | [ ] | [ ] | [ ] |
| Bare guest creates a fresh UUID draft | [ ] | [ ] | [ ] | [ ] | [ ] |
| Guest ID resumes the correct draft | [ ] | [ ] | [ ] | [ ] | [ ] |
| Member canvas opens owned plan | [ ] | [ ] | [ ] | [ ] | [ ] |
| Unauthorized member plan is rejected | [ ] | [ ] | [ ] | [ ] | [ ] |
| Draw exact room | [ ] | [ ] | [ ] | [ ] | [ ] |
| Add measured openings | [ ] | [ ] | [ ] | [ ] | [ ] |
| Import Planner JSON | [ ] | [ ] | [ ] | [ ] | [ ] |
| Import and calibrate underlay | [ ] | [ ] | [ ] | [ ] | [ ] |
| Sketch-to-Plan preview and accept | [ ] | [ ] | [ ] | [ ] | [ ] |
| Place and configure furniture | [ ] | [ ] | [ ] | [ ] | [ ] |
| Align, distribute, and array | [ ] | [ ] | [ ] | [ ] | [ ] |
| Switch 2D and 3D | [ ] | [ ] | [ ] | [ ] | [ ] |
| Review validation | [ ] | [ ] | [ ] | [ ] | [ ] |
| Download JSON, SVG, PNG, PDF, DXF, and GLB | [ ] | [ ] | [ ] | [ ] | [ ] |
| Download JSON, CSV, and branded PDF BOQ | [ ] | [ ] | [ ] | [ ] | [ ] |
| Send quote to Oando | [ ] | [ ] | [ ] | [ ] | [ ] |
| AI suggestion and provider failure | [ ] | [ ] | [ ] | [ ] | [ ] |
| Offline save and recovery | [ ] | [ ] | [ ] | [ ] | [ ] |

Required viewport baselines:

- Desktop: 1440 by 900.
- Compact desktop: 1024 by 768.
- Mobile portrait: 390 by 844.
- Mobile landscape: 844 by 390.

### P17. Final gates and documentation

- [ ] Run focused unit tests after each implementation slice.
- [ ] Run focused integration tests after each boundary change.
- [ ] Run Planner Playwright journeys after each UI slice.
- [ ] Run `pnpm --filter oando-site typecheck`.
- [ ] Run `pnpm --filter oando-site lint`.
- [ ] Run `pnpm --filter oando-site lint:ui:strict`.
- [ ] Run `pnpm --filter oando-site test:planner-catalog`.
- [ ] Run `pnpm --filter oando-site test:e2e:planner-world`.
- [ ] Run `pnpm --filter oando-site gate:planner`.
- [ ] Run `pnpm run check:layout`.
- [ ] Run the relevant security and accessibility checks.
- [ ] Run a production build before release acceptance.
- [ ] Verify the production-like server, not only Next development mode.
- [ ] Update `plan/Planner/FEATURES.md` from verified code.
- [ ] Move stable product and architecture facts into `docs/`.
- [ ] Keep only real unresolved blockers in `Failures.md`.
- [ ] Remove stale Planner plans after all acceptance gates pass.

## Required test coverage

Unit coverage:

- UUID validation and project-key scoping.
- Document invariants and migrations.
- Unit and scale conversion.
- Wall joins and openings.
- Snapping and numeric entry.
- Dimension calculations.
- Import validation and sanitization.
- Sketch response validation.
- Placement transforms.
- 2D and 3D mapping.
- Rotation-aware validation.
- BOQ determinism.
- Handoff idempotency.
- Export preflight and file structure.
- Save-state transitions.

Integration coverage:

- Guest create and resume.
- Guest-to-member claim.
- JSON round trip.
- Underlay persistence.
- Sketch-to-Plan request, preview, accept, and undo.
- Catalog placement through BOQ.
- 2D to 3D rebuild.
- BOQ to Oando handoff.
- CSRF, auth, rate limit, and provider failure.
- Offline queue and conflict handling.

Browser coverage:

- The complete acceptance matrix in P16.
- Console errors.
- Failed network requests.
- Accessibility violations.
- Download filenames and contents.
- Focus order and restoration.
- Reload and recovery.
- Visual hierarchy at every baseline viewport.

## Release blockers

The Planner cannot ship while any condition below is true:

- A bare guest route can load another guest draft.
- Sketch-to-Plan is absent or guest-inaccessible.
- Room dimensions are not exact and persistent.
- Visible exports do not work.
- BOQ content is incomplete or commercially misleading.
- Quote submission does not reach Oando.
- Runtime writes generated files into source directories.
- Validation says ready while known blocking errors exist.
- 2D and 3D lose object parity.
- The full journey fails keyboard or WCAG 2.2 AA acceptance.
- Mobile remains a wrapped desktop layout.
- Browser tests hang without a diagnosed cause.
- Tests, typecheck, lint, layout, build, or Planner browser gates fail.

## Completion rule

This plan is complete only when every applicable checkbox is verified.

Completion requires one fresh end-to-end customer journey:

1. Enter Planner.
2. Create or import a measured room.
3. Use Sketch-to-Plan successfully or verify its recoverable failure path.
4. Place and configure real inventory.
5. Review validation.
6. Inspect equivalent 2D and 3D output.
7. Generate the branded BOQ.
8. Send it to Oando.
9. Reload the exact saved revision.
10. Repeat the core outcome on mobile and keyboard.

After completion:

- Move stable facts to `docs/`.
- Keep verified code paths in `plan/Planner/FEATURES.md`.
- Keep unresolved external blockers in `Failures.md`.
- Remove this execution plan only after its authority has moved to final documentation.
