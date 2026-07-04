import {
  Group,
  Rect,
  Line,
  Circle,
  Ellipse,
  Path,
  Polygon,
  Polyline,
  Triangle,
  IText,
  Point,
  util,
  type FabricObject,
} from 'fabric';
import { resolvePlannerColor } from './resolveColor';

type Named<T> = T & { name?: string };

type FabricOptionBag = Record<string, unknown>;

interface ShapePartDefinition extends FabricOptionBag {
  fill?: string | null;
  stroke?: string | null;
}

interface ShapePart {
  type: string;
  definition: ShapePartDefinition;
  line?: [number, number, number, number];
  path?: string;
}

interface TextProperties {
  text: string;
  direction?: string;
  font_size?: number;
  name?: string;
}

interface ShapeObject {
  parts: ShapePart[];
  title?: string;
}

interface GenericFurnitureObject {
  width?: number;
  height?: number;
  variant?: string;
  title?: string;
}

interface ChairDef extends ShapeObject {
  width: number;
  height: number;
}

interface TableDef {
  shape?: string;
  width: number;
  height: number;
  title?: string;
  chairs: number;
  topChairs: number;
  bottomChairs: number;
  leftChairs: number;
  rightChairs: number;
}

const
  RL_FILL = 'var(--color-white-50)',
  RL_STROKE = 'var(--color-dark-midnight-blue-850)',
  RL_PREVIEW_WIDTH = 140,
  RL_PREVIEW_HEIGHT = 120,
  RL_CHAIR_STROKE = 'var(--text-inverse-subtle)',
  RL_CHAIR_FILL = 'var(--color-bronze-200)',
  RL_CHAIR_TUCK = 6,
  RL_VIEW_WIDTH = 120,
  RL_VIEW_HEIGHT = 56,
  RL_FOOT = 12,
  RL_AISLEGAP = 12 * 3,
  RL_ROOM_OUTER_SPACING = 48,
  RL_ROOM_INNER_SPACING = 4,
  RL_ROOM_STROKE = 'var(--color-dark-midnight-blue-850)',
  RL_CORNER_FILL = '#88f',
  RL_UNGROUPABLES = ['CHAIR', 'MISCELLANEOUS', 'DOOR'],
  RL_CREDIT_TEXT = 'Created By https://github.com/ilhccc',
  RL_CREDIT_TEXT_PARAMS = { fontSize: 12, fontFamily: 'Arial', fill: 'var(--text-inverse-subtle)', left: 12 };


const createText = (properties: TextProperties) => {
  let { text } = properties;
  if (properties.direction === 'VERTICAL') {
    const chars = [];
    for (const char of text) {
      chars.push(char);
    }
    text = chars.join('\n');
  }

  const textObj = new IText(text, {
    fontSize: properties.font_size,
    lineHeight: 0.8,
    hasControls: false
  }) as Named<IText>;
  textObj.name = properties.name;
  return textObj;
};


/** Create Basic Shape  */
const createBasicShape = (part: ShapePart, stroke: string = 'var(--color-bronze-300)', fill: string = 'white') => {
  if (part.definition.fill == null)
    part.definition.fill = fill;

  if (part.definition.stroke == null)
    part.definition.stroke = stroke;
  else if (part.definition.stroke === 'chair')
    part.definition.stroke = RL_CHAIR_STROKE;

  part.definition.fill = resolvePlannerColor(part.definition.fill, '#ffffff');
  part.definition.stroke = resolvePlannerColor(part.definition.stroke, '#091117');

  // Crisp, consistent line-work: keep strokes 1 unit regardless of zoom/scale
  // and round rectangle corners so furniture reads as drawn shapes, not blocks.
  if (part.definition.strokeWidth == null) part.definition.strokeWidth = 1;
  part.definition.strokeUniform = true;
  if (part.type === 'rect' && part.definition.rx == null && part.definition.ry == null) {
    part.definition.rx = 2;
    part.definition.ry = 2;
  }

  const definition = part.definition as ConstructorParameters<typeof Rect>[0];
  let fObj: FabricObject | undefined;

  switch (part.type) {
    case 'circle':
      fObj = new Circle(definition as ConstructorParameters<typeof Circle>[0]);
      break;
    case 'ellipse':
      fObj = new Ellipse(definition as ConstructorParameters<typeof Ellipse>[0]);
      break;
    case 'line':
      fObj = new Line(part.line as ConstructorParameters<typeof Line>[0], definition);
      break;
    case 'path':
      fObj = new Path(part.path as ConstructorParameters<typeof Path>[0], definition);
      break;
    case 'polygon':
      fObj = new Polygon(definition as unknown as ConstructorParameters<typeof Polygon>[0]);
      break;
    case 'polyline':
      fObj = new Polyline(definition as unknown as ConstructorParameters<typeof Polyline>[0]);
      break;
    case 'rect':
      fObj = new Rect(definition);
      break;
    case 'triangle':
      fObj = new Triangle(definition);
      break;
  }

  return (fObj);
};


