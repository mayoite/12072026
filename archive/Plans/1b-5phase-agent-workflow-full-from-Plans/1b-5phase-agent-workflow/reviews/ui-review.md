# UI/UX Review — Planner Work vs Governance (2026-07-04)

**Reviewer role:** UI  
**Review date:** 2026-07-04  
**Branch context:** orchestrator/hotfixes-2026-07-04  
**Mandatory inputs fully read (multiple read_file passes):**  
- `plans/2026-07-04/benchmark.md` (full, 160 lines)  
- `plannnerplan/2026-07-05_implementation-decisions.md` (full, 150 lines)  
- `plannnerplan/2026-07-05_quality-gates.md` (full, 123 lines)  

**Additional inspected (read_file multiple times + grep + list_dir):**  
- `plannnerplan/FAILURESPLAN.md` (full), `plans/2026-07-04/HANDOVER.md` (full; plannnerplan/HANDOVER.md is redirect stub per content), `plans/2026-07-04/critique.md`, `plannnerplan/phases/` (04,05,06,10 and index), `plannnerplan/benchmarks/2026-07-05_review-workflow.md`  
- New test: `site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts` (full ~1022 lines)  
- UI impl: `site/features/planner/open3d/editor/{WorkspaceShell.tsx, PanelContainer.tsx, TopBar.tsx, OOPlannerWorkspace.tsx, useDockingSystem.ts, InventoryPanel.tsx, PropertiesPanel.tsx, workspace.module.css, inventory.module.css}`, `site/features/planner/open3d/catalog/{useOpen3dWorkspaceCatalog.ts, inventory/inventoryIndex.ts, inventory/inventoryState.ts, svg/svgBlockDescriptorLoader.ts, svg/svgTypes.ts}`  
- Admin/portal: `site/features/planner/admin/svg-editor/{AdminSvgEditorEditView.tsx, AdminSvgEditorListView.tsx, puckBlockRegistry.tsx}`, `site/features/planner/portal/{PortalPageView.tsx, PortalPlanPageView.tsx}`, `site/app/{planner/open3d/{page,layout}.tsx, (site)/portal/..., admin/}` (no page.tsx under admin/svg-editor/*)  
- CSS/tokens: `site/app/css/core/tokens/theme.css`, `site/app/css/core/planner/{planner-responsive.css, bundles/open3d-workspace.css, planner-shell.css}`, `site/features/planner/open3d/editor/workspace.module.css` (full relevant sections)  
- Cross-refs: `Failures.md`, `testing-handbook.md`, `AGENTS.md`, `Readme.md`, `docs/Lockedfiles/ReadmeLocked.md`, `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md`, `results/reviews/critic-review.md`, `results/reviews/qa-review.md`  
- Structure: `site/features/planner/open3d/` (full), `site/app/admin/svg-editor/[id]/` (absent page files), live routes per IMPLEMENTATION-DECISIONS §"Live routes"  
**Method:** Read-only per AGENTS.md (re-read AGENTS/ReadmeLocked/Readme/START first; no terminal/run commands, no edits except the mandated write of this file). All claims are falsifiable via FS reads/greps. Citations use exact § and approx line from the 3 mandatory docs + live file:line.

## Summary

The UI/UX review finds partial alignment with `plans/2026-07-04/benchmark.md` §1 (5-product: Planner5D catalogue-first + 2D-3D, Floorplanner properties, AutoCAD command, Figma Minimize UI, Sketchfab search/pagination) and §3 RECs, plus `plannnerplan/2026-07-05_implementation-decisions.md` "UI/UX Standards (Intensified)" §113-130 (Minimize UI & Panel Grammar, Inventory & Search, Catalogue-first, small-screen wiring) and `plannnerplan/2026-07-05_quality-gates.md` Global Standard Gate / a11y / perf budgets. The hybrid open3d/editor panel system (WorkspaceShell/PanelContainer/TopBar + docking) implements core docking/collapse/minimize + small-screen overlay/backdrop + mobile toggles, uses semantic tokens exclusively, and exposes ARIA roles. However, admin/portal routes remain un-scaffolded (no app/admin/svg-editor or /portal/svg-catalog pages), inventory is still demo-catalog + pageSize:50 (not Sketchfab cursor ≤24 per REC-02/BP-06), svgBlockDescriptorLoader not wired to planner UI panels (Phase 06), panel recovery/keyboard/focus are incomplete (localStorage skips collapsed, crude Tab cycle only), and Global Standard Gate + UI checklist items are missing or "provisional" in Phases 04/05/06/10. Recent updates (FAILURESPLAN PLAN-FAIL-0414/0415 etc., HANDOVER reality sync) correctly flag gaps but UI evidence (no Puck mounts, no live portal verification, a11y/perf tests deferred) shows the work is early-pilot only. High risk of non-compliance claims before routes + descriptor integration + full gates.

## Issues

### Issue 1 -- Severity: bug
- File: site/app/admin/svg-editor/page.tsx (and [id]/page.tsx); also site/app/(site)/portal/svg-catalog (no svg-catalog subdir/pages)
- Description: Per 2026-07-05_implementation-decisions.md live routes table (lines 32-40) and architecture snapshot, `/admin/svg-editor`, `/admin/svg-editor/[id]`, `/portal/svg-catalog`, `/portal/svg-catalog/[slug]` must exist and be Puck + Puck.Render surfaces. `list_dir` + direct read_file on expected paths returns no page.tsx files (only features/planner/admin/svg-editor/ views and general portal pages). FAILURESPLAN.md PLAN-FAIL-0403/0404 mark as Open. Phase 04/05 checklists assume routes exist for Global Standard Gate. Benchmark §5 BP-04/BP-05 require ≤1 Puck.Render per route + Ark UI only.
- Suggestion: Scaffold the thin route pages (with withAuth for admin) before any "Implemented" claim on Phase 04/05; add explicit "UI Global Standards Gate" checklist item per I-D §"Phases 04/05/06/10 must add".
- Status: open

### Issue 2 -- Severity: bug
- File: site/features/planner/open3d/editor/OOPlannerWorkspace.tsx:333 (leftPanel=InventoryPanel), 340 (rightPanel), useOpen3dWorkspaceCatalog.ts:23 (still seeds OPEN3D_DEMO_CATALOG_ITEMS), catalog/svg/svgBlockDescriptorLoader.ts (not imported/used here)
- Description: 2026-07-05_implementation-decisions.md + benchmark §1/§3 + I-D §"Catalogue-first + 2D↔3D Continuity (Planner 5D + Floorplanner)" + BP-06 require catalogue-first default with descriptor-driven inventory. Current workspace uses legacy configurator client + demo items (not svgBlockDescriptorLoader + resolveBlocks). Phase 06 checklist and HANDOVER note "Planner consumer Planned". InventoryPanel:84 loads demo on no items. Resolver test exists but no UI integration.
- Suggestion: Wire useOpen3dSvgCatalog() (or equivalent) + loader into InventoryPanel as primary source before Phase 06 exit; keep demo only as fallback. Update OOPlannerWorkspace to prefer descriptor records.
- Status: open

### Issue 3 -- Severity: bug
- File: site/features/planner/open3d/catalog/inventory/inventoryIndex.ts + InventoryPanel.tsx:90 (options.pageSize: 50), useOpen3dWorkspaceCatalog.ts
- Description: benchmark.md §1 (Sketchfab: "limit capped at 24, cursor-paginated"), REC-02, BP-06, I-D "Inventory & Search (Sketchfab): Cursor-only pagination (≤24 items), facets...", 2026-07-05_quality-gates.md "Inventory search/filter: p95 ≤ 100ms at 1,000...". Current search uses pageSize:50, offset-style options, no cursor, no explicit "downloadable/runtime-available" etc. facets. No p95 measurement in code/tests for this path.
- Suggestion: Implement cursor + limit=24 contract in inventory search + client; add performance assertion test exporting to results/... per handbook. Cite benchmark in decision log.
- Status: open

### Issue 4 -- Severity: bug
- File: site/features/planner/open3d/editor/useDockingSystem.ts:105 (load persisted, "if (parsed[id]?.state !== "collapsed")"), 230 (save: only non-collapsed), 118 (restore similar), WorkspaceShell.tsx:167 (useEffect keyboard Tab only on 3 panels), 217 (useEffect activePanel small reset)
- Description: I-D §"Minimize UI & Panel Grammar (Figma UI3): Explicit hide/collapse/minimize... Small-screen = overlay + backdrop + one-active-panel", "dockable, movable, recoverable toolbars/panels", "panel state recovery" risk in prompt. Recovery skips collapsed states and has no schema version/tenant scope. Keyboard is basic Tab (no full roving, no focus trap on floating, no Escape close in all paths). PanelContainer has onKeyDown Escape but limited. PLAN-FAIL-0414 flags "UI small-screen panel system incomplete (missing mobilePanelActions / panelBackdrop CSS, activePanel wiring...)".
- Suggestion: Persist full state (incl. collapsed) with version; make keyboard navigation complete + test (useWorkspaceKeyboard + a11y); ensure one-active + backdrop always on small. Add recovery test.
- Status: open

### Issue 5 -- Severity: bug
- File: site/features/planner/open3d/editor/workspace.module.css:133 (.mobilePanelActions { display: none; }), 189 (.panelBackdrop { display: none; }), 594+ (only inside @media (width < 768px)), WorkspaceShell.tsx:294 (backdrop conditional), TopBar.tsx:248 (toggles)
- Description: Small-screen wiring partially matches I-D §"Small-screen/hybrid panel wiring is baseline", benchmark Figma/AutoCAD RECs, QUALITY-GATES visual regression deferred. Backdrop and mobile actions are display:none at root level; only media query enables. No evidence of full "overlay + one-active-panel" enforcement in non-media paths or tests. CSS vars resolve to semantic tokens (good).
- Suggestion: Move base styles to always-available (or use data-viewport classes), add explicit small-screen unit test + a11y check. Ensure panelBackdrop z-index and aria work for dismissal.
- Status: open

### Issue 6 -- Severity: suggestion
- File: plannnerplan/phases/04-admin-portal-svg-editor.md:101 (mentions REC-01/03/GS), 152 (UI/GS gate provisional); similarly phases/05:19 (BP-05), 06:20 (BP-06 + RECs), 10 (no explicit UI section); 2026-07-05_implementation-decisions.md:130 ("Phases 04/05/06/10 must add "UI Global Standards Gate" checklist items")
- Description: Phase files reference benchmark RECs/BPs/REJs and Global Standard Gate (2026-07-05_quality-gates.md:60 "Fresh dated benchmark... Independent UI review... Anti-copy..."), but lack dedicated "UI Global Standards Gate" numbered items in checklists (e.g. Phase 04 has no § for "Minimize affordances on every panel", "anti-copy attestation", "≤1 Puck"). HANDOVER/FAILURESPLAN mark phases Planned with GS intensification notes. No signed UI review artifact pre-"Implemented".
- Suggestion: Add explicit numbered "UI/GS-04-01: ..." etc. to each phase checklist citing benchmark §1/§3 + I-D §113-130 lines + DESIGN-BENCHMARK-PROTOCOL anti-copy. Run fresh dated benchmark + this review before status change.
- Status: open

### Issue 7 -- Severity: nit
- File: site/features/planner/open3d/editor/WorkspaceShell.tsx:170 (keyboard useEffect window listener, crude panelIds array), PanelContainer.tsx:99 (Escape only if dragging/resizing or close), useWorkspaceKeyboard.ts (partial)
- Description: Non-canvas command surface (benchmark REC-03 AutoCAD "Command Line docked", I-D §"Non-Canvas Command/Error Surface") exists via CommandPalette + status, but keyboard focus management in shell is global window listener (not scoped), no live region full coverage for panel state, Tab order not verified against a11y gate (QUALITY-GATES: "Keyboard reachability for every command", "Names/roles/states"). PropertiesPanel/Inventory have some aria but no full panel roving documented.
- Suggestion: Scope listeners, add comprehensive keyboard matrix test (Escape closes floating, arrows in inventory), ensure live-region for panel open/close per a11y section.
- Status: open

### Issue 8 -- Severity: suggestion
- File: site/features/planner/open3d/editor/TopBar.tsx + WorkspaceShell.tsx (view 2D/3D toggle), benchmark.md:15 (Planner 5D "2D↔3D continuity"), I-D §"Catalogue-first + 2D↔3D Continuity", OOPlannerWorkspace:150 (toggleView)
- Description: 2D/3D toggle present (canvas + Lazy3DViewer), but no recoverable state (e.g. camera sync, selection carry-over, panel state on switch) or explicit "continuity" affordances called out. No per-object double-click extended props wired to Floorplanner idiom (REC-03). Layers/Output bottom panel is present but collapsed default.
- Suggestion: Document + implement 2D↔3D state continuity contract; add double-click on canvas entity → focus/extend PropertiesPanel. Add to Phase 06 checklist.
- Status: open

### Issue 9 -- Severity: nit
- File: site/features/planner/open3d/editor/workspace.module.css (and TopBar/Panel styles), site/app/css/core/tokens/theme.css (defines hex scales), planner CSS bundles
- Description: Components correctly use --ws-* / --surface-* semantic vars (no inline hex in inspected module.css). However, Global Standard Gate + benchmark anti-copy + I-D "All visual tokens resolve from site/app/css/ semantic tokens" + "No donor... palettes" requires explicit attestation. No visual regression evidence (deferred per QUALITY-GATES). No contrast audit output attached to UI review.
- Suggestion: Add "UI tokens audit" + "anti-copy attestation citing plans/2026-07-04/benchmark.md §6" to phase decision logs. Capture a11y contrast (axe or manual) in results for planner panels.
- Status: open

### Issue 10 -- Severity: bug
- File: plannnerplan/FAILURESPLAN.md:70 (PLAN-FAIL-0414/0415/0416/0419 track UI panels + global standard gate + agent review + features), plans/2026-07-04/HANDOVER.md:140 (Provisional pending live site validation), 2026-07-05_quality-gates.md:65 ("Independent UI review (per REVIEW-WORKFLOW) signed off")
- Description: Recent plan updates correctly surface risks ("panel state recovery, focus/keyboard, contrast, responsive, trade-dress copy, missing portal UI") per task prompt, but no evidence this UI review (or prior) was signed off before intensification. No Puck in live planner path (admin edit uses JSON form per AdminSvgEditorEditView). No performance budgets asserted for search/panels/SVG in current open3d code. Tests cover unit resolver + some panel DOM but not full a11y (Playwright a11y deferred).
- Suggestion: Treat Global Standard Gate as blocking for any further Phase 04-06/10 progress. Record this review file in HANDOVER/FAILURESPLAN as the independent UI sign-off. Add "live site + Puck.Render verification" step.
- Status: open

## Additional Observations (no new issues filed)
- Strengths: Panel grammar (dock/undock/collapse/minimize + floating drag/resize) closely tracks Figma Minimize UI intent; ARIA roles + labels present; CSS is token-driven and responsive media queries exist; CommandPalette provides non-canvas surface; recent resolver test + FAILURESPLAN updates show good tracking discipline.
- Gaps not filed as "bug": Deferred visual regression (QUALITY-GATES), full e2e a11y (test:a11y), coverage floor for new panel code (still pre-Phase 06), absence of admin/portal Puck mounts (routes not present).
- Cross-role: Matches critic/qa observations on missing artifacts, provisional status, and seam issues (e.g. blocks field). UI layer specifically lacks the "catalogue-first" + "search parity" wiring required by benchmark/I-D.
- No violations of AGENTS minimum-necessary or read-only review rules.

## Verdict Summary
Work implements promising panel grammar and small-screen baseline in pilot open3d tree but is not yet aligned with full 5-product RECs, Intensified UI/UX Standards, or Global Standard Gate; admin/portal surfaces, descriptor-driven inventory, pagination, and complete accessibility/keyboard recovery are missing or incomplete. Status remains early "Planned" across relevant phases.

Evidence integrity: All inspection used read_file/grep/list_dir only (no runs, no destructive ops). Artifacts for future gates must follow results/<...> format when executed.

---

**Exact output path:** results/reviews/ui-review.md  
**One-sentence verdict:** The UI/UX review documents 10 specific issues (primarily missing routes/integration, incomplete panel recovery/keyboard/search parity vs benchmark RECs and I-D §113-130, and Global Standard Gate tracking gaps) with all citations traceable to the three mandatory docs and live component files; work is directionally correct on Figma-style panels but not shippable or "Implemented" without the fixes and signed gates.
