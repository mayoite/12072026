# Scripts sweep — 2026-07-09

Full recheck of `site/scripts/**` and repo-root `scripts/**` (not coverage-only).  
Goal: find stale/dead scripts referencing packages, pages, features, or workflows that no longer exist.

## Counts

| Class | Count | Notes |
|-------|------:|-------|
| **ARCHIVE** | **9** | 6 site + 3 root (moved this sweep) |
| **FIX** | **8** | path/doc/default updates applied |
| **KEEP** | **~160+** | live db/svg/seed/coverage/fabric/ops scripts unchanged |
| Already archived (prior same day) | 4+1 | `2026-07-09-stale/` + `2026-07-09-coverage-legacy/` |

**Evidence:** re-run `node site/scripts/_audit-stale-scripts.mjs` after this land → `STALE-SCRIPTS.md`.

## Packages / features (facts)

| Check | Status |
|-------|--------|
| fabric | yes (destination canvas) |
| three | yes |
| tldraw / @tldraw | **NO** |
| konva / react-konva | **NO** |
| nova-act | **NO** |
| features/planner/open3d | yes |
| features/planner/tldraw | **MISSING** |
| features/buddy-planner | **MISSING** |
| public/tldraw-assets | **MISSING** |
| lib/configurator | yes (smartWizard only) |
| app page routes for /buddy-planner, /configurator | **no** (redirects only) |

## ARCHIVE (moved this sweep)

| Path | Class | Reason |
|------|-------|--------|
| `site/scripts/fix-planner-custom-tools.js` → `archive/site/scripts/2026-07-09-scripts-sweep/` | ARCHIVE | Injects hollow `expect(page).toBeDefined()` into e2e — dangerous |
| `site/scripts/test-morph.ts` → same | ARCHIVE | One-off; `lib/db.ts` gone (use `platform/drizzle`) |
| `site/scripts/recover-from-transcript.mjs` → same | ARCHIVE | Hardcoded Cursor `e-Goodsites-oando-consolidated` transcripts |
| `site/scripts/test-writer.ts` → same | ARCHIVE | Inert stub (generator already removed) |
| `site/scripts/generate-markdown-report.js` → same | ARCHIVE | Depends on missing `fake-tests.json`; superseded by coverage pipeline |
| `site/scripts/find-fake-tests.js` → same | ARCHIVE | Naive; superseded by `audit-hollow-tests.mjs` |
| `scripts/verify-parser.ps1` → `archive/scripts/2026-07-09-scripts-sweep/` | ARCHIVE | Hardcoded `D:\worktrees\bench-456` |
| `scripts/diag-filter.ps1` → same | ARCHIVE | Hardcoded `D:\worktrees\phase-06` |
| `scripts/migrate-evidence.ps1` → same | ARCHIVE | Hardcoded `D:\OOFPLWeb` / old evidence tree |

## FIX (applied)

| Path | Class | Reason / change |
|------|-------|-----------------|
| `site/scripts/syncVendorCdnAssets.mjs` | FIX | Dropped required `tldraw-assets/*` (dir gone) |
| `site/scripts/uploadCdnAssets.ts` | FIX | Comment no longer claims public/tldraw-assets |
| `site/scripts/generate-contents-md.mjs` | FIX | Planner docs: open3d; removed tldraw + public/tldraw-assets entries |
| `site/scripts/generate-tree.js` | FIX | Domain narrations: buddy/oando/ops-portal → planner/open3d/ops |
| `site/scripts/generate-test-inventory.mjs` | FIX | Removed dead tldraw ClearanceChecker migration map row |
| `site/scripts/seed_direct.ts` | FIX | Migration path → `platform/supabase/migrations/...` |
| `site/scripts/sync-backup-to-15062026.ps1` + `watch-backup-sync.ps1` | FIX | Default Source/Destination so npm `backup:sync` works |
| `scripts/run-site-tests.ps1` | FIX | `lint:secrets` (missing) → `scan:secrets` |

## KEEP (sampled — no change)

| Path | Class | Reason |
|------|-------|--------|
| `site/scripts/canvas-audit.mjs`, `check-full-page.mjs`, `debug-*` | KEEP | fabric package present; destination engine probes |
| `site/scripts/generate-route-classification.mjs` | KEEP | Documents live next.config redirects from /buddy-planner |
| `site/scripts/seed*.ts`, `db_*.ts`, `generate-svg*`, coverage pipeline | KEEP | Wired + still used |
| `site/scripts/shoot-routes.mjs` | KEEP | Already open3d routes (2026-07-09 earlier fix) |
| `site/scripts/analyze-coverage-*.mjs`, `*coverage*` | KEEP | `lib/configurator/` string is source path, not /configurator route |
| `site/scripts/seed_configurator_catalog.ts` | KEEP | Catalog product seed; not a page route |
| `scripts/check-sharp.js`, `run-evidence-cmd.ps1`, `scan-forbidden.ps1` | KEEP | Parameterized / still valid |
| Ad-hoc `capture-home.mjs`, `check-header.mjs`, `check-mega.mjs` | KEEP | Optional operator screenshots; no missing package |

## package.json

- No npm scripts pointed at archived files (0 broken targets after sweep).
- Coverage gate / vitest.shared **not** touched.

## Audit tooling

- Improved `site/scripts/_audit-stale-scripts.mjs`: root scripts scan, import-vs-prose heuristics, ARCHIVE/FIX classes, broken npm targets, fewer false positives on redirect docs.
- Pointer: `site/scripts/CONTENTS.md`, `COVERAGE-SCRIPTS.md` (unchanged policy).

## Not archived (owner call later)

- Machine-specific backup trio (`sync-backup-to-15062026`, install, watch) — still owner workflow; defaults fixed only.
- Phase route probes (`phase04*`…`phase08*`) — optional evidence helpers; routes still exist under /admin /planner /ops.
- `find-fake-tests-ast.ts` — unwired but still AST-based quality helper; left in place.
