# Workflows

| Fact ID | Category | Label | Value | Source |
| --- | --- | --- | --- | --- |
| `workflows.package.dev.value` | dev-loop | dev | pnpm --filter oando-site dev | `package.json` `scripts.dev` |
| `workflows.package.docs:check:tech-stack.value` | dev-loop | docs:check:tech-stack | node tech-stack-generator/scripts/check.mjs | `package.json` `scripts.docs:check:tech-stack` |
| `workflows.package.docs:sync:tech-stack.value` | dev-loop | docs:sync:tech-stack | node tech-stack-generator/scripts/generate.mjs && node tech-stack-generator/scripts/emit-renderer-data.mjs | `package.json` `scripts.docs:sync:tech-stack` |
| `workflows.package.lint:secrets.value` | dev-loop | lint:secrets | secretlint "**/*.{cjs,css,csv,html,js,json,jsx,md,mjs,ps1,py,sql,toml,ts,tsx,txt,yaml,yml}" ".env*" ".gitattributes" ".gitignore" ".npmrc" ".vercelignore" | `package.json` `scripts.lint:secrets` |
| `workflows.package.release:gate.value` | dev-loop | release:gate | turbo run release:gate | `package.json` `scripts.release:gate` |
| `workflows.package.vercel:prod.value` | dev-loop | vercel:prod | pnpm run release:gate && vercel --prod --yes | `package.json` `scripts.vercel:prod` |
| `workflows.site_package.build.value` | dev-loop | build | next build && node scripts/prepare-standalone.cjs | `site/package.json` `scripts.build` |
| `workflows.site_package.dev.value` | dev-loop | dev | next dev --webpack | `site/package.json` `scripts.dev` |
| `workflows.site_package.dev:turbo.value` | dev-loop | dev:turbo | next dev --turbo | `site/package.json` `scripts.dev:turbo` |
| `workflows.site_package.docs:sync.value` | dev-loop | docs:sync | node scripts/generate-docs.mjs | `site/package.json` `scripts.docs:sync` |
| `workflows.site_package.docs:sync:all.value` | dev-loop | docs:sync:all | node scripts/generate-docs.mjs --all | `site/package.json` `scripts.docs:sync:all` |
| `workflows.site_package.lint.value` | dev-loop | lint | eslint -c config/build/eslint.config.mjs app components features lib tests --max-warnings=0 | `site/package.json` `scripts.lint` |
| `workflows.site_package.release:gate.value` | dev-loop | release:gate | node ../scripts/check-repo-layout.mjs && npm run test:audit:hollow && npm run test:audit:gate-skips && npm run test:audit:eslint-disable && npm run lint && npm run typecheck && npm run test && npm run build && npm run test:a11y && npm run test:planner-catalog && npm run test:coverage && npm run test:coverage:site | `site/package.json` `scripts.release:gate` |
| `workflows.site_package.test.value` | dev-loop | test | vitest run | `site/package.json` `scripts.test` |
| `workflows.site_package.typecheck.value` | dev-loop | typecheck | tsc -p tsconfig.json --noEmit | `site/package.json` `scripts.typecheck` |

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
| `tech-stack-generator/package.json` | `package-manifest` | `dependencies.@phosphor-icons/react` |
