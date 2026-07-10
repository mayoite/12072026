# W3 ACCEPTANCE — P03 Select / Delete / Undo (browser hard gate)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**HEAD:** `94e4da798d6a252a9e575e71ac4df9340b522337`  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**Seat:** Browser W3 hard gate only  

---

## Verdict: **PASS**

| Check | Result |
|-------|--------|
| Fabric furniture flag OFF (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` ≠ `"1"`) | **PASS** — unset in shell for run |
| Playwright W3 spec green | **PASS** — exit code **0** |
| Flow: place → select → Delete → Ctrl+Z | **PASS** (14.0s test body; 23.6s total) |
| PNGs 01–04 present | **PASS** — all four files on disk |
| `browser-w3-raw.log` | **PASS** — deposited |
| `run.json` status | **PASS** |
| Product architecture rewrite | **None** this seat — e2e already green; no select/delete product thrash |

**Unit alone ≠ W3.** Units were already green (62 residual pack). This seat closes the **browser** hard gate only.

---

## What ran

```text
cd D:\OandO07072026\site
pnpm exec playwright test -c config/build/playwright.config.ts \
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

- **Spec:** `site/tests/e2e/open3d-w3-select-delete.spec.ts`
- **Path under test:** guest planner → `placeSeatsFromConfigurator(4)` → Select tool + canvas click → `Delete` → furniture count down → `Control+z` → count up
- **Server:** `pnpm run dev` (webpack) on `http://localhost:3000`, reused by Playwright (`reuseExistingServer`)
- **Exit code:** `0`
- **Reporter summary:** `1 passed (23.6s)`

### Screenshots

| File | Role |
|------|------|
| `01-placed.png` | After systems configurator place (4 seats) |
| `02-selected.png` | After Select tool + canvas pick (no "No Selection") |
| `03-deleted.png` | After Delete (furniture count reduced) |
| `04-undone.png` | After Ctrl+Z (furniture count restored) |

---

## Environment / pre-flight

1. **Fabric OFF** — `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` removed from env before run (required for Feasibility furniture pick, not Fabric rect layer).
2. **First production-build attempt RED (infra, not product):** Playwright `webServer` ran `pnpm run build && pnpm run start`. Build failed with Turbopack `Module not found: Can't resolve 'react-aria-components'` because the installed package was broken (missing `dist/exports/index.cjs`; stale hardlinks). Fixed with:
   ```text
   pnpm --filter oando-site install react-aria-components@1.19.0 --force
   ```
   Node `require.resolve('react-aria-components')` then OK. **Not a select/delete product bug.**
3. Re-ran W3 against **dev server** after resolve fix → **green**.
4. **No e2e harden required** — existing spec passed without edits. Optional future hardening (`selectPlannerTool` instead of raw Select button) not applied (green; no flaky failure observed).

---

## Honesty notes / residual risk

| Item | Severity | Note |
|------|----------|------|
| Proof server = **dev**, not standalone prod build | Low for W3 behavior | Select/delete is client workspace path; Fabric flag OFF proven. Full `next build` was blocked only by broken dep install, then fixed — not re-proved end-to-end under `pnpm start` this seat. |
| Lockfile / node_modules reinstall | Ops | Force reinstall of `react-aria-components` may touch local install state; package was already declared at `1.19.0` in `package.json`. |
| Chrome-devtools manual | N/A | Not used — Playwright green; no blocker snapshot needed. |

---

## False-green matrix (this seat)

| Failure mode | Mitigated? |
|--------------|------------|
| Unit green claimed as W3 | **No** — browser log + PNGs required and deposited |
| Fabric ON desync | Flag unset for run |
| Empty place then fake select | Poll asserts furniture +4 after place; selection asserts no "No Selection" |
| Delete without selection | Delete only after selection assertion |
| Undo without prior delete | Count after delete, then expect greater after undo |
| Journey folder substituted | Evidence only under `03-select-delete/` |

---

## Status for head

- **DONE** for browser W3 hard gate evidence.
- Commit message target: `test(planner): P03 W3 browser evidence for select-delete`
- Product select/delete Mode A: already landed; **no product code change this seat**.
