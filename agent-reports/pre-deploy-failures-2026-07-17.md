# Pre-deploy failures report

**Date:** 2026-07-17  
**Repo:** `E:\12072026`  
**Branch:** `main` @ `9c563003` + **large uncommitted working tree** (~92 modified, many untracked)  
**Verdict:** **NOT READY for deploy**

This report is evidence-based. Status vocabulary:

| Status | Meaning |
|--------|---------|
| **FAIL** | Fresh check failed or code inspection confirms a defect |
| **OPEN** | Unverified / needs runtime proof / product decision |
| **PASS** | Fresh command/browser evidence this session |

Agent pack used:

| Agent | Role |
|-------|------|
| Chrome / browser | Load matrix on key routes (Playwright + curl) |
| A11y | Code + Lighthouse + dialog/tap-target review |
| TDD | Name-mirror gaps + hollow tests |
| Code review | Maintainability + production readiness |
| Security (choice) | Auth, IDOR, storage abuse |
| Systematic debugging (choice) | Root cause map + deploy failure modes |

---

## Executive summary

Do **not** deploy this working tree as a commercial release.

| Gate | Result | Evidence |
|------|--------|----------|
| `pnpm run check:layout` | **PASS** | exit 0 — no forbidden `site/` paths |
| `pnpm run typecheck` | **PASS** | `tsc --noEmit` exit 0 |
| `pnpm run lint` | **FAIL** | 5 ESLint errors, exit 1 |
| `pnpm run test` | **FAIL** (in progress / partial) | ≥15 files with failures; suite still running long |
| Browser load (dev) | **PASS** for load only | `/`, `/planner/guest/`, `/about`, `/solutions`, `/admin/` → 200, 0 console errors |
| Production admin auth | **OPEN** | Dev had `DEV_AUTH_BYPASS`; admin shell not a login redirect |
| Security (plans + GLB) | **FAIL** | IDOR + guest shared GLB overwrite |
| A11y (modals / targets) | **FAIL** (code) | Dialogs lack trap/Escape; many controls &lt; 44px |
| DB-SVG cutover | **OPEN** | Documented in `Failures.md` — disk still authority |

**Ship blockers (minimum):**

1. Plan save **ownership** + **upsert** (`plannerPersistence.ts`).  
2. Guest **GLB shared overwrite** (`generated-glb` + storage upsert).  
3. Lint **5 errors** (release gate poison).  
4. Unit suite **red** on planner host wiring / cloud saves / palette.  
5. Missing tests on **cloud export** + **notifyHandoffStaff**.  
6. Owner decision on **disk-only SVG** for this release.

---

## 1. Gate evidence (this session)

### 1.1 Layout — PASS

```text
pnpm run check:layout
→ check-repo-layout OK — no forbidden site/ paths
exit 0
```

### 1.2 Typecheck — PASS

```text
pnpm run typecheck
→ tsc -p tsconfig.json --noEmit
exit 0
```

### 1.3 Lint — FAIL (5 errors)

```text
pnpm run lint  → exit 1
```

| # | File | Line | Rule | Issue |
|---|------|------|------|-------|
| L1 | `site/app/api/planner/handoff/route.ts` | 172 | `eqeqeq` | `line != null` |
| L2 | `site/features/planner/shared/handoff/notifyHandoffStaff.ts` | 56 | `eqeqeq` | `line != null` |
| L3 | `site/app/api/plans/route.ts` | 1 | `no-unused-vars` | unused `NextRequest` import |
| L4 | `site/app/api/plans/[id]/route.ts` | 1 | `no-unused-vars` | unused `NextRequest` import |
| L5 | `site/features/planner/3d/buildPlannerSceneNodes.ts` | 146 | `no-unused-vars` | unused `const length = …` |

**Root causes (systematic debug):**

- L1/L2: nullish filter idiom on optional CRM/email lines; ESLint wants `!==`.  
- L3/L4: route scaffold left type import after `withAuth` typing.  
- L5: door 3D node loop copy-pasted wall length math then used door width instead.

