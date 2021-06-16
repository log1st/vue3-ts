import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
// modules
import accounts from './modules/accounts'; // счета на оплату
import desktop from './modules/desktop'; // рабочий стол
import layout from './modules/layout'
import popup from './modules/popup'
import user from './modules/user'
import displaySettings from './modules/display-settings'
import debtorsRoot from './modules/debtorsRoot'
import debtors from './modules/debtors'
import messages from './modules/messages'
import files from './modules/files'
import courts from './modules/courts'
import companies from './modules/companies'
import modules from './modules/modules' // модули работы с должниками
import main from './modules/main' // моя организация
import serviceMessage from './modules/service-message' // сервисные сообщения (зеленые)
import exchange from './modules/exchange' // обмен данными
import documents from './modules/documents' // обмен данными
import penalty from './modules/penalty' // обмен данными
import auth from './modules/auth' // авторизация
import admin from './modules/admin' // админ панель
import statementsJudical from './modules/documents/statementsJudical';
import services from '../services'

Vue.use(Vuex)

function createStore () { 
return new Vuex.Store({
  // plugins: [
  //   createPersistedState({
  //     // paths: ['modules', 'debtors', 'debtorsRoot'],
  //     paths: ['companies'],
  //   }),
  // ],
  actions: {
    setGlobalLoader ({ dispatch }, promises) {
      // dispatch('appLoadingChange', true, { root: true });
      for (const p of promises) {
        p.then((res) => {
          // dispatch('appLoadingChange', true, { root: true })
        })
      }
      return Promise.all(promises)
    },

    async rootInitData({ dispatch }) {
      return await dispatch('setGlobalLoader', [
        dispatch ('uploadCompanies',                 null, { root: true }),
        dispatch ('getUserSetting',                  null, { root: true }),
        // dispatch ('getStatusOnHeader',               null, { root:true }),  // Получаем кол-во активных статусов должников в шапку
        // dispatch ('getDesktopWidgetCoords',          null, { root: true }), // виджеты рабочего стола
        dispatch ('getHotkeyStatuses',               null, { root: true }),    // статусы кнопок
        // dispatch ('getCourtProceedingsTableColumns', null, { root: true }), // запрос колонок таблицы "судебная практика"
        // dispatch ('getDebtorsCourtProceedingsList',  null, { root: true }), // запрос задолжников "судебная практика"
        // dispatch ('getListsOfStatusesDebtors',       null, { root: true }), // загрузить список статусов
        // dispatch ('getAllSumsDebtors',               null, { root: true }), // загрузка данных по задолжникам
        dispatch ('getPositionForEmployee',          null, { root: true }), // Получение должностей
        dispatch ('combinedRequests',                {module: 'judicial'}, { root: true }), // загрузка совмещенных запросов
        dispatch ('combinedRequests',                {module: 'pretrial'}, { root: true }), // загрузка совмещенных запросов
        // dispatch ('getCompanyUserApplication',       null, { root: true }),    // Приложения пользователя
        // dispatch ('loadInfoINNContracts',            null, { root: true }),
        // dispatch ('loadInfoINNSharedData',           null, { root: true }),
        // dispatch ('checkServicesTab',                null, { root: true }), // загрузить услуги подключенные услуги. Вкладка "услуги"
        // dispatch ('getRegionsList',                  null, { root: true }),
        // dispatch ('initPenaltyAction',               null, { root: true }),
        // dispatch ('getStatusCalculationPeni',        null, { root: true }),
        // dispatch ('setListOfJudicialDistricts',      null, { root: true }), // notifications
      ]).catch(e => {
        dispatch('appLoadingChange', false, { root: false });
        events.$emit('finalGlobal', {status: true})
      }).finally(() => {
        events.$emit('finalGlobal', {status: true})
        dispatch('appLoadingChange', false, { root: false });
      })
    },

    setSimbols (state, { str, delta = 2}) {
      if (str.toString().length >= delta) return str
      else {
        str = '0000000000' + str
        return str.slice(-delta)
      }
    }
  },
  modules: {
    admin,
    accounts,
    layout,
    popup,
    user,
    displaySettings,
    debtorsRoot,
    debtors,
    messages,
    files,
    courts,
    companies,
    modules,
    main,
    serviceMessage,
    exchange,
    documents,
    penalty,
    auth,
    desktop,
    services, // Сервисы
    statementsJudical // модуль заявления
  },
  strict: true
})
}
export default createStore
