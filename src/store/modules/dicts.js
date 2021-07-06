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
      pretrialStatuses: [],
      pretrialSubStatuses: [],
      judicialEgrnStatuses: [],
      judicialFeeStatuses: [],
      tenantRelationships: [],
      employeePositions: [],
      employeeRoles: [],
    }
  },
  getters: {
    employeeRoles: getList('employeeRoles'),
    employeeRolesMap: getMap('employeeRoles'),
    employeePositions: getList('employeePositions'),
    employeePositionsMap: getMap('employeePositions'),
    tenantRelationships: getList('tenantRelationships'),
    tenantRelationshipsMap: getMap('tenantRelationships'),
    services: getList('services'),
    servicesMap: getMap('services'),
    judicialStatuses: getList('judicialStatuses'),
    judicialStatusesMap: getMap('judicialStatuses'),
    judicialSubStatuses: getList('judicialSubStatuses'),
    judicialSubStatusesMap: getMap('judicialSubStatuses'),
    pretrialStatuses: getList('pretrialStatuses'),
    pretrialStatusesMap: getMap('pretrialStatuses'),
    pretrialSubStatuses: getList('pretrialSubStatuses'),
    pretrialSubStatusesMap: getMap('pretrialSubStatuses'),
    judicialEgrnStatuses: getList('judicialEgrnStatuses'),
    judicialEgrnStatusesMap: getMap('judicialEgrnStatuses'),
    judicialFeeStatuses: getList('judicialFeeStatuses'),
    judicialFeeStatusesMap: getMap('judicialFeeStatuses'),
  },
  mutations: {
    setEmployeeRoles: setList('employeeRoles'),
    setEmployeePositions: setList('employeePositions'),
    setTenantRelationships: setList('tenantRelationships'),
    setServices: setList('services'),
    setJudicialStatuses: setList('judicialStatuses'),
    setJudicialSubStatuses: setList('judicialSubStatuses'),
    setPretrialStatuses: setList('pretrialStatuses'),
    setPretrialSubStatuses: setList('pretrialSubStatuses'),
    setJudicialEgrnStatuses: setList('judicialEgrnStatuses'),
    setJudicialFeeStatuses: setList('judicialFeeStatuses'),
  },
  actions: {
    async fetchDicts({commit}) {
      const {
        data: {
          statuses,
          substatuses,
          pretrial_statuses,
          pretrial_substatuses,
        }
      } = await axios({
        method: 'get',
        url: `${baseURL}/debtor_status/consts`
      });

      try {
        const {
          data
        } = await axios({
          method: 'get',
          url: `${baseURL}/debtor/tenant/relationship/choices`
        });

        commit('setTenantRelationships', Object.entries(data).map(([value, label]) => ({
          value,
          label,
        })))
      } catch (e) {
        console.log('error', 'no relationships')
      }

      try {
        const {
          data
        } = await axios({
          method: 'get',
          url: `${baseURL}/api/account/position/`
        });

        commit('setEmployeePositions', data.map(({id: value, name: label}) => ({
          value,
          label,
        })))
      } catch (e) {
        console.log('error', 'no relationships')
      }

      commit('setEmployeeRoles', [
        {value: 'manager', label: 'Менеджер'},
        {value: 'employee', label: 'Сотрудник'},
        {value: 'guest', label: 'Гость'},
        {value: 'owner', label: 'Владелец'},
        {value: 'admin', label: 'Админ'},
      ])

      commit('setJudicialStatuses', statuses.map(({value, info}) => ({
        value,
        label: info,
      })));

      commit('setJudicialSubStatuses', substatuses.map(({value, info}) => ({
        value,
        label: info,
      })));

      commit('setPretrialStatuses', pretrial_statuses?.map(({value, info}) => ({
        value,
        label: info,
      })) || []);

      commit('setPretrialSubStatuses', pretrial_substatuses?.map(({value, info}) => ({
        value,
        label: info,
      })) || []);

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
          value: true,
          label: 'Заказана',
        },
        {
          value: false,
          label: 'Не заказана',
        },
      ]);
      commit('setJudicialFeeStatuses', [
        {
          value: true,
          label: 'Оплачена',
        },
        {
          value: false,
          label: 'Не оплачена',
        },
      ]);
    }
  }
}
