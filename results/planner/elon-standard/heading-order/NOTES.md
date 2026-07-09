# Heading order fix (H1 → H2 panels)

**Date:** 2026-07-09  
**Why:** Lighthouse a11y residual — brand `h1` then panel titles were `h3` (skip H2).

## Change
- `PanelContainer.tsx`: panel title `h3` → **`h2`**
- Nested content may still use `h3` (entity name / No Selection) under panel `h2` — correct outline

## Tests
- New: panel title is heading level 2  
- Updated shell test for Focus/Restore label-in-name names  
- `workspaceShell.test.tsx` **31/31** (`vitest.log`)

## Product residual still open
- Tap targets, status `role="status"`, etc. (not this slice)
