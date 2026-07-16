import { permanentRedirect } from "next/navigation";

/**
 * Legacy alias only — not a product page.
 * Canonical public surface: `/downloads` (Resource Desk).
 * Same class as `/brochure` and `/catalog`.
 */
export default function DownloadBrochurePage() {
  permanentRedirect("/downloads");
}
