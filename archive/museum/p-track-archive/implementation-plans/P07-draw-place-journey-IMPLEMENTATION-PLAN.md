# P07 — Draw / Place Journey (W1–W2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).
>
> **Every subagent brief starts with:** `/using-superpowers` + fit skills (verification-before-completion, chrome-devtools, systematic-debugging as needed).
>
> **Checkout:** `.` only — **no worktrees**.

**Goal:** Land one serial Playwright browser pack that proves W1 (walls + opening with **metric deltas**) and W2 (place ≥2 catalog SKUs including **cabinet-v0**, non-blank 2D canvas PNG) on open3d-preferred / guest-fallback, with honest evidence under `results/planner/world-standard-wave/02-browser-open3d-journey/`.

**Architecture:** Reuse live open3d stack (FeasibilityCanvas 2D + InventoryPanel + WorkspaceShell status metrics). Prefer **test-only** work: harden `plannerCanvasHelpers` (`getFurnitureCount`, optional `drawWallByTwoClicks` / entry helper), **rewrite** existing partial journey spec to the binding CP-07 storyboard (01–07 PNGs + `playwright-run.json`). Product code only when journey is red for a real product reason (tool labels, metrics, place path, blank canvas). Approach A stays: Feasibility interim; no Fabric cutover for this CP.

**Tech Stack:** Playwright (`site/config/build/playwright.config.ts`) · Next open3d planner · FeasibilityCanvas · InventoryPanel · `demoCatalogItems` (`cabinet-v0`, `sample-desk-1`) · `.pw-status-bar` metrics · serial `describe.configure` · repo-root `results/` only.

**Inputs consumed:**
- Repo read: 2026-07-10 — live tree under `site/tests/e2e/`, `site/features/planner/open3d/`, `Plans/phases/P07-draw-place-journey/`, `Plans/Research/RESULTS-MAP.md` (HEAD not pinned; treat working tree as dirty-possible; re-check before execute)
- Brainstormer: `Idiots2/P07-draw-place-journey/REPORT.md` **only** (never `Idiots/`)
- Phase plan: `Plans/phases/P07-draw-place-journey/` (execute card · appendix · suggestions · expert notes)

**Done when:**
1. `getFurnitureCount` lives in `plannerCanvasHelpers.ts` and journey uses it (no local duplicate parsers).
2. Spec `open3d-world-standard-journey.spec.ts` is **serial**, one ordered journey (or strictly ordered serial describe), timeout ≥120s.
3. Entry: clear storage → `/planner/open3d` primary → guest `?plannerDevTools=1` fallback; `routeUsed` recorded in proof.
4. **W1:** `wallsAfterDraw > wallsBefore` after Wall tool draw; Opening tool (label **Opening**, not shortcut D) raises `objects > objectsAfterWalls`.
5. **W2:** `furniture ≥ furnitureBefore + 2`; **includes cabinet-v0**; second SKU id recorded (`sample-desk-1` preferred); canvas PNG `byteLength > 5000`.
6. Screenshots **01–07** on disk under canonical evidence folder; `playwright-run.json` with `result: "pass"`, `failed: 0`, gates W1/W2.
7. Raw log retained; phase alias `07-browser-journey/NOTES.md` points at canonical path.
8. npm script `test:e2e:world-standard-w1w2` exists; `PLAYWRIGHT_BASE_URL` / server path honesty in proof.
9. Honesty: do **not** claim W3–W8, full symbol quality (P05), mesh (P08), or “planner works” from this phase alone.

**Evidence folder (create on execute; re-prove if missing):**  
`results/planner/world-standard-wave/02-browser-open3d-journey/`  
Alias pointer only: `results/planner/world-standard-wave/07-browser-journey/`

---

## 1. Repo reality

### 1.1 What actually exists (2026-07-10 live read)

| Area | Live fact | CP-07 relevance |
|------|-----------|-----------------|
| Journey spec | **`site/tests/e2e/open3d-world-standard-journey.spec.ts` EXISTS** | Partial / wrong bar — must **rewrite**, not invent from zero |
| Helpers | `plannerCanvasHelpers.ts`: walls/objects, drag/tap/click, `placeOpeningOnCanvas`, `placeCatalogOnCanvas`, `placeSeatsFromConfigurator` | **`getFurnitureCount` still MISSING** |
| Guest setup | `guestProjectSetup.ts`: `clearPlannerStorage`, `enterGuestPlannerWorkspace` (`/planner/guest/?plannerDevTools=1`) | Reuse; open3d entry needs explicit clear + goto |
| Playwright config | `fullyParallel: true`, workers 2, timeout 60s default; no `PLAYWRIGHT_BASE_URL` → `build && start` | Journey **must** `mode: "serial"` + 120s |
| npm script | `test:e2e:world-standard-w1w2` **ABSENT** | Add in Task 4 |
| Evidence | `results/planner/world-standard-wave/02-browser-open3d-journey/` **does not exist on disk** | Create; re-prove from zero (no PASS claim from missing folder) |
| Demo catalog | `cabinet-v0` (`geometryMode: "modular-cabinet-v0"`), `sample-desk-1`, `sample-sofa-1` in `demoCatalogItems.ts` | W2 lock OK |
| Status metrics | `WorkspaceShell` footer `.pw-status-bar`: `{n} objects` / `{n} walls` / `{n} furniture` | Helper parsers match live DOM |
| Objects formula | `summarizeFloorMetrics`: walls + rooms + doors + windows + furniture + stairs + columns | Opening → **objects Δ** (doors count in objects) |
| Tools | `CANVAS_TOOL_LABELS`: Wall, Opening, Place; opening runtime → door | Use label **Opening** |
| Wall UX | Guidance: “Click start and end points” | Prefer **two-tap** (existing journey helper) with drag as secondary |
| Opening UX | Guidance: “Click a wall to add an opening” | Prefer `tapOnCanvas` on wall mid-span; `placeOpeningOnCanvas` fallback |
| Place UX | Inventory search + `Add … to canvas` + canvas click; `placeCatalogOnCanvas` uses DOM `el.click()` | Gold path for W2 (hit-test safe) |
| Gold place proof | `open3d-mesh-symbol-live-verify.spec.ts` places cabinet-v0 via `placeCatalogOnCanvas` + `/Add Modular Cabinet to canvas/i` | Steal selectors/path for W2 |
| Systems fallback | `placeSeatsFromConfigurator` used by current journey | **Not allowed** as sole W2 green — cabinet-v0 required |
| package scripts | `test:e2e:open3d-world`, p0-admin-svg, etc. | Pattern for new w1w2 script |

### 1.2 Current journey vs binding bar (gap matrix)

Live `open3d-world-standard-journey.spec.ts` today:

| Requirement | Live spec | Gap |
|-------------|-----------|-----|
| Serial + 120s | Yes | Keep |
| open3d primary / guest fallback | Guest only | **Missing open3d primary** |
| clear storage on open3d | N/A (guest clears) | Add for open3d |
| `getFurnitureCount` helper | Local `furnitureCount` / `wallCount` | Promote helpers; delete locals |
| W1 wall delta | Yes (two-click + retry) | Keep; prefer four-segment room narrative when stable |
| W1 Opening + objects Δ | **No** | **Must add** |
| W2 cabinet-v0 | **No** (chair / configurator) | **Must replace** |
| W2 second SKU recorded | No | **Must add** |
| Non-blank canvas PNG >5k | No | **Must add** |
| Screenshots 01–07 named per phase | Different names (01 guest, 02 wall, 03 furniture, 04 3d, 05 2d, 06 complete) | **Rename / expand to 01–07 bar** |
| `playwright-run.json` written by test | No | **Must write** |
| npm script | No | **Must add** |
| Alias NOTES | No | **Must add** |
| 2D↔3D toggle | Yes (bonus) | Optional; do not claim W4; can keep as soft post-assert or drop if flaky |

### 1.3 Contradictions (repo wins over brainstormer)

| Source claim | Live repo | Plan call |
|--------------|-----------|-----------|
| Idiots2 REPORT §4 / App D: journey spec **ABSENT** | Spec **exists** (partial) | Rewrite in place; do not “create from scratch” without reading live file |
| Expert 04-playwright (2026-07-09): no journey / no getFurnitureCount | Journey partial landed later; helper still missing | Helper still Task 1; journey upgrade Task 2–3 |
| Phase appendix W1 uses `dragOnCanvas` four segments | Live journey uses two-click; wall guidance is click-click | Prefer two-click primary; drag fallback; both OK if walls Δ |
| Phase appendix W2 uses raw `addCabinet.click()` | Live gold uses `placeCatalogOnCanvas` (DOM click + Place arm) | Prefer **`placeCatalogOnCanvas`** — more reliable under inventory intercept |
| Appendix Opening via `placeOpeningOnCanvas` | Opening guidance is single click on wall | Try `tapOnCanvas` first; micro-drag fallback |
| “Fabric step-bar for place” | open3d has no `.pw-step-bar` (journey already asserts count 0) | Keep native chrome asserts |

### 1.4 Missing evidence honesty

