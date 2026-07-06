# React / Next.js Best Practices Review (Vercel React Best Practices)

**Date:** 2026-07-06  
**Scope (per task):** Performance, re-renders, data fetching, bundle size.  
**Priority order followed:**  
1. CRITICAL: Eliminating Waterfalls (`async-*`) + Bundle Size Optimization (`bundle-*`)  
2. HIGH: Server-Side Performance (`server-*`)  
3. MEDIUM-HIGH: Client-Side Data Fetching (`client-*`)  
4. MEDIUM: Re-render Optimization (`rerender-*`) + Rendering Performance (`rendering-*`)  

**Target areas (in order):**  
- `site/features/planner/open3d/` (editor, hooks: `useWorkspaceCanvas`, `useDockingSystem`, catalog, state, Three.js, canvas) — primary  
- `site/app/planner/` (pages, layouts)  
- `site/components/` (client components)  
- `site/features/planner/` (supporting)  

**Methodology:** `list_dir`, broad+targeted `grep` (patterns: `'use client'`, `use(State|Effect|Memo|Callback)`, `await`, `fetch`, `import.*three|@react-three`, `dynamic`, `Suspense`, async fns), `read_file` on `.tsx`/`.ts` (key files read in full or targeted chunks). No terminal commands executed (no builds, tests, or gates — followed `START.md` / `Failures.md` / `AGENTS.md` conduct; only static analysis). No source code edits applied. Report created under `results/` per explicit user instruction (supersedes `TESTING.md` note on agent outputs).

**Evidence integrity:** All analysis from live file reads/greps at current tree state. No artifacts suppressed. Skips documented below.

## Summary of Findings by Priority/Category

**CRITICAL (Waterfalls + Bundle):**
- Sequential awaits in server route components (auth IO before cheap searchParams promise). Multiple instances.
- Partial use of `dynamic` + `lazy`/`Suspense` for heavy 3D (good in some routes; missing/inconsistent on direct `/planner/open3d` entry and inner module boundaries).
- Client-side catalog query has sequential awaits inside `queryFn`.
- Heavy client UI (react-aria-components in always-visible InventoryPanel) not deferred. No barrel issues found (positive).
- `three` deferred via dynamic import + lazy in open3d path (positive).

**HIGH (Server-Side Performance):**
- Planner root layout does one awaited context (internally parallelized). Auth helpers (`getOptionalPlannerUser` → Supabase `getUser()`) called in pages.
- Several pages/layouts perform auth + other awaits sequentially where parallel possible.
- No obvious serial DB in planner server routes (catalog/planner data mostly client or Drizzle elsewhere); `force-dynamic` used appropriately on workspace.

**MEDIUM-HIGH (Client-Side Data Fetching):**
- Catalog uses `@tanstack/react-query` (good dedup, `staleTime`, `useQuery`) via `useOpen3dWorkspaceCatalog`.
- Direct `fetch` in AI clients (`advisorClient.ts`, `sketchToPlanClient.ts`) — no RQ/SWR dedup or caching strategy visible.
- Autosave/persistence uses async but client-side (no server waterfall).
- No widespread `fetch` in render or effects without guards.

**MEDIUM (Re-render + Rendering):**
- Extensive `useCallback`/`useMemo` (positive discipline).
- Multiple causes of unnecessary re-renders: unstable hook returns, inline handlers/JSX in props, prop→local-state sync via effects, non-memoized panels.
- No nested/inline component definitions (positive).
- Derived values sometimes computed in render body; some effects for derived/sync state.
- Conditional rendering and Suspense used in 3D path.
- Large interactive canvas + panels likely sensitive to parent re-renders.

**Overall impact:** High on initial planner load / view switch (3D) and re-render thrash during drawing/selection/panel interactions. Direct `/open3d` route vs guest route inconsistency. Several easy parallelization wins.

