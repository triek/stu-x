<script setup>
import { computed } from 'vue'

const props = defineProps({
  expanded: {
    type: Boolean,
    default: false,
  },
  searchTerm: {
    type: String,
    default: '',
  },
  categories: {
    type: Array,
    default: () => [],
  },
  tags: {
    type: Array,
    default: () => [],
  },
  sortFilters: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:expanded', 'update:search-term', 'select-category', 'toggle-tag'])

const searchModel = computed({
  get: () => props.searchTerm,
  set: (value) => emit('update:search-term', value),
})

const resolvedSortFilters = computed(() =>
  props.sortFilters.length ? props.sortFilters : ['Latest', 'Most Popular', 'Reward Points'],
)

const openSidebar = () => {
  emit('update:expanded', true)
}

const closeSidebar = () => {
  emit('update:expanded', false)
}

const handleCategoryClick = (category) => {
  emit('select-category', category)
}

const handleTagToggle = (tag) => {
  emit('toggle-tag', tag)
}
</script>

<template>
  <div :class="['grid gap-3 self-start lg:top-24', expanded ? 'lg:sticky' : 'lg:sticky']">
    <button
      v-if="!expanded"
      type="button"
      class="flex h-16 w-full items-center justify-center rounded-3xl bg-white dark:bg-slate-800/60 p-5 text-2xl shadow-panel ring-1 transition hover:ring-indigo-200 dark:hover:bg-slate-700/40 lg:mt-2 lg:h-18 lg:w-16 lg:rounded-3xl"
      :style="{ '--tw-ring-color': 'var(--pillar-ring-strong)' }"
      aria-label="Open sidebar"
      @click="openSidebar"
    >
      <span class="sr-only">Open sidebar</span>
      🔍
    </button>

    <aside
      v-else
      class="grid gap-6 rounded-3xl bg-white dark:bg-slate-900/80 p-7 shadow-panel ring-1"
      :style="{ '--tw-ring-color': 'var(--pillar-ring-strong)' }"
    >
      <!-- Search bar -->
      <div class="grid gap-3">
        <div class="flex items-center justify-between gap-4">
          <label
            class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300"
            for="pillar-search"
          >
            Search
          </label>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close sidebar"
            @click="closeSidebar"
          >
            <span class="sr-only">Close sidebar</span>
            &times;
          </button>
        </div>
        <div class="relative">
          <span
            class="pointer-events-none absolute left-4 top-5 -translate-y-1/2 text-lg text-slate-400"
            >🔍</span
          >
          <input
            id="pillar-search"
            v-model="searchModel"
            type="search"
            placeholder="Search topics or tags..."
            class="w-full rounded-full border border-slate-200 px-4 py-2.5 pl-11 text-sm text-slate-700 dark:text-slate-100 dark:bg-slate-800/60 dark:border-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      <!-- Categories -->
      <div v-if="categories.length" class="grid gap-3">
        <h3
          class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300"
        >
          Categories
        </h3>
        <nav class="grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <button
              v-for="category in categories"
              :key="category.normalized ?? 'all'"
              type="button"
              class="rounded-2xl border px-4 py-2 text-left text-sm font-semibold transition"
              :class="[
                category.isActive
                  ? 'border-transparent bg-brand text-white shadow-md'
                  : 'border-indigo-100/70 dark:border-indigo-900/40 text-slate-600 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-700 hover:text-brand',
              ]"
              @click="handleCategoryClick(category)"
            >
              {{ category.label }}
            </button>
          </div>
        </nav>
      </div>

      <!-- Tags -->
      <div v-if="tags.length" class="grid gap-3">
        <h3
          class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300"
        >
          Tags
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in tags"
            :key="tag.normalized"
            type="button"
            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition"
            :class="[
              tag.isSelected
                ? 'bg-brand text-white shadow'
                : 'bg-indigo-50 dark:bg-indigo-900/30 text-brand dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
            ]"
            @click="handleTagToggle(tag)"
          >
            {{ tag.label.startsWith('#') ? tag.label : `#${tag.label}` }}
          </button>
        </div>
      </div>

      <!-- Sort by -->
      <div class="grid gap-3">
        <h3
          class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300"
        >
          Sort by
        </h3>
        <div class="flex flex-wrap gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            v-for="sort in resolvedSortFilters"
            :key="sort"
            type="button"
            class="rounded-full border border-indigo-100/80 dark:border-indigo-900/40 px-4 py-2 transition hover:border-indigo-200 dark:hover:border-indigo-700 hover:text-brand"
          >
            {{ sort }}
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
