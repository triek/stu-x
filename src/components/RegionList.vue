<script setup>
import { computed } from 'vue'

const props = defineProps({
  regions: {
    type: Array,
    required: true,
  },
  activeRegionId: {
    type: [String, Number, null],
    default: null,
  },
  variant: {
    type: String,
    default: 'desktop',
    validator: (value) => ['desktop', 'mobile'].includes(value),
  },
  regionHasSubregions: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['select', 'view-subregions'])

const listLayoutClass = computed(() =>
  props.variant === 'desktop' ? 'grid grid-cols-[1fr_auto]' : 'grid grid-cols-1',
)
</script>

<template>
  <ul class="mt-2 grid gap-1">
    <li v-for="region in regions" :key="region.id">
      <div :class="['grid items-stretch gap-1', listLayoutClass]">
        <button
          type="button"
          class="flex w-full flex-1 flex-col gap-1 rounded-xl px-3 py-2 text-left transition"
          :class="[
            region.id === activeRegionId
              ? 'bg-indigo-50 text-indigo-700 shadow-inner dark:bg-indigo-500/20 dark:text-indigo-200'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60',
            region.isActive === false
              ? 'cursor-not-allowed opacity-70 hover:bg-white dark:hover:bg-slate-800'
              : '',
          ]"
          @click="emit('select', region)"
          :disabled="region.isActive === false"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {{ region.label }}
            </span>
            <span
              v-if="region.statusLabel"
              class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              :class="
                region.chipClass ??
                'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'
              "
            >
              {{ region.statusLabel }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ region.tagline }}</p>
        </button>

        <button
          v-if="regionHasSubregions(region.id)"
          type="button"
          class="inline-flex h-full items-center justify-center rounded-xl border border-transparent px-5 py-2 text-slate-400 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-slate-300 dark:hover:bg-slate-700/60 dark:focus:ring-slate-600"
          @click.stop="emit('view-subregions', region.id)"
          :aria-label="`View subregions for ${region.shortLabel ?? region.label}`"
        >
          <span aria-hidden="true" class="text-lg leading-none">›</span>
        </button>
      </div>
    </li>
  </ul>
</template>
