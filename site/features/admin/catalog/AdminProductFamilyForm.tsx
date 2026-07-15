"use client";

/**
 * Minimal Admin family authoring form (Phase 3 residual).
 * Existing admin CSS only. Uses pure contract + persistence helpers.
 */

import { useCallback, useState } from "react";
import {
  PRODUCT_FAMILY_V1_FIXTURE,
  buildDraftFamilyFromForm,
  previewFamilyConfiguration,
  type ProductFamilyV1,
} from "@/features/shared/catalog/productFamilyContract";
import {
  loadProductFamilyFromSerialized,
  planFamilyVersionReplacement,
  serializeProductFamily,
} from "@/features/shared/catalog/productFamilyPersistence";

type Props = {
  readonly initialFamily?: ProductFamilyV1;
};

export function AdminProductFamilyForm({
  initialFamily = PRODUCT_FAMILY_V1_FIXTURE,
}: Props) {
  const [family, setFamily] = useState(initialFamily);
  const [name, setName] = useState(initialFamily.name);
  const [serialized, setSerialized] = useState(() =>
    serializeProductFamily(initialFamily),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);

  const version = family.versions[0];
  const selection = ["size-1200", "finish-oak"];

  const save = useCallback(() => {
    const next = buildDraftFamilyFromForm({
      familyId: family.familyId,
      familySlug: family.familySlug,
      name,
      versionId: version?.versionId ?? "draft-1",
      optionGroups: version?.optionGroups ?? [],
      compatibilityRules: version?.compatibilityRules ?? [],
    });
    const raw = serializeProductFamily(next);
    setSerialized(raw);
    setFamily(loadProductFamilyFromSerialized(raw));
    setMessage("Family saved (in-memory round-trip). Reload preserves version + options.");
  }, [family.familyId, family.familySlug, name, version]);

  const reload = useCallback(() => {
    const loaded = loadProductFamilyFromSerialized(serialized);
    setFamily(loaded);
    setName(loaded.name);
    setMessage(`Reloaded family ${loaded.familySlug} version ${loaded.versions[0]?.versionId}`);
  }, [serialized]);

  const preview = useCallback(() => {
    if (!version) return;
    const result = previewFamilyConfiguration(family, version.versionId, selection);
    if (!result.ok) {
      setPreviewText(result.formattedErrors.join("\n"));
      return;
    }
    const p = result.preview;
    setPreviewText(
      [
        `2D: ${p.identity2d.widthMm}×${p.identity2d.depthMm} mm (${p.identity2d.symbolKey})`,
        `3D: ${p.identity3d.meshKeys.join(", ")}`,
        `BOQ: ${p.identityBoq.lineIdentities.join(", ")}`,
        `Fingerprint: ${p.selectionFingerprint}`,
      ].join("\n"),
    );
  }, [family, selection, version]);

  const migrate = useCallback(() => {
    if (!version) return;
    const plan = planFamilyVersionReplacement({
      family,
      nextVersion: {
        ...version,
        versionId: "v2",
        status: "released",
      },
      decision: "keep-both",
    });
    setMessage(plan.message);
    if (plan.allowed && plan.nextFamily) setFamily(plan.nextFamily);
  }, [family, version]);

  return (
    <div className="admin-page" data-testid="admin-product-family-form">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Catalog · families</p>
          <h1 className="admin-page__title">Product family</h1>
          <p className="admin-page__copy">
            Author family identity and preview a configuration before release.
          </p>
        </div>
      </header>
      <div className="admin-panel">
        <div className="admin-panel__header">
          <code>{family.familySlug}</code> · <code>{family.familyId}</code>
        </div>
        <div className="admin-panel__body admin-stack">
          <label className="admin-field">
            <span className="admin-field__label">Display name</span>
            <input
              className="admin-field__control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="admin-family-name"
            />
          </label>
          <p className="admin-page__meta" data-testid="admin-family-version">
            Version: <code>{version?.versionId}</code> · status{" "}
            <span className="admin-badge">{version?.status}</span>
          </p>
          <div className="admin-actions-row">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={save}
              data-testid="admin-family-save"
            >
              Save
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={reload}
              data-testid="admin-family-reload"
            >
              Reload
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={preview}
              data-testid="admin-family-preview"
            >
              Preview 2D / 3D / BOQ
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={migrate}
              data-testid="admin-family-migrate"
            >
              Migration: keep-both v2
            </button>
          </div>
          {message ? (
            <p className="admin-page__meta" role="status" data-testid="admin-family-message">
              {message}
            </p>
          ) : null}
          {previewText ? (
            <pre
              className="admin-page__meta admin-preformatted"
              data-testid="admin-family-preview-result"
            >
              {previewText}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  );
}
