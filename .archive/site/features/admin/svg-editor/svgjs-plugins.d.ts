import "@svgdotjs/svg.js";

declare module "@svgdotjs/svg.js" {
  interface Element {
    draggable(enable?: boolean): this;
    select(enable?: boolean | { deepSelect?: boolean }): this;
    resize(enable?: boolean): this;
  }
}
