# 03b SVG Pipeline

Goal: clarify SVG editor, compiler, publish, and runtime authority.

## Modules

- SVG editor.
- SVG compiler.
- SVG runtime consumer.
- SVG assets.

## Allowed Scope

1. `site/features/planner/admin/svg-editor`
2. `site/features/planner/open3d/catalog/svg`
3. SVG compiler and publish adapters
4. Direct SVG tests

## Hard No-Go Scope

1. New SVG engine adoption without plan approval.
2. Asset deletion.
3. CDN upload.
4. Multiple equal SVG authorities.

## Initial Commands

```powershell
rg -n "svgPipelineRunner|svgCompiler|svg-catalog|SVGR|sprite|@svgdotjs" site
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs features/planner/open3d/catalog/svg --max-warnings=0
```

## Decision Required

Recovery target:

1. One SVG API boundary.
2. One compile authority.
3. One runtime contract.

Default decision for recovery:

1. Keep the current compiler path as the only recovery target.
2. Unify exec and in-process compile paths behind one authority.
3. Treat SVGR and sprite as later delivery choices, not recovery engines.

SVGR is allowed later only for trusted developer-owned UI SVG components.

SVG sprite is allowed later only for repeated static symbols.

## Exit Evidence

1. SVG authority decision.
2. Editor to compiler path.
3. Compiler to public/runtime path.
4. Remaining ambiguity.
5. Explicit SVGR/sprite defer decision.

## Stop Conditions

1. Two authorities remain.
2. Publish path is unclear.
3. Runtime consumer expects a different schema.
