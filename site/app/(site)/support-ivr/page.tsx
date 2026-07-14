import { SupportIvrPageView } from "@/components/support/SupportIvrPageView";
import { SUPPORT_IVR_PAGE_METADATA } from "@/features/site/data/routeMetadata";

export const metadata = SUPPORT_IVR_PAGE_METADATA;

export default function SupportPage() {
  return <SupportIvrPageView />;
}
