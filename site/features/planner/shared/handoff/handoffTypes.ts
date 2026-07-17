/**
 * Planner → Oando commercial handoff contract.
 * Shared by the API route and workspace caller.
 */

export const PLANNER_HANDOFF_SOURCE = "planner-handoff" as const;
export const PLANNER_HANDOFF_IDEM_PREFIX = "handoff-key:" as const;

export type PlannerHandoffContact = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export type PlannerHandoffBoqLine = {
  catalogId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unitPriceInr: number;
  lineTotalInr: number;
  priced: boolean;
  priceSource: "demo-list" | "none";
};

export type PlannerHandoffBoq = {
  kind: string;
  projectId: string;
  projectName: string;
  calculationHash: string;
  pricingMode: string;
  pricingNote: string;
  currencyCode: "INR";
  totalItems: number;
  totalLines: number;
  subtotalInr: number;
  gstInr: number;
  totalInr: number;
  pricedItemCount: number;
  unpricedItemCount: number;
  lines: PlannerHandoffBoqLine[];
};

export type PlannerHandoffRequestBody = {
  /** Client-generated UUID for safe retries (required). */
  idempotencyKey: string;
  contact: PlannerHandoffContact;
  boq: PlannerHandoffBoq;
  /** Optional free-form project notes. */
  projectNotes?: string;
  /** Explicit confirmation the user accepts demo pricing labels. */
  confirmDemoPricing: boolean;
};

export type PlannerHandoffSuccessBody = {
  success: true;
  referenceId: string;
  createdAt: string;
  idempotentReplay: boolean;
  staffNotified: boolean;
  message: string;
};

export type PlannerHandoffErrorBody = {
  success: false;
  error: string;
  message: string;
  code?: string;
};
