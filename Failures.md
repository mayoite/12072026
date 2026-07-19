# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## Owner blockers — NONE (full authority)

Owner granted full authority. Dual = **Supabase (Products DB metadata) + R2 (artifact bytes)**.  
Browser URL = **localhost only** (never 127.0.0.1).  
**Owner policy:** disk is **not** long-term release owner. Local: `SVG_RELEASE_AUTHORITY=db` + `SVG_DISK_WRITE=0` in repo-root `.env.local` (not committed).

---

## MAJOR

### 1. Admin hydration mismatch `/admin/plans` — **OPEN**

React hydration attribute mismatch (manifest). Not cutover.

### 2. DB-SVG cutover — **PARTIAL**

| Check | Status |
|-------|--------|
| Authority env | **CONFIRMED** local `.env.local`: `SVG_RELEASE_AUTHORITY=db` |
| SVG catalog disk write (S4) | **OFF** — `SVG_DISK_WRITE=0` + db authority skips `public/svg-catalog` |
| Dual-write readiness | `mode: enabled` when Products DB + R2 probe + pointer column |
| Dual-write publish (linear desk) | Prior proof: `oando-linear-desk-1600` → revision `oando-linear-desk-1600-r-c21c5863efda32467a4b` |
| Revision API | `GET /api/planner/catalog/svg/{revisionId}/` when db authority configured |
| Product Studio one-page | **SHIPPED** (unit): `/admin/svg-editor` + `?new=` / `?edit=` + parametric redirect |
| C4 parametric factory journey | **OPEN** — fresh Playwright: `tests/e2e/planner-c4-guest-place-boq.spec.ts` |
| Deploy / preview env flip | **OPEN** |
| Full DB-SVG-01…20 matrix | **OPEN** |

---

## Closed this session (removed from active)

- Seating card media (optional re-screenshot) — residual, not a ship blocker
- Admin SVG chrome craft as active blocker — one-page Product Studio + CTA/edit routing shipped (unit + `check:layout`)

---

## Rule for agents

| Ask owner only if | Do not ask |
|-------------------|------------|
| True secret missing | Permission theatre |
| Irreversible prod-only action host cannot do | localhost vs 127 lectures |

**Browser base URL: only `http://localhost:3000`.**  
**Restart `pnpm run dev` after env flip** so Next loads `SVG_RELEASE_AUTHORITY=db`.
