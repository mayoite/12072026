import type { Metadata } from "next";
import { HomeMarketingLayout } from "@/components/home/layout";
import { RepoStorePageView } from "@/components/repo-store/RepoStorePageView";
import { REPO_STORE_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata: Metadata = REPO_STORE_PAGE_METADATA;

export default function RepoStorePage() {
  return (
    <HomeMarketingLayout>
      <RepoStorePageView />
    </HomeMarketingLayout>
  );
}
