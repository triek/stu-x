<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'

import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const { isAuthenticated, stunixBalance, displayName } = storeToRefs(authStore)

const formattedBalance = computed(() =>
  new Intl.NumberFormat('en-US').format(stunixBalance.value)
)

const logout = () => {
  authStore.logout()
}
</script>

<template>
<div class="flex min-h-screen flex-col">
  <header class="sticky top-0 z-10 border-b border-indigo-100/50 bg-white/80 backdrop-blur-xl">
    <div class="mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <RouterLink to="/" class="flex flex-col text-slate-900 no-underline">
        <span class="text-2xl font-bold uppercase tracking-[0.08em] text-brand">StuX</span>
        <span class="text-sm font-medium text-slate-500">The Human Insight Network</span>
      </RouterLink>

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
            <span>🍵</span>
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
