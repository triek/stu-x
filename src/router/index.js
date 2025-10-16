import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import InsightView from '../views/InsightView.vue'
import ExchangeView from '../views/ExchangeView.vue'
import CommunityView from '../views/CommunityView.vue'
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
      component: InsightView,
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: ExchangeView,
    },
    {
      path: '/community',
      name: 'community',
      component: CommunityView,
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
