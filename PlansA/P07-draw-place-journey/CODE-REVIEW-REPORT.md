# P07 Draw Place Journey — Code Review Report

| Field | Value |
|-------|--------|
| **Date** | 2026-07-10 |
| **Reviewer** | Review agent (repo-first, no implement) |
| **Plan under review** | `D:\OandO07072026\plans1/P07-draw-place-journey\IMPLEMENTATION-PLAN.md` |
| **Brainstormer input** | `Idiots2/P07-draw-place-journey/REPORT.md` — **MISSING** (path does not exist; only `plans2/P07-draw-place-journey/IMPLEMENTATION-PLAN.md` exists) |
| **Phase authority** | `Plans/phases/P07-draw-place-journey/` |
| **Checkout** | `D:\OandO07072026` main only |
| **Verdict** | **CONDITIONAL APPROVE** — plan is largely accurate against live repo and correctly refuses partial-journey “green”; fix identity false-greens + opening-target coupling before execute |

---

## Executive summary

Repo first: open3d draw/place is real product surface (FeasibilityCanvas wall/opening, InventoryPanel place, WorkspaceShell `.pw-status-bar` metrics, demo `cabinet-v0` / `sample-desk-1`). A **partial** Playwright journey already exists and **fails the CP-07 binding bar** (guest-only, no Opening, no cabinet-v0, configurator/chair allowed, no shared `getFurnitureCount`, no 01–07 storyboard, no `playwright-run.json`, no npm script, **no evidence folder on disk**).

The idiotplanners P07 plan matches that gap matrix, locks Approach A (Feasibility, test-first), serial evidence under `results/planner/world-standard-wave/02-browser-open3d-journey/`, and correctly treats the live journey as **rewrite-in-place**, not “create from zero” and not “already done.”

Blockers for blind execute are **not** “wrong product architecture” but **proof holes** that can re-create false green: cabinet identity via body text / forced `includesCabinetV0 = true`, second SKU id assumed from search string, and Opening coords not tied to the wall segment that actually grew. Optional REPORT source cited by the plan is absent — plan synthesis is self-contained enough, but the citation is stale.

---

## Repo truth table

| Claim / area | Live repo (2026-07-10) | Plan claim | Match? |
|--------------|------------------------|------------|--------|
| Journey spec path | `site/tests/e2e/open3d-world-standard-journey.spec.ts` **exists** (~174 lines) | Exists; rewrite | **Yes** |
| Serial + 120s | `describe.configure({ mode: "serial", timeout: 120_000 })` | Keep | **Yes** |
| Entry route | Guest only via `enterGuestPlannerWorkspace` | open3d primary + guest fallback | **Gap correctly flagged** |
| Storage clear | Guest helper clears; open3d path N/A in live | clear + open3d then guest | **Yes (plan)** |
| `getFurnitureCount` in helpers | **Missing**; only `getWallCount` / `getObjectCount` | Still missing; Task 01 | **Yes** |
| Local furniture/wall parsers in journey | Local `furnitureCount` / `wallCount` (return `-1` on miss) | Promote helpers; prefer `0` | **Yes** |
| W1 wall delta | Yes (two-click + retry) | Keep; prefer multi-segment + fallback | **Yes** |
| W1 Opening + objects Δ | **No** | Must add | **Yes** |
| W2 cabinet-v0 | **No** (search `chair` / configurator) | Required; forbid configurator sole green | **Yes** |
| W2 second SKU recorded | No | `sample-desk-1` preferred | **Yes** |
| Non-blank canvas PNG >5k | No | Must add | **Yes** |
| Screenshots 01–07 CP names | `01-guest`…`06-complete` (different names; 6 files) | Rename/expand 01–07 | **Yes** |
| `playwright-run.json` from test | No | Must write | **Yes** |
| Evidence dir | `results/planner/…/02-browser-open3d-journey/` **absent**; entire `results/` missing | Create + re-prove | **Yes** |
| npm `test:e2e:world-standard-w1w2` | **Absent** (`test:e2e:open3d-world` exists) | Add | **Yes** |
| Demo catalog `cabinet-v0` | Present + `geometryMode: "modular-cabinet-v0"` | Lock OK | **Yes** |
| `sample-desk-1` | Present | Preferred second SKU | **Yes** |
| Tool labels | `CANVAS_TOOL_LABELS`: Wall, Opening, Place | Use **Opening** not shortcut D | **Yes** |
| Opening runtime | `runtimeToolFor(opening) → door`; Feasibility **pointerdown** adds door on wall pick | Tap wall; micro-drag fallback | **Mostly yes** |
| Wall UX | Guidance: click start/end | two-tap primary | **Yes** |
| Place UX | Inventory `Add ${shortName} to canvas` + Place arm; `placeCatalogOnCanvas` DOM click | Gold path | **Yes** |
| Status metrics | `.pw-status-bar` spans: `N objects` / `N walls` / `N furniture` | Helper parsers | **Yes** |
| Objects formula | walls+rooms+doors+windows+furniture+stairs+columns | Opening → objects Δ | **Yes** |
| Host chain | `/planner/open3d` → `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` | §1.5 / §5.1 | **Yes** |
| Playwright config | `fullyParallel: true`, workers 2, timeout 60s; `PLAYWRIGHT_BASE_URL` optional | Serial in file + 120s | **Yes** |
| Gold cabinet place | `open3d-mesh-symbol-live-verify.spec.ts` uses `placeCatalogOnCanvas` + Modular Cabinet | Steal path | **Yes** |
| Fabric step-bar | Journey asserts `.pw-step-bar` count 0 | Keep native chrome | **Yes** |
| Idiots2 REPORT | Path **does not exist** | Listed as required input | **Stale / fail** |
| Approach A | Design + phase: Feasibility first | Chosen; reject Fabric cutover | **Yes** |

