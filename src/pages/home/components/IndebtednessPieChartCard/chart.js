import Vue from 'vue';
import { Pie } from 'vue-chartjs'

export default Vue.component('indebtedness-pie-chart', {
    extends: Pie,
    mounted() {
        // this.gradient = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
        // this.gradient2 = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
    
        // this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
        // this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
        // this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
    
        // this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
        // this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
        // this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");
        
        this.renderChart(
            {
                labels: [
                    "Должников", 
                    "В суде", 
                    "Задолженность",
                    "В работе"
                ],
                datasets: [
                    {
                        backgroundColor: [
                            '#84D461',
                            '#6761D4',
                            "#00D8FF",
                            "#5EF7CF"
                        ],
                        data: [25, 25, 35, 15]
                    }
                ]
            },
            { responsive: true, maintainAspectRatio: false }
        );
    }
})
  

