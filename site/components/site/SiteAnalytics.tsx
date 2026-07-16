"use client";

/**
 * Mounts Vercel Web Analytics and Speed Insights.
 * Transport (`emitTransport.ts`) calls `vercelTrack()` from the package — not `window.va.track`.
 * Without this component, `window.va` is absent and `isAnalyticsTransportReady()` returns false.
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