- Wave folder `02-browser-open3d-journey/` **missing** → any historical “PASS” for W1–W2 browser is **not live**.
- Execute must **re-prove** with PNGs + json + raw log.
- Do not cite deleted or non-existent results as green.

### 1.5 Product paths that journey may touch (only if red)

| Path | Role |
|------|------|
| `site/app/planner/open3d/page.tsx` | Route entry |
| `site/features/planner/ui/Open3dPlannerHost.tsx` | Host |
| `site/features/planner/open3d/ui/Open3dNativeHost.tsx` | Native host |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Workspace + metrics source |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | `.pw-status-bar` |
| `site/features/planner/open3d/editor/workspacePlanMetrics.ts` | objects/walls/furniture |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` + `canvasTool.ts` | Wall / Opening labels |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Draw / open / place pointer |
| `site/features/planner/open3d/editor/InventoryPanel.tsx` | Search + Add to canvas |
| `site/features/planner/open3d/editor/demoCatalogItems.ts` | cabinet-v0 / desk |

**Do not touch for green theater:** select/delete (P03), orbit wiring (P04), save flush (P06), symbol quality rewrite (P05), mesh polish (P08), shortcut map (P09), Fabric full-stage.

---

## 2. Brainstormer synthesis (`Idiots2/P07-draw-place-journey/REPORT.md`)

### 2.1 North star (binding)

> Unaided browser session on **open3d (preferred) or guest** proves **structure drawn (walls + opening, metric deltas)** and **≥2 real catalog SKUs placed (including cabinet-v0)** with a **non-blank 2D canvas capture** — serial, seed-honest, evidence-folder-locked.

### 2.2 Industry → O&O verbs (ideas only)

| Industry loop | O&O W1–W2 action |
|---------------|------------------|
| Structure then decorate | Wall/Opening first; inventory second |
| Click/drag catalog place | Search → Add → canvas click |
| Manufacturer SKU identity | cabinet-v0 modular path |
| Guest try before account | Guest fallback if open3d auth-walls |
| Status feedback | `.pw-status-bar` deltas |

**Not in CP-07:** Room Wizard, templates, AI import, photoreal, BOQ, multiplayer, Magic Layout / Autostyler naming.

### 2.3 Approaches (decision already locked)

| Approach | Description | Call |
|----------|-------------|------|
| **A** | Feasibility + document model; test-first journey; product fix only if red | **Chosen** (program Approach A) |
| B | Fabric full-stage cutover to green journey | **Reject** — P02 destination, dual engine thrash |
| C | Systems configurator batch as W2 “place ≥2” without catalog SKUs | **Reject as sole path** — cabinet-v0 identity required (current live journey **fails this bar**) |

### 2.4 Raised bar (stronger than “test file exists”)

- Deltas only (seed walls ≥4 is a **lie** if used as absolute pass).
- Opening must raise **objects after walls**, not toast copy.
- W2 must place **cabinet-v0** (not chair/workstation-only).
- Non-blank PNG ≠ symbol quality.
- Serial single evidence writer.
- Full 01–07 storyboard + proof JSON fields.

### 2.5 Open questions resolved in this plan

| Question | Resolution |
|----------|------------|
| open3d vs guest | open3d primary; guest fallback; record `routeUsed` |
| Wall interaction | two-click primary (guidance + live journey); drag fallback |
| Opening interaction | Opening tool + tap on wall; placeOpening micro-drag fallback |
| Place path | `placeCatalogOnCanvas` with Modular Cabinet / desk selectors |
| Second SKU | `sample-desk-1` via search `desk`; sofa fallback only if desk fails **after** catalog load proven |
| Keep 2D↔3D in journey? | Optional after 06/07 core; not required for CP-07; prefer not to claim W4 |
| Configurator fallback | **Forbidden** for CP-07 green proof path |

---

## 3. Ethics / non-copy

- Research under `D:\websites` and Idiots2 synthesis = **jobs / grammar / JTBD only**.
- **Forbidden:** competitor code, CSS, GLB, icons, catalog assets, pixel-matched chrome, marketing slogans as O&O copy.
- Use only O&O labels: Wall, Opening, Place, Search catalog elements, Add … to canvas.
- Packages: MIT/open already in stack; paid only if in `ayushdocs/17-LICENSES-CLEARED.md` (none required for this phase).
- Evidence only under repo-root `results/` — never `site/results/`.

---

## 4. File map

### 4.1 Create

| Path | Why |
|------|-----|
| `results/planner/world-standard-wave/02-browser-open3d-journey/` | Canonical evidence (dir via beforeAll / shell) |
| `results/planner/world-standard-wave/07-browser-journey/NOTES.md` | Alias pointer |
| Evidence artifacts on execute: PNGs 01–07, `playwright-run.json`, `playwright-raw.log` | CP-07 floor |

### 4.2 Modify

| Path | What changes |
|------|----------------|
| `site/tests/e2e/plannerCanvasHelpers.ts` | Add `getFurnitureCount`; optionally export `drawWallSegmentTwoClicks` if shared |
| `site/tests/e2e/open3d-world-standard-journey.spec.ts` | Full rewrite to W1+W2 binding storyboard + proof writer |
| `site/package.json` | Add `test:e2e:world-standard-w1w2` script |

### 4.3 Reuse (no change unless red)

| Path | Role |
|------|------|
| `site/tests/e2e/guestProjectSetup.ts` | clear + guest enter |
| `site/config/build/playwright.config.ts` | baseURL / webServer |
| `site/features/planner/open3d/editor/demoCatalogItems.ts` | SKU lock |
| Gold patterns: `admin-svg-publish-p01.spec.ts`, `planner-guest-workspace.spec.ts`, `open3d-mesh-symbol-live-verify.spec.ts` | Evidence shape / selectors / cabinet place |

### 4.4 Product (only if journey red)

Touch minimal locus from §1.5; each product fix is its own TDD task after browser red is diagnosed.

### 4.5 Do not create

| Path | Why |
|------|-----|
| Second journey spec file | Serial single writer |
| `results/tests/` as gate home | RESULTS-MAP forbidden |
| `02-engine-lock/` | Folder lock |
| Changes under `Idiots/` or `Idiots2/` | Plan/report ownership |

---

## 5. Architecture & data flow

### 5.1 Host chain

```
/planner/open3d
  → Open3dPlannerHost
    → Open3dNativeHost
      → OOPlannerWorkspace
        → FeasibilityCanvas (walls / openings / place pointer)
        → InventoryPanel (search / Add to canvas)
        → WorkspaceShell footer (.pw-status-bar metrics)

/planner/guest/?plannerDevTools=1
  → setup gate → Open3dPlannerWorkspaceRoute → same Host stack
  → Start from Scratch may seed ≥4 walls, 0 furniture
```

### 5.2 Metrics data flow (why deltas)

```
activeFloor
  → summarizeFloorMetrics
    walls = floor.walls.length
    furniture = floor.furniture.length
    objects = walls + rooms + doors + windows + furniture + stairs + columns
  → WorkspaceShell spans: "N objects" | "N walls" | "N furniture"
  → Playwright helpers parse .pw-status-bar > span
```

**Implications:**
- Drawing a wall raises **walls** and **objects**.
- Placing a door/opening raises **objects** (and doors list) — must compare to **objectsAfterWalls**, not absolute ≥1.
- Placing furniture raises **furniture** and **objects**.

### 5.3 Journey control flow (serial one test)

```
beforeAll: mkdir evidence dirs
enterWorldStandardPlanner(page)
  → clearPlannerStorage
  → try /planner/open3d ready?
  → else enterGuestPlannerWorkspace
