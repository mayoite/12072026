# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## Owner blockers — NONE (full authority)

Owner granted **full authority**. Zero permission holds (keys rotated; DB + R2 granted).  
**Do not re-ask** for dual-write / R2 / DB / cutover / commit permission.  
Env has Products DB + R2. Intent: durable catalog = **Supabase + R2**.  
Code default remains disk until `SVG_RELEASE_AUTHORITY=db` after agent-proven place — **agent execution**, not an owner hold.

Agents: read `.env.local` / run scripts. Execute. Commit. Do not loop the owner on “disk vs db” lectures.

---

## DB-SVG cutover — agent work remaining (not owner-blocked)

| Step | Status |
|------|--------|
| Schema `published_svg_revision_id` | On Products DB — re-verify with script if needed |
| R2 + DB credentials | **Owner done** (keys rotated; present in env) |
| Dual-write publish path | Agent: prove publish → DB row + R2 bytes |
| Revision API returns SVG | Agent: prove read path |
| Browser place brand SVG on guest from DB/R2 path | **Agent OPEN** (not waiting on owner) |
| Set `SVG_RELEASE_AUTHORITY=db` | Agent after place proof — **owner permission not required again** |

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
