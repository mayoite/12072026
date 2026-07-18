"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ArrowSquareOut as ExternalLink, CircleNotch as Loader2 } from "@phosphor-icons/react";

import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import { buildPlannerCanvasHref } from "@/features/admin/plans/plannerAdminLinks";
import {
  getPlannerSceneEnvelope,
  type PlannerSceneEnvelope,
  type PlannerJsonValue,
} from "@/features/planner/model";

type AdminPlanDetail = {
  id: string;
  title: string;
  project_name: string | null;
  client_name: string | null;
  prepared_by: string | null;
  room_width_mm: number;
  room_depth_mm: number;
  seat_target: number;
  unit_system: string;
  item_count: number;
  thumbnail_url: string | null;
  scene_json: unknown;
  status: "draft" | "active" | "archived";
  review_status: "pending" | "approved";
  created_at: string;
  updated_at: string;
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function sceneReadiness(scene: PlannerSceneEnvelope | null) {
  if (!scene) {
    return {
      hasScene: false,
      hasFabricSnapshot: false,
      itemCount: 0,
      roomLabel: "Unknown",
    };
  }

  const fabricSnapshot = (scene as PlannerSceneEnvelope & { fabricSnapshot?: unknown }).fabricSnapshot;
  return {
    hasScene: true,
    hasFabricSnapshot: Boolean(fabricSnapshot),
    itemCount: scene.items.length,
    roomLabel: `${scene.room.widthMm} × ${scene.room.depthMm} mm`,
  };
}

export default function AdminPlanDetailPageView() {
  const params = useParams<{ id: string }>();
  const planId = params?.id?.trim() ?? "";

  const [plan, setPlan] = useState<AdminPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadPlan = useCallback(async () => {
    if (!planId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await browserApiFetch(
        apiPath(`/api/admin/plans/${encodeURIComponent(planId)}`),
      );
      if (!response.ok) {
        throw new Error(`Failed to load plan (${response.status})`);
      }
      const payload = (await response.json()) as { plan: AdminPlanDetail };
      setPlan(payload.plan);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load plan");
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadPlan();
    });
    return () => {
      cancelled = true;
    };
  }, [loadPlan]);

  const scene = useMemo(
    () => (plan ? getPlannerSceneEnvelope(plan.scene_json as PlannerJsonValue) : null),
    [plan],
  );
  const readiness = useMemo(() => sceneReadiness(scene), [scene]);

  const updateStatus = useCallback(async (status: AdminPlanDetail["status"]) => {
    if (!planId) return;
    setSaving(true);
    setStatusMessage(null);
    setError(null);
    try {
      const response = await browserApiFetch(
        apiPath(`/api/admin/plans/${encodeURIComponent(planId)}`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (!response.ok) {
        throw new Error(`Failed to update plan (${response.status})`);
      }
      const payload = (await response.json()) as { plan: AdminPlanDetail };
      setPlan(payload.plan);
      setStatusMessage(`Plan marked as ${status}.`);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update plan");
    } finally {
      setSaving(false);
    }
  }, [planId]);

  if (!planId) {
    return (
      <div className="admin-page">
        <h1 className="admin-type-page">Plan detail</h1>
        <div className="admin-alert admin-alert--error" role="alert">
          Missing plan id.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Link href="/admin/plans" className="admin-inline-gap admin-type-meta">
        <ArrowLeft size={14} aria-hidden />
        Back to plans
      </Link>

      {!plan ? (
        <header className="admin-stack--tight">
          <p className="admin-type-label">Plan review</p>
          <h1 className="admin-type-page">Plan detail</h1>
        </header>
      ) : null}

      {loading ? (
        <div className="admin-status-line" role="status" aria-live="polite">
          <Loader2 size={16} className="admin-icon-spin" aria-hidden />
          Loading plan…
        </div>
      ) : null}

      {error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="admin-alert admin-alert--success" role="status">
          <Check size={14} className="mr-1 inline" aria-hidden />
          {statusMessage}
        </div>
      ) : null}

      {plan ? (
        <div className="admin-stack--loose">
          <header className="admin-hero-card">
            <p className="admin-type-label">Plan review</p>
            <h1 className="admin-hero-card__title">{plan.title}</h1>
            <p className="admin-type-meta">
              {plan.project_name ?? "No project"} · {plan.client_name ?? "No client"} · Updated {formatTimestamp(plan.updated_at)}
            </p>
            <div className="admin-actions-row">
              <Link
                href={buildPlannerCanvasHref(plan.id)}
                className="admin-btn admin-btn--primary"
              >
                <ExternalLink size={14} className="admin-icon-static" aria-hidden />
                Open in canvas
              </Link>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={saving || plan.status === "active"}
                onClick={() => void updateStatus("active")}
              >
                Approve
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={saving || plan.status === "draft"}
                onClick={() => void updateStatus("draft")}
              >
                Mark draft
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={saving || plan.status === "archived"}
                onClick={() => void updateStatus("archived")}
              >
                Archive
              </button>
            </div>
          </header>

          <section className="admin-grid-2--md">
            <div className="admin-panel admin-panel--padded">
              <h2 className="admin-type-section">Document summary</h2>
              <dl className="admin-dl">
                <div className="admin-dl__row">
                  <dt>Room</dt>
                  <dd>{plan.room_width_mm} × {plan.room_depth_mm} mm</dd>
                </div>
                <div className="admin-dl__row">
                  <dt>Items</dt>
                  <dd>{plan.item_count}</dd>
                </div>
                <div className="admin-dl__row">
                  <dt>Seat target</dt>
                  <dd>{plan.seat_target}</dd>
                </div>
                <div className="admin-dl__row">
                  <dt>Units</dt>
                  <dd>{plan.unit_system}</dd>
                </div>
                <div className="admin-dl__row">
                  <dt>Status</dt>
                  <dd>{plan.status}</dd>
                </div>
              </dl>
            </div>

            <div className="admin-panel admin-panel--padded">
              <h2 className="admin-type-section">Fabric scene readiness</h2>
              <dl className="admin-dl">
                <div className="admin-dl__row">
                  <dt>Canonical scene</dt>
                  <dd>{readiness.hasScene ? "Present" : "Missing"}</dd>
                </div>
                <div className="admin-dl__row">
                  <dt>Fabric snapshot</dt>
                  <dd>{readiness.hasFabricSnapshot ? "Present" : "Missing"}</dd>
                </div>
                <div className="admin-dl__row">
                  <dt>Scene items</dt>
                  <dd>{readiness.itemCount}</dd>
                </div>
                <div className="admin-dl__row">
                  <dt>Scene room</dt>
                  <dd>{readiness.roomLabel}</dd>
                </div>
              </dl>
            </div>
          </section>

          {scene?.items?.length ? (
            <section className="admin-panel admin-panel--padded">
              <h2 className="admin-type-section">Scene items</h2>
              <ul className="admin-item-list">
                {scene.items.slice(0, 12).map((item) => (
                  <li key={item.id}>
                    <span className="admin-type-body--strong">{item.name}</span>
                    <span className="admin-type-muted">
                      {item.category} · {item.sizeMm.widthMm} × {item.sizeMm.depthMm} mm
                    </span>
                  </li>
                ))}
              </ul>
              {scene.items.length > 12 ? (
                <p className="admin-type-soft">Showing first 12 of {scene.items.length} items.</p>
              ) : null}
            </section>
          ) : null}

          <section className="admin-panel admin-panel--padded">
            <h2 className="admin-type-section">Scene JSON</h2>
            <pre
              className="admin-preformatted admin-preformatted--scroll"
              role="region"
              aria-label="Scene JSON"
              tabIndex={0}
            >
              {JSON.stringify(plan.scene_json, null, 2)}
            </pre>
          </section>
        </div>
      ) : null}
    </div>
  );
}
