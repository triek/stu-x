<script setup>
import { computed, reactive, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import PillarLayout from '@/components/PillarLayout.vue'
import { PILLAR_ACCENTS } from '@/constants/pillarAccents'
import { useCommunityPostsStore } from '@/stores/communityPosts'
import { useCommunityDiscussionsStore } from '@/stores/communityDiscussions'
import { useRegionStore } from '@/stores/region'
import { useAuthStore } from '@/stores/auth'
import { useRegionScopedFeed } from '@/composables/useRegionScopedFeed'

const communityPostsStore = useCommunityPostsStore()
const communityDiscussionsStore = useCommunityDiscussionsStore()
const { posts } = storeToRefs(communityPostsStore)

const regionStore = useRegionStore()
const { activeRegion } = storeToRefs(regionStore)

const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const {
  scopedFeed: filteredPosts,
  resolveRegionMeta,
  userRegionLabel: currentRegionLabel,
  userRegionId: resolvedUserRegionId,
} = useRegionScopedFeed(posts)

const currentUsername = computed(() => user.value?.username?.trim() || '')
const discussionIdentity = computed(() => {
  if (!isAuthenticated.value) return ''

  const name = currentUsername.value || 'Community member'
  const region = currentRegionLabel.value
  return region ? `${name} · ${region}` : name
})

const openThreads = reactive({})
const commentDrafts = reactive({})

watchEffect(() => {
  posts.value.forEach((post) => {
    if (!post?.id) return

    if (!(post.id in openThreads)) {
      openThreads[post.id] = false
    }

    if (!(post.id in commentDrafts)) {
      commentDrafts[post.id] = {
        name: '',
        role: '',
        message: '',
        expanded: false,
      }
    }
  })
})

const parseCount = (value) => {
  const number = Number.parseInt(value, 10)
  return Number.isNaN(number) || number < 0 ? 0 : number
}

const getComments = (postId) => communityDiscussionsStore.getComments(postId) ?? []

const getTopComment = (postId) => {
  const comments = getComments(postId)
  if (!comments.length) return null

  return comments.reduce((best, comment) => {
    if (!best) return comment

    const bestScore = Number.parseInt(best.upvotes, 10)
    const commentScore = Number.parseInt(comment.upvotes, 10)

    const normalizedBest = Number.isNaN(bestScore) ? 0 : bestScore
    const normalizedComment = Number.isNaN(commentScore) ? 0 : commentScore

    return normalizedComment > normalizedBest ? comment : best
  }, null)
}

const formatDiscussionCount = (post) => {
  const commentCount = getComments(post.id).length
  const baseCount = parseCount(post.discussion)
  const count = Math.max(baseCount, commentCount)
  const suffix = count === 1 ? 'Discussion' : 'Discussions'
  return `${count} ${suffix}`
}

const expandDraft = (postId) => {
  if (!commentDrafts[postId]) return
  if (!isAuthenticated.value) return
  commentDrafts[postId].expanded = true
}

const resetDraft = (postId) => {
  const draft = commentDrafts[postId]
  if (!draft) return

  draft.name = ''
  draft.role = ''
  draft.message = ''
  draft.expanded = false
}

const toggleThread = (postId) => {
  if (!(postId in openThreads)) return
  openThreads[postId] = !openThreads[postId]

  if (!openThreads[postId]) {
    resetDraft(postId)
  }
}

const submitComment = (postId) => {
  const draft = commentDrafts[postId]
  if (!draft?.message.trim()) return
  if (!isAuthenticated.value) return

  const author = currentUsername.value || 'Community member'
  const region = currentRegionLabel.value

  communityDiscussionsStore.addComment(postId, {
    author,
    region,
    role: region,
    message: draft.message,
  })

  communityPostsStore.incrementDiscussionCount(postId, 1)
  resetDraft(postId)
}

const getCommentRegion = (comment) =>
  comment?.region?.toString().trim() || comment?.role?.toString().trim() || ''

const getPostAuthorRegion = (post) =>
  post?.authorRegion?.toString().trim() || post?.regionMeta?.label || ''

const resolveRegionLabel = (regionId) => {
  if (!regionId) return ''
  return resolveRegionMeta(regionId)?.label ?? ''
}

const baseConfig = {
  title: 'Community',
  icon: '💬',
  accent: PILLAR_ACCENTS.community,
  headline: 'Community Hub',
  description: 'Share stories, discuss, review, and reflect with peers',
  highlights: ['Discussion forum'],
  actionLabel: 'Comment',
  categories: [
    { label: 'Discussions', value: 'discussions' },
    { label: 'Critiques', value: 'critiques' },
    { label: 'Polls', value: 'polls' },
  ],
  tags: ['#Community', '#StudyTips', '#Tech', '#Wellbeing'],
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

const formDefaults = {
  discussion: '0',
  cta: 'Discuss',
}

const handleSubmit = (form) => {
  const author = currentUsername.value || 'Community member'
  const activeRegionId = activeRegion.value?.id
  const activeLabel = activeRegion.value?.label || resolveRegionLabel(activeRegionId)

  communityPostsStore.addPost({
    ...form,
    author,
    authorRegion: activeLabel,
    region: activeRegionId,
  })
  if (!isAuthenticated.value) return

  communityPostsStore.addPost({
    ...form,
    author,
    authorRegion:
      resolveRegionLabel(resolvedUserRegionId.value) || currentRegionLabel.value || activeLabel,
    region: resolvedUserRegionId.value,
  })
}
</script>

<template>
  <PillarLayout :config="config" :form-defaults="formDefaults" @submit="handleSubmit">
    <template #feed="{ items, accent }">
      <article
        v-for="item in items"
        :key="item.id"
        class="grid gap-5 rounded-3xl bg-white dark:bg-slate-900/80 p-6 shadow-panel ring-1"
        :style="{ '--tw-ring-color': `${accent}80` }"
      >
        <header class="flex items-start gap-4">
          <span class="text-3xl">💬</span>
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {{ item.title }}
            </h3>
            <div
              class="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300"
            >
              <span class="text-slate-700 dark:text-slate-200">{{ item.author }}</span>
              <span v-if="getPostAuthorRegion(item)" class="dark:text-slate-300"
                >· {{ getPostAuthorRegion(item) }}</span
              >
              <span
                v-if="item.regionMeta"
                class="inline-flex w-fit items-center rounded-full px-2 py-1 mx-2 text-xs font-semibold"
                :class="
                  item.regionMeta.chipClass ??
                  'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300'
                "
              >
                📍 {{ item.regionMeta.shortLabel ?? item.regionMeta.label }}
              </span>
            </div>
            <p class="text-slate-600 dark:text-slate-300">{{ item.description }}</p>
          </div>
        </header>

        <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-brand dark:text-indigo-200"
          >
            #{{ tag }}
          </span>
        </div>

        <section
          v-if="!openThreads[item.id] && getTopComment(item.id)"
          class="grid gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 dark:border-indigo-900/40 dark:bg-indigo-900/20 p-4"
        >
          <header class="text-xs font-semibold text-slate-500">
            <span class="text-slate-700">{{ getTopComment(item.id).author }}</span>
            <span v-if="getCommentRegion(getTopComment(item.id))">
              · {{ getCommentRegion(getTopComment(item.id)) }}
            </span>
            <span> · {{ getTopComment(item.id).timeAgo }}</span>
          </header>

          <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {{ getTopComment(item.id).message }}
          </p>

          <footer class="flex items-center gap-2">
            <span
              v-if="parseCount(getTopComment(item.id).upvotes) > 0"
              class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800/60 px-3 py-1 text-xs font-semibold text-green-600"
            >
              ▲ {{ parseCount(getTopComment(item.id).upvotes) }}
            </span>
            <span
              v-if="parseCount(getTopComment(item.id).downvotes) > 0"
              class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800/60 px-3 py-1 text-xs font-semibold text-red-600"
            >
              ▼ {{ parseCount(getTopComment(item.id).downvotes) }}
            </span>
          </footer>
        </section>

        <footer
          class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 px-5 py-4"
        >
          <span
            class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300"
          >
            <span></span>
            <span>{{ formatDiscussionCount(item) }}</span>
          </span>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            :style="{ backgroundColor: accent, boxShadow: `0 18px 32px ${accent}35` }"
            @click="toggleThread(item.id)"
          >
            <span v-if="openThreads[item.id]">Hide discussion</span>
            <span v-else>💬 Discuss</span>
          </button>
        </footer>

        <transition name="fade">
          <section
            v-if="openThreads[item.id]"
            class="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 p-5"
          >
            <header class="flex items-center justify-between">
              <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Community discussion
              </h4>
              <span class="text-xs font-semibold text-slate-500">{{
                formatDiscussionCount(item)
              }}</span>
            </header>

            <ul v-if="getComments(item.id).length" class="grid gap-3">
              <li
                v-for="comment in getComments(item.id)"
                :key="comment.id"
                class="grid gap-2 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/80 p-4"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="grid gap-1">
                    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {{ comment.author }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-300">
                      <span v-if="getCommentRegion(comment)">
                        {{ getCommentRegion(comment) }} ·
                      </span>
                      {{ comment.timeAgo }}
                    </p>
                  </div>

                  <span class="flex items-start gap-2">
                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-green-600"
                    >
                      ▲ {{ parseCount(comment.upvotes) }}
                    </span>

                    <span
                      class="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-red-600"
                    >
                      ▼ {{ parseCount(comment.downvotes) }}
                    </span>
                  </span>
                </div>

                <p
                  class="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  {{ comment.message }}
                </p>
              </li>
            </ul>

            <p v-else class="text-sm italic text-slate-500 dark:text-slate-300">
              Be the first to add a comment.
            </p>

            <form
              v-if="isAuthenticated && commentDrafts[item.id]"
              :class="[
                'grid',
                commentDrafts[item.id].expanded
                  ? 'gap-3 rounded-2xl border border-dashed border-indigo-200 bg-white dark:bg-slate-900/80 dark:border-indigo-900/40 p-4'
                  : '',
              ]"
              @submit.prevent="submitComment(item.id)"
            >
              <label :class="['grid', commentDrafts[item.id].expanded ? 'gap-2' : '']">
                <span
                  v-if="commentDrafts[item.id].expanded"
                  class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 px-1"
                >
                  Add to the discussion
                </span>

                <textarea
                  v-model="commentDrafts[item.id].message"
                  :rows="commentDrafts[item.id].expanded ? 3 : 1"
                  placeholder="Share your experience or advice"
                  class="w-full rounded-xl border border-slate-300/80 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  @focus="expandDraft(item.id)"
                  @click="expandDraft(item.id)"
                  @input="expandDraft(item.id)"
                ></textarea>
              </label>

              <div
                v-if="commentDrafts[item.id].expanded && discussionIdentity"
                class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                <span>
                  Posting as <span class="text-slate-700">{{ discussionIdentity }}</span>
                </span>
              </div>

              <div v-if="commentDrafts[item.id].expanded" class="flex justify-end gap-3">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200"
                  @click="resetDraft(item.id)"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="btn btn-brand gap-2 px-5 py-2.5 disabled:opacity-70"
                  :disabled="!commentDrafts[item.id].message.trim()"
                >
                  Post comment
                </button>
              </div>
            </form>

            <p
              v-else
              class="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500"
            >
              Log in to add a comment.
            </p>
          </section>
        </transition>
      </article>
    </template>

    <template #form-fields="{ formState }">
      <label class="grid gap-2 text-sm font-semibold text-slate-800">
        Title
        <input
          v-model="formState.title"
          type="text"
          placeholder="Start a conversation topic"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        />
      </label>

      <label class="grid gap-2 text-sm font-semibold text-slate-800">
        Summary
        <textarea
          v-model="formState.description"
          rows="3"
          placeholder="Share the context or your story"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        ></textarea>
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Starting discussions
          <input
            v-model="formState.discussion"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Call to action
          <input
            v-model="formState.cta"
            type="text"
            placeholder="Discuss"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      </div>
    </template>
  </PillarLayout>
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
