<script setup>
import PillarLayout from '@/components/PillarLayout.vue'

const config = {
  title: 'Community',
  icon: '💬',
  accent: '#db2777',
  headline: 'Community Hub',
  description:
    'Share stories, discuss, review, and reflect with peers',
  highlights: ['Discussion forum'],
  actionLabel: 'Comment',
  feed: [
    {
      title: 'Topic: What to buy for first-year students?',
      description: 'Recommend essentials and share tips for incoming students.',
      discussion: 22,
      cta: 'Discuss',
    },
    {
      title: 'Topic: Friends at university is not as expected',
      description: 'My experience when making friends in uni felt so different from high school.',
      discussion: 10,
      cta: 'Discuss',
    },
    {
      title: 'Poll: MacBook vs Windows laptop for programming',
      description: 'Share which one you use for your coding courses.',
      discussion: 12,
      cta: 'Vote',
    },
    {
      title: 'Topic: Lenovo IdeaPad Slim 5 or HP Pavilion for CS students?',
      description: 'Both are around the same price with 16GB RAM. Im not sure which is more reliable for running heavy tools like Docker or IntelliJ.',
      discussion: 10,
      cta: 'Discuss',
    },
    {
      title: 'Topic: Best free online tools for students',
      description: 'List websites or apps that help with writing, coding, referencing, or time tracking.',
      discussion: 11,
      cta: 'Discuss',
    },
    {
      title: 'Topic: Student discounts',
      description: 'Share the best student deals on food, transport, software, and entertainment that others might not know about.',
      discussion: 4,
      cta: 'Discuss',
    },
    {
      title: 'Topic: Managing money on a student budget',
      description: 'How do you plan weekly expenses, track spending, and save while studying?',
      discussion: 6,
      cta: 'Discuss',
    },
    {
      title: 'Topic: Group assignments and how to deal with unresponsive teammates',
      description: 'What is your experiences and strategies for keeping projects on track when not everyone contributes equally?',
      discussion: 18,
      cta: 'Discuss',
    },
    {
      title: 'Topic: Choosing the right laptop or tablet for study',
      description: 'Should I buy a MacBook Air M1 or an iPad Air for studying?',
      discussion: 3,
      cta: 'Discuss',
    },
  ],
  categories: ['Discussions', 'Critiques', 'Polls'],
  tags: ['#Community', '#Storytelling', '#PeerSupport'],
}

const formDefaults = {
  discussion: '0',
}
</script>

<template>
  <PillarLayout :config="config" :form-defaults="formDefaults" />
</template>
