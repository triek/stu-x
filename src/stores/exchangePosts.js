import { defineStore } from 'pinia'
import { ref } from 'vue'

import { exchangePosts as initialPosts } from '@/data/exchangePosts'
import { DEFAULT_REGION_ID } from '@/constants/regions'
import {
  cloneSeedData,
  generatePostId,
  parsePositiveInt,
  parseTagString,
  resolveRegionIds,
} from '@/utils/postForm'

const CATEGORY_META = {
  mentors: {
    type: { icon: '🎓', label: 'Mentor' },
    image: { emoji: '🎓', gradient: 'from-indigo-100 to-indigo-200' },
    actions: [
      { icon: '👤', label: 'View Profile' },
      { icon: '🤝', label: 'Request Session', highlight: true },
    ],
  },
  tas: {
    type: { icon: '🧑‍🏫', label: 'Teaching Assistant' },
    image: { emoji: '🧑‍🏫', gradient: 'from-sky-100 to-indigo-200' },
    actions: [
      { icon: '📅', label: 'See Schedule' },
      { icon: '✍️', label: 'Join Session', highlight: true },
    ],
  },
  'mini-courses': {
    type: { icon: '🧠', label: 'Mini Course' },
    image: { emoji: '🧠', gradient: 'from-orange-100 to-pink-200' },
    actions: [
      { icon: '📖', label: 'View Details' },
      { icon: '🛒', label: 'Enroll Session', highlight: true },
    ],
  },
  resources: {
    type: { icon: '📚', label: 'Resource' },
    image: { emoji: '📚', gradient: 'from-violet-100 to-purple-200' },
    actions: [
      { icon: '📂', label: 'Preview' },
      { icon: '⬇️', label: 'Get Resource', highlight: true },
    ],
  },
  literature: {
    type: { icon: '📖', label: 'Literature' },
    image: { emoji: '📖', gradient: 'from-amber-100 to-orange-200' },
    actions: [
      { icon: '📚', label: 'View Summary' },
      { icon: '🤝', label: 'Request Copy', highlight: true },
    ],
  },
  workshops: {
    type: { icon: '🛠️', label: 'Workshop' },
    image: { emoji: '🛠️', gradient: 'from-emerald-100 to-teal-200' },
    actions: [
      { icon: '📅', label: 'See Schedule' },
      { icon: '🛒', label: 'Reserve Spot', highlight: true },
    ],
  },
}

const DEFAULT_META = {
  type: { icon: '🤝', label: 'Exchange Offer' },
  image: { emoji: '🆕', gradient: 'from-indigo-100 to-indigo-200' },
  actions: [
    { icon: '👀', label: 'View Details' },
    { icon: '🤝', label: 'Request', highlight: true },
  ],
}

const createPostFromForm = (form = {}) => {
  const category = form.category in CATEGORY_META ? form.category : form.category?.trim()
  const resolvedCategory = category && CATEGORY_META[category] ? category : 'mentors'
  const meta = CATEGORY_META[resolvedCategory] ?? DEFAULT_META

  const title = form.title?.trim()
  const summary = form.description?.trim()
  const name = form.name?.trim()
  const reward = parsePositiveInt(form.reward)
  const tags = parseTagString(form.tags)

  const details = []

  if (reward > 0) {
    details.push(`☕ +${reward} Stunix`)
  }

  details.push('🆕 Community submission')

  const regions = resolveRegionIds(form)

  return {
    id: form.id ?? generatePostId('exchange'),
    category: resolvedCategory,
    image: meta.image ?? DEFAULT_META.image,
    type: meta.type ?? DEFAULT_META.type,
    name: name || 'Community member',
    title: title || 'Untitled exchange offer',
    summary: summary || '',
    details,
    tags,
    actions: meta.actions ?? DEFAULT_META.actions,
    status: 'active',
    region: regions[0] ?? DEFAULT_REGION_ID,
    regions,
  }
}

export const useExchangePostsStore = defineStore('exchangePosts', () => {
  const posts = ref(cloneSeedData(initialPosts))

  const addPost = (form) => {
    const post = createPostFromForm(form)
    posts.value = [post, ...posts.value]
    return post
  }

  return {
    posts,
    addPost,
  }
})
