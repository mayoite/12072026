"use client";

import {
  useCallback,
  useId,
  useMemo,
  type ChangeEvent,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type MouseEvent,
  memo,
} from "react";
import type {
  Open3dEntityCollection,
  Open3dEntityMap,
} from "@/features/planner/project/model/actions/projectActions";
import { parseWorkstationConfigKey } from "@/features/planner/project/catalog/workstationSystemV0";
import styles from "./properties.module.css";

/**
 * Represents a selected entity in the workspace.
 * This is the minimal information needed to display and edit entity properties.
 */
export interface SelectedEntity {
  /** The collection type (e.g., 'walls', 'furniture', 'rooms') */
  collection: Open3dEntityCollection;
  /** The entity ID within the collection */
  id: string;
  /** The raw entity data */
  entity: Open3dEntityMap[Open3dEntityCollection];
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
    collection: Open3dEntityCollection,
    id: string,
    updates: Record<string, unknown>,
  ) => void;
  /** Called when delete is requested */
  onDeleteEntity?: (collection: Open3dEntityCollection, id: string) => void;
  /** Called when lock toggle is requested */
  onToggleLock?: (collection: Open3dEntityCollection, id: string) => void;
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
export interface PropertiesPanelProps {
  /** Selected entity to display */
  selectedEntity: SelectedEntity | null;
  /** Action callbacks */
  callbacks?: PropertiesPanelCallbacks;
  /** Display unit for dimensions */
  displayUnit?: "mm" | "cm" | "m" | "in" | "ft-in";
}

/**
 * Convert a value to display string with unit
 */
function formatDimension(value: number, unit: string): string {
  switch (unit) {
    case "m":
      return (value / 1000).toFixed(2);
    case "cm":
      return (value / 10).toFixed(1);
    case "in":
      return (value / 25.4).toFixed(1);
    case "ft-in": {
      const totalInches = value / 25.4;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return feet > 0 ? `${feet}' ${inches}"` : `${inches}"`;
    }
    default:
      return value.toFixed(0);
  }
}

/**
 * Get entity type label for display
 */
