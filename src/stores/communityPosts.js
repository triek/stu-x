import { defineStore } from 'pinia'
import { ref } from 'vue'

import { communityPosts as initialPosts } from '@/data/communityPosts'

const clonePosts = (data) => JSON.parse(JSON.stringify(data ?? []))

const createId = () => `community-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const parsePositiveInt = (value) => {
  const number = Number.parseInt(value, 10)
  return Number.isNaN(number) || number < 0 ? 0 : number
}

const createPostFromForm = (form = {}) => {
  const title = form.title?.trim()
  const description = form.description?.trim()
  const discussion = parsePositiveInt(form.discussion)
  const cta = form.cta?.trim()

  return {
    id: form.id ?? createId(),
    title: title || 'Untitled community topic',
    description: description || '',
    discussion,
    cta: cta || 'Discuss',
  }
}

export const useCommunityPostsStore = defineStore('communityPosts', () => {
  const posts = ref(clonePosts(initialPosts))

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
