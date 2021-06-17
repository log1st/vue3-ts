<template>
  <div class="main loc_overflow">
    <div class="main__head">
      <btn-group :buttons="buttons" 
      :active="currentActive" 
      :modified="modified" 
      @currentActive="$router.push(buttons[$event].rout)" 
      :key="currentActive" />
      <div v-if="currentActive == 2" class="btn btn-primary" @click.prevent="">Экспорт данных</div>
    </div>
    <div class="main__body">
      <div class="data__sidebar">
        <div class="data__sidebar-head">
          <search-input class="dropdown" :params="{ 
            placeholder: 'Выберите организацию', 
            isSelect: true, 
            items: getCompaniesFullNames, 
            value: getCompaniesFullNames[0], 
            class: error ? 'is-error' : null 
            }" 
            @changeInputValue="currentOrg = $event" 
            @noerror="error = false" 
          :key="updateContent" />

          <search-input class="dropdown"
          @changeInputValue="currentRegionName = $event"
          :params="{
            isSelect: true, 
            items: regions,
            placeholder: currentRegionName || 'Выберите регион', 
            value: currentRegionName,
            class: regionError ? 'is-error' : null 
            }"
          @noerror="regionError = false"
          :error="regionError"
        />

        </div>
        <div class=" data__aside-nav">
          <div class="data__aside-list mobile-drop"
          v-for="(item, index) in exchangeLinklLists"
          :key="index"
          @click="goToExchange(item, index)"
          >
          <span :class="{'active': item.isActive}" class="data__aside-link">{{item.name}}</span>
          </div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
 
import btnGroup from '@/components/elements/ButtonsGroup'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ExchangeWrapper',
  components: { btnGroup },
  data () {
    return {
      contentUpdate: 0,
      currentOrg: null,

      currentRegionName: '',
      selectedRegion: '',
      regionError: false,
      error: false,

      updateContent: 0,

      buttons: [
        {
          name: 'Загрузка данных',
          rout: '/exchange/import',
          icon: 'icon-import',
          width:"25",
          height:"24",
          viewBox:"0 0 25 24"
        },
        // {
        //   name: 'Выгрузка данных',
        //   rout: '/exchange/export',
        //   icon: 'icon-export',
        //   width:"25",
        //   height:"26",
        //   viewBox:"0 0 25 26"
        // },
        // {
        //   name: 'Интеграция',
        //   rout: '/exchange/gis',
        //   icon: 'icon-integration',
        //   width:"25",
        //   height:"25",
        //   viewBox:"0 0 25 25"
        // }
      ]
    }
  },
  mounted () {
      let activeLink = this.exchangeLinklLists.find( lk => lk.id === this.$route.query.action)
      let alreadyActiveLink = this.exchangeLinklLists.find( aAL => aAL.isActive === true )
      if (activeLink.id !== alreadyActiveLink.id) {
        this.getExchangeActiveLink(activeLink)
      }

  },
  watch: {
    currentOrg: {
      immediate: true,
      handler (val) {
        this.getExchengeCompany(val)
      }
    },

    getCompaniesFullNames: {
      immediate: true,
      handler(val) {
        if (typeof val !== "undefined" && Array.isArray(val) && val.length > 0) {
          this.updateContent++;
        }
      }
    },

    currentRegionName: {
      immediate: true,
      deep: true,
      handler (val) {
        let regionObject = this.regionsList.find( r => val === r.name)
        // console.log(regionObject, this.exchangedCompanyData)
        this.setSelectedRegion({region: regionObject, exchangedCompanyData:this.exchangedCompanyData})
      }
    }
  },
  methods: {
    ...mapActions(['getExchangeActiveLink', 'getExchengeCompany', 'getRegionsList', 'getCompanySettings', 'setSelectedRegion']),
    /**
     * @param item: `Object`, выбранная категория из сайдбара
     * @param index: `Integer`, порядковый номер в массиве `lists`, возможно понадобиться когда данные в массив будут приходить с бэка
     * @description Функция для перехода между судебными модулями внутри блока "загрузки", и инструкции к ним  
     */
    goToExchange (item, index) {
        let id = index
        // toggle для дизайна 
        this.getExchangeActiveLink(item)
        this.$router.push(item.route)
      }
  },
  created () {
     this.getRegionsList()
     .then( async () => {
      if ( this.companySettings.default_region ) {
         let region = await this.regionsList.find(rg => rg.id === this.companySettings.default_region )
         this.currentRegionName = region.name
      } else {
        setTimeout(() => {
          this.getCompanySettings(this.exchangedCompanyData.id)
          .then( async result => {
            if ( result.status ) {
              let region = await this.regionsList.find(rg => rg.id === this.companySettings.default_region )
              this.currentRegionName = region.name
            }
          })
        }, 1000)
        
      }
     })
     
  },
  computed: {
    ...mapGetters([
      'getCompaniesFullNames',
      'regionsList',
      'exchangeLinklLists',
      'companySettings',
      'exchangedCompanyData'
    ]),
    regions () {
      let regionsName = [];
      this.regionsList.forEach( r => {
        regionsName.push(r.name)
      })
      return regionsName
    }, 
    currentActive () {
      const currentRout = this.$route.fullPath
      let current = 0
      this.buttons.forEach((el, id) => {
        if (currentRout.indexOf(el.rout) + 1) current = id
      })
      return current
    },
    modified () {
      return this.buttons[this.currentActive].rout !== this.$route.fullPath
    }
  }
}
</script>
