# P07 Draw Place Journey (idiotplanners2) — Code Review Report

| Field | Value |
|-------|--------|
| **Phase** | P07 Draw Place Journey (W1–W2 browser) |
| **Date** | 2026-07-10 |
| **Reviewer** | Review agent (repo-first; no implement; no plan edits) |
| **Checkout** | `D:\OandO07072026` main only — no worktrees |
| **HEAD** | `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc` (`main...origin/main`; dirty Plans/Others archive drift; `plans2/` untracked) |
| **Plan under review** | `D:\OandO07072026\plans2/P07-draw-place-journey\IMPLEMENTATION-PLAN.md` |
| **Brainstormer cited** | `Idiots/P07-draw-place-journey/REPORT.md` — **LIVE PATH MISSING** (content only under `archive/Idiots/…` and `archive/Idiots2/…`) |
| **Phase authority** | `Plans/phases/P07-draw-place-journey/` |
| **Verdict** | **FAIL / NOT GREEN for CP-07** — plan is largely repo-accurate and execute-ready **if** identity/second-SKU proof holes are tightened first; **no** evidence pack; live journey still fails binding bar |

---

## Executive summary

Repo first: open3d draw/place product surface is real (FeasibilityCanvas wall + Opening→door, InventoryPanel place, WorkspaceShell `.pw-status-bar` metrics, demo `cabinet-v0` + `sample-desk-1`). A **partial** Playwright journey already exists at `site/tests/e2e/open3d-world-standard-journey.spec.ts` and **does not meet CP-07**:

- Guest-only entry (no `/planner/open3d` primary).
- No Opening / objects-Δ after walls.
- W2 = search `chair` + **`placeSeatsFromConfigurator` fallback** (forbidden sole green).
- No cabinet-v0 lock, no second SKU id record, no canvas PNG >5k, no 01–07 storyboard, no `playwright-run.json`.
- Local `furnitureCount` / `wallCount` with body scrape and **`-1` miss** (helpers still lack `getFurnitureCount`).
- **`results/` tree does not exist** → any historical W1–W2 browser PASS is **unproven on this machine**.

The **idiotplanners2** plan correctly names that gap matrix, locks Approach A (Feasibility interim; no Fabric cutover), serial single writer, deltas-only, configurator ban, evidence under `results/planner/world-standard-wave/02-browser-open3d-journey/`, and rewrite-in-place (not invent-from-zero). **All plan task checkboxes are unchecked** (47× `- [ ]`, 0× `[x]`) — plan is ready work, not claimed complete.

**Do not claim GATE PASS** from maps, partial journey, or missing `results/`. Re-prove after execute.

---

## Repo truth table

