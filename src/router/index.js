import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import PillarView from '../views/PillarView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/insight',
      name: 'insight',
      component: PillarView,
      props: { pillarKey: 'insight' },
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: PillarView,
      props: { pillarKey: 'exchange' },
    },
    {
      path: '/community',
      name: 'community',
      component: PillarView,
      props: { pillarKey: 'community' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
