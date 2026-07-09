# A11y Score — Guest planner (post h2 + labels)

| Field | Value |
|-------|--------|
| **Date** | 2026-07-09 |
| **URL** | `http://localhost:3000/planner/guest/?plannerDevTools=1` |
| **Scope** | Guest planner chrome after panel titles **H2** + label-in-name aria fixes |
| **Agent** | a11y-debugging (recheck) |
| **Critical fixes this pass** | **None** (no Critical remaining) |

---

## Scoreboard

| Metric | Prior (elon-standard / quality-wave) | This recheck | Delta |
|--------|--------------------------------------|--------------|-------|
| **Lighthouse a11y** | **98** | **100** | **+2** |
| **`heading-order`** | **FAIL** (score 0, weight 3) | **PASS** (score 1, weight 3) | **Fixed** |
| **`label-content-name-mismatch`** | **PASS** (score 1; was fail pre-labels) | **PASS** (score 1) | Hold |
| **`button-name` / `link-name` / `image-alt` / `color-contrast`** | PASS | PASS | — |
| **Chrome a11y issues** | none | none | — |
| **Unnamed interactive controls** | 0 | **0** / 89 | — |
| **Heading skip (DOM)** | H1 → H3 | **none** (H1 → H2 → H3) | **Fixed** |

**Primary score source:** Lighthouse **snapshot** desktop (full axe-backed a11y category).

| Mode | A11y | Notes |
|------|------|--------|
| **snapshot** (authoritative) | **100** | `heading-order` + `label-content-name-mismatch` both binary **1**; **0** weighted fails |
| navigation | **100** | Several a11y audits `notApplicable` (weaker SPA capture); non-a11y fails only (SEO/crawlable/canonical) |

---

## Evidence artifacts

| File | Description |
|------|-------------|
| `SCORE.md` | This scorecard |
| `snapshot/report.json` | **Authoritative** Lighthouse JSON (snapshot, desktop) |
| `snapshot/report.html` | HTML report |
| `report.json` / `report.html` | Navigation-mode Lighthouse (score 100 a11y; less complete audit coverage) |

Prior baselines for delta:

- `results/planner/elon-standard/a11y/A11Y-DELTA.md` (a11y **98**, label-in-name fixed, heading-order still fail)
- `results/planner/quality-wave-agents/a11y/A11Y-REPORT.md` (a11y **98**, both fails)
- Heading fix notes: `results/planner/elon-standard/heading-order/NOTES.md`

---

## Method

1. Navigate to guest planner with `plannerDevTools=1`
2. Lighthouse a11y via chrome-devtools MCP (`navigation` + **`snapshot`** desktop)
3. `list_console_messages` types=`issue` → none
4. DOM script: heading outline, label-in-name on Focus / Prefs / Commands, unnamed control count

---

## Heading order (expected better — confirmed)

| Level | Text | Role |
|-------|------|------|
| H1 | Untitled plan | Brand / plan title |
| H2 | Inventory | Left panel title (`PanelContainer` → `h2.panelTitle`) |
| H2 | Properties | Right panel title |
| H3 | No Selection | Nested under Properties H2 (valid) |

**DOM `headingSkip`:** `[]`  
**Lighthouse `heading-order`:** score **1** (was 0)

Code already landed prior to this recheck: `site/features/planner/open3d/editor/PanelContainer.tsx` (`h3` → `h2`).

---

## Label-in-name (expected pass — confirmed)

| Control | Visible | Accessible name | Pass |
|---------|---------|-----------------|------|
| Focus | `Focus` | `Focus — maximize canvas` | **yes** |
| Prefs | `Prefs` | `Prefs — open preferences menu` | **yes** |
| Commands | `Commands (Ctrl+K)` | `Commands (Ctrl+K)` | **yes** |

**Lighthouse `label-content-name-mismatch`:** score **1**, no items.

---

## Critical

**None.**

No missing accessible names on interactive chrome. No Critical product edits required this pass.

---

## Remaining (Important only — out of Critical budget)

Not fixed this pass (explicit scope: Critical only):

| Issue | Severity | Notes |
|-------|----------|-------|
| 0×0 focusable mobile panel toggles (desktop) | Important | Still possible residual from prior audits |
| Sub-44px tap targets (tool rail / dense chrome) | Important (AAA / touch) | Snapshot `target-size` **passed** this run; monitor mobile |
| Status bar not `role="status"` | Important | Footer chrome |
| Nested “Inventory panel” regions | Important | Shell aside + inner region |

---

## Return summary

| Item | Value |
|------|--------|
| **Lighthouse a11y score** | **100** |
| **heading-order** | **PASS** (H1 → H2 panels) |
| **label-in-name** | **PASS** |
| **Critical remaining** | **0** |
| **Code changes this pass** | **0** |
