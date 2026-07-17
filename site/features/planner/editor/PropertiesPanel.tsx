"use client";

import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  memo,
} from "react";
import type { CanvasSelection } from "./useWorkspaceCanvas";
import { entityCollectionLabel } from "./plannerHistoryLabels";
import type {
  PlannerEntityCollection,
  PlannerEntityMap,
} from "@/features/planner/model/actions/projectActions";
import type { PlannerDisplayUnit } from "@/features/planner/model/types";
import {
  formatAreaDisplay,
  formatFootprintDisplay,
  formatLengthDisplay,
  formatLengthInput,
  parseLengthInput,
} from "@/features/planner/model/units";
import { parseWorkstationConfigKey } from "@/features/planner/catalog/workstationSystemV0";
import {
  UNDERLAY_KNOWN_WIDTH_10M_MM,
  UNDERLAY_KNOWN_WIDTH_5M_MM,
} from "@/features/planner/lib/underlayCalibrate";
import styles from "./properties.module.css";

/**
 * Represents a selected entity in the workspace.
 * This is the minimal information needed to display and edit entity properties.
 */
export interface SelectedEntity {
  /** The collection type (e.g., 'walls', 'furniture', 'rooms') */
  collection: PlannerEntityCollection;
  /** The entity ID within the collection */
  id: string;
  /** The raw entity data */
  entity: PlannerEntityMap[PlannerEntityCollection];
}

/**
 * Properties panel state for controlled usage
 */
export interface PropertiesPanelState {
  /** Currently selected entity (null = nothing selected) */
  selectedEntity: SelectedEntity | null;
  /** Whether the panel is visible */
  isOpen: boolean;
}

/**
 * Callback types for entity actions
 */
export interface PropertiesPanelCallbacks {
  /** Called when an entity property is updated */
  onUpdateEntity?: (
    collection: PlannerEntityCollection,
    id: string,
    updates: Record<string, unknown>,
  ) => void;
  /** Called when delete is requested */
  onDeleteEntity?: (collection: PlannerEntityCollection, id: string) => void;
  /** Called when lock toggle is requested */
  onToggleLock?: (collection: PlannerEntityCollection, id: string) => void;
  /** Called when duplicate is requested */
  onDuplicateEntity?: (collection: PlannerEntityCollection, id: string) => void;
  /** Called when align is requested */
  onAlignEntities?: (axis: "x" | "y", anchor: "min" | "center" | "max") => void;
  /** Called when distribute is requested */
  onDistributeEntities?: (axis: "x" | "y") => void;
  /** Array selection into a row-major grid (columns + gap mm). */
  onArrayEntities?: (columns: number, gapMm: number) => void;
  /** Pack multi-select along axis with exact clear gap (mm). Furniture only. */
  onSpaceEntities?: (axis: "x" | "y", gapMm: number) => void;
  /** Calibrate underlay image width to known millimetres. */
  onCalibrateUnderlay?: (knownWidthMm: number) => void;
  /** Start two-click underlay scale calibration with a known segment length (mm). */
  onStartTwoPointCalibrate?: (knownLengthMm: number) => void;
  /** Cancel an in-progress two-click underlay calibration. */
  onCancelTwoPointCalibrate?: () => void;
  /** Called when user clicks outside to deselect */
  onDeselect?: () => void;
}

/**
 * PropertiesPanel - Right panel showing properties of selected entity
 *
 * Displays different property sets for different entity types:
 * - Walls: length, start, end, thickness
 * - Doors/Windows: position, width, swing direction
 * - Furniture: position, rotation, dimensions, catalog info
 * - Rooms: area, dimensions, floor
 */
export interface PropertiesPanelMultiSelection {
  type: Exclude<CanvasSelection["type"], "none">;
  count: number;
}

export interface PropertiesPanelProps {
  /** Selected entity to display */
  selectedEntity: SelectedEntity | null;
  /** When more than one entity is selected, show an honest multi-select state. */
  multiSelection?: PropertiesPanelMultiSelection | null;
  /** Action callbacks */
  callbacks?: PropertiesPanelCallbacks;
  /** Display unit for dimensions (document store stays mm). */
  displayUnit?: PlannerDisplayUnit;
  /** Canonical host-wall length for door/window offset editing. */
  hostWallLengthMm?: number;
  /**
   * Two-point underlay calibrate session phase.
   * When set, empty chrome explains pick progress.
   */
  underlayCalibratePhase?: "pick-a" | "pick-b" | null;
}

/**
 * Get entity type label for display
 */
function getEntityTypeLabel(collection: PlannerEntityCollection): string {
  const labels: Record<PlannerEntityCollection, string> = {
    walls: "Wall",
    rooms: "Room",
    doors: "Door",
    windows: "Window",
    furniture: "Furniture",
    stairs: "Stair",
    columns: "Column",
    guides: "Guide",
    measurements: "Measurement",
    annotations: "Annotation",
    textAnnotations: "Text",
    groups: "Group",
  };
  return labels[collection] || collection;
}

/**
 * Get entity name for display
 */
function getEntityDisplayName(entity: SelectedEntity["entity"]): string {
  if ("name" in entity && typeof entity.name === "string") {
    return entity.name;
  }
  if ("catalogId" in entity && typeof entity.catalogId === "string") {
    return entity.catalogId;
  }
  return entity.id.slice(0, 8);
}

