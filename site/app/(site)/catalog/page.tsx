import { permanentRedirect } from "next/navigation";

/** Legacy alias — hard permanent redirect (mirrors next.config permanent: true → 308). */
export default function CatalogPage() {
  permanentRedirect("/downloads");
}
