// import Axios from "axios";

export default {
  state: () => ({
    /**
     * Список регионов формы отправки
     */
    regions: [],
    /**
     * Обект статуса расчета
     */
    penalty: [],
    /**
     * Объект статуса загрузки файлов .csv или .xls
     */
    uploading: {
      status: false,
      progress: 0
    }, 
    /** 
     * Статус загрузки региона
     */
    regionUploading: false,

    /**
     * UUID для получения статусов
     */
    uuid: false,
    /**
     * Выбранный регион
     */
    selectedRegion: false,

    lists: [
      {
        id: 3,
        name: 'Инструкция',
        route: '/exchange/manual',
        isActive: false
      },
      {
        id: 0,
        name: 'Досудебное производство',
        route: "/exchange/import/upload?action=0",
        isActive: false
      },
      {
        id: 1,
        name: 'Судебное производство',
        route: "/exchange/import/upload?action=1",
        isActive: true
      },
      {
        id: 2,
        name: 'Исполнительное производство',
        route: "/exchange/import/upload?action=2",
        isActive: false
      }
    ],
    /**
     * Линейный файл (Данные для загрузки)
     */
    linear: []
  }),
  mutations: {
    setRegions(state, data) {
      state.regions = data;
    },
    setPenaltyStatus(state, data) {
      state.penalty = { ...state.penalty, ...data };
    },
    setUploading(state, data) {
      state.uploading = { ...state.uploading, ...data }
    },
    setRegionSavingStatus(state, data) {
      state.regionUploading = data;
    },
    setExchangeActiveLink(state, payload) {
      state.lists.forEach(ls => {
        ls.isActive = payload.id === ls.id ? true : false
      })
    },
    setLinearFile(state, payload) {
      state.linear = payload
    },
    setSelectedRegion (state, payload) {
      state.selectedRegion = payload
    },
    /**
     * Генерируем UUID (16x) 
     */
    generateUUID (state) {
     const makeid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      state.uuid = `${makeid()}`
    }
  },
  actions: {
    initPenaltyAction({ dispatch, state }) {
      dispatch('getPenaltyStatus').then(() => {
        if (state.penalty[0].status_value == 0 || state.penalty[0].status_value == 100) {
          return
        }
        else if (state.penalty[0].status_value > 0 && state.penalty.status_value < 100) {
          setTimeout(() => {
            dispatch('initPenaltyAction');
          }, 1000)
        } else if (state.penalty[0].status_text === 'Parsing failed.') {
          this._vm.$toast.open({
            message: `${state.penalty[0].payload.failure_details}`,
            type: 'error',
            duration: 5000,
            dismissible: true,
            position: 'top-right'
          })
        }
      })
    },
    getExchangeActiveLink({ commit }, payload) {
      commit('setExchangeActiveLink', payload)
    },
    /**
     * Получить статус расчета
     */
    getPenaltyStatus({state, commit }) {
      return $http({
        command: `/api/datafile/status/${state.uuid}/`,
        method: 'GET',
      }).then(res => {
        // console.log(res)
        commit('setPenaltyStatus', res);
      }).catch(e => {
        console.log('error', e)
      })
    },
    /**
     * Получить список регионов
     * @return {Promise}
     */
    getRegionsList({ commit, getters }) {
      return $http({
        command: '/api/common/region/',
        method: 'GET',
      }).then(res => {
        // console.log(res)
        commit('setRegions', res)
      }).catch(e => {
        console.error(e)
      });
    },

    importDebtors({ dispatch, commit }, payload) {
      return new Promise ((resolve, reject) => {
        dispatch('appLoadingChange', true, { root: true })
        const { mode } = payload
        commit('generateUUID')
        if (mode === 'table') {
          dispatch('importDebtorsCascad', payload)
        } else {
          dispatch('importDebtorsLinear', payload)
          .catch( (err) => {
            reject({status: false, msg: err})
          })
          .finally ( () => {
            resolve({status: true})
          })
        }
      })
      
    },

    setSelectedRegion ({commit}, payload) {
      const { region, exchangedCompanyData } = payload
      commit('setSelectedRegion', region)
      // console.log(payload)
      $http({
        command: `/api/account/company-settings/${exchangedCompanyData.id}/`,
        method: 'PATCH',
        data: {
            default_region: region.id
        }
    }).then(res => {
        console.log(res)
    })
    },
    getLinearFile({ commit }, payload) {
      commit('setLinearFile', payload)
    },

    importDebtorsCascad( {state, dispatch}, payload) {
      let data = {
        uuid: state.uuid,
        region: state.selectedRegion.id,
        ...payload
      }

      $http({
        command: '/api/datafile/upload/',
        data: data,
        method: 'POST'
      })
      .then ( res => {
        dispatch('appLoadingChange', false, { root: true })
        setTimeout(() => {
          dispatch('initPenaltyAction')
        }, 1000);
      })
      .catch(err => {
        this._vm.$toast.open({
          message: `${err}`,
          type: 'error',
          duration: 5000,
          dismissible: true,
          position: 'top-right'
        })
        dispatch('appLoadingChange', false, { root: true })
      })
    },

    /**
     * Импортирование должников линейным методом 
     * @param {*} payload данные документа
     */
    importDebtorsLinear({ commit, state, dispatch }, payload) {
      let data = {
        uuid: state.uuid,
        region: state.selectedRegion.id,
        year: 0,
        month: 0,
        ...payload
      }
     return $http({
        command: '/api/datafile/upload/',
        data: data,
        method: 'POST'
      })
      .then(res => {
        // commit('setStatusCreatedDate', res.package.update_at)
        setTimeout(() => {
          dispatch('initPenaltyAction')
        }, 500);
        dispatch('appLoadingChange', false, { root: true })
      })
      .catch(err => {
        this._vm.$toast.open({
          message: `${err}`,
          type: 'error',
          duration: 5000,
          dismissible: true,
          position: 'top-right'
        })
        dispatch('appLoadingChange', false, { root: true })
      })
    }
  },
  getters: {
    /**
     * Cписок всех регионов России
     * @param state 
     * @returns {Array} 
     */
    regionsList: state => state.regions,
    penalty: state => state.penalty,
    penaltyStatus(state) {
      const result = state.penalty.length > 0 && state.penalty[0].status_value && parseFloat(state.penalty[0].status_value) || -1;
      return result > 0 && result < 100
    },
    penaltyProgress(state) {
      const result = state.penalty.length > 0 && state.penalty[0].status_value && parseFloat(state.penalty[0].status_value) || -1;
      return result;
    },
    /**
     * Возвращает выбраный регион 
     * @param state 
     * @returns {Object}
     */
    selectedRegion: state => state.selectedRegion,
    /**
     * Возвращает статус загрузки файлов
     * @param state
     * @returns {Boolean}
     */
    uploadingStatus: state => state.uploading.status,
    /**
     * Возвращает  статус загрузки файлов в процентах
     * @param state
     * @returns {number}
     */
    uploadingProgress: (state) => state.uploading.progress,
    /**
     * Возвращает статус загрузки региона
     * @param state
     * @returns {Boolean}
     */
    regionUploadingStatus: (state) => state.regionUploading,
    /**
     * 
     * @param lists: Массив всех модулей загрузки
     * @returns {Array}
     */
    exchangeLinklLists: (state) => state.lists
  }
}
