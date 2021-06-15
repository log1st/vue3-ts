export default {
  state: () => ( {
    serviceMessageStatus: false,
    serviceMessageText: ''
  }),
  mutations: {
    setServiceMessageOpen (state, text) {
      state.serviceMessageText = text
      state.serviceMessageStatus = true
    },
    setServiceMessageClose (state) {
      state.serviceMessageStatus = false
      state.serviceMessageText = ''
    }
  },
  actions: {
    setServiceMessageOpen ({ commit }, text) {
      commit('setServiceMessageOpen', text)
    },
    setServiceMessageClose ({ commit }) {
      commit('setServiceMessageClose')
    }
  },
  getters: {
    getServiceMessageText: state => state.serviceMessageText,
    getServiceMessageStatus: state => state.serviceMessageStatus
  }
}
