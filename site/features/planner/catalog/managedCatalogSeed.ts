/** Curated admin-managed catalog rows for dev/staging (real mm in specs). */
export type ManagedCatalogSeedRow = {
  slug: string;
  planner_source_slug: string;
  name: string;
  description: string;
  category: string;
  category_id: string;
  category_name: string;
  series_id: string;
  series_name: string;
  price: number;
  flagship_image: string;
  images: string[];
  specs: { widthMm: number; depthMm: number; heightMm: number };
};

export const MANAGED_CATALOG_SEED: ManagedCatalogSeedRow[] = [
  {
    slug: "managed-alpha-desk",
    planner_source_slug: "alpha-desk",
    name: "Alpha Executive Desk",
    description: "Single-seat executive workstation for focused work.",
    category: "desk",
    category_id: "oando-workstations",
    category_name: "Workstations",
    series_id: "executive",
    series_name: "Executive",
    price: 85000,
    flagship_image: "",
    images: [],
    specs: { widthMm: 1600, depthMm: 800, heightMm: 750 },
  },
  {
    slug: "managed-linear-bench-4",
    planner_source_slug: "linear-bench-4",
    name: "Linear Bench (4-seat)",
    description: "Shared linear bench for open-plan teams.",
    category: "desk",
    category_id: "oando-workstations",
    category_name: "Workstations",
    series_id: "linear",
    series_name: "Linear Bench",
    price: 120000,
    flagship_image: "",
    images: [],
    specs: { widthMm: 2400, depthMm: 750, heightMm: 750 },
  },
  {
    slug: "managed-meeting-table-8",
    planner_source_slug: "meeting-table-8",
    name: "Meeting Table (8p)",
    description: "Conference table sized for eight people.",
    category: "meeting",
    category_id: "meeting-tables",
    category_name: "Meeting Tables",
    series_id: "conference",
    series_name: "Conference",
    price: 95000,
    flagship_image: "",
    images: [],
    specs: { widthMm: 3200, depthMm: 1200, heightMm: 750 },
  },
  {
    slug: "managed-locker-bank",
    planner_source_slug: "locker-bank",
    name: "Locker Bank (6-door)",
    description: "Personal storage locker bank for workplace zones.",
    category: "storage",
    category_id: "oando-storage",
    category_name: "Storage",
    series_id: "lockers",
    series_name: "Lockers",
    price: 45000,
    flagship_image: "",
    images: [],
    specs: { widthMm: 900, depthMm: 450, heightMm: 1800 },
  },
  {
    slug: "managed-task-chair",
    planner_source_slug: "task-chair",
    name: "Task Chair",
    description: "Ergonomic task chair for desk placement.",
    category: "chair",
    category_id: "oando-chairs",
    category_name: "Chairs",
    series_id: "task",
    series_name: "Task Seating",
    price: 18000,
    flagship_image: "",
    images: [],
    specs: { widthMm: 600, depthMm: 600, heightMm: 1100 },
  },
  {
    slug: "managed-phone-booth",
    planner_source_slug: "phone-booth",
    name: "Phone Booth",
    description: "Single-person acoustic booth for calls and focus.",
    category: "meeting",
    category_id: "oando-collaborative",
    category_name: "Collaborative Spaces",
    series_id: "booth",
    series_name: "Phone Booth",
    price: 210000,
    flagship_image: "",
    images: [],
    specs: { widthMm: 1200, depthMm: 1200, heightMm: 2200 },
  },
];
