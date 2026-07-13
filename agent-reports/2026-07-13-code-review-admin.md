# Code review — Admin (commit `8dcfa875` + working-tree noise)

**Date:** 2026-07-13  
**Mode:** read-only review (no product edits, no commit)  
**Scope:** Admin product/test surface under `site/features/planner/admin/`, `site/tests/unit/admin/`, `site/tests/e2e/admin-*.spec.ts`, `plan/Admin/CHECKLIST.md`, `Failures.md`  
**Out of scope:** `PROTECTED/`, `.tmp`, block-descriptors pollution as intentional product (flagged only where it proves a bug)

## Git context

### `git log -5` (from `.git/logs/HEAD` + `refs/heads/main`)

`main` tip: `8dcfa87596379757db437c42fdb351e3f69a5794`

| # | Commit | Subject |
|---|--------|---------|
| 1 | `8dcfa875` | Admin: live suite, coverage unit tests, Failures.md residual |
| 2 | `cb00cc54` | Admin: close residual unit-completable Phase 2-4 checklist items |
| 3 | `5bdd499d` | Admin Phase 4: price-book governance, roles, audit, and release confirm |
| 4 | `969a4ff9` | Admin Phase 4: price book currency display and explicit version metadata |
| 5 | `2f82240f` | Admin Phase 2: ADM-LIST-01..04 inventory search, sort, page, family groups |

### `git show --stat 8dcfa875`

Packed object only in this environment (zlib git object; no shell decompress). Content of that tip commit, from message + live tree inspection of Admin work, centers on:

- Client/server split of price-book governance (`priceBookGovernance.ts` pure vs `priceBookGovernance.server.ts` `node:fs` audit)
- Live Playwright suite `admin-phases-live.spec.ts`
- Expanded unit coverage under `tests/unit/admin/` (pricing + residuals)
- Checklist / `Failures.md` residual honesty
- CSS contrast fix for `.admin-badge--warn`

**Uncommitted / tree noise (observed, not reviewed as product PASS):**

- `site/data/admin/price-books/pb-linear-2026-q3.json` left at `status: "rolled_back"` after e2e
- `site/data/admin/price-books/_price-book-audit.jsonl` filled with e2e audit rows
- Matches `Failures.md` RISK entry for price-book seed/audit dirt

## Summary

The price-book **client bundle fix** (pure helpers vs server audit I/O) is real and necessary. Unit coverage around governance, file store, and admin server helpers is substantive and mostly uses temp dirs correctly.

The live Admin suite is useful smoke under `DEV_AUTH_BYPASS=1`. It is **not** production-auth proof, **not** DB-SVG proof, and **not** full commercial multi-role proof.

**Brutal truth:** checklist lines that claim server-side author/approver/viewer enforcement and “activation requires explicit approval” are **over-claimed**. Commercial role is **client-supplied** (default fail-open to `approver`). Activate allows **draft**. Fail-closed activation is incomplete after successful `saveBook`. E2E price-book journey mutates **shared product seed** and leaves it `rolled_back`, which is a lifecycle dead-end in the UI.

**Issue counts:** 7 bug · 5 suggestion · 3 nit · **15 total**

**Top bugs (priority):**

1. Client-trusted commercial role + default `approver` (authz fail-open)
2. Activate allowed from draft (skips approve gate vs product claim)
3. Activate/approve save-then-emit without restore on emit failure
4. E2E mutates canonical price-book seed/audit (isolation + dirty tree)
5. Rollback of sole version leaves no re-entry path (stuck `rolled_back`)

---

## Issues

### 1. Commercial role is client-controlled; missing/invalid defaults to approver

- **Severity:** bug  
- **File:** `site/app/api/admin/price-books/[bookId]/action/route.ts:21-24` and `:58-63`  
- **Description:** `parseRole` trusts `body.role`. Invalid/missing role becomes `"approver"`. Any caller who passes `withAuth({ role: "admin" })` can claim author/viewer/approver at will. UI even posts a free-selected role (`AdminPriceBookPageView` “Acting role”). Checklist claims author/approver/viewer are enforced server-side; only **admin vs non-admin** is real.  
- **Suggestion:** Derive commercial capability from server session claims (or a server map of admin→price-book capability). Reject unknown role. Never default to `approver`. Drop client role from the request body, or treat it as display-only.  
- **Status:** open  

### 2. Activation does not require prior approval

- **Severity:** bug  
- **File:** `site/features/planner/admin/pricing/priceBookService.ts:92-98`  
- **Also:** `site/features/planner/admin/pricing/priceBookGovernance.ts:75-81`  
- **Also:** unit documents intentional draft activate: `site/tests/unit/admin/pricing/priceBookService.test.ts:144-173`  
- **Description:** Service and UI allow activate from `draft` **or** `approved`. Checklist Phase 4 says “Activation requires explicit approval.” That claim is false in code.  
- **Suggestion:** Restrict activate to `approved` only unless product owner explicitly accepts draft→active. Align checklist text if draft activate is intentional.  
- **Status:** open  

