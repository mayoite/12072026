import type { Metadata } from "next";
import { LinearDeskParametricForm } from "@/features/admin/svg-editor/parametric/LinearDeskParametricForm";

export const metadata: Metadata = {
  title: "Linear desk parametric | Oando Admin",
  description: "Field-driven linear desk SVG — preview and publish to disk.",
};

export default function AdminLinearDeskParametricPage() {
  return <LinearDeskParametricForm />;
}
