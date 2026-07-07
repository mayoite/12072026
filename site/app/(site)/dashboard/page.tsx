import { redirect } from "next/navigation";
import { DashboardClient } from "@/app/(site)/dashboard/DashboardClient";
import { SiteWorkspaceShell } from "@/components/home/layout";
import { getOptionalUser } from "@/lib/auth/session";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getOptionalUser();

  if (!user) {
    redirect("/access?next=%2Fdashboard");
  }

  const resolved = searchParams ? await searchParams : {};
  const rawError = resolved.error;
  const accessError =
    (Array.isArray(rawError) ? rawError[0] : rawError)?.trim() || undefined;

  return (
    <SiteWorkspaceShell>
      <DashboardClient
        userEmail={user.email || "workspace user"}
        accessError={accessError}
      />
    </SiteWorkspaceShell>
  );
}
