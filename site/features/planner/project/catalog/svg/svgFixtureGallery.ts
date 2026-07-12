import type { PlannerCatalogCategory, PlannerCatalogDimensions } from "../catalogTypes";
import type { SvgThemeName } from "./svgTypes";
import { generateFallbackSvg } from "./svgFallback";
import { generateSymbol, getSvgSymbolDimensionAgreement, renderSvgSymbol } from "./svgSymbols";

export interface SvgFixtureGalleryEntry {
  id: string;
  category: PlannerCatalogCategory;
  subCategory?: string;
  name: string;
  dimensions: PlannerCatalogDimensions;
  theme: SvgThemeName;
  rotation: number;
  viewBox: string;
  widthMm: number;
  depthMm: number;
  svg: string;
}

const FIXTURE_DIMENSIONS: Record<string, PlannerCatalogDimensions> = {
  chair: { widthMm: 520, depthMm: 540, heightMm: 880 },
  desk: { widthMm: 1400, depthMm: 700, heightMm: 740 },
  sofa: { widthMm: 2100, depthMm: 900, heightMm: 820 },
  rug: { widthMm: 1800, depthMm: 1200, heightMm: 12 },
  outlet: { widthMm: 200, depthMm: 200, heightMm: 20 },
};

export function buildSvgFixtureGallery(): SvgFixtureGalleryEntry[] {
  const fixtures: Array<{
    id: string;
    category: PlannerCatalogCategory;
    subCategory?: string;
    name: string;
    dimensions: PlannerCatalogDimensions;
    theme: SvgThemeName;
    rotation: number;
  }> = [
    { id: "chair-light-0", category: "Furniture", subCategory: "Chairs", name: "Gallery Chair", dimensions: FIXTURE_DIMENSIONS.chair, theme: "light", rotation: 0 },
    { id: "desk-dark-90", category: "Furniture", subCategory: "Desks", name: "Gallery Desk", dimensions: FIXTURE_DIMENSIONS.desk, theme: "dark", rotation: 90 },
    { id: "sofa-selected-180", category: "Furniture", subCategory: "Sofas & Sectionals", name: "Gallery Sofa", dimensions: FIXTURE_DIMENSIONS.sofa, theme: "selected", rotation: 180 },
    { id: "rug-print-0", category: "Decor", subCategory: "Rugs", name: "Gallery Rug", dimensions: FIXTURE_DIMENSIONS.rug, theme: "print", rotation: 0 },
    { id: "symbol-contrast-270", category: "Symbols", subCategory: "Electrical", name: "Gallery Outlet", dimensions: FIXTURE_DIMENSIONS.outlet, theme: "high-contrast", rotation: 270 },
  ];

  const rendered = fixtures.map((fixture) => {
    const symbol = generateSymbol(fixture.category, fixture.subCategory, fixture.dimensions, fixture.name);
    const output = renderSvgSymbol(symbol, fixture.theme, fixture.rotation);
    const agreement = getSvgSymbolDimensionAgreement(symbol);
    return {
      ...fixture,
      viewBox: agreement.viewBox,
      widthMm: output.widthMm,
      depthMm: output.heightMm,
      svg: output.svg,
    };
  });

  const fallback = generateFallbackSvg(
    { widthMm: 600, depthMm: 400, heightMm: 600 },
    "Gallery Missing SVG",
    "Fixture missing specialized symbol",
  );
  return [
    ...rendered,
    {
      id: "fallback-missing-svg",
      category: "Furniture",
      name: "Gallery Missing SVG",
      dimensions: { widthMm: fallback.widthMm, depthMm: fallback.heightMm, heightMm: 600 },
      theme: "fallback",
      rotation: 0,
      viewBox: fallback.viewBox,
      widthMm: fallback.widthMm,
      depthMm: fallback.heightMm,
      svg: fallback.svg,
    },
  ];
}
