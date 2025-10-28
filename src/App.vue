<script setup>
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'

import { useAuthStore } from './stores/auth'
import { useRegionStore } from './stores/region'
import { useThemeStore } from './stores/theme'
import { REGION_CHILDREN } from './constants/regions'

const authStore = useAuthStore()
const { isAuthenticated, stunixBalance, displayName } = storeToRefs(authStore)

const regionStore = useRegionStore()
const { availableRegions, activeRegion } = storeToRefs(regionStore)

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

if (typeof window !== 'undefined') {
  themeStore.initTheme()
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const themeToggleLabel = computed(() =>
  isDarkMode.value ? 'Switch to light mode' : 'Switch to dark mode',
)

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
const navMenuOpen = ref(false)
const regionMenuRef = ref(null)
const setRegionMenuRef = (element) => {
  regionMenuRef.value = element
}
const subregionParentId = ref(null)
const regionMenuDirection = ref('forward')

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

const toggleNavMenu = () => {
  const nextState = !navMenuOpen.value
  navMenuOpen.value = nextState

  if (!nextState) {
    closeRegionMenu()
  }
}

const closeNavMenu = () => {
  navMenuOpen.value = false
  closeRegionMenu()
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
  subregionParentId.value = null
  regionMenuDirection.value = 'forward'
}

const handleRegionSelect = (region) => {
  if (!region?.id || region.isActive === false) {
    return
  }

  regionStore.setRegion(region.id)
  closeNavMenu()
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

onBeforeMount(() => {
  themeStore.initTheme()
})

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
<div
  class="flex min-h-screen flex-col bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100"
>
  <header
    class="sticky top-0 z-40 border-b border-indigo-100/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80"
  >
    <div
      class="mx-auto flex w-full flex-col items-center gap-4 px-4 py-4 text-slate-900 transition-colors sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-100"
    >
      <!-- Logo -->
      <RouterLink to="/" class="flex flex-col text-slate-900 no-underline dark:text-slate-100">
        <div class="flex flex-col items-center text-center sm:items-start sm:text-left">
          <span class="text-2xl font-bold uppercase tracking-[0.08em] text-brand">StuX</span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">The Human Insight Network</span>
        </div>
      </RouterLink>

      <!-- Nav items -->
      <nav
        id="primary-navigation"
        class="flex flex-1 flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-600 transition-colors sm:gap-4 lg:gap-6 dark:text-slate-300"
      >
        <RouterLink
          to="/home"
          class="border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600 dark:hover:border-indigo-500/40 dark:hover:text-indigo-200"
          active-class="border-indigo-400/60 text-indigo-600 dark:border-indigo-500 dark:text-indigo-300"
          @click="closeNavMenu"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/insight"
          class="border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600 dark:hover:border-indigo-500/40 dark:hover:text-indigo-200"
          active-class="border-indigo-400/60 text-indigo-600 dark:border-indigo-500 dark:text-indigo-300"
          @click="closeNavMenu"
        >
          Insight
        </RouterLink>
        <RouterLink
          to="/exchange"
          class="border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600 dark:hover:border-indigo-500/40 dark:hover:text-indigo-200"
          active-class="border-indigo-400/60 text-indigo-600 dark:border-indigo-500 dark:text-indigo-300"
          @click="closeNavMenu"
        >
          Exchange
        </RouterLink>
        <RouterLink
          to="/community"
          class="border-b-2 border-transparent pb-1 transition-colors hover:border-indigo-200 hover:text-indigo-600 dark:hover:border-indigo-500/40 dark:hover:text-indigo-200"
          active-class="border-indigo-400/60 text-indigo-600 dark:border-indigo-500 dark:text-indigo-300"
          @click="closeNavMenu"
        >
          Community
        </RouterLink>
      </nav>

      <div class="relative flex flex-wrap items-center justify-center gap-4 md:justify-center md:flex-none">
        <!-- Nav toggle -->
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-indigo-100/60 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-indigo-200 dark:focus:ring-slate-600"
          @click="toggleNavMenu"
          :aria-expanded="navMenuOpen"
          aria-controls="primary-navigation"
        >
          <!-- Hamburger icon -->
          <span class="relative block h-4 w-5" aria-hidden="true">
            <span
              class="absolute inset-x-0 top-0 h-0.5 rounded-full bg-current transition-transform"
              :class="navMenuOpen ? 'translate-y-1.5 rotate-45' : ''"
            ></span>
            <span
              class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current transition-opacity"
              :class="navMenuOpen ? 'opacity-0' : 'opacity-100'"
            ></span>
            <span
              class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current transition-transform"
              :class="navMenuOpen ? '-translate-y-1.5 -rotate-45' : ''"
            ></span>
          </span>
          <span class="text-xs uppercase tracking-[0.24em]">Menu</span>
        </button>
      </div>

      <div class="hidden items-center gap-4 lg:flex">
        <!-- Theme toggler -->
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-indigo-100/70 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-indigo-200 dark:focus:ring-slate-600"
          @click="toggleTheme"
          :aria-pressed="isDarkMode"
          :title="themeToggleLabel"
        >
          <span aria-hidden="true" class="text-base leading-none">{{ isDarkMode ? '🌙' : '☀️' }}</span>
          <span class="hidden sm:inline">{{ isDarkMode ? 'Dark' : 'Light' }}</span>
          <span class="sm:hidden">{{ isDarkMode ? 'Dark' : 'Light' }}</span>
        </button>

        <!-- Region toggler -->
        <div :ref="setRegionMenuRef" class="relative">
          <button
            type="button"
            class="inline-flex w-auto min-w-[5rem] flex-col items-center gap-1 rounded-2xl border border-indigo-100/70 bg-white px-4 py-2 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:focus:ring-slate-600"
            @click="toggleRegionMenu"
            aria-haspopup="listbox"
            :aria-expanded="regionMenuOpen"
          >
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ activeRegionLabel }}</span>
          </button>

          <div
            v-if="regionMenuOpen"
            class="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800"
          >
            <Transition :name="regionMenuTransition" mode="out-in">
              <div :key="regionMenuViewKey">
                <!-- Back button -->
                <div class="px-3">
                    <button
                      v-if="isSubregionView"
                      type="button"
                      class="inline-flex items-center gap-1 rounded-lg py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600 transition hover:bg-indigo-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-indigo-300 dark:hover:bg-slate-700/60 dark:focus:ring-slate-600"
                      @click="handleRegionMenuBack"
                    >
                      <span aria-hidden="true">←</span>
                      Regions
                    </button>
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
                            ? 'bg-indigo-50 text-indigo-700 shadow-inner dark:bg-indigo-500/20 dark:text-indigo-200'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60',
                          region.isActive === false
                            ? 'cursor-not-allowed opacity-70 hover:bg-white dark:hover:bg-slate-800'
                            : '',
                        ]"
                        @click="handleRegionSelect(region)"
                        :disabled="region.isActive === false"
                      >
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ region.label }}</span>
                          <span
                            v-if="region.statusLabel"
                            class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                            :class="region.chipClass ?? 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'"
                          >
                            {{ region.statusLabel }}
                          </span>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400">{{ region.tagline }}</p>
                      </button>

                      <!-- Expand subregions arrow button -->
                      <button
                        v-if="regionHasSubregions(region.id)"
                        type="button"
                        class="inline-flex h-full items-center justify-center rounded-xl border border-transparent px-5 py-2 text-slate-400 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-slate-300 dark:hover:bg-slate-700/60 dark:focus:ring-slate-600"
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
        <div class="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <template v-if="isAuthenticated">
            <RouterLink
              to="/profile"
              class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              <span class="hidden sm:inline">Hi, {{ displayName }}</span>
              <span class="sm:hidden">Profile</span>
            </RouterLink>
            <span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-4 py-2 text-brand ring-1 ring-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-200 dark:ring-indigo-500/30">
              <span>Stunix: {{ formattedBalance }}</span>
              <span>☕</span>
            </span>
            <button
              type="button"
              class="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              @click="logout"
            >
              Log out
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="inline-flex items-center rounded-full bg-white px-4 py-2 text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/signup"
              class="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40 dark:shadow-indigo-900/40"
            >
              Sign up
            </RouterLink>
          </template>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="navMenuOpen"
        class="ml-auto mr-4 mt-2 flex w-fit flex-col gap-4 rounded-2xl border border-indigo-100 bg-white p-4 text-sm font-semibold text-slate-600 shadow-lg transition-colors lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:shadow-slate-900/40"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-2xl border border-indigo-100/70 bg-white px-4 py-2 text-left text-sm font-semibold shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:focus:ring-slate-600"
          @click="toggleTheme"
          :aria-pressed="isDarkMode"
          :title="themeToggleLabel"
        >
          <div class="flex flex-col items-start gap-0.5">
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Appearance</span>
            <span>{{ isDarkMode ? 'Dark mode' : 'Light mode' }}</span>
          </div>
          <span aria-hidden="true" class="text-lg leading-none">{{ isDarkMode ? '🌙' : '☀️' }}</span>
        </button>

        <div :ref="setRegionMenuRef" class="relative">
          <button
            type="button"
            class="flex w-full flex-col items-start gap-1 rounded-2xl border border-indigo-100/70 bg-white px-4 py-2 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:focus:ring-slate-600"
            @click="toggleRegionMenu"
            aria-haspopup="listbox"
            :aria-expanded="regionMenuOpen"
          >
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Active region</span>
            <span class="text-base font-semibold text-slate-700 dark:text-slate-200">{{ activeRegionLabel }}</span>
          </button>

          <div
            v-if="regionMenuOpen"
            class="z-20 mt-3 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800"
          >
            <Transition :name="regionMenuTransition" mode="out-in">
              <div :key="regionMenuViewKey">
                <!-- Back button -->
                <div class="px-3">
                  <button
                    v-if="isSubregionView"
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600 transition hover:bg-indigo-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-indigo-300 dark:hover:bg-slate-700/60 dark:focus:ring-slate-600"
                    @click="handleRegionMenuBack"
                  >
                    <span aria-hidden="true">←</span>
                    Regions
                  </button>
                  <p class="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    {{ menuHeaderLabel }}
                  </p>

                  <p
                    v-if="isSubregionView && menuParentRegion?.tagline"
                    class="mt-1 text-[11px] text-slate-500 dark:text-slate-400"
                  >
                    {{ menuParentRegion.tagline }}
                  </p>
                </div>

                <!-- Region list -->
                <ul class="mt-2 grid gap-1">
                  <li v-for="region in menuRegions" :key="region.id">
                    <div class="grid grid-cols-1 gap-1">
                      <!-- Region button -->
                      <button
                        type="button"
                        class="flex w-full flex-1 flex-col gap-1 rounded-xl px-3 py-2 text-left transition"
                        :class="[
                          region.id === activeRegion?.id
                            ? 'bg-indigo-50 text-indigo-700 shadow-inner dark:bg-indigo-500/20 dark:text-indigo-200'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60',
                          region.isActive === false
                            ? 'cursor-not-allowed opacity-70 hover:bg-white dark:hover:bg-slate-800'
                            : '',
                        ]"
                        @click="handleRegionSelect(region)"
                        :disabled="region.isActive === false"
                      >
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ region.label }}</span>
                          <span
                            v-if="region.statusLabel"
                            class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                            :class="region.chipClass ?? 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'"
                          >
                            {{ region.statusLabel }}
                          </span>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400">{{ region.tagline }}</p>
                      </button>

                      <!-- Expand subregions arrow button -->
                      <button
                        v-if="regionHasSubregions(region.id)"
                        type="button"
                        class="inline-flex h-full items-center justify-center rounded-xl border border-transparent px-5 py-2 text-slate-400 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-slate-300 dark:hover:bg-slate-700/60 dark:focus:ring-slate-600"
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

        <div class="flex flex-col gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <template v-if="isAuthenticated">
            <RouterLink
              to="/profile"
              class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              Hi, {{ displayName }}
            </RouterLink>
            <span class="inline-flex w-full items-center justify-center gap-1 rounded-full bg-indigo-50 px-4 py-2 text-brand ring-1 ring-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-200 dark:ring-indigo-500/30">
              <span>Stunix: {{ formattedBalance }}</span>
              <span>☕</span>
            </span>
            <button
              type="button"
              class="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              @click="logout"
            >
              Log out
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/signup"
              class="inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-2.5 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40 dark:shadow-indigo-900/40"
            >
              Sign up
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Main display -->
  <main class="flex-1 transition-colors">
    <div class="mx-auto w-full max-w-[120rem] px-3 py-4 text-slate-800 dark:text-slate-200">
      <RouterView />
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-indigo-100/50 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800/60 dark:bg-slate-900/80">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 text-sm text-slate-600 transition-colors sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-300">
      <div class="flex flex-col gap-1 text-slate-700 dark:text-slate-200">
        <span class="text-sm font-semibold uppercase tracking-[0.08em] text-brand">StuX</span>
        <span class="text-xs text-slate-500 dark:text-slate-400">Built on Insight · Exchange · Community</span>
      </div>
      <nav class="flex items-center gap-5 text-xs text-slate-500 transition-colors sm:text-sm dark:text-slate-400">
        <a class="transition-colors hover:text-brand dark:hover:text-indigo-300" href="#">About</a>
        <a class="transition-colors hover:text-brand dark:hover:text-indigo-300" href="#">Terms</a>
        <a class="transition-colors hover:text-brand dark:hover:text-indigo-300" href="#">Contact</a>
      </nav>
      <p class="text-xs text-slate-500 transition-colors sm:text-sm dark:text-slate-400">
        <strong class="text-slate-700 dark:text-slate-200">StuX</strong> &copy; 2025 - The Human Insight Network.
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
