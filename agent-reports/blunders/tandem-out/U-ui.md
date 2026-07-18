# U — UI expert (parametric factory craft)

**Role:** U · implementer  
**Date:** 2026-07-18  
**Not PASS proof** (T owns tests; C/R own gate).

## Goal

Calm order-factory form: Units · Size · Pedestals · Identity; solid stage (no graph paper); one Publish; human copy; tokens only.

## Files touched

| File | Why |
|------|-----|
| `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx` | Structure, human copy, hide pedestal dims when none, Draft ready, publish success formatter, dock titles Preview\|Form\|Details |
| `site/app/css/core/locked/chrome/studio-chrome.css` | Premium form craft + solid form-stage reinforce |
| `site/app/css/core/locked/admin/svg-editor-shell.css` | Form-stage solid override **after** graph-paper rule (cascade fix) |
| `site/app/css/core/locked/svg/svg-preview.css` | Preview plate paint (tokens only) |

## Files allowed, not changed

| File | Why |
|------|-----|
| `site/app/css/core/locked/chrome/admin-svg-dock.module.css` | Already solid `panelFill` when `stageScrollable`; no token gap this pass |

## Confirmations

| Rule | Status |
|------|--------|
| CSS only in locked/chrome + locked/svg (+ shell form-stage override only) | **Yes** |
| No CSS in `features/**` | **Yes** |
| No new hex / rgb in U-owned CSS | **Yes** (grep clean on studio-chrome, svg-preview, chrome/) |
| No wrong CSS path | **Yes** |
| No Planner Fabric touch | **Yes** |
| No tests written (T) | **Yes** |
| No commit | **Yes** |

## Structure (DoD)

1. **Sections:** Units → Size → Pedestals → Identity  
2. **One Publish** top bar only (`linear-desk-publish`)  
3. **Details** dock tab = read-only summary (Name / SKU / Slug / Size)  
4. **Human copy:** Pedestal layout, Two/No pedestals, Pedestal width, Side inset, Gap under top; preview blocked + details note plain English  
5. **Premium:** unit segment + focus-within; field focus rings; select chevron (token colors); preview plate; quiet status band  
6. **Graph paper:** freehand stage keeps grid; form stage `background: solid` in shell (after grid rule) **and** reinforced in studio-chrome  

## Cascade note

Admin index imports: chrome → svg → … → `svg-editor-shell.css` last.  
Shell graph paper on `.admin-svg-engine-shell__stage` would beat chrome unless form-stage rule lives **in shell after** that rule. Both places now set solid via shorthand `background`.

## Quick self-check (not browser PASS)

- Unit tests (existing, not written by U): LinearDeskParametricForm.test.tsx — 6 passed  
- `pnpm run check:layout` — OK  

## Out of scope

Planner Fabric, freehand redesign, theme.css thrash, commit, browser C3 (T4/parent).
