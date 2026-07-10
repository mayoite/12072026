# CR-B — Security + fail-closed + CSP (admin SVG publish)

**Seat:** CR-B (Security / fail-closed / CSP)  
**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only  
**Product code edits:** **none** (read-only review)  
**Skills:** code-review · verification-before-completion  

## Scope (source-reviewed)

| Area | Path(s) |
|------|---------|
| Fail-closed orchestrator | `site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts` |
| Server action | `site/features/planner/admin/svg-editor/publishSvgEditorAction.ts` |
| API route | `site/app/api/admin/svg-editor/route.ts` |
| S4 runner | `site/features/planner/admin/svg-editor/svgPipelineRunner.ts` |
| Admin edit UI + Puck CSS | `site/features/planner/admin/svg-editor/AdminSvgEditorEditView.tsx` |
| RSC bind | `site/app/admin/svg-editor/[id]/page.tsx` |
| Admin layout auth | `site/app/admin/layout.tsx` |
| CSP + edge proxy | `site/proxy.ts` (`buildContentSecurityPolicy`, matcher) |
| Auth / CSRF stack | `site/features/shared/api/withAuth.ts`, `site/lib/security/csrf.ts`, `site/lib/auth/session.ts`, `site/lib/auth/devAuthBypass.ts` |
| Compile / sanitize authority | `site/features/planner/asset-engine/svg/compileSvgForPublish.ts`, `site/scripts/generate-svg/pipelineCore.ts` (`sanitiseSvg`) |
| Puck package CSS | `@puckeditor/core@0.22.0` → `puck.css` (`dist/index.css`) vs `no-external.css` |
| Live residual (prior eyes) | `results/planner/admin-svg-working/chrome/NOTES.md` (CSP block on `rsms.me/inter`) |
| Related CR | `results/planner/admin-svg-working/CR-PUBLISH-REVIEW.md` (CR-1; not re-owned) |

**Method:** static source review + package CSS inspection. No live browser re-run this seat; chrome residual cited as prior evidence.

---

## Executive verdict

| Question | Answer |
|----------|--------|
| **Fail-closed on publish success?** | **YES** — parse → compile S1–S3 → S4 → persist; any fail returns `success: false` and does not claim publish |
| **Fail-closed on catalog *artifacts*?** | **PARTIAL** — S4 can leave public SVG if S6 persist fails (orphan / stale SVG risk) |
| **CSRF on API POST?** | **YES** (`requireCsrf: true`), waived under non-prod `DEV_AUTH_BYPASS` |
| **CSRF on preferred server action?** | **Framework origin only** — no `validateCsrfRequest` in action |
| **Admin auth on server action?** | **NO in-action gate** — layout-only for page render; defense-in-depth gap |
| **CSP / rsms residual?** | **YES residual** — `no-external.css` is correct import; runtime inject + prior chrome still show `rsms.me` CSP noise; style-src does not allow `rsms.me` (good block, residual console noise / incomplete static-skip) |
| **Ship security as “closed”?** | **With fixes** — core fail-closed compile gate is sound; do **not** claim production-hard security until action auth + orphan SVG + (optional) rsms noise are addressed |

---

## Architecture (security-relevant wire)

```
Admin UI Puck onPublish
  ├─ preferred: publishSvgEditorAction(slug, puckData)   ← "use server"; NO requireAuthUser inside
  │     page: publishSvgEditorAction.bind(null, slug)
  └─ fallback: fetch POST /api/admin/svg-editor           ← bare fetch; no x-csrf-token
                           │
                           ▼
              publishDescriptorWithPipeline(input)
                1. parseAdminPayload
                2. compileSvgForPublish  (S1–S3 + sanitiseSvg/SVGO)
                3. runSvgPipeline({ skipCompile, precompiledSvg })  → public/svg-catalog/{slug}.svg
                4. persistBlockDescriptor                          → block-descriptors JSON
                           ▲
API POST ──────────────────┘
  withAuth({ role: "admin", requireCsrf: true, rateLimit: 20 })
```

Page gate: `app/admin/layout.tsx` → `requireAuthUser("/admin", "admin")` (owner role; bypass → synthetic owner in non-prod).

---

## 1. Fail-closed status

### Verdict: **PASS (descriptor success path)** / **PARTIAL (disk artifacts)**

### Order (implemented)

`publishDescriptorWithPipeline` (`publishDescriptorWithPipeline.ts:79–150`):

