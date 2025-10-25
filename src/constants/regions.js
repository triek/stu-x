export const DEFAULT_REGION_ID = 'australia'

export const REGION_DEFINITIONS = [
  // Australia
  {
    id: 'australia',
    label: 'Australia',
    shortLabel: 'Australia',
    tagline: 'Nationwide network',
    accent: 'bg-indigo-100 text-indigo-700',
    chipClass: 'border border-indigo-200/60 bg-indigo-50 text-indigo-700',
    statusLabel: 'National',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'melbourne',
    label: 'Melbourne',
    shortLabel: 'Melbourne',
    tagline: 'City hub with campus partners',
    accent: 'bg-emerald-100 text-emerald-700',
    chipClass: 'border border-emerald-200/60 bg-emerald-50 text-emerald-700',
    statusLabel: 'Live',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'deakin',
    label: 'Deakin University',
    shortLabel: 'Deakin University',
    tagline: 'Burwood campus pilot',
    accent: 'bg-emerald-100 text-emerald-700',
    chipClass: 'border border-emerald-200/60 bg-emerald-50 text-emerald-700',
    statusLabel: 'Live',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'monash',
    label: 'Monash University',
    shortLabel: 'Monash University',
    tagline: 'Clayton campus pilot',
    accent: 'bg-amber-100 text-amber-700',
    chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
  {
    id: 'sydney',
    label: 'Sydney',
    shortLabel: 'Sydney',
    tagline: 'Beta waitlist now forming for 2025 launch.',
    accent: 'bg-amber-100 text-amber-700',
    chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
  {
    id: 'usyd',
    label: 'University of Sydney',
    shortLabel: 'University of Sydney',
    tagline: 'Sydney campus pilot',
    accent: 'bg-amber-100 text-amber-700',
    chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },

  // Vietnam
  {
    id: 'vietnam',
    label: 'Việt Nam',
    shortLabel: 'Vietnam',
    tagline: 'Nationwide network',
    accent: 'bg-indigo-100 text-indigo-700',
    chipClass: 'border border-indigo-200/60 bg-indigo-50 text-indigo-700',
    statusLabel: 'National',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'tphcm',
    label: 'Thành phố Hồ Chí Minh',
    shortLabel: 'Ho Chi Minh City',
    tagline: 'City hub with campus partners',
    accent: 'bg-emerald-100 text-emerald-700',
    chipClass: 'border border-emerald-200/60 bg-emerald-50 text-emerald-700',
    statusLabel: 'Live',
    isActive: true,
    showInSwitcher: true,
  },
  {
  id: 'iu-vnu',
  label: 'International University - VNU',
  shortLabel: 'IU - VNU',
  tagline: 'IU campus pilot',
  accent: 'bg-emerald-100 text-emerald-700',
  chipClass: 'border border-emerald-200/60 bg-emerald-50 text-emerald-700',
  statusLabel: 'Live',
  isActive: true,
  showInSwitcher: true,
  },
  {
  id: 'ussh',
  label: 'University of Social Sciences and Humanities',
  shortLabel: 'IU - VNU',
  tagline: 'USSH campus pilot',
  accent: 'bg-amber-100 text-amber-700',
  chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
  statusLabel: 'Waitlist',
  isActive: false,
  showInSwitcher: true,
  },
  {
  id: 'danang',
  label: 'Đà Nẵng',
  shortLabel: 'Da Nang',
  tagline: 'Central hub with campus partners',
  accent: 'bg-amber-100 text-amber-700',
  chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
  statusLabel: 'Waitlist',
  isActive: false,
  showInSwitcher: true,
},
{
  id: 'hanoi',
  label: 'Hà Nội',
  shortLabel: 'Ha Noi',
  tagline: 'Capital region with campus partners',
  accent: 'bg-amber-100 text-amber-700',
  chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
  statusLabel: 'Waitlist',
  isActive: false,
  showInSwitcher: true,
},
]

const REGION_SCOPE_OVERRIDES = {
  australia: ['australia', 'melbourne', 'deakin', 'monash'],
  melbourne: ['melbourne', 'deakin', 'monash'],
  vietnam: ['vietnam', 'tphcm', 'iu-vnu', 'ussh'],
  tphcm: ['tphcm', 'iu-vnu', 'ussh'],
}

export const REGION_SCOPES = REGION_DEFINITIONS.reduce((scopes, region) => {
  const override = REGION_SCOPE_OVERRIDES[region.id]

  if (override) {
    const normalizedScope = Array.from(
      new Set(
        override.concat(region.id).map((id) => id.toLowerCase()),
      ),
    )
    scopes[region.id] = normalizedScope
    return scopes
  }

  scopes[region.id] = [region.id]
  return scopes
}, {})
