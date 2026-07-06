# Phase 10 — Compliance Scripts + CI

## Purpose

Complete check scripts (stubs from Phase 5) and wire CI **before** Phase 9 visual E2E.

## Scripts

| Script | Built in | CI |
|--------|----------|-----|
| `check:i18n:parity` | Phase 4a | yes |
| `check:site-ui:inline-style` | Phase 5e | yes |
| `check:site-ui:dialect` | Phase 5e | yes |
| `check-site-page-shell.mjs` | **Phase 10** (full rules) | yes |
| `check-marketing-copy-source.mjs` | Phase 10 | yes |

```json
"check:site-ui": "npm run check:site-ui:shell && npm run check:i18n:parity && npm run check:site-ui:copy && npm run check:site-ui:inline-style && npm run check:site-ui:dialect"
```

### `check-site-page-shell.mjs`

Read `route-matrix.csv` — require `homepage` or `solutions-like` dialect; `home-marketing-layout` testid.

## CI job `site-ui.yml`

```
check:site-ui → test:site-ui (Wave 1 minimum)
```

Separate from `release-gate.yml`. Path filters: `app/(site)`, `components/home`, `app/css`.

## Audit close

Update `docs/audit/site-ui/*`; matrix all rows `homepage` or `solutions-like`.

## Acceptance Checklist

- [x] `check:site-ui` exit 0 (shell, parity, copy, inline-style, dialect).
- [x] Dialect check mode = `error` after cutover (default in `check-homepage-dialect.mjs`; override with `SITE_UI_DIALECT_MODE=warn`).
- [x] CI workflow committed (`.github/workflows/site-ui.yml`).
- [x] Pack done in `plans/README.md` — `test:site-ui` / gate proof skipped per user (no gate).
