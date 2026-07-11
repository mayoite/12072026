# S2 — Marketing / site chrome inventory

**Date:** 2026-07-11  
**Checkout:** live `http://localhost:3000`  
**Scope:** public marketing shell only — **not** planner open3d workspace chrome (P09) · **not** admin SVG pipeline.

## Chrome surfaces (live under `site/`)

| Surface | Path(s) | Role |
|--------|---------|------|
| Route chrome gate | `site/components/site/RouteChrome.tsx` · `RouteChromeSuspense.tsx` · `lib/site-data/routeChromeRules.ts` | Shows/hides header+footer by route (CAD/workspace/login modes) |
| Site layout shell | `site/app/(site)/layout.tsx` | Top chrome + `#main-content` + bottom chrome |
| Header | `site/components/site/Header.tsx` | Logo, primary nav, Products mega, **More** flyout, search, quote cart, Guided Planner, hamburger |
| Mobile drawer | `site/components/site/MobileNavDrawer.tsx` | Full `SITE_NAV_LINKS` + search + call/CTAs |
| Footer | `site/components/site/Footer.tsx` | Brand, contact, social, language, columns, legal |
| Footer marquee | `site/components/site/FooterLogoMarquee.tsx` | Logo strip above footer (full chrome only) |
| Cookie bar | `site/components/site/CookieConsentBar.tsx` | Consent UI (bottom) |
| Language switcher | `site/components/site/LanguageSwitcher.tsx` | Footer locale select (`NEXT_LOCALE` cookie) |
| Floating tools | `features/site-assistant/DynamicBotWrapper.tsx` · `components/ui/WhatsAppCTA.tsx` | Chat + WhatsApp (footer-full + login-tools modes) |
| Nav data | `lib/site-data/navigation.ts` · `lib/siteNav.ts` | `SITE_NAV_LINKS`, `SITE_HEADER_PRIMARY_LINKS`, `SITE_HEADER_MORE_LINKS`, footer nav |
| Header CSS | `app/css/core/utilities/misc.css` (`site-header__*`) · `shell-nav.css` · `nav.css` utilities | Desktop nav ≥ xl; hamburger below xl; search ≥ sm |
| Marketing pages using shell | `(site)/page.tsx`, `solutions/`, `products/`, `projects/`, `portfolio/`, `contact/`, `about/`, `trusted-by/`, `sustainability/`, legal, etc. | Full header+footer |
| Hidden chrome routes | `/planner/guest`, `/planner/open3d`, `/portal/*`, `/admin/*`, `/dashboard`, CAD aliases | `header:hidden` + `footer:hidden` |

## Desktop header composition (after S2 fix)

**Primary (center):** Products (mega) · Solutions · Projects · Planner · Portfolio · About · Contact · **More**  
**More flyout:** Trusted · Sustainability · Portal · Login  
**Right cluster:** Search · Quote cart · Guided Planner · hamburger (hidden ≥ xl)

## Gaps vs quality bar (honest)

| Gap | Severity | Status |
|-----|----------|--------|
| Desktop header overcrowded — **Guided Planner clipped** at 1440px (11 center links) | **Blocking** | **Fixed** this slice (primary/More split + tighter search) |
| Mobile drawer CTAs overlapped last links (Portal/Login) | **Blocking a11y** | **Fixed** flex layout (`overflow-hidden` + scrollable nav + shrink-0 CTAs); Login reachable via scroll |
| 11 destinations still in mobile list — dense but complete | Low | Acceptable; no dead links found |
| Language switcher reloads full page | Low residual | Not blocking; works |
| Cookie bar stacks with floating N / WhatsApp | Polish | Not blocking |
| Search is client POST to `/api/nav-search/` with local fallback | OK | Honest empty/fallback UI |
| Products mega depends on `/api/nav-categories/` | OK | Falls back to static groups |

## Out of scope (explicit)

- Planner canvas toolbars / shortcuts (Planner P09 / PLAN-SYM)
- Admin SVG editor chrome (ADMIN-SVG)
- Dep cuts (S1)
- Full visual redesign / motion system rewrite
