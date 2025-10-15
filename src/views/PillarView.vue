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
        title: 'Prototype testing for inclusive onboarding',
        description: 'Help us refine a new student onboarding flow with a 5-minute survey.',
        reward: 20,
        cta: 'Join survey',
      },
      {
        title: 'Focus group: campus wellbeing pulse',
        description: 'Share your lived experience in a 20-minute group chat this Friday.',
        reward: 45,
        cta: 'Reserve seat',
      },
      {
        title: 'Peer review: design research report',
        description: 'Give formative feedback on data visualizations for a senior project.',
        reward: 35,
        cta: 'Offer insight',
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

const config = computed(() => pillarConfigs[props.pillarKey] ?? pillarConfigs.insight)

const showForm = ref(false)

const formState = reactive({
  title: '',
  description: '',
  reward: '20',
})

const openForm = () => {
  formState.title = ''
  formState.description = ''
  formState.reward = '20'
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
<section class="flex flex-col gap-8">
  <header
    class="flex flex-col gap-6 rounded-3xl border-2 bg-white p-10 shadow-panel ring-1 ring-indigo-100/50 md:flex-row md:items-center"
    :style="{ borderColor: `${config.accent}33` }">
    <span class="text-5xl md:text-6xl">{{ config.icon }}</span>
    <div class="space-y-2">
      <h1 class="text-3xl font-bold" :style="{ color: config.accent }">{{ config.title }}</h1>
      <p class="max-w-2xl text-base text-slate-600">{{ config.description }}</p>
    </div>
  </header>

  <!-- Feed cards -->
  <div class="grid gap-6">
    <article
      v-for="item in config.feed"
      :key="item.title"
      class="grid gap-5 rounded-3xl bg-white p-7 shadow-panel ring-1 ring-indigo-100/60">

      <!-- Title -->
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-slate-900">{{ item.title }}</h3>
        <p class="text-slate-600">{{ item.description }}</p>
      </div>

      <!-- Reward -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span
          class="rounded-full px-3 py-1 text-sm font-semibold"
          :style="{ backgroundColor: `${config.accent}1a`, color: config.accent }">
          +{{ item.reward }} Stunix
        </span>

        <!-- Button -->
        <button
          type="button"
          class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          :style="{ backgroundColor: config.accent, boxShadow: `0 18px 32px ${config.accent}45` }">
          {{ item.cta }}
        </button>
      </div>
    </article>
  </div>

  <!-- Create post button -->
  <footer class="flex justify-end">
    <button
      type="button"
      class="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
      @click="openForm"
      :style="{ backgroundImage: `linear-gradient(135deg, ${config.accent}, ${config.accent}cc)`, boxShadow: `0 20px 36px ${config.accent}40` }"
    >
      Create Post
    </button>
  </footer>

  <!-- Create post form -->
  <div v-if="showForm" class="fixed inset-0 z-20 grid place-items-center bg-slate-900/50 px-4" @click.self="closeForm">
    <form class="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-indigo-100/80" @submit.prevent="submitForm">
      <h2 class="text-2xl font-semibold" :style="{ color: config.accent }">Create {{ config.title }} post</h2>
      <div class="mt-6 grid gap-5">
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
          Short description
          <textarea
            v-model="formState.description"
            rows="3"
            placeholder="Describe what you need or how you can help"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"></textarea>
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
      </div>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
          @click="closeForm"
          :style="{ backgroundColor: `${config.accent}15`, color: config.accent }">
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          :style="{ backgroundColor: config.accent, boxShadow: `0 18px 32px ${config.accent}45` }">
          Publish
        </button>
      </div>
    </form>
  </div>
</section>
</template>

<style scoped>
</style>
