import Image from "next/image";
import Link from "next/link";

import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { RouteCtaBand } from "@/components/shared/RouteCtaBand";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { getProducts } from '@/lib/catalog/site/getProducts';
import { SOCIAL_PAGE_COPY, SOCIAL_PAGE_POSTS } from "@/features/site/data/routeCopy";
import { SOCIAL_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = SOCIAL_PAGE_METADATA;

export default async function SocialPage() {
  const products = await getProducts();

  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={SOCIAL_PAGE_COPY.heroTitle}
        subtitle={SOCIAL_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/projects/Titan/27-06-2025 Image 05_edited_edited.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <SectionIntro
              kicker={SOCIAL_PAGE_COPY.introKicker}
              title={SOCIAL_PAGE_COPY.introTitle}
              description={SOCIAL_PAGE_COPY.introDescription}
              maxWidthClassName="max-w-2xl"
            />

            <div className="scheme-panel scheme-border rounded-2xl border p-6 md:p-8">
              <p className="typ-label text-body mb-4">Social handle</p>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </span>
                <p className="typ-h3 text-strong">{SOCIAL_PAGE_COPY.handleLabel}</p>
              </div>
              <p className="page-copy-sm text-body mt-4">
                This route is a curated inspiration surface, not a live embedded social feed.
              </p>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <SectionIntro
            kicker={SOCIAL_PAGE_COPY.feedKicker}
            title={SOCIAL_PAGE_COPY.feedTitle}
            description={SOCIAL_PAGE_COPY.feedDescription}
            className="mb-8"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {SOCIAL_PAGE_POSTS.map((post) => {
              const product = products.find((item) => item.slug === post.productSlug);
              const href = product ? `/products/${product.category_id}/${product.slug}` : "/products";

              return (
                <article key={post.id} className="scheme-panel scheme-border overflow-hidden rounded-2xl border">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="typ-h3 text-strong">{post.title}</h3>
                    <p className="page-copy-sm text-body mt-3">{post.caption}</p>
                    <Link href={href} className="link-arrow mt-5">
                      View related route
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="white" spacing="sm">
        <HomeSectionInner>
          <RouteCtaBand
            title={SOCIAL_PAGE_COPY.ctaTitle}
            description={SOCIAL_PAGE_COPY.ctaDescription}
            actions={[
              { href: "/products", label: SOCIAL_PAGE_COPY.primaryCta, variant: "primary" },
              { href: "/downloads", label: SOCIAL_PAGE_COPY.secondaryCta },
            ]}
          />
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
