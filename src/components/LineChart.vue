<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Chart, type ChartItem } from 'chart.js/auto'

const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvas.value) return // ✅ Prevents passing null

  new Chart(canvas.value as ChartItem, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Visitors',
          data: [120, 190, 300, 500, 200],
          borderWidth: 2,
          borderColor: '#3b82f6',
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
    },
  })
})
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
