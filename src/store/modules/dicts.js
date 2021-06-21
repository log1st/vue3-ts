import {baseURL} from "@/settings/config";

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
      services: [],
      judicialStatuses: [],
      judicialSubStatuses: [],
      judicialEgrnStatuses: [],
      judicialFeeStatuses: [],
    }
  },
  getters: {
    services: getList('services'),
    servicesMap: getMap('services'),
    judicialStatuses: getList('judicialStatuses'),
    judicialStatusesMap: getMap('judicialStatuses'),
    judicialSubStatuses: getList('judicialSubStatuses'),
    judicialSubStatusesMap: getMap('judicialSubStatuses'),
    judicialEgrnStatuses: getList('judicialEgrnStatuses'),
    judicialEgrnStatusesMap: getMap('judicialEgrnStatuses'),
    judicialFeeStatuses: getList('judicialFeeStatuses'),
    judicialFeeStatusesMap: getMap('judicialFeeStatuses'),
  },
  mutations: {
    setServices: setList('services'),
    setJudicialStatuses: setList('judicialStatuses'),
    setJudicialSubStatuses: setList('judicialSubStatuses'),
    setJudicialEgrnStatuses: setList('judicialEgrnStatuses'),
    setJudicialFeeStatuses: setList('judicialFeeStatuses'),
  },
  actions: {
    async fetchDicts({commit}) {
      const {
        data: {
          statuses,
          substatuses,
        }
      } = await axios({
        method: 'get',
        url: `${baseURL}/debtor_status/consts`
      });

      commit('setJudicialStatuses', statuses.map(({value, info}) => ({
        value,
        label: info,
      })));

      commit('setJudicialSubStatuses', substatuses.map(({value, info}) => ({
        value,
        label: info,
      })));

      commit('setServices', [
        {
          value: 'electricity',
          label: 'Электроснабжение',
        },
        {
          value: 'gas',
          label: 'Газоснабжение',
        },
        {
          value: 'cold',
          label: 'Холодное в/с',
        },
        {
          value: 'fund',
          label: 'Содержание ж/ф',
        },
        {
          value: 'water',
          label: 'Водоотведение',
        },
        {
          value: 'warm',
          label: 'Отопление',
        },
        {
          value: 'hot',
          label: 'Горячее в/с',
        },
        {
          value: 'tko',
          label: 'ТКО',
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
