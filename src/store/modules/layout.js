export default {
  state: () => ( {
    layout: 'cabinet-layout',
    appLoading: false,
    percentLoader: {
      status: false,
      type: 2
    }
  }),
  mutations: {
    setLayout (state, payload) {
      state.layout = payload
    },
    appLoadingChange (state, payload) {
      if (typeof payload !== 'boolean') return false
      state.appLoading = payload
    },
    percentLoginLoader (state, payload) {
      state.percentLoader = payload
    }
  },
  actions: {
    /**
     * Лоадер
     * @param {*} param0 
     * @param {*} payload 
     */
    appLoadingChange ({ commit }, payload) {
      commit('appLoadingChange', payload)
    },

    /**
     * Прелоадер с процентами после авторизации
     * @param {Boolean} payload активация прелоадера
     */
    percentLoginLoader ({commit}, payload) {
        commit('percentLoginLoader', payload)
    }

  },
  getters: {
    layout: state => state.layout,
    appLoading: state => state.appLoading,
    percentLoader: state => state.percentLoader
  }
}
