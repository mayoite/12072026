export interface ProofCatalogItem {
  id: string;
  name: string;
  widthMm: number;
  depthMm: number;
  previewUrl: string;
  fallback: "box";
}

export const proofCatalogItem: ProofCatalogItem = {
  id: "proof-chair",
  name: "Proof chair",
  widthMm: 600,
  depthMm: 600,
  previewUrl: "/proof-chair.svg",
  fallback: "box",
};
