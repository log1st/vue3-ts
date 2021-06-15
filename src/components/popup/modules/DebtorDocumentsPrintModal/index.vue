<template>
  <popup-wrapper :popupWidth="700">
    <template v-slot:header>
      <div class="align-items-center justify-content-between">
        <p class="m-0 print-modal__header">Работа с печатной формой.</p>
      </div>
    </template>

    <template>
      <div class="px-4 pb-4">
        <!-- Период расчета -->
        <print-period ref="printPeriod" hidden />

        <!-- Список документов в приложении -->
        <print-applications ref="printApplications" />

        <!-- Блок выбора услуг -->
        <print-services v-show="false" ref="printServices" /> 
        
        <!-- Блок кнопок выбора способа вывода документов -->
        <print-action-buttons :debtors="params.checkedDebtors" :debtor-inn="params.checkedDebtors[0].inn_debtor" :disabled="buttonDisabled" @print="printDocument" />

        <!-- <div class="btn btn-accept-outline" @click="openCreateModal()">
          Создать новое приложения
        </div> -->
      </div>
    </template>
  </popup-wrapper>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  import cloneDeep from 'lodash/cloneDeep';
  import { baseURL } from '@/settings/config'
  // Внутренние компоненты
  import printActionButtons from './components/Actions.vue';
  import Services           from './components/Services.vue';
  import Applications       from './components/Applications.vue';
  import Period             from './components/Period.vue';

  export default {
    components: {
      'print-action-buttons': printActionButtons,
      'print-services': Services,
      'print-applications': Applications,
      'print-period': Period,
    },
    props: {
      params: {
        type: [ Object, Array ],
        default: () => {},
      }, 
      value: Boolean,
      /**
       * Список кнопок
       */
      items: {
        type: Array,
      },
      hasServices: {
        type: Boolean,
        default: false
      }
    },
    created () {
      this.getCompanyDocuments()
    },
    mounted() {
      this.$watch(
        "$refs.printPeriod.periodIsNotEmpty",
        (new_value) => {
          this.buttonDisabled = !new_value;
        }
      );
      this.$watch(
        "$refs.printServices.emptyServicesCheckboxes",
        (new_value) => {
          this.buttonDisabled = new_value;
        }, {
          immediate: true
        }
      )
    },
    methods: {
      ...mapActions(['setPopupComponent', 'getCompanyDocuments']),
      /**
       * Добавить новое приложение
       * @description Открывает модальное окно добавления нового приложения
       */
      openCreateModal () {
          this.setPopupComponent({component: 'AddCompanyApplication'})
      },  
      // Выбрать все документы для печати
      selectAllDocumentsForPrint() {
        this.$store.commit('checkDocumentInOrderAll');
      },
      // Выбрать все документы для приложения в заявлении
      checkDocumentInJudicialOrderAll() {
        this.$store.commit('checkDocumentInJudicialOrderAll');
      },
      /**
       * Выбрать документ на печать или приложение
       */
      checkDocument(e, index) {
        this.$store.commit('checkDocument', { index: index });
      },
      /**
       * Печать документа
       */
      async printDocument(format) {
        // 1) проверка периода для печати
        if(!this.$refs['printPeriod'].allPeriod) {
          await this.$refs['printPeriod'].makeCalculations();
        }
        // if(!this.allPeriod && this.periodIsNotEmpty) {
          // let data = await this.makeCalculations();
        // }
        // this.$emit(e, format); 
        let cloned = cloneDeep(this.params.checkedDebtors);
        cloned.forEach(d => d.Accrued = Object.values(d.Accrued));
        this.$store.dispatch('statementsJudical/printStatementsJudicalDocument', {
          debtors: cloned,
          company: this.getDefaultCompany,
          format: format
        });
        this.$store.dispatch('setPopupState', false);
      },
      /**
       * Закрыть модальное окно
       */
      closeHandler () {
        this.$emit('input', false);
        this.$store.commit('clearServices');
      },
      
      handlerHeaderCheckbox(index) {
        // debugger
        this.$store.commit('setService', { value: !this.services[index], index: index });
        this.services[index] = !this.services[index];
        // this.servicesCheckboxes++
      },
      formatMonth(month) {
        return month >= 10 ? month : '0' + month
      },
    },
    computed: {
      ...mapGetters('statementsJudical', ['services']),
      ...mapGetters(['getDefaultCompany']),
      /**
       * Список документов на печать
       */
      documentsList: {
        get() {
          return this.$store.getters['statementsJudical/documentsList'];
        },
        set(value) {
          this.$store.commit('statementsJudical/setDocumentsOrder', value);
        }
      },
      /**
       * Нет ни одной выбранной услуги
       */
      emptyServicesCheckboxes() {
        return this.services.every(s => !s.checked)
      },
      /**
       * Возвращает флаг управления приложениями с панели админа
       */
      applicationsMode() {
        // return this.$store.getters.user.user.AdminSettings.ApplicationsMode
      },
      /**
       * Возвращает флаг управления сервисами с панели админа
       */
      servicesMode() {
        // return this.$store.getters.user.user.AdminSettings.ServicesMode
      } 
    },
    data() {
      return {
        servicesCheckboxes: 0,
        buttonDisabled: false,
        selectAllButton: false,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .print-modal__header {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: #5e6476;
  }
  .print-modal-service-type {
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    color: #5e6476;
  }
</style>