<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  formDefaults: {
    type: Object,
    default: () => ({}),
  },
})

const accent = computed(() => props.config.accent ?? '#4338ca')
const bannerLabel = computed(
  () => props.config.overline ?? `StuX ${props.config.title} Hub`,
)
const headline = computed(() => props.config.headline ?? props.config.title)

const defaultFormState = computed(() => ({
  title: '',
  description: '',
  reward: '20',
  ...props.formDefaults,
}))

const formState = reactive({ ...defaultFormState.value })

watch(
  defaultFormState,
  (value) => {
    Object.assign(formState, value)
  },
  { deep: true },
)

const showForm = ref(false)

const resetFormState = () => {
  Object.assign(formState, defaultFormState.value)
}

const openForm = () => {
  resetFormState()
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const submitForm = () => {
  closeForm()
}
</script>

<template>
  <section class="flex flex-col gap-8">
    <header
      class="grid gap-6 rounded-3xl bg-white p-8 shadow-banner ring-1"
      :style="{ '--tw-ring-color': `${accent}33` }"
    >
      <div class="flex items-center gap-4">
        <span class="text-5xl md:text-6xl">{{ config.icon }}</span>
        <div class="space-y-2">
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{{ bannerLabel }}</p>
          <h1 class="text-3xl font-bold text-slate-900 md:text-[40px]">{{ headline }}</h1>
        </div>
      </div>
      <p v-if="config.description" class="max-w-3xl text-base text-slate-600">
        {{ config.description }}
      </p>
      <div v-if="config.highlights?.length" class="flex flex-wrap gap-3 text-sm text-slate-600">
        <span
          v-for="highlight in config.highlights"
          :key="highlight"
          class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-semibold"
        >
          {{ highlight }}
        </span>
      </div>
    </header>

    <div class="grid gap-6 md:grid-cols-[minmax(0,260px),1fr]">
      <aside
        class="grid gap-6 rounded-3xl bg-white p-7 shadow-panel ring-1"
        :style="{ '--tw-ring-color': `${accent}22` }"
      >
        <div class="grid gap-3">
          <label class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500" for="pillar-search">
            Search
          </label>
          <div class="relative">
            <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">🔍</span>
            <input
              id="pillar-search"
              type="search"
              placeholder="Search topics or tags..."
              class="w-full rounded-full border border-slate-200 px-4 py-2.5 pl-11 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div v-if="config.categories?.length" class="grid gap-3">
          <h3 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Categories</h3>
          <nav class="grid gap-2 text-sm font-medium text-slate-600">
            <button
              v-for="category in config.categories"
              :key="category"
              type="button"
              class="rounded-2xl border border-indigo-100/70 px-4 py-2 text-left transition hover:border-indigo-200 hover:text-brand"
            >
              {{ category }}
            </button>
          </nav>
        </div>

        <div v-if="config.tags?.length" class="grid gap-3">
          <h3 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in config.tags"
              :key="tag"
              class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="grid gap-3">
          <h3 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Sort by</h3>
          <div class="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
            <button
              v-for="sort in config.sortFilters ?? ['Latest', 'Most Popular', 'Reward Points']"
              :key="sort"
              type="button"
              class="rounded-full border border-indigo-100/80 px-4 py-2 transition hover:border-indigo-200 hover:text-brand"
            >
              {{ sort }}
            </button>
          </div>
        </div>
      </aside>

      <div class="grid gap-6">
        <div class="grid gap-3">
          <slot name="feed" :items="config.feed" :accent="accent">
            <article
              v-for="item in config.feed"
              :key="item.title"
              class="grid gap-5 rounded-2xl bg-white p-6 shadow-panel ring-1"
              :style="{ '--tw-ring-color': `${accent}22` }"
            >
              <header class="flex items-start gap-4">
                <span class="text-3xl">{{ config.icon }}</span>
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold text-slate-900">{{ item.title }}</h3>
                  <p class="text-slate-600">{{ item.description }}</p>
                </div>
              </header>

              <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-5 py-4">
                <span class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <span>💎</span>
                  <span>{{ item.reward }} Stunix</span>
                </span>

                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  :style="{
                    backgroundColor: accent,
                    boxShadow: `0 18px 32px ${accent}45`,
                  }"
                >
                  {{ item.cta ?? config.actionLabel ?? 'Engage' }}
                </button>
              </div>
            </article>
          </slot>
        </div>

        <footer class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            @click="openForm"
            :style="{
              backgroundImage: `linear-gradient(135deg, ${accent}, ${accent}cc)` ,
              boxShadow: `0 20px 36px ${accent}40`,
            }"
          >
            {{ config.createLabel ?? `Create ${config.title} post` }}
          </button>
        </footer>
      </div>
    </div>

    <div
      v-if="showForm"
      class="fixed inset-0 z-20 grid place-items-center bg-slate-900/50 px-4"
      @click.self="closeForm"
    >
      <form
        class="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl ring-1"
        :style="{ '--tw-ring-color': `${accent}33` }"
        @submit.prevent="submitForm"
      >
        <h2 class="text-2xl font-semibold" :style="{ color: accent }">
          Create {{ config.title }} post
        </h2>
        <div class="mt-6 grid gap-6">
          <slot name="form-fields" :form-state="formState" :config="config">
            <label class="grid gap-2 text-sm font-semibold text-slate-800">
              Title
              <input
                v-model="formState.title"
                type="text"
                placeholder="Give it a headline"
                class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label class="grid gap-2 text-sm font-semibold text-slate-800">
              Summary
              <textarea
                v-model="formState.description"
                rows="3"
                placeholder="Describe what you need or how you can help"
                class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              ></textarea>
            </label>

            <label class="grid gap-2 text-sm font-semibold text-slate-800">
              Reward (Stunix)
              <input
                v-model="formState.reward"
                type="number"
                min="5"
                step="5"
                class="w-32 rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
            </label>
          </slot>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
            @click="closeForm"
            :style="{ backgroundColor: `${accent}15`, color: accent }"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            :style="{
              backgroundColor: accent,
              boxShadow: `0 18px 32px ${accent}45`,
            }"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.shadow-banner {
  box-shadow: 0 30px 70px -30px rgba(67, 56, 202, 0.18);
}

.shadow-panel {
  box-shadow: 0 12px 32px -20px rgba(79, 70, 229, 0.35);
}

.text-brand {
  color: #4338ca;
}
</style>
