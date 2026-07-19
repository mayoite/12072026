"use client";

import { ParametricProductEditor } from "@/features/admin/svg-editor/parametric/ParametricProductEditor";
import type { DeskAssemblyDisplay } from "@/features/admin/svg-editor/parametric/deskAssemblyAuthoringDefinition";
import { isDeskAssemblyFactorySlug } from "@/features/admin/svg-editor/parametric/deskAssemblyFactoryIdentity";
import AdminSvgEditorListView, {
  type AdminSvgEditorListViewProps,
} from "@/features/admin/svg-editor/views/AdminSvgEditorListView";

export type AdminProductStudioMode =
  | { readonly kind: "inventory" }
  | {
      readonly kind: "factory";
      readonly editSlug?: string;
      readonly initialDisplay?: DeskAssemblyDisplay;
    };

export type AdminProductStudioViewProps = AdminSvgEditorListViewProps & {
  readonly mode: AdminProductStudioMode;
};

/**
 * One Product Studio page: inventory list OR desk-assembly factory.
 * Deep links: ?new=desk-assembly | ?edit=<slug>
 */
export function AdminProductStudioView({
  mode,
  ...listProps
}: AdminProductStudioViewProps) {
  if (mode.kind === "factory") {
    return (
      <ParametricProductEditor
        initialType="desk-assembly"
        initialEditSlug={mode.editSlug}
        initialDisplay={mode.initialDisplay}
      />
    );
  }
  return <AdminSvgEditorListView {...listProps} />;
}

/** Parse one-page studio query from /admin/svg-editor searchParams. */
export function parseAdminProductStudioMode(input: {
  readonly new?: string | string[] | undefined;
  readonly edit?: string | string[] | undefined;
}): AdminProductStudioMode {
  const editRaw = Array.isArray(input.edit) ? input.edit[0] : input.edit;
  const newRaw = Array.isArray(input.new) ? input.new[0] : input.new;
  const edit = typeof editRaw === "string" ? editRaw.trim() : "";
  if (edit.length > 0 && isDeskAssemblyFactorySlug(edit)) {
    return { kind: "factory", editSlug: edit };
  }
  if (
    typeof newRaw === "string" &&
    newRaw.trim().toLowerCase() === "desk-assembly"
  ) {
    return { kind: "factory" };
  }
  return { kind: "inventory" };
}
