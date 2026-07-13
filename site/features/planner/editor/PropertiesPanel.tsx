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
} from "@/features/planner/project/model/actions/projectActions";
import type { PlannerDisplayUnit } from "@/features/planner/project/model/types";
import {
  formatAreaDisplay,
  formatFootprintDisplay,
  formatLengthDisplay,
  formatLengthInput,
  parseLengthInput,
} from "@/features/planner/project/model/units";
import { parseWorkstationConfigKey } from "@/features/planner/project/catalog/workstationSystemV0";
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
}: PropertiesPanelProps) {
  const id = useId();

  const isLocked = !!(
    selectedEntity &&
    typeof selectedEntity.entity === "object" &&
    selectedEntity.entity &&
    "locked" in selectedEntity.entity &&
    (selectedEntity.entity as { locked?: boolean }).locked === true
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
                label="Position"
                value={formatLengthInput(door.position, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "position")}
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
                label="Position"
                value={formatLengthInput(window.position, displayUnit)}
                unit={displayUnit}
                onCommit={(value) => commitLengthValue(value, "position")}
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
    [id, displayUnit, commitLengthValue, handleSelectChange, fieldReadOnly],
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
            Select a single item to edit position, size, and rotation. Shared
            delete still applies to the whole selection.
          </p>
        </div>
      </div>
    );
  }

  // Empty state when nothing is selected
  if (!selectedEntity) {
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
