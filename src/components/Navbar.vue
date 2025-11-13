<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav
    class="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 md:px-6 py-2.5 shadow-md"
  >
    <div class="flex items-center space-x-6">
      <!-- ☰ Hamburger -->
      <button @click="$emit('toggleSidebar')" class="md:hidden text-white focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-lg md:text-xl font-bold tracking-wide">MAHARINI</h1>
    </div>

    <!-- Desktop Controls -->
    <div class="flex space-x-4 items-center">
      <!-- 🔔 Notification -->
      <div class="relative">
        <button @click="toggleNotifications" class="relative focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7 text-white hover:text-yellow-300 transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.25 18.75a1.5 1.5 0 01-3 0m-6-3V10.5a6.75 6.75 0 1113.5 0v5.25l1.5 1.5H3.75l1.5-1.5z"
            />
          </svg>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
          >
            {{ unreadCount }}
          </span>
        </button>

        <!-- Notification Dropdown -->
        <div
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-50"
        >
          <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
            No notifications
          </div>
          <div v-else class="flex flex-col">
            <ul class="divide-y divide-gray-200 max-h-60 overflow-y-auto">
              <li v-for="(note, i) in notifications" :key="i" class="p-3 hover:bg-gray-50">
                <p class="font-semibold text-sm text-blue-700">{{ note.title }}</p>
                <p class="text-xs text-gray-600">{{ note.message }}</p>
              </li>
            </ul>
            <button
              @click="clearNotifications"
              class="text-sm text-red-500 hover:text-red-600 mt-2 mx-3 mb-2 text-center"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- 👤 User -->
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="Profile"
        class="rounded-full w-9 h-9 hover:scale-105 transition bg-white p-1"
      />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

interface Product {
  id?: string
  name: string
  price: number
  stock: number
}

interface Notification {
  title: string
  message: string
  productId: string
}

const showNotifications = ref(false)
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
const notifiedProducts = new Set<string>()

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  unreadCount.value = 0
}

function clearNotifications() {
  notifications.value = []
  unreadCount.value = 0
  notifiedProducts.clear()
}

const productsCollection = collection(db, 'products')
let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = onSnapshot(productsCollection, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      const product = { id: change.doc.id, ...change.doc.data() } as Product

      if (!product.id) return

      if (product.stock <= 100 && product.stock > 0 && !notifiedProducts.has(product.id + '-low')) {
        notifications.value.unshift({
          title: 'Stock Alert',
          message: `${product.name} stock is low (${product.stock} left).`,
          productId: product.id
        })
        unreadCount.value++
        notifiedProducts.add(product.id + '-low')
      }

      if (product.stock === 0 && !notifiedProducts.has(product.id + '-empty')) {
        notifications.value.unshift({
          title: 'Out of Stock',
          message: `${product.name} is now out of stock.`,
          productId: product.id
        })
        unreadCount.value++
        notifiedProducts.add(product.id + '-empty')
      }
    })
  })
})

onUnmounted(() => unsubscribe && unsubscribe())
</script>
