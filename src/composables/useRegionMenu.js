import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { REGION_CHILDREN } from '../constants/regions'
import { useRegionStore } from '../stores/region'

export function useRegionMenu() {
  const regionStore = useRegionStore()
  const { availableRegions, activeRegion } = storeToRefs(regionStore)

  const regionMenuOpen = ref(false)
  const regionMenuRef = ref(null)
  const subregionParentId = ref(null)
  const regionMenuDirection = ref('forward')

  const setRegionMenuRef = (element) => {
    regionMenuRef.value = element
  }

  const regionSubregionMap = computed(() => {
    return Object.entries(REGION_CHILDREN).reduce((map, [regionId, childIds]) => {
      const subregions = childIds
        .map((id) => regionStore.getRegionMeta(id))
        .filter((meta) => meta && meta.showInSwitcher !== false)

      if (subregions.length > 0) {
        map.set(regionId, subregions)
      }

      return map
    }, new Map())
  })

  const isSubregionView = computed(() => subregionParentId.value !== null)
  const regionMenuViewKey = computed(() => subregionParentId.value ?? 'root')
  const menuParentRegion = computed(() => {
    if (!subregionParentId.value) {
      return null
    }

    return regionStore.getRegionMeta(subregionParentId.value)
  })

  const getRegionSubregions = (regionId) => regionSubregionMap.value.get(regionId) ?? []
  const regionHasSubregions = (regionId) => getRegionSubregions(regionId).length > 0

  const subregionIds = computed(() => {
    const ids = new Set()

    regionSubregionMap.value.forEach((subregions) => {
      subregions.forEach((region) => {
        if (region?.id) {
          ids.add(region.id)
        }
      })
    })

    return ids
  })

  const rootRegions = computed(() =>
    availableRegions.value.filter((region) => !subregionIds.value.has(region.id)),
  )

  const menuRegions = computed(() => {
    if (!isSubregionView.value) {
      return rootRegions.value
    }

    return getRegionSubregions(subregionParentId.value)
  })

  const menuHeaderLabel = computed(() => {
    if (!isSubregionView.value) {
      return 'Regions'
    }

    return menuParentRegion.value?.shortLabel ?? menuParentRegion.value?.label ?? 'Subregions'
  })

  const regionMenuTransition = computed(() =>
    regionMenuDirection.value === 'backward' ? 'region-slide-backward' : 'region-slide-forward',
  )

  const activeRegionLabel = computed(
    () => activeRegion.value?.shortLabel ?? activeRegion.value?.label ?? 'Australia',
  )

  const openSubregionView = (regionId) => {
    if (!regionId || !regionHasSubregions(regionId)) {
      return
    }

    regionMenuDirection.value = 'forward'
    subregionParentId.value = regionId
  }

  const handleRegionMenuBack = () => {
    regionMenuDirection.value = 'backward'
    subregionParentId.value = null
  }

  const toggleRegionMenu = () => {
    const nextState = !regionMenuOpen.value
    regionMenuOpen.value = nextState

    if (nextState) {
      regionMenuDirection.value = 'forward'
      subregionParentId.value = null
    }
  }

  const closeRegionMenu = () => {
    regionMenuOpen.value = false
    regionMenuDirection.value = 'forward'
    subregionParentId.value = null
  }

  const selectRegion = (region) => {
    if (!region?.id || region.isActive === false) {
      return false
    }

    regionStore.setRegion(region.id)
    closeRegionMenu()
    return true
  }

  const handleDocumentClick = (event) => {
    if (!regionMenuOpen.value) return

    const target = event.target
    if (regionMenuRef.value && !regionMenuRef.value.contains(target)) {
      closeRegionMenu()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick)
  })

  return {
    availableRegions,
    activeRegion,
    activeRegionLabel,
    menuHeaderLabel,
    menuParentRegion,
    menuRegions,
    regionMenuOpen,
    regionMenuTransition,
    regionMenuViewKey,
    isSubregionView,
    regionHasSubregions,
    toggleRegionMenu,
    closeRegionMenu,
    handleRegionMenuBack,
    openSubregionView,
    selectRegion,
    setRegionMenuRef,
  }
}

export default useRegionMenu
