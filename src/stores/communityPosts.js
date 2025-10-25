import { defineStore } from 'pinia'
import { ref } from 'vue'

import { communityPosts as initialPosts } from '@/data/communityPosts'
import { DEFAULT_REGION_ID } from '@/constants/regions'
import { normalizeRegionId } from '@/utils/region'

const clonePosts = (data) => JSON.parse(JSON.stringify(data ?? []))

const createId = () => `community-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const parsePositiveInt = (value) => {
  const number = Number.parseInt(value, 10)
  return Number.isNaN(number) || number < 0 ? 0 : number
}

const parseTags = (input) => {
  if (!input) return []

  return input
    .split(',')
    .flatMap((segment) => segment.split(/\s+/))
    .map((tag) => tag.replace(/^#/, '').trim())
    .filter(Boolean)
}

const createPostFromForm = (form = {}) => {
  const title = form.title?.trim()
  const description = form.description?.trim()
  const discussion = parsePositiveInt(form.discussion)
  const cta = form.cta?.trim()
  const category = form.category?.toString().trim().toLowerCase()
  const tags = parseTags(form.tags)

  const ids = new Set()

  const collect = (value) => {
    const normalized = normalizeRegionId(value)
    if (normalized) {
      ids.add(normalized)
    }
  }

  collect(form.region ?? form.regionId)

  if (Array.isArray(form.regions)) {
    form.regions.forEach(collect)
  }

  if (!ids.size) {
    ids.add(DEFAULT_REGION_ID)
  }

  const regions = Array.from(ids)

  return {
    id: form.id ?? createId(),
    title: title || 'Untitled community topic',
    description: description || '',
    discussion,
    cta: cta || 'Discuss',
    category: category || 'discussions',
    tags,
    region: regions[0] ?? DEFAULT_REGION_ID,
    regions,
  }
}

export const useCommunityPostsStore = defineStore('communityPosts', () => {
  const posts = ref(clonePosts(initialPosts))

  const addPost = (form) => {
    const post = createPostFromForm(form)
    posts.value = [post, ...posts.value]
    return post
  }

  const incrementDiscussionCount = (postId, amount = 1) => {
    if (!postId) return

    const delta = Number.isFinite(amount) ? amount : 1

    posts.value = posts.value.map((post) => {
      if (post.id !== postId) return post

      const current = parsePositiveInt(post.discussion)
      const updated = current + delta

      return {
        ...post,
        discussion: updated < 0 ? 0 : updated,
      }
    })
  }

  return {
    posts,
    addPost,
    incrementDiscussionCount,
  }
})
