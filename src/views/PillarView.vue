<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  pillarKey: {
    type: String,
    required: true,
  },
})

const pillarConfigs = {
  // Insight card
  insight: {
    title: 'Insight',
    icon: '💡',
    accent: '#4338ca',
    description: 'Share or join surveys & feedback.',
    actionLabel: 'Join',
    feed: [
      {
        type: { icon: '🧪', label: 'Academic' },
        typeColor: '#4338ca',
        author: 'Mira Tran (Deakin University)',
        title: 'How Students Use AI in Study Workflows',
        subtitle: 'A 5-minute study exploring how AI tools affect student focus and productivity.',
        details: ['🕓 5 min', '💎 +10 Stunix', '📅 Open until 20 Oct 2025'],
        tags: ['AI', 'StudyHabits', 'Education'],
        stats: [
          { icon: '📊', label: '86 participants' },
          { icon: '💭', label: '12 questions' },
        ],
        status: 'active',
      },
      {
        type: { icon: '💬', label: 'Product Feedback' },
        typeColor: '#0f766e',
        author: 'Samira Patel (Campus Tech Lab)',
        title: 'Beta Test: FocusFlow Mobile Study Planner',
        subtitle:
          'Share quick reactions on notification timing, UI clarity, and study streak rewards.',
        details: ['🕓 8 min', '💎 +15 Stunix', '📅 Open until 12 Sep 2025'],
        tags: ['ProductFeedback', 'MobileUX', 'Habits'],
        stats: [
          { icon: '📊', label: '54 participants' },
          { icon: '💭', label: '9 questions' },
        ],
        status: 'closing',
      },
      {
        type: { icon: '🎓', label: 'Student Project' },
        typeColor: '#db2777',
        author: 'Leo Gardner (RMIT)',
        title: 'Reflection: Mapping Peer Mentorship Journeys',
        subtitle:
          'Looking for stories that unpack how mentorship programs change student confidence.',
        details: ['🕓 12 min', '💎 +20 Stunix', '📅 Closed 01 Aug 2025'],
        tags: ['Mentorship', 'QualResearch', 'StudentLife'],
        stats: [
          { icon: '📊', label: '102 participants' },
          { icon: '💭', label: '15 questions' },
        ],
        status: 'closed',
      },
    ],
  },

  // Exchange card
  exchange: {
    title: 'Exchange',
    icon: '🤝',
    accent: '#0f766e',
    description: 'Find mentors or trade study help.',
    actionLabel: 'Help',
    feed: [
      {
        title: 'Study swap: Quant methods ⇄ UX writing',
        description: 'Trade one-hour tutoring sessions to prep for finals together.',
        reward: 40,
        cta: 'Pair up',
      },
      {
        title: 'Career coffee chat with alumni mentor',
        description: 'Share your portfolio for feedback and get guidance on internships.',
        reward: 55,
        cta: 'Book session',
      },
      {
        title: 'Offer accountability sprint',
        description: 'Host a weekly accountability circle for capstone progress updates.',
        reward: 30,
        cta: 'Host sprint',
      },
    ],
  },

  // Community card
  community: {
    title: 'Community',
    icon: '💬',
    accent: '#db2777',
    description: 'Discuss, review, and reflect.',
    actionLabel: 'Comment',
    feed: [
      {
        title: 'Reflection thread: first-year wins',
        description: 'Celebrate small victories and share lessons for incoming students.',
        reward: 15,
        cta: 'Share story',
      },
      {
        title: 'Critique circle: storytelling decks',
        description: 'Drop in to review slides and exchange presentation tips.',
        reward: 25,
        cta: 'Join circle',
      },
      {
        title: 'Community poll: preferred co-working times',
        description: 'Help coordinate weekly focus blocks that fit most schedules.',
        reward: 10,
        cta: 'Vote now',
      },
    ],
  },
}

const statusStyles = {
  active: { label: '🟢 Active', classes: 'bg-emerald-50 text-emerald-600' },
  closing: { label: '🟠 Closing Soon', classes: 'bg-amber-50 text-amber-600' },
  closed: { label: '⚪ Closed', classes: 'bg-slate-100 text-slate-500' },
}

const getStatusMeta = (status) => statusStyles[status] ?? statusStyles.active

const config = computed(() => pillarConfigs[props.pillarKey] ?? pillarConfigs.insight)

const showForm = ref(false)

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

const defaultFormState = {
  title: '',
  description: '',
  reward: '20',
  author: '',
  type: insightTypeOptions[0].value,
  status: statusOptions[0].value,
  duration: '5',
  closingDate: '',
  tags: '',
  participants: '0',
  questions: '0',
}

const formState = reactive({ ...defaultFormState })

