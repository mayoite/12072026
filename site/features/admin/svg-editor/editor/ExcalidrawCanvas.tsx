"use client";

import dynamic from "next/dynamic";

// ExcalidrawClient MUST be imported dynamically with ssr: false
const ExcalidrawClient = dynamic(
  () => import("./ExcalidrawClient"),
  { ssr: false, loading: () => <div>Loading Excalidraw...</div> }
);

export function ExcalidrawCanvas(props: any) {
  return <ExcalidrawClient {...props} />;
}
