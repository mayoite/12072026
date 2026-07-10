# UI Expert — CP-00 / W0 foundation (open3d chrome & start trust)

**Seat:** UI/UX expert (interaction, visual, IA, a11y) — **no code**  
**Date:** 2026-07-10  
**Phase:** CP-00 / W0 — product foundation as it affects what users **see and trust** at “start” and in the **chrome shell** of the open3d planner  
**Audience:** head agent, foundation / early-gate implementers, later CP owners  
**Evidence consulted (paths verified):**

| Source | Path / note |
|--------|-------------|
| Unlock + north star | `Plans/trustdata/00-START.md` |
| Product / buyer context | `ayushdocs/18-PRODUCT-CONTEXT.md` |
| Honest “PASS ≠ finished” | `results/planner/world-standard-wave/00-rebaseline/HONEST-STATUS.md` |
| Gate residual map | `results/planner/world-standard-wave/TRUTH-LOCK.md` |
| A11y live capture | `results/planner/a11y-open3d/REPORT.md` |
| Export honesty | `results/planner/export-honesty/NOTES.md` |
| Mesh bar honesty | `results/planner/world-standard-wave/08-mesh-quality/NOTES.md` |
| Shortcuts chrome | `results/planner/world-standard-wave/09-shortcuts-chrome/NOTES.md` |
| Live chrome (read only) | `site/features/planner/open3d/editor/TopBar.tsx`, `workspaceStatusLabels.ts`, tool rail / panels |

**Rule for this doc:** Patterns and acceptance only. **No brand marketing copy.** No redesign specs for later epics. Gate language must distinguish **gate PASS** vs **buyer-trust finished**.

---

## 1. Global UI bar for B2B furniture / space planners

These are **category patterns** (Steelcase / Haworth / HON / Featherlite–class systems software, plus serious facilities tools). They are the **minimum visual–interaction bar** a facilities buyer uses to decide “this is a tool, not a demo.”

### 1.1 Shell contract (always-on chrome)

| Pattern | Expectation |
|---------|-------------|
| **Single primary workspace frame** | One clear “I am in the plan” surface: top chrome + canvas + rails. No competing empty shells or marketing chrome inside the editor. |
| **Mode truth** | 2D plan vs 3D review is explicit, mutual exclusive, and **preserves placement pose** when toggled. |
| **Tool truth** | Active tool is always visible (rail + status). Shortcut labels match live handlers (no “D = door in map, D = dimension in keydown”). |
| **Selection truth** | Selection is obvious on canvas **and** mirrored in properties / status (“Wall selected”, “3 furniture selected”). Empty selection states are intentional, not broken. |
| **Persistence truth** | Save status names the **actual** durability: local draft vs cloud. Never green-check “Saved” if only memory or a non-durable store. |
| **Export honesty** | Menu only lists formats that work. Unsupported formats are absent or clearly **unsupported** — never “coming soon” that looks ready. |
| **Catalog → place** | Inventory reads as products/systems (name, size language), not as a bag of unlabeled boxes. Place feedback is immediate (ghost / stamp / count). |
| **Scale language** | Units (mm/in), zoom, snap, and wall/furniture counts live in a stable status strip. Facilities users orient by numbers first. |
| **Empty plan ≠ empty product** | First open shows a **guided empty state** (what to do next), not a void with dead icons. |

### 1.2 Visual craft bar (B2B, not consumer game)

| Pattern | Expectation |
|---------|-------------|
| **Dense but calm** | Enterprise density: many controls, low visual noise. Hierarchy by weight/position, not rainbow chrome. |
| **2D symbol literacy** | Plan symbols read as furniture categories at typical zoom (desk, storage, partition). Outline + footprint fidelity beats decorative icons that lie about size. |
| **3D legibility > pretty** | Multipart silhouettes (toe / carcass / door; desk / legs / stretchers) at three-quarter view. Materials distinct enough for finish family, not photoreal. |
| **No apology geometry** | Single featureless boxes read as “prototype, not manufacturer.” Readable parts are the UI of trust in 3D. |
| **Consistent hit targets** | Icon tools: ≥44px touch-friendly where mobile is claimed; desktop still ≥32px with clear focus rings. |
| **Status over flourish** | Progress, save, errors, and guest mode are status language first; animation second. |

