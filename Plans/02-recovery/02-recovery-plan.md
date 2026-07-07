# Recovery Plan

Date: 2026-07-07

Goal: recover truth and repair one module at a time.

## Rules

- Truth wins.
- Short checks after each module.
- Full gate only after lint and typecheck are close.
- Commit and push about every 15 minutes.
- No subagents unless explicitly requested.
- No hidden test claims.
- Keep `.env.local` ignored.

## Recovery Order

| Order | Module | Goal | Exit check |
| --- | --- | --- | --- |
| 0 | Repo baseline | Keep the new repo clean and pushed | `git status -sb` |
| 1 | Package policy | Remove drift from decisions | package/import audit |
| 2 | CSS and Tailwind | Stop UI drift at the rules layer | `lint:ui` |
| 3 | Admin SVG editor | Fix first lint cluster | scoped lint |
| 4 | SVG pipeline | Confirm compiler and publish boundaries | targeted SVG tests |
| 5 | Planner Open3D | Repair planner UI and command flow | open3d tests |
| 6 | Auth | Prove route gates | targeted auth tests |
| 7 | Database | Prove DB config and Drizzle paths | env + DB scripts |
| 8 | CRM | Decide real vs placeholder | route/API inventory |
| 9 | CDN/assets | Prove asset source and audit flow | CDN audit |
| 10 | Deployment | Prove build path | lint, typecheck, build |
| 11 | Tech-stack docs | Regenerate only after truth stabilizes | docs checks |
| 12 | Site UI | Repair marketing/site drift | site UI checks |

## First Recovery Block

Start with package policy.

Why:
- It is cheap.
- It prevents wrong repairs.
- It decides what imports are allowed.

Steps:
1. Audit imports for banned or questionable packages.
2. Mark keep/remove/defer.
3. Remove unused packages only after proof.
4. Update package docs only after manifest truth is known.

## Stop Conditions

Stop and report if:
- A change needs a package removal with runtime risk.
- A test failure crosses module boundaries.
- A secret or env file would be staged.
- A database migration would be required.
- A remote push fails.

