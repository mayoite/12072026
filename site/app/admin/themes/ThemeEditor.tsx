"use client";
import React, { useState, useEffect } from 'react';
import { apiPath, browserApiFetch } from '@/lib/api/browserApi';

import { Save, UploadCloud, AlertCircle } from 'lucide-react';

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

  useEffect(() => {
    async function loadThemes() {
      try {
        const res = await browserApiFetch(apiPath('/api/admin/themes'));
        const data = await res.json();
        if (data.success && Array.isArray(data.themes)) {
          setThemes(data.themes);
        }
      } catch (_err) {
        setThemes([]);
      } finally {
        setLoading(false);
      }
    }
    loadThemes();
  }, []);

  if (loading) {
    return <div className="admin-panel h-96 animate-pulse bg-subtle" aria-hidden />;
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

      const data = await res.json();
      if (data.success) {
        alert(`Success! Theme deployed to Edge CDN:\n${data.url}`);
      } else {
        alert(`Error publishing: ${data.error}`);
      }
    } catch (_err) {
      alert(`Network error`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="admin-theme-layout">
      <aside className="space-y-4">
        <button type="button" className="admin-btn admin-btn--primary admin-btn--block">
          + Create New Theme
        </button>
        <div className="admin-panel overflow-hidden">
          {themes.length === 0 ? (
            <div className="admin-empty">No themes found in database. Please run the Supabase migration.</div>
          ) : (
            themes.map((t) => (
              <div key={t.id} className="admin-theme-list-item">
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
            <button type="button" className="admin-btn admin-btn--outline">
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
        </div>

        <div className="admin-tabs" role="tablist" aria-label="Material categories">
          {THEME_TABS.map((tab) => {
            const selected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab)}
                className={`admin-tabs__tab${selected ? " admin-tabs__tab--active" : ""}`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="p-6 min-h-[31.25rem]">
          <div className="admin-alert admin-alert--info mb-6 flex gap-3">
            <AlertCircle size={20} className="shrink-0" aria-hidden />
            <p className="m-0 text-sm">
              <strong>Architecture Note:</strong> Modifying these tokens will update the 3D meshes and 2D canvas dynamically across Buddy Planner and Oando Planner.
            </p>
          </div>

          <div className="flex min-h-64 flex-col items-center justify-center text-muted">
            <p className="m-0 italic">Material property editor UI components will render here...</p>
            <p className="mt-2 text-sm">Waiting for Database Sync to populate JSON dictionary.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
