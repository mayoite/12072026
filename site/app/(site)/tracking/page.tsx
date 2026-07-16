import { permanentRedirect } from "next/navigation";

/** No live tracking system — after-sales and delivery follow-up on Service. */
export default function TrackingPage() {
  permanentRedirect("/service");
}