### 1.3 Interaction bar

| Pattern | Expectation |
|---------|-------------|
| **Direct manipulation** | Draw wall, place product, select, delete, undo — no modal gauntlet for the spine journey. |
| **Keyboard parity** | Power-user shortcuts for tools, undo/redo, zoom; labels on controls match bindings. |
| **Fail closed** | Broken asset / missing SVG / failed save → explicit error region or toast; never silent blank slot. |
| **Guest vs member** | Guest path is **full enough to try the journey**, labeled as local/draft; no fake cloud sync. |

### 1.4 Trust bar tied to O&O north star

From product context: premium **systems** furniture, multi-day recon, path to **BOQ/quote**, not photoreal race.

UI success for foundation = buyer believes:

1. This plan’s **geometry and counts** are real enough to iterate.  
2. Products are **systems/SKU-shaped**, not random 3D toys.  
3. Save/export will not **lose or lie** about durability.  
4. 2D and 3D are the **same plan**, not two disconnected demos.

---

## 2. What “unlocked but unfinished” feels like to a facilities buyer

**W0 implementation unlock** means agents may build. It does **not** mean the buyer should feel “product shipped.” Honest status already says gate PASS ≠ finished.

### 2.1 Buyer mental model

A facilities / interiors buyer (or O&O internal designer acting for them) opens a planner expecting:

- “I can lay out this small office today and come back tomorrow.”  
- “These desks match our system sizes.”  
- “If it says Saved / Export / 3D, those words mean what my last vendor tool meant.”

### 2.2 How “unlocked unfinished” lands emotionally

| What they see | What they feel | Business risk |
|---------------|----------------|---------------|
| Full chrome (top bar, inventory, tools, properties, status) with thin behavior behind it | “Looks enterprise; acts like a prototype” | **Credibility collapse** — worse than a sparse MVP that is honest |
| “Saved locally” / guest draft vs competitor’s cloud | Acceptable **if** labeled; betrayal if they assumed cloud | Lost work → never return |
| Catalog names without readable plan symbols | “I can’t present this to the client” | Stuck in designer screenshots elsewhere |
| 3D as colored boxes | “Not manufacturer software” | Compared unfavorably to $40k vendor stack |
| Export menu that once promised PDF/PNG theater | “They ship fake menus” | Trust debt long after fix |
| Nested duplicate regions / odd heading order (invisible to mouse users) | Power users with AT or corporate a11y audits flag it | Procurement / IT veto |
| Status that says Ready / Saved while canvas is empty or assets 404 | “UI is lying” | Immediate exit |

### 2.3 The critical distinction for agents

- **Unlocked** = permission to implement.  
- **Unfinished** = buyer still should **not** be told the product is done.  
- **Chrome density without foundation honesty** is the highest-risk UI failure mode for this phase: it **looks** like Approach C shipped while Approach A spine is still the product bar.

**UI implication for W0:** Prefer **honest incomplete** (local save, limited export, multipart but still boxy mesh labeled as systems v0) over **theatrical complete** (green checks, pretty empty panels, missing symbols painted as ready).

---

## 3. Failures of thin foundation

These are the failure modes that destroy trust at start/chrome even when unit tests are green.

### 3.1 Empty chrome

**Symptoms**

- Top bar populated with Save / Export / Prefs / view toggle, but canvas empty with no next-step coach.  
- Inventory / Properties regions present with “No selection” / sparse lists that feel like scaffolding.  
- Dock chrome (undock / minimize / close) on panels that barely have content — **window manager UI without job content**.  
- Status strip counts (walls, tool, zoom) technically true but emotionally empty.

**Why it fails for B2B**

Facilities buyers scan the **frame** in 3 seconds. Dense empty chrome reads as “unfinished SaaS skin,” not “focused MVP.”

**Foundation fix direction (not redesign)**

- Empty states must teach **one next action** (draw room/walls, place from inventory).  
- Hide or demote controls that do nothing useful on a blank plan (don’t remove spine tools).  
- Prefer one strong catalog row over ten placeholder categories.

