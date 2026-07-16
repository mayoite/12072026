# Code review — Admin SVG / lifecycle / e2e (maintainability)

**Date:** 2026-07-16  
**Mode:** read-only product review (no product edits, no commit, **no browser PASS claim**)  
**Scope:** Admin SVG editor, catalog lifecycle, Failures.md proof scripts, retire/restore e2e  
**Quality bar:** `AGENTS.md`, `Agents/Agents-01-STANDARD.md` (brutal truth; live code wins)

---

## Git context

### `git log -5` (from `.git/logs/HEAD` + `refs/heads/main`)

`main` tip: `1ca412dc86037a89cfa8a58767b50544738c9069`

| # | Commit | Subject |
|---|--------|---------|
| 1 | `1ca412dc` | feat: enhance admin SVG editor with lifecycle management and checklist updates |
| 2 | `f62f0ed1` | Refactor planner and admin flows for layout cleanup |
| 3 | `5d58f965` | Refactor planner and site inventory flows across the workspace |
| 4 | `2c2261c6` | feat: implement AdminSvgEditorEditView and associated SVG studio styles |
| 5 | `e63b45b6` | feat: implement admin SVG editor feature and infrastructure |

Recent SVG stack also includes (beyond -5): Excalidraw cutover commits, SVG V1 archive/inventory scripts, and dual-write revision repo restore.

### Uncommitted / working-tree

No full `git status` / diff dump available in this review environment (no shell). Review is of the **live tree at HEAD `1ca412dc`**. Treat any local dirt as unproven. Do not use this report as a clean-tree certificate.

---

## Summary (brutal)

The lifecycle **domain split** (`catalogLifecycle.shared` pure + disk I/O server module) and inventory filter pure helpers are real structure. Unit coverage under `tests/unit/features/admin/svg-editor/` is broad on paper.

The **authoring surface is mid-rewrite spaghetti**. Excalidraw was bolted on top of the sceneParts / asset-engine publish path. Live preview no longer runs the real compiler. Client SVG can skip server compile. `any` is back. Pure retirement policy is **not** enforced on the PATCH API. Publish **always demotes to draft**. The retire/restore e2e **does not click Retire/Restore** — it PATCHes via `page.evaluate` and only asserts button presence.

**Do not claim:** browser PASS, checklist complete, DB-SVG cutover, production auth, Admin coverage ≥80%, or “planner retire/restore closed” from unit green or from a bypass-only Playwright exit code alone.

**Issue counts:** 9 bug · 8 suggestion · 4 nit · **21 total**

**Top five (priority):**

1. Dual geometry authority — Excalidraw raw SVG vs sceneParts / asset-engine (publish truth split)
2. Fake always-ok client preview; real `useDebouncedCompile` / `previewSvgEditorAction` orphaned
3. Publish always forces lifecycle `draft` (live products pulled from buyers on republish)
4. Lifecycle PATCH ignores transition policy; list UI silent-fails and reloads
5. Retire/restore e2e bypasses UI click path; `.ps1` proof script still auto-ticks checklists

---

## Size / growth map (hotspots)

No production file in this slice is >1000 lines yet. Several are **god-components** and will cross the line if more filters/actions land.

| File | ~Lines | Verdict |
|------|--------|---------|
| `site/features/admin/svg-editor/views/AdminSvgEditorListView.tsx` | **860** | Near-god: filters, paging, saved views, lifecycle mutations, table, bulk import shell |
| `site/features/admin/svg-editor/storage/persistBlockDescriptor.ts` | **~504** | Dense but domain-appropriate; keep deps injectable |
| `site/features/admin/svg-editor/storage/bulkImportBlockDescriptors.ts` | **~490** | OK as pure-ish service; UI panel separate |
| `site/features/admin/svg-editor/views/AdminSvgEditorEditView.tsx` | **389** | Mid-cutover dump of form + GLB + studio + dirty navigation |
| `site/features/admin/svg-editor/publish/publishDescriptorWithPipeline.ts` | **384** | Disk path solid; dual-write stub bloated into same function |
| `site/features/admin/svg-editor/form/SvgEditorForm.tsx` | **365** | Acceptable form cartography |
| `site/features/admin/svg-editor/views/edit-shell/useAdminSvgEditorPublish.ts` | **386** | High-arg hook (~20 deps) — API smell |

**Dead / ghost weight (wrong layer or missing product code):**

