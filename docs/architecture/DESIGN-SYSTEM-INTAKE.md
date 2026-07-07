# Design System Intake

Status: recovery guidance for design-to-code work.

Primary design tool: Penpot first.

Figma and Code Connect are optional later.

Authority: `MODULE-UI-CONTRACT.md`, `CSS-SOLUTION.md`, and `MODULE-LAYOUT.md`.

This repo is not design-system-ready yet.

These rules define the target intake contract. They do not claim Penpot, Figma, or Code Connect integrations exist.

## Tool Truth

- Penpot is the preferred free design tool.
- Penpot is open-source and SVG/CSS-friendly.
- Figma remains optional if a specific Figma file or team workflow requires it.
- Figma Code Connect is a later mapping layer, not a recovery engine.
- Do not claim any design-tool API call ran unless it actually ran.
- Do not add design-tool packages without import proof and a clear workflow.

## Required Design Intake Flow

Use this flow for every design-driven code change:

1. Identify the exact design source.
2. Export or capture a visual reference.
3. Export assets as SVG or image files only when needed.
4. Map design values to repo tokens.
5. Identify existing repo components before creating new ones.
6. Translate the design into repo conventions.
7. Put visual styling in CSS, not TSX.
8. Validate against the visual reference before claiming parity.

If the design source is ambiguous, stop and ask.

## Penpot First

Use Penpot first for:

1. Free design-system drafting.
2. UI layout exploration.
3. SVG-friendly asset work.
4. Open design documentation.
5. Developer-readable CSS and SVG handoff.

Penpot recovery target:

1. Components and tokens documented in repo docs.
2. Exported SVG assets reviewed before import.
3. No direct package dependency unless proven necessary.
4. No claim of automatic sync unless a real workflow exists.

## Optional Figma Path

Use Figma only when:

1. The user provides a Figma file.
2. A collaborator requires Figma.
3. Code Connect is explicitly needed later.
4. A Figma-specific asset or design exists.

Figma intake rules:

1. Use exact node context.
2. Keep a screenshot reference.
3. Map Figma values to repo tokens.
4. Do not treat generated Figma code as final repo code.

If a Figma URL has no `node-id`, stop and ask for a node-specific URL.

## Styling Rules

TSX owns:

1. Structure.
2. Semantics.
3. State.
4. Data flow.
5. Accessibility wiring.

CSS owns:

1. Color.
2. Typography.
3. Spacing.
4. Radius.
5. Shadow.
6. Size.
7. Motion.
8. Surface styling.

Do not hardcode these in TSX:

1. Hex, rgb, hsl, or named colors.
2. Font families.
3. Font sizes.
4. Spacing numbers.
5. Width or height numbers for visual layout.
6. Border radius values.
7. Box shadow values.
8. Animation duration, easing, distance, or delay.

Allowed TSX exceptions:

1. Semantic component props.
2. ARIA values.
3. Data-driven canvas or SVG geometry where the value is content, not styling.
4. Explicitly documented temporary exceptions with owner and removal condition.

## Token Sources

| Token type | Source |
| --- | --- |
| Global theme tokens | `site/app/css/core/tokens/theme.css` |
| Typography utilities | `site/app/css/core/typography/type.css` |
| Planner tokens | `site/app/css/core/planner/planner-tokens.css` |
| Planner typography | `site/app/css/core/planner/planner-typography.css` |
| Shared components | `site/app/css/core/components` |
| Shared utilities | `site/app/css/core/utilities` |
| Admin shell | `site/app/css/core/chrome/shell/admin-pages.css` |

If a token does not exist, add it to the correct CSS layer before using it.

Do not invent one-off TSX values to move faster.

## Component Placement

Use `MODULE-LAYOUT.md`.

| Component kind | Home |
| --- | --- |
| Route shell | `site/app/**` |
| Planner product UI | `site/features/planner/open3d/**` |
| Planner admin UI | `site/features/planner/admin/**` |
| CRM UI | `site/features/crm/**` |
| Marketing UI | `site/components/**` or `site/features/planner/landing/**` |
| Pure shared logic | `site/lib/**` |
| Styling | `site/app/css/**` |

Do not place planner or admin product UI in generic marketing components.

## Asset Handling

- Prefer SVG for vector assets.
- Review exported SVG before importing.
- Store downloaded or exported assets in the owning asset path.
- Do not add icon packages because a design uses an icon.
- Do not create placeholders when real assets are available.
- Do not upload or delete CDN assets without explicit approval.

## SVG Policy

Recovery target:

1. One SVG API boundary.
2. One compile authority.
3. One runtime contract.

During recovery, prefer the current compiler path until Phase `03b` proves otherwise.

SVGR is only for trusted developer-owned UI SVG components.

Good SVGR candidates:

1. Static icons.
2. Logos.
3. Small stable illustrations.
4. Repo-owned presentational assets.

Bad SVGR candidates:

1. Admin-authored SVG blocks.
2. Published catalog artifacts.
3. Runtime SVG output from the compiler path.

SVG sprites are only for repeated static symbols.

Sprites are not an authoring system.

Sprites are not a publish authority.

## Code Connect Policy

Code Connect is optional and Figma-specific.

It maps published Figma library components to existing code components.

It does not:

1. Fix design tokens.
2. Implement screens.
3. Repair SVG publishing.
4. Work on unpublished Figma parts.
5. Stabilize moving component paths.

Use Code Connect only after recovery, and only after:

1. Component homes are stable.
2. Components are exported clearly.
3. Figma components are published to a library.
4. The user confirms mappings.

Do not map unstable admin or Open3D components during recovery.

## Refuse Or Defer

Refuse:

1. "Design-system-ready" claims today.
2. Code Connect on unstable component paths.
3. Storybook-first design-system work during step 2.
4. New icon packages without import proof.
5. SVG plans with multiple equal authorities.

Defer:

1. Figma Code Connect until after stable component homes.
2. Marketing design migration until UI-3.
3. SVGR or sprite adoption until SVG authority is proven.
