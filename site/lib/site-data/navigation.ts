import { SITE_CONTACT } from "@/lib/site-data/contact";
import { PRODUCT_SUITE } from "@/lib/site-data/productSuite";

/**
 * Marketing header + mobile drawer destinations.
 * `headerSlot: "more"` keeps the link in the mobile drawer and footer paths,
 * but collapses it under desktop header "More" so the bar does not clip CTAs.
 */
export const SITE_NAV_LINKS = [
  { label: "Products", href: "/products", hasMega: true },
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
  { label: "Planner", href: "/planner" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Trusted", href: "/trusted-by", headerSlot: "more" as const },
  { label: "About", href: "/about" },
  { label: "Sustainability", href: "/sustainability", headerSlot: "more" as const },
  { label: "Contact", href: "/contact" },
  { label: "Portal", href: "/portal", headerSlot: "more" as const },
  { label: "Login", href: "/login", headerSlot: "more" as const },
] as const;

export type SiteNavLink = (typeof SITE_NAV_LINKS)[number];

/** Center desktop nav — primary buyer destinations only. */
export const SITE_HEADER_PRIMARY_LINKS = SITE_NAV_LINKS.filter(
  (link) => !("headerSlot" in link && link.headerSlot === "more"),
);

/** Desktop "More" flyout — secondary destinations still reachable without crowding. */
export const SITE_HEADER_MORE_LINKS = SITE_NAV_LINKS.filter(
  (link) => "headerSlot" in link && link.headerSlot === "more",
);

export const SITE_CTA_LINKS = [
  { label: "Get Quote", href: "/contact", variant: "primary" as const },
  { label: "View Products", href: "/products", variant: "outline" as const },
] as const;

export const SITE_NAV_FEATURED_CARDS = [
  {
    title: "Ergonomic Seating",
    description: "Mesh chairs and premium seating for long working hours.",
    href: "/products/seating",
    image: "/images/products/imported/fluid/image-1.webp",
  },
  {
    title: "Modular Workstations",
    description: "Scalable desking systems for growing teams.",
    href: "/products/workstations",
    image: "/images/products/imported/cabin/image-1.webp",
  },
  {
    title: "Need Help Choosing?",
    description: "Use AI-assisted search to find the right furniture faster.",
    href: "/products",
    image: "/images/products/imported/cocoon/image-1.webp",
  },
] as const;

export const SITE_NAV_SEARCH_FALLBACK_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/solutions", label: "Solutions" },
  { href: "/projects", label: "Projects" },
  { href: PRODUCT_SUITE.planner.routes.landing, label: "Planner" },
  { href: PRODUCT_SUITE.shared.routes.access, label: "Workspace access" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
] as const;

type FooterLink = { href: string; label: string };

export function normalizeFooterHref(href: string): string {
  if (href.length > 1 && href.endsWith("/")) return href.slice(0, -1);
  return href;
}

/** Drop duplicate destinations across footer columns (first label wins). */
export function buildFooterNav(
  sections: { heading: string; links: readonly FooterLink[] }[],
): { heading: string; links: FooterLink[] }[] {
  const globalSeen = new Set<string>();

  return sections
    .map((section) => ({
      heading: section.heading,
      links: section.links.filter((link) => {
        const key = normalizeFooterHref(link.href);
        if (globalSeen.has(key)) return false;
        globalSeen.add(key);
        return true;
      }),
    }))
    .filter((section) => section.links.length > 0);
}

export const SITE_FOOTER_NAV = buildFooterNav([
  {
    heading: "Products",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/solutions", label: "Solutions" },
      { href: PRODUCT_SUITE.planner.routes.landing, label: "Planner" },
      { href: PRODUCT_SUITE.shared.routes.dashboard, label: "Member dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/trusted-by", label: "Trusted By" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/sustainability", label: "Sustainability" },
    ],
  },
  {
    heading: "Services",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/service", label: "After Sales" },
      { href: "/showrooms", label: "Showrooms" },
    ],
  },
]);

export const SITE_SOCIAL_LINKS = SITE_CONTACT.socialLinks;
