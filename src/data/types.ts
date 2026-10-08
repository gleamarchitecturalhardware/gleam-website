import type { FinishCode } from './finishes';

export type LeverShape = 'round' | 'square' | 'flat' | 'taper' | 'wave';

/**
 * Describes which drawing to use for a product. Every drawing has fixed
 * dimension slots (A, B, C, D) that match the `dims` list on the product.
 */
export type ArtSpec =
  | { kind: 'lever'; lever: LeverShape; rose: 'round' | 'square' }
  | { kind: 'plate'; lever: LeverShape; plate: 'standard' | 'slim'; lock: 'key' | 'turn' | 'none' }
  | { kind: 'pull'; bar: 'round' | 'square' | 'flat' | 'd' }
  | { kind: 'digital'; handle: 'lever' | 'pull'; fingerprint: boolean }
  | { kind: 'mortise'; lock: 'key' | 'wc' }
  | { kind: 'cylinder'; turn: boolean }
  | { kind: 'hinge'; bearings: 2 | 4; holes: 3 | 4 }
  | { kind: 'closer'; arm: 'standard' | 'slide' }
  | { kind: 'floorspring' }
  | { kind: 'towerbolt' }
  | { kind: 'stopper'; type: 'floor' | 'magnetic' }
  | { kind: 'viewer' }
  | { kind: 'cabinet'; bar: 'round' | 'square' | 'knurl' }
  | { kind: 'knob'; shape: 'round' | 'disc' }
  | { kind: 'glass'; type: 'patch' | 'shower' };

export type CategorySlug =
  | 'mortise-handles'
  | 'pull-handles'
  | 'digital-locks'
  | 'locks-cylinders'
  | 'hinges'
  | 'door-controls'
  | 'door-accessories'
  | 'cabinet-hardware'
  | 'glass-fittings';

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  /** Product used to draw the category thumbnail. */
  cover: string;
}

export interface Dim {
  ref: string;
  label: string;
  value: string;
}

export interface SizeTable {
  columns: string[];
  rows: string[][];
}

export interface Product {
  slug: string;
  code: string;
  name: string;
  type: string;
  category: CategorySlug;
  summary: string;
  description: string[];
  finishes: FinishCode[];
  art: ArtSpec;
  dims: Dim[];
  specs: [string, string][];
  features: string[];
  inBox: string[];
  suitableFor: string[];
  sizes?: SizeTable;
  isNew?: boolean;
  featured?: boolean;
}
