# RESEARCH-MAP — index (`D:\websites` only)

**Licenses / no competitor assets (hard):** `AGENTS.md` + `ayushdocs/17-LICENSES-CLEARED.md`  
**Research home:** `D:\websites` (`D:\websites\README.md`) — not in monorepo, not E: mirror  
**Research ≠ W-gate pass:** evidence → [04-EVIDENCE-MAP.md](./04-EVIDENCE-MAP.md)
**Secrets:** `.env.local` only  

**Program:** trust-data planner · pack date 2026-07-09  
**Wave honesty:** `results/planner/world-standard-wave/WAVE.md`  
**Design:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`

---

## How to use this map

1. Open the **report** first (ideas distilled).  
2. Open **raw** only when a pattern needs a primary source quote.  
3. Translate to **O&O original** implementation (Phosphor, CSS modules, O&O SKUs).  
4. Never import files from these trees into `site/`.  
5. Do **not** re-scrape Planner5D or 3dplanner by default — packs already deep.  
6. Before claiming a gate: open [04-EVIDENCE-MAP.md](./04-EVIDENCE-MAP.md) and the owning phase under `phases/`. Research folders are **not** evidence folders.

---

## Pack index

| Pack | Root | Report (start here) | Raw / deep | Ideas to steal (patterns only) | Explicit non-copy |
|------|------|---------------------|------------|--------------------------------|-------------------|
| **Planner5D** | `D:\websites\planner5d.com\` | `report\INSPIRATION_REPORT.md`, `TOOLBARS.md`, `PACKAGES_INSPIRATION.md`, `DEEP_STACK_AND_PACKAGES.md`, `ETHICS_AND_INSPIRATION.md` | `raw\` (home, pricing, editor, business, AI pages); `raw\editor\`; `raw\deep\` (bundles noted for stack study — **do not ship**); `report\toolbar-mock\index.html` (layout study only) | Loop: structure → furnish catalog → 2D\|3D → save/share; chrome regions (top / left tools / center canvas / right catalog); guest zero-friction then claim; collaboration as later depth; package stack **ideas** for open alternatives | No app.js/fastboot.js reuse; no editor HTML/CSS clone; no brand; no GLB; ethics file is binding |
| **RoomSketcher** | `D:\websites\roomsketcher.com\` | `report\INSPIRATION.md` | `raw\` features, floor-plans, measurements, help toolbar/doors/tape-measure articles; `search-help.json` | Measurement rigor; pro measurement features as **jobs**; toolbar button grouping patterns; door add help mental model | No help-center copy-paste into product strings as scraped; no screenshots in app |
| **Floorplanner** | `D:\websites\floorplanner.com\` | `report\INSPIRATION.md` | `raw\` features, pricing, home; manuals (EN PDF→md); support + updates feeds; `search-help.json` | Editor manual information architecture; feature ladder vs pricing honesty; B2B brochure-style capability lists as **checklist fuel** for our W gates | No manual text dump as our docs; no asset CDN URLs embedded in product |
| **Homestyler** | `D:\websites\homestyler.com\` | `report\INSPIRATION.md` | `raw\` interior design software, floor planner, help/support, forum threads, keyboard shortcuts article; `search-help.json` | Ease-of-start patterns; keyboard shortcut **discoverability** (build our own map — drives W8 honesty); community/forum as support pattern not product scope now | No photoreal arms race as W1–W8 goal; no material library theft |
| **IKEA planners (public)** | `D:\websites\ikea.com\planner-public\` | `report\INSPIRATION.md` | `raw\` planners hub, kitchen planner, PAX planner, planning services pages | **Manufacturer SKU catalog as product**; guided product-first planning; services around planning; quote/list path > freeform art | No IKEA brand, product names, or imagery in O&O; translate to **O&O SKUs only** |
| **3dplanner.com** | `D:\websites\3dplanner.com\` | `report\INSPIRATION_REPORT.md` | `raw\` home, pricing, en, interact/search JSON | Secondary benchmark only; park deep investment | Do not prioritize scrape expansion; parked per SYNTHESIS |
| **World-standard comparison** | `D:\websites\research\2026-07-09-world-standard\` | `SYNTHESIS.md`; `comparison\MASTER-CHART.md`; `comparison\ENGINE-DECISION.md`; `comparison\README.md` | Per-slice: `comparison\01-engine` … `07-oando-self` (`REPORT.md` + `SCORES.csv` each); `FIRECRAWL-GAPS.md`; `firecrawl-wave2\agent-a-roomsketcher\raw\`; `firecrawl-wave2\agent-b-homestyler-floorplanner\raw\` (**thin/empty optional** — prefer SYNTHESIS + slice reports) | Scored gaps: engine, toolbar, inventory, ease, realtime/save, export/BOQ, O&O self-score; **engine lock** proposal (Fabric dest, Feasibility interim, R3F+orbit, SKU catalog, BOQ>photoreal) | Scores are decision aids, not license to clone winners’ UX pixels; scores are **not** live product truth |
| **O&O render options (UI inventory)** | `D:\websites\oando-render-options\` | `report\CANVAS_INVENTORY_UI_SVG.md`; pack-root `CANVAS_RENDER_OPTIONS.md` | `raw\ui-only\` p5d-editor/home JSON+PNG (reference captures) | Canvas/SVG inventory vocabulary for **our** pipeline discussions | Treat PNG/JSON as research captures — not product assets |
| **Repo Research (Plans)** | `D:\OandO07072026\Plans\Research\` | `RESEARCH-2026-07-05-synthesis.md` and dated package/UI compare notes | Same folder `RESEARCH-2026-07-05-*.md` | Earlier package/UI benchmarks; reconcile with 2026-07-09 ENGINE-DECISION when conflict — **2026-07-09 world-standard wins** for this program | Historical; do not revive discarded hybrids |
| **Repo wave chart copy** | `D:\OandO07072026\results\planner\world-standard-wave\` | `COMPARISON-CHART.md`, `WAVE.md` | Points at websites comparison pack | Execution-facing summary for agents in-repo | Keep in sync when ENGINE-DECISION owner-approved; WAVE is starting debt, **not** a W pass |

---

## Phase → research pack routing (ideas only)

Open the pack **report** before inventing UX for that stream. Implement only in `site/` with tests + [evidence map](./04-EVIDENCE-MAP.md) evidence.

| Phase / gate | Open first (ideas) | Then translate to O&O | Evidence lands in (not research) |
|--------------|--------------------|----------------------|----------------------------------|
| CP-00 / W0 | This map + ETHICS_AND_INSPIRATION + 00-START | Approach A/B/C + ethics ack | `00-start/` (optional NOTES) |
| P01 baseline | WAVE.md + SYNTHESIS + COMPARISON-CHART | Inventory **code** vs claims; research is one input | `00-product-truth/` |
| P02 engine | `comparison\ENGINE-DECISION.md`, `01-engine\REPORT.md` | Checkbox lock; no thrash | `01-engine-lock/` |
| P03 / W3 | P5D loop (select/edit objects as **job**); Floorplanner checklist fuel | Hit-test + Delete + undo on **our** canvas | `03-select-delete/` |
| P04 / W4 | Instant 2D↔3D pattern (SYNTHESIS) | Same UUIDs + orbit ON proof | `04-orbit-continuity/` |
| P05 / W2 symbols | oando-render-options canvas/SVG vocab; P5D catalog quality as **bar idea** | Block2D + O&O pipeline honesty | `05-symbols-svg/` |
| P06 / W5–W6 | Realtime/save slice + Floorplanner save patterns | IDB flush + honest labels | `06-save-honesty/` |
| P07 / W1–W2 browser | P5D loop + Homestyler ease-of-start | Playwright draw→place on open3d/guest | `02-browser-open3d-journey/` |
| P08 / W7 | IKEA manufacturer-depth idea; mesh bar not photoreal | modular cabinet-v0 readable parts | `08-mesh-quality/` |
| P09 / W8 | Homestyler keyboard discoverability; P5D TOOLBARS regions | **Our** keymap must match handlers; blocking chrome only | `09-shortcuts-chrome/` |
| P10 pack | — (no new competitive research required) | Evidence index + E: backup | `10-handover/` |

---

## Pattern library → O&O translation (binding summary)

From `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` and WAVE.md:

| Industry pattern | O&O translation (original work) | Trustdata phase / gate |
|------------------|---------------------------------|------------------------|
| 2D structure then decorate | Walls/openings tools first; inventory second | P07 / W1 then W2 |
| Instant 2D↔3D | Same document UUIDs; browser proof; orbit in 3D | P04 / W4 |
| Drag catalog furniture | Inventory drag or double-click place + snap | P07 / W2 |
| Select + transform objects | Hit-test furniture/openings; Delete wired; Fabric full stage later | P03 / W3; Fabric = P02 lock destination |
| Save that returns | IDB + flush-on-exit; honest local vs cloud labels | P06 / W5–W6 |
| Catalog is the product | Real O&O SKUs + Block2D + modular mesh quality | P05 + P08 / W2 + W7 |
| BOQ / quote differentiator | Keep India BOQ/GST path as wedge; not photoreal first | Engine decision; post-W polish for deep BOQ UX |
| Chrome layout | Top bar · left tools · center canvas · right catalog/props · status — **re-implemented** | P09 only where labels/tools block W |
| Guest zero-friction | Guest planner path then claim — do not block W proof on auth | W1 proof allows guest route |
| Measurement rigor (RoomSketcher-class idea) | Honest dimensions later; do not fake precision in UI | Out of W1–W8 core unless blocking |
| Keyboard discoverability (Homestyler-class idea) | **Our** shortcut map must match handlers | P09 / W8 |
| Manufacturer depth (IKEA-class idea) | cabinet-v0 modular bar + SKU truth | P08 / W7 |

---

## Engine decision (from comparison pack)

Source: `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`

| Layer | Decision |
|-------|----------|
| 2D destination | Fabric.js v7 full stage |
| 2D interim | FeasibilityCanvas until walls/tools on Fabric |
| 3D | Three + `@react-three/fiber` + orbit ON |
| Admin single asset | model-viewer (keep) |
| Hybrid ban | No Konva + Fabric simultaneous interactive |
| Symbols | Block2D canvas + SVG pipeline (O&O), not competitor SVG |
| Mesh bar first | modular-cabinet-v0 |
| Catalog | Manufacturer SKU first |
| Non-goals now | Photoreal 4K, multiplayer CRDT, LiDAR/AR |

Owner must checkbox-confirm in `Plans/trustdata/00-START.md` (CP-02). Evidence of lock: `results/planner/world-standard-wave/01-engine-lock/` (not a research path).

---

## Slice scores (research snapshot — not live product truth)

**Dated:** 2026-07-09 research synthesis.  
Repo copy: `results/planner/world-standard-wave/COMPARISON-CHART.md`  
Full: `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`

Re-verify against **code + browser** in P01. Do not treat WAVE.md blockers (e.g. “no orbit”) as code-truth without file proof — inventory may find docs/code drift.

| Slice | Research “who wins” (pattern leader) | O&O score (research) | Response in trustdata |
|-------|--------------------------------------|----------------------|------------------------|
| Engine 2D | RoomSketcher-class structure rigor | 2 | Feasibility now; Fabric destination |
| Engine 3D | Homestyler/Foyr/P5D-class presence | 2 | R3F + orbit (W4) |
| Toolbar | Planner5D-class completeness | 2 | Labels truth W8; no clone |
| Inventory UX | P5D/Floorplanner-class | 2 | Place journey W2 |
| Inventory SKU | **IKEA-class** | 3 pot / 2 UX | O&O SKUs + cabinet-v0 |
| Ease | Planner5D-class | 2 | Journey Playwright W1–W2 |
| Realtime/save | P5D/Floorplanner-class | 2 | W5–W6 honesty |
| BOQ/quote | **IKEA-class** | 2 | Keep as wedge after W |
| Mesh | Homestyler/Foyr-class | 1 | W7 modular bar (not photoreal) |

---

## Firecrawl / scrape policy

| Action | Status |
|--------|--------|
| Re-scrape planner5d.com | **No** by default (covered 2026-07-09; deep pack exists) |
| Re-scrape 3dplanner.com | **No** — parked |
| RoomSketcher / Homestyler / Floorplanner wave2 | Optional if `FIRECRAWL-GAPS.md` still blocks a decision; ideas only; wave2 raw dirs may be **thin** |
| IKEA public planner pages | Optional for catalog UX patterns; ideas only |
| Coohom / Foyr marketing | Only if owner needs B2B kitchen patterns later |
| CLI note | WAVE.md: `firecrawl` may be off PATH; use existing packs + web; re-enable MCP/CLI before new scrapes |

Gaps file: `D:\websites\research\2026-07-09-world-standard\FIRECRAWL-GAPS.md`

---

## Related inventories (not product)

| File | Path | Use |
|------|------|-----|
| Package/git inventory | `D:\websites\PACKAGE_AND_GIT_INVENTORY.md` | What exists on disk for research tooling |
| Git recovery inventory | `D:\websites\git-recovery-inventory.md` | Recovery only |
| GitHub 3-account inventory | `D:\websites\GITHUB_3ACCOUNT_INVENTORY.md` | Ops awareness |
| Salvage map | `D:\websites\SALVAGE_MAP.md` | Salvage routing — not W-gate proof |

---

## Anti-copy checklist (before any PR/commit that touched UI)

- [ ] No new binary from `D:\websites\**` under `site/public` or `site/features`.  
- [ ] No competitor CSS class names or copied SVG path blobs.  
- [ ] No “Planner5D-like” brand wording in customer UI.  
- [ ] Icons = Phosphor (Plan A).  
- [ ] Any new npm package has license recorded.  
- [ ] Screenshots in `results/` are of **O&O** app, not competitor sites (competitor shots stay in `D:\websites`).  
- [ ] No research path cited as sole proof of W1–W8 (evidence must be under world-standard-wave per RESULTS-MAP).

---

## Quick open order for a new agent

1. `Plans/trustdata/00-START.md` (ethics + approach)  
2. This file (research orientation — **ideas only**)  
3. `Plans/trustdata/RESULTS-MAP.md` (where proof must land)  
4. `Plans/trustdata/checkpoints/CHECKPOINTS.md` (stop-if-fail)  
5. `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`  
6. `comparison\ENGINE-DECISION.md`  
7. Pack report for the stream you own (see phase→pack routing)  
8. Owning `phases/P0X-<slug>/` execute card — implement in `site/` with tests + evidence — never by copying raw packs

---

## Related

| Doc | Role |
|-----|------|
| [02-PROGRAM-INDEX.md](./02-PROGRAM-INDEX.md) | Program index |
| [01-START-HERE.md](./01-START-HERE.md) | Ethics + approach + unlock |
| [04-EVIDENCE-MAP.md](./04-EVIDENCE-MAP.md) | Evidence folders (pass/fail) |
| [checkpoints/CHECKPOINTS.md](./checkpoints/CHECKPOINTS.md) | CP-00–CP-10 |
| [checklists/MASTER-CHECKLIST.md](./checklists/MASTER-CHECKLIST.md) | Owner checklist |
| [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md) | Subagent contract |
| [map review](./history/40-MAP-REVIEW.md) | This revision’s expert notes |
| `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` | Deep ethics |
| `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | W1–W8 definitions |

---

## Expert revision note — 2026-07-09

Applied `MAPS-suggestions.md` (M3, M6, M7, M8, M10, M11, M14): ideas-only ↔ evidence boundary; thin firecrawl-wave2 honesty; research scores labeled snapshot not live truth; oando-render-options root path fix; phase→pack routing; open order includes RESULTS-MAP + CHECKPOINTS; Related footer. **No product code.** Ethics remain inspiration-only.
