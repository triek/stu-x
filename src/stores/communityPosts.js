import { defineStore } from 'pinia'
import { ref } from 'vue'

import { communityPosts as initialPosts } from '@/data/communityPosts'
import { DEFAULT_REGION_ID } from '@/constants/regions'
import { parsePositiveInt, parseTagString, cloneSeedData, generatePostId, resolveRegionIds } from '@/utils/postForm'

const createPostFromForm = (form = {}) => {
  const title = form.title?.trim()
  const description = form.description?.trim()
  const discussion = parsePositiveInt(form.discussion)
  const cta = form.cta?.trim()
  const category = form.category?.toString().trim().toLowerCase()
  const tags = parseTagString(form.tags)
  const author = form.author?.toString().trim()
  const authorRegion = form.authorRegion?.toString().trim()

  const regions = resolveRegionIds(form)

  return {
    id: form.id ?? generatePostId('community'),
    title: title || 'Untitled community topic',
    description: description || '',
    discussion,
    cta: cta || 'Discuss',
    category: category || 'discussions',
    tags,
    region: regions[0] ?? DEFAULT_REGION_ID,
    regions,
    author: author || 'Community member',
    authorRegion: authorRegion || '',
  }
}

export const useCommunityPostsStore = defineStore('communityPosts', () => {
  const posts = ref(cloneSeedData(initialPosts))

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