### 1.4 Unit tests — FAIL (partial run)

`pnpm run test` (vitest full suite) produced **multiple failing files** before/during completion. Unique failures observed:

| File | Failures (observed) |
|------|---------------------|
| `tests/unit/features/planner/canvasToolPaletteAuthority.test.ts` | 6 |
| `tests/unit/features/planner/routesCoverage.test.tsx` | 3 |
| `tests/unit/features/planner/workspaceShell.test.tsx` | 3 |
| `tests/unit/features/planner/hostWiringP01.test.ts` | 2 |
| `tests/unit/features/planner/persistence/plannerCloudSaves.test.ts` | 2 |
| `tests/integration/features/planner/cloud-store/syncQueueProcessor.test.ts` | 2 |
| `tests/unit/features/planner/catalog.test.ts` | 1 |
| `tests/unit/features/site/data/navigation-coverage.test.ts` | 1 |
| `tests/unit/app/api/admin/svg-editor/route.test.ts` | 1 |
| `tests/integration/features/planner/catalog-api/components.test.tsx` | 1 |
| `tests/unit/features/planner/cleanupPhase08.test.ts` | 1 |
| `tests/unit/features/planner/catalog-api/s7CatalogConsume.test.ts` | 1 |
| `tests/unit/features/planner/persistence/topBarGuest.test.tsx` | 1 |
| `tests/unit/features/planner/canvas/fabricBlock2D.test.ts` | 1 |
| `tests/unit/features/admin/planner-views/ui/AdminLayoutShell.test.tsx` | 1 |

Notable case names:

- `keeps planner runtime free of admin catalog write routes`  
- `saves a plan via PUT /api/plans/[id]` / `deletes a plan via DELETE /api/plans/[id]`  
- `live routes use simplified planner chain` / `editor mounts PlannerCanvasStage from canvas barrel`  
- `wires guest/canvas route to PlannerWorkspaceRoute`  
- `marks room, dimension, and text as deferred` (palette authority drift)

**Focused new-module run (TDD agent):** 12 files / **37/37 PASS** on pure helpers + ReviewQuote + dual-write resolve + handoff route (mocked). That does **not** green the full suite.

**Focused high-risk run also saw:**  
`tests/unit/app/api/planner/project-sketch/route.test.ts` — `POST returns 410…` **FAIL** (rate_limit 401 noise / expectation drift).

### 1.5 Build / release:gate

**OPEN** — full `pnpm run build` and `pnpm run release:gate` not completed this session (lint + test already block).

---

## 2. Security — FAIL

### C1. Plan write IDOR + ownership takeover — **Critical FAIL**

**Path:** `site/features/planner/cloud-store/plannerPersistence.ts` ~175–180  
**Callers:** `PUT /api/plans/[id]`, `POST /api/plans`

```ts
.where(eq(plans.id, documentId))  // no userId in WHERE
// values always include caller userId → ownership reassignment
```

**Exploit:** Authenticated member + known UUID → overwrite victim plan and steal `user_id`.  
**Fix:** `WHERE id AND user_id`; never reassign owner on update; admin path explicit.

### C2. First cloud save with client UUID is update-only — **Critical FAIL**

Same function: insert only when `documentId` omitted; clients always pass `saveId`.  
New plan → 0 rows → `"Document not found for update"`.  
**Fix:** owner-scoped upsert with client id.

### C3. Guest GLB shared storage overwrite — **Critical FAIL**

**Path:** `site/app/api/planner/generated-glb/route.ts` (`role: "guest"`) +  
`catalogAssetStorage.server.ts` (`upsert: true` under `catalog-assets/generated/*`).

**Exploit:** CSRF cookie + POST binary → overwrite public modular GLBs or fill bucket (25 MB × rate limit).  
**Fix:** member-only or per-user keys; no shared upsert; server-minted keys.

### I1. Handoff idempotency global + non-atomic — **Important FAIL**

