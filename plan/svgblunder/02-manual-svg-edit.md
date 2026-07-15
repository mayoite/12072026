# Phase 2: Full Manual SVG-Edit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `subagent-driven-development` or `executing-plans`. Use TDD. Do not commit or push unless the owner asks.

**Goal:** Replace the active custom canvas with the complete SVG-Edit interface while keeping Admin metadata, dimensions, validation, revisions, and publishing under host control.

**Architecture:** SVG-Edit 7.4.2 runs in a same-origin iframe. A versioned `postMessage` bridge exchanges sanitized documents and selection state. Admin CSS never reaches the iframe, and upstream SVG-Edit CSS never reaches Admin.

**Tech stack:** SVG-Edit 7.4.2, `@svgedit/svgcanvas` 7.4.2, Next.js, React, TypeScript, Zod, Vitest, Playwright.

---

## Task 1: Pin and prepare SVG-Edit

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `site/scripts/prepare-svgedit-runtime.mjs`
- Modify: `site/package.json`
- Modify: `docs/Lockedfiles/03-dependencies-engines-current.md`

- [ ] Add pinned `svgedit@7.4.2` and `@svgedit/svgcanvas@7.4.2` through root `pnpm` only.
- [ ] Add a deterministic runtime preparation script used by `predev` and `prebuild`.
- [ ] Generate runtime files into a gitignored public vendor directory and copy upstream licence notices.
- [ ] Verify the prepared editor loads without unresolved workspace imports or console errors.

## Task 2: Implement the versioned iframe bridge

**Files:**
- Create: `site/features/admin/svg-editor-v2/bridge/svgEditorBridgeMessages.ts`
- Create: `site/features/admin/svg-editor-v2/bridge/SvgEditFrameHost.tsx`
- Create: `site/features/admin/svg-editor-v2/runtime/SvgEditRuntimeBridge.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgEditorBridge.test.ts`

- [ ] Define host messages: `load`, `read`, `apply`, and `focus-elements`.
- [ ] Define editor messages: `ready`, `document`, `changed`, `selection`, and `error`.
- [ ] Require `version`, `requestId`, checksum, exact origin, exact iframe source, and bounded message size.
- [ ] Reject unknown versions or stale checksums without modifying editor state.
- [ ] Test spoofed origin, wrong window, duplicate response, timeout, iframe reload, and stale apply.

## Task 3: Build the new focused Admin editor shell

**Files:**
- Create: `site/features/admin/svg-editor-v2/ui/AdminSvgEditorV2.tsx`
- Create: `site/features/admin/svg-editor-v2/ui/SvgEditorHeaderV2.tsx`
- Create: `site/features/admin/svg-editor-v2/ui/SvgEditorStatusV2.tsx`
- Modify: `site/app/admin/svg-editor/[id]/page.tsx`
- Test: `site/tests/unit/features/admin/svg-editor-v2/AdminSvgEditorV2.test.tsx`

- [ ] Keep the route thin and load the V2 record through the repository.
- [ ] Render only identity/status, dimension controls, iframe, validation, revision controls, publishing, and the collapsed AI rail.
- [ ] Use semantic Admin tokens and locked stylesheet classes; no inline TSX presentation.
- [ ] Split components before any source file reaches 700 lines.
- [ ] Keep all SVG-Edit tools intact inside the iframe.

## Task 4: Add editor focus mode

**Files:**
- Modify: `site/features/admin/AdminLayoutShell.tsx`
- Create: `site/features/admin/svg-editor-v2/ui/SvgEditorNavigationToggle.tsx`
- Test: `site/tests/unit/features/admin/svg-editor-v2/editorFocusMode.test.tsx`

- [ ] Auto-hide the Admin left navigation on `/admin/svg-editor/[id]` and `/admin/svg-editor/new` only.
- [ ] Keep navigation visible on the inventory route and every other Admin route.
- [ ] Add a persistent “Show navigation” button on editor routes.
- [ ] Open navigation as an overlay, close on Escape/backdrop/navigation, trap focus, and restore focus to the toggle.
- [ ] Test desktop, tablet, keyboard-only, and route transition behavior.

## Task 5: Add decimal physical dimensions

**Files:**
- Create: `site/features/admin/svg-editor-v2/dimensions/svgDimensionUnits.ts`
- Create: `site/features/admin/svg-editor-v2/dimensions/scaleSvgDocument.ts`
- Create: `site/features/admin/svg-editor-v2/ui/SvgDimensionBar.tsx`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgDimensionsV2.test.ts`

- [ ] Support decimal `mm`, `cm`, `m`, `in`, and `ft`; never display mixed feet-and-inches.
- [ ] Convert from canonical millimetres on render and back from the edited display value; never reconvert an already rounded display value.
- [ ] On width/depth changes, require Scale drawing, Metadata only, or Cancel.
- [ ] Preserve proportions and center by default; require explicit unlock for independent X/Y scaling.
- [ ] Keep height metadata-only.
- [ ] Test round trips, unit switching, rounding, extreme values, proportional centering, and unlocked stretching.

## Task 6: Connect draft, revision, and publish workflows

**Files:**
- Create: `site/features/admin/svg-editor-v2/actions/saveSvgDraftV2.ts`
- Create: `site/features/admin/svg-editor-v2/actions/publishSvgAssetV2.ts`
- Create: `site/features/admin/svg-editor-v2/actions/rollbackSvgAssetV2.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgLifecycleV2.test.ts`

- [ ] Read the live iframe SVG, validate its base checksum, and save the complete private draft to Supabase.
- [ ] Preserve unsafe-but-recoverable drafts while returning blocking diagnostics.
- [ ] Publish only sanitized, checksum-verified SVG/PNG artifacts to R2.
- [ ] Insert an immutable version and update the live pointer only after artifact verification.
- [ ] Roll back by repointing to an immutable prior version; never rewrite history.
- [ ] Test save/reopen fidelity for paths, groups, layers, text, gradients, masks, clipping, and managed images.

## Phase 2 gate

- [ ] Manual tools work in a real browser with zero console errors.
- [ ] Save/reopen and one-step publish round trips preserve supported SVG content.
- [ ] Focus mode and dimensions pass unit, accessibility, and Playwright tests.
- [ ] Strict UI/CSS checks pass.
- [ ] `pnpm run check:layout` passes.

