# P07 — Draw / Place Browser Journey (W1–W2)

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Use **verification** + **chrome-devtools** for browser truth. After owner unlock, implement via **executing-plans** or **subagent-driven-development** task-by-task. Checkboxes (`- [ ]`) track progress.  
> **Do not execute product code until owner unlocks** (plan-only until then).  
> **Checkout:** `D:\OandO07072026` only · no worktrees · commit as we go · push only on ask.

**Goal:** Prove, in a real browser, that an unaided facilities buyer can open the open3d planner, **draw structure (walls + door/opening)**, and **place ≥2 catalog items including cabinet-v0** with readable 2D symbols — gates **W1** and **W2**.

**Architecture:** One new Playwright pack exercises the live FeasibilityCanvas + inventory place path on `/planner/open3d` (preferred) or `/planner/guest/` (same open3d stack). Spec owns screenshots + structured proof JSON under the world-standard evidence tree. Product code changes only when the journey fails for a real product reason (missing selectors, broken place, blank canvas) — not to fake the test.

**Tech stack:** Playwright (`site/config/build/playwright.config.ts`), Next.js open3d route (`Open3dPlannerHost` → `OOPlannerWorkspace` → `FeasibilityCanvas` + `InventoryPanel` + Three viewer), demo/live catalog with `cabinet-v0` (`geometryMode: "modular-cabinet-v0"`), status bar metrics (`pw-status-bar` / `summarizeFloorMetrics`).

**Checkpoint:** **CP-07** (see [checkpoints/CHECKPOINTS.md](../checkpoints/CHECKPOINTS.md)) — hard stop until W1 + W2 green with proof block.

**Authority:** Owner message > `Plans/trustdata/` > `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` > Plan A core.

**Ethics:** Competitive research is ideas only. No competitor code, CSS, GLB, logos, or brands in product or tests.

**Out of scope for P07 (owned by other phases):** W3 select/delete, W4 orbit/continuity polish, W5–W6 save honesty, W7 mesh quality bar, W8 shortcut truth, Fabric full-stage cutover, cloud save, SSR.

---

## Gate definitions (binding)

| Gate | Must prove | Proof artifacts |
|------|------------|-----------------|
| **W1** | Draw structure: **≥1 wall segment set that yields walls in metrics**, plus a **door or opening** on a wall, on open3d/guest route | Playwright pass + PNGs |
| **W2** | Place **≥2** catalog furniture items, **one of which is `cabinet-v0`**; 2D canvas shows non-empty furniture symbols (Block2D path, not blank blob) | Playwright pass + PNGs |

**Done means:** `playwright-run.json` records `result: "pass"`, failed = 0, and listed screenshots exist on disk under the evidence directory. Unit-green alone does **not** clear CP-07.

---

## Locked paths

| Role | Path |
|------|------|
| **New Playwright spec** | `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| **Reuse helpers** | `site/tests/e2e/guestProjectSetup.ts`, `site/tests/e2e/plannerCanvasHelpers.ts` |
| **Gold pattern (copy discipline)** | `site/tests/e2e/admin-svg-publish-p01.spec.ts` + `results/planner/p0-1-admin-svg-publish/` |
| **Primary evidence dir** | `results/planner/world-standard-wave/02-browser-open3d-journey/` |
| **Phase-aligned alias (same run may write or copy here)** | `results/planner/world-standard-wave/07-browser-journey/` |
| **Proof block file** | `results/planner/world-standard-wave/02-browser-open3d-journey/playwright-run.json` |
| **Raw log** | `results/planner/world-standard-wave/02-browser-open3d-journey/playwright-raw.log` |
| **Design source** | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §2 W1–W2, §6 testing |
| **Product entry** | `site/app/planner/open3d/page.tsx` · `site/features/planner/ui/Open3dPlannerHost.tsx` · `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` |
| **Draw tools** | `site/features/planner/open3d/editor/CanvasToolRail.tsx` · `canvasTool.ts` (Wall, Opening→door runtime) |
| **Place path** | `InventoryPanel.tsx` (Add … to canvas) · `placementAction.ts` · `placeModularWithGeneratedGlbBrowser` for cabinet-v0 |
| **2D canvas** | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` · `[data-testid="planner-2d-canvas"] canvas` |
| **Metrics** | `workspacePlanMetrics.ts` · footer `.pw-status-bar` (`N objects`, `N walls`, `N furniture`) |
| **cabinet-v0 seed** | `site/features/planner/open3d/editor/demoCatalogItems.ts` (`id` / `slug` = `cabinet-v0`) |
| **npm script (add when landing)** | `site/package.json` → `test:e2e:world-standard-w1w2` |

