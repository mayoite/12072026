import { Suspense } from "react";

import { RouteChrome } from "@/components/site/RouteChrome";

/** RouteChrome uses useSearchParams — must sit inside a Suspense boundary. */
export function RouteChromeSuspense({
  position,
}: {
  position: "top" | "bottom";
}) {
  return (
    <Suspense fallback={null}>
      <RouteChrome position={position} />
    </Suspense>
  );
}