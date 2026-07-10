# P01 Brainstormer Report — Product Truth

**Agent:** BRAINSTORMER AGENT 01 of 10  
**Program:** O&O monorepo `D:\OandO07072026`  
**Phase:** P01 — Product Truth Inventory  
**Date written:** 2026-07-10  
**Mode:** Research + plan critique only · **no product code** · **no `site/` edits** · **no git push**  
**Deliverable path:** `D:\OandO07072026\Idiots\P01-product-truth\REPORT.md`  
**Superpowers:** `/using-superpowers` + brainstorming skill methodology (explore context → approaches → critique → raised bar). Subagent stop rule honored for implementation skills; this brief is **report-only**.

---

## 0 Meta

### 0.1 Agent identity and charter

| Field | Value |
|-------|--------|
| Role | Brainstormer (not implementer) |
| Agent id | 01 / 10 |
| Phase | P01 product truth |
| Write scope | **Only** `D:\OandO07072026\Idiots\P01-product-truth\` |
| Forbidden | Product code, `site/` edits, git push, inventing competitor features, treating research as W-gate pass |
| Owner ask | Most detailed report possible; exhaustive; no TBD placeholders |

### 0.2 What “product truth” means for this report

Product truth is **not** marketing, not WAVE narrative alone, not unit-green checklists alone, and not competitive SYNTHESIS scores alone. For O&O, product truth is the intersection of:

1. **Code surface** — what handlers, routes, engines, and labels actually exist under `site/features/planner/open3d/` and hosts.  
2. **Claim surface** — what README, ayushdocs, WAVE, design specs, and phase status tables **say**.  
3. **Evidence surface** — what exists under `results/planner/world-standard-wave/` with artifacts that RESULTS-MAP accepts as green.  
4. **Buyer surface** — what a facilities buyer can do **unaided** without a developer narrating.  
5. **Competitive pattern surface** — jobs-to-be-done from `D:\websites` (ideas only), used to **ask better questions**, not to claim O&O feature parity.

P01’s job in the plan is to force (1)+(2)+(3) into a durable pack before P02 locks engines and P03+ fix buyer-visible lies.

### 0.3 Paths read fully (this session)

The following were **opened and read** (not merely listed) by this agent. Line cites elsewhere in this report refer to these reads.

#### 0.3.1 Phase folder (entire)

| Path | Notes |
|------|--------|
| `D:\OandO07072026\Plans\phases\P01-product-truth\P01-product-truth.md` | Full execute card (~807 lines) — status DONE/CP-01 PASS claimed |
| `D:\OandO07072026\Plans\phases\P01-product-truth\P01-suggestions.md` | Expert review that fixed P0 plan bugs |
| `D:\OandO07072026\Plans\phases\P01-product-truth\README.md` | Folder index |

#### 0.3.2 Plans / Research (entire tree opened)

| Path | Notes |
|------|--------|
| `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md` | Full — phase routing, packs, engine decision, anti-copy |
| `D:\OandO07072026\Plans\Research\RESULTS-MAP.md` | Full — folder lock, CP-01 minimum, forbidden claims |
| `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE.md` | Full — KEEP topology |
| `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE-2.md` | Full — HYBRID density |
| `D:\OandO07072026\Plans\Research\STRUCTURE-REWRITE-NOTE.md` | Full — partner HYBRID applied |
| `D:\OandO07072026\Plans\phases\EXPERT-PASS.md` | Full — consolidated expert must-fix |
| `D:\OandO07072026\Plans\phases\README.md` | Phase map |
| `D:\OandO07072026\Plans\INDEX.md` | Kill order, W table, authority |
| `D:\OandO07072026\Plans\README.md` | Entry |
| `D:\OandO07072026\Plans\Research\Others\README.md` | ayushdocs hub (copy under Plans/Research/Others) |
| `D:\OandO07072026\Plans\Research\Others\00-PENDING.md` | Gate PASS vs product not finished |
| `D:\OandO07072026\Plans\Research\Others\01-RECAP.md` | Hard-path honesty (partial) |
| `D:\OandO07072026\Plans\Research\Others\04-HONEST-QUALITY.md` | Spine ≠ ship |
| `D:\OandO07072026\Plans\Research\Others\08-EVIDENCE-INDEX.md` | Historical results map |
| `D:\OandO07072026\Plans\Research\Others\18-PRODUCT-CONTEXT.md` | Business / engines / 6-mo bar |
| `D:\OandO07072026\Plans\Research\Others\19-GOALS-SLICES.md` | Scoreboard claiming many PASS |
| `D:\OandO07072026\Plans\Research\Others\SESSION-RECAP.md` | Global-standard revision note |

#### 0.3.3 Design + Idiots hub

| Path | Notes |
|------|--------|
| `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` | W1–W8 definitions, Approach A, north star |
| `D:\OandO07072026\Idiots\README.md` | Brainstormer program |

#### 0.3.4 D:\websites — root + world-standard pack

| Path | Notes |
|------|--------|
| `D:\websites\README.md` | Canonical research home |
| `D:\websites\PACKAGE_AND_GIT_INVENTORY.md` | Partial — inventory of packages/git |
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\FIRECRAWL-GAPS.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\README.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\REPORT.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\03-inventory\REPORT.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\04-ease\REPORT.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\REPORT.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\06-export-boq\REPORT.md` | Full |
| `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` | Full |

#### 0.3.5 Major pack reports (deep-read)

| Path | Notes |
|------|--------|
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Full (first 200+ lines + remainder structure) |
| `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` | Full |
| `D:\websites\planner5d.com\report\TOOLBARS.md` | Full |
| `D:\websites\planner5d.com\report\PACKAGES_INSPIRATION.md` | Full |
| `D:\websites\planner5d.com\report\DEEP_STACK_AND_PACKAGES.md` | Full (first 100+; stack tables) |
| `D:\websites\roomsketcher.com\report\INSPIRATION.md` | Full (pattern library + W translation) |
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | Full (first 150+; editor patterns) |
| `D:\websites\homestyler.com\report\INSPIRATION.md` | Full (scrape honesty + zones) |
| `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | Full |
| `D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md` | Full — **parked domain-for-sale** |
| `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md` | Full (first 120+) |
| `D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md` | Full (first 80+) |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-synthesis.md` | Full |

#### 0.3.6 Raw scrapes sampled (real quotes)

| Path | Sample use |
|------|------------|
| `D:\websites\roomsketcher.com\raw\help.roomsketcher.com-hc-en-us-articles-360000808925-How-Do-I-Add-Doors-to-My-Project.md` | Door place, wall clamp, flip Q |
| `D:\websites\planner5d.com\raw\planner5d.com-editor.md` | Editor chrome strings |
| `D:\websites\floorplanner.com\raw\cdn.floorplanner.com-static-brochures-FloorplannerManualEN.pdf.md` | Manual TOC + build sections |
| `D:\websites\ikea.com\planner-public\raw\ikea.com-us-en-planners.md` | Hub IA + kitchen mobile caveat |
| `D:\websites\homestyler.com\raw\homestyler.com-forum-view-1613229904600383490.md` | Login pollution confirmation |

### 0.4 Paths sampled (directory inventory, not full byte read)

