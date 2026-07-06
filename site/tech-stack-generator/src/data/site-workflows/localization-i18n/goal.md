# Localization / i18n — Goal

**Targets:**

- All user-facing strings in messages/ JSON (no hard-coded English in components/routes).
- Test coverage for every locale loader + async page (using mocks).
- CI gate includes i18n smoke (typecheck + vitest site).
- Measurable: 0 missing keys in key marketing pages.
- Industry best: ICU message format usage; locale-aware testing; extraction script if added.
- Tech-stack: localization workflow documented here and surfaced in generator.
- GS: benchmark any i18n UI impact against global standard (anti-copy for translated copy if visual).

**Verifiable:**
- `pnpm run test:tech-stack` + site vitest i18n slice.
- Fresh artifacts under results/ on change.
- Cross-ref to `docs/Lockedfiles/documentation/proposed.md` for doc i18n if added.

Refer to `site/i18n/CONTENTS.md` + TESTING.md.
