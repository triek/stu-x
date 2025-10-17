<script setup>
import PillarLayout from '@/components/PillarLayout.vue'

const config = {
  title: 'Community',
  icon: '💬',
  accent: '#db2777',
  overline: 'StuX Community Hub',
  headline: 'Discuss, review, and reflect with peers',
  description:
    'Share stories, trade critiques, and help shape campus culture together in curated, supportive spaces.',
  highlights: ['Peer-led discussions', 'Curated critique circles', 'Community-driven polls'],
  actionLabel: 'Comment',
  feed: [
    {
      title: 'Reflection thread: first-year wins',
      description: 'Celebrate small victories and share lessons for incoming students.',
      reward: 15,
      cta: 'Share story',
    },
    {
      title: 'Critique circle: storytelling decks',
      description: 'Drop in to review slides and exchange presentation tips.',
      reward: 25,
      cta: 'Join circle',
    },
    {
      title: 'Community poll: preferred co-working times',
      description: 'Help coordinate weekly focus blocks that fit most schedules.',
      reward: 10,
      cta: 'Vote now',
    },
  ],
  categories: ['Discussions', 'Critiques', 'Polls'],
  tags: ['#Community', '#Storytelling', '#PeerSupport'],
}

const formDefaults = {
  reward: '15',
}
</script>

<template>
  <PillarLayout :config="config" :form-defaults="formDefaults" />
</template>
