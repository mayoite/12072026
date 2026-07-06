# Localization / i18n — Current Situation

**Evidence:** Direct read of `site/i18n/CONTENTS.md`, routing.ts, Lockedfiles/site, proxy.ts, TESTING.md.

## Honest State

- Uses next-intl ^4.13; localePrefix: 'never'.
- Messages in `site/i18n/messages/`.
- Middleware in proxy.ts (bypassed comment for dynamic support).
- Async loaders in request.ts.
- Test helper: nextIntlServerEnMock for server components.
- Evidence: i18n tests in site/tests; generator coverage for data loaders.

## Gaps

- `site-workflows/localization-i18n/` structure created now (pre: absent per list_dir).
- Proxy has bypass notes; full locale negotiation state needs verification on live.
- Not all marketing strings may be extracted (deferred UI-3).
- Workflows page in generator has no i18n section.
- Evidence of full locale matrix limited in public tech-stack docs.

## GS Application

- Evidence first: any i18n change requires test run artifacts + console output.
- Refer: update `docs/Lockedfiles/site/current.md` + TESTING.md on policy shift.
- Anti-copy: translation quality not copied from competitors without attribution/benchmark.
- Superpowers lens: cite GS gate if i18n affects UI/UX surfaces.
