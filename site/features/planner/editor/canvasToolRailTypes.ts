export type CanvasToolRailCommandItem = {
  readonly kind: "command";
  readonly id: string;
  readonly label: string;
  readonly command: string;
  readonly disabledReason?: string;
};

export type CanvasToolRailToggleItem = {
  readonly kind: "toggle";
  readonly id: string;
  readonly label: string;
  readonly field: string;
  readonly disabledReason?: string;
};

export type CanvasToolRailPartFocusItem = {
  readonly kind: "part-focus";
  readonly id: string;
  readonly label: string;
  readonly partRole: string;
  readonly disabledReason?: string;
};

export type CanvasToolRailItem =
  | CanvasToolRailCommandItem
  | CanvasToolRailToggleItem
  | CanvasToolRailPartFocusItem;
