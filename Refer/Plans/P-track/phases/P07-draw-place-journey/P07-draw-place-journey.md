# P07 — Draw / Place Browser Journey (W1–W2)

## Structure rewrite 2026-07-09

**Hybrid thin:** Execute card here. Multi-page Playwright TypeScript skeletons → **[P07-appendix.md](./P07-appendix.md)**. Evidence folder names **unchanged**: canonical `02-browser-open3d-journey/` (+ optional alias `07-browser-journey/`). One serial journey CP — do not split W1 vs W2 into two CPs.

### Expert pass P0 (2026-07-09)

- **Serial pack only:** `test.describe.configure({ mode: "serial", timeout: 120_000 })` — config is `fullyParallel`; multi-writer PNG race = invalid evidence.
- **Anti seed false-green (W1):** capture `wallsBefore` / `objectsBefore`; assert **increase** after draw / opening. Never pass on guest seed walls ≥1/≥4 alone.
- **Anti place false-green (W2):** `furnitureBefore` then ≥ `+2` incl. **cabinet-v0** + second SKU; non-blank canvas PNG ≠ P05 symbol quality. Add **`getFurnitureCount`** helper.
- **Canonical folder:** `02-browser-open3d-journey/` only for W1–W2; do not dump under `results/tests/` or claim W3 from journey. Reuse status metrics (`pw-status-bar`); require **deltas**.
- **No silent skip** — missing screenshot / filtered log = FAIL. Full story still needs CP-03 + CP-05 not red unless owner WAIVE.
- Authority: [EXPERT-PASS.md](../EXPERT-PASS.md) · [04-playwright-evidence.md](./04-playwright-evidence.md) · [01-react-open3d.md](./01-react-open3d.md).

> **For agentic workers:** REQUIRED: `/using-superpowers` · verification · chrome-devtools for browser truth.  
> **W0 UNLOCKED** — execute product work per phase + evidence. Do not re-ask owner unlock.  
> **Checkout:** `.` only · no worktrees · commit as we go · push only on ask.  
> **Suggestions:** [P07-suggestions.md](./P07-suggestions.md)

**Goal:** Prove in a real browser: unaided buyer opens open3d planner, **draws walls + door/opening**, **places ≥2 catalog items including cabinet-v0** with non-blank 2D symbols — gates **W1** and **W2** (place half).

**Architecture:** One Playwright pack on `/planner/open3d` (preferred) or guest. Spec owns screenshots + `playwright-run.json` under world-standard evidence tree. Product code only when journey fails for real product reasons.

**Tech:** Playwright (`site/config/build/playwright.config.ts`) · Next open3d stack · FeasibilityCanvas · InventoryPanel · demo catalog `cabinet-v0` · status bar metrics · serial mode (config is `fullyParallel`).

**Checkpoint:** **CP-07** — hard stop until W1 + W2 **browser place/draw** green. Symbol **quality** = P05; mesh = P08.

**Kill-order role:** Serial spine #4 after W3 ([INDEX](../../INDEX.md#week-1-kill-order-after-implementation-unlock)). Full product story still needs CP-03 + CP-05 not red unless owner **WAIVE**.

**Authority:** Owner > `Plans/trustdata/` > design spec > Plan A core.  
**Ethics:** Ideas only from research; no competitor code/CSS/GLB in product or tests.

**Out of scope:** W3/W4/W5–W6/W7/W8 product polish · Fabric full-stage · cloud save · SSR.

---

## Gate definitions (binding)

| Gate | Must prove | Proof |
|------|------------|-------|
| **W1** | Walls metric **increases** after draw (not seed alone) + door/opening increases **objects** | Playwright + PNGs |
| **W2** | Place ≥2 furniture incl. **`cabinet-v0`**; second preferred `sample-desk-1`; furniture ≥2; 2D non-blank | Playwright + PNGs |

**Done:** `playwright-run.json` `result: "pass"`, failed = 0, screenshots on disk. Unit-green alone ≠ CP-07. Seeded walls alone ≠ W1.

---

## Locked paths

