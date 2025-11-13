<template>
  <div class="bg-gray-50 min-h-screen p-6">
    <h1 class="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
      <span class="material-icons text-blue-600">receipt_long</span>
      Transactions
    </h1>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-3 mb-6 items-center">
      <input
        v-model="search"
        placeholder="Search by patient or product..."
        class="border p-2 rounded w-full md:w-1/3"
      />
      <select v-model="sortBy" class="border p-2 rounded w-full md:w-1/4">
        <option value="dateDesc">Newest First</option>
        <option value="dateAsc">Oldest First</option>
        <option value="totalDesc">Total (High-Low)</option>
        <option value="totalAsc">Total (Low-High)</option>
      </select>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-lg shadow border overflow-x-auto">
      <table class="min-w-full border-collapse mx-auto">
        <thead class="bg-blue-100 text-left">
          <tr>
            <th class="p-2 font-semibold text-gray-700">Tanggal</th>
            <th class="p-2 font-semibold text-gray-700">Pasien</th>
            <th class="p-2 font-semibold text-gray-700">Obat</th>
            <th class="p-2 font-semibold text-gray-700">Total</th>
            <th class="p-2 font-semibold text-gray-700">Biaya</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in paginatedTransactions" :key="tx.id" class="border-t">
            <td class="p-2">{{ new Date(tx.date).toLocaleString() }}</td>
            <td class="p-2">{{ tx.patientName || 'Walk-in' }}</td>
            <td class="p-2">
              <ul>
                <li v-for="item in tx.items" :key="item.name">
                  {{ item.name }} x {{ item.quantity }}
                </li>
              </ul>
            </td>
            <td class="p-2 text-green-700 font-semibold">
              Rp {{ tx.total.toLocaleString('id-ID') }}
            </td>
            <td class="p-2">
              Admin: Rp {{ tx.fees.administration.toLocaleString('id-ID') }}<br />
              Medical: Rp {{ tx.fees.medical.toLocaleString('id-ID') }}
            </td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="5" class="text-center p-4 text-gray-500">
              No transactions found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
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

    <!-- Summary by Month and Year -->
    <div class="mt-10 bg-white border rounded-lg shadow p-4">
      <h2 class="text-xl font-bold mb-4 text-blue-700">
        Hasil Bulanan dan Tahunan
      </h2>

      <div class="flex flex-col md:flex-row gap-3 mb-4">
        <select v-model="selectedYear" class="border p-2 rounded w-full md:w-1/4">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <select v-model="selectedMonth" class="border p-2 rounded w-full md:w-1/4">
          <option value="">Semua Bulan</option>
          <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
        </select>
      </div>

      <table class="min-w-full border-collapse">
        <thead class="bg-blue-100 text-left">
          <tr>
            <th class="p-2 font-semibold text-gray-700">Kategori</th>
            <th class="p-2 font-semibold text-gray-700">Total (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2">Biaya Administrasi</td>
            <td class="p-2">{{ monthlyTotals.administration.toLocaleString('id-ID') }}</td>
          </tr>
          <tr>
            <td class="p-2">Biaya Medis</td>
            <td class="p-2">{{ monthlyTotals.medical.toLocaleString('id-ID') }}</td>
          </tr>
          <tr>
            <td class="p-2">Biaya Obat</td>
            <td class="p-2">{{ monthlyTotals.products.toLocaleString('id-ID') }}</td>
          </tr>
          <tr class="bg-blue-50 font-bold">
            <td class="p-2">Total Transaksi</td>
            <td class="p-2 text-green-700">
              {{ monthlyTotals.total.toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Daily Summary -->
    <div class="mt-10 bg-white border rounded-lg shadow p-4">
      <h2 class="text-xl font-bold mb-4 text-blue-700">Hasil Harian</h2>

      <div class="flex flex-col md:flex-row gap-3 mb-4 items-center">
        <input type="date" v-model="dailyStart" class="border p-2 rounded w-full md:w-1/4" />
        <input type="date" v-model="dailyEnd" class="border p-2 rounded w-full md:w-1/4" />
        <select v-model="dailySort" class="border p-2 rounded w-full md:w-1/4">
          <option value="dateDesc">Newest First</option>
          <option value="dateAsc">Oldest First</option>
          <option value="totalDesc">Total (High-Low)</option>
          <option value="totalAsc">Total (Low-High)</option>
        </select>
      </div>

      <table class="min-w-full border-collapse">
        <thead class="bg-blue-100 text-left">
          <tr>
            <th class="p-2 font-semibold text-gray-700">Tanggal</th>
            <th class="p-2 font-semibold text-gray-700">Total Transaksi (Rp)</th>
            <th class="p-2 font-semibold text-gray-700">Biaya Administrasi</th>
            <th class="p-2 font-semibold text-gray-700">Biaya Medis</th>
            <th class="p-2 font-semibold text-gray-700">Biaya Obat</th>
            <th class="p-2 font-semibold text-gray-700">Jumlah Pasien</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, i) in paginatedDailySummary" :key="i" class="border-t">
            <td class="p-2">{{ day.date }}</td>
            <td class="p-2">{{ day.total.toLocaleString('id-ID') }}</td>
            <td class="p-2">{{ day.administration.toLocaleString('id-ID') }}</td>
            <td class="p-2">{{ day.medical.toLocaleString('id-ID') }}</td>
            <td class="p-2">{{ day.products.toLocaleString('id-ID') }}</td>
            <td class="p-2">{{ day.count }}</td>
          </tr>

          <tr v-if="paginatedDailySummary.length > 0" class="bg-blue-50 font-semibold">
            <td class="p-2 text-green-700">Total (Filtered Range)</td>
            <td class="p-2 text-green-700">{{ dailyRangeTotals.total.toLocaleString('id-ID') }}</td>
            <td class="p-2 text-green-700">{{ dailyRangeTotals.administration.toLocaleString('id-ID') }}</td>
            <td class="p-2 text-green-700">{{ dailyRangeTotals.medical.toLocaleString('id-ID') }}</td>
            <td class="p-2 text-green-700">{{ dailyRangeTotals.products.toLocaleString('id-ID') }}</td>
            <td class="p-2 text-green-700">{{ dailyRangeTotals.count }}</td>
          </tr>

          <tr v-if="paginatedDailySummary.length === 0">
            <td colspan="6" class="text-center p-4 text-gray-500">No data available</td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-center items-center mt-4 gap-2">
        <button
          @click="prevDayPage"
          :disabled="currentDayPage === 1"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span class="text-gray-700 font-medium">
          Page {{ currentDayPage }} of {{ totalDayPages }}
        </span>
        <button
          @click="nextDayPage"
          :disabled="currentDayPage === totalDayPages"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { db } from '@/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

interface Transaction {
  id: string
  patientName?: string
  items: { name: string; quantity: number; price?: number }[]
  total: number
  fees: { administration: number; medical: number }
  date: string
}

const transactions = ref<Transaction[]>([])
const search = ref('')
const sortBy = ref('dateDesc')
const currentPage = ref(1)
const itemsPerPage = 5

const transactionsCollection = collection(db, 'transactions')
let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = onSnapshot(transactionsCollection, snapshot => {
    transactions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[]
  })
})
onUnmounted(() => unsubscribe && unsubscribe())

