<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Cashier</h1>

    <!-- Search -->
    <input
      v-model="search"
      placeholder="Search product..."
      class="border p-2 w-full rounded mb-4"
    />

    <!-- Products Table -->
    <table class="w-full border-collapse border mb-6">
      <thead class="bg-blue-50">
        <tr>
          <th class="p-3 border">Product</th>
          <th class="p-3 border">Price</th>
          <th class="p-3 border">Stock</th>
          <th class="p-3 border">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in filteredProducts"
          :key="product.id"
          class="hover:bg-gray-50"
        >
          <td class="p-3 border">{{ product.name }}</td>
          <td class="p-3 border">
            Rp {{ product.price.toLocaleString('id-ID') }}
          </td>
          <td class="p-3 border">{{ product.stock }}</td>
          <td class="p-3 border text-center">
            <button
              @click="addToCart(product)"
              class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              :disabled="product.stock === 0"
            >
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Cart Section -->
    <h2 class="text-xl font-semibold mb-2">Cart</h2>
    <div v-if="cart.length === 0" class="text-gray-500">No items yet</div>

    <ul v-else class="mb-4">
      <li
        v-for="item in cart"
        :key="item.name"
        class="flex justify-between items-center border-b py-2"
      >
        <span>{{ item.name }} (x{{ item.quantity }})</span>
        <span>Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
      </li>
    </ul>

    <div v-if="cart.length > 0" class="flex justify-between items-center mt-4">
      <p class="text-lg font-bold">Total: Rp {{ total.toLocaleString('id-ID') }}</p>
      <button
        @click="checkout"
        class="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
      >
        Checkout
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  doc,
  query,
  where,
  getDocs
} from 'firebase/firestore'

// Product type
interface Product {
  id?: string
  name: string
  price: number
  stock: number
}

// State
const search = ref('')
const products = ref<Product[]>([])
const cart = ref<{ name: string; price: number; quantity: number }[]>([])

const productsCollection = collection(db, 'products')
const transactionsCollection = collection(db, 'transactions')

// ✅ Realtime listener
let unsubscribe: (() => void) | null = null
onMounted(() => {
  unsubscribe = onSnapshot(productsCollection, (snapshot) => {
    products.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  })
})

// cleanup listener when leaving page
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Search filter
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

// Add product to cart
function addToCart(product: Product) {
  const existing = cart.value.find(i => i.name === product.name)
  if (existing) existing.quantity++
  else cart.value.push({ name: product.name, price: product.price, quantity: 1 })
}

// Calculate total
const total = computed(() =>
  cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
)

// Checkout function
async function checkout() {
  for (const item of cart.value) {
    const productQuery = query(productsCollection, where('name', '==', item.name))
    const snapshot = await getDocs(productQuery)
    const productDoc = snapshot.docs[0]
    if (productDoc) {
      const newStock = (productDoc.data().stock || 0) - item.quantity
      await updateDoc(doc(db, 'products', productDoc.id), { stock: newStock })
    }
  }

  await addDoc(transactionsCollection, {
    items: cart.value,
    total: total.value,
    date: new Date().toISOString(),
  })

  cart.value = []
}
</script>
