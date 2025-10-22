<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  post: {
    type: Object,
    default: null,
  },
  initialComments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const localComments = ref([])

const formState = reactive({
  name: '',
  context: '',
  question: '',
})

const postTitle = computed(() => props.post?.title ?? 'this insight')

const hasComments = computed(() => localComments.value.length > 0)

const resetForm = () => {
  formState.name = ''
  formState.context = ''
  formState.question = ''
}

const close = () => {
  emit('update:modelValue', false)
}

const hydrateComments = (source) => {
  localComments.value = source.map((comment) => ({
    ...comment,
    userMarkedHelpful: false,
  }))
}

watch(
  () => props.initialComments,
  (value) => {
    hydrateComments(value ?? [])
  },
  { immediate: true, deep: true },
)

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      resetForm()
      hydrateComments(props.initialComments ?? [])
    }
  },
)

const submitQuestion = () => {
  if (!formState.question.trim()) return

  const author = formState.name.trim() || 'Anonymous Student'
  const context = formState.context.trim() || 'Community Member'

  localComments.value = [
    {
      id: `new-${Date.now()}`,
      author,
      initials: author
        .split(/\s+/)
        .slice(0, 2)
        .map((segment) => segment[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 3) || 'ST',
      context,
      timeAgo: 'Just now',
      message: formState.question.trim(),
      upvotes: 0,
      replies: 0,
      userMarkedHelpful: true,
    },
    ...localComments.value,
  ]

  resetForm()
}

const toggleHelpful = (comment) => {
  if (!comment) return
  comment.userMarkedHelpful = !comment.userMarkedHelpful
  comment.upvotes = Math.max(0, comment.upvotes + (comment.userMarkedHelpful ? 1 : -1))
}
</script>

<template>
  <Teleport to="body">
    <Transition name="ask-question-fade">
      <div v-if="modelValue" class="ask-question-backdrop">
        <div class="ask-question-panel">
          <header class="ask-question-header">
            <div class="ask-question-heading">
              <span class="ask-question-icon">💬</span>
              <div class="ask-question-title-group">
                <h2 class="ask-question-title">Ask a question</h2>
                <p class="ask-question-subtitle">
                  Share curiosity, request clarifications, or help other students learn from {{ postTitle }}.
                </p>
              </div>
            </div>
            <button type="button" class="ask-question-close" @click="close">✕</button>
          </header>

          <section class="ask-question-body">
            <form class="ask-question-form" @submit.prevent="submitQuestion">
              <div class="ask-question-grid">
                <label class="ask-question-label">
                  <span class="ask-question-label-text">Display name</span>
                  <input
                    v-model="formState.name"
                    type="text"
                    placeholder="How should we introduce you?"
                    class="ask-question-input"
                  />
                </label>
                <label class="ask-question-label">
                  <span class="ask-question-label-text">Role or context</span>
                  <input
                    v-model="formState.context"
                    type="text"
                    placeholder="e.g. Psychology major, Peer mentor"
                    class="ask-question-input"
                  />
                </label>
              </div>

              <label class="ask-question-label">
                <span class="ask-question-label-text">Your question</span>
                <textarea
                  v-model="formState.question"
                  rows="4"
                  required
                  placeholder="What would you like to know?"
                  class="ask-question-textarea"
                ></textarea>
              </label>

              <div class="ask-question-actions">
                <button type="button" class="ask-question-secondary" @click="close">Cancel</button>
                <button type="submit" class="ask-question-primary">Share question</button>
              </div>
            </form>

            <div class="ask-question-divider"></div>

            <section class="ask-question-thread">
              <header class="ask-question-thread-header">
                <h3 class="ask-question-thread-title">Community discussion</h3>
                <p class="ask-question-thread-meta" v-if="hasComments">
                  {{ localComments.length }} conversation{{ localComments.length === 1 ? '' : 's' }} active
                </p>
                <p class="ask-question-thread-meta" v-else>No questions yet. Be the first to ask!</p>
              </header>

              <ol v-if="hasComments" class="ask-question-comment-list">
                <li v-for="comment in localComments" :key="comment.id" class="ask-question-comment">
                  <div class="ask-question-avatar">{{ comment.initials }}</div>
                  <div class="ask-question-comment-body">
                    <header class="ask-question-comment-header">
                      <div>
                        <p class="ask-question-comment-author">{{ comment.author }}</p>
                        <p class="ask-question-comment-context">{{ comment.context }}</p>
                      </div>
                      <span class="ask-question-comment-time">{{ comment.timeAgo }}</span>
                    </header>
                    <p class="ask-question-comment-message">{{ comment.message }}</p>
                    <footer class="ask-question-comment-footer">
                      <button type="button" class="ask-question-comment-action" @click="toggleHelpful(comment)">
                        <span aria-hidden="true">{{ comment.userMarkedHelpful ? '✅' : '👍' }}</span>
                        <span class="sr-only">Mark helpful</span>
                        Helpful · {{ comment.upvotes }}
                      </button>
                      <span class="ask-question-comment-replies">💬 {{ comment.replies }} repl{{ comment.replies === 1 ? 'y' : 'ies' }}</span>
                    </footer>
                  </div>
                </li>
              </ol>
            </section>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ask-question-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.55);
  z-index: 60;
  padding: 1.5rem;
}

