# Site app folder resolve

**Owner:** execution agent  
**Scope:** `site/app/` only (plus mirrors under `site/tests/unit/app/`)  
**Goal:** Close unit-test gaps, remove or wire orphans. No silent skips. No broken imports.

## Rules

- Use `pnpm` from repo root. Never install inside `site/`.
- No `any` in handwritten code.
- No suppressed tests / `test.skip` / silent `if (!x) return`.
- Tests never mutate canonical catalog files.
- No commit/push unless owner asks.
- No worktrees.
- Verify with commands; do not trust old reports.

## Facts (current)

### A — Unit test gaps

| Kind | Missing |
|------|---------|
| `page.tsx` | `admin/price-books/page.tsx`, `planner/(workspace)/canvas/page.tsx` |
| `layout.tsx` | `(site)/layout.tsx`, `(site)/dashboard/layout.tsx`, `(site)/portal/layout.tsx`, `(site)/portal/svg-catalog/layout.tsx`, `(site)/products/[category]/[product]/layout.tsx`, `planner/(marketing)/layout.tsx` |
| `route.ts` | `api/admin/price-books` (+ `[bookId]`, `[bookId]/action`), `api/admin/svg-editor/ai-generate`, `bulk-import`, `[slug]/lifecycle`, `revisions`, `rollback`, `api/dev/auth-bypass-status`, `api/planner/catalog/configurator`, `catalog/svg-blocks`, `generated-glb`, `project-sketch` |

### B — Missing import links

- **0** broken `@/` or relative imports under `site/app/`. No work unless verification finds new breaks.

### C — Orphans

| Path | Action |
|------|--------|
| `app/(site)/providers/LenisProvider.tsx` | Product never imports it. **Delete** file + unit test, **or** wire into `(site)/layout.tsx` if product still wants Lenis. Default: **delete** (dead code). |
| `app/planner/plannerProducts.ts` | 0 product importers; only unit test. **Delete** module + test **or** import from planner pages that need catalog products. Default: **delete** if no page needs it after code search. |
| `app/admin/buddy-catalog/` | Empty dir; redirects in `next.config`. **Remove empty directory** if git tracks nothing; keep redirects. |

## Plan (order)

### Task 1 — Orphans first (blast radius small)

1. Confirm no product import of `LenisProvider` / `plannerProducts` (rg across `site/` excluding tests).
2. Delete dead files + their unit tests, **or** wire if a single clear call site exists.
3. Remove empty `admin/buddy-catalog` if empty.
4. Run: `pnpm --filter oando-site exec vitest run` on affected test paths (expect delete = fewer files, no fail).

### Task 2 — Missing page tests

Add mirror tests under `site/tests/unit/app/…`:

1. `admin/price-books/page.test.tsx` — render/smoke with mocks for data/auth as sibling admin pages do.
2. `planner/(workspace)/canvas/page.test.tsx` — same pattern as other workspace page tests.

Copy structure from nearest existing `page.test.tsx` in the same tree. Hard expects only.

### Task 3 — Missing layout tests

Add `layout.test.tsx` for each of the 6 layouts. Smoke: exports default, renders children or calls expected chrome. Match existing layout tests under `tests/unit/app/`.

### Task 4 — Missing route tests

For each missing `route.ts`, add `route.test.ts` that:

- Imports `GET`/`POST`/etc. that exist.
- Mocks auth/rate-limit/db as sibling route tests do.
- Asserts status + envelope for happy path **and** at least one failure path (auth/validation).
- No skip.

Priority order inside this task:

1. `api/dev/auth-bypass-status` (small)
2. `api/admin/price-books/*` (3 files)
3. `api/planner/catalog/*` + `generated-glb` + `project-sketch`
4. `api/admin/svg-editor/*` remaining

### Task 5 — Verify

```text
pnpm --filter oando-site exec vitest run tests/unit/app/admin/price-books tests/unit/app/planner tests/unit/app/api/admin/price-books tests/unit/app/api/dev tests/unit/app/api/planner tests/unit/app/api/admin/svg-editor --reporter=dot
pnpm run check:layout
```

Re-scan:

- page/route/layout missing mirrors → must be **0** for listed paths.
- broken imports from `app/` → still **0**.
- orphan product modules listed above → **gone** or **wired**.

### Done when

- [ ] Listed orphans resolved (delete or wire).
- [ ] All listed missing page/layout/route have real unit tests passing.
- [ ] No new `test.skip` / hollow `expect(true)`.
- [ ] `check:layout` passes.
- [ ] Short note in response: files added/removed + test command output summary.

## Out of scope

- Full e2e suite.
- Renaming `/admin/planner-catalog` product routes.
- Deleting legacy API shims still mounted (`/api/ai/advisor`, etc.) unless product callers are zero **and** tests updated.
