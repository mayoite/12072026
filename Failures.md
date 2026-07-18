# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## Owner blockers — NONE (full authority)

Owner granted **full authority to the parent agent** (same as owner for execution calls).  
Zero permission holds. Keys rotated. DB + R2 granted.  
**Parent decides from evidence it has seen.** No subagent takes PASS/cutover/status calls.  
**Do not re-ask** owner for dual-write / R2 / DB / cutover / commit permission.  
Intent: durable catalog = **Supabase + R2**.  
`SVG_RELEASE_AUTHORITY=db` after parent-run place proof — not an owner hold.

Parent: read env, run scripts, execute, commit, push. No “disk vs db” lectures.  
**Do not wait on owner.** Blocker → note here → continue other work.

---

## Session note (agent)

Chrome: **Beta works** (`C:\Program Files\Google\Chrome Beta\Application\chrome.exe`). Stable path missing.  
MCP plugin still defaults to stable until session reloads config with `--executablePath=...Chrome Beta...`.  
Workaround used: Chrome Beta `--remote-debugging-port=9222` + Playwright CDP (`scripts/c3-parametric-browser-proof.mjs`).

### C3 browser evidence (2026-07-18, Chrome Beta CDP)

| Check | Result |
|-------|--------|
| Form `/admin/svg-editor/parametric` | Loaded (`data-testid=admin-linear-desk-parametric`) |
| Preview multipath | OK (desk-top/pedestal in preview HTML) |
| Publish | Success message; wrote `site/public/svg-catalog/oando-linear-desk-1600.svg` + descriptors |
| Maker parts on disk | `id="desk-top"` + pedestals present |
| Guest list | total 23 after publish; check `oando-linear-desk-1600` in svg-blocks |

Note: slug fill raced with auto-identity sync in proof script — published default slug `oando-linear-desk-1600` (acceptable for C3).

---

## DB-SVG cutover — agent work remaining (not owner-blocked)

| Step | Status |
|------|--------|
| Schema `published_svg_revision_id` | On Products DB — re-verify with script if needed |
| R2 + DB credentials | **Owner done** (keys rotated; present in env) |
| Dual-write publish path | **Ready (script):** `db_dual_write_readiness` → mode enabled, R2 ok (2026-07-18) |
| Revision API returns SVG | **Evidence:** guest `svg-blocks` 22/22 items use `/api/planner/catalog/svg/…-r-…` (dev) |
| Browser place brand SVG on guest from DB/R2 path | **PARTIAL** — guest loads revision SVG URLs (dev logs 200); full C3 parametric place still agent work |
| Set `SVG_RELEASE_AUTHORITY=db` | After parametric C3 place proof — parent call, not owner hold |

---

## Parametric desk (Admin Part C) — not a Failures owner block

Maker pen unit path exists (form/CLI/publish → `drawLinearDesk`).  
Browser C3/C4 and guest identity are **product work**, not owner permission blockers.

---

## Rule for agents

| Ask owner only if | Do not ask owner for |
|-------------------|----------------------|
| True secret missing from env and cannot proceed | Re-explaining disk vs `SVG_RELEASE_AUTHORITY` |
| Explicit deploy/prod push they must run | Permission to use DB+R2 (already granted) |
| Business product decision | “Is dual-write OK?” (yes: Supabase + R2) |
