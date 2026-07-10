# VERIFY-2: Live admin UI + CSP

**Seat:** VERIFY-2  
**Date (fresh run):** 2026-07-10 ~20:40 IST  
**Checkout:** `D:\OandO07072026`  
**Server:** `http://localhost:3000` (already up)  
**Tools:** PowerShell `Invoke-WebRequest` + Chrome DevTools MCP  

## Verdict: **PASS**

| Check | Result | Evidence |
|-------|--------|----------|
| 1. `GET /admin/svg-editor/` → 200, no access redirect | **PASS** | HTTP 200; final URL stays on list; no `Location` / login redirect |
| 2. `GET /admin/svg-editor/side-table-001/` → 200, no global-error, Puck present | **PASS** | HTTP 200; Puck UI live (32 `.Puck*` nodes); no global-error UI text |
| 3. CSP / no `rsms.me/inter` | **PASS** | No `rsms.me` / `inter.css` in HTML, CSP header, or browser network |
| 4. Screenshots (optional) | **DONE** | `results/planner/admin-svg-working/verify2/*.png` |

Honest note: edit page has a **non-fatal** React key warning (`ForwardRef(DropZoneEditInternal)`). That is **not** a global-error crash and does **not** block Puck. Documented under Observations — not scored as FAIL for this seat.

---

## 1) List page — `GET /admin/svg-editor/`

### HTTP (no-follow and follow)

```
status=200
final=http://localhost:3000/admin/svg-editor/
location=(none)
MaximumRedirection=0 → still 200 (no 3xx access redirect)
```

### Browser (Chrome DevTools)

- **Title:** `SVG block editor | Oando Admin`
- **URL after load:** `http://localhost:3000/admin/svg-editor/` (no bounce to login / access-denied)
- **Main content:** heading “SVG block editor”, table of 4 descriptors including `side-table-001`, “New block” link
- **Console errors/warnings:** none on list navigation
- **Network stylesheets/fonts:** local `/_next/static/media/CiscoSans*`, `HelveticaNeue*`, `__nextjs_font/geist*` only — **no** `rsms.me`

### Screenshot

- `results/planner/admin-svg-working/verify2/list-svg-editor.png`
- Raw HTML dump: `verify2/list.html`
- Probe JSON: `verify2/http-probe.json`

---

## 2) Edit page — `GET /admin/svg-editor/side-table-001/`

### HTTP

```
status=200
final=http://localhost:3000/admin/svg-editor/side-table-001/
location=(none)
MaximumRedirection=0 → still 200
```

Saved: `verify2/edit-headers.txt`, `verify2/edit.html`

### Browser — no global-error UI

`evaluate_script` on live DOM:

```json
{
  "url": "http://localhost:3000/admin/svg-editor/side-table-001/",
  "hasGlobalErrorUi": false,
  "errorAlertText": [],
  "bodyHasBlockEditor": true,
  "bodyHasPublish": true
}
```

A11y snapshot (live) shows working admin chrome + editor, **not** an error boundary page:

- Heading `side-table-001` (h1)
- Region **“Puck block editor”**
- Controls: Toggle left/right sidebar, undo/redo, **Publish**, Blocks / Outline
- Catalog blocks: `BlockFixed`, `BlockConfigurable`, `BlockParametric`
- Canvas iframe content: `Block descriptor "side-table-001" (fixed)` with Duplicate/Delete
- “Back to list” → `/admin/svg-editor/`

**Note on HTML string `global-error`:** raw RSC payload references Next’s registered `global-error.tsx` chunk/boundary (`site_app_global-error_tsx_…`, `type":"global-error"`). That is **framework wiring**, not a thrown global error. Visible UI does not show “Application error” / “Global Error”.

### Browser — Puck present

```json
{
  "puckElCount": 32,
  "hasPuckSection": true,
  "puckClasses": [
    "admin-puck-editor",
    "Puck _Puck_mr27u_19",
    "_PuckLayout_mr27u_36 …"
  ],
  "puckSectionText": "Block editor (Puck) · use the editor’s Publish control …"
}
```

Network includes Puck assets (all local, 200/304):

- `/_next/static/chunks/1pmo_%40puckeditor_core_dist_no-external_1uv8r4j.css`
- `/_next/static/chunks/1pmo_%40puckeditor_core_dist_*.js`
- Page chunk: `site_app_admin_svg-editor_%5Bid%5D_page_tsx_…js` [200]

Document status: **200**. No failed document load.

### Screenshot

- `results/planner/admin-svg-working/verify2/edit-side-table-001.png` (full page)

---

## 3) CSP — no request to `rsms.me/inter`

### Response CSP header (edit page)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: blob: https: http:;
font-src 'self' https://fonts.gstatic.com https://cdn.tldraw.com;
connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.openai.com https://openrouter.ai https://www.google-analytics.com https://unpkg.com https://cdn.tldraw.com;
frame-src 'self';
object-src 'none';
base-uri 'self'
```

- `rsms` in CSP: **false**
- `rsms.me` in HTML body (list + edit): **0 matches**
- `inter.css` in HTML body: **0 matches**

### Browser network (edit page, full list 63 requests)

Scanned all request URLs after navigation to edit page:

- **Zero** requests to `rsms.me`
- **Zero** requests matching `inter.css` / Inter CDN
- Fonts served from:
  - `localhost:3000/_next/static/media/CiscoSans*`
  - `localhost:3000/_next/static/media/HelveticaNeue*`
  - `localhost:3000/__nextjs_font/geist-latin.woff2`
  - `localhost:3000/__nextjs_font/geist-mono-latin.woff2`

List page network (stylesheets + fonts only) likewise local-only.

---

## Observations (not seat FAILs)

1. **React key warning (edit only):**  
   `Each child in a list should have a unique "key" prop` — `ForwardRef(DropZoneEditInternal)`. Console **error** level in DevTools; Next issues badge present. Page still renders Puck and is usable. Fix is quality debt, not a VERIFY-2 crash criterion.
2. **Loaded timestamp `1970-01-21…`** on descriptors looks like epoch/ms unit oddity in display data — unrelated to UI load / CSP for this seat.
3. **Auth:** Live session already had admin access (existing browser context + `DEV_AUTH_BYPASS`/session). HTTP probes also returned 200 without redirect — consistent with bypassed/local admin gate.

---

## Artifact index

| Path | What |
|------|------|
| `results/planner/admin-svg-working/VERIFY-LIVE-UI.md` | This report |
| `results/planner/admin-svg-working/verify2/http-probe.json` | Structured HTTP probe |
| `results/planner/admin-svg-working/verify2/edit-headers.txt` | Edit status + CSP + rsms flags |
| `results/planner/admin-svg-working/verify2/list.html` | List HTML dump |
| `results/planner/admin-svg-working/verify2/edit.html` | Edit HTML dump |
| `results/planner/admin-svg-working/verify2/list-svg-editor.png` | List screenshot |
| `results/planner/admin-svg-working/verify2/edit-side-table-001.png` | Edit screenshot (full page) |

---

## Final scorecard

```
1. List 200 / no access redirect ........ PASS
2. Edit 200 / no global-error / Puck .... PASS
3. No rsms.me/inter requests ............ PASS
4. Screenshots .......................... CAPTURED
-----------------------------------------------
VERIFY-2 OVERALL ........................ PASS
```
