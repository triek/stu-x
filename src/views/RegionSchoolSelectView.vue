<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRegionStore } from '@/stores/region'
import { getCitiesForRegion, getSchoolsForRegion } from '@/constants/regionSchools'

const route = useRoute()
const router = useRouter()
const regionStore = useRegionStore()

const regionId = computed(() => route.params.regionId?.toString().toLowerCase() ?? '')
const regionMeta = computed(() => regionStore.getRegionMeta(regionId.value))
const schools = computed(() => getSchoolsForRegion(regionId.value))
const cities = computed(() => getCitiesForRegion(regionId.value))

watchEffect(() => {
  if (!regionMeta.value) {
    router.replace({ name: 'landing' })
    return
  }

  if (cities.value.length && regionId.value) {
    router.replace({ name: 'region-cities', params: { regionId: regionId.value } })
  }
})

const handleSchoolSelect = (school) => {
  if (!school?.regionId || school.isActive === false) return

  regionStore.setRegion(school.regionId)
  router.push({ name: 'insight' })
}

const goBack = () => {
  router.push({ name: 'landing' })
}
</script>

<template>
  <section
    class="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl bg-white dark:bg-slate-900/80 p-6 shadow-panel ring-1 ring-indigo-100/60 sm:p-10"
  >
    <button
      type="button"
      class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
      @click="goBack"
    >
      ← Back to landing
    </button>

    <header class="space-y-3">
      <p
        class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300"
      >
        Choose your school
      </p>
      <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">
        {{ regionMeta?.label ?? 'Select your region' }}
      </h1>
      <p v-if="regionMeta?.tagline" class="text-slate-600 dark:text-slate-300">
        {{ regionMeta.tagline }}
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2">
      <button
        v-for="school in schools"
        :key="school.id"
        type="button"
        class="group flex flex-col gap-2 rounded-2xl border p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        :class="[
          school.isActive !== false
            ? 'border-indigo-100/80 bg-white/80 dark:bg-slate-800/50 dark:border-indigo-900/40'
            : 'cursor-not-allowed border-slate-200 bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500',
        ]"
        @click="handleSchoolSelect(school)"
      >
        <span
          class="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
          :class="
            school.accent ??
            'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200'
          "
        >
          <span>{{ school.label }}</span>
          <span
            v-if="school.statusLabel"
            class="rounded-full bg-white/70 dark:bg-slate-800/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
          >
            {{ school.statusLabel }}
          </span>
        </span>
        <span
          class="text-sm text-slate-600 dark:text-slate-300"
          :class="{ 'text-slate-400 dark:text-slate-500': school.isActive === false }"
        >
          {{ school.description || 'Join peers and collaborators in this network.' }}
        </span>
        <span
          v-if="school.isActive !== false"
          class="text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100"
        >
          Go to insights →
        </span>
        <span v-else class="text-xs font-semibold text-slate-400">Coming soon</span>
      </button>
    </div>

    <p v-if="!schools.length" class="text-sm text-slate-500 dark:text-slate-300">
      We’re still onboarding schools for this region. Check back soon or request your school on the
      landing page.
    </p>
  </section>
</template>

<style scoped>
section {
  background-image: linear-gradient(145deg, rgba(238, 242, 255, 0.6), rgba(255, 255, 255, 0.9));
}
</style>
