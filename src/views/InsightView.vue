<script setup>
import PillarLayout from '@/components/PillarLayout.vue'

const config = {
  title: 'Insight',
  icon: '💡',
  accent: '#4338ca',
  description: 'Share or join surveys & feedback.',
  actionLabel: 'Join',
  feed: [
    {
      type: { icon: '🧪', label: 'Academic' },
      typeColor: '#4338ca',
      author: 'Mira Tran (Deakin University)',
      title: 'How Students Use AI in Study Workflows',
      subtitle: 'A 5-minute study exploring how AI tools affect student focus and productivity.',
      details: ['🕓 5 min', '💎 +10 Stunix', '📅 Open until 20 Oct 2025'],
      tags: ['AI', 'StudyHabits', 'Education'],
      stats: [
        { icon: '📊', label: '86 participants' },
        { icon: '💭', label: '12 questions' },
      ],
      status: 'active',
    },
    {
      type: { icon: '💬', label: 'Product Feedback' },
      typeColor: '#0f766e',
      author: 'Samira Patel (Campus Tech Lab)',
      title: 'Beta Test: FocusFlow Mobile Study Planner',
      subtitle: 'Share quick reactions on notification timing, UI clarity, and study streak rewards.',
      details: ['🕓 8 min', '💎 +15 Stunix', '📅 Open until 12 Sep 2025'],
      tags: ['ProductFeedback', 'MobileUX', 'Habits'],
      stats: [
        { icon: '📊', label: '54 participants' },
        { icon: '💭', label: '9 questions' },
      ],
      status: 'closing',
    },
    {
      type: { icon: '🎓', label: 'Student Project' },
      typeColor: '#db2777',
      author: 'Leo Gardner (RMIT)',
      title: 'Reflection: Mapping Peer Mentorship Journeys',
      subtitle: 'Looking for stories that unpack how mentorship programs change student confidence.',
      details: ['🕓 12 min', '💎 +20 Stunix', '📅 Closed 01 Aug 2025'],
      tags: ['Mentorship', 'QualResearch', 'StudentLife'],
      stats: [
        { icon: '📊', label: '102 participants' },
        { icon: '💭', label: '15 questions' },
      ],
      status: 'closed',
    },
  ],
  tags: ['#UX', '#Psychology', '#AI', '#Marketing'],
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
  <PillarLayout
    :config="config"
    :insight-mode="true"
    :insight-type-options="insightTypeOptions"
    :status-options="statusOptions"
    :form-defaults="formDefaults"
  />
</template> 
