# S2 — Site chrome VERDICT

**Date:** 2026-07-11  
**Verdict:** **PASS (landable slice)** — blocking header clip fixed; inventory + browser evidence written.  
**Not claiming:** full marketing redesign, motion polish, or zero residual.

## Done vs card

| Card criterion | Result |
|----------------|--------|
| Written inventory of live chrome under `site/` | **PASS** → `INVENTORY.md` |
| Gaps vs quality bar listed honestly | **PASS** → inventory + this file |
| Blocking a11y / dead controls fixed or filed | **PASS** — header CTA clip + mobile drawer overlap **fixed in product**; no dead primary nav links found |
| Evidence under `results/` (screenshots + NOTES) | **PASS** — see artifacts below |

## Browser proof (Playwright headless against localhost:3000)

| Artifact | What it shows |
|----------|----------------|
| `home-viewport.png` | Compact primary nav + full **Guided Planner** (not clipped) @ 1440 |
| `home-more-menu.png` | More → Trusted / Sustainability / Portal / Login |
| `solutions-viewport.png` | Solutions active underline; chrome intact |
| `contact-viewport.png` | Contact route chrome |
| `home-1280.png` | xl edge: CTA still unclipped (`metrics.json`) |
| `home-mobile.png` / `home-mobile-drawer.png` / `home-mobile-drawer-scrolled.png` | Hamburger + full link list; Login reachable after scroll |
| `home-full.png` | Full-page home incl. footer |
| `metrics.json` | Quantitative: `cta.clipped: false` at 1440 and 1280 |

## Product changes (this slice)

1. **`SITE_NAV_LINKS` header slots** — secondary destinations → desktop **More** (`navigation.ts` / `siteNav.ts`).
2. **`Header.tsx`** — primary-only center nav + More flyout; tighter search field; resize breakpoint aligned to xl (1280); Esc closes More.
3. **`MobileNavDrawer.tsx`** — flex shell so CTAs do not paint over last links; search placeholder aligned with header.
4. **Unit tests** updated/added (Header More, nav split, mobile placeholder).

## Unit tests

```
Header.test.tsx · MobileNavDrawer.test.tsx · navigation-data.test.ts
→ 43 passed
```

## Residuals (not blockers for S2 land)

- Mobile drawer still requires **scroll** to reach Login on short viewports (expected with full link list + sticky CTAs).
- Language switcher full reload (pre-existing).
- Cookie bar + floating tools stack (polish).
- Further visual “raise the bar” (motion, spacing, type) can continue in later Site-track work — **not claimed done here**.

## Honesty

Before fix, measured **Guided Planner `right: 1514` > viewport 1440** (clipped). After: **`right: 1400`, `clipped: false`** (`metrics.json`). No paper moon.
