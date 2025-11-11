<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Analytics</h2>
    <div class="bg-white shadow rounded-lg p-6">
      <canvas ref="chartCanvas" class="w-full h-64"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default defineComponent({
  name: 'AnalyticsPage',
  setup() {
    const chartCanvas = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
      if (chartCanvas.value) {
        new Chart(chartCanvas.value, {
          type: 'bar',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [
              {
                label: 'Visitors',
                data: [120, 190, 300, 500, 200],
                backgroundColor: '#3b82f6',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
          },
        })
      }
    })

    return { chartCanvas }
  },
})
</script>
