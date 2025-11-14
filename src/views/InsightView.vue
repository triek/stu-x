<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import PillarLayout from '@/components/PillarLayout.vue'
import { PILLAR_ACCENTS } from '@/constants/pillarAccents'
import { useInsightPostsStore } from '@/stores/insightPosts'
import { useRegionStore } from '@/stores/region'
import { useAuthStore } from '@/stores/auth'
import { useRegionScopedFeed } from '@/composables/useRegionScopedFeed'

const statusStyles = {
  active: {
    label: '🟢 Active',
    classes:
      'border border-emerald-200/70 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200',
  },
  closing: {
    label: '🟠 Closing Soon',
    classes:
      'border border-amber-200/70 bg-amber-50 text-amber-600 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200',
  },
  closed: {
    label: '⚪ Closed',
    classes:
      'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
  },
}

const insightPostsStore = useInsightPostsStore()
const { posts } = storeToRefs(insightPostsStore)

const regionStore = useRegionStore()
const { activeRegion } = storeToRefs(regionStore)

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const currentUsername = computed(() => user.value?.username?.trim() || '')
const {
  scopedFeed: filteredPosts,
  userRegionId: resolvedUserRegionId,
  userRegionLabel: currentRegionLabel,
} = useRegionScopedFeed(posts)

const baseConfig = {
  title: 'Insight',
  icon: '💡',
  accent: PILLAR_ACCENTS.insight,
  headline: 'Insight Hub',
  description: 'Share or join research studies and request feedback',
  highlights: ['Spend and earn Stunix'],
  categories: [
    { label: 'Academic Studies', value: 'academic' },
    { label: 'Product Feedback', value: 'product' },
    { label: 'Student Projects', value: 'project' },
    { label: 'Reflection Journals', value: 'reflection' },
  ],
  tags: ['#UX', '#Psychology', '#AI', '#Marketing'],
  sortFilters: ['Latest', 'Reward Points', 'Closing Soon'],
  actionLabel: 'Participate',
  createLabel: 'Request Insight',
}

const config = computed(() => {
  const highlights = [...baseConfig.highlights]
  if (activeRegion.value?.label) {
    highlights.push(`${activeRegion.value.label} focus`)
  }

  return {
    ...baseConfig,
    highlights,
    feed: filteredPosts.value,
  }
})

const insightTypeOptions = [
  { value: 'academic', label: '🧪 Academic' },
  { value: 'product', label: '💬 Product Feedback' },
  { value: 'project', label: '🎓 Student Project' },
]

const statusOptions = [
  { value: 'active', label: '🟢 Active' },
  { value: 'closing', label: '🟠 Closing Soon' },
  { value: 'closed', label: '⚪ Closed' },
]

const formDefaults = computed(() => ({
  reward: '20',
  author: currentUsername.value || 'Community member',
  type: insightTypeOptions[0].value,
  status: statusOptions[0].value,
  duration: '5',
  closingDate: '',
  tags: '',
  participants: '0',
  questions: '0',
}))

const router = useRouter()
const openDetails = (item) => {
  if (!item?.id) return
  router.push({ name: 'insight-detail', params: { id: item.id } })
}

const openDiscussion = (item) => {
  if (!item?.id) return
  router.push({
    name: 'insight-detail',
    params: { id: item.id },
    query: { showDiscussion: '1' },
  })
}
const handleSubmit = (form) => {
  if (!isAuthenticated.value) return

  const author = currentUsername.value || 'Community member'

  insightPostsStore.addPost({
    ...form,
    author,
    region: resolvedUserRegionId.value,
  })
}
</script>

