import type { Metadata } from "next";

import { ParametricProductEditor } from "@/features/admin/svg-editor/parametric/ParametricProductEditor";

export const metadata: Metadata = {
  title: "Parametric product factory | Oando Admin",
  description: "Configure exact product assemblies and publish Planner inventory.",
};

export default function AdminParametricProductFactoryPage() {
  return <ParametricProductEditor initialType="desk-assembly" />;
}
