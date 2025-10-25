export const DEFAULT_REGION_ID = 'australia'

export const REGION_DEFINITIONS = [
  {
    id: 'australia',
    label: 'Australia',
    shortLabel: 'Australia',
    tagline: 'Nationwide network to earn and spend Stunix.',
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
    tagline: 'City hub with in-person meetups and campus partners.',
    accent: 'bg-emerald-100 text-emerald-700',
    chipClass: 'border border-emerald-200/60 bg-emerald-50 text-emerald-700',
    statusLabel: 'Now live',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'deakin',
    label: 'Deakin University',
    shortLabel: 'Deakin University',
    tagline: 'Burwood campus pilot with mentor circles and study clubs.',
    accent: 'bg-amber-100 text-amber-700',
    chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
    statusLabel: 'Campus partner',
    isActive: true,
    showInSwitcher: true,
  },
  {
    id: 'sydney',
    label: 'Sydney',
    shortLabel: 'Sydney',
    tagline: 'Beta waitlist now forming for 2025 launch.',
    accent: 'bg-sky-100 text-sky-700',
    chipClass: 'border border-sky-200/60 bg-sky-50 text-sky-700',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
  {
    id: 'brisbane',
    label: 'Brisbane',
    shortLabel: 'Brisbane',
    tagline: 'Register interest to shape the next city rollout.',
    accent: 'bg-rose-100 text-rose-700',
    chipClass: 'border border-rose-200/60 bg-rose-50 text-rose-700',
    statusLabel: 'Interest list',
    isActive: false,
    showInSwitcher: true,
  },
]

export const REGION_SCOPES = REGION_DEFINITIONS.reduce((scopes, region) => {
  switch (region.id) {
    case 'melbourne':
      scopes[region.id] = ['melbourne', 'deakin']
      break
    default:
      scopes[region.id] = [region.id]
      break
  }
  return scopes
}, {})
