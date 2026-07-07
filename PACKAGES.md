# Packages

Date: 2026-07-07

Status: recovery policy.

Rule: manifests and imports beat this file.

This file is not install permission.

No package is added, removed, upgraded, or pinned without explicit scope and live proof.

## Status Labels

| Status | Meaning |
| --- | --- |
| `installed` | Present in a live manifest or lockfile. |
| `candidate` | Proposed, but not approved for install. |
| `deferred` | Not part of recovery unless a later phase proves need. |
| `unknown` | Must be verified by manifest and import census. |
| `keep-out` | Do not adopt unless explicitly approved later. |

## Current Recovery Decisions

| Package or tool | Status | Recovery decision | Proof required |
| --- | --- | --- | --- |
| `fabric` | unknown | Likely keep as 2D planner engine. | Manifest, imports, planner tests. |
| `three` | unknown | Likely keep as 3D runtime engine. | Manifest, imports, viewer tests. |
| `@react-three/fiber` | unknown | Likely keep as React binding for Three. | Manifest, imports, viewer tests. |
| `@react-three/drei` | unknown | Audit only. | Import proof and viewer need. |
| `@phosphor-icons/react` | unknown | Audit as preferred icon set. | Manifest, imports, icon policy check. |
| `lucide-react` | unknown | Remove only after replacement proof. | Import census. |
| `framer-motion` | unknown | Audit as possible animation layer. | Import census and CSS/motion boundary. |
| `motion` | unknown | Remove only after import proof. | Import census. |
| `@ark-ui/react` | unknown | Audit as admin/planner primitive candidate. | Manifest, imports, component inventory. |
| `react-aria-components` | unknown | Audit for Ark gaps only. | Manifest, imports, component inventory. |
| `@puckeditor/core` | unknown | Audit for admin composition. | Manifest, imports, route proof. |
| `@vercel-labs/json-render` | unknown | Audit. | Manifest, imports, current use. |
| `zod` | unknown | Audit for schemas. | Manifest, imports, schema owner. |
| `@flatten-js/core` | unknown | Audit for current SVG compiler path. | Manifest, imports, compiler tests. |
| `polygon-clipping` | unknown | Audit for current SVG compiler path. | Manifest, imports, compiler tests. |
| `svgo` | unknown | Audit for SVG optimization path. | Manifest, imports, compiler tests. |
| `@resvg/resvg-js` | unknown | Audit for thumbnail rendering path. | Manifest, imports, compiler tests. |
| `@svgdotjs/*` | unknown | Defer or remove after proof. | SVG authority decision and imports. |
| `mantine` | keep-out | Keep out during recovery. | Explicit later approval. |
| `fabric-editor-kit` | keep-out | Keep out during recovery. | Explicit later approval. |
| Penpot | candidate | Preferred free design workflow. No package by default. | Export policy and asset review. |
| Figma | deferred | Optional later for specific files or Code Connect. | Stable components and published Figma library. |
| SVGR | deferred | Not a recovery engine. | Later explicit SVG phase only. |
| SVG sprite | deferred | Not a recovery engine. | Later explicit SVG phase only. |

## Phase 01 Package Census

Phase 01 must record:

1. Root manifest status.
2. Site manifest status.
3. Lockfile status.
4. Exact import locations.
5. Runtime owner.
6. Decision: `installed`, `candidate`, `deferred`, `unknown`, or `keep-out`.

No import proof means no removal.

No benchmark note means no adoption.

No explicit approval means no install.

## Engine Policy

Current recovery stance:

1. Do not change engines during package audit.
2. Keep Fabric/Three/R3F only if manifests and imports prove current use.
3. Keep current SVG compiler path for recovery.
4. Defer SVGR and sprites.
5. Keep Penpot as workflow only.
6. Defer Figma Code Connect out of recovery.
7. Defer Turbopack replacement to deployment spike only.

## Refuse

Refuse:

1. `latest` pins without a version decision.
2. `INSTALLING NOW` claims without manifest proof.
3. Package additions hidden inside repair work.
4. Package removals without import proof.
5. Mantine or `fabric-editor-kit` adoption during recovery.
6. Storybook-first design-system work during recovery.
