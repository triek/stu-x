import { defineStore } from 'pinia'
import { ref } from 'vue'

import { communityDiscussions } from '@/data/communityDiscussions'

const cloneDiscussions = (data) => JSON.parse(JSON.stringify(data ?? {}))

const createId = () => `community-comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const useCommunityDiscussionsStore = defineStore('communityDiscussions', () => {
  const commentsByPost = ref(cloneDiscussions(communityDiscussions))

  const ensurePost = (postId) => {
    if (!postId) return
    if (!commentsByPost.value[postId]) {
      commentsByPost.value[postId] = []
    }
  }

  const getComments = (postId) => {
    ensurePost(postId)
    return commentsByPost.value[postId]
  }

  const addComment = (postId, comment) => {
    if (!postId || !comment?.message) return
    ensurePost(postId)

    const parsedUpvotes = Number.parseInt(comment.upvotes, 10)
    const region = comment.region?.toString().trim() || comment.role?.toString().trim() || ''

    commentsByPost.value[postId].unshift({
      id: comment.id ?? createId(),
      author: comment.author?.toString().trim() || 'Community member',
      role: comment.role?.toString().trim() || region,
      region,
      message: comment.message.trim(),
      timeAgo: comment.timeAgo ?? 'Just now',
      upvotes: Number.isNaN(parsedUpvotes) || parsedUpvotes < 0 ? 0 : parsedUpvotes,
    })
  }

  return {
    commentsByPost,
    getComments,
    addComment,
  }
})
