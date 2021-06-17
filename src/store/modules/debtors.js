// import debtors from '@/assets/data/debtors'
import moment from 'moment';
import axios from 'axios';
import { baseURL } from '@/settings/config'
import qs from 'qs'
import cloneDeep from 'lodash/cloneDeep';
export default {
  state: () => ( {
    /**
     * Настройка колонок таблицы задолжников модуль "судебная практика"
     */
    courtProceedingsTableColumns: [
      { serverName: 'status',           name: 'Status',     alias: ' ',        views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px' },
      { serverName: 'validation',       name: 'checked',    alias: 'Выделить всех',         views: { current: true, view: true, fixed: true } },
      { serverName: 'personal_account', name: 'RashSchet',  alias: '№ ЛС',          views: { current: true, view: false, fixed: true }, width: '90px' },
      // { name: 'bussines', alias: '№ Дела', views: { current: false, view: false, default: true, select: false } },
      { serverName: 'debtor_main_profile.phone_number',     name: 'phone',          alias: 'Телефон',           views: { current: true, view: true, fixed: false, default: true, select: false }, width: '140px' },
      { serverName: 'full_name',        name: 'FIO',        alias: 'ФИО',           views: { current: true, view: true, fixed: false, default: true, select: false }, width: '240px' },
      { serverName: 'address_debtor',   name: 'Adres',      alias: 'Адрес',         views: { current: true, view: true, fixed: false, default: true, select: false }, width: '180px' }, // Adres - эта дичь не моя, это такое апи
      { serverName: 'opening_balance',  name: 'AccruedCsv', alias: 'Начислено',     views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true },
      { serverName: 'paid_up',          name: 'PaidCsv',    alias: 'Оплачено',      views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true },
      { serverName: 'debt',             name: 'TotalDebt',  alias: 'Задолженность', views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true },
      { serverName: 'penalty',          name: 'PeniCsv',    alias: 'Пеня',          views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true },
      { serverName: 'fee.individual_order', name: 'StateDuty',  alias: 'Пошлина',       views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true }
    ],

    /**
     * Настройка колонок таблицы задолжников модуль "Досудебная практика"
     */
    preTrialProceedingsTableColumns: [
      { serverName: 'status',           name: 'Status',     alias: ' ',        views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px' },
      { serverName: 'validation',       name: 'checked',    alias: 'Выделить всех',         views: { current: true, view: true, fixed: true } },
      { serverName: 'personal_account', name: 'RashSchet',  alias: '№ ЛС',          views: { current: true, view: false, fixed: true }, width: '90px' },
      // { name: 'bussines', alias: '№ Дела', views: { current: false, view: false, default: true, select: false } },
      // { serverName: 'debtor_main_profile.phone_number',        name: 'phone',        alias: 'Телефон',           views: { current: true, view: true, fixed: false, default: true, select: false }, width: '140px' },
      { serverName: 'full_name',        name: 'FIO',        alias: 'ФИО',           views: { current: true, view: true, fixed: false, default: true, select: false }, width: '240px' },
      { serverName: 'address_debtor',   name: 'Adres',      alias: 'Адрес',         views: { current: true, view: true, fixed: false, default: true, select: false }, width: '180px' },
      { serverName: 'opening_balance',  name: 'AccruedCsv', alias: 'Начислено',     views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true },
      { serverName: 'paid_up',          name: 'PaidCsv',    alias: 'Оплачено',      views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true },
      { serverName: 'debt',             name: 'TotalDebt',  alias: 'Задолженность', views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true },
      { serverName: 'penalty',          name: 'PeniCsv',    alias: 'Пеня',          views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true },
      // { serverName: 'peni_calc_395',    name: 'StateDuty',  alias: 'Пошлина',       views: { current: true, view: true, fixed: false, default: true, select: false }, width: '100px', isSum: true }
    ],
    /**
     * Список должников "судебной практики"
     */
    debtorsCourtProceedings: [],

    /**
     * Список должников "доусдебная практика"
     */
    debtorsPreTrialProceedings: [],

    /**
     * Количество отмеченных элементов/должников
     */
    sortValue: null,
    checkedDebtorsCount: 0,
    //
    debtorsData: { AccruedCsv: 0, PaidCsv: 0, TotalDebt: 0, PeniCsv: 0, StateDuty: 0, collected: 0 },
    allDebtors: 0,
    debtorsNull: false,
    /**
     * Количество задолжников на странице
     */
    debtorsCourtProceedingsInPage: 501, // Ставим максимально значение (Ибо именно его обробатыват в первую очередь)
    debtorsPreTrialProceedingsInPage: 501, 
    // хз зачем
    debtorsInPageDefault: 50,
    /**
     * Текущая страница
     */
    currentPage: 1,
    /**
     * Уже посещенные страницы
     */
    visitedPages: [],
    /**
     * Уже посещенные страницы в поиске (дублирую код, потому что бекендер запилил поиск и загрузку разными урлами и ему лень переделывать)
     */
    visitedPagesInSearch: [],
    /**
     * Список терминов родственных соотношений
     */
    listFamilyRelations: [],
    /**
     * Ценовые колонки таблицы
     */
    debtorPaidColNames: ['AccruedCsv', 'PaidCsv', 'TotalDebt', 'PeniCsv', 'StateDuty', 'collected'],

    initialized: false,
    /**
     * Флажок для должников из поиска
     */
    debtorFiltered: false,

    /**
     * Объект формы поиска
     */
    searchForm: {
      AddressFilter: '',
      NumberFilter: '',
      StatusFilter: '',
      FIOFilter: '',
      DebtFromFilter: '',
      DebtToFilter: '',
      Application: ''
    },
    /**
     * Список Приложение
     */
    applicationList: []
  }),
  mutations: {
    setDebtorsStatus (state, payload) {
      state.debtorsNull = payload
    },
    setSortValue( state, payload ) {
      state.sortValue = payload
    },
    updateCourtProceedingsTableColumns(state, data) {
      state.courtProceedingsTableColumns = data;
    },
    updatePreTrialProceedingsTableColumns (state, data) {
      state.preTrialProceedingsTableColumns = data
    },
    setCurrentPage (state, payload) {
      state.currentPage = payload
    },
    // default
    addPageToVisitedPages (state, payload) {
      state.visitedPages.push(payload);
    },
    clearVisitedPages (state) {
      state.visitedPages = [];
    },
    // search
    addPageToVisitedPagesInSearch (state, payload) {
      state.visitedPagesInSearch.push(payload);
    },
    clearVisitedPagesInSearch (state) {
      state.visitedPagesInSearch = [];
    },
    setAllDebtors (state, payload) {
      state.allDebtors = payload
    },
    // установить кол-во элементов на странице
    setDebtorsInPage (state, payload) {
      state.currentPage = 1
      state.debtorsCourtProceedingsInPage = payload
    },

    setDebtorsPreTrialInPage (state, payload) {
      state.currentPage = 1
      state.debtorsPreTrialProceedingsInPage = payload
    },

    getNewStatusChecked (state, payload) {
      if (state.DebtorsModuleActive === -1) return false
      state.debtors[state.DebtorsModuleActive].forEach(elem => {
        if (elem.checked) {
          elem.Status = payload
          elem.checked = false
          state.debtIsChecked--
        }
      })
    },
    getNewStatusOne (state, { id, status }) {
        state.debtorsCourtProceedings.find(elem => elem._id === id).Status = status;  
    },

    // ================== блок чекбоксов ==========================
    /**
     * Выделить эелемент таблицы/отметить задолжника
     * @param state
     * @param id - идентификатор колонки/задолжника
     * @param index - Индекс задолжника в таблице
     */
    checkDebtor (state, payload) {
      const { id } = payload
      let elem;
      elem = state.debtorsCourtProceedings.find(el => el._id === id);
      
      elem.checked = !elem.checked;
      elem.checked ? state.checkedDebtorsCount++ : state.checkedDebtorsCount--  
    },
    checkPreTrialDebtor ( state, payload ) {
      const { id } = payload

      let elem;
      elem = state.debtorsPreTrialProceedings.find(el => el._id === id);        

      elem.checked = !elem.checked;
      elem.checked ? state.checkedDebtorsCount++ : state.checkedDebtorsCount-- 
    },
    /**
     * Снять выделение со всех элементов
     */
    uncheckAllDebtors (state) {
      const debtorsIds = cloneDeep(state.debtorsCourtProceedings).filter(el => {
        return el._id > (state.currentPage - 1) * state.debtorsCourtProceedingsInPage && el._id <= state.currentPage * state.debtorsCourtProceedingsInPage;
      }).map(d => d._id);

      state.debtorsCourtProceedings.forEach(elem => {
        if(debtorsIds.some(id => id === elem._id) && elem.checked === true) {
          elem.checked = false;
          state.checkedDebtorsCount--;
        }
      })
    },
    uncheckAllPreTrialDebtors (state) {
      const debtorsIds = cloneDeep(state.debtorsPreTrialProceedings).filter(el => {
        return el._id > (state.currentPage - 1) * state.debtorsPreTrialProceedingsInPage && el._id <= state.currentPage * state.debtorsPreTrialProceedingsInPage;
      }).map(d => d._id);

      state.debtorsPreTrialProceedings.forEach(elem => {
        if(debtorsIds.some(id => id === elem._id) && elem.checked === true) {
          elem.checked = false;
          state.checkedDebtorsCount--;
        }
      })
    },
    /**
     * Выделить все элементы списка
     * @param state
     */
    checkAllDebtors (state) {
      const debtorsIds = cloneDeep(state.debtorsCourtProceedings).filter(el => {
        return el._id > (state.currentPage - 1) * state.debtorsCourtProceedingsInPage && el._id <= state.currentPage * state.debtorsCourtProceedingsInPage;
      }).map(d => d._id);
      state.debtorsCourtProceedings.forEach(elem => {
        if (debtorsIds.some(id => id === elem._id) && elem.checked === false) {
          elem.checked = true;
          state.checkedDebtorsCount++;
        }
      });
    },

    checkAllPreTrialDebtors (state) {
      const debtorsIds = cloneDeep(state.debtorsPreTrialProceedings).filter(el => {
        return el._id > (state.currentPage - 1) * state.debtorsPreTrialProceedingsInPage && el._id <= state.currentPage * state.debtorsPreTrialProceedingsInPage;
      }).map(d => d._id);
      state.debtorsPreTrialProceedings.forEach(elem => {
        if (debtorsIds.some(id => id === elem._id) && elem.checked === false) {
          elem.checked = true;
          state.checkedDebtorsCount++;
        }
      });
    },
    // ================== блок чекбоксов конец =====================

    // очистить массив задолжников
    clearListDebtors (state) {
      // const { module } = payload
      // if (module === 0) {
        state.debtorsCourtProceedings = []
      // } else if ( module === 1) {
        state.debtorsPreTrialProceedings = []
      // }
    },

    setListPreTrialProceedingsDebtors (state, payload) {
      let index = 1
      state.debtorsPreTrialProceedings = []
        for (const key in payload) {
          // _id = 
          let newDebtor = {
            _id: (state.debtorsPreTrialProceedingsInPage * (state.currentPage - 1)) + index,
            checked: false
          }
          // debugger
          for (const _key in payload[key]) {
            if (_key !== 'Info') {
              newDebtor[_key] = payload[key][_key]
            } else {
              newDebtor = Object.assign(newDebtor, payload[key][_key])
              // newDebtor.Status = payload[key][_key].StatusJudicialPractice
            }
          }
          state.debtorsPreTrialProceedings.push(newDebtor)
          index++
        }
    },

    setListСourtProceedingsDebtors (state, payload) {
      let index = 1
      state.debtorsCourtProceedings = []
        for (const key in payload) {
          // _id = 
          let newDebtor = {
            _id: (state.debtorsCourtProceedingsInPage * (state.currentPage - 1)) + index,
            checked: false
          }
          // debugger
          for (const _key in payload[key]) {
            if (_key !== 'Info') {
              newDebtor[_key] = payload[key][_key]
            } else {
              newDebtor = Object.assign(newDebtor, payload[key][_key])
              // newDebtor.Status = payload[key][_key].StatusJudicialPractice
            }
          }
          state.debtorsCourtProceedings.push(newDebtor)
          index++
        }
      
    },
    setDebtorsData (state, payload) {
      state.debtorsData.AccruedCsv = payload.AllAccruedCsv
      state.debtorsData.PaidCsv = payload.AllPaidCsv
      state.debtorsData.PeniCsv = payload.AllPeniCsv
      state.debtorsData.StateDuty = payload.AllStateDuty
      state.debtorsData.TotalDebt = payload.AllTotalDebt
    },
    editDebtorData (state, payload) {
      const debtor = state.debtorsCourtProceedings.find(el => el.RashSchet === payload.CurrentDebtor)
      for (const key in payload) {
        if(debtor[key]) {
          debtor[key] = payload[key]
        }
      }
    },
    editDebtorPreTrialData (state, payload) {
      const debtor = state.debtorsPreTrialProceedings.find(el => el.RashSchet === payload.CurrentDebtor)
      for (const key in payload) {
        if(debtor[key]) {
          debtor[key] = payload[key]
        }
      }
    },
    setListFamilyRelations (state, data) {
      state.listFamilyRelations = data;
    },

    setInitialized(state, data) {
      state.initialized = data;
    },

    setDebtorFiltered (state, data) {
      state.debtorFiltered = data;

    },

    setSearchField (state, data) {
      state.searchForm[data.key] = data.value
    },

    clearSearchFields (state, data) {
      for(const key in state.searchForm) {
        state.searchForm[key] = '';
      }
    },

    updateDebtorResidents(state, payload) {
      const { RashSchet, newArray } = payload;
      const debtor = state.debtorsCourtProceedings.find(i => i.RashSchet === RashSchet);
      debtor.ListResidents = newArray;
    },

    addHistoryNote(state, payload) {
      const { PaymentAccount, Names, DataTime, Status } = payload;
      const debtor = state.debtorsCourtProceedings.find(d => d.RashSchet == PaymentAccount);
      const keys = Object.keys(debtor.FullHistoryActions); // []
      const key = keys.length === 0 ? 0 : Number(keys[keys.length - 1]) + 1;
      const newNote = { [key]: {
          DataTime: DataTime,
          Names: Names,
          Status: Status
      }}
      const newHistoryObject = Object.assign({}, debtor.FullHistoryActions, newNote);
      debtor.FullHistoryActions = newHistoryObject;
    },
    
    addDebtorFile(state, payload) {
      const { fileObject, PaymentAccount } = payload;
      const debtor = state.debtorsCourtProceedings.find(d => d.RashSchet == PaymentAccount);
      let files = debtor.AllFileDebt;

      if(payload.PassportOffice) files = debtor.AllFileDebtPassportOffice;
      if(payload.FromEgrn) files = debtor.AllFileDebtFromEgrn;
      if(payload.PaymentOrderStateDuty) files = debtor.AllFileDebtPaymentOrderStateDuty;
      const keys = Object.keys(files);
      const key = keys.length === 0 ? 0 : Number(keys[keys.length - 1]) + 1;
      const newFile = { [key]: fileObject }
      const newFilesObject = Object.assign({}, files, newFile);
      if(payload.PassportOffice) {
        debtor.AllFileDebtPassportOffice = newFilesObject;
      } else if(payload.FromEgrn) {
        debtor.AllFileDebtFromEgrn = newFilesObject;
      } else if ( payload.PaymentOrderStateDuty ) {
        debtor.AllFileDebtPaymentOrderStateDuty = newFilesObject;
      } else {
        debtor.AllFileDebt = newFilesObject;
      }
    },
    setApplicationList(state, payload) {
      state.applicationList = payload;
    }
  },

  actions: {
    
    /**
     * Сохраняет/обновляет сортировку таблицы должников
     * @param { state, commit, getters, dispatch }
     * @param payload
     */
    sortData ({state, commit}, payload) {
      commit('setSortValue', payload)
      // console.log(payload)
    },
    /**
     * Сохраняет/обновляет колонки таблицы задолжников модуль "судебная практика"
     * @param { state, commit, getters, dispatch }
     * @param payload
     */
    async saveCourtProceedingsTableColumns ({ state, commit, getters, dispatch }, { items, itemsPerPage }) {
      dispatch('appLoadingChange', true, { root: true });
      dispatch('setDebtorsInPage', itemsPerPage);
      const statuses = await dispatch('_prepareSavingCourtProceedingsTableColumns', items);
      let companyId = localStorage.getItem('defaultCompany')
      axios({
        url: baseURL + `/api/companies/${companyId}/`,
        method: 'PATCH',
        data: {
          debtor_per_page: itemsPerPage,
        }
      }).then(res => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('perPage', itemsPerPage)
              } 
      }).catch(e => {
        console.error('ошибка запроса колонок таблицы', e);
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },
    async savePreTrialProceedingsTableColumns ({state, dispatch}, {items, itemsPerPage}) {
      dispatch('appLoadingChange', true, { root: true });
      dispatch('setDebtorsPreTrialInPage', itemsPerPage);
      let companyId = localStorage.getItem('defaultCompany')
      axios({
        url: baseURL + `/api/companies/${companyId}/`,
        method: 'PATCH',
        data: {
          debtor_per_page: itemsPerPage,
        }
      }).then(res => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('perPage', itemsPerPage)
              } 
      }).catch(e => {
        console.error('ошибка запроса колонок таблицы', e);
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    }, 
    /**
     * Форматирует таблицу после запроса с api
     * @private
     */
    _prepareCourtProceedingsTableColumns({ state }, payload) {
      const columns = cloneDeep(state.courtProceedingsTableColumns);
      const key = payload
      for (let i = 0; i >= key.length; i++) {
        const item = columns.find(i => i.serverName === key[i]);
        console.log(key)
        if (item && !item.views.fixed) {
          item.views.view = Boolean(parseInt(key[i]));
          // item.views.current = Boolean(parseInt(payload[key]));
        }
      }

      return columns;
    },
    _preparePreTrialProceedingsTableColumns ({state}, payload) {
      const columns = cloneDeep(state.preTrialProceedingsTableColumns);
      const key = payload
      for (let i = 0; i >= key.length; i++) {
        const item = columns.find(i => i.serverName === key[i]);
        if (item && !item.views.fixed) {
          item.views.view = Boolean(parseInt(key[i]));
        }
      }
      return columns;
    },
    /**
     * Для каждого модуля используем свой обработчик (на случай изменений)
     * @param state 
     * @param {*} payload 
     */
    _prepareSavingPreTrialProceedingsTableColumns ({state}, payload) {
      const statuses = {};
      payload.forEach(column => statuses[column.serverName] = +column);
      return statuses;
    },
    /**
     * Форматирует таблицу перед сохранением api
     * @param { state }
     * @param payload
     */
    _prepareSavingCourtProceedingsTableColumns({ state }, payload) {
      const statuses = {};
      payload.forEach(column => statuses[column.serverName] = +column);
      return statuses;
    },
    /*
    |--------------------------------------------------------------------------
    | API совмещеных запросов (оптимизация) 
    |--------------------------------------------------------------------------
    */
    combinedRequests ({ dispatch, commit }, payload) {
      // dispatch('appLoadingChange', true, { root: true });
      let companyId = localStorage.getItem('defaultCompany')
      if (companyId === null) {
        setTimeout( () => {
          companyId = localStorage.getItem('defaultCompany')
        }, 1000)
      }
      let module = 'pretrial'
      if (payload) {
        module = payload.module 
      }
      // console.log(module)
      axios({
        method: 'GET',
        params: {
          company_id: companyId,
          production_type: module,
          limit: 100,
          offset: `${1}`
        },
        url: baseURL + '/api/debtors-data/'
      })
      .then ( async res => {
        // commit('setListOfJudicialDistricts', res.listOfJudicialDistricts);
        // commit('setListsOfStatusesDebtors', res.listCourtPractice); // СТАТУСЫ 
        // commit('setApplicationList', Object.values(res.listApplication));
        // commit('setCompanyEmployees', res.listEmployee);
        // commit('setCompaniesNamesLists', res.listAll);
        // commit('setAllMessages', res.events);
        // commit('setDesktopWidgetCoords', res.listWidgetCoord);
        // commit('checkServicesTab', res.servicesTab);
          commit('setAllDebtors', res.data.count)
          dispatch('getCompanyUserBalance')
        // commit('setDebtorsData', res.statusCalculationPeni.JudicialPractice)
        const columns = res.data.results;
        if (module === 'pretrial') {
          commit('setListPreTrialProceedingsDebtors', res.data.results)
          events.$emit('preTrial', {status: true})
          if (columns.length > 0) {
            const formattedColumns = await dispatch('_preparePreTrialProceedingsTableColumns', columns);
            commit('updatePreTrialProceedingsTableColumns', formattedColumns);
          }
        } else if (module === 'judicial') {
          commit('setListСourtProceedingsDebtors', res.data.results)
          events.$emit('courtPr', {status: true})
          if (columns.length > 0) {
            const formattedColumns = await dispatch('_prepareCourtProceedingsTableColumns', columns);
            commit('updateCourtProceedingsTableColumns', formattedColumns);
          }
        }
      })
      .finally(() => {
        // this._vm.$toast.open({
        //   message: 'Список должников обновлен',
        //   type: 'success',
        //   duration: 5000,
        //   dismissible: true,
        //   position: 'top-right'
        // })
        dispatch('appLoadingChange', false, { root: true });
      }) 
    },
    /**
    *  Полечение настроек организации
    */
    getUserSetting ( { dispatch } ) {
      return new Promise ((resolve, reject) => {
        $http({
          command: '/user_settings/main_setting/',
          method: 'GET'
        })
        .then ( resp => {
          // console.log(resp)
          resolve({status: true})
        })
        .catch( err => {
          console.log(err)
          reject({status: false})
        })
      })
    },

    /*
    |--------------------------------------------------------------------------
    | API списка задолжников модуль "судебная практика"
    |--------------------------------------------------------------------------
    */
    /**
     * Получение спика должников
     * @param { dispatch, getters, commit}
     * @returns {Promise}
     */
    getDebtorsCourtProceedingsList ({ dispatch, getters, commit, state, debtInPage }, force = false, payload ) {
      dispatch('appLoadingChange', true, { root: true });
      commit('setDebtorFiltered', false);
      
      if(state.visitedPages[0] && state.visitedPages.some(p => p === getters.currentPage) && !force) { // отменяет повторную загрузку
        dispatch('appLoadingChange', false, { root: true });
        return 
      }
      let companyId = localStorage.getItem('defaultCompany')
    
      return axios({
        method: 'GET',
        url: baseURL + '/api/debtors-data/',
        params: {
          production_type: 'judicial',
          company_id: companyId,
          limit: 100,
          offset: `${getters.currentPage}`
        }
      }).then( res => {
          let arrayDebtors = res.data.results
          
          commit('addPageToVisitedPages', getters.currentPage);
        
        if (res.data.results.length === 0) {
          commit('setDebtorsStatus', true)
        } else {
          commit('setListСourtProceedingsDebtors', arrayDebtors)
        }

      }).catch(e => {
        console.error(e);
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      });
    },

    getDebtorsPreTrialProceedingsList ({dispatch, getters, commit, state},  force = false) {
      dispatch('appLoadingChange', true, { root: true });
      commit('setDebtorFiltered', false);

      if(state.visitedPages[0] && state.visitedPages.some(p => p === getters.currentPage) && !force) { // отменяет повторную загрузку
        dispatch('appLoadingChange', false, { root: true });
        return 
      }
      let companyId = localStorage.getItem('defaultCompany')

      return axios({
        method: 'GET',
        url: baseURL + '/api/debtors-data/',
        params: {
          production_type: 'pretrial',
          company_id: companyId,
          limit: 100,
          offset: `${getters.currentPage}`
        }
      }).then( res => {
          let arrayDebtors = res.data
          
          commit('addPageToVisitedPages', getters.currentPage);
        
        if (res.data.length == 0) {
          commit('setDebtorsStatus', true)
        } else {
          commit('setListPreTrialProceedingsDebtors', arrayDebtors)
        }

      }).catch(e => {
        console.error(e);
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      });
    },

   async updatedDataOnScroll({getters, commit, state, dispatch}, payload) {
    let user, localPerPage;
    if ( typeof window !== 'undefined' ) {
      user = localStorage.getItem('user');
      localPerPage = localStorage.getItem('perPage')
      user = JSON.parse(user);
    }
      let debtorPerPage = user.user.EntriesPage
      if (localPerPage > 0) {
        debtorPerPage = localPerPage
      }
      let intDebtorPerPage = parseInt(debtorPerPage)
        if (payload == 60) {
            let intDebtorOnPage = parseInt(getters.debtorsCourtProceedingsInPage)
            // В конце добавляем число на которое будет увеличен массив должников на странице
            let countToLoad = state.debtorsCourtProceedings.length + 10 
            let arrayDebtorLength = state.debtorsCourtProceedings.length
            // let lastCStop = cloneDeep()
            // let lastCStart = cloneDeep()
            // Колчиство должников на странице не будет больше кол-ва выбранного пользователем 
            if ( countToLoad > intDebtorPerPage ) {
              countToLoad = intDebtorPerPage
              }
            if (countToLoad <= intDebtorPerPage) {
              // countToLoad = intDebtorPerPage
              if (arrayDebtorLength <= intDebtorPerPage) {
                // arrayDebtorLength = intDebtorPerPage
                if (arrayDebtorLength != intDebtorPerPage){
                  
                   await $http({
                      data:{
                        comand: 'ListDebtors',
                        CountStart: arrayDebtorLength,
                        CountStop: countToLoad,
                      }
                    }).then(res => {
                      commit('setListСourtProceedingsDebtors', res.result)
                    }).finally(() => {
                      // dispatch('appLoadingChange',false , { root: true });
                    })
                }
              } 
            } else {
              console.log('Load debtors: complete')
            }
            
            console.log(countToLoad)
        } 
      // console.log(payload)
    },

    renderingCourtProceedingsListScrolled({ dispatch }, payload ) {
      setTimeout(() => {
        dispatch('updatedDataOnScroll', payload)
      }, 1000)
    },
    /**
     * Функция не используется
     * @param {*} dispatch 
     * @param {*} payload 
     */
    renderingPreTrialProceedingsListScrolled ({dispatch}, payload) {
      // 
    },

    updateCourtProceedingsList ({ commit, dispatch }) {
      commit('clearListDebtors');
      commit('clearVisitedPages');
      commit('setCurrentPage', 1);
      commit('uncheckAllDebtors');
      dispatch('getDebtorsCourtProceedingsList');
    },

    updatePreTrialProceedingsList ({commit, dispatch}) {
      commit('clearListDebtors');
      commit('clearVisitedPages');
      commit('setCurrentPage', 1);
      commit('uncheckAllDebtors');
      dispatch('getDebtorsPreTrialProceedingsList');
    },

    /**
     * Поиск задолжников
     * @param { dispatch, commit }
     * @param payload
     */
    searchDebtors({ dispatch, commit, getters, state }) {
      dispatch('appLoadingChange', true, { root: true });

      commit('setDebtorFiltered', true); // флаг поиска - пагинация будет работать с данными поиска
      
      if(state.visitedPages[0] && state.visitedPages.some(p => p === getters.currentPage)) {
        dispatch('appLoadingChange', false, { root: true });
        return 
      }
      $http({
        data: {
          command: 'FindDebtor',
          CountStart: (getters.currentPage - 1) * getters.debtorsCourtProceedingsInPage,
          CountStop: (getters.currentPage - 1) * getters.debtorsCourtProceedingsInPage + getters.debtorsCourtProceedingsInPage,
          OrganizationId: 0,
          ...state.searchForm
        }
      }).then(res => {
        const ollDebt = res.result.OllDebt;
        commit('setAllDebtors', ollDebt);
        delete res.result.OllDebt;
        commit('addPageToVisitedPages', getters.currentPage);
        commit('setListСourtProceedingsDebtors', res.result)
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },

    searchPreTrialDebtors () {
      dispatch('appLoadingChange', true, { root: true });

      commit('setDebtorFiltered', true); // флаг поиска - пагинация будет работать с данными поиска
      
      if(state.visitedPages[0] && state.visitedPages.some(p => p === getters.currentPage)) {
        dispatch('appLoadingChange', false, { root: true });
        return 
      }
      $http({
        data: {
          command: 'FindDebtor',
          CountStart: (getters.currentPage - 1) * getters.debtorsPreTrialProceedingsInPage,
          CountStop: (getters.currentPage - 1) * getters.debtorsPreTrialProceedingsInPage + getters.debtorsPreTrialProceedingsInPage,
          OrganizationId: 0,
          ...state.searchForm
        }
      }).then(res => {
        const ollDebt = res.result.OllDebt;
        commit('setAllDebtors', ollDebt);
        delete res.result.OllDebt;
        commit('addPageToVisitedPages', getters.currentPage);
        commit('setListPreTrialProceedingsDebtors', res.result)
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },

    /**
     * Установить всех задолжников
     * @param {*} param0 
     * @param {*} payload 
     */
    setAllDebtors ({ commit }, payload) {
      commit('setAllDebtors', payload)
    },

    // ========== pagination =============
    setCurrentPage ({ dispatch, commit }, payload) {
      commit('setCurrentPage', payload)
    },
    //
    setDebtorsInPage ({ dispatch, commit }, payload) {
      // commit('clearListDebtors')
      commit('setDebtorsInPage', payload)
    },
    //
    // checkedDebtor ({ commit }, payload) {
    //   commit('checkedDebtor', payload)
    // },
    getNewStatusChecked ({ dispatch, commit, getters }, status) {
      Promise.all(
        getters.getDebtors.map(el => {
          if (el.checked) {
            return dispatch('getNewStatusOne', { id: el._id, status, debtRaschSchet: el.RashSchet })
          }
        })
      ).then(resp => {
          commit('setNoChecked')
      })
      .catch((err) => console.log(err))
    },
    /**
     * Смена статуса 
     * @param {*} param0 
     * @param {*} param1 
     */
    getNewStatusOne ({ state, commit, dispatch, getters }, payload) {
      //
    },
    /**
     * Очистить список должников
     * @param {*} param0 
     */
    clearListDebtors ({ commit }, payload) {
      commit('clearListDebtors', );
    },
   
    /**
     * Получить список родственных связей
     */
    getListFamilyRelations ({ getters, commit }) {
      $http({
        data: {
          command: 'ListFamilyRelations',
        }
      }).then(res => {
        commit('setListFamilyRelations', Object.values(res.result));
      })
    },
    /**
     * Отредактировать или добавить список жильцов
     * @param getters
     */
    editListResidents ({ getters, commit, dispatch }, payload) {
      dispatch('appLoadingChange', true, { root: true });
      let data = {
        Comand: 'EditListResidents',
        Email: getters.user.Email,
        Phone: getters.user.Phone,
        Password: getters.user.token,
        OrganizationId: 0,
        Citizenship: payload.fields.Citizenship || '',
        CurrentDebtor: payload.fields.CurrentDebtor || '',
        DateBirthDebt: payload.fields.DateBirthDebt || '',
        DateIssue: payload.fields.DateIssue || '',
        DivisionСode: payload.fields.DivisionСode || '',
        Docno: payload.fields.Docno || '',
        FamilyRelationship: payload.fields.FamilyRelationship || '',
        FioDebt: payload.fields.FioDebt || '',
        FioDebtGenitive: payload.fields.FioDebtGenitive || '',
        LocationDebter: payload.fields.LocationDebter || '',
        PassportIssued: payload.fields.PassportIssued || '',
        PlaceBirthDebt: payload.fields.PlaceBirthDebt || '',
        Registration: payload.fields.Registration || '',
        RegistrationDate: payload.fields.RegistrationDate || '', 
        SoccetEnd: 1
      }
      data = qs.stringify(data);
      return axios({
        url: URL,
        method: 'post',
        data: data
      }).then(res => {
        const newArray = res.data['1'].return.Edit;
        commit('updateDebtorResidents', { RashSchet: payload.RashSchet, newArray })
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },
    /**
     *
     * @param dispatch
     * @param commit
     * @param CountStart
     * @param CountStop
     */
    setDebtorsOnePage ({ dispatch, commit }, { CountStart, CountStop }) {
      getDebtorsOnePageFromApi({ CountStart, CountStop })
        .then(resp => {
          commit('setListDebtorsOnePage', { data: resp, CountStart, CountStop })
          //dispatch('appLoadingChange', false)
        })
    },
    /**
     * Список задолжников (Судебная практика)
     * @param {*} param0 
     * @param {*} payload 
     */
    getDebtorsOnePageFromApi({ getters }, payload) {
      let { CountStart = 0, CountStop = getters.allDebtors } = payload;
      $http({
        data: {
          command: 'ListDebtors',
          CountStart,
          CountStop,
          OrganizationId: 0
        }
      }).then(resp => {
        if (resp.Result) {
          resolve(resp.Result)
        }
      }).catch(err => {
        console.error(err);
      })
    },
    /**
     * Отредавтировать данные жильца
     * @param {*} param0 
     * @param {*} payload 
     */
    editDebtorData ({ commit, getters }, { fields }) {
      
          // commit('editDebtorData', fields)
        
    },
    /** Удалить жильца
     * @param {*} param0 
     * @param {*} payload 
     */
    deleteResident({ dispatch, commit, getters }, { FioDebt, CurrentDebtor }) {

          // commit('updateDebtorResidents', { RashSchet: CurrentDebtor, newArray })
      
    },
    /**
     * Добавить действие в историю действий (тавтология прям)
     */
    addHistoryNote ({ dispatch, commit, getters }, payload) {
      
          // commit('addHistoryNote', note);
       
    },

    /**
     * Открытие модального окна с данными должника
     * @requires dispatch Вызываем модалку должника и вставляем в нее полученые данные  
     * @param {Object} payload данные должника из мини модели
     */
    openDebtorData ( {dispatch}, payload ) {
      const { data, type } = payload
      // console.log(debtor)
      axios({
        url: `${baseURL}/api/debtors-data/${data.debtor.pk}/`,
        method: 'GET',
        params: {
          production_type: !type ? 'judicial' : type
        }
      })
      .then ( resp => {
        dispatch('setPopupComponent', { component: 'debtor-data', params: resp.data })
      })
    },

    /**
     * Сохранить файл
     * @param commit
     * @param payload
     * @returns {Promise<any>}
     */
    saveDebtorFile ({ commit, getters, dispatch }, payload) {
      const { FileName, File, Data, Production, Status, PaymentAccount } = payload;
      // dispatch('appLoadingChange', true, { root: true });
      // console.log(Status)
      let stringStatus = Status
      if (typeof Status == "object") { // если статус приходит не строкой с бэка, а огромным мать его массивом
        let findStatus = Status.Status
        findStatus = JSON.parse(findStatus)
        findStatus = findStatus.find(s => s.selected == true)
        stringStatus = findStatus.title
        // console.log(findStatus)
      } 
     

      return axios({
        method: 'post',
        url: URL,
        data: data
      }).then(res => {
        if(res.data[1].return.AddFile === "Complete") {
          const fileObject = {
            Data: Data,
            FileName: FileName,
            Production: Production,
            Status: Status
          };
          commit('addDebtorFile', { 
            fileObject,
            PaymentAccount,
            PassportOffice: payload.PassportOffice ? true : false,
            FromEgrn: payload.FromEgrn ? true : false, 
            PaymentOrderStateDuty:  payload.PaymentOrderStateDuty ? true : false, 
          });
        }
      }).catch(e => {
        console.error(e);
      }).finally(() => {
        // dispatch('appLoadingChange', false, { root: true });
      });
    },

    /**
     * Объеденить файлы PDF НЕ УДАЛЯТЬ
     */
    mergePDF ({ dispatch, commit, getters }, payload) {
      const data = qs.stringify({
        Comand: 'MergePdf',
        Email: getters.user.Email,
        Phone: getters.user.Phone,
        Password: getters.user.token,
        // FilesCount: 2,
        ...payload,
        SoccetEnd: 1
      });
      return axios({
        method: 'post',
        url: URL,
        data: data
      }).then(res => {
        if (res.data[1].return.Result) {
          return res.data[1].return.Result
        }
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        //
      });
    },
    /**
     * Создать приложение
     * @param {*} param0 
     * @param {*} payload 
     */
    createApplication({ commit, dispatch, getters }, payload) {
      // dispatch('appLoadingChange', true, { root: true });
      const data = qs.stringify({
        Comand: 'CreateApplication',
        Email: getters.user.Email,
        Phone: getters.user.Phone,
        Password: getters.user.token,
        OrganizationId: 0,
        ...payload,
        CreationDate: moment().format('YYYY.MM.DD'),
        SoccetEnd: 1
      });
      return axios({
        method: 'post',
        url: URL,
        data: data
      }).then(res => {
        if (res.data[1].return.CreateApplication === "Complete") {
          dispatch('combinedRequests')
        }
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: false });
      });
    },
    /**
     * Узнать инн физического лицв
     * @param {*} param0 
     * @param {*} payload 
     */
    getDebtorInn ({ commit, dispatch, getters }, payload) {
      const { fam, name, otch, bdate, docno } = payload;
      const data = qs.stringify({
        Comand: 'FindTinIndividual',
        Email: getters.user.Email,
        Phone: getters.user.Phone,
        Password: getters.user.token,
        fam, // фамилия
        name, // имя
        otch, // отчество
        bdate, // Дата рождения в формате ДД.ММ.ГГГГ
        docno, // Серия и номер документа
        OrganizationId: 0,
        SoccetEnd: 1
      });
      return axios({
        method: 'post',
        url: URL,
        data: data
      }).then(res => {
        debugger
        if (res.data[1].return.Result === '') {
          return null;
        } else if(res.data[1].return.Result) {
          return res.data[1].return.Result
        }
      }).catch(e => {
        console.error(e)
      })
    },

    /**
     * Запрос завки на выписку
     * @param {*} param0 
     * @param {Object} payload данные должника требуемые для оформления заявки
     */
    getApplicationDischange({ getters, dispatch }, payload) {
      console.log(payload)
      let companyId = localStorage.getItem('defaultCompany')
        this._vm.$toast.open({
          message: 'Запрос в обработке, ожидайте',
          type: 'warning',
          duration: 5000,
          dismissible: true,
          position: 'top-right'
        })
      let data = {
        company_id: companyId,
        debtors: payload
      }
      if (payload.length > 0) {
        return axios({
          method: 'POST',
          url: baseURL + '/rosreestr/status/',
          data: data
        }).then(res => {
          console.log(res);
          this._vm.$toast.open({
            message: 'Запрос на выписку отправлен',
            type: 'success',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          })

          setTimeout(() => {
            dispatch('getAllCompanyEgrnStatus', res.data.id)
          }, 2000)

        }).catch(e => {
          console.error(e)
        }).finally(() => {
          //
        });
      }
    },
    /**
     * Статус заявки на выписку
     */
     getAllCompanyEgrnStatus({ getters, dispatch, commit }, payload) {
       let companyID = localStorage.getItem('defaultCompany')
      return axios({
        url: `${baseURL}/rosreestr/status/`,
        method: 'GET',
        params: {
          company_id: companyID
        }
      }).then((resp) => {
        let status = resp.data.find( st => st.id === paylaod)
        // if (status.)
        console.log(status)
      })
    },
    /**
     * Статус заявки на выписку о переходе прав
     */ 
    getStatusTransferRights({ getters, dispatch, commit }, payload) {
      const { PaymentAccount } = payload;
      return $http({
        data: {
          command: 'StatusTransferRights',
          PaymentAccount: PaymentAccount,
          OrganizationId: 0
        }
      })
    },
    /**
     * Редактировать данные собственников в росреестре
     * вкладка "собственники" в модалке должника
     */
    editInfoRosreestr({ getters, dispatch, commit }, payload) {
      dispatch('appLoadingChange', true, { root: true });
      const { PaymentAccount, Info, Id } = payload;
      return $http({
        data: {
          Comand: 'EditInfoRosreest',
          PaymentAccount: PaymentAccount,
          Id: Id,
          Info: Info,
          OrganizationId: 0
        }
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },

     
},
  getters: {
    /*
    |--------------------------------------------------------------------------
    | Геттеры списка задолжников модуль "судебная практика"
    |--------------------------------------------------------------------------
    */
    /**
     * Возвращает колонки таблицы задолжников
     * @param state
     * @returns {Array}
     */
    courtProceedingsTableColumns(state) {
      return cloneDeep(state.courtProceedingsTableColumns);
    },

    preTrialProceedingsTableColumns (state) {
      return cloneDeep(state.preTrialProceedingsTableColumns);
    },
    /**
     * Возвращает видимые/зафиксированные колонки
     * @param state
     */
    courtProceedingsTableColumnsVisible(state) {
      return cloneDeep(state.courtProceedingsTableColumns).filter(col => {
        return col.views.view || col.views.fixed
      })
    },
    preTrialProceedingsTableColumnsVisible (state) {
      return cloneDeep(state.preTrialProceedingsTableColumns).filter(col => {
        return col.views.view || col.views.fixed
      })
    },
    /**
     * Возвращает список должников
     * @param state
     * @returns { Array }
     */
    debtorsCourtProceedings (state) {
      return cloneDeep(state.debtorsCourtProceedings).filter(el => {
        const test = el._id > (state.currentPage - 1) * state.debtorsCourtProceedingsInPage && el._id <= state.currentPage * state.debtorsCourtProceedingsInPage;
        return test;
      });
    },

    debtorsPreTrialProceedings (state) {
      return cloneDeep(state.debtorsPreTrialProceedings).filter(el => {
        const test = el._id > (state.currentPage - 1) * state.debtorsPreTrialProceedingsInPage && el._id <= state.currentPage * state.debtorsPreTrialProceedingsInPage;
        return test;
      });
    },
    /**
     * Возвращает количество отмеченных колонок таблицы задолжников
     * @param state
     */
    checkedDebtorsCount (state) {
      const debtors = cloneDeep(state.debtorsCourtProceedings).filter(el => {
        const test = el._id > (state.currentPage - 1) * state.debtorsCourtProceedingsInPage && el._id <= state.currentPage * state.debtorsCourtProceedingsInPage && el.checked;
        return test;
      });
      return debtors.length
      // return cloneDeep(state.checkedDebtorsCount);
    },
    checkedPreTrialDebtorsCount (state) {
      const debtors = cloneDeep(state.debtorsPreTrialProceedings).filter(el => {
        const test = el._id > (state.currentPage - 1) * state.debtorsPreTrialProceedingsInPage && el._id <= state.currentPage * state.debtorsPreTrialProceedingsInPage && el.checked;
        return test;
      });
      return debtors.length
    },
    /**
     * Возвращает количество задолжников на текущей странице
     * @param state
     */
    debtorsCountInCurrentPage (state) {
      const debtors = cloneDeep(state.debtorsCourtProceedings).filter(el => {
        const test = el._id > (state.currentPage - 1) * state.debtorsCourtProceedingsInPage && el._id <= state.currentPage * state.debtorsCourtProceedingsInPage;
        return test;
      });
      return debtors.length
      // return cloneDeep(state.checkedDebtorsCount);
    },
    debtorsPreTrialCountInCurrentPage (state) {
      const debtors = cloneDeep(state.debtorsPreTrialProceedings).filter(el => {
        const test = el._id > (state.currentPage - 1) * state.debtorsPreTrialProceedingsInPage && el._id <= state.currentPage * state.debtorsPreTrialProceedingsInPage;
        return test;
      });
      return debtors.length
    },
    /**
     * Отмеченные задолжники
     * @param state
     */
    checkedDebtors (state) {
      return cloneDeep(state.debtorsCourtProceedings.filter(d => d.checked));
    },
    checkedPreTrialDebtors (state) {
      return cloneDeep(state.debtorsPreTrialProceedings.filter(d => d.checked));
    },  
    /**
     * Сумма выделенных ячеек
     * @param state
     */
    debtorsData: state => {
      if (state.checkedDebtorsCount === 0) {
        return state.debtorsData
      }
      else {
        const result = {}
        let debtors;
        state.debtorsCourtProceedings.filter(el => el.checked).forEach(elem => {
          state.debtorPaidColNames.forEach(name => {
            if (!result[name]) result[name] = 0
            if (elem[name] || elem[name] === 0) {
              result[name] += elem[name]
            }
          })
        })
        return result
      }
    },

    preTrialDebtorsData: state => {
      if (state.checkedDebtorsCount === 0) {
        return state.debtorsData
      }
      else {
        const result = {}
        state.debtorsPreTrialProceedings.filter(el => el.checked).forEach(elem => {
          state.debtorPaidColNames.forEach(name => {
            if (!result[name]) result[name] = 0
            if (elem[name] || elem[name] === 0) {
              result[name] += elem[name]
            }
          })
        })
        return result
      }
    },
    /**
     * Количество всех задолжников
     * @param state
     * @returns {Number}
     */
    allDebtors(state) {
      return state.allDebtors;
    },
    /**
     * Текущая страница
     * @param state
     * @returns {*}
     */
    currentPage(state) {
      return state.currentPage;
    },
    /**
     * Количество страниц таблицы
     * @param state
     * @returns {number}
     */
    pages(state) {
      return Math.ceil(state.allDebtors / state.debtorsCourtProceedingsInPage)
    },
    preTrialPages: state => {
      return Math.ceil(state.allDebtors / state.debtorsPreTrialProceedingsInPage)
    },  
    /**
     * Количество задолжников на странице в настройках
     * @param state
     */
    debtorsCourtProceedingsInPage(state) {
      return state.debtorsCourtProceedingsInPage;
    },
    debtorsPreTrialProceedingsInPage (state) {
      return state.debtorsPreTrialProceedingsInPage;
    },
    // дефолтный хз зачем
    getDebtorsInPageDefault: state => state.debtorsInPageDefault,
    /**
     * Количество показанных задолжников в пределах чанка
     * @param state
     * @returns {string}
     */
    shownDebtors(state) {
      let result = ''
      state.currentPage * state.debtorsCourtProceedingsInPage >= state.allDebtors ? result += state.allDebtors : result += (state.currentPage * state.debtorsCourtProceedingsInPage)
      return result
    },
    shownPreTrialDebtors: state => {
      let result = ''
      state.currentPage * state.debtorsPreTrialProceedingsInPage >= state.allDebtors ? result += state.allDebtors : result += (state.currentPage * state.debtorsPreTrialProceedingsInPage)
      return result
    },
    // listFamilyRelations: state => state.listFamilyRelations,

    initialized(state) {
      return state.initialized;
    },
    /**
     * Возвращает флажок debtorFiltered
     * @param state
     * @returns {boolean|default.getters.debtorFiltered|(function(*))|*}
     */
    debtorFiltered(state) {
      return state.debtorFiltered;
    },

    debtorPaidColNames (state) {
      return state.debtorPaidColNames;
    },
    /**
     * Возвращает список приложенией для поиска 
     */
    applicationList(state) {
      return state.applicationList;
    }
  }
}
