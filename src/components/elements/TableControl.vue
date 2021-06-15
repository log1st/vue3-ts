<template>
<!--  <div class="table__control">-->
<!--    <div class="table__nav">-->

<!--      <div class="btn btn-icon" @click="openTableDisplaySettings">-->
<!--        <i class="material-icons" style="color: #848aa1">tune</i>-->
<!--      </div>-->

<!--      <div class="btn btn-icon" @click="toggleSearchPanel">-->
<!--        <i class="material-icons" style="color: #848aa1" v-if="!searchOpen">search</i>-->
<!--        <i class="material-icons" style="color: #848aa1" v-else>close</i>-->
<!--      </div>-->

<!--      <hotButtons v-on="$listeners" />-->

<!--      <transition name="fade" >-->
<!--        <div v-show="debtIsChecked >= 1 && allDebtors > 0 && debtIsChecked !== allDebtors"-->
<!--             class="table__nav-action"-->
<!--             @click="checkedAll()"-->
<!--        >-->
<!--          <span>Выбрать всех (+{{ allDebtors - debtIsChecked }})</span>-->
<!--        </div>-->
<!--      </transition>-->
<!--      <div :style="{ marginRight: 'auto' }"></div>-->
<!--      <transition name="fade" >-->
<!--        <div v-if="debtIsChecked" class="table__nav-action" @click="setNoChecked">-->
<!--          <span>Снять выделение со всех ({{ debtIsChecked }})</span>-->
<!--        </div>-->
<!--      </transition>-->
<!--      <transition name="fade" >-->
<!--        <div v-if="debtIsChecked" class="table__nav-action" @click="openPopupForChangeStatus('all')">-->
<!--          <span>Изменить статус выбранных должников</span>-->
<!--        </div>-->
<!--      </transition>-->
<!--    </div>-->
<!--    <div v-if="searchOpen" class="table__search">-->
<!--      <div class="table__search-inputs" :key="counterUpdate">-->
<!--        <div v-for="(item, i) in searchFormParams" class="table__search-input" :key="'inpt' + i">-->
<!--          <search-input v-for="(inpt, j) in item" :params="inpt" @changeInputValue="changeInputsValue($event, i, j)" :key="i + 'abc' + j" />-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="table__search-buttons">-->
<!--        <div class="btn btn-primary" @click="setResult">Найти</div>-->
<!--        <div class="btn btn-white" @click="counterUpdate++">Сбросить</div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

// import hotButtons from '@/components/elements/HotButtons';
import DisplaySettings from '../popup/modules/DisplaySettings'

export default {
  components: { DisplaySettings,
    // hotButtons
  },

  data () {
    return {
      counterUpdate: 0,
      searchOpen: false,
      openStatusActions: false,
      searchFormParams: [
        [{ placeholder: 'Адрес' }],
        [{ placeholder: '№ ЛС', onlynumber: true }],
        [{ placeholder: 'Любой статус', isSelect: true, items: ['Новый', 'Подано в суд', 'Вынесено решение', 'В работе'] }],
        [{ placeholder: 'ФИО' }],
        [{ placeholder: 'Цена иска от', onlynumber: true }, { placeholder: 'Цена иска до', onlynumber: true }],
        [{ placeholder: 'Любой номер приложения', isSelect: true, items: ['Приложение №1 от 10.02.2020г.', 'Приложение №2 от 10.02.2020г.'] }]
      ],
      result: [[], [], [], [], [], []]
    }
  },
  methods: {
    ...mapActions([
      // 'setPopupComponent',
      // 'setPopupState',
      // 'setDisplaySettingsEdit',
      // 'setNoChecked',
      // 'checkedAll'
    ]),


    // openPopupForChangeStatus (event) {
    //   if (event === 'all') {
    //     this.setPopupComponent({ component: 'popupChangeStatusDebtor', all: true })
    //   }
    //   this.setPopupState(true)
    // },
    // changeInputsValue (event, i, j) {
    //   // console.log(event, i, j)
    //   this.result[i][j] = event
    // },
    // setResult () {
    //   // console.log(this.result)
    // },
    // openNewTab () {
    //   if (!this.debtIsChecked) {
    //     this.setPopupComponent({ component: 'popupAlert', params: { title: 'Действие отмененно', text: 'Выберите пожалуйста должников' } })
    //     return false
    //   }
    //   const routeData = this.$router.resolve({ path: '/accruals' })
    //   window.open(routeData.href, '_blank')
    //   // $router.push('/accruals')
    // }
  },
  computed: {
    // ...mapGetters(['allDebtors', 'debtIsChecked', 'getStatusesDebtors'])
  }
}
</script>