const openForm = () => {
  Object.assign(formState, defaultFormState)
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const submitForm = () => {
  closeForm()
}

const isInsightPillar = computed(() => props.pillarKey === 'insight')
</script>

<template>
  <section class="flex flex-col gap-3">
    <header
      class="flex flex-col gap-6 rounded-2xl border-2 bg-white p-6 shadow-panel ring-1 ring-indigo-100/50 md:flex-row md:items-center"
      :style="{ borderColor: `${config.accent}33` }"
    >
      <span class="text-5xl md:text-6xl">{{ config.icon }}</span>
      <div class="space-y-2">
        <h1 class="text-2xl font-bold" :style="{ color: config.accent }">{{ config.title }}</h1>
        <p class="max-w-2xl text-base text-slate-600">{{ config.description }}</p>
      </div>
    </header>

    <div class="grid gap-3 md:grid-cols-[minmax(0,260px),1fr]">
      <!-- Discovery sidebar -->
      <aside
        class="grid gap-6 rounded-2xl bg-white p-7 shadow-panel ring-1 ring-indigo-100/60 md:sticky md:top-24 md:self-start"
      >
        <!-- Search bar -->
        <div class="grid gap-3">
          <label
            class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
            for="insight-search"
            >Search</label
          >
          <div class="relative">
            <span
              class="pointer-events-none absolute left-4 top-8.5 -translate-y-1/2 text-lg text-slate-400"
              >🔍</span
            >
            <input
              id="insight-search"
              type="search"
              placeholder="Search topics or tags..."
              class="w-full rounded-full border border-slate-200 px-4 py-2.5 pl-11 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <!-- Categories -->
        <div class="grid gap-3">
          <h3 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Categories
          </h3>
          <nav class="grid gap-2 text-sm font-medium text-slate-600">
            <button
              type="button"
              class="rounded-2xl border border-indigo-100/70 px-4 py-2 text-left transition hover:border-indigo-200 hover:text-brand"
            >
              Research Surveys
            </button>
            <button
              type="button"
              class="rounded-2xl border border-indigo-100/70 px-4 py-2 text-left transition hover:border-indigo-200 hover:text-brand"
            >
              Student Interviews
            </button>
            <button
              type="button"
              class="rounded-2xl border border-indigo-100/70 px-4 py-2 text-left transition hover:border-indigo-200 hover:text-brand"
            >
              Course Reflections
            </button>
            <button
              type="button"
              class="rounded-2xl border border-indigo-100/70 px-4 py-2 text-left transition hover:border-indigo-200 hover:text-brand"
            >
              Product / Idea Feedback
            </button>
          </nav>
        </div>

        <!-- Tags -->
        <div class="grid gap-3">
          <h3 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <span
              class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
              >#UX</span
            >
            <span
              class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
              >#Psychology</span
            >
            <span
              class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
              >#AI</span
            >
            <span
              class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
              >#Marketing</span
            >
          </div>
        </div>

        <!-- Filter -->
        <div class="grid gap-3">
          <h3 class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Sort by</h3>
          <div class="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
            <button
              type="button"
              class="rounded-full border border-indigo-100/80 px-4 py-2 transition hover:border-indigo-200 hover:text-brand"
            >
              Latest
            </button>
            <button
              type="button"
              class="rounded-full border border-indigo-100/80 px-4 py-2 transition hover:border-indigo-200 hover:text-brand"
            >
              Most Popular
            </button>
            <button
              type="button"
              class="rounded-full border border-indigo-100/80 px-4 py-2 transition hover:border-indigo-200 hover:text-brand"
            >
              Reward Points
            </button>
          </div>
        </div>
      </aside>

      <!-- Feed cards -->
      <div class="grid gap-6">
        <div class="grid gap-3">
          <article
            v-for="item in config.feed"
            :key="item.title"
            class="grid gap-5 rounded-2xl bg-white p-6 shadow-panel ring-1 ring-indigo-100/60">
            <!-- Title -->
            <template v-if="isInsightPillar">
              <!-- Title -->
              <header class="flex flex-wrap items-center justify-between gap-3">
                <span
                  class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
                  :style="{ backgroundColor: `${item.typeColor}14`, color: item.typeColor }"
                >
                  <span>{{ item.type.icon }}</span>
                  <span>{{ item.type.label }}</span>
                </span>

                <span
                  v-if="getStatusMeta(item.status)"
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  :class="getStatusMeta(item.status).classes"
                >
                  {{ getStatusMeta(item.status).label }}
                </span>
              </header>

              <div class="space-y-2">
                <p class="text-sm font-medium text-slate-500">
                  Author: <span class="text-slate-700">{{ item.author }}</span>
                </p>
                <h3 class="text-xl font-semibold text-slate-900">{{ item.title }}</h3>
                <p class="text-slate-600">{{ item.subtitle }}</p>
              </div>

              <!-- Reward -->
              <p class="text-sm font-semibold text-slate-600">{{ item.details.join(' · ') }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
                >
                  #{{ tag }}
                </span>
              </div>

              <!-- Button -->
              <div class="grid gap-3 rounded-2xl bg-slate-50 px-5 py-4 sm:grid-cols-2">
                <div v-for="stat in item.stats" :key="stat.label" class="flex items-center gap-3">
                  <span class="text-lg">{{ stat.icon }}</span>
                  <span class="text-sm font-semibold text-slate-600">{{ stat.label }}</span>
                </div>
              </div>

              <footer class="flex flex-wrap items-center justify-between gap-3">
                <span></span>
                <div class="flex flex-wrap gap-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
                  >
                    💬 Ask Question
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                    :style="{
                      backgroundColor: config.accent,
                      boxShadow: `0 18px 32px ${config.accent}45`,
                    }"
                  >
                    🚀 Participate
                  </button>
                </div>
              </footer>
            </template>

            <template v-else>
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
                    backgroundColor: config.accent,
                    boxShadow: `0 18px 32px ${config.accent}45`,
                  }">
                  {{ item.cta ?? config.actionLabel }}
                </button>
              </div>
            </template>
          </article>
        </div>

        <!-- Create post button -->
        <footer class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            @click="openForm"
            :style="{
              backgroundImage: `linear-gradient(135deg, ${config.accent}, ${config.accent}cc)`,
              boxShadow: `0 20px 36px ${config.accent}40`,
            }"
          >
            Create Post
          </button>
        </footer>
      </div>

      <!-- Create post form -->
      <div
        v-if="showForm"
        class="fixed inset-0 z-20 grid place-items-center bg-slate-900/50 px-4"
        @click.self="closeForm"
      >
        <form
          class="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-indigo-100/80"
          @submit.prevent="submitForm"
        >
          <h2 class="text-2xl font-semibold" :style="{ color: config.accent }">
            Create {{ config.title }} post
          </h2>
          <div class="mt-6 grid gap-6">
            <!-- Title -->
            <label class="grid gap-2 text-sm font-semibold text-slate-800">
              Title
              <input
                v-model="formState.title"
                type="text"
                placeholder="Give it a headline"
                class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <!-- Author -->
            <label v-if="isInsightPillar" class="grid gap-2 text-sm font-semibold text-slate-800">
              Author
              <input
                v-model="formState.author"
                type="text"
                placeholder="Add collaborator or institution"
                class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <!-- Summary -->
            <label class="grid gap-2 text-sm font-semibold text-slate-800">
              Summary
              <textarea
                v-model="formState.description"
                rows="3"
                placeholder="Describe what you need or how you can help"
                class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              ></textarea>
            </label>

            <div v-if="isInsightPillar" class="grid gap-4 md:grid-cols-2">
              <!-- Type tag -->
              <label class="grid gap-2 text-sm font-semibold text-slate-800">
                Type tag
                <select
                  v-model="formState.type"
                  class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                >
                  <option
                    v-for="option in insightTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </label>

              <!-- Status -->
              <label class="grid gap-2 text-sm font-semibold text-slate-800">
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

            <div v-if="isInsightPillar" class="grid gap-4 md:grid-cols-3">
              <!-- Duration -->
              <label class="grid gap-2 text-sm font-semibold text-slate-800">
                Duration (minutes)
                <input
                  v-model="formState.duration"
                  type="number"
                  min="1"
                  class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                />
              </label>

              <!-- Reward -->
              <label class="grid gap-2 text-sm font-semibold text-slate-800">
                Reward (Stunix)
                <input
                  v-model="formState.reward"
                  type="number"
                  min="5"
                  step="5"
                  class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                />
              </label>

              <!-- Closing date -->
              <label class="grid gap-2 text-sm font-semibold text-slate-800">
                Closes on
                <input
                  v-model="formState.closingDate"
                  type="date"
                  class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                />
              </label>
            </div>

            <!-- Reward -->
            <label v-else class="grid gap-2 text-sm font-semibold text-slate-800">
              Reward (Stunix)
              <input
                v-model="formState.reward"
                type="number"
                min="5"
                step="5"
                class="w-32 rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <!-- Tags -->
            <label v-if="isInsightPillar" class="grid gap-2 text-sm font-semibold text-slate-800">
              Tags
              <input
                v-model="formState.tags"
                type="text"
                placeholder="#AI, #StudyHabits, #Education"
                class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <!-- Participants -->
            <div v-if="isInsightPillar" class="grid gap-4 md:grid-cols-2">
              <label class="grid gap-2 text-sm font-semibold text-slate-800">
                Estimated participants
                <input
                  v-model="formState.participants"
                  type="number"
                  min="0"
                  class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                />
              </label>

              <!-- Questions -->
              <label class="grid gap-2 text-sm font-semibold text-slate-800">
                Questions / prompts
                <input
                  v-model="formState.questions"
                  type="number"
                  min="0"
                  class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                />
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <!-- Cancel button -->
            <button
              type="button"
              class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              @click="closeForm"
              :style="{ backgroundColor: `${config.accent}15`, color: config.accent }"
            >
              Cancel
            </button>

            <!-- Publish button -->
            <button
              type="submit"
              class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              :style="{
                backgroundColor: config.accent,
                boxShadow: `0 18px 32px ${config.accent}45`,
              }"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
<!-- ... -->
