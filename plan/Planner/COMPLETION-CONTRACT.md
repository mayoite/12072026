# Planner completion contract

**Status:** OPEN  
**Authority:** This file is the **execution contract** for finishing Planner.  
**Relation to `FINISH-PLAN.md`:** Same product journey and phase intent. **Stricter** evidence, security, UI, and reporting rules. Where this file and `FINISH-PLAN.md` conflict on **how to prove done**, **this file wins**. Product scope still matches FINISH-PLAN.

**Code maps:** `FEATURES.md` (live paths).  
**UI bar:** `docs/architecture/06-UI-BENCHMARK.md`.  
**Security bar:** `docs/architecture/10-SECURITY-BENCHMARK.md`.  
**Active blockers:** `../../Failures.md` (real unresolved only).  
**Agent reports:** `../../agent-reports/` — short files + INDEX, never one mega dump.

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
3. **Browser proof** for customer-visible behaviour: Playwright or documented Chromium session — route, viewport, steps, console errors = 0, failed requests = 0.  
4. **Security-sensitive** behaviour: unit or integration that proves owner scoping / CSRF / role; browser if customer path.  
5. **Command + exit** recorded in the same session that claims PASS.  
6. Checkbox flipped **in the same change** as the proof, or left OPEN.

**Partial code with unit only** → mark **PARTIAL** in status tables, leave checklist **unchecked**.

---

## 3. Evidence protocol (exceeds FINISH-PLAN)

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

Carry forward from FINISH-PLAN, enforced here:

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

Same spirit as FINISH-PLAN. **No** copying assets, code, layout, or trade dress.

| Source | Expectation |
|--------|-------------|
| AutoCAD | Snaps, units vs display, exact dims, grips, recovery, underlays, internal layers |
| SmartDraw | Scratch/template/import, closed rooms, typed dims, wall openings, calibrate import, distance guides, BOQ/export |

Official refs remain listed in `FINISH-PLAN.md` § External benchmark.

---

## 7. Failure registry (PF) — status vocabulary

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**.  
Update only with fresh evidence.

| ID | Failure | Bar to clear | Status seed |
|----|---------|--------------|-------------|
| PF-01–04 | Guest ID / draft isolation / tests | Browser two-UUID + unit | PASS (see FINISH-PLAN) |
| PF-05 | Room outline deferred | Exact rectangle room + closed geometry + unit | FAIL until proven |
| PF-06 | Persistent dimensions deferred | Durable wall/room dims + zoom readable | FAIL until proven |
| PF-07–08 | Sketch UI / guest auth | TopBar + guest CSRF | PASS (code); browser OPEN |
| PF-09 | Scene GLB export | Real download or remove menu item | FAIL |
| PF-10 | Quote to Oando | Live CRM + browser reference | PARTIAL (API PASS; browser OPEN) |
| PF-11 | Overlap / clearance validation | Outside room + clearance + unit | OPEN/PARTIAL |
| PF-12 | Step completion awareness | Step state honest | PASS |
| PF-13 | Review & quote tests | Dedicated suite + behaviour | PARTIAL if thin |
| PF-16–17 | Full browser / mobile | P16 matrix rows | OPEN |
| PF-18–19 | Legacy layers / god workspace | Dead path gone; split host | OPEN |
| PF-20 | Contradictory save state | One authoritative machine | FAIL |
| PF-21 | Empty properties waste space | Collapse when no selection | FAIL |
| PF-22 | Catalog compare weak | Family/filter/compare usable | FAIL |
| PF-23 | Generic furniture quote path | All BOQ-eligible lines | PARTIAL if code-only |
| PF-24–25 | Handoff call / CSRF / idempotency | Code + live CRM | PARTIAL |
| PF-26 | Branded BOQ PDF | Live Review download | FAIL until browser |
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

Same phase ids as FINISH-PLAN (P0–P17) so work maps 1:1.  
**Difference:** each phase has **Exit gate** + **Proof required** + **Stop condition**.

### P0 — Test isolation

**Proof:** no canonical catalog mutation; SW/dev chunk proof; deterministic browser bootstrap.  
**Exit:** Planner tests isolated; browser serves current source; baseline FAIL list reproducible.  
**Stop:** if tests write `site/public` or inventory — fix isolation before features.

### P1 — Entry, UUID, identity

**Exit:** two guest UUIDs = two drafts; reload restores only that draft; no ID in source.  
**Proof:** unit entry matrix + `tests/e2e/planner-entry-states.spec.ts` (or equivalent) green.

### P2 — Document, units, precision

**Exit:** measured size stable across save/load/unit/export.  
**Proof:** round-trip unit suite; unsupported schema fails visibly.