### 3.2 Lying status

**Symptoms**

- Green check “Saved” without durable store, or without saying **locally**.  
- “Ready” that implies cloud/member sync for guests.  
- Export entries for formats that fail closed only after click.  
- Shortcut tooltips/labels that disagree with keydown (historical W8 class bug: map vs handler).  
- Autosave status language diverging between top bar chip and footer strip.  
- “Modified” without recoverable undo path, or undo disabled while history exists (or reverse).

**Why it fails**

Trust is binary in status chrome. One lie and every other number (dimensions, BOQ) is suspect.

**Known good patterns already in repo (preserve / extend)**

- `workspaceStatusLabels.formatAutosaveStatus` — explicit “Saved locally” / “Guest session (local)”.  
- TopBar save chip — “Saved locally” when synced.  
- Export honesty slice — guest export limited to JSON/BOQ; preflight marks unsupported formats.

**Still thin if**

- Any surface still implies cloud, ERP, PDF/PNG, or “quote cart” without a real path.  
- Error save state is not prominent (toast-only, easy to miss).

### 3.3 Missing symbols / SVGs

**Symptoms**

- Place succeeds in document model but canvas shows blank, fallback rect, or 404 asset.  
- Catalog thumbnail ≠ plan footprint ≠ 3D massing.  
- Admin/publish path can leave planner reading unpublished or empty descriptor.  
- Zoom-in reveals “block” with no door/desk literacy.

**Why it fails**

In systems furniture, **2D symbol + footprint is the contract** with drawings and BOQ. Missing SVG is not a polish bug; it is a **catalog integrity** failure visible in the main work surface.

**Foundation UI criteria**

- Fail **closed and visible**: broken symbol shows error/fallback badge with product name, not silent void.  
- Catalog card and placed instance share identity (name + size language).  
- Gate evidence for symbols must include **screenshot literacy**, not only compile pass.

### 3.4 Boxy 3D

**Symptoms**

- Single `BoxGeometry` “apology” furniture.  
- Door mass covering toe-to-top; height overshoot vs SKU.  
- 3D mode looks like a different product than 2D plan.  
- Orbit works but silhouette still reads as Minecraft inventory.

**Why it fails**

Buyer judges manufacturer credibility in 3D in under five seconds. W7 bar (readable toe/carcass/door, workstation multiparts) is the **minimum UI** of mesh quality — still admitted **boxy residual** on TRUTH-LOCK. That residual is honest; shipping it as “3D complete” is not.

**UI acceptance language**

- Pass: “modular readable parts at three-quarter.”  
- Not pass: “photoreal” or “handles/hardware.”  
- Fail: undifferentiated boxes or 2D/3D identity split.

### 3.5 Compound failure (worst)

Empty chrome **+** lying status **+** missing symbols **+** boxy 3D = **demo theater**.  
Gate folders can still say PASS. Buyer still leaves. HONEST-STATUS is correct to call this out; UI gates must too.

---

## 4. Raised UI acceptance criteria for W0 / foundation and early gates

Attach these to **W0 foundation**, **start/chrome**, and **early W-gates** (W1–W2 journey, W5–W6 save honesty, W7 mesh bar, W8 shortcuts). They raise the bar **without** requiring a visual redesign program.

### 4.1 Start / first paint (W0 + journey)

| ID | Criterion | Proof idea |
|----|-----------|------------|
| **UI-S1** | First interactive paint shows **one** primary workspace (not triple competing mains in the a11y tree). | A11y snapshot: single `main` named for planner workspace |
| **UI-S2** | Guest vs member (or guest-only) is visible within chrome without digging. | Screenshot + status copy includes local/guest |
| **UI-S3** | Empty plan has a **next-step** empty state (draw or place), not only blank canvas + full chrome. | Screenshot of first open |
| **UI-S4** | No console errors that imply hydration identity thrash for nominal desktop viewport (dev noise excluded). | Console capture on happy path |
| **UI-S5** | Skip link reaches a real main content target. | Keyboard only |

### 4.2 Chrome shell honesty

