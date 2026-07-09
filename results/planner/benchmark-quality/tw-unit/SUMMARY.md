# TW-UNIT — Console + symbol root-cause locks (Agent 3)

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026`  
**Agent:** TEST WRITER (unit) — console+symbol fixes  
**Verdict:** **PASS** — 46/46

## Command

```bash
cd site
pnpm exec vitest run \
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts \
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts \
  tests/unit/features/planner/open3d/readThemeColor.test.ts \
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts \
  --reporter=verbose
```

## Results

| Suite | File | Pass | Fail |
|-------|------|------|------|
| createSceneObjectFromNode | `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` | **13** | 0 |
| cabinet-v0 Block2D | `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | **13** | 0 |
| readThemeColor | `site/tests/unit/features/planner/open3d/readThemeColor.test.ts` | **11** | 0 |
| renderBlock2DToCanvas (incl. furnitureBlock2DFromItem) | `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` | **9** | 0 |
| **Total** | | **46** | **0** |

Raw log: `vitest-raw.log`

## Behaviors locked (purpose over %)

### 1. Wall `var(--text-inverse-body)` → THREE material (console root cause)

**File:** `createSceneObjectFromNode.test.ts`

| Assertion | Why real |
|-----------|----------|
| `expect(() => createSceneObjectFromNode(..., color: "var(--text-inverse-body)")).not.toThrow()` | No material ctor crash |
| `mat.color` is `THREE.Color`, hex matches `/^[0-9a-f]{6}$/i`, `getHex()` finite | Valid material color |
| `getHexString() === "9ca3af"` when theme missing | Proves **resolve path** used wall hexFallback — **not** raw THREE.Color white `ffffff` (silent parse fail + console warn) |
| Theme token set → material hex equals token | Live resolvePaintColor path |
| Round-trip `new THREE.Color('#${hex}')` | Hex is legal THREE input |

Production: `resolveThreeMaterialColor` in `createSceneObjectFromNode.ts` via `resolvePaintColor`.

### 2. cabinet-v0 plan symbol light fill + multi-prim (mesh_symbol root cause)

**Files:** `furnitureBlock2D.cabinet-v0.test.ts` (strengthened), `renderBlock2DToCanvas.test.ts` (parent)

| Assertion | Why real |
|-----------|----------|
| Outer rect fill `=== "var(--block-surface)"` | Light surface token |
| fill/stroke **not** `block-storage` / `text-inverse-body` | Not opaque inverse-body blob |
| `prims.length >= 4`, `lines.length >= 2` | Multi-prim detail present |
| Line strokes not block-storage / inverse-body | Detail stays dark-readable |

Production: `modularCabinetBlock` in `furnitureBlock2D.ts` uses `BLOCK_STYLE.surface` not `storage`.

### 3. resolvePaintColor / readThreeThemeColor var() unit

**File:** `readThemeColor.test.ts` (**new**)

| Assertion | Why real |
|-----------|----------|
| `var(--token)` + bare `--token` resolve from document | Primary paint path |
| Explicit hex/rgb pass-through | User paint unchanged |
| Missing token throws (`resolvePaintColor` / `readThemeColor`) | Caller must catch for THREE |
| Resolved value legal for `THREE.Color` | End of var→hex chain |
| `readThreeThemeColor` returns theme or hex fallback | SSR/missing-token adapter |

## Artifacts

- `results/planner/benchmark-quality/tw-unit/vitest-raw.log`
- `results/planner/benchmark-quality/tw-unit/SUMMARY.md`
