import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/site-data/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("products");
  const title = `${t("headlineLead")} ${t("headlineAccent")}`;
  return buildPageMetadata(SITE_URL, {
    title,
    description: t("heroSubtitle"),
    path: "/products",
    image: "/images/catalog/oando-workstations--deskpro/image-1.jpg",
  });
}

export default async function ProductsPage() {
  const t = await getTranslations("products");
  const headlineLead = t("headlineLead");
  const headlineAccent = t("headlineAccent");
  const title = `${headlineLead} ${headlineAccent}`;
  const productsJsonLd = buildPageJsonLd(SITE_URL, {
    path: "/products",
    title,
    description: t("heroSubtitle"),
    pageType: "CollectionPage",
  });

  return (
    <HomeMarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(productsJsonLd) }}
      />

      <Hero
        variant="small"
        title={
          <>
            {headlineLead}{" "}
            <span className="text-accent-italic-on-dark">{headlineAccent}</span>
          </>
        }
        subtitle={t("heroSubtitle")}
        showButton={false}
        backgroundImage="/images/catalog/oando-workstations--deskpro/image-1.jpg"
      />

      <CategoryGrid />
      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
