# P00 — Truth and buyer contract

## Buyer problem

O&O loses time when the team cannot say which planner, catalog, admin, or quote path is real. The first deliverable is not code. It is one reliable map of the system that the next phases can use.

## Why now

The checkout contains uncommitted planner and SVG work. Older documents disagree about the live 2D canvas. The plan cannot safely start from old phase labels.

## Scope

1. Record `git rev-parse HEAD`, `git status --short`, installed package state, and active environment requirements.
2. Trace the real host chains for `/`, catalog routes, `/planner/guest`, `/planner/open3d`, admin catalog, SVG editor, CRM quotes, and AI advisor.
3. Identify the source of truth for product data, planner documents, descriptors, SVG files, generated meshes, and quote records.
4. Run a small smoke set. It must include layout check, typecheck, one planner unit pack, and route/browser probes needed to expose the current host chain.
5. Write a buyer contract. It defines the first usable prototype and explicit non-goals.

## Required artifacts

`results/10072026/P00-truth-and-contract/` must contain:

- `HEAD.txt` and `WORKTREE.txt`;
- `ROUTE-MAP.md`;
- `DATA-AUTHORITY.md`;
- `BUYER-CONTRACT.md`;
- raw test and browser logs;
- `VERDICT.md` with PASS, HALF, OPEN, or FAIL for every discovered surface.

## Acceptance

- The live planner host chain is proved from source and a browser load.
- No document names a deleted import path as live.
- Every later phase has a real code owner and evidence target.
- The buyer contract states the first target: one usable workstation system, planning, persistence, and an honest BOQ draft.

## Not in scope

- Product redesign.
- Fabric or Three rewrites.
- New services, schema migrations, or asset creation.

## Failure conditions

- A route only works because of a stale dev server or local seed.
- Code and documentation disagree and the mismatch is not recorded.
- A source of truth cannot be identified.

## Handoff

P01 starts only after the product family chosen for the buyer story is named in `BUYER-CONTRACT.md`.
