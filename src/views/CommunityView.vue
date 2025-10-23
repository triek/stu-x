<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import PillarLayout from '@/components/PillarLayout.vue'
import { PILLAR_ACCENTS } from '@/constants/pillarAccents'
import { useCommunityPostsStore } from '@/stores/communityPosts'

const communityPostsStore = useCommunityPostsStore()
const { posts } = storeToRefs(communityPostsStore)

const baseConfig = {
  title: 'Community',
  icon: '💬',
  accent: PILLAR_ACCENTS.community,
  headline: 'Community Hub',
  description:
    'Share stories, discuss, review, and reflect with peers',
  highlights: ['Discussion forum'],
  actionLabel: 'Comment',
  categories: ['Discussions', 'Critiques', 'Polls'],
  tags: ['#Community', '#Storytelling', '#PeerSupport'],
}

const config = computed(() => ({
  ...baseConfig,
  feed: posts.value,
}))

const formDefaults = {
  discussion: '0',
  cta: 'Discuss',
}

const handleSubmit = (form) => {
  communityPostsStore.addPost(form)
}
</script>

<template>
  <PillarLayout :config="config" :form-defaults="formDefaults" @submit="handleSubmit">
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
