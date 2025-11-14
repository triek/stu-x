<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import RegionMenu from './RegionMenu.vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useRegionMenu } from '../composables/useRegionMenu'

const authStore = useAuthStore()
const { isAuthenticated, stunixBalance, displayName } = storeToRefs(authStore)

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

const regionMenu = useRegionMenu()

const navMenuOpen = ref(false)

onBeforeMount(() => {
  themeStore.initTheme()
})

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const themeToggleLabel = computed(() =>
  isDarkMode.value ? 'Switch to light mode' : 'Switch to dark mode',
)

const formattedBalance = computed(() =>
  new Intl.NumberFormat('en-US').format(stunixBalance.value),
)

const logout = () => {
  authStore.logout()
}

const toggleNavMenu = () => {
  const nextState = !navMenuOpen.value
  navMenuOpen.value = nextState

  if (!nextState) {
    regionMenu.closeRegionMenu()
  }
}

const closeNavMenu = () => {
  navMenuOpen.value = false
  regionMenu.closeRegionMenu()
}

const handleRegionSelect = (region) => {
  const wasSelected = regionMenu.selectRegion(region)
  if (wasSelected) {
    closeNavMenu()
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-indigo-100/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80 relative"
  >
    <div
      class="mx-auto flex w-full flex-col items-center gap-4 px-4 py-4 text-slate-900 transition-colors sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-100"
    >
      <RouterLink to="/" class="flex flex-col text-slate-900 no-underline dark:text-slate-100">
        <div class="flex flex-col items-center text-center sm:items-start sm:text-left">
          <span class="text-2xl font-bold uppercase tracking-[0.08em] text-brand">StuX</span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">The Human Insight Network</span>
        </div>
      </RouterLink>

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
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-indigo-100/60 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-indigo-200 dark:focus:ring-slate-600"
          @click="toggleNavMenu"
          :aria-expanded="navMenuOpen"
          aria-controls="primary-navigation"
        >
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

        <RegionMenu
          :controller="regionMenu"
          variant="desktop"
          @select="handleRegionSelect"
        />

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
              @click="closeNavMenu"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/signup"
              class="btn btn-brand px-5 py-2.5 dark:shadow-indigo-900/40"
              @click="closeNavMenu"
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
        class="absolute right-4 top-full z-50 mt-3 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-2xl border border-indigo-100 bg-white p-4 text-sm font-semibold text-slate-600 shadow-lg transition-colors lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:shadow-slate-900/40"
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

        <RegionMenu
          :controller="regionMenu"
          variant="mobile"
          @select="handleRegionSelect"
        />

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
              @click="closeNavMenu"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/signup"
              class="btn btn-brand w-full px-5 py-2.5 dark:shadow-indigo-900/40"
              @click="closeNavMenu"
            >
              Sign up
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
