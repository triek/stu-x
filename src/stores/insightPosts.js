import { defineStore } from 'pinia'
import { ref } from 'vue'

import { insightPosts as initialPosts } from '@/data/insightPosts'

const clonePosts = (data) => JSON.parse(JSON.stringify(data ?? []))

const createId = () => `insight-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const TYPE_META = {
  academic: { icon: '🧪', label: 'Academic', color: '#4338ca' },
  product: { icon: '💬', label: 'Product Feedback', color: '#0f766e' },
  project: { icon: '🎓', label: 'Student Project', color: '#db2777' },
}

const getTypeMeta = (type) => TYPE_META[type] ?? TYPE_META.academic

const parseTags = (input) => {
  if (!input) return []

  return input
    .split(',')
    .flatMap((segment) => segment.split(/\s+/))
    .map((tag) => tag.replace(/^#/, '').trim())
    .filter(Boolean)
}

const parsePositiveInt = (value) => {
  const number = Number.parseInt(value, 10)
  return Number.isNaN(number) || number < 0 ? 0 : number
}

const formatDate = (value) => {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const getClosingPrefix = (status) => {
  switch (status) {
    case 'closing':
      return 'Closing'
    case 'closed':
      return 'Closed'
    default:
      return 'Open until'
  }
}

const createPostFromForm = (form = {}) => {
  const typeMeta = getTypeMeta(form.type)
  const title = form.title?.trim()
  const subtitle = form.description?.trim()
  const author = form.author?.trim()
  const reward = form.reward?.toString().trim()
  const duration = form.duration?.toString().trim()
  const closingDate = formatDate(form.closingDate)
  const status = form.status ?? 'active'
  const participants = parsePositiveInt(form.participants)
  const questions = parsePositiveInt(form.questions)

  const details = []

  if (duration) {
    details.push(`🕓 ${duration} min`)
  }

  if (reward) {
    details.push(`🍵 +${reward} Stunix`)
  }

  if (closingDate) {
    details.push(`📅 ${getClosingPrefix(status)} ${closingDate}`)
  }

  const stats = []

  if (participants > 0) {
    stats.push({ icon: '📊', label: `${participants} ${participants === 1 ? 'participant' : 'participants'}` })
  }

  if (questions > 0) {
    stats.push({ icon: '💭', label: `${questions} ${questions === 1 ? 'question' : 'questions'}` })
  }

  return {
    id: form.id ?? createId(),
    type: { icon: typeMeta.icon, label: typeMeta.label },
    typeColor: typeMeta.color,
    author: author || undefined,
    title: title || 'Untitled insight request',
    subtitle: subtitle || '',
    details,
    tags: parseTags(form.tags),
    stats,
    status,
  }
}

export const useInsightPostsStore = defineStore('insightPosts', () => {
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
