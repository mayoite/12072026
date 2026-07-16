"use client";

import React, { useState, useMemo } from "react";
import type { Client } from "./stores/crmStore";
import { useCrmStore } from "./stores/crmStore";
import { GlobalNavHeader } from "@/features/shared/shell/GlobalNavHeader";
import { cn } from "@/lib/utils";
import { crmUi } from "./crmUi";
import { CrmWorkspaceBanner } from "./CrmWorkspaceBanner";
import {
  Users,
  Plus,
  MagnifyingGlass as Search,
  Trash as Trash2,
  Envelope as Mail,
  Phone,
  MapPin,
  Buildings as Building2,
  ArrowRight,
  X,
  Clock,
} from "@phosphor-icons/react";

export default function ClientsView({ embedded = false }: { embedded?: boolean }) {
  const { clients, projects, addClient, deleteClient } = useCrmStore();
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const filteredClients = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [clients, search]);

  const clientProjects = useMemo(() => {
    if (!selectedClient) return [];
    return projects.filter((p) => p.clientId === selectedClient.id);
  }, [projects, selectedClient]);

  const stats = useMemo(
    () => [
      { label: "Total Clients", value: clients.length, tone: "text-strong" },
      {
        label: "Corporate Accounts",
        value: clients.filter((c) => c.company).length,
        tone: "text-strong",
      },
      {
        label: "Linked Projects",
        value: projects.filter((p) => p.clientId !== "none").length,
        tone: "text-strong",
      },
    ],
    [clients, projects],
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClient({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
    });

    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNotes("");
    setIsModalOpen(false);
  };

  const shell = embedded
    ? "crm-clients-view"
    : "shell-workspace-page min-h-screen";

  const inner = embedded
    ? "flex w-full flex-col gap-5 sm:gap-6"
    : "mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6";

  return (
    <section className={shell}>
      {!embedded ? <GlobalNavHeader /> : null}

      <div className={inner}>
        {embedded ? <CrmWorkspaceBanner /> : null}

        {embedded ? (
          <div className="crm-clients-toolbar">
            <p className="crm-clients-toolbar__hint text-xs text-muted">
              {clients.length === 0
                ? "Start with sample data or add a client."
                : `${clients.length} client${clients.length === 1 ? "" : "s"} in this browser.`}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="admin-btn admin-btn--primary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden /> New Client
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="shell-workspace-eyebrow text-[0.6875rem] font-semibold uppercase tracking-[0.26em]">
                CRM & Customer Relations
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-strong">
                Client Directory
              </h1>
              <p className="shell-workspace-muted mt-2 text-sm leading-6">
                Manage client contact cards, project associations, and notes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex min-h-11 w-full items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-xs font-semibold sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden /> New Client
            </button>
          </div>
        )}

        <div
          className="crm-clients-kpi-grid"
          role="group"
          aria-label="Client statistics"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="admin-panel crm-clients-kpi p-3 sm:p-5">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted sm:tracking-[0.2em]">
                {stat.label}
              </p>
              <p className={cn("mt-1.5 text-xl font-bold sm:mt-2 sm:text-2xl", stat.tone)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search by name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-field__control min-h-11 pl-10 text-sm"
            aria-label="Search clients"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1.4fr] lg:gap-6">
          <div className="admin-panel p-4 sm:p-5">
            <h2 className="m-0 mb-3 text-base font-semibold tracking-tight text-strong sm:text-lg">
              All Contacts
            </h2>

            {filteredClients.length === 0 ? (
              <div className="admin-empty" role="status">
                <Users className="h-10 w-10 text-subtle" aria-hidden />
                <h3 className="admin-empty__title">No clients found</h3>
                <p className="admin-empty__copy">
                  {clients.length === 0
                    ? "Add a new client to start building your directory, or load sample data above."
                    : "No contacts match this search. Try another name, company, or email."}
                </p>
                {clients.length === 0 ? (
                  <div className="admin-empty__actions">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="admin-btn admin-btn--primary"
                    >
                      New Client
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className={cn("space-y-1 divide-y", crmUi.softBorder)}>
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedClient(client)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedClient(client);
                      }
                    }}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center justify-between rounded-xl p-3 transition sm:p-4",
                      selectedClient?.id === client.id
                        ? `${crmUi.softSurface} border ${crmUi.panelBorder}`
                        : `border border-transparent ${crmUi.hoverSurface}`,
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-inverse">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-strong">
                          {client.name}
                        </p>
                        {client.company ? (
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                            <Building2 className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                            <span className="truncate">{client.company}</span>
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClient(client.id);
                          if (selectedClient?.id === client.id) setSelectedClient(null);
                        }}
                        className={cn(
                          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg",
                          crmUi.ghostDanger,
                        )}
                        title="Delete client"
                        aria-label={`Delete client ${client.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                      <ArrowRight className="hidden h-4 w-4 text-subtle sm:block" aria-hidden />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel flex min-h-[16rem] flex-col justify-between p-4 sm:p-5">
            {selectedClient ? (
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-inverse">
                      {selectedClient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-strong sm:text-lg">
                        {selectedClient.name}
                      </h3>
                      {selectedClient.company ? (
                        <p className="mt-0.5 truncate text-sm text-muted">
                          {selectedClient.company}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted hover:bg-soft"
                    aria-label="Close client details"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>

                <hr className={crmUi.panelBorder} />

                <div className="space-y-3">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
                    Contact Details
                  </p>
                  <div className="space-y-2 text-sm">
                    {selectedClient.email ? (
                      <div className="flex items-center gap-3 text-body">
                        <Mail className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                        <a href={`mailto:${selectedClient.email}`} className="break-all hover:underline">
                          {selectedClient.email}
                        </a>
                      </div>
                    ) : null}
                    {selectedClient.phone ? (
                      <div className="flex items-center gap-3 text-body">
                        <Phone className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                        <span>{selectedClient.phone}</span>
                      </div>
                    ) : null}
                    {selectedClient.address ? (
                      <div className="flex items-center gap-3 text-body">
                        <MapPin className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                        <span>{selectedClient.address}</span>
                      </div>
                    ) : null}
                    {!selectedClient.email && !selectedClient.phone && !selectedClient.address ? (
                      <p className="text-xs text-muted italic">No contact details on file.</p>
                    ) : null}
                  </div>
                </div>

                {selectedClient.notes ? (
                  <div className="space-y-3">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
                      Correspondence Notes
                    </p>
                    <div
                      className={cn(
                        "whitespace-pre-wrap rounded-xl border p-4 text-xs leading-relaxed text-body",
                        crmUi.softSurface,
                        crmUi.panelBorder,
                      )}
                    >
                      {selectedClient.notes}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
                    Associated Projects ({clientProjects.length})
                  </p>
                  {clientProjects.length === 0 ? (
                    <p className="text-xs italic text-muted">
                      No projects linked to this client yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {clientProjects.map((p) => (
                        <div
                          key={p.id}
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-3",
                            crmUi.softSurface,
                            crmUi.softBorder,
                          )}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-strong">{p.name}</p>
                            <p className="mt-1 text-[0.6875rem] text-muted">
                              Status:{" "}
                              <span className="capitalize">{p.status.replace("_", " ")}</span>
                            </p>
                          </div>
                          <Clock className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="admin-empty flex-1 justify-center py-12 sm:py-16">
                <Users className="h-12 w-12 text-subtle" aria-hidden />
                <p className="admin-empty__title">Select a contact</p>
                <p className="admin-empty__copy">
                  Click on any client card to view their full detail sheet, contact info, and
                  linked projects.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crm-new-client-title"
        >
          <div
            className={cn(
              "flex max-h-[92dvh] w-full max-w-lg flex-col gap-5 overflow-y-auto p-5 sm:gap-6 sm:p-8",
              crmUi.modal,
              "rounded-t-2xl sm:rounded-[2rem]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  id="crm-new-client-title"
                  className="text-xl font-semibold text-strong sm:text-2xl"
                >
                  Add New Client
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Enter client details to create a new contact profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted hover:bg-soft"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-1">
              <label className="admin-field">
                <span className="admin-field__label">Name *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-field__control"
                  placeholder="Full Name"
                />
              </label>

              <label className="admin-field">
                <span className="admin-field__label">Company / Organisation</span>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="admin-field__control"
                  placeholder="e.g. Nexus Tech"
                />
              </label>

              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
                <label className="admin-field">
                  <span className="admin-field__label">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-field__control"
                    placeholder="name@company.com"
                  />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">Phone</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="admin-field__control"
                    placeholder="+91..."
                  />
                </label>
              </div>

              <label className="admin-field">
                <span className="admin-field__label">Address</span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="admin-field__control"
                  placeholder="Office Address"
                />
              </label>

              <label className="admin-field">
                <span className="admin-field__label">Notes</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="admin-field__control admin-field__control--multiline"
                  placeholder="Client preferences, project scoping details..."
                />
              </label>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn admin-btn--outline w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="admin-btn admin-btn--primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