const createFurniture = (type: string, object: unknown, chair: unknown = {}): FabricObject => {
  if (type === 'TABLE') {
    return createTable(object as TableDef, chair as ChairDef);
  } else if (type === 'TEXT') {
    return createText(object as TextProperties);
  } else if (type === 'LAYOUT') {
    return object as FabricObject;
  } else if (type === 'GENERIC' || type === 'MISC' || type === 'FURNITURE') {
    // Support for main catalog items in the replacement (simple rect, no chairs)
    return createGenericFurniture(object as GenericFurnitureObject);
  } else {
    return createShape(object as ShapeObject, RL_STROKE, RL_FILL, type);
  }
};

// Generic rect support for swapping in main Oando catalog items (title + width/height in fabric units)
const createGenericFurniture = (object: GenericFurnitureObject) => {
  const w = object.width || 60;
  const h = object.height || 50;
  const variant = object.variant || "furniture";
  const isRoom = variant === "room";
  const isZone = variant === "zone";
  const rect = new Rect({
    left: 0,
    top: 0,
    width: w,
    height: h,
    fill: resolvePlannerColor(
      isZone ? 'var(--surface-accent-wash)' : isRoom ? 'var(--overlay-inverse-06)' : 'var(--color-ecru-300)',
      '#DED2B6',
    ),
    stroke: resolvePlannerColor(
      isZone ? 'var(--color-primary)' : isRoom ? 'var(--text-muted)' : 'var(--color-ecru-800)',
      '#5C4F3B',
    ),
    strokeDashArray: isZone ? [10, 6] : undefined,
    strokeWidth: isZone ? 3 : 2,
    strokeUniform: true,
    rx: isRoom || isZone ? 0 : 3,
    ry: isRoom || isZone ? 0 : 3,
    originX: 'center',
    originY: 'center',
  });
  const group = new Group([rect], {
    hasControls: true,
    originX: 'center',
    originY: 'center',
  }) as Named<Group>;
  group.name = isZone
    ? `DRAW:rectangle:${object.title || 'Zone'}`
    : isRoom
      ? `ROOM:${object.title || 'Room'}`
      : `GENERIC:${object.title || 'Item'}`;
  return group;
};

/** Adding Chairs */
const createShape = (object: ShapeObject, stroke = RL_CHAIR_STROKE, fill = RL_CHAIR_FILL, type: string = 'CHAIR'): Group => {
  const parts = object.parts
    .map((obj) => createBasicShape(obj, stroke, fill))
    .filter((obj): obj is FabricObject => obj != null);
  const group = new Group(parts, {
    hasControls: false,
    originX: 'center',
    originY: 'center'
  }) as Named<Group>;
  group.name = `${type}:${object.title}`;

  return group;
};


// All Create[Name]Object() functions should return a group

