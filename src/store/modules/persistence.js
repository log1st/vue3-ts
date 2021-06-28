const persistenceKey = 'persistenceState';

export const persistencePlugins = [
  store => {
    store.commit('persistence/restoreState', JSON.parse(localStorage.getItem(persistenceKey) || '{}'), {root: true})

    store.watch(state => state.persistence.map, value => {
      localStorage.setItem(persistenceKey, JSON.stringify(value))
    }, {
      deep: true
    })
  }
]

export default {
  namespaced: true,
  state() {
    return {
      map: {},
    }
  },
  getters: {
    getItem: state => (key, defaultValue) => (state.map[key] || defaultValue),
  },
  mutations: {
    restoreState: (state, value) => {
      state.map = value;
    },
    setItem: (state, {key, value}) => {
      state.map = {
        ...state.map,
        [key]: value,
      };
    }
  },
  actions: {
    async setItem ({commit}, {key, value}) {
      commit('setItem', {key, value})
    }
  }
}
