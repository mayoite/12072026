import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { REFUND_POLICY_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = REFUND_POLICY_PAGE_METADATA;

type RefundSection = {
  title: string;
  tone: string;
  items: string[];
  contactLines?: string[];
};

export default async function RefundAndReturnPolicyPage() {
  const t = await getTranslations("legal");
  const sections = t.raw("refund.sections") as RefundSection[];

  return (
    <HomeMarketingLayout>
      <Hero
        variant="small"
        title={t("refund.heroTitle")}
        subtitle={t("refund.heroSubtitle")}
        showButton={false}
        backgroundImage="/images/hero/dmrc-hero.webp"
      />

      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <aside className="scheme-panel-soft scheme-border rounded-2xl border p-7 md:p-9">
              <p className="typ-label text-brand">{t("refund.overviewKicker")}</p>
              <h2 className="home-heading mt-3">{t("refund.overviewTitle")}</h2>
              <p className="page-copy text-body mt-4">{t("refund.overviewDescription")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Contact sales desk
                </Link>
                <Link href="/service" className="btn-outline">
                  Service and support
                </Link>
              </div>
            </aside>

            <div className="space-y-4">
              {sections.map((section) => (
                <article
                  key={section.title}
                  className={`${
                    section.tone === "soft"
                      ? "scheme-panel-soft scheme-border rounded-2xl border"
                      : "scheme-panel scheme-border rounded-2xl border"
                  } p-7 md:p-8`}
                >
                  <h2 className="typ-card text-strong">{section.title}</h2>
                  {section.items.length > 0 ? (
                    <ul className="page-copy-sm text-body mt-4 list-disc space-y-3 pl-5">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.contactLines ? (
                    <div className="page-copy-sm text-body mt-4 space-y-2">
                      {section.contactLines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>

      <ContactTeaser />
    </HomeMarketingLayout>
  );
}
