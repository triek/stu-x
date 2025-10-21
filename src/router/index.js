import { createRouter, createWebHistory } from 'vue-router'

import LandingView from '../views/LandingView.vue'
import HomeView from '../views/HomeView.vue'
import InsightView from '../views/InsightView.vue'
import ExchangeView from '../views/ExchangeView.vue'
import CommunityView from '../views/CommunityView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/home',
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
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
