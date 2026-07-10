# P08 — Quality, accessibility, and safety

## Buyer problem

The product cannot be trusted if critical flows fail silently, keyboard users cannot operate it, admin writes are unsafe, or evidence hides failing output.

## Outcome

The core buyer, staff, planner, BOQ, and AI-review paths have clear quality gates. Known risks are either fixed or explicitly accepted by the owner.

## Scope

1. Run targeted type, lint, unit, browser, and accessibility checks for P01–P07 paths.
2. Test error states, empty states, offline behavior where relevant, and browser console failures.
3. Review server-only data access, admin authorization, secrets, upload/publish validation, and external asset policy.
4. Audit label-in-name, keyboard behavior, focus order, landmarks, and status messaging for critical flows.
5. Create one failure ledger. Do not suppress, delete, or relabel red output.

## Evidence

`results/10072026/P08-quality-and-security/` contains:

- raw command output;
- browser and accessibility reports;
- route-level failure matrix;
- security review notes tied to concrete files and routes;
- open-risk register with owner decision and removal condition.

## Acceptance

- Critical flows have no unreviewed red test or browser-console result.
- Admin and data writes are protected by the intended server-side boundary.
- Known accessibility gaps are named and do not masquerade as compliance.
- No secrets or third-party proprietary assets enter the repository.

## Non-goals

- A claim of full site-wide compliance without proof.
- A speculative rewrite of unrelated legacy code.

## Handoff

P09 uses the risk register. It cannot declare a release green if any blocker remains OPEN.
