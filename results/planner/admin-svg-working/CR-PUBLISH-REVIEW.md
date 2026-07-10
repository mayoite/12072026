# CR-1 — Admin SVG publish path review

**Seat:** CR-1 (publish path / correctness / security)  
**Date:** 2026-07-10  
**Scope (read-only):**  
- `site/app/api/admin/svg-editor/route.ts`  
- `site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts`  
- `site/features/planner/admin/svg-editor/svgPipelineRunner.ts`  
- `site/features/planner/admin/svg-editor/publishSvgEditorAction.ts`  
- `site/scripts/generate-svg/pipelineCore.ts` (`loadPolygonClipping`)  
**Also inspected (call graph):** `compileSvgForPublish` / `runSvgCompileStages`, `persistBlockDescriptor`, `withAuth` + CSRF, `AdminSvgEditorEditView`, admin layout, unit/e2e tests, `generate-svg.mjs`  
**Product code edits:** none  
**Method:** static source review against fail-closed / dual-path / CSRF flags; evidence cited by path:line

---

## Executive assessment

**Verdict: With fixes (not ship-clean on security/test hygiene; core fail-closed compile gate is sound)**

The **1B publish authority** is coherent: both admin UI server action and API POST funnel into `publishDescriptorWithPipeline` → `compileSvgForPublish` (S1–S3) → `runSvgPipeline({ skipCompile, precompiledSvg })` (S4) → `persistBlockDescriptor` (S6). Compile or pipeline failure correctly aborts **before** descriptor persist. Polygon-clipping load fails closed at module init if ops are missing.

Residual risk is concentrated in **auth asymmetry** (server action has no in-action admin gate), **API CSRF gap on the UI fetch fallback**, **orphaned public SVG if persist fails after S4**, **dead timeout**, and **stale route unit tests** that still encode the old “pipeline best-effort” model.

---

## Architecture map (actual wire)

```
Admin UI (Puck onPublish)
  ├─ preferred: publishSvgEditorAction  ──┐
  │     (page binds slug; "use server")    │
  └─ fallback: fetch POST /api/admin/svg-editor
              (raw fetch; no CSRF header)  │
                                           ▼
                              publishDescriptorWithPipeline
                                1. parseAdminPayload
                                2. compileSvgForPublish  → normalize + pipelineCore
                                3. runSvgPipeline(skipCompile + precompiledSvg)
                                4. persistBlockDescriptor
                                           │
API: POST /api/admin/svg-editor ───────────┘
  withAuth({ role: admin, requireCsrf: true, rateLimit: 20 })
```

| Stage | Owner | I/O |
|-------|--------|-----|
| S1 normalize | `normalizeDescriptorForPipeline` via `compileSvgForPublish` | none |
| S2/S3 compile + sanitize + SVGO | `pipelineCore.runPipelineCore` | none |
| S4 disk SVG | `svgPipelineRunner` skipCompile branch → `site/public/svg-catalog/{slug}.svg` | write |
| S6 descriptor | `persistBlockDescriptor` (slug regex, lock, atomic rename, dual-read) | write |

---

## Strengths

1. **Single fail-closed orchestrator** — `publishDescriptorWithPipeline` documents and implements order: parse → compile → S4 → persist; any `!ok` or throw stops before success (`publishDescriptorWithPipeline.ts:79–150`). Explicit comment that persist failure after S4 may leave SVG on disk.

2. **No double S1–S3 on live publish** — publish always passes `skipCompile: true` + `precompiledSvg: compile.svg` (`publishDescriptorWithPipeline.ts:117–123`). Unit tests lock this contract (`publishDescriptorWithPipeline.test.ts` skipCompile describe).

3. **API surface hardened relative to guest traffic** — `withAuth` admin + `requireCsrf: true` + rate limit 20/min (`route.ts:96–104`). CSRF uses timing-safe double-submit (`csrf.ts`); skipped only under non-prod `DEV_AUTH_BYPASS` (`withAuth.ts:206–210`).

4. **Admin layout gate** — `requireAuthUser("/admin", "admin")` on layout (`app/admin/layout.tsx:19`); root `CsrfBootstrap` prefetches token for API clients that use `browserApiFetch`.

5. **Slug / path safety on persist** — `BLOCK_DESCRIPTOR_SLUG_REGEX` (`^[a-z][a-z0-9-]{1,63}$`) in `sanitizeSlug` before any lock/write (`persistBlockDescriptor.ts:117–140`). Same pattern in `pipelineCore.validateSlug` on compile path.

