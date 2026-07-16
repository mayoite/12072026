import { permanentRedirect } from "next/navigation";

/** Retired duplicate gallery — use Portfolio for delivery photos. */
export default function GalleryPage() {
  permanentRedirect("/portfolio");
}