- `tests/helpers/svgEditorV2TestWorkspace.ts` imports `@/features/admin/svg-editor-v2/**` — **package path does not exist**
- `site/tests/INVENTORY.md` documents svg-editor-v2 unit suite that is **gone**
- `tests/archive/features/admin/svg-editor/*` still targets deleted `SvgStudioCanvas` / old import paths
- `tests/unit/features/admin/planner-views/**` duplicates admin tests under a misleading tree name
- `useDebouncedCompile` + `previewSvgEditorAction` still fully tested; **not used** by live EditView
- `declareSvgEditSources` only consumed by residual unit tests — **not wired** to edit/list UI

---

## Issues (severity ordered)

### 1. Dual geometry authority after Excalidraw cutover

- **Severity:** bug  
- **Files:**  
  - `site/features/admin/svg-editor/views/AdminSvgEditorEditView.tsx` (fake preview + excalidraw-only draft updates)  
  - `site/features/admin/svg-editor/form/svgEditorFormState.ts` (`sceneParts`, `excalidrawElements`, `compiledSvg`)  
  - `site/features/admin/svg-editor/form/svgEditorFormAdapters.ts` (`formStateToDescriptorInput` still maps `sceneParts` → blocks; free-rides `excalidrawElements`)  
  - `site/features/admin/svg-editor/publish/publishSvgEditorAction.ts` (client `compiledSvg` short-circuits compile)  
- **Description:** Form state holds three geometry truths. Seed still builds `sceneParts` from the descriptor. Studio writes Excalidraw elements + raw SVG. Publish may write client SVG **without** re-running asset-engine S1–S3 when `compiledSvg` is non-empty (`compileSvgMock`). Descriptor blocks can lag the drawing. Comments in EditView admit the rewrite is unfinished.  
- **Suggestion:** One authority. Either (A) Excalidraw → sanitize/normalize → released SVG only, or (B) keep sceneParts IR and treat Excalidraw as a non-authoring preview. Drop the other path from form state and publish deps. Type `excalidrawElements` properly or keep it out of `BlockDescriptor` until schema-owned.  
- **Status:** open  

### 2. Live preview is faked; real compile pipeline is orphaned

- **Severity:** bug  
- **Files:**  
  - `AdminSvgEditorEditView.tsx` — `preview = useMemo(() => ({ ok: true, phase: "ok", svg: excalidrawSvg || "", issues: [] }), …)`  
  - `previewPending = false` hard-coded  
  - Orphans: `publish/useDebouncedCompile.ts`, `publish/previewSvgEditorAction.ts`  
- **Description:** Draft preview rail claims “compiled” SVG via `LiveCompiledSvgPreview` but receives unsanitized client export (or empty string). Publish gate treats `preview.ok === true` as validation. Empty SVG is “valid.” Unit test documents the lie: *“empty svg is ok:true in view”* (`AdminSvgEditorEditView.test.tsx`).  
- **Suggestion:** Re-wire `useDebouncedCompile` (or an Excalidraw-aware variant that still calls server sanitize). `canPublish` requires non-empty sanitized SVG and real `ok` from `previewSvgEditorAction` / shared compiler. Delete the fake memo.  
- **Status:** open  

### 3. Successful publish always sets lifecycle to `draft`

- **Severity:** bug  
- **File:** `site/features/admin/svg-editor/publish/publishSvgEditorAction.ts:81-88`  
- **Description:** Every successful publish calls `setCatalogLifecycle(slug, "draft")`. Republishing a **live** product removes it from buyer-visible inventory until an operator clicks Approve again. Audit detail hard-codes `lifecycle: "draft"`. No unit asserts this side effect.  
- **Suggestion:** On first publish of new/draft stay `draft`. On publish of already-live product either keep `live` with explicit “publish revises live” confirmation, or require a separate demote. Never silently strip buyer visibility. Add unit + e2e for live republish.  
- **Status:** open  

### 4. Lifecycle API ignores transition policy and confirmation

- **Severity:** bug  
- **Files:**  
  - `site/app/api/admin/svg-editor/[slug]/lifecycle/route.ts` — raw `setCatalogLifecycle(slug, state)`  
  - `site/features/admin/svg-editor/lifecycle/catalogRetirement.ts` — `nextLifecycleAfterAction`, `retirementConfirmMessage` (pure, unused by API/list UI)  
  - `AdminSvgEditorListView.tsx:176-188` — no confirm, no `response.ok` check, always `window.location.reload()`  
