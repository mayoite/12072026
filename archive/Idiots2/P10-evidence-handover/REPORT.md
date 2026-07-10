# P10 — Evidence Handover — Exhaustive Brainstormer Report

**Role:** BRAINSTORMER 10/10 (Idiots2)  
**Phase:** P10 — Evidence pack + handover + E: backup  
**Output location (only):** `Idiots2/P10-evidence-handover/REPORT.md`  
**Mode:** **NO product code.** Documentation / honesty / map only.  
**Date of this inventory pass:** 2026-07-10  
**Checkout scanned:** `D:\OandO07072026` (main; no worktrees)  
**Research home scanned:** `D:\websites` (canonical competitive research; not in monorepo)

---

## 0. Executive truth (read this first)

### 0.1 What P10 is

| Claim | Truth |
|-------|--------|
| **P10 = product feature phase** | **FALSE.** P10 is **documentation + verification + backup + index**. |
| **P10 = ship W1–W8 by writing code** | **FALSE.** If a gate is red/missing, **reopen owning phase** (P03–P09). Never patch `site/` under P10. |
| **P10 green means “product works”** | **FALSE.** P10 green means: **evidence pack exists**, **MASTER/W-gate table is honest**, **E: backup logged**, **CP-10 criteria met**. Product quality is proven **only** by W folders under `results/planner/world-standard-wave/`. |
| **Research / SYNTHESIS / MASTER-CHART = W pass** | **FALSE.** Research is **ideas only**. See §2. |
| **ayushdocs P0-DONE notes = world-standard pass** | **FALSE.** Historical spine notes; not W1–W8 file-of-record. |
| **Gate ≠ product** | **TRUE.** Gates are **proof contracts**. Product is what buyers use. A green unit test is not a green buyer journey. |

### 0.2 Hard live finding this session (blocker for any “CP-10 PASS” claim)

| Check | Result (2026-07-10 this agent) |
|-------|--------------------------------|
| `D:\OandO07072026\results\` | **DOES NOT EXIST** |
| `D:\OandO07072026\results\planner\` | **DOES NOT EXIST** |
| `D:\OandO07072026\results\planner\world-standard-wave\` | **DOES NOT EXIST** |
| Any `10-handover/` six-file pack on disk | **MISSING** (target never created, or tree wiped) |
| `Plans/trustdata/` (historical plan root) | **REMOVED** (owner cleanup 2026-07-10; live plans under `Plans/`) |
| `Plans/**/CHECKPOINTS.md` | **NOT FOUND** in live tree |
| `Plans/**/MASTER-CHECKLIST.md` | **NOT FOUND** in live tree |

**Brutal implication:**  
P10 **cannot** be marked complete on this checkout **today**. There is **no evidence root** to index. Research packs under `D:\websites` are **healthy and large** — and still **not** W-gate proof. Plans under `Plans/phases/P10-*` and `Plans/Research/RESULTS-MAP.md` are **procedure authority**, not proof.

**User standing note confirmed:** `results/` may be gone → **confirmed gone** (entire `results/` tree absent from live workspace).

### 0.3 What this REPORT is for

Handover for the **next agent / owner** who must:

1. Understand **what research exists** vs **what evidence must exist**.  
2. Know the **canonical evidence folder lock** (RESULTS-MAP).  
3. Execute P10 **only after** W0–W8 (or WAIVE) artifacts exist **on disk**.  
4. Never confuse competitor SYNTHESIS scores with live product truth.  
5. Never invent product code under P10.

---

## 1. Order of work (this brainstorm pass) — how this file was built

Mandatory order from the brief:

| Step | What was opened | Status in this REPORT |
|------|-----------------|------------------------|
| **(1)** | `D:\websites` **first** — full inventory + “research is NOT evidence” + SYNTHESIS honesty + pack reports light | §2–§4 |
| **(2)** | `Plans\Research` entire, especially **RESULTS-MAP** | §5–§6 |
| **(3)** | `Plans\phases\P10-evidence-handover\` **ALL** | §7–§8 |
| Deliverable | Exhaustive `Idiots2\P10-evidence-handover\REPORT.md` | This file |

Also cross-read (supporting, not substitute for the three steps):

- `Plans/INDEX.md`, `Plans/README.md`  
- `Plans/phases/EXPERT-PASS.md`  
- `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`  
- `Failures.md` (root)  
- Live tree probes: `results/`, CHECKPOINTS, MASTER  

---

## 2. `D:\websites` — full inventory

### 2.1 Canonical rule (from `D:\websites\README.md`)

| Rule | Detail |
|------|--------|
| **Single research home** | `D:\websites` only |
| **Do not use** | `E:\websites` (not used); `site/.firecrawl` (ephemeral CLI cache); monorepo product tree for raw scrapes |
| **Ethics** | Inspiration / patterns only. No competitor code, assets, or brands into O&O product |
| **MIT/open packages** | Only after license check |
| **Backups** | No second full research home on E: or in monorepo. Product plan backups on E: are separate and do not include full Firecrawl packs by default |
| **Repo index** | Pointers live in `Plans/Research/RESEARCH-MAP.md` (live path after cleanup; older docs said `Plans/trustdata/RESEARCH-MAP.md`) |

### 2.2 Top-level layout (on disk 2026-07-10)

```
D:\websites\
├── README.md                          ← canonical research home declaration
├── SALVAGE_MAP.md                     ← local/remote salvage archaeology (NOT W-gate)
├── PACKAGE_AND_GIT_INVENTORY.md       ← package.json + .git scan across D/E/C (NOT W-gate)
├── git-recovery-inventory.md          ← recovery inventory (NOT W-gate)
├── GITHUB_3ACCOUNT_INVENTORY.md       ← multi-account GitHub map (NOT W-gate)
│
├── planner5d.com/                     ← DEEP competitive pack
│   ├── raw/                           ← home, pricing, editor, business, AI pages
│   │   ├── editor/                    ← editor scrape + support/blog
│   │   └── deep/                      ← bundles (app.js, fastboot.js) + jobs/stack — DO NOT SHIP
│   └── report/
│       ├── INSPIRATION_REPORT.md
│       ├── TOOLBARS.md
│       ├── PACKAGES_INSPIRATION.md
│       ├── DEEP_STACK_AND_PACKAGES.md
│       ├── ETHICS_AND_INSPIRATION.md   ← binding ethics
│       ├── toolbar-mock/index.html    ← layout study only
│       └── (related)
│
├── roomsketcher.com/
│   ├── raw/                           ← features, measurements, help articles
│   └── report/INSPIRATION.md
│
├── floorplanner.com/
│   ├── raw/                           ← features, pricing, manuals (PDF→md), support/updates
│   └── report/INSPIRATION.md
│
├── homestyler.com/
│   ├── raw/                           ← marketing + forum (best signal); support often polluted
│   └── report/INSPIRATION.md
│
├── ikea.com/planner-public/
│   ├── raw/                           ← planners hub, kitchen, PAX, services (some 404)
│   └── report/INSPIRATION.md
│
├── 3dplanner.com/                     ← SHALLOW / PARKED — domain for sale (HugeDomains)
│   ├── raw/
│   └── report/INSPIRATION_REPORT.md   ← verdict: SKIP for product inspiration
│
├── oando-render-options/              ← OUR canvas/render options notes (still research-side)
│   ├── CANVAS_RENDER_OPTIONS.md
│   ├── raw/ui-only/                   ← p5d-editor/home JSON+PNG captures
│   └── report/CANVAS_INVENTORY_UI_SVG.md
│
└── research/
    ├── 2026-07-09-world-standard/     ← comparison matrix + SYNTHESIS (primary program research)
    │   ├── SYNTHESIS.md
    │   ├── FIRECRAWL-GAPS.md
    │   ├── comparison/
    │   │   ├── README.md
    │   │   ├── MASTER-CHART.md
    │   │   ├── ENGINE-DECISION.md
    │   │   ├── 01-engine/ … 07-oando-self/  (REPORT.md + SCORES.csv each)
    │   └── firecrawl-wave2/
    │       ├── agent-a-roomsketcher/raw/     ← may be thin/empty
    │       └── agent-b-homestyler-floorplanner/raw/  ← may be thin/empty
    ├── from-repo-Plans-Research/      ← 2026-07-05 historical research (superseded where conflict)
    │   └── RESEARCH-2026-07-05-*.md
    ├── oem-systems/                   ← Steelcase / HON / Haworth / Featherlite marketing scrapes
    └── quick-2d-engine-search.json
