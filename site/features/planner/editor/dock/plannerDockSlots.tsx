"use client";

import { createContext, useContext, type ReactNode } from "react";

export type PlannerDockSlotId =
  | "canvas"
  | "inventory"
  | "properties"
  | "tools";

export type PlannerDockSlots = Record<PlannerDockSlotId, ReactNode>;

const PlannerDockSlotsContext = createContext<PlannerDockSlots | null>(null);

export function PlannerDockSlotsProvider({
  slots,
  children,
}: {
  slots: PlannerDockSlots;
  children: ReactNode;
}) {
  return (
    <PlannerDockSlotsContext.Provider value={slots}>
      {children}
    </PlannerDockSlotsContext.Provider>
  );
}

export function usePlannerDockSlots(): PlannerDockSlots {
  const ctx = useContext(PlannerDockSlotsContext);
  if (!ctx) {
    throw new Error("usePlannerDockSlots requires PlannerDockSlotsProvider");
  }
  return ctx;
}

export function usePlannerDockSlot(id: PlannerDockSlotId): ReactNode {
  return usePlannerDockSlots()[id];
}