### P3 — Workflow shell

**Exit:** customer knows step and next action without menus.  
**Proof:** desktop canvas ≥65% default; one save state; empty properties collapsed; mobile shell deliberate (portrait + landscape).

### P4 — Draw room

**Exit:** measured closed room + doors/windows without guessing scale.  
**Proof:** unit geometry + browser “exact room” row in P16.  
**Must clear:** PF-05, PF-06, orthogonal lock, grips or documented alternative.

### P5 — Import, underlay, Sketch-to-Plan

**Exit:** guest upload → calibrate → preview → accept → undo.  
**Proof:** CSRF/rate-limit unit; browser sketch journey; underlay scale survives reload.

### P6 — Place furniture

**Exit:** workstation layout with exact spacing without endless drag.  
**Proof:** align/distribute/array unit + browser place/configure row.

### P7 — 2D/3D parity

**Exit:** same project equivalent in 2D and 3D after reload.  
**Proof:** `sceneParity` unit + browser switch row; no site/public writes.

### P8 — Validation and review

**Exit:** Review never Ready with known blocking errors.  
**Proof:** outside-room + clearance + overlap unit; ReviewQuote tests; browser validation row.

### P9 — BOQ truth

**Exit:** same revision → same BOQ in every format.  
**Proof:** one canonical builder; demo vs approved price separation; branded PDF wired + content test.

### P10 — Send to Oando

**Exit:** one send → verifiable Oando reference.  
**Proof:** unit handoff + **live CRM browser** (API 200 alone insufficient for full PASS).

### P11 — Export

**Exit:** every menu export downloads valid file or is removed.  
**Proof:** Chromium download tests; GLB implemented or removed; no empty corrupt files.

### P12 — AI

**Exit:** AI total failure does not block draw/place/BOQ/handoff.  
**Proof:** optional overlay; keyboard usable; no invented SKUs/prices.

### P13 — Persistence

**Exit:** no silent loss on reload/crash/retry.  
**Proof:** one save state machine; conflict UI; owner-scoped cloud save (PF-30).

### P14 — A11y

**Exit:** axe no serious/critical on full journey; keyboard commercial outcome.  
**Proof:** axe + keyboard matrix; dialogs trap focus; 44×44 frequent targets.

### P15 — Performance / structure

**Exit:** large-plan fixture usable; mobile entry not main-thread locked.  
**Proof:** budgets measured; `OOPlannerWorkspace` split by workflow; dead paths removed.

### P16 — Browser matrix

Every cell needs a **fresh** pass. Viewports:

| Viewport | Size |
|----------|------|
| Desktop | 1440×900 |
| Compact | 1024×768 |
| Mobile portrait | 390×844 |
| Mobile landscape | 844×390 |

Copy journey rows from FINISH-PLAN § P16. **No screenshots-only PASS.**

### P17 — Final gates and docs

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

## 11. How this exceeds `FINISH-PLAN.md`

| Area | FINISH-PLAN | This contract |
|------|-------------|----------------|
| Evidence | Strong intent | Explicit PASS recipe + gate table |
| Reports | Implicit | Short multi-file + INDEX mandatory |
| Security | Scattered | PF-30/31 + persistence predicates required |
| Brand UI | Silent | Ecru + setup field metrics (PF-32/33) |
| A11y dialogs | Late phase | PF-34 + continuous P14 |
| Agent work | “No subagents” in plan header | Owner-authorized agents + parent re-verify |
| False completion | Forbidden | Operationalized (PARTIAL vs PASS) |
| Typecheck hygiene | Not stated | No PASS under `.next` type race |

`FINISH-PLAN.md` remains the historical detailed checklist.  
**Use this contract for new claims of done.**

---

## 12. Immediate priority (execution queue)

Do not reorder without owner alignment.

1. **Stabilize gates** — layout, lint, typecheck (clean), focused planner tests.  
2. **Hold security** — PF-30/31 stay green.  
3. **P4 drawing** — PF-05 room, PF-06 dimensions, orthogonal.  
4. **P8–P9 commercial** — validation outside-room, branded BOQ, Review tests.  
5. **P3 shell** — one save state, empty properties, canvas share.  
6. **P16 browser** — entry, draw, place, review, handoff (staging).  
7. **P17 release** — full gates + build + Failures.md clean.

---

## 13. Owner acceptance

Planner is **complete** only when:

1. §3.1 all green.  
2. P16 matrix complete for desktop + mobile portrait at minimum; landscape and keyboard for commercial path.  
3. No Critical PF open.  
4. FEATURES.md and this contract agree with live code.  
5. Owner sign-off after production-like server check (not only `next dev`).

Until then: **Status remains OPEN.**
