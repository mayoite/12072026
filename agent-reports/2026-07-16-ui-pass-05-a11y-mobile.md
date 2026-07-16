# UI Pass 5 — Shared a11y + mobile polish (final)

**Date:** 2026-07-16 · No commit/push · No browser PASS claimed.

## All 5 passes (code only)

1. **Admin inventory** — status chips, dense 1440 table, phone cards ≥44px actions  
2. **Admin studio** — one Publish path, feedback band, sticky 390 chrome  
3. **Site marketing** — hero/header/drawer/footer, contact consent, TrackedLink CTAs  
4. **Planner shell** — save pill authority, inventory labels, phone header/panels  
5. **Shared a11y/mobile** — restore admin shell CSS; shared control polish  

## Pass 5 code

- **Restored** `site/app/css/core/locked/admin/admin.css` (deleted in refactor; shell was unstyled) + import in `index.css`  
- Phone: header CTAs/nav/mobile toggle ≥44px; sidebar inset uses `--admin-header-height`; focus-visible on toggle/cards  
- `admin-btn` / compact ≥44px @phone; `admin-input:focus-visible`  
- `Modal` close 44px + `aria-labelledby`; `Button` icon 44px; `HotspotImage` 44px  
- Skip link focus min-height; cookie region; price-book commercial language + `aria-live`  
- Contact field focus ring; shared `.btn-*:focus-visible`  

## Verified

- Vitest: Modal/Button/Cookie/Hotspot/AdminLayoutShell/price-book — **42/42** green  
- ESLint touched TSX: clean · `pnpm run check:layout`: OK  

## OPEN (browser proof required — all tracks)

| Track | OPEN |
|---|---|
| Admin | List/studio/price-book @1440 & 390; keyboard publish; shell nav drawer live |
| Site | Home/header/drawer/contact @1440 & 390; skip-link land; focus trap |
| Planner | UI-SHELL / UI-MOB / UI-A11Y; save states on device; tool rail |

**Unit-green ≠ WCAG AA or production UI.** No Lighthouse scores invented.
