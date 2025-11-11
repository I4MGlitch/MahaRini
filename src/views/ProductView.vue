<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
      <span class="material-icons text-blue-600">backpack</span>
      Product Management
    </h1>

    <!-- Search & Filter -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search product..."
        class="border rounded-lg p-2 w-full md:w-1/3 focus:outline-blue-400"
      />
      <select
        v-model="selectedFilter"
        class="border rounded-lg p-2 w-full md:w-1/4 focus:outline-blue-400"
      >
        <option value="az">Sort: A - Z</option>
        <option value="za">Sort: Z - A</option>
        <option value="priceLow">Price: Low - High</option>
        <option value="priceHigh">Price: High - Low</option>
        <option value="stockLow">Stock: Low - High</option>
        <option value="stockHigh">Stock: High - Low</option>
      </select>
    </div>

    <!-- Add Form -->
    <form
      @submit.prevent="addProduct"
      class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white shadow p-6 rounded-lg border"
    >
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          v-model="newProduct.name"
          placeholder="Enter product name"
          class="border rounded-lg p-2 focus:outline-blue-400"
          required
        />
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
        <input
          v-model.number="newProduct.price"
          placeholder="Enter price"
          type="number"
          class="border rounded-lg p-2 focus:outline-blue-400"
          required
        />
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">Stock</label>
        <input
          v-model.number="newProduct.stock"
          placeholder="Enter stock"
          type="number"
          class="border rounded-lg p-2 focus:outline-blue-400"
          required
        />
      </div>

      <div class="flex items-end">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
        >
          Add Product
        </button>
      </div>
    </form>

    <!-- Product Table -->
    <div class="bg-white border rounded-lg shadow overflow-hidden">
      <table class="w-full border-collapse">
        <thead class="bg-blue-100 text-left">
          <tr>
            <th class="p-3 font-semibold text-gray-700">Product</th>
            <th class="p-3 font-semibold text-gray-700">Price</th>
            <th class="p-3 font-semibold text-gray-700">Stock</th>
            <th class="p-3 font-semibold text-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in paginatedProducts"
            :key="product.id"
            class="hover:bg-gray-50 border-t transition"
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
            <td class="p-3 text-center space-x-3">
              <button
                @click="openEditModal(product)"
                class="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                title="Edit"
              >
                <span class="material-icons text-sm">edit</span>
              </button>

              <button
                @click="confirmDelete(product)"
                class="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                title="Delete"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4 text-sm">
      <div class="text-gray-600">
        Showing {{ startItem }} - {{ endItem }} of {{ filteredProducts.length }}
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span class="text-gray-700">Page {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4 text-blue-700">Edit Product</h2>

        <form @submit.prevent="updateProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              v-model="editProduct.name"
              type="text"
              class="border rounded-lg p-2 w-full focus:outline-blue-400"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
            <input
              v-model.number="editProduct.price"
              type="number"
              class="border rounded-lg p-2 w-full focus:outline-blue-400"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              v-model.number="editProduct.stock"
              type="number"
              class="border rounded-lg p-2 w-full focus:outline-blue-400"
              required
            />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <span class="material-icons text-red-500 text-5xl mb-3">warning</span>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
        <p class="text-gray-600 mb-6">
          Do you really want to delete <strong>{{ productToDelete?.name }}</strong>?
          This action cannot be undone.
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="isDeleteModalOpen = false"
            class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            @click="deleteProduct"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { db } from '@/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'

interface Product {
  id: string // make id required
  name: string
  price: number
  stock: number
}

const products = ref<Product[]>([])
const newProduct = ref<Product>({ id: '', name: '', price: 0, stock: 0 })
const editProduct = ref<Product>({ id: '', name: '', price: 0, stock: 0 })
const isEditModalOpen = ref(false)
const searchQuery = ref('')
const selectedFilter = ref('az')

// Delete modal
const isDeleteModalOpen = ref(false)
const productToDelete = ref<Product | null>(null)

// Pagination states
const currentPage = ref(1)
const itemsPerPage = 5

const productsCollection = collection(db, 'products')

// 🔥 Real-time listener
let unsubscribe: (() => void) | null = null
onMounted(() => {
  unsubscribe = onSnapshot(productsCollection, (snapshot) => {
    products.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// 🔍 Filtered & Sorted Products
const filteredProducts = computed(() => {
  // eslint-disable-next-line prefer-const
  let result = products.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  switch (selectedFilter.value) {
    case 'za':
      result.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'priceLow':
      result.sort((a, b) => a.price - b.price)
      break
    case 'priceHigh':
      result.sort((a, b) => b.price - a.price)
      break
    case 'stockLow':
      result.sort((a, b) => a.stock - b.stock)
      break
    case 'stockHigh':
      result.sort((a, b) => b.stock - a.stock)
      break
    default:
      result.sort((a, b) => a.name.localeCompare(b.name))
  }
  return result
})

// 🔢 Pagination Logic
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
)
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() =>
  Math.min(startItem.value + itemsPerPage - 1, filteredProducts.value.length)
)
const paginatedProducts = computed(() =>
  filteredProducts.value.slice(startItem.value - 1, endItem.value)
)

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// ➕ Add Product
async function addProduct() {
  if (!newProduct.value.name || newProduct.value.price <= 0) return
  await addDoc(productsCollection, { name: newProduct.value.name, price: newProduct.value.price, stock: newProduct.value.stock })
  newProduct.value = { id: '', name: '', price: 0, stock: 0 }
}

// ✏️ Edit
function openEditModal(product: Product) {
  editProduct.value = { ...product }
  isEditModalOpen.value = true
}

// ✅ Update
async function updateProduct() {
  if (!editProduct.value.id) return
  const docRef = doc(db, 'products', editProduct.value.id)
  await updateDoc(docRef, {
    name: editProduct.value.name,
    price: editProduct.value.price,
    stock: editProduct.value.stock
  })
  isEditModalOpen.value = false
}

// ❌ Confirm Delete
function confirmDelete(product: Product) {
  productToDelete.value = product
  isDeleteModalOpen.value = true
}

// ❌ Delete Product
async function deleteProduct() {
  if (!productToDelete.value?.id) return
  const docRef = doc(db, 'products', productToDelete.value.id)
  await deleteDoc(docRef)
  isDeleteModalOpen.value = false
  productToDelete.value = null
}
</script>
