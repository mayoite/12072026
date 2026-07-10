# P01 — Buyer entry and catalog truth

## Buyer problem

A prospective client must understand what O&O sells before they see a planner. Broken images, empty categories, placeholder products, or unclear system language destroy trust before the project begins.

## Outcome

The public site tells one coherent story: O&O designs configurable office systems, not a pile of unrelated furniture SKUs. A buyer can find the first workstation family, understand its options, and begin an enquiry or planning journey.

## Scope

1. Audit the public navigation, product categories, product detail routes, enquiry/contact route, and portal entry.
2. Select one real workstation family as the reference product. Define its system, shapes, size grid, and modules in catalog data.
3. Repair only buyer-visible catalog truth: identity, images, dimensions, availability wording, and missing-data states.
4. Ensure catalog reads use the defined server/data path. Do not add a parallel client-side catalog authority.
5. Add a browser journey: landing page → system/category → product detail → enquiry or planner entry.

## Evidence

Store under `results/10072026/P01-buyer-entry-and-catalog/`:

- route screenshots at desktop and mobile width;
- raw network and console output;
- catalog-source audit;
- a list of image failures and their honest fallback behavior;
- a test proving the selected family appears where the buyer expects it.

## Acceptance

- Critical public routes load without a red boundary or silent empty result.
- The reference system has no false specification, price, or stock claim.
- Missing image or data states explain the absence. They do not masquerade as finished content.
- The public path reaches a real next action.

## Non-goals

- Completing every product category.
- SEO or marketing copy rewrites unrelated to the system story.
- Live price promises.

## Handoff

P02 uses the selected family and its data contract as its publish target.
