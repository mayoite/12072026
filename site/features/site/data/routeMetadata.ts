import type { Metadata } from "next";
import { SITE_BRAND } from "@/features/site/data/brand";
import {
  LEGAL_PAGE_COPY,
  PRODUCTS_PAGE_COPY,
  SOLUTIONS_PAGE_COPY,
  DOWNLOADS_PAGE_COPY,
  COMPARE_ROUTE_COPY,
  QUOTE_CART_ROUTE_COPY,
  SHOWROOMS_PAGE_COPY,
  PORTFOLIO_PAGE_COPY,
  GALLERY_PAGE_COPY,
  TRUSTED_BY_PAGE_COPY,
  SOCIAL_PAGE_COPY,
  NEWS_PAGE_COPY,
  TRACKING_PAGE_COPY,
  SUPPORT_IVR_PAGE_COPY,
  PLANNING_PAGE_COPY,
  SERVICE_PAGE_COPY,
  SUSTAINABILITY_PAGE_COPY,
  CAREER_PAGE_COPY,
  ABOUT_PAGE_COPY,
  CONTACT_PAGE_COPY,
} from "@/features/site/data/routeCopy";
import { buildPageMetadata } from "@/features/site/data/seo";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Centralized metadata registry for all static site routes.
 * Each entry yields unique title, description, canonical URL, OG tags,
 * Twitter cards, and i18n hreflang alternates via `buildPageMetadata`.
 *
 * Pages with dynamic params (products/[category], products/[category]/[product],
 * solutions/[category], planner features/[slug]) use `generateMetadata` and
 * are not listed here.
 */

export const ABOUT_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "About One&Only | Office furniture Patna, Ranchi, Bihar & Jharkhand — Steelcase, Featherlite, Humanscale",
  description: ABOUT_PAGE_COPY.heroSubtitle,
  path: "/about",
  keywords: [
    "office furniture Patna",
    "office furniture Ranchi",
    "office furniture Bihar",
    "office furniture Jharkhand",
    "office furniture dealer Patna",
    "office furniture dealer Ranchi",
    "Steelcase dealer Bihar",
    "Steelcase dealer Jharkhand",
    "Featherlite office furniture Patna",
    "Humanscale ergonomic seating Ranchi",
    "authorized office furniture dealer",
    "workspace planning partner East India",
    "about One&Only",
  ],
});

export const SOLUTIONS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: SOLUTIONS_PAGE_COPY.metadataTitle,
  description: SOLUTIONS_PAGE_COPY.metadataDescription,
  path: "/solutions",
  keywords: [
    "workspace planning approach",
    "office furniture delivery model",
    "project execution Bihar",
    "workspace fit-out India",
  ],
});

export const CONTACT_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "Contact office furniture sales | Patna, Ranchi, Bihar & Jharkhand | One&Only",
  description: CONTACT_PAGE_COPY.heroSubtitle,
  path: "/contact",
  image: "/images/hero/tvs-patna-enhanced.webp",
  keywords: [
    "contact office furniture Patna",
    "office furniture dealer Ranchi",
    "office furniture quote Bihar",
    "office furniture support Jharkhand",
    "Steelcase Featherlite Humanscale contact",
    "workspace planning enquiry Patna",
    "quote request office furniture",
    "sales contact One&Only",
  ],
});

export const SUSTAINABILITY_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "Sustainable office furniture | Long-life systems | One&Only Patna, Bihar & Jharkhand",
  description: SUSTAINABILITY_PAGE_COPY.heroSubtitle,
  path: "/sustainability",
  image: "/images/hero/dmrc-hero.webp",
  keywords: [
    "sustainable office furniture",
    "long-life workspace systems",
    "durable office furniture Patna",
    "eco-conscious furniture Bihar Jharkhand",
  ],
});

export const SERVICE_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${SERVICE_PAGE_COPY.heroTitle} | One&Only`,
  description: SERVICE_PAGE_COPY.heroSubtitle,
  path: "/service",
  /** Same family hero as planning / privacy / downloads for visual parity. */
  image: "/images/hero/dmrc-hero.webp",
  keywords: [
    "office furniture service support",
    "after-sales support furniture",
    "warranty support Bihar",
    "installation support office furniture",
  ],
});

export const PLANNING_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${PLANNING_PAGE_COPY.heroTitle} | One&Only`,
  description: PLANNING_PAGE_COPY.heroSubtitle,
  path: "/planning",
  keywords: [
    "workspace planning service",
    "office layout planning Patna",
    "space planning Bihar",
    "furniture layout design India",
  ],
});