<template>
  <PillarLayout :config="config" :form-defaults="formDefaults" @submit="handleSubmit">
    <template #feed="{ items, accent }">
      <article
        v-for="item in items"
        :key="item.id"
        class="grid gap-5 rounded-3xl bg-white dark:bg-slate-900/80 p-6 shadow-panel ring-1"
        :style="{ '--tw-ring-color': `${accent}` }"
      >
        <!-- Post header -->
        <header class="flex flex-wrap items-center justify-between gap-3">
          <span
            class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
            :style="{ backgroundColor: `${item.typeColor}14`, color: item.typeColor }"
          >
            <span>{{ item.type.icon }}</span>
            <span>{{ item.type.label }}</span>
          </span>

          <span
            v-if="item.status"
            class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            :class="statusStyles[item.status]?.classes ?? statusStyles.active.classes"
          >
            {{ statusStyles[item.status]?.label ?? statusStyles.active.label }}
          </span>
        </header>

        <!-- Post author and title -->
        <div class="space-y-2">
          <div v-if="item.author || item.regionMeta" class="flex flex-wrap items-center gap-2">
            <p v-if="item.author" class="text-sm font-medium text-slate-500 dark:text-slate-400">
              Author: <span class="text-slate-700 dark:text-slate-200">{{ item.author }}</span>
            </p>
            <span
              v-if="item.regionMeta"
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              :class="
                item.regionMeta.chipClass ??
                'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300'
              "
            >
              📍 {{ item.regionMeta.shortLabel ?? item.regionMeta.label }}
            </span>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ item.title }}</h3>
          <p class="text-slate-600 dark:text-slate-300">{{ item.subtitle }}</p>
        </div>

        <!-- Post time -->
        <p
          v-if="item.details?.length"
          class="text-sm font-semibold text-slate-600 dark:text-slate-300"
        >
          {{ item.details.join(' · ') }}
        </p>

        <!-- Post tags -->
        <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-brand dark:text-indigo-200"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- Post stats -->
        <div
          v-if="item.stats?.length"
          class="grid gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 px-5 py-4 sm:grid-cols-2"
        >
          <div v-for="stat in item.stats" :key="stat.label" class="flex items-center gap-3">
            <span class="text-lg">{{ stat.icon }}</span>
            <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">{{
              stat.label
            }}</span>
          </div>
        </div>

        <!-- Post buttons -->
        <footer class="flex flex-wrap items-center justify-between gap-3">
          <span></span>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200"
              @click="openDiscussion(item)"
            >
              💬 Ask Question
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              :style="{
                backgroundColor: accent,
                boxShadow: `0 18px 32px ${accent}45`,
              }"
              @click="openDetails(item)"
            >
              🚀 Participate
            </button>
          </div>
        </footer>
      </article>
    </template>

    <!-- Create post form -->
    <template #form-fields="{ formState }">
      <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        Title
        <input
          v-model="formState.title"
          type="text"
          placeholder="Give it a headline"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        />
      </label>

      <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        Author
        <input
          v-model="formState.author"
          type="text"
          placeholder="Add collaborator or institution"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          readonly
        />
        <p class="text-xs font-medium text-slate-500 dark:text-slate-300">
          Posting as <span class="text-slate-700 dark:text-slate-200">{{ formState.author }}</span>
          <span v-if="currentRegionLabel"> · {{ currentRegionLabel }}</span>
        </p>
      </label>

      <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        Summary
        <textarea
          v-model="formState.description"
          rows="3"
          placeholder="Describe what you need or how you can help"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        ></textarea>
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Type tag
          <select
            v-model="formState.type"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option v-for="option in insightTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Status
          <select
            v-model="formState.status"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Duration (minutes)
          <input
            v-model="formState.duration"
            type="number"
            min="1"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Reward (Stunix)
          <input
            v-model="formState.reward"
            type="number"
            min="5"
            step="5"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Closes on
          <input
            v-model="formState.closingDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      </div>

      <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        Tags
        <input
          v-model="formState.tags"
          type="text"
          placeholder="#AI, #StudyHabits, #Education"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        />
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Estimated participants
          <input
            v-model="formState.participants"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Questions / prompts
          <input
            v-model="formState.questions"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      </div>
    </template>
  </PillarLayout>
</template>
