export const DEFAULT_REGION_ID = 'australia'

export const REGION_DEFINITIONS = [
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
    statusLabel: 'Now live',
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
    statusLabel: 'Now live',
    isActive: true,
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
    id: 'brisbane',
    label: 'Brisbane',
    shortLabel: 'Brisbane',
    tagline: 'Register interest to shape the next city rollout.',
    accent: 'bg-amber-100 text-amber-700',
    chipClass: 'border border-amber-200/60 bg-amber-50 text-amber-700',
    statusLabel: 'Waitlist',
    isActive: false,
    showInSwitcher: true,
  },
]

const REGION_SCOPE_OVERRIDES = {
  australia: ['australia', 'melbourne', 'deakin'],
  melbourne: ['melbourne', 'deakin'],
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
