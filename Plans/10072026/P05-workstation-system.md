# P05 — Configurable workstation system

## Buyer problem

O&O does not sell one fixed chair or one static 3D file. It sells systems. The product must turn rules into usable options without hand-building every size and shape.

## Outcome

One O&O workstation family supports a defined size grid, linear and L configurations, and a limited module set. Valid options generate a real 2D symbol, modular 3D representation, and billable line items.

## Scope

1. Define the first family contract: allowed widths, depths, heights, shapes, desk modules, storage modules, and partitions.
2. Write validation for unsupported combinations and explain the rejection to the user.
3. Generate the 2D and 3D outputs from the same normalized system configuration.
4. Ensure repeated placement creates independent entity IDs but preserves the selected configuration.
5. Capture performance and browser proof for meaningful multiple-instance placement.

## Evidence

`results/10072026/P05-workstation-system/` contains:

- the approved rule table and sample valid/invalid configurations;
- unit tests for normalization, validation, generated dimensions, and IDs;
- screenshots of linear and L variants in 2D and 3D;
- browser proof of multiple placements;
- an explicit list of unsupported modules deferred from the first family.

## Acceptance

- A user can choose valid configurations without entering free-form magic values.
- Invalid combinations are blocked with a useful reason.
- A variant remains the same after selection, view switch, save, and reload.
- Generated output is clearly tied to the selected system rules.

## Non-goals

- Every O&O product family.
- A hand-authored mesh for every permutation.
- Final manufacturing CAD output.

## Handoff

P06 converts the placed system entities into project and BOQ data.
