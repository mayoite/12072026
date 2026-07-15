import "server-only";

import { JSDOM } from "jsdom";

import type { SvgAssetCapabilityV2 } from "../model/svgAssetManifestV2";
import {
  SVG_ALLOWED_ATTRIBUTES_V2,
  SVG_ALLOWED_STYLE_PROPERTIES_V2,
  SVG_ALLOWED_TAGS_V2,
  SVG_MAX_ELEMENTS_V2,
  SVG_MAX_SOURCE_BYTES_V2,
  capabilitiesForSvgElement,
  isManagedSvgImageReference,
} from "./svgCapabilitiesV2";

export interface SvgSanitizerDiagnosticV2 {
  readonly code:
    | "DOCUMENT_TOO_LARGE"
    | "DOCTYPE_FORBIDDEN"
    | "MALFORMED_XML"
    | "TOO_MANY_ELEMENTS"
    | "UNSAFE_TAG"
    | "UNSAFE_ATTRIBUTE"
    | "UNSAFE_STYLE"
    | "UNSAFE_URL"
    | "DUPLICATE_ID"
    | "UNRESOLVED_REFERENCE";
  readonly elementId: string | null;
  readonly attribute?: string;
  readonly message: string;
}

export interface SvgDraftInspectionV2 {
  readonly valid: boolean;
  readonly originalSvg: string;
  readonly sanitizedSvg: string | null;
  readonly capabilities: readonly SvgAssetCapabilityV2[];
  readonly diagnostics: readonly SvgSanitizerDiagnosticV2[];
}

const allowedTags = new Set<string>(SVG_ALLOWED_TAGS_V2);
const allowedAttributes = new Set<string>(SVG_ALLOWED_ATTRIBUTES_V2);

function diagnostic(
  code: SvgSanitizerDiagnosticV2["code"],
  message: string,
  elementId: string | null = null,
  attribute?: string,
): SvgSanitizerDiagnosticV2 {
  return { code, elementId, attribute, message };
}

function fragmentReferences(value: string): string[] {
  return Array.from(value.matchAll(/url\(\s*["']?#([^\s"')]+)["']?\s*\)/g), (match) => match[1]);
}