- **Description:** Any admin-authenticated client can PATCH any of `live|draft|retired` without transition validation. List Retire/Restore skip impact confirm. Failed PATCH still reloads and looks like success. E2E comment admits button onClick was flaky and was abandoned.  
- **Suggestion:** Server: require action (`retire`|`restore`|`approve`) or validate via `nextLifecycleAfterAction`. Client: confirm with `retirementConfirmMessage`, check response, optimistic row update without full reload, surface errors.  
- **Status:** open  

### 5. Retire/restore e2e does not prove the UI path

- **Severity:** bug  
- **File:** `site/tests/e2e/admin-svg-retire-restore.spec.ts:41-104`  
- **Description:** `patchLifecycle` asserts the button is visible/enabled, then mutates via same-origin `fetch` + CSRF. Comment: *“React button onClick + browserApiFetch was flaky (click with no PATCH)”*. That is a product defect, not a reason to greenwash acceptance. Planner placement absence is checked (good), under `DEV_AUTH_BYPASS=1` only.  
- **Suggestion:** Fix list `setLifecycle` first. E2E must `button.click()` and wait for lifecycle attribute / network. Keep API-level unit/integration separate. Do not auto-clear Failures.md until UI path is green.  
- **Status:** open  

### 6. Handwritten `any` reintroduced (AGENTS ban)

- **Severity:** bug  
- **Files:**  
  - `publish/publishSvgEditorAction.ts:79` — `compileSvg: compileSvgMock as any`  
  - `editor/ExcalidrawCanvas.tsx:11` — `props: any`  
  - `form/svgEditorFormAdapters.ts:136` — `(descriptor as any).excalidrawElements`  
  - `editor/gridSnapping.ts:287` — `(el as any).customData`  
- **Description:** Explicit project rule: no `any` in handwritten code. The canvas wrapper exists only to re-export a dynamic client with an untyped prop bag.  
- **Suggestion:** Align `compileSvg` return type with `SvgCompileStagesResult`. Type ExcalidrawCanvas props as `ExcalidrawClientProps`. Extend descriptor schema or a typed extension field for studio elements.  
- **Status:** open  

### 7. Dual-write still publishes stub DB definition (DB-SVG honesty)

- **Severity:** bug (product authority / maintainability)  
- **File:** `publish/publishDescriptorWithPipeline.ts:282-371`  
- **Also:** `Failures.md` BLOCK DB-SVG-01..05  
- **Description:** After disk commit, dual-write builds a **hard-coded single rect**, empty parameters, `category: "uncategorized"`, `revisionId: \`${slug}-r1\`` always, `actorId: "system"`. DB failures are logged and swallowed. List UI correctly says “Products DB not live.” Code still looks like a second writer.  
- **Suggestion:** Extract dual-write to a named `bestEffortDiskDualWrite` with explicit non-authority return type, or delete until real payload + transaction exist. Never grow more stub fields inside the disk pipeline.  
- **Status:** open  

### 8. Hollow “proof” functions and residual tests that certify constants

- **Severity:** bug (process / false confidence)  
- **Files:**  
  - `lifecycle/catalogRetirement.ts:36-38` — `preservesRetiredIdentityInExistingDesigns(): true` always  
  - `tests/unit/features/admin/remainingOpenItems.test.ts` — asserts that constant is `true`  
  - `lifecycle/adminDataSourceEditability.ts` — not used by product UI  
- **Description:** Unit green proves a function returns a literal. No Planner path is tested for keeping retired identity on existing designs. Residual suite looks like Phase residual closure while UI wiring is missing.  
- **Suggestion:** Delete hollow exports or implement real identity preservation checks against planner document model. Wire data-source banner into edit/list or delete dead module.  
- **Status:** open  

### 9. Client-trusted compile SVG skips fail-closed server authority

- **Severity:** bug  
- **File:** `publishSvgEditorAction.ts:69-80`  
- **Description:** `formFromEditor.compiledSvg` is trusted when non-empty. Any admin client can POST arbitrary SVG markup into the public catalog path through the action, bypassing `compileSvgForPublish` normalize/sanitize stages (unless those stages also run inside pipeline when skipCompile is used — pipeline S4 writes precompiled bytes as-is).  
- **Suggestion:** Always run server sanitize (S3 minimum) on client-provided markup, or refuse client SVG and compile only from typed descriptor IR.  
- **Status:** open  

### 10. List view is a near-1000-line god component

