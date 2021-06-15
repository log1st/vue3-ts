import isEmpty from 'lodash/isEmpty';

export default {
  state: () => ( {
    /**
     * Файлы с которыми работает должник
     */
    files: [],

  }),
  mutations: {
    setDebtorFile (state, payload) {
      state.files.push(payload)
    },
    removeLast (state) {
      state.files.pop()
    },
    clearAll(state) {
      state.files = []
    }
  },
  actions: {
    /**
     * получить файлы должника
     * @param state
     * @param commit
     * @param getters
     * @param payload
     * @returns {Promise<any>}
     */
    getDebtorFiles ({ state, commit, getters }, payload ) {
      // const PaymentAccount = payload;
      dispatch('appLoadingChange', true, { root: true });
      return $http({
        data: {
          command: 'AllFileDebt',
          OrganizationId: 0,
          PaymentAccount: payload
        }
      }).then(res => {
        if(!isEmpty(res.result)) {
          Object.values(res.result).forEach(r => {
            commit('setDebtorFile', {
              date: r.Data,
              name: r.FileName,
              proceedings: r.Production,
              status: r.Status
            })
          })
        }
      }).catch(e => {
        console.error(e);
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      })
    },

    /**
     * Скачать файл
     * @param { dispatch, getters, commit }
     * @param payload
     * @returns {Promise<AxiosResponse<any>>}
     */
    downloadFile({ dispatch }, payload) {
      const { PaymentAccount, File, FromEgrn = false, PassportOffice = false, PaymentOrderStateDuty = false, TransferRights = false } = payload;
      dispatch('appLoadingChange', true, { root: true });

      let data = {
        command: 'LoadFileDebt',
        OrganizationId: 0,
        File: File,
        PaymentAccount: PaymentAccount
      }
      if(FromEgrn) data.FromEgrn = 1;  
      if(PassportOffice) data.PassportOffice = 1;  
      if(PaymentOrderStateDuty) data.PaymentOrderStateDuty = 1;
      if(TransferRights) data.TransferRights = 1;
      
      return $http({
        data: data
      }).then(res => {
        if(res.result) {
           return res.result;
        }
      }).catch(e => {
        console.error(e);
      }).finally(() => {
        dispatch('appLoadingChange', false, { root: true });
      });
    },
    /**
     * Удалить все файлы
     * @param {*} param0 
     */
    removeAll ({ commit, getters }) {
      return new Promise((resolve, reject) => {
        const lnth = getters.getDeptorFiles.length
        for (let i = lnth - 1; i >= 0; i--) {
          setTimeout(() => {
            commit('removeLast')
            resolve(true)
          }, (lnth - i) * 500)
        }
      })
    }
  },
  getters: {
    /**
     * Возвращает файлы задолжника
     * @param state
     * @returns {*}
     */
    getDeptorFiles: state => state.files
  }
}