const createTable = (def: TableDef, RL_DEFAULT_CHAIR: ChairDef, type: string = 'TABLE') => {
  // tables with chairs have the chairs full-height around the table

  const components: Named<FabricObject>[] = [];
  let index = 0;

  // Note that we're using the provided width and height for table placement
  // Issues may arise if rendered shape is larger/smaller, since it's positioned from center point
  const chairWidth = RL_DEFAULT_CHAIR.width;
  const chairHeight = RL_DEFAULT_CHAIR.height;
  const tableLeft = def.leftChairs > 0 ? (chairHeight - RL_CHAIR_TUCK) : 0;
  const tableTop = (chairHeight - RL_CHAIR_TUCK);

  if (def.shape == 'circle') {

    const origin_x = def.width / 2 + chairHeight - RL_CHAIR_TUCK;
    const origin_y = def.width / 2 + chairHeight - RL_CHAIR_TUCK;
    const x2 = origin_x;
    const y2 = 0 + chairHeight / 2;

    const rotation_origin = new Point(origin_x, origin_y);

    const tableRadius = def.width / 2;
    const radius = def.width / 2 + chairHeight;   // outer radius of whole shape unit
    let angle = 0;
    const angleIncrement = 360 / (def.chairs > 0 ? def.chairs : 1);

    for (let x = 0; x < def.chairs; ++x) {
      // Note that width and height are the same for circle tables
      // width of whole area when done
      const width = def.width + chairHeight - (RL_CHAIR_TUCK * 2);

      components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);

      const angle_radians = util.degreesToRadians(angle);
      const dx = x2 - rotation_origin.x;
      const dy = y2 - rotation_origin.y;
      const end = new Point(
        rotation_origin.x + dx * Math.cos(angle_radians) - dy * Math.sin(angle_radians),
        rotation_origin.y + dx * Math.sin(angle_radians) + dy * Math.cos(angle_radians)
      );
      components[index].left = end.x;
      components[index].top = end.y;
      components[index].angle = (angle + 180 > 360) ? (angle - 180) : (angle + 180);
      index++;
      angle += angleIncrement;
    }

    const tableCircle = {
      left: origin_x,
      top: origin_y,
      radius: tableRadius,
      fill: resolvePlannerColor(RL_FILL, '#ffffff'),
      stroke: resolvePlannerColor(RL_STROKE, '#091117'),
      strokeWidth: 1,
      strokeUniform: true,
      originX: 'center',
      originY: 'center'
    } as ConstructorParameters<typeof Circle>[0];
    components[index] = new Circle(tableCircle) as Named<Circle>;
    components[index].name = 'DESK';

  } else if (def.shape == 'rect') {
    const tableRect = {
      width: def.width,
      height: def.height,
      fill: resolvePlannerColor(RL_FILL, '#ffffff'),
      stroke: resolvePlannerColor(RL_STROKE, '#091117'),
      strokeWidth: 1,
      strokeUniform: true,
      rx: 3,
      ry: 3
    };

    // calculate gap between chairs, with extra for gap to end of table
    let gap = 0, firstOffset = 0, leftOffset = 0, topOffset = 0;

    // top chair row
    // Note that chairs 'look up' by default, so the bottom row isn't rotated
    // and the top row is.
    gap = (def.width - (def.topChairs * chairWidth)) / (def.topChairs + 1);
    firstOffset = gap + tableLeft;
    leftOffset = firstOffset;
    topOffset = 0;

    for (let x = 0; x < def.topChairs; x++) {
      components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
      components[index].angle = -180;
      components[index].left = leftOffset + chairWidth / 2;
      components[index].top = topOffset + chairHeight / 2;
      index++;

      leftOffset += (chairWidth + gap);
    }

    // bottom chair row
    gap = (def.width - (def.bottomChairs * chairWidth)) / (def.bottomChairs + 1);
    firstOffset = gap + tableLeft;
    leftOffset = firstOffset;
    topOffset = tableRect.height + chairHeight - (RL_CHAIR_TUCK * 2);

    for (let x = 0; x < def.bottomChairs; x++) {
      components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
      components[index].left = leftOffset + chairWidth / 2;
      components[index].top = topOffset + chairWidth / 2;
      ++index;

      leftOffset += (chairWidth + gap);
    }

    // left chair row
    gap = (def.height - (def.leftChairs * chairWidth)) / (def.leftChairs + 1);
    leftOffset = chairWidth / 2;
    topOffset = tableTop + gap + chairWidth / 2;  // top of table plus first gap, then to center

    for (let x = 0; x < def.leftChairs; x++) {
      components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
      components[index].angle = 90;
      components[index].left = leftOffset;
      components[index].top = topOffset;
      ++index;

      topOffset += (chairWidth + gap);
    }

    // right chair row
    gap = (def.height - (def.rightChairs * chairWidth)) / (def.rightChairs + 1);
    leftOffset = tableRect.width + chairWidth / 2;
    topOffset = tableTop + gap + chairWidth / 2;  // top of table plus first gap, then to center

    for (let x = 0; x < def.rightChairs; x++) {
      components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
      components[index].angle = -90;
      components[index].left = leftOffset + chairHeight - (RL_CHAIR_TUCK * 2);
      components[index].top = topOffset;
      ++index;

      topOffset += (chairWidth + gap);
    }

    // add table on top of chairs
    const rectObj = new Rect(tableRect as ConstructorParameters<typeof Rect>[0]) as Named<Rect>;
    rectObj.name = 'DESK';
    components[index] = rectObj;
    components[index].left = tableLeft;
    components[index].top = tableTop;
  }

  const tableGroup = new Group(components, {
    left: 0,
    top: 0,
    hasControls: false,
    originX: 'center',
    originY: 'center'
  }) as Named<Group>;
  tableGroup.name = `${type}:${def.title}`;

  return tableGroup;
};

export {
  createBasicShape,
  createTable,
  createShape,
  createText,
  createFurniture,

  RL_FILL,
  RL_STROKE,
  RL_CHAIR_STROKE,
  RL_CHAIR_FILL,
  RL_CHAIR_TUCK,
  RL_PREVIEW_HEIGHT,
  RL_PREVIEW_WIDTH,
  RL_VIEW_WIDTH,
  RL_VIEW_HEIGHT,
  RL_FOOT,
  RL_AISLEGAP,
  RL_ROOM_OUTER_SPACING,
  RL_ROOM_INNER_SPACING,
  RL_ROOM_STROKE,
  RL_CORNER_FILL,
  RL_UNGROUPABLES,
  RL_CREDIT_TEXT,
  RL_CREDIT_TEXT_PARAMS
};
