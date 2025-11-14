import { DEFAULT_REGION_ID } from '../constants/regions.js'
import { normalizeRegionId } from './region.js'

export const cloneSeedData = (data) => JSON.parse(JSON.stringify(data ?? []))

export const generatePostId = (prefix = '') => {
  const normalizedPrefix = prefix?.toString().trim()
  const safePrefix = normalizedPrefix ? `${normalizedPrefix}-` : ''
  const random = Math.random().toString(36).slice(2, 8)
  return `${safePrefix}${Date.now()}-${random}`
}

export const parsePositiveInt = (value, fallback = 0) => {
  const number = Number.parseInt(value, 10)
  return Number.isNaN(number) || number < 0 ? fallback : number
}

export const parseTagString = (input) => {
  if (!input) return []

  return input
    .split(',')
    .flatMap((segment) => segment.split(/\s+/))
    .map((tag) => tag.replace(/^#/, '').trim())
    .filter(Boolean)
}

export const resolveRegionIds = (form = {}, options = {}) => {
  const { defaultRegionId = DEFAULT_REGION_ID } = options
  const ids = new Set()

  const collect = (value) => {
    const normalized = normalizeRegionId(value)
    if (normalized) {
      ids.add(normalized)
    }
  }

  if (form.region != null) {
    collect(form.region)
  }

  if (form.regionId != null) {
    collect(form.regionId)
  }

  if (Array.isArray(form.regions)) {
    form.regions.forEach(collect)
  }

  if (!ids.size && defaultRegionId) {
    ids.add(defaultRegionId)
  }

  return Array.from(ids)
}
