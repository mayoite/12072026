# P0.3 part B — `data-viewport` hydration (A3)

**Status:** DONE  
**Date:** 2026-07-09  
**Scope:** Hydration mismatch only (`data-viewport` desktop vs tablet). Nested `main` / unlabeled field are out of this slice’s claim unless already co-landed in the working tree.

## Problem

Live capture (`results/planner/a11y-open3d/console-messages.txt`):

```text
React hydration mismatch: data-viewport server=desktop client=tablet on workspace_shell / workspace
```

SSR emitted `data-viewport="desktop"`; first client paint used a measured tier (`tablet` at Playwright ~tablet width).

## Root cause (systematic)

| Layer | Behavior before fix |
|-------|---------------------|
| `getViewportTier()` | SSR (`window` undefined) → `"desktop"`; client → reads `window.innerWidth` |
| `useState(getViewportTier)` | React treats a function as **lazy initializer** and **calls it on both server and client**. Client call measured tablet; SSR stayed desktop. |
| `WorkspaceShell` | Rendered `data-viewport={viewportTier}` on shell + workspace on first paint → mismatch in the DOM attribute. |
| Resize effect | Listened for `resize` only; never forced a post-mount re-measure after a stable default (would not fix first paint alone). |

Mismatch path:

1. Server HTML: `data-viewport="desktop"`
2. Client hydrate first paint: `data-viewport="tablet"` (1024px-class viewports)
3. React hydration error (A3)

## Fix (two cooperating layers)

### 1. Stable SSR + first-client-paint default — `useDockingSystem.ts`

- Export `SSR_VIEWPORT_TIER = "desktop"`.
- `useState(SSR_VIEWPORT_TIER)` — **do not** pass `getViewportTier` as the `useState` initializer (that re-reads `window` on the client).
- `useEffect`: measure with `getViewportTier()` on mount + `resize` listener.
- Layout branches that depend on `viewportTier` also hydrate against the same default until mount measure.

### 2. Client-after-mount attribute — `WorkspaceShell.tsx`

- `viewportAttrReady` starts `false`.
- `data-viewport={viewportAttrReady ? viewportTier : undefined}` on **shell** and **workspace**.
- SSR + first client paint: attribute **absent** (identical).
- After mount: attribute set to measured tier (desktop / tablet / small).

Belt-and-suspenders: even if tier state ever diverged before ready, the attribute is not in the hydrate tree until after mount.

## Evidence

| Artifact | Meaning |
|----------|---------|
| `vitest-raw.log` | Full unit run (UTF-8) |
| `run.json` | Machine-readable summary |

```text
npx vitest run tests/unit/features/planner/open3d/workspaceShell.test.tsx
→ 30/30 passed
```

P0.3 contract / viewport tests include:

- `SSR_VIEWPORT_TIER is a stable desktop default (not window-measured)`
- `useDockingSystem measures real width only after mount (tablet range)`
- `WorkspaceShell sets data-viewport after mount to measured tier (no SSR/client attr split)`
- `detects tablet tier after mount without hydrating from window on first paint`
- `shell data-viewport matches measured tier after mount (tablet client)`

## Files touched

- `site/features/planner/open3d/editor/useDockingSystem.ts` — stable `SSR_VIEWPORT_TIER`; mount measure + resize
- `site/features/planner/open3d/editor/WorkspaceShell.tsx` — omit `data-viewport` until mount
- `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` — P0.3 regression + tablet/small after-mount cases

## Not claimed in this slice

- Full browser re-capture under `results/planner/a11y-open3d/` (optional follow-up)
- Unlabeled form field (A2)

**No commit made.**
