# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## Owner blockers — NONE (full authority)

Owner granted full authority. Dual = **Supabase (Products DB metadata) + R2 (artifact bytes)**.  
Browser URL = **localhost only** (never 127.0.0.1).  
**Owner policy:** disk is **not** long-term release owner. Live flip: `SVG_RELEASE_AUTHORITY=db` (local `.env.local`, 2026-07-18).

---

## MAJOR (2026-07-18)

### 1. Workstations category empty — **PASS** (rechecked API total=17)

### 2. Parametric desk preview tall "I" — **PASS** (earlier browser)

### 3. Seating card media (yellow) — **PARTIAL**

Optional re-screenshot after hard refresh.

### 4. Guest planner "Loading catalog…" — **PASS** (status labels)

### 5. Admin hydration mismatch `/admin/plans` — **OPEN**

React hydration attribute mismatch (manifest). Not cutover.

### 6. DB-SVG cutover — **PARTIAL** (authority flipped locally; place proof still open)

| Check | Result (2026-07-18 parent) |
|-------|----------------------------|
| Dual-write readiness | `mode: enabled` (Products DB + R2 probe + pointer column) |
| Dual-write publish | **PASS** — slug `oando-linear-desk-1600` → revision `oando-linear-desk-1600-r-c21c5863efda32467a4b` |
| Supabase | `svg_revisions` + `svg_revision_artifacts` (descriptor, svg, png keys) + managed product pointer |
| R2 | Artifact keys under `svg-revisions/…/descriptor.json`, `symbol.svg`, `master.png` |
| Authority env | **`SVG_RELEASE_AUTHORITY=db`** set in repo-root `.env.local` (not committed) |
| Revision API | `GET /api/planner/catalog/svg/{revisionId}/` → **200** `image/svg+xml` |
| Disk | Local authoring residue may still exist; **not** desired long-term owner |
| **Still OPEN** | Full guest **place + BOQ** browser at 1280/390 of this revision; deploy/preview env flip; full DB-SVG-01…20 matrix |

### 7. Admin SVG chrome — **PARTIAL**

Dock + parametric form craft in code. Residual lifecycle parity optional.

---

## Rule for agents

| Ask owner only if | Do not ask |
|-------------------|------------|
| True secret missing | Permission theatre |
| Irreversible prod-only action host cannot do | localhost vs 127 lectures |

**Browser base URL: only `http://localhost:3000`.**  
**Restart `pnpm run dev` after env flip** so Next loads `SVG_RELEASE_AUTHORITY=db`.
