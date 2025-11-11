<template>
  <aside
    :class="[
      'bg-white shadow-lg fixed md:static inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out z-40',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <div class="p-6 border-b">
      <h2 class="text-2xl font-semibold text-blue-600">MAHARINI</h2>
    </div>
    <ul class="p-4 space-y-2">
      <li v-for="item in menu" :key="item.name">
        <RouterLink
          :to="item.path"
          class="flex items-center p-3 rounded-lg hover:bg-blue-100 text-gray-700 font-medium transition-colors"
          :class="{ 'bg-blue-50 text-blue-600 font-semibold': $route.path === item.path }"
        >
          <span class="material-icons-outlined mr-3 text-blue-600">{{ item.icon }}</span>
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

defineProps({
  isOpen: Boolean
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = useRoute()
</script>

<script lang="ts">
export default {
  name: 'SidebarSection',
  data() {
    return {
      menu: [
        { name: 'Overview', icon: 'dashboard', path: '/' },
        { name: 'Cashier', icon: 'insights', path: '/cashier' },
        { name: 'Product', icon: 'settings', path: '/product' }
      ]
    }
  }
}
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-50 text-blue-600 font-semibold;
}
</style>
