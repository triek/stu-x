import { DEFAULT_REGION_ID } from '../constants/regions.js'

export const normalizeRegionId = (value) => {
  if (value == null) return ''
  if (typeof value === 'string') {
    return value.trim().toLowerCase()
  }
  return String(value).trim().toLowerCase()
}

const collectIdsFromValue = (value, bucket) => {
  if (!bucket) return

  if (Array.isArray(value)) {
    value.forEach((entry) => collectIdsFromValue(entry, bucket))
    return
  }

  const normalized = normalizeRegionId(value)
  if (normalized) {
    bucket.add(normalized)
  }
}

export const getItemRegionIds = (item) => {
  const ids = new Set()
  if (!item || typeof item !== 'object') {
    ids.add(DEFAULT_REGION_ID)
    return Array.from(ids)
  }

  collectIdsFromValue(item.regions, ids)
  collectIdsFromValue(item.region, ids)

  if (!ids.size) {
    ids.add(DEFAULT_REGION_ID)
  }

  return Array.from(ids)
}
