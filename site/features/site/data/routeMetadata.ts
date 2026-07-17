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

export const GALLERY_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${GALLERY_PAGE_COPY.heroTitle} | One&Only`,
  description: GALLERY_PAGE_COPY.heroSubtitle,
  path: "/gallery",
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

export const SOCIAL_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${SOCIAL_PAGE_COPY.heroTitle} | One&Only`,
  description: SOCIAL_PAGE_COPY.heroSubtitle,
  path: "/social",
  keywords: [
    "office furniture social",
    "workspace inspiration",
    "furniture ideas India",
    "One&Only social highlights",
  ],
});

export const NEWS_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: `${NEWS_PAGE_COPY.heroTitle} | One&Only`,
  description: NEWS_PAGE_COPY.heroSubtitle,
  path: "/news",
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

export const PLANNER_LANDING_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: "Workspace Planner | Plan Your Office in 2D & 3D | One&Only",
  description:
    "Free online workspace planner. Design office layouts in 2D, preview in 3D, and export BOQ-ready plans. No signup required to try.",
  path: "/planner",
  keywords: [
    "office space planner",
    "2D 3D workspace planner",
    "free office layout tool",
    "floor plan planner India",
    "workspace design tool",
  ],
});

export const PLANNER_HELP_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: "Planner Help & Guide | One&Only Workspace Planner",
  description:
    "Learn how to use the One&Only workspace planner: draw rooms, place furniture, switch to 3D, and export plans.",
  path: "/planner/help",
});

export const PLANNER_FEATURES_PAGE_METADATA: Metadata = buildPageMetadata(SITE_URL, {
  title: "Planner Features | Measure, Catalog, 3D & Export | One&Only",
  description:
    "Explore workspace planner features: measurement tools, product catalog, 3D view, AI assist, and BOQ export.",
  path: "/planner/features",
});

export { SITE_BRAND };
