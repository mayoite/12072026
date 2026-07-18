# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## Owner blockers — NONE (full authority)

Owner granted full authority. Dual = Supabase + R2. Browser URL = **localhost only** (never 127.0.0.1).  
Do not wait on owner. Log bugs here and continue.

---

## MAJOR BUGS (2026-07-18, localhost + screenshots)

### 1. Workstations category empty — **FAIL**

| Check | Result |
|-------|--------|
| Page `/products/workstations` | “No products are published in this category yet” |
| `GET /api/products/filter/?category=workstations` | `total: 0`, `catalogTotal: 0` |
| Live products by category | soft-seating 44, tables 20, chairs 5, other-seating 8, storage 8 — **no workstations / oando-workstations** |
| Disk images | 8 series folders under `public/images/catalog/oando-workstations--*` exist |

**Cause:** catalog product rows missing for workstations (data/seed/publish), not a missing page route.  
**Fix direction:** reseed / import workstation products into Products DB (or enable fallback seed for that category), then revalidate catalog cache.

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

### 7. Admin SVG chrome not on shared packages — **OPEN**

**Intent:** same chrome stack as Planner — `dockview-react`, `react-aria-components`, `@phosphor-icons/react` for toolbars, dockable panels, icons.  
**Not intent:** Planner Fabric place toolbars inside SVG editor.  
**Live:** SVG edit shell = custom CSS rails + Excalidraw’s own sketch bar; Dockview unused on Admin SVG. Parametric = raw form.  
**Fix direction:** wrap Admin SVG studio (and later parametric) in shared Dockview host / Aria toolbar patterns; keep Excalidraw/Maker as stage engines only.

---

## Rule for agents

| Ask owner only if | Do not ask |
|-------------------|------------|
| True secret missing | Permission theatre |
| Irreversible prod-only action host cannot do | localhost vs 127 lectures |

**Browser base URL: only `http://localhost:3000`.**