1. **Parse** — `parsePayload`; on `!ok` → `{ success: false }` (no compile / pipeline / persist).  
2. **Compile S1–S3** — `compileSvg` / `compileSvgForPublish`; catch → `compiler_exception`; `!compile.ok` → `compiler_failed` (no S4, no persist).  
3. **S4 disk** — `runPipeline(..., { skipCompile: true, precompiledSvg: compile.svg })`; catch / `!pipeline.ok` → fail (no persist).  
4. **Persist S6** — `persist(descriptor)`; `!ok` → `{ success: false }` (does **not** claim success).  
5. **Success only** when all of the above succeed.

Empty `precompiledSvg` with `skipCompile` is rejected by the runner (`svgPipelineRunner.ts:173–185`).

### API surface

`route.ts` always runs the same helper (`publishDescriptorWithPipeline`); maps failures to 422 (parse/compiler-ish) or 500; success only on `published.success` (`route.ts:54–93`). Wrapped with admin + CSRF + rate limit (`route.ts:96–104`).

### Server action

Returns the helper result as-is (`publishSvgEditorAction.ts:33–48`). Missing slug → `{ success: false, error: "not found" }` without pipeline. Unit tests assert failure propagation (`publishSvgEditorAction.test.ts`).

### Client truthfulness (minor)

`AdminSvgEditorEditView` treats action result as failure only when `result.error` is present (`AdminSvgEditorEditView.tsx` success branch). Today failures always set `error: string`. A future `{ success: false }` without `error` would **false-green**. Important for UI honesty, not server fail-closed.

### Explicit non-atomic gap (see §4)

Comments document: if S4 succeeds and persist fails, **SVG may already exist on disk** (`publishDescriptorWithPipeline.ts:76–77`, `139–141`). That is **fail-closed for the *success flag*** but **not transactional** for public catalog files.

| Check | Status |
|-------|--------|
| Compile fail → no persist | **PASS** |
| Pipeline fail → no persist | **PASS** |
| Parse fail → no compile/pipeline/persist | **PASS** |
| Persist fail → no success | **PASS** |
| Success only after full path | **PASS** |
| Atomic SVG + descriptor | **FAIL / residual** (orphan SVG) |

---

## 2. CSRF

### Verdict: **API hardened; action relies on Next; fallback fetch broken if used**

| Surface | Protection | Evidence |
|---------|------------|----------|
| `POST /api/admin/svg-editor` | **Double-submit CSRF** when `requireCsrf: true` | `route.ts:96–104`; `withAuth.ts:206–220` → `validateCsrfRequest` |
| CSRF under `DEV_AUTH_BYPASS` | **Skipped** (non-prod / allow-prod pair) | `withAuth.ts:208–209`; `devAuthBypass.ts:40–51` (prod needs `DEV_AUTH_BYPASS_ALLOW_PRODUCTION=1`) |
| Token mechanism | Header vs httpOnly cookie, timing-safe | `csrf.ts:24–31`, `68–74`; cookie `httpOnly: true`, `sameSite: strict` (`csrf.ts:40–46`) |
| Token delivery to JS | `/api/csrf` + `CsrfBootstrap` + `ensureCsrfToken` / `browserApiFetch` | Root layout mounts `CsrfBootstrap`; **not** readable from `document.cookie` |
| Preferred UI path (server action) | **Next server-action origin binding** only | No `validateCsrfRequest` in `publishSvgEditorAction.ts` |
| UI fetch fallback | **No CSRF header** | `AdminSvgEditorEditView.tsx` bare `fetch(POST_URL, { headers: { "content-type": "application/json" } })` — would 403 CSRF in real prod if used |

### Assessment

- **Important (not Critical while preferred path is the server action):** Do not assume API CSRF covers the action. Next’s action POST origin checks are the control; acceptable only with **in-action admin auth** (below).  
- **Important footgun:** Fallback is dead in production UI while page always passes `onPublishAction` (`page.tsx:48–55`), but if the prop is dropped, clients hit a path that fails CSRF (or, worse, someone “fixes” CSRF without auth). Prefer delete fallback or route through `browserApiFetch`.  
- **Minor doc hygiene:** `setCsrfTokenCookie` comment claims httpOnly prevents XSS *and* CSRF; httpOnly alone does not implement CSRF — header match does.

---

## 3. Admin auth on server action

