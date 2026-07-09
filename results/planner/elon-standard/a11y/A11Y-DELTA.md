# A11Y Delta — Elon standard (label-in-name recheck)

| Field | Value |
|-------|--------|
| **Date** | 2026-07-09 |
| **URL** | `http://localhost:3000/planner/guest/?plannerDevTools=1` |
| **Scope** | Re-check after TopBar / OOPlannerWorkspace `aria-label` fixes; Critical-only remediation budget |
| **Agent** | a11y-debugging (Elon standard recheck) |
| **Method** | chrome-devtools MCP: navigate → DOM label-in-name script → Lighthouse `navigation` desktop → issues list |

## Evidence artifacts

| File | Description |
|------|-------------|
| `A11Y-DELTA.md` | This report |
| `report.json` / `report.html` | Lighthouse (this pass) |
| Prior baseline | `results/planner/quality-wave-agents/a11y/A11Y-REPORT.md` + `report.json` |

---

## Scoreboard

| Metric | Before (quality-wave) | After (this pass) | Delta |
|--------|----------------------|-------------------|-------|
| **Lighthouse a11y** | **98** | **98** | **0** (unchanged) |
| **label-content-name-mismatch** | **FAIL** (score 0) | **PASS** (score 1) | **Fixed** |
| **heading-order** | FAIL (score 0, weight 3) | FAIL (score 0, weight 3) | Unchanged — sole weighted a11y fail |
| **button-name / link-name / image-alt / color-contrast** | PASS | PASS | — |
| **Unnamed interactive controls** | 0 / 97 | 0 / 97 | — |
| **Chrome a11y issues** | none | none | — |
| **Critical product fixes this pass** | n/a | **0 files** (none remaining) | — |

**Why score stays 98:** `label-content-name-mismatch` has **weight 0** in Lighthouse a11y category, so fixing it does not move the numeric score. The remaining **−2** is from **`heading-order` (weight 3)** only.

Non-a11y LH noise this run (not in a11y category): console 404s (`proof-chair.svg`, `placeholder-cabinet.svg`), SEO `noindex`, missing canonical.

---

## Before — Lighthouse fails (a11y)

From `results/planner/quality-wave-agents/a11y/report.json`:

| Audit | Score | Weight | Detail |
|-------|-------|--------|--------|
| `heading-order` | 0 | 3 | H1 → H3 (Inventory panel title) |
| `label-content-name-mismatch` | 0 | 0 | 3 buttons |

### Label-in-name failures (before)

| Visible text | Accessible name (`aria-label`) | Source |
|--------------|--------------------------------|--------|
| `Focus` | `Maximize canvas` | `TopBar.tsx` |
| `Prefs` | `Open preferences menu` | `TopBar.tsx` |
| `Commands (Ctrl+K)` | `Open command palette (Ctrl+K)` | `OOPlannerWorkspace.tsx` |

---

## After — code state (already landed)

| Control | Visible | `aria-label` | Label-in-name |
|---------|---------|--------------|---------------|
| Focus / Restore | `Focus` / `Restore` | `Focus — maximize canvas` / `Restore — restore workspace panels` | **PASS** |
| Prefs | `Prefs` | `Prefs — open preferences menu` | **PASS** |
| Commands | `Commands (Ctrl+K)` | `Commands (Ctrl+K)` | **PASS** |

**Files (prior slice, verified live this pass):**

- `site/features/planner/open3d/editor/TopBar.tsx` — Focus/Restore + Prefs names include visible words
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` — palette trigger `aria-label="Commands (Ctrl+K)"`

### DOM recheck (evaluate_script)

```
focusBtn.passesLabelInName: true
prefsBtn.passesLabelInName: true
commandsBtn.passesLabelInName: true
unnamedCount: 0
interactiveCount: 97
```

Lighthouse after: `label-content-name-mismatch` → **score 1, items: []**.

---

## Critical

**None found (before or after).**

No missing accessible names on chrome icon/buttons. Brief allows Critical-only product edits (max 2 files) — **no code changes this pass.**

---

## Remaining Important

| # | Issue | Severity | Notes / touchpoint |
|---|-------|----------|--------------------|
| 1 | **Heading order H1 → H3** | Important (only weighted LH a11y fail) | Panel titles `h3.workspace_panelTitle__*` under brand `h1` — promote panels to **H2** or insert H2 section. `WorkspaceShell.tsx` / panel title components |
| 2 | **0×0 tab stops** | Important | Desktop: `Toggle inventory/properties panel` mobile buttons still focusable at 0×0. `TopBar.tsx` + CSS `mobilePanelBtn` |
| 3 | **Sub-44×44 tap targets** | Important (AAA / touch) | Tool rail ~32×32, panel actions ~24×24, view toggle ~40×28 |
| 4 | **Status bar not a status landmark** | Important | `footer.pw-status-bar` lacks `role="status"` / name / live. `WorkspaceShell.tsx` |
| 5 | **Generic “Add to favorites”** | Important | Catalog favorites share one name; prefer `Add {item} to favorites` |
| 6 | **Nested “Inventory panel” regions** | Important | Shell aside + inner region same name |
| 7 | Tool guidance live region unnamed | Minor–Important | `aside.open3d-tool-guidance` has `aria-live` only |

### Not Critical (explicit)

- Label-in-name on Focus/Prefs/Commands — **resolved**
- Missing names on icon chrome — still **0**

---

## After — Lighthouse a11y fails only

| Audit | Score | Weight | Selector / note |
|-------|-------|--------|-----------------|
| `heading-order` | 0 | 3 | `aside#panel-left … h3.workspace_panelTitle__*` — nodeLabel `INVENTORY` |

All other weighted a11y audits sampled: pass (button-name, link-name, image-alt, color-contrast, etc.).

---

## Region map (unchanged chrome health)

| Chrome | Landmark / role | Label |
|--------|-----------------|-------|
| Top bar | `header` | Planner workspace |
| Inventory | `aside` + region | Inventory panel (still nested duplicate) |
| Tool rail | `nav` | Canvas tools |
| Configurator | `section` | Workstation systems configurator |
| Status | `footer` only | *(no status role)* |

---

## Fixes this pass

| Change | Status |
|--------|--------|
| Re-verify label-in-name after TopBar / OOPlannerWorkspace | **PASS** (live + LH) |
| Lighthouse re-run | **Done** — a11y **98** |
| Critical product code edits | **0 files** (none remaining) |

---

## Return summary

| Item | Value |
|------|--------|
| **Lighthouse a11y score** | **98** |
| **label-in-name** | **Fixed** (was 3 fails → 0) |
| **Critical remaining** | **0** |
| **Important remaining** | heading-order (LH fail), 0×0 mobile panel tabs, tap targets, status landmark, favorites names, nested inventory regions |

## Next step (if Important slice opens)

1. Panel titles H3 → H2 (clears weighted LH fail → path to **100** a11y).
2. `tabindex="-1"` / unmount mobile panel toggles when desktop CSS zeros them.
3. Status footer `role="status"` + `aria-label` parity with archive chrome.