**Evidence dir rule:** Canonical write target is **`02-browser-open3d-journey/`** (matches design gold template). After a green run, either keep a second copy under **`07-browser-journey/`** or leave a one-line `NOTES.md` in `07-browser-journey/` pointing at `02-…` so phase number and design template both resolve. Do not invent a third folder name.

---

## Skills (mandatory when executing)

| Skill | When |
|-------|------|
| `/using-superpowers` | Always (main + every subagent) |
| `verification-before-completion` | Before claiming CP-07 green |
| `chrome-devtools` | Manual triage when Playwright flakes or UI selectors miss; visual confirm of Block2D / canvas |
| `systematic-debugging` | Only if journey fails for product reasons |
| `executing-plans` / `subagent-driven-development` | After owner unlock |

---

## Preconditions (Task 00)

- [ ] **00.1** Read `Plans/trustdata/INDEX.md`, `00-START.md`, this file, and design W1–W2 rows.
- [ ] **00.2** Confirm approach **A** (product journey first) is selected or defaulted per `00-START.md`.
- [ ] **00.3** Confirm prior phases that block this journey are not inventing parallel engines:
  - Live 2D = **FeasibilityCanvas** (Fabric furniture flag optional, not required for W1–W2).
  - `cabinet-v0` exists in demo catalog with `geometryMode: "modular-cabinet-v0"`.
- [ ] **00.4** Dev server can serve planner:
  - From repo root: `pnpm run dev` → `http://localhost:3000/planner/open3d` and `/planner/guest/`.
- [ ] **00.5** Playwright chromium installed: `cd site && pnpm run test:browsers:install` if missing.
- [ ] **00.6** Create empty evidence dirs (no claim yet):

```powershell
New-Item -ItemType Directory -Force -Path "D:\OandO07072026\results\planner\world-standard-wave\02-browser-open3d-journey" | Out-Null
New-Item -ItemType Directory -Force -Path "D:\OandO07072026\results\planner\world-standard-wave\07-browser-journey" | Out-Null
```

---

### Task 1: Spec skeleton + evidence constants

**Files:**
- Create: `site/tests/e2e/open3d-world-standard-journey.spec.ts`
- Reuse (read only first): `guestProjectSetup.ts`, `plannerCanvasHelpers.ts`, `admin-svg-publish-p01.spec.ts`
- Modify (later task): `site/package.json` script entry

- [ ] **Step 1: Create the spec file with locked evidence paths**

Header requirements (no silent skip of proof):

```typescript
/**
 * World-standard open3d journey — W1 (draw walls + door/opening) + W2 (place catalog incl. cabinet-v0).
 *
 * Evidence (canonical): results/planner/world-standard-wave/02-browser-open3d-journey/
 * Phase alias:          results/planner/world-standard-wave/07-browser-journey/
 * Proof block:          playwright-run.json (written after run or by this file's afterAll)
 *
 * Pattern: admin-svg-publish-p01.spec.ts (mkdir evidence, numbered PNGs, JSON proof).
 */
import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

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

test.describe.configure({ timeout: 120_000 });

test.beforeAll(() => {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(PHASE_ALIAS_DIR, { recursive: true });
});
```

- [ ] **Step 2: Route entry helper (guest or open3d)**

Prefer **open3d** (design gate). Fall back to guest only if open3d lacks a ready workspace without auth.

```typescript
/** Primary: /planner/open3d · Fallback: guest workspace with setup gate cleared. */
async function enterWorldStandardPlanner(page: import("@playwright/test").Page): Promise<"open3d" | "guest"> {
  await page.goto("/planner/open3d", { waitUntil: "domcontentloaded", timeout: 60_000 });
  const topbar = page.locator(".pw-topbar");
  const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
  const ready = await Promise.race([
    topbar.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
    canvas.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
  ]).catch(() => false);

  if (ready) {
    await expect(page.locator('[data-testid="planner-2d-canvas"] canvas')).toBeVisible({
      timeout: 25_000,
    });
    return "open3d";
  }

  // Same stack via guest route + existing setup helper
  const { enterGuestPlannerWorkspace } = await import("./guestProjectSetup");
  await enterGuestPlannerWorkspace(page, { projectName: "W1-W2 world-standard" });
  const { waitForPlannerCanvas } = await import("./plannerCanvasHelpers");
  await waitForPlannerCanvas(page);
  return "guest";
}
```