| Claim / area | Live path | Measured truth (2026-07-10) | Plan §1 match? |
|--------------|-----------|-----------------------------|----------------|
| Journey spec | `site/tests/e2e/open3d-world-standard-journey.spec.ts` | **Exists** (~174 lines); partial bar | Yes — rewrite target |
| Serial + 120s | same | `describe.configure({ mode: "serial", timeout: 120_000 })` | Yes — keep |
| Entry route | journey | **Guest only** via `enterGuestPlannerWorkspace` | Gap correctly flagged (need open3d primary + guest fallback) |
| Storage clear open3d | journey / guest setup | Guest helper clears; live journey never hits open3d | Plan adds `clearPlannerStorage` + open3d — correct |
| `getFurnitureCount` helper | `plannerCanvasHelpers.ts` | **Missing** export (only `getWallCount` / `getObjectCount`) | Yes — Task 01 gap |
| `drawWallByTwoClicks` helper | helpers vs journey | **Not** exported from helpers; **local** fn in journey | Plan promote to helper — correct residual |
| Local parsers | journey L33–56 | body fallback + miss **`-1`** | Yes — must delete |
| W1 wall Δ | journey | Yes (two-click + retry, ≥ +1) | Yes — keep / expand |
| W1 Opening + objects Δ | journey | **No** Opening step; no `getObjectCount` import | Yes — must add |
| W2 cabinet-v0 | journey | **No** (search `chair`) | Yes — must replace |
| Configurator | journey L143–145 | **`placeSeatsFromConfigurator(page, 4)`** on catalog flake | Yes — **forbidden** for CP-07 green |
| W2 second SKU recorded | journey | No | Yes — must add |
| Non-blank canvas PNG >5k | journey | No (full-page screenshots only) | Yes — must add |
| Screenshots 01–07 CP names | journey | `01-guest-entered` … `06-journey-complete` (6; wrong names) | Yes — rename/expand |
| `playwright-run.json` writer | journey | **No** | Yes — must write |
| npm `test:e2e:world-standard-w1w2` | `site/package.json` | **Absent**; only `test:e2e:open3d-world` umbrella | Yes — must add |
| Spec map W1-W2 | `playwright-open3d-world-specs.json` | Maps `W1-W2` → journey file | Yes — keep; still not proof |
| Evidence dir | `results/planner/world-standard-wave/02-browser-open3d-journey/` | **`results/` missing entirely** | Yes — re-prove from zero |
| Alias NOTES | `…/07-browser-journey/NOTES.md` | Missing with tree | Yes |
| Demo `cabinet-v0` | `demoCatalogItems.ts` L144–168 | Present; `shortName: "Modular Cabinet"`; `geometryMode: "modular-cabinet-v0"` | Yes — W2 lock OK |
| `sample-desk-1` | same L72–77 | Present; shortName **“Executive Standing Desk”** | Yes preferred second SKU |
| Status metrics | `WorkspaceShell.tsx` L386–391 | `.pw-status-bar` spans: `N objects` / `N walls` / `N furniture` | Yes |
| Objects formula | `workspacePlanMetrics.ts` L42–49 | walls+rooms+doors+windows+furniture+stairs+columns | Yes — Opening → objects Δ |
| Tool labels | `canvasTool.ts` | Wall, **Opening**, Place | Yes — use Opening not shortcut D |
| Opening runtime | `FeasibilityCanvas.tsx` ~L710–715 | `opening`/`door` tool: pointerdown wall pick → `addDoor` | Yes — tap mid-wall; micro-drag fallback weaker |
| Place gold | `open3d-mesh-symbol-live-verify.spec.ts` | `placeCatalogOnCanvas` + `/Add Modular Cabinet to canvas/i` | Yes — steal path |
| Host chain | open3d page → hosts → `OOPlannerWorkspace` | Live | Yes §5.1 |
| Playwright config | `playwright.config.ts` | `fullyParallel: true`, workers 2, timeout 60s; baseURL env or build+start | Yes — journey serial + 120s required |
| Plan tasks executed | IMPLEMENTATION-PLAN Tasks 00–06 | **0 checked** | Plan not executed |
| Idiots REPORT live | plan hard input | **Missing**; archive only | Plan citation stale |

### Live journey vs binding bar (gap snapshot)

| CP-07 requirement | Live journey | Status |
|-------------------|--------------|--------|
| open3d primary / guest fallback + `routeUsed` | Guest only | **RED** |
| `getFurnitureCount` shared helper | Local body/`-1` | **RED** |
| walls Δ after Wall tool | Yes | Partial OK |
| Opening → objects > objectsAfterWalls; walls hold | Absent | **RED** |
| furniture Δ ≥ +2 incl. **cabinet-v0** | chair / configurator | **RED** |
| secondCatalogId recorded | No | **RED** |
| canvas PNG byteLength > 5000 | No | **RED** |
| PNGs 01–07 + `playwright-run.json` pass | No evidence dir | **RED** |
| npm single-spec script | Absent | **RED** |
| No configurator green path | Uses configurator fallback | **RED** |

---

## Findings

