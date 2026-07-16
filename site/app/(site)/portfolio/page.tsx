import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import {
  EditorialCta,
  EditorialHero,
} from "@/components/site/EditorialRoute";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { PORTFOLIO_CLIENTS, PORTFOLIO_PAGE_COPY } from "@/features/site/data/routeCopy";
import { PORTFOLIO_PAGE_METADATA } from "@/features/site/data/routeMetadata";
import { buildPageJsonLd } from "@/features/site/data/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

export const metadata = PORTFOLIO_PAGE_METADATA;

const PORTFOLIO_JSON_LD = buildPageJsonLd(SITE_URL, {
  path: "/portfolio",
  title:
    "Office furniture portfolio | Patna, Ranchi, Bihar & Jharkhand projects | One&Only",
  description: PORTFOLIO_PAGE_COPY.heroSubtitle,
  pageType: "CollectionPage",
});

type ClientPortfolio = (typeof PORTFOLIO_CLIENTS)[number];
type ClientPortfolioWithPhotos = ClientPortfolio & { photos: string[] };

async function getClientPhotos(folder: string): Promise<string[]> {
  try {
    const folderPath = path.join(process.cwd(), "public", "images", "projects", folder);
    const names = await fs.readdir(folderPath);
    return names
      .filter((name) => /\.(webp|jpg|jpeg|png)$/i.test(name))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => encodeURI(`/images/projects/${folder}/${name}`));
  } catch {
    return [];
  }
}

async function buildPortfolioData(): Promise<ClientPortfolioWithPhotos[]> {
  const items = await Promise.all(
    PORTFOLIO_CLIENTS.map(async (client) => ({
      ...client,
      photos: await getClientPhotos(client.folder),
    })),
  );
  return items.filter((item) => item.photos.length >= 2);
}

export default async function PortfolioPage() {
  const portfolio = await buildPortfolioData();

  return (
    <HomeMarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeJsonForScript(PORTFOLIO_JSON_LD),
        }}
      />
      <EditorialHero lead="Spaces we’ve" accent="delivered." />
      <p className="sr-only">{PORTFOLIO_PAGE_COPY.heroSubtitle}</p>

      <HomeSection variant="white" spacing="md" className="border-t-0">
        <HomeSectionInner className="space-y-16 md:space-y-24">
          {portfolio.map((client, index) => (
            <article
              key={client.id}
              className="portfolio-case"
              aria-labelledby={`portfolio-client-${client.id}`}
            >
              <div className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end md:gap-10">
                <div className="min-w-0">
                  <span className="typ-label text-brand" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 id={`portfolio-client-${client.id}`} className="home-heading mt-3">
                    {client.name}
                  </h2>
                  <p className="typ-body-sm mt-2 text-muted">{client.location}</p>
                </div>
                <p className="page-copy max-w-2xl text-body md:justify-self-end">
                  {client.summary}
                </p>
              </div>

              {/*
                Mobile: tall primary + side-by-side secondary (no fixed height crush).
                md+: classic 7/5 mosaic. Media cells: isolation + single paint layer.
              */}
              <div className="portfolio-case__mosaic grid grid-cols-2 gap-3 md:h-[34rem] md:grid-cols-12 md:grid-rows-2">
                <div className="portfolio-case__media relative col-span-2 aspect-[16/10] min-h-[12.5rem] overflow-hidden rounded-2xl bg-[var(--surface-muted)] md:col-span-7 md:row-span-2 md:aspect-auto md:min-h-0 md:h-full">
                  <Image
                    src={client.photos[0]}
                    alt={`${client.name} workplace project view 1`}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="portfolio-case__img object-cover"
                    priority={index === 0}
                  />
                </div>
                {client.photos.slice(1, 3).map((photo, photoIndex) => (
                  <div
                    key={photo}
                    className="portfolio-case__media relative aspect-[4/3] min-h-[8.5rem] overflow-hidden rounded-2xl bg-[var(--surface-muted)] md:col-span-5 md:aspect-auto md:min-h-0 md:h-full"
                  >
                    <Image
                      src={photo}
                      alt={`${client.name} workplace project view ${photoIndex + 2}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 42vw"
                      className="portfolio-case__img object-cover"
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </HomeSectionInner>
      </HomeSection>

      <EditorialCta
        lead="Bring us your"
        accent="next space."
        href="/contact"
        label="Start a conversation"
      />
    </HomeMarketingLayout>
  );
}