export const DOWNLOADS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${DOWNLOADS_PAGE_COPY.metadataTitle} | One&Only`,
  description: DOWNLOADS_PAGE_COPY.metadataDescription,
  path: "/downloads",
  keywords: [
    "product catalogs office furniture",
    "technical sheets furniture",
    "planning references workspace",
    "resource desk One&Only",
  ],
});

export const PRIVACY_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "Privacy Policy | Enquiry data & cookies | One&Only Patna, Ranchi",
  description:
    "How One&Only handles enquiry data, attribution cookies, and communication records for office furniture planning and support across Patna, Ranchi, Bihar and Jharkhand.",
  path: "/privacy",
  image: "/images/hero/dmrc-hero.webp",
  keywords: [
    "One&Only privacy policy",
    "office furniture privacy Patna",
    "enquiry data cookies India",
    "privacy policy Bihar Jharkhand",
  ],
});

export const TERMS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "Terms & Conditions | Office furniture sales & support | One&Only Patna",
  description:
    "Website, quotation, delivery, warranty, and support terms for One&Only office furniture across Patna, Ranchi, Bihar and Jharkhand. Includes company identity formerly listed under imprint.",
  path: "/terms",
  alternates: false,
  image: "/images/hero/dmrc-hero.webp",
});

export const REFUND_POLICY_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${LEGAL_PAGE_COPY.refund.metadataTitle} | One&Only`,
  description: LEGAL_PAGE_COPY.refund.metadataDescription,
  path: "/refund-and-return-policy",
  alternates: false,
});

/** @deprecated Imprint route redirects to /terms — keep export only if tests reference name. */
export const IMPRINT_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${LEGAL_PAGE_COPY.terms.title} | One&Only`,
  description: LEGAL_PAGE_COPY.terms.heroSubtitle,
  path: "/terms",
  alternates: false,
  indexable: false,
});

export const COMPARE_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "Compare office furniture | Patna, Ranchi, Bihar & Jharkhand | One&Only",
  description: COMPARE_ROUTE_COPY.description,
  path: "/compare",
  keywords: [
    "compare office furniture",
    "compare office furniture Patna",
    "compare office furniture Ranchi",
    "office furniture comparison Bihar",
    "office furniture comparison Jharkhand",
    "compare workstations chairs storage",
    "Steelcase Featherlite Humanscale compare",
    "furniture shortlist India",
  ],
});

export const QUOTE_CART_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${QUOTE_CART_ROUTE_COPY.title} | One&Only`,
  description: QUOTE_CART_ROUTE_COPY.description,
  path: "/quote-cart",
  alternates: false,
  indexable: false,
});

export const SHOWROOMS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${SHOWROOMS_PAGE_COPY.heroTitle} | One&Only Patna`,
  description: SHOWROOMS_PAGE_COPY.heroSubtitle,
  path: "/showrooms",
  image: "/images/hero/dmrc-hero.webp",
  keywords: [
    "office furniture showroom Patna",
    "furniture display Bihar",
    "workspace showroom India",
    "One&Only showroom",
  ],
});

export const PROJECTS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "Office furniture projects | Patna, Ranchi, Bihar & Jharkhand | One&Only",
  description:
    "Client roster and delivery proof across government, finance, energy, manufacturing, and institutional sectors in Patna, Ranchi, Bihar and Jharkhand.",
  path: "/projects",
  image: "/images/hero/dmrc-hero.webp",
  keywords: [
    "office furniture projects India",
    "office furniture projects Patna",
    "office furniture projects Ranchi",
    "client roster workspace furniture Bihar",
    "government furniture projects Jharkhand",
    "enterprise furniture delivery India",
  ],
});

export const PORTFOLIO_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "Office furniture portfolio | Patna, Ranchi, Bihar & Jharkhand projects | One&Only",
  description: PORTFOLIO_PAGE_COPY.heroSubtitle,
  path: "/portfolio",
  keywords: [
    "office furniture portfolio Patna",
    "office furniture projects Bihar",
    "office furniture installation Jharkhand",
    "workspace delivery photos Ranchi",
    "enterprise office furniture projects India",
    "DMRC Titan TVS office furniture",
  ],
});

/** @deprecated Route redirects to /portfolio — noindex shell only. */
export const GALLERY_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${GALLERY_PAGE_COPY.heroTitle} | One&Only`,
  description: GALLERY_PAGE_COPY.heroSubtitle,
  path: "/gallery",
  alternates: false,
  indexable: false,
  keywords: [
    "project gallery office furniture",
    "workspace installation photos",
    "office furniture images India",
    "delivery gallery Bihar",
  ],
});

