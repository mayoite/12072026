# T3 — product honesty (tandem)

**Date:** 2026-07-18  
**Role:** Identity + publish correct so UI cleanup is not a lie.  
**Not PASS proof.** Browser C3 remains T4.

## Goal

Republish same slug keeps product `id` + `generatedAt`. Success copy shows stable slug + SKU. Guest lifecycle stays **live** on publish success.

## Fix

### P1 id reuse (already wired; verified + tests kept green)

| Piece | Path | Behavior |
|-------|------|----------|
| Load prior | `publishLinearDeskAction.ts` → `loadExistingIdentity(slug)` via `tryLoad` | If descriptor exists for guest slug → pass `{ id, generatedAt? }` |
| Build | `linearDeskPublishDescriptor.ts` → `buildLinearDeskPublishDescriptor` | Reuse non-blank `id`; freeze-compatible `generatedAt` when present; else mint id once |
| Guest slug | `ensureGuestVisibleSlug` before load + build | Load key matches published slug |
| Lifecycle | `setCatalogLifecycle(slug, "live")` on success | Guest placeable after parametric publish |

### Success copy (this pass)

- Added pure `formatLinearDeskPublishSuccess({ slug, sku })` in `linearDeskGuestIdentity.ts`.
- `LinearDeskParametricForm` success message uses it:  
  `Published {slug} · SKU {sku} (live, guest-visible). SVG /svg-catalog/{slug}.svg`
- Tiny form edit only (message + import). No chrome / CSS / Fabric / Planner.

## Tests (parent-verifiable)

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/admin/svg-editor/parametric/linearDeskPublishDescriptor.test.ts \
  tests/unit/features/admin/svg-editor/parametric/publishLinearDeskAction.test.ts \
  tests/unit/features/admin/svg-editor/parametric/linearDeskGuestIdentity.test.ts \
  tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx
```

**Result:** 4 files, **17 passed**, exit 0.

Coverage:

1. Pure builder reuses `id` + `generatedAt` on republish.
2. Pure builder mints when existing id is blank.
3. Action: `tryLoad` same guest slug → pipeline gets same `id` twice.
4. Action: still sets lifecycle **live**.
5. Success formatter + form message include slug **and** SKU.
6. Temp/mock only — no canonical catalog mutate.

## Ready for look?

**Yes for product identity.** T4 still owns browser publish + disk artifact + console 0.

## Do not claim

- Browser C3 PASS  
- DB cutover  
- Dual-write authority flip  

## Files touched

- `site/features/admin/svg-editor/parametric/linearDeskGuestIdentity.ts` — success formatter  
- `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx` — wire success copy  
- `site/tests/unit/.../linearDeskGuestIdentity.test.ts`  
- `site/tests/unit/.../linearDeskPublishDescriptor.test.ts`  
- `site/tests/unit/.../LinearDeskParametricForm.test.tsx`  
- (unchanged logic, already correct) `publishLinearDeskAction.ts`, `linearDeskPublishDescriptor.ts`

No commit (parent instruction).
