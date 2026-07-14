"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { ADMIN_HUB_SECTIONS } from "./adminNav";

const CRM_HUB_SECTION_TITLE = "CRM & ops";

export default function AdminDashboardPageView() {
  return (
    <div className="admin-page shell-admin-dashboard">
      <section className="admin-hero" aria-labelledby="admin-hero-title">
        <div className="admin-hero__inner">
          <div className="admin-hero__copy" style={{ gridColumn: "1 / -1" }}>
            <p className="admin-page__eyebrow admin-hero__eyebrow">Admin backend</p>
            <h1 id="admin-hero-title" className="admin-hero__title">
              Platform control
            </h1>
            <p className="admin-hero__lead">
              Manage planner sessions, catalog products, feature flags, themes, and the live route inventory from one
              console. Use the sections below to move between planner, catalog, CRM, and platform workflows.
            </p>
          </div>
        </div>
      </section>

      {ADMIN_HUB_SECTIONS.map((section) => {
        const showCrmStorageWarning = section.title === CRM_HUB_SECTION_TITLE;

        return (
          <section key={section.title} className="admin-hub-section" aria-labelledby={`hub-${section.title}`}>
            <header className="admin-hub-section__header">
              <h2 id={`hub-${section.title}`} className="admin-hub-section__title">
                {section.title}
              </h2>
            </header>
            {showCrmStorageWarning ? (
              <div className="admin-alert admin-alert--warn" role="status">
                <p>
                  <strong>Browser-only CRM storage.</strong> CRM clients, projects, and quotes in this admin lane save
                  to localStorage on the current browser. They do not sync across users or devices, and clearing site
                  storage removes them.
                </p>
              </div>
            ) : null}
            <div className="admin-grid-cards">
              {section.items.map((card) => {
                const Icon = card.icon;
                return (
                  <Link key={card.href} href={card.href} className="shell-admin-card">
                    <span className="shell-admin-card__icon" aria-hidden>
                      <Icon size={18} />
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
