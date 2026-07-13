/**
 * Site Workflows - Module-wise documentation for the public/site surfaces.
 * Part of the revised tech-stack-generator for world-class workflow docs.
 * 
 * Using /using-superpowers (GS): anti-copy, evidence, 5-product alignment for site user journeys.
 * Each module has: walkthrough (with instructions, diagrams, images), current-situation, goal.
 * 
 * Theme synced to main site/app/css/core/theme.css.
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
  'marketing-site': {
    slug: 'marketing-site',
    title: 'Marketing Site',
    walkthrough: 'See walkthrough.md',
    currentSituation: 'See current-situation.md',
    goal: 'See goal.md'
  },
  'site-planner-integration': {
    slug: 'site-planner-integration',
    title: 'Site ↔ Planner Integration',
    walkthrough: 'See walkthrough.md',
    currentSituation: 'See current-situation.md',
    goal: 'See goal.md'
  },
  'release-qa-site': {
    slug: 'release-qa-site',
    title: 'Release & QA Site',
    walkthrough: 'See walkthrough.md',
    currentSituation: 'See current-situation.md',
    goal: 'See goal.md'
  }
};

export default siteWorkflowModules;