### 3. Fail-closed activation is incomplete after successful save

- **Severity:** bug  
- **File:** `site/features/planner/admin/pricing/priceBookService.ts:108-128`  
- **Description:** `saveBook` runs first. If `emitPriceBookContract` fails, the function returns `ok: false` **without** restoring the prior book/versions. Store already points at the new active version. History-loss path restores; emit-failure path does not. Same pattern on approve (`saveBook` then emit, no restore) at `:196-207`. Contradicts “Failed activation preserves the previous active version.”  
- **Suggestion:** Emit/validate before persist, or on any post-save failure re-`saveBook` the snapshot (same as history-loss branch). Add a unit that asserts store state after emit failure.  
- **Status:** open  

### 4. Price-book e2e mutates shared product seed and audit

- **Severity:** bug  
- **File:** `site/tests/e2e/admin-pricing-pricebook-p05.spec.ts:6-8`  
- **Also:** `site/features/planner/admin/pricing/priceBookAdmin.server.ts:74-78` (`resetDefaultPriceBookSeed` → default dir)  
- **Evidence:** `site/data/admin/price-books/pb-linear-2026-q3.json` currently `status: "rolled_back"`; `_price-book-audit.jsonl` contains e2e reasons.  
- **Description:** Violates AGENTS test isolation (“Tests never mutate canonical catalog files” / keep tests on temp dirs). Parallel e2e or a failed mid-journey leaves shared commercial state dirty for every other run and for local Admin UI.  
- **Suggestion:** Inject a temp price-books dir for e2e (env or test-only server override). Never call reset/write on `PRICE_BOOKS_DIR_DEFAULT` from Playwright. Restore hygiene of seed files before any release commit.  
- **Status:** open  

### 5. Sole-version rollback leaves a lifecycle dead-end

- **Severity:** bug  
- **File:** `site/features/planner/admin/pricing/priceBookService.ts:255-267`  
- **Also:** UI gates: `priceBookGovernance.ts:49-100` (approve needs draft; activate needs draft/approved; rollback needs active)  
- **Description:** Rolling back the only version marks it `rolled_back` and clears `activeVersionId`. There is no Admin path to create a new draft version. Approve cannot target `rolled_back`. After e2e, seed is stuck; buttons all disabled for meaningful actions.  
- **Suggestion:** Either allow re-draft from rolled_back for operators, or always keep a draft successor on rollback, or seed multi-version fixtures. Block sole-version rollback with a clear error if product forbids empty commercial books.  
- **Status:** open  

### 6. Server rollback does not require target status `active`

- **Severity:** bug  
- **File:** `site/features/planner/admin/pricing/priceBookService.ts:245-267`  
- **Description:** UI only enables rollback for `active`, but API accepts any `versionId`. Rolling back a non-active version marks that version `rolled_back` and demotes any current `active` to `approved`, then may promote another approved. That is a silent commercial demotion of the live book.  
- **Suggestion:** Require `target.status === "active"` (and `book.activeVersionId === versionId`) server-side. Add unit for draft/approved rollback rejection.  
- **Status:** open  

### 7. Audit write failures are swallowed on commercial actions

- **Severity:** bug  
- **File:** `site/features/planner/admin/pricing/priceBookAdmin.server.ts:132-137`  
- **Description:** `appendPriceBookAudit` errors are empty-caught. Action still returns success. Checklist treats audit as a required commercial control (ADM-AUDIT-01). Disk-full or permission failure yields silent non-audit.  
- **Suggestion:** Fail closed (or return success with explicit `auditPersisted: false` and surface UI warning). At minimum log and metric; do not pretend ADM-AUDIT-01 is guaranteed.  
- **Status:** open  

### 8. Live suite collects page errors but never asserts them

- **Severity:** suggestion  
- **File:** `site/tests/e2e/admin-phases-live.spec.ts:155-166` and `:196-212`  
- **Description:** `collectPageErrors` writes console/pageerror to logs then discards them. A green smoke can hide runtime exceptions.  
- **Suggestion:** `expect(errors, …).toEqual([])` after each route, with an allowlist if needed.  
- **Status:** open  

### 9. Primary Admin journeys smoke is shallow outside price-book/svg

- **Severity:** suggestion  
- **File:** `site/tests/e2e/admin-phases-live.spec.ts:91-134`  
- **Description:** Catalog / inventory / planner-catalog / workspace-catalog only assert “some h1/main/testid visible.” Not acceptance for Phase 2/3 product claims.  
- **Suggestion:** Keep as smoke, but do not use suite green to close browser residual checklist items for those areas.  
- **Status:** open  

### 10. Audit history not loaded on first paint or GET reload

