<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
<section class="flex flex-col gap-12">
  <!-- Banner -->
  <div class="grid gap-6 rounded-3xl bg-white p-10 shadow-primary ring-1 ring-indigo-100/60 sm:p-12">
    <p class="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Built on Insight · Exchange · Community</p>
    <h1 class="max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-[52px]">
      Experience-powered learning, unlocked by the StuX network.
    </h1>
    <p class="max-w-2xl text-lg text-slate-600">
      Earn Stunix by helping others, spend them to get help.
    </p>
    <div class="flex flex-wrap gap-3">
      <RouterLink
        to="/insight"
        class="inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40"
      >
        Explore Opportunities
      </RouterLink>
      <RouterLink
        to="/profile"
        class="inline-flex items-center rounded-full bg-indigo-100 px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-indigo-200/70"
      >
        Check Your Wallet
      </RouterLink>
    </div>
  </div>

  <!-- 3 pillars -->
  <div class="grid gap-6 md:grid-cols-3">

    <!-- Insight -->
    <RouterLink
      to="/insight"
      class="group flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-panel ring-1 ring-indigo-100/50 transition-transform hover:-translate-y-1 hover:shadow-xl">
      <span class="text-4xl">💡</span>
      <h2 class="text-2xl font-semibold text-slate-900">Insight</h2>
      <p class="text-base text-slate-600">Share or join surveys &amp; feedback.</p>
      <span class="text-sm font-semibold text-brand">Fresh prompts daily · +20 Stunix avg</span>
    </RouterLink>

    <!-- Exchange -->
    <RouterLink
      to="/exchange"
      class="group flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-panel ring-1 ring-indigo-100/50 transition-transform hover:-translate-y-1 hover:shadow-xl">
      <span class="text-4xl">🤝</span>
      <h2 class="text-2xl font-semibold text-slate-900">Exchange</h2>
      <p class="text-base text-slate-600">Find mentors or trade study help.</p>
      <span class="text-sm font-semibold text-brand-exchange">Swap skills · +35 Stunix avg</span>
    </RouterLink>

    <!-- Community -->
    <RouterLink
      to="/community"
      class="group flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-panel ring-1 ring-indigo-100/50 transition-transform hover:-translate-y-1 hover:shadow-xl">
      <span class="text-4xl">💬</span>
      <h2 class="text-2xl font-semibold text-slate-900">Community</h2>
      <p class="text-base text-slate-600">Discuss, review, and reflect.</p>
      <span class="text-sm font-semibold text-brand-community">Thoughtful threads · +15 Stunix avg</span>
    </RouterLink>
  </div>

  <!-- How it works -->
  <div class="grid gap-5 md:grid-cols-3">
    <div class="grid gap-3 rounded-2xl bg-white/90 p-7 shadow-panel ring-1 ring-indigo-100/60">
      <h3 class="text-xl font-semibold text-slate-800">1. Offer your insight</h3>
      <p class="text-slate-600">Answer a survey, review a draft, or host a mini-mentoring session.</p>
    </div>

    <div class="grid gap-3 rounded-2xl bg-white/90 p-7 shadow-panel ring-1 ring-indigo-100/60">
      <h3 class="text-xl font-semibold text-slate-800">2. Earn Stunix</h3>
      <p class="text-slate-600">Each contribution rewards verified stunix you can trust across the network.</p>
    </div>

    <div class="grid gap-3 rounded-2xl bg-white/90 p-7 shadow-panel ring-1 ring-indigo-100/60">
      <h3 class="text-xl font-semibold text-slate-800">3. Redeem trusted help</h3>
      <p class="text-slate-600">Spend stunix on feedback, study buddies, or community reflections when you need them.</p>
    </div>
  </div>
</section>
</template>

<style scoped>
</style>
