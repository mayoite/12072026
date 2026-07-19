# Testing Handbook

Root testing reference. Use together with `AGENTS.md`, `Readme.md`, and `package.json`.

## Core Rules
- Fresh command output wins.
- Old reports and old `results/` files prove nothing.
- Unit green is **not** browser proof.
- UI claims require browser proof.
- No hidden skips.
- No forced clicks.
- Do not raise timeouts without naming the cause.
- Tests must never mutate canonical catalog or real product data.
- Clean up test data even on failure.
- Use `pnpm` from repo root.
- Never install inside `site/` or `tech-docs-generator/`.
- Store raw output under root `results/`.
- Never write test output under `site/results/` or `site/test-results/`.

## Report Requirements
Always report:
- Command
- Working directory (cwd)
- Scope
- Exit code
- What was not verified
- Any blockers

For browser checks also report:
- Route
- Journey
- Console errors
- Failed requests
- Accessibility result
- Trace / screenshots

## Core Commands (run from repo root)
| Need              | Command                              |
|-------------------|--------------------------------------|
| Layout            | `pnpm run check:layout`              |
| Agent docs        | `pnpm run check:agents-md`           |
| Root links        | `pnpm run docs:check:root-links`     |
| Lint              | `pnpm run lint`                      |
| Typecheck         | `pnpm run typecheck`                 |
| Unit tests        | `pnpm run test`                      |
| P0 smoke          | `pnpm run p0`                        |
| Build             | `pnpm run build`                     |
| Fast gate         | `pnpm run gate`                      |
| Release gate      | `pnpm run release:gate`              |
| Secrets           | `pnpm run lint:secrets`              |

Use the **smallest command** that proves the claim.  
Do not run broad gates for tiny changes.

## Focused Tests
```powershell
pnpm --filter oando-site run <script>
pnpm --filter oando-site exec vitest run <test-file>
pnpm --filter oando-site exec playwright test -c config/build/playwright.config.ts <spec-file> --reporter=list