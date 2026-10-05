/**
 * The site's service taxonomy and typology vocabulary, generated from the front end.
 *
 * DO NOT EDIT BY HAND. The static site is the source of truth: work.html's filter bar defines the
 * tokens and their visible labels, js/main.js's SUB_SERVICE_PARENTS defines which tokens are
 * sub-services and what they roll up to, and the work cards define the typology vocabulary. Regenerate
 * with `py -3.10 scripts/build_sanity_taxonomy.py --write` after any change to the bar, the roll-up
 * table or a card's data-typology — scratch/_verify_backlog.py fails when this file disagrees.
 *
 * Keeping the option lists here rather than copy-typed inside each schema is the point: hand-typed
 * copies rotted (project.ts still offered "Architecture" and "Visual Effects (VFX) & CGI" after the
 * 2026-10-04 renames, and had no `illustration` token).
 */

export type ServiceToken =   | 'art'
  | 'bim'
  | 'competitions'
  | 'design'
  | 'architecture-planning'
  | 'art-direction'
  | 'web-design'
  | 'graphic-design'
  | 'illustration'
  | 'industrial-design'
  | 'interior-design'
  | 'motion-design'
  | 'turnkey-build'
  | 'cost-engineering'
  | 'product-material-sourcing'
  | 'studio-projects'
  | 'photography'
  | 'architectural-photography'
  | 'drone-photography'
  | 'principal-photography'
  | 'vfx-cgi'
  | '3d-animation'
  | 'architectural-visualization'
  | 'match-moving'
  | 'photogrammetry'
  | 'product-visualization'
  | 'tracking'
  | 'virtual-reality'

export interface ServiceOption {value: ServiceToken; label: string}

/** The eight top-level services on work.html's filter bar, in bar order. */
export const MAIN_SERVICES: ServiceOption[] = [
  {value: 'art', label: 'Art'},
  {value: 'bim', label: 'BIM'},
  {value: 'competitions', label: 'Competitions'},
  {value: 'design', label: 'Design'},
  {value: 'turnkey-build', label: 'Design + Build'},
  {value: 'studio-projects', label: 'In-house'},
  {value: 'photography', label: 'Photography'},
  {value: 'vfx-cgi', label: 'VFX + CGI'},
]

/** The sub-services, each with the main service its slide caption rolls up to. */
export interface SubServiceOption extends ServiceOption {parent: string}
export const SUB_SERVICES: SubServiceOption[] = [
  {value: 'architecture-planning', label: 'Architectural Design', parent: 'design'},
  {value: 'art-direction', label: 'Art Direction', parent: 'design'},
  {value: 'web-design', label: 'Digital & Web Design', parent: 'design'},
  {value: 'graphic-design', label: 'Graphic Design', parent: 'design'},
  {value: 'illustration', label: 'Illustration', parent: 'design'},
  {value: 'industrial-design', label: 'Industrial & Furniture Design', parent: 'design'},
  {value: 'interior-design', label: 'Interior Design', parent: 'design'},
  {value: 'motion-design', label: 'Motion Design', parent: 'design'},
  {value: 'cost-engineering', label: 'Cost Engineering', parent: 'turnkey-build'},
  {value: 'product-material-sourcing', label: 'Product and Material Sourcing', parent: 'turnkey-build'},
  {value: 'architectural-photography', label: 'Architectural Photography', parent: 'photography'},
  {value: 'drone-photography', label: 'Drone Photography', parent: 'photography'},
  {value: 'principal-photography', label: 'Principal Photography', parent: 'photography'},
  {value: '3d-animation', label: '3D Animation', parent: 'vfx-cgi'},
  {value: 'architectural-visualization', label: 'Architectural Visualization', parent: 'vfx-cgi'},
  {value: 'match-moving', label: 'Match-moving', parent: 'vfx-cgi'},
  {value: 'photogrammetry', label: 'Photogrammetry', parent: 'vfx-cgi'},
  {value: 'product-visualization', label: 'Product Visualization', parent: 'vfx-cgi'},
  {value: 'tracking', label: 'Tracking', parent: 'vfx-cgi'},
  {value: 'virtual-reality', label: 'Virtual Reality (VR)', parent: 'vfx-cgi'},
]

/** All 28 filter tokens, in bar order — what a project may be tagged with. */
export const SERVICES: ServiceOption[] = [...MAIN_SERVICES, ...SUB_SERVICES]

/** {token: label} for every filter token. */
export const SERVICE_LABELS: Record<ServiceToken, string> = Object.fromEntries(
  SERVICES.map((s) => [s.value, s.label]),
) as Record<ServiceToken, string>

/** {sub-service token: main service token}; main services are absent. */
export const SERVICE_PARENTS: Record<string, string> = Object.fromEntries(
  SUB_SERVICES.map((s) => [s.value, s.parent]),
)

/** Roll a project's tokens up to the main services a homepage slide may name. */
export function rollUpMainServices(tokens: string[]): ServiceToken[] {
  const parents = new Set(
    tokens.map((t) => (SERVICE_PARENTS[t] ? SERVICE_PARENTS[t] : t) as ServiceToken),
  )
  return MAIN_SERVICES.map((s) => s.value).filter((v) => parents.has(v))
}

/**
 * Typologies in use across the work cards. Adding one is a site-side change first: it has to appear
 * on a card's data-typology before the CMS offers it.
 */
export const TYPOLOGIES: string[] = [
  'Apartments & Retail',
  'Architectural Visualization',
  'Architecture',
  'Brand Identity',
  'Broadcast',
  'Commercial',
  'Commercial / TVC',
  'Corporate Profile',
  'Corporate Reception',
  'Educational',
  'Event Design',
  'Event Marketing',
  'Event Poster',
  'Furniture',
  'Graphic Design',
  'Hospitality',
  'Hospitality & Nightlife',
  'Icon Design',
  'Identity',
  'Institutional',
  'Interior Design',
  'Mixed-Use',
  'Motion Design',
  'Product Design',
  'Product Visualization',
  'Residential',
  'Residential CGI',
  'Residential Interior',
  'Retail',
  'Retail Interior',
  'Wedding Invitation',
  'Workplace',
  'Workplace & Office',
]

/**
 * The in-house product line, harvested from the product pages' own meta lines
 * (`Line / Type / Kind`). These are NOT typologies: product pages appear on product.html, never
 * on work.html, so a product document has its own vocabulary to be tagged with.
 */
export const PRODUCT_LINES: string[] = ['MIG']
export const PRODUCT_TYPES: string[] = ['Accessories', 'Furniture', 'Lights']
export const PRODUCT_KINDS: string[] = ['Desk', 'Experimental lighting', 'Floating media unit', 'Media wall', 'Reception desk', 'Sleeping pod', 'Tray & bench']

/** The pools js/main.js's servicePools is drawn across, in its own order. */
export interface SlidePoolOption {value: string; label: string}
export const SLIDE_POOLS: SlidePoolOption[] = [
  {value: 'architecture', label: 'Architectural Design'},
  {value: 'interiors', label: 'Interior Design'},
  {value: 'vfx', label: 'VFX + CGI'},
  {value: 'motion', label: 'Motion Design'},
  {value: 'products', label: 'Product Design'},
]

/** The two site-visibility states, mirroring data/project-status.json. */
export const VISIBILITY = {LIVE: 'live', ARCHIVED: 'archived'} as const
// generated by scripts/build_sanity_taxonomy.py — do not edit