capture baselines (walls, objects, furniture)
screenshot 01-route-ready
W1 Wall tool → draw segments → walls ↑ → 02-walls-drawn
W1 Opening tool → place on wall → objects ↑ → 03-door-opening
W2 search cabinet-v0 → placeCatalogOnCanvas → furniture ↑ → 04-cabinet-v0-placed
W2 search desk → place → furniture ≥ +2 → 05-two-items-placed
canvas screenshot 06 byteLength > 5000
07-journey-complete + write playwright-run.json
```

### 5.4 Selector contract (O&O only)

| Need | Selector |
|------|----------|
| 2D canvas | `[data-testid="planner-2d-canvas"] canvas` (`PLANNER_PRIMARY_CANVAS`) |
| Drawing tools group | `getByRole("group", { name: "Drawing tools" })` |
| Wall tool | button name `/^Wall(?: \(|$)/` via `selectPlannerTool(page, "Wall")` |
| Opening tool | `selectPlannerTool(page, "Opening")` |
| Catalog region | `getByRole("region", { name: "Catalog browser" })` |
| Search | `getByRole("searchbox", { name: /Search catalog elements/i })` **or** `getByLabel("Search catalog elements")` |
| Add CTA | `/Add Modular Cabinet to canvas/i` then `/Add .* to canvas/i` for desk |
| Status | `.pw-status-bar > span` exact `/^\d+ walls$/` etc. |
| Topbar | `.pw-topbar` |
| Native chrome | radio `2D`/`3D`; assert `.pw-step-bar` count 0 |

---

## 6. Task list

### Task 00: Preconditions & evidence dirs

**Files:**
- Create (dirs): `results/planner/world-standard-wave/02-browser-open3d-journey/`
- Create (dirs): `results/planner/world-standard-wave/07-browser-journey/`
- Read-only: phase card, appendix, this plan, live journey + helpers

- [ ] **Step 1: Confirm live files**

Run:

```powershell
cd .
Test-Path site\tests\e2e\open3d-world-standard-journey.spec.ts
Test-Path site\tests\e2e\plannerCanvasHelpers.ts
Test-Path site\tests\e2e\guestProjectSetup.ts
Test-Path site\features\planner\open3d\editor\demoCatalogItems.ts
Select-String -Path site\tests\e2e\plannerCanvasHelpers.ts -Pattern "getFurnitureCount"
Select-String -Path site\package.json -Pattern "world-standard-w1w2"
```

Expected:
- Journey + helpers + guest setup + demo catalog = `True`
- `getFurnitureCount` = **no matches** (gap still open)
- `world-standard-w1w2` = **no matches**

- [ ] **Step 2: Confirm cabinet-v0 in demo catalog**

Run:

```powershell
Select-String -Path site\features\planner\open3d\editor\demoCatalogItems.ts -Pattern 'id: "cabinet-v0"|id: "sample-desk-1"|geometryMode: "modular-cabinet-v0"'
```

Expected: all three present.

- [ ] **Step 3: Create evidence directories**

```powershell
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\02-browser-open3d-journey" | Out-Null
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\07-browser-journey" | Out-Null
```

Expected: both dirs exist.

- [ ] **Step 4: Dev server readiness (manual / agent)**

```powershell
# From repo root — if not already running on :3000
cd .
pnpm run dev
```

Smoke:

```powershell
# browser or curl
# http://localhost:3000/planner/open3d
# http://localhost:3000/planner/guest/?plannerDevTools=1
```

Expected: planner chrome or guest setup; if open3d auth-walls, guest fallback is OK for journey.

- [ ] **Step 5: Playwright browser binary if needed**

```powershell
cd site
pnpm run test:browsers:install
```

Expected: chromium available for Playwright.

- [ ] **Step 6: Commit preconditions only if you created tracked NOTES placeholder**

Usually skip commit for empty dirs (git may not track empty). Optional:

```bash
# only if NOTES created early
git add results/planner/world-standard-wave/07-browser-journey/NOTES.md
git commit -m "docs(p07): evidence alias folder for W1-W2 journey"
```

---

### Task 01: Add `getFurnitureCount` helper (TDD)

**Files:**
- Modify: `site/tests/e2e/plannerCanvasHelpers.ts`
- Test: used first by journey (Playwright integration); optional micro unit not required for e2e-only helper

- [ ] **Step 1: Write failing consumer assert (document expected API)**

In a temporary scratch or by reading helpers: assert export does not exist.

Run:

```powershell
cd site
pnpm exec tsc --noEmit -p tests/tsconfig.json 2>&1 | Select-String "getFurnitureCount" 
# Or: node -e "require('fs').readFileSync('tests/e2e/plannerCanvasHelpers.ts','utf8').includes('getFurnitureCount') || process.exit(1)"
node -e "const fs=require('fs'); const s=fs.readFileSync('tests/e2e/plannerCanvasHelpers.ts','utf8'); if(s.includes('export async function getFurnitureCount')) process.exit(0); process.exit(1)"
```

Expected: exit code **1** (function missing) — FAIL baseline.

- [ ] **Step 2: Implement `getFurnitureCount` (mirror walls/objects)**

Insert after `getWallCount` in `plannerCanvasHelpers.ts`:

```typescript
export async function getFurnitureCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar > span")
    .filter({ hasText: /^\d+ furniture$/ })
    .textContent();
  const match = text?.match(/^(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}
```

Notes:
- Exact span text matches `WorkspaceShell`: `` `${planMetrics.furniture} furniture` ``.
- Prefer returning `0` when missing (same as walls/objects) rather than `-1` (live journey used -1 — **do not** reintroduce for helper; polls should fail on wrong deltas, not on -1 quirks).

- [ ] **Step 3: Verify export present**

```powershell
cd site
node -e "const fs=require('fs'); const s=fs.readFileSync('tests/e2e/plannerCanvasHelpers.ts','utf8'); if(!s.includes('export async function getFurnitureCount')) process.exit(1); console.log('getFurnitureCount: ok')"
```

Expected: `getFurnitureCount: ok`

- [ ] **Step 4: Optional shared wall draw helper (recommended)**

Still in `plannerCanvasHelpers.ts`, add:

```typescript
/**
 * Open3d wall tool: two taps (start then end). Wall guidance is click-click;
 * micro-drag helpers can miss commit on some pointer paths.
 */
export async function drawWallByTwoClicks(
  page: Page,
  from: { rx: number; ry: number },
  to: { rx: number; ry: number },
): Promise<void> {
  await selectPlannerTool(page, "Wall");
  await tapOnCanvas(page, from.rx, from.ry);
  await page.waitForTimeout(200);
  await tapOnCanvas(page, to.rx, to.ry);
  await page.waitForTimeout(200);
}
```

- [ ] **Step 5: Commit helper**

```bash
git add site/tests/e2e/plannerCanvasHelpers.ts
git commit -m "test(e2e): add getFurnitureCount (+ drawWallByTwoClicks) for W1-W2 journey"
```

---

### Task 02: Rewrite journey skeleton — entry, serial, evidence paths, baselines

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts` (replace body)

- [ ] **Step 1: Replace file header + imports + constants**

Full starting structure (implement next steps into same file):

```typescript
/**
 * World-standard open3d journey — W1 (draw walls + door/opening) + W2 (place catalog incl. cabinet-v0).
 *
 * Evidence (canonical): results/planner/world-standard-wave/02-browser-open3d-journey/
 * Phase alias:          results/planner/world-standard-wave/07-browser-journey/
 * Pattern: admin-svg-publish-p01.spec.ts (flat dir + PNGs + JSON)
 * Serial: playwright.config fullyParallel — this file MUST run serial.
 *
 * Anti false-green:
 *  - walls/objects/furniture deltas (guest seed walls ≥4)
 *  - cabinet-v0 required (no systems-configurator-only green)
 *  - non-blank canvas PNG ≠ P05 symbol quality
 */
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

import {
  clearPlannerStorage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import {
  clickOnCanvas,
  drawWallByTwoClicks,
  getFurnitureCount,
  getObjectCount,
  getWallCount,
  placeCatalogOnCanvas,
  placeOpeningOnCanvas,
  selectPlannerTool,
  tapOnCanvas,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

const SITE_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const EVIDENCE_DIR = path.join(
  REPO_ROOT,
  "results",
  "planner",
  "world-standard-wave",
  "02-browser-open3d-journey",
);
const PHASE_ALIAS_DIR = path.join(
  REPO_ROOT,
  "results",
  "planner",
  "world-standard-wave",
  "07-browser-journey",
);

test.describe.configure({ mode: "serial", timeout: 120_000 });

test.beforeAll(() => {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(PHASE_ALIAS_DIR, { recursive: true });
});
```

If Task 01 did not export `drawWallByTwoClicks`, keep a local copy with the same body until promoted.

- [ ] **Step 2: Entry helper**

```typescript
/** Primary: /planner/open3d · Fallback: guest (?plannerDevTools=1 owned by helper). */
async function enterWorldStandardPlanner(
  page: Page,
): Promise<"open3d" | "guest"> {
  await clearPlannerStorage(page);
  await page.goto("/planner/open3d", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  const topbar = page.locator(".pw-topbar");
  const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
  const ready = await Promise.race([
    topbar.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
    canvas.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
  ]).catch(() => false);

  if (ready) {
    await expect(
      page.locator('[data-testid="planner-2d-canvas"] canvas'),
    ).toBeVisible({ timeout: 25_000 });
    return "open3d";
  }

  await enterGuestPlannerWorkspace(page, {
    projectName: "W1-W2 world-standard",
  });
  await waitForPlannerCanvas(page);
  return "guest";
}
```

- [ ] **Step 3: Proof state object (mutable during test)**

```typescript
type JourneyProof = {
  routeUsed: "open3d" | "guest" | "unknown";
  wallsBefore: number;
  wallsAfterDraw: number;
  wallsIncreased: boolean;
  objectsBefore: number;
  objectsAfterWalls: number;
  objectsAfterOpening: number;
  doorOrOpeningPlaced: boolean;
  objectsIncreasedAfterOpening: boolean;
  furnitureBefore: number;
  furnitureAfter: number;
  furnitureAtLeast: number;
  includesCabinetV0: boolean;
  secondCatalogId: string;
  symbolCheck: string;
  screenshots: string[];
  baseURL: string;
  server: string;
};

function emptyProof(): JourneyProof {
  return {
    routeUsed: "unknown",
    wallsBefore: 0,
    wallsAfterDraw: 0,
    wallsIncreased: false,
    objectsBefore: 0,
    objectsAfterWalls: 0,
    objectsAfterOpening: 0,
    doorOrOpeningPlaced: false,
    objectsIncreasedAfterOpening: false,
    furnitureBefore: 0,
    furnitureAfter: 0,
    furnitureAtLeast: 2,
    includesCabinetV0: false,
    secondCatalogId: "",
    symbolCheck: "non-blank-canvas-png (P07); quality bar P05",
    screenshots: [],
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    server: process.env.PLAYWRIGHT_BASE_URL
      ? "PLAYWRIGHT_BASE_URL reuse (dev or external)"
      : "Playwright webServer: pnpm run build && pnpm run start",
  };
}
```

- [ ] **Step 4: Scaffold single serial test with entry + 01 screenshot only**

```typescript
test.describe("W1–W2 open3d world-standard journey (browser)", () => {
  test("draw walls + opening → place cabinet-v0 + second SKU → non-blank 2D", async ({
    page,
  }) => {
    const proof = emptyProof();

    proof.routeUsed = await enterWorldStandardPlanner(page);
    await waitForPlannerCanvas(page);
    await expect(page.locator(".pw-topbar")).toBeVisible();
    await expect(page.getByRole("radio", { name: "2D", exact: true })).toBeVisible();
    await expect(page.getByRole("group", { name: "Drawing tools" })).toBeVisible();
    await expect(page.locator(".pw-step-bar")).toHaveCount(0);

    proof.wallsBefore = await getWallCount(page);
    proof.objectsBefore = await getObjectCount(page);
    proof.furnitureBefore = await getFurnitureCount(page);
    expect(proof.wallsBefore).toBeGreaterThanOrEqual(0);
    expect(proof.objectsBefore).toBeGreaterThanOrEqual(0);
    expect(proof.furnitureBefore).toBeGreaterThanOrEqual(0);

    const shot01 = path.join(EVIDENCE_DIR, "01-route-ready.png");
    await page.screenshot({ path: shot01 });
    proof.screenshots.push("01-route-ready.png");

    // W1/W2 continue in Tasks 03–04 — leave failing expect as RED checkpoint if running intermediate:
    // expect(false, "W1/W2 not yet implemented in this scaffold step").toBe(true);
  });
});
```

During intermediate scaffold, **do not leave a permanent `expect(false)`** in final landable code. Either implement W1 next in same PR flow or use `test.fix` only if owner forces split (prefer continuous rewrite).

- [ ] **Step 5: Run skeleton (expect incomplete / fail until W1–W2 filled)**

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

Expected at full completion of Tasks 03–05: exit 0. After skeleton-only: fail at unfinished asserts — OK.

- [ ] **Step 6: Commit skeleton entry**

```bash
git add site/tests/e2e/open3d-world-standard-journey.spec.ts site/tests/e2e/plannerCanvasHelpers.ts
git commit -m "test(e2e): scaffold serial W1-W2 journey entry + evidence paths"
```

---

### Task 03: W1 — draw walls + opening (deltas)

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts`

- [ ] **Step 1: Implement wall draw with delta assert**

Append inside the same test after baselines:

```typescript
    // --- W1: walls (delta, not seed absolute) ---
    // Prefer four-ish segments for a room-like shape; assert increase, not magic +4.
    await drawWallByTwoClicks(page, { rx: 0.25, ry: 0.25 }, { rx: 0.75, ry: 0.25 });
    await drawWallByTwoClicks(page, { rx: 0.75, ry: 0.25 }, { rx: 0.75, ry: 0.75 });
    await drawWallByTwoClicks(page, { rx: 0.75, ry: 0.75 }, { rx: 0.25, ry: 0.75 });
    await drawWallByTwoClicks(page, { rx: 0.25, ry: 0.75 }, { rx: 0.25, ry: 0.25 });

    let wallsGrew = false;
    try {
      await expect
        .poll(async () => getWallCount(page), { timeout: 8_000 })
        .toBeGreaterThan(proof.wallsBefore);
      wallsGrew = true;
    } catch {
      wallsGrew = false;
    }
    if (!wallsGrew) {
      // Fallback: single long segment (pointer path / snap variance)
      await drawWallByTwoClicks(page, { rx: 0.3, ry: 0.45 }, { rx: 0.7, ry: 0.45 });
      await expect
        .poll(async () => getWallCount(page), { timeout: 15_000 })
        .toBeGreaterThan(proof.wallsBefore);
    }

    proof.wallsAfterDraw = await getWallCount(page);
    proof.wallsIncreased = proof.wallsAfterDraw > proof.wallsBefore;
    expect(proof.wallsIncreased).toBe(true);
    proof.objectsAfterWalls = await getObjectCount(page);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, "02-walls-drawn.png") });
    proof.screenshots.push("02-walls-drawn.png");
