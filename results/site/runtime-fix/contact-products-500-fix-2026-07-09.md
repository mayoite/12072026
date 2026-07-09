# Runtime fix evidence 2026-07-09

## Issue
HTTP 500 on /contact and /products (turbopack dev on localhost:3000)

## Root cause
Server Components imported @phosphor-icons/react which calls createContext at module eval time.
Error: "createContext only works in Client Components"

## Fix (minimal)
Switch Server Component icon imports to SSR entry (already used on showrooms):
- components/contact/ContactPageView.tsx -> @phosphor-icons/react/dist/ssr
- components/home/CategoryGrid.tsx -> same (products page)
- also: access page, CareerPageView, CollaborationSection (same bug class)

## Verification
- curl /contact/ -> 200, title Contact us | One&Only
- curl /products/ -> 200
- /access/ /career/ -> 200 after related fixes
- Screenshots: results/planner/world-standard-wave/screenshots-2026-07-09/contact-200.png, products-200.png
