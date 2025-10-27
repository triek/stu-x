<script setup>
import { RouterLink } from 'vue-router'

const pillars = [
  {
    route: '/insight',
    icon: '💡',
    title: 'Insight',
    description: 'Share or join surveys & feedback.',
    stat: 'Fresh prompts daily · +20 Stunix avg',
    how: {
      title: '1. Offer your insight',
      description: 'Answer a survey, review a draft, or host a mini-mentoring session.'
    }
  },
  {
    route: '/exchange',
    icon: '🤝',
    title: 'Exchange',
    description: 'Find mentors or trade study help.',
    stat: 'Swap skills · +35 Stunix avg',
    how: {
      title: '2. Earn Stunix',
      description: 'Each contribution rewards verified stunix you can trust across the network.'
    }
  },
  {
    route: '/community',
    icon: '💬',
    title: 'Community',
    description: 'Discuss, review, and reflect.',
    stat: 'Thoughtful threads · +15 Stunix avg',
    how: {
      title: '3. Redeem trusted help',
      description: 'Spend stunix on feedback, study buddies, or community reflections when you need them.'
    }
  }
]
</script>

<template>
<section class="flex flex-col gap-5">
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

  <!-- 3 pillar cards -->
  <div class="grid gap-4 md:grid-cols-3">
    <div
      v-for="pillar in pillars"
      :key="pillar.title"
      class="group relative pt-28 pb-6"
    >
      <RouterLink
        :to="pillar.route"
        class="absolute inset-x-0 top-0 z-20 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-panel ring-1 ring-indigo-100/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <span class="text-4xl">{{ pillar.icon }}</span>
        <h2 class="text-2xl font-semibold text-slate-900">{{ pillar.title }}</h2>
        <p class="text-base text-slate-600">{{ pillar.description }}</p>
        <span class="text-sm font-semibold text-brand">{{ pillar.stat }}</span>
      </RouterLink>

      <!-- How it works -->
      <div
        class="relative z-10 rounded-2xl bg-white/50 px-7 pb-7 pt-36 shadow-panel ring-1 ring-indigo-100/60 transition-transform duration-300 group-hover:-translate-y-1"
      >
        <h3 class="text-lg font-semibold text-slate-800">{{ pillar.how.title }}</h3>
        <p class="text-sm text-slate-600">{{ pillar.how.description }}</p>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
</style>
