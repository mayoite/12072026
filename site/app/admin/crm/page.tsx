import CrmHubView from "@/features/crm/CrmHubView";
import { CrmSubnav } from "@/features/crm/CrmSubnav";

export const dynamic = "force-dynamic";

export default function AdminCrmIndexPage() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">CRM</p>
          <h1 className="admin-page__title">Pipeline hub</h1>
          <p className="admin-page__copy">
            Clients, projects, quotes, and inbound queries — browser-local workspace for
            sales follow-through.
          </p>
        </div>
      </header>
      <CrmSubnav />
      <CrmHubView />
    </div>
  );
}
