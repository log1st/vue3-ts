<template>
  <div class="main">
    <div class="main__head">
      <div class="main__head-title">Отчеты</div>
    </div>
    <div class="main__content mt-20">
      <vue-draggable group="people" @start="drag=true" @end="drag=true">
      <div class="main__content-chart-head-tile">
          <div class="main__content-head-chart-card">
            <div class="chart-title-small">
                В работе
            </div>
              <div class="main__content-chart-wrapper">
                <div class="title-chart">
                    85.54%
                </div>
                <apexchart width="100%" height='100' type="area" :options="options" :series="series"></apexchart>
            </div>
          </div>
          <div class="main__content-head-chart-card">
            <div class="chart-title-small">
                Количество должников в работе
            </div>
              <div class="main__content-chart-wrapper">
                <div class="title-chart">
                    658
                </div>
            </div>
          </div>
          <div class="main__content-head-chart-card">
            <div class="chart-title-small">
                Сумма задолженности 
            </div>
              <div class="main__content-chart-wrapper">
                <div class="title-chart">
                    1,455,789
                </div>
            </div>
          </div>
          <div class="main__content-head-chart-card">
            <div class="chart-title-small">
                Должников за этот период
            </div>
              <div class="main__content-chart-wrapper">
                <div class="title-chart">
                    +2,456
                </div>
                <apexchart width="100%" height='100' type="area" :options="options" :series="series"></apexchart>
            </div>
          </div>
      </div>
        <div class="main__content-first-row">
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Задолженность
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='300' type="pie" :options="optionsPieOne" :series="pieSeries"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Общее кол-во должников
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='300' type="donut" :options="optionsDonutOne" :series="pieSeries"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Общая сумма
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='300' type="radialBar" :options="optionsDonutTotal" :series="donutSeries2"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               Прогресс по долникам
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='300' type="radialBar" :options="multiRadialOptions" :series="multipleRadialSeries"></apexchart>
              </div>
            </div>
        </div>
        <div class="two-chart-row">
              <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               График задолженности
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='250' type="area" :options="areaOption" :series="areaSeries"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               График количество должников
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='250' type="area" :options="areaOption" :series="areaSeriesTwo"></apexchart>
              </div>
            </div>
        </div>
        <div class="main__content-first-row">
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Задолженность по годам
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='300' type="radar" :options="optionsRadarOne" :series="radarSeriesOne"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Задолженность по годам
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='300' type="radar" :options="optionsRadarOne" :series="radarSeriesOne"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Кол-во задолжеников по годам
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='270' type="radar" :options="optionsRadarTwo" :series="radarSeriesTwo"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Задолженность по годам
              </div>
              <div class="main__content-chart-wrapper-main-row">
                 <apexchart width="100%" height='300' type="radialBar" :options="optionDonutTotalTow" :series="donutSeries2"></apexchart>
              </div>
            </div>
        </div>
        <div class="two-chart-row">
              <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               График задолженности
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='250' type="line" :options="optionsLineOne" :series="lineSeries"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               График количество должников
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='250' type="area" :options="optionsAreaThree" :series="seriesAreaThree"></apexchart>
              </div>
            </div>
        </div>
        <div class="main__content-first-row">
          <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Возвращеные долги
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='300' type="radialBar" :options="optionDonutTotalThree" :series="donutSeries3"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Шкала эффективности
                <div class="main__content-chart-wrapper-main-row">
                  <apexchart width="100%" height='300' type="radialBar" :options="optionRadiaArrow" :series="radiaSeriesOne"></apexchart>
                </div>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Количество по статусам
                <div class="main__content-chart-wrapper-main-row four-tile">
                  <div class="inside-tile" v-for="(tile, index) in tiles" :key="index">
                    <span class="big-text-tile">
                      {{tile.data}}
                    </span>
                    <span class="small-text-tile">
                      {{tile.title}}
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
                Количество должников
                <div class="main__content-chart-wrapper-main-row three-tile">
                  <div class="three-tile-first-row">
                    <div class="three-tile-total-tile">
                      <div class="big-text-tile">12,483</div>
                      <div class="small-text-tile">Всего</div>
                    </div>
                    <div class="three-tile-percent-status-wrapper">
                      <span class="three-tile-percent-status">+ 12%</span>
                    </div>
                  </div>
                  <div class="three-tile-second-row">
                  <apexchart width="100%" height='150' type="bar" :options="optionMiniBar" :series="barSeriesOne"></apexchart>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div class="two-chart-row">
              <div class="main__content-head-chart-card">
                <div class="chart-title-small">
                 Количество задолжников за период
                </div>
                <div class="main__content-chart-wrapper-main-row">
                  <apexchart width="100%" height='250' type="bar" :options="optionsFullBarTwo" :series="barSeriesTwo"></apexchart>
                </div>
              </div>
              <div class="main__content-head-chart-card">
                <div class="chart-title-small">
                 Количество задолжников за период
                </div>
                <div class="main__content-chart-wrapper-main-row">
                  <apexchart width="100%" height='250' type="bar" :options="optionsRowBarsStacked" :series="seriesStackedBar"></apexchart>
                </div>
              </div>
          </div>
          <div class="two-chart-row">
              <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               Количество задолжников за период
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='250' type="bar" :options="optionsFullBar" :series="barSeriesOne"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               Количество задолжников за период
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='250' type="bar" :options="optionsRowBars" :series="barSeriesOne"></apexchart>
              </div>
            </div>
          </div>
          <div class="three-chart-row">
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               Общая сумма оплата
              </div>
              <div class="main__content-chart-wrapper-main-row">
                  <div class="status-data" v-for="(stat, index) in statusData" :key="index">
                    <span class="status-data-dot" :style="'background-color:'+stat.color"></span>
                    <span class="status-data-text">{{stat.text}}</span> <span class="status-data-value">+{{stat.up}}</span>
                  </div>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               Общая сумма оплата
              </div>
              <div class="main__content-chart-wrapper-main-row">
                  <calendar is-expanded/>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               Количество должников
              </div>
              <div class="main__content-chart-wrapper-main-row">
                    <div class="big-text-title">
                      12,342
                    </div>
                      <div class="progress-line-title">Судебное производство</div>
                      <progress-line :percent="70" :color-flow="true" :active="true" type="line" color="#5EB3F7" status="success"></progress-line>
                      <div class="progress-line-title">Досудебное производство</div>
                      <progress-line :percent="53" :color-flow="true" :active="true" type="line" color="#5EB3F7" status="success"></progress-line>
                      <div class="progress-line-title">Исполнительное производство</div>
                      <progress-line :percent="22" :color-flow="true" :active="true" type="line" color="#5EB3F7" status="success"></progress-line>
              </div>
            </div>
          </div>
          <div class="two-chart-row">
              <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               Количество задолжников за период
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='250' type="area" :options="areaOption" :series="areaSeriesX"></apexchart>
              </div>
            </div>
            <div class="main__content-head-chart-card">
              <div class="chart-title-small">
               Количество задолжников за период
              </div>
              <div class="main__content-chart-wrapper-main-row">
                <apexchart width="100%" height='250' type="bubble" :options="optionsBubble" :series="bubbleSeriesOne"></apexchart>
              </div>
            </div>
          </div>
    </vue-draggable>

    </div>
  </div>
