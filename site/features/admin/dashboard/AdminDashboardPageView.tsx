"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { ADMIN_HUB_KPIS, ADMIN_HUB_SECTIONS } from "../ui/adminNav";

const CRM_HUB_SECTION_TITLE = "CRM & ops";

export default function AdminDashboardPageView() {
  return (
    <div className="admin-page shell-admin-dashboard">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Admin</p>
          <h1 className="admin-page__title">Dashboard</h1>
          <p className="admin-page__meta">
            Planner, catalog, CRM, and system tools in one place.
          </p>
        </div>
      </header>

      <section className="admin-kpi-grid" aria-label="Quick operations">
        {ADMIN_HUB_KPIS.map((kpi) => (
          <Link
            key={kpi.href}
            href={kpi.href}
            className={`admin-kpi admin-kpi--${kpi.tone}`}
          >
            <span className="admin-kpi__label">{kpi.label}</span>
            <span className="admin-kpi__hint">{kpi.hint}</span>
            <span className="admin-kpi__cta">
              Open
              <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        ))}
      </section>

      {ADMIN_HUB_SECTIONS.map((section) => {
        const showCrmStorageWarning = section.title === CRM_HUB_SECTION_TITLE;

        return (
          <section
            key={section.title}
            className="admin-hub-section"
            aria-labelledby={`hub-${section.title}`}
          >
            <h2 id={`hub-${section.title}`} className="admin-hub-section__title">
              {section.title}
            </h2>
            {showCrmStorageWarning ? (
              <div className="admin-alert admin-alert--warn" role="status">
                <p>
                  <strong>Browser-only CRM storage.</strong> Clients, projects, and
                  quotes save to this browser only. They do not sync, and clearing
                  site storage removes them.
                </p>
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.items.map((card) => {
                const Icon = card.icon;
                return (
                  <Link key={card.href} href={card.href} className="shell-admin-card">
                    <span className="shell-admin-card__icon" aria-hidden>
                      <Icon size={16} />
                    </span>
                    <h3 className="shell-admin-card__title">{card.label}</h3>
                    <p className="shell-admin-card__desc">{card.description}</p>
                    <span className="shell-admin-card__cta">
                      Open
                      <ArrowRight size={14} aria-hidden />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
