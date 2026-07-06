# Phase 4 — Test Harness Standards

## Purpose

Establish one canonical test infrastructure so later phases fix files once, not forty times. Eliminate duplicated mock patterns that cause systemic ESLint failures.

## New Shared Modules

Create under `site/tests/helpers/`:

### `mockNextImage.tsx`

Single `next/image` mock used by all component and page tests:

- Renders a plain `img` with `alt=""` default when `alt` is omitted.
- Spreads remaining props.
- Exported function `installNextImageMock()` called from tests or Vitest setup.

### `mockNextLink.tsx`

Canonical `next/link` mock rendering `<a href={href}>`.

### `nextIntlServerEnMock.ts`

Side-effect module for async App Router pages that call `getTranslations` / `getLocale` from `next-intl/server`:

- Resolves nested keys from `site/i18n/messages/en.json` per namespace.
- Import at top of marketing/legal/workspace page tests: `import "@/tests/helpers/nextIntlServerEnMock";`
- Pair with `const jsx = await Page(); render(jsx);` — see `tests/unit/app/(site)/about/page.test.tsx`.
- Documented in `TESTING.md` (async marketing page tests).

### `testRender.tsx` (optional)

Thin wrapper around `@testing-library/react` `render` with providers only where multiple suites need the same tree.

## Vitest Setup Integration

Update `site/vitest.shared.ts` / setup file so:

- `installNextImageMock()` and `installNextLinkMock()` run once globally **only if** per-file overrides are not required.
- If a test needs a custom image behavior, it uses explicit props on the mock — not a second `vi.mock('next/image')` duplicate.

## Migration

Replace every inline:

```ts
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}));
```

with the shared helper. Target: **37 files** (baseline bucket **M**).

Remove duplicate `next/link` mocks the same way.

## Type Import Standard

Document in `site/tests/helpers/README.md` (test-only doc):

- Use `import type { … }` at top of file.
- Never use `import('module').Type` inline type annotations.

## ESLint in Tests

Tests remain under strict rules except the three already relaxed in `eslint.config.mjs`:

- `no-explicit-any` off in tests
- `no-non-null-assertion` off in tests
- `no-console` off in tests

Do not add further relaxations.

## Acceptance Checklist

- [x] `site/tests/helpers/mockNextImage.tsx` exists and is used globally from `tests/setup.ts`.
- [x] `site/tests/helpers/mockNextLink.tsx` committed; `next/link` also mocked in `tests/setup.ts`.
- [x] `site/tests/helpers/nextIntlServerEnMock.ts` — async i18n page tests (2026-06-30 CI batch).
- [x] `next/link` mock in global setup (`tests/setup.ts`).
- [x] Duplicate per-file `vi.mock('next/image')` stripped (0 remaining per-file mocks).
- [x] Zero `eslint-disable` in `site/tests/helpers/`.
- [x] `@next/next/no-img-element` resolved for tests (global mock + test eslint scope).
- [x] Phase note in `Failures.md` RG-04.
