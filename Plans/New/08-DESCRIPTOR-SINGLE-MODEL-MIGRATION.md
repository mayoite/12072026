# 08 — Descriptor Single Model Migration

Status: Phase 2 prep, but execute only after 07.
Owner: __________
Exit date: __________
Depends on: 07

## Goal

Delete the dual descriptor reality.

## Tasks

1. Inventory every producer and consumer of `BlockDescriptor`.
2. Inventory every producer and consumer of `SvgBlockDefinitionV1`.
3. Choose the surviving model.
4. Add migration tooling for persisted descriptor data.
5. Update planner loaders to consume the surviving model directly.
6. Delete the adapter bridge once all call sites are gone.

## Exit criteria

- Only one descriptor model remains in code.
- Adapter code is deleted.
- Reference blocks still work after migration.
