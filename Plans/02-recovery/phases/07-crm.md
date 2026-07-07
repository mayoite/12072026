# 07 CRM

Goal: decide real CRM scope before repair.

## Modules

- CRM.
- Admin CRM routes.
- CRM API or DB paths.

## Allowed Scope

1. `site/features/crm`
2. CRM routes
3. CRM tests

## Hard No-Go Scope

1. New CRM product features before inventory.
2. Database migration.
3. Admin redesign.

## Initial Checks

```powershell
rg -n "crm|lead|customer|contact|opportunity" site/app site/features site/lib site/platform
pnpm --filter oando-site run typecheck
```

## First Decision

1. Real and repair now.
2. Placeholder and defer.
3. Partial and split.

## Domain And Access Baseline

Before feature repair, define:

1. CRM entities.
2. PII fields.
3. Admin roles.
4. Member access, if any.
5. Database owner.
6. API owner.
7. Audit/logging need.

## CRM Matrix

| Field | Required |
| --- | --- |
| Entity | Lead, customer, contact, opportunity, or other |
| Route/API | Path |
| Data source | DB table or service |
| PII | Yes or no |
| Allowed roles | Role list |
| Evidence | Inventory command or skipped reason |

## Exit Evidence

1. Route inventory.
2. API inventory.
3. DB dependency list.
4. Keep/trim/defer decision.
5. PII/access decision.

## Stop Conditions

1. Product scope is unclear.
2. Auth or DB blocks proof.
3. Tests do not exist and behavior is unclear.
4. PII handling is unclear.
