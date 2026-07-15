export type RouteClassification =
  | "public"
  | "protected"
  | "redirect"
  | "not-found"
  | "removed";

export interface SiteRouteMeta {
  route: string;
  classification: RouteClassification;
  audience: string;
  intent: string;
  owner: string;
  canonicalUrl: string;
  primaryAction: string;
  indexable: boolean;
  notes?: string;
}

const SITE_BASE = "https://oneonly.in";

function canonicalFor(route: string): string {
  const normalized = route.endsWith("/") ? route : `${route}/`;
  return `${SITE_BASE}${normalized}`;
}

export const SITE_ROUTE_CLASSIFICATION: SiteRouteMeta[] = [
  {
    route: "/",
    classification: "public",
    audience: "Public visitor",
    intent: "Brand entry, headline value proposition, primary CTAs",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/"),
    primaryAction: "Explore products",
    indexable: true,
  },
  {
    route: "/products",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Browse the full office-furniture catalog",
    owner: "Site",
    canonicalUrl: canonicalFor("/products"),
    primaryAction: "Open a product category",
    indexable: true,
  },
  {
    route: "/products/[category]",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "List products within a catalog category",
    owner: "Site",
    canonicalUrl: canonicalFor("/products/[category]"),
    primaryAction: "Open a product",
    indexable: true,
  },
  {
    route: "/products/[category]/[product]",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Product detail, specs, gallery, and enquiry",
    owner: "Site",
    canonicalUrl: canonicalFor("/products/[category]/[product]"),
    primaryAction: "Request a quote",
    indexable: true,
  },
  {
    route: "/products/category/[slug]",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Curated category landing page",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/products/category/[slug]"),
    primaryAction: "Browse category products",
    indexable: true,
  },
  {
    route: "/solutions",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Workspace planning approach and solution sets",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/solutions"),
    primaryAction: "Open a solution",
    indexable: true,
  },
  {
    route: "/solutions/[category]",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Solution set detail for a sector or space type",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/solutions/[category]"),
    primaryAction: "Talk to planning team",
    indexable: true,
  },
  {
    route: "/planning",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Explain workspace planning service",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/planning"),
    primaryAction: "Request a survey",
    indexable: true,
  },
  {
    route: "/contact",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Enquiry capture",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/contact"),
    primaryAction: "Submit enquiry",
    indexable: true,
  },
  {
    route: "/about",
    classification: "public",
    audience: "Public visitor",
    intent: "Company story and credentials",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/about"),
    primaryAction: "Meet the team",
    indexable: true,
  },
  {
    route: "/downloads",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Resource desk: catalogs, technical sheets, references",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/downloads"),
    primaryAction: "Download a catalog",
    indexable: true,
  },
  {
    route: "/brochure",
    classification: "redirect",
    audience: "Public visitor / buyer",
    intent: "Legacy brochure path redirected to /downloads/",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/downloads"),
    primaryAction: "Redirect to downloads",
    indexable: false,
    notes: "Redirects to /downloads/; not a standalone indexable document.",
  },
  {
    route: "/download-brochure",
    classification: "redirect",
    audience: "Public visitor / buyer",
    intent: "Legacy brochure download path redirected to /downloads/",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/downloads"),
    primaryAction: "Redirect to downloads",
    indexable: false,
    notes: "Redirects to /downloads/; not a standalone indexable document.",
  },
  {
    route: "/career",
    classification: "public",
    audience: "Public candidate",
    intent: "Open roles and hiring",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/career"),
    primaryAction: "Apply for a role",
    indexable: true,
  },
  {
    route: "/news",
    classification: "public",
    audience: "Public visitor",
    intent: "Company and industry updates",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/news"),
    primaryAction: "Read an update",
    indexable: true,
  },
  {
    route: "/gallery",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Installed-project photo gallery",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/gallery"),
    primaryAction: "View a project",
    indexable: true,
  },
  {
    route: "/compare",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Side-by-side product comparison",
    owner: "Site",
    canonicalUrl: canonicalFor("/compare"),
    primaryAction: "Add a product to compare",
    indexable: true,
  },
  {
    route: "/trusted-by",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Client proof and scale",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/trusted-by"),
    primaryAction: "View clients",
    indexable: true,
  },
  {
    route: "/showrooms",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Showroom locations and visits",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/showrooms"),
    primaryAction: "Plan a visit",
    indexable: true,
  },
  {
    route: "/portfolio",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Delivered-project portfolio",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/portfolio"),
    primaryAction: "Open a case study",
    indexable: true,
  },
  {
    route: "/service",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "After-sales and support services",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/service"),
    primaryAction: "Open a service request",
    indexable: true,
  },
  {
    route: "/support-ivr",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Visual IVR support menu",
    owner: "Ops",
    canonicalUrl: canonicalFor("/support-ivr"),
    primaryAction: "Resolve a query",
    indexable: false,
    notes: "Operational IVR utility; noindex.",
  },
  {
    route: "/templates",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Reusable workspace templates",
    owner: "Site",
    canonicalUrl: canonicalFor("/templates"),
    primaryAction: "Open a template",
    indexable: true,
  },
  {
    route: "/choose-product",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Guided product selection (auth or guest mode)",
    owner: "Site",
    canonicalUrl: canonicalFor("/choose-product"),
    primaryAction: "Start product picker",
    indexable: false,
    notes: "Auth/guest workspace entry; noindex utility.",
  },
  {
    route: "/privacy",
    classification: "public",
    audience: "Public visitor",
    intent: "Privacy policy",
    owner: "Ops",
    canonicalUrl: canonicalFor("/privacy"),
    primaryAction: "Read policy",
    indexable: true,
  },
  {
    route: "/terms",
    classification: "public",
    audience: "Public visitor",
    intent: "Terms of use",
    owner: "Ops",
    canonicalUrl: canonicalFor("/terms"),
    primaryAction: "Read terms",
    indexable: true,
  },
  {
    route: "/imprint",
    classification: "public",
    audience: "Public visitor",
    intent: "Legal imprint and disclosures",
    owner: "Ops",
    canonicalUrl: canonicalFor("/imprint"),
    primaryAction: "Read imprint",
    indexable: true,
  },
  {
    route: "/refund-and-return-policy",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Refund and return policy",
    owner: "Ops",
    canonicalUrl: canonicalFor("/refund-and-return-policy"),
    primaryAction: "Read policy",
    indexable: true,
  },
  {
    route: "/sustainability",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Sustainability commitments",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/sustainability"),
    primaryAction: "Read commitments",
    indexable: true,
  },
  {
    route: "/social",
    classification: "public",
    audience: "Public visitor",
    intent: "Social highlights feed",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/social"),
    primaryAction: "View posts",
    indexable: true,
  },
  {
    route: "/projects",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Client roster and delivery proof",
    owner: "Marketing",
    canonicalUrl: canonicalFor("/projects"),
    primaryAction: "Open a project",
    indexable: true,
  },
  {
    route: "/tracking",
    classification: "public",
    audience: "Authenticated customer",
    intent: "Order and delivery tracking utility",
    owner: "Ops",
    canonicalUrl: canonicalFor("/tracking"),
    primaryAction: "Track an order",
    indexable: false,
    notes: "Operational utility page; noindex.",
  },
  {
    route: "/repo-store",
    classification: "public",
    audience: "Internal / ops",
    intent: "Internal asset/artifact store utility",
    owner: "Ops",
    canonicalUrl: canonicalFor("/repo-store"),
    primaryAction: "Open store",
    indexable: false,
    notes: "Operational utility page; noindex.",
  },
  {
    route: "/access",
    classification: "public",
    audience: "Public / accessibility users",
    intent: "Accessibility tools and preferences",
    owner: "Ops",
    canonicalUrl: canonicalFor("/access"),
    primaryAction: "Adjust preferences",
    indexable: false,
    notes: "Utility page; noindex.",
  },
  {
    route: "/quote-cart",
    classification: "public",
    audience: "Public visitor / buyer",
    intent: "Quote cart and list builder",
    owner: "Site",
    canonicalUrl: canonicalFor("/quote-cart"),
    primaryAction: "Submit quote request",
    indexable: false,
    notes: "Cart/utility state page; noindex.",
  },
  {
    route: "/catalog",
    classification: "redirect",
    audience: "Public visitor",
    intent: "Legacy catalog path redirected to /downloads/",
    owner: "Site",
    canonicalUrl: canonicalFor("/downloads"),
    primaryAction: "Redirect to downloads",
    indexable: false,
    notes: "301 redirect to /downloads/ (benchmark note).",
  },
  {
    route: "/portal",
    classification: "protected",
    audience: "Authenticated customer",
    intent: "Customer portal home",
    owner: "Site",
    canonicalUrl: canonicalFor("/portal"),
    primaryAction: "Open dashboard",
    indexable: false,
    notes: "Behind auth proxy/guard; not indexable.",
  },
  {
    route: "/portal/[id]",
    classification: "protected",
    audience: "Authenticated customer",
    intent: "Single project/plan workspace in portal",
    owner: "Site",
    canonicalUrl: canonicalFor("/portal/[id]"),
    primaryAction: "Open project",
    indexable: false,
    notes: "Behind auth proxy/guard; not indexable.",
  },
  {
    route: "/portal/guest",
    classification: "protected",
    audience: "Guest session",
    intent: "Guest portal entry",
    owner: "Site",
    canonicalUrl: canonicalFor("/portal/guest"),
    primaryAction: "Open guest workspace",
    indexable: false,
    notes: "Behind auth proxy/guard; not indexable.",
  },
  {
    route: "/portal/guest/view/[id]",
    classification: "protected",
    audience: "Guest session",
    intent: "Read-only guest view of a shared plan",
    owner: "Site",
    canonicalUrl: canonicalFor("/portal/guest/view/[id]"),
    primaryAction: "View shared plan",
    indexable: false,
    notes: "Behind auth proxy/guard; not indexable.",
  },
  {
    route: "/portal/svg-catalog",
    classification: "protected",
    audience: "Authenticated customer / admin",
    intent: "SVG catalog manager",
    owner: "Site",
    canonicalUrl: canonicalFor("/portal/svg-catalog"),
    primaryAction: "Open SVG catalog",
    indexable: false,
    notes: "Behind auth proxy/guard; not indexable.",
  },
  {
    route: "/portal/svg-catalog/[slug]",
    classification: "protected",
    audience: "Authenticated customer / admin",
    intent: "SVG catalog item detail",
    owner: "Site",
    canonicalUrl: canonicalFor("/portal/svg-catalog/[slug]"),
    primaryAction: "Open SVG item",
    indexable: false,
    notes: "Behind auth proxy/guard; not indexable.",
  },
  {
    route: "/dashboard",
    classification: "protected",
    audience: "Authenticated customer",
    intent: "Customer dashboard",
    owner: "Site",
    canonicalUrl: canonicalFor("/dashboard"),
    primaryAction: "Open dashboard",
    indexable: false,
    notes: "Behind auth proxy/guard; not indexable.",
  },
  {
    route: "/login",
    classification: "protected",
    audience: "Public / returning customer",
    intent: "Authentication entry",
    owner: "Site",
    canonicalUrl: canonicalFor("/login"),
    primaryAction: "Sign in",
    indexable: false,
    notes: "Auth gate; not indexable.",
  },
  {
    route: "/_not-found",
    classification: "not-found",
    audience: "Public visitor",
    intent: "Global not-found fallback",
    owner: "Site",
    canonicalUrl: canonicalFor("/_not-found"),
    primaryAction: "Return home",
    indexable: false,
    notes: "app/(site)/not-found.tsx fallback; no canonical index.",
  },
];

