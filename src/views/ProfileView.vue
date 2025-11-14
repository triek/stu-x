<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '../stores/auth'
import { REGION_DEFINITIONS } from '../constants/regions'

const router = useRouter()
const authStore = useAuthStore()
const { user, stunixBalance, profilePosts, activityFeed, walletHistory, isAuthenticated } =
  storeToRefs(authStore)

const editForm = reactive({
  school: '',
  regionId: '',
})

const countryRegions = computed(() =>
  REGION_DEFINITIONS.filter((region) => region.statusLabel === 'National'),
)

const getRegionLabelFromId = (regionId) =>
  countryRegions.value.find((region) => region.id === regionId)?.label ?? ''

const resolveRegionIdFromLabel = (label) => {
  if (!label) {
    return ''
  }

  const normalizedLabel = label.trim().toLowerCase()

  return (
    countryRegions.value.find((region) => region.label.toLowerCase() === normalizedLabel)?.id ?? ''
  )
}

const pendingRegionLabel = computed(() => {
  if (editForm.regionId) {
    return getRegionLabelFromId(editForm.regionId).trim()
  }

  return (user.value?.region ?? '').trim()
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
    'Explorer of peer wisdom, ready to earn, spend, and share Stunix insight with the community.',
)

const profileSchool = computed(() => user.value?.school ?? 'Independent learner')
const profileRegion = computed(() => user.value?.region ?? 'Global')

const formattedBalance = computed(
  () => `${new Intl.NumberFormat('en-US').format(stunixBalance.value ?? 0)} ☕`,
)

const profileChanged = computed(() => {
  const currentSchool = (user.value?.school ?? '').trim()
  const currentRegion = (user.value?.region ?? '').trim()
  const pendingSchool = editForm.school.trim()
  const pendingRegion = pendingRegionLabel.value

  return pendingSchool !== currentSchool || pendingRegion !== currentRegion
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
  })),
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
  })),
)

const formattedWallet = computed(() =>
  (walletHistory.value ?? []).map((entry) => ({
    ...entry,
    dateLabel: new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(entry.date ?? Date.now())),
  })),
)

const resetFeedback = () => {
  updateFeedback.value = ''
  updateFeedbackVariant.value = 'neutral'
}

watch(
  user,
  (value) => {
    editForm.school = value?.school ?? ''
    editForm.regionId = resolveRegionIdFromLabel(value?.region ?? '')
  },
  { immediate: true },
)

watch([() => editForm.school, () => editForm.regionId], resetFeedback)

