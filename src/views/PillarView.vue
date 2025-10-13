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
  <section class="pillar" :style="{ '--accent': config.accent }">
    <!-- Banner -->
    <header class="pillar-header">
      <span class="pillar-icon">{{ config.icon }}</span>
      <div>
        <h1>{{ config.title }}</h1>
        <p>{{ config.description }}</p>
      </div>
    </header>

    <!-- Feed cards -->
    <div class="feed">
      <article v-for="item in config.feed" :key="item.title" class="feed-card">
        <div class="feed-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
        <div class="feed-meta">
          <span class="reward">+{{ item.reward }} Stunix</span>
          <button type="button">{{ item.cta }}</button>
        </div>
      </article>
    </div>

    <!-- Card buttons -->
    <footer class="page-actions">
      <button type="button" class="create-btn" @click="openForm">Create Post</button>
    </footer>

    <!-- Create post -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <form class="modal" @submit.prevent="submitForm">
        <h2>Create {{ config.title }} post</h2>
        <label>
          Title
          <input v-model="formState.title" type="text" placeholder="Give it a headline" />
        </label>
        <label>
          Short description
          <textarea
            v-model="formState.description"
            rows="3"
            placeholder="Describe what you need or how you can help"
          ></textarea>
        </label>
        <label class="reward-input">
          Reward (Stunix)
          <input v-model="formState.reward" type="number" min="5" step="5" />
        </label>
        <div class="modal-actions">
          <button type="button" class="ghost" @click="closeForm">Cancel</button>
          <button type="submit">Publish</button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.pillar {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pillar-header {
  background: white;
  border-radius: 26px;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
  border: 2px solid color-mix(in srgb, var(--accent) 25%, transparent);
}

.pillar-icon {
  font-size: 2.8rem;
}

.pillar-header h1 {
  margin: 0;
  font-size: clamp(2.1rem, 4.2vw, 2.8rem);
  color: var(--accent);
}

.pillar-header p {
  margin: 0.4rem 0 0;
  color: #4b5563;
  font-size: 1.05rem;
}

.feed {
  display: grid;
  gap: 1.5rem;
}

.feed-card {
  background: white;
  border-radius: 22px;
  padding: 1.8rem;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.1);
  display: grid;
  gap: 1.25rem;
}

.feed-content h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #111827;
}

.feed-content p {
  margin: 0.35rem 0 0;
  color: #4b5563;
  line-height: 1.5;
}

.feed-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.reward {
  font-weight: 700;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, white);
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
}

.feed-meta button {
  border: none;
  background: var(--accent);
  color: white;
  font-weight: 600;
  padding: 0.65rem 1.4rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 16px 30px color-mix(in srgb, var(--accent) 25%, transparent);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feed-meta button:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 38px color-mix(in srgb, var(--accent) 35%, transparent);
}

.page-actions {
  display: flex;
  justify-content: flex-end;
}

.create-btn {
  border: none;
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, white));
  color: white;
  font-weight: 700;
  padding: 0.9rem 1.8rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 20px 38px color-mix(in srgb, var(--accent) 28%, transparent);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.create-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 26px 50px color-mix(in srgb, var(--accent) 38%, transparent);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 1.5rem;
  z-index: 20;
}

.modal {
  background: white;
  border-radius: 24px;
  padding: 2.25rem;
  max-width: 480px;
  width: 100%;
  display: grid;
  gap: 1.1rem;
}

.modal h2 {
  margin: 0;
  font-size: 1.6rem;
  color: var(--accent);
}

label {
  display: grid;
  gap: 0.45rem;
  font-weight: 600;
  color: #1f2937;
}

input,
textarea {
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

textarea {
  min-height: 120px;
}

.reward-input input {
  width: 140px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.modal-actions button {
  border: none;
  border-radius: 999px;
  font-weight: 600;
  padding: 0.65rem 1.5rem;
  cursor: pointer;
}

.modal-actions .ghost {
  background: rgba(99, 102, 241, 0.08);
  color: #4338ca;
}

.modal-actions .ghost:hover {
  background: rgba(99, 102, 241, 0.12);
}

.modal-actions button[type='submit'] {
  background: var(--accent);
  color: white;
  box-shadow: 0 16px 30px color-mix(in srgb, var(--accent) 28%, transparent);
}

.modal-actions button[type='submit']:hover {
  box-shadow: 0 20px 36px color-mix(in srgb, var(--accent) 36%, transparent);
  transform: translateY(-1px);
}

@media (max-width: 720px) {
  .pillar-header {
    flex-direction: column;
    text-align: center;
  }

  .feed-card {
    padding: 1.5rem;
  }

  .modal {
    padding: 2rem;
  }
}
</style>
