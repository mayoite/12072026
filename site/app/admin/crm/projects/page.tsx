import ProjectsView from "@/features/crm/ProjectsView";
import { CrmSubnav } from "@/features/crm/CrmSubnav";

export const dynamic = "force-dynamic";

export default function AdminCrmProjectsPage() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">CRM</p>
          <h1 className="admin-page__title">Projects</h1>
          <p className="admin-page__copy">
            Active deals, floor plans, and delivery pipelines.
          </p>
        </div>
      </header>
      <CrmSubnav />
      <ProjectsView embedded />
    </div>
  );
}
