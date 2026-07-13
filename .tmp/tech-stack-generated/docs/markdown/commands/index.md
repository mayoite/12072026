# Commands

| Fact ID | Package | Script | Command | Source |
| --- | --- | --- | --- | --- |
| `oando-site:// docs:* scripts restored for CONTENTS.md + inventory regeneration; use docs:sync or docs:sync:all..command` | oando-site | // docs:* scripts restored for CONTENTS.md + inventory regeneration; use docs:sync or docs:sync:all. |  | `site/package.json` |
| `oando-site:alt:sync:apply.command` | oando-site | alt:sync:apply | tsx scripts/sync-missing-alt-text.ts --apply | `site/package.json` |
| `oando-site:alt:sync:dry.command` | oando-site | alt:sync:dry | tsx scripts/sync-missing-alt-text.ts | `site/package.json` |
| `oando-site:assets:audit:thirdparty.command` | oando-site | assets:audit:thirdparty | python scripts/audit_external_asset_hosts.py --fail-on-hit | `site/package.json` |
| `oando-site:assets:cdn:audit.command` | oando-site | assets:cdn:audit | npx tsx scripts/auditCdnAssetFailures.ts | `site/package.json` |
| `oando-site:assets:cdn:catalog.command` | oando-site | assets:cdn:catalog | npx tsx scripts/downloadCdnAssets.ts | `site/package.json` |
| `oando-site:assets:cdn:fix.command` | oando-site | assets:cdn:fix | npx tsx scripts/auditCdnAssetFailures.ts --apply | `site/package.json` |
| `oando-site:assets:cdn:replacements.command` | oando-site | assets:cdn:replacements | npx tsx scripts/auditUnresolvedCdnPaths.ts | `site/package.json` |
| `oando-site:assets:cdn:sync.command` | oando-site | assets:cdn:sync | node scripts/syncVendorCdnAssets.mjs | `site/package.json` |
| `oando-site:assets:cdn:upload.command` | oando-site | assets:cdn:upload | npx tsx scripts/uploadCdnAssets.ts | `site/package.json` |
| `oando-site:assets:cdn:upload:incremental.command` | oando-site | assets:cdn:upload:incremental | npx tsx scripts/uploadCdnAssets.ts --skip-existing | `site/package.json` |
| `oando-site:assets:r2:count.command` | oando-site | assets:r2:count | node scripts/count-r2-objects.mjs | `site/package.json` |
| `oando-site:assets:r2:create-bucket.command` | oando-site | assets:r2:create-bucket | npx tsx scripts/create-bucket.ts | `site/package.json` |
| `oando-site:assets:r2:delete-bucket.command` | oando-site | assets:r2:delete-bucket | npx tsx scripts/deleteR2Bucket.ts | `site/package.json` |
| `oando-site:audit:hosted:runtime.command` | oando-site | audit:hosted:runtime | node scripts/audit-hosted-runtime.mjs | `site/package.json` |
| `oando-site:audit:products:quality.command` | oando-site | audit:products:quality | npx tsx scripts/audit-product-quality.ts | `site/package.json` |
| `oando-site:audit:slug-id.command` | oando-site | audit:slug-id | npx tsx scripts/audit_slug_id_integrity.ts | `site/package.json` |
| `oando-site:audit:supabase:admin.command` | oando-site | audit:supabase:admin | npx tsx scripts/audit_supabase_admin.ts | `site/package.json` |
| `oando-site:audit:supabase:catalog.command` | oando-site | audit:supabase:catalog | npx tsx scripts/audit_supabase_catalog.ts | `site/package.json` |
| `oando-site:audit:svg-catalog.command` | oando-site | audit:svg-catalog | tsx scripts/audit-svg-catalog.ts | `site/package.json` |
| `oando-site:backup:github-secrets:sync.command` | oando-site | backup:github-secrets:sync | pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/sync-github-backup-secrets.ps1 | `site/package.json` |
| `oando-site:backup:r2.command` | oando-site | backup:r2 | npx tsx scripts/db_backup_upload_r2.ts && npx tsx scripts/repo_backup_upload_r2.ts | `site/package.json` |
| `oando-site:backup:supabase:r2.command` | oando-site | backup:supabase:r2 | npx tsx scripts/db_backup_upload_r2.ts | `site/package.json` |
| `oando-site:backup:sync.command` | oando-site | backup:sync | pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/sync-backup-to-15062026.ps1 | `site/package.json` |
| `oando-site:backup:sync:install.command` | oando-site | backup:sync:install | pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/install-backup-sync.ps1 | `site/package.json` |
| `oando-site:backup:sync:watch.command` | oando-site | backup:sync:watch | pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/watch-backup-sync.ps1 | `site/package.json` |
| `oando-site:build.command` | oando-site | build | next build && node scripts/prepare-standalone.cjs | `site/package.json` |
| `oando-site:catalog:blocks:qa.command` | oando-site | catalog:blocks:qa | tsx scripts/generate_blocks.ts | `site/package.json` |
| `oando-site:catalog:ingest.command` | oando-site | catalog:ingest | tsx scripts/ingest-planner-catalog.ts | `site/package.json` |
| `oando-site:catalog:organize:apply.command` | oando-site | catalog:organize:apply | tsx scripts/organize-catalog-images.ts --apply | `site/package.json` |
| `oando-site:catalog:organize:dry.command` | oando-site | catalog:organize:dry | tsx scripts/organize-catalog-images.ts --dry-run | `site/package.json` |
| `oando-site:catalog:organize:sync.command` | oando-site | catalog:organize:sync | tsx scripts/organize-catalog-images.ts --sync-db --sync-catalog | `site/package.json` |
| `oando-site:catalog:qa:sheet.command` | oando-site | catalog:qa:sheet | tsx scripts/render-catalog-qa-sheet.ts | `site/package.json` |
| `oando-site:catalog:snapshot:r2.command` | oando-site | catalog:snapshot:r2 | npx tsx scripts/catalog_snapshot_upload_r2.ts | `site/package.json` |
| `oando-site:check:i18n:parity.command` | oando-site | check:i18n:parity | node scripts/check-i18n-key-parity.mjs | `site/package.json` |
| `oando-site:check:site-ui.command` | oando-site | check:site-ui | npm run check:site-ui:shell && npm run check:i18n:parity && npm run check:site-ui:copy && npm run check:site-ui:inline-style && npm run check:site-ui:dialect | `site/package.json` |
| `oando-site:check:site-ui:copy.command` | oando-site | check:site-ui:copy | node scripts/check-marketing-copy-source.mjs | `site/package.json` |
| `oando-site:check:site-ui:dialect.command` | oando-site | check:site-ui:dialect | node scripts/check-homepage-dialect.mjs | `site/package.json` |
| `oando-site:check:site-ui:inline-style.command` | oando-site | check:site-ui:inline-style | node scripts/check-marketing-inline-style.mjs | `site/package.json` |
| `oando-site:check:site-ui:shell.command` | oando-site | check:site-ui:shell | node scripts/check-site-page-shell.mjs | `site/package.json` |
| `oando-site:codemod:homepage-dialect.command` | oando-site | codemod:homepage-dialect | node scripts/codemods/homepage-dialect.mjs | `site/package.json` |
| `oando-site:db:advisors.command` | oando-site | db:advisors | npx tsx scripts/db_advisors.ts | `site/package.json` |
| `oando-site:db:advisors:admin.command` | oando-site | db:advisors:admin | npx tsx scripts/db_advisors_admin.ts | `site/package.json` |
| `oando-site:db:advisors:performance.command` | oando-site | db:advisors:performance | npx tsx scripts/db_advisors.ts --performance | `site/package.json` |
| `oando-site:db:advisors:security.command` | oando-site | db:advisors:security | npx tsx scripts/db_advisors.ts --security | `site/package.json` |
| `oando-site:db:apply.command` | oando-site | db:apply | npx tsx scripts/db_apply_migrations.ts | `site/package.json` |
| `oando-site:db:apply:admin.command` | oando-site | db:apply:admin | npx tsx scripts/db_apply_migrations.ts --target admin | `site/package.json` |
| `oando-site:db:backup-dropped.command` | oando-site | db:backup-dropped | npx tsx scripts/db_backup_dropped_tables.ts | `site/package.json` |
| `oando-site:db:backup:pgdump.command` | oando-site | db:backup:pgdump | npx tsx scripts/db_backup_pg_dump.ts | `site/package.json` |
| `oando-site:db:backup:r2.command` | oando-site | db:backup:r2 | npx tsx scripts/db_backup_upload_r2.ts | `site/package.json` |
| `oando-site:db:ensure-plans.command` | oando-site | db:ensure-plans | npx tsx scripts/db_ensure_plans_table.ts | `site/package.json` |
| `oando-site:db:sync-drizzle.command` | oando-site | db:sync-drizzle | npx tsx scripts/db_sync_drizzle_schema.ts | `site/package.json` |
| `oando-site:db:test.command` | oando-site | db:test | npx tsx scripts/db_test_connection.ts | `site/package.json` |
| `oando-site:db:types.command` | oando-site | db:types | npx -y supabase gen types --linked --schema public > config/database/types/database.types.ts | `site/package.json` |
| `oando-site:db:types:admin.command` | oando-site | db:types:admin | npx tsx scripts/db_gen_admin_types.ts | `site/package.json` |
| `oando-site:dev.command` | oando-site | dev | next dev --webpack | `site/package.json` |
| `oando-site:dev:turbo.command` | oando-site | dev:turbo | next dev --turbo | `site/package.json` |
| `oando-site:dev:webpack.command` | oando-site | dev:webpack | next dev --webpack | `site/package.json` |
| `oando-site:docs:check.command` | oando-site | docs:check | node scripts/generate-docs.mjs --check | `site/package.json` |
| `oando-site:docs:check:coverage.command` | oando-site | docs:check:coverage | node scripts/generate-docs.mjs --coverage --check | `site/package.json` |
| `oando-site:docs:sync.command` | oando-site | docs:sync | node scripts/generate-docs.mjs | `site/package.json` |
| `oando-site:docs:sync:all.command` | oando-site | docs:sync:all | node scripts/generate-docs.mjs --all | `site/package.json` |
| `oando-site:docs:sync:coverage.command` | oando-site | docs:sync:coverage | node scripts/generate-docs.mjs --coverage | `site/package.json` |
| `oando-site:docs:sync:routes.command` | oando-site | docs:sync:routes | node scripts/generate-route-index.mjs | `site/package.json` |
| `oando-site:failures:sync.command` | oando-site | failures:sync | node scripts/export-pending-failures.mjs | `site/package.json` |
| `oando-site:gate.command` | oando-site | gate | npm run release:gate:fast | `site/package.json` |
| `oando-site:gate:full.command` | oando-site | gate:full | npm run release:gate | `site/package.json` |
| `oando-site:gate:open3d.command` | oando-site | gate:open3d | npm run gate:planner | `site/package.json` |
| `oando-site:gate:planner.command` | oando-site | gate:planner | npm run typecheck && npm run test:e2e:planner-world | `site/package.json` |
| `oando-site:i18n:sync:deferred-locales.command` | oando-site | i18n:sync:deferred-locales | node scripts/sync-deferred-locale-messages.mjs | `site/package.json` |
| `oando-site:i18n:sync:hi-wave1.command` | oando-site | i18n:sync:hi-wave1 | node scripts/sync-hi-wave1-messages.mjs | `site/package.json` |
| `oando-site:i18n:sync:marketing.command` | oando-site | i18n:sync:marketing | node scripts/sync-marketing-i18n-messages.mjs | `site/package.json` |
| `oando-site:i18n:translate:deferred-locales.command` | oando-site | i18n:translate:deferred-locales | node scripts/translate-deferred-marketing-flat.mjs | `site/package.json` |
| `oando-site:inventory:app-pages.command` | oando-site | inventory:app-pages | node scripts/generate-app-inventory-csv.mjs | `site/package.json` |
| `oando-site:inventory:scripts.command` | oando-site | inventory:scripts | node scripts/generate-scripts-inventory.mjs | `site/package.json` |
| `oando-site:launch:env.command` | oando-site | launch:env | node scripts/validate-launch-env.mjs | `site/package.json` |
| `oando-site:launch:smoke.command` | oando-site | launch:smoke | node scripts/launch-smoke.mjs | `site/package.json` |
| `oando-site:lint.command` | oando-site | lint | eslint -c config/build/eslint.config.mjs app components features lib tests --max-warnings=0 | `site/package.json` |
| `oando-site:lint:ui.command` | oando-site | lint:ui | node scripts/lint-ui-contract.mjs | `site/package.json` |
| `oando-site:lint:ui:strict.command` | oando-site | lint:ui:strict | node scripts/lint-ui-contract.mjs --strict | `site/package.json` |
| `oando-site:live:openrouter:failover.command` | oando-site | live:openrouter:failover | npx tsx scripts/live_openrouter_failover_stress.ts | `site/package.json` |
| `oando-site:p0.command` | oando-site | p0 | npm run p0:unit && npm run p0:svg | `site/package.json` |
| `oando-site:p0:admin-svg.command` | oando-site | p0:admin-svg | npm run test:e2e:p0-admin-svg | `site/package.json` |
| `oando-site:p0:g8.command` | oando-site | p0:g8 | vitest run tests/unit/features/planner/project/g8RoundTrip.test.ts tests/unit/features/planner/project/loadGeneratedGlbObject.test.ts tests/unit/features/planner/lib/shouldLoadGlb.test.ts tests/unit/features/planner/lib/glbAssetPolicy.test.ts tests/unit/features/planner/project/modularCabinetV0GlbExport.test.ts tests/unit/features/planner/project/modularPlaceMesh.test.ts tests/unit/features/planner/asset-engine/meshStages.test.ts tests/unit/features/planner/asset-engine/placeModularWithGeneratedGlbPlan.test.ts tests/unit/features/planner/asset-engine/stampFurnitureGeneratedGlb.test.ts | `site/package.json` |
| `oando-site:p0:svg.command` | oando-site | p0:svg | npm run scripts:smoke:svg:batch | `site/package.json` |
| `oando-site:p0:unit.command` | oando-site | p0:unit | vitest run tests/unit/features/planner/asset-engine tests/unit/features/planner/project/g8RoundTrip.test.ts tests/unit/features/planner/project/modularPlaceMesh.test.ts tests/unit/lib/auth/devAuthBypass.test.ts | `site/package.json` |
| `oando-site:posttest.command` | oando-site | posttest | node scripts/generate-vitest-report.mjs ../results/tests/vitest-results.json | `site/package.json` |
| `oando-site:preinstall.command` | oando-site | preinstall | node ../scripts/guard-workspace-install.mjs | `site/package.json` |
| `oando-site:pretest.command` | oando-site | pretest | npm run test:clean | `site/package.json` |
| `oando-site:project:render.command` | oando-site | project:render | node scripts/render_project_docs.mjs | `site/package.json` |
| `oando-site:recovery:chat-snapshot.command` | oando-site | recovery:chat-snapshot | node scripts/chat-snapshot.mjs | `site/package.json` |
| `oando-site:recovery:handover.command` | oando-site | recovery:handover | node scripts/recovery-handover.mjs | `site/package.json` |
| `oando-site:recovery:snapshot.command` | oando-site | recovery:snapshot | node scripts/recovery-state.mjs | `site/package.json` |
| `oando-site:recovery:watch.command` | oando-site | recovery:watch | node scripts/recovery-state.mjs --watch --interval=45 | `site/package.json` |
| `oando-site:release:gate.command` | oando-site | release:gate | node ../scripts/check-repo-layout.mjs && npm run test:audit:hollow && npm run test:audit:gate-skips && npm run test:audit:eslint-disable && npm run lint && npm run typecheck && npm run test && npm run build && npm run test:a11y && npm run test:planner-catalog && npm run test:coverage && npm run test:coverage:site | `site/package.json` |
| `oando-site:release:gate:fast.command` | oando-site | release:gate:fast | node ../scripts/check-repo-layout.mjs && npm run lint && npm run typecheck && npm run test && npm run test:audit:hollow -- --exclude-marketing && npm run test:audit:eslint-disable && npm run lint:ui:strict | `site/package.json` |
| `oando-site:repo:backup:r2.command` | oando-site | repo:backup:r2 | npx tsx scripts/repo_backup_upload_r2.ts | `site/package.json` |
| `oando-site:scan:secrets.command` | oando-site | scan:secrets | node scripts/scan_secrets.mjs | `site/package.json` |
| `oando-site:screenshot:planner.command` | oando-site | screenshot:planner | node scripts/take-planner-screenshot.mjs | `site/package.json` |
| `oando-site:scripts:generate-svg.command` | oando-site | scripts:generate-svg | tsx scripts/generate-svg.mjs | `site/package.json` |
| `oando-site:scripts:smoke:svg.command` | oando-site | scripts:smoke:svg | tsx scripts/generate-svg.mjs scripts/generate-svg/_fixtures/chaise.json | `site/package.json` |
| `oando-site:scripts:smoke:svg:batch.command` | oando-site | scripts:smoke:svg:batch | tsx scripts/smoke-svg-fixtures.mjs | `site/package.json` |
| `oando-site:seed.command` | oando-site | seed | npx tsx scripts/seed.ts | `site/package.json` |
| `oando-site:seed:block-descriptors.command` | oando-site | seed:block-descriptors | npx tsx scripts/seed-block-descriptors.ts | `site/package.json` |
| `oando-site:seed:configurator.command` | oando-site | seed:configurator | npx tsx scripts/seed_configurator_catalog.ts | `site/package.json` |
| `oando-site:seed:managed.command` | oando-site | seed:managed | npx tsx scripts/seed_planner_managed_catalog.ts | `site/package.json` |
| `oando-site:site-ui:matrix.command` | oando-site | site-ui:matrix | node scripts/generate-site-ui-route-matrix.mjs | `site/package.json` |
| `oando-site:start.command` | oando-site | start | node scripts/startStandalone.cjs | `site/package.json` |
| `oando-site:supabase:assets:arrange.command` | oando-site | supabase:assets:arrange | tsx scripts/arrange_supabase_catalog_assets.ts | `site/package.json` |
| `oando-site:supabase:backfill:canonical.command` | oando-site | supabase:backfill:canonical | npx tsx scripts/backfill_canonical_catalog_metadata.ts | `site/package.json` |
| `oando-site:supabase:backfill:images.command` | oando-site | supabase:backfill:images | npx tsx scripts/backfill_missing_product_images.ts | `site/package.json` |
| `oando-site:supabase:backup.command` | oando-site | supabase:backup | npx tsx scripts/backup_supabase.ts | `site/package.json` |
| `oando-site:sync:descriptor-svgs.command` | oando-site | sync:descriptor-svgs | npx tsx scripts/sync-descriptor-svgs.ts | `site/package.json` |
| `oando-site:test.command` | oando-site | test | vitest run | `site/package.json` |
| `oando-site:test:a11y.command` | oando-site | test:a11y | npm run test:clean && playwright test -c config/build/playwright.config.ts tests/accessibility.spec.ts | `site/package.json` |
| `oando-site:test:audit:eslint-disable.command` | oando-site | test:audit:eslint-disable | node scripts/audit-eslint-disable.mjs | `site/package.json` |
| `oando-site:test:audit:gate-skips.command` | oando-site | test:audit:gate-skips | node scripts/audit-gate-skips.mjs | `site/package.json` |
| `oando-site:test:audit:hollow.command` | oando-site | test:audit:hollow | node scripts/audit-hollow-tests.mjs | `site/package.json` |
| `oando-site:test:auth:env.command` | oando-site | test:auth:env | npx tsx scripts/checkAuthEnv.ts | `site/package.json` |
| `oando-site:test:auth:env-check.command` | oando-site | test:auth:env-check | npm run test:auth:seed-users && npm run test:auth:env | `site/package.json` |
| `oando-site:test:auth:seed-users.command` | oando-site | test:auth:seed-users | npx tsx scripts/ensureAuthTestUsers.ts | `site/package.json` |
| `oando-site:test:browsers:install.command` | oando-site | test:browsers:install | npx playwright install chromium | `site/package.json` |
| `oando-site:test:clean.command` | oando-site | test:clean | node scripts/clean-test-artifacts.mjs | `site/package.json` |
| `oando-site:test:coverage.command` | oando-site | test:coverage | npm run test:clean && vitest run --coverage && node scripts/generate-coverage-report.mjs planner && node scripts/generate-vitest-report.mjs ../results/tests/vitest-results.json | `site/package.json` |
| `oando-site:test:coverage:inventory.command` | oando-site | test:coverage:inventory | npm run test:clean && vitest run --coverage --config vitest.coverage.inventory.config.ts | `site/package.json` |
| `oando-site:test:coverage:site.command` | oando-site | test:coverage:site | npm run test:clean && vitest run --coverage --config vitest.site.config.ts && node scripts/generate-coverage-report.mjs site && node scripts/generate-vitest-report.mjs ../results/tests/vitest-site-results.json | `site/package.json` |
| `oando-site:test:e2e:assistant.command` | oando-site | test:e2e:assistant | npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/site-assistant-shell.spec.ts | `site/package.json` |
| `oando-site:test:e2e:nav.command` | oando-site | test:e2e:nav | npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/site-navigation-smoke.spec.ts tests/e2e/navigation-smoke.spec.ts | `site/package.json` |
| `oando-site:test:e2e:open3d-world.command` | oando-site | test:e2e:open3d-world | npm run test:clean && node scripts/run-open3d-world-e2e.mjs | `site/package.json` |
| `oando-site:test:e2e:p0-admin-svg.command` | oando-site | test:e2e:p0-admin-svg | npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/admin-svg-publish-p01.spec.ts --reporter=list | `site/package.json` |
| `oando-site:test:e2e:planner-world.command` | oando-site | test:e2e:planner-world | npm run test:clean && node scripts/run-open3d-world-e2e.mjs | `site/package.json` |
| `oando-site:test:e2e:visual.command` | oando-site | test:e2e:visual | playwright test -c config/build/playwright.config.ts tests/e2e/site-visual-regression.spec.ts | `site/package.json` |
| `oando-site:test:e2e:world-standard-w1w2.command` | oando-site | test:e2e:world-standard-w1w2 | playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list | `site/package.json` |
| `oando-site:test:layout:check.command` | oando-site | test:layout:check | node scripts/check-test-layout.mjs | `site/package.json` |
| `oando-site:test:planner.command` | oando-site | test:planner | vitest run planner | `site/package.json` |
| `oando-site:test:planner-catalog.command` | oando-site | test:planner-catalog | npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/admin-smoke.spec.ts tests/e2e/planner-catalog.spec.ts tests/e2e/planner-guest-workspace.spec.ts tests/e2e/planner-custom-tools.spec.ts tests/e2e/planner-chrome.spec.ts tests/e2e/sketch-to-plan-pipeline.spec.ts tests/e2e/planner-offline-sync.spec.ts | `site/package.json` |
| `oando-site:test:planner-catalog:watch.command` | oando-site | test:planner-catalog:watch | playwright test -c config/build/playwright.config.ts tests/e2e/planner-catalog.spec.ts --ui | `site/package.json` |
| `oando-site:test:planner:watch.command` | oando-site | test:planner:watch | vitest planner | `site/package.json` |
| `oando-site:test:results.command` | oando-site | test:results | npm run test:coverage && npm run test:coverage:site | `site/package.json` |
| `oando-site:test:site-ui.command` | oando-site | test:site-ui | npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/site-locale-switch.spec.ts tests/e2e/site-visual-regression.spec.ts | `site/package.json` |
| `oando-site:test:ui.command` | oando-site | test:ui | vitest --ui | `site/package.json` |
| `oando-site:test:unit.command` | oando-site | test:unit | vitest run --exclude **/planner* | `site/package.json` |
| `oando-site:test:watch.command` | oando-site | test:watch | vitest | `site/package.json` |
| `oando-site:tree:csv.command` | oando-site | tree:csv | node scripts/generate-tree.js | `site/package.json` |
| `oando-site:tree:xlsx.command` | oando-site | tree:xlsx | node scripts/generate-tree.js && node scripts/format-dir-tree-xlsx.mjs | `site/package.json` |
| `oando-site:typecheck.command` | oando-site | typecheck | tsc -p tsconfig.json --noEmit | `site/package.json` |
| `oando-site:typecheck:scripts.command` | oando-site | typecheck:scripts | tsc -p scripts/tsconfig.json --noEmit | `site/package.json` |
| `oando-site-workflow-docs:build.command` | oando-site-workflow-docs | build | node scripts/emit-renderer-data.mjs && vite build | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:coverage.command` | oando-site-workflow-docs | coverage | vitest run --coverage | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:dev.command` | oando-site-workflow-docs | dev | node scripts/emit-renderer-data.mjs && vite | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:docs:check.command` | oando-site-workflow-docs | docs:check | node scripts/check.mjs | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:docs:emit.command` | oando-site-workflow-docs | docs:emit | node scripts/emit-renderer-data.mjs | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:docs:generate.command` | oando-site-workflow-docs | docs:generate | node scripts/generate.mjs | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:docs:sync-css.command` | oando-site-workflow-docs | docs:sync-css | node scripts/sync-css.mjs | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:preinstall.command` | oando-site-workflow-docs | preinstall | node ../../scripts/guard-workspace-install.mjs | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:preview.command` | oando-site-workflow-docs | preview | vite preview | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:test.command` | oando-site-workflow-docs | test | node scripts/emit-renderer-data.mjs && vitest run | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:test:coverage.command` | oando-site-workflow-docs | test:coverage | vitest run --coverage | `site/tech-stack-generator/package.json` |
| `oando-site-workflow-docs:typecheck.command` | oando-site-workflow-docs | typecheck | tsc --noEmit | `site/tech-stack-generator/package.json` |
| `oando-workspace:build.command` | oando-workspace | build | pnpm run check-sharp && pnpm --filter oando-site build && pnpm --filter oando-site-workflow-docs build | `package.json` |
| `oando-workspace:build:tech-stack.command` | oando-workspace | build:tech-stack | pnpm --filter oando-site-workflow-docs build | `package.json` |
| `oando-workspace:check-sharp.command` | oando-workspace | check-sharp | node scripts/check-sharp.js | `package.json` |
| `oando-workspace:check:active-docs.command` | oando-workspace | check:active-docs | node scripts/check-active-docs.mjs | `package.json` |
| `oando-workspace:check:agents-folder.command` | oando-workspace | check:agents-folder | node scripts/check-agents-folder.mjs | `package.json` |
| `oando-workspace:check:agents-md.command` | oando-workspace | check:agents-md | node scripts/check-agents-md.mjs | `package.json` |
| `oando-workspace:check:ayushdocs.command` | oando-workspace | check:ayushdocs | node scripts/check-ayushdocs.mjs | `package.json` |
| `oando-workspace:check:docs-purity.command` | oando-workspace | check:docs-purity | node scripts/check-docs-purity.mjs | `package.json` |
| `oando-workspace:check:layout.command` | oando-workspace | check:layout | node scripts/check-repo-layout.mjs | `package.json` |
| `oando-workspace:check:plans-purity.command` | oando-workspace | check:plans-purity | node scripts/check-plans-purity.mjs | `package.json` |
| `oando-workspace:dev.command` | oando-workspace | dev | pnpm --filter oando-site dev | `package.json` |
| `oando-workspace:dev:tech-stack.command` | oando-workspace | dev:tech-stack | pnpm --filter oando-site-workflow-docs dev | `package.json` |
| `oando-workspace:dev:turbo.command` | oando-workspace | dev:turbo | pnpm --filter oando-site dev:turbo | `package.json` |
| `oando-workspace:docs:build:tech-stack.command` | oando-workspace | docs:build:tech-stack | pnpm run docs:sync:tech-stack && pnpm run docs:typecheck:tech-stack && pnpm run build:tech-stack | `package.json` |
| `oando-workspace:docs:check:root-links.command` | oando-workspace | docs:check:root-links | node site/scripts/check-root-markdown-links.mjs | `package.json` |
| `oando-workspace:docs:check:tech-stack.command` | oando-workspace | docs:check:tech-stack | node site/tech-stack-generator/scripts/check.mjs | `package.json` |
| `oando-workspace:docs:gate:tech-stack.command` | oando-workspace | docs:gate:tech-stack | node site/tech-stack-generator/scripts/gate.mjs | `package.json` |
| `oando-workspace:docs:sync:all.command` | oando-workspace | docs:sync:all | pnpm --filter oando-site docs:sync:all | `package.json` |
| `oando-workspace:docs:sync:tech-stack.command` | oando-workspace | docs:sync:tech-stack | node site/tech-stack-generator/scripts/generate.mjs && node site/tech-stack-generator/scripts/emit-renderer-data.mjs | `package.json` |
| `oando-workspace:docs:test:tech-stack.command` | oando-workspace | docs:test:tech-stack | pnpm --filter oando-site-workflow-docs test | `package.json` |
| `oando-workspace:docs:typecheck:tech-stack.command` | oando-workspace | docs:typecheck:tech-stack | pnpm --filter oando-site-workflow-docs typecheck | `package.json` |
| `oando-workspace:gate.command` | oando-workspace | gate | pnpm run check:layout && pnpm run check:ayushdocs && pnpm run check:agents-md && pnpm run check:agents-folder && pnpm run check:active-docs && pnpm run check:plans-purity && pnpm run check:docs-purity && pnpm --filter oando-site gate | `package.json` |
| `oando-workspace:gate:full.command` | oando-workspace | gate:full | pnpm run check:layout && pnpm --filter oando-site gate:full | `package.json` |
| `oando-workspace:gate:planner.command` | oando-workspace | gate:planner | pnpm --filter oando-site gate:planner | `package.json` |
| `oando-workspace:lint.command` | oando-workspace | lint | pnpm --filter oando-site lint | `package.json` |
| `oando-workspace:lint:secrets.command` | oando-workspace | lint:secrets | secretlint "**/*.{cjs,css,csv,html,js,json,jsx,md,mjs,ps1,py,sql,toml,ts,tsx,txt,yaml,yml}" ".env*" ".gitattributes" ".gitignore" ".npmrc" ".vercelignore" | `package.json` |
| `oando-workspace:p0.command` | oando-workspace | p0 | pnpm --filter oando-site p0 | `package.json` |
| `oando-workspace:p0:admin-svg.command` | oando-workspace | p0:admin-svg | pnpm --filter oando-site p0:admin-svg | `package.json` |
| `oando-workspace:p0:g8.command` | oando-workspace | p0:g8 | pnpm --filter oando-site p0:g8 | `package.json` |
| `oando-workspace:p0:svg.command` | oando-workspace | p0:svg | pnpm --filter oando-site p0:svg | `package.json` |
| `oando-workspace:p0:unit.command` | oando-workspace | p0:unit | pnpm --filter oando-site p0:unit | `package.json` |
| `oando-workspace:postinstall.command` | oando-workspace | postinstall | node scripts/cleanup-nested-installs.mjs | `package.json` |
| `oando-workspace:preinstall.command` | oando-workspace | preinstall | node scripts/guard-workspace-install.mjs | `package.json` |
| `oando-workspace:preview:tech-stack.command` | oando-workspace | preview:tech-stack | pnpm --filter oando-site-workflow-docs preview | `package.json` |
| `oando-workspace:release:gate.command` | oando-workspace | release:gate | turbo run release:gate | `package.json` |
| `oando-workspace:release:gate:fast.command` | oando-workspace | release:gate:fast | turbo run release:gate:fast | `package.json` |
| `oando-workspace:start.command` | oando-workspace | start | pnpm --filter oando-site start | `package.json` |
| `oando-workspace:test.command` | oando-workspace | test | pnpm --filter oando-site test | `package.json` |
| `oando-workspace:test:e2e:planner-world.command` | oando-workspace | test:e2e:planner-world | pnpm --filter oando-site test:e2e:planner-world | `package.json` |
| `oando-workspace:test:tech-stack.command` | oando-workspace | test:tech-stack | pnpm --filter oando-site-workflow-docs test | `package.json` |
| `oando-workspace:typecheck.command` | oando-workspace | typecheck | pnpm --filter oando-site typecheck | `package.json` |
| `oando-workspace:typecheck:tech-stack.command` | oando-workspace | typecheck:tech-stack | pnpm --filter oando-site-workflow-docs typecheck | `package.json` |
| `oando-workspace:vercel:preview.command` | oando-workspace | vercel:preview | vercel --yes | `package.json` |
| `oando-workspace:vercel:prod.command` | oando-workspace | vercel:prod | pnpm run release:gate && vercel --prod --yes | `package.json` |