- [ ] **Step 3: Commit skeleton only if unlock allows code commits**

```text
git add site/tests/e2e/open3d-world-standard-journey.spec.ts
git commit -m "test(e2e): scaffold open3d world-standard W1–W2 journey spec"
```

---

### Task 2: W1 — Draw walls + door/opening

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts`
- Reuse: `selectPlannerTool`, `dragOnCanvas`, `placeOpeningOnCanvas` / `tapOnCanvas`, `getWallCount` from `plannerCanvasHelpers.ts`
- Product touch **only if red for real reason:** `FeasibilityCanvas.tsx`, `CanvasToolRail.tsx`, `useDoorWindowPlacement.ts`, wall/opening pure actions under `open3d/model/`

- [ ] **Step 1: Implement test `W1 draws walls and a door/opening`**

Journey script (exact interactions):

1. `enterWorldStandardPlanner(page)` → record route used.
2. Screenshot `01-route-ready.png` (full page or workspace).
3. Select **Wall** tool: Drawing tools group button matching `/^Wall/`.
4. Draw a closed-ish rectangle with four `dragOnCanvas` segments (relative coords stable across viewports):

```typescript
await selectPlannerTool(page, "Wall");
await dragOnCanvas(page, { rx: 0.25, ry: 0.25 }, { rx: 0.75, ry: 0.25 });
await dragOnCanvas(page, { rx: 0.75, ry: 0.25 }, { rx: 0.75, ry: 0.75 });
await dragOnCanvas(page, { rx: 0.75, ry: 0.75 }, { rx: 0.25, ry: 0.75 });
await dragOnCanvas(page, { rx: 0.25, ry: 0.75 }, { rx: 0.25, ry: 0.25 });
```

5. Assert walls via status bar:

```typescript
await expect.poll(async () => getWallCount(page), { timeout: 15_000 }).toBeGreaterThanOrEqual(1);
```

6. Screenshot `02-walls-drawn.png`.
7. Select **Opening** tool (label `Opening`; runtime maps to door — `runtimeToolFor("opening") === "door"`). Do **not** depend on shortcut key `D` (W8 owns shortcut honesty).

```typescript
await selectPlannerTool(page, "Opening");
// Place on top wall mid-span (helpers already know wall hit behavior)
await placeOpeningOnCanvas(page, { rx: 0.45, ry: 0.25 }, { rx: 0.55, ry: 0.25 });
```

If `placeOpeningOnCanvas` fails on open3d hit-testing, try `tapOnCanvas(page, 0.5, 0.25)` once; if still red, fix product hit-test (do not assert away the door).

8. Assert structure side-effect: objects count increased **or** UI message / status reflects opening. Minimum bar: walls still ≥1 and at least one opening-related delta (objects ≥ walls+1, or door count visible in layers/properties). Prefer polling `getObjectCount` > post-wall baseline.
9. Screenshot `03-door-opening.png`.

- [ ] **Step 2: Run W1-focused until green or product fix**

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
# Dev server already running with pnpm run dev from repo root
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list -g "W1"
```

Capture full stdout/stderr to:

`results/planner/world-standard-wave/02-browser-open3d-journey/playwright-raw.log`

Preferred wrapper (handbook):

```powershell
cd D:\OandO07072026
.\scripts\run-evidence-cmd.ps1 -Name "playwright" -Module "planner" -Phase "world-standard-wave/02-browser-open3d-journey" -Cwd "D:\OandO07072026\site" -Command "npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list"
```

Note: `run-evidence-cmd` nests under `results/planner/world-standard-wave/02-browser-open3d-journey/playwright/`. If that nesting is used, **also** copy/write the flat `playwright-run.json` + screenshots at the evidence dir root so design template paths resolve without hunting.

- [ ] **Step 3: Product fixes if W1 red (allowed files only)**

Diagnose with chrome-devtools: open `/planner/open3d`, draw wall, inspect whether `planMetrics.walls` updates and whether Opening tool receives wall hit.

