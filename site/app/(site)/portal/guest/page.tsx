import { redirect } from "next/navigation";
import { buildAccessRedirect } from "@/lib/auth/plannerRedirect";

export default function GuestPortalPage() {
  redirect(buildAccessRedirect("/portal"));
}