## Sources

| Path | Kind | Pointer |
| --- | --- | --- |
| `.env.example` | `env-example` | `line 21` |
| `package.json` | `package-manifest` | `devDependencies.@secretlint/secretlint-rule-preset-recommend` |
| `pnpm-lock.yaml` | `lockfile` | `importers...devDependencies.@secretlint/secretlint-rule-preset-recommend.version` |
| `site/` | `directory` | `app` |
| `site/app/(site)/about/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/access/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/brochure/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/career/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/catalog/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/choose-product/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/compare/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/contact/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/dashboard/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/download-brochure/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/downloads/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/gallery/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/imprint/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/login/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/news/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/planning/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/portal/[id]/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/portal/guest/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/portal/guest/view/[id]/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/portal/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/portal/svg-catalog/[slug]/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/portal/svg-catalog/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/portfolio/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/privacy/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/products/[category]/[product]/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/products/[category]/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/products/category/[slug]/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/products/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/projects/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/quote-cart/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/refund-and-return-policy/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/repo-store/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/service/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/showrooms/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/social/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/solutions/[category]/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/solutions/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/support-ivr/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/sustainability/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/templates/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/terms/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/tracking/page.tsx` | `page-file` | `default export` |
| `site/app/(site)/trusted-by/page.tsx` | `page-file` | `default export` |
| `site/app/admin/analytics/page.tsx` | `page-file` | `default export` |
| `site/app/admin/buddy-catalog/page.tsx` | `page-file` | `default export` |
| `site/app/admin/catalog/page.tsx` | `page-file` | `default export` |
| `site/app/admin/crm/clients/page.tsx` | `page-file` | `default export` |
| `site/app/admin/crm/page.tsx` | `page-file` | `default export` |
| `site/app/admin/crm/projects/[id]/page.tsx` | `page-file` | `default export` |
| `site/app/admin/crm/projects/page.tsx` | `page-file` | `default export` |
| `site/app/admin/crm/quotes/page.tsx` | `page-file` | `default export` |
| `site/app/admin/customer-queries/page.tsx` | `page-file` | `default export` |
| `site/app/admin/features/page.tsx` | `page-file` | `default export` |
| `site/app/admin/inventory/page.tsx` | `page-file` | `default export` |
| `site/app/admin/page.tsx` | `page-file` | `default export` |
| `site/app/admin/planner-catalog/page.tsx` | `page-file` | `default export` |
| `site/app/admin/plans/[id]/page.tsx` | `page-file` | `default export` |
| `site/app/admin/plans/page.tsx` | `page-file` | `default export` |
| `site/app/admin/price-books/page.tsx` | `page-file` | `default export` |
| `site/app/admin/settings/page.tsx` | `page-file` | `default export` |
| `site/app/admin/svg-editor/[id]/page.tsx` | `page-file` | `default export` |
| `site/app/admin/svg-editor/page.tsx` | `page-file` | `default export` |
| `site/app/admin/themes/page.tsx` | `page-file` | `default export` |
| `site/app/admin/workspace-catalog/page.tsx` | `page-file` | `default export` |
| `site/app/api/admin/analytics/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/buddy-catalog/[id]/route.ts` | `route-file` | `export DELETE` |
| `site/app/api/admin/buddy-catalog/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/catalog/[id]/route.ts` | `route-file` | `export DELETE` |
| `site/app/api/admin/catalog/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/catalogs/[type]/[id]/route.ts` | `route-file` | `export DELETE` |
| `site/app/api/admin/catalogs/[type]/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/configurator-catalog/[id]/route.ts` | `route-file` | `export DELETE` |
| `site/app/api/admin/features/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/planner-catalog/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/plans/[id]/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/plans/route.ts` | `route-file` | `export DELETE` |
| `site/app/api/admin/price-books/[bookId]/action/route.ts` | `route-file` | `export POST` |
| `site/app/api/admin/price-books/[bookId]/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/price-books/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/svg-editor/[slug]/lifecycle/route.ts` | `route-file` | `export PATCH` |
| `site/app/api/admin/svg-editor/[slug]/revisions/route.ts` | `route-file` | `export GET` |
| `site/app/api/admin/svg-editor/[slug]/rollback/route.ts` | `route-file` | `export POST` |
| `site/app/api/admin/svg-editor/bulk-import/route.ts` | `route-file` | `export POST` |
| `site/app/api/admin/svg-editor/route.ts` | `route-file` | `export POST` |
| `site/app/api/admin/themes/publish/route.ts` | `route-file` | `export POST` |
| `site/app/api/admin/themes/route.ts` | `route-file` | `export GET` |
| `site/app/api/ai-advisor/route.ts` | `route-file` | `export POST` |
| `site/app/api/ai-assist/route.ts` | `route-file` | `export POST` |
| `site/app/api/ai/advisor/route.ts` | `route-file` | `export POST` |
| `site/app/api/audit/route.ts` | `route-file` | `export POST` |
| `site/app/api/business-stats/route.ts` | `route-file` | `export GET` |
| `site/app/api/categories/route.ts` | `route-file` | `export GET` |
| `site/app/api/configurator/smart-wizard/route.ts` | `route-file` | `export POST` |
| `site/app/api/csrf/route.ts` | `route-file` | `export GET` |
| `site/app/api/customer-queries/manage/route.ts` | `route-file` | `export GET` |
| `site/app/api/customer-queries/route.ts` | `route-file` | `export POST` |
| `site/app/api/dev-tools/lighthouse/route.ts` | `route-file` | `export GET` |
| `site/app/api/dev/auth-bypass-status/route.ts` | `route-file` | `export GET` |
| `site/app/api/filter/route.ts` | `route-file` | `export POST` |
| `site/app/api/generate-alt/route.ts` | `route-file` | `export POST` |
| `site/app/api/log-error/route.ts` | `route-file` | `export POST` |
| `site/app/api/nav-categories/route.ts` | `route-file` | `export GET` |
| `site/app/api/nav-search/route.ts` | `route-file` | `export GET` |
| `site/app/api/planner/ai-advisor/route.ts` | `route-file` | `export POST` |
| `site/app/api/planner/catalog/configurator/route.ts` | `route-file` | `export GET` |
| `site/app/api/planner/catalog/route.ts` | `route-file` | `export GET` |
| `site/app/api/planner/catalog/svg-blocks/route.ts` | `route-file` | `export GET` |
| `site/app/api/planner/generated-glb/route.ts` | `route-file` | `export POST` |
| `site/app/api/planner/sketch-to-plan/route.ts` | `route-file` | `export POST` |
| `site/app/api/plans/[id]/route.ts` | `route-file` | `export DELETE` |
| `site/app/api/plans/route.ts` | `route-file` | `export GET` |
| `site/app/api/products/filter/route.ts` | `route-file` | `export GET` |
| `site/app/api/products/route.ts` | `route-file` | `export GET` |
| `site/app/api/recommendations/route.ts` | `route-file` | `export POST` |
| `site/app/api/theme/active/route.ts` | `route-file` | `export GET` |
| `site/app/api/theme/manage/route.ts` | `route-file` | `export GET` |
| `site/app/api/tracking/route.ts` | `route-file` | `export POST` |
| `site/app/crm/clients/page.tsx` | `page-file` | `default export` |
| `site/app/crm/page.tsx` | `page-file` | `default export` |
| `site/app/crm/projects/[id]/page.tsx` | `page-file` | `default export` |
| `site/app/crm/projects/page.tsx` | `page-file` | `default export` |
| `site/app/crm/quotes/page.tsx` | `page-file` | `default export` |
| `site/app/offline/page.tsx` | `page-file` | `default export` |
| `site/app/ops/customer-queries/page.tsx` | `page-file` | `default export` |
| `site/app/ops/page.tsx` | `page-file` | `default export` |
| `site/app/planner/(marketing)/features/[slug]/page.tsx` | `page-file` | `default export` |
| `site/app/planner/(marketing)/features/page.tsx` | `page-file` | `default export` |
| `site/app/planner/(marketing)/help/page.tsx` | `page-file` | `default export` |
| `site/app/planner/(marketing)/page.tsx` | `page-file` | `default export` |
| `site/app/planner/(workspace)/canvas/page.tsx` | `page-file` | `default export` |
| `site/app/planner/(workspace)/guest/page.tsx` | `page-file` | `default export` |
| `site/app/planner/plannerProducts.ts` | `server-only-import` | `import "server-only"` |
| `site/features/` | `directory` | `admin` |
| `site/features/catalog/getProducts.ts` | `server-only-import` | `import "server-only"` |
| `site/features/crm/businessStats.ts` | `server-only-import` | `import "server-only"` |
| `site/features/planner/admin/svg-editor/svgArtifactCompiler.server.ts` | `server-only-import` | `import "server-only"` |
| `site/features/planner/admin/svg-editor/svgRevisionRepository.server.ts` | `server-only-import` | `import "server-only"` |
| `site/features/planner/admin/svg-editor/uploadAsset.ts` | `env-reader` | `match at index 284` |
| `site/features/planner/catalog/plannerManagedProducts.ts` | `server-only-import` | `import "server-only"` |
| `site/features/planner/landing/plannerFeaturePages.ts` | `typed-feature-metadata` | `PLANNER_FEATURE_PAGES[0]` |
| `site/features/planner/project/catalog/svg/descriptorCatalogBridge.server.ts` | `server-only-import` | `import "server-only"` |
| `site/features/planner/project/catalog/svg/svgCompiler.server.ts` | `server-only-import` | `import "server-only"` |
| `site/features/planner/project/catalog/svg/svgPreviewAssets.ts` | `env-reader` | `match at index 1410` |
| `site/features/planner/project/catalog/svg/svgServerSanitizer.ts` | `server-only-import` | `import "server-only"` |
| `site/features/planner/store/plannerManagedProducts.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/ai/providerChain.ts` | `env-reader` | `match at index 1499` |
| `site/lib/audit/teamAccess.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/auth/e2eAuthEnv.ts` | `env-reader` | `match at index 667` |
| `site/lib/catalog/catalogDrizzle.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/catalog/catalogFallbackResolver.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/catalog/catalogSnapshotR2.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/catalog/productStaticParams.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/catalog/sources.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/env.server.ts` | `env-reader` | `match at index 1363` |
| `site/lib/observability/reportClientError.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/paths/sitePackageRoot.server.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/productDataTables.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/productSlugResolver.ts` | `server-only-import` | `import "server-only"` |
| `site/lib/rateLimit.ts` | `env-reader` | `match at index 793` |
| `site/lib/storage/r2Catalog.ts` | `env-reader` | `match at index 1117` |
| `site/lib/theme/activeThemeId.ts` | `server-only-import` | `import "server-only"` |
| `site/package.json` | `package-manifest` | `dependencies.@aws-sdk/client-s3` |
| `site/platform/drizzle/adminDb.ts` | `server-only-import` | `import "server-only"` |
| `site/platform/drizzle/databaseUrls.ts` | `env-reader` | `match at index 205` |
| `site/platform/drizzle/migrations/0000_daffy_longshot.sql` | `migration` | `file` |
| `site/platform/drizzle/migrations/0001_add_missing_indexes.sql` | `migration` | `file` |
| `site/platform/drizzle/productsDb.ts` | `server-only-import` | `import "server-only"` |
| `site/platform/drizzle/schema/catalog.ts` | `drizzle-schema` | `pgTable('business_stats_current')` |
| `site/platform/drizzle/schema/planner.ts` | `drizzle-schema` | `pgTable('audit_events')` |
| `site/platform/supabase/adminServer.ts` | `env-reader` | `match at index 251` |
| `site/platform/supabase/auth-admin.ts` | `env-reader` | `match at index 875` |
| `site/platform/supabase/env.ts` | `env-reader` | `match at index 420` |
| `site/platform/supabase/supabaseAdmin.ts` | `env-reader` | `match at index 627` |
| `site/scripts/audit_slug_id_integrity.ts` | `env-reader` | `match at index 1642` |
| `site/scripts/audit_supabase_catalog.ts` | `env-reader` | `match at index 2837` |
| `site/scripts/audit-product-quality.ts` | `env-reader` | `match at index 1035` |
| `site/scripts/auditCdnAssetFailures.ts` | `env-reader` | `match at index 734` |
| `site/scripts/auditUnresolvedCdnPaths.ts` | `env-reader` | `match at index 857` |
| `site/scripts/backfill_canonical_catalog_metadata.ts` | `env-reader` | `match at index 785` |
| `site/scripts/backfill_missing_product_images.ts` | `env-reader` | `match at index 578` |
| `site/scripts/backup_supabase.ts` | `env-reader` | `match at index 5154` |
| `site/scripts/count-r2-objects.mjs` | `env-reader` | `match at index 548` |
| `site/scripts/db_advisors_admin.ts` | `env-reader` | `match at index 273` |
| `site/scripts/db_advisors.ts` | `env-reader` | `match at index 8822` |
| `site/scripts/db_apply_migrations.ts` | `env-reader` | `match at index 1495` |
| `site/scripts/db_backup_dropped_tables.ts` | `env-reader` | `match at index 1159` |
| `site/scripts/db_backup_pre_split.ts` | `env-reader` | `match at index 3151` |
| `site/scripts/db_gen_admin_types.ts` | `env-reader` | `match at index 2038` |
| `site/scripts/db_sync_drizzle_schema.ts` | `env-reader` | `match at index 375` |
| `site/scripts/db_test_connection.ts` | `env-reader` | `match at index 1967` |
| `site/scripts/downloadCdnAssets.ts` | `env-reader` | `match at index 409` |
| `site/scripts/fix_and_reseed.ts` | `env-reader` | `match at index 97` |
| `site/scripts/fix-chairs-supabase-paths.ts` | `env-reader` | `match at index 432` |
| `site/scripts/list-r2-buckets.mjs` | `env-reader` | `match at index 434` |
| `site/scripts/loadEnvLocal.cjs` | `env-reader` | `match at index 613` |
| `site/scripts/migrate-chairs-to-catalog.ts` | `env-reader` | `match at index 705` |
| `site/scripts/organize-catalog-images.ts` | `env-reader` | `match at index 11655` |
| `site/scripts/seed_configurator_catalog.ts` | `env-reader` | `match at index 815` |
| `site/scripts/seed_direct.ts` | `env-reader` | `match at index 153` |
| `site/scripts/seed_planner_managed_catalog.ts` | `env-reader` | `match at index 602` |
| `site/scripts/seed.ts` | `env-reader` | `match at index 532` |
| `site/scripts/sync-missing-alt-text.ts` | `env-reader` | `match at index 1872` |
| `site/scripts/test-r2-upload.ts` | `env-reader` | `match at index 744` |
| `site/scripts/translate-deferred-marketing-flat.mjs` | `env-reader` | `match at index 2447` |
| `site/scripts/translate-deferred-marketing.mjs` | `env-reader` | `match at index 2802` |
| `site/tech-stack-generator/package.json` | `package-manifest` | `dependencies.@phosphor-icons/react` |
| `site/tech-stack-generator/src/pages/Architecture.tsx` | `env-reader` | `match at index 10476` |
| `site/tech-stack-generator/src/pages/Security.tsx` | `env-reader` | `match at index 4836` |
| `site/tests/e2e/site-navigation-smoke.spec.ts` | `env-test` | `match at index 81` |
| `site/tests/integration/planner-store-plannerPersistence.test.ts` | `env-test` | `match at index 2137` |
| `site/tests/unit/app/admin/themes/page.test.tsx` | `env-test` | `match at index 281` |
| `site/tests/unit/app/admin/themes/ThemeEditor.test.tsx` | `env-test` | `match at index 305` |
| `site/tests/unit/app/api/admin/_lib/server.test.ts` | `env-test` | `match at index 1721` |
| `site/tests/unit/lib/env.server.test.ts` | `env-test` | `match at index 575` |
| `site/tests/unit/lib/rateLimit.test.ts` | `env-test` | `match at index 787` |
| `site/tests/unit/lib/supabase/env.test.ts` | `env-test` | `match at index 606` |
| `site/tests/unit/platform/supabase/adminServer.test.ts` | `env-test` | `match at index 1433` |
| `site/tests/unit/shared-providerChain.test.ts` | `env-test` | `match at index 346` |
| `site/tsconfig.json` | `tsconfig-path` | `compilerOptions.paths.@/app/*` |