Allowed fix targets:

| Symptom | First place to look |
|---------|---------------------|
| Wall tool not found | `CanvasToolRail` aria-labels vs helper `plannerToolNamePattern` |
| Walls draw but metrics stay 0 | `summarizeFloorMetrics` wiring in `OOPlannerWorkspace` → `WorkspaceShell` |
| Opening never commits | `FeasibilityCanvas` opening/door tool path, `useDoorWindowPlacement`, openings pure actions |
| open3d route blank | `Open3dNativeHost` / guestMode / project bootstrap |

No new engines. No Fabric-only workaround for W1.

- [ ] **Step 4: Commit when W1 green**

```text
git add site/tests/e2e/open3d-world-standard-journey.spec.ts
# plus any justified product fixes
git commit -m "test(e2e): W1 open3d draw walls and door/opening journey"
```

---

### Task 3: W2 — Place ≥2 catalog items including cabinet-v0

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts`
- Reuse: inventory search + `Add … to canvas` pattern from `planner-j4-3d-parity.spec.ts` / `planner-guest-workspace.spec.ts`
- Product touch **only if red:** `InventoryPanel.tsx`, `OOPlannerWorkspace.handleInventoryPlace` / `handlePlaceAtPoint`, `placementAction.ts`, `furnitureBlock2D.ts` / canvas draw of furniture

- [ ] **Step 1: Implement test `W2 places cabinet-v0 and a second catalog item`**

Can continue from W1 state in one `test` or a second test that re-enters and re-draws a minimal wall (placement often needs floor/room context). Prefer **one serial journey test** with two describe blocks only if isolation is required.

Steps:

1. Ensure canvas ready (after walls or re-enter + one wall).
2. Inventory search for `cabinet-v0` (searchbox label variants: `Search catalog elements` on guest chrome **or** open3d inventory placeholder `Search furniture`):

```typescript
const search = page
  .getByRole("searchbox", { name: /Search catalog elements/i })
  .or(page.getByPlaceholder(/Search furniture/i));
await search.fill("cabinet-v0");
const addCabinet = page.getByRole("button", { name: /Add .* to canvas/i }).first();
await expect(addCabinet).toBeVisible({ timeout: 15_000 });
await addCabinet.click();
```

3. Place on canvas (placement tool armed by inventory handler):

```typescript
await clickOnCanvas(page, 0.4, 0.4);
```

4. Wait for furniture metric ≥ 1 (cabinet-v0 may async GLB write; allow procedural fallback message but **require** furniture entity):

```typescript
await expect
  .poll(async () => {
    const text = await page
      .locator(".pw-status-bar > span")
      .filter({ hasText: /^\d+ furniture$/ })
      .textContent();
    const m = text?.match(/^(\d+)\s+furniture/i);
    return m ? Number.parseInt(m[1], 10) : 0;
  }, { timeout: 30_000 })
  .toBeGreaterThanOrEqual(1);
```

5. Screenshot `04-cabinet-v0-placed.png`.
6. Place **second** distinct catalog item (search `desk` or `sofa` or demo id that is not cabinet-v0):

```typescript
await search.fill("desk");
const addSecond = page.getByRole("button", { name: /Add .* to canvas/i }).first();
await expect(addSecond).toBeVisible({ timeout: 15_000 });
await addSecond.click();
await clickOnCanvas(page, 0.55, 0.55);
await expect
  .poll(/* furniture count */, { timeout: 20_000 })
  .toBeGreaterThanOrEqual(2);
