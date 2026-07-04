import { redirect } from "next/navigation";

import { CRM_PROJECTS_PATH } from "@/features/crm/crmRoutes";

export default function AdminCrmIndexPage() {
  redirect(`${CRM_PROJECTS_PATH}/`);
}
