<template>
  <div class="bg-gray-50 min-h-screen px-4 sm:px-6">
    <div class="w-full max-w-6xl mx-auto py-6">
      <!-- Title -->
      <h1 class="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <span class="material-icons text-blue-600">point_of_sale</span>
        Cashier
      </h1>

        <!-- Patient Table for Selection -->
        <div class="mb-6 bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 class="font-semibold mb-3">Pilih Pasien</h2>

          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
            <input
              v-model="searchPatient"
              placeholder="Search patient by name or code..."
              class="border p-2 rounded w-full md:w-1/3"
            />
            <!-- Register Button -->
            <button
              @click="openRegisterModal"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold flex items-center gap-1 w-full md:w-auto"
            >
              <span class="material-icons text-sm">person_add</span> Daftar Pasien
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse text-sm md:text-base">
              <thead class="bg-blue-100 text-left">
                <tr>
                  <th
                    class="p-2 md:p-3 font-semibold text-gray-700 cursor-pointer select-none"
                    @click="sortBy('code')"
                  >
                    Kode <span v-if="sortKey === 'code'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th
                    class="p-2 md:p-3 font-semibold text-gray-700 cursor-pointer select-none"
                    @click="sortBy('name')"
                  >
                    Nama <span v-if="sortKey === 'name'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th
                    class="p-2 md:p-3 font-semibold text-gray-700 cursor-pointer select-none"
                    @click="sortBy('age')"
                  >
                    Umur <span v-if="sortKey === 'age'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th
                    class="p-2 md:p-3 font-semibold text-gray-700 cursor-pointer select-none"
                    @click="sortBy('gender')"
                  >
                    Jenis Kelamin <span v-if="sortKey === 'gender'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th
                    class="p-2 md:p-3 font-semibold text-gray-700 cursor-pointer select-none"
                    @click="sortBy('address')"
                  >
                    Alamat <span v-if="sortKey === 'address'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th class="p-2 md:p-3 font-semibold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="patient in paginatedPatients"
                  :key="patient.id"
                  class="hover:bg-gray-50 border-t cursor-pointer"
                  :class="{ 'bg-blue-50': selectedPatient && selectedPatient.id === patient.id }"
                >
                  <td class="p-2 md:p-3" @click="selectPatient(patient)">{{ patient.code }}</td>
                  <td class="p-2 md:p-3" @click="selectPatient(patient)">{{ patient.name }}</td>
                  <td class="p-2 md:p-3" @click="selectPatient(patient)">{{ patient.age }}</td>
                  <td class="p-2 md:p-3" @click="selectPatient(patient)">{{ patient.gender }}</td>
                  <td class="p-2 md:p-3" @click="selectPatient(patient)">{{ patient.address }}</td>
                  <td class="p-2 md:p-3 text-center">
                    <button
                      @click.stop="openEditModal(patient)"
                      class="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                <tr v-if="paginatedPatients.length === 0">
                  <td colspan="6" class="text-center p-4 text-gray-500">No patients found</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Patient Pagination -->
          <div class="flex justify-center items-center mt-3 gap-2">
            <button
              @click="prevPatientPage"
              :disabled="currentPatientPage === 1"
              class="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span class="text-gray-700 font-medium">
              Page {{ currentPatientPage }} of {{ totalPatientPages }}
            </span>
            <button
              @click="nextPatientPage"
              :disabled="currentPatientPage === totalPatientPages"
              class="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      <!-- Selected Patient Card -->
      <div v-if="selectedPatient" class="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded shadow-md">
        <h3 class="text-lg font-bold text-blue-700 mb-2">Pasien Terpilih</h3>
        <p><strong>Kode:</strong> {{ selectedPatient.code }}</p>
        <p><strong>Nama:</strong> {{ selectedPatient.name }}</p>
        <p><strong>Umur:</strong> {{ selectedPatient.age }}</p>
        <p><strong>Jenis Kelamin:</strong> {{ selectedPatient.gender }}</p>
        <p><strong>Alamat:</strong> {{ selectedPatient.address }}</p>
      </div>

      <!-- Search + Products Info -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          v-model="search"
          placeholder="🔍 Search product..."
          class="border border-gray-300 p-2 rounded-lg w-full md:w-1/3 focus:outline-blue-400"
        />
        <p class="text-gray-500 text-sm md:text-base text-center md:text-left">
          Showing {{ paginatedProducts.length }} of {{ filteredProducts.length }} products
        </p>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow border overflow-x-auto">
        <table class="min-w-full border-collapse mx-auto">
          <thead class="bg-blue-100 text-left">
            <tr>
              <th class="p-2 md:p-3 font-semibold text-gray-700">Obat</th>
              <th class="p-2 md:p-3 font-semibold text-gray-700">Harga</th>
              <th class="p-2 md:p-3 font-semibold text-gray-700">Stock</th>
              <th class="p-2 md:p-3 font-semibold text-gray-700 text-center">Jumlah</th>
              <th class="p-2 md:p-3 font-semibold text-gray-700 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="hover:bg-gray-50 transition border-t"
            >
              <td class="p-2 md:p-3 font-medium text-gray-800">{{ product.name }}</td>
              <td class="p-2 md:p-3 text-green-600 font-semibold">
                Rp {{ product.price.toLocaleString('id-ID') }}
              </td>
              <td class="p-2 md:p-3">
                <span
                  class="px-2 py-1 md:px-3 md:py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-green-100 text-green-700': product.stock > 10,
                    'bg-yellow-100 text-yellow-700': product.stock <= 10 && product.stock > 0,
                    'bg-red-100 text-red-700': product.stock === 0
                  }"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="p-2 md:p-3 text-center">
                <input
                  v-model.number="amounts[product.id]"
                  type="number"
                  min="1"
                  :max="product.stock"
                  class="w-12 md:w-16 border rounded p-1 text-center mx-auto"
                />
              </td>
              <td class="p-2 md:p-3 text-center">
                <button
                  @click="addToCart(product)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-1.5 rounded-lg transition w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="product.stock === 0"
                >
                  Tambah
                </button>
              </td>
            </tr>
            <tr v-if="paginatedProducts.length === 0">
              <td colspan="5" class="text-center p-4 md:p-6 text-gray-500">
                No products found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Product Pagination -->
      <div class="flex justify-center items-center mt-6 gap-2">
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
      <div class="mt-10 bg-white shadow rounded-lg p-6 border">
        <h2 class="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
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
            class="flex justify-between items-center py-3 gap-2 md:gap-4"
          >
            <div class="flex items-center gap-2">
              <span>{{ item.name }}</span>
              <button
                @click="decreaseQty(item)"
                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >-</button>
              <span>{{ item.quantity }}</span>
              <button
                @click="increaseQty(item)"
                class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >+</button>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-green-700 font-semibold">
                Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}
              </span>
              <button
                @click="removeItem(item)"
                class="text-red-600 hover:text-red-800 material-icons"
              >delete</button>
            </div>
          </li>
        </ul>

        <!-- Fees -->
        <div class="mt-4 border-t pt-4 flex flex-col gap-2">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="applyAdminFee"/>
            <span>Tambah Biaya Administrasi (Rp 5,000)</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="applyMedicalFee"/>
            <span>Tambah Biaya Medis (Rp 50,000)</span>
          </label>
        </div>

        <div v-if="cart.length > 0" class="flex justify-between items-center mt-6 pt-4 border-t flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
          <p class="text-lg font-bold text-gray-800">
            Total: Rp {{ totalWithFees.toLocaleString('id-ID') }}
          </p>
          <button
            @click="checkout"
            :disabled="cart.length === 0 || loading"
            class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>

      <!-- ✅ Success Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm text-center">
          <span class="material-icons text-green-500 text-5xl mb-3">check_circle</span>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Transaction Successful!</h3>
          <p class="text-gray-600 mb-6">Your transaction has been recorded successfully.</p>
          <button
            @click="closeModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            OK
          </button>
        </div>
      </div>

      <!-- ⏳ Loading Modal -->
      <div
        v-if="loading"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm text-center">
          <span class="material-icons animate-spin text-blue-500 text-5xl mb-3">autorenew</span>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Processing Transaction...</h3>
          <p class="text-gray-600">Please wait a moment.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Register Modal -->
  <div
    v-if="isRegisterModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200">
      <div class="bg-blue-600 text-white rounded-t-xl px-6 py-3 flex items-center gap-2">
        <span class="material-icons">person_add</span>
        <h2 class="text-lg font-semibold">Daftar Pasien Baru</h2>
      </div>
      <div class="p-6 space-y-4">
        <label class="block">
          <span class="font-medium text-gray-700">Kode Pasien</span>
          <input
            v-model="newPatient.code"
            disabled
            class="border p-2 rounded w-full mt-1 bg-gray-100 cursor-not-allowed"
          />
        </label>
        <label class="block">
          <span class="font-medium text-gray-700">Nama Lengkap</span>
          <input
            v-model="newPatient.name"
            placeholder="Enter full name"
            class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="font-medium text-gray-700">Umur</span>
          <input
            v-model.number="newPatient.age"
            type="number"
            placeholder="Enter age"
            class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="font-medium text-gray-700">Jenis Kelamin</span>
          <select
            v-model="newPatient.gender"
            class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Pria">Pria</option>
            <option value="Wanita">Wanita</option>
          </select>
        </label>
        <label class="block">
          <span class="font-medium text-gray-700">Alamat</span>
          <input
            v-model="newPatient.address"
            placeholder="Enter address"
            class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </label>
      </div>
      <div class="px-6 py-4 flex justify-end gap-3 border-t">
        <button
          @click="isRegisterModalOpen = false"
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
        >
          Batal
        </button>
        <button
          @click="registerPatient"
          class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          Daftar
        </button>
      </div>
    </div>
  </div>

  <!-- Edit Modal -->
  <div
    v-if="isEditModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200">
      <div class="bg-blue-600 text-white rounded-t-xl px-6 py-3 flex items-center gap-2">
        <span class="material-icons">edit</span>
        <h2 class="text-lg font-semibold">Edit Informasi Pasien</h2>
      </div>
      <div class="p-6 space-y-4">
        <label class="block">
          <span class="font-medium text-gray-700">Nama Lengkap</span>
          <input
            v-model="editPatient.name"
            class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="font-medium text-gray-700">Umur</span>
          <input
            v-model.number="editPatient.age"
            type="number"
            class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="font-medium text-gray-700">Jenis Kelamin</span>
          <select
            v-model="editPatient.gender"
            class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option disabled value="">Pilih Jenis Kelamin</option>
            <option value="Pria">Pria</option>
            <option value="Wanita">Wanita</option>
          </select>
        </label>
        <label class="block">
          <span class="font-medium text-gray-700">Alamat</span>
          <input
            v-model="editPatient.address"
            class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </label>
      </div>
      <div class="px-6 py-4 flex justify-end gap-3 border-t">
        <button
          @click="isEditModalOpen = false"
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          @click="saveEdit"
          class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase'
