import { redirect } from "next/navigation";

import { crmProjectDetailPath } from "@/features/crm/crmRoutes";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CrmProjectDetailRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`${crmProjectDetailPath(id)}/`);
}
