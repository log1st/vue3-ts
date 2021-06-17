<template>
  <div class="debtors">
   <!--  <div class="main__content-header">
      <div class="main__content-title">Список должников</div>-->
      <!-- <button @click="$store.dispatch('statementsJudical/printStatementsJudicalDocument', {})">test</button> -->

     <!--   <div v-if="allDebtors" class="main__content-shows">
        Показаны <span>{{ shownDebtors }} </span> из <span>{{ allDebtors }}</span>
      </div>
    </div>-->

    <div class="exchange-toaster">
      <div class="exchange-toaster--loader" v-if="generatingTemplateProgress > 0">
        {{ generatingTemplateProgress }}% Генерация
        <div class="loader-inner" :style="{ width: generatingTemplateProgress * 156 / 100 + 'px' }"></div>
        <div class="loader-outer"></div>
      </div>
    </div>

    <div class="exchange-toaster">
      <div class="exchange-toaster--loader" v-if="mergeTemplateProgress > 0">
        {{ mergeTemplateProgress }}% Формирование
        <div class="loader-inner" :style="{ width: mergeTemplateProgress * 156 / 100 + 'px' }"></div>
        <div class="loader-outer"></div>
      </div>
    </div>

    <epc />

    <ur-table
      :displayColumns="formattedColumns"
      :displayRows="debtorsPreTrialProceedings"
      :allColumns="preTrialProceedingsTableColumns"
      @columnsChange="updateColumns($event)"
      :itemsPerPage="debtorsPreTrialProceedingsInPage"
      @sort="sortHandler($event)"
      :key="updateTable"
      @contextmenu="contextMenuOpen($event)"
      :rowAction="rowActionHandler"
      :debtorPaidColNames="debtorPaidColNames"
    >
      <template v-slot:controls>

        

        <hot-buttons @action-emit="runActionFromIconHandler($event)" />
        <transition name="fade">
          <div
            v-if="checkedPreTrialDebtorsCount >= 1"
            class="table__nav-action"
            @click="openPopupForChangeStatus('all')"
          >
            <span>Изменить статус выбранных должников</span>
          </div>
        </transition>
        <!-- <transition name="fade">
          <span
            v-show="checkedPreTrialDebtorsCount >= 1 && allDebtorsInPageCount > 0 && checkedPreTrialDebtorsCount !== allDebtorsInPageCount"
            class="main__user-panel__span"
            @click="checkAllClonesDebtors()"
          >
            Выбрать всех на странице (+{{ allDebtorsInPageCount - checkedPreTrialDebtorsCount }})
          </span>
        </transition> -->

        <div style="margin-right: auto"></div>

        <transition name="fade" >
          <span
            v-if="checkedPreTrialDebtorsCount >= 1"
            class="main__user-panel__span"
            @click="uncheckAllClonesDebtors"
          >
             Выбрано {{ checkedPreTrialDebtorsCount }} из {{debtorsPreTrialProceedingsInner.length}} 
          </span>
        </transition>

        
        <span v-if="allDebtors" class="main__user-panel__span">
          Показаны {{ shownPreTrialDebtors }} из {{ allDebtors }}
        </span>
        
        <!-- <div class="main__user-panel__search-link" @click="toggleSearchPanel">
          <i class="material-icons" style="color: #21317a; font-size: 28px" v-if="!searchPanelState">search</i>
          <i class="material-icons" style="color: #848aa1" v-else>close</i>
        </div> -->
        <!-- <div class="main__user-panel__search-link" @click="toggleSearchPanel">
          <i class="material-icons" style="color: #21317a; font-size: 28px" v-if="!searchPanelState">search</i>
          <i class="material-icons" style="color: #848aa1" v-else>close</i>
        </div> -->
      </template>

      <template v-slot:tableInner>
        <search v-model="searchPanelState" />
      </template>

      <template v-slot:head(checked)="{ row, i }">
        <div style="display: flex; justify-content: center">
          <ur-checkbox
            :checked="checkedPreTrialDebtorsCount === debtorsPreTrialCountInCurrentPage"
            @change="handlerHeaderCheckbox"
          />
          <!-- <span style="border: 1px solid red" @click.stop="handlerHeaderCheckbox">{{ checkedPreTrialDebtorsCount === debtorsPreTrialCountInCurrentPage }}</span> -->
        </div>
      </template>

      <template v-slot:head(RashSchet)="{ row, i }">
        <div style="display: flex; justify-content: center; width: 100%">
          <span style="">№ ЛС</span>
        </div>
      </template>
      
      <template v-slot:cell(Status)="{ row, i }">
        <div class="table__col-status">
          <span @click.stop="changeStatus({ row, i })">
            <!-- {{ 
              row.status.status
            }}  -->
            Новый
            <!-- <br v-if="row.status.substatus"> -->
            <!-- {{ row.status.substatus }} -->
          </span>
        </div>
      </template>

      <template v-slot:cell(checked)="{ row, i }">
        <div style="display: flex; justify-content: center">
          <ur-checkbox
            :checked="row.checked"
            @change="handlerCellCheckbox(row, i)"
          />
          <!-- <span style="border: 1px solid red" @click.stop="handlerCellCheckbox(row)">{{ row.checked }}</span> -->
        </div>
      </template>

      <template v-slot:cell(RashSchet)="{ row, i }">
        <div class="table__col-ordernum">{{ row.debtor.personal_account || 0 }}</div>
        <app-rating :rating="1"></app-rating>
      </template>

      <!-- <template v-slot:cell(phone)="{ row, i }">
        <span class="table__col-user">
          {{ row.debtor_main_profile.phone_number }}
        </span>
      </template> -->

      <template v-slot:cell(FIO)="{ row, i }">
        <span class="table__col-user">
          {{ row.debtor_main_profile.full_name }}
        </span>
      </template>

      <template v-slot:cell(Adres)="{ row, i }">
       <span class="table__col-user" v-if="!row.clean_address">
          {{ row.debtor_main_profile.address }}
        </span>
        <span class="table__col-user" v-else>
          {{ row.clean_address}}
        </span>
        
      </template>

      <template v-slot:cell(AccruedCsv)="{ row, i }">
        <span class="table__col-user">
          {{ row.accrual || 0 }} ₽
        </span>
      </template>

      <template v-slot:cell(PaidCsv)="{ row, i }">
        <span class="table__col-user">
          {{ row.paid_up || row.paid_value || 0 }} ₽
        </span>
      </template>

      <template v-slot:cell(TotalDebt)="{ row, i }">
        <span class="table__col-user">
          {{ row.debt || 0 }} ₽
        </span>
      </template>

      <template v-slot:cell(PeniCsv)="{ row, i }">
        <span class="table__col-user">
          {{row.penalty || 0}} ₽
        </span>
      </template>

      <!-- <template v-slot:cell(StateDuty)="{ row, i }">
        <span class="table__col-user">
         {{ row.fee.individual_order || 0 }} ₽
        </span>
      </template> -->

      <template v-slot:footer>
        <pagination :pages="preTrialPages" @changeCurrentPage="changePageHandler($event)" :currentPage="currentPage" />
      </template>

      <template v-slot:contextMenu>
        <div class="context-menu" :class="{'is-active' : contextMenuOpenFlag }" ref="contextMenu">
          <div class="context-menu__item" @click="checkAllClonesDebtors(); contextMenuOpenFlag = false">
            <span>Выбрать всех</span>
          </div>
          <div class="context-menu__item" @click="uncheckAllClonesDebtors(); contextMenuOpenFlag = false">
            <span>Снять выделения</span>
          </div>
          <div class="context-menu__separator"></div>
          <div class="context-menu__item" :disabled="!checkedPreTrialDebtorsCount.length" @click="printItem(); contextMenuOpenFlag = false">
            <span>Печать</span>
          </div>
        </div>
      </template>

    </ur-table>

    <transition name="fade">
      <epc-modal v-model="printEPCModal" @print="runModuleAction" />
    </transition>

    <transition name="fade">
      <egrn-modal v-model="modals.egrnModal" @print="getApplicationDischarge" />
    </transition>

    <!-- <transition name="fade">
      <payment-form-modal v-model="modals.PaymentFormModal" @print="printPaymentForm($event)" />
    </transition> -->

  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import search     from './components/Search';
  import hotButtons from '@/components/elements/HotButtons';
  import EPC        from './components/EPC';
  import EPCModal   from './components/EPCModalNew';
  import EGRNModal  from './components/modals/EGRNModal';
  import PaymentFormModal  from './components/modals/PaymentFormModal';

  import cloneDeep from 'lodash/cloneDeep';

  import isEmpty from "lodash/isEmpty"
  
  import { progress } from '@/mixins/progress-toaster'

  export default {
    components: {
      'hot-buttons': hotButtons,
      'search': search,
      'epc': EPC,
      'epc-modal': EPCModal,
      'egrn-modal': EGRNModal,
      'payment-form-modal': PaymentFormModal,
    },
    mixins: [progress],
    data () {
      return {
        // initialized: false
        searchPanelState: false,
        counterUpdate: 0,
        debtorsPreTrialProceedingsInner: [],
        debtorsClone: [],
        contextMenuOpenFlag: false,
        currentOpen: null,
        updateTable: 0,
        printModal: false,
        printEPCModal: false,

        currentAction: '',
        printType: 'open',

        mergeTemplateProgress: 0,

        checkboxKey: 0,

        hasServices: false,

        egrn: {
          Transfer: false,
          Request: true
        },

        modals: {
          egrnModal: false,
          SetOfChargesModal: false,
          PaymentFormModal: false
        }
      }
    },
    mounted() {
        events.$on('egrnrighttransfer', data => {
          this.egrn.Transfer = data.egrnRightsTrasnfer
          this.egrn.Request = data.egrnRequest
        }) 
        setTimeout(() => {
          console.log(this.$store.state.debtors.debtorsNull)
            if (this.$store.state.debtors.debtorsNull == true) {
              this.setPopupComponent({component: 'NoneDebtorInfo'})
            } 
          }, 1000)
      // this.window.onload = function () {
      //   paradocsWidget.init("77ebd206-9280-4f9c-b8de-f63a7cc5c448").then(function () {
      //     console.log('init paradocs')
      //   });
      // };
      // 
      if (!this.percentLoader.status) {
        this.combinedRequests({module: 'pretrial'})
      }
    },
    watch: {
      debtorsPreTrialProceedings: {
        immediate: true,
        deep: true,
        handler(val) {
          this.debtorsPreTrialProceedingsInner = this.debtorsPreTrialProceedings;
          
        }
      },
      printModal: {
        handler(val) {
          if(val === false) {
            this.hasServices = false
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'savePreTrialProceedingsTableColumns',
        'getDebtorsPreTrialProceedingsList',
        'updatePreTrialProceedingsList',
        'combinedRequests',
        'setPopupComponent',
        'setCurrentPage',
        'setPopupState',
        'appLoadingChange',
        'getHotkeyStatuses',
        'searchDebtors',
        'mergePDF',
        'openDebtorData'
      ]),
      ...mapMutations([
        'uncheckAllPreTrialDebtors',
        'checkAllPreTrialDebtors',
        'checkPreTrialDebtor',
        'setInitialized'
      ]), 
       checkAllClonesDebtors () {
         this.checkAllPreTrialDebtors()
      },
       uncheckAllClonesDebtors () {
         this.uncheckAllPreTrialDebtors()
      },
      parseStatus(status) {
        if(typeof(status) === 'string') {
          return status;
        } else {
          try {
            return JSON.parse(status.Status).find(s => s.selected).title
          } catch (e) {
            return status.Status;
          }
        }
      },
      parseSubStatus(status) {
        if(typeof(status) === 'string') {
          return status;
        } else {
          try {
            let _status = JSON.parse(status.Status).find(s => s.selected);
            // debugger
            return _status.subStatuses.length > 0 && _status.subStatuses.find(s => s.selected).title || '';
          } catch (e) {
            // debugger
            return ''
          }
        }
      },
      rowActionHandler({ row, i}) {
        // ПОТОМ ВЕРНУТЬ
        // this.openDebtorData({data:row, type: 'pretrial'})
        // this.setPopupComponent({ component: 'debtor-data', params: row });
      },
      /**
       * Сохранить настройки таблицы
       * @param { itemsPerPage, items}
       */
      async updateColumns ({ itemsPerPage, items }) {
        await this.savePreTrialProceedingsTableColumns({ items, itemsPerPage });
        this.updatePreTrialProceedingsList();
      },
      /**
       * Обработчик события check в заголовке таблицы задолжников
       */
      handlerHeaderCheckbox () {
        this.checkedPreTrialDebtorsCount === this.allDebtorsInPageCount ? this.uncheckAllPreTrialDebtors() : this.checkAllPreTrialDebtors()
      },
      /**
       *  Обработчик события check в ячейке таблицы задолжников
       */
      async handlerCellCheckbox (item, index) {
       await this.checkPreTrialDebtor({id: item._id, module: 0});
       
       if (this.$store.state.debtors.sortValue != null) {
         let sortValue = cloneDeep(this.$store.state.debtors.sortValue)
        events.$emit('reActiveSort', sortValue);
       }
      //  console.log(this.$store.state.debtors.sortValue)  
      },
      /**
       * Обработчик пагинации
       */
      changePageHandler(e) {
        if(this.debtorFiltered) {
          this.setCurrentPage(e);
          this.searchDebtors();
        } else {
          this.setCurrentPage(e); // установить текущую страницу
          setTimeout(() => {
            this.getDebtorsPreTrialProceedingsList({debtInPage:this.shownDebtors}); // загрузить список должников
          }, 1000)                
          
        }
      },
      /**
       * Открыть модальное окно "Изменить статус должников"
       */
      openPopupForChangeStatus (event) {
        if (event === 'all') {
          // this.setPopupComponent({ component: 'popupChangeStatusDebtor', all: true })
          this.changeStatus({ row: null });
        }
      },
      /**
       * Изменить статус одного должника или выбранных должников
       */
      changeStatus({ row = null }) {
        const checkedPreTrialDebtors = this.checkedPreTrialDebtors && this.checkedPreTrialDebtors.length > 1 && cloneDeep(this.checkedPreTrialDebtors) || [];
        const debtors = (checkedPreTrialDebtors.length > 0 && checkedPreTrialDebtors) || ( !isEmpty(row) && [row]);
        this.setPopupComponent ({
          component: 'popupChangeStatusDebtor',
          one: true,
          debtors: debtors,
          overflow: false,
        })
      },
      /**
       * Сортировка
       */
      sortHandler(e) {
        let items = [];
        switch (e.sortDirection) {
          case 'desc':
            items = this.debtorsPreTrialProceedingsInner.sort((a, b) => {
              return (b[e.key] - a[e.key]);
            })
            break;

          case 'asc':
            items = this.debtorsPreTrialProceedingsInner.sort((a, b) => {
              return (a[e.key] - b[e.key]);
            })
            break;

          case 'none':
            items = this.debtorsPreTrialProceedingsInner.sort(() => {
              return 0.5 - Math.random();
            })
            break;
        }
        this.debtorsPreTrialProceedingsInner = items;
      },
      // поиск
      toggleSearchPanel() {
        this.searchPanelState = !this.searchPanelState;
      },
      /**
       * Запуск action'a из родителя
       */
      runModuleAction(e = null) {
        const { action, data } = this.currentAction;
        console.log(this.currentAction)
        this[action](e);
        this.printModal = false;
        this.printEPCModal = false;
      },
      /**
       * Обработчик события selectAction компонента <main-select/>
       * @param e функция/action
       */
      runActionFromIconHandler (e) {
        // console.log('runActionFromIconHandler', e);
        // if(e.action === "printStatementsJudicalModule" && this.$store.getters.getInfoINNSharedData.Balance <= 0) {
        //   this.$router.push('/panel?tab=2');          
        //   return
        // }
        if(this.checkedPreTrialDebtors.length <= 0) {
          this.setPopupComponent({
            component: 'popupAlert',
            params: {
              title: 'Действие отмененно',
              text: 'Выберите пожалуйста должников'
            }
          });
        //} else if (e.action === 'printDigitalSignature') {
          // this.printDigitalSignature();
          // return;
        } else if(e.action === 'formAnApplication' ) {
          this.formAnApplication();
          return;
        } else {
          if(e.action === 'printSetOfCharges') {
            this.setPopupComponent({ component: 'debtor-set-of-charges-print-modal', params: { checkedPreTrialDebtors: this.checkedPreTrialDebtors } });
            // this.modals.SetOfChargesModal = true
          } else if(e.action === 'printPaymentForm') {
            this.modals.PaymentFormModal = true
          } else if(e.action === 'printApplicationDischarge') {
            this.modals.egrnModal = true
          } else if(e.action === 'printStatementsJudicalModule') {
            
            this.setPopupComponent({ component: 'debtor-documents-print-modal', params: { checkedPreTrialDebtors: this.checkedPreTrialDebtors } });
            // this.hasServices = true;
            // this.printModal = true;
          } else if(e.action === 'printStatementsJudicalModuleChel') {
            this.hasServices = true;
            this.printModal = true;
          } else if(e.action === 'printStatementsJudicalModuleChelDoly') {
            this.hasServices = true;
            this.printModal = true;
          } else if(e.action === 'printDigitalSignature') {
            // this.hasServices = true;
            debugger
            this.printEPCModal = true;
          } else if (e.action === 'sendSMS') {
            this.setPopupComponent({ component: 'notify-modal', params: { checkDebtors: this.checkedPreTrialDebtors, mode: 'sms' }})
          } else if (e.action === 'sendVoiceMsg') {
            this.setPopupComponent({ component: 'notify-modal', params: { checkDebtors: this.checkedPreTrialDebtors, mode: 'voice' }})
          } else {
            this.printModal = true;
          }
          this.currentAction = e;
        }
      },
      /**
       * Запросить данные ЕГРН
       */
      getApplicationDischarge() {
        this.checkedPreTrialDebtors.forEach(async (debtor) => {
          if (this.egrn.Request === true && this.egrn.Transfer === true) {
            await this.$store.dispatch('getApplicationDischange', { 
              id: debtor.debtor.pk,
              requestEgrn: 'data'
            })
            await this.$store.dispatch('getApplicationDischange', { 
              id: debtor.debtor.pk,
              requestEgrn: 'rights'
            })
          }
          if ( this.egrn.Transfer && !this.egrn.Request) {
            await this.$store.dispatch('getApplicationDischange', { 
              id: debtor.debtor.pk,
              requestEgrn: 'rights'
            })
          } else if ( this.egrn.Request && !this.egrn.Transfer) {
            await this.$store.dispatch('getApplicationDischange', { 
              id: debtor.debtor.pk,
              requestEgrn: 'data'
            })
          }  
          this.egrn.Transfer = false
          this.egrn.Request = false
        })
      },
      

      /**
       * Печать формы оплаты ПД-4сб ("печать бланков" в интерфейсе)
       */
      async printPaymentForm (format) {
         this.$store.dispatch('printPaymentForm', {
          debtors: this.checkedPreTrialDebtors,
          company: this.getDefaultCompany,
          format: format
        });
        this.modals.PaymentFormModal = false;

      },
      prepareBase64(str) {
        let result = str.replace(/=/g, "*"); // заменяем = на *
        result = result.split(',')[1];
        return result;
      },
      /**
       * ЭПЦ
       */
      async printDigitalSignature(format) {
        let cloned = cloneDeep(this.checkedPreTrialDebtors);
        cloned.forEach(d => d.Accrued = Object.values(d.Accrued));
        this.$store.dispatch('printDigitalSignature', {
          debtors: cloned,
          company: this.getDefaultCompany,
          format: format
        });
      },
      /**
       * Печать судебного решения
       */
      printCourtOrder(format) {

        let cloned = cloneDeep(this.checkedPreTrialDebtors);
        cloned.forEach(d => d.Accrued = Object.values(d.Accrued));
        cloned.forEach(d => d.Paid = Object.values(d.Paid));
        cloned.forEach(d => d.Debt = Object.values(d.Debt));
        cloned.forEach(d => d.Peni = Object.values(d.Peni));
       
        cloned.forEach(d => {
          d.Peni = d.Peni.filter(d => { 
            return !isEmpty(d)
          });
        })
        //  console.log(cloned)
        // debugger
        this.$store.dispatch('printCourtOrder', {
          debtors: cloned,
          company: this.getDefaultCompany,
          format: format
        });
      },
      /**
       * Вызов контекстного меню
       */
      contextMenuOpen ({ i, event }) { // контекстное меню
        event.preventDefault()
        this.currentOpen = i
        this.$refs.contextMenu.style.left = event.clientX + 'px'
        this.$refs.contextMenu.style.top = event.clientY + 'px'
        this.contextMenuOpenFlag = true
        const _this = this
        document.addEventListener('click', function setEventListener (e) {
          if (e.target.parentNode && e.target.parentNode.classList[0] !== 'context-menu__item') {
            _this.contextMenuOpenFlag = false
            document.removeEventListener('click', _this.setEventListener)
          }
        })
      },
      /**
       * вызов печати из контекстного меню
       */
      printItem() {
        const debtor = this.debtorsPreTrialProceedings[this.currentOpen];
        this.printStatementsJudicalModule([debtor]);
      },
      formAnApplication() {
        if(this.checkedPreTrialDebtors.length === 0) return;
        const payload = {};
        this.checkedPreTrialDebtors.forEach((d, index) => payload[index] = d.RashSchet)
        this.$store.dispatch('createApplication', payload);
      }
    },
    computed: {
      ...mapGetters([
        'allDebtors',
        'shownPreTrialDebtors',
        'preTrialProceedingsTableColumns',
        'preTrialProceedingsTableColumnsVisible',
        'debtorsPreTrialProceedings',
        'debtorsPreTrialProceedingsInPage', // количество задолжников на странице В НАСТРОЙКАХ
        'debtorsPreTrialCountInCurrentPage', // на текущей странице
        'checkedPreTrialDebtorsCount', // количество отмеченных чекбоксов
        'preTrialPages',
        'preTrialDebtorsData',
        'initialized',
        'getDefaultCompany',
        'checkedPreTrialDebtors',
        'debtorFiltered',
        'debtorPaidColNames',
        'generatingTemplateProgress',
        'currentPage',
        'percentLoader',
        'shownPreTrialDebtors'
      ]),

      /**
       * Обработчик по проверки статуса на наличие
       * @param {String} status статус должника
       * @returns {String} Возвращает статус должника после проверки и определения `undefined`
       */
      filterStatusError (status) {
        let resultStatus = typeof status === 'undefined' ? 'Новый' : status
        return resultStatus
      },


      allDebtorsInPageCount () {
        return this.debtorsPreTrialProceedingsInner.length
      },
      /**
       * Форматирует массив для колонок таблицы
       * @returns { Array }
       */
      formattedColumns () {
        return this.preTrialProceedingsTableColumnsVisible.map(i => {
          return {
            title: i.alias,
            key: i.name,
            serverKey: i.serverName,
            sortable: i.isSum
          }
        });
      },
      displayColumnsSum(state) {
        return state.preTrialProceedingsTableColumns.filter(item => item.isSum && item.views.view);
      }
    },
    
  }
</script>

<style scoped lang="scss">
  >>> table > tbody > tr:nth-of-type(odd) {
    background-color: #f6faff;
  }

  >>> table > thead > th:nth-child(1) {
    width: 36px;
  }

  >>> table > tbody > tr > td:nth-child(1) {
    width: 36px;
  }

  >>> .table__row--is-total > td:nth-child(1) {
    width: 44px !important;
  }

  .exchange-toaster {
    position: fixed;
    top: 80px;
    right: 32px;
    color: white;
    &--success {
      color: red;
    }

  &--loader {
     border-radius: 8px;
     background: #455185;
     margin: 0;
     padding: 14px;
     word-break: break-all;
     position: relative;
     width: 186px;

  .loader-inner, .loader-outer {
    position: absolute;
    width: calc(100% - 32px);
    height: 4px;
    bottom: 8px;
  }

  .loader-inner {
    z-index: 10;
    background: #475cff;
  }

  .loader-outer {
    background: #1B275F;
  }
  }
  }
</style>
