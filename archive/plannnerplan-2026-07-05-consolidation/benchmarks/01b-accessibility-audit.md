# Phase 01B Accessibility and Input Audit

Date: 2026-07-03  
Status: advisory, source-backed audit  
Scope: `open3d-next-staging` only; no production code or plan changes

## Evidence boundary

- `http://localhost:3101` responded with HTTP 200.
- No in-app browser backend was attached. Keyboard, pointer, viewport, accessibility-tree, computed-style, screenshot, and console checks could not be executed.
- Findings below distinguish source-proven results from browser checks that remain blocked. “Pass” means the required path is present in current source, not that real-browser behavior is verified.
- Official comparison basis: [WCAG 2.2 keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), [WCAG 2.2 focus visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), and [`lostpointercapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event).

## Findings

| Area | Result | Evidence |
|---|---|---|
| Server availability | Pass | Root returned HTTP 200. |
| Keyboard focusability | Partial | Buttons are native controls; canvas has `tabIndex={0}`; buttons and canvas have token-based `:focus-visible`. Browser focus order and visible ring were not verified. |
| Toolbar keyboard model | Partial | Tab navigation should reach each native button, but `role="toolbar"` has no arrow-key navigation or roving focus. |
| `W` activation | Fail | Registry and button advertise `W`, but the global key handler has no `W` branch. |
| Escape cancel | Pass in source; browser blocked | `Escape` dispatches `runCommand("cancel")`; cancel releases capture and clears start, preview, and snap state. |
| Explicit Cancel | Pass in source; browser blocked | Cancel button uses the same command path. |
| Undo shortcut | Pass in source; browser blocked | Ctrl/Cmd+Z prevents default and uses shared undo/cancel behavior. |
| Pointer capture | Pass in source; browser blocked | First pointer is captured and tracked by ID; additional pointers are ignored while active. |
| Pointer-up release | Pass in source; browser blocked | Matching pointer-up releases capture and clears pan state. |
| Pointer-cancel recovery | Pass in source; browser blocked | Matching pointer cancellation ends the pointer then clears command state. |
| Unexpected capture loss | Pass in source; browser blocked | `lostpointercapture` cancels when the tracked pointer still owns the session. |
| Window blur/unmount recovery | Pass in source; browser blocked | Both converge on cancel; key state is cleared on blur. |
| Pointer buttons | Partial | Middle/Space pan and primary draw are separated. A non-primary, non-middle pointer is captured before returning, leaving capture until pointer-up/context-menu. |
| Pan | Pass in source; browser blocked | Space-drag and middle-drag update only viewport origin. |
| Wheel zoom | Pass in source; browser blocked | Wheel prevents default and zooms around the pointer with bounded scale. |
| Keyboard zoom | Pass in source; browser blocked | `+`, `=`, `-`, and `0` invoke shared zoom commands. Browser/keyboard-layout conflicts remain untested. |
| Resize and DPR | Pass in source; browser blocked | `ResizeObserver` updates CSS size; backing dimensions use device-pixel ratio; transforms operate in CSS pixels. |
| Snap feedback | Partial | Marker size and diagnostics expose snap kind, but target identity, guide, distance/angle, invalid state, and nearest-candidate proof are absent. |
| Deterministic snap target | Fail | Endpoint choice uses the first eligible endpoint in array order, not the nearest eligible candidate with explicit tie-breaking. |
| Keyboard-equivalent geometry | Fail | WCAG guidance does not exempt straight-line/endpoint geometry. The canvas has no keyboard method to choose endpoints, enter coordinates, move selection, or create a wall. |
| `role="application"` | Fail pending justification | The canvas declares application mode without a complete keyboard interaction model. This can suppress assistive-technology browse commands while offering no equivalent geometry workflow. |
| Canvas alternative | Fail | No synchronized project tree/list exposes walls, endpoints, selection, lock/visibility, or editable properties outside pixels. |
| Accessible names/help | Partial | Main, toolbar, section, canvas, diagnostics, and help/status relationships are named. Canvas help describes pointer-only drawing. |
| Live-region behavior | Fail | The entire diagnostics group is `aria-live="polite"`. Snap kind and latency can change on pointer movement/animation frames, risking announcement flooding and obscuring meaningful state changes. |
| Active-tool announcement | Partial | A screen-reader-only statement says Draw wall is active, but it is static and cannot represent tool changes. |
| Focus restoration | Partial | Commands focus the canvas after toolbar activation. Popover/palette focus behavior does not yet exist. |
| Canonical theme | Pass in source | Staging CSS imports `site/app/css/core/tokens/theme.css` and uses semantic tokens, including focus, surface, border, and canvas colors. Computed values and import-order effects were not browser-verified. |
| Color-independent state | Fail | Snap state is primarily marker size/color plus diagnostics text; preview, candidate, constraint, invalid, and selection states are not fully differentiated. |
| Responsive tiers | Fail | Media queries reflow/scroll controls, but the same editing capability remains active at all widths. There is no explicit desktop/tablet/small capability state or limited-editing guard. |
| Touch gesture arbitration | Fail | `touch-action: none` disables native gestures, but no two-pointer pan/pinch policy or touch-versus-draw mode is defined. |
| Reduced motion | Partial | A media query disables smooth scrolling only; no current animation was identified. |
| Console errors | Blocked | No browser backend was available; HTTP 200 does not prove a clean console or hydration. |

## Acceptance recommendations

1. Do not approve Phase 01B accessibility/input verification until real-browser evidence covers keyboard, mouse, touch/pen emulation, capture loss, blur, resize, DPR, responsive widths, accessibility tree, and console.
2. Implement or remove every displayed shortcut. `W` must invoke the same typed command as the button and command search, with input-field and browser-shortcut guards.
3. Replace unjustified `role="application"` with conventional semantics, or provide and test a complete application keyboard model with documented entry/exit behavior.
4. Add a keyboard-equivalent endpoint-defined wall workflow: coordinate entry or a navigable project/point model with predictable step movement, commit, cancel, and undo.
5. Add a synchronized non-canvas project structure for wall/endpoint discovery, selection, naming, visibility/lock state, and property editing.
6. Restrict the live region to low-frequency semantic messages such as “wall started,” “endpoint snap,” “wall committed,” “cancelled,” and errors. Keep pointer latency and continuously changing measurements outside live regions.
7. Select the nearest eligible endpoint within screen-space tolerance with stable tie-breaking; expose snap target identity, guide, and measured length/angle without color-only meaning.
8. Define explicit responsive capability tiers. Small screens must not silently retain unsupported authoring; tablet touch gestures need an intentional draw/pan/zoom mode and tested multi-pointer policy.
9. Verify focus order and focus visibility in normal, high-contrast/forced-colors, 200%/400% zoom, and narrow viewports. Decide whether toolbar arrow-key navigation is part of the product keyboard contract and implement it consistently.
10. Preserve the canonical `site/app/css/` import boundary. Browser evidence must confirm token resolution, contrast, focus-ring visibility, and stable CSS ordering.

## Required browser evidence

Before changing this audit from source-only to verified:

- Tab/Shift+Tab sequence and visible focus capture.
- `W`, Escape, Cancel, undo, zoom, and reset from canvas and toolbar focus.
- Draw start → unexpected capture loss/pointer cancel/blur → no wall and no history entry.
- Space/middle pan and wheel zoom without geometry mutation.
- Mouse plus touch/pen emulation, including second-pointer behavior.
- 1280+, 768–1279, and below-768 viewport capability checks.
- Screen-reader/accessibility-tree inspection of canvas, toolbar, help, and status.
- Live-region announcement sampling during pointer movement.
- Computed canonical tokens and focus/contrast checks.
- Console and hydration output with no unowned errors or warnings.

## Audit conclusion

The current source materially improves pointer recovery, zoom/pan separation, resize/DPR handling, focus styling, and canonical theme use. It is not accessibility- or input-verified. Release-blocking failures remain: advertised-but-inactive `W`, no keyboard-equivalent geometry, no non-canvas project structure, high-frequency live-region updates, first-match snapping, unsupported application role, and no honest responsive/touch capability tiers.
