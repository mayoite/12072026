# Recovery Phases

Date: 2026-07-07

Use one file at a time.

## Order

1. `00-start.md`
2. `00b-contradiction-register.md`
3. `01-truth-reset-package-policy.md`
4. `02-styling-contract.md`
5. `02c-minimum-auth-db-proof.md`
6. `02b-site-ui-baseline.md` conditional
7. `03-admin-svg-editor.md`
8. `03b-svg-pipeline.md`
9. `04-planner-open3d.md`
10. `04a-planner-command-seam.md`
11. `04b-planner-persistence-json.md`
12. `04c-planner-viewer-boundary.md`
13. `04d-planner-svg-consumer.md`
14. `04e-planner-browser-journey.md`
15. `04f-design-intake-readiness.md` deferred; Penpot first
16. `05-auth.md`
17. `06-database.md`
18. `07-crm.md`
19. `08-cdn-assets.md`
20. `09-deployment.md`
21. `10-tech-stack-docs.md` very late
22. `11-docs.md`
23. `12-handover.md`

This order is not final law.

Change it if live evidence proves another blocker is earlier.

## Rule

Do not run multiple phases as one hidden batch.

Do not start implementation before `00-start.md` and `00b-contradiction-register.md`.

Do not run full release gates early.

Each phase needs:

1. Entry condition.
2. Allowed scope.
3. Checks.
4. Exit evidence.
5. Stop conditions.
6. Refusals and deferrals.
7. Artifact path, if a gate ran.

## Cost Caps

| Work | Cap |
| --- | --- |
| Package audit | Stop after package decision log is complete |
| Route inventory | Stop after blocker decision |
| Docs regeneration | Defer until source truth stabilizes |
| Site UI baseline | Run only when blocking current work |

## Benchmark Anchors

- React Compiler: `https://react.dev/learn/react-compiler`
- React Effects: `https://react.dev/learn/you-might-not-need-an-effect`
- Next Server and Client Components: `https://nextjs.org/docs/app/getting-started/server-and-client-components`
- Next mutating data: `https://nextjs.org/docs/app/getting-started/mutating-data`
- OWASP ASVS: `https://owasp.org/www-project-application-security-verification-standard/`
- OWASP Session Management: `https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html`
- Drizzle migrations: `https://orm.drizzle.team/docs/migrations`
- Drizzle transactions: `https://orm.drizzle.team/docs/transactions`
- Supabase RLS: `https://supabase.com/docs/guides/database/postgres/row-level-security`
- Cloudflare R2: `https://developers.cloudflare.com/r2/`
