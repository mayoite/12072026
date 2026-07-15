import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ChooseProductPage } from "@/features/shared/entry/ChooseProductPage";
import { SiteWorkspaceShell } from "@/components/home/layout";
import { getOptionalUser } from "@/lib/auth/session";
import { CHOOSE_PRODUCT_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata: Metadata = CHOOSE_PRODUCT_PAGE_METADATA;

export default async function ChooseProductRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getOptionalUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const guestMode = resolvedSearchParams?.mode === "guest";

  if (!user && !guestMode) {
    redirect("/access?next=%2Fdashboard");
  }

  if (user && !guestMode) {
    redirect("/dashboard");
  }

  return (
    <SiteWorkspaceShell>
      <ChooseProductPage guestMode={guestMode} authenticated={Boolean(user)} />
    </SiteWorkspaceShell>
  );
}
