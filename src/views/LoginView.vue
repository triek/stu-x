<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import { buildRedirectRoute, resolveRedirectPath } from '@/utils/navigation'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const isSubmitDisabled = computed(
  () => !username.value.trim() || !password.value.trim()
)

const redirectPath = computed(() =>
  resolveRedirectPath(route.query.redirect),
)

const signupLink = computed(() =>
  buildRedirectRoute('signup', redirectPath.value),
)

const quickLoginOptions = [
  {
    label: 'Log in as Tester',
    username: 'tester@stux.community',
    password: 'tester',
  },
]

const attemptLogin = ({ username: loginUsername, password: loginPassword }) => {
  errorMessage.value = ''

  const { success, message } = authStore.login({
    username: loginUsername,
    password: loginPassword,
  })

  if (success) {
    router.push(redirectPath.value || '/profile')
    return true
  }

  errorMessage.value = message ?? 'Unable to log in with those credentials.'
  return false
}

const handleSubmit = () => {
  void attemptLogin({
    username: username.value,
    password: password.value,
  })
}

const handleQuickLogin = (option) => {
  username.value = option.username
  password.value = option.password

  void attemptLogin(option)
}

onMounted(() => {
  if (isAuthenticated.value) {
    router.replace(redirectPath.value || '/profile')
  }
})
</script>

<template>
  <section class="mx-auto grid max-w-5xl gap-10 rounded-3xl bg-white/90 dark:bg-slate-900/90 p-8 shadow-primary ring-1 ring-indigo-100/60 lg:grid-cols-2 lg:p-12">
    <div class="space-y-6">
      <!-- Header -->
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Welcome back</p>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">Log in to StuX</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Enter your credentials to continue your journey through Insight, Exchange, and Community.</p>
      </div>
      <!-- Pillars -->
      <ul class="grid gap-4 text-sm text-slate-600">
        <li class="flex items-center gap-3 rounded-2xl bg-indigo-50/80 p-4"><span class="text-lg">💡</span><span>Access saved insights and ongoing exchanges.</span></li>
        <li class="flex items-center gap-3 rounded-2xl bg-emerald-50/80 p-4"><span class="text-lg">🤝</span><span>Track Stunix balances and pending mentorship requests.</span></li>
        <li class="flex items-center gap-3 rounded-2xl bg-amber-50/80 p-4"><span class="text-lg">💬</span><span>Continue community reflections with your cohort.</span></li>
      </ul>
      <!-- Need an account -->
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Need an account?
        <RouterLink :to="signupLink" class="font-semibold text-brand hover:underline">Create one here</RouterLink>.
      </p>
    </div>

    <!-- Login form -->
    <form
      class="grid gap-6 rounded-3xl border border-indigo-100/70 bg-white/80 dark:bg-slate-900/80 p-6 shadow-panel"
      @submit.prevent="handleSubmit"
    >
      <div class="grid gap-2">
        <label for="username" class="text-sm font-semibold text-slate-700 dark:text-slate-300">Username or email</label>
        <input
          id="username"
          type="text"
          name="username"
          autocomplete="username"
          class="input-control"
          placeholder="you@example.com"
          v-model="username"
        />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center justify-between">
          <label for="password" class="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
          <a href="#" class="text-xs font-semibold text-brand hover:underline">Forgot?</a>
        </div>
        <input
          id="password"
          type="password"
          name="password"
          autocomplete="current-password"
          class="input-control"
          placeholder="••••••••"
          v-model="password"
        />
      </div>
      <p v-if="errorMessage" class="text-sm font-semibold text-rose-500">
        {{ errorMessage }}
      </p>
      <label class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
        <input type="checkbox" name="remember" class="h-4 w-4 rounded border-indigo-200 text-brand focus:ring-indigo-200" />
        Remember this device
      </label>

      <button
        type="submit"
        class="btn btn-brand"
        :disabled="isSubmitDisabled"
      >
        Log in
      </button>

      <!-- Quick login options -->
      <button
        v-for="option in quickLoginOptions"
        :key="option.username"
        type="button"
        class="btn btn-outline w-full flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:justify-between"
        @click="handleQuickLogin(option)"
      >
        <span>{{ option.label }}</span>
        <span class="text-xs font-normal text-slate-500">{{ option.username }} / {{ option.password }}</span>
      </button>

      <p class="text-xs text-slate-500 dark:text-slate-400">By logging in you agree to the StuX community guidelines and honor-code.</p>
    </form>
  </section>
</template>

<style scoped>
</style>