| Path | How used |
|------|----------|
| `D:\websites\` tree via list_dir | Full pack inventory |
| `D:\websites\planner5d.com\raw\` incl. `deep\`, `editor\` | Bulk inventory; bundles noted as **do not ship** |
| `D:\websites\roomsketcher.com\raw\` | File list + selected help |
| `D:\websites\floorplanner.com\raw\` | File list + manual PDF md |
| `D:\websites\homestyler.com\raw\` | File list + forum sample |
| `D:\websites\ikea.com\planner-public\raw\` | File list + hub |
| `D:\websites\3dplanner.com\raw\` | Listed; product value null per report |
| `D:\websites\oando-render-options\raw\ui-only\` | JSON/PNG reference captures — **not product assets** |
| `D:\websites\research\oem-systems\` | Listed (Steelcase/HON/Haworth/Featherlite marketing) — not deep-read this session |
| `D:\websites\research\firecrawl-wave2\` | Listed thin/empty optional per RESEARCH-MAP |
| `D:\OandO07072026\Plans\phases\P02`–`P10` | Directory inventory only (not full execute-card deep-read; out of phase ownership except handoff) |
| `D:\OandO07072026\Idiots\` sibling phase folders | Empty/pending peers |
| Skills: `using-superpowers`, `brainstorming` | Loaded for process |

### 0.5 Paths skipped / blocked + why

| Path | Why |
|------|-----|
| `D:\OandO07072026\results\` entire tree | **Does not exist** in this workspace snapshot (`list_dir` / `read_file` fail). Cannot re-verify CP-01 pack, WAVE.md, or claimed GATE PASS artifacts live. |
| `D:\OandO07072026\results\planner\world-standard-wave\00-product-truth\*` | Claimed CP-01 evidence **unreadable here** — major honesty finding |
| `D:\OandO07072026\results\planner\world-standard-wave\WAVE.md` | Unreadable here |
| `site/features/planner/open3d/**` product sources | **Out of write scope**; P01 inventory is plan-defined as code-read tasks for executors. This brainstormer did **not** re-grep live code (evidence tree missing; brief is research/plan deep-dive). Code claims below are from **plan/docs that cite paths**, marked as **plan-asserted**, not re-proven this session. |
| Planner5D `raw/deep/bundles/app.js`, `fastboot.js` | Bulk proprietary minified — **not read as source**; ethics forbid reuse; DEEP_STACK covers signals only |
| Homestyler support URL scrape | Report documents Taobao wall — null product value |
| 3dplanner raw parking pages | Report already null; no product inspiration |
| Live competitor authenticated editors | Not scraped; packs explicitly lack live canvas DOM |
| `E:\Goodsites\…` capability matrices cited in comparison slices | Not on this agent’s required path set; cited only as second-hand source in comparison reports |
| Firecrawl re-scrape | **Dead / forbidden by default** — packs sufficient |

### 0.6 Critical meta finding before anything else

| Claim source | Claim | This agent’s verification |
|--------------|-------|---------------------------|
| `P01-product-truth.md` status table | Inventory pack **DONE** 2026-07-09; CP-01 **PASS**; smoke 27/27 | **Cannot confirm artifacts** — evidence root missing from workspace |
| `19-GOALS-SLICES.md` | Product truth note PASS; many W gates PASS | Scoreboard claims vs **no readable results tree here** |
| `00-PENDING.md` | GATE PASS (artifacts) but product not finished | Status narrative consistent with “paper green risk”; **artifacts themselves invisible here** |
| `RESULTS-MAP.md` | Canonical green requires `00-product-truth/INVENTORY.md` + `CONTRADICTIONS.md` | Contract clear; **live folder absent in this checkout** |

**Honesty rule for this report:** Treat historical plan claims as **claims**, not re-proven code/browser truth. Product truth for P01 must re-establish inventory when `results/` is present again.

### 0.7 D:\websites full pack list (tree inventory)

| Pack | Root | Report(s) | Raw depth | P01 relevance |
|------|------|-----------|-----------|---------------|
| Planner5D | `planner5d.com/` | INSPIRATION, TOOLBARS, ETHICS, PACKAGES, DEEP_STACK | Deep (home, editor, business, jobs, bundles noted) | Journey loop, chrome zones, stack family |
| RoomSketcher | `roomsketcher.com/` | INSPIRATION | Help + marketing; some 404 help slugs | Measure rigor, select/edit/delete jobs |
| Floorplanner | `floorplanner.com/` | INSPIRATION | Manuals PDF→md, pricing, updates | Editor IA, shortcuts, orbital 3D |
| Homestyler | `homestyler.com/` | INSPIRATION | Marketing + forums; support dead | Zones, shortcut discoverability (W8 idea) |
| IKEA public planners | `ikea.com/planner-public/` | INSPIRATION | Hub, kitchen, PAX, services 404 | SKU/configurator/BOQ pattern |
| 3dplanner.com | `3dplanner.com/` | INSPIRATION | Parking page only | **Skip** — not a product |
| O&O render options | `oando-render-options/` | CANVAS_INVENTORY_UI_SVG | UI-only PNG/JSON | SVG triple-path honesty for our canvas |
| World-standard 2026-07-09 | `research/2026-07-09-world-standard/` | SYNTHESIS + comparison/* | Slice reports + SCORES | **Primary P01 research routing** |
| From-repo research | `research/from-repo-Plans-Research/` | 2026-07-05 series | Historical | Reconcile; 07-09 wins on conflicts |
| OEM systems | `research/oem-systems/` | raw marketing | Category peers | Systems catalog context |
| Inventories | PACKAGE_AND_GIT, SALVAGE_MAP, GITHUB_3ACCOUNT, git-recovery | — | Ops | Not W-gate truth |

### 0.8 Research ethics (binding for this report)

From `ETHICS_AND_INSPIRATION.md` and RESEARCH-MAP anti-copy checklist:

- Study **behavior / jobs**; rebuild with O&O UI, Phosphor, O&O SKUs.  
- **Do not** paste competitor JS, CSS, SVG path blobs, GLB, brand, or screenshots into product.  
- Research is **not** RESULTS-MAP evidence.  
- Firecrawl is historical; do not re-scrape Planner5D / 3dplanner by default.  
- Scores are **decision aids**, not live product truth.

### 0.9 Method used for this brainstorm

1. Read phase execute card + expert suggestions + EXPERT-PASS.  
2. Read RESULTS-MAP + RESEARCH-MAP + structure advice.  
3. Read world-standard SYNTHESIS, ENGINE-DECISION, MASTER-CHART, all 01–07 slice reports.  
4. Read every major pack INSPIRATION / ethics / toolbars / packages / deep stack.  
5. Sample raw primary quotes.  
6. Attempt to re-open claimed CP-01 evidence → **missing**.  
7. Synthesize contradictions, buyer lens, raised bar, A/B/C inventory approaches, sequence after P01.  
8. Write exhaustive report under Idiots only.

---

## 1 Phase intent restated from execute card (exhaustive)

### 1.1 One-sentence goal (from plan)

> Produce a data-backed map of what the live open3d planner **actually does** versus what docs/README/UI copy **claim**, so later phases (P02–P10) fix real gaps against world-standard gates W1–W8 — not stories.

Source: `Plans/phases/P01-product-truth/P01-product-truth.md` Goal section.

### 1.2 Expanded intent (what success looks like)

| Intent facet | Meaning | Failure if missed |
|--------------|---------|-------------------|
| **Inventory not implementation** | Read-only code + greps + notes; no feature edits | Agent “fixes” select while inventing truth |
| **Claims vs code** | Every material claim gets a verdict | WAVE.md treated as code |
| **W1–W8 surface map** | Symbols/handlers present vs wired vs unit vs browser | Empty matrix cells; invented paths |
| **Route/host truth** | Dual entry + Fabric redirect facts | Agents open wrong hosts forever |
| **Evidence pack** | Canonical folder `00-product-truth/` with INVENTORY + CONTRADICTIONS | CP-01 fails even if chat is eloquent |
| **Handoff to P02** | Freeze engine identity for lock | Engine thrash mid-wave |
| **Buyer honesty baseline** | One-paragraph reality of unaided use | Overclaim “planner works” |

### 1.3 Architecture truth the phase is meant to freeze (plan-asserted)

From execute card Architecture + Tech Stack:

```
Document model (UUID entities, mm)
  → FeasibilityCanvas interim 2D
  → Three / R3F 3D
  → IDB autosave
Fabric full stage = destination (archive + future 2B), not assumed live
```

| Layer | Plan-asserted live state | Destination |
|-------|--------------------------|-------------|
| 2D interactive | FeasibilityCanvas | Fabric.js v7 full stage |
| Fabric furniture overlay | Flag `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` only | Not default |
| Fabric pages | **No** `site/app/planner/fabric/*`; redirects to open3d | Archive code only |
| 3D | Three + OrbitControls path (code may load; product-usable separate) | Orbit ON as W4 |
| Host | Dual entry: WorkspaceRoute (guest/canvas) vs direct Host (open3d) | Same open3d workspace |
| Persist | IDB autosave | Cloud later; honesty now |

### 1.4 Authority order (phase)

1. Owner message  
2. Plans trustdata / live Plans tree (post-cleanup: `Plans/phases`, `Plans/Research`)  
3. `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`  
4. Plan A core (historical)  
5. ayushdocs honesty  

Note: Plans layout cleaned 2026-07-10 — `Plans/trustdata/` no longer live per `Plans/INDEX.md`; paths in P01 execute card still say `Plans/trustdata/…` in places. That is itself a **plan path staleness** issue for executors (see §6).

### 1.5 Out of scope (hard)

- Select/delete product fixes (P03)  
- Orbit product work (P04)  
- Fabric cutover  
- Mesh quality (P08)  
- New Playwright journey product code (P07)  
- Package upgrades  
- CRM / auth / SSR  
- Any edit under `site/features/planner/open3d/**` unless owner unlock expands  

### 1.6 Task map restated (00–07)

| Task | Purpose | Primary artifacts |
|------|---------|-------------------|
| **00** | Evidence dir + run meta + HEAD | `run.json`, `HEAD.txt` |
| **01** | Tree inventory open3d | file list, folder counts, key-files-exist |
| **02** | Routes/hosts claims vs code | ROUTES.md, host-wiring-rg, fabric redirect rg |
| **03** | W1–W8 capability matrix (code surface) | w1–w8 greps, CAPABILITY-MATRIX.md |
| **04** | Claims corpus | claims concat, CLAIMS-REGISTER, fabric-flag rg |
| **05** | Tests/results map + required vitest smoke | unit/e2e lists, EVIDENCE-COVERAGE, smoke log |
| **06** | Deep-read three cores | NOTE-FeasibilityCanvas, NOTE-OOPlannerWorkspace, NOTE-ThreeViewerInner |
| **07** | Canonical pack + CP-01 ready | **INVENTORY.md**, **CONTRADICTIONS.md**, PRODUCT-TRUTH, README, run.json finalize |

### 1.7 CP-01 pass criteria (all required) — restated as a contract

| # | Criterion | Artifact |
|---|-----------|----------|
| 1 | Non-empty file list | `open3d-file-list.txt` |
| 2 | Key files True | `key-files-exist.tsv` |
| 3 | Dual entry + fabric redirect | ROUTES.md + greps |
| 4 | W1–W8 matrix no blanks | CAPABILITY-MATRIX.md |
| 5 | ≥11 claims with verdicts | CLAIMS-REGISTER.md |
| 6 | Canonical inventory + contradictions | **INVENTORY.md**, **CONTRADICTIONS.md** |
| 7 | Three deep notes | NOTE-* |
| 8 | Coverage map | EVIDENCE-COVERAGE.md |
| 9 | Vitest smoke attempted | log + `vitestSmoke` ≠ pending |
| 10 | run.json real meta | head, timestamps, approach, cp01 |
| 11 | Commits, no worktree, no push unless asked | git hygiene |

### 1.8 Fail conditions (anti-patterns)

- Missing INVENTORY or CONTRADICTIONS  
- Empty / invented gate rows  
- Claiming browser green without Playwright under `results/planner/`  
- Editing product while inventorying  
- Worktrees  
- Silent vitest skip  
- Treating WAVE bullets as code truth without path:line  

### 1.9 Expert revision intent (why P01-suggestions existed)

`P01-suggestions.md` corrected a plan that would have **failed CP-01 despite rich work**:

1. Named **INVENTORY.md** + **CONTRADICTIONS.md** as required (RESULTS-MAP / CHECKPOINTS).  
2. Fixed Fabric page myth → archive + redirect.  
3. Fixed host chain dual entry.  
4. Made vitest smoke required (not “optional if time”).  
5. Expanded key-files list.  
6. Tightened greps (W4, W6).  
7. Expanded claims concat sources.  
8. Named Failures.md absolute path.  
9. FOLDER-LOCK: evidence folder **`00-product-truth/`** not `01-product-truth/`.

### 1.10 Status header contradiction (phase file vs workspace)

| What phase file says (2026-07-09) | What this agent sees (2026-07-10) |
|-----------------------------------|----------------------------------|
| Inventory pack DONE | Evidence directory **absent** |
| CP-01 PASS | Cannot open `INVENTORY.md` |
| Smoke 27/27 | No smoke log readable |
| Task checkboxes “historical — do not re-run thrash” | May be true on another machine/backup; **not re-proven here** |

**Phase intent under rebaseline:** P01 product truth may need a **re-open / re-verify** pass if `results/` was pruned, never mirrored into this clone, or moved to `E:\OandO-backups\…`. Until then, treating CP-01 as eternal is **epistemically unsafe**.

### 1.11 North star linkage (design spec)

Design north star (must be the buyer lens for inventory “one-paragraph reality”):

> A facilities buyer can, **without a developer**, open the planner, lay out a small office with **real O&O-scale furniture**, switch **2D↔3D** with orbit, **select/edit/delete**, **save and return** the next day, and trust dimensions enough to **quote** later.

P01 does not make this true. P01 **measures** how far code/claims/evidence are from it, gate by gate.

### 1.12 Approach A lock (context for inventory)

Owner locked Approach A 2026-07-09: ship W1–W8 on Feasibility + document model first; Fabric remains destination after W green. Inventory must **not** recommend re-opening B (Fabric first) or C (chrome first) as default.

### 1.13 Kill-order position of P01

From `Plans/INDEX.md` and STRUCTURE kill order:

```
CP-00 unlock → CP-01 product truth → CP-02 engine lock
  → CP-03 W3 → CP-07 journey → CP-06 save
  → fill W4/W5-symbols/W7/W8 → CP-10
```

P01 is the **myth-stop**. Without it, P02–P10 thrash on wrong engines and false “done” claims.

### 1.14 Parallelism rules for inventory

- Max 8 agents (hard 10) for read-only greps/notes.  
- Distinct filenames under evidence root.  
- One merger owns INVENTORY, CONTRADICTIONS, run.json, CAPABILITY-MATRIX.  
- No two writers on same package for product code (n/a for pure inventory).

### 1.15 Evidence root (FOLDER-LOCK)

Canonical only:

```text
D:\OandO07072026\results\planner\world-standard-wave\00-product-truth\
```

Forbidden aliases as primary: `01-product-truth/`. Allowed pointer-only alias with NOTES.md absolute path if legacy.

### 1.16 What “Approach A” means inside P01 run.json

Default `"approach": "A"` = product journey first inventory framing: prioritize buyer loop claims (draw/place/select/save/orbit) over chrome polish claims when ranking contradictions.

---

## 2 What the plan claims vs what inventory tasks require

### 2.1 Plan status claims (header)

| Claim | Location | Inventory task implication |
|-------|----------|----------------------------|
| Pack DONE 2026-07-09 | P01 status table | If true, re-run is thrash; if false/missing, **re-execute** |
| CP-01 PASS | Same + footer template | Reviewer closed ledger; re-open only if evidence lost |
| Evidence at `00-product-truth/` | Multiple | Must exist for green |
| Fabric corrected | Expert note | Tasks 02/04 must still **verify** redirects, not trust note |
| Dual host entry corrected | Expert note | ROUTES.md dual rows required |

### 2.2 RESULTS-MAP minimum vs phase extras

| Layer | Requirement |
|-------|-------------|
| **Map minimum (CP floor)** | `INVENTORY.md` + `CONTRADICTIONS.md` with repo paths |
| **Phase extras (P01 task list)** | Full pack: greps, matrix, claims, notes, smoke log, run.json, etc. |
| **Rule** | Map minimum alone ≠ skip phase extras; phase extras alone ≠ rename folder |

### 2.3 Claims the inventory must **test**, not assume

From Task 04 minimum claims list (C01–C11 material set):

1. Live 2D is FeasibilityCanvas, not Fabric full stage  
2. Fabric furniture overlay flag-gated  
3. `/planner/fabric/*` working fallback **vs** permanent redirect  
4. P0.1–P0.3 spine ≠ ship quality  
5. Select/delete furniture user-visible status  
6. 3D default mesh quality (boxes vs modular readability)  
7. Orbit present vs product-usable vs WAVE “no orbit” wording  
8. Save is local IDB; cloud honesty  
9. No Playwright open3d draw→place→3D→save pack under world-standard-wave **at inventory time** (later may change)  
10. Entity IDs via crypto / `newEntityId`  
11. Production routes guest / canvas / open3d dual entry  

### 2.4 Plan-asserted production routes (must verify in Task 02)

| Route | Page file (asserted) | Mount |
|-------|----------------------|-------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` | WorkspaceRoute → Host |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` | WorkspaceRoute → Host |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` | Direct Host |

### 2.5 Key files table (Task 01 must-include)

| Role | Path (repo-relative) |
|------|----------------------|
| 2D canvas | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| Workspace | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` |
| 3D viewer | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` |
| Lazy 3D | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` |
| Native host | `site/features/planner/open3d/ui/Open3dNativeHost.tsx` |
| Route host | `site/features/planner/ui/Open3dPlannerHost.tsx` |
| Guest adapter | `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` |
| Keyboard | `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` |
| Canvas hooks | `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` |
| Autosave | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` |
| Fabric flag | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Module README | `site/features/planner/open3d/README.md` |
| Fabric archive | `site/features/planner/_archive/fabric/` |
| Redirects | `site/config/build/next.config.js` |

### 2.6 Gap: plan claims “DONE” vs inventory tasks still describe full work

| Perspective | Reading |
|-------------|---------|
| Executor skimming status only | “Skip P01; go to P02” |
| Executor reading Tasks 00–07 | Full multi-hour inventory |
| RESULTS-MAP | Green only if artifacts exist |
| This agent | **Artifacts missing → status “DONE” is not currently re-provable** |

**Recommendation:** Phase header should say either:

- `DONE` **with** pointer to backup path if results pruned, or  
- `DONE but re-verify if results/ absent`, or  
- Reopen CP-01 as `OPEN` when evidence not on disk.

### 2.7 Path authority thrash still present in text

| Old / wrong | Canonical |
|-------------|-----------|
| `01-product-truth/` | `00-product-truth/` |
| `Plans/trustdata/phases/P01…` (in older commits / some card lines) | `Plans/phases/P01-product-truth/` |
| `results` under `site/` | Forbidden for W proofs |
| Research as pass | RESEARCH-MAP boundary |

### 2.8 What inventory tasks require that status “DONE” does not replace

Even if pack was once green:

1. **Re-open capability matrix** after any open3d refactor.  
2. **Re-diff claims** when README/WAVE/PENDING update.  
3. **Re-run smoke** when keyboard/viewer/canvas tests change.  
4. **Re-assert key-files** after moves.  

Product truth is a **living contract**, not a one-shot ceremony. The plan’s “do not re-run thrash” is correct against **aimless re-inventory**; it is wrong against **missing evidence**.

### 2.9 Expert-pass expectation of P01

EXPERT-PASS assumes CP-01 before engine lock and feature streams. Merged must-fix list starts after truth/engine. If P01 evidence is gone, expert spine still depends on re-inventory.

### 2.10 Scoreboard vs inventory

`19-GOALS-SLICES.md` marks product truth PASS via `00-product-truth/NOTES.md` (note: RESULTS-MAP wants **INVENTORY.md** not only NOTES). Possible mismatch:

| Scoreboard artifact name | RESULTS-MAP canonical |
|--------------------------|----------------------|
| NOTES.md (claimed) | INVENTORY.md + CONTRADICTIONS.md |

If only NOTES.md existed, map minimum could still be fail depending on reviewer strictness. Plan Task 07 requires full INVENTORY.

---

## 3 Research synthesis for P01 (every pack’s relevance)

### 3.1 RESEARCH-MAP phase routing for P01

| Phase | Open first (ideas) | Then | Evidence |
|-------|--------------------|------|----------|
| **P01 baseline** | WAVE.md + SYNTHESIS + COMPARISON-CHART | Inventory **code** vs claims; research is one input | `00-product-truth/` |

Research inputs are **hypotheses for what to inventory**, not answers.

### 3.2 SYNTHESIS pattern library → inventory questions

| Industry pattern | Inventory question for O&O code |
|------------------|--------------------------------|
| 2D structure then decorate | Are wall/door tools present and wired? |
| Instant 2D↔3D | Same UUID document? Toggle present? |
| Drag catalog furniture | placementAction / InventoryPanel path? |
| Select + transform | Hit-test + deleteSelection? |
| Save that returns | IDB flush + labels? |
| Catalog is the product | SKU place + Block2D + modular mesh? |
| BOQ/quote | Export path first-class? (may be out of W core) |

### 3.3 Pack-by-pack relevance matrix

#### 3.3.1 Planner5D

| Asset | P01 use |
|-------|---------|
| INSPIRATION_REPORT | Journey: template → structure 2D → furnish → 3D → share; freemium gates |
| TOOLBARS | Chrome zones Top/Left/Center/Right/Bottom; 2D structure vs 3D decorate role split |
| ETHICS | Binding: inspiration ≠ copy |
| PACKAGES / DEEP_STACK | Three/WebGL family confirmation; **do not** ship their app.js (~17.7MB noted) |
| Raw editor strings | “3D mode not supported”, “Render will appear after a while…”, catalog layer tags |

**P01 translation:** Inventory must map **our** zones (TopBar, CanvasToolRail, InventoryPanel) against **presence**, not P5D pixel parity. Job loop is the benchmark for “does buyer journey exist in code?”

#### 3.3.2 RoomSketcher

| Asset | P01 use |
|-------|---------|
| INSPIRATION | Mode-based editing; door click-on-wall; select→properties; trash delete; tape measure |
| Raw doors help | Strong primary quotes for place/edit/delete jobs |
| Thin areas | Full toolbar chrome not scraped well |

**P01 translation:** W1 openings constraints, W3 select/delete, measure as later — inventory whether **our** handlers cover the same jobs.

#### 3.3.3 Floorplanner

| Asset | P01 use |
|-------|---------|
| Manual EN | Sidebar hub, multi-select rules, orbital vs walkthrough, shortcuts grammar |
| Updates | Product evolution patterns |
| Features page | Login wall — ignored |

**P01 translation:** W4 orbit as **product expectation**; W8 shortcut honesty; multi-select as post-W3 depth.

#### 3.3.4 Homestyler

| Asset | P01 use |
|-------|---------|
| INSPIRATION honesty | Auth noise, dead support, SEO shortcut fluff |
| Forum zones | Five-zone editor pattern; WASD; Help→Shortcuts |
| Photoreal | **Not** W1–W8 goal |

**P01 translation:** W8 discoverability pattern only; do not inventory “render quality” as world-standard gate.

#### 3.3.5 IKEA public planners

| Asset | P01 use |
|-------|---------|
| Hub | Room vs product planners vs services ladder |
| Kitchen mobile note | Honest device policy |
| SKU/config | Commercial pattern: configuration → list → PDF |

**P01 translation:** Catalog truth + BOQ as strategic differentiator; inventory whether open3d export/BOQ is first-class vs helpers only (export slice).

#### 3.3.6 3dplanner.com

| Verdict | **Zero product inspiration** — HugeDomains parking |
|---------|-----------------------------------------------------|
| P01 use | Document “parked”; do not waste inventory time |

#### 3.3.7 O&O render options

| Asset | P01 use |
|-------|---------|
| CANVAS_INVENTORY_UI_SVG | **Critical internal honesty:** inventory SVG path ≠ canvas Path2D footprint ≠ publish pipeline |
| CANVAS_RENDER_OPTIONS | Failure modes for 2D vs WebGL |

**P01 translation:** Claims about “SVG symbols on canvas” must split three paths or they are myths.

#### 3.3.8 World-standard comparison slices

| Slice | P01 relevance |
|-------|---------------|
| 01-engine | Live Feasibility vs Fabric dest; R3F keep |
| 02-toolbar | O&O chrome score ~2; tool dispatch gaps |
| 03-inventory | SKU/mm must-win; place UX partial |
| 04-ease | O&O ~2.1; unaided buyer fails |
| 05-realtime | IDB strength, cloud 1, honesty rules |
| 06-export-boq | Strategic peak on paper; open3d menu gap |
| 07-oando-self | Brutal self-score ~1.9; top 5 deficits |

#### 3.3.9 Historical 2026-07-05 research

Useful for UI package hygiene; **ENGINE-DECISION 2026-07-09 wins** on engine conflicts. Do not revive discarded hybrids.

#### 3.3.10 OEM systems scrapes

Featherlite / HON / Haworth / Steelcase — **systems catalog category** context for product context doc, not floor-planner UX inventory.

### 3.4 MASTER-CHART O&O snapshot (research, not live re-score)

| Parameter | O&O live (research) | Inventory task |
|-----------|---------------------|----------------|
| 2D | 2 | Confirm Feasibility capabilities |
| 3D | 2 | Confirm mesh/orbit code |
| Continuity | 3 | UUID scene rebuild |
| Tools | 2 | Tool rail wiring |
| Inventory | 2 | Place path |
| Ease | 2 / 1 | Browser journey absence |
| Save | 2 | IDB + honesty |
| BOQ | 2 | Export first-class? |
| Mesh | 1–2 | Boxes vs modular parts |

### 3.5 Engine decision (research) → P01 freeze list for P02

| Layer | Decision | P01 must document |
|-------|----------|-------------------|
| 2D dest | Fabric v7 full stage | Archive + flag + not live walls |
| 2D interim | FeasibilityCanvas | Live path |
| 3D | Three + R3F family | Imperative ThreeViewerInner live (EXPERT-PASS: stay imperative mid-gate) |
| Hybrid ban | No Konva+Fabric interactive | Confirm no Konva interactive hybrid |
| Mesh bar | modular-cabinet-v0 | Default place path |
| Catalog | Manufacturer SKU first | O&O SKUs not generic dump |
| Non-goals | Photoreal, multiplayer, AR | Not inventory as missing W |

**Note EXPERT-PASS vs ENGINE-DECISION wording:** Research says “Three + R3F”; expert pass says **stay imperative Three** for open3d mid-W4/W7 — no R3F Canvas rewrite. Inventory must record **implementation shape** (imperative vs declarative), not only package names.

### 3.6 Firecrawl policy impact on P01

No re-scrape required for product truth. If WAVE is missing, **do not** re-scrape competitors to invent status — re-inventory **O&O code**.

### 3.7 RESEARCH-MAP slice scores table (snapshot)

| Slice | Pattern leader | O&O research score | Trustdata response |
|-------|----------------|--------------------|--------------------|
| Engine 2D | RoomSketcher-class | 2 | Feasibility now; Fabric dest |
| Engine 3D | Homestyler/Foyr/P5D | 2 | R3F + orbit W4 |
| Toolbar | P5D-class | 2 | Labels W8 |
| Inventory UX | P5D/Floorplanner | 2 | Place journey W2 |
| Inventory SKU | IKEA-class | 3 pot / 2 UX | O&O SKUs |
| Ease | P5D-class | 2 | Playwright W1–W2 |
| Realtime/save | P5D/Floorplanner | 2 | W5–W6 |
| BOQ | IKEA-class | 2 | Wedge after W |
| Mesh | Homestyler/Foyr | 1 | W7 modular |

### 3.8 How research must appear in INVENTORY.md

Correct:

> Industry pattern: select→delete is table stakes (RoomSketcher help, Floorplanner manual). **Our code:** {path:line status}. **Browser:** missing/present.

Incorrect:

> We need RoomSketcher-style blue toolbar (copy).

---

## 4 Competitive pattern bank (jobs-to-be-done only, O&O translation)

### 4.1 Core JTBD table

| JTBD (abstract) | Competitor evidence (ideas) | O&O translation | Gate |
|-----------------|-----------------------------|-----------------|------|
| Draw walls / rooms | P5D 2D structure; Floorplanner draw room/wall; RS walls first | Wall tools on FeasibilityCanvas | W1 |
| Place openings on walls | RS: select door → click wall; clamp length | Opening tool + wall host | W1 |
| Place sellable furniture | P5D/FP drag catalog; IKEA modules | Inventory place + cabinet-v0 | W2 |
| See readable plan symbols | Catalog tiles vs plan fidelity | Block2D / footprint honesty | W2/P05 |
| Select object | RS/FP select → properties | Hit-test furniture | W3 |
| Delete object | RS trash; FP delete; Del key | Delete/Backspace + undo | W3 |
| Inspect in 3D | Orbital (FP) / Live 3D (RS) / P5D toggle | 2D↔3D + orbit | W4 |
| Leave and return | Cloud archive (peers); O&O IDB | Hard reload same UUIDs | W5 |
| Trust save label | Figma-class honesty; IKEA manual save anti-pattern | Local vs cloud truthful | W6 |
| Trust product looks like product | Homestyler mesh; IKEA SKU | modular toe/carcass/door | W7 |
| Trust labels/shortcuts | Homestyler Help shortcuts; FP manual | Labels = handlers | W8 |
| Get a quote | IKEA item list; SmartDraw estimating | INR+GST BOQ → quote | Strategic (post-W) |

### 4.2 Chrome JTBD (not copy zones)

| Job | Pattern | O&O form (original) |
|-----|---------|---------------------|
| Know active tool | Rail active state + status | CanvasToolRail + status strip |
| Find catalog | Left/right inventory | InventoryPanel + O&O SKUs |
| Switch 2D/3D | Segmented control | TopBar toggle, same document |
| Discover shortcuts | Help sheet | W8 sheet matching keyboard map |
| Undo recovery | Visible undo | History stack (W3 undo) |

### 4.3 Ease JTBD

| Job | Winner pattern | O&O |
|-----|----------------|-----|
| Try before account | Guest / Canva / IKEA | Guest route inventory |
| Escape blank canvas | Templates / wizard | Empty triad later; not W core but ease gap |
| 10-minute showable | Template+furnish | Not proven end-to-end historically |

### 4.4 Anti-patterns (do not inventory as goals)

| Anti-pattern | Why |
|--------------|-----|
| Photoreal 4K race | Wrong wedge; BOQ > pretty |
| Million generic props | Breaks SKU truth |
| Account before first wall | Kills W proof on guest |
| Dimension→D rebind | EXPERT-PASS forbidden |
| Fake multiplayer presence | Honesty |
| Fabric full-stage mid-W thrash | Approach A break |
| R3F rewrite mid-gate | Expert lock: imperative Three |

### 4.5 Manufacturer systems JTBD (product context)

From `18-PRODUCT-CONTEXT.md` — not competitor copy:

```
Client → System/family → Shape → Size grid → Modules
  → Generate 2D (Block2D/SVG) + modular 3D
  → Place many instances → BOQ/quote
```

P01 inventory should note whether place path is **SKU/modular systems** or **demo boxes**, without solving systems v0.

### 4.6 Pattern bank by gate (expanded)

#### W1 jobs

1. Activate wall tool  
2. Draw multi-segment wall  
3. Place door/window on wall  
4. Reject impossible opening (wider than wall) — RS strong  
5. See structure in plan  

#### W2 jobs

1. Browse catalog by category  
2. Place item by click or drag  
3. Place cabinet-v0 modular  
4. See non-blob 2D symbol  
5. Fixed manufacturer mm (no silent stretch of sellable SKU)  

#### W3 jobs

1. Click furniture to select  
2. Visual selection state  
3. Delete / Backspace removes  
4. Undo restores  
5. Esc clears selection (expert)  
6. Single history path (expert: pure delete → one updateProject)  

#### W4 jobs

1. Toggle 2D↔3D  
2. Pose continuity (same UUIDs)  
3. Orbit enabled (three-layer expert: default + prop + data-attr + unit spy)  
4. Console clean  

#### W5–W6 jobs

1. Autosave to durable store  
2. Flush on leave  
3. Hard reload identity  
4. Label never says cloud if IDB only  

#### W7 jobs

1. Readable multiparts for cabinet-v0  
2. Height integrity toe→carcass→door  
3. Not photoreal requirement  

#### W8 jobs

1. Every visible shortcut works  
2. aria-keyshortcuts honest  
3. Invert map for D/M/N/T etc. (expert)  

### 4.7 Quotes (primary sources — research only)

**RoomSketcher doors (raw help):**

> “Click to select a door. Click on a wall to place the door.”  
> “The door's length must not exceed the wall's length.”  
> “To change the direction of the swing, click Flip Door or use the hotkey Q.”

**Planner5D editor raw strings (sampled):**

> “3D mode not supported. Upgrade your browser…”  
> “Render will appear after a while in a ‘Renders’ section”  
> “This is a view mode only. Copy project to make edits.”  
> Layer tags: `floor|ceil|indoor|outdoor`

**IKEA hub (raw):**

> “With room planners, you can create a detailed technical plan of your space, including windows, outlets and pipes.”  
> “\*Please note, the IKEA kitchen planner is not compatible with mobile devices.”

**Floorplanner manual TOC (raw md):** Build tools rooms/walls; doors/windows; 3D orbital and walkthrough; keyboard shortcuts; furniture library; export 2D/3D.

These quotes define **jobs**, not UI to clone.

---

## 5 Product truth questions the phase must answer

### 5.1 Engine identity questions

1. What is the live 2D interactive engine?  
2. Is Fabric full stage reachable as default 2D?  
3. What does the Fabric flag actually enable?  
4. Do `/planner/fabric*` URLs serve Fabric or redirect?  
5. Is Konva used interactively anywhere on open3d path?  
6. What is the live 3D construction path (imperative Three vs R3F Canvas)?  
7. Where is OrbitControls constructed and what defaults apply?  

### 5.2 Host / route questions

8. What is the full import chain for guest, canvas, open3d?  
9. Does open3d pilot skip ProjectSetupGate?  
10. Are guest and canvas truly the same shell?  
11. Which route is the Playwright gold path supposed to use?  

### 5.3 Gate surface questions (code-only in P01)

12. W1: Which symbols create walls/openings? Wired to UI?  
13. W2: How does place enter the document? cabinet-v0 path?  
14. W3: deleteSelection coverage by entity type? Keyboard preventDefault?  
15. W4: viewMode toggle + enableControls wiring?  
16. W5: When does autosave flush? IDB store name?  
17. W6: Exact status label strings local vs cloud?  
18. W7: Default mesh factory path for modular place?  
19. W8: Does keymap match CanvasToolRail / palette labels?  

### 5.4 Evidence questions

20. Which unit tests exist under open3d unit root?  
21. Which Playwright specs name planner?  
22. Which historical `results/planner/*` dirs are spine-only?  
23. Is there a world-standard browser journey pack?  
24. What is vitest smoke outcome?  

### 5.5 Claims questions

25. Which ayushdocs claims are stale relative to code?  
26. Does WAVE “no orbit” still match ThreeViewerInner?  
27. Does archive README claim fallback routes that redirects kill?  
28. Do status docs claim GATE PASS while product unfinished?  

### 5.6 Buyer questions (one-paragraph inventory output)

29. Can a facilities buyer complete structure→furnish→3D→save unaided today?  
30. What is the first hard stop they hit?  
31. Is that stop code-absent, code-partial, or proof-missing?  

### 5.7 Handoff questions for P02

32. What exact freeze list prevents engine thrash?  
33. What myths must P02 not re-open?  
34. What is interim vs destination for 2D?  

### 5.8 Epistemic questions for rebaseline (2026-07-10)

35. Does `results/planner/world-standard-wave/` exist on the machine claiming PASS?  
36. If only on E: backup, is that linked in NOTES?  
37. Are scoreboard ticks backed by map-minimum files?  

### 5.9 SVG triple-path questions (from oando-render-options)

38. Does inventory thumbnail SVG equal canvas furniture draw?  
39. Does publish SVG pipeline affect live FeasibilityCanvas?  
40. Are claims conflating A/B/C paths?  

### 5.10 Answer format required by phase

Each material answer should land as table rows with:

| Field | Rule |
|-------|------|
| Claim | Verbatim short |
| Path:line or config | Required for code claims |
| Verdict | supported / contradicted / stale / unverified |
| Gate tag | W1–W8 or baseline |
| Buyer impact | One line |

---

## 6 Contradictions / myths / stale docs

### 6.1 Structural contradictions (plan ecosystem)

| ID | Contradiction | Severity | Resolution direction |
|----|---------------|----------|----------------------|
| X01 | P01 status **DONE/PASS** vs `results/` **missing** in this checkout | **P0** | Re-verify evidence or restore from E: backup; do not invent |
| X02 | RESULTS-MAP requires INVENTORY.md; scoreboard mentions NOTES.md | P1 | Align scoreboard to map minimum names |
| X03 | P01 card still references `Plans/trustdata/` paths; live tree is `Plans/phases` + `Plans/Research` | P1 | Path rewrite or pointer docs |
| X04 | P01-suggestions historically said evidence under `01-product-truth/`; FOLDER-LOCK is `00-` | P0 (fixed in revised card; residual in old text) | Canonical `00-` |
| X05 | Gate PASS language vs “product not finished” (00-PENDING) | P0 product honesty | Always dual-state language |
| X06 | Research O&O ease score ~1–2 vs later scoreboard many PASS | P1 | Gates can pass with residual boxy mesh / no cloud |
| X07 | ENGINE-DECISION “R3F” vs EXPERT-PASS “imperative Three only mid-gate” | P1 | Document both: packages present, implementation shape locked |
| X08 | Furniture degrees vs any plan line claiming all radians | P0 expert | Degrees in document (EXPERT-PASS false-reverse #1) |
| X09 | Archive Fabric fallback routes vs next.config permanent redirect | P0 | Redirect wins; claim stale if README says fallback works |
| X10 | WAVE “no orbit” vs OrbitControls code presence (suggestions note) | P0 | Three-way: code / product-usable / docs |
| X11 | Cloud “Saved” risk vs IDB-only truth (05-realtime) | P0 | W6 honesty |
| X12 | P0 spine DONE language vs ship quality | P0 | 04-HONEST-QUALITY |
| X13 | Inventory SVG vs canvas Path2D vs publish SVG (oando-render-options) | P1 | Three authorities |
| X14 | 3dplanner.com as competitor in old lists vs parking page | P2 | Remove from active competitor set |
| X15 | Homestyler keyboard SEO article vs no real key list | P2 | Do not cite as W8 source |
| X16 | Freemium “unlimited projects” vs free plan limit strings in P5D scrapes | Research only | Marketing variance — not our product |
| X17 | Approach A vs temptation to Fabric-cutover mid-W | Process | EXPERT-PASS false-reverse #2 |
| X18 | Unit green ≠ browser green (RESULTS-MAP forbidden claims) | P0 | Forever |

### 6.2 Myth catalog (things agents repeatedly get wrong)

| Myth | Truth shape |
|------|-------------|
| “Fabric is live 2D” | Feasibility is live; Fabric dest/flag/archive |
| “Open3d is R3F Canvas product” | Imperative ThreeViewerInner per expert |
| “Select exists because Delete handler exists” | Need hit-test + wired UI + browser |
| “Orbit exists because import exists” | Need enableControls chain + product proof |
| “Saved means cloud” | Often IDB only |
| “P0 done = ship” | Spine ≠ product |
| “Research score = live product” | Snapshot dated 2026-07-09 |
| “W gate PASS = buyer ready” | 00-PENDING dual state |
| “SVG on canvas” | Footprint Path2D ≠ inventory SVG |
| “3dplanner competitor” | Domain parked |
| “Re-scrape will unlock product truth” | Code inventory unlocks it |

### 6.3 Stale doc patterns

| Doc class | Staleness risk |
|-----------|----------------|
| Archive fabric README rollback bullets | Redirects supersede |
| Pre-FOLDER-LOCK path advice | Dual-08, 01-product-truth bans reversed |
| Pre-cleanup Plans/trustdata paths | Tree moved 2026-07-10 |
| WAVE pre-execution blockers | May lag after phases land (when evidence exists) |
| 07-oando-self ease=1 | May lag if journey pack later landed elsewhere |
| 2026-07-05 package research | Reconcile with 07-09 engine decision |

### 6.4 Contradiction handling rules for INVENTORY / CONTRADICTIONS

Severity rubric:

| Severity | Meaning |
|----------|---------|
| P0 | Buyer-facing lie or engine thrash risk |
| P1 | Agent thrash / wrong phase work |
| P2 | Noise / research only |

Each CONTRADICTIONS row needs: claim source, claim, code path, evidence, severity.

### 6.5 Specific claim-vs-code templates (for re-inventory)

#### Fabric redirect

| Claim | Expected check |
|-------|----------------|
| Fabric pages exist under app router | `Test-Path site/app/planner/fabric` → False |
| URL works as Fabric fallback | next.config permanent redirect to `/planner/open3d/` |
| Archive has code | `_archive/fabric/` True |

#### Orbit

| Layer | Check |
|-------|-------|
| Import/construct | ThreeViewerInner OrbitControls |
| Default enableControls | prop default |
| Workspace pass-through | enableControls={true} |
| DOM truth | data-orbit-enabled |
| Docs | WAVE wording |

#### Save honesty

| Layer | Check |
|-------|-------|
| IDB write | useOpen3dWorkspaceAutosave |
| Label strings | workspaceStatusLabels / TopBar |
| Cloud path | memberPlanRepository wired? |
| UI never green on React-state-only | honesty tests |

### 6.6 Path:line cite discipline

P01 forbids floating claims. Every “exists” needs path. This brainstormer **cannot** supply live path:line for open3d sources without reading them; re-inventory agent must fill NOTES with real lines.

### 6.7 Status language recommended after this report

Use dual lines everywhere:

```text
CP-01 artifacts: {PASS | MISSING | REOPEN}
Buyer product truth: {not ship | partial | …}
```

Never collapse them.

---

## 7 Buyer (facilities) lens — what “truth” means for unaided use

### 7.1 Buyer persona

| Attribute | Detail |
|-----------|--------|
| Role | Facilities / project buyer for office furniture |
| Skill | Not a CAD expert; not a developer |
| Goal | Layout small office with real O&O-scale pieces; trust enough to quote later |
| Time | Minutes to first credible layout, not days of recon |
| Trust failures | Wrong labels, missing delete, boxes that look like toys, save that vanishes, 3D that can’t orbit |

### 7.2 Unaided journey (desired)

1. Open planner (guest or member) without training deck  
2. Draw room/walls  
3. Add door  
4. Place ≥2 real catalog items including storage/cabinet  
5. Select and correct mistakes (delete/undo)  
6. Switch to 3D, orbit, switch back  
7. Leave, return next day, same plan  
8. Export/quote path later  

### 7.3 What “truth” means at each step

| Step | Truth | Lie |
|------|-------|-----|
| Open | Route loads workspace | Dead link, wrong engine |
| Draw | Walls persist in document | Ghost geometry |
| Place | SKU identity + mm | Free-scale fake product |
| Select | Click selects furniture | Only walls selectable |
| Delete | Key removes selection | Browser navigates back |
| 3D | Orbit works | Static boxes, no controls |
| Save | Label matches storage | “Cloud” for IDB |
| Quote | Lines match placed SKUs | Pretty picture only |

### 7.4 Buyer-facing honesty from research self-score (historical)

`07-oando-self` (2026-07-09 research): ease **1** — product does not work for unaided buyer; no Playwright journey at that snapshot. Later docs claim gate packs landed; **buyer residual** still called out in 00-PENDING (boxy mesh, no cloud, product not finished).

### 7.5 Facilities-specific success metric (18-PRODUCT-CONTEXT)

- Premium custom workstation systems  
- Scale toward thousands of seats  
- Own stack vs $40k vendor lock-in  
- 6-month bar: serious prototype, not full factory  

Product truth for P01 is the **honest distance** to that prototype, not marketing distance to Planner5D photoreal.

### 7.6 What inventory “one-paragraph reality” should sound like

Bad:

> Open3d is a world-class planner with Fabric, R3F, and cloud save.

Good (template):

> Today a buyer can open `/planner/guest` or `/planner/open3d` into the open3d workspace (FeasibilityCanvas 2D + Three 3D, dual host entry). Live 2D is not Fabric full stage; Fabric overlay is flag-gated; fabric URLs redirect. {Select/delete: status from matrix}. {Orbit: code vs usable}. Save is {local IDB / label honesty}. Browser journey proof is {present under folder / missing}. Mesh defaults are {boxes / multiparts}. This is {spine / partial product}, not ship.

### 7.7 Unaided use failure modes (buyer-visible)

| Failure | Buyer experience | Gate |
|---------|------------------|------|
| Cannot select furniture | “App is broken” | W3 |
| Delete does nothing / navigates away | Rage quit | W3 |
| 3D is a postcard | “Why 3D?” | W4 |
| Reload empty | Lost work | W5 |
| Green Saved + lost on other PC | Trust death | W6 |
| Toy boxes | “Not our furniture” | W7 |
| Shortcut lies | Feels unfinished | W8 |
| Blank canvas no coach | Abandon | Ease (adjacent) |

### 7.8 Guest vs member truth

| Path | Buyer expectation | Inventory check |
|------|-------------------|-----------------|
| Guest | Try without account | Local IDB; claim path later |
| Member | My projects | Must not lie cloud |

### 7.9 Quote path truth (strategic, not W core)

Facilities buyer eventually needs INR+GST BOQ. Research slice 06 says O&O has helpers but open3d export menu may not make BOQ first-class. Inventory should **register claim** without expanding P01 into BOQ feature work.

### 7.10 Accessibility as buyer truth (secondary)

A11y open3d residuals (nested main historically, label-in-name later work) affect unaided use. P01 should note evidence folders if present; not fix.

---

## 8 Gate linkage W1–W8 from baseline inventory

### 8.1 Gate definitions (design spec authority)

| Gate | Definition | Proof bar |
|------|------------|-----------|
| **W1** | Draw structure (walls + door opening) on open3d or guest | Playwright + screenshots |
| **W2** | Place ≥2 catalog items incl. cabinet-v0; readable Block2D | Playwright + PNG |
| **W3** | Select furniture + Delete/Backspace; undo restores | Unit + Playwright |
| **W4** | 2D↔3D preserves pose; orbit enabled | Playwright + console clean |
| **W5** | Save → hard reload → same walls + furniture ids | Playwright wait/flush |
| **W6** | Status text local vs cloud truthful | Code + UI + test |
| **W7** | Mesh bar + visual multiparts cabinet-v0 | Visual smoke + NOTES |
| **W8** | Tool/shortcut labels match handlers | Unit + keyboard test |

### 8.2 P01 baseline role (not green gates)

P01 does **not** clear W1–W8. P01 fills a **capability matrix** with status tokens:

`code-present` | `code-partial` | `code-absent` | `unit-green` | `unit-missing` | `browser-missing` | `docs-overclaim`

Expected default for browser columns at pure inventory time: **`browser-missing`** unless real Playwright artifacts exist under `results/planner/`.

### 8.3 Primary paths (plan Task 03)

| Gate | Primary paths (plan) |
|------|----------------------|
| W1 | FeasibilityCanvas, useDoorWindowPlacement, model/actions/walls, openings |
| W2 | InventoryPanel, placementAction, modularCabinetV0, furnitureBlock2D |
| W3 | FeasibilityCanvas, OOPlannerWorkspace, useWorkspaceKeyboard |
| W4 | OOPlannerWorkspace, ThreeLazyViewer, ThreeViewerInner |
| W5 | useOpen3dWorkspaceAutosave, projectJson, saveReloadContinuity test |
| W6 | workspaceStatusLabels, TopBar, memberPlanRepository, guestProjectRepository |
| W7 | modularCabinetV0, createSceneObjectFromNode, buildOpen3dSceneNodes |
| W8 | useWorkspaceKeyboard, CanvasToolRail, paletteCommands |

### 8.4 RESULTS-MAP gate → folder after baseline

| Gate | Primary evidence folder (later phases) |
|------|----------------------------------------|
| W1 | `02-browser-open3d-journey/` |
| W2 place | `02-browser-open3d-journey/` |
| W2 symbols | `05-symbols-svg/` |
| W3 | `03-select-delete/` |
| W4 | `04-orbit-continuity/` |
| W5 | `06-save-honesty/save-reload/` |
| W6 | `06-save-honesty/` |
| W7 | `08-mesh-quality/` |
| W8 | `09-shortcuts-chrome/` |

### 8.5 How baseline inventory feeds each later CP

| Later phase | Uses P01 for |
|-------------|--------------|
| P02 | Engine freeze list, Fabric/Feasibility truth, orbit code location |
| P03 | Whether delete/select code-partial vs absent; unit files list |
| P04 | Orbit three-layer gaps from NOTE-ThreeViewerInner |
| P05 | Block2D vs SVG authority confusion notes |
| P06 | Label honesty + autosave flush findings |
| P07 | Journey blockers known before writing Playwright |
| P08 | Mesh default path honesty |
| P09 | Shortcut mismatch list |
| P10 | Index of baseline contradictions residual |

### 8.6 Expert-pass gate constraints that inventory must surface

1. W3 unit alone = FAIL later  
2. Fabric flag OFF for W3/W2 proof  
3. Orbit three-layer  
4. Degrees furniture rotation  
5. Imperative Three  
6. Save flush not cancel  
7. Journey serial + deltas  
8. Block2D authority / centered path false  
9. Mesh toe→carcass→door  
10. Shortcut invert map; no Dimension→D  

P01 should **flag** if code currently violates these, not fix them.

### 8.7 Forbidden claims matrix (from RESULTS-MAP) — inventory must teach agents

| Claim | Requires green folder | Not enough |
|-------|----------------------|------------|
| Journey works | `02-browser-open3d-journey/` | unit spine, research |
| Select/delete works | `03-select-delete/` | handler exists |
| 3D works | `04-orbit-continuity/` | boxes render |
| Symbols OK | `05-symbols-svg/` | admin SVG publish |
| Save works | `06-save-honesty/` + reload | IDB unit only |
| Mesh OK | `08-mesh-quality/` | modular place unit only |
| Shortcuts OK | `09-shortcuts-chrome/` | keymap file unread |
| Engine locked | `01-engine-lock/` | research ENGINE-DECISION unread |
| Product truth inventoried | `00-product-truth/` | WAVE narrative alone |

### 8.8 Capability matrix row template (copy for re-inventory)

```markdown
| Gate | Symbol / handler exists? | Path:line | Wired to UI? | Unit test file | Browser proof in results/? | Honest status |
|------|--------------------------|-----------|--------------|----------------|----------------------------|---------------|
| W1 | | | | | browser-missing | |
… W8
```

### 8.9 Relationship to historical spine evidence

From RESULTS-MAP historical table and 08-EVIDENCE-INDEX:

| Historical dir class | May support | Does not clear |
|----------------------|-------------|----------------|
| p0-1 admin SVG | Evidence shape for Playwright | W1–W8 |
| modular-place* | Non-regression | W7 bar |
| save-reload-continuity | P06 unit cite | W5 browser alone |
| fabric-stage-slice | Flag path | Fabric live |
| a11y-open3d | P09 blockers | W8 full |
| crypto-ids | Claim C10 support | Journey |

### 8.10 Gate linkage diagram (logical)

```text
P01 matrix (code/unit/browser tokens)
   │
   ├─► P02 freezes engines that matrix named
   ├─► P03 attacks W3 rows with unit+browser
   ├─► P07 attacks W1–W2 browser rows
   ├─► P06 attacks W5–W6 rows
   └─► P04/P05/P08/P09 fill remaining rows
         └─► P10 packs residual honesty
```

---

## 9 Evidence contract (RESULTS-MAP) — what green would mean

### 9.1 Canonical folder

```text
results/planner/world-standard-wave/00-product-truth/
```

### 9.2 Map minimum green

| File | Role |
|------|------|
| `INVENTORY.md` | Canonical product inventory; CP-01 path of record |
| `CONTRADICTIONS.md` | Claim vs code/config table with severity |

### 9.3 Phase full green (P01 contract list)

Required artifacts from execute card Evidence contract section:

- run.json, HEAD.txt  
- open3d-file-list.txt, open3d-folder-counts.tsv, key-files-exist.tsv  
- host-wiring-rg.txt, fabric-redirect-and-archive-rg.txt, ROUTES.md  
- w1…w8 greps, CAPABILITY-MATRIX.md  
- claims-sources-concat.txt, CLAIMS-REGISTER.md, fabric-flag-rg.txt  
- unit-test-list.txt, e2e-planner-spec-names.txt, results-planner-dirs.txt  
- EVIDENCE-COVERAGE.md  
- NOTE-FeasibilityCanvas.md, NOTE-OOPlannerWorkspace.md, NOTE-ThreeViewerInner.md  
- INVENTORY.md, CONTRADICTIONS.md, PRODUCT-TRUTH.md, README.md  
- vitest-capability-smoke-raw.log  

### 9.4 run.json required keys

`startedAt`, `finishedAt`, `head`, `headEnd`, `approach`, `vitestSmoke` (`ok|failed|skipped`), `vitestSmokeReason`, `cp01` (`ready-for-review|blocked|pass|fail`), `blockers[]`, `counts{filesListed,claimsRegistered,gatesFilled,...}`

### 9.5 What GREEN means (folder status convention)

| Status | Meaning |
|--------|---------|
| Missing | Not created |
| OPEN | Incomplete / red |
| GREEN | Map minimum **and** phase extras; CP may PASS |
| WAIVE | Owner only in CHECKPOINTS |

### 9.6 What GREEN does **not** mean

- Buyer-ready product  
- Any W1–W8 pass  
- Cloud save  
- Fabric cutover  
- Photoreal  
- Research scores improved  

### 9.7 CP-01 pass vs ready-for-review

| State | When |
|-------|------|
| ready-for-review | Pack complete; reviewer not yet marked |
| pass | Reviewer footer + CHECKPOINTS + run.json cp01=pass |
| blocked | Key file missing, smoke silent skip, etc. |
| fail | Reviewer rejects |

### 9.8 Vitest smoke command contract

Package-filtered vitest of:

- open3dWorkspaceKeyboard.test.tsx  
- threeViewerInner.test.tsx  
- open3dFeasibilityCanvas.test.tsx  
- saveReloadContinuity.test.ts  
- workspaceStatusLabels.test.ts  

Silent skip = CP-01 fail.

### 9.9 Encoding note

PowerShell `Set-Content -Encoding utf8` may write BOM; prefer utf8NoBOM if parsers break — do not discard evidence.

### 9.10 E: backup relationship

CP-10 mirrors wave tree to `E:\OandO-backups\trustdata-YYYY-MM-DD\…`. If local `results/` missing, first recovery attempt is E: backup (00-PENDING cites `E:\OandO-backups\trustdata-2026-07-10\`).

### 9.11 Forbidden dump locations

- `results/tests/` as sole W proof  
- `site/results/`  
- `archive/results/` as current  
- `D:\websites` as pass  

### 9.12 PRODUCT-TRUTH.md role

May be pointer to INVENTORY.md; **INVENTORY remains path of record**.

### 9.13 What this agent would mark today

| Criterion | Mark here |
|-----------|-----------|
| Evidence directory exists | **FAIL / unverified** (missing) |
| Map minimum files | **FAIL / unverified** |
| Phase status DONE | **Stale relative to this checkout** |
| Research knowledge for re-inventory | **Strong** (this report) |

---

## 10 Failure modes if inventory is shallow

### 10.1 Failure mode catalog

| ID | Shallow behavior | Downstream damage |
|----|------------------|-------------------|
| F01 | Treat WAVE as code | Fix non-bugs; miss real bugs |
| F02 | Grep-only without reading handlers | False code-present |
| F03 | Skip dual host entry | Wrong Playwright seeds |
| F04 | Skip Fabric redirect | Dead engine thrash |
| F05 | Mark unit-green without log | Paper PASS |
| F06 | Mark browser-green without PNG/log | Paper PASS |
| F07 | Empty W rows “later” | P02 freezes myths |
| F08 | No CONTRADICTIONS file | Claims rot |
| F09 | Inventory SVG conflation | Wrong P05 work |
| F10 | Skip save label audit | Ship cloud lie |
| F11 | Orbit default-only | W4 false green later |
| F12 | Re-scrape competitors for “truth” | Waste + ethics risk |
| F13 | Edit product during inventory | Scope creep, broken comparison |
| F14 | Worktree inventory | Split brain |
| F15 | Skip key-files-exist | Broken path assumptions |
| F16 | No merger ownership | Clobbered matrix |
| F17 | Assume CP-01 forever after prune | Entire wave epistemic rot |
| F18 | Scoreboard tick without map files | Owner false confidence |
| F19 | Degrees/radians reverse from shallow read | Mass rewrite risk (expert) |
| F20 | Fabric flag ON for W proofs | Dual engine mid-gate |

### 10.2 Shallow inventory signatures (detect)

- CAPABILITY-MATRIX filled with “probably”  
- Claims register <11 rows  
- All gates `code-present` with same path  
- No fabric-redirect-and-archive-rg.txt  
- run.json vitestSmoke pending  
- INVENTORY one paragraph with no links to greps  
- PRODUCT-TRUTH without CONTRADICTIONS  

### 10.3 Cost estimate of shallow P01

| Cost type | Effect |
|-----------|--------|
| Agent thrash | Days lost on Fabric cutover mid-W |
| False green | Owner ships demo as product |
| Buyer trust | Facilities pilot fails publicly |
| Money | Return toward $40k vendor path  
| Morale | “We already did inventory” while myths remain |

### 10.4 Deep inventory signatures (good)

- Every key file True with timestamped HEAD  
- Dual entry documented with import quotes  
- Orbit three-way contradiction explicit  
- Save honesty strings quoted  
- Smoke log non-empty  
- Historical results dirs classified spine vs world  
- P02 freeze list ≤1 page, brutal  

---

## 11 Detailed critique of P01 plan quality

### 11.1 Strengths

| Strength | Why it matters |
|----------|----------------|
| Inventory-only scope | Prevents thrash |
| Checkbox tasks + PowerShell | Agentic executable |
| CP hard stop | Blocks myth-driven P02 |
| Expert suggestions applied | Fixed CP artifact mismatch |
| FOLDER-LOCK alignment | 00-product-truth |
| Status vocabulary for matrix | Comparable honesty |
| Required vitest smoke | Anti silent skip |
| Dual entry + Fabric truth in revised card | Matches live architecture claims |
| Parallelism file ownership | Anti clobber |
| Ethics pointer | No scrape-as-code |

### 11.2 Weaknesses / residual risks

| Weakness | Detail | Severity |
|----------|--------|----------|
| **Status DONE without durable evidence in this checkout** | Header discourages re-run while artifacts missing | P0 |
| **Plans/trustdata path fossils** | Card still mentions trustdata paths post-cleanup | P1 |
| **No recovery procedure** | If results pruned, no Task 00 “restore from E:” | P1 |
| **Code deep-read optional in practice** | Agents may grep-only | P1 |
| **Does not require screenshot of live UI** | Inventory is code-first (OK) but buyer paragraph may be speculative | P2 |
| **Claims list fixed at 11** | Product evolves; need update rule | P2 |
| **W4 grep still can miss enableControls chain** | Three-layer needs reading OOPlannerWorkspace | P1 |
| **No explicit SVG triple-path claim** | oando-render-options critical for truth | P1 addenda |
| **Scoreboard NOTES vs INVENTORY** | Naming drift | P1 |
| **Length ~800 lines** | Skim risk; mitigated by status table | P2 |
| **“27/27 smoke”** | Number without suite identity in header | P2 |
| **No link to Idiots brainstorm** | Meta only | P3 |

### 11.3 Comparison to writing-plans ideal

| Criterion | P01 grade |
|-----------|-----------|
| Bite-sized tasks | A |
| Concrete paths | A |
| No TBD in tasks | A |
| Hard CP | A |
| Evidence folder lock | A |
| Survives repo layout cleanup | C (path fossils) |
| Survives results prune | D |
| Buyer-first framing | B |
| Research integration | B (via RESEARCH-MAP, not inlined) |

### 11.4 P01-suggestions quality

Excellent P0 catch list. Disposition says P0+P1 incorporated. Residual P2 (BOM, parallelism table) still valid.

### 11.5 Interaction with STRUCTURE advice

P01 ~800 lines is “inventory heavy — OK for read-only.” Do not split into multi-file phase ownership. Thin revision essays after first land if needed — but re-verify needs full task list if evidence missing.

### 11.6 Interaction with EXPERT-PASS

Expert pass assumes truth exists. Does not restate P01 tasks. Gap: no expert essay dedicated to product-truth epistemology beyond oando-self research.

### 11.7 What I would change in the plan (recommendations, not edits)

1. Add **Evidence presence precondition**: if `00-product-truth/` missing, auto-reopen CP-01.  
2. Replace remaining `Plans/trustdata` strings with live paths.  
3. Add claim rows for SVG triple-path and degrees rotation.  
4. Require INVENTORY section “Buyer first hard stop.”  
5. Scoreboard must cite INVENTORY.md not only NOTES.  
6. Header status machine: DONE | DONE-MISSING-EVIDENCE | OPEN.  
7. Link E: backup path when local missing.  
8. Explicit “do not treat 19-GOALS PASS as substitute for map files.”

### 11.8 What I would **not** change

- Inventory-only scope  
- CP hard stop  
- Folder name 00-  
- Approach A  
- Required smoke  
- No browser-green in P01  

### 11.9 Plan quality score (brutally)

| Dimension | Score /5 |
|-----------|----------|
| Executability | 5 |
| Honesty design | 5 |
| Path currency (2026-07-10 tree) | 3 |
| Evidence durability | 2 (fails if results gone) |
| Buyer focus | 4 |
| Research linkage | 4 |
| Expert integration | 4 |
| **Overall** | **4.0 as plan text; 2.0 as currently re-provable system** |

---

## 12 Brainstorm: raised bar for product truth (not process)

### 12.1 Beyond checklist inventory

Raised product truth answers:

1. **First unaided hard stop** with reproduction steps  
2. **Document model truth** — entity types, units mm, rotation degrees  
3. **Selection model truth** — one store, what is pickable  
4. **Persistence truth** — store names, flush events, claim path  
5. **Export truth** — what TopBar actually exports vs BOQ helpers  
6. **Catalog truth** — static vs managed vs modular  
7. **Authority truth** — Block2D canvas vs SVG publish  
8. **Host truth** — guest gates vs pilot  
9. **Label corpus** — every user-visible save/tool string audited  
10. **Non-goals explicit** — photoreal, multiplayer, Fabric walls not missing-W  

### 12.2 Buyer-demo script as truth instrument

A raised bar inventory includes a **manual 15-minute script** (not automated yet) with pass/fail observations — even if P01 forbids implementing Playwright. Observation notes go in INVENTORY appendix.

### 12.3 Contradiction budget

Raised bar: zero **P0 docs-overclaim** left unmarked. P1 allowed if ticketed.

### 12.4 Truth about “PASS”

Raised bar language:

| Phrase | Allowed when |
|--------|--------------|
| Gate PASS | Map green artifacts |
| Product usable | Buyer script pass without agent |
| Ship | Owner + commercial criteria |
| Spine green | Unit/CLI only |

### 12.5 Systems catalog truth (6-month)

Inventory should state whether place path can host **size grid × shape × modules** or only cabinet-v0 demo SKU — without building systems.

### 12.6 India BOQ wedge truth

Register whether buyer can leave with INR+GST document from open3d today. Research says strategic peak not productized.

### 12.7 Performance truth (light)

Not a W gate, but buyer truth: does mid-laptop lag kill orbit/place? Optional note.

### 12.8 Mobile truth

IKEA honesty pattern: declare desktop-required if true. Inventory device claims.

### 12.9 Security/auth truth

Guest IDB vs member; no secrets in claims.

### 12.10 The single raised-bar artifact

Add (conceptually) `BUYER-HARD-STOP.md`:

```markdown
# Buyer hard stop
1. URL opened:
2. First success:
3. First failure:
4. Gate:
5. Code pointer:
6. Evidence pointer:
```

This is product truth, not process ceremony.

---

## 13 Approaches A/B/C for how to inventory better

### 13.1 Approach A — Journey-first inventory (recommended; matches product Approach A)

**Method:** Walk the buyer loop as the outline of INVENTORY.md. For each step, fill code/unit/browser/docs columns. Greps serve the journey, not the reverse.

| Pros | Cons |
|------|------|
| Aligns with Approach A product strategy | May under-index rare tools |
| Buyer paragraph natural | Needs discipline to still fill all W rows |
| Best myth detection | Temptation to “try to fix” mid-walk |

**When:** Default for re-open CP-01.

### 13.2 Approach B — Engine/stack-first inventory

**Method:** Freeze engines, packages, archives, flags first; journey second.

| Pros | Cons |
|------|------|
| Best for P02 handoff | Can miss buyer lies |
| Prevents hybrid thrash | Feels like architecture review not product truth |

**When:** If engine thrash is active fire; still do Approach A section for buyer paragraph.

### 13.3 Approach C — Claims-first inventory

**Method:** Start from CLAIMS-REGISTER corpus (ayushdocs, WAVE, README); only then code.

| Pros | Cons |
|------|------|
| Excellent CONTRADICTIONS.md | Stale corpus can miss silent code features |
| Doc hygiene | Heavy reading before greps |

**When:** After big docs rewrite or owner distrust of docs.

### 13.4 Hybrid recommendation

**Primary A, with B freeze appendix, with C claims pass.** Order:

1. Task 01–02 hosts/engines (B core)  
2. Task 03 journey-ordered gates (A)  
3. Task 04 claims corpus (C)  
4. Task 05–07 synthesize  

Matches revised plan task order closely.

### 13.5 Parallel agent split (inventory better)

| Agent | Owns |
|-------|------|
| A1 | file lists + key-files |
| A2 | routes + fabric redirect |
| A3 | W1–W4 greps + notes |
| A4 | W5–W8 greps + notes |
| A5 | claims concat + register draft |
| A6 | unit/e2e/results coverage + smoke |
| Merger | INVENTORY, CONTRADICTIONS, matrix, run.json |

### 13.6 Tooling improvements (optional)

- Single PowerShell orchestrator script checked into repo (plan-only idea)  
- Schema validate run.json  
- Diff claims register against previous CP-01 if re-run  

### 13.7 Anti-approach

| Anti | Why bad |
|------|---------|
| Chat-only inventory | No artifacts |
| Research-score inventory | Not code |
| Screenshot-only | Misses redirects/flags |
| Full browser journey in P01 | Scope creep to P07 |

---

## 14 Recommended sequence of real work after P01

### 14.1 Immediate (if evidence missing)

1. **Locate evidence:** local `results/`, else `E:\OandO-backups\trustdata-2026-07-10\`, else re-run P01 Tasks 00–07.  
2. **Do not start product features** until INVENTORY + CONTRADICTIONS exist on disk.  
3. Update scoreboard language if artifacts restored vs recreated.

### 14.2 Canonical kill order (when CP-01 green)

| Order | Work | Folder |
|------:|------|--------|
| 1 | P02 engine lock | `01-engine-lock/` |
| 2 | P03 W3 unit+browser | `03-select-delete/` |
| 3 | P07 W1–W2 journey | `02-browser-open3d-journey/` |
| 4 | P06 W5–W6 | `06-save-honesty/` |
| 5 | P04 W4 | `04-orbit-continuity/` |
| 6 | P05 W2 symbols | `05-symbols-svg/` |
| 7 | P08 W7 | `08-mesh-quality/` |
| 8 | P09 W8 | `09-shortcuts-chrome/` |
| 9 | P10 pack + E: | `10-handover/` |

### 14.3 Parallel fill rule

After CP-02, side agents may fill 5–8 only if scarce slots prefer spine 2–4 first (kill order 3–5 before 7–9 in week-1 language).

### 14.4 Product slices after world-standard wave (beyond P01–P10)

From product context + research (not inventing new program without owner):

1. Systems family configurator (size/shape/modules) at scale  
2. Cloud member save (after local honesty)  
3. BOQ-first export UI productization  
4. Fabric full stage cutover **after** W green  
5. Templates / empty triad for ease  
6. Measure suite depth (RoomSketcher-class) later  

### 14.5 Explicit non-next

- Photoreal race  
- Multiplayer CRDT  
- Re-scrape Planner5D  
- Konva hybrid  
- R3F rewrite of ThreeViewerInner mid-gate  
- Dimension→D  

### 14.6 Handoff packet P01 → P02 (must contain)

1. Live 2D = Feasibility; Fabric dest/flag/redirect facts  
2. Orbit code location + contradiction row  
3. Do-not-thrash list  
4. Link to ENGINE-DECISION  
5. HEAD of inventory run  

### 14.7 Handoff packet P01 → P03

1. Select/delete code-partial details  
2. Unit test list  
3. Fabric flag OFF requirement  

### 14.8 If gates already paper-PASS (per 00-PENDING)

Then real work is **product residuals**, not re-ceremony:

- Mesh raise beyond bar  
- Cloud save if owner wants  
- Priced BOQ product  
- Openings/wall cascade browser  
- next build /contact  
- Global-standard revision modules (SESSION-RECAP)  

But **only after** evidence tree is visible and dual-state honesty held.

---

## 15 Appendix: full path index of files consulted

### 15.1 Fully read (content)

```
D:\OandO07072026\Plans\phases\P01-product-truth\P01-product-truth.md
D:\OandO07072026\Plans\phases\P01-product-truth\P01-suggestions.md
D:\OandO07072026\Plans\phases\P01-product-truth\README.md
D:\OandO07072026\Plans\phases\EXPERT-PASS.md
D:\OandO07072026\Plans\phases\README.md
D:\OandO07072026\Plans\INDEX.md
D:\OandO07072026\Plans\README.md
D:\OandO07072026\Plans\Research\RESEARCH-MAP.md
D:\OandO07072026\Plans\Research\RESULTS-MAP.md
D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE.md
D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE-2.md
D:\OandO07072026\Plans\Research\STRUCTURE-REWRITE-NOTE.md
D:\OandO07072026\Plans\Research\Others\README.md
D:\OandO07072026\Plans\Research\Others\00-PENDING.md
D:\OandO07072026\Plans\Research\Others\01-RECAP.md
D:\OandO07072026\Plans\Research\Others\04-HONEST-QUALITY.md
D:\OandO07072026\Plans\Research\Others\08-EVIDENCE-INDEX.md
D:\OandO07072026\Plans\Research\Others\18-PRODUCT-CONTEXT.md
D:\OandO07072026\Plans\Research\Others\19-GOALS-SLICES.md
D:\OandO07072026\Plans\Research\Others\SESSION-RECAP.md
D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md
D:\OandO07072026\Idiots\README.md
D:\websites\README.md
D:\websites\PACKAGE_AND_GIT_INVENTORY.md (partial)
D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md
D:\websites\research\2026-07-09-world-standard\FIRECRAWL-GAPS.md
D:\websites\research\2026-07-09-world-standard\comparison\README.md
D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md
D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md
D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md
D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\REPORT.md
D:\websites\research\2026-07-09-world-standard\comparison\03-inventory\REPORT.md
D:\websites\research\2026-07-09-world-standard\comparison\04-ease\REPORT.md
D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\REPORT.md
D:\websites\research\2026-07-09-world-standard\comparison\06-export-boq\REPORT.md
D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md
D:\websites\planner5d.com\report\INSPIRATION_REPORT.md
D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md
D:\websites\planner5d.com\report\TOOLBARS.md
D:\websites\planner5d.com\report\PACKAGES_INSPIRATION.md
D:\websites\planner5d.com\report\DEEP_STACK_AND_PACKAGES.md
D:\websites\roomsketcher.com\report\INSPIRATION.md
D:\websites\floorplanner.com\report\INSPIRATION.md
D:\websites\homestyler.com\report\INSPIRATION.md
D:\websites\ikea.com\planner-public\report\INSPIRATION.md
D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md
D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md
D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md
D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-synthesis.md
D:\websites\roomsketcher.com\raw\help.roomsketcher.com-hc-en-us-articles-360000808925-How-Do-I-Add-Doors-to-My-Project.md
D:\websites\planner5d.com\raw\planner5d.com-editor.md
D:\websites\floorplanner.com\raw\cdn.floorplanner.com-static-brochures-FloorplannerManualEN.pdf.md (TOC + sections sampled)
D:\websites\ikea.com\planner-public\raw\ikea.com-us-en-planners.md
D:\websites\homestyler.com\raw\homestyler.com-forum-view-1613229904600383490.md (login pollution sample)
D:\.grok\installed-plugins\superpowers-21e2a56d\skills\using-superpowers\SKILL.md
D:\.grok\installed-plugins\superpowers-21e2a56d\skills\brainstorming\SKILL.md
```

### 15.2 Directory-inventoried (not full content)

```
D:\websites\planner5d.com\raw\** (incl. deep/bundles noted bulk)
D:\websites\roomsketcher.com\raw\**
D:\websites\floorplanner.com\raw\**
D:\websites\homestyler.com\raw\**
D:\websites\ikea.com\planner-public\raw\**
D:\websites\3dplanner.com\raw\**
D:\websites\oando-render-options\raw\ui-only\**
D:\websites\research\oem-systems\**
D:\websites\research\2026-07-09-world-standard\firecrawl-wave2\**
D:\websites\research\from-repo-Plans-Research\** (siblings of synthesis)
D:\OandO07072026\Plans\phases\P02–P10\** (names only)
D:\OandO07072026\Idiots\P0*\**
D:\OandO07072026\Plans\Research\Others\** (remaining docs not all deep-read: 02,03,05–07,09–17,20)
```

### 15.3 Attempted open — not present

```
D:\OandO07072026\results\ (missing)
D:\OandO07072026\results\planner\world-standard-wave\WAVE.md
D:\OandO07072026\results\planner\world-standard-wave\00-product-truth\INVENTORY.md
```

### 15.4 Bulk not read (correctly labeled bulk)

- Minified `app.js` / `fastboot.js`  
- Large map.json SEO dumps  
- PDF binary (only md conversion used)  
- PNG reference captures as pixels (listed)  
- All SCORES.csv numeric dumps (reports carry narrative scores)

---

## 16 Appendix: long-form notes / quotes from research

### 16.1 Design north star (verbatim essence)

Facilities buyer, unaided, small office, real O&O-scale furniture, 2D↔3D with orbit, select/edit/delete, save and return, trust for later quote.

### 16.2 Approach A pros/cons (design)

Ship on Feasibility now; temporary dual-engine debt; must not abandon Fabric decision.

### 16.3 ENGINE-DECISION table (verbatim structure)

- 2D Fabric.js v7 full stage destination  
- FeasibilityCanvas bridge  
- Three + R3F  
- model-viewer admin  
- No Konva+Fabric hybrid  
- Block2D + SVG pipeline  
- modular-cabinet-v0 bar  
- Manufacturer SKU first  
- Non-goals: photoreal 4K, multiplayer CRDT, LiDAR/AR  

### 16.4 MASTER-CHART O&O ~2.0 overall (research)

Spine only — not ship.

### 16.5 Realtime honesty rules (05 report)

1. Failed persistence never shows Saved  
2. Guest claim must not overwrite non-empty member snapshot  
3. Do not market multi-device until cloud round-trip live  
Never green Saved for React state only.

### 16.6 Export/BOQ success sentence (06 report)

> “I placed O&O products → I downloaded an INR + GST BOQ PDF my accounts team trusts → I sent a quote request without retyping SKUs.”

### 16.7 O&O self top 5 deficits (07 report)

1. Unaided journey missing  
2. 2D engine not production tooling  
3. Mesh + symbols below manufacturer bar  
4. Save honesty + continuity  
5. Quote/BOQ not wired as wedge  

### 16.8 Ease empty triad (04 report)

```
[ Start from template ]  [ Draw a room ]  [ Import plan ]
```

### 16.9 Chrome zone pattern (02 report)

Top · Left tools · Canvas · Right catalog/props · Bottom status.

### 16.10 Ethics rule of thumb (P5D ethics)

If reasonable person says rebuilt the idea with own work → OK.  
If they took implementation or look → stop.

### 16.11 RoomSketcher door place (raw)

Select door → click wall; length ≤ wall; Flip Door or Q; properties on right; trash delete.

### 16.12 IKEA mobile caveat (raw)

Kitchen planner not compatible with mobile devices — honesty pattern.

### 16.13 3dplanner verdict

Domain for sale ~$8295; zero product inspiration.

### 16.14 SVG three paths (oando-render-options)

A inventory SVG DOM · B canvas Path2D footprint · C publish pipeline — must not conflate.

### 16.15 Product context money

~$40k + $10k/yr vendor alternative vs ~$1–1.5k/mo own stack.

### 16.16 EXPERT-PASS false-reverse risks

1. Furniture rotation → radians  
2. Fabric full-stage / flag-ON for W3  
3. Port to R3F mid-gate  
4. Unit-only W3 / seed walls as W1  
5. Orbit default-only / bare Saved as cloud / multi-history delete / Dimension→D  

### 16.17 Structure KEEP reasons

Gate ownership sound; multi-file phase split multiplies thrash; recovery-style 04a–f rejected.

### 16.18 P01 expert P0 must-fix (historical plan bugs)

INVENTORY+CONTRADICTIONS; Fabric truth; dual host; required smoke; key-files complete.

### 16.19 Planner5D hiring stack signal (deep pack)

TS, Canvas/SVG, Three.js/WebGL, Webpack, Jest — inspiration for open packages, not their code.

### 16.20 Floorplanner multi-select priority rule (inspiration report)

If furniture inside marquee, furniture wins; walls only if no furniture.

### 16.21 Homestyler scrape honesty

Support URL Taobao wall; keyboard SEO fluff; forum tutorials best signal; login modal pollution.

### 16.22 Save scores O&O (05)

Autosave 3, cloud 1, multi-device 1, multiplayer 1, offline 4, export 2.

### 16.23 Inventory SKU O&O (03)

sku_mm strategic 5; search/categories/drag partial 2–3.

### 16.24 WAVE as research input

Starting debt narrative — not W pass; not code truth without path:line.

---

## 17 Appendix: open risks and non-claims

### 17.1 Open risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| results/ missing from checkout | Cannot re-prove CP-01 | Restore E: or re-run inventory |
| Scoreboard false confidence | Product ship lie | Dual-state language |
| Engine thrash mid residual work | Lost weeks | P02 freeze after truth |
| Degrees/radians reverse | Mass rewrite | Expert lock |
| Cloud label lie residual | Buyer trust | W6 tests |
| Mesh still boxy after W7 PASS | Commercial rejection | Raise bar post-wave |
| Path fossils Plans/trustdata | Agent opens wrong files | INDEX live tree |
| Firecrawl temptation | Ethics + waste | Dead by default |
| Parallel writers on open3d | Merge hell | One package owner |
| Global-standard revision vs trustdata wave | Dual programs | SESSION-RECAP + PENDING clarity |

### 17.2 Non-claims (this report does NOT claim)

1. That CP-01 is currently green on disk in this checkout.  
2. That any W1–W8 is browser-green from live artifacts here.  
3. That competitor products were reverse-engineered beyond public packs.  
4. That 3dplanner.com is a floor planner product.  
5. That Homestyler full shortcut table is known.  
6. That IKEA in-tool SKU mechanics were observed.  
7. That Planner5D production stack is confirmed beyond hiring/CDN signals.  
8. That O&O open3d source was re-grepped this session.  
9. That Fabric full stage is live.  
10. That cloud save works.  
11. That product is ship-ready.  
12. That research scores are current live scores.  
13. That E: backup contents were verified (only cited by PENDING).  
14. That re-scrape is needed.  
15. That any competitor assets should enter `site/`.  

### 17.3 Claims this report **does** make

1. P01 plan intent is inventory claims-vs-code for W1–W8 baseline.  
2. RESULTS-MAP minimum is INVENTORY + CONTRADICTIONS under `00-product-truth/`.  
3. Research packs under `D:\websites` are ideas only.  
4. Competitive JTBD bank maps cleanly to W gates.  
5. Major myths: Fabric live, WAVE=code, unit=browser, PASS=ship.  
6. Evidence tree absence here is a first-class product-truth problem.  
7. Approach A inventory method is recommended for re-open.  
8. Kill order after green truth remains P02→P03→P07→P06→fill→P10.  
9. Expert false-reverse list is binding for later phases.  
10. SVG triple-path is required honesty for symbols claims.  

### 17.4 Recommended owner questions (optional)

1. Is `results/` intentionally pruned from this clone?  
2. Should CP-01 reopen until artifacts restore?  
3. Is dual program (global-standard-revision modules) superseding trustdata wave evidence paths?  
4. Is cloud save next after residuals, or systems catalog?  

### 17.5 Agent handoff note for Agent 02 (engine lock brainstormer)

Read this report §3.5, §6 Fabric/orbit, §14.6 freeze list; do not treat research ENGINE-DECISION as executed lock without `01-engine-lock/` evidence.

### 17.6 Closing statement

**Product truth is the refusal to confuse stories with systems.** P01 exists to force path:line, matrix tokens, and contradiction tables before the monorepo spends another week “almost shipping.” Research shows the industry jobs. Design shows the gates. Plan shows the inventory machine. This checkout currently **cannot show the inventory artifacts** — which means the first product-truth fact as of this brainstorm is:

> **We cannot re-prove product truth from evidence on disk here; status docs claim PASS; those claims are unverified in this environment.**

That sentence is the highest-value P01 outcome until `00-product-truth/INVENTORY.md` is restored or recreated.

---

## End matter

| Item | Value |
|------|--------|
| Report file | `D:\OandO07072026\Idiots\P01-product-truth\REPORT.md` |
| Agent | Brainstormer 01/10 |
| Date | 2026-07-10 |
| Product code changed | **None** |
| Git push | **None** |
| Next | Owner/head restores evidence or re-runs P01 inventory; P02 brainstormer may proceed on engine decision literature with caution |

*End of P01 Brainstormer Report — Product Truth.*
