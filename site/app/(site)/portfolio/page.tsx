import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import {
  EditorialCta,
  EditorialHero,
} from "@/components/site/EditorialRoute";
import { HomeMarketingLayout } from "@/components/home/layout";
import { PORTFOLIO_CLIENTS } from "@/lib/site-data/routeCopy";
import { PORTFOLIO_PAGE_METADATA } from "@/lib/site-data/routeMetadata";

export const metadata = PORTFOLIO_PAGE_METADATA;

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
    <div className="bg-[var(--surface-page)]">
      <EditorialHero lead="Spaces we’ve" accent="delivered." />

      <section className="py-12 md:py-18">
        <div className="home-shell-xl space-y-16 md:space-y-24">
          {portfolio.map((client, index) => (
            <article key={client.id}>
              <div className="mb-6 grid gap-4 md:grid-cols-[auto_1fr] md:items-end md:gap-10">
                <div>
                  <span className="text-[var(--color-bronze-500)]">0{index + 1}</span>
                  <h2 className="home-heading mt-3">{client.name}</h2>
                  <p className="mt-2 text-sm text-muted">{client.location}</p>
                </div>
                <p className="page-copy max-w-2xl text-body md:justify-self-end">{client.summary}</p>
              </div>

              <div className="grid h-[24rem] grid-cols-2 grid-rows-2 gap-3 md:h-[34rem] md:grid-cols-12">
                <div className="relative col-span-2 row-span-1 overflow-hidden md:col-span-7 md:row-span-2">
                  <Image
                    src={client.photos[0]}
                    alt={`${client.name} workplace project view 1`}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
                {client.photos.slice(1, 3).map((photo, photoIndex) => (
                  <div
                    key={photo}
                    className="relative overflow-hidden md:col-span-5"
                  >
                    <Image
                      src={photo}
                      alt={`${client.name} workplace project view ${photoIndex + 2}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <EditorialCta
        lead="Bring us your"
        accent="next space."
        href="/contact"
        label="Start a conversation"
      />
    </div>
    </HomeMarketingLayout>
  );
}