function isDynamicSegment(segment: string): boolean {
  return segment.startsWith("[") && segment.endsWith("]");
}

function segmentize(route: string): string[] {
  return route.split("/").filter((segment) => segment.length > 0);
}

function concretePathToSegments(path: string): string[] {
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return trimmed.split("/").filter((segment) => segment.length > 0);
}

function patternMatches(pattern: string, path: string): boolean {
  const patternSegments = segmentize(pattern);
  const pathSegments = concretePathToSegments(path);
  if (patternSegments.length !== pathSegments.length) {
    return false;
  }
  for (let i = 0; i < patternSegments.length; i++) {
    if (isDynamicSegment(patternSegments[i])) {
      continue;
    }
    if (patternSegments[i] !== pathSegments[i]) {
      return false;
    }
  }
  return true;
}

const SORTED_CLASSIFICATION: SiteRouteMeta[] = [...SITE_ROUTE_CLASSIFICATION].sort(
  (a, b) => segmentize(b.route).length - segmentize(a.route).length,
);

export function getRouteClassification(route: string): SiteRouteMeta | undefined {
  const normalized = route.split("?")[0] ?? route;
  return SORTED_CLASSIFICATION.find((meta) => patternMatches(meta.route, normalized));
}

export const PUBLIC_INDEXABLE_ROUTES: string[] = SITE_ROUTE_CLASSIFICATION.filter(
  (meta) => meta.classification === "public" && meta.indexable,
).map((meta) => meta.route);