- **Severity:** suggestion  
- **File:** `views/AdminSvgEditorListView.tsx` (~860 lines)  
- **Description:** Inventory row model building, filters, sort, paging, localStorage saved views, lifecycle PATCH, family grouping table, and bulk-import details all live in one client component. Hard to test, hard to a11y-review, magnet for more growth.  
- **Suggestion:** Split:  
  - `useSvgInventoryRows` (pure map from props)  
  - `SvgInventoryFilters` / `SvgInventoryTable` / `SvgInventoryLifecycleActions`  
  - Keep page RSC thin (`app/admin/svg-editor/page.tsx` is already good).  
- **Status:** open  

### 11. `useAdminSvgEditorPublish` dependency dump

- **Severity:** suggestion  
- **File:** `views/edit-shell/useAdminSvgEditorPublish.ts`  
- **Description:** ~20 parameters including multiple setters and three refs. Call site in EditView is unreadable. Approve path swallows errors (`if (!response.ok) return`).  
- **Suggestion:** Pass a small `PublishSession` object (slug, baselines, studio ports, feedback API). Surface approve failures in feedback region.  
- **Status:** open  

### 12. Parallel proof scripts disagree (ps1 vs mjs)

- **Severity:** suggestion  
- **Files:**  
  - `site/scripts/run-admin-retire-restore-canvas.mjs` (package.json target)  
  - `site/scripts/run-admin-retire-restore-canvas.ps1`  
  - `complete-admin-retire-restore-proof.mjs` — Failures.md only, **no checklist ticks**  
  - `complete-admin-retire-restore-proof.ps1` — **regex-ticks** Admin + Planner checklists  
- **Description:** Two runners, two post-success policies. The `.ps1` complete script violates plan purity (checked boxes from a single bypass e2e). Root package uses `.mjs` — good — but the `.ps1` is a footgun.  
- **Suggestion:** Delete or rewrite `.ps1` to match `.mjs` honesty. Never auto-tick plan files from Playwright.  
- **Status:** open  

### 13. Ghost svg-editor-v2 surface

- **Severity:** suggestion  
- **Files:** `site/tests/helpers/svgEditorV2TestWorkspace.ts`, `site/tests/INVENTORY.md`, missing `features/admin/svg-editor-v2/`  
- **Description:** Docs and helpers reference a second product tree that is not in the repo. Maintainers will waste time or break typecheck if those tests re-enter the suite.  
- **Suggestion:** Delete ghosts or restore the package as intentional non-shipped experiment under `archive/` with clear non-product status.  
- **Status:** open  

### 14. Duplicate / archive test trees inflate confidence

- **Severity:** suggestion  
- **Paths:**  
  - `tests/unit/features/admin/planner-views/**` (name-mirrors wrong layer)  
  - `tests/archive/features/admin/svg-editor/**` (broken imports to deleted studio)  
- **Description:** Dual trees for admin views encourage drift. Archive tests that cannot run still look like coverage inventory.  
- **Suggestion:** One name-mirror tree only. Delete or quarantine archive from any gate path.  
- **Status:** open  

### 15. `catalogLifecycle.db.server` casts unvalidated JSON

- **Severity:** suggestion  
- **File:** `lifecycle/catalogLifecycle.db.server.ts:23-34`  
- **Description:** DB rows mapped with `as BlockDescriptor` without `parseBlockDescriptor`. Fallback to disk on any error hides schema drift.  
- **Suggestion:** Parse with the same schema as disk; fail closed or skip bad rows with metrics.  
- **Status:** open  

### 16. Detail page dead imports / weak typing

- **Severity:** suggestion  
- **File:** `site/app/admin/svg-editor/[id]/page.tsx`  
- **Description:** Imports `existsSync`, `readFileSync`, `path` unused. `params: Promise<{ id: string }>` is fine for Next 16; page is otherwise thin (good).  
- **Suggestion:** Remove dead imports. Keep page as pure loader + bind.  
- **Status:** open  

### 17. Structural simplification ambition (recommended target shape)

- **Severity:** suggestion  
- **Description:** Current module fan-out under `svg-editor/` is mostly good (contracts / form / lifecycle / publish / scene / storage / views). The **cutover incomplete** state is what hurts.  
- **Target simplification:**  
  1. **Authoring:** Excalidraw client → single `StudioDocument` → server `compileAndSanitize` → preview + publish share one function.  
  2. **Lifecycle:** one service `applyLifecycleTransition(slug, action, actor)` used by API, list, approve button, bulk batch.  
  3. **Publish:** `publishDescriptorWithPipeline` disk-only; dual-write behind feature flag file that is empty until DB-SVG-01..05 real.  
  4. **Inventory UI:** three presentational pieces + one hook; no full page reload.  
  5. **Delete:** orphaned debounced compile only after re-wire; hollow residual functions; ghost v2; checklist-ticking ps1.  