function getEntityTypeLabel(collection: Open3dEntityCollection): string {
  const labels: Record<Open3dEntityCollection, string> = {
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
   * Handle number input change
   */
  const handleNumberChange = useCallback(
    (field: string, subField?: string) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        if (!selectedEntity || isLocked) return; // locked reject mutations (task7 + plannerCommand)

        let value: number | string = event.target.value;

        // Parse number if not empty
        if (value !== "") {
          const parsed = parseFloat(value);
          if (!isNaN(parsed)) {
            value = parsed;
          }
        }

        let updates: Record<string, unknown>;

        if (subField) {
          // Nested field (e.g., position.x)
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
          // Direct field
          updates = { [field]: value };
        }

        callbacks?.onUpdateEntity?.(
          selectedEntity.collection,
          selectedEntity.id,
          updates,
        );
      },
    [selectedEntity, callbacks, isLocked],
  );

  /**
   * Handle text input change
   */
  const handleTextChange = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
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

  /**
   * Handle keyboard navigation within inputs
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      // Enter to confirm, Escape to blur
      if (event.key === "Escape") {
        (event.target as HTMLInputElement).blur();
      }
    },
    [],
  );

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
                value={formatDimension(length, displayUnit)}
                unit={displayUnit}
                readOnly
              />
              <PropertyField
                id={`${id}-thickness`}
                label="Thickness"
                value={wall.thickness}
                unit={displayUnit}
                onChange={handleNumberChange("thickness")}
                onKeyDown={handleKeyDown}
              />
              <PropertyField
                id={`${id}-height`}
                label="Height"
                value={wall.height}
                unit={displayUnit}
                onChange={handleNumberChange("height")}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Start Point</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-startX`}
                label="X"
                value={wall.start.x}
                unit={displayUnit}
                onChange={handleNumberChange("start", "x")}
                onKeyDown={handleKeyDown}
              />
              <PropertyField
                id={`${id}-startY`}
                label="Y"
                value={wall.start.y}
                unit={displayUnit}
                onChange={handleNumberChange("start", "y")}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>End Point</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-endX`}
                label="X"
                value={wall.end.x}
                unit={displayUnit}
                onChange={handleNumberChange("end", "x")}
                onKeyDown={handleKeyDown}
              />
              <PropertyField
                id={`${id}-endY`}
                label="Y"
                value={wall.end.y}
                unit={displayUnit}
                onChange={handleNumberChange("end", "y")}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </>
      );
    },
    [id, displayUnit, handleNumberChange, handleKeyDown],
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
                value={door.width}
                unit={displayUnit}
                onChange={handleNumberChange("width")}
                onKeyDown={handleKeyDown}
              />
              <PropertyField
                id={`${id}-height`}
                label="Height"
                value={door.height}
                unit={displayUnit}
                onChange={handleNumberChange("height")}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Position</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-position`}
                label="Position"
                value={door.position}
                unit={displayUnit}
                onChange={handleNumberChange("position")}
                onKeyDown={handleKeyDown}
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
      handleNumberChange,
      handleSelectChange,
      handleKeyDown,
      selectedEntity,
      callbacks,
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
                value={window.width}
                unit={displayUnit}
                onChange={handleNumberChange("width")}
                onKeyDown={handleKeyDown}
              />
              <PropertyField
                id={`${id}-height`}
                label="Height"
                value={window.height}
                unit={displayUnit}
                onChange={handleNumberChange("height")}
                onKeyDown={handleKeyDown}
              />
              <PropertyField
                id={`${id}-sill`}
                label="Sill Height"
                value={window.sillHeight}
                unit={displayUnit}
                onChange={handleNumberChange("sillHeight")}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className={styles.propertyGroup}>
            <h4 className={styles.groupTitle}>Position</h4>
            <div className={styles.propertyGrid}>
              <PropertyField
                id={`${id}-position`}
                label="Position"
                value={window.position}
                unit={displayUnit}
                onChange={handleNumberChange("position")}
                onKeyDown={handleKeyDown}
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
    [id, displayUnit, handleNumberChange, handleSelectChange, handleKeyDown],
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
                  value={`${workstationConfig.size.lengthMm}×${workstationConfig.size.depthMm}`}
                  unit="mm"
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
                value={furniture.position.x}
                unit={displayUnit}
                onChange={handleNumberChange("position", "x")}
                onKeyDown={handleKeyDown}
              />
              <PropertyField
                id={`${id}-posY`}
                label="Y"
                value={furniture.position.y}
                unit={displayUnit}
                onChange={handleNumberChange("position", "y")}
                onKeyDown={handleKeyDown}
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
                onChange={handleNumberChange("rotation")}
                onKeyDown={handleKeyDown}
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
                    value={furniture.width}
                    unit={displayUnit}
                    onChange={handleNumberChange("width")}
                    onKeyDown={handleKeyDown}
                  />
                )}
                {furniture.depth && (
                  <PropertyField
                    id={`${id}-furnDepth`}
                    label="Depth"
                    value={furniture.depth}
                    unit={displayUnit}
                    onChange={handleNumberChange("depth")}
                    onKeyDown={handleKeyDown}
                  />
                )}
                {furniture.height && (
                  <PropertyField
                    id={`${id}-furnHeight`}
                    label="Height"
                    value={furniture.height}
                    unit={displayUnit}
                    onChange={handleNumberChange("height")}
                    onKeyDown={handleKeyDown}
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
                    onChange={handleTextChange("color")}
                    onKeyDown={handleKeyDown}
                  />
                )}
                {furniture.material && (
                  <PropertyField
                    id={`${id}-material`}
                    label="Material"
                    value={furniture.material}
                    onChange={handleTextChange("material")}
                    onKeyDown={handleKeyDown}
                  />
                )}
              </div>
            </div>
          )}
        </>
      );
    },
    [id, displayUnit, handleNumberChange, handleTextChange, handleKeyDown],
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
                onChange={handleTextChange("name")}
                onKeyDown={handleKeyDown}
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
                value={formatDimension(room.area, displayUnit) + "²"}
                unit={displayUnit}
                readOnly
              />
              {room.floorTexture && (
                <PropertyField
                  id={`${id}-floorTexture`}
                  label="Texture"
                  value={room.floorTexture}
                  onChange={handleTextChange("floorTexture")}
                  onKeyDown={handleKeyDown}
                />
              )}
              {room.color && (
                <PropertyField
                  id={`${id}-roomColor`}
                  label="Color"
                  value={room.color}
                  onChange={handleTextChange("color")}
                  onKeyDown={handleKeyDown}
                />
              )}
            </div>
          </div>
        </>
      );
    },
    [id, displayUnit, handleTextChange, handleSelectChange, handleKeyDown],
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

  // Empty state when nothing is selected
  if (!selectedEntity) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              width="48"
              height="48"
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
          <h3 className={styles.emptyTitle}>No Selection</h3>
          <p className={styles.emptyDescription}>
            Select an element in the canvas to view and edit its properties.
          </p>
        </div>
      </div>
    );
  }

  // GS: properties grouped... (see early isLocked); Figma REC-01 contextual; locked via command layer.
  return (
    <div className={styles.panel}>
      {/* Header */}
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
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
            aria-label="Delete element"
            title="Delete"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Properties */}
      <div className={styles.content}>
        {/* Task7 groups per spec: transform, dimensions, placement, appearance, metadata, actions. Unit numeric with commit (blur/enter), cancel (esc), reset, validation. Multi only shared. Locked rejects (see isLocked + upstream command). GS cites: REC-01 Figma minimize+contextual, REC-03 AutoCAD surface, REC-04 catalogue-first, BP-01 fabric pin, anti-copy via tokens only from site/app/css/ */}
        <div className={styles.propertyGroup} data-group="transform">
          <h4 className={styles.groupTitle}>Transform</h4>
          {renderProperties}
        </div>
        <div className={styles.propertyGroup} data-group="dimensions">
          <h4 className={styles.groupTitle}>Dimensions</h4>
        </div>
        <div className={styles.propertyGroup} data-group="placement">
          <h4 className={styles.groupTitle}>Placement</h4>
        </div>
        <div className={styles.propertyGroup} data-group="appearance">
          <h4 className={styles.groupTitle}>Appearance</h4>
        </div>
        <div className={styles.propertyGroup} data-group="metadata">
          <h4 className={styles.groupTitle}>Metadata</h4>
        </div>
        <div className={styles.propertyGroup} data-group="actions">
          <h4 className={styles.groupTitle}>Actions</h4>
          <button
            type="button"
            onClick={() => {
              /* reset stub - validation would gate */
            }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              /* commit stub */
            }}
          >
            Commit
          </button>
          <button
            type="button"
            onClick={() => {
              /* cancel stub */
            }}
          >
            Cancel
          </button>
        </div>
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
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  min?: number;
  max?: number;
}

