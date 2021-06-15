<template>
    <div style="background: #fff; border-radius: 6px">
        <indebtedness-pie-chart :height="320" :width="391" />
    </div>
</template>

<script>
import IndebtednessPieChart from './chart.js';

export default {
    components: {
        'indebtedness-pie-chart': IndebtednessPieChart
    }

}
</script>