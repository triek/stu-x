const BRAND_PRIMARY = '#4338ca'

export const PILLAR_ACCENTS = {
  insight: '#117a78',
  exchange: '#ca8a04',
  community: '#db2777',
}

export const TAILWIND_BRAND_COLORS = {
  brand: BRAND_PRIMARY,
  'brand-insight': PILLAR_ACCENTS.insight,
  'brand-exchange': PILLAR_ACCENTS.exchange,
  'brand-community': PILLAR_ACCENTS.community,
}

export const getPillarAccent = (pillar) => PILLAR_ACCENTS[pillar]
