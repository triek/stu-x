<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto grid max-w-5xl gap-10 rounded-3xl bg-white/90 p-8 shadow-primary ring-1 ring-indigo-100/60 lg:grid-cols-2 lg:p-12">
    <div class="space-y-6">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Welcome back</p>
        <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">Log in to StuX</h1>
        <p class="text-sm text-slate-600">Enter your credentials to continue your journey through Insight, Exchange, and Community.</p>
      </div>
      <ul class="grid gap-4 text-sm text-slate-600">
        <li class="flex items-center gap-3 rounded-2xl bg-indigo-50/80 p-4"><span class="text-lg">💡</span><span>Access saved insights and ongoing exchanges.</span></li>
        <li class="flex items-center gap-3 rounded-2xl bg-emerald-50/80 p-4"><span class="text-lg">🤝</span><span>Track Stunix balances and pending mentorship requests.</span></li>
        <li class="flex items-center gap-3 rounded-2xl bg-amber-50/80 p-4"><span class="text-lg">💬</span><span>Continue community reflections with your cohort.</span></li>
      </ul>
      <p class="text-sm text-slate-500">
        Need an account?
        <RouterLink to="/signup" class="font-semibold text-brand hover:underline">Create one here</RouterLink>.
      </p>
    </div>

    <form class="grid gap-6 rounded-3xl border border-indigo-100/70 bg-white/80 p-6 shadow-panel">
      <div class="grid gap-2">
        <label for="email" class="text-sm font-semibold text-slate-700">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          autocomplete="email"
          class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="you@example.com"
        />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center justify-between">
          <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
          <a href="#" class="text-xs font-semibold text-brand hover:underline">Forgot?</a>
        </div>
        <input
          id="password"
          type="password"
          name="password"
          autocomplete="current-password"
          class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="••••••••"
        />
      </div>
      <label class="flex items-center gap-3 text-sm text-slate-600">
        <input type="checkbox" name="remember" class="h-4 w-4 rounded border-indigo-200 text-brand focus:ring-indigo-200" />
        Remember this device
      </label>
      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40"
      >
        Log in
      </button>
      <p class="text-xs text-slate-500">By logging in you agree to the StuX community guidelines and honor-code.</p>
    </form>
  </section>
</template>

<style scoped>
</style>
