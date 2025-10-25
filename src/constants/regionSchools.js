import { REGION_DEFINITIONS } from './regions'

const regionMetaMap = REGION_DEFINITIONS.reduce((map, region) => {
  map.set(region.id, region)
  return map
}, new Map())

const createOptionFromRegion = (regionId) => {
  const meta = regionMetaMap.get(regionId)
  if (!meta) return null

  return {
    id: meta.id,
    regionId: meta.id,
    label: meta.label,
    description: meta.tagline,
    isActive: meta.isActive !== false,
    accent: meta.accent,
    statusLabel: meta.statusLabel,
  }
}

const withDefinedOptions = (...options) => options.filter(Boolean)

const REGION_SCHOOL_OVERRIDES = {
  australia: withDefinedOptions(
    createOptionFromRegion('melbourne'),
    createOptionFromRegion('deakin'),
  ),
  vietnam: withDefinedOptions(
    createOptionFromRegion('tphcm'),
    createOptionFromRegion('iu-vnu'),
    createOptionFromRegion('ussh'),
  ),
}

export const getSchoolsForRegion = (regionId) => {
  if (!regionId) return []
  return REGION_SCHOOL_OVERRIDES[regionId] ?? withDefinedOptions(createOptionFromRegion(regionId))
}

export const LANDING_SCHOOL_SHORTCUTS = withDefinedOptions(
  createOptionFromRegion('deakin'),
  createOptionFromRegion('iu-vnu'),
  createOptionFromRegion('monash'),
  createOptionFromRegion('usyd'),
  createOptionFromRegion('ussh'),
)
