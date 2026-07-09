# 09 Deployment

Goal: prove local deployability.

## Modules

- Deployment.
- Build config.
- Release gate.
- Bundler proof.

## Allowed Scope

1. Build config
2. Vercel config
3. Scripts needed for build correctness

## Hard No-Go Scope

1. Deploying.
2. Secret edits.
3. Ignoring lint or type errors.
4. Replacing webpack with Turbopack during recovery.

## Initial Commands

```powershell
pnpm run lint
pnpm run typecheck
pnpm run build
```

## Artifact Path

```text
results/deployment/09-deployment/<cmd>/<cmd>-run.json
results/deployment/09-deployment/<cmd>/<cmd>-raw.log
```

## Env And Build Matrix

Record:

| Field | Required |
| --- | --- |
| Revision | Commit hash |
| Env file | `.env.local`, CI, Vercel, or other |
| Command | Exact command |
| Exit code | Numeric |
| Artifact path | `results/<module>/<phase>/<cmd>/...` |
| Warnings | Classified or blocker |
| Skips | Reason |

All deployability claims require one unchanged revision.

## Release Gate

```powershell
pnpm run release:gate
```

Run release gate only after blockers are credible.

## Turbopack Spike

Do not replace `next dev --webpack` during step 2.

Turbopack review is deferred until:

1. Lint is credible.
2. Typecheck is credible.
3. Build is credible.

Spike goals:

1. Compare webpack and Turbopack behavior.
2. Check CSS Module behavior.
3. Check custom webpack/plugin assumptions.
4. Check bundle analysis needs.
5. Record whether migration is safe.

Package bundling review belongs here only after live bundle proof.

## Exit Evidence

1. Lint result.
2. Typecheck result.
3. Build result.
4. Release gate result, only if run.
5. Turbopack spike result, only if run.
6. Env matrix and build matrix.

## Stop Conditions

1. Lint still has broad failures.
2. Typecheck fails outside current scope.
3. Build depends on missing env.
4. Bundler change is needed before baseline is stable.
