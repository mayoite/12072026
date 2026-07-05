# Sketch-to-Plan — Handover

**Last updated:** 2026-06-29

**Plan:** [`01-execution-plan.md`](01-execution-plan.md) · **Scope:** [`00-start.md`](00-start.md)

---

## Done (agent, 2026-06-29)

**Unit gate (plan §4):**

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/ai/sketchToPlan.test.ts `
  tests/unit/app/api/planner/sketch-to-plan/route.test.ts `
  tests/unit/planner-ai-sketchToPlan.test.ts
```

| Result | |
|--------|--|
| Test files | **3/3** |
| Tests | **11/11** pass |

Also included in full `test:planner` (**2073/2073** green).

---

## Not done (browser proof — plan §1–§3)

| Section | Still open |
|---------|------------|
| **§1** Failure contract | Recoverable vs unrecoverable failures **visible in workspace** (not unit-only) |
| **§2** Draft preservation | Upload + current draft preserved before conversion (runtime) |
| **§3** Underlay / preview / retry | Underlay before fetch, preview before commit, reject→rollback, retry preserves work, recovery UI on planner route |
| **§4** Close | Blocked until §1–§3 browser proof or logged gap |

**Gate policy:** No Playwright for this pack until `Failures.md` gate policy allows (`00-start.md`).

---

## Next (when gate opens)

1. Manual or E2E script on `/planner` for failure contract + recovery UI  
2. Trace upload → underlay → preview → commit / rollback path  
3. Close §4 or log gaps in `Failures.md`

---

## Baseline

| Item | Now |
|------|-----|
| Sketch unit tests | **11/11** (named gate files) |
| Browser proof §1–§3 | **open** |
| Owner | this pack (not unified planner §3) |
