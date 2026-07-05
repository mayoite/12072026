# Original User Request

## Initial Request — 2026-06-26T15:01:42Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Act as a Lead Software Engineer and QA Architect. Write comprehensive, production-ready tests for the `site/` directory to achieve 95% coverage. Monitor the progress using 4 agents. The tests must follow the existing patterns found in `site/tests/` and be executed using `pnpm` from the repository root.

Working directory: d:\OOFPLWeb
Integrity mode: benchmark

## Requirements

### R1. Comprehensive Test Coverage & Execution
Ensure a minimum of 95% test coverage for the `site/` directory across three tiers: Happy Paths, Edge Cases, and Error Paths. The tests must execute successfully via `pnpm` from the root directory. After tests are written, run the appropriate test command to generate and output the coverage report.

### R2. Zero Hallucination & Exact Data Match
Use only actual functions, variables, and parameters defined in the target files. Use exact data types and property keys found in the code logic for mock payloads and expected test outputs. Do not invent speculative utility functions, environment variables, or endpoints.

### R3. Explicit Dependency Mocking
Generate explicit mocks or spies for all imported third-party libraries and internal database/API clients based on the target files' imports. Do not let real network requests or database writes leak. Use the existing mocking patterns defined in `site/tests/`.

### R4. 4-Agent Team Execution
Execute and monitor the task using 4 subagents to distribute the workload across the `site/` directory and verify the 95% coverage requirement is met with 100% accuracy and no line skipping.

## Verification Resources
- Existing tests in `site/tests/` (to serve as architectural reference)
- Coverage report generation via `pnpm` commands defined in `TESTING.md`

## Acceptance Criteria

### Execution & Coverage
- [ ] Tests run successfully using the root `pnpm` command without syntax or runtime errors.
- [ ] The generated coverage report explicitly shows >= 95% coverage for the `site/` directory with no line skipping.

### Integrity & Isolation
- [ ] All external dependencies and API calls are explicitly mocked; no live network or database requests leak.
- [ ] Mock structures perfectly mirror the exact shapes expected by the target source code.

## Follow-up — 2026-06-26T21:23:28+05:30

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Write missing tests for explicitly provided uncovered lines

Act as a Lead Software Engineer and QA Architect. 
You must achieve 95% test coverage **ONLY** for the files in the Uncovered Lines List below. Do NOT write tests for any other files in the repository.

Working directory: d:\OOFPLWeb
Integrity mode: benchmark

## Requirements

### R1. Targeted Coverage Fix
Distribute the list of 502 uncovered files among 7 worker agents. For each file in the list, write Vitest tests to explicitly cover the skipped lines.

### R2. Zero Hallucination & Exact Data Match
Use only actual functions, variables, and parameters defined in the target files. Explicitly mock all third-party dependencies, API routes, and database connections.

### R3. Strict Execution
Do NOT write tests for any file that is NOT explicitly on this list.

