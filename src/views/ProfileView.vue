<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { user, stunixBalance, profilePosts, activityFeed, walletHistory, isAuthenticated } =
  storeToRefs(authStore)

const editForm = reactive({
  school: '',
  region: '',
})

const updateFeedback = ref('')
const updateFeedbackVariant = ref('neutral')
const isSaving = ref(false)
const isWalletOpen = ref(false)

const initials = computed(() => {
  const name = user.value?.name ?? ''

  return name
    .split(' ')
    .map((chunk) => chunk[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

const displayName = computed(() => user.value?.name ?? 'New StuX Member')

const profileBio = computed(
  () =>
    user.value?.bio ??
    'Explorer of peer wisdom, ready to earn, spend, and share Stunix insight with the community.'
)

const profileSchool = computed(() => user.value?.school ?? 'Independent learner')
const profileRegion = computed(() => user.value?.region ?? 'Global')

const formattedBalance = computed(
  () => `${new Intl.NumberFormat('en-US').format(stunixBalance.value ?? 0)} 🍵`
)

const profileChanged = computed(() => {
  const currentSchool = user.value?.school ?? ''
  const currentRegion = user.value?.region ?? ''

  return (
    editForm.school.trim() !== currentSchool.trim() ||
    editForm.region.trim() !== currentRegion.trim()
  )
})

const formattedPosts = computed(() =>
  (profilePosts.value ?? []).map((post) => ({
    ...post,
    createdLabel: post.createdAt
      ? new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(new Date(post.createdAt))
      : 'Recently',
  }))
)

const formattedActivity = computed(() =>
  (activityFeed.value ?? []).map((item) => ({
    ...item,
    timestampLabel: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(item.timestamp ?? Date.now())),
  }))
)

const formattedWallet = computed(() =>
  (walletHistory.value ?? []).map((entry) => ({
    ...entry,
    dateLabel: new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(entry.date ?? Date.now())),
  }))
)

const resetFeedback = () => {
  updateFeedback.value = ''
  updateFeedbackVariant.value = 'neutral'
}

watch(
  user,
  (value) => {
    editForm.school = value?.school ?? ''
    editForm.region = value?.region ?? ''
  },
  { immediate: true }
)

watch([() => editForm.school, () => editForm.region], resetFeedback)

const handleProfileUpdate = () => {
  resetFeedback()

  if (!profileChanged.value) {
    updateFeedback.value = 'No changes detected — update your school or region first.'
    updateFeedbackVariant.value = 'warning'
    return
  }

  const trimmedSchool = editForm.school.trim()
  const trimmedRegion = editForm.region.trim()

  if (!trimmedSchool || !trimmedRegion) {
    updateFeedback.value = 'School and region cannot be blank.'
    updateFeedbackVariant.value = 'error'
    return
  }

  const updates = {
    school: trimmedSchool,
    region: trimmedRegion,
  }

  const changeSummary = []

  if (trimmedSchool !== (user.value?.school ?? '').trim()) {
    changeSummary.push(`school to ${trimmedSchool}`)
  }

  if (trimmedRegion !== (user.value?.region ?? '').trim()) {
    changeSummary.push(`region to ${trimmedRegion}`)
  }

  const activityDescription = changeSummary.length
    ? `Updated ${changeSummary.join(' and ')}.`
    : 'Updated profile details.'

  isSaving.value = true

  const { success, message } = authStore.updateProfile({
    ...updates,
    activityEntry: {
      id: `activity-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`,
      description: activityDescription,
      type: 'profile',
      timestamp: new Date().toISOString(),
    },
  })

  isSaving.value = false

  if (success) {
    updateFeedback.value = 'Profile updated successfully.'
    updateFeedbackVariant.value = 'success'
    return
  }

  updateFeedback.value = message ?? 'We could not update your profile right now.'
  updateFeedbackVariant.value = 'error'
}

const toggleWallet = () => {
  isWalletOpen.value = !isWalletOpen.value
}

onMounted(() => {
  if (!isAuthenticated.value) {
    router.replace('/login')
  }
})

watch(isAuthenticated, (value) => {
  if (!value) {
    router.replace('/login')
  }
})
</script>

<template>
  <section class="grid gap-10">
    <div class="grid gap-6 rounded-3xl bg-white p-10 shadow-panel ring-1 ring-indigo-100/60">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div class="grid h-24 w-24 flex-shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-brand to-indigo-400 text-3xl font-bold uppercase tracking-[0.08em] text-white">
          {{ initials }}
        </div>
        <div class="flex-1 space-y-6">
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div class="space-y-3">
              <h1 class="text-3xl font-bold text-slate-900">{{ displayName }}</h1>
              <p class="text-base leading-relaxed text-slate-600">
                {{ profileBio }}
              </p>
            </div>
            <div class="grid gap-2 rounded-3xl bg-indigo-50/80 px-5 py-4 text-right text-slate-700">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Stunix balance</span>
              <span class="text-2xl font-bold text-brand">{{ formattedBalance }}</span>
            </div>
          </div>
          <div class="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div class="rounded-2xl bg-slate-50/80 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">School</p>
              <p class="mt-1 text-base font-semibold text-slate-800">{{ profileSchool }}</p>
            </div>
            <div class="rounded-2xl bg-slate-50/80 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Region</p>
              <p class="mt-1 text-base font-semibold text-slate-800">{{ profileRegion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div class="grid gap-6">
        <div class="grid gap-4 rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 class="text-2xl font-semibold text-slate-900">My posts</h2>
            <span class="text-sm text-slate-500">Sharing your insight boosts collective learning.</span>
          </div>
          <ul v-if="formattedPosts.length" class="grid gap-4">
            <li
              v-for="post in formattedPosts"
              :key="post.id"
              class="grid gap-2 rounded-2xl bg-indigo-50/70 px-5 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-base font-semibold text-slate-900">{{ post.title }}</h3>
                <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{{ post.createdLabel }}</span>
              </div>
              <p class="text-sm text-slate-600">{{ post.summary }}</p>
            </li>
          </ul>
          <p v-else class="rounded-2xl bg-slate-50/80 px-5 py-6 text-sm text-slate-600">
            You haven’t published any posts yet. Share your first insight from the community or exchange pages.
          </p>
        </div>

        <div class="grid gap-4 rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60">
          <h2 class="text-2xl font-semibold text-slate-900">Activity feed</h2>
          <ul v-if="formattedActivity.length" class="grid gap-4">
            <li
              v-for="item in formattedActivity"
              :key="item.id"
              class="rounded-2xl border border-indigo-100 bg-white px-5 py-4"
            >
              <p class="text-sm font-semibold text-slate-800">{{ item.description }}</p>
              <p class="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{{ item.timestampLabel }}</p>
            </li>
          </ul>
          <p v-else class="rounded-2xl bg-slate-50/80 px-5 py-6 text-sm text-slate-600">
            Your activity will appear here as you participate in surveys, exchanges, and community events.
          </p>
        </div>
      </div>

      <div class="grid gap-6">
        <div class="grid gap-5 rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60">
          <div class="space-y-1">
            <h2 class="text-2xl font-semibold text-slate-900">Update profile details</h2>
            <p class="text-sm text-slate-500">Keep your school and region current so we can tailor opportunities for you.</p>
          </div>
          <form class="grid gap-4" @submit.prevent="handleProfileUpdate">
            <label class="grid gap-2 text-sm">
              <span class="font-semibold text-slate-700">School or organization</span>
              <input
                v-model="editForm.school"
                type="text"
                class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="StuX International Academy"
              />
            </label>
            <label class="grid gap-2 text-sm">
              <span class="font-semibold text-slate-700">Preferred region</span>
              <select
                v-model="editForm.region"
                class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Select a region</option>
                <option>North America</option>
                <option>Europe</option>
                <option>Asia-Pacific</option>
                <option>Latin America</option>
                <option>Africa &amp; Middle East</option>
              </select>
            </label>
            <p
              v-if="updateFeedback"
              class="text-sm font-semibold"
              :class="{
                'text-emerald-600': updateFeedbackVariant === 'success',
                'text-amber-600': updateFeedbackVariant === 'warning',
                'text-rose-600': updateFeedbackVariant === 'error',
                'text-slate-500': updateFeedbackVariant === 'neutral',
              }"
            >
              {{ updateFeedback }}
            </p>
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isSaving || !profileChanged"
            >
              <span v-if="isSaving" class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 animate-ping rounded-full bg-white"></span>
                Saving changes...
              </span>
              <span v-else>Save changes</span>
            </button>
          </form>
        </div>

        <div class="grid gap-4 rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-slate-900">Wallet</h2>
              <p class="text-sm text-slate-500">Track how you earn and spend your Stunix.</p>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-100"
              @click="toggleWallet"
            >
              <span>{{ isWalletOpen ? 'Hide activity' : 'Open wallet' }}</span>
            </button>
          </div>
          <div class="grid gap-3 rounded-2xl bg-slate-50/70 p-5 text-sm text-slate-600">
            <div class="flex items-center justify-between">
              <span class="font-semibold uppercase tracking-[0.16em] text-slate-400">Current balance</span>
              <span class="text-lg font-bold text-slate-900">{{ formattedBalance }}</span>
            </div>
            <p>Use your Stunix to unlock mentorship, exchange opportunities, and exclusive community access.</p>
          </div>
          <div v-if="isWalletOpen" class="grid gap-4">
            <h3 class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Recent wallet activity</h3>
            <ul v-if="formattedWallet.length" class="grid gap-3">
              <li
                v-for="entry in formattedWallet"
                :key="entry.id"
                class="grid gap-1 rounded-2xl border border-indigo-100 bg-white px-5 py-4 text-sm text-slate-700"
              >
                <div class="flex items-center justify-between gap-3">
                  <span class="font-semibold text-slate-800">{{ entry.description }}</span>
                  <span
                    class="text-sm font-semibold"
                    :class="{
                      'text-emerald-600': entry.type === 'credit',
                      'text-rose-600': entry.type === 'debit',
                      'text-slate-500': entry.type === 'info',
                    }"
                  >
                    {{ entry.amount > 0 ? `+${entry.amount}` : entry.amount }} Stunix
                  </span>
                </div>
                <span class="text-xs uppercase tracking-[0.14em] text-slate-400">{{ entry.dateLabel }}</span>
              </li>
            </ul>
            <p v-else class="rounded-2xl bg-slate-50/80 px-5 py-6 text-sm text-slate-600">
              Once you start earning or spending, your wallet history will be recorded here.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
