export type FinishCode = 'SS' | 'CP' | 'PG' | 'RG' | 'AB' | 'MB' | 'GM';

export interface Finish {
  code: FinishCode;
  name: string;
  short: string;
  process: string;
  description: string;
  bestFor: string;
  care: string;
  /** Highlight, light, mid, dark, deep. Used to render the product drawings. */
  tones: [string, string, string, string, string];
}

export const finishes: Finish[] = [
  {
    code: 'SS',
    name: 'Satin Stainless Steel',
    short: 'Satin Steel',
    process: 'Grade 304 stainless steel, brushed in one direction',
    description:
      'A fine, even grain that hides fingerprints and light scratches. The finish is the metal itself, so there is no coating to wear through.',
    bestFor: 'Busy doors, coastal homes, offices and hospitals',
    care: 'Wipe along the grain with a damp cloth. Avoid scouring pads and bleach-based cleaners.',
    tones: ['#FBFCFD', '#DDE0E4', '#B7BCC3', '#8A9098', '#5F656D'],
  },
  {
    code: 'CP',
    name: 'Polished Chrome',
    short: 'Chrome',
    process: 'Bright chrome plated over nickel, on solid brass',
    description:
      'A mirror finish with sharp reflections. It matches most bathroom taps and shower fittings, which is why it is still the default choice for wet areas.',
    bestFor: 'Bathrooms, hotel rooms, interiors with chrome sanitaryware',
    care: 'Dry with a soft cloth after cleaning to avoid water spots. Mild soap only.',
    tones: ['#FFFFFF', '#E6EAEE', '#A8B0B9', '#5C646E', '#2C3239'],
  },
  {
    code: 'PG',
    name: 'PVD Gold',
    short: 'PVD Gold',
    process: 'Titanium nitride, applied by physical vapour deposition',
    description:
      'A warm, even gold that is far harder than plated brass and does not tarnish. It keeps its colour on main doors that are handled hundreds of times a day.',
    bestFor: 'Living areas, main doors, hotel lobbies',
    care: 'Clean with a damp microfibre cloth. No metal polish, which can dull the surface.',
    tones: ['#FFF4D2', '#EBD294', '#CBA964', '#987637', '#664B1C'],
  },
  {
    code: 'RG',
    name: 'PVD Rose Gold',
    short: 'Rose Gold',
    process: 'Physical vapour deposition over brushed stainless steel',
    description:
      'A soft copper-pink with a light brushed grain underneath. Quieter than gold, and it sits well against warm timber and plaster.',
    bestFor: 'Bedrooms, wardrobes and residential interiors',
    care: 'Clean with a damp microfibre cloth. Avoid abrasive or acidic cleaners.',
    tones: ['#FDE8DE', '#EBBFAB', '#CF9781', '#9E6954', '#6C4434'],
  },
  {
    code: 'AB',
    name: 'Antique Brass',
    short: 'Antique Brass',
    process: 'Solid brass, chemically darkened, hand-relieved and lacquered',
    description:
      'Darker in the recesses and lighter on the high points, the way old brass wears. Each piece is relieved by hand, so no two are exactly alike.',
    bestFor: 'Heritage homes, timber doors, classic interiors',
    care: 'Dust with a dry soft cloth. The lacquer protects the colour, so do not polish.',
    tones: ['#EAD3A2', '#C6A26A', '#9C7843', '#6B4F29', '#433019'],
  },
  {
    code: 'MB',
    name: 'Matt Black',
    short: 'Matt Black',
    process: 'Electrophoretic base coat with a matt powder topcoat',
    description:
      'A deep, flat black with a very slight texture. It reads clearly against light timber, white walls and glass partitions.',
    bestFor: 'Contemporary interiors, glass doors, kitchens',
    care: 'Wipe with a damp cloth and dry. Avoid solvents and cream cleaners.',
    tones: ['#64676C', '#404348', '#2E3034', '#1F2124', '#141517'],
  },
  {
    code: 'GM',
    name: 'Gun Metal',
    short: 'Gun Metal',
    process: 'Dark grey PVD over brushed stainless steel',
    description:
      'Sits between steel and black. The brushed grain shows through the colour, which keeps it from looking flat.',
    bestFor: 'Offices, apartments, industrial-style interiors',
    care: 'Clean with a damp microfibre cloth. No abrasives.',
    tones: ['#B9BDC3', '#8C9198', '#686D74', '#474B51', '#2C2F33'],
  },
];

export const finishMap: Record<FinishCode, Finish> = Object.fromEntries(
  finishes.map((f) => [f.code, f]),
) as Record<FinishCode, Finish>;
