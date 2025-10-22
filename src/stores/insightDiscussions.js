import { defineStore } from 'pinia'
import { ref } from 'vue'

import { insightDiscussions } from '@/data/insightDiscussions'

const cloneDiscussions = (data) => JSON.parse(JSON.stringify(data ?? {}))

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const useInsightDiscussionsStore = defineStore('insightDiscussions', () => {
  const threadsByPost = ref(cloneDiscussions(insightDiscussions))

  const ensurePost = (postId) => {
    if (!postId) return
    if (!threadsByPost.value[postId]) {
      threadsByPost.value[postId] = []
    }
  }

  const getThreads = (postId) => {
    ensurePost(postId)
    return threadsByPost.value[postId]
  }

  const addQuestion = (postId, question) => {
    if (!postId || !question?.question) return
    ensurePost(postId)

    threadsByPost.value[postId].unshift({
      id: question.id ?? createId('question'),
      author: question.author?.trim() || 'Anonymous',
      role: question.role?.trim() || 'Participant',
      question: question.question.trim(),
      timeAgo: question.timeAgo ?? 'Just now',
      answers: question.answers ?? [],
    })
  }

  const addReply = (postId, questionId, answer) => {
    if (!postId || !questionId || !answer?.message) return
    ensurePost(postId)

    const thread = threadsByPost.value[postId].find((item) => item.id === questionId)
    if (!thread) return

    if (!Array.isArray(thread.answers)) {
      thread.answers = []
    }

    thread.answers.push({
      id: answer.id ?? createId('answer'),
      author: answer.author?.trim() || 'Anonymous',
      role: answer.role?.trim() || 'Contributor',
      message: answer.message.trim(),
      timeAgo: answer.timeAgo ?? 'Just now',
    })
  }

  return {
    threadsByPost,
    getThreads,
    addQuestion,
    addReply,
  }
})
