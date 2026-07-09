# RESULTS-MAP — `results/planner/world-standard-wave/` → phases

> **For agentic workers:** REQUIRED `/using-superpowers`. Claim a gate **pass** only when the folder below has the minimum artifacts.  
> **Root:** `D:\OandO07072026\results\planner\world-standard-wave\`  
> **Do not** invent alternate folder names mid-wave; if a phase file uses an alias, leave a `NOTES.md` pointer to the canonical path.

**Related:** `checkpoints/CHECKPOINTS.md` · `checklists/MASTER-CHECKLIST.md` · `phases/P10-evidence-handover.md`

---

## Canonical folder map

| Folder (under `world-standard-wave/`) | Phase file | Checkpoint | Gates | Purpose | Minimum artifacts when green |
|---------------------------------------|------------|------------|-------|---------|------------------------------|
| `WAVE.md` (file at root) | Research pre-plan | — | Context | Honest pre-execution verdict + blockers | Exists (already); do not treat as W pass |
| `COMPARISON-CHART.md` (file at root) | Research pre-plan | CP-02 support | Context | In-repo score summary → websites pack | Exists (already) |
| `00-start/` | `00-START.md` | **CP-00** | W0 | Approach pick, unlock note, engine checkbox snapshot | `NOTES.md` with approach A/B/C + date + agent; optional copy of unlock quote |
| `01-product-truth/` | `phases/P01-product-truth.md` | **CP-01** | Baseline | What code actually does vs claims | `INVENTORY.md`, `CONTRADICTIONS.md` with repo paths |
| `01-engine-lock/` | `phases/P02-engine-lock.md` | **CP-02** | Engine | Confirm Fabric dest / Feasibility interim / R3F+orbit / SKU / BOQ>photoreal | `NOTES.md`; link to `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` |
| `02-browser-open3d-journey/` | `phases/P07-draw-place-journey.md` | **CP-07** | **W1–W2** browser | Playwright draw walls+door; place ≥2 items incl. cabinet-v0 | `run.json` or `playwright-run.json`; raw log; screenshots `01`–`N` PNGs; no skipped steps |
| `03-select-delete/` | `phases/P03-select-delete.md` | **CP-03** | **W3** | Select furniture; Delete/Backspace; undo | `run.json`; vitest raw log; unit proof; browser proof when claimed |
| `04-orbit-continuity/` | `phases/P04-orbit-continuity.md` | **CP-04** | **W4** | 2D↔3D pose preserve; orbit ON; console clean | `run.json`; screenshots; console log excerpt |
| `05-symbols-svg/` | `phases/P05-symbols-svg.md` | **CP-05** | **W2** symbols | Block2D cabinet-v0 quality; SVG authority honesty | `run.json` / vitest logs; PNG or prim-JSON; `NOTES.md` canvas vs publish; CP-05 summary if phase requires |
| `06-save-honesty/` | `phases/P06-save-honesty.md` | **CP-06** | **W5–W6** | Flush/reload identity + non-lying save labels | `run.json`; vitest/Playwright logs; label NOTES; prefer subfolder `save-reload/` for W5 hard-reload pack |
| `06-save-honesty/save-reload/` | (same P06) | **CP-06** / W5 | **W5** | Hard reload same wall + furniture ids | Playwright artifacts; id assertion notes |
| `08-mesh-quality/` | `phases/P08-mesh-quality.md` | **CP-08** | **W7** | Modular cabinet-v0 mesh bar (readable parts) | `NOTES.md` bar doc; screenshots; optional vitest logs |
| `08-shortcuts-chrome/` | `phases/P09-shortcuts-chrome.md` | **CP-09** | **W8** | Labels match handlers; blocking chrome only | `run.json`; vitest/keyboard logs; optional Playwright |
| `10-handover/` | `phases/P10-evidence-handover.md` | **CP-10** | Pack | Final evidence index, MASTER sync, backup log | `README.md`, `W-GATES.md`, `MASTER-SYNC.md`, `HEAD.txt`, `FAILURES-SNIP.md`, `BACKUP-LOG.md` |

### Optional alias (pointer only)

| Alias folder | Points to | Rule |
|--------------|-----------|------|
| `07-browser-journey/` | `02-browser-open3d-journey/` | If created, must contain `NOTES.md` with absolute path to canonical folder; do not split artifacts across both without a copy or pointer |

---

## Phase → folder (quick)

| Phase | Folder(s) |
|-------|-----------|
| 00 START | `00-start/` |
| P01 product truth | `01-product-truth/` |
| P02 engine lock | `01-engine-lock/` (+ root `COMPARISON-CHART.md`) |
| P03 select/delete | `03-select-delete/` |
| P04 orbit continuity | `04-orbit-continuity/` |
| P05 symbols/SVG | `05-symbols-svg/` |
| P06 save honesty | `06-save-honesty/` (+ `save-reload/` for W5) |
| P07 draw/place journey | `02-browser-open3d-journey/` |
| P08 mesh quality | `08-mesh-quality/` |
| P09 shortcuts/chrome | `08-shortcuts-chrome/` |
| P10 evidence/handover | `10-handover/` |

Note: **folder numbers are mostly phase-aligned**. Exception: P07 browser journey uses design gold path `02-browser-open3d-journey/` (optional pointer `07-browser-journey/`). P08 mesh uses `08-mesh-quality/`.

---

## Gate → folder (quick)

| Gate | Primary folder | Secondary |
|------|----------------|-----------|
| W0 | `00-start/` | `10-handover/W-GATES.md` at close |
| W1 | `02-browser-open3d-journey/` | — |
| W2 place | `02-browser-open3d-journey/` | — |
| W2 symbols | `05-symbols-svg/` | journey PNGs |
| W3 | `03-select-delete/` | journey may re-assert |
| W4 | `04-orbit-continuity/` | — |
| W5 | `06-save-honesty/save-reload/` or `06-save-honesty/` | prior `results/planner/save-reload-continuity/` historical only |
| W6 | `06-save-honesty/` | — |
| W7 | `08-mesh-quality/` | modular unit folders under `results/planner/modular-*` historical only |
| W8 | `08-shortcuts-chrome/` | — |
| Pack | `10-handover/` | E: `E:\OandO-backups\trustdata-YYYY-MM-DD\` |

---

## Historical / sibling evidence (cite, do not rename)

These live under `D:\OandO07072026\results\planner\` (parent of world-standard-wave). Use as **baseline or non-regression cites** in P01 inventory; they do **not** clear W1–W8 alone.

| Existing folder | Typical content | May support |
|-----------------|-----------------|-------------|
| `p0-1-admin-svg-publish/` | Playwright gold pattern (screenshots + run.json) | Evidence shape for P07 |
| `p0-2-g8-load/`, `p0-2-glb-write/`, `p0-2-place-modular-write/`, `p0-2-ui-wire/` | Unit/spine modular place | Non-regression; not W7 bar |
| `p0-3-a11y-main/`, `p0-3-hydration/` | A11y/hydration notes | P09 blockers only |
| `svg-authority/`, `svg-authority-wire/`, `svg-cli-*` | SVG publish pipeline | P05 honesty (not canvas authority) |
| `save-reload-continuity/` | Unit continuity | Cite in P06; still need browser W5 |
| `fabric-stage-slice/` | Fabric flag path | P02 engine notes |
| `document-view-continuity/` | View continuity units | P04 support |
| `modular-place*`, `modular-glb-plan/`, `glb-stamp/` | Modular place/GLB | P08 non-regression |
| `a11y-open3d/` | A11y snapshot | P09 |
| `hard-path/`, `harden-wave/`, `verify-wave/`, `wave-superpowers/` | Prior waves | Historical |
| `SESSION-RECAP.md` | Session narrative | Not a gate pass |
| `world-standard-wave/WAVE.md` | Pre-plan honest fail list | Starting debt |

---

## Artifact conventions

### `run.json` (minimum fields)

```json
{
  "phase": "P07",
  "gate": ["W1", "W2"],
  "cwd": "D:\\OandO07072026\\site",
  "command": "exact command line",
  "exitCode": 0,
  "startedAt": "ISO-8601",
  "endedAt": "ISO-8601",
  "gitHead": "full-or-short-sha",
  "notes": "wait strategy / selectors / known flakes"
}
```

### Browser proof

- PNG screenshots numbered; names describe step (`01-walls.png`, `02-door.png`, `03-place-cabinet.png`, …).  
- Raw Playwright log retained (`playwright-raw.log` or site script equivalent).  
- No claim if steps skipped or screenshots missing (`testing-handbook.md`).

### Unit proof

- `vitest-raw.log` (or combined log) **unfiltered**.  
- Optional `vitest-results.json` / console JSON when scripts emit them.

### Honesty NOTES

Required when judgment is involved:

- W6 label copy  
- W7 mesh bar  
- P05 canvas vs SVG publish authority  
- Any owner WAIVE

---

## E: backup mirror

After CP-10, the same tree must exist under:

```
E:\OandO-backups\trustdata-YYYY-MM-DD\results\planner\world-standard-wave\
```

Procedure: `phases/P10-evidence-handover.md`. Log: `10-handover/BACKUP-LOG.md`.

---

## Create-on-execute checklist

Folders are **created when the phase runs**, not empty placeholders for show. Before first write in a phase:

```powershell
$root = "D:\OandO07072026\results\planner\world-standard-wave"
@(
  "00-start",
  "01-product-truth",
  "01-engine-lock",
  "02-browser-open3d-journey",
  "03-select-delete",
  "04-orbit-continuity",
  "05-symbols-svg",
  "06-save-honesty",
  "08-mesh-quality",
  "08-shortcuts-chrome",
  "10-handover"
) | ForEach-Object { New-Item -ItemType Directory -Force -Path (Join-Path $root $_) | Out-Null }
```

Only create the folder for the phase you are executing if you prefer minimal trees; P10 expects all gate folders present or explicitly WAIVE’d.

---

## Forbidden claims matrix

| Claim | Required folder green | Not enough alone |
|-------|----------------------|------------------|
| “Journey works” | `02-browser-open3d-journey/` | unit spine, p0 notes |
| “Select/delete works” | `03-select-delete/` | handler exists in source without tests |
| “3D works” | `04-orbit-continuity/` | boxes render without orbit/continuity |
| “Symbols OK” | `05-symbols-svg/` (+ place PNGs for full W2) | admin SVG publish p0 |
| “Save works” | `06-save-honesty/` with reload proof | IDB unit without hard reload / honest label |
| “Mesh OK” | `08-mesh-quality/` | modular place unit green only |
| “Shortcuts OK” | `08-shortcuts-chrome/` | keymap file exists unread |
| “Wave complete” | `10-handover/` + MASTER tally + E: backup | WAVE.md narrative |

---

## Outside world-standard-wave (do not dump W proofs there)

| Path | Role |
|------|------|
| `D:\OandO07072026\results\tests\` | Generic vitest dumps — copy or re-run into wave folders for gate claims |
| `D:\OandO07072026\results\test-results\` | Tool default outputs — rehome or reference explicitly |
| `D:\OandO07072026\site\results\` | Site-local CSV/etc. — not W-gate root |
| `D:\OandO07072026\archive\results\` | Archived — historical only |

**W-gate file-of-record root remains:**  
`D:\OandO07072026\results\planner\world-standard-wave\`
