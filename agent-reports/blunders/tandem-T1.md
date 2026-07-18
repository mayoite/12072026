# T1 — UI structure (parametric factory)

**Date:** 2026-07-18  
**Role:** Kill scaffolding chrome; one Publish; Details = read-only mirror.  
**Not PASS proof** — T4 owns browser.

## Files changed

| File | Change |
|------|--------|
| `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx` | Structure cleanup (primary) |
| `site/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost.tsx` | Drop icon legend from sr-only; plain panel names |
| `site/tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx` | Match one-publish + no fake Dock chrome |

## What I killed

1. **Decorative Dock chrome** — `Toolbar` + always-selected `ToggleButton` (“Dock”) + Phosphor Eye/Pencil/List legend strip in status band.
2. **Duplicate Publish** — removed Details-rail “Publish to disk” panel. **One** primary **Publish** in top bar (`data-testid="linear-desk-publish"`). Dropped `linear-desk-publish-top`.
3. **Engineer slogans**
   - Status: `form + Maker` span (`admin-svg-studio-status-engine`)
   - Source line: `Field-driven Maker SVG · …` → slug only
   - Details: `Engine: form fields → Maker pen → multipath…` (whole Publish panel gone)
   - Preview hint: `Same Maker draw path as publish.`
4. **Fake “aria” chrome marker** on root — now `dockview-react phosphor` (no decorative Aria Toolbar).
5. **Dock host sr-only icon soup** — plain “Panels: Preview, Form, Details”.

## What stayed (by design)

- Dockview host: **Preview | Form | Details**.
- Form holds all edits (dims + name/SKU/slug/series).
- Details = read-only identity dl (Name / SKU / Slug / Footprint) + short mm/`oando-` note.
- Status band: draft · validation · footprint · ready/blocked badge (no fake controls).
- Success message in top feedback band only (`linear-desk-message`).
- Maker compile path unchanged (T3 territory for publish honesty).

## Residual for T2 / T3

| Who | Residual |
|-----|----------|
| **T2** | Form stage surface density (graph-paper under fields if still present). Status-band / topbar spacing. Dead CSS for `.admin-svg-engine-shell__chrome-btn` / `__chrome-legend` if freehand still uses them — freehand shell still has Dock toggle; only parametric killed it. Do not thrash `theme.css`. |
| **T3** | Publish success copy honesty; id/slug/SKU reuse on republish; any remaining “Publish to disk” wording elsewhere; series-id product meaning. |
| **T4** | Browser: load parametric, no fake Dock control, one Publish, Details read-only, console 0, C3 publish path. |

## Unit

`pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx`  
→ **4 passed** (2026-07-18).

## Not done (out of T1)

- CSS density / panel surfaces  
- Freehand `AdminSvgEditorShell` Dock toggle (still there — freehand not this goal)  
- Commit  
