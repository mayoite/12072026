# Idiots2 / P09 — Shortcuts & Blocking Chrome (W8) — Exhaustive brainstorm report

**Agent:** BRAINSTORMER 09/10 (wave-2 re-run)  
**Date:** 2026-07-10  
**Mode:** Research synthesis + design truth · **NO PRODUCT CODE** · no product edits outside this folder  
**Deliverable:** this file only under `Idiots2/P09-shortcuts-chrome/`  
**Gate:** **W8** — Tool/shortcut labels match handlers  
**Checkpoint:** **CP-09**  
**Evidence home (execution, not this report):** `results/planner/world-standard-wave/09-shortcuts-chrome/`  
**Checkout:** `D:\OandO07072026` main only · no worktrees  

**Skills invoked:** `/using-superpowers` · brainstorming (design/spec synthesis; no implementation)  

**Read order obeyed (binding for this report):**

1. **`D:\websites` FIRST** — Homestyler keyboard/forum packs; P5D `TOOLBARS.md` + inspiration + ethics; Floorplanner manual shortcut matrix; RoomSketcher toolbar/measure/W8 rows; world-standard `SYNTHESIS.md`; `comparison/02-toolbar/` REPORT + SCORES + MASTER-CHART; 2026-07-05 UI benchmark/plann-compare; all pack `report/` files  
2. **`Plans/Research` entire** — RESEARCH-MAP, RESULTS-MAP (FOLDER-LOCK), STRUCTURE-ADVICE*, Others status thin notes  
3. **`Plans/phases/P09-shortcuts-chrome/` ALL** — README, P09-shortcuts-chrome.md, P09-suggestions.md, 06-ui-shortcuts.md  

**Cross-check (read-only live repo, not “done” claims):**  
`canvasTool.ts`, `useWorkspaceKeyboard.ts`, `CanvasToolRail.tsx`, `FeasibilityCanvas.tsx` aria, `paletteCommands.ts`, `toolShortcutTruth.test.ts`, `canvas-tool-rail.module.css`, `OOPlannerWorkspace.tsx` guidance strip  

**Ethics fence (binding):** Competitive research under `D:\websites` is **ideas / JTBD / patterns only**. No competitor icons, chrome pixels, JS, GLB, marketing copy, brand, or help prose into O&O product. Firecrawl is **dead** for routine re-scrape. Inspiration ≠ clone. MIT/open packages only if a dep is ever needed (prefer **zero new deps** for P09).

**Honesty rule:** Owner thin notes may claim W8 **GATE PASS (artifacts)** while product remains unfinished. This report separates **industry pattern**, **phase plan debt**, and **live code snapshot (2026-07-10)**. Implementers re-prove against files + Vitest under `09-shortcuts-chrome/` — never against memory or this brainstorm alone.

---

## 0. One-page verdict (read this if you only have 90 seconds)

| Question | Answer |
|----------|--------|
| **What is W8?** | Continuous chain: **tool id → shortcut letter → live keydown handler → visible label / aria / badge / palette string**. All four agree for every authority letter. Partial truth (map tests green, handler wrong) = **FAIL**. |
| **Why does it exist as a gate?** | Power users trust muscle memory; new users trust rail badges. Badge says Dimension **(M)** but **D** arms dimension → product is lying. Industry research (Homestyler Help sheet; Floorplanner published matrix) proves **discoverable + consistent** is table stakes — **not** which letter means dimension. |
| **What does research say about shortcuts winners?** | Homestyler **5** (Help→Shortcut Keys + view/roam keys). Floorplanner **5** (published editor-manual matrix). RoomSketcher **4**. Planner5D **3** (WASD walkthrough; editor hotkeys less foregrounded). O&O research-day self-score **2**. |
| **What does the phase plan lock?** | Single authority in `canvasTool.ts` (`CANVAS_TOOL_SHORTCUTS` + `CANVAS_TOOL_LABELS`). Invert map once for letter arming. **D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map**. Forbidden: rebind Dimension→**D**. Evidence only under **`09-shortcuts-chrome/`**. Hide-tools chrome only if tools unreachable. |
| **Live code honesty (2026-07-10 re-proof)?** | Handler **looks map-driven already** (`TOOL_BY_SHORTCUT_KEY` invert; comment “no second hard-coded table”). `toolShortcutTruth.test.ts` exists with full live keydown matrix. Rail map-sourced. Palette subset map-sourced. **`aria-keyshortcuts` still stale** (`V W D T H…` omits R/O/M/P/N). Evidence tree **`results/planner/world-standard-wave/` absent** in this checkout → CP-09.6 not re-proven. |
| **Is CP-09 green?** | **Not proven in this checkout.** Code may be largely Task-02/01 complete; residual honesty = **aria Task 04 + evidence pack Task 00/06 + hide-tools NOTES Task 05**. Do not claim W8 PASS without `09-shortcuts-chrome/` artifacts. |
| **What remains for executors?** | (1) Baseline vitest logs under `09-`. (2) Re-run truth matrix GREEN. (3) Fix or confirm aria helper. (4) Palette assert. (5) Hide-tools inventory → `none` or minimal fix. (6) NOTES + CP-09 from data. (7) Do **not** re-implement invert if already present — **verify, evidence, residual honesty**. |
| **What not to do?** | Dimension→D “fix”. Competitor keymap envy (Floorplanner D=dimension). Full 2A redesign. Dual-keyboard rewrite. CSS churn without NOTES proof. Evidence under `08-shortcuts-chrome/`. Paper PASS from thin owner notes. |

**Brutal pushback:** W8 is **honesty**, not chrome fashion. A product with a beautiful rail that lies about **D** is worse than a plain rail that tells truth. Historical smoking gun = **second hard-coded key table**. Residual to treat seriously when code already invert: **aria honesty + CP-09 evidence under `09-shortcuts-chrome/`**. Inspiration is not cheating. Cloning expression is. Lying shortcuts are product malpractice.

---

## 1. Source map (what was read; what each is for)

### 1.1 `D:\websites` — competitive / industry research (ideas only)

