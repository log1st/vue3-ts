<template>
  <div class="main">
    <div class="main__head">
     
      <div class="main__head-title main__head-title--big mt-6">Добро пожаловать в программу <b>ЮРРОБОТ</b></div>
      <div>
        <div class="btn btn-primary" v-if="!gridStatusSaving" @click="editGridConfig">
          <span>Редактировать</span>
        </div>

        <div class="btn btn-primary" v-else-if="gridStatusSaving" @click="saveGridConfig">
          <span>Сохранить</span>
        </div>
      </div>
    </div>
    
    <div class="main__content mt-20">
      <div class="home__title"><b>Общая</b> статистика</div>

      <grid-layout
        :layout.sync="layout"
        :col-num="4"
        :row-height="45"
        :is-draggable="gridStatusSaving"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item 
          v-for="(item, index) in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="index"
        >
          <!-- <div style="border: 1px solid red; height: 100%">
            test {{ item.i }}
          </div> -->
          <!-- <component 
            v-if="item.i === 'short-block'" 
            :is="item.i" 
            title="В работе" 
            count="85.12" 
          />
          <component 
            v-if="item.i === 'indebtedness-chart'" 
            :is="item.i" 
          /> -->
          <component v-if="item.name.length !== 0 " :is="item.name" />
        
        </grid-item>
      </grid-layout>

      <!-- малая диаграмма и график х.з. какой -->
      <!-- <div class="home__row">
        <div class="home__col home__col--376">
          <homeContainer title="Количество должников">
            <homeDiagram :params="d1Params" />
          </homeContainer>
        </div>
        <div class="home__col home__col--665">
          <homeContainer title="Статистика задолженности">
            <div class="home__img">
              <img src="assets/images/diag.png" alt="">
            </div>
          </homeContainer>
        </div>
      </div> -->
      <!-- слайдер общая задолженность -->
      <!-- <div class="home__row">
        <div class="home__col home__col--376">
          <homeContainer title="Статистика роста">
            <div class="home__growth">
              <div class="home__growth-icon">
                <icon-base
                    width="20"
                    height="25"
                    ><icon-growth />
                  </icon-base>
              </div>
              <div class="home__growth-context">
                <div class="home__growth-title">53 545.00 ₽</div>
                <div class="home__growth-subtitle"><b>Выплачено</b> в этом месяце</div>
              </div>
            </div>
          </homeContainer>
        </div>
        <div class="home__col home__col--665">
          <homeContainer title="Общая задолженность">
            <div class="home__totaldebt">
              <div class="home__totaldebt-head">
                <div class="home__totaldebt-title">{{ totalDebt.debt | sepnum(2) }} ₽</div>
                <div class="home__totaldebt-subtitle">{{ totalDebt.total | sepnum(2) }} ₽</div>
              </div>
              <div class="home__totaldebt-diagram">
                <div class="home__totaldebt-diagram_data" :style="`--tddw: ${totalDiagarmWidth}`"></div>
              </div>
            </div>
          </homeContainer>
        </div>
      </div> -->
      <!-- большая тройная диаграмма -->
      <!-- <div class="home__row">
        <div class="home__col home__col--1061">
          <homeContainer title="Количество поданных исков в суд">
            <div class="home__bigdiagram">
              <div class="home__bigdiagram-image">
                <div class="home__bigdiagram-image_outer">
                  <svg width="444px" height="444px" viewBox="0 0 444 444" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
                    <g id="Group-9" transform="translate(7.5 7.5)">
                      <path d="M214.5 429C332.965 429 429 332.965 429 214.5C429 96.0349 332.965 0 214.5 0C96.0349 0 0 96.0349 0 214.5C0 332.965 96.0349 429 214.5 429Z" id="Oval" fill="none" stroke="#F2F6FC" stroke-width="15" />
                      <path d="M184.5 369C286.397 369 369 286.397 369 184.5C369 82.6035 286.397 0 184.5 0C82.6035 0 0 82.6035 0 184.5C0 286.397 82.6035 369 184.5 369Z" transform="translate(30 30)" id="Oval-Copy-14" fill="none" stroke="#F2F6FC" stroke-width="15" />
                      <path d="M154.5 309C239.828 309 309 239.828 309 154.5C309 69.172 239.828 0 154.5 0C69.172 0 0 69.172 0 154.5C0 239.828 69.172 309 154.5 309Z" transform="translate(60 60)" id="Oval-Copy-15" fill="none" stroke="#F2F6FC" stroke-width="15" />
                      <path d="M214.5 429C332.965 429 429 332.965 429 214.5C429 96.0349 332.965 0 214.5 0C96.0349 0 0 96.0349 0 214.5C0 332.965 96.0349 429 214.5 429Z" id="Oval-Copy-4" fill="none" stroke="#5564F5" stroke-width="15" stroke-linecap="round" stroke-dasharray="450 450" />
                      <path d="M184.5 369C286.397 369 369 286.397 369 184.5C369 82.6035 286.397 0 184.5 0C82.6035 0 0 82.6035 0 184.5C0 286.397 82.6035 369 184.5 369Z" transform="translate(32 30)" id="Oval-Copy-12" fill="none" stroke="#78C158" stroke-width="15" stroke-linecap="round" stroke-dasharray="450 450" />
                      <path d="M154.5 309C239.828 309 309 239.828 309 154.5C309 69.172 239.828 0 154.5 0C69.172 0 0 69.172 0 154.5C0 239.828 69.172 309 154.5 309Z" transform="translate(60 60)" id="Oval-Copy-13" fill="none" stroke="#5EB3F7" stroke-width="15" stroke-linecap="round" stroke-dasharray="450 450" />
                    </g>
                  </svg>
                </div>
                <div class="home__bigdiagram-image_inner">
                  <div class="home__bigdiagram-image_title">14 450</div>
                  <div class="home__bigdiagram-image_subtitle">Всего</div>
                </div>
              </div>
              <div class="home__bigdiagram-legends">
                <div v-for="(item, i) in bigdiagramData.legends" class="home__bigdiagram-legend" :key="'bdglis' + i">
                  <div class="home__bigdiagram-legend_name">{{ item.name }}</div>
                  <div class="home__bigdiagram-legend_data">{{ item.data | sepnum }}</div>
                  <div class="home__bigdiagram-legend_percent">{{ item.percent }}%</div>
                </div>
              </div>

            </div>
          </homeContainer>
        </div>
      </div> -->
      <!-- нижние блоки -->
      <!-- <div class="home__row">
        <div class="home__col home__col--614">
          <mainContainer title="Как начать работать с должниками">
            <template slot="nobody">
              <div class="home__list">
                <ul class="home__list-items">
                  <li v-for="(item, i) in listItems" class="home__list-item" :key="'hmlis' + i" v-html="item"></li>
                </ul>
              </div>
            </template>
          </mainContainer>
        </div>
        <div class="home__col home__col--427">
          <mainContainer title="Техническая поддержка">
            <div class="home__support">
              <div class="home__support-title">Возникли вопросы по работе с программой?</div>
              <div class="home__support-subtitle">Задайте их нашим специалиста технической поддержки</div>
              <div class="home__support-item">
                <div class="home__support-item_icon">
                  <icon-base
                    width="10"
                    height="10"
                    ><icon-phone />
                  </icon-base>
                </div>
                <div class="home__support-item_phone">
                  <a href="tel:+7(812) 640-6-77-2">+7(812) 640-6-77-2</a>
                </div>
                <div class="home__support-item_text">Санкт-Петербург</div>
              </div>
              <div class="home__support-item">
                <div class="home__support-item_icon">
                  <icon-base
                    width="10"
                    height="10"
                    ><icon-phone />
                  </icon-base>
                </div>
                <div class="home__support-item_phone">
                  <a href="tel:+7(812) 640-6-77-2">+7(812) 640-6-77-2</a>
                </div>
                <div class="home__support-item_text">Москва</div>
              </div>
              <div class="home__support-separator"></div>
              <div class="home__support-item">
                <div class="home__support-item_icon">
                  <icon-base
                    width="11"
                    height="9"
                    iconColor="#aaadc8"
                    ><icon-mail2 />
                  </icon-base>
                </div>
                <div class="home__support-item_mail"><a href="mailto:Support@yr.com">Support@yr.com</a></div>
              </div>
            </div>
          </mainContainer>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import mainContainer from '@/components/elements/MainContainer'