export const TRUSTED_BY_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${TRUSTED_BY_PAGE_COPY.heroTitle} | One&Only`,
  description: TRUSTED_BY_PAGE_COPY.heroSubtitle,
  path: "/trusted-by",
  image: "/images/hero/dmrc-hero.webp",
  keywords: [
    "trusted office furniture clients",
    "enterprise furniture clients India",
    "government furniture supplier",
    "corporate furniture partner",
  ],
});

/** @deprecated Route redirects to /portfolio — noindex shell only. */
export const SOCIAL_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${SOCIAL_PAGE_COPY.heroTitle} | One&Only`,
  description: SOCIAL_PAGE_COPY.heroSubtitle,
  path: "/social",
  alternates: false,
  indexable: false,
  keywords: [
    "office furniture social",
    "workspace inspiration",
    "furniture ideas India",
    "One&Only social highlights",
  ],
});

/** @deprecated Route redirects to /about — noindex shell only. */
export const NEWS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${NEWS_PAGE_COPY.heroTitle} | One&Only`,
  description: NEWS_PAGE_COPY.heroSubtitle,
  path: "/news",
  alternates: false,
  indexable: false,
  keywords: [
    "office furniture news India",
    "workspace updates",
    "furniture industry news Bihar",
    "One&Only updates",
  ],
});

export const TRACKING_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${TRACKING_PAGE_COPY.heroTitle} | One&Only`,
  description: TRACKING_PAGE_COPY.heroSubtitle,
  path: "/tracking",
  alternates: false,
  indexable: false,
});

export const SUPPORT_IVR_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${SUPPORT_IVR_PAGE_COPY.heroTitle} | One&Only`,
  description: SUPPORT_IVR_PAGE_COPY.heroSubtitle,
  path: "/support-ivr",
  alternates: false,
  indexable: false,
});

export const ACCESS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: "Sign in | One&Only office furniture planner",
  description:
    "Sign in or continue as a guest to plan office furniture layouts and product selections. Not indexed — account entry only.",
  path: "/access",
  alternates: false,
  indexable: false,
});

export const CHOOSE_PRODUCT_PAGE_METADATA: Metadata = buildPageMetadata(
  SITE_URL,
  {
    title: "Choose planner entry | Office furniture workspace | One&Only",
    description:
      "Start the office furniture planner as guest or signed-in member. Layout, catalog placement, and BOQ export for Patna, Ranchi, Bihar and Jharkhand. Workspace entry — not indexed.",
    path: "/choose-product",
    alternates: false,
    indexable: false,
  },
);

export const CAREER_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title:
    "Careers | Office furniture jobs Patna, Ranchi, Bihar & Jharkhand | One&Only",
  description: CAREER_PAGE_COPY.heroSubtitle,
  path: "/career",
  keywords: [
    "office furniture jobs Patna",
    "office furniture jobs Ranchi",
    "office furniture careers Bihar",
    "office furniture careers Jharkhand",
    "Steelcase Featherlite Humanscale careers",
    "workspace planning jobs Patna",
    "furniture sales jobs Bihar",
    "furniture operations jobs Ranchi",
    "One&Only careers",
  ],
});

export const TEMPLATES_PAGE_FALLBACK_TITLE = "Workspace Templates | One&Only";

export const PRODUCTS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${PRODUCTS_PAGE_COPY.headlineLead} ${PRODUCTS_PAGE_COPY.headlineAccent}`,
  description: PRODUCTS_PAGE_COPY.heroSubtitle,
  path: "/products",
  image: "/images/catalog/oando-workstations--deskpro/image-1.jpg",
  keywords: [
    "office furniture products India",
    "workstations chairs tables storage",
    "office furniture catalog Bihar",
    "ergonomic furniture products",
  ],
});

/**
 * Registry copy for planner marketing routes.
 * Live pages under `app/planner/(marketing)/` currently build metadata inline —
 * keep these strings identical so ownership and SEO stay single-sourced when wired.
 */
export const PLANNER_LANDING_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: "Workspace Planner — Design Your Office Layout",
  description:
    "Plan desks, zones, and equipment on mm-accurate floor plans. 2D and 3D views, AI layout assist, and branded PDF export for client-ready proposals.",
  path: "/planner",
  image: "/planner-og.webp",
  keywords: [
    "workspace planner",
    "office layout tool",
    "floor plan furniture",
    "office space planning",
    "2D floor plan",
    "3D office planner",
    "One&Only planner",
  ],
});

export const PLANNER_HELP_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: "Planner Help — Workspace Layout Guide",
  description:
    "Learn how to draw walls, place furniture, measure areas, use AI assist, and export branded PDF floor plans.",
  path: "/planner/help",
  keywords: ["planner help", "floor plan guide", "workspace layout tutorial"],
});

export const PLANNER_FEATURES_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: "Planner Features — Measure, Catalog, 3D & Export",
  description:
    "Explore workspace planner capabilities: measurements, catalog furniture, 3D view, AI assist, and branded PDF export.",
  path: "/planner/features",
  keywords: [
    "planner features",
    "floor plan measurement",
    "office layout 3d",
    "furniture catalog planner",
  ],
});

export { SITE_BRAND };