| Path | Role for P09 / W8 |
|------|-------------------|
| `D:\websites\README.md` | Research home; ethics; layout |
| `D:\websites\homestyler.com\report\INSPIRATION.md` | **Primary discoverability pack** — scrape honesty; five-zone shell; WASD/B/1; Help→Shortcuts pattern; SEO article discard |
| `D:\websites\homestyler.com\raw\homestyler.com-forum-view-1613229904600383490.md` | Official interface tutorial: five parts; roam keys |
| `D:\websites\homestyler.com\raw\homestyler.com-forum-view-1560174293289902081.md` | Toolbar IA; Material Brush **B**; plane **1**; Help→Shortcut Keys |
| `D:\websites\homestyler.com\raw\homestyler.com-article-floorplanner-mastering-keyboard-shortcuts-in-interior-design-software.md` | **Discard for keys** — SEO fluff; zero real bindings |
| `D:\websites\homestyler.com\raw\support.homestyler.com-hc-en-us.md` | **Null** — Taobao error page |
| `D:\websites\homestyler.com\raw\search-help.json` | Pointers only |
| `D:\websites\planner5d.com\report\TOOLBARS.md` | **Chrome zones** primary; 2D/3D tool roles; WASD walkthrough; inspiration checklist |
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Funnel + editor UX signals |
| `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` | Binding anti-copy for P5D pack |
| `D:\websites\planner5d.com\report\toolbar-mock\index.html` | Original zone mock study only — not clone |
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | **§2.7 strongest published key grammar**; W8 mapping; anti-copy fence |
| `D:\websites\floorplanner.com\raw\cdn.floorplanner.com-static-brochures-FloorplannerManualEN.pdf.md` | Manual §12 full shortcut table |
| `D:\websites\floorplanner.com\raw\cdn.floorplanner.com-static-brochures-Floorplanner+editor+manual+version+180219.pdf.md` | Older manual keyboard chapter |
| `D:\websites\roomsketcher.com\report\INSPIRATION.md` | W8 principle via hotkey **Q** flip; toolbar 404 honesty; gate table |
| `D:\websites\roomsketcher.com\raw\…360000808925-How-Do-I-Add-Doors…` | Place/edit/delete; flip + hotkey |
| `D:\websites\roomsketcher.com\raw\help…4140214-toolbar-buttons…` | **404 garbage** — zero toolbar evidence |
| `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | Minimal power-user shortcut culture (anti-pattern for W8 depth) |
| `D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md` | Parked; ignore deep investment |
| `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md` | Chrome zones only; not keyboard |
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Pattern library → O&O; keyboard discoverability → W8 |
| `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\REPORT.md` | Scores; winners; O&O chrome target |
| `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\SCORES.csv` | shortcuts column numeric |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Toolbar winner P5D; O&O tools ~2 |
| `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` | Self-score posture |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-benchmark.md` | Figma/SketchUp/AutoCAD grammar; Ctrl+K; hover shortcuts |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-plann-compare.md` | Adopt/reject per product; REJ mega-tabs |

### 1.2 `Plans/Research` (repo index into research + folder law)

| Path | Role |
|------|------|
| `Plans/Research/RESEARCH-MAP.md` | **Phase → pack routing**: P09/W8 → Homestyler keyboard + P5D TOOLBARS; evidence `09-shortcuts-chrome/` |
| `Plans/Research/RESULTS-MAP.md` | **FOLDER-LOCK**: forbidden `08-shortcuts-chrome/`; canonical **`09-shortcuts-chrome/`**; CP-09 minimum artifacts |
| `Plans/Research/STRUCTURE-ADVICE.md` | P09 execute card size; parallel fill W8; P-number thrash risks |
| `Plans/Research/STRUCTURE-ADVICE-2.md` | P09 ~405 lines; order 9 shortcut/label truth |
| `Plans/Research/STRUCTURE-REWRITE-NOTE.md` | Parallel fill includes W8 |
| `Plans/Research/Others/00-PENDING.md` | Thin claim W8 GATE PASS — re-prove |
| `Plans/Research/Others/19-GOALS-SLICES.md` | Parallel fill “W8 PASS” claim — re-prove |
| `Plans/Research/Others/06-A11Y-OPEN3D.md` | Canvas keyshortcuts + named tools with shortcuts in name |

### 1.3 Phase pack (execute authority for P09)

| Path | Role |
|------|------|
| `Plans/phases/P09-shortcuts-chrome/README.md` | Folder index |
| `Plans/phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md` | **Full execute card** — tasks 00–06, CP-09, file map, risks |
| `Plans/phases/P09-shortcuts-chrome/P09-suggestions.md` | Expert S1–S10 (planning-time; S1 later superseded by FOLDER-LOCK) |
| `Plans/phases/P09-shortcuts-chrome/06-ui-shortcuts.md` | Expert pass verdict **FIX** |
| Design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | W8 one-line gate |
| `Plans/phases/EXPERT-PASS.md` (if present) | Consolidated expert |

### 1.4 Live code (re-prove at execution; snapshot used in §8)

| Path | Role |
|------|------|
| `site/features/planner/open3d/editor/canvasTool.ts` | Authority maps + labels + guidance + rail order + `runtimeToolFor` |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Keydown; invert map; non-tool precedence |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` | Rail chrome |
| `site/features/planner/open3d/editor/canvas-tool-rail.module.css` | Hide-tools CSS audit |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | aria-keyshortcuts + dual keyboard local |
| `site/features/planner/open3d/lib/commands/paletteCommands.ts` | Palette subset shortcuts |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Guidance strip + setTool plumbing |
| `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | W8 contract suite |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Hook suite (palette/undo/editable) |
| `site/tests/unit/features/planner/open3d/donorParity.test.ts` | Map parity |
| `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` | Shell/map parity |

---

## 2. What W8 actually is (and is not)

### 2.1 Design-spec definition

From `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`:

| ID | Gate | Proof |
|----|------|--------|
| **W8** | Tool/shortcut labels match handlers | Unit + keyboard test |

W8 sits in the W1–W8 product journey set under **Approach A** (product journey first). Full Phase 2A / Approach C chrome polish is **not** the gate. Only chrome defects that **hide or block tools** pull into P09 (Approach A “2A blockers that hide tools”).

### 2.2 Operational definition (trust-data phase)

**W8 truth** = one continuous chain:

```
tool id  →  shortcut letter  →  live keydown handler  →  visible label / aria / badge / palette string
```

All four must agree for every letter in the authority map.

| Layer | What must agree |
|-------|-----------------|
| **id** | `PlannerTool` string (`"dimension"`, `"door"`, …) |
| **key** | Single letter in `CANVAS_TOOL_SHORTCUTS[id]` (e.g. `"M"`) |
| **handler** | `keydown` without mod → `setTool(id)` exactly once |
| **label** | `CANVAS_TOOL_LABELS[id]` on rail/palette/status (`"Dimension"`) |
| **composed chrome** | Accessible name `Label (Key)` e.g. `Dimension (M)` |

### 2.3 Partial-truth failure classes

| Class | Map | Resolver | Keydown | Label | Verdict |
|-------|-----|----------|---------|-------|---------|
| A — full truth | OK | OK | OK | OK | **PASS** |
| B — map-only green | OK | OK | **LIE** | OK | **FAIL** (historical smoking gun) |
| C — unbound gap | OK | OK | **noop** | OK | **FAIL** (N/T historical) |
| D — aria omit | OK | OK | OK | OK but aria missing letters | **FAIL** residual honesty (Task 04) |
| E — forbidden “fix” | **changed** to match bad handler | OK | OK | OK | **FAIL** product law + Failures |
| F — dual surface thrash | OK | OK | both fire | OK | Scope fence: log; minimal if W8 breaks |

### 2.4 Explicit non-W8 (do not expand phase into these)

| Out | Why |
|-----|-----|
| Full Approach C / Phase 2A redesign (RAC drawers, premium topbar, mobile redesign) | Product still “works” without polish; W8 is truth, not beauty |
| Full a11y A1–A8 (nested main, heading hierarchy, favorites naming) | Only if a finding **hides tools** |
| Fabric cutover, mesh quality, select/delete product, orbit, save honesty | P02–P08 / other gates |
| Redesigning which tools sit on the rail | Keep product set |
| Expanding palette to every `PlannerTool` | Subset OK if subset shortcuts honest |
| Dual-keyboard architecture redesign | Log conflict; minimal fix only if W8 breaks |
| Competitor keymap philosophy (“because SketchUp/Floorplanner uses X”) | O&O map + tests own truth |
| Forbidden “fix”: rebind Dimension → **D** to match a bad handler | Makes labels lie harder |
| Material brush, arc array, GLA measure suite, WASD roam product | Later power; not W8 letter contract |

### 2.5 Why W8 is a separate gate (product argument)

1. **Trust is brittle.** One wrong letter teaches users the product is unreliable; they stop trusting every badge.  
2. **Two cohorts fail differently.** New users learn from rail badges. Power users learn from muscle memory. If those diverge, both cohorts are gaslit.  
3. **Tests can hide the bug.** Pure map tests (`toolFromShortcutKey`) pass while live `keydown` lies — classic dual-source failure.  
4. **Industry already solved discoverability, not letter identity.** Homestyler ships Help→Shortcuts; Floorplanner ships a manual matrix. Neither licenses O&O’s letter table.  
5. **W1–W7 can look green while W8 fails.** You can draw walls and place cabinets with a mouse while keyboard/rail lies. Gate exists so “world-standard” is not mouse-only theater.

### 2.6 Relationship to other gates (cross-phase)

| Gate | Relationship to W8 |
|------|--------------------|
| **W1** draw structure | Wall **W**, opening **O**, door **D** must arm real tools so keyboard journey equals mouse journey |
| **W2** place | Placement **P** arms place tool |
| **W3** select/delete | Select **V**; Delete/Backspace semantics owned by P03 — P09 must **not** change Delete meaning to “fix” shortcuts |
| **W4** 2D↔3D | Tab toggleView is non-tool; do not thrash orbit |
| **W5–W6** save | Ctrl+S may exist elsewhere; not W8 letter map; honesty is separate |
| **W7** mesh | No keyboard claim |
| **P10** pack | Consumes `09-shortcuts-chrome/` NOTES + W8 PASS only when data-green |

---

## 3. D:\websites research deep dive (P09-relevant)

### 3.1 Homestyler — keyboard discoverability (primary P09 research pack)

**Pack root:** `D:\websites\homestyler.com\`  
**Start:** `report\INSPIRATION.md`  
**Raw that matter:** forum official posts; SEO keyboard article is **noise**.

#### 3.1.1 Scrape quality honesty (do not over-claim)

| Check | Result |
|-------|--------|
| Live authenticated editor DOM | **No** |
| Full keyboard shortcut table | **No** |
| Help center | **Dead** — Taobao error page in `support.homestyler.com-hc-en-us.md` |
| SEO article “mastering keyboard shortcuts…” | **Near-zero** for keys — generic prose + CTAs + gallery; **never lists real bindings** |
| Official forum tutorials | **High** — only dense product-UI signal |
| Login chrome pollution | ~90 lines Sign In noise on most pages — **not product UX** |

**Bottom line from Homestyler pack:** usable for **editor zone map**, **few confirmed hotkeys**, **Help→Shortcuts discoverability pattern**. Unusable as a full competitor key table.

#### 3.1.2 Five-zone editor shell (industry pattern, not proprietary)

Homestyler Official forum (“Introduction to design interface”) describes five parts:

```
┌────────────┬──────────────────────────────┬─────────────┐
│            │         TOP TOOLBAR          │ Prefs/Help  │
│   LEFT     ├──────────────────────────────┤             │
│  CATALOG   │       CENTRAL CANVAS         │   RIGHT     │
│            │                              │  PROPERTY   │
│            ├──────────────────────────────┤             │
│            │      BOTTOM TOOLBAR          │             │
└────────────┴──────────────────────────────┴─────────────┘
```

**O&O translation for P09:** keep **clear zones** (rail + canvas + inspector + status). Do **not** pixel-match Homestyler chrome. P09 only cares if zones **hide** the tool rail or **lie** about keys.

#### 3.1.3 Confirmed Homestyler keys (only what is actually stated)

| Binding / control | Source | Role |
|-------------------|--------|------|
| **W / S / A / D** | Interface tutorial | Walk-through move (3D roam) |
| **Arrow keys** | Same | Same as WASD |
| **On-screen 4 arrows** | Same | Mouse users |
| **Left-drag** | Same | Look around in 3D |
| **Mouse zoom** | Same | Zoom canvas |
| **B** | Update forum post | Material Brush |
| **1** | Arc Array instructions | Switch to **plane** (2D top) view |
| Help → Shortcut Keys | Forum | In-app cheat sheet (**content not scraped**) |

**Not in raw pack:** undo/redo, delete, copy/paste, full tool switches, grid snap, layer lock keys.

**Critical Homestyler lesson for W8 (pattern only):**

1. Ship an **in-editor Shortcuts panel** (Help or `?`) — discoverability.  
2. **Define our own table** — do not mirror Homestyler even if later scraped.  
3. Prefer industry conventions where they do not collide (WASD roam, number keys for views) — **after** W8 map is locked and proven.  
4. SEO articles that *claim* shortcuts help layers/catalog without listing keys are **marketing**, not contracts.

#### 3.1.4 Homestyler toolbar IA signals (chrome, not keys)

From update forum post (shortcuts + top toolbar):

- Help (upper right) gains **Shortcut Keys** category — **discoverability product**.  
- Material Brush shortcut **B**.  
- Construction tools promoted (Flip Plane, Check Wall closure) for discoverability.  
- Clear/delete elevated.  
- Render type on hover (efficiency).  
- Arc Array requires view **plane** via shortcut **1** — **view keys as mode switches**.

**O&O P09 takeaway:** discoverability (rail badge + optional `?` sheet + honest aria) is the pattern. Array tools, material brush, Autostyler = **later**, not W8.

#### 3.1.5 Homestyler → O&O translation table (W8 slice)

| Homestyler signal | O&O translation | P09 priority |
|-------------------|-----------------|--------------|
| Help → Shortcut Keys | Optional `?` / Help cheatsheet of **our** map | P1 after truth fixed |
| Label/badge matches action | Rail `Label (Key)` + handler same map | **P0 W8** |
| WASD roam | 3D walk later; not W8 letter tools | Out (P04-adjacent) |
| Number key view modes | Do not invent until product owns view matrix | Out of P09 |
| Five-zone shell | Already O&O shell shape | Hide-tools only |
| Material Brush **B** | Own finish tool + letter when product ships | Out |
| SEO fluff shortcuts article | Never cite as key table | Discard |

#### 3.1.6 Homestyler SEO article autopsy (why discard)

File: `homestyler.com-article-floorplanner-mastering-keyboard-shortcuts-in-interior-design-software.md`

- Heavy login modal noise.  
- Generic prose: “shortcuts improve UX… help layers… catalog… 2D and 3D” — **zero key=action rows**.  
- Ends in community gallery CTAs.  
- **If an agent cites this as a key table, they failed scrape honesty.**

#### 3.1.7 Homestyler anti-copy (from pack)

| Allowed | Forbidden |
|---------|-----------|
| Rebuild zone concepts | Copy icons, spacing, chrome colors, logos |
| Industry controls (WASD roam pattern later) | Paste tutorial text, screenshots as UI mock |
| Help → shortcuts **pattern** with O&O content | Homestyler/Autodesk trademarks as affiliated |
| Learn from public feature lists | Reverse-engineer private APIs / authenticated scrapes for code |

---

### 3.2 Planner 5D — TOOLBARS / chrome zones

**Primary:** `D:\websites\planner5d.com\report\TOOLBARS.md`  
**Supporting:** `INSPIRATION_REPORT.md`, `toolbar-mock/index.html` (original mock, not clone), `ETHICS_AND_INSPIRATION.md`

#### 3.2.1 Chrome zones (product pattern)

```
┌─────────────────────────────────────────────────────────────┐
│ TOP BAR: project · share · 2D|3D · camera/render · account  │
├──────┬──────────────────────────────────────────┬───────────┤
│ LEFT │              CANVAS                      │ RIGHT     │
│ tools│   2D plan  /  3D view                    │ catalog / │
│      │                                          │ props     │
├──────┴──────────────────────────────────────────┴───────────┤
│ BOTTOM / status: floors · mode hints · undo hints            │
└─────────────────────────────────────────────────────────────┘
```

#### 3.2.2 2D vs 3D tool roles (FAQ workflow)

| Mode | Tools role |
|------|------------|
| **2D** | Structure + measure (walls, doors, windows, measurements) |
| **3D** | Furniture, textures, camera, render |

Keyboard in P5D pack: walkthrough **WASD** for 360 preview angles; general editor hotkeys **less foregrounded** than Homestyler/Floorplanner in public materials. Shortcuts research score: **3**.

#### 3.2.3 Inspiration checklist → O&O (toolbar slice only)

**Must-have zones (behavior, not look):**

1. Top: project, save state, 2D|3D, export  
2. Left: select, wall, door/opening, room, measure, (delete via key)  
3. Right: catalog / properties  
4. Bottom/status: tool hint, units, undo, zoom  

**P09 relevance:**

- Rail tools must be **reachable** (not `display:none` at interactive viewports).  
- Each primary tool needs **working shortcut + visible active state + status guidance**.  
- Do **not** ship P5D red FAB, Smart Wizard chrome, or camera-as-toolbar identity.

#### 3.2.4 Dialogs that sit above toolbars (hide-tools awareness)

P5D pack lists license, free-plan limit, unsaved project, 3D unsupported browser, name prompt, walkthrough launched. Pattern for O&O: modals must not leave rail permanently unreachable without dismiss. Task 05 checks overlay steal.

#### 3.2.5 Local toolbar mock

`D:\websites\planner5d.com\report\toolbar-mock\index.html` — **original** mock for zone study. Do not port HTML/CSS into `site/`.

#### 3.2.6 Ethics (P5D-specific)

- No `app.js` / `fastboot.js` reuse.  
- No editor HTML/CSS clone.  
- No brand / GLB.  
- Deep stack notes are package **ideas**, not install lists for product.

---

### 3.3 Floorplanner — published shortcut matrix (strongest key table in research)

**Primary:** `D:\websites\floorplanner.com\report\INSPIRATION.md` §2.7  
**Raw:** `FloorplannerManualEN.pdf.md` section “12: Keyboard shortcuts”

#### 3.3.1 Full abstract grammar (patterns only — do not copy as O&O map)

From EN manual table (abstracted):

| Function | Key(s) | Context |
|----------|--------|---------|
| Exit mode / deselect | Esc | Drawing or selection |
| Delete | Del / Backspace | Selection active |
| Disable snap | Hold **S** | Draw / move |
| Rectangle select | Shift + drag | 2D canvas |
| Pan | Spacebar | 2D |
| Center view | `.` | 2D |
| Rotate ±5° / ±15° | r/l · R/L | Item selected (mode-dependent) |
| Save | Cmd/Ctrl+S | Editor |
| Undo / Redo | Cmd/Ctrl+Z / Y | Editor |
| Draw wall | **w** | 2D |
| Draw room | **r** | 2D (**conflicts with rotate** depending on mode) |
| Draw surface | f | 2D |
| Text | t | 2D |
| Dimension | **d** | 2D |
| Line | l | 2D |
| Tape measure | **m** | 2D |
| Minimap | `` ` `` | 2D |
| Floor switch | `<` `>` | Editor |
| Background hide | b | Trace mode |
| Shortcut help | **?** | Sidebar |
| Copy/paste | Cmd/Ctrl+C/V | Mode-dependent |