function containsUnsafeUrl(value: string): boolean {
  const withoutFragments = value.replace(/url\(\s*["']?#[^\s"')]+["']?\s*\)/g, "");
  return /url\s*\(/i.test(withoutFragments);
}

function inspectStyle(
  element: Element,
  style: string,
  diagnostics: SvgSanitizerDiagnosticV2[],
  references: Array<{ elementId: string | null; attribute: string; target: string }>,
): void {
  for (const declaration of style.split(";")) {
    if (!declaration.trim()) continue;
    const separator = declaration.indexOf(":");
    const property = separator >= 0 ? declaration.slice(0, separator).trim().toLowerCase() : declaration.trim().toLowerCase();
    const value = separator >= 0 ? declaration.slice(separator + 1).trim() : "";
    if (!SVG_ALLOWED_STYLE_PROPERTIES_V2.has(property)) {
      diagnostics.push(diagnostic("UNSAFE_STYLE", `Style property "${property}" is not allowed`, element.id || null, "style"));
      continue;
    }
    if (containsUnsafeUrl(value)) {
      diagnostics.push(diagnostic("UNSAFE_URL", `Style property "${property}" contains an unmanaged URL`, element.id || null, "style"));
    }
    for (const target of fragmentReferences(value)) {
      references.push({ elementId: element.id || null, attribute: "style", target });
    }
  }
}

export function inspectSvgDraftV2(source: string): SvgDraftInspectionV2 {
  const diagnostics: SvgSanitizerDiagnosticV2[] = [];
  if (new TextEncoder().encode(source).byteLength > SVG_MAX_SOURCE_BYTES_V2) {
    diagnostics.push(diagnostic("DOCUMENT_TOO_LARGE", `SVG exceeds ${SVG_MAX_SOURCE_BYTES_V2} bytes`));
    return { valid: false, originalSvg: source, sanitizedSvg: null, capabilities: [], diagnostics };
  }
  if (/<!DOCTYPE|<!ENTITY/i.test(source)) {
    diagnostics.push(diagnostic("DOCTYPE_FORBIDDEN", "DOCTYPE and entity declarations are forbidden"));
    return { valid: false, originalSvg: source, sanitizedSvg: null, capabilities: [], diagnostics };
  }

  const window = new JSDOM("").window;
  try {
    const document = new window.DOMParser().parseFromString(source, "image/svg+xml");
    const parserError = document.querySelector("parsererror");
    const root = document.documentElement;
    if (parserError || root.localName !== "svg") {
      diagnostics.push(diagnostic("MALFORMED_XML", parserError?.textContent?.trim() || "Document root must be svg"));
      return { valid: false, originalSvg: source, sanitizedSvg: null, capabilities: [], diagnostics };
    }

    const elements = [root, ...Array.from(root.querySelectorAll("*"))];
    if (elements.length > SVG_MAX_ELEMENTS_V2) {
      diagnostics.push(diagnostic("TOO_MANY_ELEMENTS", `SVG exceeds ${SVG_MAX_ELEMENTS_V2} elements`));
      return { valid: false, originalSvg: source, sanitizedSvg: null, capabilities: [], diagnostics };
    }

    const ids = new Set<string>();
    const references: Array<{ elementId: string | null; attribute: string; target: string }> = [];
    for (const element of elements) {
      const elementId = element.id || null;
      if (!allowedTags.has(element.localName)) {
        diagnostics.push(diagnostic("UNSAFE_TAG", `Element <${element.localName}> is not allowed`, elementId));
      }
      if (element.id) {
        if (ids.has(element.id)) diagnostics.push(diagnostic("DUPLICATE_ID", `Duplicate id "${element.id}"`, element.id, "id"));
        ids.add(element.id);
      }
      for (const attribute of Array.from(element.attributes)) {
        const name = attribute.name;
        const value = attribute.value.trim();
        if (/^on/i.test(name) || !allowedAttributes.has(name)) {
          diagnostics.push(diagnostic("UNSAFE_ATTRIBUTE", `Attribute "${name}" is not allowed`, elementId, name));
          continue;
        }
        if (name === "style") {
          inspectStyle(element, value, diagnostics, references);
          continue;
        }
        if (name === "href" || name === "xlink:href") {
          if (value.startsWith("#")) {
            references.push({ elementId, attribute: name, target: value.slice(1) });
          } else if (element.localName !== "image" || !isManagedSvgImageReference(value)) {
            diagnostics.push(diagnostic("UNSAFE_URL", `Reference "${value}" is not managed`, elementId, name));
          }
        }
        if (containsUnsafeUrl(value)) {
          diagnostics.push(diagnostic("UNSAFE_URL", `Attribute "${name}" contains an unmanaged URL`, elementId, name));
        }
        for (const target of fragmentReferences(value)) {
          references.push({ elementId, attribute: name, target });
        }
      }
    }

    for (const reference of references) {
      if (!ids.has(reference.target)) {
        diagnostics.push(diagnostic(
          "UNRESOLVED_REFERENCE",
          `Reference "#${reference.target}" does not resolve`,
          reference.elementId,
          reference.attribute,
        ));
      }
    }

    const valid = diagnostics.length === 0;
    return {
      valid,
      originalSvg: source,
      sanitizedSvg: valid ? root.outerHTML : null,
      capabilities: valid ? capabilitiesForSvgElement(root) : [],
      diagnostics,
    };
  } finally {
    window.close();
  }
}

export function sanitizeSvgForPublishV2(source: string): string {
  const result = inspectSvgDraftV2(source);
  if (!result.valid || !result.sanitizedSvg) {
    const codes = result.diagnostics.map(({ code }) => code).join(", ");
    throw new Error(`SVG cannot be published: ${codes || "unknown validation failure"}`);
  }
  return result.sanitizedSvg;
}
