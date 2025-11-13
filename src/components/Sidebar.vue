<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <!-- Overlay for mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
      @click="$emit('toggleSidebar')"
    ></div>

    <aside
      :class="[
        'bg-white shadow-lg fixed md:static inset-y-0 left-0 w-64 h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out z-40',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Brand / Logo -->
      <div class="p-4 border-b">
        <h2 class="text-2xl font-semibold text-blue-600">MAHARINI</h2>
      </div>

      <!-- Menu Items -->
      <ul class="p-4 space-y-2">
        <li v-for="item in menu" :key="item.name">
          <RouterLink
            :to="item.path"
            class="flex items-center p-3 rounded-lg hover:bg-blue-100 text-gray-700 font-medium transition-colors"
            :class="{ 'bg-blue-50 text-blue-600 font-semibold': isActive(item.path) }"
          >
            <span class="material-icons-outlined mr-3 text-blue-600">{{ item.icon }}</span>
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

defineProps({ isOpen: Boolean })

const route = useRoute()

const menu = [
  { name: 'Overview', icon: 'dashboard', path: '/' },
  { name: 'Cashier', icon: 'point_of_sale', path: '/cashier' },
  { name: 'Product', icon: 'inventory', path: '/product' },
  { name: 'Patient', icon: 'people', path: '/patient' },
  { name: 'Transactions', icon: 'receipt_long', path: '/transactions' } // New item
]

// Check if route is active
function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-50 text-blue-600 font-semibold;
}

/* Optional: smooth scroll for sidebar content */
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
