import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Analytics from '@/views/Analytics.vue'
import Setting from '@/views/Setting.vue'
import ProductPage from '@/views/ProductView.vue'
import CashierPage from '@/views/CashierView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/analytics', name: 'Analytics', component: Analytics },
  { path: '/settings', name: 'Setting', component: Setting },
  { path: '/product', component: ProductPage },
  { path: '/cashier', component: CashierPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
