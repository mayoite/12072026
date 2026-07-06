/**
 * Site Workflows - Module-wise documentation for the public/site surfaces.
 * Part of the revised tech-stack-generator for world-class workflow docs.
 * 
 * Using /using-superpowers (GS): anti-copy, evidence, 5-product alignment for site user journeys.
 * Each module has: walkthrough (with instructions, diagrams, images), current-situation, goal.
 * 
 * Theme synced to main site/app/css/core/tokens.
 * Diagrams: Mermaid. Images: via chrome-devtools captures.
 */

export type SiteWorkflowModule = {
  slug: string;
  title: string;
  walkthrough: string;
  currentSituation: string;
  goal: string;
};

export const siteWorkflowModules: Record<string, SiteWorkflowModule> = {
  // Populated by sub-agents and edits. See subdirs.
};

export default siteWorkflowModules;
