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

const REGION_CITY_OVERRIDES = {
  australia: withDefinedOptions(
    createOptionFromRegion('melbourne'),
    createOptionFromRegion('sydney'),
    createOptionFromRegion('brisbane'),
  ),
  vietnam: withDefinedOptions(
    createOptionFromRegion('tphcm'),
    createOptionFromRegion('danang'),
    createOptionFromRegion('hanoi'),
  ),
}

const REGION_SCHOOL_OVERRIDES = {
  // Australia
  melbourne: withDefinedOptions(
    createOptionFromRegion('deakin'),
    createOptionFromRegion('monash'),
  ),
  sydney: withDefinedOptions(
    createOptionFromRegion('usyd'),
  ),
  brisbane: withDefinedOptions(
    // Placeholder for future uni
  ),

  // Vietnam
  tphcm: withDefinedOptions(
    createOptionFromRegion('iu-vnu'),
    createOptionFromRegion('ussh'),
  ),
  danang: withDefinedOptions(
    // Placeholder for future uni
  ),
  hanoi: withDefinedOptions(
    // Placeholder for future uni
  ),
}

export const getCitiesForRegion = (regionId) => {
  if (!regionId) return []
  return REGION_CITY_OVERRIDES[regionId] ?? []
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
