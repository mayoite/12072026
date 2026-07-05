# Project: Site Coverage Hardening

## Architecture
- Target 95% test coverage for the `site/` directory as specified in `vitest.site.config.ts`.
- The `site/` source files tracked for coverage include:
  - `site/lib/site-data/`
  - `site/lib/catalog/`
  - `site/lib/configurator/`
  - `site/features/catalog/`
  - `site/features/shared/`
  - `site/features/site-assistant/`
  - `site/features/ops/`
- Mocking Pattern: Use existing `site/tests/` patterns. Explicitly mock all third-party libraries and internal database/API clients.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Area 1: lib/catalog & lib/configurator | Write tests for these areas to reach 95% | none | PLANNED |
| 2 | Area 2: features/catalog & features/shared | Write tests for these areas to reach 95% | none | PLANNED |
| 3 | Area 3: features/site-assistant & features/ops | Write tests for these areas to reach 95% | none | PLANNED |
| 4 | Area 4: lib/site-data | Write tests for these areas to reach 95% | none | PLANNED |
| 5 | Verify overall coverage | Run full suite and verify 95% | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
- Tests must be placed in `site/tests/unit/` or similar per `TESTING.md` rules.
- Run `pnpm --filter oando-site test <test-file>` for isolated testing to avoid pool timeouts.
- Overall coverage can be run via `pnpm --filter oando-site run test:coverage:site`.

## Code Layout
- Tests in `site/tests/`
- Source in `site/lib/` and `site/features/`
