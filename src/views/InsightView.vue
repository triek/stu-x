<script setup>
import PillarLayout from '@/components/PillarLayout.vue'
import { insightPosts } from '@/data/insightPosts'

const statusStyles = {
  active: {
    label: '�� Active',
    classes: 'border border-emerald-200/70 bg-emerald-50 text-emerald-600',
  },
  closing: {
    label: '🟠 Closing Soon',
    classes: 'border border-amber-200/70 bg-amber-50 text-amber-600',
  },
  closed: {
    label: '⚪ Closed',
    classes: 'border border-slate-200 bg-slate-100 text-slate-500',
  },
}

const config = {
  title: 'Insight',
  icon: '💡',
  accent: '#4338ca',
  overline: '',
  headline: 'Insight Hub',
  description:
    'Share or join research studies and request feedback',
  highlights: ['Earn Stunix rewards', 'Curated by trusted teams', 'Quick participation windows'],
  categories: ['Academic Studies', 'Product Feedback', 'Student Projects', 'Reflection Journals'],
  tags: ['#UX', '#Psychology', '#AI', '#Marketing'],
  sortFilters: ['Latest', 'Reward Points', 'Closing Soon'],
  actionLabel: 'Participate',
  createLabel: 'Create Insight Post',
  feed: insightPosts,
}

const insightTypeOptions = [
  { value: 'academic', label: '🧪 Academic' },
  { value: 'product', label: '💬 Product Feedback' },
  { value: 'project', label: '🎓 Student Project' },
]

const statusOptions = [
  { value: 'active', label: '🟢 Active' },
  { value: 'closing', label: '🟠 Closing Soon' },
  { value: 'closed', label: '⚪ Closed' },
]

const formDefaults = {
  reward: '20',
  author: '',
  type: insightTypeOptions[0].value,
  status: statusOptions[0].value,
  duration: '5',
  closingDate: '',
  tags: '',
  participants: '0',
  questions: '0',
}
</script>

<template>
  <PillarLayout :config="config" :form-defaults="formDefaults">
    <template #feed="{ items, accent }">
      <article
        v-for="item in items"
        :key="item.id"
        class="grid gap-5 rounded-3xl bg-white p-6 shadow-panel ring-1"
        :style="{ '--tw-ring-color': `${accent}22` }"
      >
        <header class="flex flex-wrap items-center justify-between gap-3">
          <span
            class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
            :style="{ backgroundColor: `${item.typeColor}14`, color: item.typeColor }"
          >
            <span>{{ item.type.icon }}</span>
            <span>{{ item.type.label }}</span>
          </span>

          <span
            v-if="item.status"
            class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            :class="statusStyles[item.status]?.classes ?? statusStyles.active.classes"
          >
            {{ statusStyles[item.status]?.label ?? statusStyles.active.label }}
          </span>
        </header>

        <div class="space-y-2">
          <p v-if="item.author" class="text-sm font-medium text-slate-500">
            Author: <span class="text-slate-700">{{ item.author }}</span>
          </p>
          <h3 class="text-xl font-semibold text-slate-900">{{ item.title }}</h3>
          <p class="text-slate-600">{{ item.subtitle }}</p>
        </div>

        <p v-if="item.details?.length" class="text-sm font-semibold text-slate-600">
          {{ item.details.join(' · ') }}
        </p>

        <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand"
          >
            #{{ tag }}
          </span>
        </div>

        <div v-if="item.stats?.length" class="grid gap-3 rounded-2xl bg-slate-50 px-5 py-4 sm:grid-cols-2">
          <div v-for="stat in item.stats" :key="stat.label" class="flex items-center gap-3">
            <span class="text-lg">{{ stat.icon }}</span>
            <span class="text-sm font-semibold text-slate-600">{{ stat.label }}</span>
          </div>
        </div>

        <footer class="flex flex-wrap items-center justify-between gap-3">
          <span></span>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
            >
              💬 Ask Question
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              :style="{
                backgroundColor: accent,
                boxShadow: `0 18px 32px ${accent}45`,
              }"
            >
              🚀 Participate
            </button>
          </div>
        </footer>
      </article>
    </template>

    <template #form-fields="{ formState }">
      <label class="grid gap-2 text-sm font-semibold text-slate-800">
        Title
        <input
          v-model="formState.title"
          type="text"
          placeholder="Give it a headline"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        />
      </label>

      <label class="grid gap-2 text-sm font-semibold text-slate-800">
        Author
        <input
          v-model="formState.author"
          type="text"
          placeholder="Add collaborator or institution"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        />
      </label>

      <label class="grid gap-2 text-sm font-semibold text-slate-800">
        Summary
        <textarea
          v-model="formState.description"
          rows="3"
          placeholder="Describe what you need or how you can help"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        ></textarea>
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Type tag
          <select
            v-model="formState.type"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option v-for="option in insightTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Status
          <select
            v-model="formState.status"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Duration (minutes)
          <input
            v-model="formState.duration"
            type="number"
            min="1"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Reward (Stunix)
          <input
            v-model="formState.reward"
            type="number"
            min="5"
            step="5"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Closes on
          <input
            v-model="formState.closingDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      </div>

      <label class="grid gap-2 text-sm font-semibold text-slate-800">
        Tags
        <input
          v-model="formState.tags"
          type="text"
          placeholder="#AI, #StudyHabits, #Education"
          class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
        />
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Estimated participants
          <input
            v-model="formState.participants"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label class="grid gap-2 text-sm font-semibold text-slate-800">
          Questions / prompts
          <input
            v-model="formState.questions"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-base outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      </div>
    </template>
  </PillarLayout>
</template>
