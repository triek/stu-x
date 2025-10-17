<script setup>
import { computed, ref } from 'vue'
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
    id: 'workshops',
    label: 'Workshops',
    emoji: '🛠️',
    blurb: 'Hands-on sessions to practice skills with peers and facilitators.',
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
    id: 'skill-exchange',
    label: 'Skill Exchange',
    emoji: '💬',
    blurb: 'Swap your strengths with peers for mutual learning.',
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

const activeCategoryMeta = computed(() => categories.find((category) => category.id === activeCategory.value))

const selectCategory = (categoryId) => {
  activeCategory.value = categoryId
}
</script>

<template>
  <section class="flex flex-col gap-8">
    <header class="grid gap-6 rounded-3xl bg-white p-8 shadow-primary ring-1 ring-brand-exchange/10">
      <div class="flex items-center gap-3">
        <span class="text-5xl">🤝</span>
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-brand-exchange/80">StuX Exchange Hub</p>
          <h1 class="text-3xl font-bold text-slate-900 md:text-[40px]">Find or offer help, courses, and study exchanges</h1>
        </div>
      </div>
      <p class="max-w-3xl text-base text-slate-600">
        Build your learning circle through trusted exchanges. Browse mentors, mini courses, or swap skills with peers to grow
        together. Every offer is backed by Stunix so you can focus on the experience.
      </p>
      <div class="flex flex-wrap gap-3 text-sm text-slate-600">
        <span class="inline-flex items-center gap-2 rounded-full bg-brand-exchange/10 px-4 py-2 font-semibold text-brand-exchange"
          >+ Earn Stunix while teaching</span
        >
        <span class="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-2 font-semibold text-brand">Trusted profiles</span>
        <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-600"
          >Curated for academic value</span
        >
      </div>
    </header>

    <div class="grid gap-6 rounded-3xl bg-white/80 p-6 shadow-panel ring-1 ring-brand-exchange/15">
      <div class="flex flex-col gap-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-xl font-semibold text-slate-800">Explore exchange categories</h2>
          <span class="text-sm text-slate-500">{{ filteredPosts.length }} offers this week</span>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="[
              activeCategory === category.id
                ? 'bg-brand-exchange text-white shadow-lg shadow-brand-exchange/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            ]"
            @click="selectCategory(category.id)"
          >
            <span>{{ category.emoji }}</span>
            <span>{{ category.label }}</span>
          </button>
        </div>

        <p v-if="activeCategoryMeta" class="max-w-3xl text-sm text-slate-600">{{ activeCategoryMeta.blurb }}</p>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="grid gap-5 rounded-3xl border border-indigo-50 bg-white p-6 shadow-panel transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-center gap-4">
            <div
              class="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-3xl"
              :class="`bg-gradient-to-br ${post.image.gradient}`"
            >
              <span>{{ post.image.emoji }}</span>
            </div>
            <div class="space-y-2">
              <span class="inline-flex items-center gap-2 rounded-full bg-brand-exchange/10 px-3 py-1 text-xs font-semibold text-brand-exchange">
                <span>{{ post.type.icon }}</span>
                <span>{{ post.type.label }}</span>
              </span>
              <p class="text-sm font-semibold text-slate-500">{{ post.name }}</p>
            </div>
            <span
              class="ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              :class="statusStyles[post.status]?.classes ?? statusStyles.active.classes"
            >
              {{ statusStyles[post.status]?.label ?? statusStyles.active.label }}
            </span>
          </div>

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
              class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
            >
              #{{ tag }}
            </span>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="action in post.actions"
              :key="action.label"
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition"
              :class="[
                action.highlight
                  ? 'bg-brand-exchange text-white shadow-lg shadow-brand-exchange/30 hover:-translate-y-0.5'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-700',
              ]"
            >
              <span>{{ action.icon }}</span>
              <span>{{ action.label }}</span>
            </button>
          </div>
        </article>

        <div
          v-if="!filteredPosts.length"
          class="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-brand-exchange/30 bg-white/60 p-10 text-center text-slate-500"
        >
          <span class="text-4xl">🛎️</span>
          <p class="text-base font-semibold">No offers in this category yet</p>
          <p class="text-sm text-slate-500">Be the first to create a listing and earn Stunix from the community.</p>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-brand-exchange px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-exchange/30"
          >
            ➕ Create Offer
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shadow-primary {
  box-shadow: 0 30px 70px -30px rgba(99, 102, 241, 0.2);
}

.shadow-panel {
  box-shadow: 0 12px 32px -20px rgba(79, 70, 229, 0.35);
}

.text-brand {
  color: #4338ca;
}

.text-brand-exchange {
  color: #0f766e;
}

.bg-brand-exchange {
  background-color: #0f766e;
}
</style> 
