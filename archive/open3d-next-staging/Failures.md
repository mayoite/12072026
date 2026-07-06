# Failures / Skips / Follow-ups

- Blocker: `pnpm exec tsc --noEmit` still fails across the frozen Svelte mirror files under `src/lib/stores/`, `src/store/`, and `src/shared/`. The live Next entrypoints compile and the Vitest suite passes, but repo-wide TypeScript is not clean.
- Follow-up: `proof-chair.svg` still 404s in the dev server logs. The browser path works, but the missing asset should be restored if the asset-backed proof view remains part of the app.
- Follow-up: if the dev server is opened from `127.0.0.1`, Next dev reports a websocket origin mismatch; `localhost` is the stable browser target for Playwright checks here.
- Follow-up: `pnpm build` still fails type checking on the legacy Svelte mirror import in `src/lib/stores/project.ts` (`svelte/store` is not available in this Next-only workspace). The donor shell port itself renders and passes the targeted Vitest suite.