### Live product flows (draw / place)

**Tools / modes** (`canvasTool.ts` + `CanvasToolRail` + `FeasibilityCanvas`):

- Rail: Select, Pan, Room, **Wall**, **Opening**, Dimension, **Place**.
- Wall: two-click draw (`addOpen3dWall` path via draw-wall command).
- Opening: label Opening; commits as **door** on wall hit (`addDoor` on pointerdown).
- Place: inventory arms Place + pending catalog item; canvas click places.

**Placement:**

- Catalog: `InventoryPanel` search (`Search catalog elements`) → `aria-label={`Add ${shortName} to canvas`}` → `placeCatalogOnCanvas` helper.
- Modular cabinet-v0: demo item id `cabinet-v0`; product has modular place/GLB paths; **journey only needs furniture metric + identity**, not P08 mesh polish.
- Systems configurator batch: exists (`placeSeatsFromConfigurator`); **current journey uses as W2 fallback** — CP-07 must not allow this as sole green.

**Metrics:**

- `summarizeFloorMetrics` → WorkspaceShell footer — sole honest browser counters for W1/W2 deltas.

---

## Findings

### Blocking (B)

| ID | Finding | Why blocking | Evidence |
|----|---------|--------------|----------|
| **B1** | Cabinet identity can green without proving the placed SKU | Task 04 sets `proof.includesCabinetV0 = true` after `includesCabinetV0 \|\| cabinetVisible`. Body regex `/Modular Cabinet/` can match **inventory list text** always present after catalog load; `hasExact` only proves CTA visible, not that the placed furniture is cabinet-v0 if place races/generic Add. Consolidated assembly still uses body text \|\| hasExact. | Plan §Task 04 Step 2 (~L825–835, ~L1334–1336); Inventory always lists Modular Cabinet when demo seed loads |
| **B2** | `secondCatalogId` is assumed, not observed | After search `"desk"`, code sets `secondId = "sample-desk-1"` if any Add button is visible, then places with generic `/Add .* to canvas/i`. Wrong rank / multiple hits → **recorded id can lie**. | Plan Task 04 Step 3 (~L853–880) |

These do not make the plan’s *intent* wrong; they make the **proof JSON / gate fields** false-green-capable if execute copies the snippets literally.

### High (H)

