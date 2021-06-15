export default {
  state: () => ( {
    popupOpen: false,
    popupComponent: null,
    popupDate: null, // to delete
    updateContent: 0
  }),
  mutations: {
    setPopupState (state, payload) {
      (typeof payload) !== 'boolean' ? state.popupOpen = false : state.popupOpen = payload
    },
    setPopupComponent (state, payload) {
      state.popupComponent = null
      if (typeof payload === 'object') {
        state.popupComponent = payload
        state.popupOpen = true
        state.updateContent++
      }
    },
    setPopupDate (state, payload) {
      state.popupDate = payload
    }
  },
  actions: {
    setPopupState ({ commit }, payload) {
      commit('setPopupState', payload)
    },
    setPopupComponent ({ commit }, payload) {
      commit('setPopupComponent', payload)
    },
    setPopupDate ({ commit }, payload) {
      commit('setPopupDate', payload)
    }
  },
  getters: {
    getPopupOpen: state => state.popupOpen,
    getPopupComponent: state => state.popupComponent,
    getPopupConfirm: state => state.popupConfirm,
    getPopupDate: state => state.popupDate,
    getPopupUpdate: state => state.updateContent
  }
}