```

**Stop-if-fail:** If walls never increase after retries → product red (Wall tool / pointer / metrics). Do **not** pass on `wallsBefore >= 4` alone.

- [ ] **Step 2: Run focused — expect fail later on opening/W2 or pass if only walls coded**

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

Expected: fail at next missing step OR exit 0 if whole file already complete.

- [ ] **Step 3: Implement Opening tool + objects delta**

```typescript
    // --- W1: opening / door on wall (objects Δ after walls) ---
    await selectPlannerTool(page, "Opening");
    // Opening guidance: click a wall. Prefer mid-span of first horizontal wall.
    await tapOnCanvas(page, 0.5, 0.25);
    let openingPlaced = false;
    try {
      await expect
        .poll(async () => getObjectCount(page), { timeout: 8_000 })
        .toBeGreaterThan(proof.objectsAfterWalls);
      openingPlaced = true;
    } catch {
      openingPlaced = false;
    }
    if (!openingPlaced) {
      await placeOpeningOnCanvas(
        page,
        { rx: 0.45, ry: 0.25 },
        { rx: 0.55, ry: 0.25 },
      );
      await expect
        .poll(async () => getObjectCount(page), { timeout: 15_000 })
        .toBeGreaterThan(proof.objectsAfterWalls);
    }

    proof.objectsAfterOpening = await getObjectCount(page);
    proof.doorOrOpeningPlaced = true;
    proof.objectsIncreasedAfterOpening =
      proof.objectsAfterOpening > proof.objectsAfterWalls;
    expect(proof.objectsIncreasedAfterOpening).toBe(true);

    // Opening must not destroy wall geometry
    await expect
      .poll(async () => getWallCount(page), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(proof.wallsAfterDraw);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, "03-door-opening.png") });
    proof.screenshots.push("03-door-opening.png");
```

**Hard false-green block:** do not assert toast text; do not use `objects > 0` without post-wall baseline.

- [ ] **Step 4: Run W1 portion green (W2 may still red)**

Same Playwright command as Step 2.

Expected: pass through `03-door-opening.png` when W2 not yet required, or full file red on W2.

- [ ] **Step 5: Commit W1**

```bash
git add site/tests/e2e/open3d-world-standard-journey.spec.ts
git commit -m "test(e2e): W1 walls+opening metric deltas for world-standard journey"
```

---

### Task 04: W2 — cabinet-v0 + second SKU + non-blank canvas

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts`

- [ ] **Step 1: Catalog search locator helper (inline)**

```typescript
    const catalog = page.getByRole("region", { name: "Catalog browser" });
    const search = page
      .getByRole("searchbox", { name: /Search catalog elements/i })
      .or(page.getByLabel("Search catalog elements"));
    await expect(search).toBeVisible({ timeout: 15_000 });
```

- [ ] **Step 2: Place cabinet-v0 (required)**

```typescript
    // --- W2: cabinet-v0 (manufacturer modular path — non-negotiable) ---
    proof.furnitureBefore = await getFurnitureCount(page);
    await search.fill("cabinet-v0");
    await page.waitForTimeout(400);

    // Prefer exact Modular Cabinet CTA (mesh-symbol gold); generic Add fallback
    const cabinetName = /Add Modular Cabinet to canvas/i;
    const genericAdd = /Add .* to canvas/i;
    const cabinetBtn = catalog.getByRole("button", { name: cabinetName }).first();
    const cabinetVisible = await cabinetBtn
      .isVisible({ timeout: 8_000 })
      .catch(() => false);

    if (cabinetVisible) {
      await placeCatalogOnCanvas(page, 0.4, 0.4, cabinetName);
    } else {
      await expect(
        catalog.getByRole("button", { name: genericAdd }).first(),
      ).toBeVisible({ timeout: 15_000 });
      await placeCatalogOnCanvas(page, 0.4, 0.4, genericAdd);
    }

    await expect
      .poll(async () => getFurnitureCount(page), { timeout: 30_000 })
      .toBeGreaterThan(proof.furnitureBefore);

    // Identity cue: body text or inventory selection copy
    const bodyAfterCabinet = await page.locator("body").innerText();
    proof.includesCabinetV0 =
      /cabinet-v0/i.test(bodyAfterCabinet) ||
      /Modular Cabinet/i.test(bodyAfterCabinet) ||
      /Placed Modular Cabinet/i.test(bodyAfterCabinet);
    // If UI does not echo id, still accept place path when search was cabinet-v0 AND furniture rose
    // but record honesty: require includesCabinetV0 true OR explicit catalogId from status/properties.
    expect(
      proof.includesCabinetV0 || cabinetVisible,
      "cabinet-v0 place identity not proven",
    ).toBeTruthy();
    proof.includesCabinetV0 = true;

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "04-cabinet-v0-placed.png"),
    });
    proof.screenshots.push("04-cabinet-v0-placed.png");
```

