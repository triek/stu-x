<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { withAlpha } from '@/utils/color'

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

const accentColor = computed(() => props.config.accent ?? '#4338ca')

const accentWithAlpha = (alphaHex) => withAlpha(accentColor.value, alphaHex)

const accentStyles = computed(() => ({
  '--pillar-accent': accentColor.value,
  '--pillar-ring-strong': accentWithAlpha('75'),
  '--pillar-ring-soft': accentWithAlpha('25'),
  '--pillar-ring-overlay': accentWithAlpha('50'),
  '--pillar-shadow-banner': `0 30px 70px -30px ${accentWithAlpha('30')}`,
  '--pillar-shadow-panel': `0 12px 32px -20px ${accentWithAlpha('35')}`,
  '--pillar-shadow-cta': `0 10px 16px ${accentWithAlpha('45')}`,
  '--pillar-shadow-cta-strong': `0 12px 24px ${accentWithAlpha('40')}`,
  '--pillar-surface-muted': accentWithAlpha('15'),
}))

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
  <section class="flex flex-col gap-3" :style="accentStyles">
    <!-- Banner -->
    <header
      class="grid gap-6 sm:grid-cols-2 rounded-3xl bg-white p-8 shadow-banner ring-1"
      :style="{ '--tw-ring-color': 'var(--pillar-ring-strong)' }">

      <!-- Headline -->
      <div class="grid gap-3">
        <div class="flex items-center gap-4">
          <span class="text-5xl md:text-6xl">{{ config.icon }}</span>
          <h1 class="text-3xl font-bold text-slate-900 md:text-[40px]">{{ headline }}</h1>
        </div>

        <p v-if="config.description" class="max-w-3xl text-base text-slate-600">
          {{ config.description }}
        </p>
      </div>

      <!-- Highlights -->
      <div v-if="config.highlights?.length" class="flex flex-col items-end gap-3 self-start justify-self-end text-sm text-slate-600">
        <span
          v-for="highlight in config.highlights"
          :key="highlight"
          class="inline-flex w-auto max-w-max self-auto items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-semibold whitespace-nowrap">
          {{ highlight }}
        </span>
      </div>
    </header>

    <!-- Side bar -->
    <div class="grid gap-3 lg:grid-cols-[minmax(0,_260px)_1fr]">
      <div class="grid gap-3 self-start lg:sticky lg:top-24">
        <aside
          class="grid gap-6 rounded-3xl bg-white p-7 shadow-panel ring-1"
          :style="{ '--tw-ring-color': 'var(--pillar-ring-strong)' }">
          <!-- Search bar -->
          <div class="grid gap-3">
            <label class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500" for="pillar-search">
              Search
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute left-4 top-5.5 -translate-y-1/2 text-lg text-slate-400">🔍</span>
              <input
                id="pillar-search"
                type="search"
                placeholder="Search topics or tags..."
                class="w-full rounded-full border border-slate-200 px-4 py-2.5 pl-11 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <!-- Categories -->
          <div v-if="config.categories?.length" class="grid gap-3">
            <h3 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Categories</h3>
            <nav class="grid gap-2 text-sm font-medium text-slate-600">
              <div class="grid gap-3 lg:grid-cols-1 sm:grid-cols-3">
                <button
                  v-for="category in config.categories"
                  :key="category"
                  type="button"
                  class="rounded-2xl border border-indigo-100/70 px-4 py-2 text-left transition hover:border-indigo-200 hover:text-brand"
                >
                  {{ category }}
                </button>
              </div>
            </nav>
          </div>

          <!-- Tags -->
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

          <!-- Sort by -->
          <div class="grid gap-3">
            <h3 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Sort by</h3>
            <div class="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
              <button
                v-for="sort in config.sortFilters ?? ['Latest', 'Most Popular', 'Reward Points']"
                :key="sort"
                type="button"
                class="rounded-full border border-indigo-100/80 px-4 py-2 transition hover:border-indigo-200 hover:text-brand">
                {{ sort }}
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div class="grid gap-3">
        <!-- Create post prompt -->
        <button
          type="button"
          class="flex items-center rounded-2xl bg-white p-6 shadow-panel ring-1"
          :style="{ '--tw-ring-color': 'var(--pillar-ring-strong)' }"
          @click="openForm"
        >
          <span class="grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-2xl" :style="{ color: accentColor }">
            ✍️
          </span>
          <span class="flex-1 text-base font-medium text-slate-500">
            {{ config.createPlaceholder ?? `Share something with the ${config.title} Hub...` }}
          </span>
          <span
            class="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white"
            :style="{ backgroundColor: accentColor }"
          >
            {{ config.createAction ?? 'Create post' }}
          </span>
        </button>

        <div class="grid gap-3">
          <slot name="feed" :items="config.feed" :accent="accentColor">
            <article
              v-for="item in config.feed"
              :key="item.title"
              class="grid gap-5 rounded-2xl bg-white p-6 shadow-panel ring-1"
              :style="{ '--tw-ring-color': 'var(--pillar-ring-strong)' }">
              <!-- Post content -->
              <header class="flex items-start gap-4">
                <span class="text-3xl">{{ config.icon }}</span>
                <div class="space-y-2">
                  <h3 class="text-xl font-semibold text-slate-900">{{ item.title }}</h3>
                  <p class="text-slate-600">{{ item.description }}</p>
                </div>
              </header>

              <!-- Buttons -->
              <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-5 py-4">
                <span class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <span></span>
                  <span>{{ item.discussion }} Discussions</span>
                </span>

                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  :style="{
                    backgroundColor: accentColor,
                    boxShadow: 'var(--pillar-shadow-cta)',
                  }"
                >
                  {{ item.cta ?? config.actionLabel ?? 'Engage' }}
                </button>
              </div>
            </article>
          </slot>
        </div>
      </div>
    </div>

    <!-- Create post form -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-20 grid place-items-center bg-slate-900/50 px-4"
      @click.self="closeForm"
    >
      <form
        class="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl ring-1"
        :style="{ '--tw-ring-color': 'var(--pillar-ring-overlay)' }"
        @submit.prevent="submitForm"
      >
        <h2 class="text-2xl font-semibold" :style="{ color: 'var(--pillar-accent)' }">
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
            :style="{ backgroundColor: accentWithAlpha('15'), color: accentColor }"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            :style="{
              backgroundColor: accentColor,
              boxShadow: 'var(--pillar-shadow-cta)',
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
  --tw-shadow: var(
    --pillar-shadow-banner,
    0 30px 70px -30px rgba(67, 56, 202, 0.18)
  );
  --tw-shadow-colored: var(
    --pillar-shadow-banner,
    0 30px 70px -30px rgba(67, 56, 202, 0.18)
  );
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
}

.shadow-panel {
  --tw-shadow: var(
    --pillar-shadow-panel,
    0 12px 32px -20px rgba(79, 70, 229, 0.35)
  );
  --tw-shadow-colored: var(
    --pillar-shadow-panel,
    0 12px 32px -20px rgba(79, 70, 229, 0.35)
  );
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
}
</style>
