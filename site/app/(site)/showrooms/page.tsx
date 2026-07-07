import { MapPin, Clock, Phone } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import {
  EditorialCta,
  EditorialHero,
} from "@/components/site/EditorialRoute";
import { HomeMarketingLayout } from "@/components/home/layout";
import { SHOWROOMS_HIGHLIGHTS } from "@/lib/site-data/routeCopy";
import { SHOWROOMS_PAGE_METADATA } from "@/lib/site-data/routeMetadata";

export const metadata = SHOWROOMS_PAGE_METADATA;

export default function ShowroomsPage() {
  return (
    <HomeMarketingLayout>
    <div className="bg-[var(--surface-page)]">
      <EditorialHero lead="See how work" accent="comes together." />

      <section>
        <div className="relative h-[26rem] md:h-[38rem]">
          <Image
            src="/images/hero/titan-patna-hq.webp"
            alt="One&Only workplace experience"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="home-shell-xl grid gap-12 lg:grid-cols-2 lg:gap-20">
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
                  detail: "Call to book a guided visit",
                },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex gap-5 border-b border-[var(--border-soft)] py-5">
                  <Icon aria-hidden="true" size={25} weight="light" className="text-[var(--color-bronze-500)]" />
                  <div>
                    <h3 className="font-medium text-strong">{title}</h3>
                    <p className="mt-1 text-sm text-muted">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="home-heading">Why visit</h2>
            <div className="mt-8 border-t border-[var(--border-soft)]">
              {SHOWROOMS_HIGHLIGHTS.map((item, index) => (
                <article key={item.title} className="border-b border-[var(--border-soft)] py-5">
                  <span className="text-[var(--color-bronze-500)]">0{index + 1}</span>
                  <h3 className="typ-h3 mt-3 text-strong">{item.title}</h3>
                  <p className="page-copy-sm mt-2 text-body">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EditorialCta
        lead="Plan your"
        accent="visit."
        href="/contact?intent=visit&source=showrooms"
        label="Book a visit"
      />
    </div>
    </HomeMarketingLayout>
  );
}
