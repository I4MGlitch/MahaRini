<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
      <span class="material-icons text-blue-600">dashboard</span>
      Overview
    </h1>

    <div class="grid md:grid-cols-4 gap-6">
      <!-- Total Products -->
      <div class="bg-white dark:bg-gray-900 shadow rounded-xl p-5 flex flex-col items-start">
        <p class="text-gray-500">Total Products</p>
        <h3 class="text-3xl font-bold text-blue-600">{{ totalProducts }}</h3>
        <p class="text-sm text-gray-400 mt-1">Active items in inventory</p>
      </div>

      <!-- Total Stock Value -->
      <div class="bg-white dark:bg-gray-900 shadow rounded-xl p-5 flex flex-col items-start">
        <p class="text-gray-500">Total Stock Value</p>
        <h3 class="text-3xl font-bold text-green-600">
          {{ totalValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }}
        </h3>
        <p class="text-sm text-gray-400 mt-1">Sum of (price × stock)</p>
      </div>

      <!-- Low Stock -->
      <div class="bg-white dark:bg-gray-900 shadow rounded-xl p-5 flex flex-col items-start">
        <p class="text-gray-500">Low Stock Items</p>
        <h3 class="text-3xl font-bold text-yellow-500">{{ lowStock }}</h3>
        <p class="text-sm text-gray-400 mt-1">Below 10 left</p>
      </div>

      <!-- Out of Stock -->
      <div class="bg-white dark:bg-gray-900 shadow rounded-xl p-5 flex flex-col items-start">
        <p class="text-gray-500">Out of Stock</p>
        <h3 class="text-3xl font-bold text-red-600">{{ outOfStock }}</h3>
        <p class="text-sm text-gray-400 mt-1">Needs restocking</p>
      </div>
    </div>

    <!-- Stock Distribution Bar -->
    <div class="mt-10 bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
      <h3 class="text-lg font-semibold mb-4">Stock Health</h3>
      <div class="w-full bg-gray-200 rounded-full h-4">
        <div
          class="h-4 rounded-full bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-700"
          :style="{ width: stockHealth + '%' }"
        ></div>
      </div>
      <p class="text-sm text-gray-500 mt-2">
        {{ stockHealth.toFixed(1) }}% of items are sufficiently stocked
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

interface Product {
  id?: string
  name: string
  price: number
  stock: number
}

const totalProducts = ref(0)
const totalValue = ref(0)
const lowStock = ref(0)
const outOfStock = ref(0)
const stockHealth = ref(0)

async function loadDashboardData() {
  const snapshot = await getDocs(collection(db, 'products'))
  const products = snapshot.docs.map(d => d.data() as Product)

  totalProducts.value = products.length
  totalValue.value = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  lowStock.value = products.filter(p => p.stock > 0 && p.stock <= 10).length
  outOfStock.value = products.filter(p => p.stock === 0).length

  const healthyItems = products.filter(p => p.stock > 10).length
  stockHealth.value = products.length
    ? (healthyItems / products.length) * 100
    : 0
}

onMounted(loadDashboardData)
</script>

<style scoped>
/* Add subtle hover effect */
.bg-white:hover,
.dark .bg-gray-900:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}
</style>
