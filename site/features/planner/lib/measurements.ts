"use client";

import type { PlannerShapeMeta } from "@/features/planner/shared/types/planner";
import { canvasUnitsToMillimeters } from "@/features/planner/lib/calibrationScale";
import type { PlannerUnitSystem } from "../model";

export type MeasurementUnit = "mm" | "ft-in";

const MM_PER_INCH = 25.4;
const INCHES_PER_FOOT = 12;

export function plannerUnitSystemToMeasurementUnit(unitSystem: PlannerUnitSystem | null | undefined): MeasurementUnit {
  return unitSystem === "imperial" ? "ft-in" : "mm";
}

export function formatMillimeters(mm: number) {
  return `${Math.round(mm).toLocaleString("en-IN")} mm`;
}

export function formatFeetAndInches(mm: number) {
  const totalInches = Math.max(0, Math.round(mm / MM_PER_INCH));
  const feet = Math.floor(totalInches / INCHES_PER_FOOT);
  const inches = totalInches % INCHES_PER_FOOT;
  return `${feet}' ${inches}"`;
}

export function formatLength(mm: number, unitSystem: MeasurementUnit) {
  return unitSystem === "ft-in" ? formatFeetAndInches(mm) : formatMillimeters(mm);
}

export function formatMeasurementInputValue(mm: number, unitSystem: MeasurementUnit) {
  return unitSystem === "ft-in" ? formatFeetAndInches(mm) : String(Math.round(mm));
}

function parseMetricMeasurementInput(value: string) {
  const normalized = value.trim().replace(/,/g, "").replace(/\s*mm$/i, "");
  if (normalized.length === 0) return null;

  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return Math.round(parsed);
}

function parseFeetAndInchesInput(value: string) {
  const normalized = value.trim().toLowerCase().replace(/′/g, "'").replace(/″/g, '"');
  if (normalized.length === 0) return null;

  const feetAndInchesMatch = normalized.match(
    /^(?:([+-]?\d+(?:\.\d+)?)\s*(?:'|ft|feet))?\s*(?:([+-]?\d+(?:\.\d+)?)\s*(?:"|in|inch|inches))?$/,
  );

  if (feetAndInchesMatch) {
    const feetRaw = feetAndInchesMatch[1];
    const inchesRaw = feetAndInchesMatch[2];
    const feetValue = feetRaw ? Number.parseFloat(feetRaw) : 0;
    const inchesValue = inchesRaw ? Number.parseFloat(inchesRaw) : 0;

    if (
      (feetRaw || inchesRaw) &&
      Number.isFinite(feetValue) &&
      Number.isFinite(inchesValue)
    ) {
      const totalInches = feetValue * INCHES_PER_FOOT + inchesValue;
      return totalInches > 0 ? Math.round(totalInches * MM_PER_INCH) : null;
    }
  }

  const plainPairMatch = normalized.match(/^(\d+)\s+(\d+(?:\.\d+)?)$/);
  if (!plainPairMatch) return null;

  const feetValue = Number.parseFloat(plainPairMatch[1]);
  const inchesValue = Number.parseFloat(plainPairMatch[2]);
  if (!Number.isFinite(feetValue) || !Number.isFinite(inchesValue)) return null;

  const totalInches = feetValue * INCHES_PER_FOOT + inchesValue;
  return totalInches > 0 ? Math.round(totalInches * MM_PER_INCH) : null;
}

export function parseMeasurementInput(value: string, unitSystem: MeasurementUnit) {
  return unitSystem === "ft-in" ? parseFeetAndInchesInput(value) : parseMetricMeasurementInput(value);
}

export function formatMetricFromBounds(bounds: { w: number; h: number }, unitSystem: MeasurementUnit) {
  return `W ${formatLength(canvasUnitsToMillimeters(bounds.w), unitSystem)} x H ${formatLength(canvasUnitsToMillimeters(bounds.h), unitSystem)}`;
}

export function formatDimensionPair(widthMm: number, depthMm: number, unitSystem: MeasurementUnit) {
  return `${formatLength(widthMm, unitSystem)} x ${formatLength(depthMm, unitSystem)}`;
}

export function formatArea(areaMm2: number, unitSystem: MeasurementUnit) {
  if (unitSystem === "ft-in") {
    return `${(areaMm2 / 92903.04).toFixed(1)} sq ft`;
  }

  return `${(areaMm2 / 1000000).toFixed(1)} m2`;
}

export function getShapeMeta(meta: unknown): PlannerShapeMeta {
  return meta && typeof meta === "object" ? (meta as PlannerShapeMeta) : {};
}
