# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## Owner blockers — NONE (full authority)

Owner granted full authority. Dual = Supabase + R2. Browser URL = **localhost only** (never 127.0.0.1).  
Do not wait on owner. Log bugs here and continue.

---

## MAJOR BUGS (2026-07-18, localhost + screenshots)

### 1. Workstations category empty — **FIXED in data (parent browser recheck)**

| Check | Result |
|-------|--------|
| Pre-fix DB | no `oando-workstations` category; **0** workstation product rows |
| Root cause | `scripts/seed.ts` dropped statements that started with SQL comments — first category (`oando-workstations`) and first product never inserted; env load also missed repo-root `.env.local` |
| Fix applied | loadEnvLocal + comment-strip in `seed.ts` / `fix_and_reseed.ts`; reseed; point 8 series flagship paths at `public/images/catalog/oando-workstations--*` |
| `GET /api/products/filter/?category=workstations` (2026-07-18, localhost:3000) | **`total: 17`, `catalogTotal: 17`** (was 0) |
| DB after seed | 8× `oando-workstations` + 8× `workstations` (+ chairs category products also landed) |
| Remaining | parent hard-refresh `/products/workstations`; 7 legacy `workstations` slugs still use missing `/images/products/*` paths (dedupe prefers `oando-*` rows) |

**Not a route bug.** Do not re-litigate without a fresh API/DB probe.

### 2. Parametric desk preview looks wrong — **FAIL** (display)

Screenshot `admin_admin_svg-editor_parametric.png`: plan symbol appears as a tall “I” strip.  
**Cause:** inline SVG uses absolute mm `width`/`height` (e.g. 1600×800) without `max-width: 100%`, so the preview clips a vertical strip.  
**Fix:** CSS `.admin-linear-desk-preview svg { width:100%; height:auto }` (in progress / applied).

### 3. Seating card media (yellow / product display) — **PARTIAL**

Warm ecru media background made product photos look yellow; display cramped.  
**Fix applied:** cool studio gradient + contain + less aggressive scale (catalog-card-media + FilterGrid). Re-screenshot after hard refresh.

### 4. Guest planner “Loading catalog…” — **PARTIAL**

Screenshot shows status bar stuck on “Loading catalog…” while tour is open. Catalog API itself returns items; UI may race or stay on loading state. Investigate inventory load UX after Place step.

### 5. Admin hydration mismatch — **OPEN**

`/admin/plans` console: React hydration attribute mismatch (manifest).

### 6. DB-SVG cutover — **OPEN** (not owner-blocked)

Dual-write readiness OK; authority still disk default until place proof + `SVG_RELEASE_AUTHORITY=db`.

### 7. Admin SVG chrome shared packages — **PARTIAL** (parametric dock wired)

**Intent:** Dockview + React Aria + Phosphor for Admin SVG shell (toolbars / dockable panels / icons).  
**Not intent:** Planner Fabric place tools. Stage engines stay Excalidraw (own sketch tools) / form+Maker.  
**Live:** Freehand uses `AdminSvgEditorShell` + `AdminSvgDockHost`. Parametric linear desk reuses `AdminSvgDockHost` (preview | Form | details, `stageScrollable`) + Aria status toolbar + Phosphor; publish still form+Maker. Residual: no full freehand TopBar lifecycle pills on parametric; browser visual QA still open.

---

## Rule for agents

| Ask owner only if | Do not ask |
|-------------------|------------|
| True secret missing | Permission theatre |
| Irreversible prod-only action host cannot do | localhost vs 127 lectures |

**Browser base URL: only `http://localhost:3000`.**