```

### 2.3 Per-pack inventory detail

#### A. Planner5D (`D:\websites\planner5d.com\`)

| Zone | Contents | Handover use |
|------|----------|--------------|
| **report/** | Inspiration, toolbars zone map, packages, deep stack, **ethics** | Start here for ideas; ethics is binding |
| **raw/** | Marketing, pricing, business, collab, AI, editor strings | Quote only when pattern needs primary source |
| **raw/editor/** | Editor scrape log, FAQ/blog, support | Chrome zone ideas |
| **raw/deep/** | `app.js`, `fastboot.js`, job posts, stack searches | Stack **ideas only** — **never ship bundles** |
| **report/toolbar-mock/** | Local HTML mock of zones | Layout study — not product asset |

**Pattern takeaways (light — see reports for depth):**  
Structure → furnish → 2D|3D → save/share loop; top/left/canvas/right/status chrome; guest zero-friction then claim; collab as later depth.

**Explicit non-copy:** no app.js/fastboot reuse; no editor HTML/CSS clone; no brand; no GLB; ethics file binding.

#### B. RoomSketcher (`D:\websites\roomsketcher.com\`)

| Zone | Contents | Handover use |
|------|----------|--------------|
| **report/INSPIRATION.md** | Measure rigor, door place-on-wall, select/edit/delete grammar | Ideas for W3 / measurement later |
| **raw/** | Help articles (tape, doors), features, floor-plans | Strong for measure/place; thin for full toolbar |
| Failed slugs | Old `/en/articles/4140…` | 404 / template junk — do not retry |

**Honesty (from pack report):** No live app session; public help + marketing only.

#### C. Floorplanner (`D:\websites\floorplanner.com\`)

| Zone | Contents | Handover use |
|------|----------|--------------|
| **report/INSPIRATION.md** | Editor manual IA; sidebar+canvas; multi-select grammar | Checklist fuel for W gates |
| **raw/** | Manual PDF→md (working path under `static/brochures/`); pricing; updates | Manual = primary signal |
| Failed | `features` login wall; old PDF AccessDenied | Do not retry same URLs |

**Working PDF path (from FIRECRAWL-GAPS):**  
`cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf`

#### D. Homestyler (`D:\websites\homestyler.com\`)

| Zone | Contents | Handover use |
|------|----------|--------------|
| **report/INSPIRATION.md** | Zone map, catalog structure, few hotkeys, **scrape honesty table** | Keyboard discoverability **idea** for W8 — build **our** map |
| **raw/** | Forum tutorials (high signal); marketing (auth noise); support often **Taobao wall** | Filter noise |

**Honesty:** No authenticated editor scrape; keyboard SEO article near-zero for real keys; support HC may be wrong-region junk.

#### E. IKEA public planners (`D:\websites\ikea.com\planner-public\`)

| Zone | Contents | Handover use |
|------|----------|--------------|
| **report/INSPIRATION.md** | Product-first hub; kitchen/PAX system planners; services ladder | **Manufacturer SKU catalog as product** pattern → O&O SKUs only |
| **raw/** | Hub, kitchen, PAX, services (services detail may 404) | Marketing-level only |

**Non-copy:** No IKEA brand, product names, or imagery in O&O.

#### F. 3dplanner.com (`D:\websites\3dplanner.com\`)

| Verdict | Detail |
|---------|--------|
| **Product site?** | **No** — HugeDomains parking / domain for sale (~$8k listing) |
| **Inspiration value** | **None** for planner features |
| **Policy** | **Parked** — do not re-scrape; do not prioritize |

#### G. O&O render options (`D:\websites\oando-render-options\`)

| File | Role |
|------|------|
| `CANVAS_RENDER_OPTIONS.md` | Canvas2D vs SVG vs WebGL vs Fabric/Konva options for **our** stack |
| `report/CANVAS_INVENTORY_UI_SVG.md` | Canvas/SVG inventory vocabulary |
| `raw/ui-only/*` | Competitor UI captures (JSON/PNG) — research only |

Still **not** W-gate evidence. Use for P02/P05 **discussion**, prove decisions under `01-engine-lock/` / `05-symbols-svg/`.

#### H. World-standard research pack (`D:\websites\research\2026-07-09-world-standard\`)

| Path | Role |
|------|------|
| `SYNTHESIS.md` | Pattern library → O&O translation (binding summary for ideas) |
| `FIRECRAWL-GAPS.md` | What was scraped vs failed; product-next note (ship O&O, not re-scrape) |
| `comparison/MASTER-CHART.md` | Who wins each parameter + O&O self scores (research snapshot) |
| `comparison/ENGINE-DECISION.md` | Fabric dest · Feasibility interim · R3F · SKU · BOQ>photoreal (**PROPOSED** owner checkboxes) |
| `comparison/01-engine` … `07-oando-self` | Slice REPORT + SCORES.csv |
| `firecrawl-wave2/*` | Optional gap agents; raw may be **thin/empty** — prefer SYNTHESIS + main packs |

#### I. Historical repo research (`D:\websites\research\from-repo-Plans-Research\`)

| Files | Role |
|-------|------|
| `RESEARCH-2026-07-05-synthesis.md` + ui/packages compares | Earlier package/UI benchmarks |
| **Conflict rule** | **2026-07-09 world-standard wins** for this program |

#### J. OEM systems scrapes (`D:\websites\research\oem-systems\`)

Steelcase, HON, Haworth, Featherlite — marketing/product pages for **manufacturer catalog / systems furniture** ideas. Not W-gate proof. Not competitor editor UX.

#### K. Ops / salvage inventories (research tree, not product)

| File | Role | W-gate? |
|------|------|---------|
| `SALVAGE_MAP.md` | Local 6 git roots + 20 remotes salvage map; emotional/ops truth | **No** |
| `PACKAGE_AND_GIT_INVENTORY.md` | 56 package projects / 13 with git across D/E/C | **No** |
| `git-recovery-inventory.md` | Recovery | **No** |
| `GITHUB_3ACCOUNT_INVENTORY.md` | Multi-account ops | **No** |

### 2.4 Firecrawl / scrape policy (current)

| Action | Status |
|--------|--------|
| Re-scrape planner5d.com | **No** by default (deep pack exists) |
| Re-scrape 3dplanner.com | **No** — parked / domain sale |
| RoomSketcher / Homestyler / Floorplanner / IKEA public | **Done** enough for patterns (2026-07-09 gap session) |
| Coohom / Foyr / SmartDraw | Optional later; marketing only if needed |
| Firecrawl for active product phases | **Dead as routine** (`AGENTS.md`: Firecrawl dead; historical ideas only) |
| Competitor app editors / authenticated apps / bundles | **Out of scope** |

### 2.5 Ethics anti-copy checklist (before any PR that touched UI)

From RESEARCH-MAP + ETHICS_AND_INSPIRATION:

- [ ] No binary from `D:\websites\**` under `site/public` or `site/features`
- [ ] No competitor CSS class names or copied SVG path blobs
- [ ] No “Planner5D-like” brand wording in customer UI
- [ ] Icons = Phosphor (Plan A)
- [ ] New npm packages license-recorded
- [ ] Screenshots in `results/` are of **O&O** app only (competitor shots stay in `D:\websites`)
- [ ] No research path cited as **sole** proof of W1–W8

---

## 3. What research is **NOT** evidence (binding)

### 3.1 One-line rule

> **`D:\websites\**` = ideas.  
> **`results/planner/world-standard-wave/**` = W-gate file-of-record.  
> If the second tree is missing, **no gate is green** — full stop.

### 3.2 Forbidden claims matrix (research → false green)

| Claim people might make | Required proof | Research alone is… |
|-------------------------|----------------|--------------------|
| “Journey works” | `02-browser-open3d-journey/` Playwright + screenshots | SYNTHESIS loop description ≠ pass |
| “Select/delete works” | `03-select-delete/` unit **+** browser | RoomSketcher door delete grammar ≠ pass |
| “3D works” | `04-orbit-continuity/` pose + orbit ON + console clean | P5D “has 3D” marketing ≠ pass |
| “Symbols OK” | `05-symbols-svg/` + place PNGs | oando-render-options vocab ≠ pass |
| “Save works” | `06-save-honesty/` hard reload + honest labels | Floorplanner “cloud” claim ≠ pass |
| “Mesh OK” | `08-mesh-quality/` NOTES + visual toe/door/carcass | Homestyler photoreal ≠ bar; boxes unit ≠ W7 |
| “Shortcuts OK” | `09-shortcuts-chrome/` map matches handlers | Homestyler SEO shortcut article ≠ pass |
| “Wave complete” | `10-handover/` + MASTER tally + E: backup | WAVE.md narrative ≠ pass |
| “Engine locked” | `01-engine-lock/` + owner checkboxes | ENGINE-DECISION.md **PROPOSED** ≠ lock until recorded |
| “Product truth inventoried” | `00-product-truth/` INVENTORY + CONTRADICTIONS | MASTER-CHART O&O scores ≠ inventory of **code** |

### 3.3 Categories of non-evidence under `D:\websites`

| Category | Examples | Why not evidence |
|----------|----------|------------------|
| Competitor marketing claims | User counts, “10 minutes”, “4K renders” | Not our product; not measured on our app |
| Competitor help prose | RoomSketcher doors, Floorplanner manuals | Patterns only; our handlers may not exist |
| Scrape noise | Homestyler login chrome, Taobao support page, ad networks | Pollutes raw files |
| Deep JS bundles | `planner5d.com/raw/deep/app.js` | **Illegal / unethical** to ship; stack **ideas** only |
| Score CSVs / MASTER-CHART | O&O row ~2.0 | Research self-score snapshot 2026-07-09; must re-prove against code+browser in P01 |
| SYNTHESIS pattern table | “Instant 2D↔3D” | Translation target, not proof of orbit/continuity |
| OEM furniture marketing | Steelcase/HON | Catalog strategy ideas, not open3d journey |
| Salvage / git inventories | SALVAGE_MAP | Ops archaeology |
| 3dplanner.com parking page | Domain for sale | Zero product signal |
| `firecrawl-wave2` thin raw | Empty/partial agent dirs | Prefer main packs; do not invent content |
| Toolbar mock HTML | Local layout study | Not O&O screenshot proof |
| Historical 2026-07-05 research | plann/ package notes | Superseded on engine/wave conflicts by 2026-07-09 |

### 3.4 What research **is** allowed to do for P10

| Allowed | Forbidden |
|---------|-----------|
| Cite SYNTHESIS as **context** in handover narrative (“industry pattern we aimed at”) | Mark W-GATES.md PASS because SYNTHESIS said pattern X |
| Copy research pack to E: under `websites-research/` as **ideas backup** (MASTER B.4 recommended) | Cite E: research copy as W1–W8 proof |
| Point agents at pack reports before inventing UX (during P03–P09) | Re-scrape during P10 “to complete evidence” |
| Use ENGINE-DECISION as checklist for P02 lock record | Treat unchecked ENGINE-DECISION boxes as CP-02 green |

---

## 4. SYNTHESIS honesty + comparison pack (light for handover)

### 4.1 SYNTHESIS.md — what it actually claims

**Path:** `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`  
**Date:** 2026-07-09  
**Rule printed on the file:** Study patterns. Do not copy UI, assets, code, or brands.

**Sources it used (honesty):**

1. Existing Planner5D Firecrawl-era pack  
2. `E:\Goodsites\…\CAPABILITY-MATRIX.md`, `STRATEGIC-GAPS.md` (if still present on E:)  
3. Public web comparisons (marketing-level) RoomSketcher / Floorplanner / IKEA  
4. Live repo Plan A + explore agents on `D:\OandO07072026`  

**Pattern library → O&O translation (ideas only):**

| Industry pattern | O&O translation | Trustdata phase / gate (when proven) |
|------------------|-----------------|--------------------------------------|
| 2D structure then decorate | Walls/openings first; inventory second | P07 / W1 then W2 |
| Instant 2D↔3D | Same document UUIDs; orbit in 3D | P04 / W4 |
| Drag catalog furniture | Drag or double-click place + snap | P07 / W2 |
| Select + transform | Hit-test; Delete; Fabric full stage later | P03 / W3; Fabric = destination |
| Save that returns | IDB + flush; honest local vs cloud | P06 / W5–W6 |
| Catalog is the product | O&O SKUs + Block2D + modular mesh | P05 + P08 |
| BOQ/quote | Differentiator; not photoreal first | Engine decision; post-W polish |

**Honesty limits of SYNTHESIS:**

- It is a **decision aid**, not a measured run on current HEAD.  
- “Do not re-scrape” lines are **ops policy**, not product completion.  
- Optional scrapes listed later were largely **done** (see FIRECRAWL-GAPS) — still not evidence.  
- Anti-copy paragraph is binding ethics, not a gate checkbox alone.

### 4.2 MASTER-CHART — light scores (research snapshot only)

**Path:** `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`  
**Scale:** 1 broken · 3 OK · 5 class-leading  

**Who wins (pattern leaders) — not our green lights:**

| Parameter | Research #1 | O&O live (research) |
|-----------|-------------|---------------------|
| 2D engine / plan accuracy | RoomSketcher | 2 |
| 3D visualization | Homestyler / Foyr / P5D | 2 |
| 2D↔3D continuity | RoomSketcher / Floorplanner | 3 |
| Toolbar / chrome | Planner5D | 2 |
| Inventory place UX / SKU | P5D/Floorplanner UX · **IKEA SKU** | 2 |
| Ease / 10-min result | Planner5D | 2 |
| Realtime / cloud save | P5D / Floorplanner | 2 |
| Export pro 2D | RoomSketcher | 2 |
| BOQ / quote | **IKEA** | 2 |
| Mesh / symbol quality | Homestyler / Foyr | 1 |

**Product overall ~ (research):** RoomSketcher ~4.3 · Planner5D ~4.2 · Floorplanner ~4.0 · IKEA ~3.8 · Homestyler ~3.5 · **O&O ~2.0** (“spine only — not ship”).

### 4.3 O&O self-score honesty (`07-oando-self`)

**Path:** `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md`  
**CSV:** `SCORES.csv` → all dimensions 1–2; ease = **1**; average ≈ **1.9**

**Brutal self-assessment themes (2026-07-09 research day — must re-verify in P01 against code):**

1. Unaided product journey missing (ease / W1–W5)  
2. 2D = FeasibilityCanvas interim; Fabric flag OFF (not production tooling)  
3. Mesh/symbols below manufacturer bar (boxes; G8 partial)  
4. Save: IDB unit; cloud unwired; hard-reload proof open  
5. BOQ helpers exist; not first-class open3d buyer journey  

**Safe vs unsafe claims (from that report — still good handover discipline):**

| Safe | Unsafe |
|------|--------|
| Hard-path spine exists (SVG authority, modular place, crypto ids) | “Product done” |
| Three/R3F scene from document | Photoreal / good cabinetry mesh |
| Fabric installed + furniture flag spike | Fabric is live 2D product |
| IDB autosave unit continuity | Cloud save / proven reload UX |
| BOQ helpers in tree | Open3d BOQ export journey |

### 4.4 ENGINE-DECISION — proposed lock (not automatic CP-02)

**Path:** `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`  
**Status on file:** **PROPOSED — owner confirm**

| Layer | Decision |
|-------|----------|
| 2D destination | Fabric.js v7 full stage |
| 2D bridge | FeasibilityCanvas until walls/tools on Fabric |
| 3D | Three + `@react-three/fiber` (keep); orbit ON |
| Admin asset | model-viewer |
| Hybrid ban | No Konva + Fabric simultaneous interactive |
| Symbols | Block2D canvas + SVG pipeline (O&O) |
| Mesh bar first | modular-cabinet-v0 |
| Catalog | Manufacturer SKU first |
| Non-goals now | Photoreal 4K, multiplayer CRDT, LiDAR/AR |

**Owner checkboxes on ENGINE-DECISION (must also land in plan unlock / P02 evidence):**

- [ ] Approve Fabric + R3F lock  
- [ ] Approve IKEA-class catalog strategy  
- [ ] Approve BOQ > photoreal priority  
- [ ] Then implement W1–W8  

**Evidence of lock (when done):** `results/planner/world-standard-wave/01-engine-lock/` — **not** the research path.  
**Design authority:** Approach **A** locked in `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (Fabric remains destination **after** W1–W8).

### 4.5 Pack reports — light summary for handover (do not re-read everything)

| Pack report | One-line handover takeaway |
|-------------|----------------------------|
| P5D `INSPIRATION_REPORT.md` | Core loop template/structure/furnish/3D/export; freemium catalog; collab later |
| P5D `TOOLBARS.md` | Top · left tools · canvas · right catalog/props · status |
| P5D `ETHICS_AND_INSPIRATION.md` | Inspiration OK; code/assets/brand clone not OK |
| RoomSketcher `INSPIRATION.md` | Measure rigor; door click-on-wall; select→props→delete |
| Floorplanner `INSPIRATION.md` | Sidebar+canvas; selection-driven props; marquee multi-select grammar |
| Homestyler `INSPIRATION.md` | Zone map from forums; scrape noise high; shortcuts article weak |
| IKEA `INSPIRATION.md` | Product-system planners + room planners + services ladder; SKU truth pattern |
| 3dplanner `INSPIRATION_REPORT.md` | **Skip** — domain parking |
| oando `CANVAS_RENDER_OPTIONS.md` | Our A/B/C canvas failure modes: 2D vs WebGL vs hybrid |
| FIRECRAWL-GAPS.md | Gaps closed enough for patterns; **ship O&O** next |

### 4.6 Historical 2026-07-05 research (superseded where conflict)

**Path:** `D:\websites\research\from-repo-Plans-Research\`

- Validated older `plann/` UI direction; package hygiene notes.  
- **Do not revive** discarded hybrids against 2026-07-09 ENGINE-DECISION / Approach A.  
- When conflict: **world-standard 2026-07-09 wins**.

---

## 5. `Plans\Research` — entire tree catalog

### 5.1 Live tree (after owner cleanup 2026-07-10)

```
Plans/Research/
├── RESEARCH-MAP.md              ← inspiration index → D:\websites; phase→pack routing
├── RESULTS-MAP.md               ← FINAL evidence folder lock (authority for paths)
├── STRUCTURE-ADVICE.md          ← structure pass #1 (KEEP topology)
├── STRUCTURE-ADVICE-2.md        ← structure pass #2 (HYBRID label / kill order expand)
├── STRUCTURE-REWRITE-NOTE.md    ← what was applied; folder-wise phases; trustdata removal notes
└── Others/                      ← relocated ayushdocs-style owner docs (honesty, licenses, recap)
    ├── 00-PENDING.md … 20-ELON-STANDARD.md
    ├── 08-EVIDENCE-INDEX.md     ← historical map of results/planner/* (many paths may be gone)
    ├── 16-RESULTS-RETENTION.md
    ├── 17-LICENSES-CLEARED.md
    ├── 18-PRODUCT-CONTEXT.md
    ├── 19-GOALS-SLICES.md
    ├── SESSION-RECAP.md
    └── README.md
```

**Note:** `Plans/INDEX.md` catalogs Research maps as **5 files** at Research root; `Others/` is additional co-located owner-doc content. Treat maps as program authority; `Others/` as honesty / scoreboard / historical evidence **index** (not file-of-record).

### 5.2 Path drift honesty (critical for P10 agents)

| Old path (docs still say this often) | Live path (2026-07-10) |
|--------------------------------------|-------------------------|
| `Plans/trustdata/` | **Removed** — use `Plans/` |
| `Plans/trustdata/RESULTS-MAP.md` | `Plans/Research/RESULTS-MAP.md` |
| `Plans/trustdata/RESEARCH-MAP.md` | `Plans/Research/RESEARCH-MAP.md` |
| `Plans/trustdata/phases/P10-…` | `Plans/phases/P10-evidence-handover/` |
| `Plans/trustdata/checkpoints/CHECKPOINTS.md` | **Missing from live tree** |
| `Plans/trustdata/checklists/MASTER-CHECKLIST.md` | **Missing from live tree** |
| `Plans/trustdata/00-START.md` | **Missing** (design unlock lives in design spec + INDEX kill order) |
| `ayushdocs/*` | Also mirrored/moved under `Plans/Research/Others/` (and may still exist at root `ayushdocs/` — verify before claim) |

**P10 execute card still embeds old `Plans/trustdata/…` links in places.**  
**Authority for execution today:** `Plans/INDEX.md` + `Plans/phases/P10-evidence-handover/P10-evidence-handover.md` + `Plans/Research/RESULTS-MAP.md` + `AGENTS.md`.  
When P10 text says “tick MASTER-CHECKLIST,” **live tree has no MASTER file** — next agent must either **restore MASTER from git history / archive** or **owner must reinstate checklist** before CP-10 MASTER criterion can pass. Do **not** invent a green MASTER without the file.

### 5.3 RESEARCH-MAP — purpose for P10

| Job | RESEARCH-MAP |
|-----|--------------|
| Index competitor packs under `D:\websites` | Yes |
| Phase → which report to open for ideas | Yes |
| Declare research ≠ W-gate | Yes (hard) |
| Store proof | **Never** |

**Phase → pack routing (ideas only) — P10 row:**

| Phase | Research open first | Evidence lands in |
|-------|---------------------|-------------------|
| **P10 pack** | **— (no new competitive research required)** | `10-handover/` |

All other phases route to SYNTHESIS / ENGINE-DECISION / specific packs — already covered in RESEARCH-MAP; P10 agents should **not** expand research.

### 5.4 STRUCTURE notes — only what P10 needs

| File | Decision relevant to P10 |
|------|---------------------------|
| STRUCTURE-ADVICE | Program topology **KEEP** (P01–P10 · CP-00–CP-10 · folder lock · Approach A). No new gates. |
| STRUCTURE-ADVICE-2 | Same; HYBRID density language. |
| STRUCTURE-REWRITE-NOTE | HYBRID applied; phase thin appendices for P03/P05/P07; **folder-wise phases** 2026-07-10; reviews co-located; **`Plans/trustdata` removed from live tree**. Evidence folder names **unchanged**. |

**P10 implication:** Do not invent P11, W9, or rename `10-handover/`. Do not expand scope into product code because “structure changed.”

### 5.5 `Others/` (owner honesty) — what is / isn’t proof

| Doc | Use for P10 | W-gate? |
|-----|-------------|---------|
| `08-EVIDENCE-INDEX.md` | Historical catalog of **sibling** planner evidence folders | Paths may be dead; not world-standard W1–W8 |
| `16-RESULTS-RETENTION.md` | Keep/prune policy for results | Policy only |
| `13-P0-1-DONE.md` / `15-P0-2-DONE.md` | Prior P0 landings | **Not** W1–W8 pass |
| `04-HONEST-QUALITY.md` | Spine ≠ ship | Honesty |
| `17-LICENSES-CLEARED.md` | Licenses | Ethics support |
| `18-PRODUCT-CONTEXT.md` / `19-GOALS-SLICES.md` | Why / scoreboard | Not gate pass alone |
| `SESSION-RECAP.md` | Narrative | Not gate pass |

---

## 6. RESULTS-MAP — full authority extract (file-of-record)

**Path:** `D:\OandO07072026\Plans\Research\RESULTS-MAP.md`  
**Root of proof:** `D:\OandO07072026\results\planner\world-standard-wave\`  
**FINAL folder lock date:** 2026-07-09  

### 6.1 Forbidden folder names (never invent as canonical)

| Do **not** create / claim | Canonical instead |
|---------------------------|-------------------|
| `02-engine-lock/` | `01-engine-lock/` |
| `01-product-truth/` | `00-product-truth/` |
| `08-shortcuts-chrome/` | `09-shortcuts-chrome/` |
| `07-mesh-quality/` or `09-mesh-*` | `08-mesh-quality/` |
| Phase-number renames (`03-orbit`, …) | Names in tables below |
| Dump under `results/tests/`, `site/results/`, `archive/results/` | Wave root only |

**Allowed pointer-only aliases** (must contain `NOTES.md` with absolute path to canonical):

| Alias | Points to |
|-------|-----------|
| `07-browser-journey/` | `02-browser-open3d-journey/` |
| `01-product-truth/` | `00-product-truth/` |
| `08-shortcuts-chrome/` | `09-shortcuts-chrome/` |
| `02-engine-lock/` | `01-engine-lock/` |

### 6.2 Master crosswalk — P01–P10 · CP · W · folder

| Phase | CP | Gates | Canonical folder(s) | Map minimum when green |
|-------|----|-------|---------------------|------------------------|
| 00 START | CP-00 | W0 | `00-start/` | `NOTES.md` approach A/B/C + date + agent |
| P01 product truth | CP-01 | Baseline | **`00-product-truth/`** | `INVENTORY.md`, `CONTRADICTIONS.md` |
| P02 engine lock | CP-02 | Engine | **`01-engine-lock/`** | `NOTES.md` + link ENGINE-DECISION; optional richer pack |
| P03 select/delete | CP-03 | **W3** | `03-select-delete/` | `run.json`; vitest raw; unit; browser when claimed |
| P04 orbit | CP-04 | **W4** | `04-orbit-continuity/` | `run.json`; screenshots; console excerpt |
| P05 symbols | CP-05 | **W2** symbols | `05-symbols-svg/` | run/vitest; PNG or prim-JSON; NOTES honesty |
| P06 save | CP-06 | **W5–W6** | `06-save-honesty/` (+ `save-reload/` for W5) | run.json; logs; label NOTES |
| P07 journey | CP-07 | **W1–W2** browser | `02-browser-open3d-journey/` | playwright run; screenshots 01–N; no skip |
| P08 mesh | CP-08 | **W7** | **`08-mesh-quality/`** | NOTES bar; screenshots |
| P09 shortcuts | CP-09 | **W8** | **`09-shortcuts-chrome/`** | run.json; keyboard logs |
| **P10 handover** | **CP-10** | Pack | **`10-handover/`** | **Six files (below)** |

### 6.3 Gate → folder (quick)

| Gate | Primary folder |
|------|----------------|
| W0 | `00-start/` |
| W1 | `02-browser-open3d-journey/` |
| W2 place | `02-browser-open3d-journey/` |
| W2 symbols | `05-symbols-svg/` |
| W3 | `03-select-delete/` |
| W4 | `04-orbit-continuity/` |
| W5 | `06-save-honesty/save-reload/` or `06-save-honesty/` |
| W6 | `06-save-honesty/` |
| **W7** | **`08-mesh-quality/`** (sole primary `08-*`) |
| **W8** | **`09-shortcuts-chrome/`** |
| Pack | `10-handover/` |

### 6.4 Folder numbers ≠ phase numbers (intentional)

- P01 → `00-product-truth/` (frees `01-` for engine)  
- P02 → `01-engine-lock/` (not `02-`; journey owns `02-*`)  
- P07 → `02-browser-open3d-journey/`  
- P09 → `09-shortcuts-chrome/` (mesh alone keeps `08-*`)  

### 6.5 Evidence folder status convention

| Status | Meaning |
|--------|---------|
| **Missing** | Folder not created — expected until phase executes |
| **OPEN** | Exists; incomplete or red |
| **GREEN** | Map minimum **and** phase extras present |
| **WAIVE** | Owner waiver only in CHECKPOINTS — residual risk still logged |

### 6.6 `10-handover/` minimum artifacts (CP-10 / RESULTS-MAP)

| File | Contents |
|------|----------|
| `README.md` | Pack index: date, HEAD, approach, agent count, W links, push status, backup pointer |
| `W-GATES.md` | W0–W8 → pass/fail/WAIVE → primary path → secondary |
| `MASTER-SYNC.md` | Checkbox tallies (historically 9 sections / **94** boxes) |
| `HEAD.txt` | `git rev-parse HEAD` + `git status -sb` |
| `FAILURES-SNIP.md` | Open blockers from `Failures.md` |
| `BACKUP-LOG.md` | E: dest, times, **per-source** robocopy codes, spot-check B.6 |

### 6.7 Canonical `run.json` contract (for re-execution phases — not research)

Minimum fields: `phase`, `gate`, `evidenceRoot`, `cwd`, `command`, `exitCode`, `startedAt`, `endedAt`, `gitHead`, `notes`.

### 6.8 Historical sibling evidence (cite in P01 only; do not rename; may be gone)

RESULTS-MAP lists siblings under `results/planner/` such as:

- `p0-1-admin-svg-publish/`, `p0-2-*`, `svg-authority*`, `save-reload-continuity/`, `fabric-stage-slice/`, `document-view-continuity/`, `modular-*`, `a11y-open3d/`, `hard-path/`, `harden-wave/`, `verify-wave/`, `wave-superpowers/`, etc.

**This session:** entire `results/` missing → treat sibling list as **map of what should be recovered from git history / E: backups / archive**, not as live proof.

### 6.9 Outside world-standard-wave (never dump W proofs there)

| Path | Role |
|------|------|
| `results/tests/` | Generic vitest dumps |
| `results/test-results/` | Tool defaults |
| `site/results/` | Site-local — not W root |
| `archive/results/` | Historical only |
| **`D:\websites\**`** | **Research ideas only — never W-gate file-of-record** |

### 6.10 E: backup mirror (after CP-10 pack exists)

```
E:\OandO-backups\trustdata-YYYY-MM-DD\results\planner\world-standard-wave\
```

Procedure owns to P10 execute card. Log: `10-handover/BACKUP-LOG.md`.

### 6.11 Live status of every RESULTS-MAP folder (this session)

| Folder under `world-standard-wave/` | Status 2026-07-10 |
|-------------------------------------|-------------------|
| entire `results/planner/world-standard-wave/` | **MISSING (parent `results/` absent)** |
| `00-start/` | Missing |
| `00-product-truth/` | Missing |
| `01-engine-lock/` | Missing |
| `02-browser-open3d-journey/` | Missing |
| `03-select-delete/` | Missing |
| `04-orbit-continuity/` | Missing |
| `05-symbols-svg/` | Missing |
| `06-save-honesty/` (+ `save-reload/`) | Missing |
| `08-mesh-quality/` | Missing |
| `09-shortcuts-chrome/` | Missing |
| **`10-handover/`** | **Missing** |
| root `WAVE.md` / `COMPARISON-CHART.md` | Missing |

**Therefore every W0–W8 + Pack row is FAIL / not executable as PASS until evidence is recreated by owning phases (or recovered from backup).**

---

## 7. `Plans\phases\P10-evidence-handover\` — ALL files

### 7.1 Folder inventory

| File | Role |
|------|------|
| `README.md` | Local index; links execute card + suggestions |
| `P10-evidence-handover.md` | **Execute card** — scope, tasks 00–06, six pack files, E: backup, CP-10 criteria |
| `P10-suggestions.md` | Consistency review (S1–S8) applied into execute card 2026-07-09 |

**No other files** in this phase folder (no appendix; no expert essay unique to P10).

### 7.2 Goal (from execute card)

Produce a single final evidence pack that proves **W0–W8 from data**, sync MASTER (historically 9 sections / 94 boxes), back up plan + evidence to **E:**, commit landable docs/evidence slices locally, hand over **without push** unless owner asks.

**Architecture statement:** Proof under `results/planner/world-standard-wave/`; this phase is **documentation + verification + backup only**.

### 7.3 Scope hard stop (S1 — highest severity suggestion, applied)

#### In scope

| Slice | What |
|-------|------|
| Evidence pack | Create/complete `10-handover/` six files |
| W-gate binding | Re-read primary folders; write `W-GATES.md` |
| MASTER sync | Tick only when paths re-read; write `MASTER-SYNC.md` |
| Git hygiene | Local commits; `HEAD.txt`; push status recorded |
| E: backup | Dated `E:\OandO-backups\trustdata-YYYY-MM-DD\`; BACKUP-LOG per-call |
| CP-10 close | Mark only when all criteria true |

#### Out of scope

- **No product code** — no `site/` edits, no test fixes under P10 label  
- Missing/red W evidence → **stop CP-10**, log Failures, **reopen owning phase**  
- Fabric full stage, CRM/SSR, photoreal, multiplayer, competitor asset import  
- `git push` / force-push without explicit owner ask  
- `git worktree add`  

### 7.4 Preconditions (hard stop if false)

- Approach A/B/C recorded (default **A** if owner silent after unlock)  
- CP-00–CP-09 PASS or owner WAIVE in CHECKPOINTS  
- **W0–W8** each have concrete path under wave root **or** WAIVE  
- Main checkout `D:\OandO07072026` only  
- Superpowers / verification-before-completion used  
- `E:` mounted before claiming backup  

**Live precondition failure modes today:**

| Precondition | Live state |
|--------------|------------|
| W0–W8 paths | **FAIL** — no `results/` |
| CP-00–CP-09 recorded | **BLOCKED** — no CHECKPOINTS file in live Plans tree |
| MASTER exists to sync | **BLOCKED** — no MASTER-CHECKLIST in live tree |
| Approach recorded in 00-START | Design spec says Approach **A** approved; trustdata 00-START removed |
| E: writable | Not verified this session — verify before Task 05 |

### 7.5 Task runbook (00–06)

| Task | Name | P10 agent action |
|------|------|------------------|
| **00** | Setup | Superpowers; confirm git root; read INDEX / RESULTS-MAP / phase; ensure `10-handover/` exists; spot-list gate folders |
| **01** | Final evidence pack | Write six files; re-read disk for W-GATES |
| **02** | MASTER sync | All sections; tallies sum 94; never green without paths |
| **03** | Local commits | Four-slice cadence (pack → MASTER → backup log → handover complete) |
| **04** | Push policy | Default no push; record status |
| **05** | E: backup | robocopy/Copy-Item minimum set; BACKUP-LOG schema |
| **06** | Handover narrative + CP-10 | Honesty anti-claims; mark CP-10 only if all criteria true |

### 7.6 W-gate evidence binding (must match RESULTS-MAP)

| Gate | Primary | Pass artifact minimum |
|------|---------|------------------------|
| W0 | `00-start/` or pack notes | Approach + engine checkboxes |
| W1 | `02-browser-open3d-journey/` | Playwright run + wall/door screenshots |
| W2 | journey + `05-symbols-svg/` | Place ≥2 incl cabinet-v0; Block2D proof |
| W3 | `03-select-delete/` | Unit + Playwright select/delete/undo |
| W4 | `04-orbit-continuity/` | Pose + orbit ON + console clean |
| W5 | `06-save-honesty/save-reload/` | Hard reload same wall + furniture ids |
| W6 | `06-save-honesty/` | Local vs cloud copy truth |
| W7 | **`08-mesh-quality/`** | NOTES + visual toe/door/carcass |
| W8 | **`09-shortcuts-chrome/`** | Map labels match handlers |

### 7.7 E: backup minimum set (MASTER B.3 spirit)

| Source | Dest under dated folder |
|--------|-------------------------|
| `Plans\` (live: full plan pack; card says `Plans\trustdata\` historically) | `Plans\…` |
| `results\planner\world-standard-wave\` | same relative |
| design spec world-standard | `docs\superpowers\specs\` |
| `Failures.md` | root of dest |
| optional `ayushdocs\08-EVIDENCE-INDEX.md` | `ayushdocs\` |
| recommended `D:\websites\research\2026-07-09-world-standard\` | `websites-research\…` |

**Robocopy codes 0–7 = success; ≥8 = fail.**  
**Spot-check B.6:** dest has `Plans\…\INDEX.md` and `…\10-handover\README.md`.

### 7.8 Commit cadence (four slices)

1. `trustdata(P10): evidence pack 10-handover`  
2. `trustdata(P10): MASTER checklist sync W0-W8`  
3. `trustdata(P10): backup log + CP-10 notes`  
4. `trustdata(P10): handover complete CP-10`  

(Message prefix may stay “trustdata” historically even if folder is now `Plans/`.)

### 7.9 CP-10 pass criteria (all required)

1. `10-handover/` complete with all six files  
2. MASTER synced; MASTER-SYNC tallies match (94 or WAIVE refs)  
3. Every W0–W8 primary folder has artifacts **or** owner WAIVE  
4. E: backup logged and verified  
5. Local commits for landable slices  
6. No push unless asked; status recorded  
7. CP-00–CP-09 PASS/WAIVE before CP-10  
8. CHECKPOINTS CP-10 marked with date + path  
9. **No product code changes attributed to P10**

### 7.10 Stop-if-fail table

| Failure | Action |
|---------|--------|
| W1–W8 primary missing | Reopen owning phase; CP-10 fail; **no site/ under P10** |
| MASTER green without paths | Revert; integrity fail |
| E: not available | Failures.md; backup criterion fail; keep D: pack |
| Worktree or push without ask | Stop; Failures.md |
| Secrets in pack | Scrub; re-commit; do not copy secrets to E: |
| Artifacts only under retired folder names | Rehome or pointer; else gate fail |

### 7.11 P10-suggestions.md — findings (for auditors)

| # | Severity | Finding | Applied? |
|---|----------|---------|----------|
| S1 | High | No product code under P10; reopen owning phase | Yes in execute card |
| S2 | High | Dual `08-*` confusion; W8 = `09-shortcuts-chrome/` | Yes + FOLDER-LOCK |
| S3 | High | MASTER full 94-box sync | Yes in Task 02 |
| S4 | Med | Task 00–06 ordered runbook | Yes |
| S5 | Med | W0 + CP-00–09 in preconditions | Yes |
| S6 | Med | BACKUP-LOG per-source codes | Yes |
| S7 | Low | Related footer | Yes |
| S8 | Low | Superpowers in Task 00 | Yes |

### 7.12 Skills for this phase

| Skill / handbook | Use |
|------------------|-----|
| `/using-superpowers` | Always |
| `verification-before-completion` | Before any “done” claim |
| `Agents/Agents-docs.md` | Doc honesty |
| `Agents/Agents-failure.md` | Failures.md |
| `testing-handbook.md` | Zero suppression of already-captured test output |

---

## 8. Gate ≠ product — definition of honesty

### 8.1 Three layers agents mix up

| Layer | What it is | Where it lives | Pass means |
|-------|------------|----------------|------------|
| **Research** | Competitor patterns / scores / ethics | `D:\websites` | “We studied enough to decide” — **not** product works |
| **Gate / CP** | Proof contract for a capability | `results/planner/world-standard-wave/*` + CHECKPOINTS | Artifacts re-read this session match criteria |
| **Product** | What a facilities buyer can do unaided | Running `site/` at `/planner/open3d` (etc.) | Buyer journey real; gates are necessary but buyers don’t open `run.json` |

### 8.2 W1–W8 definitions (design authority)

From `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`:

| ID | Gate | Proof type |
|----|------|------------|
| **W1** | Draw walls + door/opening | Playwright + screenshots |
| **W2** | Place ≥2 incl. **cabinet-v0**; Block2D readable | Playwright + PNG |
| **W3** | Select + Delete/Backspace + undo | Unit + Playwright |
| **W4** | 2D↔3D pose; orbit ON | Playwright + console clean |
| **W5** | Save → hard reload → same ids | Playwright (flush/autosave wait) |
| **W6** | Local vs cloud labels honest | Code + UI copy + test |
| **W7** | Mesh bar: toe/door/carcass readable | Visual smoke + NOTES |
| **W8** | Tool/shortcut labels match handlers | Unit + keyboard test |

**North star (product):** facilities buyer layouts office with real O&O-scale furniture, 2D↔3D orbit, select/edit/delete, save and return, dimensions trustable enough to quote later.

**Approach A locked:** Feasibility + document model first; Fabric destination after W green.

### 8.3 Expert must-fix that P10 **does not implement** (reopen phases)

From `Plans/phases/EXPERT-PASS.md` — if evidence missing, these belong to **P02–P09**, not P10:

1. W3 pure delete + single history + browser under `03-*`  
2. Fabric furniture flag OFF for W3/W2 proof  
3. W4 orbit three-layer  
4. Furniture rotation stays **degrees** in document  
5. Stay imperative Three for open3d mid-gate  
6. W5–W6 flush + honest labels  
7. Serial journey pack deltas (never seed absolute counts as pass)  
8. Canonical folders only; no silent skip  
9. P05 Block2D canvas authority; centered-path lie forbidden  
10. P08 mesh toe→carcass→door  
11. P09 map = handlers (D=door, M=dimension…); no Dimension→D rebind  
12. P02 package pin / Fancyapps / GSAP license row  

### 8.4 Kill order (when rebuilding evidence)

From `Plans/INDEX.md` / `Plans/README.md`:

```
P01 truth → P02 engine
  → P03 W3 (unit+browser)
  → P07 W1–W2 journey
  → P06 W5–W6 save
  → P04 orbit · P05 symbols · P08 mesh · P09 shortcuts
  → P10 handover
```

**Scarce slots:** spine 3–5 before mesh/chrome.  
**P10 is last.** Running P10 first is ceremony.

---

## 9. Live checkout honesty snapshot (2026-07-10)

### 9.1 Present

| Asset | Path |
|-------|------|
| Plans program | `Plans/INDEX.md`, `Plans/phases/P01–P10`, `Plans/Research/*` |
| Design W1–W8 | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Competitive research | `D:\websites\**` (full packs) |
| Failures root | `Failures.md` (gate policy + honesty notes; cites historical `results/` paths) |
| Product code (assumed) | `site/` present per package inventory (not audited in this brainstorm for feature green) |
| This handover brainstorm | `Idiots2/P10-evidence-handover/REPORT.md` |

### 9.2 Absent / broken for CP-10

| Asset | Impact |
|-------|--------|
| Entire `results/` | **No W-gate file-of-record** |
| `10-handover/` six files | **Cannot pack** |
| CHECKPOINTS.md | **Cannot mark CP-00–CP-10** in live tree without restore |
| MASTER-CHECKLIST.md | **Cannot Task 02 sync** without restore |
| trustdata 00-START | Unlock checkboxes live only in design spec / owner memory / history |
| WAVE.md / COMPARISON-CHART under wave root | Pre-plan honesty copies missing from D: (research MASTER-CHART still on `D:\websites`) |

### 9.3 Failures.md (root) — relevance to P10

- Declares evidence under `results/<module>/<phase>/…`  
- Latest honesty: SVG publish authority; G8 partial; coverage floor policy  
- References historical evidence paths that **may no longer be on disk**  
- **P10 Task 01** must write `FAILURES-SNIP.md` from **live** Failures.md open items — not invent resolved product claims  

### 9.4 Git / remotes (from Failures resolved note)

- Mirror backup multi-account discipline (`pglcarpets` / `mayoite`)  
- P10 push policy still: **default no push** unless owner asks in current conversation  
- AGENTS.md also allows agent-call push of green landable slices — **user/phase instructions for P10 execute card say no push without ask**; follow **execute card for P10** unless owner overrides  

---

## 10. Recovery & execution playbook (for next agent)

### 10.1 If the goal is true CP-10 PASS

Do **not** start at P10 pack fiction.

1. **Recover or recreate `results/`**  
   - Check git history for committed `results/`  
   - Check `E:\OandO-backups\trustdata-*`  
   - Check `archive/results/` if any  
   - If unrecoverable: **re-run owning phases** P01→P09 per kill order with real tests/browser  

2. **Restore process files if still required by CP-10**  
   - CHECKPOINTS.md, MASTER-CHECKLIST.md from git history **or** owner reinstate  
   - Align paths: either update execute card to `Plans/` or restore `Plans/trustdata` naming — **owner call**  

3. **Verify each primary folder** against RESULTS-MAP minimum + phase extras  

4. **Only then** run P10 Tasks 00–06  

5. **Never** fill W-GATES.md with research paths  

### 10.2 If the goal is “honest pack of what we know now” (partial / FAIL pack)

Owner may request a **FAIL-honest** `10-handover/` that states:

- All W gates **FAIL / MISSING** with path `results/` absent  
- Research intact under `D:\websites` (ideas only)  
- Plans intact under `Plans/`  
- Next = rebuild evidence spine  

That is **allowed as honesty documentation**. It is **not** CP-10 PASS.

### 10.3 What P10 must never do

- Edit `site/` to “make the pack green”  
- Copy competitor screenshots into `results/` as O&O proof  
- Mark MASTER boxes from memory  
- Claim WAVE complete from SYNTHESIS  
- Re-run Firecrawl as substitute for Playwright  
- Invent WAIVE without owner  

### 10.4 Recommended W-GATES.md skeleton if writing FAIL-honest pack now

```markdown
| Gate | Status | Primary path | Notes |
|------|--------|--------------|-------|
| W0 | FAIL / MISSING | results/planner/world-standard-wave/00-start/ | results/ tree absent 2026-07-10 |
| W1 | FAIL / MISSING | .../02-browser-open3d-journey/ | same |
| W2 place | FAIL / MISSING | .../02-browser-open3d-journey/ | same |
| W2 symbols | FAIL / MISSING | .../05-symbols-svg/ | same |
| W3 | FAIL / MISSING | .../03-select-delete/ | same |
| W4 | FAIL / MISSING | .../04-orbit-continuity/ | same |
| W5 | FAIL / MISSING | .../06-save-honesty/save-reload/ | same |
| W6 | FAIL / MISSING | .../06-save-honesty/ | same |
| W7 | FAIL / MISSING | .../08-mesh-quality/ | same |
| W8 | FAIL / MISSING | .../09-shortcuts-chrome/ | same |
| Pack | OPEN / partial | .../10-handover/ | this FAIL-honest index only |
```

---

## 11. Cross-links (absolute paths)

### Research (ideas)

| Doc | Absolute path |
|-----|---------------|
| Research home README | `D:\websites\README.md` |
| SYNTHESIS | `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` |
| MASTER-CHART | `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` |
| ENGINE-DECISION | `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` |
| FIRECRAWL-GAPS | `D:\websites\research\2026-07-09-world-standard\FIRECRAWL-GAPS.md` |
| O&O self REPORT | `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` |
| P5D ethics | `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` |
| Salvage map | `D:\websites\SALVAGE_MAP.md` |

### Plans (procedure)

| Doc | Absolute path |
|-----|---------------|
| Plans index | `D:\OandO07072026\Plans\INDEX.md` |
| Plans README | `D:\OandO07072026\Plans\README.md` |
| RESULTS-MAP | `D:\OandO07072026\Plans\Research\RESULTS-MAP.md` |
| RESEARCH-MAP | `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md` |
| STRUCTURE-REWRITE-NOTE | `D:\OandO07072026\Plans\Research\STRUCTURE-REWRITE-NOTE.md` |
| EXPERT-PASS | `D:\OandO07072026\Plans\phases\EXPERT-PASS.md` |
| P10 execute | `D:\OandO07072026\Plans\phases\P10-evidence-handover\P10-evidence-handover.md` |
| P10 suggestions | `D:\OandO07072026\Plans\phases\P10-evidence-handover\P10-suggestions.md` |
| Design W1–W8 | `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` |
| Failures | `D:\OandO07072026\Failures.md` |
| This REPORT | `D:\OandO07072026\Idiots2\P10-evidence-handover\REPORT.md` |

### Evidence (target — currently missing)

| Doc | Absolute path |
|-----|---------------|
| Wave root | `D:\OandO07072026\results\planner\world-standard-wave\` |
| Handover pack | `D:\OandO07072026\results\planner\world-standard-wave\10-handover\` |
| E: backup pattern | `E:\OandO-backups\trustdata-YYYY-MM-DD\` |

---

## 12. One-page cheat sheet for the next human/agent

1. **Research first** (`D:\websites`) = orientation. **Never** = green.  
2. **RESULTS-MAP** = only legal evidence folder names.  
3. **P10** = pack + MASTER sync + E: backup + honesty. **No `site/`.**  
4. **Live truth 2026-07-10:** `results/` **gone** → all W gates **unproven** on disk.  
5. **Plans/trustdata** removed; use `Plans/` + `Plans/Research/`. CHECKPOINTS/MASTER **missing** — restore before theatrical PASS.  
6. **Kill order** rebuild evidence before pretending CP-10.  
7. **Approach A** product journey first; Fabric after W green.  
8. **Engine decision** research-proposed; lock under `01-engine-lock/` with owner checkboxes.  
9. **O&O research self-score ~1.9–2.0** — spine, not ship. Re-inventory in P01.  
10. **Gate ≠ product.** Pack green without buyer journey is still a lie if W folders are empty.

---

## 13. Done criteria for **this brainstormer task**

| Criterion | Status |
|-----------|--------|
| Wrote only under `Idiots2\P10-evidence-handover\` | Yes — `REPORT.md` |
| Order: websites → Plans/Research → P10 phase | Yes |
| Full websites inventory | Yes §2 |
| Research ≠ evidence | Yes §3 |
| SYNTHESIS honesty + pack reports light | Yes §4 |
| RESULTS-MAP exhaustive | Yes §6 |
| P10 phase ALL | Yes §7 |
| GATE ≠ product | Yes §0, §8 |
| results/ may be gone | **Confirmed gone** §0.2, §6.11, §9 |
| No product code | Yes |

**Not claimed:** CP-10 PASS · any W gate green · product ship · MASTER complete · E: backup done.

---

*End of Idiots2 P10 evidence-handover REPORT. Unlimited length requirement satisfied by full inventories + procedure extract + live honesty. No code.*
