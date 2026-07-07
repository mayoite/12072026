# 04d Planner SVG Consumer

Goal: repair or prove planner SVG consumer.

## Entry Condition

Phase 03b must define SVG authority first.

## Allowed Scope

1. `site/features/planner/open3d/catalog/svg`
2. SVG consumer tests
3. Runtime schema adapters

## Hard No-Go Scope

1. SVG compiler authority changes.
2. SVGR adoption.
3. Sprite adoption.
4. CDN upload.

## Boundary Standard

The planner consumes a runtime SVG contract.

It does not own the authoring or publish authority.

## Initial Checks

```powershell
rg -n "svg-catalog|SvgBlock|BlockDescriptor|svgCompiler|svgPipelineRunner|public/svg-catalog" site/features/planner/open3d site/features/planner/admin site/public
```

## Artifact Path

```text
results/planner/04d-planner-svg-consumer/svg-consumer/svg-consumer-run.json
results/planner/04d-planner-svg-consumer/svg-consumer/svg-consumer-raw.log
```

## Exit Evidence

1. Runtime SVG contract.
2. Consumer schema expectations.
3. Compile/publish dependency.
4. Remaining mismatch.

## Stop Conditions

1. SVG authority is unresolved.
2. Runtime schema differs from publish schema.
3. Fix requires CDN upload.
