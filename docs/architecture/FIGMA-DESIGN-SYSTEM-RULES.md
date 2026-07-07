# Figma Design System Rules

Status: recovery guidance for Figma-to-code work.

Authority: `MODULE-UI-CONTRACT.md`, `CSS-SOLUTION.md`, and `MODULE-LAYOUT.md`.

This repo is not Figma-ready yet.

These rules define the target intake contract. They do not claim Code Connect mappings exist.

## Tool Truth

- Figma plugin tools may be available in Codex.
- The `create_design_system_rules` helper is not guaranteed to be exposed.
- If that helper is unavailable, write and review rules manually in this doc.
- Do not claim a Figma MCP call ran unless it actually ran.
- Code Connect needs published Figma library components.
- Code Connect may require an Organization or Enterprise Figma plan.

## Required Figma Intake Flow

Use this flow for every Figma-driven code change:

1. Get design context for the exact node.
2. Get or keep a screenshot reference.
3. Map Figma values to repo tokens.
4. Identify existing repo components before creating new ones.
5. Translate generated code into repo conventions.
6. Put visual styling in CSS, not TSX.
7. Validate against the screenshot before claiming visual parity.

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

- Use Figma-provided assets only when the Figma tool returns real asset URLs.
- Store downloaded assets in the owning asset path.
- Do not add icon packages because a Figma design uses an icon.
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

Code Connect is a mapping layer.

It does not:

1. Fix design tokens.
2. Implement screens.
3. Repair SVG publishing.
4. Work on unpublished Figma parts.
5. Stabilize moving component paths.

Use Code Connect only after:

1. Component homes are stable.
2. Components are exported clearly.
3. Figma components are published to a library.
4. The user confirms mappings.

Do not map unstable admin or Open3D components during recovery.

## Refuse Or Defer

Refuse:

1. "Figma-ready" claims today.
2. Code Connect on unstable component paths.
3. Storybook-first design-system work during step 2.
4. New icon packages without import proof.
5. SVG plans with multiple equal authorities.

Defer:

1. Marketing Figma workflow until UI-3.
2. Code Connect until after stable component homes.
3. SVGR or sprite adoption until SVG authority is proven.