`handoff/route.ts`: lookup by `source + requirement` only; on lookup error **continues insert**.  
**Fix:** scope by member; unique index; fail closed on lookup errors.

### I2. Cloud export public + client Content-Type — **Important FAIL**

`export/cloud/route.ts`: returns public URL; trusts client `contentType` (HTML/XSS on storage origin risk).  
**Fix:** allowlist MIME; private/signed URLs.

### I3. DELETE ownership not in SQL — **Important FAIL**

Route checks then `delete by id only`.  
**Fix:** `DELETE WHERE id AND user_id`.

### I4. Handoff trusts client BOQ totals — **Important FAIL**

Server does not recompute prices from catalog. Demo pricing reduces commercial fraud impact; still stores attacker-shaped intake.

### I5. Plans API error leakage — **Important FAIL**

Raw `err.message` in 500 responses.

### I6. Price-book client-asserted role — **Important FAIL**

`admin/price-books/.../action` trusts body `role` for SoD.

### Documented architecture — **OPEN**

`Failures.md`: DB-SVG cutover still open (disk authority; dual-write conditional).

---

## 3. Code quality / structure — FAIL debt

| Issue | Severity | Evidence |
|-------|----------|----------|
| `OOPlannerWorkspace.tsx` ~2218 lines | Important | God-host: placement, export, handoff, sketch, sync, shell |
| Export/placement condition chains | Important | Long if/else in workspace |
| Dual-write non-atomic (R2 orphans) | Important | Disk → R2 → DB sequence |
| Publish lifecycle stays `draft` after success | Important | `publishSvgEditorAction` |
| Envelope split (success helpers vs ad-hoc JSON) | Minor | plans vs handoff/export |
| CRLF noise on locked CSS | Minor | git warns LF conversion |

---

## 4. TDD gaps — FAIL / OPEN

### Missing name-mirrors — **FAIL**

| Production | Expected test |
|------------|---------------|
| `site/app/api/planner/export/cloud/route.ts` | `tests/unit/app/api/planner/export/cloud/route.test.ts` |
| `site/features/planner/shared/handoff/notifyHandoffStaff.ts` | `…/notifyHandoffStaff.test.ts` |

### Hollow / partial coverage

| Surface | Problem |
|---------|---------|
| `OOPlannerWorkspace` (+~481 lines) | Mount smoke only |
| `catalogAssetStorage` | Export + generated GLB branches untested |
| `publishSvgEditorAction` | Dual-write/symbol upload mocked away |
| Handoff route tests | Mock `withAuth` + mock notify |
| Missing UI mirrors | `SketchToPlanDialog`, `PlannerWorkflowBar`, `ModularPlannerShell` |

### No silent skips

Changed/new suites: no `test.skip` / `it.skip` found (good).

---

## 5. Accessibility & formatting (including 1px-class issues)

### 5.1 Lighthouse (Chrome DevTools MCP) — this session

| Page | Device | A11y | Best practices | SEO | Failed audits |
|------|--------|------|----------------|-----|---------------|
| `/` | mobile | **100** | 100 | 100 | `label-content-name-mismatch` (agentic/name), `llms.txt` |
| `/planner/guest/?id=…` | desktop | **100** | 100 | **54** | `is-crawlable` (noindex?), `canonical` missing |

**Home FAIL (visible label ≠ accessible name):**

- Selector: `a.home-tools-floor-demo`  
- Visible text includes layout diagram copy (“OFFICE LAYOUT · 10 × 8 M …”)  
- `aria-label` starts with “Example layout · 10 × 8 m · …” and does **not** include visible text  
- Fix: align accessible name with visible text, or hide decorative text from a11y tree consistently.

**Planner guest SEO FAILs (expected for app workspace, still report):**

- Page blocked from indexing  
- No valid `rel=canonical`

Console on home after navigate: **no error/warn/issue messages** (PASS for that sample).

### 5.2 Modal keyboard contract — **Critical FAIL (code)**

