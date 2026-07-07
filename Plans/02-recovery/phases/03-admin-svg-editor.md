# 03 Admin SVG Editor

Goal: fix the first admin SVG lint cluster only.

## Modules

- Admin.
- SVG editor.

## Allowed Scope

1. `site/features/planner/admin/svg-editor`
2. Direct tests for admin SVG editor
3. Direct CSS needed by that module

## Hard No-Go Scope

1. Planner runtime behavior outside SVG consumer boundary.
2. Broad admin redesign.
3. Package removal.
4. Publish/save/compiler semantics.

## Read First

1. `gpt5.5.md`
2. `docs/architecture/MODULE-LAYOUT.md`
3. Admin workflow docs if route behavior is touched

## Initial Commands

```powershell
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs features/planner/admin/svg-editor --max-warnings=0
pnpm --filter oando-site run typecheck
```

## Artifact Path

```text
results/admin-svg/03-admin-svg-editor/eslint-admin-svg/eslint-admin-svg-run.json
results/admin-svg/03-admin-svg-editor/eslint-admin-svg/eslint-admin-svg-raw.log
```

## Exit Evidence

1. Scoped lint result.
2. Typecheck result, if run.
3. Exact remaining admin SVG failures.
4. Confirmation that publish/save/compiler semantics were not touched.

## Admin Functionality Matrix

Route existence is not functionality.

Use this matrix only if route behavior is explicitly in scope.

Record:

| Field | Required |
| --- | --- |
| Route | Admin URL |
| Role | Guest, member, admin |
| Expected gate | Redirect, deny, or allow |
| Save behavior | None, draft, publish, or blocked |
| Evidence | Command, browser artifact, or skipped reason |

## Likely Failures

1. Unused vars.
2. Import type rules.
3. Forbidden dynamic import type annotations.
4. TSX styling drift.

## Stop Conditions

1. Lint fix changes SVG semantics.
2. Admin auth gate blocks verification.
3. Typecheck failure is outside admin SVG scope.
4. Admin role behavior is unknown.
