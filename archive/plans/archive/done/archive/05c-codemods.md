# Phase 5c — Homepage Codemods

## Purpose

Mechanical migration helpers after Phase 5 CSS mapping and Phase 2b primitives exist.

## Codemod 1 — Page wrapper

```
scheme-page flex min-h-screen flex-col items-center
→ <HomeMarketingLayout> or min-h-screen overflow-x-hidden
```

Target: ~26 routes per Phase 1 matrix `legal-shell` / `scheme-page` rows.

## Codemod 2 — Section titles

```
typ-section (on h2 section titles in marketing routes)
→ home-heading
```

Allowlist exceptions documented in contract (if any).

## Tooling

`site/scripts/codemods/homepage-dialect.mjs` — dry-run default; `--write` applies.

Run per Phase 3 batch after manual review of diff.

## Acceptance Checklist

- [x] Codemod script committed with dry-run output in `site/results/site-ui/codemod-dry-run.log`.
- [x] No codemod run on `app/(site)/page.tsx` (homepage stays source).
- [x] Phase 3 batches reference codemod + manual pass (migration complete; dry-run 0 matches post-3f).