### Verdict: **MISSING defense-in-depth (Important)**

| Layer | Admin role check? | Notes |
|-------|-------------------|-------|
| Edge `proxy` `/admin/*` | Cookie **existence** only | `hasSessionAuthCookies` — any `sb-*-auth-token` / legacy Appwrite cookie; **not** role (`proxy.ts:109–119`, `167–185`) |
| `app/admin/layout.tsx` | **Yes** | `requireAuthUser("/admin", "admin")` → requires `user.role === "owner"` (`session.ts:102–104`); bypass → synthetic owner |
| `publishSvgEditorAction` | **No** | Loads descriptor + `publishDescriptorWithPipeline` only (`publishSvgEditorAction.ts:33–48`) |
| API `POST` | **Yes** | `withAuth({ role: "admin", ... })` |

### Why this matters

Server Actions are invokable via POST (`next-action` header) with a session cookie **without** re-running the RSC layout. Layout gates **page HTML**, not every subsequent action invocation. Threats:

- Session **role downgrade** after page load.  
- **Leaked / guessed action ID** + non-admin authenticated cookie.  
- Any future non-admin surface that re-exports or rebinds the same action.  
- High impact: writes **`site/public/svg-catalog/{slug}.svg`** (public static asset; proxy matcher **excludes** `*.svg` from middleware) + descriptor store.

### Tests

`publishSvgEditorAction.test.ts` covers new/missing/valid slug and pipeline failure propagation. **No test** asserts unauthorized / non-admin rejection — consistent with missing gate.

### Required fix (not done this seat)

First lines of `publishSvgEditorAction`: resolve session; require admin/owner; return `{ success: false, error: "unauthorized" }` (or throw) otherwise. Optionally rate-limit. Mirror API semantics.

---

## 4. Orphan SVG risk

### Verdict: **REAL residual (Important)**

### Mechanism

1. S1–S3 succeed → sanitized SVG string in memory.  
2. S4 `skipCompile` branch **writes immediately**:  
   - fixture JSON under `site/scripts/generate-svg/_fixtures/admin-{slug}.{rand}.json`  
   - SVG to `site/public/svg-catalog/{slug}.svg` (`svgPipelineRunner.ts:187–194`)  
3. S6 `persistBlockDescriptor` may then fail (lock busy, dual-read mismatch, I/O, invalid shape post-merge, etc.).  
4. Orchestrator returns `success: false` — **correct for API/action** — but **public SVG file remains**.

### Impact

- Planner / portal / static CDN may serve **new SVG** while admin descriptor JSON is **old or missing**.  
- Static SVG files are **public** (no admin cookie); matcher excludes `.*\.svg$` from proxy auth/CSP application on the asset request itself.  
- Re-publish after fix may overwrite; dual-read / lock failures leave a window of inconsistency.  
- Fixtures accumulate descriptor drafts on disk (info leakage / growth on shared hosts).

### Mitigations **not** present

- No temp-path + rename-after-persist.  
- No rollback `unlink` of SVG on persist failure.  
- No content-hash-named SVG with pointer flip only after S6.

### Severity

**Important** for catalog integrity and “what users see.” Not a classic RCE by itself because compile authority + `sanitiseSvg` run before write on the live path; still a **consistency / integrity** security-adjacent issue.

---

## 5. CSP + Puck CSS (`no-external.css` vs `puck.css`) + rsms residual

### Proxy CSP (live app headers)

`buildContentSecurityPolicy` (`proxy.ts:46–61`):

```
default-src 'self'
script-src 'self' 'unsafe-inline' [+ 'unsafe-eval' on canvas-heavy OR development]
             + googletagmanager + google-analytics
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: blob: https: http:
font-src 'self' https://fonts.gstatic.com https://cdn.tldraw.com
connect-src 'self' supabase + openai + openrouter + GA + unpkg + tldraw CDN
frame-src 'self'
object-src 'none'
base-uri 'self'
```

| Topic | Assessment |
|-------|------------|
| `rsms.me` in style-src / font-src | **Not allowlisted** — intentional block |
| Google Fonts | Allowed (style + font hosts) |
| Admin paths | **Canvas-heavy** → production CSP includes **`unsafe-eval`** for Fabric/WebGL family (`isCanvasHeavyPath` includes `/admin`) |
| Development | **All routes** get `unsafe-eval` (`allowsUnsafeEval`) |
| `next.config.js` CSP | Separate static header `default-src 'self'` on some routes — **not** the primary app CSP; live pages use **proxy** |
| Public `*.svg` | Matcher excludes static extensions — asset responses may lack CSP headers; embedding page CSP still governs inline script in SVG when navigated carefully (SVG XSS residual depends on sanitizer + how browsers treat SVG) |