### Blocking (B)

| ID | Finding | Evidence |
|----|---------|----------|
| **B1** | **No evidence pack on disk** — CP-07 unprovable | `results/` does not exist; plan evidence path `results/planner/world-standard-wave/02-browser-open3d-journey/` absent |
| **B2** | **Live journey fails CP-07 binding bar** | Guest-only; no Opening; chair + `placeSeatsFromConfigurator`; no cabinet-v0; no proof JSON; wrong screenshot names |
| **B3** | **Plan target source false-greens cabinet identity** | After place, `expect(identityCue \|\| cabinetVisible)` then **`proof.includesCabinetV0 = true` always**. Body `/Modular Cabinet/` matches **inventory list** after catalog load; `cabinetVisible` only proves CTA, not placed SKU identity if generic Add / race | Plan full source ~L964–974 |
| **B4** | **`secondCatalogId` assumed, not observed** | `secondId = "sample-desk-1"` if desk Add visible; sofa path hardcodes `"sample-sofa-1"`; place may use generic `/Add .* to canvas/i` — recorded id can lie | Plan ~L986–1019, Task 04 |
| **B5** | **Done-when package unmet** | Plan Done when 1–10 (helper, rewrite, W1/W2 metrics, 01–07, json, script, honesty) — **none** complete as landable package |

### High (H)

| ID | Finding | Impact |
|----|---------|--------|
| **H1** | Opening hit coords **not coupled** to wall segment that actually grew | Four segments at y≈0.25 then Opening tap (0.5, 0.25); fallback wall at y=0.45 still opens at 0.25 → flake or false miss path |
| **H2** | Brainstormer path dead live (`Idiots/…/REPORT.md`) | Plan “hard” input only in `archive/`; synthesis self-contained enough; citation honesty fail |
| **H3** | Live journey is **false-pride risk** if “extend” instead of full rewrite | Can pass guest+wall+configurator and look like W1–W2; plan correctly forbids configurator sole green — execute must **delete** that path |
| **H4** | `placeOpeningOnCanvas` is micro-drag; product Opening commits on **pointerdown** wall pick | Prefer re-`tapOnCanvas` on known wall midpoints before drag helper |
| **H5** | Evidence path in live journey is `process.cwd()/../results/...` (cwd-sensitive) | Plan `__dirname` → `REPO_ROOT` is better — keep on rewrite |
| **H6** | Task 01 “prove missing” is node string presence, not a failing Playwright consumer | Acceptable for e2e helper; real red is journey poll |

### Medium (M)

| ID | Finding |
|----|---------|
| **M1** | Desk CTA regex `/Add .*Desk.* to canvas/i` vs shortName **“Executive Standing Desk”** — should match; still prefer exact shortName after search, not assumed catalog id |
| **M2** | open3d ready = topbar **OR** canvas race — may mark `routeUsed: open3d` before catalog hydrated (W2 waits on search — OK; entry label may be optimistic) |
| **M3** | Other e2e files still clone local furniture parsers / configurator — out of CP-07 scope but residual after helper land |
| **M4** | Plan length (full journey inline once + task loops) — execute risk of partial paste; land one assembly, no permanent scaffolds |
| **M5** | PNG `byteLength > 5000` is coarse anti-blank only — plan honesty (≠ P05) is correct |
| **M6** | Gold mesh-symbol verify also uses body identity cues + configurator later — steal **place path only**, not identity looseness |
| **M7** | `plans2/` untracked on HEAD — plan/review not yet committed; does not change product truth |

### Low (L)

| ID | Finding |
|----|---------|
| **L1** | Optional 2D↔3D in live journey correctly demoted by plan (not W4 claim) |
| **L2** | Fabric `.pw-step-bar` count 0 assert in live journey — keep native chrome |
| **L3** | Case-folder `Idiots` / `Idiots2` / `plans2` naming noise |
| **L4** | `doorOrOpeningPlaced = true` only after objects Δ expect — do not set before assert (plan mostly OK) |

