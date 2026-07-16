import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { RouteCtaBand } from "@/components/shared/RouteCtaBand";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { SITE_CONTACT } from "@/features/site/data/contact";
import { DEFAULT_HERO_FALLBACK } from "@/features/site/data/homepage";
import {
  SERVICE_PAGE_CHANNELS,
  SERVICE_PAGE_COPY,
  SERVICE_PAGE_PILLARS,
} from "@/features/site/data/routeCopy";
import { SERVICE_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = SERVICE_PAGE_METADATA;

export default function ServicePage() {
  return (
    <HomeMarketingLayout>
      {/* Match planning/privacy/downloads: same small Hero + shared dmrc family photo */}
      <Hero
        variant="small"
        title={SERVICE_PAGE_COPY.heroTitle}
        subtitle={SERVICE_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage={DEFAULT_HERO_FALLBACK}
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <SectionIntro
            kicker={SERVICE_PAGE_COPY.frameworkKicker}
            title={SERVICE_PAGE_COPY.frameworkTitle}
            className="mb-12"
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {SERVICE_PAGE_PILLARS.map((item) => (
              <article key={item.title} className="scheme-panel scheme-border rounded-2xl border p-6">
                <h3 className="typ-h3 text-strong">{item.title}</h3>
                <p className="page-copy text-body mt-3">{item.detail}</p>
              </article>
            ))}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="soft" spacing="md" borderY>
        <HomeSectionInner>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <SectionIntro
                kicker={SERVICE_PAGE_COPY.channelsKicker}
                title={SERVICE_PAGE_COPY.channelsTitle}
              />
              <div className="mt-6 space-y-4">
                {SERVICE_PAGE_CHANNELS.map((channel) => {
                  if (channel.kind === "supportPhone") {
                    const phone = SITE_CONTACT.supportPhone;
                    return (
                      <a
                        key={channel.label}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="scheme-panel scheme-border block rounded-2xl border px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-theme-lift"
                      >
                        <p className="typ-label text-body">{channel.label}</p>
                        <p className="typ-h3 text-strong mt-1">{phone}</p>
                      </a>
                    );
                  }

                  if (channel.kind === "salesEmail") {
                    const email = SITE_CONTACT.salesEmail;
                    return (
                      <a
                        key={channel.label}
                        href={`mailto:${email}`}
                        className="scheme-panel scheme-border block rounded-2xl border px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-theme-lift"
                      >
                        <p className="typ-label text-body">{channel.label}</p>
                        <p className="typ-h3 text-strong mt-1">{email}</p>
                      </a>
                    );
                  }

                  return (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="scheme-panel scheme-border block rounded-2xl border px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-theme-lift"
                    >
                      <p className="typ-label text-body">{channel.label}</p>
                      <p className="typ-h3 text-strong mt-1">{channel.value}</p>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="scheme-panel scheme-border rounded-2xl border p-6">
              <p className="typ-label text-body mb-3">{SERVICE_PAGE_COPY.supportKicker}</p>
              <p className="page-copy text-body">
                {SERVICE_PAGE_COPY.supportDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <TrackedLink href="/contact" label={SERVICE_PAGE_COPY.primaryCta} surface="service-support-card" className="btn-primary">
                  {SERVICE_PAGE_COPY.primaryCta}
                </TrackedLink>
                <TrackedLink href="/contact" label={SERVICE_PAGE_COPY.secondaryCta} surface="service-support-card" className="btn-outline">
                  {SERVICE_PAGE_COPY.secondaryCta}
                </TrackedLink>
                <TrackedLink href="/downloads" label={SERVICE_PAGE_COPY.tertiaryCta} surface="service-support-card" className="btn-outline">
                  {SERVICE_PAGE_COPY.tertiaryCta}
                </TrackedLink>
              </div>
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeSection variant="white" spacing="sm">
        <HomeSectionInner>
          <RouteCtaBand
            kicker={SERVICE_PAGE_COPY.supportDeskKicker}
            title={SERVICE_PAGE_COPY.supportDeskTitle}
            description={SERVICE_PAGE_COPY.supportDeskDescription}
            actions={[
              { href: "/downloads", label: SERVICE_PAGE_COPY.tertiaryCta },
              { href: "/contact", label: SERVICE_PAGE_COPY.primaryCta, variant: "primary" },
            ]}
          />
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
