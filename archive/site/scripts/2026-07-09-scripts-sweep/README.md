# Scripts sweep archive — 2026-07-09

Moved from `site/scripts/` during full scripts recheck (not coverage-only).

| Script | Class | Why |
|--------|-------|-----|
| `fix-planner-custom-tools.js` | ARCHIVE | Injects hollow `expect(page).toBeDefined()` into e2e specs — dangerous |
| `test-morph.ts` | ARCHIVE | One-off ts-morph probe for missing `lib/db.ts` |
| `recover-from-transcript.mjs` | ARCHIVE | Hardcoded Cursor paths for `e-Goodsites-oando-consolidated` (gone) |
| `test-writer.ts` | ARCHIVE | Already inert stub; generator removed — keep archive-over-delete |
| `generate-markdown-report.js` | ARCHIVE | Ad-hoc coverage+fake-tests report; inputs missing; superseded by coverage pipeline |
| `find-fake-tests.js` | ARCHIVE | Naive no-expect scan; superseded by `audit-hollow-tests.mjs` + `find-fake-tests-ast.ts` |

Related earlier archives:

- `../2026-07-09-stale/` — tldraw / nova-act / scrapeAfc / tmp
- `../2026-07-09-coverage-legacy/` — old coverage helpers

Root-repo one-shots: `../../../../scripts/2026-07-09-scripts-sweep/` (verify-parser, diag-filter, migrate-evidence).

Evidence: `results/site/scripts-audit/SCRIPTS-SWEEP-2026-07-09.md`  
Audit runner: `site/scripts/_audit-stale-scripts.mjs`
