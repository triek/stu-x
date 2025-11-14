import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useRegionStore } from '../stores/region.js'
import { useAuthStore } from '../stores/auth.js'
import { getItemRegionIds, normalizeRegionId } from '../utils/region.js'

/**
 * Creates a region-scoped feed derived from a reactive collection of items.
 *
 * The composable keeps the returned feed synchronised with the active region scope
 * while enriching each entry with its resolved region metadata. Consumers can also
 * access the derived user region id (respecting the active scope fallback) and
 * the user-facing region label taken from the authenticated profile.
 *
 * @param {import('vue').Ref<unknown[]>} sourceItemsRef - Reactive collection to scope.
 * @param {Object} [options]
 * @param {(item: unknown) => boolean} [options.predicate] - Optional additional filter.
 * @returns {{
 *   scopedFeed: import('vue').ComputedRef<unknown[]>,
 *   resolveRegionMeta: (value: unknown) => unknown,
 *   userRegionId: import('vue').ComputedRef<string>,
 *   userRegionLabel: import('vue').ComputedRef<string>
 * }}
 */
export const useRegionScopedFeed = (sourceItemsRef, options = {}) => {
  const regionStore = useRegionStore()
  const authStore = useAuthStore()

  const { activeScope, activeRegionId } = storeToRefs(regionStore)
  const { user } = storeToRefs(authStore)

  const normalizedItems = computed(() => {
    const value = sourceItemsRef?.value
    return Array.isArray(value) ? value : []
  })

  const userRegionLabel = computed(
    () => user.value?.region?.toString().trim() || '',
  )

  const fallbackRegionId = computed(() => normalizeRegionId(activeRegionId.value))

  const userRegionId = computed(() => {
    const normalized = normalizeRegionId(userRegionLabel.value)
    return normalized || fallbackRegionId.value
  })

  const predicate = typeof options.predicate === 'function' ? options.predicate : null

  const scopedFeed = computed(() => {
    const scope = new Set(activeScope.value)
    const items = normalizedItems.value

    return items.reduce((acc, item) => {
      const regionIds = getItemRegionIds(item)
      const inScope = regionIds.some((id) => scope.has(id))

      if (!inScope) {
        return acc
      }

      if (predicate && !predicate(item)) {
        return acc
      }

      const primaryRegionId = item?.region ?? regionIds[0]
      const regionMeta = regionStore.getRegionMeta(primaryRegionId)

      acc.push({
        ...item,
        regionIds,
        regionMeta,
      })

      return acc
    }, [])
  })

  const resolveRegionMeta = (value) => regionStore.getRegionMeta(value)

  return {
    scopedFeed,
    resolveRegionMeta,
    userRegionId,
    userRegionLabel,
  }
}