6. **polygon-clipping load is fail-closed and CJS-resilient** — `loadPolygonClipping()` tries `createRequire` package name + absolute `site/node_modules/polygon-clipping`, unwraps `{ default }`, requires all four ops, **throws** if missing (`pipelineCore.ts:33–75`). Module-level `const polygonClipping = loadPolygonClipping()` means missing ops never silently ship empty geometry.

7. **Project root discovery prefers complete monorepo tree** — avoids incomplete `.next/standalone` missing `pipelineCore.ts` (`svgPipelineRunner.ts:88–117`). Directly addresses prior 422 compiler_failed class of bugs.

8. **Targeted unit coverage of fail-closed helper** — `publishDescriptorWithPipeline.test.ts` covers compile fail, pipeline fail/throw, persist fail, invalid parse, skipCompile options.

---

## Flag: Fail-closed

| Check | Status | Evidence |
|-------|--------|----------|
| Compile failure → no persist | **PASS** | `publishDescriptorWithPipeline.ts:110–115`, tests “skips pipeline+persist when compileSvg !ok” |
| Pipeline failure → no persist | **PASS** | `ts:132–137`; tests “skips persist when pipeline !ok” |
| Parse failure → no compile/pipeline/persist | **PASS** | `ts:88–94` |
| Persist failure → no success | **PASS** (with caveat) | returns `success: false`; **S4 SVG may already exist** (`ts:76–77`, `139–147`) |
| Empty precompiled + skipCompile | **PASS** | runner rejects (`svgPipelineRunner.ts:173–185`) |
| polygon-clipping missing | **PASS** | throw at load (`pipelineCore.ts:72–75`) |
| API error taxonomy | **PASS-ish** | 422 for parse/compiler-ish strings; 500 otherwise (`route.ts:58–89`) |
| Success reported only when full path ok | **PASS** (core) | server action returns pipeline result as-is |

**Gap (Important):** Fail-closed is **descriptor-centric**, not **artifact-transactional**. S4 then S6 is not atomic: failed persist / dual-read leaves public SVG that planner/portal may serve while admin JSON is not updated. Documented, not fixed.

**Gap (Important):** Client success handling treats “no `error` field” as success (`AdminSvgEditorEditView.tsx:207–220`). Today failure always includes `error: string`; if a future return shape is `{ success: false }` only, UI would false-green.

**Gap (test honesty):** `route.test.ts` still asserts *“non-zero pipeline still returns descriptor (R2 is best-effort)”* with `expect(body.success).toBe(true)` (`route.test.ts:159–168`). That contradicts live fail-closed route → helper. Also mocks `@/lib/api/withAuth` while production imports `@/features/shared/api/withAuth` — mock path is wrong. Route tests are **not trustworthy evidence** of current behavior.

---

## Flag: Dual paths

### A. UI entry dual path (Important)

| Path | Auth | CSRF | Rate limit | Core |
|------|------|------|------------|------|
| **Preferred** `publishSvgEditorAction` | Layout-only (no action-local admin check) | Next server-action origin (framework) | **None** | `publishDescriptorWithPipeline` |
| **Fallback** raw `fetch(POST_URL)` | `withAuth` admin | **`requireCsrf` but client sends no token** | 20/min | same |

- Preferred wired from RSC page always (`page.tsx:61` → EditView always gets `onPublishAction`) → **fallback is dead in production UI** unless action prop omitted (tests / future regress).
- Fallback uses bare `fetch` + only `content-type` (`AdminSvgEditorEditView.tsx:226–229`), **not** `browserApiFetch` → would **403 CSRF** in non-bypass prod if ever used.
- Comments still say “persistBlockDescriptor + runSvgPipeline” in places; actual wire is the shared helper (docs drift only).

### B. Compile dual path inside runner (Minor / residual)

`runSvgPipeline` still has:

1. **skipCompile** — S4 write only (live publish).  
2. **Full in-process** — dynamic `import(generate-svg.mjs)` → `runPipeline` (S1–S4 again).

Live publish uses (1) only. Path (2) remains for CLI/legacy callers. Risk: divergence if someone calls runner without skipCompile after a different compile authority. Not a dual *product* success path, but dual *implementation* surface.

### C. API vs action both share core (Good)

Both product entries call the same helper — correct anti-split for fail-closed semantics.

### D. Stale unit dual-truth (Important)

Route unit tests mock `runSvgPipeline` as if the route called it directly and expected best-effort R2; route now only calls `publishDescriptorWithPipeline`. **Dual mental model in tests vs code.**

---

## Flag: CSRF

