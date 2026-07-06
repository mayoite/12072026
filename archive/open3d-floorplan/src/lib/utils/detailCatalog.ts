import type { ConstructionDetailDef, DetailCategory } from '$lib/models/types';

type DetailGroup = {
  label: DetailCategory;
  subcategories: string[];
};

export const detailCatalog: ConstructionDetailDef[] = [
  {
    id: 'arch-exterior-wall-std',
    name: 'Exterior Wall Assembly',
    category: 'Architecture',
    subcategory: 'Walls',
    description: 'Typical insulated exterior wall build-up.',
    layers: [
      { id: 'gypsum', label: 'Gypsum Board 12.5mm', thickness: 1.25, material: 'Gypsum Board', color: '#f4f1ea', pattern: 'solid' },
      { id: 'stud', label: 'Metal Stud Cavity 90mm', thickness: 9, material: 'Steel Studs', color: '#cfd8dc', pattern: 'diagonal' },
      { id: 'insulation', label: 'Mineral Wool 50mm', thickness: 5, material: 'Insulation', color: '#b8e1ff', pattern: 'hatch' },
      { id: 'sheathing', label: 'Sheathing 15mm', thickness: 1.5, material: 'Sheathing', color: '#d7c4a8', pattern: 'solid' },
    ],
  },
  {
    id: 'arch-interior-partition',
    name: 'Interior Partition',
    category: 'Architecture',
    subcategory: 'Walls',
    description: 'Standard non-load-bearing partition wall.',
    layers: [
      { id: 'gyp-a', label: 'Gypsum Board 12.5mm', thickness: 1.25, material: 'Gypsum Board', color: '#f7f3ec', pattern: 'solid' },
      { id: 'stud-a', label: 'Metal Stud 70mm', thickness: 7, material: 'Steel Studs', color: '#d0d7de', pattern: 'diagonal' },
      { id: 'gyp-b', label: 'Gypsum Board 12.5mm', thickness: 1.25, material: 'Gypsum Board', color: '#f7f3ec', pattern: 'solid' },
    ],
  },
  {
    id: 'arch-floor-slab',
    name: 'Floor Slab Build-Up',
    category: 'Architecture',
    subcategory: 'Floors',
    description: 'Typical slab and finish stack.',
    layers: [
      { id: 'finish', label: 'Floor Finish 10mm', thickness: 1, material: 'Tile Finish', color: '#c8b79e', pattern: 'solid' },
      { id: 'screed', label: 'Screed 40mm', thickness: 4, material: 'Screed', color: '#d9c7b2', pattern: 'solid' },
      { id: 'slab', label: 'Concrete Slab 150mm', thickness: 15, material: 'Concrete', color: '#8d959d', pattern: 'hatch' },
    ],
  },
  {
    id: 'struct-foundation-strip',
    name: 'Strip Foundation',
    category: 'Structure',
    subcategory: 'Foundation',
    description: 'Conventional strip footing and stem wall.',
    layers: [
      { id: 'footing', label: 'Concrete Footing 300mm', thickness: 30, material: 'Concrete', color: '#7f8a94', pattern: 'solid' },
      { id: 'stem', label: 'Stem Wall 200mm', thickness: 20, material: 'Concrete Block', color: '#a8b0b8', pattern: 'hatch' },
    ],
  },
  {
    id: 'struct-beam-steel',
    name: 'Steel Beam Assembly',
    category: 'Structure',
    subcategory: 'Beams',
    description: 'Simple steel beam with fire protection.',
    layers: [
      { id: 'intumescent', label: 'Fire Protection 5mm', thickness: 0.5, material: 'Fire Protection', color: '#f3ddd2', pattern: 'solid' },
      { id: 'beam', label: 'Steel Beam 250mm', thickness: 25, material: 'Structural Steel', color: '#66727d', pattern: 'diagonal' },
    ],
  },
  {
    id: 'struct-column-reinforced',
    name: 'Reinforced Concrete Column',
    category: 'Structure',
    subcategory: 'Columns',
    description: 'Typical reinforced concrete column section.',
    layers: [{ id: 'rc', label: 'Reinforced Concrete', thickness: 40, material: 'Concrete', color: '#9099a2', pattern: 'hatch' }],
  },
  {
    id: 'mep-lighting-ceiling',
    name: 'Lighting Ceiling Zone',
    category: 'MEP',
    subcategory: 'Lighting',
    description: 'Ceiling allowance for luminaires and services.',
    layers: [
      { id: 'ceiling', label: 'Ceiling Void 100mm', thickness: 10, material: 'Air Void', color: '#dbeafe', pattern: 'solid' },
      { id: 'fixture', label: 'Luminaire Zone 60mm', thickness: 6, material: 'Lighting', color: '#fde68a', pattern: 'solid' },
    ],
  },
  {
    id: 'mep-plumbing-riser',
    name: 'Plumbing Riser Zone',
    category: 'MEP',
    subcategory: 'Plumbing',
    description: 'Vertical service zone for plumbing stacks.',
    layers: [
      { id: 'service', label: 'Service Void 80mm', thickness: 8, material: 'Service Void', color: '#bfdbfe', pattern: 'solid' },
      { id: 'pipe', label: 'Plumbing Chase 40mm', thickness: 4, material: 'Piping', color: '#38bdf8', pattern: 'diagonal' },
    ],
  },
  {
    id: 'mep-hvac-duct',
    name: 'HVAC Duct Zone',
    category: 'MEP',
    subcategory: 'HVAC',
    description: 'Allowance for supply and return ductwork.',
    layers: [
      { id: 'duct', label: 'Main Duct 250mm', thickness: 25, material: 'Galvanized Duct', color: '#9ca3af', pattern: 'solid' },
      { id: 'insulation-duct', label: 'Acoustic Insulation 25mm', thickness: 2.5, material: 'Insulation', color: '#c4b5fd', pattern: 'hatch' },
    ],
  },
];

export const detailCategories: DetailGroup[] = [
  { label: 'Architecture', subcategories: ['Walls', 'Floors', 'Roofs'] },
  { label: 'Structure', subcategories: ['Foundation', 'Columns', 'Beams'] },
  { label: 'MEP', subcategories: ['Lighting', 'Plumbing', 'HVAC'] },
];