## Uncovered Lines List (The Target Workload)
app/(site)/error.tsx
app/(site)/loading.tsx
app/(site)/not-found.tsx
app/(site)/opengraph-image.tsx
app/(site)/robots.ts
app/(site)/sitemap.ts
app/(site)/twitter-image.tsx
app/(site)/about/page.tsx
app/(site)/access/AccessForm.tsx
app/(site)/access/page.tsx
app/(site)/backend-architecture/page.tsx
app/(site)/brochure/page.tsx
app/(site)/career/page.tsx
app/(site)/catalog/page.tsx
app/(site)/choose-product/page.tsx
app/(site)/compare/page.tsx
app/(site)/contact/page.tsx
app/(site)/dashboard/DashboardClient.tsx
app/(site)/dashboard/page.tsx
app/(site)/download-brochure/page.tsx
app/(site)/downloads/page.tsx
app/(site)/gallery/page.tsx
app/(site)/imprint/page.tsx
app/(site)/login/LoginForm.tsx
app/(site)/login/page.tsx
app/(site)/news/page.tsx
app/(site)/planning/page.tsx
app/(site)/portal/page.tsx
app/(site)/portal/[id]/page.tsx
app/(site)/portal/guest/page.tsx
app/(site)/portal/guest/view/[id]/page.tsx
app/(site)/portfolio/page.tsx
app/(site)/privacy/page.tsx
app/(site)/products/error.tsx
app/(site)/products/layout.tsx
app/(site)/products/loading.tsx
app/(site)/products/page.tsx
app/(site)/products/[category]/CategoryPageView.tsx
app/(site)/products/[category]/FilterGrid.components.tsx
app/(site)/products/[category]/FilterGrid.helpers.ts
app/(site)/products/[category]/FilterGrid.tsx
app/(site)/products/[category]/FilterGridInner.tsx
app/(site)/products/[category]/loading.tsx
app/(site)/products/[category]/page.tsx
app/(site)/products/[category]/[product]/page.tsx
app/(site)/products/[category]/[product]/ProductViewer.tsx
app/(site)/products/category/[slug]/page.tsx
app/(site)/projects/page.tsx
app/(site)/providers/LenisProvider.tsx
app/(site)/providers/QueryProvider.tsx
app/(site)/quote-cart/layout.tsx
app/(site)/quote-cart/page.tsx
app/(site)/refund-and-return-policy/page.tsx
app/(site)/repo-store/page.tsx
app/(site)/service/page.tsx
app/(site)/showrooms/page.tsx
app/(site)/social/page.tsx
app/(site)/solutions/page.tsx
app/(site)/solutions/[category]/page.tsx
app/(site)/support-ivr/page.tsx
app/(site)/sustainability/page.tsx
app/(site)/templates/page.tsx
app/(site)/terms/page.tsx
app/(site)/tracking/page.tsx
app/(site)/trusted-by/page.tsx
app/admin/layout.tsx
app/admin/page.tsx
app/admin/analytics/page.tsx
app/admin/buddy-catalog/page.tsx
app/admin/catalog/page.tsx
app/admin/customer-queries/page.tsx
app/admin/features/page.tsx
app/admin/inventory/page.tsx
app/admin/planner-catalog/page.tsx
app/admin/plans/page.tsx
app/admin/plans/[id]/page.tsx
app/admin/settings/page.tsx
app/admin/themes/page.tsx
app/admin/themes/ThemeEditor.tsx
app/admin/workspace-catalog/page.tsx
app/api/_lib/public.ts
app/api/admin/_lib/server.ts
app/api/admin/analytics/route.ts
app/api/admin/buddy-catalog/route.ts
app/api/admin/buddy-catalog/[id]/route.ts
app/api/admin/catalog/route.ts
app/api/admin/catalog/[id]/route.ts
app/api/admin/catalogs/[type]/route.ts
app/api/admin/catalogs/[type]/[id]/route.ts
app/api/admin/configurator-catalog/[id]/route.ts
app/api/admin/features/route.ts
app/api/admin/planner-catalog/route.ts
app/api/admin/plans/route.ts
app/api/admin/plans/[id]/route.ts
app/api/admin/themes/publish/route.ts
app/api/ai-advisor/route.ts
app/api/ai-assist/route.ts
app/api/ai/advisor/route.ts
app/api/audit/route.ts
app/api/business-stats/route.ts
app/api/categories/route.ts
app/api/configurator/smart-wizard/route.ts
app/api/csrf/route.ts
app/api/customer-queries/route.ts
app/api/customer-queries/manage/route.ts
app/api/dev-tools/lighthouse/route.ts
app/api/filter/route.ts
app/api/generate-alt/route.ts
app/api/log-error/route.ts
app/api/nav-categories/route.ts
app/api/nav-search/route.ts
app/api/planner/ai-advisor/route.ts
app/api/planner/catalog/route.ts
app/api/planner/sketch-to-plan/route.ts
app/api/plans/route.ts
app/api/plans/[id]/route.ts
app/api/products/route.ts
app/api/products/filter/route.ts
app/api/recommendations/route.ts
app/api/theme/active/route.ts
app/api/theme/manage/route.ts
app/api/tracking/route.ts
app/crm/layout.tsx
app/crm/page.tsx
app/crm/clients/page.tsx
app/crm/projects/page.tsx
app/crm/projects/[id]/page.tsx
app/crm/quotes/page.tsx
app/offline/layout.tsx
app/offline/page.tsx
app/offline/ReloadButton.tsx
app/ops/layout.tsx
app/ops/page.tsx
app/ops/customer-queries/CustomerQueriesOpsClient.tsx
app/ops/customer-queries/page.tsx
app/planner/layout.tsx
app/planner/plannerProducts.ts
app/planner/(marketing)/page.tsx
app/planner/(marketing)/features/page.tsx
app/planner/(marketing)/features/[slug]/page.tsx
app/planner/(marketing)/help/page.tsx
app/planner/(workspace)/layout.tsx
app/planner/(workspace)/guest/page.tsx
components/ClientBadge.tsx
components/ProductGallery.tsx
components/Reviews.tsx
components/SafeImage.tsx
components/ThreeViewer.tsx
components/analytics/KpiIntegrityMonitor.tsx
components/backend-architecture/BackendArchitecturePageView.tsx
components/career/CareerPageView.tsx
components/career/JobCard.tsx
components/contact/ContactPageView.tsx
components/contact/CustomerQueryForm.tsx
components/home/BrandStatement.tsx
components/home/CategoryGrid.tsx
components/home/CategoryImage.tsx
components/home/ClientQuote.tsx
components/home/CollaborationSection.tsx
components/home/Collections.tsx
components/home/CollectionsSectionHeading.tsx
components/home/FeaturedCarousel.tsx
components/home/Hero.tsx
components/home/HomeClosingCta.tsx
components/home/HomeFAQ.tsx
components/home/HomepageHero.tsx
components/home/HomeTrustStrip.tsx
components/home/InteractiveTools.tsx
components/home/KpiCounter.tsx
components/home/PartnershipBanner.tsx
components/home/ProcessSection.tsx
components/home/Projects.tsx
components/home/ShowcaseCarousel.tsx
components/home/Teaser.tsx
components/home/TrustStrip.tsx
components/home/WhyChooseUs.tsx
components/products/CompareColumnActions.tsx
components/products/CompareDock.tsx
components/repo-store/RepoStorePageView.tsx
components/security/CsrfBootstrap.tsx
components/shared/ContactTeaser.tsx
components/shared/Newsletter.tsx
components/shared/Reveal.tsx
components/shared/RouteActionCard.tsx
components/shared/RouteCtaBand.tsx
components/shared/SectionIntro.tsx
components/shared/SectionReveal.tsx
components/site/CookieConsentBar.tsx
components/site/Footer.tsx
components/site/FooterLogoMarquee.tsx
components/site/Header.tsx
components/site/LanguageSwitcher.tsx
components/site/MobileNavDrawer.tsx
components/site/RouteChrome.tsx
components/site/SiteErrorBoundary.tsx
components/support/SupportIvrPageView.tsx
components/support/VisualIVR.tsx
components/ui/CookieConsent.tsx
components/ui/HotspotImage.tsx
components/ui/Input.tsx
components/ui/Label.tsx
components/ui/Logo.tsx
components/ui/Masonry.tsx
components/ui/Modal.tsx
components/ui/TrackedLink.tsx
components/ui/WhatsAppCTA.tsx
config/database/types/database.types.ts
features/admin/ui/AdminDashboard.tsx
features/admin/ui/AdminShell.tsx
features/catalog/categories.ts
features/catalog/imageMetadata.ts
features/crm/businessStats.ts
features/crm/ClientsView.tsx
features/crm/contactSurfaces.ts
features/crm/crmUi.ts
features/crm/ProjectDetailView.tsx
features/crm/ProjectsView.tsx
features/crm/QuotesView.tsx
features/crm/stores/crmStore.ts
features/ops/CustomerQueriesOpsPageView.tsx
features/planner/3d/Planner3DViewer.tsx
features/planner/3d/types.ts
features/planner/3d/viewerMaterials.ts
features/planner/admin/AdminAnalyticsPageView.tsx
features/planner/admin/adminCatalogClient.ts
features/planner/admin/AdminCatalogListView.tsx
features/planner/admin/AdminCatalogManager.tsx
features/planner/admin/AdminCatalogPageView.tsx
features/planner/admin/AdminDashboardPageView.tsx
features/planner/admin/AdminFeatureFlagsPageView.tsx
features/planner/admin/AdminFormFields.tsx
features/planner/admin/AdminInventoryPageView.tsx
features/planner/admin/AdminLayoutShell.tsx
features/planner/admin/adminNav.ts
features/planner/admin/AdminPlanDetailPageView.tsx
features/planner/admin/AdminPlansPageView.tsx
features/planner/admin/AdminSettingsPageView.tsx
features/planner/admin/AdminWorkspaceCatalogPageView.tsx
features/planner/admin/BuddyCatalogPageView.tsx
features/planner/admin/ConfiguratorCatalogPageView.tsx
features/planner/ai/AiAdvisorChat.tsx
features/planner/ai/AiAdvisorChatPane.tsx
features/planner/ai/aiAdvisorConfig.ts
features/planner/ai/AIAssistDrawer.tsx
features/planner/ai/aiStatus.ts
features/planner/ai/applySuggestedLayout.ts
features/planner/ai/catalogMatch.ts
features/planner/ai/extractCanvasPlacements.ts
features/planner/ai/layoutPreviewBounds.ts
features/planner/ai/LayoutPreviewSvg.tsx
features/planner/ai/prompts.ts
features/planner/ai/sketchToPlan.ts
features/planner/ai/spaceSuggest.ts
features/planner/canvas-fabric/FabricCanvasContextMenu.tsx
features/planner/canvas-fabric/FabricCanvasSubToolbar.tsx
features/planner/canvas-fabric/FabricCanvasWorkspace.tsx
features/planner/canvas-fabric/FabricDrawToolsBar.tsx
features/planner/canvas-fabric/FabricLibraryPanel.tsx
features/planner/canvas-fabric/fabricSceneUtils.ts
features/planner/canvas-fabric/FloorplanCanvas.tsx
features/planner/canvas-fabric/RoomPresetsModal.tsx
features/planner/canvas-fabric/components/ChairsLayoutDialog.tsx
features/planner/canvas-fabric/components/PreviewFurniture.tsx
features/planner/canvas-fabric/components/ZoomControl.tsx
features/planner/canvas-fabric/context/FloorplanContext.tsx
features/planner/canvas-fabric/hooks/fabricDrawTools.ts
features/planner/canvas-fabric/hooks/floorplanCanvas.ts
features/planner/canvas-fabric/hooks/floorplanCanvasTypes.ts
features/planner/canvas-fabric/lib/helpers.ts
features/planner/catalog/catalogBlockBridge.ts
features/planner/catalog/catalogHierarchy.ts
features/planner/catalog/CatalogPanel.tsx
features/planner/catalog/catalogStore.ts
features/planner/catalog/furnitureBlocks2d.ts
features/planner/catalog/managedProductCatalogBridge.ts
features/planner/catalog/placementCatalogDefaults.ts
features/planner/catalog/placementCatalogResolver.ts
features/planner/catalog/plannerCatalogApi.ts
features/planner/catalog/plannerManagedProducts.client.ts
features/planner/catalog/renderBlockPrims.tsx
features/planner/catalog/usePlannerCatalogHydration.ts
features/planner/catalog/ingest/csvCatalogIngest.ts
features/planner/components/PlannerBodyTheme.tsx
features/planner/components/PlannerMarketingChrome.tsx
features/planner/components/PlannerThemeToggle.tsx
features/planner/components/Providers.tsx
features/planner/components/WorkspaceThemeProvider.tsx
features/planner/document/plannerDocumentBridge.ts
features/planner/editor/editorSelectionStatus.ts
features/planner/editor/exportActions.ts
features/planner/editor/ExportModal.tsx
features/planner/editor/layerManagerEntries.ts
features/planner/editor/LayerManagerPanel.tsx
features/planner/editor/layerManagerUiState.ts
features/planner/editor/LayerVisibilityPanel.tsx
features/planner/editor/OnboardingTooltips.tsx
features/planner/editor/planMetrics.ts
features/planner/editor/plannerGrid.ts
features/planner/editor/plannerKeyboardShortcuts.ts
features/planner/editor/PlannerLeftPanel.tsx
features/planner/editor/plannerShapeFactories.ts
features/planner/editor/PlannerStatusBar.tsx
features/planner/editor/plannerStep.ts
features/planner/editor/PlannerStepBar.tsx
features/planner/editor/plannerStepBindings.ts
features/planner/editor/PlannerSubTopBar.tsx
features/planner/editor/plannerToolFabricBridge.ts
features/planner/editor/PlannerToolRail.tsx
features/planner/editor/plannerToolVisibility.ts
features/planner/editor/PlannerTopBar.tsx
features/planner/editor/PlannerWorkflowPanel.tsx
features/planner/editor/PlannerWorkspace.tsx
features/planner/editor/plannerWorkspaceHooks.ts
features/planner/editor/PlannerWorkspaceLayout.tsx
features/planner/editor/plannerWorkspacePreferences.ts
features/planner/editor/shapeInspectorBridge.ts
features/planner/editor/usePlannerCatalogDrop.ts
features/planner/editor/usePlannerDocument.ts
features/planner/editor/usePlannerPanels.ts
features/planner/editor/usePlannerSessionHandlers.ts
features/planner/editor/usePlannerViewMode.ts
features/planner/editor/chrome/plannerChromeLayout.ts
features/planner/editor/chrome/plannerChromeStorage.ts
features/planner/editor/chrome/PlannerChromeWidget.tsx
features/planner/editor/chrome/widgets/AccessChrome.tsx
features/planner/editor/chrome/widgets/StepsChrome.tsx
features/planner/editor/chrome/widgets/ToolsChrome.tsx
features/planner/editor/inspector/PropertiesInspector.tsx
features/planner/editor/templates/TemplatePickerModal.tsx
features/planner/help/helpSections.ts
features/planner/help/PlannerHelpPage.tsx
features/planner/hooks/useAssetLoader.ts
features/planner/hooks/usePlannerFabricAutosave.ts
features/planner/hooks/usePlannerSession.ts
features/planner/landing/PlannerBreadcrumbs.tsx
features/planner/landing/PlannerFeatureDemo.tsx
features/planner/landing/plannerFeaturePages.ts
features/planner/landing/PlannerFeaturePageView.tsx
features/planner/landing/PlannerFeaturesHubPage.tsx
features/planner/landing/PlannerFloorplanHero.tsx
features/planner/landing/PlannerHeroDemo.tsx
features/planner/landing/plannerLandingData.ts
features/planner/landing/plannerLandingIcons.tsx
features/planner/landing/PlannerLandingPage.tsx
features/planner/landing/PlannerLayoutGraphic.tsx
features/planner/landing/PlannerSuite.tsx
features/planner/landing/PlannerToolsShowcase.tsx
features/planner/lib/aiService.ts
features/planner/lib/canvasBounds.ts
features/planner/lib/compliance.ts
features/planner/lib/editorTools.ts
features/planner/lib/fabricDocumentBridge.ts
features/planner/lib/featureFlags.ts
features/planner/lib/floorPlanImageImport.ts
features/planner/lib/measurements.ts
features/planner/lib/plannerSvgExportColors.ts
features/planner/lib/projectIndex.ts
features/planner/lib/snapManager.ts
features/planner/lib/vectorPdfExport.ts
features/planner/lib/versioning.ts
features/planner/lib/geometry/intersections.ts
features/planner/lib/geometry/openingCollision.ts
features/planner/lib/geometry/polygon.ts
features/planner/lib/geometry/wallGraph.ts
features/planner/lib/geometry/wallOpenings.ts
features/planner/model/planner3dScene.ts
features/planner/model/plannerDocument.ts
features/planner/model/plannerDocumentLogging.ts
features/planner/model/plannerJsonSafe.ts
features/planner/model/plannerManagedProduct.ts
features/planner/onboarding/OnboardingCoach.tsx
features/planner/onboarding/projectSetup.ts
features/planner/onboarding/ProjectSetupGate.tsx
features/planner/onboarding/ProjectSetupStep.tsx
features/planner/onboarding/StartingPointStep.tsx
features/planner/persistence/cloudPlanHydration.ts
features/planner/persistence/persistence.ts
features/planner/persistence/plannerCloudApi.ts
features/planner/persistence/plannerDraft.ts
features/planner/persistence/plannerSaves.ts
features/planner/portal/PortalPageView.tsx
features/planner/portal/PortalPlanPageView.tsx
features/planner/shared/boq/quoteCartBridge.ts
features/planner/shared/catalog/catalogAdapter.ts
features/planner/shared/catalog/catalogBridge.ts
features/planner/shared/catalog/useCatalogBrowser.ts
features/planner/shared/components/SplitViewLayout.tsx
features/planner/shared/components/ViewToggle.tsx
features/planner/shared/components/WorkspaceShell.tsx
features/planner/shared/components/editor/Toolbar.tsx
features/planner/shared/export/brandedPdfExport.ts
features/planner/shared/export/buddyBoqAdapter.ts
features/planner/shared/export/pdfExport.ts
features/planner/shared/hooks/useThemeVariables.ts
features/planner/shared/types/legacyEditorStub.ts
features/planner/store/favoritesStore.ts
features/planner/store/index.ts
features/planner/store/offlineStorage.ts
features/planner/store/plannerCatalogCore.ts
features/planner/store/plannerDebouncedUndo.ts
features/planner/store/plannerFurnitureOrdering.ts
features/planner/store/plannerGeometryStore.ts
features/planner/store/plannerManagedProducts.client.ts
features/planner/store/plannerManagedProducts.ts
features/planner/store/plannerManagedProductsShared.ts
features/planner/store/plannerPersistence.ts
features/planner/store/plannerProjectStorage.ts
features/planner/store/plannerSaves.ts
features/planner/store/plannerSelectionUtils.ts
features/planner/store/plannerStore.ts
features/planner/store/plannerWallEditUtils.ts
features/planner/store/syncQueueProcessor.ts
features/planner/store/unifiedCatalog.ts
features/planner/templates/index.ts
features/planner/templates/layoutTemplates.ts
features/planner/ui/CatalogPanel.tsx
features/planner/ui/InspectorPanel.tsx
features/planner/ui/LayersPanel.tsx
features/planner/ui/MobileDrawerSheet.tsx
features/planner/ui/PlannerCanvasEnhancements.tsx
features/planner/ui/PlannerDesktopPanels.tsx
features/planner/ui/PlannerMobilePanels.tsx
features/planner/ui/PlannerSaveIndicator.tsx
features/planner/ui/PlannerSessionDialog.tsx
features/planner/ui/PlannerSkeleton.tsx
features/planner/ui/PlannerWorkspaceRoute.tsx
features/planner/ui/UnifiedPlannerPage.tsx
features/planner/ui/WorkspacePanel.tsx
features/shared/auth/lib/AuthProvider.tsx
features/shared/dashboard/DashboardClient.tsx
features/site-assistant/AdvancedBot.tsx
features/site-assistant/DynamicBotWrapper.tsx
features/site-assistant/UnifiedAssistant.tsx
lib/assetPaths.ts
lib/consent.ts
lib/displayText.ts
lib/env.server.ts
lib/errorLogger.ts
lib/getProducts.ts
lib/gradient.ts
lib/kpiFormat.ts
lib/navigation.ts
lib/productDataTables.ts
lib/productSlugResolver.ts
lib/rateLimit.ts
lib/ai/AiAdvisorPanel.tsx
lib/ai/providerChain.ts
lib/ai/useAiAdvisor.ts
lib/analytics/kpiEvents.ts
lib/analytics/kpiIntegrity.ts
lib/analytics/siteEvents.ts
lib/api/ApiError.ts
lib/api/apiResponse.ts
lib/api/browserApi.ts
lib/api/catalogAdminHandlers.ts
lib/api/routeObservability.ts
lib/api/schemas.ts
lib/api/withAuth.ts
lib/audit/auditRepository.ts
lib/auth/adminSession.ts
lib/auth/customerSafeAuthError.ts
lib/auth/e2eAuthEnv.ts
lib/auth/plannerRedirect.ts
lib/auth/plannerSession.ts
lib/auth/session.ts
lib/auth/supabaseServerActions.ts
lib/catalog/blocks2d.ts
lib/catalog/catalogTree.ts
lib/catalog/fallback.ts
lib/catalog/productStaticParams.ts
lib/catalog/resolveBlockColors.ts
lib/catalog/sources.ts
lib/helpers/images.ts
lib/helpers/motion.ts
lib/helpers/seo.ts
lib/hooks/useInViewOnce.ts
lib/hooks/useOnlineStatus.ts
lib/hooks/useRecommendations.ts
lib/hooks/useScrollAnimation.ts
lib/i18n/navigation.ts
lib/security/csrf.ts
lib/site-data/clientLogos.ts
lib/site-data/contact.ts
lib/site-data/navigation.ts
lib/site-data/routeMetadata.ts
lib/store/productCompare.ts
lib/store/quoteCart.ts
lib/supabase/client.ts
lib/supabase/env.ts
lib/supabase/server.ts
lib/theme/catalogTokenKeys.ts
lib/theme/presets.ts
lib/theme/ThemeProvider.tsx
lib/theme/useThemeAdmin.ts
lib/theme/verifyThemeRuntime.ts
lib/tracking/anonymousUserId.ts
lib/ui/KeyboardShortcuts.tsx
lib/ui/loadModelViewer.ts
lib/ui/selfHostedAssetUrls.ts
lib/ui/SmartLayoutEngine.tsx
lib/ui/Tooltip.tsx
lib/ui/UndoToast.tsx

## Acceptance Criteria

### Testing & Validation
- [ ] Tests run successfully using `pnpm` from the root without syntax or runtime errors.
- [ ] The generated coverage report explicitly shows that the skipped lines in the target files are now covered.
- [ ] No extraneous tests for non-listed files have been generated.
