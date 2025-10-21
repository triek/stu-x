<script setup>
import { computed, ref } from 'vue'
import PillarLayout from '@/components/PillarLayout.vue'
import { PILLAR_ACCENTS } from '@/constants/pillarAccents'
import { exchangePosts } from '@/data/exchangePosts'

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

const filteredPosts = computed(() =>
  exchangePosts.filter((post) => post.category === activeCategory.value),
)

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

const config = computed(() => ({
  ...baseConfig,
  feed: filteredPosts.value,
}))
</script>

<template>
  <PillarLayout :config="config">
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
              class="grid gap-5 rounded-3xl bg-white p-6 shadow-panel ring-1 transition hover:-translate-y-1 hover:shadow-xl"
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

            <p class="text-base font-semibold">No offers in this category yet</p>
            <p class="text-sm text-slate-500">Be the first to create a listing and earn Stunix from the community.</p>

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
  </PillarLayout>
</template>

<style scoped>
.shadow-panel {
  --tw-shadow: var(
    --pillar-shadow-panel,
    0 12px 32px -20px rgba(79, 70, 229, 0.35)
  );
}

.text-brand {
  color: var(--pillar-accent, #4338ca);
}
</style>
