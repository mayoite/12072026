import { redirect } from "next/navigation";

import { CRM_QUOTES_PATH } from "@/features/crm/crmRoutes";

export default function CrmQuotesRedirectPage() {
  redirect(`${CRM_QUOTES_PATH}/`);
}
