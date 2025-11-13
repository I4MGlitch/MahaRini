<template>
  <div class="bg-gray-50 min-h-screen p-6">
    <h1 class="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
      <span class="material-icons text-blue-600">group</span>
      Patient Management
    </h1>

    <!-- Register Patient -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 class="font-semibold mb-3 text-blue-700">Register New Patient</h2>
      <div class="flex flex-col md:flex-row gap-3">
        <input v-model="newPatient.code" placeholder="Patient Code" class="border p-2 rounded w-full md:w-1/6" />
        <input v-model="newPatient.name" placeholder="Name" class="border p-2 rounded w-full md:w-1/4" />
        <input v-model.number="newPatient.age" type="number" placeholder="Age" class="border p-2 rounded w-full md:w-1/6" />
        <select v-model="newPatient.gender" class="border p-2 rounded w-full md:w-1/6">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input v-model="newPatient.address" placeholder="Address" class="border p-2 rounded w-full md:w-1/3" />
        <button @click="registerPatient" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Register</button>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="mb-6 flex flex-col md:flex-row gap-3 items-center">
      <input v-model="searchPatient" placeholder="Search patient..." class="border p-2 rounded w-full md:w-1/3" />
      <select v-model="sortBy" class="border p-2 rounded w-full md:w-1/4">
        <option value="">Sort By</option>
        <option value="name">Name (A-Z)</option>
        <option value="ageAsc">Age (Ascending)</option>
        <option value="ageDesc">Age (Descending)</option>
        <option value="code">Code (A-Z)</option>
      </select>
    </div>

    <!-- Patient List -->
    <div class="bg-white rounded-lg shadow border overflow-x-auto">
      <table class="min-w-full border-collapse mx-auto">
        <thead class="bg-blue-100 text-left">
          <tr>
            <th class="p-2 font-semibold text-gray-700">Code</th>
            <th class="p-2 font-semibold text-gray-700">Name</th>
            <th class="p-2 font-semibold text-gray-700">Age</th>
            <th class="p-2 font-semibold text-gray-700">Gender</th>
            <th class="p-2 font-semibold text-gray-700">Address</th>
            <th class="p-2 font-semibold text-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="patient in paginatedPatients"
            :key="patient.id"
            class="hover:bg-gray-50 border-t cursor-pointer"
            @click="selectPatient(patient)"
            :class="{ 'bg-blue-50': selectedPatient && selectedPatient.id === patient.id }"
          >
            <td class="p-2">{{ patient.code }}</td>
            <td class="p-2">{{ patient.name }}</td>
            <td class="p-2">{{ patient.age }}</td>
            <td class="p-2">{{ patient.gender }}</td>
            <td class="p-2">{{ patient.address }}</td>
            <td class="p-2 text-center flex justify-center items-center gap-2">
              <button
                @click.stop="openEditModal(patient)"
                class="bg-blue-500 hover:bg-blue-700 text-white rounded-full p-2 transition flex items-center justify-center"
                title="Edit"
              >
                <span class="material-icons text-sm">edit</span>
              </button>
              <button
                @click.stop="deletePatient(patient.id)"
                class="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition flex items-center justify-center"
                title="Delete"
              >
                <span class="material-icons text-sm">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center mt-3 gap-2">
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

    <!-- Selected Patient -->
    <div v-if="selectedPatient" class="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded shadow">
      <h2 class="text-lg font-bold text-blue-700 mb-3">Selected Patient</h2>
      <p><strong>Code:</strong> {{ selectedPatient.code }}</p>
      <p><strong>Name:</strong> {{ selectedPatient.name }}</p>
      <p><strong>Age:</strong> {{ selectedPatient.age }}</p>
      <p><strong>Gender:</strong> {{ selectedPatient.gender }}</p>
      <p><strong>Address:</strong> {{ selectedPatient.address }}</p>
    </div>

    <!-- Patient Records -->
    <div v-if="selectedPatient" class="mt-6 bg-white rounded-lg shadow border p-4">
      <h3 class="text-lg font-semibold mb-3 text-blue-700">Patient Records</h3>
      <div v-if="patientRecords.length === 0" class="text-gray-500">
        No records found for this patient.
      </div>
      <table v-else class="min-w-full border-collapse mx-auto">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2 font-semibold text-gray-700">Date</th>
            <th class="p-2 font-semibold text-gray-700">Items</th>
            <th class="p-2 font-semibold text-gray-700">Total</th>
            <th class="p-2 font-semibold text-gray-700">Fees</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in patientRecords" :key="record.id" class="border-t">
            <td class="p-2">{{ new Date(record.date).toLocaleString() }}</td>
            <td class="p-2">
              <ul>
                <li v-for="item in record.items" :key="item.name">{{ item.name }} x {{ item.quantity }}</li>
              </ul>
            </td>
            <td class="p-2 text-green-700 font-semibold">Rp {{ record.total.toLocaleString('id-ID') }}</td>
            <td class="p-2">
              Admin: Rp {{ record.fees.administration.toLocaleString('id-ID') }}<br />
              Medical: Rp {{ record.fees.medical.toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
<div
  v-if="isEditModalOpen"
  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
>
  <div class="bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200">
    <!-- Header -->
    <div class="bg-blue-600 text-white rounded-t-xl px-6 py-3 flex items-center gap-2">
      <span class="material-icons">edit</span>
      <h2 class="text-lg font-semibold">Edit Patient Information</h2>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-4">
      <label class="block">
        <span class="font-medium text-gray-700">Patient Code</span>
        <input
          v-model="editPatient.code"
          class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="e.g., P001"
        />
        <p class="text-xs text-gray-500 mt-1">Unique patient identifier (e.g., P001)</p>
      </label>

      <label class="block">
        <span class="font-medium text-gray-700">Full Name</span>
        <input
          v-model="editPatient.name"
          class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter patient full name"
        />
      </label>

      <label class="block">
        <span class="font-medium text-gray-700">Age</span>
        <input
          v-model.number="editPatient.age"
          type="number"
          class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter age"
        />
      </label>

      <label class="block">
        <span class="font-medium text-gray-700">Gender</span>
        <select
          v-model="editPatient.gender"
          class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option disabled value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </label>

      <label class="block">
        <span class="font-medium text-gray-700">Address</span>
        <input
          v-model="editPatient.address"
          class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter address"
        />
      </label>
    </div>

    <!-- Footer Buttons -->
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
        Save Changes
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase'
import { collection, onSnapshot, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

interface Patient {
  id: string
  code: string
  name: string
  age: number
  gender: string
  address: string
}

interface TransactionRecord {
  id: string
  items: { name: string; quantity: number }[]
  total: number
  fees: { administration: number; medical: number }
  date: string
  patientId: string
}

const newPatient = ref<Partial<Patient>>({ code: '', name: '', age: 0, gender: '', address: '' })
const patients = ref<Patient[]>([])
const searchPatient = ref('')
const sortBy = ref('')
const selectedPatient = ref<Patient | null>(null)
const patientRecords = ref<TransactionRecord[]>([])

// Edit modal
const isEditModalOpen = ref(false)
const editPatient = ref<Partial<Patient>>({})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = computed(() => Math.ceil(sortedAndFilteredPatients.value.length / itemsPerPage))
const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedAndFilteredPatients.value.slice(start, start + itemsPerPage)
})
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function prevPage() { if (currentPage.value > 1) currentPage.value-- }

const patientsCollection = collection(db, 'patients')
const transactionsCollection = collection(db, 'transactions')

// Fetch patients in real-time
let unsubscribe: (() => void) | null = null
onMounted(() => {
  unsubscribe = onSnapshot(patientsCollection, snapshot => {
    patients.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Patient[]
  })
})
onUnmounted(() => unsubscribe && unsubscribe())

// Computed filtered + sorted patients
const sortedAndFilteredPatients = computed(() => {
  // eslint-disable-next-line prefer-const
  let filtered = patients.value.filter(p =>
    p.name.toLowerCase().includes(searchPatient.value.toLowerCase()) ||
    p.code.toLowerCase().includes(searchPatient.value.toLowerCase())
  )

  switch (sortBy.value) {
    case 'name': return filtered.sort((a, b) => a.name.localeCompare(b.name))
    case 'ageAsc': return filtered.sort((a, b) => a.age - b.age)
    case 'ageDesc': return filtered.sort((a, b) => b.age - a.age)
    case 'code': return filtered.sort((a, b) => a.code.localeCompare(b.code))
    default: return filtered
  }
})

// Register new patient
async function registerPatient() {
  if (!newPatient.value.code || !newPatient.value.name || !newPatient.value.age || !newPatient.value.gender) {
    alert('Please fill all fields including code')
    return
  }

  if (patients.value.find(p => p.code === newPatient.value.code)) {
    alert('Patient code already exists!')
    return
  }

  await addDoc(patientsCollection, newPatient.value)
  newPatient.value = { code: '', name: '', age: 0, gender: '', address: '' }
}

// Select patient and fetch their records
async function selectPatient(patient: Patient) {
  selectedPatient.value = patient
  const q = query(transactionsCollection, where('patientId', '==', patient.id))
  const snapshot = await getDocs(q)
  patientRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TransactionRecord[]
}

// Open edit modal
function openEditModal(patient: Patient) {
  editPatient.value = { ...patient }
  isEditModalOpen.value = true
}

// Save edit
async function saveEdit() {
  if (!editPatient.value.id) return
  const patientRef = doc(db, 'patients', editPatient.value.id)
  await updateDoc(patientRef, {
    code: editPatient.value.code,
    name: editPatient.value.name,
    age: editPatient.value.age,
    gender: editPatient.value.gender,
    address: editPatient.value.address
  })
  isEditModalOpen.value = false
}

// Delete patient
async function deletePatient(id: string) {
  if (!confirm('Are you sure you want to delete this patient?')) return
  await deleteDoc(doc(db, 'patients', id))
  if (selectedPatient.value?.id === id) selectedPatient.value = null
}
</script>
