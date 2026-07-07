# 04b Design Tool Readiness

Goal: prepare Penpot-first design workflow and defer Code Connect until it is safe.

This phase is deferred.

## Entry Condition

Run only after:

1. Phase 02 defines design-to-code rules.
2. Phase 03b defines SVG authority.
3. Phase 04 stabilizes planner component homes.
4. Component paths are not actively moving.

## Modules

- Penpot-first design workflow.
- Optional Figma-to-code.
- Shared UI components.
- Planner stable components.
- Admin stable components.

## Allowed Scope

1. `docs/architecture/DESIGN-SYSTEM-INTAKE.md`
2. Stable component inventory docs
3. Penpot export notes
4. Code Connect readiness notes
5. Existing component path scans

## Hard No-Go Scope

1. Creating Code Connect mappings without user confirmation.
2. Mapping unpublished Figma components.
3. Mapping unstable admin or Open3D paths.
4. Treating Code Connect as a repair engine.
5. Adding design-tool packages without proof.

## Tool Truth

Penpot is first because it is free, open-source, and SVG/CSS-friendly.

Code Connect maps published Figma library components to existing code components.

It does not:

1. Fix design tokens.
2. Implement screens.
3. Repair SVG publishing.
4. Work on unpublished parts.
5. Stabilize moving component paths.

## Read First

1. `docs/architecture/DESIGN-SYSTEM-INTAKE.md`
2. `docs/architecture/MODULE-LAYOUT.md`
3. `docs/architecture/MODULE-UI-CONTRACT.md`
4. `Plans/02-recovery/phases/02-styling-contract.md`
5. `Plans/02-recovery/phases/03b-svg-pipeline.md`
6. `Plans/02-recovery/phases/04-planner-open3d.md`

## Initial Checks

```powershell
rg -n "export function|export const|export default|forwardRef|memo" site/components site/features/planner site/features/crm site/lib/ui
rg -n "Penpot|penpot|figma|Figma|Code Connect|code connect|node-id|componentName" docs Plans site
```

## Exit Evidence

1. Penpot workflow decision.
2. Stable component candidate list.
3. Figma published component prerequisites, if Figma is used.
4. Mapping risks.
5. Deferred mappings list.

## Stop Conditions

1. Component homes are still moving.
2. Penpot export policy is unclear.
3. Figma components are not published.
4. User has not confirmed mappings.
5. Figma plan does not support Code Connect.
