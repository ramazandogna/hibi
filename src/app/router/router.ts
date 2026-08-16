import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* 
    App Routes
    */

    {
      path: '/',
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
      path: '/today',
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
      path: '/profile',
      name: 'ProfileView',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        layout: 'auth',
        requiresAuth: true,
        title: 'Profil',
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
        title: '404 - Sayfa Bulunamadı',
      },
    },
  ],
})

export default router
