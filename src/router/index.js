import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      children: [{
        path: 'users',
        name: 'Users Admin',
        component: () => import('../components/Admin/UsersAdmin.vue')
      },
      {
        path: 'activities',
        name: 'Activities Admin',
        component: () => import('../components/Admin/ActivitiesAdmin.vue')
      }
      ]
    }
  ]
})

export default router
