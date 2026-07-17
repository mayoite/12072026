"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleNotch as Loader2, ArrowsClockwise as RefreshCw } from "@phosphor-icons/react";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import {
  getAllFlagsGrouped,
  type FeatureFlagName,
  type FeatureFlags,
} from "@/features/planner/lib/featureFlags";

type FlagsResponse = {
  success?: boolean;
  flags: FeatureFlags;
  source?: string;
};

export default function AdminFeatureFlagsPageView() {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<FeatureFlagName | null>(null);
  const loadFlags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await browserApiFetch(apiPath("/api/admin/features"));
      if (!response.ok) {
        throw new Error(`Failed to load feature flags (${response.status})`);
      }
      const payload = (await response.json()) as FlagsResponse;
      setFlags(payload.flags);
      setSource(payload.source ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load feature flags");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFlags();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadFlags]);

  const toggleFlag = useCallback(async (key: FeatureFlagName, enabled: boolean) => {
    setPendingKey(key);
    setError(null);
    try {
      const response = await browserApiFetch(apiPath("/api/admin/features"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: { [key]: enabled } }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } | string };
        const message =
          typeof body.error === "string"
            ? body.error
            : body.error?.message ?? `Failed to update flag (${response.status})`;
        throw new Error(message);
      }
      const payload = (await response.json()) as { source?: string };
      setFlags((current) => (current ? { ...current, [key]: enabled } : current));
      if (payload.source) setSource(payload.source);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update feature flag");
    } finally {
      setPendingKey(null);
    }
  }, []);

  const grouped = getAllFlagsGrouped();

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Planner toolbar</p>
          <h1 className="admin-page__title">Feature flags</h1>
          <p className="admin-page__copy">
            Toggle planner toolbar items, export actions, panels, and sync behavior. Changes apply to new sessions after refresh.
          </p>
          {source ? <p className="admin-page__meta">Source: {source}</p> : null}
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--outline"
          onClick={() => void loadFlags()}
          disabled={loading}
        >
          {loading ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <RefreshCw size={14} aria-hidden />}
          Refresh
        </button>
      </header>

      {error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      {loading && !flags ? (
        <div className="admin-inline-row text-sm text-muted" role="status" aria-live="polite">
          <Loader2 size={16} className="animate-spin" aria-hidden />
          Loading flags…
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <section key={group.group} className="admin-panel">
              <header className="admin-panel__header">
                <h2 className="text-sm font-semibold text-strong">{group.group}</h2>
              </header>
              <ul className="divide-y divide-soft">
                {group.flags.map((flag) => {
                  const enabled = flags?.[flag.name] ?? flag.defaultValue;
                  const busy = pendingKey === flag.name;
                  return (
                    <li key={flag.name} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div>
                        <p className="font-medium text-strong">{flag.description}</p>
                        <p className="text-xs text-soft">{flag.name}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={flag.description}
                        className={`inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${ enabled ? "bg-primary" : "bg-soft" } ${busy ? "opacity-60" : ""}`}
                        disabled={busy || !flags}
                        onClick={() => void toggleFlag(flag.name, !enabled)}
                      >
                        <span
                          className={`h-5 w-5 transform rounded-full bg-panel shadow transition-transform ${ enabled ? "translate-x-6" : "translate-x-1" }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