.ask-question-panel {
  width: min(960px, 100%);
  max-height: min(90vh, 960px);
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 32px 70px -28px rgba(15, 23, 42, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ask-question-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.75rem 2rem 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
}

.ask-question-heading {
  display: flex;
  gap: 1.25rem;
}

.ask-question-icon {
  font-size: 2.5rem;
}

.ask-question-title-group {
  display: grid;
  gap: 0.35rem;
}

.ask-question-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.ask-question-subtitle {
  color: #475569;
  font-size: 0.95rem;
  max-width: 36rem;
}

.ask-question-close {
  border: none;
  background: rgba(148, 163, 184, 0.18);
  color: #0f172a;
  border-radius: 9999px;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.ask-question-close:hover {
  background: rgba(148, 163, 184, 0.3);
}

.ask-question-body {
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  gap: 2rem;
  padding: 2rem;
  overflow: auto;
}

.ask-question-form {
  display: grid;
  gap: 1.5rem;
}

.ask-question-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .ask-question-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.ask-question-label {
  display: grid;
  gap: 0.5rem;
}

.ask-question-label-text {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.ask-question-input,
.ask-question-textarea {
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.ask-question-input:focus,
.ask-question-textarea:focus {
  border-color: rgba(79, 70, 229, 0.5);
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.3);
}

.ask-question-textarea {
  resize: vertical;
  min-height: 140px;
}

.ask-question-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.ask-question-secondary,
.ask-question-primary {
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
}

.ask-question-secondary {
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: #fff;
  color: #475569;
}

.ask-question-secondary:hover {
  border-color: rgba(148, 163, 184, 0.8);
  color: #1e293b;
}

.ask-question-primary {
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  box-shadow: 0 16px 30px -14px rgba(79, 70, 229, 0.55);
}

.ask-question-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 36px -16px rgba(79, 70, 229, 0.55);
}

.ask-question-divider {
  width: 1px;
  background: rgba(148, 163, 184, 0.2);
}

.ask-question-thread {
  display: grid;
  gap: 1.5rem;
}

.ask-question-thread-header {
  display: grid;
  gap: 0.4rem;
}

.ask-question-thread-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.ask-question-thread-meta {
  font-size: 0.9rem;
  color: #475569;
}

.ask-question-comment-list {
  display: grid;
  gap: 1.25rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.ask-question-comment {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(248, 250, 252, 0.75);
}

.ask-question-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(59, 130, 246, 0.22));
  color: #4338ca;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.ask-question-comment-body {
  display: grid;
  gap: 0.75rem;
}

.ask-question-comment-header {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.ask-question-comment-author {
  font-weight: 600;
  color: #0f172a;
}

.ask-question-comment-context {
  font-size: 0.85rem;
  color: #64748b;
}

.ask-question-comment-time {
  font-size: 0.8rem;
  color: #94a3b8;
}

.ask-question-comment-message {
  color: #1e293b;
  line-height: 1.5;
}

.ask-question-comment-footer {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.85rem;
  color: #475569;
}

.ask-question-comment-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  padding: 0;
}

.ask-question-comment-action:hover {
  color: #1d4ed8;
}

.ask-question-comment-replies {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.ask-question-fade-enter-active,
.ask-question-fade-leave-active {
  transition: opacity 0.2s ease;
}

.ask-question-fade-enter-from,
.ask-question-fade-leave-to {
  opacity: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 960px) {
  .ask-question-body {
    grid-template-columns: 1fr;
  }

  .ask-question-divider {
    display: none;
  }
}
</style>
