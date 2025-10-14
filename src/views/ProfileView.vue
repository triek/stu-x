<script setup>
const recentActions = [
  {
    id: 1,
    delta: '+20 Stunix',
    description: 'Completed survey - Inclusive onboarding research',
  },
  {
    id: 2,
    delta: '+35 Stunix',
    description: 'Hosted mentor session - Portfolio storytelling clinic',
  },
  {
    id: 3,
    delta: '-50 Stunix',
    description: 'Posted feedback request - Systems design prototype',
  },
]
</script>

<template>
  <section class="grid gap-10">
    <div
      class="grid gap-8 rounded-3xl bg-white p-10 shadow-panel ring-1 ring-indigo-100/60 md:grid-cols-[auto,1fr,auto] md:items-center">

      <!-- Profile picture -->
      <div class="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-brand to-indigo-400 text-3xl font-bold uppercase tracking-[0.08em] text-white">
        KR
      </div>

      <!-- Profile card -->
      <div class="space-y-3">
        <h1 class="text-3xl font-bold text-slate-900">Keanu Reeves</h1>
        <p class="text-base leading-relaxed text-slate-600">
          Explorer of peer wisdom, like having sandwich on a bench during break, can help with movie acting and bass playing advices.
        </p>
      </div>

      <!-- Total Stunix -->
      <div class="grid justify-items-end gap-1 text-right text-slate-600 md:justify-items-end">
        <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Total stunix</span>
        <span class="text-2xl font-bold text-brand">100 🪙</span>
      </div>
    </div>

    <!-- Activity card -->
    <div class="grid gap-6 rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60">
      <h2 class="text-2xl font-semibold text-slate-900">Recent actions</h2>
      <ul class="grid gap-4">
        <li
          v-for="item in recentActions"
          :key="item.id"
          class="grid gap-2 rounded-2xl bg-indigo-50/80 px-5 py-4">
          <span class="text-sm font-semibold text-brand">{{ item.delta }}</span>
          <p class="text-sm text-slate-600">{{ item.description }}</p>
        </li>
      </ul>
    </div>

    <button
      type="button"
      class="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40 justify-self-center md:justify-self-end">
      Earn More Stunix
    </button>
  </section>
</template>

<style scoped>
</style>
