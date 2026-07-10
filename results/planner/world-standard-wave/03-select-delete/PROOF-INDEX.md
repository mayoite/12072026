# P03 / W3 PROOF-INDEX — `results/planner/world-standard-wave/03-select-delete/`

**Agent 9 deposit.** Paths relative to this folder.  
**HEAD:** `HEAD.txt` · **status:** `run.json` → **`open`** (unit alone ≠ W3).

| File | Purpose | Present |
|------|---------|---------|
| `HEAD.txt` | `git rev-parse HEAD` pin | **Y** |
| `run.json` | Phase meta: unitPack + browser + honest `status` | **Y** |
| `NOTES.md` | Fabric OFF; unit alone ≠ W3; count-only residual | **Y** |
| `PROOF-INDEX.md` | This index | **Y** |
| `unit-w3-pack.log` | W3 unit pack verbose (Agent 9 re-run, 62/62) | **Y** |
| `unit-w3-pack-raw.log` | Raw twin of unit pack | **Y** |
| `unit-w3-pack-tdd.log` | Prior TDD/unit pack seat log | **Y** |
| `browser-w3-raw.log` | Playwright list — **live re-prove exit 1** | **Y** |
| `01-placed.png` | After place (refreshed on failed tip re-prove) | **Y** |
| `02-selected.png` | After Select (residual / prior green) | **Y** |
| `03-deleted.png` | After Delete (residual) | **Y** |
| `04-undone.png` | After Ctrl+Z (residual) | **Y** |
| `W3-ACCEPTANCE.md` | Historical browser acceptance (older HEAD) | **Y** |
| `CP-03-SCORECARD.md` | Scorecard seat writeup | **Y** |
| `CP-03-LIVE-REVIEW.md` | Live code-review gate notes | **Y** |
| `PHASE-SUMMARY.md` | Phase narrative | **Y** |
| `CODE-REVIEW-LIVE.md` | Earlier live review (may be stale) | **Y** |
| `01-pick-furniture-vitest-raw.log` | Suite raw: canvas picking | **Y** |
| `02-delete-undo-vitest-raw.log` | Suite raw: delete/undo | **Y** |
| `04-keyboard-delete-vitest-raw.log` | Suite raw: keyboard | **Y** |
| `05-canvas-select-vitest-raw.log` | Suite raw: canvas select | **Y** |
| `unit-canvasPicking.log` | Per-suite alias | **Y** |
| `unit-applySelectionDelete.log` | Per-suite alias | **Y** |
| `unit-open3dWorkspaceKeyboard.log` | Keyboard unit log | **Y** |
| `unit-open3dFeasibilityCanvas.log` | FeasibilityCanvas unit log | **Y** |
| `unit-residual.log` | Residual unit pack alias | **Y** |
| `agent1-applySelectionDelete-vitest.log` | Exec agent applySelectionDelete | **Y** |
| `exec1-delete-path.md` | Exec: delete path | **Y** |
| `exec2-pick-select.md` | Exec: pick/select | **Y** |
| `exec2-pick-select-vitest-raw.log` | Exec2 vitest raw | **Y** |
| `exec3-keyboard.md` | Exec: keyboard | **Y** |
| `guest-headers.txt` | Guest route probe dump (session) | **Y** |
| `chrome/` | Local chrome dump dir if present | **Y** (dir) |
| `coverage/` | Local coverage dir if present | **Y** (dir) |

## Required pack checklist (Agent 9)

| Required | Status |
|----------|--------|
| `HEAD.txt` | **present** |
| `run.json` | **present** — `status: open` |
| Unit logs | **present** — exit 0, 62/62 |
| Browser log + PNGs 01–04 | **present** — log exit **1**; PNGs on disk (incomplete tip flow) |
| `PROOF-INDEX.md` | **present** |
| `NOTES.md` | **present** |

## Gate read (honest)

| Half | Result |
|------|--------|
| Unit pack | **pass** (exit 0) |
| Browser hard gate (tip) | **fail** (exit 1) |
| Combined W3 / CP-03 | **`open`** |
