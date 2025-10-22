<script setup>
import { RouterLink } from 'vue-router'
import { PILLAR_ACCENTS } from '@/constants/pillarAccents'
import { withAlpha } from '@/utils/color'

const regions = [
  {
    title: 'North America',
    description: 'United States · Canada',
    accent: 'bg-indigo-100 text-indigo-700',
  },
  {
    title: 'Europe',
    description: 'United Kingdom · EU',
    accent: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Asia-Pacific',
    description: 'India · Singapore · Australia',
    accent: 'bg-amber-100 text-amber-700',
  },
]

const schools = [
  'StuX International Academy',
  'Open Learning Collective',
  'Community College Network',
]

const pillars = [
  {
    title: 'Insight',
    description: 'Share or join research studies and request feedback',
    accent: PILLAR_ACCENTS.insight,
  },
  {
    title: 'Exchange',
    description: 'Find or offer help, courses, and study exchanges',
    accent: PILLAR_ACCENTS.exchange,
  },
  {
    title: 'Community',
    description: 'Share stories, discuss, review, and reflect with peers',
    accent: PILLAR_ACCENTS.community,
  },
].map((pillar) => ({
  ...pillar,
  surface: withAlpha(pillar.accent, '18'),
  border: withAlpha(pillar.accent, '40'),
}))
</script>

<template>
  <section class="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
    <div class="grid gap-10 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-10 shadow-primary ring-1 ring-indigo-100/70 sm:p-14">
      <div class="space-y-4">
        <div class="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand shadow-sm ring-1 ring-indigo-100">
          <span>StuX</span>
          <span class="text-slate-400">Network</span>
        </div>
        <h1 class="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-[56px]">
          Experience-powered learning starts here.
        </h1>
        <p class="max-w-2xl text-lg text-slate-600">
          Join the StuX community to earn Stunix by sharing knowledge, choose your learning region or school, and unlock a curated network of peers ready to collaborate.
        </p>
      </div>

      <div class="grid gap-6">
        <div class="space-y-3">
          <h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Choose your region</h2>
          <div class="grid gap-4 sm:grid-cols-3">
            <button
              v-for="region in regions"
              :key="region.title"
              type="button"
              class="group grid gap-3 rounded-2xl bg-white/80 p-4 text-left shadow-panel ring-1 ring-indigo-100/70 transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <span :class="['inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold', region.accent]">{{ region.title }}</span>
              <span class="text-sm text-slate-600">{{ region.description }}</span>
              <span class="text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">Coming Soon →</span>
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Or pick your school</h2>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="school in schools"
              :key="school"
              type="button"
              class="rounded-full border border-indigo-100/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
            >
              {{ school }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-dashed border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700"
            >
              <span>Request my school</span>
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <RouterLink
          to="/signup"
          class="inline-flex items-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40"
        >
          Create your account
        </RouterLink>
        <RouterLink
          to="/login"
          class="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-50"
        >
          Log in
        </RouterLink>
        <p class="text-sm text-slate-500">Already part of a partner school? Use your issued StuX ID.</p>
      </div>
    </div>

    <div class="grid gap-8 rounded-3xl border border-indigo-100/70 bg-white/90 p-8 shadow-panel">
      <div class="space-y-3">
        <h2 class="text-2xl font-semibold text-slate-900">Why StuX?</h2>
        <p class="text-slate-600">
          We blend verified experience, community mentorship, and exchange-driven learning to help every student grow faster together.
        </p>
      </div>

      <dl class="grid gap-5">
        <div
          v-for="pillar in pillars"
          :key="pillar.title"
          class="rounded-2xl border p-5"
          :style="{ backgroundColor: pillar.surface, borderColor: pillar.border }">
        <dt
          class="text-sm font-semibold uppercase tracking-[0.22em]"
          :style="{ color: pillar.accent }">
          {{ pillar.title }}
        </dt>
        <dd class="mt-2 text-sm text-slate-600">{{ pillar.description }}</dd>
        </div>
      </dl>

      <div class="rounded-2xl bg-slate-900 p-6 text-white">
        <p class="text-sm uppercase tracking-[0.18em] text-slate-300">Beta Access</p>
        <p class="mt-2 text-lg font-semibold">Founding cohort seats are limited.</p>
        <RouterLink
          to="/signup"
          class="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          Reserve your spot →
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
