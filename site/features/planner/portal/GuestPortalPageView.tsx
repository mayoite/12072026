import Link from "next/link";

/**
 * Guest portal entry shell.
 * No auth, no cloud plan list — must resolve immediately (never infinite spinner).
 * Guests design in the guest planner; cloud portal history requires sign-in.
 */
export default function GuestPortalPageView() {
  return (
    <div
      className="shell-portal-page mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12"
      data-testid="guest-portal-page"
    >
      <header className="shell-portal-panel p-6 md:p-8">
        <p className="shell-portal-table-label">Guest portal</p>
        <h1 className="shell-portal-page-title mt-2">Guest workspace entry</h1>
        <p className="shell-portal-table-meta mt-3 max-w-3xl">
          Design with available inventory in the guest planner. Guest layouts stay local until you
          sign in. Saved portal plans require a member session.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/planner/guest/"
            className="shell-portal-button-primary"
            data-testid="guest-portal-open-planner"
          >
            Open guest planner
          </Link>
          <Link
            href="/access?next=%2Fportal"
            className="shell-portal-button-secondary"
            data-testid="guest-portal-sign-in"
          >
            Sign in for saved plans
          </Link>
          <Link href="/choose-product?mode=guest" className="shell-portal-button-secondary">
            Workspace chooser
          </Link>
        </div>
      </header>

      <section
        className="shell-portal-panel-soft mt-6 p-6"
        role="status"
        data-testid="guest-portal-empty"
      >
        <h2 className="shell-portal-section-title text-base">No cloud plan history in guest mode</h2>
        <p className="shell-portal-table-meta mt-2">
          The guest portal does not load remote plan storage. Open the guest planner to start a
          layout, or sign in to review member portal plans.
        </p>
      </section>
    </div>
  );
}
