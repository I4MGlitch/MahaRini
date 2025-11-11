<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Settings</h2>
    <div class="bg-white shadow rounded-lg p-6 space-y-4">
      <div>
        <label class="block text-gray-600 mb-1">Username</label>
        <input type="text" class="border px-3 py-2 rounded w-full" />
      </div>
      <div>
        <label class="block text-gray-600 mb-1">Email</label>
        <input type="email" class="border px-3 py-2 rounded w-full" />
      </div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SettingsPage',
}
</script>
