import { MapPin, Clock, Phone } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { DEFAULT_HERO_FALLBACK } from "@/features/site/data/homepage";
import { SHOWROOMS_HIGHLIGHTS, SHOWROOMS_PAGE_COPY } from "@/features/site/data/routeCopy";
import { SHOWROOMS_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = SHOWROOMS_PAGE_METADATA;

export default function ShowroomsPage() {
  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={SHOWROOMS_PAGE_COPY.heroTitle}
        subtitle={SHOWROOMS_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage={DEFAULT_HERO_FALLBACK}
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="home-heading">Visit One&amp;Only</h2>
              <div className="mt-8 border-t border-[var(--border-soft)]">
                {[
                  {
                    icon: MapPin,
                    title: "401, Jagat Trade Centre",
                    detail: "Frazer Road, Patna, Bihar 800001",
                  },
                  {
                    icon: Clock,
                    title: "Monday – Saturday",
                    detail: "Contact the team before your visit",
                  },
                  {
                    icon: Phone,
                    title: "+91 90310 22875",
                    detail: "Support and showroom enquiries",
                  },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.title}
                      className="flex gap-4 border-b border-[var(--border-soft)] py-5"
                    >
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
                      <div>
                        <p className="typ-h3 text-strong">{row.title}</p>
                        <p className="page-copy-sm mt-1 text-body">{row.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/contact" className="btn-primary mt-8 inline-flex min-h-11 items-center">
                Plan a visit
              </Link>
            </div>

            <div>
              <p className="typ-label text-body mb-4">
                {SHOWROOMS_PAGE_COPY.highlightsKicker}
              </p>
              <h2 className="home-heading mb-8">Signature deliveries</h2>
              <div className="space-y-4">
                {SHOWROOMS_HIGHLIGHTS.map((item) => (
                  <article
                    key={item.title}
                    className="scheme-panel scheme-border rounded-2xl border p-6"
                  >
                    <h3 className="typ-h3 text-strong">{item.title}</h3>
                    <p className="page-copy-sm mt-3 text-body">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
