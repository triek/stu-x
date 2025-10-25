import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  DEFAULT_REGION_ID,
  REGION_DEFINITIONS,
  REGION_SCOPES,
} from '@/constants/regions'
import { normalizeRegionId } from '@/utils/region'

const regionMap = REGION_DEFINITIONS.reduce((map, region) => {
  map.set(region.id, region)
  return map
}, new Map())

const fallbackRegion = regionMap.get(DEFAULT_REGION_ID) ?? REGION_DEFINITIONS[0]

export const useRegionStore = defineStore('region', () => {
  const selectedRegionId = ref(fallbackRegion?.id ?? DEFAULT_REGION_ID)

  const availableRegions = computed(() =>
    REGION_DEFINITIONS.filter((region) => region.showInSwitcher !== false),
  )

  const activeRegion = computed(
    () => regionMap.get(selectedRegionId.value) ?? fallbackRegion,
  )

  const activeRegionId = computed(() => activeRegion.value?.id ?? DEFAULT_REGION_ID)

  const activeScope = computed(
    () => REGION_SCOPES[activeRegionId.value] ?? [DEFAULT_REGION_ID],
  )

  const setRegion = (value) => {
    const normalized = normalizeRegionId(value)
    if (normalized && regionMap.has(normalized)) {
      selectedRegionId.value = normalized
      return
    }

    selectedRegionId.value = fallbackRegion?.id ?? DEFAULT_REGION_ID
  }

  const getRegionMeta = (value) => {
    const normalized = normalizeRegionId(value)
    return normalized ? regionMap.get(normalized) ?? null : null
  }

  return {
    availableRegions,
    activeRegion,
    activeRegionId,
    activeScope,
    setRegion,
    getRegionMeta,
  }
})
