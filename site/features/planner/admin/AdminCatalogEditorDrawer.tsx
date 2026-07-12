"use client";

import { CaretDown as ChevronDown, CaretUp as ChevronUp, CircleNotch as Loader2, FloppyDisk as Save, X } from "@phosphor-icons/react";

import {
  AdminCheckbox,
  AdminField,
  AdminFieldGroup,
  AdminNumberInput,
  AdminSelect,
  AdminTextarea,
  AdminTextInput,
} from "./AdminFormFields";
import {
  CONFIGURATOR_CATEGORIES,
  MESH_TYPES,
  STANDARD_CATEGORIES,
  type ConfiguratorDraft,
  type ConfiguratorJsonErrors,
  type EditorMode,
  type StandardDraft,
} from "./adminCatalogManagerUtils";
import { WorkstationFamilyAuthorFields } from "./workstation/WorkstationFamilyAuthorFields";

function JsonFieldMessage({ error }: { error?: string }) {
  if (!error) {
    return <span className="text-xs text-soft">Valid JSON.</span>;
  }

  return (
    <span className="text-xs text-danger" role="alert">
      {error}
    </span>
  );
}

function StandardCatalogForm({
  draft,
  onChange,
  readOnly,
}: {
  draft: StandardDraft;
  onChange: (next: StandardDraft) => void;
  readOnly?: boolean;
}) {
  const set = <K extends keyof StandardDraft>(key: K, value: StandardDraft[K]) =>
    onChange({ ...draft, [key]: value });

  return (
    <div className="space-y-4">
      <AdminFieldGroup title="Identity">
        <AdminField label="Name *">
          <AdminTextInput
            value={draft.name}
            disabled={readOnly}
            onChange={(event) => set("name", event.target.value)}
            placeholder="Linear workstation 4-seat"
          />
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Category *">
            <AdminSelect
              value={draft.category}
              disabled={readOnly}
              onChange={(event) => set("category", event.target.value)}
            >
              {STANDARD_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Subcategory / shape">
            <AdminTextInput
              value={draft.subcategory}
              disabled={readOnly}
              onChange={(event) => set("subcategory", event.target.value)}
              placeholder="straight-bench"
            />
          </AdminField>
        </div>
        <AdminField label="Description">
          <AdminTextarea
            value={draft.description}
            disabled={readOnly}
            onChange={(event) => set("description", event.target.value)}
            rows={3}
            className="font-sans text-sm"
          />
        </AdminField>
      </AdminFieldGroup>

      <AdminFieldGroup title="Footprint (mm)">
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminField label="Width *">
            <AdminNumberInput
              value={draft.width_mm}
              disabled={readOnly}
              min={1}
              onChange={(event) => set("width_mm", event.target.value)}
            />
          </AdminField>
          <AdminField label="Depth *">
            <AdminNumberInput
              value={draft.depth_mm}
              disabled={readOnly}
              min={1}
              onChange={(event) => set("depth_mm", event.target.value)}
            />
          </AdminField>
          <AdminField label="Height *">
            <AdminNumberInput
              value={draft.height_mm}
              disabled={readOnly}
              min={1}
              onChange={(event) => set("height_mm", event.target.value)}
            />
          </AdminField>
        </div>
      </AdminFieldGroup>

      <AdminFieldGroup title="Commerce & render">
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Price (INR)">
            <AdminNumberInput
              value={draft.price}
              disabled={readOnly}
              min={0}
              onChange={(event) => set("price", event.target.value)}
            />
          </AdminField>
          <AdminField label="Mesh type">
            <AdminSelect
              value={draft.mesh_type}
              disabled={readOnly}
              onChange={(event) => set("mesh_type", event.target.value)}
            >
              {MESH_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
        </div>
        <AdminField label="Image URL">
          <AdminTextInput
            value={draft.image_url}
            disabled={readOnly}
            onChange={(event) => set("image_url", event.target.value)}
            placeholder="https://..."
          />
        </AdminField>
        <AdminCheckbox
          label="Visible in planner catalog"
          checked={draft.visible}
          disabled={readOnly}
          onChange={(visible) => set("visible", visible)}
        />
      </AdminFieldGroup>
    </div>
  );
}

function ConfiguratorCatalogForm({
  draft,
  onChange,
  readOnly,
  showAdvancedJson,
  onToggleAdvancedJson,
  jsonErrors,
}: {
  draft: ConfiguratorDraft;
  onChange: (next: ConfiguratorDraft) => void;
  readOnly?: boolean;
  showAdvancedJson: boolean;
  onToggleAdvancedJson: () => void;
  jsonErrors: ConfiguratorJsonErrors;
}) {
  const set = <K extends keyof ConfiguratorDraft>(key: K, value: ConfiguratorDraft[K]) =>
    onChange({ ...draft, [key]: value });
  const jsonIssueCount = Object.keys(jsonErrors).length;

  return (
    <div className="space-y-4">
      <AdminFieldGroup title="Identity">
        <AdminField label="Name *">
          <AdminTextInput
            value={draft.name}
            disabled={readOnly}
            onChange={(event) => set("name", event.target.value)}
          />
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Slug" hint="Auto-generated from name if empty">
            <AdminTextInput
              value={draft.slug}
              disabled={readOnly}
              onChange={(event) => set("slug", event.target.value)}
            />
          </AdminField>
          <AdminField label="Category *">
            <AdminSelect
              value={draft.category}
              disabled={readOnly}
              onChange={(event) => set("category", event.target.value)}
            >
              {CONFIGURATOR_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Family">
            <AdminTextInput
              value={draft.family}
              disabled={readOnly}
              onChange={(event) => set("family", event.target.value)}
            />
          </AdminField>
          <AdminField label="Brand name">
            <AdminTextInput
              value={draft.brand_name}
              disabled={readOnly}
              onChange={(event) => set("brand_name", event.target.value)}
            />
          </AdminField>
        </div>
        <AdminField label="Description">
          <AdminTextarea
            value={draft.description}
            disabled={readOnly}
            onChange={(event) => set("description", event.target.value)}
            rows={3}
            className="font-sans text-sm"
          />
        </AdminField>
      </AdminFieldGroup>

      <AdminFieldGroup title="Sizing model">
        <AdminField label="Sizing type *">
          <AdminSelect
            value={draft.sizing_type}
            disabled={readOnly}
            onChange={(event) =>
              set("sizing_type", event.target.value as ConfiguratorDraft["sizing_type"])
            }
          >
            <option value="parametric">parametric (workstation spec)</option>
            <option value="discrete">discrete (size options list)</option>
            <option value="fixed">fixed (single footprint)</option>
          </AdminSelect>
        </AdminField>

        <div className="rounded-lg border border-soft bg-panel p-3">
          <div className="flex-wrap items-start gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-strong">Advanced JSON sizing data</p>
              <p className="text-xs text-muted">
                Raw configurator payloads stay collapsed until you need to edit workstation,
                size option, or footprint JSON directly.
              </p>
            </div>
            <button
              type="button"
              className="btn-outline inline-flex gap-2 px-3 py-2 text-sm"
              onClick={onToggleAdvancedJson}
              aria-expanded={showAdvancedJson}
            >
              {showAdvancedJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAdvancedJson ? "Hide JSON" : "Show JSON"}
            </button>
          </div>
          <p className={`mt-2 text-xs ${jsonIssueCount ? "text-danger" : "text-soft"}`}>
            {jsonIssueCount
              ? `${jsonIssueCount} JSON field${jsonIssueCount === 1 ? "" : "s"} need attention before save.`
              : "JSON validates as you type before save."}
          </p>
        </div>

        {draft.sizing_type === "parametric" ? (
          <WorkstationFamilyAuthorFields
            workstationJson={draft.workstationJson}
            readOnly={readOnly}
            onWorkstationJsonChange={(next) => set("workstationJson", next)}
          />
        ) : null}

        {showAdvancedJson ? (
          <div className="space-y-3">
            {draft.sizing_type === "parametric" ? (
              <AdminField
                label="Workstation JSON (raw)"
                hint="Advanced override — structured fields above are preferred"
              >
                <AdminTextarea
                  value={draft.workstationJson}
                  disabled={readOnly}
                  onChange={(event) => set("workstationJson", event.target.value)}
                  rows={14}
                />
                <JsonFieldMessage error={jsonErrors.workstationJson} />
              </AdminField>
            ) : null}

            {draft.sizing_type === "discrete" ? (
              <AdminField
                label="Size options JSON *"
                hint='[{ "sku", "label", "dim": { "L", "D", "H?" } }]'
              >
                <AdminTextarea
                  value={draft.sizeOptionsJson}
                  disabled={readOnly}
                  onChange={(event) => set("sizeOptionsJson", event.target.value)}
                  rows={12}
                />
                <JsonFieldMessage error={jsonErrors.sizeOptionsJson} />
              </AdminField>
            ) : null}

            {draft.sizing_type === "fixed" ? (
              <AdminField
                label="Default footprint JSON *"
                hint='{ "L", "D", "H?" } in millimetres'
              >
                <AdminTextarea
                  value={draft.defaultFootprintJson}
                  disabled={readOnly}
                  onChange={(event) => set("defaultFootprintJson", event.target.value)}
                  rows={6}
                />
                <JsonFieldMessage error={jsonErrors.defaultFootprintJson} />
              </AdminField>
            ) : null}

            <AdminField label="Derived rules JSON (optional)" hint="Screen/modesty offsets">
              <AdminTextarea
                value={draft.derivedRulesJson}
                disabled={readOnly}
                onChange={(event) => set("derivedRulesJson", event.target.value)}
                rows={5}
              />
              <JsonFieldMessage error={jsonErrors.derivedRulesJson} />
            </AdminField>
          </div>
        ) : null}
      </AdminFieldGroup>

      <AdminFieldGroup title="Assets">
        <AdminField label="Materials" hint="Comma-separated">
          <AdminTextInput
            value={draft.materials}
            disabled={readOnly}
            onChange={(event) => set("materials", event.target.value)}
          />
        </AdminField>
        <AdminField label="Thumbnail URL">
          <AdminTextInput
            value={draft.thumbnail_url}
            disabled={readOnly}
            onChange={(event) => set("thumbnail_url", event.target.value)}
          />
        </AdminField>
        <AdminField
          label="3D model URL (system-generated only)"
          hint="catalog-assets/generated/* from extrude/modular export — designer static GLB not allowed"
        >
          <AdminTextInput
            value={draft.model_3d_url}
            disabled={readOnly}
            onChange={(event) => set("model_3d_url", event.target.value)}
            placeholder="…/catalog-assets/generated/….glb"
          />
        </AdminField>
        <AdminCheckbox
          label="Active in configurator"
          checked={draft.active}
          disabled={readOnly}
          onChange={(active) => set("active", active)}
        />
      </AdminFieldGroup>
    </div>
  );
}

type Props = {
  editorMode: EditorMode;
  isStandard: boolean;
  readOnly: boolean;
  saving: boolean;
  standardDraft: StandardDraft;
  configuratorDraft: ConfiguratorDraft;
  configuratorJsonErrors: ConfiguratorJsonErrors;
  showAdvancedJson: boolean;
  onToggleAdvancedJson: () => void;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  onStandardDraftChange: (next: StandardDraft) => void;
  onConfiguratorDraftChange: (next: ConfiguratorDraft) => void;
};

export function AdminCatalogEditorDrawer({
  editorMode,
  isStandard,
  readOnly,
  saving,
  standardDraft,
  configuratorDraft,
  configuratorJsonErrors,
  showAdvancedJson,
  onToggleAdvancedJson,
  onClose,
  onSave,
  onStandardDraftChange,
  onConfiguratorDraftChange,
}: Props) {
  if (!editorMode) return null;

  return (
    <div className="admin-drawer-backdrop" role="presentation">
      <div
        className="admin-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={editorMode === "create" ? "Create catalog item" : "Edit catalog item"}
      >
        <header className="admin-drawer__header">
          <h2 className="admin-drawer__title">
            {editorMode === "create" ? "New catalog item" : "Edit catalog item"}
          </h2>
          <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </header>
        <div className="admin-drawer__body">
          {isStandard ? (
            <StandardCatalogForm
              draft={standardDraft}
              onChange={onStandardDraftChange}
              readOnly={readOnly}
            />
          ) : (
            <ConfiguratorCatalogForm
              draft={configuratorDraft}
              onChange={onConfiguratorDraftChange}
              readOnly={readOnly}
              showAdvancedJson={showAdvancedJson}
              onToggleAdvancedJson={onToggleAdvancedJson}
              jsonErrors={configuratorJsonErrors}
            />
          )}
        </div>
        <footer className="admin-drawer__footer">
          <button type="button" className="btn-outline px-4 py-2 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary inline-flex gap-2 px-4 py-2 text-sm"
            disabled={readOnly || saving}
            onClick={() => void onSave()}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {editorMode === "create" ? "Create" : "Save changes"}
          </button>
        </footer>
      </div>
    </div>
  );
}