/**
 * Calculate wall length from start/end points
 */
function calculateWallLength(
  start: { x: number; y: number },
  end: { x: number; y: number },
): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * PropertiesPanel Component
 */
export const PropertiesPanel = memo(function PropertiesPanel({
  selectedEntity,
  multiSelection = null,
  callbacks,
  displayUnit = "mm",
  hostWallLengthMm,
  underlayCalibratePhase = null,
}: PropertiesPanelProps) {
  const id = useId();
  const [knownDistanceDraft, setKnownDistanceDraft] = useState(() =>
    formatLengthInput(5000, displayUnit),
  );
  const [arrayGapDraft, setArrayGapDraft] = useState("200");
  const [exactGapDraft, setExactGapDraft] = useState("200");

  const resolveKnownLengthMm = useCallback((): number | null => {
    return parseLengthInput(knownDistanceDraft, displayUnit);
  }, [displayUnit, knownDistanceDraft]);

  const startTwoPointCalibrate = useCallback(() => {
    const known = resolveKnownLengthMm();
    if (known === null || known <= 0) return;
    callbacks?.onStartTwoPointCalibrate?.(known);
  }, [callbacks, resolveKnownLengthMm]);

  const isLocked = !!(
    selectedEntity &&
    typeof selectedEntity.entity === "object" &&
    selectedEntity.entity &&
    "locked" in selectedEntity.entity &&
    (selectedEntity.entity as { locked?: boolean }).locked === true
  );

  const commitOpeningOffset = useCallback(
    (raw: string) => {
      if (!selectedEntity || isLocked || !hostWallLengthMm) return false;
      const offsetMm = parseLengthInput(raw, displayUnit);
      if (offsetMm === null || offsetMm < 0 || offsetMm > hostWallLengthMm) {
        return false;
      }
      callbacks?.onUpdateEntity?.(
        selectedEntity.collection,
        selectedEntity.id,
        { position: offsetMm / hostWallLengthMm },
      );
      return true;
    },
    [callbacks, displayUnit, hostWallLengthMm, isLocked, selectedEntity],
  );
  // GS REC-01 contextual props; locked reject everywhere (command + ui) per task7. No explicit any.

  /**
   * Handle number input change (non-length fields: rotation, counts, plain numbers).
   */
  const commitNumberValue = useCallback(
    (raw: string, field: string, subField?: string) => {
      if (!selectedEntity || isLocked) return false;

      const value = Number(raw.trim());
      if (raw.trim() === "" || !Number.isFinite(value)) return false;

      let updates: Record<string, unknown>;
      if (subField) {
        const existingNested = selectedEntity.entity[
          field as keyof SelectedEntity["entity"]
        ] as unknown as Record<string, unknown> | undefined;
        updates = {
          [field]: {
            ...(existingNested || {}),
            [subField]: value,
          },
        };
      } else {
        updates = { [field]: value };
      }

      callbacks?.onUpdateEntity?.(
        selectedEntity.collection,
        selectedEntity.id,
        updates,
      );
      return true;
    },
    [selectedEntity, callbacks, isLocked],
  );

  const commitLengthValue = useCallback(
    (raw: string, field: string, subField?: string) => {
      if (!selectedEntity || isLocked) return false;

      const mm = parseLengthInput(raw, displayUnit);
      if (mm === null || !Number.isFinite(mm)) return false;

      let updates: Record<string, unknown>;
      if (subField) {
        const existingNested = selectedEntity.entity[
          field as keyof SelectedEntity["entity"]
        ] as unknown as Record<string, unknown> | undefined;
        updates = {
          [field]: {
            ...(existingNested || {}),
            [subField]: mm,
          },
        };
      } else {
        updates = { [field]: mm };
      }

      callbacks?.onUpdateEntity?.(
        selectedEntity.collection,
        selectedEntity.id,
        updates,
      );
      return true;
    },
    [selectedEntity, callbacks, isLocked, displayUnit],
  );

  /**
   * Handle select change
   */
  const handleSelectChange = useCallback(
    (field: string) => (event: ChangeEvent<HTMLSelectElement>) => {
      if (!selectedEntity || isLocked) return;

      callbacks?.onUpdateEntity?.(
        selectedEntity.collection,
        selectedEntity.id,
        {
          [field]: event.target.value,
        },
      );
    },
    [selectedEntity, callbacks, isLocked],
  );

  /**
   * Handle delete button click
   */
  const handleDelete = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!selectedEntity || isLocked) return; // locked reject
      callbacks?.onDeleteEntity?.(selectedEntity.collection, selectedEntity.id);
    },
    [selectedEntity, callbacks, isLocked],
  );

  /**
   * Handle duplicate button click
   */
  const handleDuplicate = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!selectedEntity || isLocked) return;
      callbacks?.onDuplicateEntity?.(selectedEntity.collection, selectedEntity.id);
    },
    [selectedEntity, callbacks, isLocked],
  );

  /**
   * Handle lock toggle click
   */
  const handleToggleLock = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!selectedEntity) return;
      callbacks?.onToggleLock?.(selectedEntity.collection, selectedEntity.id);
    },
    [selectedEntity, callbacks],
  );

  const fieldReadOnly = isLocked;

  /**
   * Render wall properties
   */
  const renderWallProperties = useCallback(
    (entity: SelectedEntity["entity"]) => {
      const wall = entity as {
        start: { x: number; y: number };
        end: { x: number; y: number };
        thickness: number;
        height: number;
      };
      const length = calculateWallLength(wall.start, wall.end);

      return (
        <>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Dimensions</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-length`}
                label="Length"
                value={formatLengthDisplay(length, displayUnit)}
                unit={displayUnit}
                readOnly
              />
              <PropertyField
                id={`${id}-thickness`}
                label="Thickness"
                value={formatLengthInput(wall.thickness, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "thickness")}
                readOnly={fieldReadOnly}
              />
              <PropertyField
                id={`${id}-height`}
                label="Height"
                value={formatLengthInput(wall.height, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "height")}
                readOnly={fieldReadOnly}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Start Point</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-startX`}
                label="X"
                value={formatLengthInput(wall.start.x, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "start", "x")}
                readOnly={fieldReadOnly}
              />
              <PropertyField
                id={`${id}-startY`}
                label="Y"
                value={formatLengthInput(wall.start.y, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "start", "y")}
                readOnly={fieldReadOnly}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>End Point</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-endX`}
                label="X"
                value={formatLengthInput(wall.end.x, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "end", "x")}
                readOnly={fieldReadOnly}
              />
              <PropertyField
                id={`${id}-endY`}
                label="Y"
                value={formatLengthInput(wall.end.y, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "end", "y")}
                readOnly={fieldReadOnly}
              />
            </div>
          </div>
        </>
      );
    },
    [id, displayUnit, commitLengthValue, fieldReadOnly],
  );

  /**
   * Render door properties
   */
  const renderDoorProperties = useCallback(
    (entity: SelectedEntity["entity"]) => {
      const door = entity as {
        position: number;
        width: number;
        height: number;
        type: string;
        swingDirection: string;
        flipSide: boolean;
      };

      return (
        <>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Dimensions</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-width`}
                label="Width"
                value={formatLengthInput(door.width, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "width")}
                readOnly={fieldReadOnly}
              />
              <PropertyField
                id={`${id}-height`}
                label="Height"
                value={formatLengthInput(door.height, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "height")}
                readOnly={fieldReadOnly}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Position</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-position`}
                label="Wall offset"
                value={formatLengthInput(
                  hostWallLengthMm ? door.position * hostWallLengthMm : door.position,
                  displayUnit,
                )}
                unit={displayUnit}
                onCommit={commitOpeningOffset}
                readOnly={fieldReadOnly}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Configuration</h4>
            <div className={styles.propertyGrid}>
              <PropertySelect
                id={`${id}-type`}
                label="Type"
                value={door.type}
                options={[
                  { value: "single", label: "Single" },
                  { value: "double", label: "Double" },
                  { value: "sliding", label: "Sliding" },
                  { value: "french", label: "French" },
                  { value: "pocket", label: "Pocket" },
                  { value: "bifold", label: "Bifold" },
                ]}
                onChange={handleSelectChange("type")}
              />
              <PropertySelect
                id={`${id}-swing`}
                label="Swing"
                value={door.swingDirection}
                options={[
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ]}
                onChange={handleSelectChange("swingDirection")}
              />
              <PropertyCheckbox
                id={`${id}-flip`}
                label="Flip Side"
                checked={door.flipSide}
                onChange={(checked) => {
                  if (selectedEntity) {
                    callbacks?.onUpdateEntity?.(
                      selectedEntity.collection,
                      selectedEntity.id,
                      {
                        flipSide: checked,
                      },
                    );
                  }
                }}
              />
            </div>
          </div>
        </>
      );
    },
    [
      id,
      displayUnit,
      commitLengthValue,
      handleSelectChange,
      selectedEntity,
      callbacks,
      fieldReadOnly,
      hostWallLengthMm,
      commitOpeningOffset,
    ],
  );

  /**
   * Render window properties
   */
  const renderWindowProperties = useCallback(
    (entity: SelectedEntity["entity"]) => {
      const window = entity as {
        position: number;
        width: number;
        height: number;
        sillHeight: number;
        type: string;
      };

      return (
        <>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Dimensions</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-width`}
                label="Width"
                value={formatLengthInput(window.width, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "width")}
                readOnly={fieldReadOnly}
              />
              <PropertyField
                id={`${id}-height`}
                label="Height"
                value={formatLengthInput(window.height, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "height")}
                readOnly={fieldReadOnly}
              />
              <PropertyField
                id={`${id}-sill`}
                label="Sill Height"
                value={formatLengthInput(window.sillHeight, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "sillHeight")}
                readOnly={fieldReadOnly}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Position</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-position`}
                label="Wall offset"
                value={formatLengthInput(
                  hostWallLengthMm ? window.position * hostWallLengthMm : window.position,
                  displayUnit,
                )}
                unit={displayUnit}
                onCommit={commitOpeningOffset}
                readOnly={fieldReadOnly}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Configuration</h4>
            <div className={styles.propertyGrid}>
              <PropertySelect
                id={`${id}-type`}
                label="Type"
                value={window.type}
                options={[
                  { value: "standard", label: "Standard" },
                  { value: "fixed", label: "Fixed" },
                  { value: "casement", label: "Casement" },
                  { value: "sliding", label: "Sliding" },
                  { value: "bay", label: "Bay" },
                ]}
                onChange={handleSelectChange("type")}
              />
            </div>
          </div>
        </>
      );
    },
    [
      id,
      displayUnit,
      commitLengthValue,
      handleSelectChange,
      fieldReadOnly,
      hostWallLengthMm,
      commitOpeningOffset,
    ],
  );

  /**
   * Render furniture properties
   */
  const renderFurnitureProperties = useCallback(
    (entity: SelectedEntity["entity"]) => {
      const furniture = entity as {
        position: { x: number; y: number };
        rotation: number;
        scale: { x: number; y: number; z: number };
        width?: number;
        depth?: number;
        height?: number;
        catalogId?: string;
        sourceSlug?: string;
        sourceSku?: string;
        locked?: boolean;
        color?: string;
        material?: string;
      };

      const workstationConfig =
        parseWorkstationConfigKey(furniture.catalogId ?? "") ??
        parseWorkstationConfigKey(furniture.sourceSlug ?? "");

      return (
        <>
          {workstationConfig ? (
            <div className={styles.propertyGroup}>
              <h4 className={styles.groupTitle}>Workstation (systems v0)</h4>
              <div className={styles.propertyGrid}>
                <PropertyField
                  id={`${id}-ws-shape`}
                  label="Shape"
                  value={
                    workstationConfig.shape === "l-shape" ? "L-shape" : "Linear"
                  }
                  readOnly
                />
                <PropertyField
                  id={`${id}-ws-size`}
                  label="Size"
                  value={formatFootprintDisplay(
                    workstationConfig.size.lengthMm,
                    workstationConfig.size.depthMm,
                    displayUnit,
                  )}
                  unit={displayUnit}
                  readOnly
                />
                <PropertyField
                  id={`${id}-ws-modules`}
                  label="Modules"
                  value={workstationConfig.modules.join(", ")}
                  readOnly
                />
              </div>
            </div>
          ) : null}
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Position</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-posX`}
                label="X"
                value={formatLengthInput(furniture.position.x, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "position", "x")}
                readOnly={fieldReadOnly}
              />
              <PropertyField
                id={`${id}-posY`}
                label="Y"
                value={formatLengthInput(furniture.position.y, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "position", "y")}
                readOnly={fieldReadOnly}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Transform</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-rotation`}
                label="Rotation"
                value={furniture.rotation}
                unit="°"
                onCommit={(value) => commitNumberValue(value, "rotation")}
                readOnly={fieldReadOnly}
                min={0}
                max={360}
              />
            </div>
          </div>
          {(furniture.width || furniture.depth || furniture.height) && (
            <div className={styles.propertyGroup}>
              <h4 className={styles.groupTitle}>Dimensions</h4>
              <div className={styles.propertyGrid}>
                {furniture.width && (
                  <PropertyField
                    id={`${id}-furnWidth`}
                    label="Width"
                    value={formatLengthInput(furniture.width, displayUnit)}
                    unit={displayUnit}
                    onCommit={(value) => commitLengthValue(value, "width")}
                    readOnly={fieldReadOnly}
                  />
                )}
                {furniture.depth && (
                  <PropertyField
                    id={`${id}-furnDepth`}
                    label="Depth"
                    value={formatLengthInput(furniture.depth, displayUnit)}
                    unit={displayUnit}
                    onCommit={(value) => commitLengthValue(value, "depth")}
                    readOnly={fieldReadOnly}
                  />
                )}
                {furniture.height && (
                  <PropertyField
                    id={`${id}-furnHeight`}
                    label="Height"
                    value={formatLengthInput(furniture.height, displayUnit)}
                    unit={displayUnit}
                    onCommit={(value) => commitLengthValue(value, "height")}
                    readOnly={fieldReadOnly}
                  />
                )}
              </div>
            </div>
          )}
          {(furniture.catalogId ||
            furniture.sourceSlug ||
            furniture.sourceSku) && (
            <div className={styles.propertyGroup}>
              <h4 className={styles.groupTitle}>Catalog Info</h4>
              <div className={styles.propertyGrid}>
                {furniture.catalogId && (
                  <PropertyField
                    id={`${id}-catalogId`}
                    label="Catalog ID"
                    value={furniture.catalogId}
                    readOnly
                  />
                )}
                {furniture.sourceSlug && (
                  <PropertyField
                    id={`${id}-sourceSlug`}
                    label="Slug"
                    value={furniture.sourceSlug}
                    readOnly
                  />
                )}
                {furniture.sourceSku && (
                  <PropertyField
                    id={`${id}-sourceSku`}
                    label="SKU"
                    value={furniture.sourceSku}
                    readOnly
                  />
                )}
              </div>
            </div>
          )}
          {(furniture.color || furniture.material) && (
            <div className={styles.propertyGroup}>
              <h4 className={styles.groupTitle}>Appearance</h4>
              <div className={styles.propertyGrid}>
                {furniture.color && (
                  <PropertyField
                    id={`${id}-color`}
                    label="Color"
                    value={furniture.color}
                    onCommit={(value) => {
                      if (!selectedEntity || isLocked) return;
                      callbacks?.onUpdateEntity?.(
                        selectedEntity.collection,
                        selectedEntity.id,
                        { color: value },
                      );
                    }}
                    readOnly={fieldReadOnly}
                  />
                )}
                {furniture.material && (
                  <PropertyField
                    id={`${id}-material`}
                    label="Material"
                    value={furniture.material}
                    onCommit={(value) => {
                      if (!selectedEntity || isLocked) return;
                      callbacks?.onUpdateEntity?.(
                        selectedEntity.collection,
                        selectedEntity.id,
                        { material: value },
                      );
                    }}
                    readOnly={fieldReadOnly}
                  />
                )}
              </div>
            </div>
          )}
        </>
      );
    },
    [
      id,
      displayUnit,
      commitLengthValue,
      commitNumberValue,
      selectedEntity,
      callbacks,
      isLocked,
      fieldReadOnly,
    ],
  );

  /**
   * Render room properties
   */
  const renderRoomProperties = useCallback(
    (entity: SelectedEntity["entity"]) => {
      const room = entity as {
        name: string;
        area: number;
        floorTexture?: string;
        roomType?: string;
        color?: string;
      };

      return (
        <>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>General</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-name`}
                label="Name"
                value={room.name}
                onCommit={(value) => {
                  if (!selectedEntity || isLocked) return;
                  callbacks?.onUpdateEntity?.(
                    selectedEntity.collection,
                    selectedEntity.id,
                    { name: value },
                  );
                }}
                readOnly={fieldReadOnly}
              />
              {room.roomType && (
                <PropertySelect
                  id={`${id}-roomType`}
                  label="Type"
                  value={room.roomType}
                  options={[
                    { value: "indoor", label: "Indoor" },
                    { value: "outdoor", label: "Outdoor" },
                    { value: "garage", label: "Garage" },
                    { value: "utility", label: "Utility" },
                  ]}
                  onChange={handleSelectChange("roomType")}
                />
              )}
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Floor</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-area`}
                label="Area"
                value={formatAreaDisplay(room.area, displayUnit)}
                readOnly
              />
              {room.floorTexture && (
                <PropertyField
                  id={`${id}-floorTexture`}
                  label="Texture"
                  value={room.floorTexture}
                  onCommit={(value) => {
                    if (!selectedEntity || isLocked) return;
                    callbacks?.onUpdateEntity?.(
                      selectedEntity.collection,
                      selectedEntity.id,
                      { floorTexture: value },
                    );
                  }}
                  readOnly={fieldReadOnly}
                />
              )}
              {room.color && (
                <PropertyField
                  id={`${id}-roomColor`}
                  label="Color"
                  value={room.color}
                  onCommit={(value) => {
                    if (!selectedEntity || isLocked) return;
                    callbacks?.onUpdateEntity?.(
                      selectedEntity.collection,
                      selectedEntity.id,
                      { color: value },
                    );
                  }}
                  readOnly={fieldReadOnly}
                />
              )}
            </div>
          </div>
        </>
      );
    },
    [id, displayUnit, handleSelectChange, selectedEntity, callbacks, isLocked, fieldReadOnly],
  );

  /**
   * Render properties based on entity type
   */
  const renderProperties = useMemo(() => {
    if (!selectedEntity) return null;

    const { collection, entity } = selectedEntity;

    switch (collection) {
      case "walls":
        return renderWallProperties(entity);
      case "doors":
        return renderDoorProperties(entity);
      case "windows":
        return renderWindowProperties(entity);
      case "furniture":
        return renderFurnitureProperties(entity);
      case "rooms":
        return renderRoomProperties(entity);
      default:
        // Generic fallback for unhandled entity types
        return (
          <div className={styles.propertyGroup}>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-id`}
                label="ID"
                value={selectedEntity.id}
                readOnly
              />
            </div>
          </div>
        );
    }
  }, [
    selectedEntity,
    renderWallProperties,
    renderDoorProperties,
    renderWindowProperties,
    renderFurnitureProperties,
    renderRoomProperties,
    id,
  ]);

  // Task 7: groups = transform | dimensions | placement | appearance | metadata | actions. Unit-aware numeric: commit/esc/reset/validation. Multi shared ops only. Locked reject (command layer).

  if (multiSelection && multiSelection.count > 1) {
    const typeLabel = entityCollectionLabel(
      multiSelection.type,
      multiSelection.count,
    );
    return (
      <div
        className={styles.panel}
        data-state="multi"
        data-entity={multiSelection.type}
        aria-label="Properties"
      >
        <div className={styles.emptyState} role="status">
          <div className={styles.emptyIcon} aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <rect x="13" y="3" width="8" height="8" rx="1" />
              <rect x="3" y="13" width="8" height="8" rx="1" />
              <rect x="13" y="13" width="8" height="8" rx="1" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>
            {multiSelection.count} {typeLabel} selected
          </h3>
          <p className={styles.emptyDescription}>
            Select a single item to edit position, size, and rotation.
          </p>

          <div className={styles.multiActions}>
            <span className={styles.multiActionLabel}>Align</span>
            <div className={styles.multiActionRow}>
              <button type="button" className={styles.multiActionBtn} onClick={() => callbacks?.onAlignEntities?.("x", "min")} title="Align left" aria-label="Align left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="3" x2="3" y2="21" /><rect x="7" y="5" width="8" height="6" /><rect x="7" y="13" width="14" height="6" /></svg>
              </button>
              <button type="button" className={styles.multiActionBtn} onClick={() => callbacks?.onAlignEntities?.("x", "center")} title="Align center X" aria-label="Align center X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="3" x2="12" y2="21" /><rect x="5" y="5" width="8" height="6" /><rect x="5" y="13" width="14" height="6" /></svg>
              </button>
              <button type="button" className={styles.multiActionBtn} onClick={() => callbacks?.onAlignEntities?.("x", "max")} title="Align right" aria-label="Align right">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="21" y1="3" x2="21" y2="21" /><rect x="9" y="5" width="8" height="6" /><rect x="3" y="13" width="14" height="6" /></svg>
              </button>
              <button type="button" className={styles.multiActionBtn} onClick={() => callbacks?.onAlignEntities?.("y", "min")} title="Align top" aria-label="Align top">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="3" x2="21" y2="3" /><rect x="5" y="7" width="6" height="8" /><rect x="13" y="7" width="6" height="14" /></svg>
              </button>
              <button type="button" className={styles.multiActionBtn} onClick={() => callbacks?.onAlignEntities?.("y", "center")} title="Align center Y" aria-label="Align center Y">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12" /><rect x="5" y="5" width="6" height="8" /><rect x="13" y="5" width="6" height="14" /></svg>
              </button>
              <button type="button" className={styles.multiActionBtn} onClick={() => callbacks?.onAlignEntities?.("y", "max")} title="Align bottom" aria-label="Align bottom">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="21" x2="21" y2="21" /><rect x="5" y="7" width="6" height="10" /><rect x="13" y="7" width="6" height="14" /></svg>
              </button>
            </div>

            <span className={styles.multiActionLabel}>Distribute</span>
            <div className={styles.multiActionRow}>
              <button type="button" className={styles.multiActionBtn} onClick={() => callbacks?.onDistributeEntities?.("x")} title="Distribute horizontally" aria-label="Distribute horizontally">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="4" height="18" /><rect x="17" y="3" width="4" height="18" /><line x1="10" y1="12" x2="14" y2="12" /><polyline points="12,10 14,12 12,14" /></svg>
              </button>
              <button type="button" className={styles.multiActionBtn} onClick={() => callbacks?.onDistributeEntities?.("y")} title="Distribute vertically" aria-label="Distribute vertically">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="4" /><rect x="3" y="17" width="18" height="4" /><line x1="12" y1="10" x2="12" y2="14" /><polyline points="10,12 12,14 14,12" /></svg>
              </button>
            </div>

            {multiSelection.type === "furniture" ? (
              <>
                <span className={styles.multiActionLabel}>Exact spacing (mm)</span>
                <label className={styles.multiActionLabel} htmlFor={`${id}-exact-gap`}>
                  Clear gap
                  <input
                    id={`${id}-exact-gap`}
                    className={styles.multiActionInput}
                    type="text"
                    inputMode="numeric"
                    value={exactGapDraft}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setExactGapDraft(event.target.value)
                    }
                    aria-label="Exact clear gap between selected furniture in millimetres"
                  />
                </label>
                <div className={styles.multiActionRow}>
                  <button
                    type="button"
                    className={styles.multiActionBtnWide}
                    onClick={() => {
                      const gap = Number.parseFloat(exactGapDraft);
                      if (!Number.isFinite(gap) || gap < 0) return;
                      callbacks?.onSpaceEntities?.("x", gap);
                    }}
                    title="Pack selection left-to-right with exact gap"
                    aria-label="Apply exact horizontal spacing"
                  >
                    Space X
                  </button>
                  <button
                    type="button"
                    className={styles.multiActionBtnWide}
                    onClick={() => {
                      const gap = Number.parseFloat(exactGapDraft);
                      if (!Number.isFinite(gap) || gap < 0) return;
                      callbacks?.onSpaceEntities?.("y", gap);
                    }}
                    title="Pack selection top-to-bottom with exact gap"
                    aria-label="Apply exact vertical spacing"
                  >
                    Space Y
                  </button>
                </div>

                <span className={styles.multiActionLabel}>Array / grid</span>
                <label className={styles.multiActionLabel} htmlFor={`${id}-array-gap`}>
                  Array gap
                  <input
                    id={`${id}-array-gap`}
                    className={styles.multiActionInput}
                    type="text"
                    inputMode="numeric"
                    value={arrayGapDraft}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setArrayGapDraft(event.target.value)
                    }
                    aria-label="Array clear gap in millimetres"
                  />
                </label>
                <div className={styles.multiActionRow}>
                  <button
                    type="button"
                    className={styles.multiActionBtn}
                    onClick={() => {
                      const gap = Number.parseFloat(arrayGapDraft);
                      const gapMm = Number.isFinite(gap) && gap >= 0 ? gap : 200;
                      callbacks?.onArrayEntities?.(multiSelection.count, gapMm);
                    }}
                    title="Row array (all in one row, typed gap)"
                    aria-label="Array in a single row with typed gap"
                  >
                    Row
                  </button>
                  <button
                    type="button"
                    className={styles.multiActionBtn}
                    onClick={() => {
                      const gap = Number.parseFloat(arrayGapDraft);
                      const gapMm = Number.isFinite(gap) && gap >= 0 ? gap : 200;
                      callbacks?.onArrayEntities?.(
                        Math.max(2, Math.ceil(Math.sqrt(multiSelection.count))),
                        gapMm,
                      );
                    }}
                    title="Grid array (~square columns, typed gap)"
                    aria-label="Array in a grid with typed gap"
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    className={styles.multiActionBtn}
                    onClick={() => {
                      const gap = Number.parseFloat(arrayGapDraft);
                      const gapMm = Number.isFinite(gap) && gap >= 0 ? gap : 400;
                      callbacks?.onArrayEntities?.(5, gapMm);
                    }}
                    title="5-column array with typed gap"
                    aria-label="Array in five columns with typed gap"
                  >
                    5×
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const hasUnderlayCalibrate =
    Boolean(callbacks?.onCalibrateUnderlay) ||
    Boolean(callbacks?.onStartTwoPointCalibrate);

  // Empty state: only keep chrome when underlay calibrate is available.
  // Live workspace collapses the properties dock when nothing is selected (PF-21),
  // except when an underlay is present so scale controls stay reachable.
  if (!selectedEntity) {
    if (!hasUnderlayCalibrate) {
      return null;
    }
    const pickHint =
      underlayCalibratePhase === "pick-a"
        ? "Click the first reference point on the underlay."
        : underlayCalibratePhase === "pick-b"
          ? "Click the second reference point on the underlay."
          : null;
    return (
      <div
        className={styles.panel}
        data-state="empty"
        aria-label="Properties"
      >
        <div className={styles.emptyState} role="status">
          <div className={styles.emptyIcon} aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6" />
              <path d="M9 13h6" />
              <path d="M9 17h4" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No selection</h3>
          <p className={styles.emptyDescription}>
            Select an element on the canvas to view and edit its properties.
          </p>
          <p className={styles.emptyHint}>
            Walls, doors, windows, rooms, and furniture open contextual fields
            here.
          </p>
          {hasUnderlayCalibrate ? (
            <div className={styles.multiActions}>
              <span className={styles.multiActionLabel}>Underlay scale</span>
              {pickHint ? (
                <p className={styles.emptyHint} role="status">
                  {pickHint}
                </p>
              ) : null}
              {callbacks?.onStartTwoPointCalibrate ? (
                <label className={styles.multiActionLabel} htmlFor={`${id}-known-distance`}>
                  Known distance
                  <input
                    id={`${id}-known-distance`}
                    className={styles.multiActionInput}
                    type="text"
                    inputMode="decimal"
                    value={knownDistanceDraft}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setKnownDistanceDraft(event.target.value)
                    }
                    onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        startTwoPointCalibrate();
                      }
                    }}
                    aria-label="Known underlay segment length"
                    disabled={underlayCalibratePhase != null}
                  />
                </label>
              ) : null}
              <div className={styles.multiActionRow}>
                {callbacks?.onCalibrateUnderlay ? (
                  <>
                    <button
                      type="button"
                      className={styles.multiActionBtnWide}
                      onClick={() =>
                        callbacks.onCalibrateUnderlay?.(UNDERLAY_KNOWN_WIDTH_10M_MM)
                      }
                      title="Map underlay width to 10 m"
                      aria-label="Calibrate underlay width to 10 metres"
                      disabled={underlayCalibratePhase != null}
                    >
                      10 m
                    </button>
                    <button
                      type="button"
                      className={styles.multiActionBtnWide}
                      onClick={() =>
                        callbacks.onCalibrateUnderlay?.(UNDERLAY_KNOWN_WIDTH_5M_MM)
                      }
                      title="Map underlay width to 5 m"
                      aria-label="Calibrate underlay width to 5 metres"
                      disabled={underlayCalibratePhase != null}
                    >
                      5 m
                    </button>
                  </>
                ) : null}
                {callbacks?.onStartTwoPointCalibrate ? (
                  underlayCalibratePhase != null ? (
                    <button
                      type="button"
                      className={styles.multiActionBtnWide}
                      onClick={() => callbacks.onCancelTwoPointCalibrate?.()}
                      title="Cancel two-point calibration"
                      aria-label="Cancel two-point underlay calibration"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.multiActionBtnWide}
                      onClick={startTwoPointCalibrate}
                      title="Pick two points on the underlay for the known distance"
                      aria-label="Start two-point underlay calibration"
                    >
                      2-point
                    </button>
                  )
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // Contextual groups live inside renderProperties; header chrome stays fixed.
  return (
    <div
      className={styles.panel}
      data-state="selection"
      data-entity={selectedEntity.collection}
      aria-label="Properties"
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.entityType}>
            {getEntityTypeLabel(selectedEntity.collection)}
          </span>
          <h3 className={styles.entityName}>
            {getEntityDisplayName(selectedEntity.entity)}
          </h3>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.lockButton}`}
            onClick={handleToggleLock}
            aria-pressed={isLocked}
            aria-label={isLocked ? "Unlock element" : "Lock element"}
            title={isLocked ? "Unlock" : "Lock"}
          >
            {isLocked ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.duplicateButton}`}
            onClick={handleDuplicate}
            disabled={isLocked}
            aria-label="Duplicate element"
            title={isLocked ? "Unlock to duplicate" : "Duplicate"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={handleDelete}
            disabled={isLocked}
            aria-label="Delete element"
            title={isLocked ? "Unlock to delete" : "Delete"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sole scrollport — header stays put */}
      <div
        className={styles.content}
        data-locked={isLocked ? "true" : "false"}
      >
        {renderProperties}
      </div>
    </div>
  );
});

