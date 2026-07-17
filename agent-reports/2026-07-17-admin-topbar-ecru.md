# Admin TopBar package + ecru

**Date:** 2026-07-17  
**Verdict:** PARTIAL (unit shell green; browser OPEN)

## Done
- Admin layout header uses **Planner TopBar package**: brand | center | actions grid, `data-admin-topbar`, `data-density="compact"`
- **Ecru paper stack** replaces ocean dark brand bar (`--color-ecru-*` + surface tokens)
- Logo: **orange** (not white-on-dark)
- List page `.admin-toolbar` ecru strip matching chrome
- SVG editor shell topbar ecru + flat hairline (no drop veil)
- Unit: `AdminLayoutShell` tests assert topbar package

## Evidence
```text
pnpm --filter oando-site exec vitest run tests/unit/features/admin/ui/AdminLayoutShell.test.tsx …
# exit 0 (re-run)
pnpm run check:layout
```

## Not done
- Full browser visual pass on admin + SVG studio
- Extract shared React TopBar component (structure/CSS aligned; not one shared TSX)

## Files
- `site/features/admin/ui/AdminLayoutShell.tsx`
- `site/app/css/core/locked/admin/admin.css`
- `site/app/css/core/locked/admin/admin-primitives.css`
- `site/app/css/core/locked/admin/svg-editor-shell.css`
- `site/tests/unit/features/admin/ui/AdminLayoutShell.test.tsx`
