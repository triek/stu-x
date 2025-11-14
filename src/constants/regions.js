export const DEFAULT_REGION_ID = 'vietnam'

export const REGION_DEFINITIONS = [
  // Australia
  {
    id: 'australia',
    label: 'Australia',
    shortLabel: 'AUS',
    tagline: '3 Regions',
    accent: 'bg-indigo-100 text-indigo-700',
    chipClass:
      'border border-indigo-200/60 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/30 dark:text-indigo-200',
    statusLabel: 'National',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'melbourne',
    label: 'Melbourne',
    shortLabel: 'Mel',
    tagline: '2 Universities',
    accent: 'bg-emerald-100 text-emerald-700',
    chipClass:
      'border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200',
    statusLabel: 'Live',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'deakin',
    label: 'Deakin University',
    shortLabel: 'Deakin',
    tagline: 'Burwood campus pilot',
    accent: 'bg-emerald-100 text-emerald-700',
    chipClass:
      'border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200',
    statusLabel: 'Live',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'monash',
    label: 'Monash University',
    shortLabel: 'Monash',
    tagline: 'Clayton campus pilot',
    accent: 'bg-amber-100 text-amber-700',
    chipClass:
      'border border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
  {
    id: 'sydney',
    label: 'Sydney',
    shortLabel: 'Syd',
    tagline: '1 University',
    accent: 'bg-amber-100 text-amber-700',
    chipClass:
      'border border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
  {
    id: 'usyd',
    label: 'University of Sydney',
    shortLabel: 'USYD',
    tagline: 'All campuses',
    accent: 'bg-amber-100 text-amber-700',
    chipClass:
      'border border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },

  // Vietnam
  {
    id: 'vietnam',
    label: 'Việt Nam',
    shortLabel: 'VN',
    tagline: '3 Regions',
    accent: 'bg-indigo-100 text-indigo-700',
    chipClass:
      'border border-indigo-200/60 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/30 dark:text-indigo-200',
    statusLabel: 'National',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'tphcm',
    label: 'Thành phố Hồ Chí Minh',
    shortLabel: 'HCMC',
    tagline: '2 Universities',
    accent: 'bg-emerald-100 text-emerald-700',
    chipClass:
      'border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200',
    statusLabel: 'Live',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'iu-vnu',
    label: 'International University - VNU',
    shortLabel: 'IU-VNU',
    tagline: 'Cơ sở Thủ Đức',
    accent: 'bg-emerald-100 text-emerald-700',
    chipClass:
      'border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200',
    statusLabel: 'Live',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'ussh',
    label: 'University of Social Sciences and Humanities',
    shortLabel: 'USSH',
    tagline: 'Mọi cơ sở',
    accent: 'bg-amber-100 text-amber-700',
    chipClass:
      'border border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
  {
    id: 'danang',
    label: 'Đà Nẵng',
    shortLabel: 'DN',
    tagline: 'Central hub with campus partners',
    accent: 'bg-amber-100 text-amber-700',
    chipClass:
      'border border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
  {
    id: 'hanoi',
    label: 'Hà Nội',
    shortLabel: 'HN',
    tagline: 'Capital region with campus partners',
    accent: 'bg-amber-100 text-amber-700',
    chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
]

export const REGION_CHILDREN = {
  australia: ['melbourne', 'sydney'],
  melbourne: ['deakin', 'monash'],
  sydney: ['usyd'],
  vietnam: ['tphcm', 'danang', 'hanoi'],
  tphcm: ['iu-vnu', 'ussh'],
}

const buildRegionScope = (regionId, visited = new Set()) => {
  const normalizedId = regionId?.toString().toLowerCase()
  if (!normalizedId || visited.has(normalizedId)) {
    return []
  }

  visited.add(normalizedId)

  const directChildren = REGION_CHILDREN[normalizedId] ?? []
  const scope = [normalizedId]

  directChildren.forEach((childId) => {
    scope.push(...buildRegionScope(childId, visited))
  })

  return scope
}

export const REGION_SCOPES = REGION_DEFINITIONS.reduce((scopes, region) => {
  const scope = buildRegionScope(region.id, new Set())
  scopes[region.id] = scope.length ? Array.from(new Set(scope)) : [region.id.toLowerCase()]
  return scopes
}, {})
