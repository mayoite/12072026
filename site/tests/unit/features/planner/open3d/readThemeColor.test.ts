/**
 * Unit lock: resolvePaintColor / readThreeThemeColor for CSS var() paint path.
 * THREE.Color cannot parse var(--token); wall/furniture materials resolve first.
 */
import { afterEach, describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  normalizeTokenName,
  readThemeColor,
  readThreeThemeColor,
  resolvePaintColor,
  themeColorRef,
} from "@/features/planner/open3d/shared/readThemeColor";

afterEach(() => {
  document.documentElement.style.removeProperty("--text-inverse-body");
  document.documentElement.style.removeProperty("--surface-page");
  document.documentElement.style.removeProperty("--color-block-desk");
});

describe("normalizeTokenName / themeColorRef", () => {
  it("normalizes bare token to --token and builds var() ref", () => {
    expect(normalizeTokenName("text-inverse-body")).toBe("--text-inverse-body");
    expect(normalizeTokenName("--text-inverse-body")).toBe("--text-inverse-body");
    expect(themeColorRef("text-inverse-body")).toBe("var(--text-inverse-body)");
  });
});

describe("resolvePaintColor — var() path", () => {
  it("resolves var(--token) from document theme (primary wall/furniture paint path)", () => {
    document.documentElement.style.setProperty("--text-inverse-body", "#3a3a3a");
    expect(resolvePaintColor("var(--text-inverse-body)", "--text-inverse-body")).toBe(
      "#3a3a3a",
    );
  });

  it("resolves bare --token keys the same way", () => {
    document.documentElement.style.setProperty("--color-block-desk", "#c8b8a0");
    expect(resolvePaintColor("--color-block-desk", "--color-block-desk")).toBe(
      "#c8b8a0",
    );
  });

  it("passes through explicit hex/rgb (user paint) unchanged", () => {
    expect(resolvePaintColor("#ff00aa", "--text-inverse-body")).toBe("#ff00aa");
    expect(resolvePaintColor("rgb(10, 20, 30)", "--text-inverse-body")).toBe(
      "rgb(10, 20, 30)",
    );
  });

  it("throws when var() token is missing from theme (caller must catch for THREE)", () => {
    expect(() =>
      resolvePaintColor("var(--text-inverse-body)", "--text-inverse-body"),
    ).toThrow(/Missing theme token/);
  });

  it("resolved var() value is legal THREE.Color input (hex)", () => {
    document.documentElement.style.setProperty("--text-inverse-body", "#9ca3af");
    const resolved = resolvePaintColor(
      "var(--text-inverse-body)",
      "--text-inverse-body",
    );
    expect(() => new THREE.Color(resolved)).not.toThrow();
    expect(new THREE.Color(resolved).getHexString()).toMatch(/^[0-9a-f]{6}$/i);
  });
});

describe("readThemeColor", () => {
  it("reads a set token from documentElement", () => {
    document.documentElement.style.setProperty("--surface-page", "#f5f5f5");
    expect(readThemeColor("--surface-page")).toBe("#f5f5f5");
  });

  it("throws on missing token", () => {
    expect(() => readThemeColor("--definitely-missing-token-xyz")).toThrow(
      /Missing theme token/,
    );
  });
});

describe("readThreeThemeColor", () => {
  it("returns resolved theme value when token exists", () => {
    document.documentElement.style.setProperty("--surface-page", "#eeeeee");
    expect(readThreeThemeColor("--surface-page", "#ffffff")).toBe("#eeeeee");
  });

  it("returns hex fallback when token missing (SSR-safe THREE adapter)", () => {
    expect(readThreeThemeColor("--definitely-missing-token-xyz", "#abcdef")).toBe(
      "#abcdef",
    );
  });

  it("fallback hex is parseable by THREE.Color", () => {
    const value = readThreeThemeColor("--missing-for-three", "#112233");
    expect(new THREE.Color(value).getHexString()).toBe("112233");
  });
});