- **Severity:** suggestion  
- **File:** `site/app/admin/price-books/page.tsx:14-17`  
- **Also:** `site/app/api/admin/price-books/[bookId]/route.ts:15-19`  
- **Also:** `AdminPriceBookPageView.tsx:68-82`  
- **Description:** Page SSR passes only `initialContract`. GET returns `{ snapshot, contract }` without `history`. History appears only after a successful/failed action response that includes audit. Fresh visit shows “No audit events yet” even when `_price-book-audit.jsonl` has rows.  
- **Suggestion:** `readAdminPriceBookAudit` on page and GET; pass `initialHistory`.  
- **Status:** open  

### 11. ADM-PRICE-02 visual distinction incomplete for approved vs active

- **Severity:** suggestion  
- **File:** `site/features/planner/admin/pricing/AdminPriceBookPageView.tsx:32-43`  
- **Description:** `approved` and `active` both use `admin-badge--active`. Labels differ in text, not color. Checklist ticked “visually distinct” lifecycle states.  
- **Suggestion:** Distinct badge token for approved (e.g. info/neutral) vs active (success).  
- **Status:** open  

### 12. Checklist honesty gaps vs code

- **Severity:** suggestion  
- **File:** `plan/Admin/CHECKLIST.md:155-158` (roles / explicit approval / fail-closed)  
- **Also:** residual browser items still open — good — but unit lines above are over-ticked relative to bugs 1–3.  
- **Description:** Unit-green is not the same as the claimed commercial policy.  
- **Suggestion:** Untick or reword role/approval/fail-closed items until server derives role, activate requires approved, and emit-failure restores store. Keep DB-SVG and unauth smoke open (already honest in `Failures.md`).  
- **Status:** open  

### 13. `window.confirm` for high-risk commercial actions

- **Severity:** nit  
- **File:** `site/features/planner/admin/pricing/AdminPriceBookPageView.tsx:138`  
- **Description:** Native confirm works and e2e accepts dialogs, but is weak a11y/product control vs in-app modal with focus trap and structured impact (ADM-PRICE-03 already builds rich text).  
- **Suggestion:** Replace with accessible confirm dialog later; not blocking if owner accepts native confirm for Phase 4.  
- **Status:** open  

### 14. `approve` result `newActiveVersionId` is previous active

- **Severity:** nit  
- **File:** `site/features/planner/admin/pricing/priceBookService.ts:210-215`  
- **Description:** On approve success, `newActiveVersionId` is set to `previousActive`, not the approved version. Audit “new=” is easy to misread.  
- **Suggestion:** Use `null` for non-activation actions, or a dedicated field for approved version id.  
- **Status:** open  

### 15. Keyboard sample in live suite is weak

- **Severity:** nit  
- **File:** `site/tests/e2e/admin-phases-live.spec.ts:229-249`  
- **Description:** Two Tabs then “focus not null” does not prove ADM-A11Y-02 keyboard-completable authoring. Unit tests cover more; do not treat this test as keyboard acceptance.  
- **Suggestion:** Label as smoke only; keep a11y claims on axe + dedicated keyboard unit/browser paths.  
- **Status:** open  

---

## What is solid (not inventing PASS beyond evidence)

- **Governance split:** pure `priceBookGovernance.ts` + server `priceBookGovernance.server.ts` correctly stops `node:fs` from entering the client bundle. Client imports only pure helpers.  
- **Unit isolation (pricing modules):** `priceBookFileStore.test.ts`, `priceBookAdmin.server.test.ts`, `priceBookGovernance.test.ts` use `mkdtempSync` temp dirs. Good pattern.  
- **SVG publish e2e isolation:** `admin-svg-publish-p01` / scene-publish hash canonical paths and clean up. Contrast with price-book e2e which does not.  
- **CSRF:** action route sets `requireCsrf: true`.  
- **Rate limit:** action route limited.  
- **Failures.md residual honesty:** DB-SVG open, coverage floor not re-proven ≥80%, unauth smoke skipped under bypass, MCP Lighthouse blocked — consistent with code.  
- **Axe primary journeys:** design of `admin-phases-live` fails on any WCAG AA violation for listed include roots; agent report claims 0 violations under bypass — not re-run in this review.  
- **No `any`:** none found in pricing product/tests or admin e2e specs under review.

## Unverified in this review

- Fresh `vitest` / Playwright command exits (not re-executed here).  
- Exact `--stat` file list of `8dcfa875` (object packed).  
- Full Admin coverage % (Failures.md already refuses ≥80% claim without remeasure).

## Counts

| Severity   | Count |
|------------|------:|
| bug        | 7 |
| suggestion | 5 |
| nit        | 3 |
| **total**  | **15** |

## Top bugs (short list)

1. Client-trusted commercial role; default `approver` — `action/route.ts`  
2. Activate from draft skips approval — `priceBookService.ts`  
3. Save-then-emit without restore on emit failure — activate/approve  
4. E2E mutates shared price-book seed/audit — left `rolled_back`  
5. Rollback of sole version stuck; server allows non-active rollback  

---

*Reviewer: code-review skill agent (local). Report only; no product changes applied.*
