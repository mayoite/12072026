import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { SectionIntro } from "@/components/shared/SectionIntro";
import { VisualIVR } from "@/components/support/VisualIVR";
import { SUPPORT_IVR_PAGE_COPY } from "@/lib/site-data/routeCopy";

export function SupportIvrPageView() {
  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={SUPPORT_IVR_PAGE_COPY.heroTitle}
        subtitle={SUPPORT_IVR_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/dmrc-hero.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <SectionIntro
            kicker={SUPPORT_IVR_PAGE_COPY.introKicker}
            title={SUPPORT_IVR_PAGE_COPY.introTitle}
            description={SUPPORT_IVR_PAGE_COPY.introDescription}
            className="mb-10"
            maxWidthClassName="max-w-4xl"
          />

          <div className="scheme-panel scheme-border rounded-2xl border p-6 md:p-8">
            <VisualIVR />
          </div>

          <div className="scheme-panel-soft scheme-border mt-8 rounded-2xl border p-6 md:p-8">
            <h3 className="typ-h3 text-strong">{SUPPORT_IVR_PAGE_COPY.noteTitle}</h3>
            <p className="page-copy-sm text-body mt-3">{SUPPORT_IVR_PAGE_COPY.noteDescription}</p>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
