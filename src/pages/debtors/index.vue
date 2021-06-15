<template>
  <div class="main loc_overflow">
    <template v-if="debtorsModuleActive === -1">
      <div class="main__head">
        <div class="main__head-title mt-6">Услуги не подключены</div>
      </div>
    </template>

    <template v-else>
      <div class="main__head court__modules-btn">
        <btn-group
          :active="debtorsModuleActive"
          @change="setActiveModule($event)" 
          :buttons="debtorsModulesButtons"
          class="debtors__page-btn-wrapper"
        />
        <!-- <main-select
          :items="actionsForSelectItem(debtorsModuleActive)"
          @selectAction="mainSelectHandler($event)"
        /> -->
      </div>
    </template>
    <component
      :is="debtorComponentModule(debtorsModuleActive)"
      ref="activeDebtorModule"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

// модули "работа с должниками"
import CourtProceedings      from './components/CourtProceedings';
import PreTrialProceedings   from './components/PreTrialProceedings'; // Хрен знает почему но eslint с ума cходил пока я не указал index
import EnforcementProceeding from './components/EnforcementProceeding';
 

export default {
  name: 'DebtorsPage',
  components: {
    'court-proceedings' : CourtProceedings,
    'pre-trial-proceedings' : PreTrialProceedings,
    'enforcement-proceeding' : EnforcementProceeding
  },
  computed: {
    ...mapGetters([
      'debtorsModuleActive',
      'debtorsModulesButtons',
      'actionsForSelectItem',
      'debtorComponentModule',
      'checkedDebtors'
    ]),
  },
  created () {
       //
  },
  methods: {
    ...mapMutations(['setDebtorsModuleActive']),
    ...mapActions(['setPopupComponent']),
    /**
     * Устанавливает активный модуль задолжника
     * @param index
     */
    setActiveModule (index) {
      this.setDebtorsModuleActive(index);
    },
    /**
     * Обработчик события selectAction компонента <main-select/>
     * @param e функция/action
     */
    mainSelectHandler (e) {
      if (this.checkedDebtors.length > 0) {
        this.runAction(e)
      } else {
        this.setPopupComponent({
          component: 'popupAlert',
          params: {
            title: 'Действие отмененно',
            text: 'Выберите пожалуйста должников'
          }
        });
      }
    },
    /**
     *
     * @param action
     * @param data
     */
    runAction (e) {
      this.$refs['activeDebtorModule'].runActionFromIconHandler(e);
    },
  }
}
</script>