import { collection, onSnapshot, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore'

// Interfaces
interface Product { id: string; name: string; price: number; stock: number }
interface Patient { id: string; code: string; name: string; age: number; gender: string; address: string }

// Refs
const search = ref('')
const products = ref<Product[]>([])
const cart = ref<{ name: string; price: number; quantity: number }[]>([])
const amounts = ref<Record<string, number>>({})
const showModal = ref(false)
const loading = ref(false)

// Fees
const ADMIN_FEE = 5000
const MEDICAL_FEE = 50000
const applyAdminFee = ref(true)
const applyMedicalFee = ref(true)

// Patients
const searchPatient = ref('')
const patients = ref<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const isRegisterModalOpen = ref(false)
const isEditModalOpen = ref(false)
const newPatient = ref<Partial<Patient>>({ code: '', name: '', age: 0, gender: '', address: '' })
const editPatient = ref<Partial<Patient>>({})

// Sorting
const sortKey = ref<'code' | 'name' | 'age' | 'gender' | 'address'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

function sortBy(key: 'code' | 'name' | 'age' | 'gender' | 'address') {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// Collections
const productsCollection = collection(db, 'products')
const transactionsCollection = collection(db, 'transactions')
const patientsCollection = collection(db, 'patients')

// Realtime Listeners
let unsubscribeProducts: (() => void) | null = null
let unsubscribePatients: (() => void) | null = null

onMounted(() => {
  unsubscribeProducts = onSnapshot(productsCollection, snapshot => {
    products.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]
    products.value.sort((a, b) => a.name.localeCompare(b.name))
  })

  unsubscribePatients = onSnapshot(patientsCollection, snapshot => {
    patients.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Patient[]
    generatePatientCode()
  })
})

onUnmounted(() => {
  unsubscribeProducts?.()
  unsubscribePatients?.()
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

const currentPatientPage = ref(1)
const patientsPerPage = 5
const totalPatientPages = computed(() => Math.ceil(sortedPatients.value.length / patientsPerPage))
const paginatedPatients = computed(() => {
  const start = (currentPatientPage.value - 1) * patientsPerPage
  return sortedPatients.value.slice(start, start + patientsPerPage)
})
const nextPatientPage = () => { if (currentPatientPage.value < totalPatientPages.value) currentPatientPage.value++ }
const prevPatientPage = () => { if (currentPatientPage.value > 1) currentPatientPage.value-- }

// Computed Filters
const filteredProducts = computed(() =>
  products.value.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
)
const filteredPatients = computed(() =>
  patients.value.filter(p =>
    p.name.toLowerCase().includes(searchPatient.value.toLowerCase()) ||
    p.code.toLowerCase().includes(searchPatient.value.toLowerCase())
  )
)

// Sorting Patients
const sortedPatients = computed(() => {
  return [...filteredPatients.value].sort((a, b) => {
    const valA = (a[sortKey.value] || '').toString().toLowerCase()
    const valB = (b[sortKey.value] || '').toString().toLowerCase()
    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

// Cart Operations
const addToCart = (product: Product) => {
  const quantity = amounts.value[product.id!] || 1
  const existing = cart.value.find(i => i.name === product.name)
  if (existing) existing.quantity += quantity
  else cart.value.push({ name: product.name, price: product.price, quantity })
  amounts.value[product.id!] = quantity
}
const increaseQty = (item: { quantity: number }) => item.quantity++
const decreaseQty = (item: { quantity: number }) => { if (item.quantity > 1) item.quantity-- }
const removeItem = (item: { name: string }) => cart.value = cart.value.filter(i => i !== item)

// Total Calculations
const total = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0))
const totalWithFees = computed(() => {
  let sum = total.value
  if (applyAdminFee.value) sum += ADMIN_FEE
  if (applyMedicalFee.value) sum += MEDICAL_FEE
  return sum
})

// Checkout
const checkout = async () => {
  if (cart.value.length === 0 || loading.value) return
  loading.value = true

  try {
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
      total: totalWithFees.value,
      fees: {
        administration: applyAdminFee.value ? ADMIN_FEE : 0,
        medical: applyMedicalFee.value ? MEDICAL_FEE : 0
      },
      patientId: selectedPatient.value?.id || null,
      patientName: selectedPatient.value?.name || 'Guest',
      date: new Date().toISOString()
    })

    cart.value = []
    selectedPatient.value = null
    applyAdminFee.value = true
    applyMedicalFee.value = true
    amounts.value = {}
    showModal.value = true

  } finally {
    loading.value = false
  }
}

// Patient Modals & Firestore CRUD
function generatePatientCode() {
  const maxNum = patients.value
    .map(p => parseInt(p.code.replace('P', '')))
    .filter(n => !isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0)
  const next = maxNum + 1
  newPatient.value.code = `P${String(next).padStart(4, '0')}`
}

// Select Patient
const selectPatient = (patient: Patient) => {
  selectedPatient.value = patient
}

const openRegisterModal = () => {
  newPatient.value = { code: '', name: '', age: 0, gender: '', address: '' }
  generatePatientCode()
  isRegisterModalOpen.value = true
}

const registerPatient = async () => {
  if (!newPatient.value.name || !newPatient.value.age || !newPatient.value.gender) return
  await addDoc(patientsCollection, newPatient.value)
  newPatient.value = { code: '', name: '', age: 0, gender: '', address: '' }
  generatePatientCode()
  isRegisterModalOpen.value = false
}

const openEditModal = (patient: Patient) => {
  editPatient.value = { ...patient }
  isEditModalOpen.value = true
}

const saveEdit = async () => {
  if (!editPatient.value.id) return
  await updateDoc(doc(db, 'patients', editPatient.value.id), {
    name: editPatient.value.name,
    age: editPatient.value.age,
    gender: editPatient.value.gender,
    address: editPatient.value.address
  })
  isEditModalOpen.value = false
}

const closeModal = () => {
  isRegisterModalOpen.value = false
  isEditModalOpen.value = false
  showModal.value = false
}
</script>
