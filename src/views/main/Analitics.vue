<template>
  <div class="main">
    <div class="main__head">
      <div class="main__head-title">Аналитика</div>
    </div>
    <div class="main__content mt-20">
      <aControls />
      <div class="main__content-subtitle">
        <span>Выполняемость заявок (распределение по времени)</span>
      </div>
      <div class="main__content-chart">
        <line-chart
          :width="300"
          :height="150"
          :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May']"
          :datasets="displayedDatasets"
          :options="$options.options"
        ></line-chart>
      </div>
    </div>
  </div>
</template>

<script>
import aControls from '@/components/modules/analitics/AnaliticsControls'
// import numeral from 'numeral'
import LineChart from '@/components/modules/charts/LineChart'

const datasets = {
  2018: {
    label: '2018 Sales',
    borderColor: 'rgba(50, 115, 220, 0.5)',
    backgroundColor: 'rgba(50, 115, 220, 0.1)',
    data: [-0.5, 0.0, 0.5, 1.0, 0.75]
  }
}

const options = {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
        // callback: value => numeral(value).format('$0,0')
      }
    }]
  },
  tooltips: {
    mode: 'MainTab.vue.vue',
    callbacks: {
      label (tooltipItem, data) {
        const label = data.datasets[tooltipItem.datasetIndex].label
        // const value = numeral(tooltipItem.yLabel).format('$0,0')

        return `${label}: ${tooltipItem.yLabel}`
      }
    }
  }
}
export default {
  datasets,
  options,
  components: { aControls, LineChart },
  data () {
    return {
      selectedYears: [2018]
    }
  },
  computed: {
    displayedDatasets () {
      return this.selectedYears.map(year => datasets[year])
    }
  }
}
</script>
