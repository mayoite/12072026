# LIVE — Guest planner Elon standard (Chrome DevTools)

**Date:** 2026-07-09  
**Method:** Live only — Chrome DevTools MCP (`chrome-devtools-*`)  
**Checkout:** `D:\OandO07072026`  
**URL:** `http://localhost:3000/planner/guest/`  
**Scope:** Open guest planner → a11y Focus/Prefs names → Place 4 seats. **No redesign.**

---

## Verdict

| Check | Result |
|-------|--------|
| 1. Open guest planner + screenshot after load | **PASS** |
| 2. Focus / Prefs button names via a11y snapshot | **PASS** |
| 3. Place 4 seats via configurator | **PASS** |
| Evidence under `results/planner/elon-standard/chrome-devtools/` | **PASS** |

**Overall: PASS** (journey goals met; unrelated catalog 404 noise noted below, not a fail for this slice).

---

## 1. Open guest planner — screenshot after load

| Fact | Value |
|------|--------|
| Dev server | HTTP 200 on `localhost:3000/planner/guest/` |
| Title | `Planner Workspace \| One&Only \| One&Only` |
| Mode | `2D` radio checked |
| Canvas | region `Drawing canvas` / canvas `Floor plan drawing surface` |
| Baseline scene | `4` walls, `0` furniture (before place) |
| Status | `Live catalog`, `Draft saved locally` / `SAVED LOCALLY` |
| Configurator | region `Workstation systems configurator` expanded |

**Evidence:** `01-guest-planner-loaded.png`, `02-a11y-snapshot-loaded.txt`

---

## 2. Focus / Prefs button names (a11y snapshot)

Exact accessible names from live a11y tree after load:

| Control | Accessible name (exact) | Snapshot uid (load) |
|---------|-------------------------|---------------------|
| Focus | **`Focus — maximize canvas`** | `13_9` |
| Prefs | **`Prefs — open preferences menu`** | `13_15` |

- Prefs: `expandable` + `haspopup="menu"`.
- Focus: plain button (maximize canvas).

**Evidence:** `02-a11y-snapshot-loaded.txt` (and post-place tree still shows same names).

---

## 3. Place 4 seats via configurator

| Step | Fact |
|------|------|
| Control | button **`Place 4 seats`** (uid `13_52`) under `Workstation systems configurator` |
| Config at click | Shape **Linear** pressed; Size **900×600** pressed; Modules **Pedestal** + **Panel** pressed |
| Action | Live click on `Place 4 seats` |

**After place (status bar / live region):**

| Metric | Before | After |
|--------|--------|-------|
| objects | 4 | **8** |
| walls | 4 | 4 |
| furniture | 0 | **4** |
| seats | — | **4** seats |
| Live polite | — | **`Placed 4× ws-v0-linear-900x600-desk+panel+pedestal`** |
| Save | SAVED LOCALLY | `UNSAVED CHANGES` / `MODIFIED` / `Saving locally…` |
| Undo | disabled | **enabled** |
| Selection | none | Properties show **FURNITURE** `ws-v0-linear-900x600-desk+panel+pedestal`; status `4 furnitures selected` |
| Tool | Wall (before) | **Select (V)** pressed after place |

**Evidence:** `03-after-place-4-seats.png`, `04-a11y-snapshot-after-place-4.txt`

---

## Console / network (honest noise — not journey fail)

| Kind | Detail |
|------|--------|
| ERROR (404 ×2) | `GET /proof-chair.svg` → 404; `GET /placeholder-cabinet.svg` → 404 (catalog thumb assets) |
| WARN | Next.js `layout.css` preload unused (dev noise) |
| Catalog API | `GET /api/planner/catalog/svg-blocks/` → 200 after 308 redirects |

Place-4 path did **not** depend on those missing SVGs; furniture count and live message confirm placement.

---

## Evidence files

```
results/planner/elon-standard/chrome-devtools/
  01-guest-planner-loaded.png
  02-a11y-snapshot-loaded.txt
  03-after-place-4-seats.png
  04-a11y-snapshot-after-place-4.txt
  LIVE.md
```

---

## Next step

None for this slice. Optional cleanup (out of scope): fix missing `proof-chair.svg` / `placeholder-cabinet.svg` catalog assets.
