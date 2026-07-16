import { permanentRedirect } from "next/navigation";

/** Retired synthetic social feed — proof photos live on Portfolio. */
export default function SocialPage() {
  permanentRedirect("/portfolio");
}
