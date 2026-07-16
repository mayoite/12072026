"use client";
import React, { useState, useEffect } from 'react';
import { apiPath, browserApiFetch } from '@/lib/api/browserApi';

import { FloppyDisk as Save, CloudArrowUp as UploadCloud, WarningCircle as AlertCircle } from "@phosphor-icons/react";

interface ThemeRow {
  id: string;
  name: string;
  is_active: boolean;
}

type TabType = 'woods' | 'metals' | 'fabrics' | 'lighting';

const THEME_TABS: TabType[] = ['woods', 'metals', 'fabrics', 'lighting'];

export function ThemeEditor() {
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('woods');
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadThemes() {
      try {
        const res = await browserApiFetch(apiPath('/api/admin/themes'));
        if (res.ok === false) throw new Error(`Failed to load themes (${res.status})`);
        const data = await res.json();
        if (data.success && Array.isArray(data.themes)) {
          setThemes(data.themes);
        }
      } catch (error) {
        setThemes([]);
        setLoadError(error instanceof Error ? error.message : "Failed to load themes");
      } finally {
        setLoading(false);
      }
    }
    const timeoutId = window.setTimeout(() => {
      void loadThemes();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <div className="admin-panel h-96 animate-pulse bg-subtle" role="status" aria-live="polite">
        <span className="sr-only">Loading themes…</span>
      </div>
    );
  }

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const dummyTokens = {
        "wsSurfaceBase": "var(--color-ecru-300)",
        "wsSurfaceGrain": "var(--color-ecru-400)",
        "wsEdgeBanding": "var(--color-ecru-500)",
        "shadowColorHeavy": "var(--shadow-tint-pdp-28)"
      };

      const res = await browserApiFetch(apiPath('/api/admin/themes/publish'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeName: 'premium-light', tokens: dummyTokens })
      });

      if (res.ok === false) throw new Error(`Publish failed (${res.status})`);

      const data = await res.json();
      if (data.success) {
        alert(`Success! Theme deployed to Edge CDN:\n${data.url}`);
      } else {
        alert(`Error publishing: ${data.error}`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Network error");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="space-y-4">
        <button
          type="button"
          className="admin-btn admin-btn--primary w-full"
          disabled
          aria-describedby="theme-create-unavailable"
        >
          + Create New Theme
        </button>
        <p id="theme-create-unavailable" className="admin-page__meta">
          Theme creation is not available in this editor.
        </p>
        <div className="admin-panel overflow-hidden">
          {loadError ? (
            <div className="admin-alert admin-alert--error" role="alert">{loadError}</div>
          ) : themes.length === 0 ? (
            <div className="admin-empty">No themes are available.</div>
          ) : (
            themes.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-2 border-b border-soft p-3 last:border-b-0">
                <span className="font-medium text-strong">{t.name}</span>
                {t.is_active ? <span className="admin-badge admin-badge--active">Live</span> : null}
              </div>
            ))
          )}
        </div>
      </aside>

      <section className="admin-panel overflow-hidden">
        <div className="admin-panel__header flex flex-wrap items-center justify-between gap-3 !py-4">
          <h2 className="m-0 text-lg font-semibold text-strong">Edit Theme Tokens</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              disabled
              aria-describedby="theme-save-unavailable"
            >
              <Save size={16} aria-hidden />
              Save Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="admin-btn admin-btn--success"
            >
              <UploadCloud size={16} aria-hidden />
              {isPublishing ? "Publishing..." : "Publish to Planners"}
            </button>
          </div>
          <p id="theme-save-unavailable" className="admin-page__meta basis-full">
            Selectable token editing is required before drafts can be saved.
          </p>
        </div>

        <div className="flex overflow-x-auto border-b border-soft" role="tablist" aria-label="Material categories">
          {THEME_TABS.map((tab) => {
            const selected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`theme-tab-${tab}`}
                aria-controls="theme-token-panel"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(event) => {
                  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                  event.preventDefault();
                  const currentIndex = THEME_TABS.indexOf(tab);
                  const nextIndex = event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? THEME_TABS.length - 1
                      : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + THEME_TABS.length) % THEME_TABS.length;
                  const nextTab = THEME_TABS[nextIndex];
                  setActiveTab(nextTab);
                  document.getElementById(`theme-tab-${nextTab}`)?.focus();
                }}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selected ? "border-primary bg-subtle text-strong" : "border-transparent text-muted"}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div
          id="theme-token-panel"
          role="tabpanel"
          aria-labelledby={`theme-tab-${activeTab}`}
          className="min-h-[31.25rem] p-4 sm:p-6"
        >
          <div className="admin-alert admin-alert--info mb-6 flex gap-3">
            <AlertCircle size={20} className="shrink-0" aria-hidden />
            <p className="m-0 text-sm">
              <strong>Architecture Note:</strong> Modifying these tokens will update the 3D meshes and 2D canvas dynamically across Buddy Planner and Oando Planner.
            </p>
          </div>

          <div className="admin-empty min-h-64">
            <h3 className="admin-empty__title">No tokens loaded</h3>
            <p className="admin-empty__copy">Token editing becomes available when a theme is loaded.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