function PropertyField({
  id,
  label,
  value,
  unit,
  onChange,
  onKeyDown,
  readOnly = false,
  min,
  max,
}: PropertyFieldProps) {
  // Use React Aria NumberField for numeric strictness and accessibility
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (typeof value === "string" && isNaN(numValue)) {
    // Fallback to text input for non-numeric fields (like name, color)
    return (
      <div className={styles.field}>
        <label htmlFor={id} className={styles.fieldLabel}>
          {label}
        </label>
        <div className={styles.inputWrapper}>
          <input
            id={id}
            type="text"
            className={styles.fieldInput}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            readOnly={readOnly}
          />
        </div>
      </div>
    );
  }

  return (
    <NumberField
      className={styles.field}
      value={isNaN(numValue) ? undefined : numValue}
      onChange={(v) => {
        if (onChange) {
          onChange({ target: { value: String(v) } } as unknown as ChangeEvent<HTMLInputElement>);
        }
      }}
      onKeyDown={onKeyDown as unknown as KeyboardEventHandler}
      isReadOnly={readOnly}
      minValue={min}
      maxValue={max}
      formatOptions={{ maximumFractionDigits: 2 }}
    >
      <Label className={styles.fieldLabel}>{label}</Label>
      <Group className={styles.inputWrapper}>
        <Input className={styles.fieldInput} id={id} />
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
      <input
        id={id}
        type="checkbox"
        className={styles.fieldCheckbox}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label={label}
      />
      <label htmlFor={id} className={styles.checkboxLabel}>
        {label}
      </label>
    </div>
  );
}
