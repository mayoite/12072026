"use client";

import { isCrmDemoModeEnabled } from "@/features/crm/stores/crmDemoSeed";

export function CrmDemoBanner() {
  if (!isCrmDemoModeEnabled()) return null;

  return (
    <div
      className="mb-6 rounded-xl border border-amber-300/60 bg-warning-soft px-4 py-3 text-sm text-amber-950"
      role="status"
    >
      <p className="font-semibold">Demo workspace</p>
      <p className="mt-1 text-amber-900/90">
        CRM records are seeded for demos and persist in this browser only. Do not rely on this data for
        production workflows.
      </p>
      <div className="mt-1 text-amber-900/90">
        <p>Quick actions:</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              const currentUserId = window.localStorage.getItem("crm-demo-user");
              if (currentUserId) {
                const newId = parseInt(currentUserId) + 1;
                window.localStorage.setItem("crm-demo-user", newId.toString());
                alert(`User ID updated to ${newId}. Refresh page to load new demo data.`);
              } else {
                window.localStorage.setItem("crm-demo-user", "2");
                alert("Set user ID to 2. Refresh page to load new demo data.");
              }
            }}
            className="px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700"
          >
            Switch user to Alice (2)
          </button>
          <button
            onClick={() => {
              const currentUserId = window.localStorage.getItem("crm-demo-user");
              if (currentUserId) {
                const newId = 1;
                window.localStorage.setItem("crm-demo-user", newId.toString());
                alert(`User ID updated to ${newId}. Refresh page to load new demo data.`);
              } else {
                alert("No user ID set. Refresh page to load default demo data.");
              }
            }}
            className="px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700"
          >
            Switch user to Bob (1)
          </button>
        </div>
      </div>
    </div>
  );
}
