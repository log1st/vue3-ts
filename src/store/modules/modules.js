const modulesKeyNames = ['ChPreTrialProceedings', 'ChCourtProceedings', 'ChEnforcementProceeding']

export default {
  state: () => ( {
    debtorsModules: [
      {
        _id: 0,
        key: 'ChPreTrialProceedings',
        title: 'Досудебное производство',
        shortTitle: 'Досудебное пр-во',
        btnName: 'Досудебная практика',
        status: true,
        befTax: 50,
        discount: 0,
        amount: 0,
        proceedingsDebtors: 0,
        actionsForSelectItem: [
          { name: 'Сформировать уведомление', action: 'setNotification' },
          { name: 'Отправить SMS', action: 'func' },
          { name: 'Отправить Email', action: 'func' },
          { name: 'Скачать уведомление', action: 'func' },
          { name: 'Удалить уведомление', action: 'func' }
          // { name: 'Расчет пени', action: this.calcFine }
        ]
      },
      {
        _id: 1,
        key: 'ChCourtProceedings',
        title: 'Судебное производство',
        shortTitle: 'Судебное пр-во',
        btnName: 'Судебная практика',
        status: true,
        befTax: 170,
        discount: 0,
        amount: 0,
        proceedingsDebtors: 0,
        actionsForSelectItem: [
          {
            name: 'Печать заявлений',
            action: 'printStatementsJudicalModule',
            command: 'PrintingStatements',
            visible: true,
            color: '#818181',
            icon: { name: 'print', w: 20, h: 16, viewbox: '0 0 20 20', stroke: false }
          },
          {
            name: 'Подать по ЭЦП',
            action: 'func',
            command: 'SubmitByECP',
            visible: true,
            color: '#818181',
            icon: { name: 'paper', w: 16, h: 16, viewbox: '0 0 20 20', stroke: false }
          },
          {
            name: 'Сформировать приложение',
            action: 'generateDebtorApp',
            command: 'FormApplication',
            visible: true,
            color: '#818181',
            icon: { name: 'lists', w: 14, h: 15, viewbox: '0 0 42 51', stroke: false }
          },
          {
            name: 'Свод начислений по ЛС',
            action: 'getSetOfCharges',
            command: 'SummaryAccrualsLS',
            visible: true,
            color: '#818181',
            icon: { name: 'folder', w: 16, h: 16, viewbox: '0 0 20 20', stroke: true }
          },
          {
            name: 'Печать бланков',
            action: 'func',
            command: 'PrintingForms',
            visible: true,
            color: '#818181',
            icon: { name: 'pdf', w: 16, h: 16, viewbox: '0 0 20 20', stroke: true }
          }
        ]
      },
      {
        _id: 2,
        key: 'ChEnforcementProceeding',
        title: 'Исполнительное производство',
        shortTitle: 'Исполнительное пр-во',
        btnName: 'Исполнительное производство',
        status: true,
        befTax: 100,
        discount: 0,
        amount: 0,
        proceedingsDebtors: 0,
        actionsForSelectItem: [
          { name: 'Печать заявлений 3', action: 'func' },
          { name: 'Подать по ЭЦП', action: 'func' },
          { name: 'Печать бланков', action: 'func' },
          { name: 'Сформировать уведомление', action: 'func' },
          { name: 'Отправить SMS', action: 'func' },
          { name: 'Отправить Email', action: 'func' }
        ]
      }
    ],
    modulesInfo: {}
  }),
  mutations: {
    changeStatusService (state, id) {
      state.debtorsModules[id].status = !state.debtorsModules[id].status
    },
    checkServicesTab (state, payload) {
      for (const key in payload) {
        state.modulesInfo[key] = payload[key]
        // console.log(key + ' : ' + payload[key])
        const ind = modulesKeyNames.findIndex(el => el === key)
        if (ind !== -1) {
          state.debtorsModules[ind].status = payload[key] === 1
        }

        if (key === 'BeforeJudicialProceedingsDebtors') state.debtorsModules[0].proceedingsDebtors = payload[key]
        if (key === 'JudicialProceedingsDebtors') state.debtorsModules[1].proceedingsDebtors = payload[key]
        if (key === 'EnforcementProceedingsDebtors') state.debtorsModules[2].proceedingsDebtors = payload[key]

        if (key === 'BeforelВefTax') state.debtorsModules[0].befTax = payload[key]
        if (key === 'JudicialВefTax') state.debtorsModules[1].befTax = payload[key]
        if (key === 'EnfoВefTax') state.debtorsModules[2].befTax = payload[key]
      }
    },
    changeVisibleHotButton (state, payload) {
      state.debtorsModules[1].actionsForSelectItem[payload.UrTable].visible = payload.visible
    },
    updateHotButtonSettings (state, payload) {
      console.log(payload)
      state.debtorsModules[1].actionsForSelectItem[0].visible = false
      // state.debtorsModules[1].actionsForSelectItem = [...payload]
      // Vue.set('')
      // for (actionItem in state.debtorsModules[1].actionsForSelectItem) {

      // }
    }
  },
  actions: {
    changeStatusService ({ dispatch, commit, getters }, id) {
      dispatch('appLoadingChange', true, { root: true });
      return $http({
        data: {
          command: 'ServiceActivation',
          [modulesKeyNames[id]]: true
        }
      }).then(res => {
          if(res.chCourtProceedings === 0) {
            commit('changeStatusService', id)
            const first = getters.debtorsModules.findIndex(el => el.status === true);
            // dispatch('setDebtorsModuleActive', first);
          }
      }).catch((e) => {
        console.error('uploadCompanies action error', e);
        dispatch('appLoadingChange', false, { root: true });
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },
    // async checkServicesTab ({ commit, getters }) {
    //   const data = qs.stringify({
    //     Comand: 'ServicesTab',
    //     Email: getters.user.Email,
    //     Phone: getters.user.Phone,
    //     Password: getters.user.token,
    //     SoccetEnd: 1
    //   });
    //   axios({
    //     method: 'post',
    //     url: URL,
    //     data: data
    //   }).then(res => {
    //     const result = res.data[1].return;
    //     if (result) {
    //       commit('checkServicesTab', result)
    //     }
    //   }).catch(e => {
    //     console.error(e)
    //   })
    // },
  },
  getters: {
    debtorsModules: state => state.debtorsModules,
    // actionsForSelectItem(state) {
    //   return id => state.debtorsModules[id].actionsForSelectItem
    // },
    getVisibleActionItems: state => id => state.debtorsModules[id].actionsForSelectItem.filter(item => item.visible),
    // debtorsModulesButtons: state => state.debtorsModules.map(el => {
    //   return { title: el.title, name: el.btnName, _id: el._id, status: el.status }
    // })
  }
}
