<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'

import { useAuthStore } from './stores/auth'
import { useRegionStore } from './stores/region'
import { REGION_SCOPES } from './constants/regions'

const authStore = useAuthStore()
const { isAuthenticated, stunixBalance, displayName } = storeToRefs(authStore)

const regionStore = useRegionStore()
const { availableRegions, activeRegion } = storeToRefs(regionStore)

const formattedBalance = computed(() =>
  new Intl.NumberFormat('en-US').format(stunixBalance.value)
)

const activeRegionLabel = computed(
  () => activeRegion.value?.shortLabel ?? activeRegion.value?.label ?? 'Australia',
)

const logout = () => {
  authStore.logout()
}

const regionMenuOpen = ref(false)
const regionMenuRef = ref(null)
const subregionParentId = ref(null)
const regionMenuDirection = ref('forward')

const regionSubregionMap = computed(() => {
  return Object.entries(REGION_SCOPES).reduce((map, [regionId, scope]) => {
    const subregionIds = Array.from(
      new Set(scope.filter((id) => id && id !== regionId)),
    )

    const subregions = subregionIds
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
const regionMenuTransition = computed(() =>
  regionMenuDirection.value === 'backward'
    ? 'region-slide-backward'
    : 'region-slide-forward',
)

const menuParentRegion = computed(() => {
  if (!subregionParentId.value) {
    return null
  }

  return regionStore.getRegionMeta(subregionParentId.value)
})

const getRegionSubregions = (regionId) =>
  regionSubregionMap.value.get(regionId) ?? []

const regionHasSubregions = (regionId) =>
  getRegionSubregions(regionId).length > 0

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
  subregionParentId.value = null
  regionMenuDirection.value = 'forward'
}

const handleRegionSelect = (region) => {
  if (!region?.id || region.isActive === false) {
    return
  }

  regionStore.setRegion(region.id)
  closeRegionMenu()
}

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
</script>

<template>
<div class="flex min-h-screen flex-col">
  <header class="sticky top-0 z-10 border-b border-indigo-100/50 bg-white/80 backdrop-blur-xl">
    <div
      class="mx-auto flex w-full flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between"
    >
      <!-- Logo -->
      <RouterLink to="/" class="flex flex-col text-slate-900 no-underline">
        <span class="text-2xl font-bold uppercase tracking-[0.08em] text-brand">StuX</span>
        <span class="text-sm font-medium text-slate-500">The Human Insight Network</span>
      </RouterLink>

      <div class="flex flex-1 flex-wrap items-center justify-center gap-4 md:justify-center">
        <!-- Nav items -->
        <nav class="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 sm:gap-6">
          <RouterLink
            to="/home"
            class="border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600"
            active-class="border-indigo-400/60 text-indigo-600"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/insight"
            class="border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600"
            active-class="border-indigo-400/60 text-indigo-600"
          >
            Insight
          </RouterLink>
          <RouterLink
            to="/exchange"
            class="border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600"
            active-class="border-indigo-400/60 text-indigo-600"
          >
            Exchange
          </RouterLink>
          <RouterLink
            to="/community"
            class="border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600"
            active-class="border-indigo-400/60 text-indigo-600"
          >
            Community
          </RouterLink>
          <RouterLink
            to="/profile"
            class="inline-flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600"
            active-class="border-indigo-400/60 text-indigo-600"
          >
            Profile
          </RouterLink>
        </nav>
      </div>

      <!-- Region toggler -->
      <div ref="regionMenuRef" class="relative">
        <button
          type="button"
          class="inline-flex w-full min-w-[10rem] flex-col gap-1 rounded-2xl border border-indigo-100/70 bg-white px-4 py-2 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
          @click="toggleRegionMenu"
          aria-haspopup="listbox"
          :aria-expanded="regionMenuOpen"
        >
          <span class="text-sm font-semibold text-slate-700">{{ activeRegionLabel }}</span>
        </button>

        <div
          v-if="regionMenuOpen"
          class="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
        >
          <Transition :name="regionMenuTransition" mode="out-in">
            <div :key="regionMenuViewKey">
              <!-- Back button -->
              <div class="px-3">
                <button
                  v-if="isSubregionView"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-lg py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600 transition hover:bg-indigo-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  @click="handleRegionMenuBack"
                >
                  <span aria-hidden="true">←</span>
                  Regions
                </button>
                <p class="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {{ menuHeaderLabel }}
                </p>

                <p
                  v-if="isSubregionView && menuParentRegion?.tagline"
                  class="mt-1 text-[11px] text-slate-500"
                >
                  {{ menuParentRegion.tagline }}
                </p>
              </div>

              <!-- Region list -->
              <ul class="mt-2 grid gap-1">
                <li v-for="region in menuRegions" :key="region.id">
                  <div class="grid grid-cols-[1fr_auto] items-stretch gap-1">
                    <!-- Region button -->
                    <button
                      type="button"
                      class="flex w-full flex-1 flex-col gap-1 rounded-xl px-3 py-2 text-left transition"
                      :class="[
                        region.id === activeRegion?.id
                          ? 'bg-indigo-50 text-indigo-700 shadow-inner'
                          : 'text-slate-600 hover:bg-slate-100',
                        region.isActive === false ? 'cursor-not-allowed opacity-70 hover:bg-white' : '',
                      ]"
                      @click="handleRegionSelect(region)"
                      :disabled="region.isActive === false"
                    >
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-sm font-semibold">{{ region.label }}</span>
                        <span
                          v-if="region.statusLabel"
                          class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                          :class="region.chipClass ?? 'border border-slate-200 bg-slate-100 text-slate-600'"
                        >
                          {{ region.statusLabel }}
                        </span>
                      </div>
                      <p class="text-xs text-slate-500">{{ region.tagline }}</p>
                    </button>

                    <!-- Expand subregions arrow button -->
                    <button
                      v-if="regionHasSubregions(region.id)"
                      type="button"
                      class="inline-flex h-full items-center justify-center rounded-xl border border-transparent px-5 py-2 text-slate-400 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      @click.stop="openSubregionView(region.id)"
                      :aria-label="`View subregions for ${region.shortLabel ?? region.label}`"
                    >
                      <span aria-hidden="true" class="text-lg leading-none">›</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Auth state -->
      <div class="flex items-center gap-3 text-sm font-semibold">
        <template v-if="isAuthenticated">
          <RouterLink
            to="/profile"
            class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-50"
          >
            <span class="hidden sm:inline">Hi, {{ displayName }}</span>
            <span class="sm:hidden">Profile</span>
          </RouterLink>
          <span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-4 py-2 text-brand ring-1 ring-indigo-100">
            <span>Stunix: {{ formattedBalance }}</span>
            <span>☕</span>
          </span>
          <button
            type="button"
            class="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            @click="logout"
          >
            Log out
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="inline-flex items-center rounded-full bg-white px-4 py-2 text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-50"
          >
            Log in
          </RouterLink>
          <RouterLink
            to="/signup"
            class="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40"
          >
            Sign up
          </RouterLink>
        </template>
      </div>
    </div>
  </header>

  <!-- Main display -->
  <main class="flex-1">
    <div class="mx-auto w-full max-w-[120rem] px-3 py-4">
      <RouterView />
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-indigo-100/50 bg-white/90 backdrop-blur-md">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div class="flex flex-col gap-1">
        <span class="text-sm font-semibold uppercase tracking-[0.08em] text-brand">StuX</span>
        <span class="text-xs text-slate-500">Built on Insight · Exchange · Community</span>
      </div>
      <nav class="flex items-center gap-5 text-xs sm:text-sm text-slate-500">
        <a class="transition-colors hover:text-brand" href="#">About</a>
        <a class="transition-colors hover:text-brand" href="#">Terms</a>
        <a class="transition-colors hover:text-brand" href="#">Contact</a>
      </nav>
      <p class="text-xs sm:text-sm">
        <strong>StuX</strong> &copy; 2025 - The Human Insight Network.
      </p>
    </div>
  </footer>
</div>
</template>

<style scoped>
.region-slide-forward-enter-active,
.region-slide-forward-leave-active,
.region-slide-backward-enter-active,
.region-slide-backward-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.region-slide-forward-enter-from,
.region-slide-backward-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.region-slide-forward-leave-to,
.region-slide-backward-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
