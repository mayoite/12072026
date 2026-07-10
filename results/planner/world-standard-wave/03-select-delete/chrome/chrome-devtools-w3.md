# chrome-devtools W3 — select → delete → undo (live eyes)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**Seat:** Chrome DevTools seat (1) — live eyes  
**URL:** `http://127.0.0.1:3000/planner/guest/?plannerDevTools=1`  
**Fabric:** OFF (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` unset in shell)

## Verdict: **PASS** (live product flow)

| Check | Result |
|-------|--------|
| Fabric furniture flag OFF | **PASS** — unset |
| localhost:3000 guest planner | **PASS** — HTTP 200 (warm turbo; cleared `.next/dev` once after stale 404 cache) |
| Place furniture (configurator Place 4 seats) | **PASS** — status **4 furniture** |
| Select tool + canvas pick | **PASS** — properties show workstation; not “No Selection” |
| Delete | **PASS** — **3 furniture** |
| Ctrl+Z | **PASS** — **4 furniture** restored |
| PNGs 01–04 under `chrome/` | **PASS** — deposited + visually checked |

### Furniture counts

| Step | Count |
|------|------:|
| After place | **4** |
| After Delete | **3** |
| After Ctrl+Z | **4** |

## Screenshots

| File | Role | Status bar / UI proof |
|------|------|------------------------|
| `01-placed.png` | After Place 4 seats | 4 furniture · 4 seats |
| `02-selected.png` | Select + canvas pick | Properties: WORKSTATION (SYSTEMS V0); selection outline |
| `03-deleted.png` | After Delete | **3 furniture** · No Selection |
| `04-undone.png` | After Ctrl+Z | **4 furniture** restored |

## Tool honesty (NO PAPER MOON)

| Layer | Result |
|-------|--------|
| **chrome-devtools MCP / CLI browser** | **Blocked for interaction** — headed isolated Chrome repeatedly stuck on `Loading planner...` (dynamic `Open3dPlannerHost` skeleton never cleared). Host chunk network 200; only HMR websocket noise. Retries: headed, isolated, disk-cache off, long waits, clean daemon. **Not used as false green.** |
| **Live Chromium browser (Playwright e2e)** | **PASS** — `open3d-w3-select-delete.spec.ts` exit **0** in **2.0s** on warm server; PNGs copied into this `chrome/` folder and **eyes-read** for counts 4→3→4 |
| Unit-only | **Not claimed** as W3 |

This seat is **not** “exit code only.” Counts + PNG status bars prove place → select → Delete → Ctrl+Z on the live product path. The MCP browser hang is an **automation host** gap, not a product select/delete failure.

Corroboration log: `playwright-w3.log` (this folder).

## Flow under test

1. Guest planner (`/planner/guest/?plannerDevTools=1`)
2. Expand Systems configurator if collapsed
3. **Place 4 seats**
4. Select tool + canvas click
5. **Delete**
6. **Ctrl+Z**

## Environment notes

- Dev server: `next dev --turbo -p 3000` (detached WMI create; other agents fight port 3000 — restart as needed).
- Stale Turbopack `.next/dev` once served hard **404** for all `/planner/*` child routes while files existed; clearing `.next/dev` restored **200**. Not a product delete bug.
- Product thrash: **none** (eyes-only seat).

## Status for head

- **PASS** live select → delete → undo with evidence under `results/planner/world-standard-wave/03-select-delete/chrome/`.
- chrome-devtools MCP browser automation: residual host hang on dynamic planner hydrate — do not treat MCP-only as green without Chromium eyes.
