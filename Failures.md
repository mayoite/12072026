# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## Owner blockers — NONE (full authority)

Owner granted full authority. Dual = **Supabase (Products DB metadata) + R2 (artifact bytes)**.  
Browser URL = **localhost only** (never 127.0.0.1).  
**Owner policy:** disk is **not** long-term release owner. Local dev may set `SVG_RELEASE_AUTHORITY=db` in repo-root `.env.local` (not committed).

---

## MAJOR

### 1. Seating card media (yellow) — **PARTIAL**

Optional re-screenshot after hard refresh.

### 2. Admin hydration mismatch `/admin/plans` — **OPEN**

React hydration attribute mismatch (manifest). Not cutover.

### 3. DB-SVG cutover — **PARTIAL**

| Check | Status |
|-------|--------|
| Dual-write readiness | `mode: enabled` when Products DB + R2 probe + pointer column |
| Dual-write publish (linear desk) | Proved for `oando-linear-desk-1600` → revision `oando-linear-desk-1600-r-c21c5863efda32467a4b` |
| Authority env | `SVG_RELEASE_AUTHORITY=db` may be set in repo-root `.env.local` |
| Revision API | `GET /api/planner/catalog/svg/{revisionId}/` when db authority configured |
| C4 parametric factory journey | **OPEN** — fresh Playwright required: `tests/e2e/planner-c4-guest-place-boq.spec.ts` (`oando-desk-assembly-12`, SKU `OANDO-DSK-ASM-12`, E2E isolated preview `/.e2e-svg-catalog/`, viewports 1280 + 390) |
| Deploy / preview env flip | **OPEN** |
| Full DB-SVG-01…20 matrix | **OPEN** |

### 4. Admin SVG chrome — **PARTIAL**

Dock + parametric form craft in code. Residual lifecycle parity optional.

---

## Rule for agents

| Ask owner only if | Do not ask |
|-------------------|------------|
| True secret missing | Permission theatre |
| Irreversible prod-only action host cannot do | localhost vs 127 lectures |

**Browser base URL: only `http://localhost:3000`.**  
**Restart `pnpm run dev` after env flip** so Next loads `SVG_RELEASE_AUTHORITY=db`.
