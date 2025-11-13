<template>
  <div class="bg-gray-50 min-h-screen p-6">
    <h1 class="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
      <span class="material-icons text-blue-600">group</span>
      Patient Management
    </h1>

    <!-- Register Patient -->
    <div class="mb-6 bg-white p-6 rounded-lg shadow">
      <h2 class="font-semibold mb-4 text-blue-700">Daftar Pasien</h2>

      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Kode Pasien</label>
          <input
            v-model="newPatient.code"
            disabled
            class="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">Automatically generated (e.g., P001)</p>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Nama Lengkap</label>
          <input
            v-model="newPatient.name"
            placeholder="Enter full name"
            class="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Umur</label>
          <input
            v-model.number="newPatient.age"
            type="number"
            placeholder="Enter age"
            class="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Jenis Kelamin</label>
          <select v-model="newPatient.gender" class="border p-2 rounded w-full">
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Pria">Pria</option>
            <option value="Wanita">Wanita</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-gray-700 font-medium mb-1">Alamat</label>
          <input
            v-model="newPatient.address"
            placeholder="Enter address"
            class="border p-2 rounded w-full"
          />
        </div>

        <div class="flex items-end">
          <button
            @click="registerPatient"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition font-semibold w-full"
          >
            Daftar Pasien
          </button>
        </div>
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
            <th class="p-2 font-semibold text-gray-700">Kode</th>
            <th class="p-2 font-semibold text-gray-700">Nama</th>
            <th class="p-2 font-semibold text-gray-700">Umur</th>
            <th class="p-2 font-semibold text-gray-700">Jenis Kelamin</th>
            <th class="p-2 font-semibold text-gray-700">Alamat</th>
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
      <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
        Prev
      </button>
      <span class="text-gray-700 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
        Next
      </button>
    </div>

    <!-- Selected Patient -->
    <div v-if="selectedPatient" class="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded shadow">
      <h2 class="text-lg font-bold text-blue-700 mb-3">Selected Patient</h2>
      <p><strong>Kode:</strong> {{ selectedPatient.code }}</p>
      <p><strong>Nama:</strong> {{ selectedPatient.name }}</p>
      <p><strong>Umur:</strong> {{ selectedPatient.age }}</p>
      <p><strong>Jenis Kelamin:</strong> {{ selectedPatient.gender }}</p>
      <p><strong>Alamat:</strong> {{ selectedPatient.address }}</p>
    </div>

    <!-- Patient Records -->
    <div v-if="selectedPatient" class="mt-6 bg-white rounded-lg shadow border p-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-3 gap-3">
        <h3 class="text-lg font-semibold text-blue-700">Patient Records</h3>

        <!-- Filter + Sort Controls -->
        <div class="flex flex-col md:flex-row gap-2">
          <select v-model="recordSort" class="border p-2 rounded">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <select v-model="recordYear" class="border p-2 rounded">
            <option value="">All Years</option>
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <div v-if="filteredPatientRecords.length === 0" class="text-gray-500">No records found for this patient.</div>
      <table v-else class="min-w-full border-collapse mx-auto">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2 font-semibold text-gray-700">Tanggal</th>
            <th class="p-2 font-semibold text-gray-700">Obat</th>
            <th class="p-2 font-semibold text-gray-700">Total</th>
            <th class="p-2 font-semibold text-gray-700">Biaya</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredPatientRecords" :key="record.id" class="border-t">
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
    <div v-if="isEditModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <div class="bg-blue-600 text-white rounded-t-xl px-6 py-3 flex items-center gap-2">
          <span class="material-icons">edit</span>
          <h2 class="text-lg font-semibold">Edit Informasi Pasien</h2>
        </div>
        <div class="p-6 space-y-4">
          <label class="block">
            <span class="font-medium text-gray-700">Nama Lengkap</span>
            <input v-model="editPatient.name" class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
          </label>
          <label class="block">
            <span class="font-medium text-gray-700">Umur</span>
            <input v-model.number="editPatient.age" type="number" class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
          </label>
          <label class="block">
            <span class="font-medium text-gray-700">Jenis Kelamin</span>
            <select v-model="editPatient.gender" class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option disabled value="">Pilih Jenis Kelamin</option>
              <option value="Pria">Pria</option>
              <option value="Wanita">Wanita</option>
            </select>
          </label>
          <label class="block">
            <span class="font-medium text-gray-700">Alamat</span>
            <input v-model="editPatient.address" class="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
          </label>
        </div>
        <div class="px-6 py-4 flex justify-end gap-3 border-t">
          <button @click="isEditModalOpen = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Batal</button>
          <button @click="saveEdit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition">Simpan Perubahan</button>
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
const isEditModalOpen = ref(false)
const editPatient = ref<Partial<Patient>>({})

// new refs for record filters
const recordSort = ref('newest')
const recordYear = ref('')

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

let unsubscribe: (() => void) | null = null
onMounted(() => {
  unsubscribe = onSnapshot(patientsCollection, snapshot => {
    patients.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Patient[]
    generatePatientCode()
  })
})
onUnmounted(() => unsubscribe && unsubscribe())

function generatePatientCode() {
  const maxNum = patients.value
    .map(p => parseInt(p.code.replace('P', '')))
    .filter(n => !isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0)
  const next = maxNum + 1
  newPatient.value.code = `P${String(next).padStart(3, '0')}`
}

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

async function registerPatient() {
  if (!newPatient.value.name || !newPatient.value.age || !newPatient.value.gender) {
    alert('Please fill all fields.')
    return
  }

  await addDoc(patientsCollection, newPatient.value)
  newPatient.value = { code: '', name: '', age: 0, gender: '', address: '' }
  generatePatientCode()
}

async function selectPatient(patient: Patient) {
  selectedPatient.value = patient
  const q = query(transactionsCollection, where('patientId', '==', patient.id))
  const snapshot = await getDocs(q)
  patientRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TransactionRecord[]
}

// computed for sorting + filtering records
const filteredPatientRecords = computed(() => {
  let records = [...patientRecords.value]
  if (recordYear.value) {
    records = records.filter(r => new Date(r.date).getFullYear().toString() === recordYear.value)
  }

  if (recordSort.value === 'newest') {
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } else {
    records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  return records
})

// available year options
const availableYears = computed(() => {
  const years = patientRecords.value.map(r => new Date(r.date).getFullYear())
  return [...new Set(years)].sort((a, b) => b - a)
})

function openEditModal(patient: Patient) {
  editPatient.value = { ...patient }
  isEditModalOpen.value = true
}

async function saveEdit() {
  if (!editPatient.value.id) return
  const patientRef = doc(db, 'patients', editPatient.value.id)
  await updateDoc(patientRef, {
    name: editPatient.value.name,
    age: editPatient.value.age,
    gender: editPatient.value.gender,
    address: editPatient.value.address
  })
  isEditModalOpen.value = false
}

async function deletePatient(id: string) {
  if (!confirm('Are you sure you want to delete this patient?')) return
  await deleteDoc(doc(db, 'patients', id))
  if (selectedPatient.value?.id === id) selectedPatient.value = null
  generatePatientCode()
}
</script>