| Role | Path |
|------|------|
| **New Playwright spec** | `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| **Helpers** | `guestProjectSetup.ts`, `plannerCanvasHelpers.ts` (+ test-only `getFurnitureCount`) |
| **Gold pattern** | `admin-svg-publish-p01.spec.ts` · place UX: `planner-guest-workspace.spec.ts` |
| **Canonical evidence** | `results/planner/world-standard-wave/02-browser-open3d-journey/` |
| **Phase alias** | `…/07-browser-journey/` (copy or NOTES pointer — not a third name) |
| **Proof / log** | `playwright-run.json` · `playwright-raw.log` |
| **Config** | `site/config/build/playwright.config.ts` — must set `mode: "serial"` in journey file |
| **Product entry** | `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` → Feasibility + Inventory |
| **cabinet-v0 / desk** | `demoCatalogItems.ts` |
| **npm script** | `test:e2e:world-standard-w1w2` (document `PLAYWRIGHT_BASE_URL`) |

**Selectors (O&O only):** Wall/Opening tool labels · searchbox `Search catalog elements` · `Add … to canvas` · `[data-testid="planner-2d-canvas"] canvas` · `.pw-status-bar`.

---

## Skills

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| `verification-before-completion` | Before CP-07 green claim |
| `chrome-devtools` | Flakes / selector triage |
| `systematic-debugging` | Product-real failures |
| `executing-plans` / subagent-driven | After unlock |

---

## Preconditions (Task 00)

- [ ] **00.1** Read INDEX, 00-START, this file, design W1–W2.
- [ ] **00.2** Approach **A** selected/defaulted.
- [ ] **00.3** Live 2D = Feasibility; `cabinet-v0` in demo catalog with `geometryMode: "modular-cabinet-v0"`.
- [ ] **00.4** Dev server: `pnpm run dev` → `/planner/open3d` and guest.
- [ ] **00.5** Playwright browsers installed if missing.
- [ ] **00.6** Create evidence dirs:

```powershell
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\02-browser-open3d-journey" | Out-Null
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\07-browser-journey" | Out-Null
```

---

## Tasks

### Task 1 — Spec skeleton + helpers

**Files:** create journey spec · add `getFurnitureCount` · later package.json script.

- [ ] **1.1** Add `getFurnitureCount` (mirror `getWallCount`) — [appendix](./P07-appendix.md#getfurniturecount).
- [ ] **1.2** Create serial spec with evidence path constants + `beforeAll` mkdir — [appendix header](./P07-appendix.md#spec-header).
- [ ] **1.3** Entry helper `enterWorldStandardPlanner` (open3d primary, guest fallback; clear storage) — [appendix](./P07-appendix.md#entry-helper).
- [ ] **1.4** Seed honesty: guest may have ≥4 walls — W1 uses **deltas**.
- [ ] **1.5** Commit skeleton if unlock allows: `test(e2e): scaffold open3d world-standard W1–W2 journey spec`.

### Task 2 — W1 draw walls + door/opening

- [ ] **2.1** Capture `wallsBefore` / `objectsBefore` → draw four wall segments → assert walls **increased** → screenshot `02-walls-drawn.png`.
- [ ] **2.2** Opening tool (not shortcut D) → place opening → assert objects **increased** → `03-door-opening.png`.
- [ ] **2.3** Full interaction script: [appendix W1](./P07-appendix.md#w1-interaction-script).
- [ ] **2.4** Run with baseURL:

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

Capture raw log under `02-browser-open3d-journey/`. Optional `run-evidence-cmd.ps1` — still keep flat proof at evidence root.

- [ ] **2.5** Product fix only if red for real reason (tool labels, metrics, opening hit-test, blank open3d). No Fabric-only workaround.
- [ ] **2.6** Commit when W1 green.

### Task 3 — W2 place ≥2 incl. cabinet-v0

- [ ] **3.1** Continue serial journey: furniture baseline → search `cabinet-v0` → Add → click canvas → furniture **increases**.
- [ ] **3.2** Second SKU search `desk` (`sample-desk-1`; fallback sofa) → furniture ≥ baseline+2.
- [ ] **3.3** Non-blank canvas PNG `06-canvas-2d-symbols.png` (byteLength > 5000). Quality bar = P05.
- [ ] **3.4** Scripts: [appendix W2](./P07-appendix.md#w2-interaction-script).
- [ ] **3.5** Run full file exit 0. Fix product only if real red (inventory, place, metrics, blank symbol → P05 residual).
- [ ] **3.6** Commit W2.

### Task 4 — Proof block + npm script + alias

Required screenshots:

| File | Meaning |
|------|---------|
| `01-route-ready.png` | Planner loaded |
| `02-walls-drawn.png` | After walls |
| `03-door-opening.png` | After opening |
| `04-cabinet-v0-placed.png` | After cabinet |
| `05-two-items-placed.png` | ≥2 furniture |
| `06-canvas-2d-symbols.png` | 2D symbol proof |
| `07-journey-complete.png` | End state |

- [ ] **4.1** Write `playwright-run.json` — [full shape](./P07-appendix.md#playwright-run-json). `result: pass` only if exit 0 and all PNGs exist.
- [ ] **4.2** Add `test:e2e:world-standard-w1w2` script; document `PLAYWRIGHT_BASE_URL` vs build+start.
- [ ] **4.3** Phase alias: copy proof to `07-browser-journey/` **or** NOTES pointer.
- [ ] **4.4** Sign-off re-run; commit landable slice (no huge binary dumps beyond 7 PNGs + json/log).

### Task 5 — CP-07 checklist

- [ ] **CP-07.1** Spec exists  
- [ ] **CP-07.2** W1: walls Δ + objects Δ  
- [ ] **CP-07.3** W2: furniture ≥2 incl. cabinet-v0 (+ second id recorded)  
- [ ] **CP-07.4** Screenshots 01–07 under `02-browser-open3d-journey/`  
- [ ] **CP-07.5** `playwright-run.json` pass, failed 0, gates W1/W2  
- [ ] **CP-07.6** Raw log retained  
- [ ] **CP-07.7** `07-browser-journey/` alias or NOTES  
- [ ] **CP-07.8** Local commit; push/mirror per `AGENTS.md` (no force-push without owner)  
- [ ] **CP-07.9** Honesty: do not mark W3–W8 or “planner works” from this phase alone  

**Exit statement when green:**  
> P07 complete. W1 and W2 browser-proven on route `<open3d|guest>`. Evidence: `…/02-browser-open3d-journey/playwright-run.json`.

---

## Failure handling

| Failure | Action |
|---------|--------|
| Port 3000 conflict | Stop; log Failures.md; do not kill unknown processes |
| Auth wall on open3d | Guest path; do not weaken prod auth |
| Flaky hit-test | Prefer helpers; fix product if systematic |
| False-green walls ≥1 | Require walls **delta** |
| baseURL unset → build+start | Record in proof or set baseURL |
| cabinet-v0 GLB 500 | Procedural fallback must still place furniture |
| Scope creep (select/save/orbit) | Stop — P03/P04/P06 |

Never filter test output. Never delete red evidence (archive over delete).

---

## Dependencies

| Phase | Relation |
|-------|----------|
| P01–P02 | Feasibility is live 2D |
| P03 | Parallel; full story wants CP-03 before celebrating whole planner |
| P05 | Symbol quality; P07 needs non-blank only |
| P06 | Not required for CP-07 |
| P08 | Mesh not required |
| P10 | Packs this evidence |

Parallelism OK after CP-02 with coordination (max 8 agents).

---

## Execution order

1. Task 00 preconditions  
2. Task 1 skeleton  
3. Task 2 W1 red→green  
4. Task 3 W2 red→green  
5. Task 4 proof + script  
6. Task 5 CP-07 → next per kill order (spine → P06; fill streams parallel)

**Owner unlock required before implementation.**

---

## Expert note summary (2026-07-09)

From [P07-suggestions](./P07-suggestions.md): serial evidence writer; baseline deltas; baseURL honesty; `getFurnitureCount` + objects Δ for door; second SKU lock `sample-desk-1`. Full TS skeletons in appendix.
