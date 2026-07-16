"use client";

/**
 * Mounts Vercel Web Analytics so `window.va.track` exists for siteEvents.
 * Without this, every emitSiteEvent silently no-ops.
 */
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function SiteAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