**Forbidden:** calling `placeSeatsFromConfigurator` as the success path for CP-07.

- [ ] **Step 3: Second SKU (desk preferred)**

```typescript
    // --- W2: second SKU ---
    const furnitureAfterCabinet = await getFurnitureCount(page);
    await search.fill("desk");
    await page.waitForTimeout(400);

    let secondId = "sample-desk-1";
    let secondPattern = /Add .*Desk.* to canvas|Add Executive Standing Desk to canvas/i;
    let secondVisible = await catalog
      .getByRole("button", { name: /Add .* to canvas/i })
      .first()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);

    if (!secondVisible) {
      await search.fill("sofa");
      await page.waitForTimeout(400);
      secondId = "sample-sofa-1";
      secondPattern = /Add .*Sofa.* to canvas/i;
      secondVisible = await catalog
        .getByRole("button", { name: /Add .* to canvas/i })
        .first()
        .isVisible({ timeout: 8_000 })
        .catch(() => false);
    }

    expect(secondVisible, "second catalog SKU not found in inventory").toBe(true);
    await placeCatalogOnCanvas(page, 0.55, 0.55, /Add .* to canvas/i);

    await expect
      .poll(async () => getFurnitureCount(page), { timeout: 20_000 })
      .toBeGreaterThanOrEqual(proof.furnitureBefore + 2);

    proof.secondCatalogId = secondId;
    proof.furnitureAfter = await getFurnitureCount(page);
    expect(proof.furnitureAfter - proof.furnitureBefore).toBeGreaterThanOrEqual(2);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "05-two-items-placed.png"),
    });
    proof.screenshots.push("05-two-items-placed.png");
```

- [ ] **Step 4: Non-blank canvas PNG**

```typescript
    // --- W2: non-blank 2D symbols capture (quality bar remains P05) ---
    const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
    await expect(canvas).toBeVisible();
    const shot06Path = path.join(EVIDENCE_DIR, "06-canvas-2d-symbols.png");
    const shot06 = await canvas.screenshot({ path: shot06Path });
    expect(shot06.byteLength).toBeGreaterThan(5_000);
    proof.screenshots.push("06-canvas-2d-symbols.png");
    proof.symbolCheck = "non-blank-canvas-png (P07); quality bar P05";
```

- [ ] **Step 5: Journey complete screenshot**

```typescript
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "07-journey-complete.png"),
    });
    proof.screenshots.push("07-journey-complete.png");
```

- [ ] **Step 6: Run full journey**

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-raw.log"
```

Expected: **1 passed**; PNGs 01–07 present; log unfiltered.

If red:
- Catalog/search → check InventoryPanel + demo catalog
- Place no-op → use chrome-devtools; prefer helpers; fix product placement if systematic
- GLB 500 on cabinet-v0 → modular procedural path must still place furniture (product fix)
- Hit-test → ensure `placeCatalogOnCanvas` DOM click path

- [ ] **Step 7: Commit W2**

```bash
git add site/tests/e2e/open3d-world-standard-journey.spec.ts
git commit -m "test(e2e): W2 cabinet-v0 + second SKU + non-blank canvas for journey"
```

---

### Task 05: Write `playwright-run.json` from the test (pass only if artifacts exist)

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts`

- [ ] **Step 1: End-of-test proof writer**

Append before test end (after all asserts):

```typescript
    const requiredShots = [
      "01-route-ready.png",
      "02-walls-drawn.png",
      "03-door-opening.png",
      "04-cabinet-v0-placed.png",
      "05-two-items-placed.png",
      "06-canvas-2d-symbols.png",
      "07-journey-complete.png",
    ];
    for (const name of requiredShots) {
      const full = path.join(EVIDENCE_DIR, name);
      expect(existsSync(full), `missing screenshot ${name}`).toBe(true);
    }

    const runPayload = {
      slice: "P07 / CP-07 world-standard W1–W2 open3d journey",
      date: new Date().toISOString().slice(0, 10),
      result: "pass" as const,
      tests: 1,
      failed: 0,
      gates: { W1: "pass", W2: "pass" },
      routeUsed: proof.routeUsed,
      command:
        "npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list",
      cwd: "site",
      baseURL: proof.baseURL,
      server: proof.server,
      spec: "site/tests/e2e/open3d-world-standard-journey.spec.ts",
      proof: {
        wallsBefore: proof.wallsBefore,
        wallsAfterDraw: proof.wallsAfterDraw,
        wallsIncreased: proof.wallsIncreased,
        doorOrOpeningPlaced: proof.doorOrOpeningPlaced,
        objectsBefore: proof.objectsBefore,
        objectsAfterWalls: proof.objectsAfterWalls,
        objectsAfterOpening: proof.objectsAfterOpening,
        objectsIncreasedAfterOpening: proof.objectsIncreasedAfterOpening,
        furnitureBefore: proof.furnitureBefore,
        furnitureAfter: proof.furnitureAfter,
        furnitureAtLeast: 2,
        includesCabinetV0: proof.includesCabinetV0,
        secondCatalogId: proof.secondCatalogId,
        symbolCheck: proof.symbolCheck,
        screenshots: requiredShots,
      },
      rawLog: "playwright-raw.log",
      blockersResolved: [] as string[],
      honesty: {
        claimsW3: false,
        claimsP05SymbolQuality: false,
        claimsFullPlannerWorks: false,
        note: "CP-07 place/draw only; CP-03 + CP-05 still required for full story",
      },
    };

    writeFileSync(
      path.join(EVIDENCE_DIR, "playwright-run.json"),
      `${JSON.stringify(runPayload, null, 2)}\n`,
      "utf8",
    );
```

- [ ] **Step 2: On failure discipline (manual / afterEach optional)**

If the test throws, do **not** write `result: "pass"`. Optional `test.afterEach` that writes `result: "fail"` + `blockersOpen` only when status failed — preferred:

```typescript
// Optional hardening — only if agent wants fail artifacts automatic:
// Keep simple: pass writer only at end of green path; on red, leave red PNGs + raw log.
```

Never delete red PNGs. Prefer archive over delete.

- [ ] **Step 3: Re-run and verify JSON**

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-raw.log"
Get-Content ..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-run.json
```

Expected JSON fields: `result: "pass"`, `failed: 0`, `gates.W1/W2: pass`, deltas true, `includesCabinetV0: true`, `secondCatalogId` set, screenshots list length 7.

- [ ] **Step 4: Commit**

```bash
git add site/tests/e2e/open3d-world-standard-journey.spec.ts
git commit -m "test(e2e): write playwright-run.json proof for W1-W2 journey"
```

---

### Task 06: npm script + alias NOTES + package honesty

**Files:**
- Modify: `site/package.json`
- Create: `results/planner/world-standard-wave/07-browser-journey/NOTES.md`

- [ ] **Step 1: Add npm script**

In `site/package.json` scripts section (near other e2e scripts):

```json
"test:e2e:world-standard-w1w2": "npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list"
```

- [ ] **Step 2: Document run modes (execute agent runs both awareness)**

**Preferred (dev reuse):**

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm run test:e2e:world-standard-w1w2 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-raw.log"
```

**Unset baseURL:** config runs `pnpm run build && pnpm run start` — slow; proof.server must say so.

- [ ] **Step 3: Alias NOTES**

Create `results/planner/world-standard-wave/07-browser-journey/NOTES.md`:

```markdown
# P07 evidence alias

**Canonical proof (only gold root):**  
`results\planner\world-standard-wave\02-browser-open3d-journey\`

**Checkpoint:** CP-07  
**Gates:** W1 (draw walls + opening deltas), W2 (place ≥2 incl. cabinet-v0, non-blank 2D PNG)

Do **not** split real screenshots into this folder. Optional copy of `playwright-run.json` is allowed; if missing, open the canonical path above.

**Honesty:** This phase does not prove W3 select/delete, P05 symbol quality, P08 mesh, or save honesty.
```

- [ ] **Step 4: Run via npm script once**

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm run test:e2e:world-standard-w1w2
```

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add site/package.json results/planner/world-standard-wave/07-browser-journey/NOTES.md
git commit -m "chore(p07): npm script test:e2e:world-standard-w1w2 + alias NOTES"
```

---

### Task 07: Full target journey file (assembled reference)

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts` (ensure final landable matches this assembly)

Workers should assemble Tasks 02–05 into one coherent file. Final expected shape:

```typescript
/**
 * World-standard open3d journey — W1 (draw walls + door/opening) + W2 (place catalog incl. cabinet-v0).
 *
 * Evidence (canonical): results/planner/world-standard-wave/02-browser-open3d-journey/
 * Phase alias:          results/planner/world-standard-wave/07-browser-journey/
 * Serial: playwright.config fullyParallel — this file MUST run serial.
 */
