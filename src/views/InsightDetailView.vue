<script setup>
import { computed, reactive, ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { PILLAR_ACCENTS } from '@/constants/pillarAccents'
import { useInsightDiscussionsStore } from '@/stores/insightDiscussions'
import { useInsightPostsStore } from '@/stores/insightPosts'
import { useRegionStore } from '@/stores/region'
import { getItemRegionIds } from '@/utils/region'
import { useAuthStore } from '@/stores/auth'

const statusStyles = {
  active: {
    label: '🟢 Active',
    classes: 'border border-emerald-200/70 bg-emerald-50 text-emerald-600',
  },
  closing: {
    label: '🟠 Closing Soon',
    classes: 'border border-amber-200/70 bg-amber-50 text-amber-600',
  },
  closed: {
    label: '⚪ Closed',
    classes: 'border border-slate-200 bg-slate-100 text-slate-500',
  },
}

const route = useRoute()
const router = useRouter()

const discussionsStore = useInsightDiscussionsStore()
const insightPostsStore = useInsightPostsStore()
const { posts } = storeToRefs(insightPostsStore)
const regionStore = useRegionStore()

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const currentUsername = computed(() => user.value?.username?.trim() || '')
const currentRegionLabel = computed(() => user.value?.region?.toString().trim() || '')
const postingIdentity = computed(() => {
  if (!isAuthenticated.value) return ''

  const name = currentUsername.value || 'Community member'
  const region = currentRegionLabel.value
  return region ? `${name} · ${region}` : name
})

const isDiscussionOpen = ref(false)
const isSubmittingQuestion = ref(false)
const activeReply = ref('')
const isQuestionFormExpanded = ref(false)
const questionFormRef = ref(null)

const newQuestion = reactive({
  question: '',
})

const replyDrafts = reactive({})
const expandedReplies = reactive({})
const replyFormRefs = reactive({})

const resetForms = () => {
  newQuestion.question = ''
  isQuestionFormExpanded.value = false

  Object.keys(replyDrafts).forEach((key) => {
    replyDrafts[key] = {
      message: '',
    }
  })

  Object.keys(expandedReplies).forEach((key) => {
    expandedReplies[key] = false
  })

  Object.keys(replyFormRefs).forEach((key) => {
    delete replyFormRefs[key]
  })
}

const shouldAutoOpenDiscussion = computed(() => {
  const value = route.query.showDiscussion
  if (Array.isArray(value)) {
    return value.some((entry) => ['1', 'true', ''].includes(entry))
  }

  return value === '1' || value === 'true' || value === ''
})

const accent = PILLAR_ACCENTS.insight

const post = computed(() => posts.value.find((item) => item.id === route.params.id))

const regionMeta = computed(() => {
  if (!post.value) return null

  const regionIds = getItemRegionIds(post.value)
  return regionStore.getRegionMeta(post.value.region ?? regionIds[0])
})

const discussionThreads = computed(() => {
  if (!post.value?.id) return []
  return discussionsStore.getThreads(post.value.id)
})

const status = computed(() => {
  if (!post.value?.status) return null
  return statusStyles[post.value.status] ?? statusStyles.active
})

const backToInsight = () => {
  router.push({ name: 'insight' })
}

const participate = () => {
  // Placeholder for participate action
}

const getParticipantRegion = (entry) =>
  entry?.region?.toString().trim() || entry?.role?.toString().trim() || ''

const ensureReplyDrafts = (threads) => {
  threads.forEach((thread) => {
    if (!replyDrafts[thread.id]) {
      replyDrafts[thread.id] = {
        message: '',
      }
    }

    if (!(thread.id in expandedReplies)) {
      expandedReplies[thread.id] = false
    }
  })

  Object.keys(replyDrafts).forEach((key) => {
    if (!threads.some((thread) => thread.id === key)) {
      delete replyDrafts[key]
    }
  })

  Object.keys(expandedReplies).forEach((key) => {
    if (!threads.some((thread) => thread.id === key)) {
      delete expandedReplies[key]
    }
  })

  Object.keys(replyFormRefs).forEach((key) => {
    if (!threads.some((thread) => thread.id === key)) {
      delete replyFormRefs[key]
    }
  })
}

const expandQuestionForm = () => {
  if (!isAuthenticated.value) return
  isQuestionFormExpanded.value = true
}

const expandReplyForm = (threadId) => {
  if (!isAuthenticated.value) return
  expandedReplies[threadId] = true
}

const setReplyFormRef = (threadId, el) => {
  if (el) {
    replyFormRefs[threadId] = el
  } else {
    delete replyFormRefs[threadId]
  }
}

const collapseQuestionForm = () => {
  isQuestionFormExpanded.value = false
}

const collapseReplyForm = (threadId) => {
  expandedReplies[threadId] = false
}

const handleDocumentClick = (event) => {
  if (!isDiscussionOpen.value) return

  const target = event.target

  if (
    isQuestionFormExpanded.value &&
    questionFormRef.value &&
    !questionFormRef.value.contains(target)
  ) {
    collapseQuestionForm()
  }

  Object.keys(expandedReplies).forEach((key) => {
    if (
      expandedReplies[key] &&
      replyFormRefs[key] &&
      !replyFormRefs[key].contains(target)
    ) {
      collapseReplyForm(key)
    }
  })
}

const openDiscussion = () => {
  if (!post.value?.id) return
  isDiscussionOpen.value = true

  if (route.query.showDiscussion === undefined) {
    router.replace({
      name: route.name ?? 'insight-detail',
      params: route.params,
      query: { ...route.query, showDiscussion: '1' },
    })
  }
}

const closeDiscussion = () => {
  isDiscussionOpen.value = false

  if (route.query.showDiscussion !== undefined) {
    const restQuery = { ...route.query }
    delete restQuery.showDiscussion

    router.replace({
      name: route.name ?? 'insight-detail',
      params: route.params,
      query: restQuery,
    })
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})

const handleSubmitQuestion = () => {
  if (!post.value?.id || !newQuestion.question.trim()) return
  if (!isAuthenticated.value) return

  isSubmittingQuestion.value = true

  const author = currentUsername.value || 'Community member'
  const region = currentRegionLabel.value

  discussionsStore.addQuestion(post.value.id, {
    author,
    region,
    role: region,
    question: newQuestion.question,
  })

  resetForms()
  isSubmittingQuestion.value = false
}

const handleSubmitReply = (threadId) => {
  const draft = replyDrafts[threadId]
  if (!post.value?.id || !threadId || !draft?.message.trim()) return
  if (!isAuthenticated.value) return

  activeReply.value = threadId

  const author = currentUsername.value || 'Community member'
  const region = currentRegionLabel.value

  discussionsStore.addReply(post.value.id, threadId, {
    author,
    region,
    role: region,
    message: draft.message,
  })

  replyDrafts[threadId] = {
    message: '',
  }

  expandedReplies[threadId] = false

  activeReply.value = ''
}

watch(
  () => [post.value?.id, shouldAutoOpenDiscussion.value],
  ([postId, shouldOpen]) => {
    if (postId && shouldOpen) {
      isDiscussionOpen.value = true
    }
  },
  { immediate: true }
)

watch(
  () => isDiscussionOpen.value,
  (isOpen) => {
    if (isOpen) {
      resetForms()
    }
  }
)

watch(
  () => discussionThreads.value,
  (threads) => {
    ensureReplyDrafts(threads)
  },
  { immediate: true }
)
</script>

<template>
  <section class="grid gap-4">
    <button
      type="button"
      class="inline-flex items-center justify-self-start self-start rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
      @click="backToInsight"
    >
      ← Back to Insight
    </button>

    <article
      v-if="post"
      class="grid gap-6 rounded-3xl bg-white p-8 shadow-panel ring-1"
      :style="{ '--tw-ring-color': `${accent}40` }"
    >
      <header class="flex flex-wrap items-center justify-between gap-4">
        <span
          class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
          :style="{ backgroundColor: `${post.typeColor}14`, color: post.typeColor }"
        >
          <span>{{ post.type.icon }}</span>
          <span>{{ post.type.label }}</span>
        </span>

        <span
          v-if="status"
          class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
          :class="status.classes"
        >
          {{ status.label }}
        </span>
      </header>

      <div class="grid gap-4">
        <div class="grid gap-2">
          <h1 class="text-3xl font-bold text-slate-900">{{ post.title }}</h1>
          <p class="text-base text-slate-600">{{ post.subtitle }}</p>
        </div>

        <span
          v-if="regionMeta"
          class="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
          :class="regionMeta.chipClass ?? 'border border-slate-200 bg-slate-100 text-slate-600'"
        >
          📍 {{ regionMeta.shortLabel ?? regionMeta.label }}
        </span>

        <p v-if="post.author" class="text-sm font-medium text-slate-500">
          Hosted by <span class="text-slate-700">{{ post.author }}</span>
        </p>

        <div v-if="post.details?.length" class="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
          <span
            v-for="detail in post.details"
            :key="detail"
            class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-indigo-600"
          >
            {{ detail }}
          </span>
        </div>
      </div>

      <div v-if="post.stats?.length" class="grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
        <div v-for="stat in post.stats" :key="stat.label" class="flex items-center gap-3">
          <span class="text-xl">{{ stat.icon }}</span>
          <span class="text-sm font-semibold text-slate-600">{{ stat.label }}</span>
        </div>
      </div>

      <div v-if="post.tags?.length" class="grid gap-2">
        <h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Tags</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <footer class="flex flex-wrap items-center justify-between gap-3">
        <div class="text-sm text-slate-500">
          Want to learn more? Join the discussion or submit your insight to connect with peers.
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
            @click="isDiscussionOpen ? closeDiscussion() : openDiscussion()"
          >
            <span v-if="isDiscussionOpen">Hide discussion</span>
            <span v-else>💬 Ask Question</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            :style="{ backgroundColor: accent, boxShadow: `0 18px 32px ${accent}45` }"
            @click="participate"
          >
            🚀 Participate Now
          </button>
        </div>
      </footer>

      <transition name="fade">
        <section
          v-if="isDiscussionOpen"
          class="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >
          <header class="flex flex-wrap items-start justify-between gap-4">
            <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 px-1">Start a new question</h3>
          </header>

          <section class="grid gap-6">
            <article
              :class="[
                'grid gap-3',
                isQuestionFormExpanded ? 'rounded-2xl border border-slate-200 bg-white p-5' : ''
              ]"
            >
              <form
                v-if="isAuthenticated"
                ref="questionFormRef"
                :class="['grid', isQuestionFormExpanded ? 'gap-4' : '']"
                @submit.prevent="handleSubmitQuestion"
              >
                <label :class="['grid', isQuestionFormExpanded ? 'gap-2' : '']">
                  <span
                    v-if="isQuestionFormExpanded"
                    class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 px-1">
                    Your question
                  </span>

                  <textarea
                    v-model="newQuestion.question"
                    :rows="isQuestionFormExpanded ? 4 : 1"
                    placeholder="What would you like to know?"
                    class="w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    @focus="expandQuestionForm"
                    @click="expandQuestionForm"
                    @input="expandQuestionForm"
                  ></textarea>
                </label>
                <div
                  v-if="isQuestionFormExpanded && postingIdentity"
                  class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600"
                >
                  <span>
                    Posting as <span class="text-slate-700">{{ postingIdentity }}</span>
                  </span>
                </div>
                <div v-if="isQuestionFormExpanded" class="flex justify-end">
                  <button
                    type="submit"
                    class="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                    :disabled="isSubmittingQuestion || !newQuestion.question.trim()"
                  >
                    {{ isSubmittingQuestion ? 'Sending...' : 'Post question' }}
                  </button>
                </div>
              </form>
              <p
                v-else
                class="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500"
              >
                Log in to post a question.
              </p>
            </article>

            <article class="grid gap-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 px-1">
                  Threaded questions
                </h3>
                <span class="text-xs font-medium text-slate-400">{{ discussionThreads.length }} total</span>
              </div>

              <p
                v-if="!discussionThreads.length"
                class="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500"
              >
                No questions yet. Be the first to start the conversation.
              </p>

              <ul v-else class="grid gap-3">
                <li
                  v-for="thread in discussionThreads"
                  :key="thread.id"
                  class="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-slate-800">{{ thread.author }}</p>
                    <p class="text-xs text-slate-500">
                      <span v-if="getParticipantRegion(thread)">
                        {{ getParticipantRegion(thread) }} ·
                      </span>
                      {{ thread.timeAgo }}
                    </p>
                  </div>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Question</span>
                  </div>
                  <p class="whitespace-pre-line text-sm leading-relaxed text-slate-700">{{ thread.question }}</p>

                  <ul v-if="thread.answers?.length" class="grid gap-3 rounded-2xl bg-slate-100 p-1">
                    <li
                      v-for="answer in thread.answers"
                      :key="answer.id"
                      class="grid gap-1 rounded-xl border border-slate-200 bg-white p-3"
                    >
                    <p class="text-sm font-semibold text-indigo-600">{{ answer.author }}</p>
                    <p class="text-xs text-slate-500">
                        <span v-if="getParticipantRegion(answer)">
                          {{ getParticipantRegion(answer) }} ·
                        </span>
                        {{ answer.timeAgo }}
                    </p>
                      <p class="whitespace-pre-line text-sm leading-relaxed text-slate-700">{{ answer.message }}</p>
                    </li>
                  </ul>

                  <form
                    v-if="isAuthenticated && replyDrafts[thread.id]"
                    :ref="(el) => setReplyFormRef(thread.id, el)"
                    :class="[
                      'grid',
                      expandedReplies[thread.id]
                        ? 'gap-3 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-3'
                        : ''
                    ]"
                    @submit.prevent="handleSubmitReply(thread.id)"
                  >
                    <label :class="['grid', expandedReplies[thread.id] ? 'gap-2' : '']">
                      <span
                        v-if="expandedReplies[thread.id]"
                        class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                      >
                        Your reply
                      </span>
                      <textarea
                        v-model="replyDrafts[thread.id].message"
                        :rows="expandedReplies[thread.id] ? 3 : 1"
                        placeholder="Share your answer or follow-up"
                        class="w-full rounded-xl border border-slate-300/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                        @focus="expandReplyForm(thread.id)"
                        @click="expandReplyForm(thread.id)"
                        @input="expandReplyForm(thread.id)"
                      ></textarea>
                    </label>
                    <div
                      v-if="expandedReplies[thread.id] && postingIdentity"
                      class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"
                    >
                      <span>
                        Replying as <span class="text-slate-700">{{ postingIdentity }}</span>
                      </span>
                    </div>
                    <div v-if="expandedReplies[thread.id]" class="flex justify-end">
                      <button
                        type="submit"
                        class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                        :disabled="activeReply === thread.id || !replyDrafts[thread.id].message.trim()"
                      >
                        {{ activeReply === thread.id ? 'Sending...' : 'Send reply' }}
                      </button>
                    </div>
                  </form>
                  <p
                    v-else
                    class="rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500"
                  >
                    Log in to reply.
                  </p>
                </li>
              </ul>
            </article>
          </section>
        </section>
      </transition>
    </article>

    <article
      v-else
      class="grid gap-4 rounded-3xl bg-white p-8 text-center shadow-panel ring-1"
      :style="{ '--tw-ring-color': `${accent}40` }"
    >
      <h1 class="text-2xl font-semibold text-slate-900">Insight not found</h1>
      <p class="text-slate-600">
        The insight you are looking for may have been moved or is no longer available. Please return to the feed to explore the latest opportunities.
      </p>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 self-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        @click="backToInsight"
      >
        ← Back to Insight
      </button>
    </article>
  </section>
</template>

<style scoped>
.shadow-panel {
  box-shadow: 0 12px 32px -20px rgb(79 70 229 / 0.35);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
