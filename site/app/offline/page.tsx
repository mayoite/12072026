import type { Metadata } from "next";
import ReloadButton from "./ReloadButton";

export const metadata: Metadata = {
  title: "Offline — Oando Platform",
  description: "You are offline. Cached content is available.",
  robots: { index: false, follow: false },
};

export default async function OfflinePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const reason = typeof resolved?.reason === "string" ? resolved.reason : undefined;
  const isMaintenance = reason === "maintenance";

  return (
    <div className="site-error">
      <div className="site-error__panel">
        <h1 className="site-error__title">
          {isMaintenance ? "Read-only maintenance" : "You are offline"}
        </h1>
        <p className="site-error__copy">
          {isMaintenance
            ? "Admin and cloud saves are paused while we restore database connectivity. Public catalog browsing and local planner drafts still work."
            : "We cannot reach the network right now. Any cached pages you have visited will still be available. Please reconnect to continue."}
        </p>
        {!isMaintenance ? <ReloadButton /> : null}
      </div>
    </div>
  );
}
