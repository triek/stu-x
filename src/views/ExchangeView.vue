<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import PillarLayout from '@/components/PillarLayout.vue'
import { PILLAR_ACCENTS } from '@/constants/pillarAccents'
import { useExchangePostsStore } from '@/stores/exchangePosts'
import { useRegionStore } from '@/stores/region'
import { useAuthStore } from '@/stores/auth'
import { getItemRegionIds, normalizeRegionId } from '@/utils/region'

const categories = [
  {
    id: 'mentors',
    label: 'Mentors',
    emoji: '🎓',
    blurb: 'Book trusted mentors for focused 1-on-1 guidance.',
  },
  {
    id: 'tas',
    label: 'TAs',
    emoji: '🧑‍🏫',
    blurb: 'Need teaching assistants to walk you through tricky topics? Find them here.',
  },
  {
    id: 'mini-courses',
    label: 'Mini Courses',
    emoji: '🧠',
    blurb: 'Structured micro-learning to deep-dive into a topic in just a few sessions.',
  },
  {
    id: 'resources',
    label: 'Resources',
    emoji: '📚',
    blurb: 'Unlock notes, templates, and study packs contributed by the community.',
  },
  {
    id: 'literature',
    label: 'Literature',
    emoji: '📖',
    blurb: 'Discover curated readings, research summaries, and exam prep guides.',
  },
  {
    id: 'workshops',
    label: 'Workshops',
    emoji: '🛠️',
    blurb: 'Hands-on sessions to practice skills with peers and facilitators.',
  },
]

const activeCategory = ref(categories[0].id)

const statusStyles = {
  active: { label: '🟢 Active', classes: 'bg-emerald-50 text-emerald-600 border border-emerald-200/70' },
  available: { label: '🟢 Available', classes: 'bg-emerald-50 text-emerald-600 border border-emerald-200/70' },
  open: { label: '🟢 Open', classes: 'bg-emerald-50 text-emerald-600 border border-emerald-200/70' },
  closing: { label: '🟠 Closing Soon', classes: 'bg-amber-50 text-amber-600 border border-amber-200/70' },
}

const exchangePostsStore = useExchangePostsStore()
const { posts } = storeToRefs(exchangePostsStore)

const regionStore = useRegionStore()
const { activeScope, activeRegion } = storeToRefs(regionStore)

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const currentUsername = computed(() => user.value?.username?.trim() || '')
const currentRegionLabel = computed(() => user.value?.region?.toString().trim() || '')
const fallbackRegionId = computed(() => normalizeRegionId(activeRegion.value?.id))
const resolvedUserRegionId = computed(() => {
  const normalized = normalizeRegionId(currentRegionLabel.value)
  return normalized || fallbackRegionId.value
})

const filteredPosts = computed(() => {
  const scope = new Set(activeScope.value)

  return posts.value
    .filter((post) => {
      const regionIds = getItemRegionIds(post)
      return regionIds.some((id) => scope.has(id))
    })
    .filter((post) => post.category === activeCategory.value)
    .map((post) => {
      const regionIds = getItemRegionIds(post)
      const regionMeta = regionStore.getRegionMeta(post.region ?? regionIds[0])

      return {
        ...post,
        regionIds,
        regionMeta,
      }
    })
})

const activeCategoryMeta = computed(() =>
  categories.find((category) => category.id === activeCategory.value),
)

const selectCategory = (categoryId) => {
  activeCategory.value = categoryId
}

