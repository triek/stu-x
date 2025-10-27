import { createRouter, createWebHistory } from 'vue-router'

import LandingView from '../views/LandingView.vue'
import HomeView from '../views/HomeView.vue'
import InsightView from '../views/InsightView.vue'
import InsightDetailView from '../views/InsightDetailView.vue'
import ExchangeView from '../views/ExchangeView.vue'
import CommunityView from '../views/CommunityView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import RegionSchoolSelectView from '../views/RegionSchoolSelectView.vue'
import RegionCitySelectView from '../views/RegionCitySelectView.vue'
import { getCitiesForRegion } from '@/constants/regionSchools'
import { normalizeRegionId } from '@/utils/region'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/regions/:regionId/cities',
      name: 'region-cities',
      component: RegionCitySelectView,
    },
    {
      path: '/regions/:regionId/schools',
      name: 'region-schools',
      component: RegionSchoolSelectView,
      beforeEnter: (to) => {
        const normalizedId = normalizeRegionId(to.params.regionId)
        if (!normalizedId) return true

        const cities = getCitiesForRegion(normalizedId)
        if (cities.length) {
          return { name: 'region-cities', params: { regionId: normalizedId } }
        }

        return true
      },
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
      path: '/insight/:id',
      name: 'insight-detail',
      component: InsightDetailView,
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