```

7. Screenshot `05-two-items-placed.png`.
8. **Block2D readable check (W2 symbol bar for this phase):** canvas screenshot must not be an empty mid-gray plate. Assert:

```typescript
const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
await expect(canvas).toBeVisible();
// Pixel diversity: sample via screenshot buffer size + optional evaluate getImageData variance
const shot = await canvas.screenshot({
  path: path.join(EVIDENCE_DIR, "06-canvas-2d-symbols.png"),
});
expect(shot.byteLength).toBeGreaterThan(5_000);
```

Optional stronger check (if stable): `page.evaluate` read a few pixels from the 2D canvas context and assert more than one unique color class in the furniture region. Do not require photoreal fidelity — that is **W7**.

9. Screenshot `07-journey-complete.png` (full page).

- [ ] **Step 2: Run full W1+W2 file**

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

Expected: all tests in file **pass**, exit code **0**.

- [ ] **Step 3: Product fixes if W2 red**

| Symptom | First place to look |
|---------|---------------------|
| cabinet-v0 not in inventory | `demoCatalogItems` + `useOpen3dWorkspaceCatalog` merge of demo when API empty |
| Add button missing | `InventoryPanel` aria-label `Add ${shortName} to canvas` |
| Click does not place | `handlePlaceAtPoint`, pending catalog id, canvas placement tool |
| furniture metric stays 0 | place path not updating project / metrics not bound |
| Blank 2D symbol | `furnitureBlock2D` / FeasibilityCanvas furniture draw (P05 may already own symbol quality — call that phase if draw exists but looks empty) |
| GLB place hangs forever | Timeout + procedural fallback already in workspace; assert furniture still lands |

- [ ] **Step 4: Commit**

```text
git commit -m "test(e2e): W2 place cabinet-v0 and second catalog item on open3d"
```

---

### Task 4: Proof block + package script + CP-07 evidence

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts` (`afterAll` or node-side write)
- Modify: `site/package.json` — add script
- Write: `results/planner/world-standard-wave/02-browser-open3d-journey/playwright-run.json`
- Write or copy: screenshots listed below
- Write: `results/planner/world-standard-wave/07-browser-journey/NOTES.md` (pointer) **or** duplicate proof

- [ ] **Step 1: Required screenshot set (flat evidence dir)**

| File | Meaning |
|------|---------|
| `01-route-ready.png` | Planner loaded (open3d or guest) |
| `02-walls-drawn.png` | After wall draws |
| `03-door-opening.png` | After door/opening |
| `04-cabinet-v0-placed.png` | After cabinet-v0 place |
| `05-two-items-placed.png` | ≥2 furniture |
| `06-canvas-2d-symbols.png` | 2D canvas crop/symbol proof |
| `07-journey-complete.png` | End state |

- [ ] **Step 2: Write `playwright-run.json` proof block**

Shape (fill real numbers from the green run; do not pre-claim pass):

```json
{
  "slice": "P07 / CP-07 world-standard W1–W2 open3d journey",
  "date": "YYYY-MM-DD",
  "result": "pass",
  "tests": 1,
  "failed": 0,
  "gates": {
    "W1": "pass",
    "W2": "pass"
  },
  "routeUsed": "open3d",
  "command": "npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list",
  "cwd": "site",
  "baseURL": "http://localhost:3000",
  "server": "pnpm run dev (repo root) or Playwright webServer if configured",
  "spec": "site/tests/e2e/open3d-world-standard-journey.spec.ts",
  "proof": {
    "wallsAtLeast": 1,
    "doorOrOpeningPlaced": true,
    "furnitureAtLeast": 2,
    "includesCabinetV0": true,
    "screenshots": [
      "01-route-ready.png",
      "02-walls-drawn.png",
      "03-door-opening.png",
      "04-cabinet-v0-placed.png",
      "05-two-items-placed.png",
      "06-canvas-2d-symbols.png",
      "07-journey-complete.png"
    ]
  },
  "rawLog": "playwright-raw.log",
  "blockersResolved": []
}
```

Rules:

- `result` may be `"pass"` only when exit code is 0 and every screenshot path exists.
- If any gate red: `"result": "fail"`, list failures under `blockersResolved` is wrong — use `blockersOpen` array of concrete facts.
- Never delete failed run artifacts; archive over delete.

- [ ] **Step 3: Add npm script**

In `site/package.json` scripts:

```json
"test:e2e:world-standard-w1w2": "npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list"
```

- [ ] **Step 4: Phase alias**

Either:

1. Copy `playwright-run.json` + PNGs into `07-browser-journey/`, or  
2. Write `07-browser-journey/NOTES.md`:

```markdown
# P07 evidence alias

Canonical proof: `../02-browser-open3d-journey/`  
Checkpoint: CP-07  
Gates: W1, W2
```

- [ ] **Step 5: Re-run once from clean state for sign-off**

Full sign-off command (record operator, times, git HEAD in proof or raw log header):

```powershell
cd D:\OandO07072026\site
pnpm run test:e2e:world-standard-w1w2
```

- [ ] **Step 6: Commit landable slice**

