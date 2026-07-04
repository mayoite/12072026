import { createRectangularRoomProject } from "../../model/project";
import type { Open3dProject } from "../../model/types";

export interface LegacyRectScene {
  type: "cad-suite-planner-scene";
  version: 1;
  room: { widthMm: number; depthMm: number };
}

export interface ConversionReport {
  sourceVersion: string;
  targetVersion: 1;
  backupRequired: boolean;
  preserved: string[];
  transformed: string[];
  approximated: string[];
  unsupported: string[];
}

export function convertLegacyRectScene(
  scene: LegacyRectScene,
  idFactory: () => string,
): { project: Open3dProject; report: ConversionReport } {
  if (scene.room.widthMm <= 0 || scene.room.depthMm <= 0) {
    throw new Error("Legacy room dimensions must be positive.");
  }
  return {
    project: createRectangularRoomProject({
      widthMm: scene.room.widthMm,
      depthMm: scene.room.depthMm,
      idFactory,
      name: "Migrated plan",
    }),
    report: {
      sourceVersion: `${scene.type}@${scene.version}`,
      targetVersion: 1,
      backupRequired: true,
      preserved: ["room.widthMm", "room.depthMm"],
      transformed: ["room boundary -> four canonical walls"],
      approximated: [],
      unsupported: [],
    },
  };
}
