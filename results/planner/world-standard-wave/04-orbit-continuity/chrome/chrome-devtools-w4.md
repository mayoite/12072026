# P04 Chrome DevTools W4 — live eyes (2D↔3D + orbit)

**Seat:** Chrome DevTools (1 of 8)  
**Date:** 2026-07-10  
**HEAD at proof:** `01c0f80b9443eae135df63a1289662fd9c3cd921`  
**Route:** `http://localhost:3000/planner/guest/?plannerDevTools=1`  
**Driver:** `chrome-devtools` CLI (persistent daemon + **isolatedContext=`p04-chrome-w4`**)  
**Not:** Playwright exit code alone

## Verdict: **PASS**

FAIL gates from brief:

| Gate | Result |
|------|--------|
| 3D blank / broken | **PASS** — 3D view shows room + desks/chairs; `Wall · 3D` chrome |
| `data-orbit-enabled` false / missing | **PASS** — measured `"true"` on `[data-testid=three-viewer-container]` |
| No chrome-devtools-mcp `node_modules` under this evidence tree | **PASS** — tools installed under `results/_tools/chrome-devtools-cli` only |

## Screenshots (required paths)

| File | What live eyes show |
|------|---------------------|
| `01-2d.png` | Guest planner **2D** active; furniture placed (status **8 furniture / 8 seats**); Systems Configurator open |
| `02-3d.png` | **3D** radio selected; non-blank 3D room with workstations; `Wall · 3D` |
| `03-orbit.png` | After left-drag orbit; **camera pose changed** vs 02; still 3D + furniture; no crash |

## Live measurements (evaluate_script)

### After 3D toggle (re-state2)

```json
{"has3d":true,"orbit":"true","furniture":8,"canv":[{"t":null,"cw":427,"ch":757,"w":429,"h":759}]}
```

### Left-drag orbit (re-drag)

```json
{"ok":true,"rect":{"w":429,"h":759},"orbit":"true","still3d":true}
```

### Post-orbit (re-post)

```json
{"has3d":true,"orbit":"true","furniture":8,"crashed":false}
```

### 2D restore continuity (re-back2d)

```json
{"furniture":8,"has3d":false,"mode":"Wall · 2D"}
```

### 3D again (re-again3d)

```json
{"furniture":8,"has3d":true,"orbit":"true"}
```

## Flow executed

1. Dev server on `:3000` (existing PID 28632; guest route HTTP 200).
2. Restarted chrome-devtools daemon; opened **isolated** context to avoid concurrent-agent tab thrash.
3. Guest planner → Systems Configurator → **Place 4 seats** (count rose; session ended at **8 furniture** — residual prior place + batch; continuity held at 8).
4. Screenshot `01-2d.png`.
5. Radio **3D** → wait for viewer → assert `data-orbit-enabled="true"` + `planner-3d-canvas` present.
6. Screenshot `02-3d.png`.
7. Simulated left-drag orbit on 3D canvas (pointer/mouse events) → screenshot `03-orbit.png` (camera moved).
8. Toggle **2D** → furniture still 8 → toggle **3D** → orbit still `"true"`, has3d true.

## Honesty / non-claims

- This seat proves **live DOM + eyes**: orbit attr, non-blank 3D, orbit drag does not crash, furniture count survives 2D↔3D.
- **Pose ids / mm / rotation continuity** remain unit-layer (see `poseContinuityW4` / THREE-LAYER audit) — not re-proven here as numeric pose matrix.
- Early attempts on `http://127.0.0.1:3000` stuck on “Loading planner…” (Next dev **blocked cross-origin** HMR/origin). Proof used **`localhost`** only.
- Shared chrome-devtools without `isolatedContext` was unusable under concurrent agents (page list thrash). Isolation fixed it.
- Furniture count is **8**, not exactly +4 from a pristine 0 — place path still valid; continuity metric is **stable count across view toggles**.

## Supporting artifacts (this folder)

- `re-state2.txt`, `re-drag.json`, `re-post.json`, `re-back2d.json`, `re-again3d.json`
- Flow snaps: `flow-snap*.txt`, `re-snap*.txt`
- Console/network during stuck-load diagnosis: `console-errors.txt`, `network.txt` (diagnostic only)

## Status line for orchestrator

```
P04 chrome-devtools W4 eyes: PASS live (orbit=true, 3D non-blank, 2D↔3D furniture=8)
```
