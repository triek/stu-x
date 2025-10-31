<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '../stores/auth'
import { REGION_DEFINITIONS } from '../constants/regions'
import { buildRedirectRoute, resolveRedirectPath } from '@/utils/navigation'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const formState = reactive({
  name: '',
  email: '',
  school: '',
  region: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
})

const isSubmitting = ref(false)
const errorMessage = ref('')

const countryRegions = computed(() =>
  REGION_DEFINITIONS.filter((region) => region.statusLabel === 'National')
)

const redirectPath = computed(() =>
  resolveRedirectPath(route.query.redirect),
)

const loginLink = computed(() =>
  buildRedirectRoute('login', redirectPath.value),
)

const hasPasswordMismatch = computed(
  () =>
    Boolean(formState.password) &&
    Boolean(formState.confirmPassword) &&
    formState.password !== formState.confirmPassword
)

const isSubmitDisabled = computed(
  () =>
    isSubmitting.value ||
    !formState.name.trim() ||
    !formState.email.trim() ||
    !formState.password.trim() ||
    !formState.confirmPassword.trim() ||
    !formState.region ||
    hasPasswordMismatch.value ||
    !formState.termsAccepted
)

const resetError = () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

watch(formState, resetError, { deep: true })

const handleSubmit = () => {
  errorMessage.value = ''

  if (hasPasswordMismatch.value) {
    errorMessage.value = 'Passwords do not match. Please try again.'
    return
  }

  isSubmitting.value = true

  const selectedRegionDefinition = countryRegions.value.find(
    (region) => region.id === formState.region
  )

  const { success, message } = authStore.signup({
    name: formState.name,
    email: formState.email,
    school: formState.school,
    region: selectedRegionDefinition?.label ?? formState.region,
    password: formState.password,
  })

  isSubmitting.value = false

  if (success) {
    router.push(redirectPath.value || '/profile')
    return
  }

  errorMessage.value = message ?? 'We could not create your account. Please try again.'
}

onMounted(() => {
  if (isAuthenticated.value) {
    router.replace(redirectPath.value || '/profile')
  }
})
</script>

<template>
  <section class="mx-auto grid max-w-6xl gap-12 rounded-3xl bg-white/90 p-8 shadow-primary ring-1 ring-indigo-100/60 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
    <div class="space-y-6">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Join StuX</p>
        <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">Create your account</h1>
        <p class="text-sm text-slate-600">
          Tell us a little about yourself to start earning and spending Stunix. We will match you with the right Insight, Exchange, and Community circles.
        </p>
      </div>
      <div class="rounded-3xl bg-gradient-to-br from-brand/10 via-white to-indigo-50 p-6">
        <h2 class="text-lg font-semibold text-slate-900">What you get</h2>
        <ul class="mt-4 grid gap-3 text-sm text-slate-600">
          <li class="flex items-start gap-3"><span class="mt-1 text-brand">◆</span><span>Personalized insight prompts and survey opportunities.</span></li>
          <li class="flex items-start gap-3"><span class="mt-1 text-brand">◆</span><span>Earn verified Stunix for your time and expertise.</span></li>
          <li class="flex items-start gap-3"><span class="mt-1 text-brand">◆</span><span>Exclusive access to StuX community cohorts and events.</span></li>
        </ul>
      </div>
      <p class="text-sm text-slate-500">Already have an account? <RouterLink :to="loginLink" class="font-semibold text-brand hover:underline">Log in here</RouterLink>.</p>
    </div>

    <form
      class="grid gap-6 rounded-3xl border border-indigo-100/70 bg-white/85 p-6 shadow-panel"
      @submit.prevent="handleSubmit"
    >
      <div class="grid gap-2">
        <label for="username" class="text-sm font-semibold text-slate-700">
          Username
          <span class="text-rose-500" aria-hidden="true">*</span>
          <span class="sr-only">required</span>
        </label>
        <input
          id="username"
          type="text"
          name="username"
          autocomplete="username"
          class="input-control"
          placeholder="alexmorgan"
          v-model="formState.name"
          required
          aria-required="true"
        />
      </div>
      <div class="grid gap-2">
        <label for="email" class="text-sm font-semibold text-slate-700">
          Email
          <span class="text-rose-500" aria-hidden="true">*</span>
          <span class="sr-only">required</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autocomplete="email"
          class="input-control"
          placeholder="you@example.com"
          v-model="formState.email"
          required
          aria-required="true"
        />
      </div>
      <div class="grid gap-2">
        <label for="school" class="text-sm font-semibold text-slate-700">School or organization</label>
        <input
          id="school"
          type="text"
          name="school"
          class="input-control"
          placeholder="StuX International Academy"
          v-model="formState.school"
        />
      </div>
      <div class="grid gap-2">
        <label for="region" class="text-sm font-semibold text-slate-700">
          Country or region
          <span class="text-rose-500" aria-hidden="true">*</span>
          <span class="sr-only">required</span>
        </label>
        <select
          id="region"
          name="region"
          class="input-control"
          v-model="formState.region"
          required
          aria-required="true"
        >
          <option value="">Select your country or region</option>
          <option
            v-for="region in countryRegions"
            :key="region.id"
            :value="region.id"
          >
            {{ region.label }}
          </option>
        </select>
      </div>
      <div class="grid gap-2">
        <label for="password" class="text-sm font-semibold text-slate-700">
          Password
          <span class="text-rose-500" aria-hidden="true">*</span>
          <span class="sr-only">required</span>
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autocomplete="new-password"
          class="input-control"
          placeholder="Create a strong password"
          v-model="formState.password"
          required
          aria-required="true"
        />
      </div>
      <div class="grid gap-2">
        <label for="confirm-password" class="text-sm font-semibold text-slate-700">
          Confirm password
          <span class="text-rose-500" aria-hidden="true">*</span>
          <span class="sr-only">required</span>
        </label>
        <input
          id="confirm-password"
          type="password"
          name="confirm-password"
          autocomplete="new-password"
          class="input-control"
          placeholder="Repeat your password"
          v-model="formState.confirmPassword"
          required
          aria-required="true"
        />
        <p v-if="hasPasswordMismatch" class="text-xs font-semibold text-rose-500">
          Passwords do not match.
        </p>
      </div>
      <label class="flex items-start gap-3 text-xs text-slate-500">
        <input
          type="checkbox"
          name="terms"
          class="mt-1 h-4 w-4 rounded border-indigo-200 text-brand focus:ring-indigo-200"
          v-model="formState.termsAccepted"
          required
          aria-required="true"
        />
        <span>
          I agree to the StuX community charter and allow StuX to contact me with onboarding resources
          <span class="text-rose-500" aria-hidden="true">*</span>
          <span class="sr-only">(required)</span>
        </span>
      </label>
      <p v-if="errorMessage" class="text-sm font-semibold text-rose-500">
        {{ errorMessage }}
      </p>
      <button
        type="submit"
        class="btn btn-brand"
        :disabled="isSubmitDisabled"
      >
        <span v-if="isSubmitting" class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 animate-ping rounded-full bg-white"></span>
          Creating account...
        </span>
        <span v-else>Sign up</span>
      </button>
      <p class="text-xs text-slate-400">We protect your data and only use it to personalize your StuX experience.</p>
    </form>
  </section>
</template>

<style scoped>
</style>
