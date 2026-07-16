import type { Metadata } from "next";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { CONTACT_PAGE_METADATA } from "@/features/site/data/routeMetadata";

/** Canonical SEO for /contact (title length, locales, brands, OG). */
export const metadata: Metadata = CONTACT_PAGE_METADATA;

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

  return (
    <div className="[&_a[href='/privacy']]:underline [&_a[href='/privacy']]:underline-offset-2">
      <ContactPageView intent={intent} source={source} />
    </div>
  );
}
