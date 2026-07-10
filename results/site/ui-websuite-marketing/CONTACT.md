# Phase 4 — Contact shell vs home design base

**Date:** 2026-07-10  
**Scope:** `/contact/` layout spacing + form readability  
**Out of scope:** products, homepage hero/collections, locked CSS  
**Design base:** `results/site/design-base-home/NOTES.md`

## Problem (before)

Live desktop measure @ 1440×900:

| Check | Before |
|-------|--------|
| `.contact-shell` display | **`block`** (locked `@utility contact-shell` never emitted into CSSOM) |
| Grid columns | none — summary + form **stacked full width (1232px)** |
| Shell gap | `normal` (no 2.5rem / 4rem) |
| `.contact-form-input` | Underline-only, transparent bg, `padding: 12px 0`, no radius — weaker than home teaser filled fields |
| `home-shell-xl` | OK (`max-width: 1320px`, `padding-inline: 44px`) |

Root cause: locked `home-contact-page.css` defines layout via `@utility`; plain class rules (labels/inputs) load, but utility layout classes do not. Same pattern already fixed for home teaser via non-locked `missing-components.css`.

## Fix (non-locked only)

1. **`site/app/css/core/components/contact-page.css`** (new)
   - Plain CSS grid for `.contact-shell` → 2-col `@lg` (`minmax(0,1fr)` ×2, gap 4rem)
   - Flex stacks for summary / form panel / channels
   - Form surface `.contact-page-form` (panel, radius, padding — teaser parity)
   - Filled `.contact-form-input` override (border, surface-page bg, min-height 2.75rem, focus-ring)
2. **`site/app/css/index.css`** — import contact-page.css
3. **`CustomerQueryForm.tsx`** — `contact-page-form` + field/row helpers; `data-testid="contact-page-form"`
4. **`ContactPageView.tsx`** — drop redundant `mb-6` on CTA band (panel gap handles spacing)

**Locked paths:** none.

## After metrics

Playwright headless (`site/scripts/audit-contact-temp.mjs` → metrics JSON).

### Desktop 1440

| Metric | After |
|--------|-------|
| display | `grid` |
| columns | `584px 584px` |
| gap | `64px` (4rem) |
| sideBySide | **true** |
| input | filled white, `1px solid border-soft`, radius 14px, minH 44px, pad 10×14 |
| form panel | pad 24px, radius 24px, surface panel, w 584 |
| home-shell-xl | pad `0 44px`, max 1320 |

### Mid 768

- Single column stack, gap 40px (2.5rem) — expected below lg

### Mobile 390

- Stacked shell, form width 358, input minH 44px, bordered fields

## Screenshots

| File | Viewport |
|------|----------|
| `contact-after-desktop.png` | 1440 — hero + two-col shell top |
| `contact-after-form-desktop.png` | 1440 — form panel filled fields |
| `contact-after-mid.png` | 768 |
| `contact-after-mobile.png` | 390 |
| `contact-after-form-mobile.png` | 390 form |
| `contact-before-desktop.png` | earlier CDP capture (pre-fix reference) |
| `contact-metrics-*.json` | raw measures |

## Optional /about/

Skipped — contact had real layout failure; spent budget on shell + form proof.

## Tests

```
pnpm exec vitest run tests/unit/components/contact/CustomerQueryForm.test.tsx --config vitest.site.config.ts
```

6/6 pass.

## Commit

`fix(ui): phase4 contact shell align to home design base`
