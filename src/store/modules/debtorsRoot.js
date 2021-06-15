export default {
  state: () => ( {
    /**
     * Модули задолжников
     */
    debtorsModules: [
      {
        _id: 0,
        key: 'ChPreTrialProceedings',
        component: 'pre-trial-proceedings',
        title: 'Досудебное производство',
        shortTitle: 'Досудебное пр-во',
        name: 'Досудебное производство',
        status: true,
        befTax: 50,
        discount: 0,
        amount: 0,
        proceedingsDebtors: 0,
        actionsForSelectItem: [
          {
            name: 'Отправка СМС',
            serverName: 'sms',
            action: 'sendSMS',
            command: 'notifyForms',
            visible: true,
            show: true, 
            color: '#818181',
            icon: { name: 'send-sms', w: 30, h: 30, viewBox: '0 0 30 30', stroke: true }
          },
          {
            name: 'Отправка голосового сообщения',
            serverName: 'voice_msg',
            action: 'sendVoiceMsg',
            command: 'notifyForms',
            visible: true,
            show: true, 
            color: '#818181',
            icon: { name: 'send-voice-msg', w: 30, h: 30, viewBox: '0 0 30 30', stroke: true }
          },
        ]
      },
      {
        _id: 1,
        key: 'ChCourtProceedings',
        component: 'court-proceedings',
        title: 'Судебное производство',
        shortTitle: 'Судебное пр-во',
        name: 'Судебное производство',
        status: true,
        befTax: 170,
        discount: 0,
        amount: 0,
        proceedingsDebtors: 0,
        actionsForSelectItem: [
          {
            name: 'Подача документов',
            serverName: 'PrintingStatements',
            action: 'printStatementsJudicalModule',
            command: 'PrintingStatements',
            visible: true, 
            show: true, 
            color: '#818181',
            icon: { name: 'print', w: 40, h: 30, viewbox: '0 0 30 30', stroke: false }
          },
          // {
          //   name: 'Печать заявлений Челябинск',
          //   serverName: 'PrintingStatements',
          //   action: 'printStatementsJudicalModuleChel',
          //   command: 'PrintingStatements',
          //   visible: true,
          //   color: '#818181',
          //   icon: { name: 'print', w: 20, h: 16, viewbox: '0 0 20 20', stroke: false }
          // },
          // {
          //   name: 'Печать заявлений Челябинск Доли',
          //   serverName: 'PrintingStatements',
          //   action: 'printStatementsJudicalModuleChelDoly',
          //   command: 'PrintingStatements',
          //   visible: true, 
          //   show: false, // 1-424
          //   color: '#818181',
          //   icon: { name: 'print', w: 20, h: 16, viewbox: '0 0 20 20', stroke: false }
          // },
          // {
          //   name: 'Подписать и отправить по ЭЦП',
          //   serverName: 'SubmitByECP',
          //   action: 'printDigitalSignature',
          //   command: 'SubmitByECP', 
          //   visible: true, 
          //   show: false, // 1-424 
          //   color: '#818181',
          //   icon: { name: 'paper', w: 16, h: 16, viewBox: '0 0 20 20', stroke: false }
          // },
          {
            name: 'Сформировать приложение',
            serverName: 'FormApplication',
            action: 'formAnApplication',
            command: 'formApplication',
            visible: true,
            show: false, 
            color: '#818181',
            icon: { name: '', w: 30, h: 30, viewbox: '0 0 42 51', stroke: false }
          },
          {
            name: 'Свод начислений по ЛС',
            serverName: 'SummaryAccrualsLS',
            action: 'printSetOfCharges',
            command: 'SummaryAccrualsLS',
            visible: true,
            show: true, 
            color: '#818181',
            icon: { name: 'lists', w: 30, h: 30, viewbox: '0 0 30 30', stroke: true }
          },
          {
            name: 'Бланк пошлины',
            serverName: 'PrintingForms',
            action: 'printPaymentForm',
            command: 'PrintingForms',
            visible: true,
            show: true, 
            color: '#818181',
            icon: { name: 'folder', w: 30, h: 30, viewbox: '0 0 30 30', stroke: true }
          },
          // {
          //   name: 'Печать судебного решения',
          //   serverName: 'PrintingJudgmentForms',
          //   action: 'printPaymentForm',
          //   command: '',
          //   visible: true,
          //   color: '#818181',
          //   icon: { name: 'pdf', w: 16, h: 16, viewbox: '0 0 20 20', stroke: true }
          // },
          {
            name: 'Выписка из ЕГРН',
            serverName: 'EGRN',
            action: 'printApplicationDischarge',
            command: 'PrintingForms',
            visible: true,
            show: true, 
            color: '#818181',
            icon: { name: 'egrn', w: 30, h: 30, viewBox: '0 0 30 30', stroke: true }
          }
        ]
      },
      // {
      //   _id: 2,
      //   key: 'ChEnforcementProceeding',
      //   component: 'enforcement-proceeding',
      //   title: 'Исполнительное производство',
      //   shortTitle: 'Исполнительное пр-во',
      //   name: 'Исполнительное производство',
      //   status: true,
      //   befTax: 100,
      //   discount: 0,
      //   amount: 0,
      //   proceedingsDebtors: 0,
      //   actionsForSelectItem: [
      //     { name: 'Печать заявлений 3', action: 'func' },
      //     { name: 'Подать по ЭЦП', action: 'func' },
      //     { name: 'Печать бланков', action: 'func' },
      //     { name: 'Сформировать уведомление', action: 'func' },
      //     { name: 'Отправить SMS', action: 'func' },
      //     { name: 'Отправить Email', action: 'func' }
      //   ]
      // }
    ],
    /**
     * Текущий активный модуль
     */
    debtorsModuleActive: 1,
    /**
     * Статусы должников
     */
    statusesDebtors: {
      courtProceedings: []
    },
    newStatusesDebtors: []
  }),
  mutations: {
    /**
     * Установить текущий модуль раздела "Работа с должниками"
     * @param state
     * @param payload
     */
    setDebtorsModuleActive (state, payload) {
      state.debtorsModuleActive = payload;
    },
    /**
     * Установить список статусов
     * @param state
     * @param payload
     */
    setListsOfStatusesDebtors (state, payload) {
      state.newStatusesDebtors = payload
      
    },
    /**
     * Установить статусы горяих кнопок (модуль судебная практика)
     * @param state
     * @param payload
     */
    setHotkeyStatuses(state, payload) {
      const actions = state.debtorsModules[1].actionsForSelectItem;
      for(const key in payload) {
        const item = actions.find(i => i.serverName === key)
        if(item) item.visible = payload[key];
      }
    }
  },
  actions: {
    /*
    |--------------------------------------------------------------------------
    | API раздела "Работа с должниками"
    |--------------------------------------------------------------------------
    */
    /**
     * Получить статусы горячих кнопок
     */
    async getHotkeyStatuses({ state, commit, dispatch, getters }) {
      dispatch('appLoadingChange', true, { root: true });
      return new Promise((resolve) => {
        // localstorage keys
        let hotKeysStored;
        if (typeof window !== 'undefined') {
         hotKeysStored = JSON.parse(localStorage.getItem('hot_keys'));
        } 
        // state keys
        let hotkeyStateStatuses = {};
        state.debtorsModules[1].actionsForSelectItem.forEach(a => {
          hotkeyStateStatuses[a.serverName] = a.visible
        })
        // 
        if(!hotKeysStored) {
          let parsed = JSON.stringify(hotkeyStateStatuses);
          if (typeof window !== 'undefined') {
            localStorage.setItem('hot_keys', parsed);
            hotKeysStored = JSON.parse(localStorage.getItem('hot_keys'));
          }
        }
        commit('setHotkeyStatuses', { ...hotkeyStateStatuses, ...hotKeysStored });
        resolve()
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },
    /**
     * Установить статусы горячих клавиш
     * @param { commit, dispatch, getters }
     * @returns {Promise<any>}
     */
    async setHotkeyStatuses({ commit, dispatch, getters }, payload) {
      dispatch('appLoadingChange', true, { root: true });
      
      const statuses = {};
      payload.forEach(item => {
        statuses[item.serverName] = item.visible
      })

      return new Promise((resolve) => {
        let parsed = JSON.stringify(statuses);
        if (typeof window !== 'undefined') {
          localStorage.setItem('hot_keys', parsed);
        }
        commit('setHotkeyStatuses', statuses);
        resolve();
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: false });
      })
    },
  },
  getters: {
    /*
    --------------------------------------------------------------------------
    | Геттеры раздела "Работа с должниками"
    |--------------------------------------------------------------------------
    */
    /**
     * Возвращает кнопки навигации в разделе "Работа с должниками"
     * @param state
     * @returns {Array}
     */
    debtorsModulesButtons (state) {
      return state.debtorsModules
    },

    actionsForCourtProceedings(state) {
      return state.debtorsModules[1].actionsForSelectItem;
    },

    actionsForPreTrialProceedings (state) {
      return state.debtorsModules[0].actionsForSelectItem;
    },
    /**
     * Возвращает список action'ов для определенного/текущего модуля
     * @param state
     * @returns {function(*): (*[]|*)}
     */
    actionsForSelectItem(state) {
      return id => {
        return state.debtorsModules[id].actionsForSelectItem;
      }
    },
    /**
     * Возвращает наименование дочернего компонента
     * для отрисовки на странице "работа с должниками"
     * @param state
     * @returns {function(*): (string)}
     */
    debtorComponentModule(state) {
      return id => state.debtorsModules[id].component;
    },
    /**
     * Возвращает текущий активный модуль
     * @param state
     * returns {Number}
     */
    debtorsModuleActive (state) {
      return state.debtorsModuleActive;
    },
    /**
     * Получить статусы задолжников
     * @param state
     * @returns {*}
     */
    statusesDebtors(state) {
      return state.statusesDebtors
    },
    newStatusesDebtors: state => state.newStatusesDebtors
  }
}
