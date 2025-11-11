<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar :isOpen="sidebarOpen" />

    <div class="flex-1 flex flex-col">
      <Navbar @toggleSidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

const sidebarOpen = ref(false)

</script>