// === Filters ===
const filteredTransactions = computed(() => {
  const filtered = transactions.value.filter(tx => {
    const q = search.value.trim().toLowerCase()
    if (!q) return true
    const patientMatch = tx.patientName?.toLowerCase().includes(q) ?? false
    const productMatch = tx.items.some(item => item.name.toLowerCase().includes(q))
    return patientMatch || productMatch
  })

  const sorted = filtered.slice()
  switch (sortBy.value) {
    case 'dateAsc':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    case 'dateDesc':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case 'totalAsc':
      return sorted.sort((a, b) => a.total - b.total)
    case 'totalDesc':
      return sorted.sort((a, b) => b.total - a.total)
    default:
      return sorted
  }
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTransactions.value.length / itemsPerPage)))
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTransactions.value.slice(start, start + itemsPerPage)
})
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function prevPage() { if (currentPage.value > 1) currentPage.value-- }
watch([search, sortBy, transactions], () => { currentPage.value = 1 })

// === Monthly / Yearly Summary ===
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref<number | ''>('')
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
const availableYears = computed(() =>
  [...new Set(transactions.value.map(tx => new Date(tx.date).getFullYear()))].sort()
)
const monthlyTotals = computed(() => {
  let administration = 0, medical = 0, products = 0, total = 0
  transactions.value.forEach(tx => {
    const d = new Date(tx.date)
    if (d.getFullYear() === selectedYear.value && (selectedMonth.value === '' || d.getMonth() === Number(selectedMonth.value))) {
      administration += tx.fees.administration
      medical += tx.fees.medical
      const productSum = tx.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0)
      products += productSum
      total += tx.total
    }
  })
  return { administration, medical, products, total }
})

