<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
<div class="flex min-h-screen flex-col">
  <header class="sticky top-0 z-10 border-b border-indigo-100/50 bg-white/90 backdrop-blur-xl">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <RouterLink to="/" class="flex flex-col text-slate-900 no-underline">
        <span class="text-2xl font-bold uppercase tracking-[0.08em] text-brand">StuX</span>
        <span class="text-sm font-medium text-slate-500">The Human Insight Network</span>
      </RouterLink>

      <!-- Nav items -->
      <nav class="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 sm:gap-6">
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

      <!-- Login -->
      <div class="flex items-center gap-3 text-sm">
        <div class="rounded-full bg-indigo-100/80 px-3.5 py-1 font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200/60">
          Stunix: 100 🪙
        </div>
        <button
          class="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40"
          type="button"
        >
          Sign Up / Log In
        </button>
      </div>
    </div>
  </header>

  <!-- Main display -->
  <main class="flex-1">
    <div class="mx-auto w-full max-w-6xl px-3 py-4">
      <RouterView />
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-indigo-100/50 bg-white/90 backdrop-blur-md">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div class="flex flex-col gap-1">
        <span class="text-sm font-semibold uppercase tracking-[0.08em] text-brand">StuX</span>
        <span class="text-xs text-slate-500">Built on Insight · Exchange · Community</span>
      </div>
      <p class="text-xs sm:text-sm">
        <strong>StuX</strong> &copy; 2025 - The Human Insight Network.
      </p>
    </div>
  </footer>
</div>
</template>

<style scoped>
</style>
