import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { GALLERY_PAGE_COPY, GALLERY_PROJECTS } from "@/lib/site-data/routeCopy";
import { Masonry, MasonryItem } from "@/components/ui/Masonry";
import { GALLERY_PAGE_METADATA } from "@/lib/site-data/routeMetadata";

export const metadata = GALLERY_PAGE_METADATA;

export default function GalleryPage() {
  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={GALLERY_PAGE_COPY.heroTitle}
        subtitle={GALLERY_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/titan-patna-hq.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="scheme-panel scheme-border mb-12 max-w-4xl rounded-2xl border p-8 md:p-10">
            <p className="typ-label mb-4 text-body">{GALLERY_PAGE_COPY.kicker}</p>
            <h2 className="home-heading">{GALLERY_PAGE_COPY.title}</h2>
            <p className="page-copy mt-4 max-w-3xl text-body">
              {GALLERY_PAGE_COPY.description}
            </p>
          </div>

          <Masonry columns={2} gap="2rem">
            {GALLERY_PROJECTS.map((project) => (
              <MasonryItem key={`${project.title}-${project.location}`}>
                <article className="shell-media-frame group relative mb-8">
                  <Image
                    src={project.image}
                    alt={`${project.title} project`}
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="typ-label text-inverse-muted">
                      {project.category}
                    </p>
                    <h3 className="typ-h3 mt-2 text-inverse">{project.title}</h3>
                    <p className="text-inverse-body mt-1 text-sm">{project.location}</p>
                  </div>
                </article>
              </MasonryItem>
            ))}
          </Masonry>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