### Puck CSS choice in product code

```43:44:site/features/planner/admin/svg-editor/AdminSvgEditorEditView.tsx
// no-external.css: same Puck UI without @import https://rsms.me/inter (CSP style-src blocks it)
import "@puckeditor/core/no-external.css";
```

| Asset | `@import rsms`? | `--_puck-styles-loaded`? |
|-------|-----------------|---------------------------|
| `@puckeditor/core/puck.css` → `dist/index.css` | **YES** line 1 | YES (`:root`) |
| `@puckeditor/core/no-external.css` → `dist/no-external.css` | **NO** | YES (`:root` line 214) |

**Import choice is correct.** Using `puck.css` would actively request `https://rsms.me/inter/inter.css` and hard-fail under current CSP.

### Why rsms residual still appears

Puck **0.22** runtime (`chunk-ELDOSC5Y.mjs` / shared editor bundle):

1. `defaultUiStyles` string **still begins with** `@import "https://rsms.me/inter/inter.css";` (bundled UI inject payload).  
2. `useInjectUiCss` injects that string **unless** `hasStaticPuckCss()` sees `--_puck-styles-loaded` on `document.documentElement`.  
3. `no-external.css` sets that variable — **in theory** injection is skipped.  
4. **Residual sources still observed / plausible:**  
   - **Prior chrome eyes** (`chrome/NOTES.md`): console CSP violation for `https://rsms.me/inter/inter.css` after edit page load (HEAD `6268e1ec`). Non-blocking for page function; proves network still attempted or stylesheet request evaluated under CSP.  
   - **Race / FOUC inject:** if `hasStaticPuckCss` runs before stylesheet applies, inject runs once (staticCssDetected caches result).  
   - **Iframe canvas:** separate document may not inherit parent `:root` marker the same way; inject paths differ (`useInjectIframeCss` uses `iframeInteractionStyles` — full token CSS, not necessarily rsms, but parent inject can still fire).  
   - **JS bundle retains rsms string** even when CSS import is no-external — any code path that injects `defaultUiStyles` reintroduces the external font CSS under CSP.

### Security posture of the block

| Aspect | Status |
|--------|--------|
| CSP **blocks** third-party Inter from `rsms.me` | **Good** (defense in depth; no silent font phone-home if inject races) |
| Product does **not** allowlist `rsms.me` | **Good** — keep it that way |
| Residual console noise | **Non-critical** security; **quality** residual |
| Complete silence strategy | Ensure static CSS loads before first Puck mount (or vendor patch / local Inter self-host + strip inject); re-prove with chrome console zero CSP violations |

### Other CSP residuals (admin SVG surface)

- **`script-src 'unsafe-inline' + 'unsafe-eval'` on `/admin`:** expected for canvas-heavy stack; increases XSS impact if any admin XSS lands. Not introduced by SVG publish; out of tight fix scope but real ambient risk.  
- **`img-src https: http:`:** very wide; not SVG-specific.  
- **`connect-src` includes `unpkg.com`:** general product residual.  
- Client GLB upload to Supabase (`uploadAssetToSupabase`) uses anon key + public bucket path `generated/` — separate storage ACL concern (not CSP); not part of publishDescriptor pipeline.

---

## 6. Supporting security notes (compile / write surface)

| Topic | Status | Notes |
|-------|--------|-------|
| SVG sanitization before public write (live publish) | **PASS (path-dependent)** | Live path: `compileSvgForPublish` → pipelineCore `sanitiseSvg` + SVGO **before** skipCompile write. |
| skipCompile trust | **Residual** | Runner writes `precompiledSvg` bytes with **no re-sanitize** (`svgPipelineRunner.ts:167–194`). Safe only while sole caller is compile gate. Future `runSvgPipeline({ skipCompile, precompiledSvg: userSvg })` bypasses sanitizer. |
| Slug path safety on persist | **PASS** | `BLOCK_DESCRIPTOR_SLUG_REGEX` / `sanitizeSlug` before lock/write. |
| Freeform SVG file upload on edit page | **Not on publish wire** | File input feeds GLB extruder preview only; publish uses Puck → descriptor → compile. Keep freeform upload off publish. |
| Pipeline timeout | **Decorative** | `timeoutMs` / `maxStderrBytes` voided (`svgPipelineRunner.ts:162–165`) — hang risk on Node, availability not confidentiality. |
| DEV_AUTH_BYPASS production | **Gated** | `NODE_ENV === "production"` requires both bypass flags (`devAuthBypass.ts:47–49`). |

