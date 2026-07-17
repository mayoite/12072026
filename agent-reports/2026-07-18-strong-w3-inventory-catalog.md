# ## STRONG-W3 Inventory catalog

## Summary

Inventory catalog rows rebalanced so product truth leads and Place is the only primary control.

## Files owned (exclusive)

- `site/features/planner/editor/InventoryPanel.tsx`
- `site/features/planner/editor/inventory.module.css`
- `site/tests/unit/features/planner/editor/InventoryPanel.test.tsx`

No catalog-api rewrite. No commit.

## Before / after

| Issue | Before | After | Why it meets the bar |
|---|---|---|---|
| Truncated names | Single-line ellipsis on `shortName`; long names silent-cut | Full `name` with **2-line clamp** (`line-clamp: 2`); `title={fullName}` always | Full name accessible without opening details; clamp not silent single-line only |
| Place density | Place button + full-width Compare chip (`grid-column: 1 / -1` filterChip) read as twin CTAs | **One** `data-action="place"` primary per row; Compare is secondary text control under Place | Hierarchy: one primary action per row |
| Product truth secondary | SKU/dims mixed with family/variant in one muted meta row | Dedicated `data-field="product-truth"` line (SKU · dimensions); family/variant secondary | At least one product-truth line always visible |
| Weak compare label | Full-row chip “Compare” / “In compare” | Secondary “Compare” / **“Comparing”**; shortlist table unchanged | Compare stays usable; clearer state label |
| Phone density | Place used touch min-height but competed with full-width compare chip | Place **min-height/min-width 2.75rem (44px)**; readable name + SKU/dims; compare de-emphasized | Phone primary control meets 44px floor |

## Deliverables checklist

1. **Names** — 2-line clamp + `title` full name: **done**
2. **Place** — single primary per row; secondary de-emphasized: **done**
3. **Dimensions/SKU** — product-truth line without details: **done**
4. **Compare** — kept; label improved; table path intact: **done**
5. **Phone** — list readable; 44px Place: **done in CSS** (browser OPEN)
6. **Unit tests** — title/clamp + single Place primary: **PASS**
7. **Before/after table**: this section

## Evidence (fresh session)

```text
pnpm --filter oando-site exec vitest run tests/unit/features/planner/editor/InventoryPanel.test.tsx
# exit 0 — 9 tests passed

pnpm run check:layout
# exit 0 — check-repo-layout OK
```

## OPEN (brutal residual)

- **Browser proof OPEN** at planner inventory route, desktop **1440** and phone **390**: unit cannot prove 2-line visual clamp, 44px hit target, or list density on a real dock/sheet. Parent should capture DevTools or Playwright on the live catalog list.
- Thumbnails still similar across variants (benchmark item; out of this ticket scope).
- Variants still separate rows (benchmark item; out of scope).

## Status

Unit + layout: **PASS**. UI journey browser: **OPEN**.
