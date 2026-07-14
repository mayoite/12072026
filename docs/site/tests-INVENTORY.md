# Test inventory

Snapshot of test file counts under `site/tests/`. Folder rules: `CONTENTS.md`.

*Verified: 2026-07-14 (filesystem count).*

## Counts

| Kind | Count |
|------|------:|
| Unit (`**/*.test.ts(x)`) | **1342** |
| Integration | **54** |
| Playwright e2e (`**/*.spec.ts`) | **51** |
| Helpers | ~5 |

## Unit by top folder

| Path | Files |
|------|------:|
| `unit/features/` | 775 |
| `unit/scripts/` | 171 |
| `unit/app/` | 169 |
| `unit/lib/` | 121 |
| `unit/components/` | 73 |
| `unit/platform/` | 16 |
| `unit/config/` | 10 |
| `unit/i18n/` | 6 |

## Name-mirror (handwritten product)

| Tree | Status |
|------|--------|
| `app/`, `components/`, `features/`, `lib/`, `i18n/`, `config/` (handwritten) | **100%** |
| `platform/` (non-generated) | **~100%** (edge Deno function optional) |
| Generated DB types | Excluded |
| `scripts/` | Tooling mirrors optional |

## See also

- `CONTENTS.md`
- `../ARCHITECTURE.md`
- `../../Readme.md`
