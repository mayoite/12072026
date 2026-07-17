# Admin — blocker

**Date:** 2026-07-17  
**Status:** OPEN — deploy auth not proven

## Blocker

**DB-SVG cutover not done — disk is still live publish authority.**

Dual-write (when DB+R2 ready) now uploads **real** descriptor + SVG + PNG (honest checksums) and DB pointer path — unit-proven 2026-07-17. **Still not cutover:** disk remains release authority; Planner still disk-fallback. Until consumers are DB/R2-only, do not claim cutover PASS.

Secondary: browser unauth with bypass off; phone/price/publish smoke.

## Why open

- Live: `inventory/descriptors/`, `public/svg-catalog/`  
- Contract open: `docs/architecture/08-DATABASE-SVG-CONTRACT.md`  
- Active entry: `Failures.md`  

## Not this file

Plan: `plan/Admin/*`. Failures detail: `Failures.md`.

---

## A-W1

**Slice:** SVG publish residual — fail-closed compile unit path, disk authority UI copy, isolation re-verify.  
**Report:** `agent-reports/2026-07-17-aw1-svg-publish.md`

| Item | Status | Evidence |
|------|--------|----------|
| Isolation guard (EXEC-1) | **PASS** (re-verify) | A0 + catalogWriteIsolation unit |
| Real compile fail-closed before S4/persist | **PASS** | publishDescriptorWithPipeline A-W1 suite |
| Isolated real compile → S4 → persist | **PASS** | temp projectRoot + descriptor dir; canonical unchanged |
| Canonical S4 under Vitest blocked | **PASS** | isolation violation; no persist |
| POST `/api/admin/svg-editor` fail-closed compile | **PASS** | route unit 422 map; dual-write mocked |
| Disk authority publish copy | **PASS** | publishActionMessages (+ unit) |
| Browser publish / deploy auth | **OPEN** | not run |
| Dual-write cutover | **OPEN** | Failures.md; not OWN |
| `check:layout` | **PASS** | exit 0 |

**Did not touch:** dual-write resolver rewrite, commit/push, canonical catalog files.