import homeContainer from '@/components/elements/HomeContainer'
import homeDiagram from '@/components/elements/HomeDiagram'
import iconPhone from '@/components/icons-svg/icons/IconPhone'
import iconMail2 from '@/components/icons-svg/icons/IconMail2'
 
import iconGrowth from '@/components/icons-svg/icons/IconGrowth'

// блоки внутри
import ShortBlock from './components/ShortBlock';
// import Indebtedness from './components/Indebtedness';
// import IndebtednessChart from './components/IndebtednessChart';
import IndebtednessPieChartCard from './components/IndebtednessPieChartCard';

import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: { mainContainer, homeContainer, homeDiagram, iconPhone, iconMail2, iconGrowth, 
    "short-block" : ShortBlock,
    // "indebtedness" : Indebtedness,
    // "indebtedness-chart" : IndebtednessChart,
    "indebtedness-pie-chart-card" : IndebtednessPieChartCard,
  },
  data () {
    return {
      gridStatusSaving: false, 

      layout: [
        {"x":0, "y":0, "w":1, "h":2, "i": "short-block", name: '' },
        {"x":1, "y":0, "w":1, "h":2, "i": "short-block", name: '' },
        {"x":2, "y":0, "w":1, "h":2, "i": "short-block", name: '' },
        {"x":3, "y":0, "w":1, "h":2, "i": "short-block", name: '' },

        {"x":0, "y":1, "w":1, "h":6, "i":"indebtedness", name: 'indebtedness-pie-chart-card' },
        {"x":1, "y":1, "w":1, "h":6, "i":"indebtedness", name: '' },
        {"x":2, "y":1, "w":1, "h":6, "i":"indebtedness", name: ''},
        {"x":3, "y":1, "w":1, "h":6, "i":"indebtedness", name: ''},

        {"x":0, "y":2, "w":2, "h":7, "i":"indebtedness-chart", name: '' },
        {"x":2, "y":2, "w":2, "h":7, "i":"indebtedness-chart", name: '' },

        // {"x":0, "y":3, "w":1, "h":6, "i":"10"},
        // {"x":1, "y":3, "w":1, "h":6, "i":"11"},
        // {"x":2, "y":3, "w":1, "h":6, "i":"12"},
        // {"x":3, "y":3, "w":1, "h":6, "i":"13"},

        // {"x":0, "y":4, "w":2, "h":7, "i":"14"},
        // {"x":2, "y":4, "w":2, "h":7, "i":"15"},

        // {"x":0, "y":5, "w":1, "h":6, "i":"16"},
        // {"x":1, "y":5, "w":1, "h":6, "i":"17"},
        // {"x":2, "y":5, "w":1, "h":6, "i":"18"},
        // {"x":3, "y":5, "w":1, "h":6, "i":"19"},

        // {"x":0, "y":6, "w":2, "h":7, "i":"20"},
        // {"x":2, "y":6, "w":2, "h":7, "i":"21"},

        // {"x":0, "y":7, "w":2, "h":7, "i":"22"},
        // {"x":2, "y":7, "w":2, "h":7, "i":"23"},

        // {"x":0, "y":8, "w":1, "h":7, "i":"24"},
        // {"x":1, "y":8, "w":1, "h":7, "i":"25"},
        // {"x":2, "y":8, "w":2, "h":7, "i":"26"},

        // {"x":0, "y":9, "w":2, "h":7, "i":"27"},
        // {"x":2, "y":9, "w":2, "h":7, "i":"28"},

        // {"x":0, "y":10, "w":2, "h":7, "i":"29"},
        // {"x":2, "y":10, "w":2, "h":7, "i":"30"},
      ],
      desktopWidgetCoordsInner: [],

      listItems: [
        '<b>Заполните</b> данные своей организации',
        '<b>Создайте</b> дома и подключите их к услуге «Работа с должниками»',
        '<b>Добавьте</b> лицевые счета в дома',
        '<b>Загрузите</b> в программу сальдо (задолженность и переплата)',
        '<b>Начните</b> работать с должниками'
      ],
      d1Params: {
        text: '',
        whole: 180213,
        part: 50343
      },
      totalDebt: {
        total: 300845.00,
        debt: 125545.00
      },
      bigdiagramData: {
        legends: [
          { name: 'Судебный', data: 3456, percent: 73 },
          { name: 'Исполнительное', data: 1456, percent: 30 },
          { name: 'Досудебное', data: 1256, percent: 30 }
        ]
      }
    }
  },
  methods: {
    editGridConfig () {
      this.gridStatusSaving = true
    },
    saveGridConfig () {
      this.$store.dispatch('saveNewDesctopWidgetcoords', this.desktopWidgetCoordsInner).then(() => {
        debugger
        this.gridStatusSaving = false
      })
    }
  },
  watch: {
    desktopWidgetCoords: {
      deep: true,
      handler() {
        this.desktopWidgetCoordsInner = cloneDeep(this.desktopWidgetCoords);
      }
    }
  },
  created () {
       
  },
  computed: {
    ...mapGetters(['desktopWidgetCoords']),
    totalDiagarmWidth () {
      return this.totalDebt.debt / this.totalDebt.total * 100 + '%'
    }
  }
}
</script>

<style lang="scss">
// это будет диаграмма и уберется
  .home__img {
    padding: 54px 0 0;

    img {
      width: 100%;
    }
  }
</style>