/** Concrete marketing paths for sitemap generation (no dynamic segments). */
export const PUBLIC_INDEXABLE_STATIC_PATHS: string[] = PUBLIC_INDEXABLE_ROUTES.filter(
  (route) => !route.includes("["),
);

/** Planner marketing routes live outside `(site)` but remain indexable launch surfaces. */
export const PLANNER_MARKETING_SITEMAP_PATHS = [
  "/planner",
  "/planner/help",
  "/planner/features",
  "/planner/features/measure",
  "/planner/features/3d-view",
  "/planner/features/ai-assist",
  "/planner/features/export",
] as const;

/** Concrete solution category paths mirrored from `app/(site)/solutions/[category]/page.tsx`. */
export const SOLUTION_CATEGORY_SITEMAP_PATHS = [
  "/solutions/seating",
  "/solutions/workstations",
  "/solutions/tables",
  "/solutions/storages",
  "/solutions/soft-seating",
  "/solutions/education",
] as const;

export const ROBOTS_DISALLOW_PREFIXES = [
  "/api/",
  "/admin/",
  "/crm/",
  "/ops/",
  "/portal/",
  "/dashboard/",
  "/login/",
  "/access/",
  "/repo-store/",
  "/quote-cart/",
  "/tracking/",
  "/choose-product/",
  "/support-ivr/",
  "/planner/canvas/",
  "/planner/guest/",
] as const;
