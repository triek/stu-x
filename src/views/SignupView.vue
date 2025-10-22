<script setup>
import { RouterLink } from 'vue-router'
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
      <p class="text-sm text-slate-500">Already have an account? <RouterLink to="/login" class="font-semibold text-brand hover:underline">Log in here</RouterLink>.</p>
    </div>

    <form class="grid gap-6 rounded-3xl border border-indigo-100/70 bg-white/85 p-6 shadow-panel">
      <div class="grid gap-2">
        <label for="full-name" class="text-sm font-semibold text-slate-700">Full name</label>
        <input
          id="full-name"
          type="text"
          name="full-name"
          autocomplete="name"
          class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Alex Morgan"
        />
      </div>
      <div class="grid gap-2">
        <label for="email" class="text-sm font-semibold text-slate-700">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          autocomplete="email"
          class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="you@example.com"
        />
      </div>
      <div class="grid gap-2">
        <label for="school" class="text-sm font-semibold text-slate-700">School or organization</label>
        <input
          id="school"
          type="text"
          name="school"
          class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="StuX International Academy"
        />
      </div>
      <div class="grid gap-2">
        <label for="region" class="text-sm font-semibold text-slate-700">Preferred region</label>
        <select
          id="region"
          name="region"
          class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Select a region</option>
          <option>North America</option>
          <option>Europe</option>
          <option>Asia-Pacific</option>
          <option>Latin America</option>
          <option>Africa &amp; Middle East</option>
        </select>
      </div>
      <div class="grid gap-2">
        <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          autocomplete="new-password"
          class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Create a strong password"
        />
      </div>
      <div class="grid gap-2">
        <label for="confirm-password" class="text-sm font-semibold text-slate-700">Confirm password</label>
        <input
          id="confirm-password"
          type="password"
          name="confirm-password"
          autocomplete="new-password"
          class="rounded-xl border border-indigo-100 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Repeat your password"
        />
      </div>
      <label class="flex items-start gap-3 text-xs text-slate-500">
        <input type="checkbox" name="terms" class="mt-1 h-4 w-4 rounded border-indigo-200 text-brand focus:ring-indigo-200" />
        I agree to the StuX community charter and allow StuX to contact me with onboarding resources.
      </label>
      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-indigo-500/40"
      >
        Sign up
      </button>
      <p class="text-xs text-slate-400">We protect your data and only use it to personalize your StuX experience.</p>
    </form>
  </section>
</template>

<style scoped>
</style>
