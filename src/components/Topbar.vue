<template>
  <header class="bg-white shadow p-4 flex justify-between items-center">
    <h1 class="text-xl font-semibold">Admin Dashboard</h1>
    <div class="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Search..."
        class="border rounded px-3 py-1 focus:outline-none"
      />
      <div class="w-8 h-8 rounded-full bg-gray-300"></div>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  name: 'TopbarSection',
}
</script>
