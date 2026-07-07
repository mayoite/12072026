# Planner failures rollup (phases 00–07)

Date: 2026-07-07

Planner view only. Root [`Failures.md`](../../../Failures.md) stays authoritative for gate policy.

---

### `00-PRE-06` — Git clean at boundary

- **Open:** Phase zero precheck six git-clean is still unchecked.
- **Why:** Uncommitted phase work and unpushed local commits remain on `main`.
- **Resolution:** Commit or stash; push; confirm clean `git status` at boundary.
- **Resolved:** No

---

### `PLAN-FAIL-0408` — Coverage floor

- **Open:** No live proof that site coverage meets the ninety-percent floor.
- **Why:** Full `test:coverage` was not run with handbook artifacts captured.
- **Resolution:** Run `pnpm --filter oando-site run test:coverage` under `results/site/`.
- **Resolved:** No

---

### `PLAN-FAIL-0410` — Repo-wide lint

- **Open:** `pnpm run lint` still fails with one hundred thirty ESLint errors.
- **Why:** Repo-wide lint has not been cleaned to exit zero on current tree.
- **Resolution:** Dedicated lint pass; fix errors; re-run lint to exit zero.
- **Resolved:** No

---

### `PLAN-FAIL-0412` — Browser / runtime proof

- **Open:** Admin, portal, and planner routes lack user browser verification.
- **Why:** Only targeted Vitest and HTTP probes exist; no signed UI walkthrough.
- **Resolution:** `pnpm run dev`; hard-refresh routes; log proof or user sign-off.
- **Resolved:** No

---

### `PLAN-FAIL-0413` — Full Vitest suite

- **Open:** Full `pnpm run test` has no completed passing run on record.
- **Why:** Last run interrupted with at least one hundred fifteen failing tests.
- **Resolution:** Re-run full suite to completion; triage buckets; capture `vitest-run.json`.
- **Resolved:** No

---

### Phase 04 — Verified in staging

- **Open:** Admin SVG editor remains Implemented, verification pending—not staging verified.
- **Why:** Authenticated browser soak and review artifacts are still outstanding.
- **Resolution:** Close `0412` on admin routes; refresh signed review files under archive.
- **Resolved:** No

---

### Phase 05 — Verified in staging

- **Open:** Portal SVG catalog remains Implemented, verification pending—not staging verified.
- **Why:** Live HTTP probes pass; user browser soak under `0412` is still open.
- **Resolution:** Hard-refresh `/portal/svg-catalog` and slug; record user sign-off.
- **Resolved:** No

---

### Phase 06 — Verified in staging

- **Open:** Inventory consumer remains Implemented, verification pending—not staging verified.
- **Why:** Planner open3d UI browser proof and coverage floor proof are still open.
- **Resolution:** Verify catalog panel in planner; close `0412`; address `0408` when scheduled.
- **Resolved:** No

---

### Phase 07 — Verified in staging

- **Open:** Auth and permissions remain Implemented, verification pending—not staging verified.
- **Why:** Matrix and admin guard have vitest + HTTP probes; browser soak under `0412` is open.
- **Resolution:** Close `0412` on guest toolbar blocks and admin routes; user sign-off.
- **Resolved:** No

---

### Phase 04 — Review workflow artifacts

- **Open:** Signed critic, QA, and UI review files are missing or stale for phase four.
- **Why:** `10-review-workflow.md` requires three review artifacts before Implemented promotion claims.
- **Resolution:** Run review workflow; write GS-scored files under `archive/1b-5phase-agent-workflow/reviews/`.
- **Resolved:** No

---

### Release gate — `release:gate` / Playwright E2E

- **Open:** Release gate and Playwright E2E have not been run to completion.
- **Why:** `AGENTS.md` defers full gates until user request or release ship claim.
- **Resolution:** Run `pnpm run release:gate` after `0410`, `0413`, and `0408` improve.
- **Resolved:** No

---

### Local git — unpushed commit

- **Open:** Local `main` is one commit ahead of `origin/main` without push.
- **Why:** Truth-snapshot commit `8264d25` was never pushed to remote.
- **Resolution:** User-approved `git push` after reviewing local commit contents.
- **Resolved:** No

---

## Closed for phases 01–07 (reference)

| Item | Resolved |
|------|----------|
| Phase 01 engine lock (`01-INST-00`, `01-WORK-04`) | Yes |
| Phase 02 BlockDescriptor verified | Yes |
| Phase 03 SVG pipeline verified | Yes |
| Phase 04 check IDs `04-ADMIN-01/02/09` (vitest + probes) | Yes |
| Phase 05 check IDs `05-PORT-01/02/09` (vitest + probes) | Yes |
| Phase 06 check IDs `06-INV-01/05/06-TEST-01` (vitest + probes) | Yes |
| Phase 07 check IDs `07-AUTH-01/04/09` (vitest + probes) | Yes |