- **Status:** open  

### 18. Failures.md scripts are ops side-effects in the test runner

- **Severity:** suggestion  
- **Files:** `run-admin-retire-restore-canvas.mjs:52-57`, `complete-admin-retire-restore-proof.mjs`  
- **Description:** On Playwright exit 0, the runner mutates `Failures.md`. That couples green smoke under bypass to product blocker state. A false green (issue 5) can clear an OPEN without owner review.  
- **Suggestion:** Evidence-only under `results/admin/retire-restore-canvas/`. Owner or a separate deliberate command clears Failures.md.  
- **Status:** open  

### 19. Encoding / comment quality in EditView

- **Severity:** nit  
- **File:** `AdminSvgEditorEditView.tsx` header and strings (`A4 â€”`, mojibake arrows)  
- **Description:** UTF-8 corruption in comments and user-visible GLB error strings. Signals rushed merge.  
- **Suggestion:** Re-save UTF-8; drop narrative “Wait, if we use Excalidraw…” comments once path is chosen.  
- **Status:** open  

### 20. `ExcalidrawCanvas` is a pointless `any` wrapper

- **Severity:** nit  
- **File:** `editor/ExcalidrawCanvas.tsx`  
- **Description:** Dynamic import already done in `AdminSvgEditorShell`. Second wrapper adds `any` without value.  
- **Suggestion:** Delete file; import `ExcalidrawClient` dynamic only from shell.  
- **Status:** open  

### 21. Theme token defaults inject palette-ish CSS in adapters

- **Severity:** nit  
- **File:** `svgEditorFormAdapters.ts:233`  
- **Description:** `themeTokens` merge injects `"--fill-primary": "var(--color-surface-raised)"` and related defaults on every form→descriptor round-trip. Easy to overwrite intentional tokens silently.  
- **Suggestion:** Apply defaults only when original tokens empty; never force on merge.  
- **Status:** open  

---

## What is actually solid

- Thin RSC pages for list/detail (`app/admin/svg-editor/page.tsx`, `[id]/page.tsx` intent).  
- Disk publish pipeline ordering (parse → compile → S4 → persist → rollback helpers) is thoughtful.  
- Lifecycle ops path under `results/admin/catalog-ops` (gitignored) is the right isolation for manifests/audit vs canonical descriptors.  
- Pure inventory filters (`svgInventoryFilter.ts`) and shared lifecycle types are testable.  
- CSRF + `withAuth` on lifecycle PATCH and SVG POST.  
- `complete-admin-retire-restore-proof.mjs` honesty (no checklist ticks) is better than the `.ps1` twin.

---

## Missing tests (honest gaps)

| Gap | Why it matters |
|-----|----------------|
| No unit that publish demotes live → draft | Issue 3 production footgun |
| No test that lifecycle API rejects invalid transitions | Issue 4 |
| No EditView test that empty preview blocks publish | Issue 2; current test accepts empty ok |
| No e2e that **clicks** Retire/Restore | Issue 5 |
| No browser publish journey asserting server-sanitized SVG | Issues 1, 9 |
| Edit shell components partially unit-covered; full Excalidraw + publish not | Failures.md coverage OPEN still valid |
| Production auth smoke still OPEN | Failures.md |

**Do not claim browser PASS from this review.**

---

## Recommended work order (maintainability ROI)

1. Re-establish **one compile authority** + real preview gate (issues 1, 2, 9).  
2. Fix lifecycle service + list UI + stop draft-demote bug (3, 4).  
3. Make e2e click the real buttons; stop Failures auto-clear on weak green (5, 18).  
4. Strip `any` and ghost v2/archive/planner-views debt (6, 13, 14).  
5. Split ListView; shrink publish dual-write surface (10, 7, 17).  

---

## Layout check

`pnpm run check:layout` was **not executed** in this review session (no shell tool available to the reviewer). Owner should run from repo root before treating any follow-up as done:

```powershell
pnpm run check:layout
```

---

## Close

This slice is not “almost done maintainability.” It is a **half-cutover**: Excalidraw in the chair, asset-engine still in the docs, lifecycle pure helpers unused by the live API, e2e papering over a broken button path, and publish demoting live catalog rows to draft. Unit volume is high; structural honesty is not. Fix authority and lifecycle first. Everything else is furniture.