| ID | Criterion | Proof idea |
|----|-----------|------------|
| **UI-C1** | Save status always includes durability scope when saved (`locally` until cloud exists). | TopBar + status labels match |
| **UI-C2** | Unsaved / saving / error are visually distinct (not color-only: text + optional icon). | States matrix screenshots |
| **UI-C3** | Export menu ⊆ formats that succeed for that persona (guest/member). | Menu inventory + export preflight tests |
| **UI-C4** | View mode control is a true radiogroup (2D/3D) with selected state exposed to AT. | A11y tree |
| **UI-C5** | Undo/Redo disabled state matches history truth. | Place → undo → disabled when empty |
| **UI-C6** | Tool rail active tool matches canvas tool and status strip tool label. | After each tool click + shortcut |

### 4.3 Early product gates (attach to W1–W8 as UI bars)

| Gate | Raised UI criterion |
|------|---------------------|
| **W1** draw | Walls/doors readable on canvas at default zoom; tool + status update live |
| **W2** place | ≥2 products; **Block2D / symbol readable**; no silent 404; catalog name matches selection |
| **W3** select/delete | Selection chrome (highlight + properties + status) agree; delete clears all three |
| **W4** 2D↔3D | Toggle does not “reset story”; orbit affordance discoverable; same entity set |
| **W5** save/reload | After reload, plan name + entity counts + selection-capable canvas match; status returns to saved-local |
| **W6** honesty | **No** cloud/sync wording that exceeds implementation |
| **W7** mesh | Multipart readable silhouette; no single apology box for cabinet-v0 / systems v0 desk |
| **W8** shortcuts | Every labeled shortcut in UI/help equals live handler (map-driven only) |

### 4.4 Non-negotiable “anti-theater” criteria

1. **No status green for vapor features.**  
2. **No menu items for vapor formats.**  
3. **No catalog cards that place nothing / place invisible geometry.**  
4. **No “PASS” language in owner-facing UI copy** — that is process language, not product chrome.  
5. **Gate evidence must include at least one human-readable screenshot** for chrome/status claims, not only unit logs.

### 4.5 What “raised” means operationally

- Historical folder PASS can remain **gate artifact**.  
- New work must meet these UI criteria or list them as **open residuals** (TRUTH-LOCK style), not silent.

---

## 5. A11y / labeling / hierarchy expectations

Grounded in live open3d capture (`results/planner/a11y-open3d/REPORT.md`) and open3d editor patterns (named tool buttons, canvas name, local save labels).

### 5.1 Landmark & structure

| Expectation | Detail |
|-------------|--------|
| **One `main`** | Planner workspace is the sole primary main. Nested layout shells must not each expose `main`. |
| **Named regions** | Inventory, catalog, canvas tools, drawing canvas, properties — unique accessible names (no duplicate “Inventory panel” outer+inner without distinction). |
| **Banner / contentinfo optional** | Top bar as header/`sectionheader` and status as footer is OK if roles are consistent; avoid unlabeled complementary islands. |
| **Heading order** | One `h1` plan title; panels use `h2` then `h3` — do not skip from `h1` to `h3`. |

### 5.2 Control labeling

| Expectation | Detail |
|-------------|--------|
| **No unnamed buttons** | Icon-only controls require `aria-label` including shortcut when relevant: `Select (V)`. |
| **No double names** | Search must not expose “Search catalog… Search catalog…” (label + aria-label collision). |
| **List context** | Repeated actions: `Add {product name} to favorites`, not generic “Add to favorites” only. |
| **Form association** | Visible labels programmatically tied (`htmlFor` / wrap); fix Chromium “no label associated” issues. |
| **Menus** | Export / floor / unit / prefs menus: trigger name + item names; don’t rely on icon alone. |
| **Toggle panels** | Inventory/properties toggles state should be conveyable (`aria-pressed` or expanded where applicable). |

### 5.3 Canvas & live regions

| Expectation | Detail |
|-------------|--------|
| **Named canvas** | e.g. “Floor plan drawing surface” with description of tool, snap, counts. |
| **Keyboard shortcuts advertised** | `aria-keyshortcuts` or equivalent help that **matches** handlers (W8). |
| **Polite live region** | Tool / snap / selection changes announced without flooding (debounce if needed). |
| **3D viewer** | Must have an accessible name and mode context (“3D view”); orbit instructions available as text, not hover-only. |

