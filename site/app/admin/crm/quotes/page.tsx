import QuotesView from "@/features/crm/QuotesView";

export const dynamic = "force-dynamic";

export default function AdminCrmQuotesPage() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">CRM</p>
          <h1 className="admin-page__title">Quotes</h1>
          <p className="admin-page__copy">Quote drafts, approvals, and follow-up status.</p>
        </div>
      </header>
      <QuotesView embedded />
    </div>
  );
}
