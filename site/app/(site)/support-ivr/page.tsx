import { permanentRedirect } from "next/navigation";

/** Redundant visual IVR — Service + Contact are the real lanes. */
export default function SupportIvrPage() {
  permanentRedirect("/service");
}
