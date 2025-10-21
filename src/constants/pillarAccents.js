const BRAND_PRIMARY = '#4338ca'

export const PILLAR_ACCENTS = {
  insight: '#4338ca',
  exchange: '#0f766e',
  community: '#db2777',
}

export const TAILWIND_BRAND_COLORS = {
  brand: BRAND_PRIMARY,
  'brand-insight': PILLAR_ACCENTS.insight,
  'brand-exchange': PILLAR_ACCENTS.exchange,
  'brand-community': PILLAR_ACCENTS.community,
}

export const getPillarAccent = (pillar) => PILLAR_ACCENTS[pillar]
