"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { formatSiteProductContinuityMessage } from "@/lib/analytics/plannerEntry";

/**
 * Non-blocking guest notice when Site stamped `siteProduct` on the planner URL.
 * Toast-only continuity — does not place furniture or rewrite workspace state.
 */
export function SiteProductContinuityNotice() {
  const searchParams = useSearchParams();
  const siteProduct = searchParams.get("siteProduct");
  const productSlug =
    typeof siteProduct === "string" && siteProduct.trim().length > 0
      ? siteProduct.trim()
      : null;
  const [dismissed, setDismissed] = useState(false);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  if (!productSlug || dismissed) {
    return null;
  }

  const message = formatSiteProductContinuityMessage(productSlug);

  return (
    <div
      className="open3d-workspace-toast"
      role="status"
      aria-live="polite"
      data-testid="site-product-continuity-banner"
      data-site-product={productSlug}
    >
      <p className="open3d-workspace-toast__text">{message}</p>
      <button
        type="button"
        className="open3d-workspace-toast__dismiss"
        aria-label="Dismiss product continuity message"
        onClick={dismiss}
      >
        Dismiss
      </button>
    </div>
  );
}
