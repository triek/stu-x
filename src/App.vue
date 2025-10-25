<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'

import { useAuthStore } from './stores/auth'
import { useRegionStore } from './stores/region'

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

const toggleRegionMenu = () => {
  regionMenuOpen.value = !regionMenuOpen.value
}

const closeRegionMenu = () => {
  regionMenuOpen.value = false
}

const handleRegionSelect = (region) => {
  if (!region?.id || region.isActive === false) {
    return
  }

  regionStore.setRegion(region.id)
  closeRegionMenu()
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
          <!-- Region list -->
          <p class="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Regions</p>
          <ul class="mt-2 grid gap-1">
            <li v-for="region in availableRegions" :key="region.id">
              <button
                type="button"
                class="flex w-full flex-col gap-1 rounded-xl px-3 py-2 text-left transition"
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
            </li>
          </ul>
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
</style>
