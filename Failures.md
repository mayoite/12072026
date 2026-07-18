# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## Owner blockers — NONE (full authority)

Owner granted full authority. Dual = Supabase + R2. Browser URL = **localhost only** (never 127.0.0.1).  
Do not wait on owner. Log bugs here and continue.

---

## MAJOR BUGS (2026-07-18, localhost + screenshots)

### 1. Workstations category empty — **PASS** (browser 2026-07-18)

| Check | Result |
|-------|--------|
| Root cause | seed dropped SQL statements that started with comments; env missed repo-root `.env.local` |
| Fix | loadEnvLocal + comment-strip; reseed |
| API | `total: 17` workstations |
| Browser | `/products/workstations` — **14 cards visible** (`results/site/verify-workstations.png`) |

### 2. Parametric desk preview tall "I" — **PASS** (browser 2026-07-18)

CSS max-width + dock preview. Live Preview shows horizontal desk + pedestals, not I-strip.  
Evidence: `results/admin/verify-parametric-dock.png`.

### 3. Seating card media (yellow / product display) — **PARTIAL**

Studio media tokens + catalog card polish shipped. Optional re-screenshot seating after hard refresh.

### 4. Guest planner "Loading catalog…" — **PASS** (browser 2026-07-18)

Honest status labels; brief Loading on first paint only; clears with inventory. Place step not stuck.  
Note: separate **Compiling** pill may show while SVG thumbs load (not "Loading catalog…").

### 5. Admin hydration mismatch — **OPEN**

`/admin/plans` console: React hydration attribute mismatch (manifest).

### 6. DB-SVG cutover — **OPEN** (not owner-blocked)

Dual-write readiness OK; authority still disk default until place proof + `SVG_RELEASE_AUTHORITY=db`.

### 7. Admin SVG chrome shared packages — **PARTIAL** (dock browser PASS)

Freehand + parametric Dockview live (Preview | Form/Studio | Details). Parametric dock **browser PASS**. Residual: freehand lifecycle pills not on parametric.

---

## Rule for agents

| Ask owner only if | Do not ask |
|-------------------|------------|
| True secret missing | Permission theatre |
| Irreversible prod-only action host cannot do | localhost vs 127 lectures |

**Browser base URL: only `http://localhost:3000`.**