// === Daily Summary ===
const dailyStart = ref('')
const dailyEnd = ref('')
const dailySort = ref('dateDesc')
const currentDayPage = ref(1)
const dayPerPage = 10

const dailySummary = computed(() => {
  const map: Record<string, { administration: number; medical: number; products: number; total: number; count: number }> = {}
  transactions.value.forEach(tx => {
    const dateObj = new Date(tx.date)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    if (!map[dateStr]) {
      map[dateStr] = { administration: 0, medical: 0, products: 0, total: 0, count: 0 }
    }

    map[dateStr].administration += tx.fees?.administration ?? 0
    map[dateStr].medical += tx.fees?.medical ?? 0
    map[dateStr].products += tx.items?.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
      0
    ) ?? 0
    map[dateStr].total += tx.total ?? 0
    map[dateStr].count += 1
  })

  let arr = Object.entries(map).map(([date, vals]) => ({ date, ...vals }))

  // ✅ Apply sort options
  switch (dailySort.value) {
    case 'dateAsc':
      arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'dateDesc':
      arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'totalAsc':
      arr.sort((a, b) => a.total - b.total)
      break
    case 'totalDesc':
      arr.sort((a, b) => b.total - a.total)
      break
  }

  if (dailyStart.value && dailyEnd.value) {
    const start = new Date(dailyStart.value).getTime()
    const end = new Date(dailyEnd.value).getTime()
    arr = arr.filter(d => {
      const t = new Date(d.date).getTime()
      return t >= start && t <= end
    })
  }

  return arr
})

// === Daily Pagination ===
const totalDayPages = computed(() => Math.max(1, Math.ceil(dailySummary.value.length / dayPerPage)))
const paginatedDailySummary = computed(() => {
  const start = (currentDayPage.value - 1) * dayPerPage
  return dailySummary.value.slice(start, start + dayPerPage)
})
function nextDayPage() { if (currentDayPage.value < totalDayPages.value) currentDayPage.value++ }
function prevDayPage() { if (currentDayPage.value > 1) currentDayPage.value-- }
watch([dailyStart, dailyEnd, dailySort, transactions], () => { currentDayPage.value = 1 })

// === Totals for filtered daily summary ===
const dailyRangeTotals = computed(() => {
  const total = paginatedDailySummary.value.reduce(
    (acc, d) => {
      acc.administration += d.administration
      acc.medical += d.medical
      acc.products += d.products
      acc.total += d.total
      acc.count += d.count
      return acc
    },
    { administration: 0, medical: 0, products: 0, total: 0, count: 0 }
  )
  return total
})
</script>
