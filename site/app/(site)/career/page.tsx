import { CareerPageView } from "@/components/career/CareerPageView";
import { CAREER_PAGE_JOBS, CAREER_PAGE_COPY } from "@/features/site/data/routeCopy";
import { CAREER_PAGE_METADATA } from "@/features/site/data/routeMetadata";
import {
  buildCareerJobsJsonLd,
  buildPageJsonLd,
} from "@/features/site/data/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { sanitizeJsonForScript } from "@/lib/security/sanitize";

export const metadata = CAREER_PAGE_METADATA;

const CAREER_PAGE_JSON_LD = buildPageJsonLd(SITE_URL, {
  path: "/career",
  title: "Careers | Office furniture jobs Patna, Ranchi, Bihar & Jharkhand | One&Only",
  description: CAREER_PAGE_COPY.heroSubtitle,
  pageType: "WebPage",
});

const CAREER_JOBS_JSON_LD = buildCareerJobsJsonLd(SITE_URL, CAREER_PAGE_JOBS);

export default function CareerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeJsonForScript(CAREER_PAGE_JSON_LD),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeJsonForScript(CAREER_JOBS_JSON_LD),
        }}
      />
      <CareerPageView />
    </>
  );
}
