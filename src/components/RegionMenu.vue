<script setup>
import { computed, unref } from 'vue'

import RegionList from './RegionList.vue'

const props = defineProps({
  controller: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'desktop',
    validator: (value) => ['desktop', 'mobile'].includes(value),
  },
})

const emit = defineEmits(['select'])

const activeRegionId = computed(() => unref(props.controller.activeRegion)?.id ?? null)

const wrapperClass = computed(() => (props.variant === 'desktop' ? 'relative' : 'relative w-full'))

const buttonClass = computed(() =>
  props.variant === 'desktop'
    ? 'inline-flex w-auto min-w-[5rem] flex-col items-center gap-1 rounded-2xl border border-indigo-100/70 bg-white px-4 py-2 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:focus:ring-slate-600'
    : 'flex w-full flex-col items-start gap-1 rounded-2xl border border-indigo-100/70 bg-white px-4 py-2 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:focus:ring-slate-600',
)

const menuContainerClass = computed(() =>
  props.variant === 'desktop'
    ? 'absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800'
    : 'z-20 mt-3 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800',
)

const shouldShowMenu = computed(() => unref(props.controller.regionMenuOpen))
const menuTransition = computed(() => unref(props.controller.regionMenuTransition))
const menuViewKey = computed(() => unref(props.controller.regionMenuViewKey))
const isSubregionView = computed(() => unref(props.controller.isSubregionView))
const menuHeaderLabel = computed(() => unref(props.controller.menuHeaderLabel))
const menuParentRegion = computed(() => unref(props.controller.menuParentRegion))
const menuRegions = computed(() => unref(props.controller.menuRegions))
const activeRegionLabel = computed(() => unref(props.controller.activeRegionLabel))
</script>

<template>
  <div :ref="controller.setRegionMenuRef" :class="wrapperClass">
    <button
      type="button"
      :class="buttonClass"
      @click="controller.toggleRegionMenu()"
      aria-haspopup="listbox"
      :aria-expanded="shouldShowMenu"
    >
      <template v-if="variant === 'mobile'">
        <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Active region
        </span>
        <span class="text-base font-semibold text-slate-700 dark:text-slate-200">
          {{ activeRegionLabel }}
        </span>
      </template>
      <template v-else>
        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ activeRegionLabel }}</span>
      </template>
    </button>

    <div v-if="shouldShowMenu" :class="menuContainerClass">
      <Transition :name="menuTransition" mode="out-in">
        <div :key="menuViewKey">
          <div class="px-3">
            <button
              v-if="isSubregionView"
              type="button"
              class="inline-flex items-center gap-1 rounded-lg py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600 transition hover:bg-indigo-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-indigo-300 dark:hover:bg-slate-700/60 dark:focus:ring-slate-600"
              @click="controller.handleRegionMenuBack()"
            >
              <span aria-hidden="true">←</span>
              Regions
            </button>

            <template v-if="variant === 'mobile'">
              <p class="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                {{ menuHeaderLabel }}
              </p>
              <p v-if="isSubregionView && menuParentRegion?.tagline" class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {{ menuParentRegion.tagline }}
              </p>
            </template>
          </div>

          <RegionList
            :regions="menuRegions"
            :active-region-id="activeRegionId"
            :variant="variant"
            :region-has-subregions="controller.regionHasSubregions"
            @select="emit('select', $event)"
            @view-subregions="controller.openSubregionView"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.region-slide-forward-enter-active,
.region-slide-forward-leave-active,
.region-slide-backward-enter-active,
.region-slide-backward-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.region-slide-forward-enter-from,
.region-slide-backward-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.region-slide-forward-leave-to,
.region-slide-backward-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