const baseConfig = {
  title: 'Exchange',
  icon: '🤝',
  accent: PILLAR_ACCENTS.exchange,
  headline: 'Exchange Hub',
  description: 'Find or offer help, courses, and study exchanges',
  highlights: ['Non-Stunix trading'],
  categories: [],
  tags: ['#Mentorship', '#Courses', '#Resources', '#SkillExchange'],
  createLabel: 'Create Exchange Offer',
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

const formDefaults = computed(() => ({
  category: activeCategory.value,
  name: currentUsername.value || 'Community member',
  reward: '10',
  tags: '',
}))

const handleSubmit = (form) => {
  if (!isAuthenticated.value) return

  const regionId = resolvedUserRegionId.value
  const name = currentUsername.value || 'Community member'

  const post = exchangePostsStore.addPost({
    ...form,
    name,
    region: regionId,
  })
  activeCategory.value = post.category
}
</script>

<template>
  <PillarLayout :config="config" :form-defaults="formDefaults" @submit="handleSubmit">
    <template #feed="{ items, accent }">
      <!-- Main feed -->
      <div
        class="grid gap-6 rounded-3xl bg-white/80 p-6 shadow-panel ring-1"
        :style="{ '--tw-ring-color': `var(--pillar-ring-soft)` }">
        <div class="flex flex-col gap-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <h2 class="text-xl font-semibold text-slate-800">Explore exchange categories</h2>
            <span class="text-sm text-slate-500">{{ items.length }} offers this week</span>
          </div>

          <!-- Categories -->
          <div class="flex flex-wrap gap-3">
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
              :class="[
                activeCategory === category.id
                  ? 'text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              ]"
              :style="
                activeCategory === category.id
                  ? { backgroundColor: accent, boxShadow: `0 18px 32px ${accent}30` }
                  : {}
              "
              @click="selectCategory(category.id)">
              <span>{{ category.emoji }}</span>
              <span>{{ category.label }}</span>
            </button>
          </div>

          <p v-if="activeCategoryMeta" class="max-w-3xl text-sm text-slate-600">
            {{ activeCategoryMeta.blurb }}
          </p>
        </div>

        <!-- Posts -->
        <div class="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="post in items"
              :key="post.id"
              class="panel-surface transition hover:-translate-y-1 hover:shadow-xl"
              :style="{ '--tw-ring-color': `var(--pillar-ring-strong)` }">
            <div class="flex items-center gap-4">
              <!-- Image -->
              <div
                class="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-3xl"
                :class="`bg-gradient-to-br ${post.image.gradient}`">
                <span>{{ post.image.emoji }}</span>
              </div>

              <!-- Type of post -->
              <div class="space-y-2">
                <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <span>{{ post.type.icon }}</span>
                  <span>{{ post.type.label }}</span>
                </span>
                <p class="text-sm font-semibold text-slate-500">{{ post.name }}</p>
                <span
                  v-if="post.regionMeta"
                  class="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  :class="post.regionMeta.chipClass ?? 'border border-slate-200 bg-slate-100 text-slate-600'"
                >
                  📍 {{ post.regionMeta.shortLabel ?? post.regionMeta.label }}
                </span>
              </div>

              <!-- Active status -->
              <span
                class="ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusStyles[post.status]?.classes ?? statusStyles.active.classes">
                {{ statusStyles[post.status]?.label ?? statusStyles.active.label }}
              </span>
            </div>

            <!-- Post contents -->
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-slate-900">{{ post.title }}</h3>
              <p class="text-sm text-slate-600">{{ post.summary }}</p>
            </div>

            <ul class="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <li v-for="detail in post.details" :key="detail" class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                {{ detail }}
              </li>
            </ul>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand">
                #{{ tag }}
              </span>
            </div>

            <!-- Buttons -->
            <div class="flex flex-wrap justify-end gap-3">
              <button
                v-for="action in post.actions"
                :key="action.label"
                type="button"
                class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition"
                :class="[
                  action.highlight
                    ? 'text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-700',
                ]"
                :style="action.highlight ? { backgroundColor: accent, boxShadow: `0 18px 32px ${accent}35` } : {}">
                <span>{{ action.icon }}</span>
                <span>{{ action.label }}</span>
              </button>
            </div>
          </article>

          <!-- No item in category -->
          <div
            v-if="!items.length"
            class="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500">
            <span class="text-4xl">🛎️</span>

            <p class="text-base font-semibold">No offers match the current filters</p>
            <p class="text-sm text-slate-500">Try adjusting your search or be the first to create an offer.</p>

            <!-- Create post button -->
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              :style="{ backgroundColor: accent, boxShadow: `0 18px 32px ${accent}35` }">
              ➕ Create Offer
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #form-fields="{ formState }">
      <label class="grid gap-2 text-sm font-semibold text-slate-800">
        Title
        <input
          v-model="formState.title"
          type="text"
          placeholder="Give it a headline"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        />
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Host name
          <input
            v-model="formState.name"
            type="text"
            placeholder="Who is offering this?"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
            readonly
          />
          <p class="text-xs font-medium text-slate-500">
            Posting as <span class="text-slate-700">{{ formState.name }}</span>
            <span v-if="currentRegionLabel"> · {{ currentRegionLabel }}</span>
          </p>
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Category
          <select
            v-model="formState.category"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.label }}
            </option>
          </select>
        </label>
      </div>

      <label class="grid gap-2 text-sm font-semibold text-slate-800">
        Summary
        <textarea
          v-model="formState.description"
          rows="3"
          placeholder="Describe the offer"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        ></textarea>
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Reward (Stunix)
          <input
            v-model="formState.reward"
            type="number"
            min="0"
            step="5"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Tags
          <input
            v-model="formState.tags"
            type="text"
            placeholder="#Mentorship, #Courses"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      </div>
    </template>
  </PillarLayout>
</template>

<style scoped>
.shadow-panel {
  --tw-shadow: var(
    --pillar-shadow-panel,
    0 12px 32px -20px rgba(79, 70, 229, 0.35)
  );
}
</style>