**Pattern:** Tool activation letters + always-on Esc/Delete/Undo/Snap-off/Pan. **Mode conflicts** resolved by “drawing mode vs selection mode.”

#### 3.3.2 Critical Floorplanner insight for O&O W8

Floorplanner’s **d = dimension**, **m = tape measure** is **their** map. O&O currently locks:

- **D = door**  
- **M = dimension**  

That is **not** a Floorplanner clone and **must not** be “fixed” by adopting Floorplanner letters. Industry research explains *why* tables exist; product tests + Failures notes own the letters (`Failures.md` PLAN-FAIL-0413: unique shortcuts **D→door, M→dimension**).

**Also adopt as behavior grammar (already O&O-aligned):**

- Space = temporary pan  
- Esc = cancel  
- Delete/Backspace = selection delete  
- Ctrl/Cmd+Z/Y = undo/redo  
- `?` or Help = shortcut list (**discoverability**, content original)

#### 3.3.3 Mode-conflict lesson (r/l rotate vs room)

Floorplanner documents that **r** means room when drawing and rotate when item selected. O&O must:

1. Keep **unique letters across map** (uniqueness test).  
2. Not invent mode-dependent dual meanings for the same letter without product ownership + tests.  
3. Prefer **one letter = one tool id** for W8 simplicity.

#### 3.3.4 Floorplanner chrome patterns (hide-tools relevance)

- Sidebar as tool hub; selection drives contextual options  
- `?` opens shortcuts in sidebar  
- Hold **S** disables snap while measuring  
- Units/measure/lock cluster near view controls  

**Reject:** mega-tab Build/Decorate/Furnish trade dress (REJ-01 in O&O research).

#### 3.3.5 Floorplanner → W gates mapping (from pack)

| Floorplanner pattern | O&O gate |
|----------------------|----------|
| Del / Backspace deletes | W3, W8 |
| Esc clears / exits tool | W8 |
| Wall / room / opening tools | W1 |
| Shortcuts labels = real handlers | **W8** |
| Snap, pan (space), undo/redo | CAD-lite norms |

---

### 3.4 RoomSketcher — toolbar / hotkey thin pack

**Primary:** `D:\websites\roomsketcher.com\report\INSPIRATION.md`

| Finding | Strength | W8 use |
|---------|----------|--------|
| Mode menu (Walls / Windows etc / Furniture / Materials) | Medium–strong IA | Task grouping idea; not P09 redesign |
| Delete via toolbar trash | Strong | Complement keyboard Delete (W3+W8) |
| Flip door hotkey **Q** | Strong | Example that **named hotkey matches action** — W8 principle |
| Toolbar buttons help article | **404 garbage** | Zero toolbar chrome evidence |
| Full shortcut map | **Missing** | Do not invent |

RoomSketcher score on shortcuts column (02-toolbar): **4** — documented hotkeys for top-toolbar actions, not Homestyler-class Help sheet depth.

**W8 from RoomSketcher:** one proven hotkey (**Q** flip) that does what it claims is better than a full **lying** map. Completeness without truth is worthless.

**Gate table quote (RoomSketcher pack):**

> **W8** Tool/shortcut labels match handlers | Hotkey Q for flip door; mode names match behavior | O&O map: every visible tool name and shortcut (Delete, Backspace, structure/place/select) **matches** `useWorkspaceKeyboard` / toolbar wiring. Unit + keyboard test.

---

### 3.5 World-standard SYNTHESIS + 02-toolbar comparison

**SYNTHESIS:** `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`  
**Toolbar slice:** `comparison\02-toolbar\REPORT.md`  
**Scores:** `comparison\02-toolbar\SCORES.csv`  
**Master:** `comparison\MASTER-CHART.md`

#### 3.5.1 SYNTHESIS pattern library → O&O (P09 rows)

| Industry pattern | O&O translation | Gate |
|------------------|-----------------|------|
| 2D structure then decorate | Walls/openings first; inventory second | W1–W2 |
| Instant 2D↔3D | Same document UUIDs; orbit in 3D | W4 |
| Select + transform | Hit-test; Delete wired | W3 |
| Catalog is product | Real O&O SKUs + Block2D | W2/W7 |
| Chrome layout | Top · left tools · canvas · right · status — **re-implemented** | P09 only where labels/tools block |
| Keyboard discoverability | **Our** map must match handlers | **W8 / P09** |

#### 3.5.2 Shortcuts column winners (public bar)

| Product | Shortcuts score | Why (public bar) |
|---------|-----------------|------------------|
| Homestyler | **5** | Help-center shortcut category + view keys + roam keys |
| Floorplanner | **5** | Published editor-manual matrix including measure/snap modifiers |
| RoomSketcher | 4 | Documented hotkeys for top actions |
| Planner5D | 3 | WASD walkthrough; editor hotkeys less foregrounded |
| Foyr Neo | 3 | Power-user present; beginner-weak |
| IKEA | 2 | Minimal power-user shortcut culture |
| **O&O live (research day)** | **2** | Prototype; labels can mislead |

**Full SCORES.csv (toolbar slice):**

```
product,grouping,discover,mode_split,measure,shortcuts,mobile
Planner5D,4,4,5,3,3,4
RoomSketcher,5,5,4,5,4,5
Floorplanner,4,4,5,4,5,3
Homestyler,4,4,5,3,5,5
Foyr Neo,4,3,3,4,3,2
IKEA,3,3,3,3,2,1
O&O live,2,2,2,2,2,1
```

**Winner implication for O&O (behavior, not UI):**

> **Shortcut discoverability** (Homestyler Help pattern) + **published consistent matrix** (Floorplanner manual pattern)  
> → O&O form: single authority map + rail badges + optional `?` sheet + tests that **keydown matches map**.

MASTER-CHART toolbar column winner: **Planner5D** for overall chrome completeness; O&O tools ~2. Response in RESEARCH-MAP: **Labels truth W8; no clone**.

