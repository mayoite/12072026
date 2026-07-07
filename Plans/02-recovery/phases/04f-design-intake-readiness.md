# 04f Design Intake Readiness

Goal: prepare Penpot-first design workflow.

Code Connect stays out of recovery.

This phase is deferred.

## Entry Condition

Run only after:

1. Phase 02 defines design-to-code rules.
2. Phase 03b defines SVG authority.
3. Planner component homes are stable.
4. Component paths are not actively moving.

## Modules

- Penpot-first design workflow.
- Optional Figma notes.
- Shared UI components.
- Stable planner components.
- Stable admin components.

## Allowed Scope

1. `docs/architecture/DESIGN-SYSTEM-INTAKE.md`
2. Stable component inventory docs
3. Penpot export notes
4. Existing component path scans

## Hard No-Go Scope

1. Creating Code Connect mappings.
2. Mapping unpublished Figma components.
3. Mapping unstable admin or Open3D paths.
4. Treating Code Connect as a repair engine.
5. Adding design-tool packages without proof.

## Tool Truth

Penpot is first because it is free, open-source, and SVG/CSS-friendly.

Figma is optional later.

Code Connect is deferred out of recovery.

## Initial Checks

```powershell
rg -n "export function|export const|export default|forwardRef|memo" site/components site/features/planner site/features/crm site/lib/ui
rg -n "Penpot|penpot|figma|Figma|Code Connect|code connect|node-id|componentName" docs Plans site
```

## Artifact Path

```text
results/design/04f-design-intake-readiness/component-inventory/component-inventory-run.json
results/design/04f-design-intake-readiness/component-inventory/component-inventory-raw.log
```

## Exit Evidence

1. Penpot workflow decision.
2. Stable component candidate list.
3. Export/import policy risks.
4. Deferred Figma/Code Connect list.

## Stop Conditions

1. Component homes are still moving.
2. Penpot export policy is unclear.
3. User asks for Code Connect during recovery.
4. Design-tool package adoption is requested without proof.
