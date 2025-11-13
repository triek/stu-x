import { DEFAULT_REGION_ID } from '@/constants/regions'
import { normalizeRegionId } from '@/utils/region'

export const cloneSeedData = (data) => {
  if (data == null) {
    return []
  }

  return JSON.parse(JSON.stringify(data))
}

export const generatePostId = (prefix) => {
  const normalizedPrefix = prefix?.toString().trim() || 'post'
  const randomSegment = Math.random().toString(36).slice(2, 8)

  return `${normalizedPrefix}-${Date.now()}-${randomSegment}`
}

export const parsePositiveInt = (value) => {
  const number = Number.parseInt(value, 10)
  return Number.isNaN(number) || number < 0 ? 0 : number
}

export const parseTagString = (input) => {
  if (!input) return []

  return input
    .split(',')
    .flatMap((segment) => segment.split(/\s+/))
    .map((tag) => tag.replace(/^#/, '').trim())
    .filter(Boolean)
}

export const resolveRegionIds = (form = {}) => {
  const ids = new Set()

  const collect = (value) => {
    const normalized = normalizeRegionId(value)
    if (normalized) {
      ids.add(normalized)
    }
  }

  collect(form.region ?? form.regionId)

  if (Array.isArray(form.regions)) {
    form.regions.forEach(collect)
  }

  if (!ids.size) {
    ids.add(DEFAULT_REGION_ID)
  }

  return Array.from(ids)
}
