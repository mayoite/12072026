# T2 — CSS density (parametric form)

**Agent:** T2  
**Date:** 2026-07-18  
**Scope:** `locked/chrome/studio-chrome.css`, `admin-svg-dock.module.css`, `locked/svg/svg-preview.css`  
**Not PASS proof.** Ready for T4 look after T1/T3.

## Root cause

Parametric stage already set `background: solid` on `.admin-parametric-stage`, but the element also has `.admin-svg-engine-shell__stage`. That class in `svg-editor-shell.css` paints the **24px graph-paper grid** and loads **after** chrome. Equal specificity → grid won → form looked like empty CAD costume.

## Changes

### 1. Form stage surface (`studio-chrome.css`)

| Before | After |
|--------|--------|
| Graph paper under fields (shell grid won cascade) | Solid panel: `background-color` + `background-image: none` |
| Single-class override lost to shell | Compound: `.admin-svg-engine-shell__stage.admin-parametric-stage` + `[data-stage-engine="form-maker"]` |

Freehand Excalidraw path untouched: `panelFillStage` grid remains for non-scrollable freehand stage.

### 2. Density (`studio-chrome.css`)

| Before | After intent |
|--------|----------------|
| Field `margin-bottom: 0.75rem`, loose pad | ~0.42rem field gap; tighter fieldset/pad |
| Block labels, default weight | Flex column labels, 0.78rem / weight 600 |
| Form full-width dead air | `max-width: 34rem` (40rem when 2-col) |
| Long single column only | `@container (min-width: 26rem)` pairs numeric fields; text/select/fieldset full width |

### 3. Preview plate (`svg-preview.css` + dock hook)

| Before | After |
|--------|--------|
| `--svg-studio-field` plate, `max-width: 30rem` | Calm solid `--svg-studio-solid`, `max-width: 100%` |
| Dock: `max-width: none` | Dock: `max-width: 100%`; SVG already `max-width: 100%` |

### 4. Tokens only (`admin-svg-dock.module.css` + form error)

| Before | After |
|--------|--------|
| `var(--color-white-50, #fff)` | `var(--color-white-50)` |
| `var(--color-primary, #1e3a5f)` | `var(--color-primary)` |
| `var(--color-error, var(--text-danger, #a30))` | `var(--color-error-red)` |

No `theme.css` edits. No freehand Excalidraw redesign.

## Files touched

- `E:\12072026\site\app\css\core\locked\chrome\studio-chrome.css`
- `E:\12072026\site\app\css\core\locked\chrome\admin-svg-dock.module.css`
- `E:\12072026\site\app\css\core\locked\svg\svg-preview.css`

## Coordinate notes for T1 / T4

- Hooks used: existing `.admin-parametric-stage`, `data-stage-engine="form-maker"`, form BEM classes. No new TSX required from T2.
- If T1 renames stage classes, keep at least one of: `.admin-parametric-stage` or `data-stage-engine="form-maker"`.
- T4: hard-refresh `/admin/svg-editor/parametric/` — stage under fields must show solid panel, not grid; freehand still may grid.

## DoD self-check (CSS only)

1. No graph-paper under form fields — **fixed cascade**  
2. Density / readable labels — **tightened**  
3. Preview calm + SVG scale — **yes**  
4. Tokens only in owned chrome — **hex fallbacks removed**  
5. Freehand / theme.css — **not touched**
