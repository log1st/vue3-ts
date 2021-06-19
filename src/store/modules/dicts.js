export const dictsPlugins = [
  store => {
    store.dispatch('dicts/fetchDicts');
  }
];

const getList = (key) => state => state[key];
const getMap = (key, valueField = 'value', displayField = 'label') => state => (
  state[key].reduce((acc, cur) => ({
    ...acc,
    [cur[valueField]]: cur[displayField],
  }), {})
);
const setList = (key) => (state, payload) => {
  state[key] = payload;
}

export default {
  namespaced: true,
  state() {
    return {
      judicialStatuses: [],
      judicialEgrnStatuses: [],
      judicialFeeStatuses: [],
    }
  },
  getters: {
    judicialStatuses: getList('judicialStatuses'),
    judicialStatusesMap: getMap('judicialStatuses'),
    judicialEgrnStatuses: getList('judicialEgrnStatuses'),
    judicialEgrnStatusesMap: getMap('judicialEgrnStatuses'),
    judicialFeeStatuses: getList('judicialFeeStatuses'),
    judicialFeeStatusesMap: getMap('judicialFeeStatuses'),
  },
  mutations: {
    setJudicialStatuses: setList('judicialStatuses'),
    setJudicialEgrnStatuses: setList('judicialEgrnStatuses'),
    setJudicialFeeStatuses: setList('judicialFeeStatuses'),
  },
  actions: {
    async fetchDicts({commit}) {
      commit('setJudicialStatuses', [
        {
          value: 'new',
          label: 'Новый',
        },
        {
          value: 'posted',
          label: 'Подано в суд',
        },
        {
          value: 'decision',
          label: 'Вынесено решение',
        },
        {
          value: 'inWork',
          label: 'В работе',
        },
      ]);
      commit('setJudicialEgrnStatuses', [
        {
          value: 'one',
          label: 'Статус 1',
        },
        {
          value: 'two',
          label: 'Статус 2',
        },
      ]);
      commit('setJudicialFeeStatuses', [
        {
          value: 'paid',
          label: 'Оплачена',
        },
        {
          value: 'not_paid',
          label: 'Не оплачена',
        },
      ]);
    }
  }
}
