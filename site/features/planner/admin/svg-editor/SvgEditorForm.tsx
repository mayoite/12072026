/**
 * No-code SVG editor form (A4).
 *
 * Renders the field cartography (`SVG_EDITOR_FIELDS`, filtered by variant) as
 * explicit controls bound to `SvgEditorFormState`. Validation issues from
 * `previewSvgEditorAction` are indexed by path and shown inline next to the
 * offending control; issues that match no visible field surface in a single
 * summary alert so nothing is lost.
 *
 * No Puck. No free-text JSON. No hex.
 */

"use client";

import type { BlockDescriptorVariant } from "@/features/planner/project/catalog/svg/svgTypes";
import {
  fieldsForVariant,
  SVG_EDITOR_FIELD_GROUP_LABEL,
  type SvgEditorFieldGroup,
  type SvgEditorFieldMeta,
} from "./svgEditorFormModel";
import type {
  SvgEditorFormState,
  FieldIssue,
  FormTokenRow,
  FormBlock,
  FormMountingPoint,
  FormRovingFocus,
  FormParameter,
} from "./svgEditorFormState";
import { TextControl } from "./form-controls/TextControl";
import { NumberStepperControl } from "./form-controls/NumberStepperControl";
import { SelectControl } from "./form-controls/SelectControl";
import { MultiSelectControl } from "./form-controls/MultiSelectControl";
import { TokenRowsControl } from "./form-controls/TokenRowsControl";
import { StringListControl } from "./form-controls/StringListControl";
import { ObjectArrayControl } from "./form-controls/ObjectArrayControl";

export interface SvgEditorFormProps {
  readonly fields: readonly SvgEditorFieldMeta[];
  readonly state: SvgEditorFormState;
  readonly variant: BlockDescriptorVariant;
  readonly issues: readonly FieldIssue[];
  readonly onChange: (next: SvgEditorFormState) => void;
}

type Patch = Partial<SvgEditorFormState>;

/** Read the scalar string a text/select control shows for a given path. */
function readText(state: SvgEditorFormState, path: string): string {
  switch (path) {
    case "slug":
      return state.slug;
    case "sku":
      return state.sku;
    case "sourceProvenance":
      return state.sourceProvenance;
    case "createdBy":
      return state.createdBy;
    case "variant":
      return state.variant;
    case "configurable.sizingType":
      return state.configurableSizingType;
    case "assets.glbUrl":
      return state.assetsGlbUrl;
    default:
      return "";
  }
}

/** Apply a text/select change for a scalar path. */
function patchText(path: string, next: string): Patch {
  switch (path) {
    case "slug":
      return { slug: next };
    case "sku":
      return { sku: next };
    case "sourceProvenance":
      return { sourceProvenance: next as SvgEditorFormState["sourceProvenance"] };
    case "createdBy":
      return { createdBy: next };
    case "variant":
      return { variant: next as BlockDescriptorVariant };
    case "configurable.sizingType":
      return {
        configurableSizingType: next as SvgEditorFormState["configurableSizingType"],
      };
    case "assets.glbUrl":
      return { assetsGlbUrl: next };
    default:
      return {};
  }
}

/** Read the numeric value a stepper shows for a given geometry/viewBox path. */
function readNumber(state: SvgEditorFormState, path: string): number {
  switch (path) {
    case "geometry.widthMm":
      return state.geometry.widthMm;
    case "geometry.depthMm":
      return state.geometry.depthMm;
    case "geometry.heightMm":
      return state.geometry.heightMm;
    case "geometry.seatHeightMm":
      return state.geometry.seatHeightMm ?? 0;
    case "geometry.weightKg":
      return state.geometry.weightKg ?? 0;
    case "viewBox.x":
      return state.viewBox.x;
    case "viewBox.y":
      return state.viewBox.y;
    case "viewBox.width":
      return state.viewBox.width;
    case "viewBox.height":
      return state.viewBox.height;
    default:
      return 0;
  }
}

function patchNumber(state: SvgEditorFormState, path: string, next: number): Patch {
  switch (path) {
    case "geometry.widthMm":
      return { geometry: { ...state.geometry, widthMm: next } };
    case "geometry.depthMm":
      return { geometry: { ...state.geometry, depthMm: next } };
    case "geometry.heightMm":
      return { geometry: { ...state.geometry, heightMm: next } };
    case "geometry.seatHeightMm":
      return { geometry: { ...state.geometry, seatHeightMm: next } };
    case "geometry.weightKg":
      return { geometry: { ...state.geometry, weightKg: next } };
    case "viewBox.x":
      return { viewBox: { ...state.viewBox, x: next } };
    case "viewBox.y":
      return { viewBox: { ...state.viewBox, y: next } };
    case "viewBox.width":
      return { viewBox: { ...state.viewBox, width: next } };
    case "viewBox.height":
      return { viewBox: { ...state.viewBox, height: next } };
    default:
      return {};
  }
}

