# T4 — world-class visual gate

**Date:** 2026-07-18  
**Verdict:** **PASS**  
**URL:** `http://localhost:3000/admin/svg-editor/parametric/`  
**Viewport:** 1440×900 (full-page + viewport shots)  
**Screenshot:** `results/admin/world-class-ui/parametric.png`  
**Also:** `results/admin/world-class-ui/parametric-viewport.png` (focus state)

## Upstream

| Track | Report | Status |
|-------|--------|--------|
| T1 structure | `tandem-T1.md` present (5:44 PM) | Done (claimed; unit 4 pass) |
| T2 CSS craft | `tandem-T2.md` present (5:44 PM) | Done (claimed) |
| T3 identity | `tandem-T3.md` present (5:44 PM) | Done (claimed; unit 17 pass) |

T1/T2 incomplete → would be automatic FAIL. **Not incomplete.**

## Method

1. Waited; started `pnpm run dev` (was down). Ready on `localhost:3000`.
2. Chrome DevTools: open route, a11y snapshot, console, computed CSS.
3. Playwright (fallback write path): full-page screenshot + focus metrics.
4. Scored **only** against `WORLD-CLASS-UI-BAR.md` hard fail list. Any one fail = overall FAIL. No soft-pass.

## Hard fail list (any = FAIL)

| Fail condition | Result | Evidence |
|----------------|--------|----------|
| Grid under form fields | **CLEAR** | `.admin-parametric-stage` computed: `background-image: none`, `background-color: rgb(251, 249, 244)`. Screenshot: solid ecru under fields — not graph paper. |
| “form + Maker” / Engine:… slogans in chrome | **CLEAR** | Body text scan false. Snapshot status: draft · ready · footprint · badge only. No engine essay. |
| Eye/pencil/list legend theater | **CLEAR** | No legend nodes. Dock host sr-only: “Panels: Preview, Form, Details”. No Dock toggle. |
| Two equal Publish buttons | **CLEAR** | Exactly **one** button matching Publish: `data-testid="linear-desk-publish"`. No `linear-desk-publish-top`. No “Publish to disk”. |
| Identity editable in two places | **CLEAR** | Form owns Name/SKU/Slug. Details = read-only IDENTITY `dl` (0 inputs in complementary). |
| Tiny grey desk in a huge empty void | **CLEAR** | Plan symbol in framed plate (`.admin-linear-desk-preview` ~229×128; SVG ~203×102). Not postage-stamp in CAD void. |
| Native-looking cheap inputs with no focus craft | **CLEAR** | Number fields: white fill, 14px radius, token border. Focus: `outline: rgb(31,54,83) solid 2px` + `box-shadow: rgba(64,111,153,0.25) 0 0 0 3px`. |
| Hex hardcodes in chrome CSS | **CLEAR** | Grep `#hex` in `studio-chrome.css`, `admin-svg-dock.module.css`, `svg-preview.css` → **0 matches**. |

## Console

- Chrome DevTools errors/warns: **none** (including preserved).
- Playwright page `console` errors + `pageerror`: **[]**.

## Product bar (honesty, not a free soft-pass)

Bar: *non-engineer would sell desks from this.*

**Met for gate:** one job (configure desk → one Publish), solid panels, framed plan SVG, calm tokens, no debug costume.

**Still not Linear/Stripe reference (notes only — not hard fails):**

1. **Header hierarchy inverted.** Title + SKU sit top-right; primary **Publish** sits top-left under Inventory. Works, but not “title left / primary right.”
2. **Preview rail dead air.** Plate is good; column is ~717px tall so cream void sits under the plate. Not the old CAD-grid fail; still not a hero product plate.
3. **Series id** blank engineer field in the form — product language debt.
4. **Native number spinners** still show on focus (styled shell + craft ring exist; not “no focus craft”).
5. **Title a11y glue:** snapshot text `Linear deskSKU OANDO-…` (missing space between name and SKU label).

None of the above is on the hard fail list. Do not invent FAIL from residual polish.

## What T4 did **not** re-verify

- Disk publish C3 artifact bytes / guest place (T3 unit covered identity; browser publish path not re-run this gate).
- Freehand shell (out of scope; Dock toggle may still live there).
- DB/R2 cutover.

## Files / artifacts

| Path | Role |
|------|------|
| `E:\12072026\results\admin\world-class-ui\parametric.png` | Full UI proof |
| `E:\12072026\results\admin\world-class-ui\parametric-viewport.png` | Viewport + focus |
| `E:\12072026\results\admin\world-class-ui\gate.cjs` | Repro harness (not PASS proof by itself) |

## Bottom line

**PASS.** T1/T2/T3 landed enough that the live parametric factory clears every owner hard fail. Console clean. Screenshot on disk.

Not a trophy for “world-class forever” — residual hierarchy / preview rail / Series id remain. They are polish, not fail-list hits.