| Dialog | Roles present | Focus trap | Escape | Initial focus | Touch targets |
|--------|---------------|------------|--------|---------------|---------------|
| `PlannerSyncConflictDialog` | alertdialog + aria-modal | **No** | **No** | **No** | OK (`min-height` 2.75rem) |
| `SketchToPlanDialog` | dialog + aria-modal | **No** | **No** | **No** | **FAIL** (Close no min size; actions 2.25rem / 36px) |

Contrast: `CommandPalette` uses RAC Modal with proper Escape.

### 5.3 Tap targets &lt; 44px — **Important FAIL**

| Control | Size | Path |
|---------|------|------|
| Sketch primary/secondary | `min-height: 2.25rem` (36px) | `sketch-to-plan-dialog.module.css` |
| Toast dismiss | `min-height: 2.25rem` | `workspace-open3d-route-host.css` (new) |
| Admin menu items | `min-height: 2.5rem` (40px) | `svg-editor-shell.css` (new) |
| AI Assist tabs | `2.25rem` | `planner-ai-assist.css` |
| Panel dock/close | `1.5rem` desktop | `workspace.module.css` |
| Layer eye | `1.5rem` desktop | `layers-panel.module.css` |
| Inventory clear | `1.25rem` | `inventory.module.css` |
| Favorite | `1.1rem` | `inventory.module.css` |
| Compact density | `--ws-control-h: 2rem` | workspace tokens |

Project token: `--planner-touch-target` / `2.75rem` (~44px). Many controls only bump at narrow breakpoints.

### 5.4 Focus rings — **Important / Minor FAIL**

| Location | Issue |
|----------|-------|
| `properties.module.css` `.dropdownItem` | `outline: none` without `:focus-visible` ring |
| `validation-panel.module.css` | `:focus-visible` sets outline none + soft bg only |
| `command-palette.module.css` search/items | outline none; no ring (portaled outside shell) |
| `workspace.module.css` `.brandTitleInput` | always outline none |
| Admin menu items | `outline: none` + hover/`data-focused` bg only — **no** focus-visible ring |
| Review quote panel | no explicit `:focus-visible` on inputs/buttons |

**OK patterns (not failures):** inventory/layers buttons pairing `outline: none` with `box-shadow: var(--focus-ring)`.

### 5.5 Other a11y

| Issue | Severity | Evidence |
|-------|----------|----------|
| AI Assist tabs incomplete ARIA | Important | no `aria-controls`, no arrow keys, panel unlabeled |
| Solutions `Hero` ignores reduced motion | Important | always parallax; HomepageHero does respect |
| ReviewQuote email/phone required-one-of | Important | no `aria-required` / shared error |
| Title double brand | Minor | `Planner Workspace \| One&Only \| One&Only` |
| `test:a11y` coverage hole | Important | guest planner + export modal only; not Sync/Sketch/Review/marketing/admin |

### 5.6 Formatting / layout nits (1px-class)

| Issue | Severity | Notes |
|-------|----------|-------|
| Home hero title center vs left | OPEN product | Diff changes `align-items: stretch` → `center`, `text-align: left` → `center` under lg — intentional design change, verify against brand mock |
| Menu popover padding `0.35rem` / gap `0.15rem` | Minor | Fine-grain spacing; ensure 8pt rhythm consistency with planner |
| Admin menu `min-height: 2.5rem` vs planner `2.75rem` | Minor | **4px short** of touch token |
| Toast `padding: 0.65rem` / dismiss `2.25rem` | Minor | **8px short** of 2.75rem token |
| Meta `margin: 0.15rem 0 0` in sync dialog | Minor | Non-token 0.15rem |
| Horizontal overflow on key routes | **PASS** | 1280×800 and 390×844 measured no overflow |
| Locked CSS CRLF | Minor | git will normalize; avoid mixed endings |

### 5.7 Browser load matrix — **PASS** (dev only)

| Route | HTTP | Console errors | Overflow |
|-------|------|----------------|----------|
| `/` | 200 | 0 | no |
| `/planner/guest/` | 200 (via 307 + id) | 0 | no |
| `/about/` | 200 | 0 | no |
| `/solutions/` | 200 | 0 | no |
| `/admin/` | 200 full shell | 0 | no (bypass on) |

