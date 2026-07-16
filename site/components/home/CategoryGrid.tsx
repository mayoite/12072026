import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle as CheckCircle2, Clock as Clock3, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";
import { getCatalog } from "@/lib/catalog/site/getProducts";
import {
  buildRequestedCategoryCatalog,
  getCatalogCategoryHref,
  getCatalogCategoryLabel,
} from "@/lib/catalog/site/categories";
import { CollectionsSectionHeading } from "@/components/home/CollectionsSectionHeading";
import { HomeSection, HomeSectionInner } from "@/components/home/layout";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { DEFAULT_HERO_FALLBACK } from "@/features/site/data/homepage";

const PILLAR_ICONS = {
  "check-circle": CheckCircle2,
  clock: Clock3,
  shield: ShieldCheck,
} as const;

type ProductPillar = { title: string; detail: string; icon: keyof typeof PILLAR_ICONS };

const getCachedCatalog = unstable_cache(async () => getCatalog(), ["home-category-grid-v2"], {
  revalidate: 3600,
  tags: ["catalog"],
});

export async function CategoryGrid() {
  const t = await getTranslations("products");
  const pillars = t.raw("pillars") as ProductPillar[];
  const requestedCatalog = buildRequestedCategoryCatalog(await getCachedCatalog());

  return (
    <>
      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <SectionIntro
            kicker={t("pillarsKicker")}
            title={t("pillarsTitleLead")}
            titleAccent={t("pillarsTitleAccent")}
            description={t("pillarsIntro")}
            className="mb-8 md:mb-12"
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {pillars.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.icon];
              return (
                <article
                  key={pillar.title}
                  className="scheme-panel scheme-border rounded-2xl border p-6"
                >
                  <div className="scheme-accent-wash mb-4 flex h-10 w-10 items-center justify-center rounded-full">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <h2 className="typ-h3 text-strong">{pillar.title}</h2>
                  <p className="page-copy text-body mt-3">{pillar.detail}</p>
                </article>
              );
            })}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <CollectionsSectionHeading as="h2" className="home-heading mb-6 max-w-3xl md:mb-8" />

          <div className="grid grid-cols-1 gap-4 min-[32.5rem]:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
            {requestedCatalog.map((category) => {
                const allProducts = category.series.flatMap((series) => series.products);
                const categoryName = getCatalogCategoryLabel(category.id, category.name);
                const categoryHref = getCatalogCategoryHref(category.id);
                const firstProductWithImage = allProducts.find(
                  (product) => (product.images && product.images.length > 0) || product.flagshipImage,
                );
                const flagshipImage =
                  firstProductWithImage?.images?.[0] ||
                  firstProductWithImage?.flagshipImage ||
                  DEFAULT_HERO_FALLBACK;

                return (
                  <Link
                    key={category.id}
                    href={categoryHref}
                    className="group home-collection-card home-collection-card--compact block"
                  >
                    <Image
                      src={flagshipImage}
                      alt={categoryName}
                      aria-hidden="true"
                      fill
                      sizes="(max-width: 519px) 100vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    <div className="home-collection-card__overlay" />
                    <div className="home-collection-card__footer absolute inset-x-0 bottom-0 flex items-center justify-between gap-4">
                      <h3 className="typ-overlay-title text-inverse">{categoryName}</h3>
                      <span className="home-collection-card__arrow shrink-0" aria-hidden="true">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </HomeSectionInner>
      </HomeSection>
    </>
  );
}
