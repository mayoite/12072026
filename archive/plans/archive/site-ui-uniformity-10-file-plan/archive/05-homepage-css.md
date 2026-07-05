# Phase 5 — App CSS / Homepage Canonicalization (Tailwind v4)

## Purpose

Homepage **App CSS** (`site/app/css/`) is canonical. Run **before** Phase 3 TSX migration.

> **Terminology:** **App CSS** = styles under `site/app/css/` (Tailwind v4 entry, `@theme`, `@utility`, route bundles). Replaces the old **FOCSS** label — same folder-ownership idea, not a separate CSS framework.

## 5a — Homepage utility inventory

Document every `home-*` utility in contract appendix. No renames.

## 5b — Legacy → homepage mapping

| Legacy | Homepage replacement |
|--------|---------------------|
| `scheme-page` wrapper | `HomeMarketingLayout` |
| `typ-section` (h2) | `home-heading` |
| `shell-card` stacks | `HomeSection` + homepage card patterns |
| `contact-shell` | `HomeSection` + `home-shell-xl` |

## 5c — Bundles

`(site)/layout.tsx` loads homepage/marketing bundles for all routes.

## 5d — Inline styles + LanguageSwitcher

Token classes from homepage palette.

## 5e — Dialect checks (implement here)

| Script | npm |
|--------|-----|
| `check-marketing-inline-style.mjs` | `check:site-ui:inline-style` |
| `check-homepage-dialect.mjs` | `check:site-ui:dialect` |

**Dialect check modes** (see `plans/DECISIONS.md`):

- `error` — **default** (`check-homepage-dialect.mjs`; fails CI on legacy `typ-section` h2 or scheme-page wrapper)
- `warn` — override only: `SITE_UI_DIALECT_MODE=warn` during batch migrations

Fail on `scheme-page flex min-h-screen flex-col items-center` on marketing routes and `<h2 className="…typ-section…">`.

## 5f — Shell check stub

`check-site-page-shell.mjs` stub — full rules completed in Phase 10.

## Acceptance Checklist

- [x] Mapping table in contract.
- [x] `check:site-ui:inline-style` + `check:site-ui:dialect` scripts committed (dialect default `error`).
- [x] `home-*` utility inventory in contract appendix.
- [x] `LanguageSwitcher` token classes.
- [~] Build passes (typecheck + `check:site-ui` verified; full `release:gate` not run).
