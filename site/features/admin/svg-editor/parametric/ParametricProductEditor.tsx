"use client";

import { useState, useTransition } from "react";

import { phoneAuthoringBlockedMessage } from "@/features/admin/ui/adminMobileReview";
import { AdminSvgDockHost } from "@/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost";
import { ParametricEditorTopBar } from "./ParametricEditorTopBar";
import { ParametricPlanCanvas } from "./ParametricPlanCanvas";
import { ParametricPropertiesPanel } from "./ParametricPropertiesPanel";
import { ParametricPublishConfirmDialog } from "./ParametricPublishConfirmDialog";
import { ParametricStatusBar } from "./ParametricStatusBar";
import { ParametricToolRailAdapter } from "./ParametricToolRailAdapter";
import { publishParametricProductAction } from "./publishParametricProductAction";
import { useParametricProductEditor } from "./useParametricProductEditor";

export function ParametricProductEditor({
  initialType = "desk-assembly",
}: {
  readonly initialType?: string;
}) {
  const editor = useParametricProductEditor({ initialType });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const identity = editor.definition.identity.read(editor.display);
  const errors = editor.parse.ok ? [] : editor.parse.errors;
  const size = editor.preview
    ? `${editor.preview.widthMm} × ${editor.preview.depthMm} mm`
    : "Invalid configuration";

  return (
    <main className="parametric-editor-root" data-testid="parametric-product-editor">
      <div className="parametric-editor-unsupported" role="status">
        {phoneAuthoringBlockedMessage()}
      </div>
      <div className="parametric-editor-supported">
        <ParametricEditorTopBar
          title={identity.name}
          sku={identity.sku}
          productTypes={editor.productTypes}
          selectedType={editor.type}
          unit={editor.unit}
          canPublish={editor.parse.ok && !pending}
          status={
            <ParametricStatusBar
              parse={editor.parse}
              widthMm={editor.preview?.widthMm}
              depthMm={editor.preview?.depthMm}
            />
          }
          onTypeChange={editor.selectType}
          onUnitChange={editor.convertUnit}
          onPublish={() => setConfirmOpen(true)}
        />
        {editor.message ? (
          <p role="status" className="parametric-editor-message">
            {editor.message}
          </p>
        ) : null}
        <div className="parametric-editor-dock-area">
          <AdminSvgDockHost
            layoutMode="factory"
            factorySlots={{
              tools: (
                <ParametricToolRailAdapter
                  definition={editor.definition}
                  activeToolId={editor.selectedToolId}
                  onToolSelect={editor.selectTool}
                  onCommand={editor.requestViewportCommand}
                  onToggle={editor.toggleCanvasField}
                  onPartRoleFocus={(role) => {
                    const part = editor.preview?.parts.find(
                      (candidate) => candidate.role === role,
                    );
                    editor.focusPart(part?.id ?? null);
                  }}
                />
              ),
              properties: (
                <ParametricPropertiesPanel
                  definition={editor.definition}
                  display={editor.display}
                  unit={editor.unit}
                  errors={errors}
                  onFieldChange={editor.updateField}
                />
              ),
              canvas: (
                <ParametricPlanCanvas
                  key={editor.viewportCommand?.sequence ?? 0}
                  label={editor.definition.drawer.label}
                  capabilities={editor.definition.drawer.capabilities}
                  preview={editor.preview}
                  selectedPartId={editor.selectedPartId}
                  onPartSelect={editor.focusPart}
                  gridEnabled={editor.gridEnabled}
                  onGridChange={(enabled) => {
                    if (enabled !== editor.gridEnabled) {
                      editor.toggleCanvasField("grid");
                    }
                  }}
                />
              ),
            }}
          />
        </div>
      </div>
      <ParametricPublishConfirmDialog
        open={confirmOpen}
        identity={identity}
        summary={size}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (!editor.parse.ok) return;
          const fields = editor.parse.fields;
          startTransition(async () => {
            const result = await publishParametricProductAction(fields);
            setConfirmOpen(false);
            editor.setMessage(
              result.success ? `Published ${result.descriptor.slug}` : result.error,
            );
          });
        }}
      />
    </main>
  );
}