**Files analyzed (key):**  
- `site/app/planner/open3d/page.tsx`, `layout.tsx`  
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`, `WorkspaceShell.tsx`, `useWorkspaceCanvas.ts`, `useDockingSystem.ts`, `FeasibilityCanvas.tsx` (canvas-fabric), panels (Inventory/Props/Layers), `ThreeLazyViewer.tsx` + `ThreeViewerInner.tsx`  
- `site/features/planner/open3d/catalog/useOpen3dWorkspaceCatalog.ts`, `catalogQuery.ts`, `catalogClient.ts`  
- `site/features/planner/open3d/ui/Open3dNativeHost.tsx`, `site/features/planner/ui/Open3dPlannerHost.tsx` + `Open3dPlannerWorkspaceRoute.tsx`  
- `site/app/planner/layout.tsx`, other workspace pages, `site/lib/auth/*`, `site/lib/layout/siteLayoutContext.ts`  
- Broader: `site/components/ThreeViewer.tsx`, various client files for `'use client'` + dynamic patterns.

## Specific Issues (High-Impact First)

### 1. CRITICAL — Sequential awaits (auth then searchParams) in planner route
- **File:line:** `site/app/planner/open3d/page.tsx:20-23`  
- **Rule:** `async-parallel`, `async-defer-await`  
- **Severity:** CRITICAL  
- **Why it matters:** Waterfalls block render/streaming. Per skill, parallelize independent server IO with `Promise.all` (or restructure) to reduce TTFB. SearchParams promise is cheap but auth involves Supabase roundtrip.  
- **Bad code snippet:**
  ```tsx
  export default async function Open3dPlannerRoute({ searchParams }) {
    const user = await getOptionalPlannerUser();  // IO
    const isGuest = !user;
    const resolvedSearchParams = searchParams ? await searchParams : {};  // after
    ...
  ```
- **Suggested fix:** 
  ```tsx
  const [user, resolvedSearchParams] = await Promise.all([
    getOptionalPlannerUser(),
    searchParams ? searchParams : Promise.resolve({}),
  ]);
  ```
  Same pattern repeats in `site/app/planner/(workspace)/fabric/guest/page.tsx:12`, `site/app/planner/(workspace)/canvas/page.tsx:12`, and similar in marketing/access pages.

### 2. CRITICAL — Inconsistent / missing dynamic import for heavy planner host on direct route
- **File:line:** `site/app/planner/open3d/page.tsx:6` (direct `import { Open3dPlannerHost }`), vs. `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx:9-16` (uses `dynamic(..., { ssr: false, loading: ... })`)  
- **Rule:** `bundle-dynamic-imports`, `bundle-defer-third-party`  
- **Severity:** CRITICAL (bundle size on `/planner/open3d`)  
- **Why it matters:** The full editor + FeasibilityCanvas + catalog + docking + 3D lazy pulls large client JS on initial navigation to direct route. Guest routes defer via `next/dynamic`. "Native" pilot route bypasses optimization.  
- **Bad code snippet:**
  ```tsx
  // page.tsx
  import { Open3dPlannerHost } from "@/features/planner/ui/Open3dPlannerHost";
  ...
  return <Open3dPlannerHost guestMode={isGuest} planId={planId} />;
  ```
  (Contrast with workspace route using dynamic + PlannerSkeleton.)
- **Suggested fix:** Wrap direct host usage with `next/dynamic` (or reuse the `Open3dPlannerWorkspaceRoute` abstraction) + loading skeleton. Ensure chunk name for 3D.

### 3. CRITICAL — Sequential awaits inside catalog queryFn
- **File:line:** `site/features/planner/open3d/catalog/catalogQuery.ts:19-22`  
- **Rule:** `async-parallel`  
- **Severity:** CRITICAL (client data fetch waterfall)  
- **Why it matters:** `loadOpen3dCatalog` does `await client.loadDescriptorsFromLoader();` then conditional `await client.loadFromApi(...)`. Delays catalog ready state for InventoryPanel.  
- **Bad code snippet:**
  ```ts
  await client.loadDescriptorsFromLoader();
  const descriptors = client.getAll();
  if (descriptors.length > 0) return ...
  const loaded = await client.loadFromApi("configurator", 200);
  ```
- **Suggested fix:** Use `Promise.all` where independent, or restructure client to parallelize descriptor + API probes (or make loader non-blocking).

### 4. HIGH — Missing 'use client' directive on 3D viewer modules (client hook usage)
- **File:line:** `site/features/planner/open3d/3d/ThreeViewerInner.tsx:8` (and `ThreeLazyViewer.tsx`)  
- **Rule:** (Client boundary / `client-*` + rendering correctness for deferred chunks)  
- **Severity:** HIGH (perf + correctness risk)  
- **Why it matters:** File uses `useState`/`useEffect`/`useRef` (plus dynamic `import("three")`). Even when lazy-loaded from client parent, missing directive violates Next RSC/client module contract and can cause hydration/chunk issues or force broader client bundling. Lazy3DViewer is rendered only in 3D branch but boundary must be explicit.  
- **Bad code snippet:**
  ```tsx
  // no 'use client' at top
  import { useEffect, useRef, useState } from "react";
  ...
  export function ThreeViewerInner(...) { ... useEffect... }
  ```
- **Suggested fix:** Add `"use client";` at top of `ThreeViewerInner.tsx` (and `ThreeLazyViewer.tsx` if it ever gains hooks). Verify with lazy load.

### 5. HIGH — Server auth + layout awaits not always parallelized across planner surfaces
- **File:line:** `site/app/planner/layout.tsx:27` + `site/app/planner/open3d/page.tsx` + `site/lib/auth/plannerSession.ts:12` (delegates to Supabase `getUser()`)  
- **Rule:** `server-parallel-fetching`, `async-parallel`  
- **Severity:** HIGH  
- **Why it matters:** `getOptionalPlannerUser` + other layout context can be combined; repeated in nested/child pages. Impacts server render time for all planner entries.  
- **Bad code snippet:** (See issue 1; also layout does single await but children repeat auth.)
- **Suggested fix:** Hoist auth where possible, use parallel in pages, or move to middleware/cached server util with `server-cache-react`.

### 6. MEDIUM-HIGH — Direct fetch in AI advisor without dedup/caching layer
- **File:line:** `site/features/planner/open3d/ai/advisorClient.ts:141`, `sketchToPlanClient.ts:187`  
- **Rule:** `client-swr-dedup` (or equivalent)  
- **Severity:** MEDIUM-HIGH  
- **Why it matters:** Raw `await fetch(...)` inside client actions; repeated calls (sketch, advisor) not deduped like catalog (which uses RQ). Can cause duplicate network + state thrash.  
- **Bad code snippet:**
  ```ts
  const response = await fetch(API_ROUTES.AI_ADVISOR, { ... });
  ```
- **Suggested fix:** Wrap AI calls in RQ `useMutation`/`useQuery` (already in workspace via QueryProvider) or add simple in-memory/request dedupe.

### 7. MEDIUM — Prop-to-state sync via useEffect (causes extra renders + derived state anti-pattern)
- **File:line:** `site/features/planner/open3d/canvas-fabric/FeasibilityCanvas.tsx:316-320`  
- **Rule:** `rerender-derived-state-no-effect`, `derived-state-no-effect`  
- **Severity:** MEDIUM (re-render thrash in canvas)  
- **Why it matters:** Effect sets internal `activeTool`/`activeCommandId` from prop on every change. Violates "compute during render" or lift state; causes double-render cycle + stale sync bugs.  
- **Bad code snippet:**
  ```tsx
  useEffect(() => {
    setActiveTool(activeToolProp);
    ...
  }, [activeToolProp]);
  ```
- **Suggested fix:** Treat `activeTool` as fully controlled from parent (OOPlannerWorkspace), remove local state + effect, or use `useEffectEvent` / derived where possible.

### 8. MEDIUM — Unstable return object from core hook + passed as prop
- **File:line:** `site/features/planner/open3d/editor/useWorkspaceCanvas.ts:148-158` (return `{ project, activeFloor, ..., updateProject }`); usage in `OOPlannerWorkspace.tsx:62`, passed to `FeasibilityCanvas` etc.  
- **Rule:** `rerender-memo`, `rerender-unstable-props`  
- **Severity:** MEDIUM  
- **Why it matters:** New object identity on every hook invocation. Even with stable methods via useCallback inside, the context object itself changes → forces re-renders of all consumers (canvas, shell children) unless heavy memoization.  
- **Bad code snippet:**
  ```ts
  return { project, activeFloor, history, selection, canUndo, ... };
  ```
- **Suggested fix:** Wrap return in `useMemo(..., [project, ... stable deps])` or use context + selectors / `useDeferredValue` for heavy consumers. Memoize `FeasibilityCanvas` etc.

### 9. MEDIUM — Inline event handlers, new arrays/JSX objects in every render passed as props
- **File:line:** `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx:410-470` (e.g. `floors={workspaceCanvas.project.floors.map(...)}`, `onExport={(format) => ...}`, `leftPanel={<InventoryPanel ... />}`, `statusLeft={<div>...</div>}`); similar in `WorkspaceShell.tsx:285+`, `FeasibilityCanvas.tsx:745+` (onPointerCancel inline), `InventoryPanel.tsx:870+` (map onClick arrows).  
- **Rule:** `rerender-no-inline-components`, `rerender-no-inline-functions`, `rendering-hoist-jsx`  
- **Severity:** MEDIUM (affects shell + panels + canvas on every interaction)  
- **Why it matters:** Creates fresh functions + element trees on every parent render. Passed to `WorkspaceShell` / panels → child re-renders even for unchanged subtrees. Common source of planner lag.  
- **Bad code snippet:**
  ```tsx
  <WorkspaceShell
    ...
    onExport={(format) => handleExport(format ?? "json")}
    floors={workspaceCanvas.project.floors.map((floor) => ({ id: floor.id, name: floor.name }))}
    leftPanel={<InventoryPanel catalogItems={catalog.items} ... />}
    statusLeft={<div className="...">... many pills ...</div>}
  >
  ```
- **Suggested fix:** Memoize `floors` array, hoist statusLeft to stable component or use `useMemo`, wrap inline arrows with `useCallback`, memoize `<InventoryPanel ... />` creation or use stable elements. Add `React.memo` to `InventoryPanel`, `PropertiesPanel`, `LayersPanel`, `PanelContainer`.

### 10. MEDIUM — Non-memoized complex panels + conditional render inside shell
- **File:line:** `site/features/planner/open3d/editor/WorkspaceShell.tsx:200+` (panelTitles object + resolvePanelOpen + many handlers recreated; conditional `{leftPanel && <PanelContainer>}` + backdrop); panels lack `memo`.  
- **Rule:** `rerender-memo`, `rendering-conditional-render`, `rendering-hoist-jsx`  
- **Severity:** MEDIUM  
- **Why it matters:** Shell re-renders on viewMode/tool/catalog changes; un-memoized children + inline conditionals recreate UI subtrees. Docking effects also observe panels.  
- **Suggested fix:** `React.memo(WorkspaceShell, ...)` or granular; hoist static JSX; use `useMemo` for `panelTitles` + `resolvePanelOpen` (deps are stable).

### Additional Observations (Bundle / Other)
- **Bundle positives/negatives:** `three` + 3D deferred via `lazy` + inner `await import("three")` (good, `bundle-defer-third-party`, `bundle-dynamic-imports`). No fabric runtime in open3d (legacy comments only). react-aria-components loaded eagerly via InventoryPanel (consider if deferrable for bundle). No `next/dynamic` for catalog/inventory or command palette.
- **Server serialization:** Layouts pass minimal props; client state (project) lives in client hooks (good).
- **Other potential:** `useOpen3dWorkspaceAutosave` + multiple effects; `useDockingSystem` has set-in-effect (documented with eslint-disable); viewport resize listener. `CommandPalette` and search use effects for reset.
- **No major finds:** No obvious missing keys in lists (most use `key={id}`); few barrel imports; extensive use of callbacks/memo in hot paths; Suspense + error boundary for 3D.

## Positive Patterns Observed
- `site/lib/layout/siteLayoutContext.ts:4` — `const [messages, locale] = await Promise.all([...])` (correct parallel).
- 3D viewer: `ThreeLazyViewer.tsx:75` (lazy + Suspense + ViewerErrorBoundary) + inner dynamic import. Only mounts on explicit 2D→3D toggle.
- `useOpen3dWorkspaceCatalog.ts` + RQ: `staleTime: 5min`, `retry:1`, fallback to demo items, `resolveItem` memoized.
- Heavy use of `useCallback`/`useMemo`/`useRef` in `OOPlannerWorkspace`, `useWorkspaceCanvas`, `FeasibilityCanvas`, panels.
- No component definitions inside render functions (grep confirmed across open3d/*.tsx).
- Dynamic import for host in guest workspace routes + skeleton.
- Internal loading/hydration guard (`if (!hydrated) return <loading>` in OOPlannerWorkspace) + autosave status.
- Specific (non-barrel) imports throughout open3d tree.
- QueryProvider uses `useState(() => new QueryClient())` singleton pattern.
- Error boundaries + aria live regions for UX.

## Skips / Limitations / Risks (per AGENTS.md + testing-handbook)
- **Skipped:** Full deep dive into non-open3d planner/ (e.g. full `site/features/planner/catalog/`, `store/`, legacy `_archive/`, marketing planner pages beyond entry); `site/components/` only spot-checked (ThreeViewer dynamic usage); exhaustive 64-rule matrix (focused on provided priority examples + evidence in targets); no typecheck/lint/build runs (would require `START.md` evidence capture under `results/<module>/...`, gate policy in `Failures.md` — not required for this review task); no runtime profiling or bundle analyzer output; no edits to source.
- **Risks:** Findings are static (code may have evolved guards/tests not visible); some "inline handler" cost is low for leaf DOM events; react-query already mitigates some fetch issues; 3D is off-by-default (reduces impact of bundle). Direct `/planner/open3d` is noted as "pilot".
- **No commands run:** Pure reads/greps. If verification needed later, wrap via `scripts/run-evidence-cmd.ps1` (per `START.md` / `TESTING.md`) and capture `<cmd>-run.json` + raw.log.
- **No blockers logged to Failures.md** (review-only background task; no new gate failures introduced; user-specified report location takes precedence for output). All skips noted here + in report.

## Recommended Next Steps (High-Impact Wins)
1. Fix the 2-3 sequential await sites in planner workspace pages (CRITICAL, low risk, 5min change).
2. Unify direct open3d route to use dynamic host (or extract shared `WorkspaceRoute`).
3. Parallelize catalog loader + add memo to hook return / panels.
4. Audit `useWorkspaceCanvas` return stability + FeasibilityCanvas prop sync effect.
5. Consider `React.memo` + `useDeferredValue` for canvas status / heavy panels.
6. Measure: after fixes, run `pnpm --filter oando-site run build` (evidence wrapped) + bundle analysis.

**Report path:** `results/react-best-practices-review.md`  
**High-level summary:** Several CRITICAL waterfalls and bundle inconsistencies found in planner entry + 3D path; strong use of React primitives and RQ in core, but re-render surface area high due to prop passing and effects in the interactive editor/canvas. Fixes are localized and low-risk for the stated priorities. No source changes made.

(End of report — evidence from direct file reads.)
