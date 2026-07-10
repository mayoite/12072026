# P03 / W3 PROOF-INDEX — `results/planner/world-standard-wave/03-select-delete/`

**Coherent same-tip deposit.** Paths relative to this folder.  
**HEAD:** `HEAD.txt` · **status:** `run.json` → **`pass`** (unit **and** browser exit 0; unit alone ≠ W3).

| File | Purpose | Present |
|------|---------|---------|
| `HEAD.txt` | `git rev-parse HEAD` pin | **Y** — `d4b0c492d3ecd596bb65498fe2cfa404f2aa0a99` |
| `run.json` | Phase meta: unitPack + browser + single `status` | **Y** — **`pass`** |
| `NOTES.md` | Fabric OFF; unit alone ≠ W3; exact-count e2e; no dual-status | **Y** |
| `PROOF-INDEX.md` | This index | **Y** |
| `unit-w3-pack.log` | W3 unit pack verbose (4 files / 97 tests) | **Y** |
| `unit-w3-pack-raw.log` | Raw twin of unit pack | **Y** |
| `browser-w3-raw.log` | Playwright list — **exit 0** exact-count e2e | **Y** |
| `01-placed.png` | After place (+4 seats) | **Y** |
| `02-selected.png` | After Select (furniture selection) | **Y** |
| `03-deleted.png` | After Delete (−1) | **Y** |
| `04-undone.png` | After Ctrl+Z (count restored) | **Y** |
| `W3-ACCEPTANCE.md` | Historical browser acceptance notes | **Y** |
| `CP-03-SCORECARD.md` | Scorecard seat writeup | **Y** |
| `CP-03-LIVE-REVIEW.md` | Live code-review gate notes | **Y** |
| `PHASE-SUMMARY.md` | Phase narrative | **Y** |
| `CODE-REVIEW-*.md` | Prior reviews (may be older tips) | **Y** |
| `coverage/` | Coverage dumps (supporting; not sole gate) | **Y** (dir) |
| `chrome/` | Diagnostic probes; `_cdm/node_modules` deleted | **Y** (dir; non-proof) |

## Required pack checklist

| Required | Status |
|----------|--------|
| `HEAD.txt` | **present** — tip after green runs |
| `run.json` | **present** — `status: pass` |
| Unit logs | **present** — exit **0**, 97/97 |
| Browser log + PNGs 01–04 | **present** — exit **0**; PNGs refreshed |
| `PROOF-INDEX.md` | **present** |
| `NOTES.md` | **present** — matches `run.json` |

## Gate read (honest, single status)

| Half | Result |
|------|--------|
| Unit pack | **pass** (exit 0) |
| Browser hard gate (exact counts) | **pass** (exit 0) |
| Combined W3 / CP-03 | **`pass`** |

**Law restated:** unit alone ≠ W3; Fabric OFF; no dual-status across pack files.