#### 3.5.3 O&O chrome target (from 02-toolbar — original composition)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOP: O&O project · honest save · 2D | 3D · export/BOQ · ?       │
├──────┬──────────────────────────────────────────┬───────────────┤
│ RAIL │                 CANVAS                    │ CONTEXT      │
│ ~48px│  Feasibility / plan stage                 │ Inventory    │
│ tools│                                           │  OR Props    │
├──────┴──────────────────────────────────────────┴───────────────┤
│ COMMAND STRIP: active tool · shortcut · numeric commit · errors │
│ STATUS: floor · units (mm) · snap · zoom · undo/redo            │
└─────────────────────────────────────────────────────────────────┘
```

**Minimum chrome acceptance (toolbar slice) relevant to W8:**

1. Every rail tool: visible active state, status-bar guidance, **working shortcut**.  
2. Measure tool produces on-canvas dimension + status (product depth = later).  
3. Delete/Backspace deletes current selection.  
4. Mobile: primary tools reachable without hover-only UI.  
5. Save label honest (other gate).

#### 3.5.4 Roadmap rows that P09 owns vs defers

| Priority | Action | P09? |
|----------|--------|------|
| P0 | Wire tool rail → command dispatch; honest shortcuts | **Yes** (honest shortcuts) |
| P0 | Bottom command strip + measure commit | Partial (status guidance exists; full strip later) |
| P1 | Mode-aware tool enablement in 3D | No |
| P1 | Measurement suite beyond tape | No |
| P2 | Shortcut sheet + instructor strip | **Discoverability P1 after truth** |
| P2 | Touch tool sheet | Hide-tools if rail unreachable only |

#### 3.5.5 Principles mapped from winners (not cloned)

| Adopt (behavior) | From | O&O original form |
|------------------|------|-------------------|
| Compact primary tool rail | SketchUp-class density | Left icon rail; Phosphor; `Label (Key)` aria |
| Task grouping without mega-tabs | RoomSketcher modes | Rail sections optional later — not blue bar |
| 2D structure ↔ 3D present | P5D role split + Floorplanner toggle | TopBar 2D\|3D; same selection IDs |
| Measure first-class | RoomSketcher depth | Dimension tool **M** + later suite |
| Keyboard-first numeric commit | SketchUp / AutoCAD | Command strip later |
| Shortcut discoverability | Homestyler Help | `?` sheet **after** truth |
| Hover shortcut labels | SketchUp | Rail badge + title |
| Ctrl/Cmd+K command palette | Figma/industry | Already O&O |

#### 3.5.6 Explicit rejects (anti-copy from 02-toolbar)

- Figma bottom primary toolbar pill trade dress  
- Floorplanner mega-tab sidebar colors/labels  
- Planner 5D Smart Wizard / AI competition chrome  
- RoomSketcher blue toolbar visual identity  
- IKEA / brand product shells  
- Competitor icons, screenshots, or GLB catalogs  

---

### 3.6 Historical 2026-07-05 UI research (secondary)

**Files:**  
`D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-benchmark.md`  
`…RESEARCH-2026-07-05-ui-plann-compare.md`

**P09-relevant patterns already aligned with O&O shell:**

| Pattern | Source family | O&O form |
|---------|---------------|----------|
| Compact left rail + expanded secondary | SketchUp | `CanvasToolRail` + palette for subset |
| Hover / focus shortcut labels | SketchUp | `Label (Key)` aria + badge |
| Command palette Ctrl/Cmd+K | Industry | `useWorkspaceKeyboard` + `CommandPalette` |
| Bottom command / measurement strip | AutoCAD Web / SketchUp | Partial status guidance; full strip later |
| Canvas-first shell | All | Existing open3d workspace |
| Reject mega-tabs | Floorplanner REJ-01 | Keep |

**Precedence vs 2026-07-09:** World-standard comparison pack **wins** on conflict. 07-05 is grammar fuel only.

---

### 3.7 Other pack reports (secondary for P09)

| Pack | Path | P09 signal |
|------|------|------------|
| 3dplanner.com | parked | Ignore deep investment |
| IKEA planners | product-first Options; minimal shortcuts | Anti-pattern for power keys; pro SKU path elsewhere |
| oando-render-options | canvas/SVG inventory | Not keyboard |
| ETHICS (P5D) | binding | No app.js reuse; no editor HTML clone |
| OEM systems (Steelcase etc.) | portfolio language | Zero shortcut evidence |

---

### 3.8 Industry keyboard grammar summary (for O&O brainstorm — not product map)

**Always-on (nearly universal in research):**

- Esc — cancel / deselect / exit tool  
- Delete / Backspace — delete selection  
- Ctrl/Cmd+Z / Y / Shift+Z — undo/redo  
- Space — pan (hold)  
- Ctrl/Cmd+S — save (O&O may differ by honesty path)  
- `?` or Help — show shortcuts  
- Ctrl/Cmd+K — command palette (creative-tool modern)  

**Common tool letters (competitors disagree — O&O owns its own):**

| Letter | Floorplanner | Homestyler (known) | O&O locked map |
|--------|--------------|--------------------|----------------|
| W | wall | WASD roam (3D) | **wall** |
| R | room (or rotate when selected) | — | **room** |
| D | dimension | WASD roam (3D) | **door** |
| M | tape measure | — | **dimension** |
| T | text | — | **text** |
| H | (pan often Space) | — | **pan** (hand) |
| V | (varies) | — | **select** (Figma/SketchUp-class) |
| O | — | — | **opening** |
| N | — | — | **window** |
| P | — | — | **placement** |
| B | background hide (trace) | Material Brush | **unassigned O&O** |
| S | hold disable snap | WASD | **unassigned O&O** (do not steal without product rule) |
| Q | — | (sometimes elevate) | RoomSketcher flip door later |
| 1 | — | plane view | out until view matrix |

**Collision lesson:** Floorplanner resolves r/l rotate vs room by mode. Homestyler uses WASD for roam which would **collide** with O&O W=wall and D=door if both active on same surface without mode fence. O&O open3d workspace path: letter tools on workspace keyboard; WASD roam is **not** current W8 surface.

---

## 4. Plans\Research routing for P09

### 4.1 RESEARCH-MAP — phase → pack

| Phase / gate | Open first (ideas) | Translate to O&O | Evidence lands |
|--------------|--------------------|------------------|----------------|
| **P09 / W8** | Homestyler keyboard discoverability; P5D TOOLBARS regions | **Our** keymap must match handlers; blocking chrome only | `09-shortcuts-chrome/` |

Pattern library row:

> Keyboard discoverability (Homestyler-class idea) → **Our** shortcut map must match handlers → **P09 / W8**

Toolbar research score row:

> Toolbar · Planner5D-class completeness · O&O research score 2 · Response: **Labels truth W8; no clone**

How-to-use RESEARCH-MAP (binding process):

1. Open **report** first.  
2. Open **raw** only for primary quote.  
3. Translate to O&O original.  
4. Never import research trees into `site/`.  
5. Do not re-scrape P5D/3dplanner by default.  
6. Research folders are **not** evidence folders.

### 4.2 RESULTS-MAP — folder lock (hard)

| Forbidden | Canonical | Why |
|-----------|-----------|-----|
| `08-shortcuts-chrome/` | **`09-shortcuts-chrome/`** | Sole primary `08-*` is mesh quality; W8 is phase-aligned `09-*` |

**Map minimum when CP-09 green:**

- `run.json`  
- vitest / keyboard logs (unfiltered)  
- optional Playwright  

**Crosswalk:** Phase `P09-shortcuts-chrome` · **CP-09** · gate **W8** · folder **`09-shortcuts-chrome/`**

Allowed pointer-only alias: retired `08-shortcuts-chrome/` may contain `NOTES.md` pointing to absolute path of `09-` — **do not split artifacts**.

**Anti-claim table row (RESULTS-MAP):**

| False claim | Must show |
|-------------|-----------|
| “Shortcuts OK” | `09-shortcuts-chrome/` (not “keymap file exists unread”) |

### 4.3 STRUCTURE notes

- P-number thrash risk: agents invent `08-shortcuts-chrome/` or ban `09-` based on **retired** reviews. **FOLDER-LOCK 2026-07-09 wins.**  
- Old S1 in suggestions once pushed `08-`; expert revision **supersedes** S1 with FOLDER-LOCK → **`09-shortcuts-chrome/` only**.  
- Parallel fill slots may include W8 while other gates land — **do not thrash same keyboard package** with two writers.  
- STRUCTURE-ADVICE: P09 execute card ~405 lines — healthy size; not tax-on-skim.  
- STRUCTURE-ADVICE-2: order 9 = Shortcut/label truth; trust chrome; blocking 2A only.

### 4.4 Others / status notes (re-prove, do not trust alone)

| Note | Claim | Brainstorm treatment |
|------|-------|----------------------|
| `Others/00-PENDING.md` | W8 GATE PASS (artifacts) | Re-prove folder + vitest |
| `Others/19-GOALS-SLICES.md` | Parallel fill W8 PASS | Same |
| `Others/06-A11Y-OPEN3D.md` | Canvas named + keyshortcuts; tools named with shortcuts | Aligns Task 04; prove live string |

As of brainstorm workspace:

- `results/planner/` tree **not present** in this checkout snapshot (cannot re-prove artifact pack here).  
- Live **handler + unit truth table code** exists (see §8).  
- `aria-keyshortcuts` on canvas still **stale** (see §8.6).  

**Brainstorm rule:** implementers treat W8 as **re-verify** Tasks 00–06 against RESULTS-MAP, not as closed forever.

---

## 5. Phase folder — full unpack (`Plans/phases/P09-shortcuts-chrome/`)

### 5.1 Files

| File | Role |
|------|------|
| `P09-shortcuts-chrome.md` | Execute card — tasks 00–06, CP-09, file map, risks |
| `P09-suggestions.md` | Expert suggestions S1–S10 (planning-time; no product code) |
| `06-ui-shortcuts.md` | Expert pass verdict **FIX** (W8 not shippable until matrix green) |
| `README.md` | Local index |

### 5.2 Goal statement (execute card)

> Make every tool **id → shortcut key → keyboard handler → visible label** tell the same truth (gate **W8**), and fix **only** Phase-2A chrome defects that **hide or block** canvas tools. No full chrome redesign.

**Architecture:** Single authority maps in `canvasTool.ts` drive keyboard, rail, palette, aria. Handlers must not hard-code a divergent key table. Letter tools arm by **inverting the map once**.

**Tech stack:** Next.js site · Vitest · React Testing Library · Phosphor · existing open3d workspace. **No new packages.**

### 5.3 Expert pass P0 (condensed from card + 06-ui-shortcuts)

1. **Handler = map (smoking gun historically):** hook imported map but armed tools via second hard-coded letter table. Live lie: **D → dimension** (map door); **M unbound** (map dimension); **N/T unbound**.  
2. **Product letters locked:** D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map. All map letters must `setTool(id)`.  
3. **Live keydown matrix** required — `toolFromShortcutKey` alone insufficient (map-true, handler-false was the bug class).  
4. **`aria-keyshortcuts` honesty** — derive from map + only wired non-tool keys.  
5. **Forbidden fix:** rebind Dimension → D.

**Expert verdict (06):** **FIX** — not BLOCK (path clear), not SHIP until matrix + evidence under **09-**.

One-line fix contract from expert:

> one map drives keyboard, rail, palette, aria; unit matrix proves every letter; chrome only if tools are unreachable.

### 5.4 Scope table (execute card)

#### In scope

| Slice | What |
|-------|------|
| W8 truth table | Every rail/palette tool id → key → `setTool(id)` |
| Lying / gap handlers | D/M/N/T class issues |
| Rail chrome | Regression guard — stay map-sourced |
| Keyboard | Single map-driven arming |
| Canvas a11y string | All tool letters + wired non-tools only |
| 2A hide-tools only | CSS/layout/focus that blocks tools; proof-first NOTES |

#### Out of scope

- Full 2A polish, A1–A8 unless hide-tools  
- Fabric, mesh, select product, orbit, save  
- Rail tool-set redesign  
- Palette expansion to full PlannerTool list  
- Dual keyboard redesign  
- Competitor philosophy  
- Dimension→D rebind  

### 5.5 Authority maps (product contract)

From `canvasTool.ts` (live + phase):

| Tool id | Shortcut | Label | On rail? | On palette subset? |
|---------|----------|-------|----------|--------------------|
| select | **V** | Select | yes | yes |
| pan | **H** | Pan | yes | yes |
| room | **R** | Room | yes | no |
| wall | **W** | Wall | yes | yes |
| opening | **O** | Opening | yes | no |
| dimension | **M** | Dimension | yes | no |
| placement | **P** | Place | yes | no |
| door | **D** | Door | no | yes |
| window | **N** | Window | no | yes |
| text | **T** | Text | no | yes |

**Rail order (`CANVAS_TOOLS`):** select → pan → room → wall → opening → dimension → placement.

**Product rule door vs opening:**

- Rail product tool is **opening (O)**, not separate Door button.  
- Legacy door/window/text remain in `PlannerTool` + palette `CanvasTool` subset.  
- After fix: **D→door**, **M→dimension**, **O→opening**, **N→window**, **T→text**.

**Guidance strings (honest product copy — not competitor):**

| id | Guidance (from map) |
|----|---------------------|
| select | Click an object to inspect it. Delete removes the selection. |
| pan | Drag to move the drawing. Release Space to restore the armed tool. |
| room | Click corners to outline a room. Enter accepts; Escape cancels. |
| wall | Click start and end points. Alt temporarily bypasses snapping. … |
| opening | Click a wall to add an opening. |
| dimension | Pick two points to annotate a measured span. |
| placement | Choose a catalogue item, then click the canvas to place it. |
| door | Click a wall to add a door. |
| window | Click a wall to add a window. |
| text | Click the canvas to add an annotation. |

**`runtimeToolFor` (do not confuse with shortcut truth):**

| PlannerTool | Runtime canvas tool |
|-------------|---------------------|
| room | wall |
| opening | door |
| dimension | text |
| placement | select |
| others | self |

This mapping is **runtime drawing mode**, not keyboard letter identity. W8 does not require runtime id === planner id; it requires **letter → setTool(planner id)** and labels for that planner id.

### 5.6 Non-tool handlers (keep; precedence)

| Key | Action |
|-----|--------|
| Space | Temporary pan |
| Tab | toggleView |
| Escape | cancel |
| Enter | commit |
| Delete / Backspace | deleteSelection |
| Ctrl/Cmd+K | openPalette |
| Ctrl/Cmd+Z / Y / Shift+Z | undo / redo |

**Precedence (phase + live hook):** editable guard → Space pan → mod chords → Tab → Escape → Enter → Delete/Backspace → undo/redo mods → **single-letter tool map**.

### 5.7 File touch map

| Path | Role |
|------|------|
| `site/features/planner/open3d/editor/canvasTool.ts` | Authority maps; optional `canvasKeyShortcutsAttribute()` helper |
| `…/useWorkspaceKeyboard.ts` | Keydown → invert map once |
| `…/CanvasToolRail.tsx` | Regression only |
| `…/canvas-feasibility/FeasibilityCanvas.tsx` | `aria-keyshortcuts` only |
| `…/lib/commands/paletteCommands.ts` | Palette shortcut fields from map |
| `…/canvas-tool-rail.module.css` | Only if NOTES proves hide |
| `…/workspace.module.css` / `WorkspaceShell.tsx` | Only if shell covers rail |
| Tests: `toolShortcutTruth.test.ts` (preferred), `open3dWorkspaceKeyboard.test.tsx`, `workspaceShell`, `donorParity` | Contract |

### 5.8 Tasks 00–06 (execution contract — no code here)

#### Task 00 — Baseline

**Skill:** verification-before-completion  
**Files:** evidence folder only  

- Create `results/planner/world-standard-wave/09-shortcuts-chrome/`  
- Run existing keyboard-related Vitest; unfiltered log via Tee-Object  
- NOTES: D/M lie + N/T gaps + smoking gun line refs **or** current residual honesty if already fixed  
- Confirm P03–P08 ownership (do not change Delete semantics)  

**Done when:** baseline log exists; NOTES lists contradiction/residuals with file paths; evidence path is **09-** not 08-.

**PowerShell pattern (from phase):**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx tests/unit/features/planner/open3d/donorParity.test.ts tests/unit/features/planner/open3d/workspaceShell.test.tsx --reporter=verbose 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\00-baseline-vitest.log
```

#### Task 01 — RED truth table

**Skill:** TDD  

Expected pure table (contract):

```
select→V, room→R, wall→W, opening→O, door→D, dimension→M,
placement→P, pan→H, window→N, text→T
```

Assert:

1. Maps match table  
2. `toolFromShortcutKey` upper/lower  
3. Unique letters  
4. **Live keydown** every row → `setTool(id)` once  
5. Editable + disabled negatives  
6. Mirror minimum in `open3dWorkspaceKeyboard.test.tsx`  
7. RED log for failing rows historically  

**Done when:** RED log proves mismatch **or** (if already green) baseline documents already-green with honest residual list — do not fake RED.

#### Task 02 — GREEN handlers

- Delete second hard-coded letter table  
- Invert `CANVAS_TOOL_SHORTCUTS` once  
- Keep non-tool branches  
- GREEN logs + commit message pattern:  
  `fix(planner): W8 keyboard handlers match CANVAS_TOOL_SHORTCUTS (D=door, M=dimension)`  

**Done when:** green logs exist; no second hard-coded tool letter table remains in the hook.

#### Task 03 — Rail regression

- Rail already map-sourced: `aria-label={`${label} (${shortcut})`}`  
- RTL: Dimension (M), Wall (W); no Door-for-M  
- Icons not redesign; only wrong tool id wiring  
- Guidance strip uses maps  

#### Task 04 — aria + palette

- Replace hard-coded `aria-keyshortcuts="V W D T H …"`  
- Include all map letters (M, D, O, R, P, N, T, …)  
- Non-tool only if wired  
- Zoom `0 + -` only if canvas still owns them when not delegated  
- Prefer pure helper next to `canvasTool.ts`  
- Palette `tool-*` shortcuts = map; subset OK  

#### Task 05 — Hide-tools only

Inventory (proof-first):

| Check | Hide-tools? |
|-------|-------------|
| Rail mounted (`nav[aria-label="Canvas tools"]` / `.pw-tool-rail`) | Missing → blocker |
| `display:none` / zero size at 1440 and 390 | Interactive hide = fix; print-only OK |
| Overlay steals clicks | z-index / pointer-events only |
| Focus trap blocks tool keys | Minimal trap fix |
| Nested main / double name | **Out** unless rail leaves a11y tree |

**Not hide:** horizontal reflow at `<48rem` (rail becomes bottom scroll row; badge letters hide on coarse layout but tools remain).

Zero defects → `chrome-hide-tools: none` — **no invented CSS churn**.

