<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen">
    <!-- Title -->
    <h1 class="text-2xl md:text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2 justify-center md:justify-start">
      <span class="material-icons text-blue-600">point_of_sale</span>
      Cashier
    </h1>

    <!-- Search + Info -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
      <input
        v-model="search"
        placeholder="🔍 Search product..."
        class="border border-gray-300 p-2 rounded-lg w-full md:w-1/3 focus:outline-blue-400"
      />
      <p class="text-gray-500 text-sm md:text-base text-center md:text-left">
        Showing {{ paginatedProducts.length }} of {{ filteredProducts.length }} products
      </p>
    </div>

    <!-- Products Table (Desktop) -->
    <div class="hidden md:block bg-white rounded-lg shadow border overflow-x-auto">
      <table class="w-full border-collapse">
        <thead class="bg-blue-100 text-left">
          <tr>
            <th class="p-3 font-semibold text-gray-700">Product</th>
            <th class="p-3 font-semibold text-gray-700">Price</th>
            <th class="p-3 font-semibold text-gray-700">Stock</th>
            <th class="p-3 font-semibold text-gray-700 text-center">Amount</th>
            <th class="p-3 font-semibold text-gray-700 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in paginatedProducts"
            :key="product.id"
            class="hover:bg-gray-50 transition border-t"
          >
            <td class="p-3 font-medium text-gray-800">{{ product.name }}</td>
            <td class="p-3 text-green-600 font-semibold">
              Rp {{ product.price.toLocaleString('id-ID') }}
            </td>
            <td class="p-3">
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-green-100 text-green-700': product.stock > 10,
                  'bg-yellow-100 text-yellow-700': product.stock <= 10 && product.stock > 0,
                  'bg-red-100 text-red-700': product.stock === 0
                }"
              >
                {{ product.stock }}
              </span>
            </td>
            <td class="p-3 text-center">
              <input
                v-model.number="amounts[product.id]"
                type="number"
                min="1"
                :max="product.stock"
                class="w-16 border rounded p-1 text-center"
              />
            </td>
            <td class="p-3 text-center">
              <button
                @click="addToCart(product)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="product.stock === 0"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Products Cards (Mobile) -->
    <div class="md:hidden flex flex-col gap-4">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center"
      >
        <h3 class="font-semibold text-gray-800 text-lg mb-2">{{ product.name }}</h3>
        <p class="text-green-600 font-semibold mb-1">Rp {{ product.price.toLocaleString('id-ID') }}</p>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium mb-2"
          :class="{
            'bg-green-100 text-green-700': product.stock > 10,
            'bg-yellow-100 text-yellow-700': product.stock <= 10 && product.stock > 0,
            'bg-red-100 text-red-700': product.stock === 0
          }"
        >
          Stock: {{ product.stock }}
        </span>
        <div class="flex items-center gap-2">
          <input
            v-model.number="amounts[product.id]"
            type="number"
            min="1"
            :max="product.stock"
            class="w-16 border rounded p-1 text-center"
          />
          <button
            @click="addToCart(product)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="product.stock === 0"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col md:flex-row justify-center items-center mt-6 gap-2 md:gap-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>
      <span class="text-gray-700 font-medium">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- Cart Section -->
    <div class="mt-8 md:mt-10 bg-white shadow rounded-lg p-4 md:p-6 border">
      <h2 class="text-xl md:text-2xl font-semibold mb-4 text-blue-700 flex items-center gap-2 justify-center md:justify-start">
        <span class="material-icons text-blue-600">shopping_cart</span>
        Cart
      </h2>

      <div v-if="cart.length === 0" class="text-gray-500 text-center py-6">
        No items yet
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="item in cart"
          :key="item.name"
          class="flex justify-between items-center py-2 md:py-3"
        >
          <span class="truncate">{{ item.name }} (x{{ item.quantity }})</span>
          <span class="text-green-700 font-semibold">
            Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}
          </span>
        </li>
      </ul>

      <div
        v-if="cart.length > 0"
        class="flex flex-col md:flex-row justify-between items-center mt-4 md:mt-6 pt-4 border-t gap-3 md:gap-0"
      >
        <p class="text-lg md:text-xl font-bold text-gray-800">
          Total: Rp {{ total.toLocaleString('id-ID') }}
        </p>
        <button
          @click="checkout"
          class="bg-green-600 text-white px-4 md:px-5 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
        >
          Checkout
        </button>
      </div>
    </div>

    <!-- ✅ Success Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-sm w-full text-center">
        <span class="material-icons text-green-500 text-5xl mb-3">check_circle</span>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Transaction Successful!</h3>
        <p class="text-gray-600 mb-6">Your transaction has been recorded successfully.</p>
        <button
          @click="closeModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
        >
          OK
        </button>
      </div>
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

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

const search = ref('')
const products = ref<Product[]>([])
const cart = ref<{ name: string; price: number; quantity: number }[]>([])
const amounts = ref<Record<string, number>>({})
const showModal = ref(false)

const productsCollection = collection(db, 'products')
const transactionsCollection = collection(db, 'transactions')

// Realtime listener
let unsubscribe: (() => void) | null = null
onMounted(() => {
  unsubscribe = onSnapshot(productsCollection, (snapshot) => {
    products.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  })
})
onUnmounted(() => unsubscribe && unsubscribe())

// Search
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
)
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function prevPage() { if (currentPage.value > 1) currentPage.value-- }

// Add to cart
function addToCart(product: Product) {
  const quantity = amounts.value[product.id] || 1
  const existing = cart.value.find(i => i.name === product.name)
  if (existing) existing.quantity += quantity
  else cart.value.push({ name: product.name, price: product.price, quantity })
  amounts.value[product.id] = 1
}

// Total
const total = computed(() =>
  cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
)

// Checkout
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
    date: new Date().toISOString()
  })
  cart.value = []
  showModal.value = true
}

// Close Modal
function closeModal() { showModal.value = false }
</script>
