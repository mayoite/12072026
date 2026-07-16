import { permanentRedirect } from "next/navigation";

/** Retired hollow newsroom — company story lives on About. */
export default function NewsPage() {
  permanentRedirect("/about");
}
