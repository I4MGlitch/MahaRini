<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :isOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />
    <div class="flex-1 flex flex-col">
      <Navbar @toggleSidebar="toggleSidebar" />
      <main class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const isSidebarOpen = ref(false)
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value)
</script>