---

## Mandatory status table (seat contract)

| Required statement | Status | One-line |
|--------------------|--------|----------|
| **Fail-closed status** | **PASS (success flag)** / **PARTIAL (artifacts)** | Compile/pipeline/parse/persist failures never report publish success; S4+S6 not atomic. |
| **CSRF** | **API: YES · Action: framework origin · Fallback: NO** | Double-submit on POST API; action has no `validateCsrfRequest`; bare fetch lacks header. |
| **Admin auth on server action** | **NO (layout only)** | `publishSvgEditorAction` has zero session/role check; Important defense-in-depth gap. |
| **Orphan SVG risk** | **YES (Important)** | S4 writes public SVG before S6; persist fail leaves orphan/stale catalog SVG. |
| **CSP / rsms residual** | **YES residual (Non-critical block works)** | `no-external.css` correct; CSP does not allow `rsms.me`; runtime inject + chrome still show residual violation noise. |

---

## Severity-ranked residuals (this seat)

### Critical

_None that break the live preferred path under current wiring (server action + layout + Next origin + API CSRF)._  

### Important (should fix before “security closed”)

1. **In-action admin auth** on `publishSvgEditorAction` (and any admin write actions).  
2. **Orphan / non-atomic public SVG** (temp write + commit, or rollback on persist fail).  
3. **API fallback fetch without CSRF** — delete or switch to `browserApiFetch`.  
4. **skipCompile without re-sanitize** — belt-and-suspenders inside runner.

### Minor / residual

1. **rsms CSP console noise** — keep block; finish static-skip reliability or self-host Inter.  
2. **Admin `unsafe-eval` CSP** ambient.  
3. **Client false-green** if action returns `{ success: false }` without `error`.  
4. **Fixture file accumulation** under `_fixtures`.  
5. **No rate limit** on server action path.  
6. **Timeout no-ops** on pipeline.  
7. **E2E under DEV_AUTH_BYPASS** does not prove real CSRF + admin cookie matrix on the preferred action path.

---

## Recommendations (priority)

1. Add **`requireAuthUser` / role check** at the top of `publishSvgEditorAction`.  
2. Make **S4 atomic with S6** (or rollback SVG on persist failure).  
3. Remove raw-fetch fallback **or** use `browserApiFetch`; prefer single publish entry.  
4. Re-sanitize (or assert compile marker) inside `skipCompile` write.  
5. Chrome re-proof: edit page console **zero** `rsms.me` CSP violations after any CSS/inject fix.  
6. E2E: server-action publish with real admin session + CSRF path without bypass (staging).

---

## Reviewer checklist (CR-B)

- [x] `publishDescriptorWithPipeline` fail-closed order reviewed  
- [x] `publishSvgEditorAction` auth/CSRF posture reviewed  
- [x] `route.ts` withAuth admin + CSRF reviewed  
- [x] `svgPipelineRunner` S4 write / skipCompile trust / orphan path reviewed  
- [x] `AdminSvgEditorEditView` Puck CSS (`no-external` vs `puck.css`) reviewed  
- [x] `proxy.ts` CSP vs external (`rsms`, fonts, eval) reviewed  
- [x] Mandatory statements: fail-closed, CSRF, admin auth on action, orphan SVG, CSP/rsms residual  
- [x] No product code edits  
- [x] Report path: `results/planner/admin-svg-working/CR-SECURITY-CSP.md`

---

## Assessment (honest)

Core **1B fail-closed publish gate is real**: the product will not return success when parse/compile/pipeline/persist fails, and both API and action funnel into one orchestrator. That is the main security win for catalog integrity on the *intent* of publish.

Security is **not closed** for production hardening claims: the preferred UI path still **omits in-action admin auth**, **S4 can orphan public SVGs**, the dead API fallback is a **CSRF footgun**, and **rsms** remains a **CSP residual** (blocked correctly; not fully silenced). Fix Important items before treating admin SVG publish security as done.
