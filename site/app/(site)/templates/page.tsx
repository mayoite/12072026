import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { buildPageMetadata, buildPageJsonLd } from "@/lib/site-data/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: "Workspace Templates",
  description:
    "Browse pre-made workspace layouts and open them directly in the planner. Start designing faster with professionally curated office templates.",
  path: "/templates",
});

export default function TemplatesPage() {
  const jsonLd = buildPageJsonLd(SITE_URL, {
    path: "/templates",
    title: "Workspace Templates",
    description:
      "Browse pre-made workspace layouts and open them directly in the planner.",
    pageType: "CollectionPage",
  });

  return (
    <HomeMarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(jsonLd) }}
      />
      <Hero
        variant="small"
        title="Workspace templates"
        subtitle="Pre-made layouts designed by our team — pick a starting point and customize in the planning desk."
        showButton={false}
        backgroundImage="/images/hero/hero-2.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="scheme-panel scheme-border mx-auto max-w-2xl rounded-2xl border p-8 text-center md:p-10">
            <p className="typ-label text-body mb-4">Coming soon</p>
            <h2 className="home-heading text-strong">Template library in progress</h2>
            <p className="page-copy text-body mt-4">
              Curated office layouts will appear here with one-click open in the planning desk.
              Until then, start from a blank canvas or contact us for a guided layout.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/planning" className="btn-primary">
                Open planning desk
              </Link>
              <Link href="/contact" className="btn-outline">
                Request a layout
              </Link>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
