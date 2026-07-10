# UI Agent W2 — Marketing suite pages polish (non-home)

**Date:** 2026-07-10  
**Scope:** `/projects/`, `/portfolio/`, `/trusted-by/` (+ contact audit only)  
**Out of scope:** Homepage, products catalog (W1), open3d/planner workspace, locked CSS

## CSS fence

- **Zero** edits under `site/app/css/core/locked/**`
- Custom CSS only in `site/app/css/core/components/client-badge.css` (shared, non-locked)
- Tokens first (`--surface-*`, `--border-*`, `--radius-*`, type tokens)

## Before (audit)

Playwright headless @ 1440 / 768 / 390. Artifacts: `before/*`, `before/audit.json`.

| Page | Findings |
|------|----------|
| `/projects/` | Featured grid `lg:grid-cols-6` → **badge min width ~178px** (desktop). Mobile 2-col inside padded panel → **~138px**. Logos OK (29/61), monograms for rest. Hero `scale-105` + `scale-100` conflict. |
| `/portfolio/` | Desktop mosaic OK (media non-zero). Mobile fixed `h-[24rem]` split 50/50 → **primary only ~186px**, no radius, sharp boxes. |
| `/trusted-by/` | Roster readable; logos 13/28; no overlaps. Grid already 1/2/4 — switched to shared `client-badge-group`. |
| `/contact/` | No layout breakage found (desktop only in after/contact). |

No broken client-logo requests; ClientBadge logo land already worked.

## Fixes

1. **`projects/page.tsx`**
   - Featured + extended roster → `client-badge-group` / `client-badge-group--dense` (max 4 featured, dense 5@xl — never 6).
   - Featured panel padding `p-5 sm:p-8 md:p-10` so mobile badges aren’t crushed by inset.
   - Hero `imageClassName="!scale-100 object-[center_44%]"` (kills double-scale).
   - Featured badges mark `featured`.

2. **`portfolio/page.tsx`**
   - Mosaic: mobile aspect-ratio stack (primary `16/10` min-h 12.5rem; secondary `4/3`); md+ 7/5 fixed height.
   - `rounded-2xl` + muted surface fallback on media cells.
   - Case header grid uses `minmax(0,1fr)` so titles don’t pin to tiny `auto` columns.
   - Index `padStart(2,"0")`.

3. **`trusted-by/page.tsx`**
   - Roster uses `client-badge-group` + `data-testid="trusted-by-roster"`.

4. **`client-badge.css`**
   - Dense group breakpoints; `min-width:0` / equal height; logo `max-width:min(100%,…)`; sector/name `overflow-wrap`; tighter dense padding @xl.

## After (metrics)

| Metric | Before | After |
|--------|--------|-------|
| Projects desktop badge min W | 178 | **237** |
| Projects mobile badge min W | 138 | **316** |
| Portfolio mobile primary H | ~186 | **~224** (+ radius) |
| Broken logos / zero media / overlaps | 0 / 0 / 0 | 0 / 0 / 0 |

Artifacts: `after/*`, `after/audit.json`.

## Files touched

- `site/app/(site)/projects/page.tsx`
- `site/app/(site)/portfolio/page.tsx`
- `site/app/(site)/trusted-by/page.tsx`
- `site/app/css/core/components/client-badge.css`
- `results/site/ui-websuite-marketing/**` (evidence)

**Locked paths:** none.

## Commit

`fix(ui): marketing suite pages polish (non-locked, not home)`