| Surface | Protection | Notes |
|---------|------------|-------|
| `POST /api/admin/svg-editor` | **Yes** — `requireCsrf: true` | Double-submit header vs httpOnly cookie; token from `/api/csrf` via `CsrfBootstrap` + `ensureCsrfToken` |
| CSRF under `DEV_AUTH_BYPASS` | **Disabled** | Intentional for Playwright (`withAuth.ts:208–209`); e2e posts without CSRF (`admin-svg-publish-p01.spec.ts:78–81`) |
| UI server action | **Framework origin check** (Next) | Not the same double-submit middleware; **no** `validateCsrfRequest` in action |
| UI fetch fallback | **Broken if used** | No `x-csrf-token` header |

**Important (not Critical while preferred path is server action):**  
Server actions do not re-run the same CSRF middleware. Next.js POST action origin binding is the primary CSRF control. Acceptable if origin checks stay on and action adds **auth** (below). Do not assume API CSRF covers the action path.

**Important:** CSRF cookie is `httpOnly: true` (`csrf.ts:40–42`) while classic double-submit often uses a readable cookie; this codebase works because the **token is also returned from `/api/csrf`** into JS memory. Document for future maintainers — do not “fix” by reading the cookie from document.cookie.

**Minor:** `setCsrfTokenCookie` comment claims httpOnly prevents XSS *and* CSRF; httpOnly does not implement CSRF by itself — the header match does.

---

## Flag: Residual risks

### Critical (must fix before treating security as closed)

_None found that break the live preferred path under current wiring (action + layout + origin)._  

No Critical **correctness** bug in the compile-before-persist ordering itself.

### Important (should fix)

1. **Server action missing defense-in-depth admin auth**  
   - **File:** `publishSvgEditorAction.ts:43–58`  
   - **Issue:** No `requireAuthUser` / `resolveAuthContext` / role check inside the `"use server"` module. Admin layout gates **page render**, not necessarily every subsequent action invocation (session downgrade, leaked action ID, non-admin session cookie).  
   - **Why:** Disk write to `public/svg-catalog` + descriptor store is high impact.  
   - **Fix:** First lines of action: resolve session; require admin; return `{ success: false, error: "unauthorized" }` otherwise. Optionally rate-limit.

2. **S4/S6 non-atomic — orphan / stale public SVG**  
   - **File:** `publishDescriptorWithPipeline.ts:117–147`, `svgPipelineRunner.ts:193–194`  
   - **Issue:** Persist/dual-read failure leaves catalog SVG written.  
   - **Fix:** Write SVG to temp + rename only after persist success; or delete/rollback SVG on persist failure; or write SVG only after descriptor commit with content-hash name.

3. **Route unit tests contradict fail-closed + wrong withAuth mock path**  
   - **File:** `site/tests/unit/app/api/admin/svg-editor/route.test.ts`  
   - **Issue:** Expects success on pipeline failure; mocks `@/lib/api/withAuth` (unused by route).  
   - **Fix:** Mock `publishDescriptorWithPipeline` or full dep chain; assert 422/`success:false` on compiler/pipeline fail; mock `@/features/shared/api/withAuth`.

4. **API fallback fetch omits CSRF**  
   - **File:** `AdminSvgEditorEditView.tsx:224–230`  
   - **Issue:** Dead path today; footgun if action prop dropped.  
   - **Fix:** Use `browserApiFetch` or delete fallback entirely (prefer single path).

5. **Timeout options are no-ops**  
   - **File:** `svgPipelineRunner.ts:162–165` (`void _timeoutMs`)  
   - **Issue:** Boolean ops / SVGO can hang a Node process; DEFAULT_TIMEOUT_MS is decorative.  
   - **Fix:** `AbortSignal` / Promise.race with reject → `timeoutError`, or restore worker with kill.

6. **skipCompile trusts precompiled SVG bytes**  
   - **File:** `svgPipelineRunner.ts:167–194`  
   - **Issue:** No re-`sanitiseSvg` / content-type check on write. Safe only while sole caller is compile gate. Any future caller of `runSvgPipeline({ skipCompile, precompiledSvg: userSvg })` bypasses sanitizer.  
   - **Fix:** Always run `sanitiseSvg` (or assert marker) inside skipCompile branch; reject non-`<svg` payloads.

7. **No `serverExternalPackages` for polygon-clipping found in next config**  
   - Error message references it (`pipelineCore.ts:74`); grep found **no** `serverExternalPackages` entry. Load shim likely sufficient; if turbopack/webpack regresses, document or set external package explicitly.

### Minor

1. **Slug change via Puck props** — `puckEditorDataToDescriptorInput` allows `blockProps.slug` override (`puckBlockRegistry.tsx:803`). Admin can overwrite a different catalog slug than the route id. Intentional? If not, pin slug to route param in the action.

