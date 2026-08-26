import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard, titleGuard } from './guards'
import { resolveSlideDirection } from '@/shared/lib/tab-transition'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* 
    App Routes
    */

    {
      path: '/',
      name: 'TodayView',
      component: () => import('@/views/TodayView.vue'),
      meta: {
        layout: 'app',
        requiresAuth: true,
        title: 'Today',
        tab: 'today',
      },
    },
    {
      path: '/week',
      name: 'WeekView',
      component: () => import('@/views/WeekView.vue'),
      meta: {
        layout: 'app',
        requiresAuth: true,
        title: 'Week',
        tab: 'week',
      },
    },

    {
      path: '/year',
      name: 'YearView',
      component: () => import('@/views/YearView.vue'),
      meta: {
        layout: 'app',
        requiresAuth: true,
        title: 'Year',
        tab: 'year',
      },
    },

    {
      path: '/profile',
      name: 'ProfileView',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        layout: 'app',
        requiresAuth: true,
        title: 'Profile',
        tab: 'profile',
      },
    },

    /* 
    Auth routes
    */

    {
      path: '/login',
      name: 'LoginView',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        layout: 'auth',
        requiresAuth: false,
        title: 'Login',
        guestOnly: true,
      },
    },
    {
      path: '/signup',
      name: 'SignupView',
      component: () => import('@/views/SignupView.vue'),
      meta: {
        layout: 'auth',
        requiresAuth: false,
        title: 'SignUp',
        guestOnly: true,
      },
    },

    {
      path: '/settings',
      name: 'SettingsView',
      component: () => import('@/views/SettingsView.vue'),
      meta: {
        layout: 'app',
        requiresAuth: true,
        title: 'Settings',
      },
    },

    {
      path: '/habit/:id',
      name: 'HabitDetailView',
      component: () => import('@/views/HabitDetailView.vue'),
      props: true,
      meta: {
        layout: 'app',
        requiresAuth: true,
        title: 'Habit',
      },
    },

    /* 
    404
    */
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        layout: 'app',
        requiresAuth: false,
        title: 'Not found',
      },
    },
  ],
})

router.beforeEach(authGuard)
router.beforeEach(guestGuard)
router.afterEach(titleGuard)
router.afterEach((to, from) => {
  resolveSlideDirection(to.meta.tab, from.meta.tab)
})

export default router
