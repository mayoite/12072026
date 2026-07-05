# 07 — Single Descriptor Model Migration (Phase 2, plan now)

Owner: ______________
Target exit date: ______________
Depends on: 06 complete (needs real publish traffic to migrate safely)

## Problem

BlockDescriptor (svgTypes.ts) and SvgBlockDefinitionV1 (svgBlockSchemas.ts) coexist, bridged by
a publish-time adapter. This is acceptable short-term but must not become permanent.

## Work items (in order)

1. Document every consumer of BlockDescriptor and every producer of SvgBlockDefinitionV1.
2. Decide the single target model (recommend SvgBlockDefinitionV1 as the richer schema).
3. Write a one-time migration script for any persisted BlockDescriptor-shaped data (disk JSON,
   and later Supabase once Phase 08 lands).
4. Update the open3d catalog loader to consume the target model directly, removing the adapter.
5. Delete the bridge/adapter code once zero call sites reference the old model.
6. Capture evidence under results/site/phase-2/descriptor-migration/.

## Exit criteria

- Only one descriptor model exists in the codebase (grep-verified).
- Adapter code is deleted, not just unused.
- All three reference blocks from 06 still publish and render correctly post-migration.
