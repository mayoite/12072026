import { inspectSvgDraftV2 } from "../security/svgSanitizerV2";
import type { SvgAiOperationV1 } from "./svgAiSchemasV1";

function target(document: Document, id: string): Element {
  const element = document.getElementById(id);
  if (!element) throw new Error(`AI operation target does not exist: ${id}`);
  if (element.getAttribute("data-locked") === "true") throw new Error(`AI operation target is locked: ${id}`);
  return element;
}

export function applySvgAiOperations(svg: string, operations: readonly SvgAiOperationV1[]): string {
  const document = new DOMParser().parseFromString(svg, "image/svg+xml");
  const root = document.documentElement;
  for (const operation of operations) {
    switch (operation.type) {
      case "insert": {
        if (document.getElementById(operation.id)) throw new Error(`Duplicate SVG id: ${operation.id}`);
        const element = document.createElementNS("http://www.w3.org/2000/svg", operation.element);
        element.id = operation.id;
        for (const [name, value] of Object.entries(operation.attributes)) element.setAttribute(name, value);
        (operation.parentId ? target(document, operation.parentId) : root).append(element);
        break;
      }
      case "set-attribute": target(document, operation.targetId).setAttribute(operation.name, operation.value); break;
      case "move": target(document, operation.targetId).setAttribute("transform", `translate(${operation.x} ${operation.y})`); break;
      case "resize": {
        const element = target(document, operation.targetId);
        element.setAttribute("width", String(operation.width));
        element.setAttribute("height", String(operation.height));
        break;
      }
      case "rotate": target(document, operation.targetId).setAttribute("transform", `rotate(${operation.degrees})`); break;
      case "duplicate": {
        if (document.getElementById(operation.newId)) throw new Error(`Duplicate SVG id: ${operation.newId}`);
        const clone = target(document, operation.targetId).cloneNode(true) as Element;
        clone.id = operation.newId;
        target(document, operation.targetId).after(clone);
        break;
      }
      case "remove": target(document, operation.targetId).remove(); break;
      case "rename": {
        if (document.getElementById(operation.newId)) throw new Error(`Duplicate SVG id: ${operation.newId}`);
        target(document, operation.targetId).id = operation.newId;
        break;
      }
      case "group": {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.id = operation.groupId;
        const elements = operation.targetIds.map((id) => target(document, id));
        elements[0].before(group);
        elements.forEach((element) => group.append(element));
        break;
      }
      case "ungroup": {
        const group = target(document, operation.targetId);
        group.replaceWith(...Array.from(group.childNodes));
        break;
      }
      case "reorder": {
        const element = target(document, operation.targetId);
        const parent = element.parentElement;
        if (!parent) throw new Error("Cannot reorder the SVG root");
        if (operation.position === "front") parent.append(element);
        else if (operation.position === "back") parent.prepend(element);
        else if (operation.position === "forward" && element.nextSibling) element.nextSibling.after(element);
        else if (operation.position === "backward" && element.previousSibling) element.previousSibling.before(element);
        break;
      }
      case "propose-dimensions": break;
    }
  }
  const output = new XMLSerializer().serializeToString(document);
  const inspection = inspectSvgDraftV2(output);
  if (!inspection.valid || !inspection.sanitizedSvg) {
    throw new Error(`AI preview failed validation: ${inspection.diagnostics.map((item) => item.code).join(", ")}`);
  }
  return inspection.sanitizedSvg;
}