**OPEN:** production auth redirect for `/admin/` without bypass.

---

## 6. Product / ops failure modes if you deploy now

1. **Member plan IDOR** — multi-tenant data integrity broken.  
2. **First cloud save / portal publish 500** — update-only path.  
3. **Guest GLB overwrite** — catalog 3D assets untrusted.  
4. **Handoff 501 or silent no email** — missing CRM / Resend env.  
5. **SVG authority lie** — Admin green, DB/R2 empty if dual-write skipped.  
6. **Lint + unit red** — release gate and CI fail.  
7. **Modal keyboard traps missing** — WCAG dialog failures on conflict/sketch.  
8. **Workspace god-file** — one regression breaks whole commercial loop.

---

## 7. Recommended fix order

1. **Plans ownership + upsert** + DELETE scoped in SQL.  
2. **Guest GLB** tenancy / immutability (or disable guest write).  
3. **Regression tests** for IDOR + first create (TDD red→green).  
4. **Lint 5** (trivial).  
5. **Cloud export + notifyHandoffStaff** unit mirrors.  
6. **Modal focus trap + Escape** on Sync + Sketch; bump targets to 2.75rem.  
7. **Align home floor-demo accessible name** with visible text.  
8. **Owner decision:** document disk-only SVG this release **or** hold for dual-write proof.  
9. **Green** full `pnpm run test` failures (host wiring, palette, cloud saves).  
10. Browser acceptance: member Review → Send to Oando; portal save; Admin publish.  
11. Only then `release:gate` / deploy.

---

## 8. What is green / directionally solid

- Layout + typecheck clean.  
- `withAuth` rate limit + CSRF on mutators is real.  
- Handoff honest **501** when CRM missing; demo pricing confirm required; guest send blocked in UI.  
- Dual-write **skip when R2 dead** so disk publish is not rolled back by bad keys (matches `Failures.md`).  
- Key routes **load** clean under local dev.  
- Pure helpers well tested: dual-write resolve, sceneParity, underlayCalibrate, furnitureBoqBridge.  
- Lighthouse a11y score 100 on home + guest planner (score ≠ complete WCAG; modal trap still FAIL in code).

---

## 9. OPEN checklist (runtime still required)

- [ ] Full vitest final counts (suite was long-running this session)  
- [ ] `pnpm run build`  
- [ ] `pnpm run test:a11y` with server up  
- [ ] Production `/admin` without `DEV_AUTH_BYPASS`  
- [ ] Real handoff insert + Resend delivery in staging  
- [ ] One dual-write Admin publish with R2 object + DB revision  
- [ ] Measured contrast on muted text over soft surfaces  
- [ ] Live focus order with Sync + Sketch open  

---

## 10. Commands to re-verify

```powershell
cd E:\12072026
pnpm run check:layout
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm --filter oando-site exec vitest run tests/unit/app/api/plans tests/unit/app/api/planner/handoff
pnpm --filter oando-site run test:a11y
# browser (dev server)
pnpm run dev
# then Chrome Lighthouse or Playwright on /, /planner/guest/, /about, /solutions, /admin/
```

---

## 11. Assessment

| Question | Answer |
|----------|--------|
| Ready to deploy? | **No** |
| Smallest honest ship? | Fix C1–C3 + lint + green tests; accept disk-only SVG in writing; a11y modal trap before marketing “production quality” |
| Largest lie risk | “Unit green / Lighthouse 100 = ship safe” — security + handoff + plans create path contradict that |

**Brutal truth:** polishing lint without fixing plan ownership is polishing the gate while shipping a writable multi-tenant IDOR. Lighthouse 100 on marketing home does not cover planner modals or guest GLB storage.

---

*Report author: Grok pre-deploy multi-agent audit (Chrome, a11y, TDD, code review, security, systematic debug). Agent reports only — not proof via `results/`.*
