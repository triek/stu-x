<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import InsightDiscussionPanel from '@/components/InsightDiscussionPanel.vue'
import { PILLAR_ACCENTS } from '@/constants/pillarAccents'
import { insightPosts } from '@/data/insightPosts'
import { useInsightDiscussionsStore } from '@/stores/insightDiscussions'

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

const isDiscussionOpen = ref(false)

const accent = PILLAR_ACCENTS.insight

const post = computed(() =>
  insightPosts.find((item) => item.id === route.params.id)
)

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

const openDiscussion = () => {
  if (!post.value?.id) return
  isDiscussionOpen.value = true
}

const closeDiscussion = () => {
  isDiscussionOpen.value = false
}

const handleAddQuestion = (payload) => {
  if (!post.value?.id) return
  discussionsStore.addQuestion(post.value.id, payload)
}

const handleAddReply = ({ threadId, payload }) => {
  if (!post.value?.id || !threadId) return
  discussionsStore.addReply(post.value.id, threadId, payload)
}
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
            @click="openDiscussion"
          >
            💬 Ask Question
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

    <InsightDiscussionPanel
      :open="isDiscussionOpen"
      :post="post"
      :threads="discussionThreads"
      @close="closeDiscussion"
      @add-question="handleAddQuestion"
      @add-reply="handleAddReply"
    />
  </section>
</template>

<style scoped>
.shadow-panel {
  box-shadow: 0 12px 32px -20px rgb(79 70 229 / 0.35);
}
</style>