</template>

<script>
import aControls from '@/components/modules/analitics/AnaliticsControls'
// import numeral from 'numeral'
import LineChart from '@/components/modules/charts/LineChart'
import VueApexCharts from 'vue-apexcharts'
import KProgress from 'k-progress'
 

export default {
  name: 'Desktop',
  components: { aControls,
                LineChart,
                'apexchart':VueApexCharts,
                'progress-line': KProgress
                },
  data () {
    return {
      statusData:[
        {
          text:'Судебная практика',
          color:'#5EB3F7',
          up:'12,456'
        },
        {
          text:'Досудебная практика',
          color:'#5564F5',
          up:'10,789'
        },
        {
          text:'Исп. производство',
          color:'#dedede',
          up:'5,940'
        }
      ],
      tiles:[
        { title: 'В исковой',
          data: '1401'
        },
        { title: 'Новых',
          data: '154'
        },
        { title: 'В суде',
          data: '2,140'
        },
        { title: 'Вынесено решений',
          data: '2,478'
        }
      ],
        series: [
          {
            name: "Series 1",
            data: [23, 10, 28, 45, 23, 85]
          }
        ],
        seriesStackedBar:[
          {
            name: 'PRODUCT A',
            data: [44, 55, 41, 67, 22, 43]
          }, {
            name: 'PRODUCT B',
            data: [13, 23, 20, 8, 13, 27]
          }, {
            name: 'PRODUCT C',
            data: [11, 17, 15, 15, 21, 14]
          }
        ],
        lineStackedSeriesOne:[{
          name:'Судебное производство',   
          data:[88]
          },
          {name: 'transparent',
          data:[12]
          }
          ],
        lineStackedOptionOne:{
          chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: '100%'
            },
            dataLabels: {
              enabled: false
            },
            tooltip: {
              enabled: false,
            },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            stroke: {
              width: 1,
              colors: ['transparent']
            },
            colors:['#5EB3F7'],
            legend:{
              show: false
            },
            xaxis: {
              categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
            },
        },
        lineStackedOptionTwo:{},
        lineStackedOptionThree:{},
        optionsRowBarsStacked:{
          chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              }
            },
            fill: {
              opacity: 1
            },
            colors:['#5EB3F7','#5564F5', '#dedede'],
            legend: {
                  show: false
                },
                plotOptions: {
              bar: {
                borderRadius: 8,
                horizontal: false,
              },
            },
            xaxis: {
              type: 'datetime',
              categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
                '01/05/2011 GMT', '01/06/2011 GMT'
              ],
            },
        },
        bubbleSeriesOne:[{
              name: "Должники Досудебное",
              data: this.generateData(new Date('09 Feb 2021 GMT').getTime(), 5, {
              min: 10,
              max: 60
          })
          },
          {
              name: "Задолжники исп производство",
              data: this.generateData(new Date('09 Feb 2021 GMT').getTime(), 5, {
              min: 10,
              max: 60
          })
          }],
        optionsBubble:{
          chart: {
                type: 'bubble',
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                opacity: 0.8
            },
            xaxis: {
                tickAmount: 12,
                type: 'category',
            },
            colors:['#5EB3F7','#5564F5'],
            yaxis: {
                max: 70
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            }
        },
        lineSeries: [{
              name: "Desktops",
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          }],
        optionsLineOne:{
            chart: {
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            colors:['#495CFF'],
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
              },
            },
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            }
        },
        optionsRowBars:{
            chart: {
              type: 'bar',
              },
              plotOptions: {
              bar: {
                horizontal: true,
                dataLabels: {
                  position: 'top',
                },
              }
            },
            dataLabels: {
              enabled: false,
            },
            colors:['#5EB3F7','#5564F5', '#dedede'],
            xaxis: {
              categories: ['Февраль', 'Март', 'Апрель'],
            },
        },
        optionsFullBarTwo:{
          chart: {
              type: 'bar',
            },
             plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '90%',
                endingShape: 'rounded'
              },
             },
            colors:['#5EB3F7','#5564F5', '#dedede'],
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              labels: {
                show: false,
              }
            },
            fill: {
              opacity: 1
            },
        },
        optionsFullBar:{
          chart: {
              type: 'bar',
            },
             plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '60%',
                endingShape: 'rounded'
              },
             },
            colors:['#5EB3F7','#5564F5', '#E3E9F3'],
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              labels: {
                show: false,
              }
            },
            fill: {
              opacity: 1
            },
        },
        optionMiniBar:{
           chart: {
              type: 'bar',
            },
             plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '90%',
                endingShape: 'rounded'
              },
            },
            dataLabels: {
              enabled: false
            },
            legend:{
              show: false
            },
            colors:['#5EB3F7','#5564F5', '#E3E9F3'],
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
              categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              labels: {
                show: false,
              }
            },
            fill: {
              opacity: 1
            },
             tooltip: {
                enabled: false,
              },
              yaxis: { 
                labels: {
                  show: false,
                },
              },
            grid: {
              show: false,
            },
        },
        barSeriesTwo:[
          {
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
          }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
          },
        ],
         barSeriesOne: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
          }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
          }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
          }],
        seriesAreaThree: [{
            data: this.generateDayWiseTimeSeries(new Date('01 Feb 2021').getTime(), 10, {
              min: 14,
              max: 100
            })
          }, {
            data: this.generateDayWiseTimeSeries(new Date('01 Feb 2021').getTime(), 10, {
              min: 28,
              max: 160
            })
          }
          ],
        optionsAreaThree:{
          chart: {
              type: 'area',
            },
             colors: ['#4D6DFD', '#5FB4F7'],
            yaxis: {
              labels: {
                minWidth: 40
              }
            }
        },

        radiaSeriesOne:[42],
        optionRadiaArrow:{
           chart: {
              type: 'radialBar',
              offsetY: -20,
              sparkline: {
                enabled: true
              }
            },
            plotOptions: {
              radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                  background: "#e7e7e7",
                  strokeWidth: '97%',
                  margin: 5, // margin is in pixels
                  dropShadow: {
                    enabled: true,
                    top: 2,
                    left: 0,
                    color: '#999',
                    opacity: 1,
                    blur: 2
                  }
                },
                dataLabels: {
                  name: {
                    show: false
                  },
                  value: {
                    offsetY: -2,
                    fontSize: '22px'
                  }
                }
              }
            },
            grid: {
              padding: {
                top: -10
              }
            },
            colors:['#4D6DFD'],
            fill: {
              type: 'gradient',
              gradient: {
                shade: 'light',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 53, 91]
              },
            },
            labels: ['Average Results'],
        },
      options: {
        chart: {
          height: 100,
          type: "area",
          toolbar: {
          show: false
        },
        },
         stroke: {
          curve: 'smooth'
        },
        legend:{
          show: false,
        },
        grid: {
          show: false,
        },
        dataLabels: {
          enabled: false
        },
          tooltip: {
            enabled: false,
          },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
        },
        yaxis: { 
          labels: {
            show: false,
          },
        },
        xaxis: {
          categories: [
            "01 Jan",
            "02 Jan",
            "03 Jan",
            "04 Jan",
            "05 Jan",
            "06 Jan"
          ],
          labels: {
            show: false,
          }
        }
      },
      optionsRadarOne:{
        chart: {
              type: 'radar',
            },
             xaxis: {
              categories: ['2021', '2020', '2019', '2018', '2017', '2016']
            },
            colors:['#5C6AF5'],
            fill:{colors:"transparent"}
      },
      optionsRadarTwo:{
        chart: {
              type: 'radar',
              dropShadow: {
                enabled: true,
                blur: 1,
                left: 1,
                top: 1
              }
            },
        xaxis: {
              categories: ['2011', '2012', '2013', '2014', '2015', '2016']
            },
              colors:['#5C6AF5','#D6DFEF','#495CFF'],
            markers: {
              colors: ['#5C6AF5','#D6DFEF','#495CFF']
            },
            dataLabels: {
              enabled: false,
              style: {
                colors: ['#5C6AF5','#D6DFEF','#495CFF']
              }
            },
            fill: {
              colors: ['#5C6AF5','#D6DFEF','#495CFF'],
              opacity: 0.7
            },
      },
      radarSeriesOne:[{
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      }],
      radarSeriesTwo: [{
            name: 'Series 1',
            data: [80, 50, 30, 40, 100, 20],
          }, {
            name: 'Series 2',
            data: [20, 30, 40, 80, 20, 80],
          }, {
            name: 'Series 3',
            data: [44, 76, 78, 13, 43, 10],
          }],
      areaSeries: [{
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100]
        }],
        areaSeriesX:[{
          name:'line1',
          data: [27, 10, 74, 44, 49, 58, 77, 60]
        }],
        areaSeriesTwo: [{
          name: 'series1',
          data: [31, 40, 28, 51, 42, 109, 100]
        },{
          name: 'series2',
          data: [44, 78, 12, 45, 22, 144, 149]
        }],
      areaOption:{
        chart: {
          height: 250,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        colors:['#7C88F7', '#69B8F8'],
        xaxis: {
          type: 'datetime',
          categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
      },
      donutSeries1: [23, 10, 28, 45],
      donutSeries2: [1455789],
      donutSeries3: [45],
      multipleRadialSeries:[110, 254, 134],
      multiRadialOptions:{
        chart: {
          type: 'radialBar',
        },
        colors:['#6474FF', '#5FF7CF', '#5EB3F7'],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px',
              },
              value: {
                fontSize: '16px',
              },
              total: {
                show: false,
                label: 'Всего',
                formatter: function (w) {
                  return 249
                  }
                }
              }
            }
          },
        labels: ['Apples', 'Oranges', 'Bananas'],
        legend: {
              position: 'bottom'
            }
      },

      optionsDonutTotal:{
        chart: {
          type: 'radialBar',
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          colors: ['#84D461']
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70%',
            }
          },
        },
        labels:['Всего'],
        legend: {
          position: 'bottom'
        }
      },
      optionDonutTotalTow: {
            chart: {
              type: 'radialBar',
            },
            fill: {
              colors: ['#495CFF']
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '70%',
                }
              },
            },
            labels: ['Всего'],
      },
      optionDonutTotalThree:{
        chart: {
              type: 'radialBar',
            },
            fill: {
              colors: ['#4D6DFD']
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '70%',
                }
              },
            },
            labels: ['Всего'],
      },
      optionsDonutOne:{
        chart: {
          type: 'donut',
        },
        colors:['#495CFF'],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,      
        },

        legend: {
              position: 'bottom'
            }
      },
      pieSeries:[25, 15, 44, 55, 41, 17],
      optionsPieOne: {
        chart: {
          width: '200px',
          type: 'pie',
        },
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        legend: {
          show: true,
          showForSingleSeries: false,
          showForNullSeries: true,
          showForZeroSeries: true,
          position: 'bottom',
          horizontalAlign: 'center', 
        },
        colors:['#5EB3F7', '#5EF7CF', '#84D461', '#6761D4'],
        plotOptions: {
          pie: {
            // size: 200
            // customScale: 1.8
          }
        }
      },
    }
  },
  created () {
       
  },
   methods: {
     generateData(baseval, count, yrange) {
      var i = 0;
      var series = [];
      while (i < count) {
        var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
        series.push([x, y, z]);
        baseval += 86400000;
        i++;
      }
      return series;
    },
    generateDayWiseTimeSeries: function(baseval, count, yrange) {
      var i = 0;
      var series = [];
      while (i < count) {
        var x = baseval;
        var y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
          yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
      }
      return series;
    }
    },
}
</script>
<style lang="scss">
.vc-container {
  border-color: transparent !important;
}
.chart-title-small {
    font-size: 0.75rem;
    font-weight: 300;
    line-height: 1.3125rem;
    color: #949baf;
}
.status-data {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1em 0;
  &-text {
    font-weight: 600;
    text-align: left;
  }
  &-dot {
    border-radius: 1em;
    padding: 0.5em 0.2em;
  }
  &-value {
    font-weight: 600;
    color: #5EB3F7;
  }
}
    .main__content {
      .two-chart-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 10px;
        grid-template-rows: 310px;
        margin: 10px 0;
      }
      .three-chart-row {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        grid-column-gap: 10px;
        grid-template-rows: 310px;
        margin: 10px 0;
      }
      &-first-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-column-gap: 10px;
        grid-template-rows: 310px;
      }
        &-head-chart-card {
            background-color: #ffffff;
            border-radius: .4rem;
            padding: 0.5em 0.75em;
        }
        &-chart-head-tile {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-column-gap: 10px;
            grid-template-rows: 80px;
            grid-row-gap: 10px;
            margin: 10px 0;
            .title-chart {
                font-weight: bold;
                font-size: 2em;
                color: #61646b;
            }
            .apexcharts-canvas {
                position: relative;
                user-select: none;
                top: -3em;
            }
        }
        &-chart-wrapper {
            display: flex;
            flex-direction: row;
            height: 100%;
        }
        .three-tile {
          &-first-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
          &-percent-status-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #dedede;
              span {
                font-weight: bold;
                color: #00e396;
                border: 1px solid #dedede;
                border-radius: 0.7em;
                padding: 0.3em 0.5em;
              }
          }
          &-total-tile {
            display: flex;
            padding: 3em 0;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-right: 1px solid #dedede;
            border-bottom: 1px solid #dedede;
          }
          .big-text-tile {
              font-size: 1.9em;
              font-weight: bold;
              color:#4a4b4d;
            }
            .small-text-tile {
              text-align: center;
              line-height: initial;
            }
        }
        .four-tile {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 5px;
            grid-row-gap: 5px;
            grid-template-rows: 100px 100px;
            margin-top: 3em;
            .inside-tile {
              padding: 1em;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: #f2f6fc;
                .big-text-tile {
                  font-size: 1.9em;
                  font-weight: bold;
                  color:#4a4b4d;
                }
                .small-text-tile {
                  margin-top: 0.4em;
                  text-align: center;
                  line-height: initial;
                }
            }
          }
        .big-text-title {
          font-size: 2.2em;
          font-weight: bold;
          color:#4a4b4d;
        }
        .progress-line-title {
          margin: 0.5em 0;
          color: #4a4b4d;
        }
    }
</style>