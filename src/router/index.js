import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/activity/:id',
      name: 'activity',
      component: () => import('../views/ActivityView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      children: [
        {
          path: '',
          name: 'default',
          redirect: 'admin/users'
        },
        {
          path: 'users',
          name: 'Users Admin',
          component: () => import('../components/Admin/UsersAdmin.vue')
        },
        {
          path: 'activities',
          name: 'Activities Admin',
          component: () => import('../components/Admin/ActivitiesAdmin.vue'),
        },
        {
          path: 'manage-activity/:id',
          name: 'Manage Activity',
          component: () => import('../components/Admin/ManageActivity.vue')
        },
      ]
    }
  ]
})

export default router
