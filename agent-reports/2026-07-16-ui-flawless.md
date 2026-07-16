# UI flawless — 2026-07-16

## Done (code)

### Admin inventory list
- `site/features/admin/svg-editor/views/AdminSvgEditorListView.tsx` — title-case lifecycle chips (Live/Draft/Retired)
- `site/app/css/core/locked/admin/admin-pages.css` — phone cards: preview+product header grid, ≥44px actions, no overflow
- `site/app/css/core/locked/admin/svg-editor-inventory.css` — filter min-height 44px, larger thumbs, demoted summary targets

### Admin studio shell
- `site/app/css/core/locked/admin/svg-editor-shell.css` — sticky topbar @390, wrap actions, focus-visible, overflow-x clip
- `AdminSvgEditorTopBar.tsx` — back link `aria-label="Back to SVG inventory"`

### Public Site
- `HomepageHero.tsx` — `sr-only` full title (spaces preserved for AT); animated lines `aria-hidden`; CTAs via `TrackedLink`
- `features/site/data/seo.ts` — `resolveDocumentTitle` collapses double brand; always absolute title
- Downloads hero already `/images/hero/dmrc-hero.webp` (no `hero-3.webp` in code)
- `CustomerQueryForm.tsx` — consent checkbox, `aria-invalid`/`aria-describedby`, labels/autocomplete

## Tests (green)
- `tests/unit/features/admin/svg-editor/views` — 60/60
- `tests/unit/components` — 212/212
- Also: HomepageHero, CustomerQueryForm, Header, MobileNavDrawer, seo

## Still OPEN (browser proof required)
- Inventory 1440/390 visual: hierarchy, chips, empty/loading, focus rings
- Studio shell sticky rails + keyboard order
- Homepage heading AT + letter-spacing perception
- Catalog→downloads image network (no 400)
- Document titles in real browser tab
- Contact form consent UX + error announcement
- Mobile nav drawer focus trap live check

**No browser PASS claimed.** Unit-green ≠ production-ready UI.