export function SvgEditorForm({
  fields,
  state,
  variant,
  issues,
  onChange,
}: SvgEditorFormProps) {
  const visible = fieldsForVariant(variant, fields);

  const issueByPath = new Map<string, string>();
  const summaryIssues: Array<FieldIssue & { targetId?: string }> = [];
  for (const issue of issues) {
    // Match a field whose path is a prefix of the issue path (e.g. issue
    // "themeTokens.--fill-primary" → field "themeTokens").
    const owner = visible.find(
      (field) => issue.path === field.path || issue.path.startsWith(`${field.path}.`),
    );
    if (owner) {
      if (!issueByPath.has(owner.path)) issueByPath.set(owner.path, issue.message);
      summaryIssues.push({ ...issue, targetId: `svgfield-${owner.path}` });
    } else {
      summaryIssues.push(issue);
    }
  }

  const apply = (patch: Patch) => onChange({ ...state, ...patch });

  const groupOrder: readonly SvgEditorFieldGroup[] = [
    "identity",
    "geometry",
    "assets",
    "availability",
    "configuration",
    "commercial",
  ];
  const grouped = groupOrder
    .map((group) => ({
      group,
      fields: visible.filter((field) => field.group === group),
    }))
    .filter((entry) => entry.fields.length > 0);

  const renderField = (field: SvgEditorFieldMeta) => {
        const id = `svgfield-${field.path}`;
        const issue = issueByPath.get(field.path);
        return (
          <div className="admin-field" key={field.path} data-field={field.path} data-group={field.group}>
            <label className="admin-field__label" htmlFor={id}>
              {field.label}
              {field.optional ? null : <span aria-hidden="true"> *</span>}
              {field.unit ? <span className="admin-field__unit"> ({field.unit})</span> : null}
            </label>

            {field.kind === "text" ? (
              <TextControl
                id={id}
                meta={field}
                value={readText(state, field.path)}
                onChange={(next) => apply(patchText(field.path, next))}
              />
            ) : null}

            {field.kind === "number" ? (
              <NumberStepperControl
                id={id}
                meta={field}
                value={readNumber(state, field.path)}
                onChange={(next) => apply(patchNumber(state, field.path, next))}
              />
            ) : null}

            {field.kind === "select" ? (
              <SelectControl
                id={id}
                options={field.options ?? []}
                value={readText(state, field.path)}
                onChange={(next) => apply(patchText(field.path, next))}
              />
            ) : null}

            {field.kind === "multiselect" && field.path === "mounting" ? (
              <MultiSelectControl
                id={id}
                options={field.options ?? []}
                value={state.mounting}
                onChange={(next) =>
                  apply({ mounting: next as SvgEditorFormState["mounting"] })
                }
              />
            ) : null}

            {field.kind === "multiselect" &&
            field.path === "liveAnnouncementCategories" ? (
              <MultiSelectControl
                id={id}
                options={field.options ?? []}
                value={state.liveAnnouncementCategories}
                onChange={(next) =>
                  apply({
                    liveAnnouncementCategories:
                      next as SvgEditorFormState["liveAnnouncementCategories"],
                  })
                }
              />
            ) : null}

            {field.kind === "tokenRows" ? (
              <TokenRowsControl
                id={id}
                meta={field}
                value={state.themeTokens}
                onChange={(next: FormTokenRow[]) => apply({ themeTokens: next })}
              />
            ) : null}

            {field.kind === "stringList" ? (
              <StringListControl
                id={id}
                value={state.configurableSizeOptions}
                placeholder={field.placeholder}
                onChange={(next) => apply({ configurableSizeOptions: next })}
              />
            ) : null}

            {field.kind === "objectArray" && field.path === "rovingFocus" ? (
              <ObjectArrayControl<FormRovingFocus>
                id={id}
                itemFields={field.itemFields ?? []}
                value={state.rovingFocus}
                onChange={(next) => apply({ rovingFocus: next })}
              />
            ) : null}

            {field.kind === "objectArray" && field.path === "mountingPoints" ? (
              <ObjectArrayControl<FormMountingPoint>
                id={id}
                itemFields={field.itemFields ?? []}
                value={state.mountingPoints}
                onChange={(next) => apply({ mountingPoints: next })}
              />
            ) : null}

            {field.kind === "objectArray" && field.path === "blocks" ? (
              <ObjectArrayControl<FormBlock>
                id={id}
                itemFields={field.itemFields ?? []}
                value={state.blocks}
                onChange={(next) => apply({ blocks: next })}
              />
            ) : null}

            {field.kind === "objectArray" &&
            field.path === "parametric.parameterSchema" ? (
              <ObjectArrayControl<FormParameter>
                id={id}
                itemFields={field.itemFields ?? []}
                value={state.parameterSchema}
                onChange={(next) => apply({ parameterSchema: next })}
              />
            ) : null}

            {field.help ? <p className="admin-field__help">{field.help}</p> : null}
            {issue ? (
              <p className="admin-field__error" role="alert">
                {issue}
              </p>
            ) : null}
          </div>
        );
  };

  return (
    <div className="admin-svg-form" data-testid="admin-svg-form">
      {summaryIssues.length > 0 ? (
        <div className="admin-alert admin-alert--warn" role="alert" aria-label="Validation errors">
          <strong>
            Fix {summaryIssues.length} validation{" "}
            {summaryIssues.length === 1 ? "error" : "errors"} before publishing:
          </strong>
          <ul>
            {summaryIssues.map((issue, index) => (
              <li key={`${issue.path}-${index}`}>
                {issue.targetId ? (
                  <a href={`#${issue.targetId}`}>{issue.message}</a>
                ) : (
                  <>
                    {issue.path ? <code>{issue.path}</code> : null} {issue.message}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {grouped.map(({ group, fields: groupFields }) => (
        <section
          key={group}
          className="admin-panel"
          data-testid={`admin-form-group-${group}`}
          aria-label={SVG_EDITOR_FIELD_GROUP_LABEL[group]}
        >
          <div className="admin-panel__header">{SVG_EDITOR_FIELD_GROUP_LABEL[group]}</div>
          <div className="admin-panel__body">{groupFields.map(renderField)}</div>
        </section>
      ))}
    </div>
  );
}

export default SvgEditorForm;