```text
git add site/tests/e2e/open3d-world-standard-journey.spec.ts site/package.json
git commit -m "test(e2e): CP-07 W1–W2 open3d draw/place journey + npm script"
```

Do **not** commit huge binary dumps beyond the seven PNGs + json/log unless owner asks.

---

### Task 5: CP-07 hard-stop checklist

Mark complete only with paths that exist on disk:

- [ ] **CP-07.1** Spec exists: `site/tests/e2e/open3d-world-standard-journey.spec.ts`
- [ ] **CP-07.2** W1 green: walls + door/opening proven in browser
- [ ] **CP-07.3** W2 green: ≥2 furniture including `cabinet-v0`
- [ ] **CP-07.4** Screenshots `01`–`07` under `results/planner/world-standard-wave/02-browser-open3d-journey/`
- [ ] **CP-07.5** `playwright-run.json` proof block with `result: "pass"`, `failed: 0`, gate keys W1/W2
- [ ] **CP-07.6** Raw log retained (`playwright-raw.log` or handbook nested `*-raw.log`)
- [ ] **CP-07.7** `07-browser-journey/` alias or NOTES pointer present
- [ ] **CP-07.8** Local commit for the landable test/product slice (no push without owner ask)
- [ ] **CP-07.9** Honesty: do **not** mark W3–W8 or “planner works” from this phase alone

**CP-07 exit statement (copy into handover when green):**

> P07 complete. W1 and W2 browser-proven on route `<open3d|guest>`. Evidence: `results/planner/world-standard-wave/02-browser-open3d-journey/playwright-run.json`. Next phase per INDEX (P08 mesh / remaining W gates as ordered).

---

## Failure handling

| Failure | Action |
|---------|--------|
| Port 3000 conflict | Stop. Log `Failures.md`. Do not kill unknown processes without ask. |
| Auth wall on `/planner/open3d` | Use guestMode path or `/planner/guest/`; do not weaken production auth. |
| Flaky canvas hit-test | Prefer helper `dragOnCanvas` / `placeOpeningOnCanvas`; increase steps; fix product hit-test if systematic. |
| cabinet-v0 GLB write 500 | Procedural fallback must still place furniture; document in proof `blockersResolved` if GLB skipped. |
| CI without display | Local browser proof is required for CP-07; do not claim pass from unit mocks. |
| Scope creep (select/delete, save, orbit) | Stop. Those are P03/P04/P06. File residual note only. |

Log open blockers in repo-root `Failures.md` with command, exit code, and evidence path. Never filter test output.

---

## Non-regression (after green)

Optional parallel agents (do not block CP-07 claim if already green, but run before calling the whole wave done):

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/modularPlaceMesh.test.ts
# if present; otherwise the modular place smoke set under results/planner/modular-place-smoke/
```

P0 unit spines remain history, not a substitute for this browser pack.

---

## Dependencies on other trustdata phases

| Phase | Relation to P07 |
|-------|-----------------|
| P01–P02 | Truth + engine lock: know Feasibility is live 2D |
| P03 | Select/delete **after** or parallel — not required to **claim** W1–W2 |
| P05 | Symbol quality upgrades improve `06-canvas-2d-symbols.png`; P07 still needs non-blank place proof |
| P06 | Save/reload not required for CP-07 |
| P08 | Mesh beauty is W7; P07 only requires place + readable 2D footprint |
| P10 | Packs this evidence into final handover |

Parallelism: P07 Playwright stream may run while P03/P04 code streams land, max 8 agents, as long as they do not thrash the same canvas tool contracts without coordination.

---

## Explicit non-goals

- Claiming full world-standard (W1–W8) from draw/place alone  
- Photoreal 3D or orbit proof (P04 / W4)  
- Cloud save or honest “Saved” copy (P06 / W5–W6)  
- Admin SVG publish (already P0.1 spine)  
- Copying Planner5D or any competitor UI  
- Worktrees, silent test skips, forced clicks on hidden controls, deleting red evidence  

---

## Execution order (summary)

1. Task 00 preconditions  
2. Task 1 skeleton + evidence dirs  
3. Task 2 W1 red→green (+ product fix if real)  
4. Task 3 W2 red→green (+ product fix if real)  
5. Task 4 proof JSON + script + alias  
6. Task 5 CP-07 checklist → stop or hand to next phase  

**Owner unlock required before any product/test implementation.** This file is the plan; checkboxes start empty until execution.
