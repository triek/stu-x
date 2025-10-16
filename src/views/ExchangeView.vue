<script setup>
import PillarLayout from '@/components/PillarLayout.vue'

const config = {
  title: 'Exchange',
  icon: '🤝',
  accent: '#0f766e',
  description: 'Find mentors or trade study help.',
  actionLabel: 'Help',
  feed: [
    {
      title: 'Study swap: Quant methods ⇄ UX writing',
      description: 'Trade one-hour tutoring sessions to prep for finals together.',
      reward: 40,
      cta: 'Pair up',
    },
    {
      title: 'Career coffee chat with alumni mentor',
      description: 'Share your portfolio for feedback and get guidance on internships.',
      reward: 55,
      cta: 'Book session',
    },
    {
      title: 'Offer accountability sprint',
      description: 'Host a weekly accountability circle for capstone progress updates.',
      reward: 30,
      cta: 'Host sprint',
    },
  ],
  categories: ['Mentorship', 'Skill trade', 'Portfolio review'],
  sortFilters: ['Latest', 'Closing Soon', 'Reward Points'],
}

const formDefaults = {
  reward: '30',
}
</script>

<template>
  <PillarLayout :config="config" :form-defaults="formDefaults" />
</template>
