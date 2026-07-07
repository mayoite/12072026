Execute Phase 07 only.

Primary path focus:
- site/config/route-contract.json
- site/features/planner/**
- site/app/**/api/admin/**
- auth and withAuth related files
- results/**

Goal:
Implement guest/member/admin permission enforcement and admin boundary hardening.

Must complete:
- plannerPermissions.ts matrix
- withAuth widening required by plan
- guest-blocked toolbar/actions
- no client Supabase usage
- typed command registry enforcement
- lint guard on /api/admin/
- cross-matrix auth tests
- additive 422 mapper behavior

Check IDs:
- 07-AUTH-01
- 07-AUTH-04
- 07-AUTH-09

Security constraints:
- validate every guest/member/admin read and mutation path
- use regex-pattern-based service key leak protection logic
- no hidden client-side auth assumptions
- no bypasses

Return exactly:
1. Scope executed.
2. Files changed.
3. Checks run.
4. Evidence paths.
5. Gate result by check ID.
6. Status recommendation.
7. Open blockers.
8. Next smallest safe slice.