2. **Error string taxonomy is heuristic** — `route.ts:59–68` classifies parse vs compiler via string prefixes/`includes`. Fragile if error formats change; prefer structured error codes from the helper.

3. **Full pipeline path ignores runPipeline return quality** — dynamic import path marks `ok: true` even if `r.svg` empty (`svgPipelineRunner.ts:270–281`). Mitigated for live publish by skipCompile + prior compile check.

4. **Sanitizer is regex-based** — `sanitiseSvg` strips script/on*/foreignObject; allows `http(s):` and nested `data:image/svg+xml`. Acceptable because geometry compiler builds SVG, not freeform upload on this path. Keep freeform SVG upload off the publish wire.

5. **Fixture files under `_fixtures`** — every publish writes `admin-{slug}.{rand}.json` (`svgPipelineRunner.ts:160–161, 189–191`). Disk growth / info leak of descriptor drafts on shared hosts. Add retention cleanup.

6. **Client success copy uses stale `updatedAtLabel`** — pre-publish load time (`AdminSvgEditorEditView.tsx:218`).

7. **E2E only covers API under DEV_AUTH_BYPASS** — not the preferred server-action path or real CSRF+admin cookie matrix.

---

## polygon-clipping load (deep dive)

```33:84:site/scripts/generate-svg/pipelineCore.ts
function loadPolygonClipping(): PolygonClippingApi {
  // require("polygon-clipping") + absolute site/node_modules/...
  // unwrap default; require union/intersection/difference/xor
  // else throw
}
const polygonClipping = loadPolygonClipping();
```

| Aspect | Assessment |
|--------|------------|
| Fail-closed | Yes — throw, no stub ops |
| Next CJS interop | Good — default unwrap + absolute path |
| Testability | Load at import time can make unit import fail if package missing (correct for prod) |
| Residual | Without `serverExternalPackages`, bundlers may still surprise; absolute require is the main safety net |

---

## Auth / CSRF summary table

| Entry | Admin role | CSRF / origin | Rate limit |
|-------|------------|---------------|------------|
| Layout `/admin/*` | Yes (`requireAuthUser`) | N/A (GET) | N/A |
| Server action publish | **Layout only** | Next action origin | **No** |
| API POST | Yes (`withAuth` admin) | Double-submit (off under bypass) | 20 / min |
| Playwright API | Bypass admin | Bypass skips CSRF | Depends |

---

## Recommendations (priority order)

1. Add **explicit admin auth** inside `publishSvgEditorAction` (and any other admin `"use server"` writers).  
2. Make **S4 atomic with S6** (temp write + commit, or rollback SVG on persist fail).  
3. **Rewrite route unit tests** to current `publishDescriptorWithPipeline` + fail-closed expectations; fix withAuth mock path.  
4. Remove raw-fetch fallback **or** switch to `browserApiFetch`; prefer single publish entry.  
5. Enforce timeout on compile/pipeline; re-sanitize in skipCompile.  
6. Extend E2E: server-action publish + (staging) real CSRF without bypass.

---

## Assessment

| Question | Answer |
|----------|--------|
| **Ready to merge / call publish path “done”?** | **With fixes** — core fail-closed compile gate is good; security/test residuals block a clean “closed” security claim |
| **Fail-closed on descriptor publish success?** | **Yes** (compile/pipeline before persist) |
| **Fail-closed on catalog artifacts?** | **Partial** (orphan SVG risk) |
| **Dual paths safe?** | **Core yes; UI dual entry + runner dual mode + stale tests need cleanup** |
| **CSRF?** | **API yes; action relies on Next origin; fallback fetch no; bypass disables API CSRF for e2e** |
| **polygon-clipping?** | **Sound fail-closed load** |

**Reasoning:** Implementation correctly unified admin publish onto asset-engine authority and will not mark success when compile/pipeline fails. Remaining issues are defense-in-depth auth on the preferred server action, non-atomic public SVG, timeout, and tests that still describe the pre-1B best-effort world — fix those before claiming production-hard security for the publish stack.

---

## Reviewer checklist (seat CR-1)

- [x] Fail-closed order reviewed  
- [x] Dual paths (UI / API / skipCompile vs full) mapped  
- [x] CSRF / withAuth / DEV_AUTH_BYPASS reviewed  
- [x] polygon-clipping load reviewed  
- [x] Residual risks severity-ranked  
- [x] No product code edits  
- [x] Report path: `results/planner/admin-svg-working/CR-PUBLISH-REVIEW.md`