#### Task 06 — Evidence + CP-09

- Final Vitest pack log  
- Optional browser D vs M smoke  
- NOTES Results: W8 PASS/FAIL, full table, hide-tools, dual-keyboard note, commits  
- Mark CP-09.1–09.7  

### 5.9 CP-09 checklist

| ID | Requirement |
|----|-------------|
| CP-09.1 | Unit table id → key → setTool for every authority tool (D/M/N/T included) |
| CP-09.2 | No divergent hard-coded tool letter table |
| CP-09.3 | Rail accessible names Label (Key) from maps |
| CP-09.4 | aria/palette match maps |
| CP-09.5 | Hide-tools fixed or documented none |
| CP-09.6 | Evidence under **09-shortcuts-chrome/** unfiltered |
| CP-09.7 | Landable commits; push only if owner asked |

**W8 PASS only if CP-09.1–09.6 green.**

### 5.10 Suggestions S1–S10 (planning expert) — status relative to FOLDER-LOCK

| ID | Intent | Plan status |
|----|--------|-------------|
| S1 | Evidence path | **Superseded:** first pass said `08-`; FOLDER-LOCK → **`09-` only** |
| S2 | Full letter gap not only D/M | Applied |
| S3 | Task 03 = rail regression | Applied |
| S4 | Map-driven arming; forbid Dimension→D | Applied |
| S5 | aria honesty | Applied |
| S6 | test ownership toolShortcutTruth + hook suite | Applied |
| S7 | dual keyboard fence | Applied |
| S8 | hide-tools proof-first | Applied |
| S9 | palette subset stay | Applied |
| S10 | scope freeze | Applied |

**Historical note:** S1 in `P09-suggestions.md` (2026-07-09) still textually says replace 09 with 08. **Do not re-apply S1.** Execute card expert revision + RESULTS-MAP FOLDER-LOCK override S1 completely.

### 5.11 Implementation order

```
00 baseline → 01 RED truth → 02 GREEN handlers → 03 rail regression
→ 04 aria/palette → 05 hide-tools only → 06 evidence/CP-09
```

Do **not** parallelize 03 before 02 green (labels without handler truth re-lie).  
Task 01 authoring can start while 00 baseline runs.

### 5.12 Handoff to P10

P09 contributes:

- `09-shortcuts-chrome/` logs + NOTES with **W8 PASS**  
- Commit list for shortcut truth  
- Note if browser smoke deferred  

Do not claim world-standard complete from P09 alone.

### 5.13 Risk table (from execute card)

| Risk | Mitigation |
|------|------------|
| “Fix” by changing labels to match wrong handler (Dimension (D)) | Forbidden — map + Failures + tests own D/M |
| Scope creep into full 2A | Task 05 allowlist only; proof-first NOTES |
| Breaking Delete/undo while editing shortcuts | Preserve non-tool branches; regression logs in 02 |
| Palette lists door while rail shows opening | Both valid; keys D vs O must stay distinct |
| Partial fix (only D/M) leaves N/T unbound | Task 01 matrix covers **all** map letters |
| Dual keyboard (canvas local vs workspace) thrash | Scope fence: log only unless W8 broken |
| Wrong evidence folder `08-shortcuts-chrome/` | Canonical **09-shortcuts-chrome/** only |

---

## 6. Full W8 truth table (product contract)

### 6.1 Letter tools

| id | key | label | setTool | On rail | On palette subset | Guidance uses shortcut |
|----|-----|-------|---------|---------|-------------------|------------------------|
| select | V | Select | select | yes | yes | yes via strip |
| room | R | Room | room | yes | no | yes |
| wall | W | Wall | wall | yes | yes | yes |
| opening | O | Opening | opening | yes | no | yes |
| door | D | Door | door | no | yes | palette/status |
| dimension | M | Dimension | dimension | yes | no | yes |
| placement | P | Place | placement | yes | no | yes |
| pan | H | Pan | pan | yes | yes | yes |
| window | N | Window | window | no | yes | palette |
| text | T | Text | text | no | yes | palette |

### 6.2 Unique letter invariant

```
V R W O M P D N T H  →  10 unique letters, one tool each
```

Any PR that maps two tools to one letter **fails W8** even if UI looks fine.

### 6.3 Inverted map (lowercase keys → tool)

| key | tool |
|-----|------|
| v | select |
| r | room |
| w | wall |
| o | opening |
| m | dimension |
| p | placement |
| d | door |
| n | window |
| t | text |
| h | pan |

### 6.4 User-visible lie class (historical + regression)

| User sees | User presses | Wrong outcome (historical) | Correct |
|-----------|--------------|----------------------------|---------|
| Dimension (M) on rail | D | Armed dimension | Door |
| Dimension (M) on rail | M | Nothing | Dimension |
| Door tool in palette (D) | D | Dimension | Door |
| Window (N) | N | Nothing | Window |
| Text (T) | T | Nothing | Text |
| Opening (O) | O | (was OK) | Opening |
| Wall (W) | W | (was OK) | Wall |

### 6.5 Non-tool truth (document in NOTES / aria helper)

| Chord / key | Owner surface | Action |
|-------------|----------------|--------|
| Space (hold) | workspace keyboard | temp pan |
| Tab | workspace | toggle 2D/3D |
| Escape | workspace (+ canvas local if not delegated) | cancel |
| Enter | workspace | commit |
| Delete/Backspace | workspace | deleteSelection |
| Ctrl/Cmd+K | workspace | palette |
| Ctrl/Cmd+Z / Y / Shift+Z | workspace | undo/redo |
| 0 + - | canvas local when !delegateKeyboard | zoom |

**Do not put in aria:** letters with no owner; competitor keys we never ship.

### 6.6 Accessible name contracts (rail)

Template: `` `${CANVAS_TOOL_LABELS[tool]} (${CANVAS_TOOL_SHORTCUTS[tool]})` ``

| Tool | Accessible name |
|------|-----------------|
| select | Select (V) |
| pan | Pan (H) |
| room | Room (R) |
| wall | Wall (W) |
| opening | Opening (O) |
| dimension | Dimension (M) |
| placement | Place (P) |

No rail button claims Door for M or Dimension for D.

### 6.7 Palette subset contracts

Palette `TOOL_IDS` (CanvasTool subset): select, wall, door, window, text, pan.

| Command pattern | setTool | shortcut field |
|-----------------|---------|----------------|
| tool-select | select | V |
| tool-wall | wall | W |
| tool-door | door | D |
| tool-window | window | N |
| tool-text | text | T |
| tool-pan | pan | H |

Do **not** require palette rows for room/opening/dimension/placement unless owner expands product.

---

## 7. Architecture narrative (why one map)

### 7.1 Failure mode that created W8

Two sources of truth:

1. `CANVAS_TOOL_SHORTCUTS` (documentation, rail, `toolFromShortcutKey`, some tests)  
2. Hard-coded `if (key === "d") setTool("dimension")` style branches (live product)

Map tests can **pass** while users experience **lie**. That is the smoking gun class.

### 7.2 Correct architecture

```
canvasTool.ts
  CANVAS_TOOL_SHORTCUTS  ──┐
  CANVAS_TOOL_LABELS     ──┼──→ CanvasToolRail (aria/title/badge)
  CANVAS_TOOL_GUIDANCE   ──┤
                           ├──→ paletteCommands (subset)
                           ├──→ guidance strip (OOPlannerWorkspace)
                           ├──→ aria helper → FeasibilityCanvas
                           └──→ invert once → TOOL_BY_SHORTCUT_KEY
                                    └──→ useWorkspaceKeyboard letter arm
                                    └──→ toolFromShortcutKey
```

Tests assert **all three**: map values, pure resolver, **window keydown → setTool**.

### 7.3 Dual surface fence

```
/planner/open3d workspace
  useWorkspaceKeyboard  →  tool letters + always-on
  FeasibilityCanvas
    if (!delegateKeyboard) local Escape/zoom/(legacy)
    if (delegateKeyboard) local key path skipped for delegated ownership
```

P09 ownership of tool arming = **workspace hook**. Dual-surface redesign is thrash.

Live snapshot (2026-07-10): canvas local still handles Escape, zoom `0/+/-` when not delegated. Workspace owns tool letters when hook enabled.

### 7.4 Editable guard

```
if target is INPUT | TEXTAREA | SELECT | contentEditable → ignore keydown for tools
```

Typing “d” in a property field must **not** arm door tool.

### 7.5 Enabled flag

`handlers.enabled === false` → hook does not bind listeners. Tests cover this.

### 7.6 Why invert once (not lookup reverse each key)

- O(1) per keydown after O(n) setup.  
- Single place for uniqueness bugs (duplicate values overwrite in invert — uniqueness test catches).  
- Same structure for `toolFromShortcutKey` and live arming → cannot diverge.

### 7.7 Precedence flowchart (narrative)

```
keydown
  │
  ├─ editable target? → return (no preventDefault from this hook)
  ├─ Space (no mod, no repeat)? → beginTemporaryPan; return
  ├─ mod+K? → openPalette; return
  ├─ Tab (no shift/mod/alt)? → toggleView; return
  ├─ Escape? → cancel; return
  ├─ Enter? → commit; return
  ├─ Delete|Backspace (no mod)? → deleteSelection; return
  ├─ mod+Shift+Z? → redo; return
  ├─ mod+Y? → redo; return
  ├─ mod+Z? → undo; return
  └─ no mod, no alt, letter in TOOL_BY_SHORTCUT_KEY?
        → setTool(tool); return
        else: ignore (browser default)
```

**Why order matters:** If letter map ran before Delete, no issue (different keys). If letter map ran before Escape, Escape still not a letter. Real risk is **mod chords** — letter arming must require `!mod` so Ctrl+Z does not try to interpret as tool. Live code enforces `!mod && !event.altKey`.

### 7.8 Space pan keyup

Space pan is hold-to-pan: keydown begins, keyup ends. Do not treat Space as a tool letter. Space is not in `CANVAS_TOOL_SHORTCUTS`.

---

## 8. Live repo snapshot (2026-07-10 re-read — honest)

This section is **repo fact at brainstorm time**, not a substitute for Task 00 baseline logs.

### 8.1 Authority maps — `canvasTool.ts`

Maps match phase contract (V/R/W/O/M/P/D/N/T/H + labels). Rail order `CANVAS_TOOLS`: select, pan, room, wall, opening, dimension, placement.

`runtimeToolFor` maps room→wall, opening→door, dimension→text, placement→select for runtime canvas — separate from shortcut truth; do not confuse layers.

### 8.2 Keyboard handler — `useWorkspaceKeyboard.ts`

**Current implementation is map-driven:**

- Builds `TOOL_BY_SHORTCUT_KEY` once by inverting `CANVAS_TOOL_SHORTCUTS`.  
- Letter arming: `if (!mod && !event.altKey) { const tool = TOOL_BY_SHORTCUT_KEY[key]; setTool(tool) }`.  
- Comment in file: “Letter tool arming: authority map only (no second hard-coded table)”.  
- `toolFromShortcutKey` uses the same inverted map.

**Implication:** Task 02’s historical “second hard-coded table / D→dimension” **appears already fixed in source**. Expert pass “smoking gun” describes the **bug class and product rule**, still valid as regression law. Task 01 matrix + CP-09.2 still required so it cannot regress.

### 8.3 Tests — `toolShortcutTruth.test.ts`

Exists with full `TOOL_SHORTCUT_TRUTH` table and:

- map parity  
- toolFromShortcutKey case  
- uniqueness  
- **live keydown** every letter including D/M/N/T  
- editable + disabled negatives  
- Opening O + Select (V) accessible-name contract string  

**Implication:** Task 01 preferred file largely landed. Still re-run for evidence logs under **09-**.

### 8.4 Rail — `CanvasToolRail.tsx`

Map-sourced `aria-label` / `title` / badge shortcut. `nav.pw-tool-rail` `aria-label="Canvas tools"`. Matches Task 03 “already correct strings” narrative.

### 8.5 Palette — `paletteCommands.ts`

`TOOL_IDS` subset: select, wall, door, window, text, pan — shortcuts from `CANVAS_TOOL_SHORTCUTS`. Aligns with S9 (do not rebuild palette UX for opening/dimension/room).

### 8.6 Stale chrome still open — `FeasibilityCanvas.tsx`

```
aria-keyshortcuts="V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"
```

**Omits R, O, M, P, N** (and may omit other map letters). Still donor-shaped. **Task 04 residual remains.**

Zoom keys `0 + -` still on canvas local keydown when `delegateKeyboard` is false.

### 8.7 Dual keyboard surface

`delegateKeyboard` prop on FeasibilityCanvas; OOPlannerWorkspace passes it for open3d path. Local canvas keys (Escape, zoom, legacy) gated. Phase fence: no redesign; log conflicts.

### 8.8 Rail CSS hide-tools audit (read-only)

| Rule | Behavior | Hide-tools? |
|------|----------|-------------|
| Default `.rail` | Column left rail, z-index 60 | No |
| `@media (width < 48rem)` | Row bottom bar, horizontal scroll | **Not hide** — reflow |
| `.shortcut { display:none }` under 48rem | Badge letter hidden on small width | Discoverability loss, tools remain |
| `@media print` `.rail { display:none }` | Print hide | **OK** per phase |
| Scrollbar `display:none` | Cosmetic | No |

**Likely NOTES outcome if no overlay/focus bugs:** `chrome-hide-tools: none` — confirm at 1440 + 390 in Task 05.

### 8.9 Guidance strip — `OOPlannerWorkspace.tsx`

Uses `CANVAS_TOOL_SHORTCUTS[activeTool]` in status/guidance region. After map-driven arming, active tool + letter must match. Spot-check only; fix only if local hard-code lies.

### 8.10 Evidence folder

`results/planner/world-standard-wave/` **absent** in this workspace snapshot. Owner docs claim GATE PASS artifacts elsewhere/historically. **CP-09.6 not re-proven here.** Task 00 must recreate/fill `09-shortcuts-chrome/` on the machine of record.

### 8.11 Snapshot residual matrix (brainstorm honesty)

| Item | Phase plan (2026-07-09 expert) | Live code 2026-07-10 | Residual for implementer |
|------|--------------------------------|----------------------|---------------------------|
| Map authority | Locked | Present | Guard tests only |
| D→door handler | Fix required | Map-driven (looks fixed) | Regression matrix + logs |
| M→dimension | Fix required | Map-driven (looks fixed) | Same |
| N/T bound | Fix required | Map-driven (looks fixed) | Same |
| No second letter table | Required | Present | CP-09.2 code review |
| toolShortcutTruth | Create | Exists | Run + evidence |
| Rail Label (Key) | Regression | OK | RTL optional add |
| aria-keyshortcuts | Fix | **Still stale** | **Task 04 open** |
| Palette map subset | Assert | Map-sourced | Assert in suite |
| Hide-tools | Inventory | CSS reflow ≠ hide | Task 05 NOTES |
| Evidence 09- | Required | **Missing here** | Task 00/06 pack |

### 8.12 Historical vs live narrative for NOTES writers

When writing NOTES, do **not** claim “D still arms dimension” if code is map-driven. Do claim:

1. **Historical bug class:** second table D→dimension (expert 2026-07-09).  
2. **Current code:** invert present; matrix suite present.  
3. **Residual:** aria string stale; evidence pack missing in this checkout; re-run GREEN + fill CP-09.

Paper PASS = artifacts + green tests, not “I read the invert once.”

---

## 9. Pattern library → O&O W8 decisions (binding for this phase)

### 9.1 Single source of truth

| Surface | Must read from |
|---------|----------------|
| Letter → tool arming | `CANVAS_TOOL_SHORTCUTS` inverted once |
| `toolFromShortcutKey` | Same inverted map |
| Rail aria / title / badge | `CANVAS_TOOL_LABELS` + `CANVAS_TOOL_SHORTCUTS` |
| Status guidance strip | `CANVAS_TOOL_GUIDANCE` + shortcut from map |
| Palette tool-* shortcuts | Same maps for subset tools |
| `aria-keyshortcuts` | Helper derived from maps + wired non-tools |

**Forbidden:** second hard-coded letter table; inventing letters in aria; rebinding map to match wrong handler.

### 9.2 Discoverability stack (Homestyler-class idea, O&O form)

| Layer | O&O form | When |
|-------|----------|------|
| L1 always-visible | Rail badge letter + `Label (Key)` accessible name | **W8 P0** |
| L2 status | Active tool name + shortcut in command/status strip | Present; keep honest after Task 02 |
| L3 palette | Ctrl/Cmd+K rows with shortcut field | Subset; honest |
| L4 cheat sheet | Help / `?` overlay of full map | **P1 after L1–L3 true** (not blocking if matrix green) |
| L5 canvas aria | `aria-keyshortcuts` honest list | Task 04 |

### 9.3 Always-on actions (industry grammar already in O&O)

Keep and regression-test when fixing tools:

- Space pan  
- Esc cancel  
- Enter commit  
- Delete/Backspace  
- Undo/Redo  
- Tab view toggle  
- Ctrl/Cmd+K palette  

W8 is not “only letters” — letters must not **break** always-on while landing.

### 9.4 Letters we will **not** steal from competitors this phase

| Competitor habit | O&O stance |
|------------------|------------|
| Floorplanner D=dimension | Reject — O&O D=door |
| Floorplanner M=tape | Reject — O&O M=dimension |
| Homestyler B=brush | Out of product tools now |
| Homestyler 1=plane view | Out until view matrix owned |
| Homestyler WASD roam on same plane as tool letters | Out — would collide W/D |
| RoomSketcher Q=flip door | Later placement power; not W8 rail |
| Floorplanner hold S = snap off | Optional later; not W8 letter table |
| SketchUp search Shift+S | Optional later |

### 9.5 Chrome zones — hide-tools definition (operational)

A defect is **hide-tools** only if interactive users cannot reach tools via:

1. Mouse/pointer to rail buttons, **or**  
2. Keyboard letter arming (workspace path), **or**  
3. Palette tool commands  

| Situation | Classification |
|-----------|----------------|
| Rail `display:none` at 390×844 interactive | Hide-tools **blocker** |
| Rail reflows to bottom scroller | OK |
| Shortcut badge hidden on small width | Discoverability debt; not hide if tools clickable |
| Print CSS hides rail | OK |
| Overlay modal without dismiss over rail | Hide-tools |
| Focus stuck in unnamed input swallowing keys | Hide-tools if no blur/escape path for tool keys |
| Nested main landmark only | Out (a11y residual, not P09) unless rail out of tree |

---

## 10. User journeys that W8 must not break

### 10.1 Structure keyboard path (W1-adjacent)

1. Press **W** → wall tool armed; status shows Wall (W).  
2. Draw wall segments.  
3. Press **O** → opening tool; click wall.  
4. Optional palette: **D** for door-specific legacy path.  
5. Press **V** → select.

**Fail if:** D arms dimension mid-flow; O unbound; W does something else.

### 10.2 Dimension keyboard path

1. Rail shows Dimension (M).  
2. Press **M** → dimension arms.  
3. Pick two points.  
4. Escape cancels.

**Fail if:** M noop; D arms dimension while badge says M.

### 10.3 Place keyboard path (W2-adjacent)

1. Press **P** → placement.  
2. Choose catalog item.  
3. Click canvas.  
4. Press **V** → select.

### 10.4 Delete path (W3 ownership)

1. Select object (V or click).  
2. Delete or Backspace → deleteSelection.  
3. Ctrl+Z undo.

**P09 must not:** rebind Delete; remove undo; make Delete arm a tool.

### 10.5 Palette path

1. Ctrl/Cmd+K.  
2. Run tool-door → setTool door.  
3. Shortcut column shows D.  
4. Press D outside palette → same tool.

### 10.6 Editable field path

1. Focus inventory search or property input.  
2. Type “d” / “m” / “w”.  
3. Tool must **not** change.

### 10.7 Small viewport path

1. 390 width.  
2. Rail reflows to bottom row.  
3. Tools still clickable (even if badge letter hidden).  
4. Keyboard letters still arm tools.

### 10.8 Browser smoke (optional Task 06)

On `/planner/open3d` with focus not in input:

1. Press D → status / active tool = Door (or door guidance).  
2. Press M → Dimension.  
3. Screenshot pair `06-browser-d-m.png`.  
4. Not a substitute for unit matrix.

---

## 11. Failure catalog (exhaustive classes)

### 11.1 Dual source of truth

| Symptom | Cause | Fix class |
|---------|-------|-----------|
| Map tests pass; D arms wrong tool | Second letter table | Invert only (Task 02) |
| aria lists old donor set | Hard-coded string | Helper (Task 04) |
| Rail wrong letter | Hard-coded badge | Map-source (Task 03) |
| Palette wrong letter | Hard-coded shortcut field | Map-source (S9) |

### 11.2 Partial matrix

| Symptom | Cause | Fix class |
|---------|-------|-----------|
| Only D/M fixed; N/T still noop | Partial if-table rewrite | Full invert of all map entries |
| Unique letter test fails | Two tools share key | Product decision; change map once |

### 11.3 Forbidden “fixes”

| Temptation | Why forbidden |
|------------|---------------|
| Dimension (D) label | Matches bad historical handler; fails Failures + product law |
| Remove door from map | Product needs door palette |
| Skip N/T because not on rail | Map still claims them |
| Weak tests to green | Paper PASS |
| Evidence under 08- | Folder lock |

### 11.4 Scope creep failures

| Creep | Reject with |
|-------|-------------|
| Redesign TopBar | S10 |
| RAC drawers | S10 |
| WASD roam | Out |
| Full a11y A1–A8 | Only hide-tools |
| Fabric | P02 |
| Change Delete meaning | P03 ownership |

### 11.5 Regression after green

| Regression | Guard |
|------------|-------|
| New hard-coded letter if | Code review + CP-09.2 + toolShortcutTruth |
| New tool without map letter | Uniqueness + truth table extend |
| aria drift | Helper unit test |
| CSS hide rail | Task 05 NOTES discipline |

---

## 12. Test design (W8 contract)

### 12.1 Preferred suite ownership

| Suite | Owns |
|-------|------|
| `toolShortcutTruth.test.ts` | Full id↔key↔label↔keydown matrix |
| `open3dWorkspaceKeyboard.test.tsx` | Hook behaviors + at least D/M letter matrix mirror |
| `donorParity.test.ts` | Map parity donor expectations |
| `workspaceShell.test.tsx` | Shell/map parity; optional rail RTL |

### 12.2 TOOL_SHORTCUT_TRUTH rows (must mirror product)

```
select V Select
room R Room
wall W Wall
opening O Opening
door D Door
dimension M Dimension
placement P Place
pan H Pan
window N Window
text T Text
```

### 12.3 Case matrix

| Case | Expect |
|------|--------|
| Uppercase key event | setTool correct (hook lowercases) |
| Lowercase key event | setTool correct |
| toolFromShortcutKey upper/lower | id |
| Duplicate letters in map | uniqueness fails |
| Editable input target | no setTool |
| enabled false | no setTool |
| mod+letter | no tool arm (undo/palette etc.) |
| Each non-tool chord | correct handler once |

### 12.4 What pure map tests miss

`toolFromShortcutKey("d") === "door"` can be true while `keydown "d"` still calls `setTool("dimension")` if arming uses a second table. **Live keydown is non-negotiable.**

### 12.5 Rail RTL (Task 03)

- Render rail `activeTool="dimension"` → accessible name matches `/Dimension \(M\)/`.  
- `activeTool="wall"` → `/Wall \(W\)/`.  
- No button name Dimension (D).

### 12.6 Aria helper unit (Task 04)

- Includes every unique `CANVAS_TOOL_SHORTCUTS` value.  
- Includes documented non-tool keys that are wired.  
- Does not include unknown letters (e.g. competitor B, Q) unless product owns them.

### 12.7 Evidence log names (phase)

| Log | Task |
|-----|------|
| `00-baseline-vitest.log` | 00 |
| `01-tool-shortcut-truth-red.log` | 01 |
| `02-tool-shortcut-truth-green.log` | 02 |
| `02-regression-keyboard.log` | 02 |
| `03-rail-labels.log` | 03 |
| `04-aria-palette.log` | 04 |
| `05-chrome-hide-tools.log` | 05 |
| `06-final-vitest.log` | 06 |
| optional `06-browser-d-m.png` | 06 |

Unfiltered. No silent pass. No deleted failure output.

---

## 13. Aria-keyshortcuts design (Task 04 deep)

### 13.1 Problem

Hard-coded string is donor-shaped:

```
V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -
```

Missing product map letters: **R O M P N** (and completeness for full map).

### 13.2 Target properties

1. **Derived** from `CANVAS_TOOL_SHORTCUTS` (all unique values).  
2. **Plus** non-tool keys that are **actually wired** on the surface that owns the attribute.  
3. **No** invented tool letters.  
4. Prefer pure helper `canvasKeyShortcutsAttribute()` next to maps so string cannot drift.  
5. Unit-test helper.

### 13.3 Ownership nuance for zoom keys

- Zoom `0 + -` live on **canvas local** when `delegateKeyboard` is false.  
- On open3d delegated path, workspace owns tool letters; zoom may still be canvas-local depending on implementation.  
- Helper may include zoom only as **documented non-tool** keys that the **same element** still handles.  
- Do not claim Ctrl+S if not wired on that surface.

### 13.4 Suggested composition (logical, not code)

```
[sorted or map-order unique tool letters]
+ Tab Escape
+ Control+Z Control+Shift+Z Control+Y
+ Control+K (if exposed on surface)
+ 0 + - (only if canvas attribute surface owns zoom)
```

Exact order secondary to **completeness + honesty**.

### 13.5 a11y note (from Others/06-A11Y)

Canvas should remain named surface with keyshortcuts + polite live region. Toolbar buttons named with shortcuts in the name (e.g. Wall (W)). Task 04 is honesty of keyshortcuts string, not full A1–A8 sweep.

---

## 14. Hide-tools deep dive (Task 05)

### 14.1 Proof-first protocol

1. Read CSS/shell (no edit).  
2. Document each check in NOTES with pass/fail.  
3. Edit only if hide/block proven.  
4. If none: `chrome-hide-tools: none`.

### 14.2 Viewport matrix

| Viewport | Expect rail |
|----------|-------------|
| 1440×900 | Left column rail visible |
| 1280×800 | Left column rail visible |
| 390×844 | Bottom row rail, scroll if needed, tools clickable |
| Print | Rail may hide |

### 14.3 DOM selectors (from phase)

- `nav[aria-label="Canvas tools"]`  
- `.pw-tool-rail`  

Missing mount on `/planner/open3d` = blocker.

### 14.4 Allowed fix examples

- Rail unmounted behind `disabled` with no alternative → enable or equivalent control  
- CSS interactive `display:none` → remove or fix breakpoint  
- Panel backdrop covering rail without dismiss → z-index / pointer-events  

### 14.5 Forbidden fix examples

- Rewrite TopBar  
- Vaul drawers redesign  
- Density system  
- Full landmark tree  
- Favorites labels  
- Marketing chrome  
- Invent “polish” CSS without NOTES row  

### 14.6 Discoverability vs hide

Hiding **badge letters** on small screens is **not** hide-tools if buttons remain. Optional later: always show letters on focus. Not W8 P0.

---

## 15. Dual keyboard surface deep dive

### 15.1 Why two surfaces exist

Historical donor canvas had its own keydown (draw wall, escape, undo, zoom). Workspace hook later centralized tool arming + always-on. `delegateKeyboard` gates canvas-local path to avoid double handlers.

### 15.2 P09 ownership

| Concern | Owner |
|---------|-------|
| Tool letter arming on open3d | `useWorkspaceKeyboard` |
| Zoom 0/+/- when not delegated | canvas local |
| Escape when not delegated | both possible — log if double |
| Full dual redesign | **Out** |

### 15.3 Conflict symptoms

- Press W arms wall twice / toggles  
- Escape cancels twice / noops  
- Zoom works only on one path  

**Response:** NOTES entry; minimal guard only if W8 truth broken.

### 15.4 What not to do

- Merge all keys into one god-handler this phase  
- Delete canvas zoom without product decision  
- Re-implement FeasibilityCanvas keyboard for fashion  

---

## 16. Door vs opening vs dimension (product semantics)

### 16.1 Why three related tools

| Tool | Job | Letter | Surface |
|------|-----|--------|---------|
| opening | Generic wall void / opening entity | O | Rail primary |
| door | Door-specific placement (legacy CanvasTool) | D | Palette |
| dimension | Measure annotate | M | Rail |

### 16.2 Why not merge D and O

- Product keeps distinct ids.  
- Palette still offers Door.  
- Map uniqueness: D≠O.  
- W1 journey may use opening; catalog/door tool may use door.

### 16.3 Why M is dimension (not D)

- Product law + Failures PLAN-FAIL-0413.  
- Floorplanner uses D for dimension — **irrelevant** to O&O product truth.  
- Rail already shows Dimension (M). Changing to D would match historical bug and break door.

### 16.4 runtimeToolFor vs keyboard

Opening may draw as door runtime mode; dimension may map to text runtime for canvas internals. User still presses **O** for opening tool and **M** for dimension tool. Do not “simplify” by making keyboard follow runtime aliases (would make O arm door tool id incorrectly).

---

## 17. Approach options considered (brainstorm)

### Approach A — Map invert + truth tests (RECOMMENDED / phase locked)

**Pros:** Single source; matches expert FIX; minimal surface; TDD-friendly.  
**Cons:** Does not add Help sheet yet.  
**Verdict:** **Ship this for W8.**

### Approach B — Rebind labels to match historical handler (Dimension→D)

**Pros:** Smaller code change if second table stays.  
**Cons:** Violates Failures, tests, product law; makes rail historical lie permanent.  
**Verdict:** **Forbidden.**

### Approach C — Full chrome redesign + shortcut sheet first

**Pros:** Discoverability theater.  
**Cons:** Scope creep; can ship beautiful lying sheet.  
**Verdict:** **After** Approach A green; sheet is L4.

### Approach D — Competitor keymap clone (Floorplanner letters)

**Pros:** Familiar to Floorplanner refugees.  
**Cons:** Collides product D=door; ethics; no license; thrash.  
**Verdict:** **Reject.**

### Approach E — Remove unbound tools from map (N/T)

**Pros:** “No gaps.”  
**Cons:** Deletes product tools from authority; palette lies.  
**Verdict:** **Reject.** Bind them instead.

### Approach F — Mode-dependent dual meanings (Floorplanner r)

**Pros:** Densifies letters.  
**Cons:** Harder tests; W8 chain murky; not owned.  
**Verdict:** **Out of P09.** One letter = one tool id.

---

## 18. Recommended decision set (binding summary)

1. **Authority:** `CANVAS_TOOL_SHORTCUTS` + `CANVAS_TOOL_LABELS` only.  
2. **Arming:** invert once; no second table.  
3. **Letters locked:** V R W O D M P H N T as §6.  
4. **Forbidden:** Dimension→D.  
5. **Prove:** live keydown matrix for all letters.  
6. **Aria:** derive; include all map letters + wired non-tools.  
7. **Palette:** subset honest; no forced expansion.  
8. **Chrome:** hide-tools only; proof-first.  
9. **Evidence:** `09-shortcuts-chrome/` only.  
10. **Discoverability sheet:** after truth, not instead of truth.

---

## 19. Risk register (phase + research + live)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| “Fix” by Dimension (D) label | Med | High | Forbidden — Failures/tests |
| Partial fix only D/M | Med | High | Full matrix Task 01 |
| Scope creep into full 2A | High | Med | Task 05 allowlist |
| Break Delete/undo | Med | High | Preserve non-tool; regression logs |
| Palette door vs rail opening confusion | Low | Low | Both valid; D vs O |
| Dual keyboard thrash | Med | Med | Log only unless W8 broken |
| Evidence folder `08-` | Med | High | Canonical **09-** only |
| Competitor letter envy | Med | High | Product map locked |
| Claiming W8 PASS without `09-` logs | High | High | CP-09.6 hard stop |
| aria invents letters | Med | Med | Helper only map + wired |
| Two agents write keyboard package | Med | High | One writer rule |
| Re-implement invert when already done | Med | Low | Snapshot honesty; verify first |
| Owner GATE PASS thin notes | High | High | Re-prove artifacts |
| WASD later collides W/D | Low (future) | High | Mode fence when roam ships |

---

## 20. Anti-copy fence (P09-specific)

### Allowed

- Industry zone diagram **concepts**  
- Always-on keys (Esc, Delete, Undo, Space pan) as CAD-lite norms  
- Help/`?` cheatsheet **pattern** with **our** content  
- Measure-as-first-class tool **idea** (product depth later)  
- Mode-aware tools later  
- Hover/focus shortcut labels pattern (SketchUp-class)  
- Ctrl+K palette pattern  

### Forbidden

- Homestyler / Floorplanner / RoomSketcher / P5D icons, colors, tool order pixels  
- Scraped help/manual prose as product strings  
- Competitor key tables as O&O map  
- Authenticated reverse-engineering of closed apps for keys  
- Claiming “works like Homestyler shortcuts” in marketing  
- Shipping research PNG/JSON as product assets  
- P5D app.js / editor HTML  
- Floorplanner mega-tab trade dress  
- RoomSketcher blue toolbar identity  

**Rule of thumb:** designer should say “O&O shortcuts are honest” — never “O&O is Homestyler’s keys.”

---

## 21. Suggested NOTES.md skeleton (for executor)

When Task 00/06 runs, NOTES should include **no TBD**:

```markdown
# 09-shortcuts-chrome NOTES

## Meta
- date:
- HEAD:
- agent:
- machine:

## Baseline (Task 00)
- vitest files run:
- pass/fail counts:
- log path: 00-baseline-vitest.log

## Historical smoking gun (law)
- Second hard-coded letter table: D→dimension; M/N/T unbound (expert 2026-07-09)
- Product law: D=door M=dimension O=opening N=window T=text …
- Forbidden: Dimension→D rebind
- Single source: CANVAS_TOOL_SHORTCUTS

## Live residual honesty (re-proved this run)
- Handler map-driven? yes/no + file:line
- toolShortcutTruth present? yes/no
- aria-keyshortcuts value: (paste)
- aria residual: stale|fixed
- evidence folder created: yes

## Truth table results (Task 01–02)
| id | key | map | resolver | keydown setTool | label |
| select | V | | | | |
| … all 10 rows … |

## Rail regression (Task 03)
- Dimension (M) accessible name: pass/fail
- Wall (W): pass/fail

## Aria + palette (Task 04)
- helper used? yes/no
- aria string final:
- palette tool-* shortcuts match map? yes/no

## Chrome hide-tools (Task 05)
- 1440: rail reachable?
- 390: rail reachable?
- overlay?
- focus trap?
- chrome-hide-tools: none | list of fixes

## Dual keyboard
- none | conflict note

## W8
- PASS | FAIL
- CP-09.1 … 09.6 checklist with data refs

## Commits
- hashes + messages

## Failures
- residual logged to Failures.md? path
```

---

## 22. Agent execution brief (for implementer — not brainstorm)

**Skills:** `/using-superpowers` · TDD · verification-before-completion · systematic-debugging · chrome-devtools only if browser unlock for hide-tools/smoke  

**Order:** 00 → 01 → 02 → 03 → 04 → 05 → 06  

**First action honesty:** Read live `useWorkspaceKeyboard.ts`. If invert already present, **do not rewrite for sport** — establish baseline GREEN/RED truth, then residual Task 04/05/06.

**Done definition:**

1. Every map letter arms correct tool under live keydown tests  
2. No second letter table  
3. Rail + palette + aria agree with map  
4. Hide-tools none or minimal fix with NOTES proof  
5. Artifacts under `results/planner/world-standard-wave/09-shortcuts-chrome/` unfiltered  
6. CP-09 marked from data  

**Do not:** open P10 world-standard claims from this alone; do not redesign shell; do not invent competitor keys; do not force-push; do not purchase tools.

**Parallelism:** Only one writer on keyboard package. Other agents may run non-overlapping phases.

**Commits (landable slices):**

1. `fix(planner): W8 keyboard handlers match CANVAS_TOOL_SHORTCUTS (D=door, M=dimension)` — if still needed  
2. `fix(planner): W8 tool rail labels match shortcut authority` — if needed  
3. `fix(planner): W8 aria-keyshortcuts and palette shortcuts match maps`  
4. `fix(planner): unblock canvas tool chrome (W8/2A hide-tools only)` — if needed  

---

## 23. Edge cases checklist (exhaustive)

| Edge | Expected |
|------|----------|
| Caps Lock on | letters still lowercased via `event.key.toLowerCase()` |
| Shift+letter | may produce upper key; lowercasing still maps |
| Alt+letter | no tool arm (`!event.altKey`) |
| Ctrl+letter | no tool arm; mod chords first |
| Meta+letter (Mac) | treated as mod |
| Repeat Space | no re-begin pan every repeat |
| Space keyup after blur | end pan if active |
| ContentEditable div | editable guard |
| Select dropdown focused | editable guard |
| Multiple hooks mounted | avoid dual workspace hooks (product structure) |
| Fast press D then M | two setTool calls, last wins |
| Tool already active | setTool again OK (idempotent enough) |
| Unknown letter Q | no setTool |
| Browser shortcut Ctrl+T | not our problem if we do not preventDefault on unbound |
| IME composition | if issues, later; not W8 invent |
| Print media | rail may hide OK |
| SSR | hook is client-only (`use client`) |

---

## 24. Acceptance scenarios (Gherkin-style, no code)

### Scenario: Dimension badge honesty

```
Given the tool rail is visible
And Dimension shows accessible name "Dimension (M)"
When the user presses key "m" with focus not in an input
Then setTool is called with "dimension"
And the guidance strip shows dimension guidance and letter M
```

### Scenario: Door not dimension

```
Given the product map binds D to door
When the user presses key "d"
Then setTool is called with "door"
And setTool is never called with "dimension" for that press
```

### Scenario: Uniqueness

```
Given CANVAS_TOOL_SHORTCUTS
Then every shortcut letter is unique across tools
```

### Scenario: Editable safety

```
Given focus is in an input
When the user types "d"
Then the active tool does not change
```

### Scenario: Aria honesty

```
Given FeasibilityCanvas aria-keyshortcuts
Then the string includes every letter from CANVAS_TOOL_SHORTCUTS
And does not include letters with no owner
```

### Scenario: Hide-tools none

```
Given viewports 1440 and 390
Then canvas tools are reachable by pointer
And letter arming still works when focus is not editable
```

---

## 25. Cross-links to other Idiots2 / phase reports

| Report / phase | Link to P09 |
|----------------|-------------|
| P03 select-delete | Delete/Backspace ownership; do not thrash |
| P04 orbit | Tab toggleView; not letter tools |
| P07 draw-place journey | Keyboard path for W/O/P should match mouse |
| P08 mesh | No keyboard |
| P10 handover | Consumes 09- pack |
| P01 product truth | May have inventoried shortcut lies historically |

---

## 26. Research evidence index (absolute paths)

### Homestyler

| Path | Use |
|------|-----|
| `D:\websites\homestyler.com\report\INSPIRATION.md` | Primary synthesis; scrape honesty; WASD/B/1; five-zone |
| `D:\websites\homestyler.com\raw\homestyler.com-forum-view-1613229904600383490.md` | Interface five parts; WASD roam |
| `D:\websites\homestyler.com\raw\homestyler.com-forum-view-1560174293289902081.md` | Help→Shortcuts; B brush; Arc Array + 1 |
| `D:\websites\homestyler.com\raw\homestyler.com-article-floorplanner-mastering-keyboard-shortcuts-in-interior-design-software.md` | **Discard for keys** — SEO fluff |
| `D:\websites\homestyler.com\raw\support.homestyler.com-hc-en-us.md` | **Discard** — Taobao |

### Planner 5D

| Path | Use |
|------|-----|
| `D:\websites\planner5d.com\report\TOOLBARS.md` | Zones; 2D/3D tool roles; WASD walkthrough |
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Funnel; editor signals |
| `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` | Anti-copy binding |
| `D:\websites\planner5d.com\report\toolbar-mock\index.html` | Original mock study only |

### Floorplanner

| Path | Use |
|------|-----|
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | §2.7 shortcuts grammar; W8 mapping table |
| `D:\websites\floorplanner.com\raw\cdn.floorplanner.com-static-brochures-FloorplannerManualEN.pdf.md` | Manual §12 full table |
| `D:\websites\floorplanner.com\raw\cdn.floorplanner.com-static-brochures-Floorplanner+editor+manual+version+180219.pdf.md` | Older keyboard chapter |

### RoomSketcher

| Path | Use |
|------|-----|
| `D:\websites\roomsketcher.com\report\INSPIRATION.md` | W8 partial; Q flip; toolbar 404 honesty |
| `D:\websites\roomsketcher.com\raw\…360000808925…Add-Doors…` | Flip hotkey path |

### World-standard comparison

| Path | Use |
|------|-----|
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Pattern → O&O |
| `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\REPORT.md` | Scores; winners; O&O chrome pattern |
| `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\SCORES.csv` | shortcuts column data |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Toolbar winner P5D; O&O ~2 |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-benchmark.md` | Ctrl+K; hover shortcuts; rails |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-plann-compare.md` | Adopt/reject |

### Plans Research + phase

| Path | Use |
|------|-----|
| `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md` | P09 pack routing |
| `D:\OandO07072026\Plans\Research\RESULTS-MAP.md` | **09-shortcuts-chrome/** lock |
| `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE.md` | Phase sizing; thrash risks |
| `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE-2.md` | Parallel fill order |
| `D:\OandO07072026\Plans\phases\P09-shortcuts-chrome\P09-shortcuts-chrome.md` | Execute card |
| `D:\OandO07072026\Plans\phases\P09-shortcuts-chrome\P09-suggestions.md` | S1–S10 |
| `D:\OandO07072026\Plans\phases\P09-shortcuts-chrome\06-ui-shortcuts.md` | Expert FIX verdict |
| `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` | W8 one-line gate |

### Live code (re-prove)

| Path | Use |
|------|-----|
| `site/features/planner/open3d/editor/canvasTool.ts` | Maps |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Handler |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` | Rail chrome |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | aria + dual keyboard |
| `site/features/planner/open3d/lib/commands/paletteCommands.ts` | Palette |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Guidance strip |
| `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | W8 matrix |
| `site/features/planner/open3d/editor/canvas-tool-rail.module.css` | Hide-tools CSS |

---

## 27. Glossary

| Term | Meaning |
|------|---------|
| **W8** | Gate: tool/shortcut labels match handlers |
| **CP-09** | Checkpoint for P09 evidence completeness |
| **Authority map** | `CANVAS_TOOL_SHORTCUTS` / `CANVAS_TOOL_LABELS` |
| **Invert** | Build letter→tool table from map once |
| **Smoking gun** | Import map but arm tools via second hard-coded table |
| **Hide-tools** | Chrome defect that prevents reaching tools |
| **Rail** | `CanvasToolRail` left/bottom tool strip |
| **Palette** | Ctrl/Cmd+K command palette subset |
| **delegateKeyboard** | Canvas prop; when true, workspace owns more keys |
| **FOLDER-LOCK** | RESULTS-MAP rule: W8 evidence under `09-` only |
| **Discoverability** | User can learn keys (badge, Help sheet, aria) |
| **Honesty** | What is shown equals what keydown does |
| **Paper PASS** | Claim without artifacts / with filtered tests |

---

## 28. Bottom line (brutal)

1. **W8 is honesty, not chrome fashion.** One map must drive keys, labels, palette, and aria.  
2. **Research proves discoverability is table stakes** (Homestyler Help sheet; Floorplanner published matrix) — **not** which letter means dimension. O&O owns **D=door · M=dimension**.  
3. **Historical smoking gun:** hard-coded handler vs map. Live source **looks fixed** to map invert; **aria-keyshortcuts still lies by omission**; evidence pack **must be re-proven** under `09-shortcuts-chrome/`.  
4. **Do not “fix” by adopting Floorplanner’s D=dimension.** That is competitor envy dressed as consistency.  
5. **Hide-tools is narrow.** Reflow ≠ hide. Print hide OK. No CSS without NOTES proof.  
6. **P09 done only when CP-09.1–09.6 are data-green** — owner GATE PASS slogans without folder artifacts do not count in a clean checkout.  
7. **No code in this brainstorm.** Implementer follows execute card Tasks 00–06 with TDD and unfiltered logs.  
8. **One letter, one tool, one label, one setTool.** Anything less is a lie with a green unit somewhere else.  
9. **S1 is dead.** Evidence is **09-**, not 08-. Mesh owns 08.  
10. **Inspiration is not cheating. Cloning expression is. Lying shortcuts are product malpractice.**

---

## 29. One-page implementer contract (tear-off)

```
W8 CONTRACT
- Authority: CANVAS_TOOL_SHORTCUTS + CANVAS_TOOL_LABELS
- Letters: V select · R room · W wall · O opening · D door · M dimension
           · P placement · H pan · N window · T text
- Arm: invert map once; no second table
- Forbidden: Dimension→D
- Prove: toolShortcutTruth live keydown for ALL letters
- Rail: Label (Key) from maps only
- Aria: derive from map + wired non-tools only (fix stale V W D T H…)
- Palette: subset shortcuts = map; no forced full PlannerTool list
- Chrome: hide-tools only; proof-first NOTES; reflow ≠ hide
- Evidence: results/planner/world-standard-wave/09-shortcuts-chrome/ ONLY
- CP-09.1–09.6 data-green before W8 PASS
- Skills: /using-superpowers · TDD · verification-before-completion
- Order: 00 → 01 → 02 → 03 → 04 → 05 → 06
- First: re-read live handler; verify before rewrite
- No product code from this brainstorm report
```

---

## 30. Appendix A — Floorplanner manual §12 (research quote form)

**Source:** `FloorplannerManualEN.pdf.md` (abstract; do not ship as product help).

- `?` : Show all shortcuts in sidebar  
- Exit mode: esc  
- Delete: del or backspace  
- Disable snap: s (hold)  
- Rectangle select: shift + drag  
- PAN: spacebar  
- Center view: `.`  
- Rotate 5°: r l (selected)  
- Rotate 15°: R L (selected)  
- Save: CMD+s  
- Undo/Redo: CMD+z/y  
- Draw wall: w  
- Draw room: r  
- Draw surface: f  
- Add text: t  
- Draw dimension: d  
- Draw line: l  
- Tape measure: m  
- Minimap: `  
- Floors: < >  

**O&O adopt list from this appendix:** Esc, Delete, Space pan, Undo/Redo, tool-letter *idea*, `?` help *idea*.  
**O&O reject list:** letter identity for d/m, mode dual-meanings without ownership, brand copy.

---

## 31. Appendix B — Homestyler confirmed keys only

| Key | Action | Source quality |
|-----|--------|----------------|
| WASD | Roam move | High (forum) |
| Arrows | Roam move | High |
| B | Material Brush | High (forum) |
| 1 | Plane/2D view | High (forum) |
| Help→Shortcut Keys | Discoverability UI | High pattern; content unscaped |

Everything else claimed in SEO fluff: **no keys given → discard**.

---

## 32. Appendix C — Phase task checkbox mirror (planning state)

> Checkboxes live in execute card; this appendix is a **mirror for brainstormers**, not live progress tracking.

- [ ] 00.1 evidence dir  
- [ ] 00.2 baseline vitest  
- [ ] 00.3 NOTES baseline  
- [ ] 00.4 P03–P08 ownership  
- [ ] 01.1–01.8 truth table RED  
- [ ] 02.1–02.7 GREEN handlers  
- [ ] 03.1–03.6 rail regression  
- [ ] 04.1–04.6 aria/palette  
- [ ] 05.1–05.6 hide-tools  
- [ ] 06.1–06.4 evidence + CP-09  

---

## 33. Appendix D — CP-09 data checklist (print for NOTES)

| ID | Data needed | Path |
|----|-------------|------|
| CP-09.1 | Vitest green for all 10 letters keydown | `02-` or `06-` log |
| CP-09.2 | Code review: no second table | file:line NOTES |
| CP-09.3 | Rail RTL or truth accessible name asserts | `03-` log |
| CP-09.4 | Aria helper unit + palette assert | `04-` log |
| CP-09.5 | Hide-tools inventory | NOTES section |
| CP-09.6 | Folder exists with unfiltered logs | `09-shortcuts-chrome/` |
| CP-09.7 | Commit hashes | NOTES |

---

## 34. Appendix E — Scoring posture for O&O after honest W8

Research-day O&O shortcuts score: **2**.  

After true W8 (map + keydown + labels + aria + evidence):

| Dimension | Expected posture |
|-----------|------------------|
| Shortcuts honesty | Can rise toward 4–5 **behaviorally** without cloning Homestyler chrome |
| Discoverability sheet | Optional L4 still needed for “Help class” 5 |
| Mobile tools | Separate; reflow may stay 1–2 until touch sheet |

W8 alone does not make O&O win MASTER-CHART toolbar column. It makes O&O **not a liar**. That is the gate.

---

## 35. Appendix F — What this report is not

- Not a PASS certificate  
- Not product code  
- Not a license to re-scrape  
- Not a competitor key table to ship  
- Not permission to rename evidence folders  
- Not P10 handover  
- Not a full a11y audit  
- Not a chrome redesign brief  

---

## 36. Final seal

**Deliverable path:** `D:\OandO07072026\Idiots2\P09-shortcuts-chrome\REPORT.md`  
**Mode:** Brainstorm / research synthesis only  
**Gate focus:** **W8**  
**Research order:** D:\websites → Plans/Research → Plans/phases/P09-shortcuts-chrome  
**No TBD left in this report.** Residuals are named (aria stale; evidence pack absent in checkout; handler likely already invert) with concrete next actions for executors.

**End of Idiots2 P09 REPORT.**
