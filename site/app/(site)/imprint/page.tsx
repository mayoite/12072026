import { permanentRedirect } from "next/navigation";

/**
 * Imprint removed as a separate legal page — owner decision: keep Terms only.
 * Old /imprint links permanently redirect to /terms.
 */
export default function ImprintPage() {
  permanentRedirect("/terms");
}
