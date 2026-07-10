# Execute 1/5 — pure delete product path audit

**Date:** 2026-07-10  
**Seat:** Execute 1/5 (Mode A audit; Mode B only if RED)  
**Verdict:** **PATH OK** — no product fix; no commit

---

## Files audited

| File | Role | Result |
|------|------|--------|
| `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` | `applySelectionDelete` pure batch delete | GREEN |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` L328–335 | `deleteSelection` wire | GREEN |
| `site/features/planner/open3d/store/history.ts` L82–98 | `updateOpen3dProject` same-ref no-op | GREEN (read-only) |

---

## One-history-friendly proof

### 1. Same-ref no-op (`applySelectionDelete`)

Returns **identical project reference** when membership unchanged:

- `selection.type === "none"` or `ids.length === 0`
- unknown selection type (no collection)
- missing active floor
- all targeted ids locked or missing (`nextItems.length === items.length`)

```ts
if (nextItems.length === items.length) {
  return project;
}
```

### 2. Multi-id = one project revision

Single filter over `idSet`; one floor rewrite; one `{ ...project, floors }` return. Not N× `deleteEntityFromProject`.

### 3. Workspace wire = one history step

```ts
// OOPlannerWorkspace.tsx — no N-loop
workspaceCanvas.updateProject((project) =>
  applySelectionDelete(project, selection),
);
workspaceCanvas.setSelection({ type: "none", ids: [] });
```

`updateProject` → `document.update` → `updateOpen3dProject`:

```ts
if (updated === history.present) return history; // no past push on no-op
// else: past: [...past, present], present: stamped  // exactly one past entry
```

### 4. Unit suite (live)

```
pnpm exec vitest run tests/unit/features/planner/open3d/applySelectionDelete.test.ts
→ 9/9 passed (from site/)
```

Includes: same-ref none/empty/locked/missing; multi-id one revision; `updateOpen3dProject` multi-id **exactly one past**; undo restores id+pose.

---

## Mode B

**Not required.** Product path matches CODE-REVIEW-REPORT “Already exists”; no rewrite; no architecture change.

---

## Return

**path OK**
