"use client";

import dynamic from "next/dynamic";
import type { ExcalidrawClientProps } from "./ExcalidrawClient";

// ExcalidrawClient MUST be imported dynamically with ssr: false
const ExcalidrawClient = dynamic(
  () => import("./ExcalidrawClient"),
  { ssr: false, loading: () => <div>Loading Excalidraw...</div> },
);

export function ExcalidrawCanvas(props: ExcalidrawClientProps) {
  return <ExcalidrawClient {...props} />;
}
