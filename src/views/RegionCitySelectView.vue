<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getCitiesForRegion } from '@/constants/regionSchools'
import { useRegionStore } from '@/stores/region'

const route = useRoute()
const router = useRouter()
const regionStore = useRegionStore()

const regionId = computed(() => route.params.regionId?.toString().toLowerCase() ?? '')
const regionMeta = computed(() => regionStore.getRegionMeta(regionId.value))
const cities = computed(() => getCitiesForRegion(regionId.value))

watchEffect(() => {
  if (!regionMeta.value) {
    router.replace({ name: 'landing' })
    return
  }

  if (regionMeta.value && !cities.value.length) {
    router.replace({ name: 'region-schools', params: { regionId: regionId.value } })
  }
})

const handleCitySelect = (city) => {
  if (!city?.regionId || city.isActive === false) return

  regionStore.setRegion(city.regionId)
  router.push({ name: 'region-schools', params: { regionId: city.regionId } })
}

const goBack = () => {
  router.push({ name: 'landing' })
}
</script>

<template>
  <section class="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl bg-white p-6 shadow-panel ring-1 ring-indigo-100/60 sm:p-10">
    <button
      type="button"
      class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
      @click="goBack"
    >
      ← Back to landing
    </button>

    <header class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Choose your city</p>
      <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">
        {{ regionMeta?.label ?? 'Select your region' }}
      </h1>
      <p v-if="regionMeta?.tagline" class="text-slate-600">
        {{ regionMeta.tagline }}
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2">
      <button
        v-for="city in cities"
        :key="city.id"
        type="button"
        class="group flex flex-col gap-2 rounded-2xl border p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        :class="[
          city.isActive !== false
            ? 'border-indigo-100/80 bg-white/80'
            : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400',
        ]"
        @click="handleCitySelect(city)"
      >
        <span
          class="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
          :class="city.accent ?? 'bg-indigo-50 text-indigo-700'"
        >
          <span>{{ city.label }}</span>
          <span
            v-if="city.statusLabel"
            class="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
          >
            {{ city.statusLabel }}
          </span>
        </span>
        <span class="text-sm text-slate-600" :class="{ 'text-slate-400': city.isActive === false }">
          {{ city.description || 'Join peers and collaborators in this city network.' }}
        </span>
        <span
          v-if="city.isActive !== false"
          class="text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100"
        >
          Choose city →
        </span>
        <span v-else class="text-xs font-semibold text-slate-400">Coming soon</span>
      </button>
    </div>

    <p v-if="!cities.length" class="text-sm text-slate-500">
      We’re still onboarding cities for this region. Check back soon or request your city on the landing page.
    </p>
  </section>
</template>

<style scoped>
section {
  background-image: linear-gradient(145deg, rgba(238, 242, 255, 0.6), rgba(255, 255, 255, 0.9));
}
</style>
