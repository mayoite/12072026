"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  SharedClient as Client,
  SharedProject as Project,
  SharedCrmQuoteItem as QuoteItem,
  SharedCrmQuote as Quote
} from "../../shared/crm/types";

export type { Client, Project, QuoteItem, Quote };

import {
  CRM_DEMO_CLIENTS,
  CRM_DEMO_PROJECTS,
  CRM_DEMO_QUOTES,
  isCrmDemoModeEnabled,
} from "./crmDemoSeed";

interface CrmStore {
  clients: Client[];
  projects: Project[];
  quotes: Quote[];
  
  // Client actions
  addClient: (client: Omit<Client, "id" | "createdAt">) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Project actions
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "planIds">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  assignPlanToProject: (projectId: string, planId: string) => void;
  removePlanFromProject: (projectId: string, planId: string) => void;
  
  // Quote actions
  addQuote: (quote: Omit<Quote, "id" | "createdAt" | "updatedAt">) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
}

export const useCrmStore = create<CrmStore>()(
  persist(
    (set) => ({
      clients: isCrmDemoModeEnabled() ? CRM_DEMO_CLIENTS : [],
      projects: isCrmDemoModeEnabled() ? CRM_DEMO_PROJECTS : [],
      quotes: isCrmDemoModeEnabled() ? CRM_DEMO_QUOTES : [],

      addClient: (data) => {
        const client: Client = {
          ...data,
          id: `client-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ clients: [...state.clients, client] }));
        return client;
      },
      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
          projects: state.projects.map((p) => (p.clientId === id ? { ...p, clientId: "none" } : p)),
        }));
      },

      addProject: (data) => {
        const project: Project = {
          ...data,
          id: `project-${Date.now()}`,
          planIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ projects: [...state.projects, project] }));
        return project;
      },
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          quotes: state.quotes.filter((q) => q.projectId !== id),
        }));
      },
      assignPlanToProject: (projectId, planId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            if (p.planIds.includes(planId)) return p;
            return {
              ...p,
              planIds: [...p.planIds, planId],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      removePlanFromProject: (projectId, planId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            return {
              ...p,
              planIds: p.planIds.filter((id) => id !== planId),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addQuote: (data) => {
        const quote: Quote = {
          ...data,
          id: `quote-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ quotes: [...state.quotes, quote] }));
        return quote;
      },
      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },
      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        }));
      },
    }),
    {
      name: "oando-crm-storage",
    }
  )
);
