import Link from "next/link";
import { MapPin, Phone, Envelope as Mail } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HomeMarketingLayout, HomeSection, HomeSectionInner } from "@/components/home/layout";
import { CustomerQueryForm } from "@/components/contact/CustomerQueryForm";
import { RouteCtaBand } from "@/components/shared/RouteCtaBand";
import { SITE_CONTACT } from "@/features/site/data/contact";
import { buildPageJsonLd } from "@/features/site/data/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

export interface ContactPageViewProps {
  intent: string | null;
  source: string | null;
}

type ContactOffice = { title: string; lines: string[] };

export async function ContactPageView({ intent, source }: ContactPageViewProps) {
  const t = await getTranslations("contact");
  const offices = t.raw("offices") as ContactOffice[];
  const contactJsonLd = buildPageJsonLd(SITE_URL, {
    path: "/contact",
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    pageType: "ContactPage",
  });

  return (
    <HomeMarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(contactJsonLd) }}
      />
      <Hero
        variant="small"
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        showButton={false}
        backgroundImage="/images/hero/tvs-patna-enhanced.webp"
      />
      <HomeSection variant="white" spacing="md">
        <HomeSectionInner>
          <div className="contact-shell">
            <div className="contact-summary">
              <div className="contact-summary__intro section-divider">
                <p className="typ-label text-body">{t("sectionTitle")}</p>
                <h2 className="home-heading mt-3">{t("introTitle")}</h2>
                <p className="page-copy text-body mt-3">{t("introDescription")}</p>
                <p className="page-copy-sm text-body mt-4">
                  {t("resourceDeskLead")}{" "}
                  <Link href="/downloads" className="font-semibold text-primary transition-colors hover:text-primary-hover">
                    {t("resourceDeskCta")}
                  </Link>{" "}
                  {t("resourceDeskTail")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {offices.map((office) => (
                  <div key={office.title} className="scheme-panel scheme-border flex flex-col gap-4 rounded-2xl border p-6">
                    <p className="typ-label text-body">{office.title}</p>
                    <div className="page-copy text-body">
                      {office.lines.map((line) => (
                        <p key={`${office.title}-${line}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="scheme-panel scheme-border flex flex-col gap-4 rounded-2xl border p-6">
                <div className="contact-channel">
                  <MapPin className="contact-channel__icon" />
                  <div>
                    <p className="typ-label text-body">Service region</p>
                    <p className="page-copy text-body">{SITE_CONTACT.regionLine}</p>
                  </div>
                </div>
                <div className="contact-channel">
                  <Phone className="contact-channel__icon" />
                  <div>
                    <p className="contact-channel__label">Quotes and planning</p>
                    <a
                      href={`tel:${SITE_CONTACT.salesPhone.replace(/\s+/g, "")}`}
                      className="contact-channel__link"
                    >
                      {SITE_CONTACT.salesPhone}
                    </a>
                  </div>
                </div>
                <div className="contact-channel">
                  <Phone className="contact-channel__icon" />
                  <div>
                    <p className="contact-channel__label">Support and enquiries</p>
                    <a
                      href={`tel:${SITE_CONTACT.supportPhone.replace(/\s+/g, "")}`}
                      className="contact-channel__link"
                    >
                      {SITE_CONTACT.supportPhone}
                    </a>
                  </div>
                </div>
                <div className="contact-channel">
                  <Mail className="contact-channel__icon" />
                  <div>
                    <p className="contact-channel__label">Email</p>
                    <a href={`mailto:${SITE_CONTACT.salesEmail}`} className="contact-channel__link">
                      {SITE_CONTACT.salesEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-panel">
              <RouteCtaBand
                className="p-6"
                kicker={t("quickDeskKicker")}
                title={t("quickDeskTitle")}
                description={t("quickDeskDescription")}
                actions={[
                  { href: "/downloads", label: t("quickDeskPrimaryCta") },
                  { href: "/planning", label: t("quickDeskSecondaryCta"), variant: "primary" },
                ]}
              />
              <CustomerQueryForm intent={intent} source={source} />
            </div>
          </div>
        </HomeSectionInner>
      </HomeSection>
    </HomeMarketingLayout>
  );
}