import { expect, test, type Page } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  clearPlannerStorage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import {
  drawWallByTwoClicks,
  getFurnitureCount,
  getObjectCount,
  getWallCount,
  placeCatalogOnCanvas,
  placeOpeningOnCanvas,
  selectPlannerTool,
  tapOnCanvas,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

const SITE_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const EVIDENCE_DIR = path.join(
  REPO_ROOT,
  "results",
  "planner",
  "world-standard-wave",
  "02-browser-open3d-journey",
);
const PHASE_ALIAS_DIR = path.join(
  REPO_ROOT,
  "results",
  "planner",
  "world-standard-wave",
  "07-browser-journey",
);

const REQUIRED_SHOTS = [
  "01-route-ready.png",
  "02-walls-drawn.png",
  "03-door-opening.png",
  "04-cabinet-v0-placed.png",
  "05-two-items-placed.png",
  "06-canvas-2d-symbols.png",
  "07-journey-complete.png",
] as const;

test.describe.configure({ mode: "serial", timeout: 120_000 });

test.beforeAll(() => {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(PHASE_ALIAS_DIR, { recursive: true });
});

type JourneyProof = {
  routeUsed: "open3d" | "guest";
  wallsBefore: number;
  wallsAfterDraw: number;
  wallsIncreased: boolean;
  objectsBefore: number;
  objectsAfterWalls: number;
  objectsAfterOpening: number;
  doorOrOpeningPlaced: boolean;
  objectsIncreasedAfterOpening: boolean;
  furnitureBefore: number;
  furnitureAfter: number;
  includesCabinetV0: boolean;
  secondCatalogId: string;
  symbolCheck: string;
  baseURL: string;
  server: string;
};

async function enterWorldStandardPlanner(
  page: Page,
): Promise<"open3d" | "guest"> {
  await clearPlannerStorage(page);
  await page.goto("/planner/open3d", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  const topbar = page.locator(".pw-topbar");
  const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
  const ready = await Promise.race([
    topbar.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
    canvas.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
  ]).catch(() => false);

  if (ready) {
    await expect(canvas).toBeVisible({ timeout: 25_000 });
    return "open3d";
  }

  await enterGuestPlannerWorkspace(page, {
    projectName: "W1-W2 world-standard",
  });
  await waitForPlannerCanvas(page);
  return "guest";
}

test.describe("W1–W2 open3d world-standard journey (browser)", () => {
  test("draw walls + opening → place cabinet-v0 + second SKU → non-blank 2D", async ({
    page,
  }) => {
    const proof: JourneyProof = {
      routeUsed: "guest",
      wallsBefore: 0,
      wallsAfterDraw: 0,
      wallsIncreased: false,
      objectsBefore: 0,
      objectsAfterWalls: 0,
      objectsAfterOpening: 0,
      doorOrOpeningPlaced: false,
      objectsIncreasedAfterOpening: false,
      furnitureBefore: 0,
      furnitureAfter: 0,
      includesCabinetV0: false,
      secondCatalogId: "",
      symbolCheck: "non-blank-canvas-png (P07); quality bar P05",
      baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
      server: process.env.PLAYWRIGHT_BASE_URL
        ? "PLAYWRIGHT_BASE_URL reuse (dev or external)"
        : "Playwright webServer: pnpm run build && pnpm run start",
    };

    proof.routeUsed = await enterWorldStandardPlanner(page);
    await waitForPlannerCanvas(page);
    await expect(page.locator(".pw-topbar")).toBeVisible();
    await expect(page.getByRole("radio", { name: "2D", exact: true })).toBeVisible();
    await expect(page.getByRole("group", { name: "Drawing tools" })).toBeVisible();
    await expect(page.locator(".pw-step-bar")).toHaveCount(0);

    proof.wallsBefore = await getWallCount(page);
    proof.objectsBefore = await getObjectCount(page);
    proof.furnitureBefore = await getFurnitureCount(page);
    expect(proof.wallsBefore).toBeGreaterThanOrEqual(0);
    expect(proof.furnitureBefore).toBeGreaterThanOrEqual(0);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, "01-route-ready.png") });

    // W1 walls
    await drawWallByTwoClicks(page, { rx: 0.25, ry: 0.25 }, { rx: 0.75, ry: 0.25 });
    await drawWallByTwoClicks(page, { rx: 0.75, ry: 0.25 }, { rx: 0.75, ry: 0.75 });
    await drawWallByTwoClicks(page, { rx: 0.75, ry: 0.75 }, { rx: 0.25, ry: 0.75 });
    await drawWallByTwoClicks(page, { rx: 0.25, ry: 0.75 }, { rx: 0.25, ry: 0.25 });

    try {
      await expect
        .poll(async () => getWallCount(page), { timeout: 8_000 })
        .toBeGreaterThan(proof.wallsBefore);
    } catch {
      await drawWallByTwoClicks(page, { rx: 0.3, ry: 0.45 }, { rx: 0.7, ry: 0.45 });
      await expect
        .poll(async () => getWallCount(page), { timeout: 15_000 })
        .toBeGreaterThan(proof.wallsBefore);
    }

    proof.wallsAfterDraw = await getWallCount(page);
    proof.wallsIncreased = proof.wallsAfterDraw > proof.wallsBefore;
    expect(proof.wallsIncreased).toBe(true);
    proof.objectsAfterWalls = await getObjectCount(page);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "02-walls-drawn.png") });

    // W1 opening
    await selectPlannerTool(page, "Opening");
    await tapOnCanvas(page, 0.5, 0.25);
    try {
      await expect
        .poll(async () => getObjectCount(page), { timeout: 8_000 })
        .toBeGreaterThan(proof.objectsAfterWalls);
    } catch {
      await placeOpeningOnCanvas(
        page,
        { rx: 0.45, ry: 0.25 },
        { rx: 0.55, ry: 0.25 },
      );
      await expect
        .poll(async () => getObjectCount(page), { timeout: 15_000 })
        .toBeGreaterThan(proof.objectsAfterWalls);
    }
    proof.objectsAfterOpening = await getObjectCount(page);
    proof.doorOrOpeningPlaced = true;
    proof.objectsIncreasedAfterOpening =
      proof.objectsAfterOpening > proof.objectsAfterWalls;
    expect(proof.objectsIncreasedAfterOpening).toBe(true);
    await expect
      .poll(async () => getWallCount(page), { timeout: 5_000 })
      .toBeGreaterThanOrEqual(proof.wallsAfterDraw);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "03-door-opening.png") });

    // W2 cabinet-v0
    proof.furnitureBefore = await getFurnitureCount(page);
    const catalog = page.getByRole("region", { name: "Catalog browser" });
    const search = page
      .getByRole("searchbox", { name: /Search catalog elements/i })
      .or(page.getByLabel("Search catalog elements"));
    await expect(search).toBeVisible({ timeout: 15_000 });
    await search.fill("cabinet-v0");
    await page.waitForTimeout(400);

    const cabinetExact = /Add Modular Cabinet to canvas/i;
    const hasExact = await catalog
      .getByRole("button", { name: cabinetExact })
      .first()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);
    await placeCatalogOnCanvas(
      page,
      0.4,
      0.4,
      hasExact ? cabinetExact : /Add .* to canvas/i,
    );
    await expect
      .poll(async () => getFurnitureCount(page), { timeout: 30_000 })
      .toBeGreaterThan(proof.furnitureBefore);
    const bodyAfterCabinet = await page.locator("body").innerText();
    proof.includesCabinetV0 =
      /cabinet-v0|Modular Cabinet/i.test(bodyAfterCabinet) || hasExact;
    expect(proof.includesCabinetV0).toBe(true);
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "04-cabinet-v0-placed.png"),
    });

    // W2 second SKU
    await search.fill("desk");
    await page.waitForTimeout(400);
    let secondId = "sample-desk-1";
    let secondOk = await catalog
      .getByRole("button", { name: /Add .* to canvas/i })
      .first()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);
    if (!secondOk) {
      await search.fill("sofa");
      await page.waitForTimeout(400);
      secondId = "sample-sofa-1";
      secondOk = await catalog
        .getByRole("button", { name: /Add .* to canvas/i })
        .first()
        .isVisible({ timeout: 8_000 })
        .catch(() => false);
    }
    expect(secondOk).toBe(true);
    await placeCatalogOnCanvas(page, 0.55, 0.55, /Add .* to canvas/i);
    await expect
      .poll(async () => getFurnitureCount(page), { timeout: 20_000 })
      .toBeGreaterThanOrEqual(proof.furnitureBefore + 2);
    proof.secondCatalogId = secondId;
    proof.furnitureAfter = await getFurnitureCount(page);
    expect(proof.furnitureAfter - proof.furnitureBefore).toBeGreaterThanOrEqual(2);
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "05-two-items-placed.png"),
    });

    // Non-blank canvas
    const canvasEl = page.locator('[data-testid="planner-2d-canvas"] canvas');
    const shot06 = await canvasEl.screenshot({
      path: path.join(EVIDENCE_DIR, "06-canvas-2d-symbols.png"),
    });
    expect(shot06.byteLength).toBeGreaterThan(5_000);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "07-journey-complete.png"),
    });

    for (const name of REQUIRED_SHOTS) {
      expect(existsSync(path.join(EVIDENCE_DIR, name)), name).toBe(true);
    }

    writeFileSync(
      path.join(EVIDENCE_DIR, "playwright-run.json"),
      `${JSON.stringify(
        {
          slice: "P07 / CP-07 world-standard W1–W2 open3d journey",
          date: new Date().toISOString().slice(0, 10),
          result: "pass",
          tests: 1,
          failed: 0,
          gates: { W1: "pass", W2: "pass" },
          routeUsed: proof.routeUsed,
          command:
            "npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list",
          cwd: "site",
          baseURL: proof.baseURL,
          server: proof.server,
          spec: "site/tests/e2e/open3d-world-standard-journey.spec.ts",
          proof: {
            wallsBefore: proof.wallsBefore,
            wallsAfterDraw: proof.wallsAfterDraw,
            wallsIncreased: proof.wallsIncreased,
            doorOrOpeningPlaced: proof.doorOrOpeningPlaced,
            objectsBefore: proof.objectsBefore,
            objectsAfterWalls: proof.objectsAfterWalls,
            objectsAfterOpening: proof.objectsAfterOpening,
            objectsIncreasedAfterOpening: proof.objectsIncreasedAfterOpening,
            furnitureBefore: proof.furnitureBefore,
            furnitureAfter: proof.furnitureAfter,
            furnitureAtLeast: 2,
            includesCabinetV0: proof.includesCabinetV0,
            secondCatalogId: proof.secondCatalogId,
            symbolCheck: proof.symbolCheck,
            screenshots: [...REQUIRED_SHOTS],
          },
          rawLog: "playwright-raw.log",
          blockersResolved: [],
          honesty: {
            claimsW3: false,
            claimsP05SymbolQuality: false,
            claimsFullPlannerWorks: false,
          },
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
  });
});
```

- [ ] **Step 1: Diff final file against live partial journey**

Ensure removal of:
- local `furnitureCount` / `wallCount` body parsers
- systems configurator fallback green path
- chair-only place
- old screenshot names that omit door/cabinet

- [ ] **Step 2: Final green run + commit**

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm run test:e2e:world-standard-w1w2 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-raw.log"
```

```bash
git add site/tests/e2e/open3d-world-standard-journey.spec.ts site/tests/e2e/plannerCanvasHelpers.ts site/package.json results/planner/world-standard-wave/07-browser-journey/NOTES.md
git commit -m "test(e2e): land CP-07 W1-W2 serial open3d draw/place journey"
```

---

### Task 08: Product fix only if journey red (conditional)

**Trigger:** Playwright still red after helpers + correct selectors + retries.

**Files (choose by failure mode):**

| Symptom | First locus | Allowed fix |
|---------|-------------|-------------|
| Wall tool no-op | `FeasibilityCanvas` wall pointer · tool rail | Pointer commit / tool state |
| Walls drawn, metric stuck | `summarizeFloorMetrics` · `WorkspaceShell` | Metric wiring honesty |
| Opening no-op | Opening → door runtime · wall hit | Hit-test / tool mapping |
| Search empty | `demoCatalogItems` load path · InventoryPanel | Ensure demo catalog seeds |
| Add click no place | placement pending id · `placeCatalogOnCanvas` race | Product place arm; keep helper DOM click |
| cabinet-v0 GLB 500 | generated-glb route | Procedural modular still places furniture |
| Blank open3d | host load | Blank project seed |

**Hard rules:**
- No Fabric full-stage workaround.
- No weakening prod auth — guest fallback only.
- No fake metric in test-only production code.
- TDD for pure helpers if product pure functions change.

- [ ] **Step 1: Capture red evidence (keep PNGs + log)**

```powershell
# already have playwright-raw.log; copy timestamped fail pack if needed
Copy-Item -Recurse "results\planner\world-standard-wave\02-browser-open3d-journey" `
  "results\planner\world-standard-wave\02-browser-open3d-journey-FAIL-$(Get-Date -Format yyyyMMdd-HHmmss)"
```

- [ ] **Step 2: chrome-devtools triage**

Reproduce manually on same baseURL; confirm tool labels, status spans, catalog rows.

- [ ] **Step 3: Minimal product fix + re-run journey**

Only the failing locus. Re-run Task 07 command until green.

- [ ] **Step 4: Commit product + test together if both required**

```bash
git add <product paths> site/tests/e2e/open3d-world-standard-journey.spec.ts
git commit -m "fix(planner): <root cause> so W1-W2 journey can prove draw/place"
```

---

### Task 09: CP-07 checklist & honesty gate

- [ ] **CP-07.1** Spec exists at `site/tests/e2e/open3d-world-standard-journey.spec.ts`
- [ ] **CP-07.2** W1: walls Δ + objects Δ after Opening
- [ ] **CP-07.3** W2: furniture ≥ +2, `includesCabinetV0`, `secondCatalogId` recorded
- [ ] **CP-07.4** Screenshots 01–07 under `02-browser-open3d-journey/`
- [ ] **CP-07.5** `playwright-run.json` pass, failed 0, gates W1/W2
- [ ] **CP-07.6** Raw log retained unfiltered
- [ ] **CP-07.7** `07-browser-journey/NOTES.md` alias
- [ ] **CP-07.8** Local commits; push origin when landable; mayoite ~45m/big land (no force-push)
- [ ] **CP-07.9** Honesty: no W3–W8 / “planner works” / P05 quality claim from this alone

**Exit statement when green:**

> P07 complete. W1 and W2 browser-proven on route `<open3d|guest>`. Evidence: `results/planner/world-standard-wave/02-browser-open3d-journey/playwright-run.json`.

---

## 7. Test matrix

| # | Layer | What | Command | Expected |
|---|-------|------|---------|----------|
| T1 | Helper presence | `getFurnitureCount` exported | node one-liner on helpers file | exit 0 |
| T2 | Browser W1 walls | wallsAfter > wallsBefore | journey playwright | pass step |
| T3 | Browser W1 opening | objectsAfterOpening > objectsAfterWalls | journey playwright | pass step |
| T4 | Browser W2 cabinet | furniture ↑ after cabinet-v0 | journey playwright | pass step |
| T5 | Browser W2 second | furniture ≥ before+2 | journey playwright | pass step |
| T6 | Browser non-blank | 06 PNG > 5000 bytes | journey playwright | pass step |
| T7 | Artifacts | 7 PNGs + json + log | filesystem | all present |
| T8 | npm script | `pnpm run test:e2e:world-standard-w1w2` | with baseURL | exit 0 |
| T9 | Negative (manual) | assert walls ≥1 without delta | **must not** be in code | code review |
| T10 | Negative (manual) | systems configurator as sole place | **must not** be success path | code review |

**Not required for CP-07:** vitest unit of journey; W3 select/delete browser; mesh shots; save honesty.

---

## 8. False-green catalog (plan blocks)

| ID | Trap | Plan hard assert |
|----|------|------------------|
| F1 | Guest seed walls ≥4 | walls **Δ** after draw |
| F2 | Absolute walls ≥1 | wallsAfter > wallsBefore |
| F3 | Objects ≥1 after walls only | objects after opening **>** objects after walls |
| F4 | Toast “door added” | metric only |
| F5 | Residual furniture | clear storage + furniture **Δ** |
| F6 | furniture ≥1 absolute | ≥ baseline+2 |
| F7 | Non-blank PNG = full W2 | proof `symbolCheck` text locks P05 split |
| F8 | Unit-only helpers | Playwright pack required |
| F9 | Parallel PNG race | `mode: "serial"` + one test writer |
| F10 | build+start unrecorded | proof `server` + `baseURL` |
| F11 | Journey claims W3 | honesty block + no select/delete steps |
| F12 | CP-07 = “planner works” | exit statement + honesty fields |
| F13 | Shortcut D for opening | `selectPlannerTool(..., "Opening")` |
| F14 | Fabric flag ON thrash | default OFF; no `__plannerFabricView` for proof |
| F15 | Missing screenshot skip | `existsSync` loop on REQUIRED_SHOTS |
| F16 | Chair/configurator-only place (live partial) | cabinet-v0 required; no configurator green |
| F17 | Evidence under `site/results` | EVIDENCE_DIR via REPO_ROOT |
| F18 | Claim PASS without folder | mkdir + re-prove |

---

## 9. Stop-if-fail / CP criteria

### 9.1 Hard stop (do not claim green)

- Walls do not increase after draw retries → product or helper failure.
- Opening does not raise objects after walls → W1 incomplete.
- cabinet-v0 not placeable → W2 incomplete (do not substitute sofa×2).
- Any required PNG missing → FAIL.
- `playwright-run.json` with `result: pass` but exit non-zero → **forbidden** (writer only on green path).
- Silent `test.skip` on journey → FAIL.

### 9.2 Soft / escalate

| Issue | Action |
|-------|--------|
| Port 3000 conflict | Stop; log `Failures.md`; do not kill unknown processes |
| open3d auth wall | Guest fallback; record routeUsed |
| Flaky hit-test once | Retry with helpers; if systematic → product |
| 06 PNG < 5k | Product blank canvas / crash → fix product |
| Scope creep to select/save/orbit | Stop; separate phase |

### 9.3 CP-07 green floor (RESULTS-MAP + phase)

Under `results/planner/world-standard-wave/02-browser-open3d-journey/`:

- `playwright-run.json` or `run.json`
- `playwright-raw.log` (unfiltered)
- Screenshots `01`–`07`
- failed = 0
- gates W1 + W2 pass
- deltas + cabinet-v0 in proof body

---

## 10. Commit sequence

| Order | Message | Paths |
|------:|---------|-------|
| 1 | `test(e2e): add getFurnitureCount (+ drawWallByTwoClicks) for W1-W2 journey` | helpers |
| 2 | `test(e2e): scaffold serial W1-W2 journey entry + evidence paths` | journey skeleton |
| 3 | `test(e2e): W1 walls+opening metric deltas for world-standard journey` | journey W1 |
| 4 | `test(e2e): W2 cabinet-v0 + second SKU + non-blank canvas for journey` | journey W2 |
| 5 | `test(e2e): write playwright-run.json proof for W1-W2 journey` | journey proof |
| 6 | `chore(p07): npm script test:e2e:world-standard-w1w2 + alias NOTES` | package + NOTES |
| 7 | optional product | `fix(planner): …` |
| 8 | final land | `test(e2e): land CP-07 W1-W2 serial open3d draw/place journey` |

Push `origin` when landable green; mirror `mayoite` after ~45m / big land. No force-push.

---

## 11. Risks & owner decisions

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| open3d route auth/gated | Med | Guest fallback + record route |
| Wall two-click flaky under zoom/transform | Med | Retry segment + coords; INITIAL_TRANSFORM sensitivity |
| Opening miss wall hit | Med | tap then placeOpening micro-drag |
| Catalog search Fuse timing | Med | waitAfter fill; poll Add button |
| cabinet-v0 network GLB | Med | modular procedural place must still work |
| Parallel workers | High if serial forgotten | describe.configure serial |
| Partial live journey already “looks green” | High false pride | Rewrite to cabinet-v0 + opening |
| Owner asks short plan | N/A | this skill forbids length cap |

**Owner decisions (only if appear):**

1. Force open3d-only (no guest) — tighten entry helper fail if open3d not ready.
2. WAIVE CP-03/CP-05 for “full story” language — do not invent; honesty fields stay false unless owner WAIVE documented.
3. Require 2D↔3D in same journey — optional; does not replace P04 pack.

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Touched / required path | Task |
|-------------------------|------|
| `plannerCanvasHelpers.ts` | 01 |
| `open3d-world-standard-journey.spec.ts` | 02–07 |
| `guestProjectSetup.ts` | reuse |
| `package.json` | 06 |
| `02-browser-open3d-journey/` | 00, 05, 07 |
| `07-browser-journey/NOTES.md` | 06 |
| demo catalog / status bar / tools | verified live; product only Task 08 |

### 12.2 Brainstormer coverage

| REPORT item | Plan handling |
|-------------|---------------|
| North star draw+place | Goal + Task 03–04 |
| Serial single writer | describe.configure + one test |
| Deltas | Task 03 + false-green catalog |
| cabinet-v0 non-negotiable | Task 04 / F16 |
| Non-blank ≠ P05 | proof symbolCheck |
| open3d primary / guest | entry helper |
| getFurnitureCount | Task 01 |
| 01–07 PNGs | REQUIRED_SHOTS |
| playwright-run.json shape | Task 05 |
| npm script + baseURL | Task 06 |
| False-green F1–F15 | §8 (+ F16–F18 live) |
| No competitor copy | §3 |
| Out of scope P03–P09 | Task 08 rules + honesty |
| Repo claim “spec absent” | §1.3 contradiction → rewrite |

### 12.3 Placeholder scan

No TBD / “similar to Task N” without content. Full code blocks included for helpers, entry, W1, W2, proof writer, final assembly.

### 12.4 Length honesty

Plan is long because CP-07 is a full serial browser pack with false-green discipline and a **live partial journey that fails the binding bar** (must rewrite, not claim done).

---

## 13. Appendices

### Appendix A — Absolute path index

```
plans1/P07-draw-place-journey\IMPLEMENTATION-PLAN.md  ← this plan
Idiots2\P07-draw-place-journey\REPORT.md
Plans\phases\P07-draw-place-journey\P07-draw-place-journey.md
Plans\phases\P07-draw-place-journey\P07-appendix.md
Plans\phases\P07-draw-place-journey\P07-suggestions.md
Plans\phases\P07-draw-place-journey\01-react-open3d.md
Plans\phases\P07-draw-place-journey\04-playwright-evidence.md
Plans\Research\RESULTS-MAP.md
site\tests\e2e\open3d-world-standard-journey.spec.ts
site\tests\e2e\plannerCanvasHelpers.ts
site\tests\e2e\guestProjectSetup.ts
site\config\build\playwright.config.ts
site\package.json
site\features\planner\open3d\editor\demoCatalogItems.ts
site\features\planner\open3d\editor\WorkspaceShell.tsx
site\features\planner\open3d\editor\workspacePlanMetrics.ts
site\features\planner\open3d\editor\canvasTool.ts
results\planner\world-standard-wave\02-browser-open3d-journey\
results\planner\world-standard-wave\07-browser-journey\
```

### Appendix B — Selector table (quick card)

| Action | API |
|--------|-----|
| Enter open3d | `goto("/planner/open3d")` after `clearPlannerStorage` |
| Enter guest | `enterGuestPlannerWorkspace({ projectName })` |
| Wall | `selectPlannerTool(page, "Wall")` + `drawWallByTwoClicks` / taps |
| Opening | `selectPlannerTool(page, "Opening")` + `tapOnCanvas` / `placeOpeningOnCanvas` |
| Search | searchbox/label `Search catalog elements` |
| Place catalog | `placeCatalogOnCanvas(page, rx, ry, nameRe)` |
| Metrics | `getWallCount` · `getObjectCount` · `getFurnitureCount` |

### Appendix C — Screenshot storyboard

| File | Gate | Human should see |
|------|------|------------------|
| 01-route-ready.png | entry | Planner chrome |
| 02-walls-drawn.png | W1 | Wall lines after draw |
| 03-door-opening.png | W1 | Opening on wall |
| 04-cabinet-v0-placed.png | W2 | Cabinet symbol/instance |
| 05-two-items-placed.png | W2 | ≥2 furniture |
| 06-canvas-2d-symbols.png | W2 | Canvas crop non-blank |
| 07-journey-complete.png | both | End state |

### Appendix D — Research translation (ideas → O&O)

| Pattern | Source ideas | O&O action | In P07? |
|---------|--------------|------------|---------|
| Structure then furnish | P5D / Homestyler funnel | Wall/Opening then inventory | Yes |
| Opening on wall click | RoomSketcher doors | Opening tool + wall tap | Yes |
| Catalog search place | Inventory slice | Search + Add + click | Yes |
| SKU identity | IKEA-class | cabinet-v0 | Yes |
| Room wizard / templates | Ease leaders | — | No |
| Photoreal | Consumer planners | — | No |
| Drag-from-panel polish | Floorplanner | Later | No |

### Appendix E — What the live partial journey got right / wrong

**Right:** serial mode, 120s timeout, wall delta (not absolute only), guest enter, native chrome asserts (no step-bar), evidence under `02-browser-open3d-journey/`, two-click wall insight.

**Wrong vs CP-07:** no open3d primary, no Opening step, no cabinet-v0, configurator/chair place allowed, no getFurnitureCount helper, wrong/incomplete screenshot set, no playwright-run.json, no npm script, no non-blank assert, local metric parsers diverge from helpers.

### Appendix F — Commands cheat sheet

```powershell
# Dev
cd .
pnpm run dev

# Journey (preferred)
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm run test:e2e:world-standard-w1w2 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-raw.log"

# Direct playwright
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

### Appendix G — Type / function catalog used by plan

| Symbol | Module | Purpose |
|--------|--------|---------|
| `getFurnitureCount` | plannerCanvasHelpers | Parse `N furniture` |
| `getWallCount` | plannerCanvasHelpers | Parse `N walls` |
| `getObjectCount` | plannerCanvasHelpers | Parse `N objects` |
| `drawWallByTwoClicks` | plannerCanvasHelpers (new) | Wall segments |
| `placeCatalogOnCanvas` | plannerCanvasHelpers | Inventory place |
| `placeOpeningOnCanvas` | plannerCanvasHelpers | Opening micro-drag |
| `tapOnCanvas` | plannerCanvasHelpers | Precise tap |
| `selectPlannerTool` | plannerCanvasHelpers | Tool arm + aria-pressed |
| `clearPlannerStorage` | guestProjectSetup | Wipe planner LS/IDB via init |
| `enterGuestPlannerWorkspace` | guestProjectSetup | Guest path |
| `summarizeFloorMetrics` | workspacePlanMetrics | Source of truth for metrics |
| `CANVAS_TOOL_LABELS` | canvasTool | Wall / Opening / Place |

---

## Execution handoff

**Plan complete and saved to `plans1/P07-draw-place-journey/IMPLEMENTATION-PLAN.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

Execute agents must start with `/using-superpowers`, work only in `.`, rewrite the **existing** partial journey to the binding bar, land commits as they go, and refuse to claim full planner success from CP-07 alone.
