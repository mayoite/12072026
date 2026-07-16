# Admin checklist

Code map: `FEATURES.md`. Blockers: `../../Failures.md`.

Fresh commands and exit codes must be recorded here. Old reports prove nothing.

---

## Step 0 — test isolation

- [ ] Canonical `inventory/descriptors/` hash gate passes in CI (not convention only).

---

## Authoring

- [ ] Fresh browser: Excalidraw draw → dimensions → preview → publish — no false success, no console errors.

---

## DB SVG cutover — depends on Planner DB reads

- [ ] `DB-SVG-01`…`05`: real publish transaction writes revision, artifacts, product pointer, and audit to Products DB; disk is no longer authority.
  - Disk authority confirmed today: `publishDescriptorWithPipeline.ts` comment "Phase 2 disk-path mapping (not full Products DB transaction yet)"; `published_svg_revision_id` pointer not written.
- [ ] `DB-SVG-06`: one atomic DB transaction; no orphan artifacts on failure.
- [ ] `DB-SVG-07`: failed publish leaves prior product pointer live — fresh proof.
- [ ] `DB-SVG-08`: repeated unchanged publish is idempotent — fresh proof.
- [ ] `DB-SVG-09`: stale draft lock rejected without data loss — fresh proof.
  - Gap: `staleDraftPublishGate` is client-only (`useAdminSvgEditorPublish.ts`); server publish path has no stale check.
- [ ] `DB-SVG-18`: DB vs approved-source parity tooling passes before disk authority is removed.
  - DB-SVG-17 dry-run exit 0 on 2026-07-16 (5 descriptors, 0 missing SVG) — not authority.
- [ ] `svg-blocks` route serves committed artifact bytes from DB revision, not disk descriptors.
- [ ] Fresh publish → Planner browser journey under DB authority.

---

## Families

- [ ] `ADM-FAM-01`/`02` browser: 2D / 3D / BOQ parity on released family fixture.

---

## Commercial

- [ ] Full price-book journey browser proof: draft → approve → activate → retire/restore → rollback.
- [ ] `ADM-PUB-02`, `ADM-PRICE-*`, `ADM-ROLE-01`, `ADM-AUDIT-01` — fresh browser pass.

---

## Close

- [ ] Failed publish preserves prior public product under DB authority.
- [ ] Only active items remain in `../../Failures.md`.
