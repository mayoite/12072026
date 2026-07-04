import { redirect } from "next/navigation";

import { CRM_CLIENTS_PATH } from "@/features/crm/crmRoutes";

export default function CrmClientsRedirectPage() {
  redirect(`${CRM_CLIENTS_PATH}/`);
}