### 5.4 Status & honesty (a11y angle)

| Expectation | Detail |
|-------------|--------|
| **Status not color-only** | Saved / Modified / Error include text; icons `aria-hidden` when redundant. |
| **Error priority** | Save failed / asset failed should be assertive or clearly focused, not only polite log. |
| **Guest session** | Screen reader users hear “local” / “guest” in status, not only sighted chip color. |

### 5.5 Focus & keyboard

| Expectation | Detail |
|-------------|--------|
| **Visible focus** | All chrome controls show focus ring against both light/dark planner themes. |
| **Focus order** | Logical: skip → top bar → tools → canvas → inventory/properties (or documented dock order). |
| **Dialogs** | Command palette and session dialogs trap focus; Escape closes; return focus to trigger. |
| **Disabled meaning** | Disabled Undo/Redo not focus-trapped enigmas; still discoverable in tab order or skipped consistently. |

### 5.6 Minimum a11y gate for foundation

- **Unit:** label-in-name / status label tests stay green.  
- **Live:** at least one fresh a11y snapshot or Lighthouse pass on `/planner/open3d` before claiming a11y closed (currently residual: unit half, LH not fresh per HONEST-STATUS).  
- **Defect class P0:** unlabeled critical actions, broken skip target, multiple mains, status lies.  
- **Defect class P1:** heading skips, duplicate region names, double-labeled search.

---

## 6. What NOT to redesign yet (scope)

CP-00 / W0 UI expert seat is **foundation trust + chrome honesty**, not a visual system overhaul.

### 6.1 Explicitly out of scope now

| Do not redesign | Why wait |
|-----------------|----------|
| Full marketing / landing visual system | Separate from open3d workspace trust |
| Fabric full-stage chrome parity (Approach B/C) | Approach **A** = journey first; Fabric is destination later |
| Photoreal materials, HDRI, hardware handles | Success metric is BOQ/quote path; W7 residual is known boxy |
| Multiplayer presence, comments, CRM shells | Explicit out of scope while W red / product unfinished |
| Mobile-first entire IA reflow | Desktop facilities journey is the north star; keep mobile from breaking, don’t redesign |
| Brand-new icon language / illustration set | Fix missing/broken assets first; don’t reskin |
| Docking system novelty (floating CAD-style layouts) | Current docking is enough if content is honest; polish later |
| AI advisor as primary IA | Advisor is secondary; spine is draw/place/select/save |
| Priced BOQ product UX | Demo path only today; don’t invent quote-suite chrome |
| Cloud collaboration save UX | W6 = local honesty until cloud exists |
| Admin SVG editor visual redesign | Publish integrity > admin aesthetics |
| Competitive feature parity with $40k suites | 3–6 month bar is serious prototype spine |

### 6.2 Allowed foundation work (UI-affecting but not “redesign”)

- Honesty copy on save/export/status  
- Empty-state coaching on blank plan  
- Landmark/`main` / heading fixes  
- Label collisions and shortcut truth  
- Fail-closed missing symbol treatment  
- Mesh multipart readability (systems v0 bar), not beauty pass  
- Removing theatrical menu items  

### 6.3 Scope test

If a change requires new brand tokens, new navigation IA, or “make it look like Planner5D,” it is **not** CP-00 foundation — park it on the debt list (§7).

---

## 7. Priority UI debt list (ranked for later phases)

Ranked by **buyer trust impact** × **spine dependency**. Implement later phases; do not pretend done at W0.