const handleProfileUpdate = () => {
  resetFeedback()

  if (!profileChanged.value) {
    updateFeedback.value = 'No changes detected — update your school or region first.'
    updateFeedbackVariant.value = 'warning'
    return
  }

  const trimmedSchool = editForm.school.trim()
  const trimmedRegion = pendingRegionLabel.value

  if (!trimmedSchool || !trimmedRegion) {
    updateFeedback.value = 'School and country or region cannot be blank.'
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
  <section class="grid gap-6">
    <div
      class="grid gap-6 rounded-3xl bg-white p-10 shadow-panel ring-1 ring-indigo-100/60 dark:bg-slate-900/80 dark:ring-slate-700/40"
    >
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div
          class="grid h-24 w-24 flex-shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-brand to-indigo-400 dark:from-indigo-700 dark:to-indigo-400 text-3xl font-bold uppercase tracking-[0.08em] text-white"
        >
          {{ initials }}
        </div>
        <div class="flex-1 space-y-6">
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div class="space-y-3">
              <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {{ displayName }}
              </h1>
              <p class="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {{ profileBio }}
              </p>
            </div>
            <div
              class="grid gap-2 rounded-3xl bg-indigo-50/80 px-5 py-4 text-right text-slate-700 dark:bg-indigo-900/30 dark:text-slate-100"
            >
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >Stunix balance</span
              >
              <span class="text-2xl font-bold text-brand">{{ formattedBalance }}</span>
            </div>
          </div>
          <div class="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div class="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
              <p
                class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400"
              >
                School
              </p>
              <p class="mt-1 text-base font-semibold text-slate-800 dark:text-slate-200">
                {{ profileSchool }}
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
              <p
                class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400"
              >
                Region
              </p>
              <p class="mt-1 text-base font-semibold text-slate-800 dark:text-slate-200">
                {{ profileRegion }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-4 [--ru:23px] lg:grid-cols-[2fr_1fr] lg:grid-flow-dense">
      <!-- My posts -->
      <div
        class="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60 max-h-[calc(var(--ru)*18)] lg:col-start-1 lg:row-span-18 lg:overflow-hidden dark:bg-slate-900/80 dark:ring-slate-700/40"
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">My posts</h2>
          <span class="text-sm text-slate-500"
            >Sharing your insight boosts collective learning</span
          >
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto">
          <ul v-if="formattedPosts.length" class="grid gap-3 pr-1">
            <li
              v-for="post in formattedPosts"
              :key="post.id"
              class="grid gap-2 rounded-2xl bg-indigo-50/70 px-5 py-4 dark:bg-indigo-900/30"
            >
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ post.title }}</h3>
                <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{{
                  post.createdLabel
                }}</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ post.summary }}</p>
            </li>
          </ul>
          <p v-else class="rounded-2xl bg-slate-50/80 px-5 py-6 text-sm text-slate-600 dark:text-slate-400">
            You haven't published any posts yet. Share your first insight from the community or
            exchange pages.
          </p>
        </div>
      </div>

      <!-- Activity feed -->
      <div
        class="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60 max-h-[calc(var(--ru)*14)] lg:col-start-1 lg:row-span-14 lg:overflow-hidden dark:bg-slate-900/80 dark:ring-slate-700/40"
      >
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Activity feed</h2>
        <div class="flex-1 min-h-0 overflow-y-auto">
          <ul v-if="formattedActivity.length" class="grid gap-3 pr-1">
            <li
              v-for="item in formattedActivity"
              :key="item.id"
              class="rounded-2xl border border-indigo-100 bg-white px-5 py-3 dark:bg-slate-800/60 dark:border-slate-700"
            >
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {{ item.description }}
              </p>
              <p
                class="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-400"
              >
                {{ item.timestampLabel }}
              </p>
            </li>
          </ul>
          <p v-else class="rounded-2xl bg-slate-50/80 px-5 py-6 text-sm text-slate-600">
            Your activity will appear here as you participate in surveys, exchanges, and community
            events.
          </p>
        </div>
      </div>

      <!-- Wallet section -->
      <div
        class="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60 max-h-[calc(var(--ru)*14)] lg:col-start-2 lg:row-span-14 lg:overflow-hidden dark:bg-slate-900/80 dark:ring-slate-700/40"
      >
        <div class="flex flex-shrink-0 items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900">Wallet</h2>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-brand ring-1 ring-indigo-100 transition hover:bg-indigo-100"
            @click="toggleWallet"
          >
            <span>{{ isWalletOpen ? 'Hide activity' : 'Open wallet' }}</span>
          </button>
        </div>
        <div
          class="grid flex-shrink-0 gap-3 rounded-2xl bg-slate-50/70 p-5 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
        >
          <div class="flex items-center justify-between">
            <span class="font-semibold uppercase tracking-[0.16em] text-slate-200"
              >Current balance</span
            >
            <span class="text-lg font-bold text-slate-900 dark:text-slate-300">{{ formattedBalance }}</span>
          </div>
          <p>
            Use your Stunix to unlock mentorship, exchange opportunities, and exclusive community
            access.
          </p>
        </div>
        <div v-if="isWalletOpen" class="flex-1 min-h-0 overflow-y-auto">
          <div class="grid gap-4 pr-1">
            <h3 class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Recent wallet activity
            </h3>
            <ul v-if="formattedWallet.length" class="grid gap-3">
              <li
                v-for="entry in formattedWallet"
                :key="entry.id"
                class="grid gap-1 rounded-2xl border border-indigo-100 bg-white px-5 py-4 text-sm text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200"
              >
                <div class="flex items-center justify-between gap-3">
                  <span class="font-semibold text-slate-800 dark:text-slate-100">{{
                    entry.description
                  }}</span>
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
                <span
                  class="text-xs uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400"
                  >{{ entry.dateLabel }}</span
                >
              </li>
            </ul>
            <p v-else class="rounded-2xl bg-slate-50/80 px-5 py-6 text-sm text-slate-600">
              Once you start earning or spending, your wallet history will be recorded here.
            </p>
          </div>
        </div>
      </div>

      <!-- Update profile details -->
      <div
        class="flex min-h-0 flex-col gap-5 overflow-y-auto rounded-3xl bg-white/95 p-8 shadow-panel ring-1 ring-indigo-100/60 max-h-[calc(var(--ru)*18)] lg:col-start-2 lg:row-span-18 lg:overflow-hidden dark:bg-slate-900/80 dark:ring-slate-700/40"
      >
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Update profile details</h2>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto pr-1">
          <form class="grid gap-4" @submit.prevent="handleProfileUpdate">
            <label class="grid gap-2 text-sm">
              <span class="font-semibold text-slate-700 dark:text-slate-300">School or organization</span>
              <input
                v-model="editForm.school"
                type="text"
                class="input-control"
                placeholder="StuX International Academy"
              />
            </label>
            <label class="grid gap-2 text-sm">
              <span class="font-semibold text-slate-700 dark:text-slate-300">
                Country or region
                <span class="text-rose-500" aria-hidden="true">*</span>
                <span class="sr-only">required</span>
              </span>
              <select
                v-model="editForm.regionId"
                class="input-control"
                name="region"
                required
                aria-required="true"
              >
                <option value="">Select your country or region</option>
                <option v-for="region in countryRegions" :key="region.id" :value="region.id">
                  {{ region.label }}
                </option>
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
            <button type="submit" class="btn btn-brand" :disabled="isSaving || !profileChanged">
              <span v-if="isSaving" class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 animate-ping rounded-full bg-white"></span>
                Saving changes...
              </span>
              <span v-else>Save changes</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
