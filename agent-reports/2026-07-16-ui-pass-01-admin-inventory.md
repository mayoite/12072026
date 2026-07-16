# UI Pass 1 — Admin SVG inventory list

## Changed
- `site/features/admin/svg-editor/views/AdminSvgEditorListView.tsx` — status chips, clear filters, simpler symbol badges, demoted Retire, advanced bulk label
- `site/app/css/core/locked/admin/svg-editor-inventory.css` — status band, dense desktop table, retire weight, phone 44px filters/paging
- `site/app/css/core/locked/admin/admin-pages.css` — phone cards overflow/focus, actions ≥44px, desktop page density
- Unit tests: list name-mirror, ADM-LIST, ADM-SVG-01

## Verified
- ESLint on list view: clean
- Vitest `views/`: 62/62 green
- `pnpm run check:layout`: OK

## OPEN (no browser PASS)
- Live `/admin/svg-editor` at 1440×900 and 390×844
- Focus order, horizontal overflow, chip scan
- Lifecycle retire/restore row update (still full reload)
