<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PillarSidebar from './PillarSidebar.vue'
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

const emit = defineEmits(['submit'])

const accentColor = computed(() => props.config.accent ?? '#4338ca')

const accentWithAlpha = (alphaHex) => withAlpha(accentColor.value, alphaHex)

const accentStyles = computed(() => ({
  '--pillar-accent': accentColor.value,
  '--pillar-ring-strong': accentWithAlpha('75'),
  '--pillar-ring-soft': accentWithAlpha('25'),
  '--pillar-ring-overlay': accentWithAlpha('50'),
  '--pillar-shadow-banner': `0 30px 70px -30px ${accentWithAlpha('40')}`,
  '--pillar-shadow-panel': `0 12px 32px -20px ${accentWithAlpha('45')}`,
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
const sidebarExpanded = ref(false)
const searchTerm = ref('')
const selectedCategory = ref(null)
const selectedTags = ref([])

const normalizeCategoryOption = (category) => {
  if (!category) return null

  if (typeof category === 'string') {
    const trimmed = category.trim()
    if (!trimmed) return null
    return {
      label: trimmed,
      value: trimmed,
      normalized: trimmed.toLowerCase(),
    }
  }

  const label = category.label ?? category.value
  const value = category.value ?? category.label
  const trimmedValue = value?.toString().trim()

  if (!trimmedValue) return null

  return {
    label: label?.toString().trim() || trimmedValue,
    value: trimmedValue,
    normalized: trimmedValue.toLowerCase(),
  }
}

const normalizeTagOption = (tag) => {
  if (!tag) return null

  const resolve = (value) => value?.toString().replace(/^#/, '').trim()

  if (typeof tag === 'string') {
    const cleanValue = resolve(tag)
    if (!cleanValue) return null
    return {
      label: tag.trim() || `#${cleanValue}`,
      value: cleanValue,
      normalized: cleanValue.toLowerCase(),
    }
  }

  const label = tag.label ?? tag.value
  const cleanValue = resolve(tag.value ?? tag.label)

  if (!cleanValue) return null

  return {
    label: label?.toString().trim() || `#${cleanValue}`,
    value: cleanValue,
    normalized: cleanValue.toLowerCase(),
  }
}

const feedItems = computed(() => (Array.isArray(props.config.feed) ? props.config.feed : []))

const categoryOptions = computed(() => {
  const rawCategories = props.config.categories ?? []
  const seen = new Set()

  return rawCategories
    .map(normalizeCategoryOption)
    .filter((category) => {
      if (!category) return false
      if (seen.has(category.normalized)) return false
      seen.add(category.normalized)
      return true
    })
})

const sidebarCategories = computed(() => {
  const categories = categoryOptions.value
  const selected = selectedCategory.value

  if (!categories.length) return []

  const allCategory = {
    label: 'All',
    value: null,
    normalized: null,
    isActive: selected == null,
  }

  return [
    allCategory,
    ...categories.map((category) => ({
      ...category,
      isActive: selected === category.normalized,
    })),
  ]
})

const tagOptions = computed(() => {
  const rawTags = props.config.tags ?? []
  const seen = new Set()

  return rawTags
    .map(normalizeTagOption)
    .filter((tag) => {
      if (!tag) return false
      if (seen.has(tag.normalized)) return false
      seen.add(tag.normalized)
      return true
    })
})

const sidebarTags = computed(() =>
  tagOptions.value.map((tag) => ({
    ...tag,
    isSelected: selectedTags.value.includes(tag.normalized),
  })),
)

watch(categoryOptions, (options) => {
  if (!options.length) {
    selectedCategory.value = null
    return
  }

  const normalizedValues = options.map((option) => option.normalized)
  if (!normalizedValues.includes(selectedCategory.value)) {
    selectedCategory.value = null
  }
})

watch(tagOptions, (options) => {
  if (!options.length) {
    selectedTags.value = []
    return
  }

  const allowed = new Set(options.map((option) => option.normalized))
  selectedTags.value = selectedTags.value.filter((tag) => allowed.has(tag))
})

const collectSearchableContent = (value, bucket) => {
  if (value == null) return

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    bucket.push(String(value))
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectSearchableContent(item, bucket))
    return
  }

  if (typeof value === 'object') {
    Object.values(value).forEach((item) => collectSearchableContent(item, bucket))
  }
}

const normalizeCategoryValue = (value) => value?.toString().trim().toLowerCase() || null

const getItemCategory = (item) => {
  if (!item || typeof item !== 'object') return null

  if (typeof item.category === 'string') {
    return item.category
  }

  if (item.category && typeof item.category === 'object' && typeof item.category.value === 'string') {
    return item.category.value
  }

  if (item.type && typeof item.type === 'object' && typeof item.type.label === 'string') {
    return item.type.label
  }

  return null
}

const getItemTags = (item) => {
  if (!item || typeof item !== 'object') return []

  const rawTags = item.tags

  if (!rawTags) return []

  if (Array.isArray(rawTags)) {
    return rawTags.flatMap((tag) => {
      if (typeof tag === 'string') return tag
      if (tag && typeof tag === 'object' && typeof tag.label === 'string') return tag.label
      return []
    })
  }

  if (typeof rawTags === 'string') {
    return rawTags.split(',')
  }

  return []
}

const normalizeTagValue = (value) => value?.toString().replace(/^#/, '').trim().toLowerCase() || null

const itemMatchesCategory = (item) => {
  if (!selectedCategory.value) return true

  const itemCategory = normalizeCategoryValue(getItemCategory(item))
  if (!itemCategory) return false

  return itemCategory === selectedCategory.value
}

const itemMatchesTags = (item) => {
  if (!selectedTags.value.length) return true

  const itemTags = getItemTags(item)
    .map((tag) => normalizeTagValue(tag))
    .filter(Boolean)

  if (!itemTags.length) return false

  return selectedTags.value.every((tag) => itemTags.includes(tag))
}

const itemMatchesSearch = (item) => {
  const query = searchTerm.value.trim().toLowerCase()
  if (!query) return true

  const bucket = []
  collectSearchableContent(item, bucket)
  const haystack = bucket.join(' ').toLowerCase()

  if (!haystack) return false

  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token))
}

const filteredFeed = computed(() =>
  feedItems.value.filter((item) => itemMatchesSearch(item) && itemMatchesCategory(item) && itemMatchesTags(item)),
)

const sortFilters = computed(() => props.config.sortFilters ?? ['Latest', 'Most Popular', 'Reward Points'])

const selectCategory = (category) => {
  const normalized = category?.normalized ?? normalizeCategoryValue(category?.value)

  if (!normalized) {
    selectedCategory.value = null
    return
  }

  selectedCategory.value = selectedCategory.value === normalized ? null : normalized
}

const toggleTag = (tag) => {
  const normalized = tag?.normalized ?? normalizeTagValue(tag?.value ?? tag)
  if (!normalized) return

  selectedTags.value = selectedTags.value.includes(normalized)
    ? selectedTags.value.filter((value) => value !== normalized)
    : [...selectedTags.value, normalized]
}

const activeFilters = computed(() => ({
  search: searchTerm.value,
  category: selectedCategory.value,
  tags: [...selectedTags.value],
}))

const resetFormState = () => {
  Object.assign(formState, defaultFormState.value)
}


const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const openForm = () => {
  if (!isAuthenticated.value) {
    window.alert('Please log in to create a post.')
    return
  }
  resetFormState()
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const submitForm = () => {
  if (!isAuthenticated.value) {
    window.alert('Please log in to create a post.')
    return
  }
  emit('submit', { ...formState })
  resetFormState()
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
    <div
      :class="[
        'grid gap-3 items-start',
        sidebarExpanded
          ? 'lg:grid-cols-[minmax(0,_260px)_1fr]'
          : 'lg:grid-cols-[max-content_1fr]'
      ]"
    >
      <PillarSidebar
        :expanded="sidebarExpanded"
        :search-term="searchTerm"
        :categories="sidebarCategories"
        :tags="sidebarTags"
        :sort-filters="sortFilters"
        @update:expanded="sidebarExpanded = $event"
        @update:search-term="searchTerm = $event"
        @select-category="selectCategory"
        @toggle-tag="toggleTag"
      />

      <div class="grid gap-3">
        <!-- Create post prompt -->
        <div
          class="rounded-4xl p-2"
          :style="{ backgroundColor: accentWithAlpha('20') }"
        >
          <button
            type="button"
            class="flex w-full items-stretch rounded-3xl bg-white shadow-panel ring-1"
            :style="{ '--tw-ring-color': 'var(--pillar-ring-strong)' }"
            @click="openForm"
          >
            <div class="flex flex-1 items-center gap-4 px-6 py-3">
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
            </div>
          </button>
        </div>

        <!-- Feed -->
        <div class="grid gap-3">
          <slot name="feed" :items="filteredFeed" :accent="accentColor" :filters="activeFilters">
            <!-- No item in category -->
            <div
              class="grid gap-6 rounded-3xl bg-white/80 p-6 shadow-panel ring-1"
              :style="{ '--tw-ring-color': `var(--pillar-ring-soft)` }">
              <div
                v-if="!filteredFeed.length"
                class="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500">
                <span class="text-4xl">🛎️</span>

                <p class="text-base font-semibold">No posts match the current filters</p>
                <p class="text-sm text-slate-500">Try adjusting your search or be the first to create a post and earn Stunix from the community.</p>

                <!-- Create post button -->
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                  :style="{ backgroundColor: accentColor, boxShadow: `0 18px 32px ${accent}35` }">
                  ➕ Create Offer
                </button>
              </div>
            </div>

            <article
              v-for="item in filteredFeed"
              :key="item.title ?? item.id"
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
:deep(.shadow-panel) {
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
