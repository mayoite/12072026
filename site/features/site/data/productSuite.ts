export const PRODUCT_SUITE = {
  shared: {
    routes: {
      access: "/access",
      chooser: "/choose-product",
      dashboard: "/dashboard",
      login: "/login",
    },
  },
  planner: {
    label: "Workspace Planner",
    description:
      "Client-ready workspace layout with 2D and 3D views, catalog furniture, AI assist, and branded PDF export.",
    routes: {
      landing: "/planner",
      login: "/login",
      /** Guest canvas (after chooser). */
      guest: "/planner/guest",
      /** Public guest entry step — marketing / nav land here first. */
      guestChooser: "/choose-product?mode=guest",
      help: "/planner/help",
      onboarding: "/planner",
      dashboard: "/dashboard",
      canvas: "/planner/canvas",
      portal: "/portal",
      shared: "/planner/canvas",
    },
  },
  configurator: {
    label: "Configurator",
    description:
      "Legacy buddy-planner routes redirect to the unified workspace planner at /planner.",
    routes: {
      landing: "/planner",
      login: "/login",
      guest: "/planner/guest",
      guestChooser: "/choose-product?mode=guest",
      onboarding: "/planner",
      dashboard: "/dashboard",
      canvas: "/planner/canvas",
    },
  },
  admin: {
    label: "Admin",
    description: "Internal operations and product oversight.",
    routes: {
      landing: "/admin",
      login: "/login",
    },
  },
} as const;

export type ProductSuiteKey = keyof typeof PRODUCT_SUITE;
