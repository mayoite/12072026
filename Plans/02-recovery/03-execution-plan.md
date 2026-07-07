# Execution Plan

Date: 2026-07-07

Use this after the module baseline and recovery plan.

Status: in-principle execution index for step 2. Detailed work lives in phase files.

## Start Here

1. Read `01-module-baseline.md`.
2. Read `02-recovery-plan.md`.
3. Read the active phase file under `phases/`.
4. Work one phase at a time.

## Work Loop

1. Read the module docs.
2. Inspect live code.
3. Define the smallest repair.
4. Edit only allowed files.
5. Run scoped checks.
6. Record pass, fail, or skipped.
7. Commit and push only after a safe meaningful block.
8. Update handover notes.

Incomplete evidence stays incomplete.

## Module Work Template

| Field | Required |
| --- | --- |
| Module | Name and paths |
| Why now | The blocker that makes this module next |
| Allowed scope | Files and folders allowed |
| Hard no-go scope | Files and actions not allowed |
| Read first | Exact docs or source files |
| Change | Smallest repair |
| Checks | Exact commands |
| Evidence | Result paths and exit codes |
| Likely failures | Expected buckets |
| Stop conditions | When to stop and re-scope |
| Handover notes | What the next worker needs |

## Phase Index

| Phase | Execution file |
| --- | --- |
| 00 Start | `phases/00-start.md` |
| 01 Truth reset and package policy | `phases/01-truth-reset-package-policy.md` |
| 02 Styling contract | `phases/02-styling-contract.md` |
| 03 Admin SVG editor | `phases/03-admin-svg-editor.md` |
| 03b SVG pipeline | `phases/03b-svg-pipeline.md` |
| 04 Planner Open3D | `phases/04-planner-open3d.md` |
| 04b Code Connect readiness | `phases/04b-code-connect-readiness.md` |
| 05 Auth | `phases/05-auth.md` |
| 06 Database | `phases/06-database.md` |
| 07 CRM | `phases/07-crm.md` |
| 08 CDN and assets | `phases/08-cdn-assets.md` |
| 09 Deployment | `phases/09-deployment.md` |
| 10 Tech-stack docs | `phases/10-tech-stack-docs.md` |
| 11 Docs | `phases/11-docs.md` |
| 12 Handover | `phases/12-handover.md` |

## Evidence Rule

Do not say:

1. "Fixed" unless the check passed.
2. "Clean" unless `git status` and relevant gates prove it.
3. "Deployable" unless build and release evidence prove it.
4. "Console clean" without browser console evidence.
