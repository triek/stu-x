<script setup>
import { RouterLink } from 'vue-router'

const steps = [
  {
    title: '1. Offer your insight',
    description: 'Answer a survey, review a draft, or provide feedback.'
  },
  {
    title: '2. Earn Stunix',
    description: 'Each contribution rewards verified stunix you can trust across the network.'
  },
  {
    title: '3. Redeem help',
    description: 'Spend stunix on requests: survey data, project feedback, or donate them.'
  }
]

const pillars = [
  {
    route: '/insight',
    icon: '💡',
    title: 'Insight',
    description: 'Share or join surveys & feedback.',
    stat: 'Spend and earn Stunix',
    how: {
      title: 'A. Spend and earn Stunix',
      description1: 'Join or host short surveys and feedback rounds for real student projects.',
      description2: 'Share opinions, gather data, and earn Stunix for every meaningful response.'
    }
  },
  {
    route: '/exchange',
    icon: '🤝',
    title: 'Exchange',
    description: 'Find mentors or trade study help.',
    stat: 'Non-Stunix trading',
    how: {
      title: 'B. Non-Stunix trading',
      description1: 'Find mentors or peers to trade study help and specialized skills.',
      description2: 'Build your profile, gain trust, and grow through mutual learning rewards.'
    }
  },
  {
    route: '/community',
    icon: '💬',
    title: 'Community',
    description: 'Discuss, review, and reflect.',
    stat: 'Discussion forum',
    how: {
      title: 'C. Discussion forum',
      description1: 'Discuss study experiences and reflect on challenges together.',
      description2: 'Post ideas, support others, and earn Stunix through authentic contributions.'
    }
  }
]
</script>

<template>
<section class="flex flex-col gap-5">
  <!-- Banner -->
  <div
    class="grid gap-12 rounded-3xl bg-white p-10 shadow-primary ring-1 ring-indigo-100/60 sm:p-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center"
  >
    <div class="flex flex-col gap-6">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Built on Insight · Exchange · Community</p>
      <h1 class="max-w-2xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-[48px]">
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

    <!-- 3 steps -->
    <div class="grid gap-3 rounded-2xl bg-slate-100/50 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6 lg:col-start-2 lg:grid-cols-1 lg:self-start">
      <div
        v-for="step in steps"
        :key="step.title"
        class="flex flex-col gap-2 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-indigo-100/60"
      >
        <h3 class="text-lg font-semibold text-brand">{{ step.title }}</h3>
        <p class="text-sm text-slate-600">{{ step.description }}</p>
      </div>
    </div>
  </div>

  <!-- 3 pillar cards -->
  <div class="grid gap-4 md:auto-rows-fr md:grid-cols-3">
    <div
      v-for="pillar in pillars"
      :key="pillar.title"
      class="group relative flex h-full flex-col"
    >
      <RouterLink
        :to="pillar.route"
        class="z-20 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-panel ring-1 ring-indigo-100/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex flex-wrap gap-3">
          <span class="text-4xl">{{ pillar.icon }}</span>
          <h2 class="text-2xl font-semibold text-slate-900">{{ pillar.title }}</h2>
        </div>
        <p class="text-base text-slate-600">{{ pillar.description }}</p>
      </RouterLink>

      <!-- How it works -->
      <div
        class="relative z-10 -mt-10 flex flex-1 flex-col rounded-2xl bg-white/50 px-7 pb-7 pt-16 shadow-panel ring-1 ring-indigo-100/60 transition-transform duration-300 group-hover:-translate-y-1 md:-mt-16 md:pt-20 gap-2"
      >
        <h3 class="text-lg font-semibold text-slate-800">{{ pillar.how.title }}</h3>
        <p class="text-sm text-slate-600">{{ pillar.how.description1 }}</p>
        <p class="text-sm text-slate-600">{{ pillar.how.description2 }}</p>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
</style>
