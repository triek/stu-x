<script setup>
import { RouterView } from 'vue-router'

import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col text-slate-900 transition-colors duration-300 dark:text-slate-100">
    <AppHeader />

    <main class="flex-1 transition-colors">
      <div class="mx-auto w-full max-w-[120rem] px-3 py-4 text-slate-800 dark:text-slate-200">
        <RouterView />
      </div>
    </main>

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
