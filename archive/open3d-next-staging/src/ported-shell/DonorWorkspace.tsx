"use client";

import { useMemo, useState, type MouseEvent, type ReactNode } from "react";

import styles from "./donor-workspace.module.css";
import topbarStyles from "./donor-topbar.module.css";
import buildPanelStyles from "./donor-build-panel.module.css";
import canvasStyles from "./donor-canvas.module.css";
import propertiesStyles from "./donor-properties-panel.module.css";

type ViewMode = "2d" | "3d";
type TabKey = "build" | "rooms" | "objects";
type WallMode = "wall" | "half-wall" | "curved";
type ToolKey = "select" | "pan" | "wall" | "text" | "dimension" | "measure" | "stairs" | "column-round" | "column-square" | "door" | "window";
type DisplayUnit = "mm" | "cm" | "m" | "in" | "ft-in";

type Floor = {
  id: string;
  name: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function closeDetailsFromEvent(event: MouseEvent<HTMLElement>) {
  const details = event.currentTarget.closest("details");
  if (details instanceof HTMLDetailsElement) {
    details.removeAttribute("open");
  }
}

function Chevron() {
  return <span aria-hidden="true" className={topbarStyles.chevron}>▾</span>;
}

function SectionChevron({ open }: { open: boolean }) {
  return <span aria-hidden="true" className={buildPanelStyles.sectionChevron}>{open ? "▼" : "▶"}</span>;
}

function IconButton({
  className,
  title,
  onClick,
  children,
}: {
  className?: string;
  title: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={className} title={title} onClick={onClick}>
      {children}
    </button>
  );
}

function TopBar({
  projectName,
  floors,
  activeFloorId,
  viewMode,
  zoom,
  displayUnit,
  isSaved,
  onFloorChange,
  onAddFloor,
  onViewModeChange,
  onDisplayUnitChange,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onSave,
}: {
  projectName: string;
  floors: Floor[];
  activeFloorId: string;
  viewMode: ViewMode;
  zoom: number;
  displayUnit: DisplayUnit;
  isSaved: boolean;
  onFloorChange: (floorId: string) => void;
  onAddFloor: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onDisplayUnitChange: (unit: DisplayUnit) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onSave: () => void;
}) {
  const floorName = useMemo(() => floors.find((floor) => floor.id === activeFloorId)?.name ?? "Select", [floors, activeFloorId]);
  const unitOptions: DisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];

  return (
    <header className={topbarStyles.topBar}>
      <div className={topbarStyles.brandCluster}>
        <button type="button" className={topbarStyles.aiAssist} title="AI Assist">
          AI Assist
        </button>
        <button type="button" className={topbarStyles.projectName} title="Rename project">
          {projectName}
        </button>
        <details className={topbarStyles.dropdown}>
          <summary className={topbarStyles.dropdownButton}>
            Floor: {floorName}
            <Chevron />
          </summary>
          <div className={topbarStyles.menu} role="listbox" aria-label="Select floor">
            {floors.map((floor) => (
              <button
                key={floor.id}
                type="button"
                className={cx(topbarStyles.menuItem, floor.id === activeFloorId && topbarStyles.menuItemActive)}
                onClick={() => onFloorChange(floor.id)}
                role="option"
                aria-selected={floor.id === activeFloorId}
              >
                {floor.name}
              </button>
            ))}
            <div className={topbarStyles.menuDivider} />
            <button type="button" className={topbarStyles.menuItem} onClick={onAddFloor}>
              Add Floor
            </button>
          </div>
        </details>
        <button type="button" className={topbarStyles.addFloor} onClick={onAddFloor} title="Add floor">
          +
        </button>
      </div>

      <div className={topbarStyles.controlCluster}>
        <div className={topbarStyles.segmented} role="radiogroup" aria-label="View mode">
          <button
            type="button"
            className={cx(topbarStyles.segmentButton, viewMode === "2d" && topbarStyles.segmentButtonActive)}
            onClick={() => onViewModeChange("2d")}
            role="radio"
            aria-checked={viewMode === "2d"}
          >
            2D
          </button>
          <button
            type="button"
            className={cx(topbarStyles.segmentButton, viewMode === "3d" && topbarStyles.segmentButtonActive)}
            onClick={() => onViewModeChange("3d")}
            role="radio"
            aria-checked={viewMode === "3d"}
          >
            3D
          </button>
        </div>

        <div className={topbarStyles.zoomGroup} aria-label="Zoom controls">
          <IconButton className={topbarStyles.iconButton} title="Zoom out" onClick={onZoomOut}>
            −
          </IconButton>
          <button type="button" className={topbarStyles.zoomValue} title="Reset zoom" onClick={onZoomReset}>
            {Math.round(zoom * 100)}%
          </button>
          <IconButton className={topbarStyles.iconButton} title="Zoom in" onClick={onZoomIn}>
            +
          </IconButton>
        </div>

        <details className={topbarStyles.dropdown}>
          <summary className={topbarStyles.dropdownButton}>
            {displayUnit}
            <Chevron />
          </summary>
          <div className={topbarStyles.menu} role="listbox" aria-label="Select units">
            {unitOptions.map((unit) => (
              <button
                key={unit}
                type="button"
                className={cx(topbarStyles.menuItem, unit === displayUnit && topbarStyles.menuItemActive)}
                onClick={() => onDisplayUnitChange(unit)}
                role="option"
                aria-selected={unit === displayUnit}
              >
                {unit}
              </button>
            ))}
          </div>
        </details>

        <span className={cx(topbarStyles.saveState, isSaved && topbarStyles.saveStateSaved)}>
          {isSaved ? "Saved ✓" : "Unsaved •"}
        </span>

        <button type="button" className={topbarStyles.saveButton} onClick={onSave}>
          Save
        </button>

        <details className={topbarStyles.dropdown}>
          <summary className={topbarStyles.dropdownButton}>
            Import
            <Chevron />
          </summary>
          <div className={topbarStyles.menu} role="menu">
            <button type="button" className={topbarStyles.menuItem} onClick={closeDetailsFromEvent}>
              Import Image
            </button>
            <button type="button" className={topbarStyles.menuItem} onClick={closeDetailsFromEvent}>
              Import JSON / RoomPlan
            </button>
          </div>
        </details>

        <details className={topbarStyles.dropdown}>
          <summary className={topbarStyles.dropdownButton}>
            Export
            <Chevron />
          </summary>
          <div className={topbarStyles.menu} role="menu">
            <button type="button" className={topbarStyles.menuItem} onClick={closeDetailsFromEvent}>
              Export as PNG
            </button>
            <button type="button" className={topbarStyles.menuItem} onClick={closeDetailsFromEvent}>
              Export as SVG
            </button>
            <button type="button" className={topbarStyles.menuItem} onClick={closeDetailsFromEvent}>
              Export as DXF
            </button>
            <button type="button" className={topbarStyles.menuItem} onClick={closeDetailsFromEvent}>
              Export as DWG
            </button>
            <button type="button" className={topbarStyles.menuItem} onClick={closeDetailsFromEvent}>
              Export as PDF
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}

function BuildPanel({
  activeTab,
  onTabChange,
  selectedTool,
  wallMode,
  wallHeight,
  onWallModeChange,
  onToolChange,
  onWallHeightChange,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  selectedTool: ToolKey;
  wallMode: WallMode;
  wallHeight: number;
  onWallModeChange: (mode: WallMode) => void;
  onToolChange: (tool: ToolKey) => void;
  onWallHeightChange: (value: number) => void;
}) {
  const [wallsOpen, setWallsOpen] = useState(true);
  const [structureOpen, setStructureOpen] = useState(true);
  const [annotateOpen, setAnnotateOpen] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [roomsSearch, setRoomsSearch] = useState("");
  const [objectsSearch, setObjectsSearch] = useState("");

  const roomPresets = [
    { name: "Rectangle", icon: "▭" },
    { name: "L-Shape", icon: "⌟" },
    { name: "T-Shape", icon: "⊢" },
    { name: "Custom", icon: "◫" },
  ];

  const roomTemplates = [
    { name: "Living Room", items: 12 },
    { name: "Bedroom", items: 7 },
    { name: "Kitchen", items: 9 },
    { name: "Bathroom", items: 5 },
  ];

  const objects = [
    { name: "Chair", category: "Furniture" },
    { name: "Table", category: "Furniture" },
    { name: "Lamp", category: "Lighting" },
    { name: "Sofa", category: "Furniture" },
    { name: "Plant", category: "Decor" },
    { name: "Desk", category: "Office" },
  ];

  const filteredObjects = objects.filter((item) => item.name.toLowerCase().includes(objectsSearch.toLowerCase()));
  const filteredRooms = roomPresets.filter((item) => item.name.toLowerCase().includes(roomsSearch.toLowerCase()));

  return (
    <aside className={buildPanelStyles.panel}>
      <div className={buildPanelStyles.tabs} role="tablist" aria-label="Workspace sections">
        <button
          type="button"
          className={cx(buildPanelStyles.tabButton, activeTab === "build" && buildPanelStyles.tabButtonActive)}
          onClick={() => onTabChange("build")}
          role="tab"
          aria-selected={activeTab === "build"}
        >
          BUILD
        </button>
        <button
          type="button"
          className={cx(buildPanelStyles.tabButton, activeTab === "rooms" && buildPanelStyles.tabButtonActive)}
          onClick={() => onTabChange("rooms")}
          role="tab"
          aria-selected={activeTab === "rooms"}
        >
          ROOMS
        </button>
        <button
          type="button"
          className={cx(buildPanelStyles.tabButton, activeTab === "objects" && buildPanelStyles.tabButtonActive)}
          onClick={() => onTabChange("objects")}
          role="tab"
          aria-selected={activeTab === "objects"}
        >
          OBJECTS
        </button>
      </div>

      <div className={buildPanelStyles.scrollArea}>
        {activeTab === "build" && (
          <div className={buildPanelStyles.stack}>
            <section className={buildPanelStyles.section}>
              <button type="button" className={buildPanelStyles.sectionHeader} onClick={() => setWallsOpen((value) => !value)}>
                <span className={buildPanelStyles.sectionLabel}>Walls</span>
                <SectionChevron open={wallsOpen} />
              </button>
              {wallsOpen && (
                <div className={buildPanelStyles.sectionBody}>
                  <div className={buildPanelStyles.toolGrid}>
                    <button
                      type="button"
                      className={cx(buildPanelStyles.toolCard, selectedTool === "select" && buildPanelStyles.toolCardActive)}
                      onClick={() => onToolChange("select")}
                    >
                      <span className={buildPanelStyles.toolIcon}>↖</span>
                      <span className={buildPanelStyles.toolTitle}>Select <span className={buildPanelStyles.toolKey}>V</span></span>
                      <span className={buildPanelStyles.toolCopy}>Click to select elements</span>
                    </button>
                    <button
                      type="button"
                      className={cx(buildPanelStyles.toolCard, selectedTool === "pan" && buildPanelStyles.toolCardActive)}
                      onClick={() => onToolChange("pan")}
                    >
                      <span className={buildPanelStyles.toolIcon}>✋</span>
                      <span className={buildPanelStyles.toolTitle}>Pan <span className={buildPanelStyles.toolKey}>H</span></span>
                      <span className={buildPanelStyles.toolCopy}>Drag to move the view</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className={buildPanelStyles.primaryTool}
                    onClick={() => onToolChange("wall")}
                  >
                    <span className={buildPanelStyles.primaryIcon}>▭</span>
                    <span className={buildPanelStyles.primaryText}>
                      <strong>Draw Wall</strong>
                      <span>Click to draw, dbl-click to finish</span>
                    </span>
                    <span className={buildPanelStyles.primaryKey}>W</span>
                  </button>

                  <div className={buildPanelStyles.modeGrid}>
                    <button
                      type="button"
                      className={cx(buildPanelStyles.modeCard, wallMode === "wall" && buildPanelStyles.modeCardActive)}
                      onClick={() => onWallModeChange("wall")}
                    >
                      <span className={buildPanelStyles.modeIcon}>▭</span>
                      <span>Wall</span>
                    </button>
                    <button
                      type="button"
                      className={cx(buildPanelStyles.modeCard, wallMode === "half-wall" && buildPanelStyles.modeCardActive)}
                      onClick={() => onWallModeChange("half-wall")}
                    >
                      <span className={buildPanelStyles.modeIcon}>▤</span>
                      <span>Half-Wall</span>
                    </button>
                    <button
                      type="button"
                      className={cx(buildPanelStyles.modeCard, wallMode === "curved" && buildPanelStyles.modeCardActive)}
                      onClick={() => onWallModeChange("curved")}
                    >
                      <span className={buildPanelStyles.modeIcon}>⌒</span>
                      <span>Curved</span>
                    </button>
                  </div>

                  <label className={buildPanelStyles.inputRow}>
                    <span className={buildPanelStyles.inputLabel}>Height (cm)</span>
                    <input
                      type="number"
                      min={1}
                      value={wallHeight}
                      onChange={(event) => onWallHeightChange(Number(event.target.value))}
                      className={buildPanelStyles.input}
                    />
                  </label>
                </div>
              )}
            </section>

            <section className={buildPanelStyles.section}>
              <button type="button" className={buildPanelStyles.sectionHeader} onClick={() => setStructureOpen((value) => !value)}>
                <span className={buildPanelStyles.sectionLabel}>Structure</span>
                <SectionChevron open={structureOpen} />
              </button>
              {structureOpen && (
                <div className={buildPanelStyles.sectionBody}>
                  <button
                    type="button"
                    className={cx(buildPanelStyles.primaryTool, buildPanelStyles.primaryToolCompact)}
                    onClick={() => onToolChange("stairs")}
                  >
                    <span className={buildPanelStyles.primaryIcon}>↥</span>
                    <span className={buildPanelStyles.primaryText}>
                      <strong>Add Stairs</strong>
                      <span>Click to place stairs</span>
                    </span>
                  </button>
                  <div className={buildPanelStyles.dualGrid}>
                    <button
                      type="button"
                      className={cx(buildPanelStyles.dualCard, selectedTool === "column-round" && buildPanelStyles.dualCardActive)}
                      onClick={() => onToolChange("column-round")}
                    >
                      <span className={buildPanelStyles.dualIcon}>◯</span>
                      <span>Round Column</span>
                    </button>
                    <button
                      type="button"
                      className={cx(buildPanelStyles.dualCard, selectedTool === "column-square" && buildPanelStyles.dualCardActive)}
                      onClick={() => onToolChange("column-square")}
                    >
                      <span className={buildPanelStyles.dualIcon}>□</span>
                      <span>Square Column</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className={buildPanelStyles.section}>
              <button type="button" className={buildPanelStyles.sectionHeader} onClick={() => setAnnotateOpen((value) => !value)}>
                <span className={buildPanelStyles.sectionEyebrow}>ANNOTATE</span>
                <SectionChevron open={annotateOpen} />
              </button>
              {annotateOpen && (
                <div className={buildPanelStyles.sectionBody}>
                  <button
                    type="button"
                    className={cx(buildPanelStyles.primaryTool, buildPanelStyles.primaryToolCompact, selectedTool === "text" && buildPanelStyles.toolCardActive)}
                    onClick={() => onToolChange("text")}
                  >
                    <span className={buildPanelStyles.primaryIcon}>T</span>
                    <span className={buildPanelStyles.primaryText}>
                      <strong>Text Label</strong>
                      <span>Add text annotations</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={cx(buildPanelStyles.primaryTool, buildPanelStyles.primaryToolCompact, selectedTool === "dimension" && buildPanelStyles.toolCardActive)}
                    onClick={() => onToolChange("dimension")}
                  >
                    <span className={buildPanelStyles.primaryIcon}>≡</span>
                    <span className={buildPanelStyles.primaryText}>
                      <strong>Dimension</strong>
                      <span>Add dimension annotations</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={cx(buildPanelStyles.primaryTool, buildPanelStyles.primaryToolCompact, selectedTool === "measure" && buildPanelStyles.toolCardActive)}
                    onClick={() => onToolChange("measure")}
                  >
                    <span className={buildPanelStyles.primaryIcon}>⌁</span>
                    <span className={buildPanelStyles.primaryText}>
                      <strong>Measure</strong>
                      <span>Measure distances</span>
                    </span>
                  </button>
                </div>
              )}
            </section>

            <section className={buildPanelStyles.section}>
              <button type="button" className={buildPanelStyles.sectionHeader} onClick={() => setDoorsOpen((value) => !value)}>
                <span className={buildPanelStyles.sectionEyebrow}>DOORS</span>
                <SectionChevron open={doorsOpen} />
              </button>
              {doorsOpen && (
                <div className={buildPanelStyles.sectionBody}>
                  <div className={buildPanelStyles.dualGrid}>
                    <button type="button" className={buildPanelStyles.smallTile} onClick={() => onToolChange("door")}>Single</button>
                    <button type="button" className={buildPanelStyles.smallTile} onClick={() => onToolChange("door")}>Double</button>
                    <button type="button" className={buildPanelStyles.smallTile} onClick={() => onToolChange("door")}>Sliding</button>
                    <button type="button" className={buildPanelStyles.smallTile} onClick={() => onToolChange("door")}>French</button>
                  </div>
                  <div className={buildPanelStyles.subsectionLabel}>WINDOWS</div>
                  <div className={buildPanelStyles.dualGrid}>
                    <button type="button" className={buildPanelStyles.smallTile} onClick={() => onToolChange("window")}>Standard</button>
                    <button type="button" className={buildPanelStyles.smallTile} onClick={() => onToolChange("window")}>Fixed</button>
                    <button type="button" className={buildPanelStyles.smallTile} onClick={() => onToolChange("window")}>Casement</button>
                    <button type="button" className={buildPanelStyles.smallTile} onClick={() => onToolChange("window")}>Sliding</button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "rooms" && (
          <div className={buildPanelStyles.stack}>
            <div className={buildPanelStyles.searchRow}>
              <input
                value={roomsSearch}
                onChange={(event) => setRoomsSearch(event.target.value)}
                placeholder="Search rooms..."
                className={buildPanelStyles.search}
              />
            </div>
            <div className={buildPanelStyles.toolGrid}>
              {filteredRooms.map((room) => (
                <button key={room.name} type="button" className={buildPanelStyles.roomCard}>
                  <span className={buildPanelStyles.roomIcon}>{room.icon}</span>
                  <span className={buildPanelStyles.roomTitle}>{room.name}</span>
                </button>
              ))}
            </div>
            <div className={buildPanelStyles.subsectionLabel}>Templates</div>
            <div className={buildPanelStyles.roomTemplateGrid}>
              {roomTemplates.map((template) => (
                <button key={template.name} type="button" className={buildPanelStyles.templateCard}>
                  <span className={buildPanelStyles.templateTitle}>{template.name}</span>
                  <span className={buildPanelStyles.templateMeta}>{template.items} items</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "objects" && (
          <div className={buildPanelStyles.stack}>
            <div className={buildPanelStyles.searchRow}>
              <input
                value={objectsSearch}
                onChange={(event) => setObjectsSearch(event.target.value)}
                placeholder="Search furniture..."
                className={buildPanelStyles.search}
              />
            </div>
            <div className={buildPanelStyles.chipRow}>
              {["All", "Furniture", "Lighting", "Decor", "Office"].map((chip) => (
                <button key={chip} type="button" className={buildPanelStyles.chip}>
                  {chip}
                </button>
              ))}
            </div>
            <div className={buildPanelStyles.objectGrid}>
              {filteredObjects.map((object) => (
                <button key={object.name} type="button" className={buildPanelStyles.objectCard}>
                  <span className={buildPanelStyles.objectGlyph}>▣</span>
                  <span className={buildPanelStyles.objectTitle}>{object.name}</span>
                  <span className={buildPanelStyles.objectMeta}>{object.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function CanvasArea({
  zoom,
  showGrid,
  showSnap,
  showRulers,
  showMap,
  viewMode,
  selectedTool,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleGrid,
  onToggleSnap,
  onToggleRulers,
  onToggleMap,
}: {
  zoom: number;
  showGrid: boolean;
  showSnap: boolean;
  showRulers: boolean;
  showMap: boolean;
  viewMode: ViewMode;
  selectedTool: ToolKey;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onToggleRulers: () => void;
  onToggleMap: () => void;
}) {
  return (
    <main className={canvasStyles.canvasPane}>
      <div className={canvasStyles.commandStrip}>
        <div className={canvasStyles.commandHeading}>
          <h2>Floor Plan Editor</h2>
          <span>Internal - no production routes</span>
        </div>

        <div className={canvasStyles.commandActions}>
          <button type="button" className={canvasStyles.commandButton} title="Draw wall (W)">
            Draw wall <kbd>W</kbd>
          </button>
          <button type="button" className={canvasStyles.commandButton} title="Cancel (Esc)">
            Cancel <kbd>Esc</kbd>
          </button>
          <button type="button" className={canvasStyles.commandButton} title="Undo (Ctrl+Z)">
            Undo <kbd>Ctrl+Z</kbd>
          </button>
          <button type="button" className={canvasStyles.commandButton} title="Zoom in (+)" onClick={onZoomIn}>
            Zoom in <kbd>+</kbd>
          </button>
          <button type="button" className={canvasStyles.commandButton} title="Zoom out (−)" onClick={onZoomOut}>
            Zoom out <kbd>−</kbd>
          </button>
          <button type="button" className={canvasStyles.commandButton} title="Reset view (0)" onClick={onZoomReset}>
            Reset view <kbd>0</kbd>
          </button>
        </div>

        <label className={canvasStyles.commandSearch}>
          <span>Command</span>
          <input type="text" placeholder="Search commands" />
        </label>
      </div>

      <section className={cx(canvasStyles.canvasRegion, showGrid && canvasStyles.canvasRegionGrid)}>
        <div className={canvasStyles.canvasHelp}>
          Click to draw. Hold Space or middle-drag to pan. Wheel to zoom. Alt bypasses snapping.
        </div>
        <canvas
          className={cx(canvasStyles.canvasSurface, viewMode === "3d" && canvasStyles.canvasSurfaceThreeD, selectedTool === "pan" && canvasStyles.canvasSurfacePan)}
          aria-label="Floor plan editor canvas"
          tabIndex={0}
        />

        <div className={canvasStyles.overlayStatus}>
          <span>0 walls</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>

        <div className={canvasStyles.bottomControls}>
          <button type="button" className={cx(canvasStyles.footerButton, showGrid && canvasStyles.footerButtonActive)} onClick={onToggleGrid}>
            Grid
          </button>
          <button type="button" className={cx(canvasStyles.footerButton, showSnap && canvasStyles.footerButtonActive)} onClick={onToggleSnap}>
            Snap
          </button>
          <button type="button" className={cx(canvasStyles.footerButton, showRulers && canvasStyles.footerButtonActive)} onClick={onToggleRulers}>
            Rulers
          </button>
          <button type="button" className={cx(canvasStyles.footerButton, showMap && canvasStyles.footerButtonActive)} onClick={onToggleMap}>
            Map
          </button>
        </div>
      </section>
    </main>
  );
}

function PropertiesPanel() {
  return (
    <aside className={propertiesStyles.panel}>
      <div className={propertiesStyles.header}>PROPERTIES</div>
      <div className={propertiesStyles.body}>
        <div className={propertiesStyles.emptyState}>
          <div className={propertiesStyles.emptyIcon}>▢</div>
          <h3>No Selection</h3>
          <p>Select an element in the canvas to view and edit its properties.</p>
        </div>
      </div>
    </aside>
  );
}

export function DonorWorkspace() {
  const [projectName] = useState("Untitled Project");
  const [floors, setFloors] = useState<Floor[]>([
    { id: "ground", name: "Ground Floor" },
    { id: "first", name: "First Floor" },
  ]);
  const [activeFloorId, setActiveFloorId] = useState(floors[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>("cm");
  const [saved, setSaved] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("build");
  const [selectedTool, setSelectedTool] = useState<ToolKey>("select");
  const [wallMode, setWallMode] = useState<WallMode>("wall");
  const [wallHeight, setWallHeight] = useState(280);
  const [showGrid, setShowGrid] = useState(true);
  const [showSnap, setShowSnap] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showMap, setShowMap] = useState(true);

  return (
    <div className={styles.shell}>
      <TopBar
        projectName={projectName}
        floors={floors}
        activeFloorId={activeFloorId}
        viewMode={viewMode}
        zoom={zoom}
        displayUnit={displayUnit}
        isSaved={saved}
        onFloorChange={(floorId) => {
          setActiveFloorId(floorId);
          setSaved(false);
        }}
        onAddFloor={() => {
          const nextIndex = floors.length + 1;
          const nextFloor = {
            id: `floor-${nextIndex}`,
            name: nextIndex === 1 ? "Ground Floor" : `Floor ${nextIndex}`,
          };
          setFloors((current) => [...current, nextFloor]);
          setActiveFloorId(nextFloor.id);
          setSaved(false);
        }}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          setSaved(false);
        }}
        onDisplayUnitChange={(unit) => {
          setDisplayUnit(unit);
        }}
        onZoomIn={() => setZoom((value) => Math.min(10, Number((value * 1.25).toFixed(3))))}
        onZoomOut={() => setZoom((value) => Math.max(0.1, Number((value / 1.25).toFixed(3))))}
        onZoomReset={() => setZoom(1)}
        onSave={() => setSaved(true)}
      />

      <div className={styles.workspace}>
        <BuildPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedTool={selectedTool}
          wallMode={wallMode}
          wallHeight={wallHeight}
          onWallModeChange={(mode) => {
            setWallMode(mode);
            setSelectedTool("wall");
            setSaved(false);
          }}
          onToolChange={(tool) => {
            setSelectedTool(tool);
            setSaved(false);
          }}
          onWallHeightChange={(value) => {
            setWallHeight(value);
            setSaved(false);
          }}
        />

        <CanvasArea
          zoom={zoom}
          showGrid={showGrid}
          showSnap={showSnap}
          showRulers={showRulers}
          showMap={showMap}
          viewMode={viewMode}
          selectedTool={selectedTool}
          onZoomIn={() => setZoom((value) => Math.min(10, Number((value * 1.25).toFixed(3))))}
          onZoomOut={() => setZoom((value) => Math.max(0.1, Number((value / 1.25).toFixed(3))))}
          onZoomReset={() => setZoom(1)}
          onToggleGrid={() => setShowGrid((value) => !value)}
          onToggleSnap={() => setShowSnap((value) => !value)}
          onToggleRulers={() => setShowRulers((value) => !value)}
          onToggleMap={() => setShowMap((value) => !value)}
        />

        <PropertiesPanel />
      </div>
    </div>
  );
}