| ID | Finding | Impact |
|----|---------|--------|
| **H1** | Opening hit coords are **not coupled** to the wall geometry that actually increased metrics | Four segments at y≈0.25, then Opening tap at (0.5, 0.25). If only **fallback** long wall at y=0.45 grows walls, Opening still taps 0.25 → miss → flaky W1 red or false path via micro-drag elsewhere. |
| **H2** | Brainstormer `Idiots2/.../REPORT.md` missing | Plan §2 / Appendix A cite dead path. Synthesis still usable from phase card + repo; do not block product work, but “brainstormer binding” is unverifiable. |
| **H3** | Live journey is false pride risk if execute “extends” instead of rewrites | Current file can pass guest+wall+configurator and look like W1–W2. Plan Appendix E correctly says **wrong vs CP-07**; enforce full rewrite + delete configurator success path. |
| **H4** | `placeOpeningOnCanvas` is micro-drag; product Opening commits on **pointerdown** wall pick | Fallback may work via second down, but is weaker than re-tap with larger pick tolerance or drawing a dedicated mid-span target. Prefer re-`tapOnCanvas` on known wall midpoints before drag helper. |
| **H5** | Task 01 “TDD” is string-presence / node -e, not a failing Playwright consumer | Acceptable for e2e-only helper, but label is ceremonial — real red is journey poll fail. |

### Medium (M)

| ID | Finding |
|----|---------|
| **M1** | Stepwise Task 04 vs final assembly snippets **drift** (force `includesCabinetV0 = true` vs stricter `expect(includesCabinetV0)`). Execute must follow **stricter** consolidated intent, then strengthen further (B1). |
| **M2** | `secondPattern` assigned then unused; place always uses generic Add. |
| **M3** | Many other e2e specs still clone local `furnitureCount` — out of CP-07 scope but residual debt after helper land. |
| **M4** | Live evidence path uses `process.cwd()/../results/...` (cwd-sensitive). Plan’s `__dirname` → `REPO_ROOT` is **better** — keep. |
| **M5** | open3d “ready” = topbar OR canvas race — may accept chrome before catalog hydrated; W2 already waits on search (OK) but entry `routeUsed: open3d` might be optimistic. |
| **M6** | Plan is very long (inline full file twice) — execute risk of partial paste; prefer single landable assembly over intermediate scaffolds left half-red. |
| **M7** | PNG `byteLength > 5000` is a coarse anti-blank; correct as P07 floor, not P05 quality (plan honest). |

### Low (L)

| ID | Finding |
|----|---------|
| **L1** | Optional 2D↔3D in live journey is correctly demoted (not W4 claim). |
| **L2** | `results/` tree entirely missing — no historical PASS to launder. |
| **L3** | Case-folder `Idiots2` vs `plans2` naming confusion in repo layout. |
| **L4** | `doorOrOpeningPlaced = true` after successful expect is fine; do not set before assert. |

---

## Already exists (do not reinvent)