| Rank | Debt | Why it matters | Natural later home |
|-----:|------|----------------|--------------------|
| **P0-1** | **Status/export honesty residual audit** across all personas (guest, member, admin preview) | One lying surface undoes W6 | Save honesty / export / chrome |
| **P0-2** | **Single `main` + landmark cleanup** (nested mains, duplicate inventory regions) | AT + corporate a11y; first-paint structure | A11y / shell |
| **P0-3** | **Empty-plan next-step UX** (coach / starting actions without blocking canvas) | First-session conversion | Journey / onboarding thin slice |
| **P0-4** | **Symbol/SVG fail-closed UI** (visible broken-asset state, catalog vs canvas identity) | Plan literacy = quote path | Symbols/SVG / catalog |
| **P0-5** | **Fresh a11y re-proof** (snapshot + LH) on current HEAD | Unit green ≠ live closed | A11y residual |
| **P1-1** | **Heading hierarchy + search label association** | Structure / forms | Chrome polish |
| **P1-2** | **Contextual favorite/add labels** per product | List SR usability | Catalog a11y |
| **P1-3** | **2D symbol literacy pass** at default and mid zoom (not just compile) | Client-presentable plans | Symbols quality raise |
| **P1-4** | **Mesh de-boxify residual** (still boxy after W7 bar) — silhouette/material clarity, not photoreal | Manufacturer credibility in 3D | Mesh quality follow-on |
| **P1-5** | **3D viewer a11y + discoverable orbit help** | W4 continuity for keyboard/AT users | Orbit / 3D chrome |
| **P1-6** | **Properties empty vs selection parity** (richer empty coaching, consistent field labeling) | Edit confidence after place | Properties / select |
| **P1-7** | **Shortcut help surface** aligned to map (palette / footer / tooltips) | W8 durability as features grow | Shortcuts chrome |
| **P2-1** | **Visual density / spacing craft** of open3d shell (without IA rewrite) | Perceived quality | Design system later |
| **P2-2** | **Fabric destination chrome** when Approach A journey is green | Engine destination | Fabric stage program |
| **P2-3** | **Cloud save UX** (real sync language, conflict, restore) | Multi-day projects | Persistence epic |
| **P2-4** | **Priced BOQ / quote presentation UI** | Money path | BOQ product phase |
| **P2-5** | **Systems configurator UX depth** (shape/size matrix as first-class UI) | O&O product model | Systems / catalog |
| **P2-6** | **Mobile panel IA** (bottom sheets that don’t hide spine) | Field use secondary | Responsive later |
| **P3-1** | **Photoreal / finish visualization** | Explicit non-goal near-term | Only if owner re-prioritizes |
| **P3-2** | **Marketing site / planner feature pages redesign** | Not workspace trust | Landing separate |

### 7.1 Debt hygiene rules

1. Every debt item above needs **evidence** when worked (screenshot + a11y or journey).  
2. Do not “fix” P2/P3 with ceremony while P0 honesty items are open.  
3. When a residual is accepted (e.g. boxy mesh), **say so in product-facing status only if asked** — never paint residual as complete in chrome.

---

## 8. Expert judgment summary (CP-00)

1. **Global bar** for this category is **honest dense chrome + plan literacy + local durability truth + readable modular 3D**, not photoreal and not empty enterprise skins.  
2. **Unlocked unfinished** feels like a **full cockpit with unfinished engines** — the most dangerous UX state; honesty is the only acceptable W0 posture.  
3. **Thin foundation failures** cluster as empty chrome, lying status, missing symbols, boxy 3D — all buyer-visible; tests can still pass.  
4. **Raised UI criteria** above should hang on W0 and early W-gates as **anti-theater** acceptance, with screenshots required.  
5. **A11y** already has strong control naming in places; structure (multiple `main`, headings, double labels) and live re-proof are the foundation gaps.  
6. **Do not redesign** Fabric destination, photoreal, BOQ suite, cloud collab, or marketing chrome under CP-00.  
7. **Debt rank** prioritizes honesty and landmarks, then symbols/mesh literacy, then craft and later epics.

---

## 9. Handoff

| Field | Value |
|-------|--------|
| **Status** | DONE |
| **Artifact** | `results/planner/global-standard-revision/CP-00/UI-EXPERT.md` |
| **Code changes** | None (seat is non-implementing) |
| **Next expected in folder** | BRAINSTORM + SYNTHESIS per `results/planner/global-standard-revision/INDEX.md` (other seats / head) |

**DONE** — path: `D:\OandO07072026\results\planner\global-standard-revision\CP-00\UI-EXPERT.md`
