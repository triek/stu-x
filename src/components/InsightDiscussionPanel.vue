<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  post: { type: Object, default: null },
  threads: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'add-question', 'add-reply'])

const newQuestion = reactive({
  name: '',
  role: '',
  question: '',
})

const replyDrafts = reactive({})

const resetForms = () => {
  newQuestion.name = ''
  newQuestion.role = ''
  newQuestion.question = ''
  Object.keys(replyDrafts).forEach((key) => {
    replyDrafts[key] = {
      name: '',
      role: '',
      message: '',
    }
  })
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForms()
    }
  }
)

watch(
  () => props.threads,
  (threads) => {
    threads.forEach((thread) => {
      if (!replyDrafts[thread.id]) {
        replyDrafts[thread.id] = {
          name: '',
          role: '',
          message: '',
        }
      }
    })

    Object.keys(replyDrafts).forEach((key) => {
      if (!threads.some((thread) => thread.id === key)) {
        delete replyDrafts[key]
      }
    })
  },
  { immediate: true }
)

const isSubmittingQuestion = ref(false)
const activeReply = ref('')

const handleClose = () => {
  emit('close')
}

const handleSubmitQuestion = async () => {
  if (!newQuestion.question.trim()) return
  isSubmittingQuestion.value = true

  emit('add-question', {
    author: newQuestion.name,
    role: newQuestion.role,
    question: newQuestion.question,
  })

  resetForms()
  isSubmittingQuestion.value = false
}

const handleSubmitReply = async (threadId) => {
  const draft = replyDrafts[threadId]
  if (!draft || !draft.message.trim()) return

  activeReply.value = threadId

  emit('add-reply', {
    threadId,
    payload: {
      author: draft.name,
      role: draft.role,
      message: draft.message,
    },
  })

  replyDrafts[threadId] = {
    name: '',
    role: '',
    message: '',
  }

  activeReply.value = ''
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex h-full w-full max-w-4xl flex-col gap-6 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10"
        >
          <header class="flex items-start justify-between gap-4">
            <div class="space-y-2">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Discussion</p>
              <h2 class="text-2xl font-semibold text-slate-900">
                {{ post?.title ?? 'Ask a question' }}
              </h2>
              <p v-if="post?.subtitle" class="text-sm text-slate-500">
                {{ post.subtitle }}
              </p>
            </div>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              @click="handleClose"
              aria-label="Close discussion"
            >
              ✕
            </button>
          </header>

          <section class="grid flex-1 gap-6 overflow-y-auto pr-2">
            <article class="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Start a new question
              </h3>
              <form class="grid gap-4" @submit.prevent="handleSubmitQuestion">
                <div class="grid gap-2 sm:grid-cols-2">
                  <label class="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Your name
                    <input
                      v-model="newQuestion.name"
                      type="text"
                      placeholder="Add your name"
                      class="w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                  <label class="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Role or affiliation
                    <input
                      v-model="newQuestion.role"
                      type="text"
                      placeholder="e.g. Student Researcher"
                      class="w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                </div>
                <label class="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Question
                  <textarea
                    v-model="newQuestion.question"
                    rows="3"
                    placeholder="What would you like to know?"
                    class="w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  ></textarea>
                </label>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                    :disabled="isSubmittingQuestion || !newQuestion.question.trim()"
                  >
                    {{ isSubmittingQuestion ? 'Sending...' : 'Post question' }}
                  </button>
                </div>
              </form>
            </article>

            <article class="grid gap-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Threaded questions
                </h3>
                <span class="text-xs font-medium text-slate-400">{{ threads.length }} total</span>
              </div>

              <p v-if="!threads.length" class="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No questions yet. Be the first to start the conversation.
              </p>

              <ul v-else class="grid gap-4">
                <li
                  v-for="thread in threads"
                  :key="thread.id"
                  class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-slate-800">{{ thread.author }}</p>
                      <p class="text-xs text-slate-500">
                        <span v-if="thread.role">{{ thread.role }} · </span>{{ thread.timeAgo }}
                      </p>
                    </div>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Question</span>
                  </div>
                  <p class="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{{ thread.question }}</p>

                  <ul v-if="thread.answers?.length" class="grid gap-3 rounded-2xl bg-slate-50 p-3">
                    <li v-for="answer in thread.answers" :key="answer.id" class="grid gap-1 rounded-xl border border-slate-200 bg-white p-3">
                      <p class="text-sm font-semibold text-indigo-600">{{ answer.author }}</p>
                      <p class="text-xs text-slate-500">
                        <span v-if="answer.role">{{ answer.role }} · </span>{{ answer.timeAgo }}
                      </p>
                      <p class="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{{ answer.message }}</p>
                    </li>
                  </ul>

                  <form
                    v-if="replyDrafts[thread.id]"
                    class="grid gap-3 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-3"
                    @submit.prevent="handleSubmitReply(thread.id)"
                  >
                    <div class="grid gap-2 sm:grid-cols-2">
                      <label class="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                        Your name
                        <input
                          v-model="replyDrafts[thread.id].name"
                          type="text"
                          placeholder="Add your name"
                          class="w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                      </label>
                      <label class="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                        Role or affiliation
                        <input
                          v-model="replyDrafts[thread.id].role"
                          type="text"
                          placeholder="e.g. Host, Participant"
                          class="w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                      </label>
                    </div>
                    <label class="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Your reply
                      <textarea
                        v-model="replyDrafts[thread.id].message"
                        rows="3"
                        placeholder="Share your answer or follow-up"
                        class="w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      ></textarea>
                    </label>
                    <div class="flex justify-end">
                      <button
                        type="submit"
                        class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                        :disabled="activeReply === thread.id || !replyDrafts[thread.id].message.trim()"
                      >
                        {{ activeReply === thread.id ? 'Sending...' : 'Send reply' }}
                      </button>
                    </div>
                  </form>
                </li>
              </ul>
            </article>
          </section>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
