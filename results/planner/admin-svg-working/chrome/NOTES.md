# CHROME eyes — admin SVG (seat proof)

- **Date:** 2026-07-10
- **HEAD (final):** `6268e1ec` — `fix(admin-svg): EXEC-1 edit page mount (themeTokens + dedupe dynamics)`
- **HEAD (session start):** `d34d2e85` — `fix(admin-svg): fail-closed publish works in browser API`
- **Base:** `http://localhost:3000` · `DEV_AUTH_BYPASS=1` (root `.env.local`)
- **Tool:** chrome-devtools MCP (+ PowerShell POST for API publish)
- **Fabric:** irrelevant (not exercised)

## Steps

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1 | `/admin/svg-editor/` list loads (not `/access` redirect) | **PASS** | `01-list.png`, `01-list.a11y.txt` |
| 2 | `/admin/svg-editor/side-table-001/` edit loads **without** global-error | **PASS** (final) | `02-edit-side-table.png`, `02-edit.a11y.txt` |
| 3 | Publish path still works (API or UI) | **PASS** (API) | `03-api-publish.json` |
| 4 | This NOTES + `run.json` honest | **PASS** | this file + `run.json` |

## Step detail

### 1. List — PASS
- URL stayed on `/admin/svg-editor/` (no `/access/`).
- Title/admin chrome present; heading **SVG block editor**.
- Table shows blocks including **side-table-001** (Fixed, native) + Edit link.
- Variant balances: Fixed 4 / Configurable 0 / Parametric 0.

### 2. Edit side-table-001 — PASS (final); flaky mid-session
- **Final (after `6268e1ec`):** page loads with h1 `side-table-001`, Puck region **Block editor (Puck)**, Publish control visible, iframe canvas with BlockFixed. Console: React unique-key warning + CSP block on `rsms.me/inter` stylesheet only — **no** `[global-error]`, no Build/Runtime overlay, `hasGlobalError=false` via evaluate.
- **Mid-session (pre-fix, same chrome seat):** two hard failures were observed and are not hidden:
  1. **Build Error:** `GlbExtruderPreview` defined multiple times in `AdminSvgEditorEditView.tsx` (stale/dup dynamic block; overlay modal).
  2. **Runtime TypeError + `[global-error]`:** `Cannot read properties of undefined (reading '--fill-primary')` at `<Puck>` mount (~line 407). Application error heading under overlay.
- Root cause of recovery is outside this seat (EXEC-1 land). Chrome eyes re-proved after HEAD moved; **do not treat mid-session red as current state**.

### 3. Publish — PASS (API)
- `POST http://localhost:3000/api/admin/svg-editor/` with body = `site/block-descriptors/side-table-001.json`.
- **HTTP 200**, `success: true`, `descriptor.slug = side-table-001`, thumb URL returned.
- SVG on disk: `site/public/svg-catalog/side-table-001.svg` (481 bytes, exists).
- Note: bare `/api/admin/svg-editor` (no trailing slash) → **308** to slash; use trailing slash.
- CSRF waived under `isDevAuthBypassEnabled()` per `withAuth`.
- UI Publish button present on edit page; **not** clicked this seat (API is sufficient per brief).

## Non-blocking noise
- React: missing unique `key` in `DropZoneEditInternal` (Puck).
- CSP: blocked `https://rsms.me/inter/inter.css` (Puck default font).

## Overall seat status
**PASS** — list + edit without global-error + API publish green. Product code not edited by this seat.
