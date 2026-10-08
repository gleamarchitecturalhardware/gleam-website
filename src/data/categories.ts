import type { Category, CategorySlug } from './types';

export const categories: Category[] = [
  {
    slug: 'mortise-handles',
    name: 'Mortise Handles',
    blurb: 'Levers on rose and on plate for bedroom, bathroom and office doors.',
    cover: 'torus-lever-on-rose',
  },
  {
    slug: 'pull-handles',
    name: 'Pull Handles',
    blurb: 'Main door and glass door pulls in lengths from 300 to 1200 mm.',
    cover: 'mullion-pull-handle',
  },
  {
    slug: 'digital-locks',
    name: 'Digital Locks',
    blurb: 'Fingerprint, PIN and card entry, always with a mechanical key as backup.',
    cover: 'portal-f4-digital-lock',
  },
  {
    slug: 'locks-cylinders',
    name: 'Locks & Cylinders',
    blurb: 'Mortise lock bodies and euro profile cylinders to pair with any lever.',
    cover: 'keep-45-mortise-lock',
  },
  {
    slug: 'hinges',
    name: 'Hinges',
    blurb: 'Ball-bearing butt hinges in stainless steel for timber doors.',
    cover: 'knuckle-bb-hinge',
  },
  {
    slug: 'door-controls',
    name: 'Door Closers & Floor Springs',
    blurb: 'Hydraulic closers and floor springs for timber and glass doors.',
    cover: 'hold-60-door-closer',
  },
  {
    slug: 'door-accessories',
    name: 'Door Accessories',
    blurb: 'Tower bolts, door stoppers and viewers that finish the door.',
    cover: 'eye-200-door-viewer',
  },
  {
    slug: 'cabinet-hardware',
    name: 'Cabinet Hardware',
    blurb: 'Bar handles and knobs for kitchens, wardrobes and vanities.',
    cover: 'knurl-cabinet-handle',
  },
  {
    slug: 'glass-fittings',
    name: 'Glass Fittings',
    blurb: 'Patch fittings and shower hinges for 8 to 12 mm toughened glass.',
    cover: 'glaze-shower-hinge',
  },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  Category
>;