---

## Already exists (do not reinvent)

| Asset | Path / fact |
|-------|-------------|
| Partial journey (rewrite target) | `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| Helpers: walls/objects, place, opening drag, tool select, tap/drag | `site/tests/e2e/plannerCanvasHelpers.ts` |
| Guest enter + storage clear | `site/tests/e2e/guestProjectSetup.ts` |
| Cabinet place gold path | `site/tests/e2e/open3d-mesh-symbol-live-verify.spec.ts` |
| Demo SKUs | `demoCatalogItems.ts` — `cabinet-v0`, `sample-desk-1`, sofa samples |
| Tool labels / guidance | `editor/canvasTool.ts` — Wall, Opening, Place |
| Metrics | `workspacePlanMetrics.ts` + `WorkspaceShell.tsx` `.pw-status-bar` |
| Opening → door entity | `FeasibilityCanvas.tsx` + `addDoor` |
| 2D canvas testid | `planner-2d-canvas` |
| Playwright config / open3d world runner | `config/build/playwright.config.ts`, `test:e2e:open3d-world`, `playwright-open3d-world-specs.json` W1-W2 map |
| Phase card + appendix | `Plans/phases/P07-draw-place-journey/` |
| Plan false-green catalog (§8) | Strong on seed walls, objects baseline, configurator ban, serial writer |

---

## Residual (execute plan Tasks 00–05; Task 06 only if product red)

| Order | Work | Plan task |
|------:|------|-----------|
| 1 | Create evidence dirs + alias NOTES; confirm gaps | Task 00 |
| 2 | Export `getFurnitureCount` (miss → **0**, strict span) + `drawWallByTwoClicks` | Task 01 |
| 3 | **Full rewrite** journey: open3d→guest, serial, baselines, W1 walls Δ + Opening objects Δ, W2 cabinet-v0 + second SKU, 01–07, `playwright-run.json` / `run.json` | Tasks 02–04 |
| 4 | **Tighten B3/B4 before green claim:** identity from **exact Add CTA used for place** + furniture Δ; record second SKU from **same button name/id** used in place, not search string alone | Plan source fix |
| 5 | Bind Opening coords to **last successful wall segment** (or re-draw known span then open mid-span) | H1 |
| 6 | Hard-delete configurator/chair success path from this spec | Done-when / hard forbids |
| 7 | npm `test:e2e:world-standard-w1w2` + raw log Tee + disk verification script | Task 05 |
| 8 | Product fix only on systematic red (labels, metrics, place no-op, blank host) — not Fabric cutover | Task 06 conditional |

**Out of scope residual (document, do not expand P07):** P05 symbols, P08 mesh, P03 select/delete, P04 orbit, P06 save honesty, W3–W8 claims.

---

## False-green risks

| Trap | Plan status | Review note |
|------|-------------|-------------|
| Seed walls ≥4 absolute | **Blocked** (§8) | Good |
| objects ≥1 without post-wall baseline | **Blocked** | Good |
| furniture ≥1 absolute / residual IDB | **Blocked** (clear + Δ) | Good |
| Configurator / chair as W2 | **Blocked** in plan; **live journey still does this** | Must rewrite |
| Parallel PNG race | **Blocked** (serial) | Good |
| Missing PNG claim pass | **Blocked** (existsSync loop) | Good |
| Full-page non-blank PNG | **Blocked** (canvas element) | Good |
| Non-blank PNG = P05 quality | **Honest** residual | Good |
| Body “Modular Cabinet” / CTA visible = placed cabinet-v0 | **Open (B3)** | Fix before claim |
| secondCatalogId from search string | **Open (B4)** | Fix before claim |
| Force `includesCabinetV0 = true` | **Open (B3)** | Assert real place identity; no unconditional set |
| Evidence folder missing → historical PASS | **Correctly rejected** | `results/` absent = unproven |
| Spec map / umbrella e2e includes journey | Wiring ≠ pass | Fail CP until pack on disk |
| open3d without clear storage | Plan blocks | Keep |
| Shortcut D for Opening | Plan blocks | Use Opening label |

---

## Score

| Dimension | Score (0–10) | Note |
|-----------|--------------|------|
| Repo accuracy (plan vs tree) | **9** | Gap matrix and product paths match live |
| CP-07 bar alignment | **9** | W1/W2 deltas, cabinet-v0, serial evidence |
| False-green discipline | **6.5** | Strong catalog; identity/second-SKU holes (B3/B4) |
| Executability | **8** | Commands, file map, commits clear; length risk |
| Honesty / scope control | **9** | Approach A; no Fabric theater; W3–W8 non-claim |
| Evidence readiness | **2** | Paths correct; **zero** artifacts on disk |
| Live journey readiness | **3** | Skeleton only vs binding bar |
| **Overall (plan as execute vehicle)** | **7.5 / 10** | Conditional — fix B3/B4/H1 then run |
| **Overall (CP-07 phase green)** | **1 / 10** | Unproven; rewrite not landed |

---

## Kill-order (if execute starts)

1. **Do not** claim CP-07 from current journey, umbrella gate wiring, or any missing `results/` folder.
2. Land **`getFurnitureCount`** (+ `drawWallByTwoClicks`) — strict `.pw-status-bar > span`, miss **0**.
3. **Rewrite** `open3d-world-standard-journey.spec.ts` in place: open3d→guest entry, W1 wall **Δ** + Opening **objects Δ**, W2 **cabinet-v0** + second real SKU, 01–07 + `playwright-run.json`.
4. **Hard-delete** `placeSeatsFromConfigurator` / chair success path from this spec.
5. Fix **B3/B4** before green claim: identity from exact Add CTA used for place + furniture Δ; second SKU from same CTA/id used in place.
6. Bind Opening coords to **successful wall geometry**.
7. Add npm script + alias NOTES; re-prove under `02-browser-open3d-journey/` with raw log unfiltered.
8. Product fixes only on systematic red — not Fabric cutover, not P05/P08 scope grab.

---

## Bottom line

**CP-07 is not green on this checkout.** The idiotplanners2 plan correctly describes the job: serial browser W1–W2 on open3d/guest with metric deltas, cabinet-v0 place, gold evidence folder — and correctly refuses paper PASS on the live partial journey. Architecture, file map, Approach A, and most false-green traps are sound.

**Do not execute the cabinet identity / secondCatalogId snippets as written without tightening.** Live brainstormer path is missing (archive only); treat phase + repo as authority.

**Verdict: FAIL / NOT GREEN for CP-07** · plan **CONDITIONAL APPROVE** after B3/B4 (+ H1 opening target) · then execute rewrite + re-prove.

---

## Top 3

1. **`results/` missing = unproven** — no W1–W2 browser pack; cannot claim PASS.
2. **Live journey ≠ CP-07** — guest/chair/configurator/no Opening/no proof JSON; plan correctly demands full rewrite.
3. **Proof holes B3/B4** — cabinet identity + secondCatalogId must come from the place action, not body text / assumed ids.

---

## Review method (honesty)

- Repo-first: journey, helpers, guest setup, package scripts, playwright config + open3d world map, demo catalog, WorkspaceShell metrics, Feasibility Opening path, mesh-symbol gold place, phase P07 dir presence.
- Plan: full `plans2/P07-draw-place-journey/IMPLEMENTATION-PLAN.md` (done-when, gap matrix, target source, tasks, false-green catalog).
- Brainstormer: live `Idiots/…/REPORT.md` absent; archive copies exist — not used as product authority.
- `results/` probed: root absent → all evidence claims unproven.
- No product code changes; no plan edits; this report file only.
)