/**
 * Property field component for number/text inputs
 */
import { NumberField, Label, Input, Group, Select, Button, Popover, ListBox, ListBoxItem } from "react-aria-components";

interface PropertyFieldProps {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  onCommit?: (value: string) => boolean | void;
  readOnly?: boolean;
  min?: number;
  max?: number;
}

function PropertyField({
  id,
  label,
  value,
  unit,
  onCommit,
  readOnly = false,
  min,
  max,
}: PropertyFieldProps) {
  const displayValue = String(value);
  const [draft, setDraft] = useState(displayValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commitDraft = useCallback((): boolean => {
    if (readOnly || !onCommit) return true;
    if (draft === displayValue) {
      setError(null);
      setIsEditing(false);
      return true;
    }

    const numericValue = Number(draft.trim());
    if (min !== undefined && Number.isFinite(numericValue) && numericValue < min) {
      setError(`Enter ${min} or more.`);
      return false;
    }
    if (max !== undefined && Number.isFinite(numericValue) && numericValue > max) {
      setError(`Enter ${max} or less.`);
      return false;
    }

    if (onCommit(draft) === false) {
      setError(unit ? `Enter a valid value in ${unit}.` : "Enter a valid number.");
      return false;
    }

    setError(null);
    setIsEditing(false);
    return true;
  }, [draft, displayValue, max, min, onCommit, readOnly, unit]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        setDraft(displayValue);
        setError(null);
        setIsEditing(false);
        event.currentTarget.blur();
      }
      if (event.key === "Enter") {
        if (commitDraft()) {
          event.currentTarget.blur();
        }
      }
    },
    [commitDraft, displayValue],
  );

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  const forceText =
    unit === "ft-in" ||
    onCommit !== undefined ||
    (typeof value === "string" &&
      (isNaN(numValue) || /['"a-zA-Z°²]/.test(value)));

  if (forceText || onCommit) {
    const errorId = `${id}-error`;
    return (
      <div className={styles.field}>
        <label htmlFor={id} className={styles.fieldLabel}>
          {label}
        </label>
        <div className={styles.inputWrapper}>
          <input
            id={id}
            type="text"
            inputMode={unit && unit !== "ft-in" && unit !== "°" ? "decimal" : "text"}
            className={styles.fieldInput}
            value={isEditing ? draft : displayValue}
            aria-label={label}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => {
              setIsEditing(true);
              setDraft(event.target.value);
              setError(null);
            }}
            onFocus={() => {
              setDraft(displayValue);
              setError(null);
              setIsEditing(true);
            }}
            onBlur={commitDraft}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            disabled={readOnly}
          />
          {unit ? <span className={styles.fieldUnit}>{unit}</span> : null}
        </div>
        {error ? (
          <span id={errorId} className={styles.fieldError} role="alert">
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <NumberField
      className={styles.field}
      value={isNaN(numValue) ? undefined : numValue}
      isReadOnly={readOnly}
      minValue={min}
      maxValue={max}
      formatOptions={{ maximumFractionDigits: 2 }}
    >
      <Label className={styles.fieldLabel}>{label}</Label>
      <Group className={styles.inputWrapper}>
        <Input className={styles.fieldInput} id={id} aria-label={label} />
        {unit && <span className={styles.fieldUnit}>{unit}</span>}
      </Group>
    </NumberField>
  );
}

/**
 * Property select component
 */
interface PropertySelectProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

function PropertySelect({
  id,
  label,
  value,
  options,
  onChange,
}: PropertySelectProps) {
  return (
    <Select
      className={styles.field}
      selectedKey={value}
      onSelectionChange={(key) => {
        if (onChange) {
          onChange({ target: { value: String(key) } } as unknown as ChangeEvent<HTMLSelectElement>);
        }
      }}
    >
      <Label className={styles.fieldLabel}>{label}</Label>
      <Button className={styles.fieldSelect} id={id}>
        {options.find(o => o.value === value)?.label || "Select..."}
      </Button>
      <Popover>
        <ListBox className={styles.dropdownMenu}>
          {options.map((option) => (
            <ListBoxItem key={option.value} id={option.value} className={styles.dropdownItem}>
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}

/**
 * Property checkbox component
 */
interface PropertyCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

function PropertyCheckbox({
  id,
  label,
  checked,
  onChange,
}: PropertyCheckboxProps) {
  return (
    <div className={styles.checkboxField}>
      <label htmlFor={id} className={styles.checkboxLabel}>
        {label}
      </label>
      <input
        id={id}
        type="checkbox"
        className={styles.fieldCheckbox}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </div>
  );
}
