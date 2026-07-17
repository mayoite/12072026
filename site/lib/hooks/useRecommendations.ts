import { useQuery } from "@tanstack/react-query";

export type RecommendationResult = {
  mode: "personalized" | "popular";
  summary: string;
  recommendations: Array<{
    productId: string;
    productName: string;
    category: string;
    why: string;
    budgetEstimate: string;
    href: string;
  }>;
};

/**
 * Personalized mode uses the tracking anon cookie / bearer session on the server.
 * Do not send a client-invented userId (API ignores body userId to prevent IDOR).
 */
export function useRecommendations(enabled = true) {
  return useQuery<RecommendationResult>({
    queryKey: ["recommendations", enabled],
    queryFn: async () => {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ limit: 4 }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      return res.json();
    },
    enabled,
    staleTime: 1000 * 60 * 30,
  });
}
