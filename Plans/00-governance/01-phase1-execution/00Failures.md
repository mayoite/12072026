# Planner failures rollup (phases 00–08)

Date: 2026-07-07 (stop boundary)

Planner view only. Root [`Failures.md`](../../../Failures.md) stays authoritative for gate policy.

---

### `00-PRE-06` — Git clean at boundary

- **Open:** —
- **Why:** Phase 08, gate fixes, and `results/` evidence committed this session.
- **Resolution:** Commit + push; confirm clean `git status` at boundary.
- **Resolved:** Yes (this commit)

---

### `PLAN-FAIL-0408` — Coverage floor

- **Open:** No live proof that site coverage meets the ninety-percent floor.
- **Why:** Full `test:coverage` was not run with handbook artifacts captured.
- **Resolution:** Run `pnpm --filter oando-site run test:coverage` under `results/site/`.
- **Resolved:** No

---

### `PLAN-FAIL-0410` — Repo-wide lint

- **Open:** `pnpm run lint` still fails (baseline ~130 errors; partial cleanup in progress).
- **Why:** Repo-wide lint has not been cleaned to exit zero on current tree.
- **Resolution:** Dedicated lint pass; fix errors; re-run lint to exit zero.
- **Resolved:** No

---

### `PLAN-FAIL-0412` — Browser / runtime proof

- **Open:** Admin, portal, and planner routes lack user browser verification.
- **Why:** One runtime probe failed (`results/site/release-gates/runtime-0412/`); user directed **no further 0412 attempts** this session.
- **Resolution:** User-owned browser soak or explicit re-request; do not re-run `phase0412-runtime-probe.mjs` without override.
- **Resolved:** No

---

### `PLAN-FAIL-0413` — Full Vitest suite

- **Open:** Full `pnpm run test` has no completed passing run on record.
- **Why:** Prior run had ~125 failures; stub restoration and `adminDb` mock fix reduced bucket size; full suite not re-run to completion this session.
- **Resolution:** Re-run full suite to completion; triage remaining buckets; capture `vitest-run.json`.
- **Resolved:** No (partial: `planner-store-plannerPersistence.test.ts` 15/15 pass after `adminDb` mock fix)

---

### Phase 04–08 — Verified in staging

- **Open:** Phases 04–08 remain **Implemented, verification pending** — not staging verified.
- **Why:** Vitest + HTTP probe evidence is on record under `results/site/phase-04|05|06|07|08/`; browser soak `0412` open.
- **Resolution:** User sign-off on live routes when ready; close `0412` only with explicit browser proof.
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

## Closed for phases 01–08 (reference)

| Item | Resolved |
|------|----------|
| Phase 01 engine lock (`01-INST-00`, `01-WORK-04`) | Yes |
| Phase 02 BlockDescriptor verified | Yes |
| Phase 03 SVG pipeline verified | Yes |
| Phase 04 check IDs `04-ADMIN-01/02/09` (vitest + probes) | Yes |
| Phase 05 check IDs `05-PORT-01/02/09` (vitest + probes) | Yes |
| Phase 06 check IDs `06-INV-01/05/06-TEST-01` (vitest + probes) | Yes |
| Phase 07 check IDs `07-AUTH-01/04/09` (vitest + probes) | Yes |
| Phase 08 check IDs `08-PERS-04/10` + dual-read disk evidence | Yes |
| Phase 08 code (lock, versioned layout, pointer loader, archive) | Yes — committed this session |
