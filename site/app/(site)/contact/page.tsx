import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { buildPageMetadata } from "@/lib/site-data/seo";
import { SITE_URL } from "@/lib/siteUrl";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return buildPageMetadata(SITE_URL, {
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    path: "/contact",
    image: "/images/hero/tvs-patna-enhanced.webp",
  });
}

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const intent = firstValue(resolvedSearchParams.intent);
  const source = firstValue(resolvedSearchParams.source);

  return <ContactPageView intent={intent} source={source} />;
}