| Asset | Path / fact |
|-------|-------------|
| Partial journey | `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| Helpers (walls/objects, place, opening drag, tool select) | `site/tests/e2e/plannerCanvasHelpers.ts` |
| Guest enter + storage clear | `site/tests/e2e/guestProjectSetup.ts` |
| Cabinet place gold | `site/tests/e2e/open3d-mesh-symbol-live-verify.spec.ts` |
| Demo SKUs | `demoCatalogItems.ts` — `cabinet-v0`, `sample-desk-1`, sofa |
| Tool labels / guidance | `editor/canvasTool.ts` |
| Metrics | `workspacePlanMetrics.ts` + `WorkspaceShell.tsx` `.pw-status-bar` |
| Placement / modular id | `catalog/placementAction.ts` (`MODULAR_CABINET_V0_CATALOG_ID`) |
| 2D canvas testid | `FeasibilityCanvas` `data-testid="planner-2d-canvas"` |
| Playwright config / open3d world runner | `site/config/build/playwright.config.ts`, `test:e2e:open3d-world` |
| Phase execute card + appendix skeletons | `Plans/phases/P07-draw-place-journey/` |
| Design W1–W2 bar | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |

---

## Residual (after plan lands as written)

1. **P05** symbol quality (readable Block2D) — explicitly not CP-07.
2. **P08** mesh / GLB viewer quality.
3. **P03 / P04 / P06** select-delete, orbit, save honesty — not in journey.
4. Local `furnitureCount` clones in other open3d e2e files.
5. Product flaky wall/opening hit-test under zoom — may need product pick tolerance work if retries exhaust.
6. Full product story still needs CP-03 + CP-05 not red (phase honesty) unless owner WAIVE.

---

## False-green risks

| Trap | Plan status | Review note |
|------|-------------|-------------|
| Seed walls ≥4 absolute | **Blocked** (F1/F2) | Good |
| Objects ≥1 without post-wall baseline | **Blocked** (F3) | Good |
| Toast / copy as door proof | **Blocked** (F4) | Good |
| Configurator / chair as W2 | **Blocked** (F16) — live journey still does this | Must rewrite |
| Parallel PNG race | **Blocked** (serial) | Good |
| Missing PNG skip | **Blocked** (existsSync loop) | Good |
| PASS JSON without exit 0 | **Blocked** (writer after asserts) | Good |
| Body “Modular Cabinet” = placed cabinet-v0 | **Open (B1)** | Fix before claim |
| secondCatalogId from search string | **Open (B2)** | Fix before claim |
| Non-blank PNG = symbol quality | **Honest split** (F7) | Good |
| Evidence folder missing → historical PASS | **Correctly rejected** | No folder on disk |
| Force `includesCabinetV0 = true` | **Open (B1)** | Remove force; assert real cue |

---

## Score

| Dimension | Score (0–10) | Note |
|-----------|--------------|------|
| Repo accuracy | **9** | Gap matrix and product paths match live tree |
| CP-07 bar alignment | **9** | Matches phase + design W1/W2 |
| False-green discipline | **6.5** | Strong catalog; identity holes (B1/B2) |
| Executability | **8** | Commands, files, commits clear; length/drift risk |
| Honesty / scope control | **9** | Approach A; no Fabric theater; out-of-scope locked |
| Evidence readiness | **8** | Paths correct; proof not yet on disk (expected) |
| **Overall** | **7.5 / 10** | Conditional approve |

---

## Kill-order (what to do if execute starts)

1. **Do not** claim CP-07 from current journey or any missing `results/` folder.
2. Land **helper** `getFurnitureCount` (+ optional `drawWallByTwoClicks`) — single source for metrics.
3. **Rewrite** journey in place: open3d→guest entry, W1 wall **Δ** + Opening **objects Δ**, W2 **cabinet-v0** + second real SKU, 01–07 + `playwright-run.json`.
4. **Hard-delete** configurator/chair success path from this spec.
5. Fix **B1/B2** before green claim: identity via exact Add CTA used for place **and** furniture Δ; record second SKU from the **same** button name/id used in `placeCatalogOnCanvas`, not from search string alone.
6. Bind Opening coords to **last successful wall segment** (or re-draw a known span then open mid-span).
7. Add npm script + alias NOTES; re-prove under `02-browser-open3d-journey/`.
8. Product fixes only on systematic red (labels, metrics, place no-op, blank canvas) — not Fabric cutover.

---

## Bottom line

The plan is **the right job** against **this** repo: CP-07 is browser W1–W2 on open3d/guest, serial, deltas, cabinet-v0, evidence-locked — and the live partial journey is **not** that bar. Architecture, file map, Approach A, and most false-green traps are sound.

**Do not execute the identity/second-SKU snippets as written without tightening.** Optional Idiots2 REPORT is missing; ignore the citation, keep phase + repo as authority.

**Verdict: CONDITIONAL APPROVE** — revise B1/B2 (+ H1 opening target coupling), then execute rewrite of `open3d-world-standard-journey.spec.ts` + helper + script + evidence re-prove.

---

## Top 3 (return)

1. **Live journey ≠ CP-07** — guest/chair/configurator/no Opening/no proof JSON/no evidence dir; plan correctly demands full rewrite.
2. **False-green holes B1/B2** — cabinet identity + secondCatalogId must be proven from the place action, not body text / assumed ids.
3. **Opening must target a wall that actually exists** after the draw path that produced the walls Δ — otherwise W1 flakes or lies.

---

## Review method (honesty)

- Repo-first reads: open3d editor/canvas/catalog, e2e journey + helpers + guest setup, package scripts, playwright config, phase P07 card.
- Plan read: full `plans1/P07-draw-place-journey/IMPLEMENTATION-PLAN.md`.
- Optional REPORT: path absent; `plans2/P07-…` has a separate plan only — not used as authority beyond existence check.
- No code changes; no plan edits beyond this report file.
)
